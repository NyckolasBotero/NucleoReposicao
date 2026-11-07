/* =========================================================================
   Núcleo Reposição — Controle de Coletores (Lançamentos > Controle de Coletores)
   Cadastro dos coletores da Reposição: ID, nome, login, Winthor do usuário, quem usa, setor,
   último inventário, observações, termo de compromisso (gerar PDF → assinar → anexar o escaneado),
   cards-resumo e gráfico de coletores por setor mês a mês.
   Dados: abas COLETORES e COLETORES_HIST (Apps Script, lanc_coletor_*).
   Depende de lancamentos.js (LancUI) e feedbacks.js (FeedbackAdv.botoesAnexo).
   ========================================================================= */
const COLETOR_INV_DIAS = 90;    // inventário "vencido" depois de N dias (ou nunca feito)
const COLETOR_STATUS = ["Ativo", "Manutenção", "Baixado"];

Object.assign(LancUI, {
  col: { itens:null, hist:[], erro:"", q:"", setor:"", status:"", termo:"", inv:"", carregando:false },

  renderColetores(){ this.abrir("lcoletores", this._coletores); },

  _coletores(pane){
    pane.innerHTML = `<div class="panel col-head">
        ${this.cabecalho("Controle de Coletores", "Cadastre os coletores da Reposição, gere o termo de compromisso, anexe o termo assinado (foto ou PDF) e acompanhe quem usa cada equipamento, o setor e o último inventário.")}
        <div class="adm-actions" style="margin:0"><button type="button" class="btn btn-primary" id="col-novo">＋ Novo coletor</button><button type="button" class="btn btn-outline" id="col-reload">Atualizar</button></div>
      </div>
      <div id="col-cards"></div>
      <div class="panel" id="col-graf"></div>
      <div class="panel" id="col-lista"></div>`;
    document.getElementById("col-novo").addEventListener("click", ()=> this.colEditar(null));
    document.getElementById("col-reload").addEventListener("click", ()=> this.colCarregar(true));
    this.colCarregar(!this.col.itens);
    if(this.col.itens) this.colDesenhar();
  },

  async colCarregar(forcar){
    const st = this.col;
    if(st.carregando) return;
    if(!forcar && st.itens) return;
    st.carregando = true; st.erro = "";
    const box = document.getElementById("col-lista"); if(box && !st.itens) box.innerHTML = `<p class="small-muted">Carregando coletores…</p>`;
    try{
      const r = await Api.call({ acao:"lanc_coletor_listar" });
      if(r && r.ok){ st.itens = r.itens || []; st.hist = r.hist || []; st.hoje = r.hoje; } else st.erro = (r && r.erro) || "Não foi possível carregar os coletores.";
    }catch(e){ st.erro = e.message; }
    st.carregando = false;
    this.colDesenhar();
  },

  /* ---------------- números ---------------- */
  colDias(iso){ if(!iso) return null; const a = this.isoParaData(iso), b = new Date(); b.setHours(0,0,0,0); return Math.round((b - a) / 86400000); },
  colInvVencido(c){ const d = this.colDias(c.inv); return c.status !== "Baixado" && (d === null || d > COLETOR_INV_DIAS); },
  colResumo(){
    const it = this.col.itens || [], vivos = it.filter(c=>c.status !== "Baixado"), porSetor = new Map();
    vivos.forEach(c=>{ const k = c.setor || "Sem setor"; porSetor.set(k, (porSetor.get(k)||0) + 1); });
    return {
      total: vivos.length, baixados: it.length - vivos.length, manut: vivos.filter(c=>c.status === "Manutenção").length,
      atribuidos: vivos.filter(c=>c.mat).length, livres: vivos.filter(c=>!c.mat).length,
      comTermo: vivos.filter(c=>c.termo).length, semTermo: vivos.filter(c=>c.mat && !c.termo).length,
      invVencido: vivos.filter(c=>this.colInvVencido(c)).length, porSetor: Array.from(porSetor.entries()).sort((a,b)=>b[1]-a[1])
    };
  },
  /** coletores (não baixados) por setor no fim de cada um dos últimos N meses, a partir do histórico de mudanças */
  colSerie(meses){
    const st = this.col, hoje = new Date(), ev = new Map();
    (st.hist||[]).forEach(h=>{ if(!ev.has(h.id)) ev.set(h.id, []); ev.get(h.id).push(h); });
    ev.forEach(l=>l.sort((a,b)=> a.d < b.d ? -1 : a.d > b.d ? 1 : 0));
    const labels = [], fins = [];
    for(let i=meses-1;i>=0;i--){
      const ini = new Date(hoje.getFullYear(), hoje.getMonth()-i, 1);
      labels.push(["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][ini.getMonth()] + "/" + String(ini.getFullYear()).slice(2));
      fins.push(i === 0 ? this.isoDe(hoje) : this.isoDe(new Date(ini.getFullYear(), ini.getMonth()+1, 0)));
    }
    const setores = new Set(), cont = fins.map(()=>new Map());
    (st.itens||[]).forEach(c=>{
      const l = ev.get(c.id) || [{ d:"0000-00-00", setor:c.setor, status:c.status }];     // sem histórico: vale o estado atual desde sempre
      fins.forEach((fim, i)=>{
        let e = null; l.forEach(x=>{ if(x.d <= fim) e = x; });
        if(!e || e.status === "Baixado") return;
        const k = e.setor || "Sem setor"; setores.add(k); cont[i].set(k, (cont[i].get(k)||0) + 1);
      });
    });
    const nomes = Array.from(setores).sort();
    return { labels, series: nomes.map(n=>({ nome:n, v: cont.map(m=>m.get(n)||0) })), total: cont.map(m=>Array.from(m.values()).reduce((a,b)=>a+b,0)) };
  },

  /* ---------------- tela ---------------- */
  colFiltrados(){
    const st = this.col, q = normStr(st.q || "");
    return (st.itens||[]).filter(c=>
      (!q || normStr([c.id,c.nome,c.login,c.winthor,c.mat,c.colab,c.setor,c.obs].join(" ")).includes(q)) &&
      (!st.setor || c.setor === st.setor) && (!st.status || c.status === st.status) &&
      (!st.termo || (st.termo === "com" ? !!c.termo : !c.termo)) && (!st.inv || this.colInvVencido(c)));
  },
  colDesenhar(){
    const st = this.col, cards = document.getElementById("col-cards"), graf = document.getElementById("col-graf"), box = document.getElementById("col-lista");
    if(!box) return;
    if(st.erro){ box.innerHTML = `<div class="error-box">${this.h(st.erro)}</div><button class="btn btn-outline" id="col-retry">Tentar novamente</button>`; document.getElementById("col-retry").addEventListener("click", ()=> this.colCarregar(true)); return; }
    if(!st.itens){ return; }
    const R = this.colResumo();
    cards.innerHTML = `<div class="cards-grid col-cards">
        <div class="card"><div class="card-label">Total de coletores</div><div class="card-value">${R.total}</div><div class="small-muted">${R.baixados ? R.baixados + " baixado(s) fora da conta" : "em operação"}</div></div>
        <div class="card"><div class="card-label">Atribuídos</div><div class="card-value">${R.atribuidos}</div><div class="small-muted">${R.livres} sem usuário</div></div>
        <div class="card ${R.semTermo?'neg':''}"><div class="card-label">Sem termo assinado</div><div class="card-value ${R.semTermo?'neg':''}">${R.semTermo}</div><div class="small-muted">${R.comTermo} com termo</div></div>
        <div class="card ${R.invVencido?'warn':''}"><div class="card-label">Inventário vencido</div><div class="card-value">${R.invVencido}</div><div class="small-muted">mais de ${COLETOR_INV_DIAS} dias ou nunca</div></div>
        <div class="card"><div class="card-label">Em manutenção</div><div class="card-value">${R.manut}</div></div>
      </div>
      <div class="col-chips">${R.porSetor.map(([s,n])=>`<span class="col-chip"><strong>${n}</strong> ${this.h(s)}</span>`).join("") || '<span class="small-muted">Nenhum coletor cadastrado ainda.</span>'}</div>`;
    graf.innerHTML = `<div class="panel-header"><h3>Coletores por setor — mês a mês</h3><span class="panel-note">Posição no fim de cada mês, pelo histórico de setor e atribuição (coletores baixados saem da conta)</span></div><div class="chart-wrap"><canvas id="chart-coletores"></canvas></div>`;
    const S = this.colSerie(12), cores = ["#2f6fce","#e08a1f","#1a9c62","#9c6ade","#d64545","#2aa6b8","#8a8f98","#c2a000"];
    if(typeof Charts !== "undefined" && S.series.length){
      Charts.make("chart-coletores", { type:"line", data:{ labels:S.labels, datasets: S.series.map((x,i)=>({ label:x.nome, data:x.v, borderColor:cores[i%cores.length], backgroundColor:cores[i%cores.length], tension:.25, pointRadius:4, borderWidth:2.5 }))
        .concat([{ label:"Total", data:S.total, borderColor:"#0f2a4a", backgroundColor:"#0f2a4a", borderDash:[6,4], tension:.25, pointRadius:3, borderWidth:2 }]) },
        options: Charts.baseOptions({ scales:{ y:{ beginAtZero:true, ticks:{ precision:0 } } } }) });
    }
    const setores = Array.from(new Set((this.ctx.listas.SETOR_COLETOR||[]).concat((st.itens||[]).map(c=>c.setor).filter(Boolean))));
    const lista = this.colFiltrados();
    const sel = (id, atual, ops)=> `<select id="${id}">${ops.map(([v,t])=>`<option value="${this.h(v)}" ${v===atual?"selected":""}>${this.h(t)}</option>`).join("")}</select>`;
    box.innerHTML = `<div class="adm-head"><h2 class="adm-h">Coletores <span class="small-muted">(${lista.length} de ${st.itens.length})</span></h2>
        <div class="adm-head-r col-filtros">
          <input type="search" id="col-q" placeholder="Buscar ID, nome, login, usuário…" value="${this.h(st.q)}" autocomplete="off">
          ${sel("col-fs", st.setor, [["","Todos os setores"]].concat(setores.map(s=>[s,s])))}
          ${sel("col-fst", st.status, [["","Todos os status"]].concat(COLETOR_STATUS.map(s=>[s,s])))}
          ${sel("col-ft", st.termo, [["","Termo: todos"],["com","Com termo"],["sem","Sem termo"]])}
          ${sel("col-fi", st.inv, [["","Inventário: todos"],["1","Vencido"]])}
        </div></div>
      <div class="table-wrap"><table class="data-table col-table">
        <thead><tr><th>ID</th><th>Coletor</th><th>Login coletor</th><th>Login Winthor</th><th>Atribuído a</th><th>Setor</th><th>Últ. inventário</th><th>Termo</th><th>Observações</th><th></th></tr></thead>
        <tbody>${lista.map(c=>this.colLinha(c)).join("") || `<tr><td colspan="10" class="small-muted">Nenhum coletor encontrado.</td></tr>`}</tbody></table></div>`;
    const re = ()=>{ st.q = document.getElementById("col-q").value; this.colDesenharLista(); };
    document.getElementById("col-q").addEventListener("input", re);
    [["col-fs","setor"],["col-fst","status"],["col-ft","termo"],["col-fi","inv"]].forEach(([id,k])=> document.getElementById(id).addEventListener("change", e=>{ st[k] = e.target.value; this.colDesenharLista(); }));
    this.colLigarLinhas(box);
  },
  /** refiltra só a tabela (mantém o foco na busca) */
  colDesenharLista(){
    const st = this.col, box = document.getElementById("col-lista"); if(!box || !st.itens) return;
    const lista = this.colFiltrados(), tb = box.querySelector("tbody"), ttl = box.querySelector(".adm-h .small-muted");
    tb.innerHTML = lista.map(c=>this.colLinha(c)).join("") || `<tr><td colspan="10" class="small-muted">Nenhum coletor encontrado.</td></tr>`;
    if(ttl) ttl.textContent = `(${lista.length} de ${st.itens.length})`;
    this.colLigarLinhas(box);
  },
  colLinha(c){
    const dias = this.colDias(c.inv), venc = this.colInvVencido(c);
    const termo = c.termo ? `<span class="adm-tag acc">✔ assinado</span> ${typeof FeedbackAdv !== "undefined" ? FeedbackAdv.botoesAnexo(c.termo, "Termo de compromisso — coletor "+c.id+(c.colab?" — "+c.colab:"")) : ""}`
      : (c.mat ? `<span class="adm-tag rep">⚠ sem termo</span>` : `<span class="small-muted">—</span>`);
    const status = c.status !== "Ativo" ? ` <span class="adm-tag ${c.status==="Baixado"?"err":"rep"}">${this.h(c.status)}</span>` : "";
    return `<tr class="${c.status==="Baixado"?"col-baixado":""}">
      <td><strong>${this.h(c.id)}</strong>${status}</td><td>${this.h(c.nome||"—")}</td><td>${this.h(c.login||"—")}</td><td>${this.h(c.winthor||"—")}</td>
      <td>${c.mat ? `<strong>${this.h(c.colab||"")}</strong> <span class="small-muted">${this.h(c.mat)}</span>` : '<span class="small-muted">sem usuário</span>'}</td>
      <td>${this.h(c.setor||"—")}</td>
      <td class="${venc?'cell-neg':''}">${c.inv ? this.br(c.inv) + ` <span class="small-muted">(${dias}d)</span>` : '<span class="small-muted">nunca</span>'}</td>
      <td style="white-space:nowrap">${termo}</td>
      <td class="col-obs">${this.h(c.obs||"")}</td>
      <td class="col-act"><button type="button" class="btn btn-outline btn-sm" data-col-ed="${c.linha}">✏️ Editar</button>
        <button type="button" class="btn btn-outline btn-sm" data-col-pdf="${c.linha}" title="Gerar o termo de compromisso em PDF">📄 Termo</button>
        <button type="button" class="btn ${c.termo?'btn-outline':'btn-primary'} btn-sm" data-col-ax="${c.linha}" title="Anexar o termo assinado (foto ou PDF)">📎 ${c.termo?"Trocar":"Anexar"}</button></td></tr>`;
  },
  colLigarLinhas(box){
    const por = (l)=> (this.col.itens||[]).find(x=>x.linha === Number(l));
    box.querySelectorAll("[data-col-ed]").forEach(b=> b.addEventListener("click", ()=> this.colEditar(por(b.dataset.colEd))));
    box.querySelectorAll("[data-col-pdf]").forEach(b=> b.addEventListener("click", ()=> this.colGerarTermo(por(b.dataset.colPdf))));
    box.querySelectorAll("[data-col-ax]").forEach(b=> b.addEventListener("click", ()=> this.colAnexar(por(b.dataset.colAx))));
  },

  /* ---------------- cadastro / edição ---------------- */
  colEditar(c){
    const novo = !c; c = c || { id:"", nome:"", login:"", senhaCol:"", winthor:"", senhaWin:"", mat:"", colab:"", setor:"", inv:"", obs:"", status:"Ativo", dtAtrib:"" };
    const setores = Array.from(new Set((this.ctx.listas.SETOR_COLETOR||[]).concat(c.setor ? [c.setor] : [])));
    const ta = `padding:9px 10px;border:1.5px solid var(--gray-200);border-radius:8px;font-size:14px;font-family:inherit;text-transform:none;letter-spacing:0;font-weight:500;`;
    UI.openModal(`<div id="col-modal"><h3 style="margin-top:0">${novo ? "Novo coletor" : "Editar coletor " + this.h(c.id)}</h3>
      <div class="cx-sec">Equipamento</div>
      <div class="cx-g">
        <label>ID do coletor<input type="text" id="cx-id" value="${this.h(c.id)}" placeholder="Ex.: 7Q6220300198" autocomplete="off"></label>
        <label>Nome do coletor<input type="text" id="cx-nome" value="${this.h(c.nome)}" placeholder="Ex.: STA-Col15" autocomplete="off"></label>
        <label>Setor<select id="cx-setor" data-vazio="Selecione">${this.options(setores, c.setor, "Selecione")}</select></label>
        <label>Status<select id="cx-status">${COLETOR_STATUS.map(s=>`<option ${s===c.status?"selected":""}>${s}</option>`).join("")}</select></label>
        <div class="cx-full">${this.novoItem("SETOR_COLETOR", "cx-setor", "novo setor")}</div>
      </div>
      <div class="cx-sec">Acesso ao coletor</div>
      <div class="cx-g">
        <label>Login do coletor<input type="text" id="cx-login" value="${this.h(c.login)}" placeholder="Ex.: Col15" autocomplete="off"></label>
        <label>Senha do coletor<input type="text" id="cx-senhacol" value="${this.h(c.senhaCol)}" placeholder="Ex.: User@15" autocomplete="off"></label>
      </div>
      <div class="cx-sec">Quem usa</div>
      <div class="cx-g">
        <label>Matrícula de quem usa<input type="text" id="cx-mat" inputmode="numeric" list="dl-cx" value="${this.h(c.mat)}" placeholder="Ex.: 10003928 (vazio = sem usuário)" autocomplete="off"></label>
        <label>Nome (automático)<input type="text" id="cx-colab" readonly value="${this.h(c.colab)}" placeholder="—"></label>
        <label>Login Winthor<input type="text" id="cx-winthor" value="${this.h(c.winthor)}" placeholder="Ex.: 10003928" autocomplete="off"></label>
        <label>Senha Winthor<input type="text" id="cx-senhawin" value="${this.h(c.senhaWin)}" placeholder="Ex.: 1" autocomplete="off"></label>
      </div>
      ${this.datalistPessoas("dl-cx", false)}
      <div class="cx-sec">Inventário e observações</div>
      <div class="cx-g">
        <label class="cx-full">Último inventário<span class="cx-data"><input type="date" id="cx-inv" value="${this.h(c.inv)}"><button type="button" class="btn btn-outline" id="cx-inv-hoje">Hoje</button></span></label>
        <label class="cx-full">Observações<textarea id="cx-obs" rows="3" style="${ta}">${this.h(c.obs)}</textarea></label>
      </div>
      <div id="cx-msg"></div>
      <div class="adm-actions"><button class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button><button class="btn btn-primary" id="cx-salvar">${novo ? "Cadastrar" : "Salvar alterações"}</button></div></div>`);
    const $$ = (id)=> document.getElementById(id);
    this.ligarNovoItem($$("col-modal"));
    $$("cx-inv-hoje").addEventListener("click", ()=>{ $$("cx-inv").value = this.hojeISO(); });
    $$("cx-mat").addEventListener("input", ()=>{ const m = this.soDigitos($$("cx-mat").value); $$("cx-colab").value = this.nomeDe(m) || ""; $$("cx-colab").placeholder = m ? "matrícula não encontrada" : "—"; });
    $$("cx-salvar").addEventListener("click", async ()=>{
      const id = $$("cx-id").value.trim(), setor = $$("cx-setor").value, mat = this.soDigitos($$("cx-mat").value);
      if(!id) return this.aviso("cx-msg", "erro", "Informe o ID do coletor.");
      if(!setor) return this.aviso("cx-msg", "erro", "Escolha o setor.");
      if(mat && !this.nomeDe(mat)) return this.aviso("cx-msg", "erro", "Matrícula não encontrada no quadro.");
      const r = await this.enviar($$("cx-salvar"), { acao:"lanc_coletor_salvar", linha: novo ? 0 : c.linha, idOriginal:c.id, id, nome:$$("cx-nome").value, login:$$("cx-login").value, senhaCol:$$("cx-senhacol").value,
        winthor:$$("cx-winthor").value, senhaWin:$$("cx-senhawin").value, mat, colab:$$("cx-colab").value, setor, status:$$("cx-status").value, inv:$$("cx-inv").value, obs:$$("cx-obs").value, dtAtrib: mat !== c.mat ? this.hojeISO() : c.dtAtrib });
      if(!r || !r.ok) return this.aviso("cx-msg", "erro", this.h((r && r.erro) || "Não foi possível salvar."));
      UI.closeModal(); toast(novo ? "Coletor cadastrado." : "Coletor atualizado."); this.colCarregar(true);
    });
  },

  /* ---------------- termo de compromisso (PDF) ---------------- */
  colGerarTermo(c){
    if(!c) return;
    if(!c.mat){ toast("Atribua o coletor a um colaborador (matrícula) antes de gerar o termo.", "error"); return this.colEditar(c); }
    if(typeof window.jspdf === "undefined"){ toast("A biblioteca de PDF ainda não carregou. Aguarde um instante e tente de novo.", "error"); return; }
    const { jsPDF } = window.jspdf, pdf = new jsPDF({ unit:"mm", format:"a4" }), W = 210, M = 20, larg = W - 2*M;
    let y = 16;
    try{ if(typeof LOGO_BASE64 !== "undefined") pdf.addImage("data:image/png;base64," + LOGO_BASE64, "PNG", M, y, 36, 15); }catch(e){}
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(14); pdf.setTextColor(15, 42, 74);
    pdf.text("TERMO DE COMPROMISSO E RESPONSABILIDADE", W - M, y + 6, { align:"right" });
    pdf.setFontSize(10.5); pdf.setFont("helvetica", "normal");
    pdf.text("Uso de coletor de dados — Reposição", W - M, y + 12, { align:"right" });
    y += 26; pdf.setDrawColor(15, 42, 74); pdf.setLineWidth(.5); pdf.line(M, y, W - M, y); y += 8;
    pdf.setTextColor(30, 30, 30);
    const campo = (rot, val, x, w)=>{ pdf.setFont("helvetica", "bold"); pdf.setFontSize(8.5); pdf.setTextColor(110, 120, 135); pdf.text(rot.toUpperCase(), x, y);
      pdf.setFont("helvetica", "normal"); pdf.setFontSize(11); pdf.setTextColor(20, 20, 20); pdf.text(pdf.splitTextToSize(String(val || "—"), w)[0], x, y + 5.5); };
    const sec = (t)=>{ pdf.setFont("helvetica", "bold"); pdf.setFontSize(11); pdf.setTextColor(15, 42, 74); pdf.text(t, M, y); y += 7; };
    sec("Colaborador");
    campo("Nome", c.colab, M, larg*0.6); campo("Matrícula", c.mat, M + larg*0.62, larg*0.38); y += 12;
    campo("Setor", c.setor, M, larg*0.6); campo("Login Winthor", c.winthor, M + larg*0.62, larg*0.38); y += 15;
    sec("Equipamento");
    campo("ID do coletor", c.id, M, larg*0.3); campo("Nome do coletor", c.nome, M + larg*0.32, larg*0.38); campo("Login do coletor", c.login, M + larg*0.72, larg*0.28); y += 15;
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(10.5); pdf.setTextColor(30, 30, 30);
    const intro = pdf.splitTextToSize("Declaro que recebi o equipamento acima identificado, em perfeitas condições de uso e funcionamento, e me comprometo a:", larg);
    pdf.text(intro, M, y); y += intro.length * 5 + 3;
    const itens = [
      "Utilizá-lo exclusivamente para as atividades da minha função na empresa;",
      "Zelar pela conservação e guarda do equipamento, evitando quedas, umidade, calor excessivo e qualquer mau uso, mantendo-o carregado e com sua proteção;",
      "Não emprestar, trocar ou deixar o equipamento com outra pessoa, nem compartilhar meu login e senha;",
      "Não instalar aplicativos, alterar configurações nem abrir o equipamento;",
      "Comunicar imediatamente ao meu líder qualquer dano, defeito, perda ou furto;",
      "Devolvê-lo quando solicitado, ao mudar de função ou setor ou no meu desligamento, nas mesmas condições em que o recebi, ressalvado o desgaste natural;",
      "Estar ciente de que o equipamento é patrimônio da empresa e de que seu uso inadequado, dano ou extravio poderá ser apurado conforme as normas internas da empresa e a legislação vigente."
    ];
    itens.forEach((t, i)=>{ const l = pdf.splitTextToSize(`${i+1}. ${t}`, larg - 4); pdf.text(l, M + 2, y); y += l.length * 5 + 2; });
    y += 8;
    const dt = new Date(), meses = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
    pdf.text(`____________________________, ${dt.getDate()} de ${meses[dt.getMonth()]} de ${dt.getFullYear()}.`, M, y); y += 28;
    pdf.setDrawColor(40, 40, 40); pdf.setLineWidth(.3);
    pdf.line(M, y, M + 78, y); pdf.line(W - M - 78, y, W - M, y); y += 5;
    pdf.setFontSize(9.5); pdf.text(c.colab || "Colaborador", M, y); pdf.text("Líder / Responsável pela entrega", W - M - 78, y); y += 4.5;
    pdf.setFontSize(8.5); pdf.setTextColor(110, 120, 135); pdf.text(`Matrícula ${c.mat}`, M, y); pdf.text("Assinatura e carimbo", W - M - 78, y);
    pdf.setFontSize(8); pdf.text(`Documento gerado pelo Núcleo Reposição em ${dt.toLocaleDateString("pt-BR")} · coletor ${c.id}`, M, 287);
    pdf.save(`Termo_Coletor_${String(c.id).replace(/[^\w-]+/g, "_")}_${c.mat}.pdf`);
    toast("Termo gerado. Imprima, colha as assinaturas e use 📎 Anexar para guardar o escaneado.");
  },

  /* ---------------- termo assinado (anexar) ---------------- */
  colAnexar(c){
    if(!c) return;
    UI.openModal(`<h3 style="margin-top:0">Termo assinado — coletor ${this.h(c.id)}</h3>
      <p class="small-muted" style="margin-top:0">${c.colab ? "Colaborador: <strong>" + this.h(c.colab) + "</strong> (" + this.h(c.mat) + ")" : "Este coletor ainda não tem usuário atribuído."}</p>
      ${this.anexoHtml("ct", "Foto ou PDF do termo assinado")}
      <div class="adm-form" style="margin-top:10px"><label>Data da assinatura<input type="date" id="ct-data" value="${this.hojeISO()}"></label></div>
      <div id="ct-msg"></div>
      <div class="adm-actions">${c.termo ? `<button class="btn btn-outline" id="ct-rm">Remover termo atual</button>` : ""}<button class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button><button class="btn btn-primary" id="ct-salvar">Salvar termo</button></div>`);
    const $$ = (id)=> document.getElementById(id);
    this.ligarAnexo("ct");
    $$("ct-salvar").addEventListener("click", async ()=>{
      const a = this.anexos.ct; if(!a) return this.aviso("ct-msg", "erro", "Tire a foto ou escolha o arquivo do termo assinado.");
      const r = await this.enviar($$("ct-salvar"), { acao:"lanc_coletor_termo", linha:c.linha, idOriginal:c.id, dataTermo:$$("ct-data").value, anexo:{ nome:a.nome, mime:a.mime, base64:a.base64 } });
      if(!r || !r.ok) return this.aviso("ct-msg", "erro", this.h((r && r.erro) || "Não foi possível salvar."));
      UI.closeModal(); toast("Termo assinado guardado."); this.colCarregar(true);
    });
    const rm = $$("ct-rm");
    if(rm) rm.addEventListener("click", async ()=>{
      if(!confirm("Remover o termo anexado deste coletor?")) return;
      const r = await this.enviar(rm, { acao:"lanc_coletor_termo", linha:c.linha, idOriginal:c.id, remover:true });
      if(!r || !r.ok) return this.aviso("ct-msg", "erro", this.h((r && r.erro) || "Não foi possível remover."));
      UI.closeModal(); toast("Termo removido."); this.colCarregar(true);
    });
  }
});

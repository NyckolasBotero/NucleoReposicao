/* =========================================================================
   Núcleo Reposição — Administração (Bases, Acessos, Links de acesso)
   Depende de app.js (Auth, Api, UI, OnlineSheets, ImportLog, escapeHtml, toast...)
   ========================================================================= */

/* Planilhas conectadas ao painel (aparecem em Administração > Links de acesso) */
const PLANILHAS_CONECTADAS = [
  {
    id: "dados",
    nome: "Dados do painel (Bases)",
    uso: "Todas as abas lidas pelo painel: 8460, 8022, 1707, Quadro, Feedback etc.",
    sheetId: "1KCLXuzpf6j4yvd6e5ALcthyW483TOMk5rzJ7XJaLmhQ",
    abas: true
  },
  {
    id: "perm",
    nome: "Logins e Permissões",
    uso: "Quem entra e quais abas e sub abas cada matrícula enxerga (lida só pelo servidor — não precisa ser pública).",
    sheetId: "1_BamBhG9JaLcwCJumEB7oQg-kKLWGGwcP56xzbcGsW8",
    abaNome: "Logins e Permissões",
    privada: true
  },
  {
    id: "aud",
    nome: "Auditoria de Ruas (aplicativo STA)",
    uso: "Auditoria produto a produto usada em Gestão > Auditoria.",
    sheetId: "1Srs2JdL1WEGsaa-SaLec2TaYQYX_eUmNsU2zE1M4CAA"
  }
];

const AdminUI = {
  /* ------------------------------------------------------------------ */
  /* utilitários                                                         */
  /* ------------------------------------------------------------------ */
  urlPlanilha(id){ return `https://docs.google.com/spreadsheets/d/${id}/edit`; },

  semServidor(){
    return `<div class="warn-box">O servidor de acessos (Apps Script) ainda não foi configurado no site. Implante o arquivo
      <strong>apps_script_nucleo.gs</strong> e informe a URL em <code>NUCLEO_API_URL</code> (app.js). Enquanto isso o site funciona com a senha única.</div>`;
  },

  fmtNum(n){ return (Number(n)||0).toLocaleString("pt-BR"); },

  // ---- conversão de células do Excel para o formato aceito pelo servidor ----
  pad(n){ return String(n).padStart(2,"0"); },
  dataTexto(d){
    const p = this.pad;
    const base = `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()}`;
    const h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
    return (h||m||s) ? `${base} ${p(h)}:${p(m)}:${p(s)}` : base;
  },
  celula(v){
    if(v===null || v===undefined) return "";
    if(v instanceof Date) return isNaN(v.getTime()) ? "" : this.dataTexto(v);
    if(typeof v === "string") return v.trim();
    if(typeof v === "boolean") return v ? "VERDADEIRO" : "FALSO";
    return v;
  },

  /* ================================================================== */
  /* BASES                                                               */
  /* ================================================================== */
  basesState: { lista:null, erro:null, carregando:false, arq:null, enviando:false },

  async renderBases(force){
    const pane = document.getElementById("pane-bases");
    if(!pane) return;
    if(!Api.configured()){ pane.innerHTML = `<div class="panel"><h2 class="adm-h">Bases</h2>${this.semServidor()}</div>`; return; }
    const st = this.basesState;
    if(force || (!st.lista && !st.carregando)){
      st.carregando = true; st.erro = null;
      pane.innerHTML = `<div class="panel"><h2 class="adm-h">Bases</h2><p class="small-muted">Carregando situação das bases...</p></div>`;
      try{
        const r = await Api.call({ acao:"bases_status" });
        if(r && r.ok) st.lista = r.bases; else st.erro = (r && r.erro) || "Falha ao consultar as bases.";
      }catch(e){ st.erro = e.message; }
      st.carregando = false;
    }
    this.desenharBases();
  },

  // data mais recente que o painel enxerga hoje (a partir dos dados já carregados do Sheets)
  dataMaisRecente(base){
    try{
      const raw = window.APP_STATE && window.APP_STATE.raw;
      const rows = raw && raw[base];
      if(!rows || !rows.length) return null;
      return ImportLog.detectMaxDate(rows);
    }catch(e){ return null; }
  },

  desenharBases(){
    const pane = document.getElementById("pane-bases"), st = this.basesState;
    if(!pane) return;
    if(st.erro){
      pane.innerHTML = `<div class="panel"><h2 class="adm-h">Bases</h2><div class="error-box">${escapeHtml(st.erro)}</div>
        <button class="btn btn-outline" id="bases-retry">Tentar novamente</button></div>`;
      document.getElementById("bases-retry").addEventListener("click", ()=> this.renderBases(true));
      return;
    }
    const lista = st.lista || [];
    const modoTxt = (m)=> m==="acumular" ? `<span class="adm-tag acc">Acumula sem duplicar</span>` : `<span class="adm-tag rep">Substitui tudo</span>`;
    pane.innerHTML = `
      <div class="panel">
        <div class="adm-head">
          <h2 class="adm-h">Bases</h2>
          <button class="btn btn-outline btn-sm" id="bases-refresh">🔄 Atualizar situação</button>
        </div>
        <p class="small-muted">Carregue aqui os arquivos exportados (8460, 8022, 1707 GERAL etc.). Antes de gravar, o sistema confere o que já existe na base para não duplicar.
          <strong>Acumula sem duplicar</strong>: entram só as linhas que ainda não existem. <strong>Substitui tudo</strong>: o arquivo novo troca o conteúdo da base (foto do momento).</p>
        <div class="table-wrap"><table class="adm-table">
          <thead><tr><th>Base</th><th>Como grava</th><th>Linhas na base</th><th>Data mais recente nos dados</th><th>Último carregamento</th><th></th></tr></thead>
          <tbody>${lista.map((b,i)=>{
            const u = b.ultimaCarga, dr = this.dataMaisRecente(b.base);
            return `<tr>
              <td><strong>${escapeHtml(b.base)}</strong><div class="small-muted">${escapeHtml(b.desc||"")}</div></td>
              <td>${modoTxt(b.modo)}</td>
              <td>${b.existe ? this.fmtNum(b.linhasAtuais) : `<span class="small-muted">aba não criada</span>`}</td>
              <td>${dr ? fmtDateBR(dr) : "—"}</td>
              <td>${u ? `<strong>${escapeHtml(u.quando)}</strong><div class="small-muted">${escapeHtml(u.usuario||"")} · ${escapeHtml(u.arquivo||"")}<br>${this.fmtNum(u.novas)} novas${b.modo==="acumular"?` · ${this.fmtNum(u.duplicadas)} já existiam`:""}</div>` : `<span class="small-muted">nenhum registro</span>`}</td>
              <td><button class="btn btn-primary btn-sm" data-base="${i}">📂 Carregar</button></td>
            </tr>`; }).join("")}</tbody>
        </table></div>
      </div>
      <input type="file" id="bases-file" accept=".xlsx,.xls,.csv" style="display:none">
      <div id="bases-envio"></div>`;
    document.getElementById("bases-refresh").addEventListener("click", ()=> this.renderBases(true));
    const input = document.getElementById("bases-file");
    pane.querySelectorAll("[data-base]").forEach(b=> b.addEventListener("click", ()=>{
      st.baseSel = lista[Number(b.dataset.base)];
      input.value = ""; input.click();
    }));
    input.addEventListener("change", ()=>{ if(input.files[0]) this.lerArquivo(input.files[0]); });
    if(st.arq) this.desenharPreview();
  },

  // ---- lê o arquivo escolhido e mostra o resumo antes de enviar ----
  async lerArquivo(file){
    const st = this.basesState, base = st.baseSel, box = document.getElementById("bases-envio");
    if(!base || !box) return;
    box.innerHTML = `<div class="panel"><p class="small-muted">Lendo ${escapeHtml(file.name)}...</p></div>`;
    try{
      if(typeof XLSX === "undefined") throw new Error("A biblioteca de leitura de Excel (SheetJS) não carregou. Recarregue a página.");
      const wb = XLSX.read(await file.arrayBuffer(), { type:"array", cellDates:true });
      if(!wb.SheetNames.length) throw new Error("O arquivo não tem nenhuma aba.");
      const alvo = normStr(base.base);
      const nomeAba = wb.SheetNames.find(n=>normStr(n)===alvo) || wb.SheetNames[0];
      let aoa = XLSX.utils.sheet_to_json(wb.Sheets[nomeAba], { header:1, raw:true, defval:null, blankrows:false });
      aoa = aoa.filter(l=>l && l.some(v=>v!==null && v!==undefined && String(v).trim()!==""));
      if(!aoa.length) throw new Error("A aba \""+nomeAba+"\" está vazia.");

      let cab = null, dados;
      if(base.semCabecalho){ dados = aoa; }
      else { cab = aoa[0].map(v=>String(v==null?"":v).trim()); dados = aoa.slice(1); }
      if(!dados.length) throw new Error("O arquivo só tem a linha de títulos, sem dados.");

      // confere as colunas que o painel exige para esta base
      const aviso = [];
      if(cab){
        const exigidas = (typeof REQUIRED_COLUMNS!=="undefined" && REQUIRED_COLUMNS[base.base]) || [];
        const faltam = exigidas.filter(c=>!cab.map(normStr).includes(normStr(c)));
        if(faltam.length) throw new Error("Este arquivo não parece ser a base "+base.base+": faltam as colunas "+faltam.join(", ")+".");
        if(cab.some(c=>!c)) aviso.push("Há colunas sem título; elas serão enviadas em branco.");
      }
      const largura = cab ? cab.length : Math.max.apply(null, dados.map(l=>l.length));
      const linhas = dados.map(l=>{ const o = new Array(largura); for(let i=0;i<largura;i++) o[i] = this.celula(l[i]); return o; });

      // data mais recente no arquivo (colunas DATA / DT...)
      let maxD = null;
      if(cab){
        const idx = cab.map((c,i)=>/DATA/i.test(c)||/^DT/i.test(c)?i:-1).filter(i=>i>=0);
        dados.forEach(l=> idx.forEach(i=>{ const d = l[i] instanceof Date ? l[i] : null; if(d && !isNaN(d) && d.getFullYear()>1901 && (!maxD || d>maxD)) maxD = d; }));
      }
      st.arq = { nome:file.name, aba:nomeAba, base, cab, linhas, maxD, aviso, sim:null };
      this.desenharPreview();
    }catch(e){
      st.arq = null;
      box.innerHTML = `<div class="panel"><div class="error-box">${escapeHtml(e.message||String(e))}</div></div>`;
    }
  },

  desenharPreview(){
    const st = this.basesState, a = st.arq, box = document.getElementById("bases-envio");
    if(!a || !box) return;
    const atual = this.dataMaisRecente(a.base.base);
    const velho = a.maxD && atual && a.base.modo==="acumular" && dateOnly(a.maxD) < dateOnly(atual);
    box.innerHTML = `
      <div class="panel">
        <h3 class="adm-h2">Conferir antes de enviar — ${escapeHtml(a.base.base)}</h3>
        <div class="adm-grid">
          <div><span class="small-muted">Arquivo</span><br><strong>${escapeHtml(a.nome)}</strong><br><span class="small-muted">aba lida: ${escapeHtml(a.aba)}</span></div>
          <div><span class="small-muted">Linhas no arquivo</span><br><strong>${this.fmtNum(a.linhas.length)}</strong></div>
          <div><span class="small-muted">Data mais recente no arquivo</span><br><strong>${a.maxD ? fmtDateBR(a.maxD) : "—"}</strong></div>
          <div><span class="small-muted">Data mais recente hoje na base</span><br><strong>${atual ? fmtDateBR(atual) : "—"}</strong></div>
        </div>
        ${velho ? `<div class="warn-box" style="margin-top:12px;">A data mais recente do arquivo (${fmtDateBR(a.maxD)}) é anterior à que já está na base (${fmtDateBR(atual)}). Provavelmente é um arquivo antigo.</div>` : ""}
        ${a.aviso.map(t=>`<div class="hint-box" style="margin-top:10px;">${escapeHtml(t)}</div>`).join("")}
        <div id="bases-sim" style="margin-top:14px;">${a.sim ? this.htmlSimulacao(a) : `<span class="small-muted">Clique em <strong>Verificar duplicidade</strong> para ver quantas linhas são novas antes de gravar.</span>`}</div>
        <div class="adm-actions">
          <button class="btn btn-outline" id="bases-cancel" ${st.enviando?"disabled":""}>Cancelar</button>
          <button class="btn btn-outline" id="bases-sim-btn" ${st.enviando?"disabled":""}>🔎 Verificar duplicidade</button>
          <button class="btn btn-primary" id="bases-go" ${(!a.sim||st.enviando)?"disabled":""} title="${a.sim?"":"Faça a verificação primeiro"}">✅ Gravar na base</button>
        </div>
        <div id="bases-prog"></div>
      </div>`;
    document.getElementById("bases-cancel").addEventListener("click", ()=>{ st.arq = null; box.innerHTML = ""; });
    document.getElementById("bases-sim-btn").addEventListener("click", ()=> this.enviar(true));
    document.getElementById("bases-go").addEventListener("click", ()=> this.enviar(false));
  },

  htmlSimulacao(a){
    const s = a.sim;
    if(a.base.modo==="substituir"){
      return `<div class="hint-box"><strong>Substituição:</strong> a base hoje tem ${this.fmtNum(s.substituira)} linhas e passará a ter ${this.fmtNum(s.novas)} (as atuais serão apagadas).</div>`;
    }
    return `<div class="${s.novas?"hint-box":"warn-box"}"><strong>${this.fmtNum(s.novas)}</strong> linha(s) nova(s) serão gravadas · <strong>${this.fmtNum(s.duplicadas)}</strong> já existem na base e serão ignoradas.${s.novas?"":" Nada novo para gravar."}</div>`;
  },

  // envia em partes (simulação ou gravação)
  async enviar(simular){
    const st = this.basesState, a = st.arq;
    if(!a || st.enviando) return;
    if(!simular && !confirm(a.base.modo==="substituir"
      ? `Substituir TODO o conteúdo da base ${a.base.base} pelas ${a.linhas.length.toLocaleString("pt-BR")} linhas do arquivo?`
      : `Gravar as linhas novas na base ${a.base.base}?`)) return;
    st.enviando = true;
    this.desenharPreview();
    const prog = document.getElementById("bases-prog");
    const TAM = 4000, partes = Math.max(1, Math.ceil(a.linhas.length/TAM));
    const tot = { recebidas:0, novas:0, duplicadas:0, substituira:0 };
    try{
      for(let p=1; p<=partes; p++){
        prog.innerHTML = `<div class="adm-prog"><div style="width:${Math.round((p-1)/partes*100)}%"></div></div><span class="small-muted">${simular?"Verificando":"Enviando"} parte ${p} de ${partes}...</span>`;
        const r = await Api.call({ acao:"bases_enviar", base:a.base.base, simular, parte:p, partes, cabecalho:a.cab, linhas:a.linhas.slice((p-1)*TAM, p*TAM) });
        if(!r || !r.ok) throw new Error((r && r.erro) || "O servidor recusou o envio.");
        tot.recebidas += r.recebidas||0; tot.novas += r.novas||0; tot.duplicadas += r.duplicadas||0; tot.substituira = r.substituira||tot.substituira;
      }
      if(simular){
        a.sim = tot;
        st.enviando = false;
        this.desenharPreview();
        return;
      }
      await Api.call({ acao:"bases_concluir", base:a.base.base, arquivo:a.nome, enviadas:tot.recebidas, novas:tot.novas, duplicadas:tot.duplicadas });
      st.enviando = false; st.arq = null; st.lista = null;
      toast(`Base ${a.base.base}: ${tot.novas.toLocaleString("pt-BR")} linhas gravadas.`, "success");
      await this.renderBases(true);
      const box = document.getElementById("bases-envio");
      if(box) box.innerHTML = `<div class="panel"><div class="hint-box">✅ Base <strong>${escapeHtml(a.base.base)}</strong> atualizada: ${this.fmtNum(tot.novas)} gravadas${a.base.modo==="acumular"?`, ${this.fmtNum(tot.duplicadas)} já existiam`:""}.
        <button class="btn btn-primary btn-sm" id="bases-reload" style="margin-left:10px;">🔄 Atualizar o painel agora</button></div></div>`;
      const rb = document.getElementById("bases-reload");
      if(rb) rb.addEventListener("click", ()=> UI.carregarOnline());
    }catch(e){
      st.enviando = false;
      this.desenharPreview();
      const pr = document.getElementById("bases-prog");
      if(pr) pr.innerHTML = `<div class="error-box" style="margin-top:12px;">${escapeHtml(e.message||String(e))}${simular?"":"<br>Se parte do arquivo já foi gravada, faça a verificação de duplicidade de novo antes de reenviar."}</div>`;
    }
  },

  /* ================================================================== */
  /* ACESSOS                                                             */
  /* ================================================================== */
  acState: { lista:null, erro:null, carregando:false, filtro:"" },

  async renderAcessos(force){
    const pane = document.getElementById("pane-acessos");
    if(!pane) return;
    if(!Api.configured()){ pane.innerHTML = `<div class="panel"><h2 class="adm-h">Acessos</h2>${this.semServidor()}</div>`; return; }
    const st = this.acState;
    if(force || (!st.lista && !st.carregando)){
      st.carregando = true; st.erro = null;
      pane.innerHTML = `<div class="panel"><h2 class="adm-h">Acessos</h2><p class="small-muted">Carregando acessos...</p></div>`;
      try{
        const r = await Api.call({ acao:"admin_listar" });
        if(r && r.ok) st.lista = r.usuarios; else st.erro = (r && r.erro) || "Falha ao listar os acessos.";
      }catch(e){ st.erro = e.message; }
      st.carregando = false;
    }
    this.desenharAcessos();
  },

  totalSubAbas(){ return NAV_VIEWS.reduce((n,v)=> n + (UI.subnavConfig[v.id]||[]).length, 0); },

  desenharAcessos(){
    const pane = document.getElementById("pane-acessos"), st = this.acState;
    if(!pane) return;
    if(st.erro){
      pane.innerHTML = `<div class="panel"><h2 class="adm-h">Acessos</h2><div class="error-box">${escapeHtml(st.erro)}</div><button class="btn btn-outline" id="ac-retry">Tentar novamente</button></div>`;
      document.getElementById("ac-retry").addEventListener("click", ()=> this.renderAcessos(true));
      return;
    }
    const f = normStr(st.filtro);
    const lista = (st.lista||[]).filter(u=>!f || normStr(u.matricula+" "+(u.nome||"")).includes(f));
    const total = this.totalSubAbas();
    pane.innerHTML = `
      <div class="panel">
        <div class="adm-head">
          <h2 class="adm-h">Acessos</h2>
          <div class="adm-head-r">
            <input type="search" id="ac-busca" placeholder="Buscar matrícula ou nome" value="${escapeHtml(st.filtro)}">
            <button class="btn btn-primary btn-sm" id="ac-novo">＋ Novo acesso</button>
          </div>
        </div>
        <p class="small-muted">Defina quem entra e quais abas e sub abas cada matrícula enxerga. As mudanças valem no próximo acesso da pessoa (ou ao atualizar a página).</p>
        <div class="table-wrap"><table class="adm-table">
          <thead><tr><th>Matrícula</th><th>Nome</th><th>Status</th><th>Abas liberadas</th><th></th></tr></thead>
          <tbody>${lista.map(u=>`<tr>
            <td><strong>${escapeHtml(u.matricula)}</strong></td>
            <td>${escapeHtml(u.nome||"—")}</td>
            <td><span class="adm-tag ${u.status==="Ativo"?"acc":"off"}">${escapeHtml(u.status)}</span>${u.temSenha?"":` <span class="adm-tag off" title="Defina uma senha">sem senha</span>`}</td>
            <td>${u.perms.length} de ${total}</td>
            <td><button class="btn btn-outline btn-sm" data-mat="${escapeHtml(u.matricula)}">✏️ Editar</button></td>
          </tr>`).join("") || `<tr><td colspan="5" class="small-muted">Nenhum acesso encontrado.</td></tr>`}</tbody>
        </table></div>
      </div>`;
    document.getElementById("ac-busca").addEventListener("input", (e)=>{
      st.filtro = e.target.value; const pos = e.target.selectionStart; this.desenharAcessos();
      const n = document.getElementById("ac-busca"); n.focus(); try{ n.setSelectionRange(pos,pos); }catch(x){}
    });
    document.getElementById("ac-novo").addEventListener("click", ()=> this.editarAcesso(null));
    pane.querySelectorAll("[data-mat]").forEach(b=> b.addEventListener("click", ()=> this.editarAcesso(b.dataset.mat)));
  },

  editarAcesso(mat){
    const u = mat ? (this.acState.lista||[]).find(x=>x.matricula===mat) : null;
    const tem = new Set(u ? u.perms.map(p=>normPerm(p.aba)+"|"+normPerm(p.sub)) : []);
    const grupos = NAV_VIEWS.map(v=>{
      const itens = UI.subnavConfig[v.id]||[];
      return `<fieldset class="adm-fs"><legend><label><input type="checkbox" class="ac-all" data-v="${v.id}"> <strong>${escapeHtml(v.aba)}</strong></label></legend>
        <div class="adm-checks">${itens.map(it=>`<label class="adm-chk"><input type="checkbox" class="ac-sub" data-v="${v.id}" data-aba="${escapeHtml(v.aba)}" data-sub="${escapeHtml(it.label)}" ${tem.has(normPerm(v.aba)+"|"+normPerm(it.label))?"checked":""}> ${escapeHtml(it.label)}</label>`).join("")}</div></fieldset>`;
    }).join("");
    UI.openModal(`
      <h3 style="margin-top:0;">${u ? "Editar acesso" : "Novo acesso"}</h3>
      <div class="adm-form">
        <label>Matrícula<input type="text" inputmode="numeric" id="ac-mat" value="${u?escapeHtml(u.matricula):""}" placeholder="ex.: 10003993"></label>
        <label>Senha<input type="text" id="ac-senha" autocomplete="off" placeholder="${u?(u.temSenha?"deixe em branco para manter a atual":"defina uma senha"):"mínimo 4 caracteres"}"></label>
        <label>Status<select id="ac-status"><option value="Ativo" ${(!u||u.status==="Ativo")?"selected":""}>Ativo</option><option value="Bloqueado" ${(u&&u.status==="Bloqueado")?"selected":""}>Bloqueado</option></select></label>
      </div>
      ${grupos}
      <div id="ac-msg"></div>
      <div class="adm-actions"><button class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button><button class="btn btn-primary" id="ac-salvar">Salvar</button></div>`);
    const box = document.getElementById("modal-box");
    const sync = ()=> box.querySelectorAll(".ac-all").forEach(all=>{
      const subs = box.querySelectorAll(`.ac-sub[data-v="${all.dataset.v}"]`);
      all.checked = subs.length && Array.from(subs).every(c=>c.checked);
    });
    box.querySelectorAll(".ac-all").forEach(all=> all.addEventListener("change", ()=>{
      box.querySelectorAll(`.ac-sub[data-v="${all.dataset.v}"]`).forEach(c=>c.checked = all.checked);
    }));
    box.querySelectorAll(".ac-sub").forEach(c=> c.addEventListener("change", sync));
    sync();
    document.getElementById("ac-salvar").addEventListener("click", ()=> this.salvarAcesso(mat));
  },

  async salvarAcesso(orig){
    const box = document.getElementById("modal-box"), msg = document.getElementById("ac-msg"), btn = document.getElementById("ac-salvar");
    const perms = Array.from(box.querySelectorAll(".ac-sub:checked")).map(c=>({ aba:c.dataset.aba, sub:c.dataset.sub }));
    const payload = { acao:"admin_salvar", original: orig||"", matricula: document.getElementById("ac-mat").value.trim(),
      senha: document.getElementById("ac-senha").value, status: document.getElementById("ac-status").value, perms };
    btn.disabled = true; msg.innerHTML = "";
    try{
      const r = await Api.call(payload);
      if(!r || !r.ok) throw new Error((r && r.erro) || "Não foi possível salvar.");
      UI.closeModal();
      toast("Acesso salvo.","success");
      await this.renderAcessos(true);
      // se mexeu na própria matrícula, atualiza o menu na hora
      if(Auth.user && payload.matricula===Auth.user.matricula) LoginModule.revalidar();
    }catch(e){
      msg.innerHTML = `<div class="error-box" style="margin-top:12px;">${escapeHtml(e.message||String(e))}</div>`;
      btn.disabled = false;
    }
  },

  /* ================================================================== */
  /* LINKS DE ACESSO                                                     */
  /* ================================================================== */
  linksState: { teste:{} },

  renderLinks(){
    const pane = document.getElementById("pane-links");
    if(!pane) return;
    const info = (typeof OnlineSheets!=="undefined" && OnlineSheets.info && OnlineSheets.info.modo==="online") ? OnlineSheets.info : null;
    const abasHtml = (info) => {
      const nomes = Object.keys(info.abas);
      return `<details class="adm-det"><summary>Ver as ${nomes.length} abas lidas</summary>
        <div class="table-wrap"><table class="adm-table"><thead><tr><th>Aba</th><th>Situação</th><th>Linhas</th></tr></thead><tbody>${nomes.map(n=>{
          const a = info.abas[n];
          const tag = a.status==="ok" ? `<span class="adm-tag acc">Carregada</span>` : a.status==="ausente" ? `<span class="adm-tag off">Não encontrada</span>` : `<span class="adm-tag err">Erro</span>`;
          return `<tr><td>${escapeHtml(n)}</td><td>${tag}${a.motivo?`<div class="small-muted">${escapeHtml(a.motivo)}</div>`:""}</td><td>${a.status==="ok"?this.fmtNum(a.linhas):"—"}</td></tr>`;
        }).join("")}</tbody></table></div></details>`;
    };
    const linhas = PLANILHAS_CONECTADAS.map(p=>{
      const t = this.linksState.teste[p.id];
      const tTag = t ? (t.ok ? `<span class="adm-tag acc">Respondeu</span>` : `<span class="adm-tag err" title="${escapeHtml(t.msg||"")}">Sem resposta</span>`) : "";
      return `<div class="adm-link">
        <div class="adm-link-top">
          <div><strong>${escapeHtml(p.nome)}</strong><div class="small-muted">${escapeHtml(p.uso)}</div>
            <div class="small-muted mono">${escapeHtml(p.sheetId)}</div></div>
          <div class="adm-link-btns">
            <a class="btn btn-outline btn-sm" href="${this.urlPlanilha(p.sheetId)}" target="_blank" rel="noopener">↗ Abrir planilha</a>
            ${p.privada ? `<span class="adm-tag off">restrita (servidor)</span>` : `<button class="btn btn-outline btn-sm" data-teste="${p.id}">🔎 Testar leitura</button>`}
            ${tTag}
          </div>
        </div>
        ${p.abas ? (info ? abasHtml(info) : `<p class="small-muted">As abas aparecem aqui depois que o painel carregar os dados do Sheets.</p>`) : ""}
      </div>`;
    }).join("");
    pane.innerHTML = `
      <div class="panel">
        <div class="adm-head"><h2 class="adm-h">Links de acesso</h2></div>
        <p class="small-muted">Todas as planilhas e serviços conectados ao Núcleo Reposição.</p>
        ${linhas}
        <div class="adm-link">
          <div class="adm-link-top"><div><strong>Servidor de acessos e bases (Apps Script)</strong>
            <div class="small-muted">Faz o login por matrícula, grava Acessos e Bases.</div>
            <div class="small-muted mono">${Api.configured() ? escapeHtml(NUCLEO_API_URL) : "não configurado"}</div></div>
            <div class="adm-link-btns">${Api.configured() ? `<span class="adm-tag acc">Configurado</span>` : `<span class="adm-tag err">Pendente</span>`}</div></div>
        </div>
      </div>`;
    pane.querySelectorAll("[data-teste]").forEach(b=> b.addEventListener("click", ()=> this.testar(b.dataset.teste)));
  },

  async testar(id){
    const p = PLANILHAS_CONECTADAS.find(x=>x.id===id); if(!p) return;
    this.linksState.teste[id] = { ok:null };
    try{
      const url = `https://docs.google.com/spreadsheets/d/${p.sheetId}/gviz/tq?tqx=out:csv&tq=${encodeURIComponent("select * limit 1")}&_ts=${Date.now()}`;
      const res = await fetch(url, { cache:"no-store" });
      const txt = await res.text();
      this.linksState.teste[id] = (res.ok && !/^\s*</.test(txt)) ? { ok:true } : { ok:false, msg:"HTTP "+res.status+" — verifique o compartilhamento" };
    }catch(e){ this.linksState.teste[id] = { ok:false, msg:e.message }; }
    this.renderLinks();
  }
};
window.AdminUI = AdminUI;

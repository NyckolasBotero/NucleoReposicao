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

/* =========================================================================
   Conferência rápida do ÚLTIMO MÊS da base (sem tela — só a lógica).
   Em vez de comparar o arquivo inteiro linha a linha com a base inteira, compara contagens por dia só no
   último mês da base: se os dias anteriores batem e o último dia está coerente (sem duplicidade), grava
   somente o que vem depois (do dia seguinte até o último dia do arquivo).
   ========================================================================= */
const ConferenciaRapida = {
  RE: /^(\d{2})\/(\d{2})\/(\d{4})(?: \d{2}:\d{2}:\d{2})?$/,
  // dd/MM/aaaa[ hh:mm:ss] (texto) ou serial do Excel → aaaa-MM-dd ("" se não for data)
  chaveDia(v){
    if(typeof v === "string"){ const m = v.trim().match(this.RE); return m && +m[3] >= 2000 && +m[3] <= 2100 ? `${m[3]}-${m[2]}-${m[1]}` : ""; }
    if(typeof v === "number" && v > 36526 && v < 80000) return new Date(Math.round((v-25569)*86400000)).toISOString().slice(0,10);
    return "";
  },
  fmtDia(k){ return k ? `${k.slice(8,10)}/${k.slice(5,7)}/${k.slice(0,4)}` : "—"; },
  fmtMes(m){ const nomes = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]; return m ? `${nomes[Number(m.slice(5,7))-1]}/${m.slice(0,4)}` : "—"; },

  // conta o arquivo por dia (linhas e O.S. distintas). Linhas idênticas dentro do arquivo contam uma vez só —
  // a base nunca guarda linha 100% repetida, então assim os números ficam comparáveis.
  contarArquivo(cab, linhas, colData, colOS, norm){
    const iD = cab.findIndex(c=>norm(c)===norm(colData));
    if(iD < 0) return { ok:false, erro:`O arquivo não tem a coluna "${colData}", usada na conferência por data.` };
    const iO = colOS ? cab.findIndex(c=>norm(c)===norm(colOS)) : -1;
    const vistos = new Set(), dias = {}, sets = {}, unicas = [];
    let semData = 0, repetidas = 0, minDia = "", maxDia = "";
    linhas.forEach(l=>{
      if(!l || l.every(v=>v===""||v===null||v===undefined)) return;
      const k = l.map(v=> v===null||v===undefined ? "" : String(v).trim()).join("␟");
      if(vistos.has(k)){ repetidas++; return; }
      vistos.add(k);
      const dia = this.chaveDia(l[iD]);
      if(!dia){ semData++; return; }
      const x = dias[dia] || (dias[dia] = { l:0, o:0 });
      x.l++;
      if(iO >= 0){ const v = l[iO]==null ? "" : String(l[iO]).trim(); if(v) (sets[dia] || (sets[dia] = new Set())).add(v); }
      if(!minDia || dia < minDia) minDia = dia;
      if(!maxDia || dia > maxDia) maxDia = dia;
      unicas.push({ dia, linha:l });
    });
    Object.keys(sets).forEach(d=>{ dias[d].o = sets[d].size; });
    return { ok:true, dias, minDia, maxDia, semData, repetidas, unicas, temOS: iO >= 0 };
  },

  /* Plano de carga por dia: só os dias que o arquivo e a base têm em comum são comparados.
     Dia novo → entra. Arquivo com MAIS linhas no dia → o dia da base é refeito com as linhas do arquivo
     (equivale a "manter o maior"). Mesmo nº de linhas → nada a fazer. Base com MAIS linhas → mantém a base
     (a menos que o usuário peça "carregar mesmo assim"). Dias da base que não estão no arquivo não são tocados. */
  planejar(arq, base, forcarMenor){
    const F = d=>this.fmtDia(d), bd = base.dias || {};
    const r = { pode:false, problemas:[], avisos:[], dias:[], substituir:[], aGravar:0, removidas:0, novos:{ n:0, linhas:0, de:"", ate:"" },
                novosDias:[], linhasEnviar:[], ultimaBase: base.ultimaData||"", de: arq.minDia||"", ate: arq.maxDia||"", ultimaCarga: base.ultimaCarga||null, temMenor:false, mantidos:0 };
    if(!arq.maxDia){ r.problemas.push("Não encontrei datas válidas no arquivo."); return r; }
    const sel = new Set();
    Object.keys(arq.dias).sort().forEach(d=>{
      const f = arq.dias[d].l, b = bd[d] || 0;
      let sit;
      if(!b) sit = "novo";
      else if(f > b) sit = "maior";
      else if(f === b) sit = "igual";
      else sit = "menor";
      const usa = sit==="novo" || sit==="maior" || (sit==="menor" && forcarMenor);
      if(sit==="menor") r.temMenor = true;
      if(usa) sel.add(d);
      if(b){ r.dias.push({ dia:d, bl:b, fl:f, sit, usa }); }
      if(sit==="novo"){ r.novosDias.push({ dia:d, l:f }); r.novos.n++; r.novos.linhas += f; if(!r.novos.de) r.novos.de = d; r.novos.ate = d; }
      if(usa && b){ r.substituir.push(d); r.removidas += b; }
      if(!usa && b) r.mantidos++;
      if(usa) r.aGravar += f;
    });
    r.linhasEnviar = arq.unicas.filter(x=>sel.has(x.dia)).sort((x,y)=> x.dia<y.dia?-1:x.dia>y.dia?1:0).map(x=>x.linha);
    if(base.ultimaData && arq.maxDia < base.ultimaData) r.avisos.push(`O arquivo termina em ${F(arq.maxDia)}, antes da última data da base (${F(base.ultimaData)}). Se for um arquivo antigo, confira antes de gravar.`);
    if(arq.semData) r.avisos.push(`${arq.semData.toLocaleString("pt-BR")} linha(s) do arquivo estão sem data válida (vazia, texto ou ano fora de 2000–2100, como linha de total) e não serão gravadas.`);
    if(arq.repetidas) r.avisos.push(`${arq.repetidas.toLocaleString("pt-BR")} linha(s) idênticas dentro do arquivo serão ignoradas.`);
    r.pode = r.aGravar > 0;
    return r;
  }
};

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
  basesState: { lista:null, erro:null, carregando:false, arq:null, enviando:false, planilha:null, fila:[], rodando:false, seq:0 },

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
        if(r && r.ok){ st.lista = r.bases; st.planilha = r.planilha || null; } else st.erro = (r && r.erro) || "Falha ao consultar as bases.";
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
    const modoSel = (m,i)=> `<select class="adm-select" data-modo="${i}" title="Muda como esta base grava os arquivos novos"><option value="acumular" ${m==="acumular"?"selected":""}>AGREGAR</option><option value="substituir" ${m!=="acumular"?"selected":""}>SUBSTITUIR</option></select>`;
    pane.innerHTML = `
      <div class="panel">
        <div class="adm-head">
          <h2 class="adm-h">Bases</h2>
          <button class="btn btn-outline btn-sm" id="bases-refresh">Atualizar situação</button>
        </div>
        <p class="small-muted">Carregue aqui os arquivos exportados (8460, 8022, 1707 GERAL etc.). Antes de gravar, o sistema confere o que já existe na base para não duplicar.
          <strong>AGREGAR</strong>: entram só as linhas que ainda não existem (sem duplicar). <strong>SUBSTITUIR</strong>: o arquivo novo troca todo o conteúdo da base (foto do momento). Dá para trocar o modo de cada base na coluna "Modo gravação".</p>
        ${this.htmlPlanilha()}
        <div class="table-wrap"><table class="adm-table">
          <thead><tr><th>Base</th><th>Modo gravação</th><th>Linhas na base</th><th>Linhas disponíveis</th><th>Data mais recente nos dados</th><th>Último carregamento</th><th></th></tr></thead>
          <tbody>${lista.map((b,i)=>{
            const u = b.ultimaCarga, dr = this.dataMaisRecente(b.base);
            return `<tr>
              <td><strong>${escapeHtml(b.base)}</strong><div class="small-muted">${escapeHtml(b.desc||"")}</div></td>
              <td>${modoSel(b.modo,i)}</td>
              <td>${b.existe ? this.fmtNum(b.linhasAtuais) : `<span class="small-muted">aba não criada</span>`}</td>
              <td>${this.htmlDisp(b)}</td>
              <td>${dr ? fmtDateBR(dr) : "—"}</td>
              <td>${u ? `<strong>${escapeHtml(u.quando)}</strong><div class="small-muted">${escapeHtml(u.usuario||"")} · ${escapeHtml(u.arquivo||"")}<br>${this.fmtNum(u.novas)} novas${b.modo==="acumular"?` · ${this.fmtNum(u.duplicadas)} já existiam`:""}</div>` : `<span class="small-muted">nenhum registro</span>`}</td>
              <td style="white-space:nowrap"><button class="btn btn-primary btn-sm" data-base="${i}">Carregar</button>
                ${b.existe?`<button class="btn btn-outline btn-sm" data-excluir="${i}" style="color:var(--danger,#c0392b)" title="Apaga todos os dados desta base">Excluir base</button>`:""}</td>
            </tr>`; }).join("")}</tbody>
        </table></div>
      </div>
      <div id="bases-fila"></div>
      <input type="file" id="bases-file" accept=".xlsx,.xls,.csv" style="display:none">
      <div id="bases-envio"></div>`;
    this.desenharFila();
    document.getElementById("bases-refresh").addEventListener("click", ()=> this.renderBases(true));
    const input = document.getElementById("bases-file");
    pane.querySelectorAll("[data-base]").forEach(b=> b.addEventListener("click", ()=>{
      st.baseSel = lista[Number(b.dataset.base)];
      input.value = ""; input.click();
    }));
    pane.querySelectorAll("[data-modo]").forEach(sel=> sel.addEventListener("change", ()=> this.mudarModo(lista[Number(sel.dataset.modo)], sel.value, sel)));
    pane.querySelectorAll("[data-excluir]").forEach(b=> b.addEventListener("click", ()=> this.excluirBase(lista[Number(b.dataset.excluir)])));
    input.addEventListener("change", ()=>{ if(input.files[0]) this.lerArquivo(input.files[0]); });
    if(st.arq) this.desenharPreview();
  },

  temFilaPendente(base){ return this.basesState.fila.some(j=>j.base===base && (j.status==="espera"||j.status==="rodando")); },

  async mudarModo(b, modo, sel){
    const st = this.basesState, antigo = b.modo;
    if(modo===antigo) return;
    if(this.temFilaPendente(b.base)){ sel.value = antigo; toast("Há carregamento desta base na fila", "error", { sub:"Espere a fila terminar para mudar o modo." }); return; }
    const txt = modo==="acumular" ? "AGREGAR: os próximos arquivos só acrescentam as linhas que ainda não existem (sem duplicar)." : "SUBSTITUIR: os próximos arquivos vão APAGAR tudo o que está na base e colocar o conteúdo do arquivo.";
    if(!confirm(`Mudar o modo da base ${b.base}?\n\n${txt}`)){ sel.value = antigo; return; }
    sel.disabled = true;
    try{
      const r = await Api.call({ acao:"bases_modo", base:b.base, modo });
      if(!r || !r.ok) throw new Error((r && r.erro) || "O servidor recusou a mudança.");
      b.modo = modo;
      if(st.arq && st.arq.base.base===b.base){ st.arq.base = b; st.arq.sim = null; st.arq.rapido = null; st.arq.ultimaVerif = null; }
      toast(`Base ${b.base}: modo ${modo==="acumular"?"AGREGAR":"SUBSTITUIR"}`, "success");
    }catch(e){
      sel.value = antigo;
      toast("Não foi possível mudar o modo", "error", { sub:String(e.message||e).slice(0,140) });
    }
    sel.disabled = false;
    this.desenharBases();
  },

  async excluirBase(b){
    const st = this.basesState;
    if(this.temFilaPendente(b.base)){ toast("Há carregamento desta base na fila", "error", { sub:"Espere a fila terminar." }); return; }
    if(!confirm(`ATENÇÃO: excluir TODOS os dados da base ${b.base}?\n\nSão ${this.fmtNum(b.linhasAtuais)} linha(s). Só o cabeçalho fica. Essa ação não tem volta.`)) return;
    const dig = prompt(`Para confirmar, digite o nome da base: ${b.base}`);
    if(dig===null) return;
    if(String(dig).trim().toUpperCase() !== b.base.toUpperCase()){ toast("Nome diferente — nada foi excluído", "error"); return; }
    try{
      const r = await Api.call({ acao:"bases_excluir", base:b.base });
      if(!r || !r.ok) throw new Error((r && r.erro) || "O servidor recusou a exclusão.");
      toast(`Base ${b.base}: ${this.fmtNum(r.removidas)} linha(s) excluídas`, "success");
      if(st.arq && st.arq.base.base===b.base){ st.arq.sim = null; st.arq.rapido = null; st.arq.ultimaVerif = null; }
      await this.renderBases(true);
    }catch(e){
      toast("Não foi possível excluir", "error", { sub:String(e.message||e).slice(0,140) });
    }
  },

  // ---- capacidade: o Google Sheets limita a planilha inteira a 10 milhões de células ----
  htmlDisp(b){
    if(!b.existe || b.linhasDisponiveis==null) return `<span class="small-muted">—</span>`;
    const d = b.linhasDisponiveis, cor = d < 50000 ? "var(--danger,#c0392b)" : d < 200000 ? "var(--warn,#b9770e)" : "inherit";
    return `<strong style="color:${cor}">${this.fmtNum(d)}</strong><div class="small-muted">${b.colunas} colunas</div>`;
  },
  htmlPlanilha(){
    const p = this.basesState.planilha;
    if(!p) return "";
    const cor = p.pct >= 90 ? "var(--danger,#c0392b)" : p.pct >= 75 ? "var(--warn,#b9770e)" : "var(--primary,#2563eb)";
    return `<div class="hint-box" style="margin:10px 0;"><strong>Espaço da planilha:</strong> ${this.fmtNum(p.usadas)} de ${this.fmtNum(p.limite)} células usadas (${String(p.pct).replace(".",",")}%) · ${this.fmtNum(p.livres)} livres.
      <div class="adm-prog" style="margin-top:6px;"><div style="width:${Math.min(100,p.pct)}%;background:${cor}"></div></div>
      <div class="small-muted" style="margin-top:4px;">O limite vale para a planilha toda. “Linhas disponíveis” mostra quantas linhas ainda cabem em cada aba, de acordo com o número de colunas dela.</div></div>`;
  },
  // confere se as linhas a gravar cabem; devolve texto de erro ou ""
  conferirEspaco(base, aGravar, removidas){
    const b = (this.basesState.lista||[]).find(x=>x.base===base);
    if(!b || b.linhasDisponiveis==null) return "";
    const falta = aGravar - (removidas||0) - b.linhasDisponiveis;
    return falta > 0 ? `A base ${base} não tem espaço: faltam ${this.fmtNum(falta)} linha(s) (disponíveis: ${this.fmtNum(b.linhasDisponiveis)}). Apague abas que não usa ou reduza o histórico.` : "";
  },

  // ---- fila de carregamentos: um de cada vez (o servidor grava uma coisa por vez), enquanto você prepara o próximo arquivo ----
  enfileirar(job){
    const st = this.basesState;
    job.id = ++st.seq; job.status = "espera"; job.msg = ""; job.pct = 0; job.stale = false;
    st.fila.push(job);
    st.arq = null;
    this.desenharBases();
    toast(`Na fila: ${job.base} (${st.fila.filter(j=>j.status==="espera"||j.status==="rodando").length} pendente(s))`, "success");
    this.rodarFila();
  },
  desenharFila(){
    const box = document.getElementById("bases-fila"), st = this.basesState;
    if(!box) return;
    if(!st.fila.length){ box.innerHTML = ""; return; }
    const rot = { espera:"Aguardando", rodando:"Gravando", ok:"Concluído", erro:"Erro" };
    const temFim = st.fila.some(j=>j.status==="ok"||j.status==="erro");
    box.innerHTML = `<div class="panel">
      <div class="adm-head"><h2 class="adm-h">Fila de carregamentos</h2>${temFim?`<button class="btn btn-outline btn-sm" id="fila-limpar">Limpar concluídos</button>`:""}</div>
      <p class="small-muted">Os arquivos são gravados um por vez, na ordem. Pode escolher e conferir outro arquivo enquanto a fila roda; não feche nem recarregue a página até terminar.</p>
      <div class="table-wrap"><table class="adm-table"><thead><tr><th>#</th><th>Base</th><th>Arquivo</th><th>Situação</th><th></th></tr></thead><tbody>${st.fila.map(j=>`
        <tr><td>${j.id}</td><td><strong>${escapeHtml(j.base)}</strong></td><td>${escapeHtml(j.nome)}<div class="small-muted">${this.fmtNum(j.total)} linha(s) a gravar</div></td>
        <td><strong>${rot[j.status]}</strong>${j.status==="rodando"?`<div class="adm-prog"><div style="width:${j.pct}%"></div></div>`:""}${j.msg?`<div class="small-muted">${escapeHtml(j.msg)}</div>`:""}</td>
        <td>${j.status==="espera"?`<button class="btn btn-outline btn-sm" data-fila-rm="${j.id}">Tirar da fila</button>`:""}</td></tr>`).join("")}</tbody></table></div></div>`;
    box.querySelectorAll("[data-fila-rm]").forEach(b=> b.addEventListener("click", ()=>{
      st.fila = st.fila.filter(j=> !(j.id===Number(b.dataset.filaRm) && j.status==="espera"));
      this.desenharFila();
    }));
    const l = document.getElementById("fila-limpar");
    if(l) l.addEventListener("click", ()=>{ st.fila = st.fila.filter(j=>j.status==="espera"||j.status==="rodando"); this.desenharFila(); });
  },
  async rodarFila(){
    const st = this.basesState;
    if(st.rodando) return;
    st.rodando = true;
    let feito = false;
    try{
      let j;
      while((j = st.fila.find(x=>x.status==="espera"))){
        j.status = "rodando"; j.msg = ""; j.pct = 0; this.desenharFila();
        try{
          if(j.tipo==="rapido") await this.executarRapido(j); else await this.executarCompleto(j);
          j.status = "ok"; j.pct = 100; feito = true;
        }catch(e){
          j.status = "erro"; j.msg = String(e.message||e).slice(0,300) + " Se parte já foi gravada, refaça a conferência antes de reenviar.";
          toast(`Falha ao gravar ${j.base}`, "error", { sub:String(e.message||e).slice(0,140) });
        }
        st.fila.forEach(x=>{ if(x.status==="espera" && x.base===j.base) x.stale = true; });
        this.desenharFila();
      }
    } finally { st.rodando = false; }
    if(feito){
      st.lista = null;
      await this.renderBases(true);
      const box = document.getElementById("bases-envio");
      if(box && !st.arq) box.innerHTML = `<div class="panel"><div class="hint-box">✅ Fila concluída.
        <button class="btn btn-primary btn-sm" id="bases-reload" style="margin-left:10px;">Atualizar o painel agora</button></div></div>`;
      const rb = document.getElementById("bases-reload");
      if(rb) rb.addEventListener("click", ()=> UI.carregarOnline());
    }
  },

  // ---- lê o arquivo escolhido e mostra o resumo antes de enviar ----
  async lerArquivo(file){
    const st = this.basesState, base = st.baseSel, box = document.getElementById("bases-envio");
    if(!base || !box) return;
    box.innerHTML = `<div class="panel"><div class="loading-line"><span class="spinner"></span> Lendo ${escapeHtml(file.name)}…</div></div>`;
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
      if(dados.length >= 65535 && /\.xls$/i.test(file.name)) aviso.push("Este arquivo .xls tem "+dados.length.toLocaleString("pt-BR")+" linhas, exatamente o limite do formato .xls (65.536 contando o título). Ele pode ter sido cortado na exportação e estar sem as linhas finais. Exporte de novo em .xlsx ou em períodos menores.");
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
      const alvoBox = document.getElementById("bases-envio");
      if(alvoBox) alvoBox.scrollIntoView({ behavior:"smooth", block:"start" });
      toast("Arquivo lido — ainda não foi gravado", "info", { sub:`${linhas.length.toLocaleString("pt-BR")} linhas · base ${base.base}. Falta verificar e gravar${aviso.length?" · confira os avisos":""}.`, duracao:7000,
        acao:{ rotulo:"Ir para a conferência", fn:()=>{ const b = document.getElementById("bases-envio"); if(b) b.scrollIntoView({ behavior:"smooth", block:"start" }); } } });
    }catch(e){
      st.arq = null;
      box.innerHTML = `<div class="panel"><div class="error-box">${escapeHtml(e.message||String(e))}</div></div>`;
      toast("Não foi possível ler o arquivo", "error", { sub:String(e.message||e).slice(0,140) });
    }
  },

  desenharPreview(){
    const st = this.basesState, a = st.arq, box = document.getElementById("bases-envio");
    if(!a || !box) return;
    const atual = this.dataMaisRecente(a.base.base);
    const velho = a.maxD && atual && a.base.modo==="acumular" && dateOnly(a.maxD) < dateOnly(atual);
    // conferência rápida (só o último mês) disponível: base que acumula, com coluna de data conhecida e presente no arquivo
    const rapidoOk = a.base.modo==="acumular" && !!a.base.colData && !!a.cab && a.cab.some(c=>normStr(c)===normStr(a.base.colData));
    const rap = a.rapido && a.rapido.res;
    const podeGravar = a.ultimaVerif==="rapido" ? !!(rap && rap.pode && rap.aGravar>0) : !!a.sim;
    const verificado = !!(a.sim || (rap && rap.pode));
    const passo2 = verificado ? "verificação feita ✓" : (rapidoOk ? "clique em “Conferir por dia”" : "clique em “Verificar duplicidade”");
    box.innerHTML = `
      <div class="panel">
        <h3 class="adm-h2">Conferir antes de enviar — ${escapeHtml(a.base.base)}</h3>
        <div class="hint-box" style="margin-bottom:12px;"><strong>Nada foi gravado no Google Sheets ainda.</strong> Passos: <strong>1.</strong> arquivo lido ✓ &nbsp;→&nbsp; <strong>2.</strong> ${passo2} &nbsp;→&nbsp; <strong>3.</strong> clique em “Gravar na base”.</div>
        <div class="adm-grid">
          <div><span class="small-muted">Arquivo</span><br><strong>${escapeHtml(a.nome)}</strong><br><span class="small-muted">aba lida: ${escapeHtml(a.aba)}</span></div>
          <div><span class="small-muted">Linhas no arquivo</span><br><strong>${this.fmtNum(a.linhas.length)}</strong></div>
          <div><span class="small-muted">Data mais recente no arquivo</span><br><strong>${a.maxD ? fmtDateBR(a.maxD) : "—"}</strong></div>
          <div><span class="small-muted">Data mais recente hoje na base</span><br><strong>${atual ? fmtDateBR(atual) : "—"}</strong></div>
        </div>
        ${velho ? `<div class="warn-box" style="margin-top:12px;">A data mais recente do arquivo (${fmtDateBR(a.maxD)}) é anterior à que já está na base (${fmtDateBR(atual)}). Provavelmente é um arquivo antigo.</div>` : ""}
        ${a.aviso.map(t=>`<div class="hint-box" style="margin-top:10px;">${escapeHtml(t)}</div>`).join("")}
        <div id="bases-sim" style="margin-top:14px;">${
          a.ultimaVerif==="rapido" ? this.htmlRapido(a)
          : a.sim ? this.htmlSimulacao(a)
          : (rapidoOk ? this.htmlRapido(a) : `<span class="small-muted">Clique em <strong>Verificar duplicidade</strong> para ver quantas linhas são novas antes de gravar.</span>`)}</div>
        <div class="adm-actions">
          <button class="btn btn-outline" id="bases-cancel" ${st.enviando?"disabled":""}>Cancelar</button>
          ${rapidoOk ? `<button class="btn btn-outline" id="bases-rapido-btn" ${st.enviando?"disabled":""} title="Compara só os dias que o arquivo e a base têm em comum e grava o que falta">Conferir por dia (recomendado)</button>` : ""}
          <button class="btn btn-outline" id="bases-sim-btn" ${st.enviando?"disabled":""} title="${rapidoOk?"Compara linha a linha com a base inteira (demora mais)":""}">${rapidoOk?"Verificação completa (mais lenta)":"Verificar duplicidade"}</button>
          ${podeGravar?"":`<button class="btn btn-outline" id="bases-go-sem" ${st.enviando?"disabled":""} style="color:var(--danger,#c0392b)" title="Grava sem conferir antes (pede confirmação)">Gravar sem conferir</button>`}
          <button class="btn btn-primary" id="bases-go" ${(!podeGravar||st.enviando)?"disabled":""} title="${podeGravar?"":"Faça a verificação primeiro"}">Gravar na base</button>
        </div>
        <div id="bases-prog"></div>
      </div>`;
    document.getElementById("bases-cancel").addEventListener("click", ()=>{ st.arq = null; box.innerHTML = ""; });
    const rb = document.getElementById("bases-rapido-btn");
    if(rb) rb.addEventListener("click", ()=> this.conferirRapido());
    const fc = document.getElementById("bases-forcar");
    if(fc) fc.addEventListener("change", ()=>{ a.rapido.forcar = fc.checked; a.rapido.res = ConferenciaRapida.planejar(a.contagem, a.rapido.base, fc.checked); this.desenharPreview(); });
    document.getElementById("bases-sim-btn").addEventListener("click", ()=> this.enviar(true));
    const gs = document.getElementById("bases-go-sem");
    if(gs) gs.addEventListener("click", ()=> this.enviar(false, true));
    document.getElementById("bases-go").addEventListener("click", ()=> a.ultimaVerif==="rapido" ? this.enviarRapido() : this.enviar(false));
  },

  // ---- conferência por dia: compara só os dias que o arquivo e a base têm em comum ----
  async conferirRapido(){
    const st = this.basesState, a = st.arq;
    if(!a || st.enviando) return;
    a.rapido = { carregando:true }; a.ultimaVerif = "rapido";
    this.desenharPreview();
    try{
      if(!a.contagem) a.contagem = ConferenciaRapida.contarArquivo(a.cab, a.linhas, a.base.colData, a.base.colOS, normStr);
      if(!a.contagem.ok) throw new Error(a.contagem.erro);
      const r = await Api.call({ acao:"bases_dias", base:a.base.base, de:a.contagem.minDia });
      if(!r || !r.ok) throw new Error((r && r.erro) || "O servidor não devolveu o resumo da base.");
      a.rapido = { base:r, forcar:false, res: ConferenciaRapida.planejar(a.contagem, r, false), linhasTotal: r.linhasTotal };
      a.sim = null;
    }catch(e){
      a.rapido = { erro:String(e.message||e) };
    }
    this.desenharPreview();
  },

  htmlRapido(a){
    const q = a.rapido, CR = ConferenciaRapida;
    if(!q) return `<span class="small-muted">Clique em <strong>Conferir por dia</strong>: o sistema compara só os dias que o arquivo e a base têm em comum e grava o que falta, em um único envio.</span>`;
    if(q.carregando) return `<div class="loading-line"><span class="spinner"></span> Conferindo os dias do arquivo com a base…</div>`;
    if(q.erro) return `<div class="error-box">${escapeHtml(q.erro)}</div>`;
    const r = q.res, F = d=>CR.fmtDia(d), n = x=>this.fmtNum(x);
    const avisos = r.avisos.map(t=>`<div class="small-muted" style="margin-top:6px;">• ${escapeHtml(t)}</div>`).join("");
    const rot = { maior:"⚠ base incompleta → será refeito com o arquivo", igual:"✓ já está igual", menor:"⚠ a base tem MAIS linhas que o arquivo" };
    const linhas = r.dias.map(x=>{
      const sit = x.sit==="menor" && x.usa ? "⚠ será substituído mesmo assim" : (x.sit==="menor" ? "⚠ a base tem mais linhas — será mantida" : rot[x.sit]);
      return `<tr><td>${F(x.dia)}</td><td>${n(x.bl)}</td><td>${n(x.fl)}</td><td>${sit}</td></tr>`; }).join("");
    const tab = r.dias.length ? `<div class="table-wrap" style="margin-top:10px;"><table class="adm-table"><thead><tr><th>Dia em comum</th><th>Linhas na base</th><th>Linhas no arquivo</th><th>O que acontece</th></tr></thead><tbody>${linhas}</tbody></table></div>` : "";
    const novosTab = r.novosDias.length ? `<div class="table-wrap" style="margin-top:10px;"><table class="adm-table"><thead><tr><th>Dia novo (entra na base)</th><th>Linhas no arquivo</th></tr></thead><tbody>${r.novosDias.map(x=>`<tr><td>${F(x.dia)}</td><td>${n(x.l)}</td></tr>`).join("")}</tbody></table></div>` : "";
    const u = r.ultimaCarga;
    const cargaTxt = r.dias.length && u ? `<div class="small-muted" style="margin-top:6px;">Última carga desta base: <strong>${escapeHtml(u.quando)}</strong> por ${escapeHtml(u.usuario||"—")} (${escapeHtml(u.arquivo||"")}) · ${n(u.novas)} linhas.</div>` : "";
    const forca = r.temMenor ? `<label class="adm-chk" style="margin-top:10px;display:block;"><input type="checkbox" id="bases-forcar" ${q.forcar?"checked":""}> Carregar mesmo assim: substituir também os dias em que a base tem mais linhas que o arquivo</label>` : "";
    if(!r.pode){
      return `<div class="warn-box"><strong>Nada novo para gravar.</strong> ${r.problemas.map(t=>escapeHtml(t)).join(" ")||"Os dias do arquivo já estão na base com a mesma quantidade de linhas (ou mais)."}</div>${tab}${cargaTxt}${forca}${avisos}`;
    }
    const partes = [];
    if(r.novos.n) partes.push(`<strong>${n(r.novos.linhas)}</strong> linha(s) de ${r.novos.n} dia(s) novo(s) (${F(r.novos.de)}${r.novos.n>1?" a "+F(r.novos.ate):""})`);
    if(r.substituir.length) partes.push(`<strong>${r.substituir.length}</strong> dia(s) refeito(s) (${n(r.removidas)} linha(s) antigas trocadas pelas do arquivo)`);
    return `<div class="${r.dias.some(x=>x.usa)?"warn-box":"hint-box"}"><strong>Plano de gravação:</strong> ${partes.join(" + ")} — total de <strong>${n(r.aGravar)}</strong> linha(s) gravadas ao fim da base, em blocos únicos.
      ${r.mantidos ? `<div style="margin-top:4px;">${r.mantidos} dia(s) em comum ficam como estão.</div>` : ""}</div>${novosTab}${tab}${cargaTxt}${forca}${avisos}`;
  },

  // confirma e põe o plano na fila de gravação
  enviarRapido(){
    const st = this.basesState, a = st.arq, q = a && a.rapido, r = q && q.res;
    if(!a || !r || !r.pode || st.enviando) return;
    const erroEsp = this.conferirEspaco(a.base.base, r.aGravar, r.removidas);
    if(erroEsp){ toast("Sem espaço na base", "error", { sub:erroEsp }); return; }
    const aviso = r.substituir.length ? `\n\nATENÇÃO: ${r.substituir.length} dia(s) já existem na base e serão refeitos com as linhas do arquivo (${r.removidas.toLocaleString("pt-BR")} linha(s) antigas saem).` : "";
    if(!confirm(`Colocar na fila: gravar ${r.aGravar.toLocaleString("pt-BR")} linha(s) na base ${a.base.base}?${aviso}`)) return;
    this.enfileirar({ tipo:"rapido", base:a.base.base, nome:a.nome, total:r.aGravar, a, q });
  },

  // grava o plano: apaga os dias a refazer e acrescenta as linhas em blocos grandes (uma escrita por bloco)
  async executarRapido(job){
    const a = job.a, q = job.q;
    let r = q.res, esperado = q.linhasTotal;
    if(job.stale){   // outra carga da mesma base terminou antes: confere de novo o que falta
      job.msg = "Reconferindo a base...";  this.desenharFila();
      const novo = await Api.call({ acao:"bases_dias", base:a.base.base, de:a.contagem.minDia });
      if(!novo || !novo.ok) throw new Error((novo && novo.erro) || "O servidor não devolveu o resumo da base.");
      r = ConferenciaRapida.planejar(a.contagem, novo, !!q.forcar); esperado = novo.linhasTotal;
      if(!r.pode){ job.msg = "Nada novo a gravar (a base já tem esses dados)."; job.total = 0; return; }
      job.total = r.aGravar;
    }
    const TAM = 8000, linhas = r.linhasEnviar, partes = Math.max(1, Math.ceil(linhas.length/TAM));
    const tot = { gravadas:0, removidas:0 };
    for(let p=1; p<=partes; p++){
      job.pct = Math.round((p-1)/partes*100); job.msg = `Enviando bloco ${p} de ${partes}...`; this.desenharFila();
      const resp = await Api.call({ acao:"bases_aplicar", base:a.base.base, parte:p, partes, linhasTotal:esperado, substituir:p===1?r.substituir:[], cabecalho:a.cab, linhas:linhas.slice((p-1)*TAM, p*TAM) });
      if(!resp || !resp.ok) throw new Error((resp && resp.erro) || "O servidor recusou o envio.");
      tot.gravadas += resp.gravadas||0; tot.removidas += resp.removidas||0; esperado = resp.linhasApos;
    }
    await Api.call({ acao:"bases_concluir", base:a.base.base, arquivo:a.nome+" [por dia]", enviadas:a.linhas.length, novas:tot.gravadas, duplicadas:Math.max(0, a.linhas.length-tot.gravadas) });
    job.msg = `${this.fmtNum(tot.gravadas)} gravadas${tot.removidas?`, ${this.fmtNum(tot.removidas)} antigas trocadas`:""}.`;
  },

  htmlSimulacao(a){
    const s = a.sim;
    if(a.base.modo==="substituir"){
      return `<div class="hint-box"><strong>Substituição:</strong> a base hoje tem ${this.fmtNum(s.substituira)} linhas e passará a ter ${this.fmtNum(s.novas)} (as atuais serão apagadas).</div>`;
    }
    return `<div class="${s.novas?"hint-box":"warn-box"}"><strong>${this.fmtNum(s.novas)}</strong> linha(s) nova(s) serão gravadas · <strong>${this.fmtNum(s.duplicadas)}</strong> já existem na base e serão ignoradas.${s.novas?"":" Nada novo para gravar."}</div>`;
  },

  // simulação (verificação completa) roda direto; gravação vai para a fila
  async enviar(simular, semConferir){
    const st = this.basesState, a = st.arq;
    if(!a || st.enviando) return;
    if(!simular){
      if(semConferir && !confirm(`⚠ GRAVAR SEM CONFERIR\n\nO arquivo ainda não foi verificado. ${a.base.modo==="substituir" ? "No modo SUBSTITUIR a base atual será APAGADA e trocada pelo arquivo." : "No modo AGREGAR o servidor ignora linhas repetidas, mas você não verá o resumo antes."}\n\nContinuar?`)) return;
      if(!semConferir && !confirm(a.base.modo==="substituir"
        ? `Colocar na fila: substituir TODO o conteúdo da base ${a.base.base} pelas ${a.linhas.length.toLocaleString("pt-BR")} linhas do arquivo?`
        : `Colocar na fila: gravar as linhas novas na base ${a.base.base}?`)) return;
      const erroEsp = this.conferirEspaco(a.base.base, (a.sim && a.sim.novas) || a.linhas.length, a.base.modo==="substituir" ? a.base.linhasAtuais : 0);
      if(erroEsp){ toast("Sem espaço na base", "error", { sub:erroEsp }); return; }
      this.enfileirar({ tipo:"completo", base:a.base.base, nome:a.nome, total:(a.sim && a.sim.novas) || a.linhas.length, a });
      return;
    }
    st.enviando = true;
    this.desenharPreview();
    const prog = document.getElementById("bases-prog");
    const TAM = 15000, partes = Math.max(1, Math.ceil(a.linhas.length/TAM));
    const tot = { recebidas:0, novas:0, duplicadas:0, substituira:0 };
    try{
      for(let p=1; p<=partes; p++){
        prog.innerHTML = `<div class="adm-prog"><div style="width:${Math.round((p-1)/partes*100)}%"></div></div><span class="small-muted">Verificando parte ${p} de ${partes}...</span>`;
        const r = await Api.call({ acao:"bases_enviar", base:a.base.base, simular:true, parte:p, partes, cabecalho:a.cab, linhas:a.linhas.slice((p-1)*TAM, p*TAM) });
        if(!r || !r.ok) throw new Error((r && r.erro) || "O servidor recusou o envio.");
        tot.recebidas += r.recebidas||0; tot.novas += r.novas||0; tot.duplicadas += r.duplicadas||0; tot.substituira = r.substituira||tot.substituira;
      }
      a.sim = tot; a.ultimaVerif = "completo";
      st.enviando = false;
      this.desenharPreview();
      toast("Verificação concluída", "success", { sub:`${tot.novas.toLocaleString("pt-BR")} novas · ${tot.duplicadas.toLocaleString("pt-BR")} já existem` });
    }catch(e){
      st.enviando = false;
      this.desenharPreview();
      const pr = document.getElementById("bases-prog");
      toast("Não foi possível concluir a verificação", "error", { sub:String(e.message||e).slice(0,140) });
      if(pr) pr.innerHTML = `<div class="error-box" style="margin-top:12px;">${escapeHtml(e.message||String(e))}</div>`;
    }
  },

  async executarCompleto(job){
    const a = job.a, TAM = 15000, partes = Math.max(1, Math.ceil(a.linhas.length/TAM));
    const tot = { recebidas:0, novas:0, duplicadas:0 };
    for(let p=1; p<=partes; p++){
      job.pct = Math.round((p-1)/partes*100); job.msg = `Enviando parte ${p} de ${partes}...`; this.desenharFila();
      const r = await Api.call({ acao:"bases_enviar", base:a.base.base, simular:false, parte:p, partes, cabecalho:a.cab, linhas:a.linhas.slice((p-1)*TAM, p*TAM) });
      if(!r || !r.ok) throw new Error((r && r.erro) || "O servidor recusou o envio.");
      tot.recebidas += r.recebidas||0; tot.novas += r.novas||0; tot.duplicadas += r.duplicadas||0;
    }
    await Api.call({ acao:"bases_concluir", base:a.base.base, arquivo:a.nome, enviadas:tot.recebidas, novas:tot.novas, duplicadas:tot.duplicadas });
    job.total = tot.novas;
    job.msg = `${this.fmtNum(tot.novas)} gravadas${a.base.modo==="acumular"?`, ${this.fmtNum(tot.duplicadas)} já existiam`:""}.`;
  },

  /* ================================================================== */
  /* ATUALIZAÇÕES (versão e notas)                                       */
  /* ================================================================== */
  versoesState: { ultima:null, novas:0, checando:false, erro:null },

  cmpVersao(a, b){
    const x = String(a).split(".").map(Number), y = String(b).split(".").map(Number);
    for(let i=0;i<3;i++){ const d = (x[i]||0) - (y[i]||0); if(d) return d; }
    return 0;
  },

  // consulta a versão publicada (changelog.js ao vivo) e compara com a que está rodando
  async verificarVersao(){
    const st = this.versoesState;
    st.checando = true; st.erro = null; this.desenharVersoes();
    try{
      const res = await fetch("changelog.js?_=" + Date.now(), { cache:"no-store" });
      if(!res.ok) throw new Error("HTTP " + res.status);
      const txt = await res.text();
      const m = txt.match(/APP_VERSAO\s*=\s*"([\d.]+)"/);
      if(!m) throw new Error("Não foi possível ler a versão publicada.");
      st.ultima = m[1];
      const todas = Array.from(txt.matchAll(/\{\s*v:"([\d.]+)"/g)).map(x=>x[1]);
      st.novas = todas.filter(v=> this.cmpVersao(v, APP_VERSAO) > 0).length;
    }catch(e){ st.erro = String(e.message||e); }
    st.checando = false;
    this.desenharVersoes();
  },

  async atualizarApp(){
    try{
      if(window.caches){ for(const k of await caches.keys()) await caches.delete(k); }
      if(navigator.serviceWorker){ for(const r of await navigator.serviceWorker.getRegistrations()) await r.unregister(); }
    }catch(e){}
    location.reload();
  },

  renderVersoes(){
    this.desenharVersoes();
    if(!this.versoesState.ultima && !this.versoesState.checando && !this.versoesState.erro) this.verificarVersao();
  },

  desenharVersoes(){
    const pane = document.getElementById("pane-versoes"), st = this.versoesState;
    if(!pane) return;
    const notas = typeof NOTAS_VERSAO !== "undefined" ? NOTAS_VERSAO : [];
    const fmt = (d)=> String(d).split("-").reverse().join("/");
    let situ;
    if(st.checando) situ = `<span class="small-muted">Verificando a versão publicada…</span>`;
    else if(st.erro) situ = `<span class="small-muted">Não consegui verificar agora (${escapeHtml(st.erro)}).</span>`;
    else if(st.ultima && st.novas > 0) situ = `<span class="adm-tag rep">Atualização disponível</span> a versão publicada é a <strong>${escapeHtml(st.ultima)}</strong> — você está ${st.novas} versão(ões) atrás. <button class="btn btn-primary btn-sm" id="ver-atualizar" style="margin-left:8px;">Atualizar agora</button>`;
    else if(st.ultima) situ = `<span class="adm-tag acc">Atualizado</span> você está na última versão publicada.`;
    else situ = "";
    pane.innerHTML = `<div class="panel">
      <div class="adm-head"><h2 class="adm-h">Atualizações</h2><button class="btn btn-outline btn-sm" id="ver-checar" ${st.checando?"disabled":""}>Verificar versão</button></div>
      <div class="adm-grid">
        <div><span class="small-muted">Versão instalada</span><br><strong style="font-size:26px;">v${escapeHtml(typeof APP_VERSAO!=="undefined"?APP_VERSAO:"—")}</strong></div>
        <div><span class="small-muted">Última publicada</span><br><strong style="font-size:26px;">${st.ultima?"v"+escapeHtml(st.ultima):"—"}</strong></div>
        <div><span class="small-muted">Última atualização</span><br><strong style="font-size:26px;">${notas[0]?fmt(notas[0].data):"—"}</strong></div>
      </div>
      <div class="hint-box" style="margin-top:12px;">${situ||"&nbsp;"}</div>
      <p class="small-muted" style="margin-top:10px;">Versões: funcionalidade nova sobe o 2º número (2.7 → 2.8); correção ou ajuste sobe o 3º (2.7.0 → 2.7.1).</p>
    </div>
    ${notas.map((n,i)=>`<div class="panel">
      <div class="adm-head"><h3 class="adm-h2" style="margin:0;">v${escapeHtml(n.v)} · ${escapeHtml(n.titulo)} ${i===0?`<span class="adm-tag acc" style="margin-left:6px;">atual</span>`:""}</h3><span class="small-muted">${fmt(n.data)}</span></div>
      <ul style="margin:10px 0 0;padding-left:20px;line-height:1.55;">${n.itens.map(t=>`<li>${escapeHtml(t)}</li>`).join("")}</ul>
    </div>`).join("")}`;
    const c = document.getElementById("ver-checar"); if(c) c.addEventListener("click", ()=> this.verificarVersao());
    const a = document.getElementById("ver-atualizar"); if(a) a.addEventListener("click", ()=> this.atualizarApp());
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
            <td><button class="btn btn-outline btn-sm" data-mat="${escapeHtml(u.matricula)}">Editar</button></td>
          </tr>`).join("") || `<tr><td colspan="5" class="small-muted">Nenhum acesso encontrado.</td></tr>`}</tbody>
        </table></div>
      </div>`;
    document.getElementById("ac-busca").addEventListener("input", (e)=>{
      st.filtro = e.target.value; const pos = e.target.selectionStart; this.desenharAcessos();
      const n = document.getElementById("ac-busca"); n.focus(); try{ n.setSelectionRange(pos,pos); }catch(x){}
    });
    document.getElementById("ac-novo").addEventListener("click", ()=> this.editarAcesso(null));
    pane.querySelectorAll("[data-mat]").forEach(b=> b.addEventListener("click", ()=> this.editarAcesso(b.dataset.mat)));
    // histórico de logins (abaixo da tabela de acessos)
    const h = document.createElement("div"); h.id = "ac-hist"; pane.appendChild(h);
    this.renderHistorico(!this.hist.eventos && !this.hist.carregando);
  },

  /* ---------------- Histórico de logins, falhas e tempo de uso ---------------- */
  hist: { eventos:null, erro:null, carregando:false, periodo:"hoje", soFalhas:false, truncado:false, total:0, hoje:null },

  async renderHistorico(buscar){
    const box = document.getElementById("ac-hist"); if(!box) return;
    const st = this.hist;
    if(buscar){
      st.carregando = true; st.erro = null; this.desenharHistorico();
      try{
        const r = await Api.call({ acao:"admin_historico" });
        if(r && r.ok){ st.eventos = r.eventos||[]; st.truncado = !!r.truncado; st.total = r.total||0; st.hoje = r.hoje||null; }
        else st.erro = (r && r.erro) || "Falha ao carregar o histórico.";
      }catch(e){ st.erro = e.message; }
      st.carregando = false;
    }
    this.desenharHistorico();
  },

  desenharHistorico(){
    const box = document.getElementById("ac-hist"); if(!box) return;
    const st = this.hist;
    const cab = (extra)=>`<div class="adm-head"><h2 class="adm-h">Histórico de logins</h2><div class="adm-head-r">${extra||""}</div></div>`;
    if(st.carregando){ box.innerHTML = `<div class="panel">${cab()}<p class="small-muted">Carregando histórico...</p></div>`; return; }
    if(st.erro){ box.innerHTML = `<div class="panel">${cab()}<div class="error-box">${escapeHtml(st.erro)}</div><button class="btn btn-outline" id="hs-retry">Tentar novamente</button></div>`; document.getElementById("hs-retry").addEventListener("click", ()=> this.renderHistorico(true)); return; }
    const ev = (st.eventos||[]).map(l=>({ dt:String(l[0]||""), mat:String(l[1]||"").trim(), nome:String(l[2]||""), tipo:String(l[3]||""), det:String(l[4]||""), seg:Number(l[5])||0 })).filter(e=>e.dt);
    // período
    const hoje = st.hoje || toInputDate(new Date());
    const dias = st.periodo==="hoje" ? 0 : st.periodo==="7" ? 6 : 29;
    const d0 = new Date(hoje+"T00:00:00"); d0.setDate(d0.getDate()-dias); const corte = toInputDate(d0);
    const noPeriodo = ev.filter(e=> e.dt.slice(0,10) >= corte);
    const hojeEv = ev.filter(e=> e.dt.slice(0,10) === hoje);
    const nomes = {}; (this.acState.lista||[]).forEach(u=>{ if(u.nome) nomes[u.matricula] = u.nome; }); ev.forEach(e=>{ if(e.nome && !nomes[e.mat]) nomes[e.mat] = e.nome; });
    const nomeDe = m=> nomes[m] || "—";
    const dur = s=>{ s = Math.round(s); if(s<=0) return "—"; const h = Math.floor(s/3600), m = Math.round((s%3600)/60); return h ? `${h}h ${String(m).padStart(2,"0")}min` : (m ? `${m} min` : `${s}s`); };
    const fmtDH = s=>{ const p = s.split(" "), d = (p[0]||"").split("-"); return `${d[2]}/${d[1]} ${(p[1]||"").slice(0,5)}`; };
    // por usuário
    const us = {};
    const get = m=> us[m] = us[m] || { mat:m, logins:0, falhas:0, ultimo:"", segPeriodo:0, segHoje:0, telas:{}, pedidos:0, trocas:0 };
    noPeriodo.forEach(e=>{
      if(!e.mat) return; const u = get(e.mat);
      if(e.tipo==="LOGIN_OK"){ u.logins++; if(e.dt>u.ultimo) u.ultimo = e.dt; }
      else if(e.tipo==="LOGIN_FALHA") u.falhas++;
      else if(e.tipo==="SENHA_SOLICITADA") u.pedidos++;
      else if(e.tipo==="SENHA_ALTERADA") u.trocas++;
      else if(e.tipo==="USO"){ u.segPeriodo += e.seg; u.telas[e.det] = (u.telas[e.det]||0) + e.seg; if(e.dt>u.ultimo) u.ultimo = e.dt; }
    });
    hojeEv.forEach(e=>{ if(e.tipo==="USO" && e.mat) get(e.mat).segHoje += e.seg; });
    const linhasUs = Object.values(us).sort((a,b)=> (b.segPeriodo-a.segPeriodo) || (b.logins-a.logins));
    const totLogins = noPeriodo.filter(e=>e.tipo==="LOGIN_OK").length, totFalhas = noPeriodo.filter(e=>e.tipo==="LOGIN_FALHA").length;
    const totSeg = linhasUs.reduce((n,u)=>n+u.segPeriodo,0), ativos = linhasUs.filter(u=>u.segPeriodo>0||u.logins>0).length;
    const totPed = noPeriodo.filter(e=>e.tipo==="SENHA_SOLICITADA").length, totTroca = noPeriodo.filter(e=>e.tipo==="SENHA_ALTERADA").length;
    // telas mais usadas (geral)
    const telas = {}; noPeriodo.forEach(e=>{ if(e.tipo==="USO") telas[e.det] = (telas[e.det]||0) + e.seg; });
    const topTelas = Object.entries(telas).sort((a,b)=>b[1]-a[1]).slice(0,8), maxT = topTelas.length ? topTelas[0][1] : 1;
    const card = (t,v,sub,cor)=>`<div class="card"><div class="card-label">${t}</div><div class="card-value" ${cor?`style="color:${cor}"`:""}>${v}</div>${sub?`<div class="card-sub">${sub}</div>`:""}</div>`;
    const rotulo = { LOGIN_OK:["Login","acc"], LOGIN_FALHA:["Falha de login","err"], SENHA_ALTERADA:["Senha alterada","acc"], SENHA_SOLICITADA:["Pediu nova senha","rep"] };
    const eventos = noPeriodo.filter(e=> e.tipo!=="USO" && (!st.soFalhas || e.tipo==="LOGIN_FALHA" || e.tipo==="SENHA_SOLICITADA")).sort((a,b)=> a.dt<b.dt?1:-1).slice(0,150);
    const perLabel = st.periodo==="hoje" ? "hoje" : st.periodo==="7" ? "nos últimos 7 dias" : "nos últimos 30 dias";
    box.innerHTML = `<div class="panel">
      ${cab(`<select id="hs-per"><option value="hoje" ${st.periodo==="hoje"?"selected":""}>Hoje</option><option value="7" ${st.periodo==="7"?"selected":""}>Últimos 7 dias</option><option value="30" ${st.periodo==="30"?"selected":""}>Últimos 30 dias</option></select><button class="btn btn-outline btn-sm" id="hs-reload">Atualizar</button>`)}
      <p class="small-muted">Quem entrou, quanto tempo ficou ativo e em quais abas, além de falhas de login e trocas de senha. O tempo conta só com a página aberta e com atividade (cliques, toques, rolagem); 2 min parado não conta.${st.truncado?` Mostrando os ${ev.length} registros mais recentes de ${st.total}.`:""}</p>
      <div class="cards-grid" style="margin-bottom:14px;">
        ${card("Logins "+perLabel, fmtNum(totLogins), fmtNum(ativos)+" usuário(s) ativo(s)")}
        ${card("Falhas de login", fmtNum(totFalhas), totFalhas?"senha/matrícula incorretas ou bloqueio":"nenhuma falha", totFalhas?"var(--red)":"")}
        ${card("Tempo ativo total", dur(totSeg), "soma de todos os usuários")}
        ${card("Senhas", fmtNum(totTroca)+" alterada(s)", totPed?(totPed+" pedido(s) de redefinição — defina em Editar"):"sem pedidos", totPed?"var(--orange)":"")}
      </div>
      <div class="grid-2" style="grid-template-columns:1fr;">
        <div><h3 style="margin:0 0 8px;font-size:14px;">Atividade por usuário</h3>
          <div class="table-wrap"><table class="adm-table"><thead><tr><th>Usuário</th><th>Logins</th><th>Falhas</th><th>Ativo hoje</th><th>Ativo ${st.periodo==="hoje"?"":"no período"}</th><th>Último</th><th>Abas mais usadas</th></tr></thead><tbody>
          ${linhasUs.map(u=>{ const top = Object.entries(u.telas).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([t,s])=>`${escapeHtml(t.split(" > ").pop())} <span class="small-muted">(${dur(s)})</span>`).join("<br>");
            return `<tr><td><strong>${escapeHtml(u.mat)}</strong><div class="small-muted">${escapeHtml(nomeDe(u.mat))}</div></td><td>${u.logins}</td><td>${u.falhas?`<span class="adm-tag err">${u.falhas}</span>`:"0"}</td><td>${dur(u.segHoje)}</td><td>${dur(u.segPeriodo)}</td><td>${u.ultimo?fmtDH(u.ultimo):"—"}</td><td style="white-space:normal;">${top||"—"}</td></tr>`; }).join("") || `<tr><td colspan="7" class="small-muted">Sem registros ${perLabel}.</td></tr>`}
          </tbody></table></div></div>
        <div><h3 style="margin:0 0 8px;font-size:14px;">Abas mais usadas ${perLabel}</h3>
          ${topTelas.length ? topTelas.map(([t,s])=>`<div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;font-size:12.5px;gap:8px;"><span>${escapeHtml(t)}</span><strong>${dur(s)}</strong></div><div style="height:7px;background:var(--gray-100);border-radius:6px;overflow:hidden;"><div style="height:100%;width:${Math.max(3,Math.round(s/maxT*100))}%;background:var(--blue-med);border-radius:6px;"></div></div></div>`).join("") : `<p class="small-muted">Ainda sem tempo de uso registrado ${perLabel}.</p>`}
        </div>
      </div>
      <div class="adm-head" style="margin-top:18px;"><h3 style="margin:0;font-size:14px;">Histórico de acessos</h3>
        <label class="small-muted" style="display:flex;gap:6px;align-items:center;"><input type="checkbox" id="hs-falhas" ${st.soFalhas?"checked":""}> só falhas e pedidos de senha</label></div>
      <div class="table-wrap"><table class="adm-table"><thead><tr><th>Data/hora</th><th>Matrícula</th><th>Nome</th><th>Evento</th><th>Detalhe</th></tr></thead><tbody>
        ${eventos.map(e=>{ const r = rotulo[e.tipo]||[e.tipo,"off"]; return `<tr><td>${fmtDH(e.dt)}</td><td><strong>${escapeHtml(e.mat||"—")}</strong></td><td>${escapeHtml(nomeDe(e.mat))}</td><td><span class="adm-tag ${r[1]}">${r[0]}</span></td><td style="white-space:normal;">${escapeHtml(e.det)}</td></tr>`; }).join("") || `<tr><td colspan="5" class="small-muted">Nenhum registro ${perLabel}.</td></tr>`}
      </tbody></table></div>
    </div>`;
    document.getElementById("hs-per").addEventListener("change", e=>{ st.periodo = e.target.value; this.desenharHistorico(); });
    document.getElementById("hs-reload").addEventListener("click", ()=> this.renderHistorico(true));
    document.getElementById("hs-falhas").addEventListener("change", e=>{ st.soFalhas = e.target.checked; this.desenharHistorico(); });
  },

  editarAcesso(mat){
    const u = mat ? (this.acState.lista||[]).find(x=>x.matricula===mat) : null;
    const tem = new Set(u ? u.perms.map(p=>normPerm(p.aba)+"|"+normPerm(p.sub)) : []);
    const grupos = NAV_VIEWS.map(v=>{
      const itens = UI.subnavConfig[v.id]||[];
      return `<fieldset class="adm-fs"><legend><label><input type="checkbox" class="ac-all" data-v="${v.id}"> <strong>${escapeHtml(v.aba)}</strong></label></legend>
        <div class="adm-checks">${itens.map(it=>`<label class="adm-chk"><input type="checkbox" class="ac-sub" data-v="${v.id}" data-aba="${escapeHtml(v.aba)}" data-sub="${escapeHtml(it.label)}" ${[it.label].concat(it.aliases||[]).some(n=>tem.has(normPerm(v.aba)+"|"+normPerm(n)))?"checked":""}> ${escapeHtml(it.label)}</label>`).join("")}</div></fieldset>`;
    }).join("");
    UI.openModal(`
      <h3 style="margin-top:0;">${u ? "Editar acesso" : "Novo acesso"}</h3>
      <div class="adm-form">
        <label>Matrícula<input type="text" inputmode="numeric" id="ac-mat" value="${u?escapeHtml(u.matricula):""}" placeholder="ex.: 10003993"></label>
        <label>Nome do usuário<input type="text" id="ac-nome" autocomplete="off" value="${u?escapeHtml(u.nome||""):""}" placeholder="ex.: Fabio Nyckolas"></label>
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
    const payload = { acao:"admin_salvar", original: orig||"", matricula: document.getElementById("ac-mat").value.trim(), nome: document.getElementById("ac-nome").value.trim(),
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
            ${p.privada ? `<span class="adm-tag off">restrita (servidor)</span>` : `<button class="btn btn-outline btn-sm" data-teste="${p.id}">Testar leitura</button>`}
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

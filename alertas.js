/* =========================================================================
   Núcleo Reposição — Central de Alertas
   - painel que abre pelo sino, à direita, com contagem regressiva de 4 s (para com o mouse em cima)
   - tipos de alerta (internos + criados pelo administrador), quem recebe cada um, vetos e descartes por pessoa
   Depende de app.js (Api, Auth, UI, toast, escapeHtml, fmtDateBR), feedbacks.js (FeedbackAdv) e nc.js (NC).
   ========================================================================= */
const Alertas = {
  /* ---------------------------------------------------------------- */
  /* estado                                                            */
  /* ---------------------------------------------------------------- */
  cfg: { tipos:{}, custom:[], feitos:{}, abrirAoEntrar:true, padroesOk:false }, eventos:[],
  prefs: { descartados:{}, vetos:[] },
  admin:false, usuarios:[], carregado:false, _p:null, _noEntrar:false,
  TEMPO: 4000,

  h(s){ return escapeHtml(s); },
  mat(){ return (window.Auth && Auth.user && Auth.user.matricula) || ""; },
  pad(n){ return String(n).padStart(2,"0"); },
  iso(d){ return `${d.getFullYear()}-${this.pad(d.getMonth()+1)}-${this.pad(d.getDate())}`; },
  hoje(){ const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); },
  lsKey(){ return "nucleo_alertas_prefs_" + this.mat(); },

  /* ---------------------------------------------------------------- */
  /* tipos de alerta internos                                          */
  /* cada tipo devolve itens { key, veto, titulo, texto, codKey?, sig } */
  /* ---------------------------------------------------------------- */
  TIPOS: [
    { id:"suspensao", nome:"Solicitar suspensão", icone:"ban", cor:"#c0392b", desc:"Colaborador com 3 advertências no mesmo motivo e sem suspensão.", padrao:"*",
      gerar(a){ return (a.suspender||[]).map(x=>({ key:`suspensao|${x.codKey}|${x.motivo}`, veto:`suspensao|${x.codKey}`, titulo:x.nome, texto:`${x.motivo}: ${x.adv} advertência(s), ${x.susp} suspensão(ões) — ${x.pend} a emitir`, codKey:x.codKey, sig:`${x.adv}|${x.susp}` })); } },
    { id:"nc_adv", nome:"NC recorrente: gerar advertência", icone:"alert", cor:"#d64545", desc:"Feedbacks suficientes no mesmo motivo de não conformidade.", padrao:"*",
      gerar(a){ return (a.ncAdv||[]).map(x=>({ key:`nc_adv|${x.codKey}|${x.tipo}`, veto:`nc_adv|${x.codKey}`, titulo:x.nome, texto:`${x.label}: ${x.fb} feedback(s), ${x.adv} advertência(s) — ${x.pend} a emitir`, codKey:x.codKey, sig:`${x.fb}|${x.adv}` })); } },
    { id:"nc_fb", nome:"NC recorrente: gerar feedback", icone:"alertc", cor:"#e08a1f", desc:"NCs acumuladas no mesmo motivo pedindo feedback.", padrao:"*",
      gerar(a){ return (a.ncFb||[]).map(x=>({ key:`nc_fb|${x.codKey}|${x.tipo}`, veto:`nc_fb|${x.codKey}`, titulo:x.nome, texto:`${x.label}: ${x.ncs} NCs desde ${fmtDateBR(x.desdeData)}`, codKey:x.codKey, sig:`${x.ncs}` })); } },
    { id:"adv_pend", nome:"Precisam de advertência", icone:"clipboard", cor:"#d64545", desc:"Feedbacks no mesmo motivo sem advertência correspondente.", padrao:"*",
      gerar(a){ return (a.advertir||[]).map(x=>({ key:`adv_pend|${x.codKey}|${x.motivo}`, veto:`adv_pend|${x.codKey}`, titulo:x.nome, texto:`${x.motivo}: ${x.fb} feedback(s), ${x.adv} advertência(s) — ${x.pend} a emitir`, codKey:x.codKey, sig:`${x.fb}|${x.adv}` })); } },
    { id:"probatorio", nome:"Período probatório acabando", icone:"clock", cor:"#e08a1f", desc:"Fim do probatório nos próximos dias.", padrao:"*",
      gerar(a){ return (a.probatorio||[]).map(x=>({ key:`probatorio|${x.codKey}`, veto:`probatorio|${x.codKey}`, titulo:x.nome, texto:`Termina em ${fmtDateBR(x.fim)} (${x.restam===0?"hoje":"faltam "+x.restam+" dia(s)"})`, codKey:x.codKey, sig:String(x.restam) })); } },
    { id:"sem_feedback", nome:"Sem feedback há muitos dias", icone:"message", cor:"#2f6fce", desc:"Colaborador há mais de 30 dias sem receber feedback.", padrao:"*",
      gerar(a){ return (a.semFeedback||[]).map(x=>({ key:`sem_feedback|${x.codKey}`, veto:`sem_feedback|${x.codKey}`, titulo:x.nome, texto:x.dias===null ? "Nunca recebeu feedback" : `${x.dias} dias sem feedback`, codKey:x.codKey, sig:x.dias===null?"n":String(Math.floor(x.dias/7)) })); } },
    { id:"ferias_conf", nome:"Férias no mesmo período", icone:"calendar", cor:"#8e5bd0", desc:"Duas pessoas com férias agendadas sobrepostas.", padrao:"*",
      gerar(a){ return (a.ferias||[]).map(g=>({ key:`ferias_conf|${g.a.codKey}|${g.b.codKey}`, veto:`ferias_conf|${g.a.codKey}|${g.b.codKey}`, titulo:`${g.a.nome} e ${g.b.nome}`, texto:`${fmtDateBR(g.a.ini)} a ${fmtDateBR(g.a.fim)}  /  ${fmtDateBR(g.b.ini)} a ${fmtDateBR(g.b.fim)}`, sig:"1" })); } },
    { id:"transferencia", nome:"Produto transferido", icone:"repeat", cor:"#0f8f8f", desc:"Endereço do produto na 8022 diferente do endereço na 8022 Nova.", padrao:"*",
      gerar(){ return Alertas.itensTransferidos(); } },
    { id:"chamada", nome:"Chamada do dia", icone:"listcheck", cor:"#1a9c62", desc:"Avisa quando a chamada do dia é lançada, por quem, a que horas e quem não está presente.", padrao:"admin",
      gerar(){ return Alertas.itensChamada(); } },
    { id:"ferias_venc", nome:"Férias vencendo", icone:"plane", cor:"#d9822b", desc:"Férias vencidas ou que vencem em até 1 mês e ainda não foram agendadas.", padrao:"*",
      gerar(){ return Alertas.itensFeriasVenc(); } },
    { id:"sem_anexo", nome:"Documento sem anexo", icone:"file", cor:"#c0392b", desc:"Advertência ou suspensão lançada, mas sem o documento assinado anexado (NC ainda não aplicada).", padrao:"*",
      gerar(){ return Alertas.itensSemAnexo(); } }
  ],
  tipo(id){ return this.TIPOS.find(t=>t.id===id); },

  /* ---------------------------------------------------------------- */
  /* carga e gravação                                                  */
  /* ---------------------------------------------------------------- */
  async carregar(force){
    if(this._p && !force) return this._p;
    this._p = (async ()=>{
      try{ const l = JSON.parse(localStorage.getItem(this.lsKey())||"null"); if(l) this.prefs = { descartados:l.descartados||{}, vetos:l.vetos||[] }; }catch(e){}
      if(!Api.configured()){ this.carregado = true; return; }
      try{
        const r = await Api.call({ acao:"alertas_ler" });
        if(r && r.ok){
          const c = r.config || {};
          this.cfg = { tipos:c.tipos||{}, custom:c.custom||[], feitos:c.feitos||{}, abrirAoEntrar:c.abrirAoEntrar!==false, padroesOk:!!c.padroesOk };
          this.eventos = r.eventos || [];
          this.prefs = { descartados:(r.prefs||{}).descartados||{}, vetos:(r.prefs||{}).vetos||[] };
          this.admin = !!r.admin; this.usuarios = r.usuarios||[];
          this.aplicarPadroes();
          try{ localStorage.setItem(this.lsKey(), JSON.stringify(this.prefs)); }catch(e){}
        }
      }catch(e){ /* segue com o que tem */ }
      this.carregado = true;
    })();
    await this._p; this._p = null;
  },
  /** lembretes recorrentes que já vêm prontos (só para o administrador, até ele salvar a configuração) */
  PADROES: [
    { id:"sys_comissao", nome:"Enviar a comissão do mês", texto:"Enviar após o último dia do mês", ativo:true, regra:{ tipo:"mensal", inicio:1, limite:5 }, dest:"admin" },
    { id:"sys_folgas", nome:"Enviar o resumo de folgas", texto:"Resumo de folgas do mês", ativo:true, regra:{ tipo:"mensal", inicio:15, limite:20 }, dest:"admin" }
  ],
  aplicarPadroes(){
    if(!this.admin || this.cfg.padroesOk) return;
    this.PADROES.forEach(d=>{ if(!this.cfg.custom.some(c=>c.id===d.id)) this.cfg.custom.push(JSON.parse(JSON.stringify(d))); });
    this.cfg.padroesOk = true;
    this.salvarCfg().catch(()=>{});
  },
  async salvarPrefs(){
    try{ localStorage.setItem(this.lsKey(), JSON.stringify(this.prefs)); }catch(e){}
    if(!Api.configured()) return;
    clearTimeout(this._tp);
    this._tp = setTimeout(()=>{ Api.call({ acao:"alertas_prefs_salvar", prefs:this.prefs }).catch(()=>{}); }, 600);
  },
  async salvarCfg(){
    const r = await Api.call({ acao:"alertas_cfg_salvar", config:this.cfg });
    if(!r || !r.ok) throw new Error((r && r.erro) || "Não foi possível salvar.");
  },

  /* ---------------------------------------------------------------- */
  /* quem recebe                                                       */
  /* ---------------------------------------------------------------- */
  destDe(id, padrao){ const c = this.cfg.tipos[id]; return c && c.dest !== undefined ? c.dest : (padrao || "*"); },
  ativoDe(id){ const c = this.cfg.tipos[id]; return !c || c.ativo !== false; },
  recebe(dest){
    if(dest === "*") return true;
    if(dest === "admin") return this.admin;
    return Array.isArray(dest) && dest.includes(this.mat());
  },

  /* ---------------------------------------------------------------- */
  /* alertas recorrentes criados pelo administrador                     */
  /* ---------------------------------------------------------------- */
  statusCustom(c){
    const h = this.hoje(), r = c.regra || {};
    let ciclo = "", ativo = false, venc = null;
    if(r.tipo === "mensal"){
      const ini = Number(r.inicio)||1, lim = Number(r.limite)||0;
      ativo = h.getDate() >= ini; ciclo = `${h.getFullYear()}-${this.pad(h.getMonth()+1)}`;
      if(lim) venc = new Date(h.getFullYear(), h.getMonth(), lim);
    }else if(r.tipo === "semanal"){
      const alvo = Number(r.dia)||1;                              // 0=dom ... 6=sáb
      const seg = new Date(h); seg.setDate(h.getDate() - ((h.getDay()+6)%7));
      const d = new Date(seg); d.setDate(seg.getDate() + ((alvo+6)%7));
      ativo = h >= d; ciclo = this.iso(d); venc = d;
    }else{
      const p = String(r.data||"").split("-").map(Number);
      if(p.length === 3){ const d = new Date(p[0], p[1]-1, p[2]); ativo = h >= d; ciclo = "unica"; venc = d; }
    }
    return { ativo, ciclo, venc, atrasado: !!(venc && h > venc) };
  },
  itensCustom(){
    const out = [];
    (this.cfg.custom||[]).forEach(c=>{
      if(c.ativo === false || !this.recebe(c.dest === undefined ? "*" : c.dest)) return;
      const s = this.statusCustom(c); if(!s.ativo) return;
      const f = this.cfg.feitos[c.id]; if(f && f.ciclo === s.ciclo) return;
      const dias = s.venc ? Math.round((this.hoje()-s.venc)/864e5) : 0;
      const prazo = s.venc ? (s.atrasado ? `Atrasado há ${dias} dia(s)` : (dias===0 ? "Vence hoje" : `Vence em ${fmtDateBR(s.venc)}`)) : "";
      out.push({ key:`custom|${c.id}|${s.ciclo}`, veto:`custom|${c.id}`, titulo:c.nome||"Alerta", texto:[c.texto, prazo].filter(Boolean).join(" — "), sig:s.ciclo, concluir:{ id:c.id, ciclo:s.ciclo }, urgente:s.atrasado });
    });
    return out;
  },

  /* ---------------------------------------------------------------- */
  /* alertas novos (etapa 2)                                           */
  /* ---------------------------------------------------------------- */
  proc(){ return window.APP_STATE && window.APP_STATE.processed; },
  itensTransferidos(){
    const p = this.proc(); if(!p || !p.p8022NovaDispo || typeof capCompute !== "function") return [];
    if(this._tr && this._tr.p !== p){ this._tr = null; }
    if(!this._tr){
      let lista = [];
      try{ lista = (capCompute(p).itensTransferidos||[]); }catch(e){ lista = []; }
      this._tr = { p, lista };
    }
    const l = this._tr.lista; if(!l.length) return [];
    const ordem = { "Máxima":0, "Alta":1, "Média":2, "Baixa":3, "Normal":4 };
    const top = l.slice().sort((a,b)=>(ordem[a.urgencia]??9)-(ordem[b.urgencia]??9)).slice(0,3)
      .map(r=>`${r.codprod}${r.urgencia && r.urgencia!=="Normal" ? " ("+r.urgencia.toLowerCase()+")" : ""}`).join(", ");
    const urg = l.filter(r=>r.urgencia && r.urgencia !== "Normal").length;
    return [{ key:"transf|resumo", veto:"transf|resumo", titulo:`${l.length} produto(s) com endereço diferente`, texto:`8022 × 8022 Nova${urg?` — ${urg} com urgência`:""}. Ex.: ${top}`, sig:`${l.length}|${urg}`, urgente:urg>0, ir:()=>UI.goTo("indicadores","capacidade") }];
  },
  itensChamada(){
    const out = [], hoje = this.iso(this.hoje()), ontem = this.iso(new Date(this.hoje().getTime()-864e5));
    (this.eventos||[]).filter(e=>e.data===hoje || e.data===ontem).forEach(e=>{
      const hora = String(e.quando||"").slice(11,16), d = String(e.data||"").split("-").reverse().join("/");
      const aus = e.ausentes||[];
      const txt = aus.length ? `${aus.length} sem presença: ${aus.slice(0,6).map(x=>`${x.nome} (${String(x.status).toLowerCase()})`).join(", ")}${aus.length>6?" e mais "+(aus.length-6):""}` : "Todos presentes";
      out.push({ key:`chamada|${e.data}|${e.mat}`, veto:`chamada|${e.mat}`, titulo:`Chamada de ${d} feita por ${e.quem} às ${hora}`, texto:`${e.presentes||0} presente(s)${e.folgas?`, ${e.folgas} folga(s)`:""}${e.ferias?`, ${e.ferias} em férias`:""}. ${txt}`, sig:String(e.quando), urgente:aus.length>0, ir:()=>UI.goTo("gestao","chamada") });
    });
    return out;
  },
  itensFeriasVenc(){
    const p = this.proc(); if(!p || !p.turnoverDispo || typeof computeFerias !== "function") return [];
    let d; try{ d = computeFerias(); }catch(e){ return []; }
    const fora = (window.FeedbackAdv && FeedbackAdv.dispensados) ? FeedbackAdv.dispensados() : new Set();
    return d.linhas.filter(l=>(l.bucket==="vencida" || l.bucket==="prox3") && l.diffDias <= 30 && !fora.has(l.codKey)).map(l=>{
      const venc = l.diffDias < 0;
      return { key:`ferias_venc|${l.codKey}`, veto:`ferias_venc|${l.codKey}`, titulo:l.nome, texto: venc ? `Férias vencidas há ${-l.diffDias} dia(s) (previstas para ${fmtDateBR(l.dataFerias)})` : (l.diffDias===0 ? "Férias vencem hoje" : `Férias vencem em ${l.diffDias} dia(s) (${fmtDateBR(l.dataFerias)})`), codKey:l.codKey, sig:venc?"v":String(Math.floor(l.diffDias/7)), urgente:venc, ir:()=>UI.goTo("gestao","ferias") };
    });
  },
  itensSemAnexo(){
    const p = this.proc(); if(!p || !window.FeedbackAdv) return [];
    const h = this.hoje(), out = [];
    const fora = FeedbackAdv.dispensados ? FeedbackAdv.dispensados() : new Set();
    const ct = window.APP_STATE && window.APP_STATE.currentTeam;
    const add = (tipo, r)=>{
      if(!r.data || !r.codKey || r.anexo || fora.has(r.codKey) || (ct && ct.codes && !ct.codes.has(r.codKey))) return;
      const dias = Math.round((h - new Date(r.data.getFullYear(), r.data.getMonth(), r.data.getDate()))/864e5);
      if(dias < 0 || dias > 120) return;
      out.push({ key:`sem_anexo|${tipo}|${r.codKey}|${this.iso(r.data)}`, veto:`sem_anexo|${r.codKey}`, titulo:r.nome, texto:`${tipo} de ${fmtDateBR(r.data)}${r.motivo?" ("+r.motivo+")":""} sem anexo — não aplicada há ${dias} dia(s)`, codKey:r.codKey, sig:"1", urgente:dias>=3 });
    };
    FeedbackAdv.advertencias().filter(r=>!r.legado).forEach(r=>add("Advertência", r));
    (FeedbackAdv.suspensoesDisc ? FeedbackAdv.suspensoesDisc() : []).forEach(r=>add("Suspensão", r));
    return out.sort((a,b)=>b.texto.localeCompare(a.texto)).slice(0,60);
  },

  /* ---------------------------------------------------------------- */
  /* coleta                                                            */
  /* ---------------------------------------------------------------- */
  coletar(incluirOcultos){
    let base = {};
    try{ base = window.FeedbackAdv ? FeedbackAdv.alertas() : {}; }catch(e){ base = {}; }
    const grupos = [], vetos = new Set(this.prefs.vetos||[]), desc = this.prefs.descartados||{};
    const filtra = (itens)=> incluirOcultos ? itens : itens.filter(i=> !vetos.has(i.veto) && desc[i.key] !== i.sig);
    this.TIPOS.forEach(t=>{
      if(!this.ativoDe(t.id) || !this.recebe(this.destDe(t.id, t.padrao))) return;
      let itens = []; try{ itens = t.gerar(base) || []; }catch(e){ itens = []; }
      itens = filtra(itens); if(itens.length) grupos.push({ id:t.id, nome:t.nome, icone:t.icone, cor:t.cor, itens });
    });
    const cu = filtra(this.itensCustom());
    if(cu.length) grupos.push({ id:"custom", nome:"Lembretes", icone:"clock", cor:"#2f6fce", itens:cu });
    return grupos;
  },
  total(){ try{ return this.coletar().reduce((n,g)=>n+g.itens.length, 0); }catch(e){ return 0; } },

  atualizarBadge(){
    const n = this.total();
    ["hdr-alertas-n","sb-alertas-n","dr-alertas-n"].forEach(id=>{
      const el = document.getElementById(id); if(!el) return;
      el.textContent = n>99 ? "99+" : String(n); el.style.display = n ? "" : "none";
    });
    if(document.getElementById("alert-panel")) this.desenharPainel();
  },

  /* ---------------------------------------------------------------- */
  /* painel                                                            */
  /* ---------------------------------------------------------------- */
  async abrir(auto){
    if(!window.APP_STATE || !window.APP_STATE.ready){ toast("Carregue os dados primeiro (Atualizar dados) para ver os alertas.", "error"); return; }
    if(document.getElementById("alert-panel")){ this.fechar(); return; }
    await this.carregar();
    const p = document.createElement("div"); p.id = "alert-panel"; p.setAttribute("role","dialog"); p.setAttribute("aria-label","Alertas");
    const hd = document.getElementById("app-header"); const top = hd ? Math.round(hd.getBoundingClientRect().bottom) + 8 : 70;
    p.style.top = top + "px";
    document.body.appendChild(p);
    this.desenharPainel();
    requestAnimationFrame(()=> p.classList.add("on"));
    this._fora = (e)=>{ if(!p.contains(e.target) && !e.target.closest("#btn-alertas,#sb-alertas,[data-dr=alertas],#modal-overlay,.modal-overlay")) this.fechar(); };
    this._esc = (e)=>{ if(e.key === "Escape") this.fechar(); };
    setTimeout(()=> document.addEventListener("mousedown", this._fora), 50);
    document.addEventListener("keydown", this._esc);
    this.iniciarTimer(p);
  },
  fechar(){
    const p = document.getElementById("alert-panel"); if(!p) return;
    this.pararTimer();
    document.removeEventListener("mousedown", this._fora); document.removeEventListener("keydown", this._esc);
    p.classList.remove("on"); p.classList.add("sai");
    setTimeout(()=> p.remove(), 260);
  },

  /* contagem regressiva: 4 s; mouse em cima pausa; clique/toque dentro fixa o painel */
  iniciarTimer(p){
    this.pararTimer();
    this._t = { restante:this.TEMPO, ini:performance.now(), pausado:false, fixo:false, raf:0 };
    const t = this._t;
    const passo = (agora)=>{
      if(this._t !== t) return;
      if(!t.pausado && !t.fixo){
        const r = Math.max(0, t.restante - (agora - t.ini));
        const b = p.querySelector(".ap-timer i"); if(b) b.style.transform = `scaleX(${r/this.TEMPO})`;
        if(r <= 0){ this.fechar(); return; }
      }
      t.raf = requestAnimationFrame(passo);
    };
    t.raf = requestAnimationFrame(passo);
    p.addEventListener("mouseenter", ()=>{ if(t.fixo) return; t.restante = Math.max(0, t.restante - (performance.now()-t.ini)); t.pausado = true; });
    p.addEventListener("mouseleave", ()=>{ if(t.fixo) return; t.restante = this.TEMPO; t.ini = performance.now(); t.pausado = false; });   // ao sair, a contagem recomeça
    const fixar = ()=>{ t.fixo = true; p.classList.add("fixo"); };
    p.addEventListener("pointerdown", fixar); p.addEventListener("touchstart", fixar, { passive:true });
  },
  pararTimer(){ if(this._t){ cancelAnimationFrame(this._t.raf); this._t = null; } },

  desenharPainel(){
    const p = document.getElementById("alert-panel"); if(!p) return;
    const grupos = this.coletar(), n = grupos.reduce((s,g)=>s+g.itens.length,0);
    const ic = (nome, t)=> Icons.svg(nome, t||18);
    p.innerHTML = `<i class="ap-bub b1"></i><i class="ap-bub b2"></i><i class="ap-bub b3"></i>
      <div class="ap-in">
        <div class="ap-hd"><span class="ap-hic">${ic("bell",18)}</span><div class="ap-ht"><strong>Alertas</strong><small>${n ? n+" pendente(s)" : "Tudo em dia"}</small></div>
          <button type="button" class="ap-ib" id="ap-cfg" title="Configurar alertas" aria-label="Configurar alertas">${ic("settings",18)}</button>
          <button type="button" class="ap-ib" id="ap-x" title="Fechar" aria-label="Fechar">${ic("x",18)}</button></div>
        <div class="ap-body">${grupos.length ? grupos.map(g=>`
          <section class="ap-g" style="--c:${g.cor}">
            <div class="ap-gh"><span class="ap-gi">${ic(g.icone,16)}</span><span class="ap-gn">${this.h(g.nome)}</span><span class="ap-gc">${g.itens.length}</span></div>
            ${g.itens.slice(0,30).map(i=>`<div class="ap-it${i.urgente?" urg":""}" data-k="${this.h(i.key)}" ${i.codKey?`data-cod="${this.h(i.codKey)}"`:""}>
              <div class="ap-tx"><strong>${this.h(i.titulo)}</strong><span>${this.h(i.texto)}</span></div>
              <div class="ap-ac">
                ${i.concluir?`<button type="button" class="ap-ib sm" data-a="ok" title="Marcar como feito">${ic("check",16)}</button>`:""}
                <button type="button" class="ap-ib sm" data-a="desc" title="Descartar este aviso">${ic("x",16)}</button>
                <button type="button" class="ap-ib sm" data-a="veto" title="Não mostrar mais este alerta para esta pessoa">${ic("eyeoff",16)}</button>
              </div></div>`).join("")}
            ${g.itens.length>30?`<div class="ap-mais">+ ${g.itens.length-30} outros</div>`:""}
          </section>`).join("") : `<div class="ap-vazio">${ic("check",28)}<span>Nenhum alerta no momento.</span></div>`}</div>
        <div class="ap-timer"><i></i></div>
      </div>`;
    p.querySelector("#ap-x").onclick = ()=> this.fechar();
    p.querySelector("#ap-cfg").onclick = ()=> this.abrirConfig();
    const porKey = {}; grupos.forEach(g=> g.itens.forEach(i=>{ porKey[i.key] = i; }));
    p.querySelectorAll(".ap-it").forEach(el=>{
      const i = porKey[el.dataset.k]; if(!i) return;
      el.addEventListener("click", (e)=>{
        const b = e.target.closest("[data-a]");
        if(b){ e.stopPropagation(); this.acao(b.dataset.a, i); return; }
        if(i.ir){ this.fechar(); try{ i.ir(); }catch(err){} return; }
        if(i.codKey && window.FeedbackAdv){ this.fechar(); FeedbackAdv.abrirFuncionario(i.codKey); }
      });
    });
  },

  async acao(a, i){
    if(a === "desc"){ this.prefs.descartados[i.key] = i.sig; this.salvarPrefs(); toast("Aviso descartado. Volta a aparecer se a situação mudar."); }
    else if(a === "veto"){
      if(!confirm(`Não mostrar mais este alerta para "${i.titulo}"?\n\nVocê pode desfazer em Alertas > configurações.`)) return;
      if(!this.prefs.vetos.includes(i.veto)) this.prefs.vetos.push(i.veto);
      this.salvarPrefs(); toast("Alerta vetado para esta pessoa.");
    }else if(a === "ok" && i.concluir){
      try{
        const r = await Api.call({ acao:"alertas_concluir", id:i.concluir.id, ciclo:i.concluir.ciclo });
        if(!r || !r.ok) throw new Error((r && r.erro) || "Não foi possível concluir.");
        this.cfg.feitos = r.feitos || this.cfg.feitos; toast("Marcado como feito.");
      }catch(e){ toast(e.message, "error"); return; }
    }
    this.atualizarBadge();
  },

  /* ---------------------------------------------------------------- */
  /* abrir automaticamente ao entrar no painel                          */
  /* ---------------------------------------------------------------- */
  async aoEntrar(){
    if(this._noEntrar) return; this._noEntrar = true;
    await this.carregar();
    let n = 0; while(document.body.classList.contains("locked") && n++ < 120) await new Promise(r=>setTimeout(r,500));
    await new Promise(r=>setTimeout(r,900));
    this.atualizarBadge();
    if(this.cfg.abrirAoEntrar !== false && this.total() > 0 && !document.getElementById("alert-panel")) this.abrir(true);
    this.notificar(this.total(), true);
    this.iniciarVigia();
  },

  /* notificação do navegador (precisa ser permitida pela pessoa em Configurar alertas) */
  pedirNotificacao(){ try{ if(window.Notification && Notification.permission === "default") return Notification.requestPermission(); }catch(e){} },
  async notificar(n, entrada, titulo, corpo){
    try{
      if(!window.Notification || Notification.permission !== "granted" || (document.hasFocus() && !titulo && !entrada)) return;
      if(!titulo && !n) return;
      const op = { body: corpo || `${n} alerta(s) pendente(s)`, tag: titulo ? "nucleo-chamada" : "nucleo-alertas", icon: "icon-192.png", data:{ url:"./" } };
      const reg = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
      if(reg) await reg.showNotification(titulo || "Núcleo Reposição", op);       // único jeito aceito no Android
      else new Notification(titulo || "Núcleo Reposição", op);
    }catch(e){}
  },

  /* push no celular: o aparelho se inscreve e o servidor (Apps Script + Cloudflare Worker) envia mesmo com o app fechado */
  b64Bytes(s){ s = s.replace(/-/g,"+").replace(/_/g,"/"); while(s.length%4) s += "="; const b = atob(s), o = new Uint8Array(b.length); for(let i=0;i<b.length;i++) o[i] = b.charCodeAt(i); return o; },
  pushSuportado(){ return "serviceWorker" in navigator && "PushManager" in window && !!window.Notification; },
  async pushEstado(){
    const e = { suportado:this.pushSuportado(), ativoServidor:false, aparelho:false, negado:false, aparelhos:0, ios:/iphone|ipad|ipod/i.test(navigator.userAgent), instalado:(window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true };
    try{ const r = await Api.call({ acao:"push_chave" }); if(r && r.ok){ e.ativoServidor = !!r.ativo; e.aparelhos = r.aparelhos||0; e.publica = r.publica; } }catch(x){}
    if(e.suportado){
      e.negado = Notification.permission === "denied";
      try{ const reg = await navigator.serviceWorker.getRegistration(); const sub = reg && await reg.pushManager.getSubscription(); e.aparelho = !!sub; }catch(x){}
    }
    return e;
  },
  async desenharPush(el){
    if(!el) return;
    el.innerHTML = `<div class="ac-line"><small>Verificando notificações no celular...</small></div>`;
    const e = await this.pushEstado(); if(!document.body.contains(el)) return;
    let msg, acoes = "";
    if(!e.suportado) msg = e.ios && !e.instalado ? "No iPhone, instale o aplicativo na tela inicial (Compartilhar > Adicionar à Tela de Início) e abra por lá para ativar." : "Este navegador não permite notificações push.";
    else if(!e.ativoServidor) msg = "O servidor de notificações ainda não foi configurado (veja as instruções de implantação do push).";
    else if(e.negado) msg = "As notificações estão bloqueadas neste aparelho. Libere nas configurações do navegador/aplicativo.";
    else if(e.aparelho){ msg = "Este aparelho está recebendo os alertas."; acoes = `<button type="button" class="btn btn-ghost" id="ac-ptest">Enviar teste</button><button type="button" class="btn btn-ghost" id="ac-poff">Desativar</button>`; }
    else if(e.ios && !e.instalado) msg = "No iPhone, instale o aplicativo na tela inicial e abra por lá para ativar.";
    else{ msg = "Receba os alertas no celular, mesmo com o aplicativo fechado."; acoes = `<button type="button" class="btn btn-primary" id="ac-pon">Ativar neste aparelho</button>`; }
    el.innerHTML = `<h4 class="ac-sec">Notificações no celular</h4><div class="ac-line"><span>${this.h(msg)}</span></div>${acoes?`<div class="ac-line">${acoes}</div>`:""}`;
    const on = el.querySelector("#ac-pon"), off = el.querySelector("#ac-poff"), t = el.querySelector("#ac-ptest");
    if(on) on.onclick = async ()=>{ on.disabled = true; try{ await this.pushAtivar(e.publica); toast("Notificações ativadas neste aparelho."); }catch(x){ toast(x.message, "error"); } this.desenharPush(el); };
    if(off) off.onclick = async ()=>{ off.disabled = true; try{ await this.pushDesativar(); toast("Notificações desativadas neste aparelho."); }catch(x){ toast(x.message, "error"); } this.desenharPush(el); };
    if(t) t.onclick = async ()=>{ t.disabled = true; try{ const r = await Api.call({ acao:"push_teste" }); if(!r || !r.ok) throw new Error((r && r.erro) || "Falhou."); toast("Teste enviado."); }catch(x){ toast(x.message, "error"); } t.disabled = false; };
  },
  async pushAtivar(publica){
    if(!publica) throw new Error("Servidor de notificações não configurado.");
    const perm = await Notification.requestPermission();
    if(perm !== "granted") throw new Error("Permissão de notificação não concedida.");
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if(!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly:true, applicationServerKey:this.b64Bytes(publica) });
    const r = await Api.call({ acao:"push_inscrever", sub: sub.toJSON() });
    if(!r || !r.ok) throw new Error((r && r.erro) || "Não foi possível registrar o aparelho.");
  },
  async pushDesativar(){
    const reg = await navigator.serviceWorker.getRegistration(), sub = reg && await reg.pushManager.getSubscription();
    if(sub){ try{ await Api.call({ acao:"push_remover", endpoint: sub.endpoint }); }catch(e){} await sub.unsubscribe(); }
  },
  /** a cada 2 min confere se saiu chamada nova: abre o painel e avisa (pop-up + notificação) */
  iniciarVigia(){
    if(this._vigia) return;
    const lsk = "nucleo_alertas_chamada_vista_" + this.mat();
    const vista = ()=>{ try{ return localStorage.getItem(lsk)||""; }catch(e){ return ""; } };
    const marcar = ()=>{ const u = (this.eventos||[]).map(e=>e.quando).sort().pop(); if(u){ try{ localStorage.setItem(lsk, u); }catch(e){} } };
    if(!vista()) marcar();
    this._vigia = setInterval(async ()=>{
      if(document.body.classList.contains("locked") || !Api.configured()) return;
      const antes = vista();
      await this.carregar(true);
      this.atualizarBadge();
      const novos = (this.eventos||[]).filter(e=>String(e.quando) > antes);
      if(!novos.length) return;
      marcar();
      if(!this.tiposRecebidos("chamada")) return;
      const e = novos[0], aus = (e.ausentes||[]).length;
      this.notificar(0, false, `Chamada feita por ${e.quem}`, aus ? `${aus} sem presença: ${e.ausentes.slice(0,4).map(x=>x.nome).join(", ")}` : "Todos presentes.");
      if(!document.getElementById("alert-panel")) this.abrir(true);
    }, 120000);
  },
  tiposRecebidos(id){ const t = this.tipo(id); return !!t && this.ativoDe(id) && this.recebe(this.destDe(id, t.padrao)); },

  /* ---------------------------------------------------------------- */
  /* configuração (modal pelo sino e guia Administração > Alertas)     */
  /* ---------------------------------------------------------------- */
  abrirConfig(){
    this.pararTimer();
    UI.openModal(`<div id="ac-modal"><div id="ac-box"></div></div>`);
    this.renderConfig(document.getElementById("ac-box"));
  },
  renderPane(){
    const pane = document.getElementById("pane-alertas"); if(!pane) return;
    this.carregar().then(()=> this.renderConfig(pane));
  },
  destTxt(dest){ if(dest==="*") return "Todos com acesso"; if(dest==="admin") return "Somente o administrador"; const n = (dest||[]).length; return n ? `${n} pessoa(s)` : "Ninguém"; },
  renderConfig(box){
    if(!box) return;
    const adm = this.admin, ic = (n,t)=> Icons.svg(n,t||16);
    const vetos = this.prefs.vetos||[], desc = Object.keys(this.prefs.descartados||{});
    const linhaTipo = (t)=>{ const dest = this.destDe(t.id, t.padrao), ativo = this.ativoDe(t.id);
      return `<div class="ac-row" data-t="${t.id}"><span class="ac-ic" style="--c:${t.cor}">${ic(t.icone)}</span>
        <div class="ac-tx"><strong>${this.h(t.nome)}</strong><small>${this.h(t.desc)}</small></div>
        <button type="button" class="ac-dest" data-a="dest" title="Escolher quem recebe">${this.h(this.destTxt(dest))}</button>
        <label class="ac-sw"><input type="checkbox" data-a="ativo" ${ativo?"checked":""}><span></span></label></div>`; };
    const linhaCustom = (c)=>{ const dest = c.dest === undefined ? "*" : c.dest;
      return `<div class="ac-row" data-c="${this.h(c.id)}"><span class="ac-ic" style="--c:#2f6fce">${ic("clock")}</span>
        <div class="ac-tx"><strong>${this.h(c.nome)}</strong><small>${this.h(this.regraTxt(c.regra))}${c.texto?" · "+this.h(c.texto):""}</small></div>
        <button type="button" class="ac-dest" data-a="dest" title="Escolher quem recebe">${this.h(this.destTxt(dest))}</button>
        <button type="button" class="ap-ib sm" data-a="edit" title="Editar">${ic("pen")}</button>
        <button type="button" class="ap-ib sm" data-a="del" title="Excluir">${ic("trash")}</button>
        <label class="ac-sw"><input type="checkbox" data-a="ativo" ${c.ativo!==false?"checked":""}><span></span></label></div>`; };
    box.innerHTML = `<div class="ac-hd"><h3>Configurar alertas</h3></div>
      ${adm ? `<p class="small-muted">Só você define quais alertas existem e quem recebe cada um. Alterações são salvas ao clicar em Salvar.</p>
        <label class="ac-line"><input type="checkbox" id="ac-entrar" ${this.cfg.abrirAoEntrar!==false?"checked":""}> Abrir o painel de alertas ao entrar</label>
        <div id="ac-push" class="ac-push"></div>
        <h4 class="ac-sec">Alertas do sistema</h4><div class="ac-list">${this.TIPOS.map(linhaTipo).join("")}</div>
        <div class="ac-sec-r"><h4 class="ac-sec">Alertas criados por você</h4><button type="button" class="btn btn-outline btn-sm" id="ac-novo">${ic("plus")} Novo alerta</button></div>
        <div class="ac-list" id="ac-custom">${(this.cfg.custom||[]).map(linhaCustom).join("") || `<div class="small-muted" style="padding:6px 2px">Nenhum alerta criado ainda.</div>`}</div>
        <div id="ac-form"></div>
        <div class="ac-foot"><span class="small-muted" id="ac-msg"></span><button type="button" class="btn btn-primary" id="ac-salvar">Salvar</button></div>`
      : `<p class="small-muted">Os alertas que você recebe são definidos pelo administrador. Aqui você gerencia o que escondeu.</p>`}
      <h4 class="ac-sec">Meus vetos e descartes</h4>
      <div class="ac-list">${vetos.length||desc.length ? vetos.map(v=>`<div class="ac-row"><span class="ac-ic" style="--c:#7a8798">${ic("eyeoff")}</span><div class="ac-tx"><strong>${this.h(this.nomeVeto(v))}</strong><small>Vetado</small></div><button type="button" class="ac-dest" data-v="${this.h(v)}">Restaurar</button></div>`).join("")
        + (desc.length ? `<div class="ac-row"><span class="ac-ic" style="--c:#7a8798">${ic("x")}</span><div class="ac-tx"><strong>${desc.length} aviso(s) descartado(s)</strong><small>Voltam sozinhos quando a situação muda</small></div><button type="button" class="ac-dest" data-limpar="1">Restaurar todos</button></div>` : "")
        : `<div class="small-muted" style="padding:6px 2px">Nada vetado.</div>`}</div>`;
    box.querySelectorAll("[data-v]").forEach(b=> b.onclick = ()=>{ this.prefs.vetos = this.prefs.vetos.filter(x=>x!==b.dataset.v); this.salvarPrefs(); this.atualizarBadge(); this.renderConfig(box); });
    box.querySelectorAll("[data-limpar]").forEach(b=> b.onclick = ()=>{ this.prefs.descartados = {}; this.salvarPrefs(); this.atualizarBadge(); this.renderConfig(box); });
    if(!adm) return;
    const msg = (t, erro)=>{ const m = box.querySelector("#ac-msg"); if(m){ m.textContent = t; m.style.color = erro ? "#c0392b" : ""; } };
    this.desenharPush(box.querySelector("#ac-push"));
    box.querySelector("#ac-entrar").onchange = (e)=>{ this.cfg.abrirAoEntrar = e.target.checked; };
    box.querySelectorAll(".ac-row").forEach(row=>{
      const tid = row.dataset.t, cid = row.dataset.c;
      const alvo = tid ? (this.cfg.tipos[tid] = this.cfg.tipos[tid] || {}) : (this.cfg.custom.find(c=>c.id===cid) || {});
      const sw = row.querySelector('[data-a="ativo"]'); if(sw) sw.onchange = ()=>{ alvo.ativo = sw.checked; };
      const d = row.querySelector('[data-a="dest"]'); if(d) d.onclick = ()=> this.escolherDest(alvo, tid ? (this.tipo(tid).padrao) : "*", ()=> this.renderConfig(box));
      const e = row.querySelector('[data-a="edit"]'); if(e) e.onclick = ()=> this.formCustom(box, alvo);
      const x = row.querySelector('[data-a="del"]'); if(x) x.onclick = ()=>{ if(confirm(`Excluir o alerta "${alvo.nome}"?`)){ this.cfg.custom = this.cfg.custom.filter(c=>c.id!==cid); this.renderConfig(box); } };
    });
    box.querySelector("#ac-novo").onclick = ()=> this.formCustom(box, null);
    box.querySelector("#ac-salvar").onclick = async (ev)=>{
      ev.target.disabled = true; msg("Salvando…");
      try{ await this.salvarCfg(); msg("Salvo."); this.atualizarBadge(); }catch(e){ msg(e.message, true); }
      ev.target.disabled = false;
    };
  },
  nomeVeto(v){ const [t, ...resto] = String(v).split("|"), tp = this.tipo(t), cod = resto[0] || ""; let nome = cod;
    try{ const e = window.FeedbackAdv && FeedbackAdv.porFuncionario().get(cod); if(e && e.nome) nome = e.nome; }catch(e){}
    if(t === "custom"){ const c = (this.cfg.custom||[]).find(x=>x.id===cod); return c ? c.nome : "Alerta"; }
    return (tp ? tp.nome : t) + " — " + nome; },
  regraTxt(r){
    r = r || {};
    if(r.tipo === "mensal") return `Todo mês, a partir do dia ${r.inicio||1}${r.limite?`, prazo dia ${r.limite}`:""}`;
    if(r.tipo === "semanal") return `Toda semana (${["domingo","segunda","terça","quarta","quinta","sexta","sábado"][Number(r.dia)||0]})`;
    return r.data ? `Em ${fmtDateBR(new Date(...String(r.data).split("-").map((n,i)=> i===1?n-1:+n)))}` : "Data única";
  },

  /* escolha de quem recebe */
  escolherDest(alvo, padrao, depois){
    const atual = alvo.dest !== undefined ? alvo.dest : padrao;
    const sel = new Set(Array.isArray(atual) ? atual : []);
    const modo = atual === "*" ? "todos" : (atual === "admin" ? "admin" : "lista");
    const ov = document.createElement("div"); ov.className = "ac-ov";
    ov.innerHTML = `<div class="ac-dlg"><h4>Quem recebe este alerta</h4>
      <label class="ac-line"><input type="radio" name="ac-m" value="todos" ${modo==="todos"?"checked":""}> Todos com acesso ao painel</label>
      <label class="ac-line"><input type="radio" name="ac-m" value="admin" ${modo==="admin"?"checked":""}> Somente eu (administrador)</label>
      <label class="ac-line"><input type="radio" name="ac-m" value="lista" ${modo==="lista"?"checked":""}> Pessoas específicas</label>
      <div class="ac-users" style="${modo==="lista"?"":"display:none"}">${(this.usuarios||[]).map(u=>`<label class="ac-line"><input type="checkbox" data-u="${this.h(u.matricula)}" ${sel.has(u.matricula)?"checked":""}> ${this.h(u.nome||u.matricula)} <small>${this.h(u.matricula)}</small></label>`).join("") || `<div class="small-muted">Lista de usuários indisponível.</div>`}</div>
      <div class="ac-foot"><button type="button" class="btn btn-outline btn-sm" id="acd-x">Cancelar</button><button type="button" class="btn btn-primary btn-sm" id="acd-ok">Aplicar</button></div></div>`;
    document.body.appendChild(ov);
    const lst = ov.querySelector(".ac-users");
    ov.querySelectorAll('input[name="ac-m"]').forEach(r=> r.onchange = ()=>{ lst.style.display = r.value==="lista" && r.checked ? "" : "none"; });
    ov.querySelector("#acd-x").onclick = ()=> ov.remove();
    ov.querySelector("#acd-ok").onclick = ()=>{
      const m = ov.querySelector('input[name="ac-m"]:checked').value;
      alvo.dest = m==="todos" ? "*" : m==="admin" ? "admin" : Array.from(ov.querySelectorAll("[data-u]:checked")).map(x=>x.dataset.u);
      ov.remove(); depois();
    };
  },

  /* criar / editar alerta recorrente */
  formCustom(box, c){
    const f = box.querySelector("#ac-form"), novo = !c;
    c = c || { id:"c"+Date.now().toString(36), nome:"", texto:"", ativo:true, regra:{ tipo:"mensal", inicio:1, limite:0 }, dest:"admin" };
    const r = c.regra || {};
    f.innerHTML = `<div class="ac-form"><h4>${novo?"Novo alerta":"Editar alerta"}</h4>
      <label>Nome<input type="text" id="cf-nome" value="${this.h(c.nome)}" placeholder="Ex.: Enviar resumo de folgas"></label>
      <label>Mensagem<input type="text" id="cf-texto" value="${this.h(c.texto||"")}" placeholder="Detalhe que aparece no alerta"></label>
      <label>Repetição<select id="cf-tipo"><option value="mensal" ${r.tipo==="mensal"?"selected":""}>Todo mês</option><option value="semanal" ${r.tipo==="semanal"?"selected":""}>Toda semana</option><option value="unica" ${r.tipo==="unica"?"selected":""}>Data única</option></select></label>
      <div class="ac-fr" id="cf-mensal"><label>Aparece a partir do dia<input type="number" id="cf-ini" min="1" max="31" value="${r.inicio||1}"></label><label>Prazo (dia do mês)<input type="number" id="cf-lim" min="0" max="31" value="${r.limite||0}" placeholder="0 = sem prazo"></label></div>
      <div class="ac-fr" id="cf-semanal"><label>Dia da semana<select id="cf-dia">${["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"].map((d,i)=>`<option value="${i}" ${Number(r.dia)===i?"selected":""}>${d}</option>`).join("")}</select></label></div>
      <div class="ac-fr" id="cf-unica"><label>Data<input type="date" id="cf-data" value="${this.h(r.data||"")}"></label></div>
      <div class="ac-foot"><button type="button" class="btn btn-outline btn-sm" id="cf-x">Cancelar</button><button type="button" class="btn btn-primary btn-sm" id="cf-ok">${novo?"Adicionar":"Aplicar"}</button></div></div>`;
    const ver = ()=>{ const t = f.querySelector("#cf-tipo").value; ["mensal","semanal","unica"].forEach(k=> f.querySelector("#cf-"+k).style.display = k===t ? "" : "none"); };
    f.querySelector("#cf-tipo").onchange = ver; ver();
    f.querySelector("#cf-x").onclick = ()=>{ f.innerHTML = ""; };
    f.querySelector("#cf-ok").onclick = ()=>{
      const nome = f.querySelector("#cf-nome").value.trim(); if(!nome){ toast("Dê um nome ao alerta.", "error"); return; }
      const tipo = f.querySelector("#cf-tipo").value;
      const regra = tipo==="mensal" ? { tipo, inicio:Number(f.querySelector("#cf-ini").value)||1, limite:Number(f.querySelector("#cf-lim").value)||0 }
        : tipo==="semanal" ? { tipo, dia:Number(f.querySelector("#cf-dia").value)||0 } : { tipo, data:f.querySelector("#cf-data").value };
      if(tipo==="unica" && !regra.data){ toast("Escolha a data.", "error"); return; }
      c.nome = nome; c.texto = f.querySelector("#cf-texto").value.trim(); c.regra = regra;
      if(novo) this.cfg.custom.push(c);
      this.renderConfig(box);
    };
  }
};
window.Alertas = Alertas;
try{ if("serviceWorker" in navigator) navigator.serviceWorker.addEventListener("message", e=>{ if(e.data && e.data.tipo === "abrir-alertas") Alertas.abrir(); }); }catch(e){}

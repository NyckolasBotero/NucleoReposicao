/* =========================================================================
   Núcleo Reposição — Feedbacks e Advertências (Gestão) + Alertas
   Depende de app.js (processed, currentTeam, Charts, Api, UI, helpers de formatação).
   ========================================================================= */
const FB_A_CADA = 3;               // a cada 3 feedbacks por motivo → 1 advertência
const FB_DIAS_SEM_FEEDBACK = 30;   // "sem feedback há mais de N dias"
const FB_DIAS_DESISTENTE = 7;     // faltas seguidas (da 1ª à última) que classificam como desistente
const FB_PROBATORIO_DIAS = 90;     // período probatório
const FB_PROBATORIO_AVISO = 15;    // avisa quando faltam até N dias para acabar o probatório
const FB_SEM_MOTIVO = "SEM MOTIVO";
const FB_ADV_PARA_SUSP = 3;        // 3 advertências no mesmo motivo → solicitar suspensão

const FeedbackAdv = {
  sel: null,            // codKey do funcionário aberto no detalhe (null = lista)
  _prev: null,          // URL do blob da pré-visualização aberta

  /* ------------------------------------------------------------------ */
  /* dados                                                               */
  /* ------------------------------------------------------------------ */
  proc(){ return window.APP_STATE && window.APP_STATE.processed; },
  hoje(){ return dateOnly(new Date()); },
  diasEntre(a, b){ return Math.round((dateOnly(b) - dateOnly(a)) / 86400000); },
  mk(m){ const k = normStr(m||""); return k || FB_SEM_MOTIVO; },
  motivoTxt(m){ return trimStr(m) || "Sem motivo"; },
  nomeDe(codKey, fallback){
    const reg = window.APP_STATE && window.APP_STATE.nameRegistry;
    return (reg && reg.get(codKey)) || fallback || codKey;
  },

  /** Advertências = aba ADVERTÊNCIAS + registros antigos marcados como advertência na aba de feedbacks. */
  advertencias(){
    const p = this.proc(); if(!p) return [];
    const novas = (p.advertencias||[]).map(r=>({ ...r, legado:false }));
    const velhas = (p.feedback||[]).filter(r=>r.isAdvertencia && r.data && r.codKey)
      .map(r=>({ data:r.data, cod:r.cod, nome:r.nome, codKey:r.codKey, motivo:r.motivo||"", resumo:r.resumo, anexo:r.anexo||"", aplicador:r.aplicador||"", legado:true }));
    return novas.concat(velhas);
  },
  feedbacks(){ const p = this.proc(); return p ? (p.feedback||[]).filter(r=>r.data) : []; },
  /** suspensões disciplinares lançadas em Lançar Suspensão (aba SUSPENSÕES) */
  suspensoesDisc(){ const p = this.proc(); return p ? (p.suspensoesDisc||[]).filter(r=>r.data && r.codKey) : []; },
  /** feedbacks necessários para 1 advertência: 2 nos motivos de NC, 3 nos demais */
  fbPorAdv(chave){ return (typeof NC!=="undefined" && NC.ehMotivo(chave)) ? NC_FB_PARA_ADV : FB_A_CADA; },

  suspensoes(){
    const p = this.proc(); const m = new Map(); if(!p) return m;
    (p.quadro||[]).forEach(r=>{ if(r.bucket==="SUSPENSAO") m.set(r.codKey, (m.get(r.codKey)||0)+1); });
    return m;
  },

  /** Mapa codKey → resumo do funcionário (feedbacks, advertências, motivos, farol...). */
  porFuncionario(feedbacks){
    const fbs = feedbacks || this.feedbacks(), ads = this.advertencias(), susp = this.suspensoes();
    const map = new Map(), sd = this.suspensoesDisc();
    const get = (codKey, nome, cod)=>{
      if(!map.has(codKey)) map.set(codKey, { codKey, nome:this.nomeDe(codKey, nome), cod:cod||"", feedbacks:[], adv:[], suspD:[], susp:susp.get(codKey)||0 });
      return map.get(codKey);
    };
    fbs.forEach(r=>{ if(r.codKey) get(r.codKey, r.nome, r.cod).feedbacks.push(r); });
    ads.forEach(r=>{ if(r.codKey) get(r.codKey, r.nome, r.cod).adv.push(r); });
    sd.forEach(r=>{ if(r.codKey) get(r.codKey, r.nome, r.cod).suspD.push(r); });
    // equipe atual sem nenhum registro também entra (para mostrar "sem feedback há X dias")
    const ct = window.APP_STATE && window.APP_STATE.currentTeam;
    if(ct) ct.members.forEach(m=>{ if(m.cargo!=="LIDER") get(m.codKey, m.nome, m.codigo); });
    map.forEach(e=>{
      e.feedbacks.sort((a,b)=>b.data-a.data); e.adv.sort((a,b)=>b.data-a.data); e.suspD.sort((a,b)=>b.data-a.data);
      e.ultFb = e.feedbacks.length ? e.feedbacks[0].data : null;
      e.ultAdv = e.adv.length ? e.adv[0].data : null;
      e.diasSemFb = e.ultFb ? this.diasEntre(e.ultFb, this.hoje()) : null;
      e.diasSemAdv = e.ultAdv ? this.diasEntre(e.ultAdv, this.hoje()) : null;
      e.motivos = this.motivosDe(e);
      e.pendentes = e.motivos.reduce((n,m)=>n+m.pend+m.suspPend, 0);
      e.farol = e.pendentes>0 ? "red" : (e.motivos.some(m=>m.fb - this.fbPorAdv(m.chave)*m.adv === this.fbPorAdv(m.chave)-1) ? "yellow" : "green");
    });
    return map;
  },

  motivosDe(e){
    const m = new Map();
    const get = (k, txt)=>{ if(!m.has(k)) m.set(k, { chave:k, motivo:txt, fb:0, adv:0, susp:0 }); return m.get(k); };
    e.feedbacks.forEach(r=>{ get(this.mk(r.motivo), this.motivoTxt(r.motivo)).fb++; });
    e.adv.forEach(r=>{ get(this.mk(r.motivo), this.motivoTxt(r.motivo)).adv++; });
    (e.suspD||[]).forEach(r=>{ get(this.mk(r.motivo), this.motivoTxt(r.motivo)).susp++; });
    return Array.from(m.values()).map(x=>{
      const sem = x.chave===FB_SEM_MOTIVO, k = this.fbPorAdv(x.chave);
      return { ...x, porAdv:k,
        pend: sem ? 0 : Math.max(0, Math.floor(x.fb/k) - x.adv),
        faltam: sem ? null : (k - ((x.fb - k*x.adv) % k)),            // feedbacks até a próxima advertência
        suspPend: sem ? 0 : Math.max(0, Math.floor(x.adv/FB_ADV_PARA_SUSP) - x.susp),
        faltamSusp: sem ? null : (FB_ADV_PARA_SUSP - ((x.adv - FB_ADV_PARA_SUSP*x.susp) % FB_ADV_PARA_SUSP)) };   // advertências até a próxima suspensão
    }).sort((a,b)=> (b.suspPend-a.suspPend) || b.pend-a.pend || b.fb-a.fb);
  },
  farolHtml(f){
    const cor = f==="red" ? "#d64545" : f==="yellow" ? "#e0a81f" : "#1a9c62";
    const txt = f==="red" ? "Advertir" : f==="yellow" ? "Atenção" : "Ok";
    return `<span style="display:inline-flex;align-items:center;gap:5px;font-weight:700;color:${cor}"><span style="width:11px;height:11px;border-radius:50%;background:${cor};display:inline-block"></span>${txt}</span>`;
  },

  /** Contagem de feedbacks/advertências já registrados de uma matrícula (usado ao lançar advertência). */
  statsPorMatricula(mat){
    const p = this.proc(); if(!p) return null;
    const key = normStr(String(mat||"").trim()); if(!key) return null;
    const e = this.porFuncionario().get(key);
    return e || { feedbacks:[], adv:[], motivos:[] };
  },

  /* ------------------------------------------------------------------ */
  /* alertas                                                             */
  /* ------------------------------------------------------------------ */
  feriasConflitos(){
    const p = this.proc(); if(!p) return [];
    const f = (p.feriasAgendadas||[]).filter(x=>!x.cancelada && dateOnly(x.fim) >= this.hoje());
    const grupos = [];
    for(let i=0;i<f.length;i++) for(let j=i+1;j<f.length;j++){
      const a = f[i], b = f[j];
      if(a.codKey!==b.codKey && a.ini<=b.fim && b.ini<=a.fim) grupos.push({ a, b });
    }
    return grupos;
  },

  /** Quem fica de fora dos alertas: ENCOSTADO / FALTANTES (TIPO no Quadro) e DESISTENTE (falta na chamada por mais de 1 semana seguida, sem voltar). */
  dispensados(){
    const p = this.proc(), out = new Map(); if(!p) return out;
    (p.turnover||[]).forEach(t=>{
      const tp = normStr(t.tipo||"");
      if(t.codKey && (tp.includes("encost") || tp.includes("faltante"))) out.set(t.codKey, tp.includes("encost") ? "Encostado" : "Faltante");
    });
    const porPessoa = new Map();
    (p.quadro||[]).forEach(r=>{ if(r.codKey && r.data){ if(!porPessoa.has(r.codKey)) porPessoa.set(r.codKey, []); porPessoa.get(r.codKey).push(r); } });
    porPessoa.forEach((rows, k)=>{
      if(out.has(k)) return;
      rows.sort((a,b)=>b.data-a.data);
      if(rows[0].bucket!=="FALTA") return;
      let i = 0; while(i+1<rows.length && rows[i+1].bucket==="FALTA") i++;
      if(this.diasEntre(rows[i].data, rows[0].data) >= FB_DIAS_DESISTENTE) out.set(k, "Desistente");
    });
    return out;
  },

  alertas(){
    const p = this.proc(), ct = window.APP_STATE && window.APP_STATE.currentTeam;
    if(!p) return { probatorio:[], advertir:[], suspender:[], semFeedback:[], ferias:[], ncFb:[], ncAdv:[], total:0 };
    const hoje = this.hoje();
    const fora = this.dispensados();
    const probatorio = (p.turnover||[]).filter(t=>t.ativo && t.dtAdm && !fora.has(t.codKey)).map(t=>{
      const dias = this.diasEntre(t.dtAdm, hoje), restam = FB_PROBATORIO_DIAS - dias;
      const fim = new Date(t.dtAdm.getFullYear(), t.dtAdm.getMonth(), t.dtAdm.getDate()+FB_PROBATORIO_DIAS);
      return { nome:t.nome, codKey:t.codKey, restam, fim };
    }).filter(x=>x.restam>=0 && x.restam<=FB_PROBATORIO_AVISO).sort((a,b)=>a.restam-b.restam);

    const func = this.porFuncionario();
    const ativos = ct ? ct.codes : null;
    const advertir = [], suspender = [], semFeedback = [];
    func.forEach(e=>{
      if(ativos && !ativos.has(e.codKey)) return;
      if(fora.has(e.codKey)) return;
      // motivos de NC têm alerta próprio (com as ocorrências) — não duplica aqui
      e.motivos.filter(m=>m.pend>0 && !(typeof NC!=="undefined" && NC.ehMotivo(m.chave))).forEach(m=> advertir.push({ codKey:e.codKey, nome:e.nome, motivo:m.motivo, fb:m.fb, adv:m.adv, pend:m.pend }));
      e.motivos.filter(m=>m.suspPend>0).forEach(m=>{
        const ultS = e.suspD.filter(r=>this.mk(r.motivo)===m.chave).map(r=>r.data).sort((a,b)=>b-a)[0];
        const ocorr = e.adv.filter(r=>this.mk(r.motivo)===m.chave && (!ultS || dateOnly(r.data) > dateOnly(ultS))).sort((a,b)=>a.data-b.data);
        suspender.push({ codKey:e.codKey, cod:e.cod, nome:e.nome, motivo:m.motivo, adv:m.adv, susp:m.susp, pend:m.suspPend, ocorr });
      });
      if(e.diasSemFb===null || e.diasSemFb>FB_DIAS_SEM_FEEDBACK) semFeedback.push({ codKey:e.codKey, nome:e.nome, dias:e.diasSemFb });
    });
    advertir.sort((a,b)=>b.pend-a.pend);
    semFeedback.sort((a,b)=>(b.dias===null?1e9:b.dias)-(a.dias===null?1e9:a.dias));
    const ferias = this.feriasConflitos();
    const nc = (typeof NC!=="undefined") ? NC.alertas() : { feedback:[], advertencia:[] };
    return { probatorio, advertir, suspender, semFeedback, ferias, ncFb:nc.feedback, ncAdv:nc.advertencia,
      total: probatorio.length + advertir.length + suspender.length + semFeedback.length + ferias.length + nc.feedback.length + nc.advertencia.length };
  },

  atualizarAlertas(){
    let n = 0;
    try{ n = this.alertas().total; }catch(e){ n = 0; }
    ["hdr-alertas-n","sb-alertas-n","dr-alertas-n"].forEach(id=>{
      const el = document.getElementById(id); if(!el) return;
      el.textContent = n>99 ? "99+" : String(n); el.style.display = n ? "" : "none";
    });
  },

  abrirAlertas(){
    if(!window.APP_STATE || !window.APP_STATE.ready){ toast("Carregue os dados primeiro (Atualizar dados) para ver os alertas.", "error"); return; }
    const a = this.alertas();
    const sec = (titulo, cor, linhas, vazio)=> `<div style="margin:14px 0 6px;font-weight:800;color:${cor}">${titulo} <span class="small-muted">(${linhas.length})</span></div>` +
      (linhas.length ? `<div style="display:flex;flex-direction:column;gap:6px">${linhas.join("")}</div>` : `<div class="small-muted">${vazio}</div>`);
    const lin = (html, codKey)=> `<div style="border:1px solid var(--gray-200);border-radius:8px;padding:8px 10px;font-size:13px;${codKey?"cursor:pointer;":""}" ${codKey?`onclick="UI.closeModal();FeedbackAdv.abrirFuncionario('${escapeHtml(codKey)}')"`:""}>${html}</div>`;
    UI.openModal(`
      <h3 style="margin-top:0">Alertas</h3>
      ${sec("⛔ Solicitar suspensão ("+FB_ADV_PARA_SUSP+" advertências no mesmo motivo)", "#8e1b1b", (a.suspender||[]).map(x=>lin(`<strong>${escapeHtml(x.nome)}</strong> — ${escapeHtml(x.motivo)}: ${x.adv} advertência(s), ${x.susp} suspensão(ões) → <strong>${x.pend} a emitir</strong>`, x.codKey)), "Ninguém com "+FB_ADV_PARA_SUSP+" advertências sem suspensão no mesmo motivo.")}
      ${sec("⚠️ NC recorrente — gerar advertência ("+NC_FB_PARA_ADV+" feedbacks no mesmo motivo)", "#d64545", (a.ncAdv||[]).map(x=>lin(`<strong>${escapeHtml(x.nome)}</strong> — ${escapeHtml(x.label)}: ${x.fb} feedback(s), ${x.adv} advertência(s) → <strong>${x.pend} a emitir</strong>`, x.codKey)), "Nenhuma NC recorrente pedindo advertência.")}
      ${sec("⚠️ NC recorrente — gerar feedback ("+NC_POR_FB+" NCs no mesmo motivo)", "#e08a1f", (a.ncFb||[]).map(x=>lin(`<strong>${escapeHtml(x.nome)}</strong> — ${escapeHtml(x.label)}: <strong>${x.ncs} NCs</strong> desde ${fmtDateBR(x.desdeData)}`, x.codKey)), "Ninguém com "+NC_POR_FB+" NCs no mesmo motivo.")}
      ${sec("🔴 Precisam de advertência (3 feedbacks no mesmo motivo)", "#d64545", a.advertir.map(x=>lin(`<strong>${escapeHtml(x.nome)}</strong> — ${escapeHtml(x.motivo)}: ${x.fb} feedback(s), ${x.adv} advertência(s) → <strong>${x.pend} advertência(s) a emitir</strong>`, x.codKey)), "Ninguém atingiu 3 feedbacks sem advertência no mesmo motivo.")}
      ${sec("⏳ Período probatório acabando (até "+FB_PROBATORIO_AVISO+" dias)", "#e08a1f", a.probatorio.map(x=>lin(`<strong>${escapeHtml(x.nome)}</strong> — termina em ${fmtDateBR(x.fim)} (${x.restam===0?"hoje":"faltam "+x.restam+" dia(s)"})`, x.codKey)), "Nenhum probatório vencendo nos próximos dias.")}
      ${sec("📝 Sem feedback há mais de "+FB_DIAS_SEM_FEEDBACK+" dias", "#2f6fce", a.semFeedback.slice(0,40).map(x=>lin(`<strong>${escapeHtml(x.nome)}</strong> — ${x.dias===null?"nunca recebeu feedback":x.dias+" dias sem feedback"}`, x.codKey)), "Toda a equipe recebeu feedback recentemente.") + (a.semFeedback.length>40 ? `<div class="small-muted">+ ${a.semFeedback.length-40} outros na tabela da aba.</div>` : "")}
      ${sec("🏖️ Férias no mesmo período", "#9c6ade", a.ferias.map(g=>lin(`<strong>${escapeHtml(g.a.nome)}</strong> (${fmtDateBR(g.a.ini)} a ${fmtDateBR(g.a.fim)}) e <strong>${escapeHtml(g.b.nome)}</strong> (${fmtDateBR(g.b.ini)} a ${fmtDateBR(g.b.fim)})`)), "Nenhuma sobreposição de férias agendadas.")}
    `);
  },

  /* ------------------------------------------------------------------ */
  /* documentos (PDF / imagem) — ver sem baixar e baixar                  */
  /* ------------------------------------------------------------------ */
  async buscarAnexo(url){
    if(!Api.configured()) throw new Error("Visualização de documentos exige o servidor (Apps Script) configurado.");
    const r = await Api.call({ acao:"lanc_anexo_ler", ref:url });
    if(!r || !r.ok) throw new Error((r && r.erro) || "Não foi possível abrir o documento.");
    const bin = atob(r.base64), bytes = new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
    return { nome:r.nome, mime:r.mime, blob:new Blob([bytes], { type:r.mime }) };
  },
  async verAnexo(url, titulo){
    this.fecharAnexo();
    const ov = document.createElement("div"); ov.id = "anexo-ov";
    ov.style.cssText = "position:fixed;inset:0;z-index:2500;background:rgba(7,20,40,.92);display:flex;flex-direction:column;";
    ov.innerHTML = `<div style="display:flex;gap:8px;align-items:center;padding:calc(10px + env(safe-area-inset-top)) 14px 10px;background:#073A7C;color:#fff">
        <div style="flex:1;font-weight:700;font-size:14px">${escapeHtml(titulo||"Documento")}</div>
        <button class="btn btn-ghost btn-sm" id="anexo-dl" disabled>Baixar</button>
        <button class="btn btn-ghost btn-sm" id="anexo-x">Fechar</button></div>
      <div id="anexo-corpo" style="flex:1;min-height:0;display:flex;align-items:center;justify-content:center;color:#fff;padding:8px">Carregando documento...</div>`;
    document.body.appendChild(ov);
    ov.querySelector("#anexo-x").onclick = ()=> this.fecharAnexo();
    try{
      const a = await this.buscarAnexo(url);
      if(!document.getElementById("anexo-ov")) return;
      this._prev = URL.createObjectURL(a.blob);
      const corpo = ov.querySelector("#anexo-corpo");
      corpo.style.padding = "0";
      if(/^image\//.test(a.mime)) corpo.innerHTML = `<img src="${this._prev}" style="max-width:100%;max-height:100%;object-fit:contain;background:#fff">`;
      else corpo.innerHTML = `<iframe src="${this._prev}" title="Documento" style="width:100%;height:100%;border:0;background:#fff"></iframe>`;
      const dl = ov.querySelector("#anexo-dl"); dl.disabled = false;
      dl.onclick = ()=> this.salvarBlob(this._prev, a.nome);
    }catch(e){
      const corpo = document.getElementById("anexo-corpo");
      if(corpo) corpo.innerHTML = `<div style="max-width:420px;text-align:center">${escapeHtml(e.message)}</div>`;
    }
  },
  fecharAnexo(){
    const ov = document.getElementById("anexo-ov"); if(ov) ov.remove();
    if(this._prev){ try{ URL.revokeObjectURL(this._prev); }catch(e){} this._prev = null; }
  },
  salvarBlob(url, nome){
    const a = document.createElement("a"); a.href = url; a.download = nome || "documento"; document.body.appendChild(a); a.click(); a.remove();
  },
  async baixarAnexo(url){
    try{ toast("Baixando documento..."); const a = await this.buscarAnexo(url); const u = URL.createObjectURL(a.blob); this.salvarBlob(u, a.nome); setTimeout(()=>URL.revokeObjectURL(u), 4000); }
    catch(e){ toast(e.message, "error"); }
  },
  /** Botões 👁 / ⬇ de um registro (url vazia = sem documento). */
  botoesAnexo(url, titulo){
    if(!url) return `<span class="small-muted">sem documento</span>`;
    const u = escapeHtml(url).replace(/'/g, "&#39;"), t = escapeHtml(titulo).replace(/'/g, "&#39;");
    return `<button type="button" class="btn btn-outline btn-sm" title="Ver sem baixar" aria-label="Ver sem baixar" onclick="event.stopPropagation();FeedbackAdv.verAnexo('${u}','${t}')">${Icons.svg("eye",16)}</button>
      <button type="button" class="btn btn-outline btn-sm" title="Baixar" aria-label="Baixar" onclick="event.stopPropagation();FeedbackAdv.baixarAnexo('${u}')">${Icons.svg("download",16)}</button>`;
  },

  /* ------------------------------------------------------------------ */
  /* períodos e séries                                                    */
  /* ------------------------------------------------------------------ */
  contar(lista, ini, fim){
    const i = dateOnly(ini), f = dateOnly(fim);
    return lista.filter(r=>{ const d = dateOnly(r.data); return d>=i && d<=f; }).length;
  },
  periodos(){
    const h = this.hoje(), y = h.getFullYear(), m = h.getMonth();
    const mov = (n)=> new Date(y, m-n, h.getDate()+1);       // janela móvel de n meses terminando hoje
    return [
      { id:"mes",   rot:"Mês atual",       ini:new Date(y,m,1),    fim:h, sub:fmtDateBR(new Date(y,m,1))+" a "+fmtDateBR(h) },
      { id:"ant",   rot:"Mês anterior",    ini:new Date(y,m-1,1),  fim:new Date(y,m,0), sub:fmtDateBR(new Date(y,m-1,1))+" a "+fmtDateBR(new Date(y,m,0)) },
      { id:"m3",    rot:"Últimos 3 meses", ini:mov(3),  fim:h, sub:fmtDateBR(mov(3))+" a "+fmtDateBR(h) },
      { id:"m6",    rot:"Últimos 6 meses", ini:mov(6),  fim:h, sub:fmtDateBR(mov(6))+" a "+fmtDateBR(h) },
      { id:"ano",   rot:"Último ano",      ini:mov(12), fim:h, sub:fmtDateBR(mov(12))+" a "+fmtDateBR(h) }
    ];
  },
  serieMensal(fbs, ads, meses){
    const h = this.hoje(), labels = [], f = [], a = [];
    const nomes = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    for(let i=meses-1;i>=0;i--){
      const ini = new Date(h.getFullYear(), h.getMonth()-i, 1), fim = new Date(h.getFullYear(), h.getMonth()-i+1, 0);
      labels.push(nomes[ini.getMonth()]+"/"+String(ini.getFullYear()).slice(2));
      f.push(this.contar(fbs, ini, fim)); a.push(this.contar(ads, ini, fim));
    }
    return { labels, f, a };
  },

  /* ------------------------------------------------------------------ */
  /* lista (tela principal)                                               */
  /* ------------------------------------------------------------------ */
  abrirFuncionario(codKey){
    this.sel = codKey;
    if(UI.currentPane!=="feedbacks" || UI.currentView!=="gestao") UI.goTo("gestao","feedbacks");
    else renderFeedbacksContent();
  },
  voltar(){ this.sel = null; renderFeedbacksContent(); },

  render(){
    if(this.sel) return this.renderDetalhe(this.sel);
    const filt = getFeedbackFiltered();
    const fbsAll = this.feedbacks(), adsAll = this.advertencias();
    const registry = window.APP_STATE.nameRegistry;

    // ---- cards fixos por período ----
    const per = this.periodos();
    const cardsPer = per.map(p=>{
      const f = this.contar(fbsAll, p.ini, p.fim), a = this.contar(adsAll, p.ini, p.fim);
      return `<div class="card"><div class="card-label">${p.rot}</div><div class="card-value">${fmtNum(f)}</div>
        <div class="small-muted" style="margin-top:2px">feedback(s)${a?` · <span style="color:#d64545;font-weight:700">${a} advert.</span>`:""}</div>
        <div class="small-muted" style="font-size:10.5px">${p.sub}</div></div>`;
    }).join("");

    // ---- cards do filtro ----
    const pessoal = filt.filter(r=>r.avPessoal!==null).map(r=>r.avPessoal), gestor = filt.filter(r=>r.avGestor!==null).map(r=>r.avGestor);
    const adsFiltro = adsAll.filter(r=>this.noFiltro(r.data));

    // ---- tabela por funcionário ----
    const func = this.porFuncionario(filt);
    // advertências do período filtrado para a coluna "Advertências" (a farol usa o histórico completo)
    const fullFunc = this.porFuncionario();
    const rows = Array.from(func.values()).map(e=>{
      const full = fullFunc.get(e.codKey) || e;
      const advF = adsFiltro.filter(r=>r.codKey===e.codKey).length;
      const mg = e.feedbacks.filter(r=>r.avGestor!==null).map(r=>r.avGestor), mp = e.feedbacks.filter(r=>r.avPessoal!==null).map(r=>r.avPessoal);
      const mG = mg.length ? avg(mg) : null, mP = mp.length ? avg(mp) : null;
      return { e, full, advF, mG, mP, mGeral: (mG!==null && mP!==null) ? (mG+mP)/2 : (mG!==null?mG:mP) };
    }).filter(x=> x.e.feedbacks.length || x.advF || (window.APP_STATE.currentTeam && window.APP_STATE.currentTeam.codes.has(x.e.codKey)))
      .sort((a,b)=> (a.full.farol==="red"?0:a.full.farol==="yellow"?1:2) - (b.full.farol==="red"?0:b.full.farol==="yellow"?1:2) || b.e.feedbacks.length - a.e.feedbacks.length);

    const serie = this.serieMensal(fbsAll, adsAll, 12);
    const ins = this.insights(fullFunc);

    const clsTag = (c)=> c ? `<span class="tag-${c.cls==='pos'?'pos':c.cls==='neg'?'neg':'warn'}">${c.label}</span>` : "-";
    $("#fb-content").innerHTML = `
      <div class="cards-grid">${cardsPer}</div>

      <div class="cards-grid">
        <div class="card"><div class="card-label">Média Av. Gestor</div><div class="card-value">${gestor.length?fmtNum(avg(gestor),1):"-"}</div></div>
        <div class="card"><div class="card-label">Média Av. Pessoal</div><div class="card-value">${pessoal.length?fmtNum(avg(pessoal),1):"-"}</div></div>
        <div class="card"><div class="card-label">Feedbacks no filtro</div><div class="card-value">${fmtNum(filt.length)}</div></div>
        <div class="card ${adsFiltro.length?'neg':''}"><div class="card-label">Advertências no filtro</div><div class="card-value ${adsFiltro.length?'neg':''}">${fmtNum(adsFiltro.length)}</div></div>
        <div class="card"><div class="card-label">Funcionários avaliados</div><div class="card-value">${fmtNum(uniq(filt.map(r=>r.codKey)).length)}</div></div>
      </div>

      <div class="panel">
        <div class="panel-header"><h3>Histórico de feedbacks e advertências (12 meses)</h3></div>
        <div class="chart-wrap"><canvas id="chart-fbadv-linha"></canvas></div>
      </div>

      <div class="panel">
        <div class="panel-header"><h3>Tabela de Feedbacks e Advertências</h3><span class="panel-note">Clique no funcionário para ver todos os feedbacks, advertências e documentos</span></div>
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Funcionário</th><th>Data Ult. Feedback</th><th>Feedbacks</th><th>Advertências</th><th>Suspensões</th><th>Média Geral</th><th>Av. Pessoal</th><th>Av. Gestor</th><th>Classificação</th><th>Farol</th></tr></thead>
          <tbody>
            ${rows.length ? rows.map(x=>`<tr class="clickable" onclick="FeedbackAdv.abrirFuncionario('${escapeHtml(x.e.codKey)}')">
              <td><strong>${escapeHtml(x.e.nome)}</strong></td>
              <td>${x.e.ultFb ? fmtDateBR(x.e.ultFb) : '<span class="small-muted">sem feedback</span>'}</td>
              <td>${x.e.feedbacks.length}</td>
              <td class="${x.advF>0?'cell-neg':''}">${x.advF}</td>
              <td class="${x.full.susp>0?'cell-neg':''}">${x.full.susp}</td>
              <td>${x.mGeral!==null?fmtNum(x.mGeral,1):'-'}</td><td>${x.mP!==null?fmtNum(x.mP,1):'-'}</td><td>${x.mG!==null?fmtNum(x.mG,1):'-'}</td>
              <td>${clsTag(Feedback.classify(x.mG))}</td>
              <td>${this.farolHtml(x.full.farol)}</td>
            </tr>`).join("") : '<tr><td colspan="10" class="small-muted">Nenhum registro no período selecionado.</td></tr>'}
          </tbody>
        </table></div>
      </div>

      ${typeof NC!=="undefined" ? NC.htmlResumoFeedbacks() : ""}
      ${this.htmlInsights(ins)}
      ${renderFeedbackRankingPanel()}
    `;

    Charts.make("chart-fbadv-linha", {
      type:"line",
      data:{ labels:serie.labels, datasets:[
        { label:"Feedbacks", data:serie.f, borderColor:Charts.colors.blue, backgroundColor:Charts.colors.blue+"22", tension:.25, fill:true, pointRadius:4 },
        { label:"Advertências", data:serie.a, borderColor:Charts.colors.red, backgroundColor:Charts.colors.red+"22", tension:.25, fill:true, pointRadius:4 }
      ]},
      options: Charts.baseOptions({ scales:{ y:{ beginAtZero:true, ticks:{ precision:0 } } } })
    });
  },

  noFiltro(d){
    const st = FeedbackState; const x = dateOnly(d);
    if(st.dataInicial && x < dateOnly(st.dataInicial)) return false;
    if(st.dataFinal && x > dateOnly(st.dataFinal)) return false;
    return true;
  },

  /* ------------------------------------------------------------------ */
  /* insights                                                             */
  /* ------------------------------------------------------------------ */
  insights(func){
    const lista = Array.from(func.values());
    const ct = window.APP_STATE.currentTeam, ativos = ct ? ct.codes : null;
    const foraI = this.dispensados();
    const equipe = lista.filter(e=>(!ativos || ativos.has(e.codKey)) && !foraI.has(e.codKey));
    const top = (arr, fn)=> arr.filter(e=>fn(e)>0).sort((a,b)=>fn(b)-fn(a)).slice(0,5);
    const motivosTot = new Map();
    lista.forEach(e=> e.feedbacks.forEach(r=>{ const k = this.motivoTxt(r.motivo); motivosTot.set(k,(motivosTot.get(k)||0)+1); }));
    const motivoTop = Array.from(motivosTot.entries()).sort((a,b)=>b[1]-a[1])[0];
    const semFb = equipe.filter(e=>e.diasSemFb===null || e.diasSemFb>FB_DIAS_SEM_FEEDBACK).sort((a,b)=>(b.diasSemFb===null?1e9:b.diasSemFb)-(a.diasSemFb===null?1e9:a.diasSemFb));
    const semAdv = equipe.slice().sort((a,b)=>(b.diasSemAdv===null?1e9:b.diasSemAdv)-(a.diasSemAdv===null?1e9:a.diasSemAdv));
    const advertir = equipe.filter(e=>e.pendentes>0);
    const bullets = [];
    if(advertir.length) bullets.push(`🔴 <strong>${advertir.length}</strong> funcionário(s) já atingiram ${FB_A_CADA} feedbacks no mesmo motivo sem advertência: ${advertir.slice(0,4).map(e=>escapeHtml(e.nome)).join(", ")}${advertir.length>4?"…":""}.`);
    if(semFb.length) bullets.push(`📝 <strong>${semFb.length}</strong> funcionário(s) estão sem feedback há mais de ${FB_DIAS_SEM_FEEDBACK} dias (${semFb.filter(e=>e.diasSemFb===null).length} nunca receberam).`);
    if(motivoTop) bullets.push(`📌 Motivo mais frequente nos feedbacks: <strong>${escapeHtml(motivoTop[0])}</strong> (${motivoTop[1]}).`);
    const semMotivo = lista.reduce((n,e)=>n+e.feedbacks.filter(r=>!trimStr(r.motivo)).length, 0);
    if(semMotivo) bullets.push(`ℹ️ ${semMotivo} feedback(s) antigos não têm motivo registrado — não entram na regra das ${FB_A_CADA} ocorrências.`);
    const susp = top(equipe, e=>e.susp);
    if(susp.length) bullets.push(`⛔ Mais suspensões na chamada: <strong>${escapeHtml(susp[0].nome)}</strong> (${susp[0].susp}).`);
    return {
      bullets,
      topAdv: top(lista, e=>e.adv.length), topFb: top(lista, e=>e.feedbacks.length), topSusp: top(lista, e=>e.susp),
      semFb: semFb.slice(0,10), semAdv: semAdv.slice(0,10)
    };
  },
  htmlInsights(ins){
    const lista = (titulo, arr, fmt, vazio)=> `<div style="flex:1;min-width:230px"><div style="font-weight:800;color:var(--blue-dark);margin-bottom:6px">${titulo}</div>
      ${arr.length ? `<ol style="margin:0;padding-left:20px;font-size:13px;line-height:1.7">${arr.map(e=>`<li><a href="#" onclick="FeedbackAdv.abrirFuncionario('${escapeHtml(e.codKey)}');return false;">${escapeHtml(e.nome)}</a> — ${fmt(e)}</li>`).join("")}</ol>` : `<div class="small-muted">${vazio}</div>`}</div>`;
    return `<div class="panel">
      <div class="panel-header"><h3>Insights</h3></div>
      ${ins.bullets.length ? `<ul style="margin:0 0 14px;padding-left:20px;font-size:13.5px;line-height:1.7">${ins.bullets.map(b=>`<li>${b}</li>`).join("")}</ul>` : `<div class="small-muted" style="margin-bottom:12px">Sem destaques no momento.</div>`}
      <div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:14px">
        ${lista("🏅 Mais advertências", ins.topAdv, e=>e.adv.length+" advertência(s)", "Nenhuma advertência registrada.")}
        ${lista("🗣️ Mais feedbacks", ins.topFb, e=>e.feedbacks.length+" feedback(s)", "Nenhum feedback registrado.")}
        ${lista("⛔ Mais suspensões (chamada)", ins.topSusp, e=>e.susp+" dia(s)", "Nenhuma suspensão na chamada.")}
      </div>
      <div style="display:flex;gap:18px;flex-wrap:wrap">
        ${lista("📝 Quem não recebe feedback (há quantos dias)", ins.semFb, e=>e.diasSemFb===null?"nunca recebeu":e.diasSemFb+" dias", "Toda a equipe recebeu feedback recentemente.")}
        ${lista("📄 Quem não tomou advertência (há quantos dias)", ins.semAdv, e=>e.diasSemAdv===null?"nunca tomou":e.diasSemAdv+" dias", "—")}
      </div>
    </div>`;
  },

  /** Cadeia disciplinar por motivo: NCs → feedbacks → advertências → suspensões, com o próximo passo e atalho de lançamento */
  htmlCadeia(e){
    const nc = (typeof NC!=="undefined" && NC.carregado()) ? NC.eventos().filter(x=>x.codKey===e.codKey) : [];
    const porMotivo = new Map();
    e.motivos.forEach(m=>porMotivo.set(m.chave, { ...m, ncs:0 }));
    nc.forEach(x=>{
      const t = NC.tipo(x.tipo), k = this.mk(t.motivo);
      if(!porMotivo.has(k)){ const kk = this.fbPorAdv(k); porMotivo.set(k, { chave:k, motivo:t.motivo, fb:0, adv:0, susp:0, porAdv:kk, pend:0, suspPend:0, faltam:kk, faltamSusp:FB_ADV_PARA_SUSP, ncs:0 }); }
      porMotivo.get(k).ncs++;
    });
    const lanc = (pane, rot, m, cls)=> Auth.can("lancamentos", pane) ? `<button type="button" class="btn ${cls||'btn-primary'} btn-sm nc-btn" onclick="FeedbackAdv.irLancar('${pane}','${escapeHtml(e.codKey)}','${escapeHtml(m.chave)}')">${rot}</button>` : "";
    const linhas = Array.from(porMotivo.values()).filter(m=>m.chave!==FB_SEM_MOTIVO).sort((a,b)=>(b.suspPend-a.suspPend)||(b.pend-a.pend)||(b.ncs-a.ncs)||(b.fb-a.fb)).map(m=>{
      const ehNc = typeof NC!=="undefined" && NC.ehMotivo(m.chave);
      const ncPend = ehNc ? Math.max(0, Math.floor(m.ncs/NC_POR_FB) - m.fb) : 0;
      const dot = (c)=> `<span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:${c};margin-right:6px"></span>`;
      let passo;
      if(m.suspPend>0) passo = `${dot("#d64545")}<strong>Solicitar suspensão</strong> <span class="small-muted">(${m.suspPend})</span>`;
      else if(m.pend>0) passo = `${dot("#d64545")}<strong>Gerar advertência</strong> <span class="small-muted">(${m.pend})</span>`;
      else if(ncPend>0) passo = `${dot("#e0a81f")}<strong>Gerar feedback</strong> <span class="small-muted">(${ncPend})</span>`;
      else passo = `${dot("#1a9c62")}<span class="small-muted">faltam ${m.faltam} feedback(s) p/ advertência · ${m.faltamSusp} advert. p/ suspensão</span>`;
      const acao = m.suspPend>0 ? lanc("lsuspensao","＋ Suspensão",m,"btn-danger") : m.pend>0 ? lanc("ladvertencia","＋ Advertência",m,"btn-danger") : ncPend>0 ? lanc("lfeedback","＋ Feedback",m) : "";
      return `<tr><td>${escapeHtml(m.motivo)}${ehNc?' <span class="nc-badge nc-fb">NC</span>':''}</td>
        <td class="num">${ehNc ? `<span class="${m.ncs?'cell-neg':''}">${m.ncs}</span>` : "—"}</td><td class="num">${m.fb}</td><td class="num ${m.adv?'cell-neg':''}">${m.adv}</td><td class="num ${m.susp?'cell-neg':''}">${m.susp}</td>
        <td>${passo}</td><td class="nc-act">${acao}</td></tr>`;
    });
    return `<div class="panel">
      <div class="panel-header"><h3>Cadeia disciplinar por motivo</h3><span class="panel-note">NC (${typeof NC_POR_FB!=="undefined"?NC_POR_FB:2}) → feedback · ${typeof NC_FB_PARA_ADV!=="undefined"?NC_FB_PARA_ADV:2} feedbacks (NC) ou ${FB_A_CADA} (demais) → advertência · ${FB_ADV_PARA_SUSP} advertências → suspensão</span></div>
      <div class="table-wrap"><table class="data-table nc-table">
        <thead><tr><th>Motivo</th><th class="num">NCs</th><th class="num">Feedbacks</th><th class="num">Advertências</th><th class="num">Suspensões</th><th>Próximo passo</th><th></th></tr></thead>
        <tbody>${linhas.join("") || '<tr><td colspan="7" class="small-muted">Sem NCs, feedbacks nem advertências registrados.</td></tr>'}</tbody>
      </table></div></div>`;
  },
  /** abre o lançamento do próximo passo já com motivo e as ocorrências ligadas */
  irLancar(pane, codKey, chave){
    const e = this.porFuncionario().get(codKey); if(!e) return;
    const m = e.motivos.find(x=>x.chave===chave), tipo = (typeof NC!=="undefined") ? NC.TIPOS.find(t=>this.mk(t.motivo)===chave) : null;
    const kind = pane==="lsuspensao" ? "susp" : pane==="ladvertencia" ? "adv" : "fb";
    let al = null;
    if(kind==="susp") al = this.alertas().suspender.find(x=>x.codKey===codKey && this.mk(x.motivo)===chave);
    else if(tipo) al = NC.achar(kind, codKey, tipo.key);
    if(al){ if(kind==="susp") return this.gerarSuspensao(al); return NC.gerar(kind, codKey, tipo.key); }
    LancUI.prefill = { mat:e.cod||"", motivo:(m&&m.motivo)||(tipo&&tipo.motivo)||"" };
    UI.goTo("lancamentos", pane);
  },
  /** texto com as advertências que motivaram o pedido de suspensão */
  resumoSusp(al){
    return `Recorrência — ${al.motivo}: ${al.adv} advertência(s) já aplicada(s) pelo mesmo motivo.\nAdvertências:\n` +
      (al.ocorr||[]).map(r=>`- ${fmtDateBR(r.data)}${r.resumo?" — "+String(r.resumo).split("\n")[0].slice(0,140):""}`).join("\n");
  },
  gerarSuspensao(al){
    LancUI.prefill = { mat:al.cod||"", motivo:al.motivo, resumo:this.resumoSusp(al) };
    UI.goTo("lancamentos", "lsuspensao");
  },
  /** dentro de Lançar Suspensão / Advertência: aviso de suspensão indicada com as advertências ligadas */
  htmlIndicacaoSusp(mat){
    const key = normStr(String(mat||"").trim()); if(!key) return "";
    const lista = this.alertas().suspender.filter(x=>x.codKey===key); if(!lista.length) return "";
    return lista.map(x=>`<div class="warn-box nc-ind"><div class="nc-ind-h"><strong>⛔ Suspensão indicada</strong> — ${escapeHtml(x.motivo)} · ${x.adv} advertência(s), ${x.susp} suspensão(ões) · <strong>${x.pend} a emitir</strong></div>
      <ul class="nc-ind-l">${x.ocorr.map(r=>`<li>${fmtDateBR(r.data)}${r.resumo?" — "+escapeHtml(String(r.resumo).split("\n")[0].slice(0,110)):""}</li>`).join("")}</ul>
      <button type="button" class="btn btn-danger btn-sm nc-btn" onclick="FeedbackAdv.aplicarSusp('${escapeHtml(x.codKey)}','${escapeHtml(this.mk(x.motivo))}')">Usar motivo e advertências</button></div>`).join("");
  },
  aplicarSusp(codKey, chave){
    const al = this.alertas().suspender.find(x=>x.codKey===codKey && this.mk(x.motivo)===chave); if(!al) return;
    const sel = document.getElementById("sp-motivo"), rs = document.getElementById("sp-resumo");
    if(sel){ if(!Array.from(sel.options).some(o=>o.value===al.motivo)){ const o = document.createElement("option"); o.value = o.textContent = al.motivo; sel.appendChild(o); } sel.value = al.motivo; sel.dispatchEvent(new Event("change")); }
    if(rs) rs.value = this.resumoSusp(al);
  },

  /* ------------------------------------------------------------------ */
  /* detalhe do funcionário                                               */
  /* ------------------------------------------------------------------ */
  renderDetalhe(codKey){
    const e = this.porFuncionario().get(codKey);
    if(!e){ this.sel = null; return this.render(); }
    const serie = this.serieMensal(e.feedbacks, e.adv, 12);
    const mg = e.feedbacks.filter(r=>r.avGestor!==null).map(r=>r.avGestor);
    const ultAdvComDoc = e.adv.find(r=>r.anexo);
    const podeEditarFb = Auth.can("lancamentos","lfeedback");
    const lancar = (pane, rot)=> `<button type="button" class="btn btn-primary btn-sm" onclick="LancUI.prefill={mat:'${escapeHtml(e.cod||"")}'};UI.goTo('lancamentos','${pane}')">${rot}</button>`;
    $("#fb-content").innerHTML = `
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px">
        <button type="button" class="btn btn-outline btn-sm" onclick="FeedbackAdv.voltar()">← Voltar à lista</button>
        <h2 class="adm-h" style="margin:0">${escapeHtml(e.nome)} <span class="small-muted" style="font-size:13px">${escapeHtml(e.cod||"")}</span></h2>
        <span>${this.farolHtml(e.farol)}</span>
        <span style="flex:1"></span>
        <button type="button" class="btn btn-outline btn-sm" id="fb-gerar-pdf">📄 Gerar feedback (PDF)</button>
        ${Auth.can("lancamentos","lfeedback") ? lancar("lfeedback","＋ Lançar feedback") : ""}
        ${Auth.can("lancamentos","ladvertencia") ? lancar("ladvertencia","＋ Lançar advertência") : ""}
        ${Auth.can("lancamentos","lsuspensao") ? lancar("lsuspensao","＋ Lançar suspensão") : ""}
      </div>
      <div class="cards-grid">
        <div class="card"><div class="card-label">Feedbacks</div><div class="card-value">${e.feedbacks.length}</div></div>
        <div class="card ${e.adv.length?'neg':''}"><div class="card-label">Advertências</div><div class="card-value ${e.adv.length?'neg':''}">${e.adv.length}</div></div>
        <div class="card ${e.suspD.length?'neg':''}"><div class="card-label">Suspensões disciplinares</div><div class="card-value ${e.suspD.length?'neg':''}">${e.suspD.length}</div></div>
        <div class="card ${e.susp?'neg':''}"><div class="card-label">Suspensões (chamada)</div><div class="card-value ${e.susp?'neg':''}">${e.susp}</div></div>
        <div class="card"><div class="card-label">Último feedback</div><div class="card-value" style="font-size:20px">${e.ultFb?fmtDateBR(e.ultFb):"—"}</div><div class="small-muted">${e.diasSemFb===null?"nunca recebeu":"há "+e.diasSemFb+" dia(s)"}</div></div>
        <div class="card"><div class="card-label">Última advertência</div><div class="card-value" style="font-size:20px">${e.ultAdv?fmtDateBR(e.ultAdv):"—"}</div><div class="small-muted">${e.diasSemAdv===null?"nunca tomou":"há "+e.diasSemAdv+" dia(s)"}</div></div>
        <div class="card"><div class="card-label">Média Av. Gestor</div><div class="card-value">${mg.length?fmtNum(avg(mg),1):"-"}</div></div>
      </div>

      ${this.htmlCadeia(e)}

      <div class="panel">
        <div class="panel-header"><h3>Histórico (12 meses)</h3></div>
        <div class="chart-wrap"><canvas id="chart-fbadv-func"></canvas></div>
      </div>

      <div class="panel">
        <div class="panel-header"><h3>Feedbacks (${e.feedbacks.length})</h3></div>
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Data</th><th>Motivo</th><th>Av. Pessoal</th><th>Av. Gestor</th><th>Desempenho</th><th>Resumo</th><th>Aplicador</th><th>Documento</th><th>Ações</th></tr></thead>
          <tbody>${e.feedbacks.length ? e.feedbacks.map((r,i)=>`<tr>
            <td>${fmtDateBR(r.data)}</td><td>${escapeHtml(this.motivoTxt(r.motivo))}</td>
            <td>${r.avPessoal!==null?r.avPessoal:'-'}</td><td>${r.avGestor!==null?r.avGestor:'-'}</td>
            <td>${escapeHtml(r.desempenho||"-")}</td><td style="min-width:200px">${escapeHtml(r.resumo||"")}</td>
            <td>${escapeHtml(r.aplicador||"-")}</td>
            <td style="white-space:nowrap">${this.botoesAnexo(r.anexo, "Feedback — "+e.nome+" — "+fmtDateBR(r.data))}</td>
            <td style="white-space:nowrap">${podeEditarFb ? `<button type="button" class="btn btn-outline btn-sm" data-fb-ed="${i}" title="Editar este feedback">✏️ Editar</button>
              <button type="button" class="btn ${r.anexo?'btn-outline':'btn-primary'} btn-sm" data-fb-doc="${i}" title="${r.anexo?'Trocar o documento escaneando de novo':'Escanear o documento deste feedback'}">📷 ${r.anexo?'Reescanear':'Escanear'}</button>` : '<span class="small-muted">—</span>'}</td>
          </tr>`).join("") : '<tr><td colspan="9" class="small-muted">Nenhum feedback.</td></tr>'}</tbody>
        </table></div>
      </div>

      <div class="panel">
        <div class="panel-header"><h3>Advertências (${e.adv.length})</h3></div>
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Data</th><th>Motivo</th><th>Resumo</th><th>Aplicador</th><th>Documento</th></tr></thead>
          <tbody>${e.adv.length ? e.adv.map(r=>`<tr>
            <td>${fmtDateBR(r.data)}</td><td>${escapeHtml(this.motivoTxt(r.motivo))}${r.legado?' <span class="small-muted">(registro antigo)</span>':''}</td>
            <td style="min-width:200px">${escapeHtml(r.resumo||"")}</td><td>${escapeHtml(r.aplicador||"-")}</td>
            <td style="white-space:nowrap">${this.botoesAnexo(r.anexo, "Advertência — "+e.nome+" — "+fmtDateBR(r.data))}</td>
          </tr>`).join("") : '<tr><td colspan="5" class="small-muted">Nenhuma advertência.</td></tr>'}</tbody>
        </table></div>
      </div>

      <div class="panel">
        <div class="panel-header"><h3>Suspensões disciplinares (${e.suspD.length})</h3><span class="panel-note">${FB_ADV_PARA_SUSP} advertências no mesmo motivo geram a solicitação de suspensão</span></div>
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Início</th><th>Fim</th><th>Dias</th><th>Motivo</th><th>Resumo</th><th>Aplicador</th><th>Documento</th></tr></thead>
          <tbody>${e.suspD.length ? e.suspD.map(r=>`<tr>
            <td>${fmtDateBR(r.data)}</td><td>${r.fim?fmtDateBR(r.fim):"—"}</td><td>${r.dias||"—"}</td><td>${escapeHtml(this.motivoTxt(r.motivo))}</td>
            <td style="min-width:200px">${escapeHtml(r.resumo||"")}</td><td>${escapeHtml(r.aplicador||"-")}</td>
            <td style="white-space:nowrap">${this.botoesAnexo(r.anexo, "Suspensão — "+e.nome+" — "+fmtDateBR(r.data))}</td>
          </tr>`).join("") : '<tr><td colspan="7" class="small-muted">Nenhuma suspensão disciplinar.</td></tr>'}</tbody>
        </table></div>
      </div>

      ${ultAdvComDoc ? `<div class="panel"><div class="panel-header"><h3>Pré-visualização — última advertência com documento (${fmtDateBR(ultAdvComDoc.data)})</h3></div>
        <div id="fbadv-prev" style="height:560px;border:1px solid var(--gray-200);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--gray-500)">Carregando pré-visualização...</div></div>` : ""}
    `;
    Charts.make("chart-fbadv-func", {
      type:"line",
      data:{ labels:serie.labels, datasets:[
        { label:"Feedbacks", data:serie.f, borderColor:Charts.colors.blue, backgroundColor:Charts.colors.blue+"22", tension:.25, fill:true, pointRadius:4 },
        { label:"Advertências", data:serie.a, borderColor:Charts.colors.red, backgroundColor:Charts.colors.red+"22", tension:.25, fill:true, pointRadius:4 }
      ]},
      options: Charts.baseOptions({ scales:{ y:{ beginAtZero:true, ticks:{ precision:0 } } } })
    });
    if(ultAdvComDoc) this.carregarPrevia(ultAdvComDoc.anexo);
    const alvo = document.getElementById("fb-content");
    const bg = document.getElementById("fb-gerar-pdf"); if(bg) bg.addEventListener("click", ()=> this.gerarDocumento(e));
    alvo.querySelectorAll("[data-fb-ed]").forEach(b=> b.addEventListener("click", ()=> this.editarFeedback(e, Number(b.dataset.fbEd))));
    alvo.querySelectorAll("[data-fb-doc]").forEach(b=> b.addEventListener("click", ()=> this.escanearFeedback(e, Number(b.dataset.fbDoc))));
  },

  /* ------------------------------------------------------------------ */
  /* editar feedback já lançado / escanear o documento depois             */
  /* ------------------------------------------------------------------ */
  /** Gera o documento de feedback (mesmo do Ranking de Repositores) a partir do detalhe do funcionário. */
  async gerarDocumento(e){
    const antesQ = feedbackOnlyQuadroAtual, antesR = feedbackOnlyRepositor;
    try{
      feedbackOnlyQuadroAtual = false; feedbackOnlyRepositor = false;
      const emp = getFeedbackRankingData().find(x=>x.codKey===e.codKey);
      if(!emp){ toast("Sem dados de produção (O.S. 58) para gerar o documento deste funcionário.", "error"); return; }
      await FeedbackDoc.generate(emp);
    }catch(err){ toast("Não foi possível gerar o documento: "+(err&&err.message||err), "error"); }
    finally{ feedbackOnlyQuadroAtual = antesQ; feedbackOnlyRepositor = antesR; }
  },

  /** Como achar este feedback na planilha: matrícula + data + resumo (repetidos: pela ordem). */
  _refFeedback(e, i){
    const r = e.feedbacks[i], iso = LancUI.isoDe(r.data), chave = normStr(r.resumo||"");
    const iguais = this.feedbacks().filter(x=> x.codKey===r.codKey && x.data && LancUI.isoDe(x.data)===iso && normStr(x.resumo||"")===chave).sort((a,b)=>a._row-b._row);
    return { mat:LancUI.soDigitos(r.cod), data:iso, resumo:r.resumo||"", ordem:Math.max(0, iguais.indexOf(r)) };
  },
  /** Reflete a mudança na tela na hora (os indicadores completos se atualizam com "Atualizar dados"). */
  _aplicarNoFeedback(r, patch){ Object.assign(r, patch); if(this.sel) this.renderDetalhe(this.sel); },
  editarFeedback(e, i){
    const r = e.feedbacks[i]; if(!r) return;
    LancUI.fbEditar(this._refFeedback(e, i), (patch, matMudou)=>{
      if(matMudou){ toast("A matrícula foi trocada: use Atualizar dados (menu) para o feedback aparecer na pessoa certa."); return; }
      this._aplicarNoFeedback(r, patch);
      toast("Feedback atualizado. Use Atualizar dados (menu) para refletir nos indicadores.");
    });
  },
  escanearFeedback(e, i){
    const r = e.feedbacks[i]; if(!r) return;
    LancUI.fbDocModal(this._refFeedback(e, i), "Feedback — "+e.nome+" — "+fmtDateBR(r.data), (patch)=> this._aplicarNoFeedback(r, patch), true);
  },

  async carregarPrevia(url){
    const box = document.getElementById("fbadv-prev"); if(!box) return;
    try{
      const a = await this.buscarAnexo(url);
      const alvo = document.getElementById("fbadv-prev"); if(!alvo) return;
      const u = URL.createObjectURL(a.blob);
      alvo.style.display = "block"; alvo.style.padding = "0";
      alvo.innerHTML = /^image\//.test(a.mime) ? `<img src="${u}" style="max-width:100%;max-height:100%;display:block;margin:auto">` : `<iframe src="${u}" title="Pré-visualização" style="width:100%;height:100%;border:0"></iframe>`;
    }catch(err){
      box.innerHTML = `<div style="max-width:420px;text-align:center">${escapeHtml(err.message)}</div>`;
    }
  }
};
window.FeedbackAdv = FeedbackAdv;

document.addEventListener("DOMContentLoaded", ()=>{
  ["btn-alertas","sb-alertas"].forEach(id=>{ const b = document.getElementById(id); if(b) b.addEventListener("click", ()=> FeedbackAdv.abrirAlertas()); });
});

/* =========================================================================
   Auditoria de Retornos (aba Auditoria_Retorno da planilha de auditoria)
   Qualidade por repositor = % de auditorias de retorno SEM não conformidade
   (Possui_NC falso e sem divergência entre etiqueta e físico).
   ========================================================================= */
const RetornoOnline = {
  rows: null, ncs: [], ncInfo: null, loading: false, error: null,
  csvUrl(){ return `https://docs.google.com/spreadsheets/d/${AUDITORIA_ONLINE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent("Auditoria_Retorno")}&_ts=${Date.now()}`; },
  async load(force){
    if(this.loading || (this.rows && !force)) return;
    this.loading = true; this.error = null;
    try{
      const res = await fetch(this.csvUrl(), { cache:"no-store" });
      if(!res.ok) throw new Error("HTTP "+res.status+" ao buscar a aba Auditoria_Retorno.");
      this.rows = this.parse(await res.text());
    }catch(e){ this.error = e.message || String(e); if(!this.rows) this.rows = []; }
    finally{ this.loading = false; }
  },
  parse(text){
    const lines = AuditOnline.splitCSV(text);
    if(!lines.length) return [];
    const h = lines[0].map(x=>trimStr(x));
    const col = (n)=> h.findIndex(x=>normStr(x)===normStr(n));
    const iData = col("DataHora"), iNC = col("Possui_NC"), iMat = col("Matricula_Colaborador_NC"), iNome = col("Nome_Colaborador_NC");
    const iAM = col("Matricula_Auditor"), iAN = col("Nome_Auditor");
    const iEtq = col("Qtd_Etiqueta"), iFis = col("Qtd_Fisico"), iDiv = col("Divergencia_Un"), iFoto = col("Foto_Retorno");
    // a gviz devolve a 1ª aba quando o nome não existe: exige colunas próprias de Auditoria_Retorno
    if(iData<0 || iMat<0 || (iFoto<0 && iEtq<0)) throw new Error("A aba Auditoria_Retorno não foi encontrada na planilha de auditoria (ou está sem as colunas esperadas).");
    const sim = (v)=> /^(true|verdadeiro|sim|s|1|x)$/i.test(trimStr(v));
    const num = (v)=>{ const n = parseFloat(String(v).replace(/\./g,"").replace(",",".")); return isNaN(n) ? null : n; };
    const out = [], ncs = [], ncInfo = { linhasNC:0, semColab:0, semColuna:iNC<0 };
    const iRua = col("Rua"), iProd = col("Produto"), iDesc = col("Descricao_Produto");
    for(let i=1;i<lines.length;i++){
      const c = lines[i]; const data = AuditOnline.parseDateFlexible(c[iData]); if(!data) continue;
      const mat = trimStr(c[iMat]), nome = iNome>=0 ? trimStr(c[iNome]) : "";
      const audMat = iAM>=0 ? trimStr(c[iAM]) : "", audNome = iAN>=0 ? trimStr(c[iAN]) : "";
      // Não conformidade estrita (Possui_NC = TRUE) → erro de retorno do colaborador (usado por NCs / Feedbacks)
      if(iNC>=0 && sim(c[iNC])){
        ncInfo.linhasNC++;
        if(!mat && !nome) ncInfo.semColab++;
        else ncs.push({ origem:"RETORNO", data, rua:iRua>=0?trimStr(c[iRua]):"", cod:mat||null, nome, auditor:audNome, produto:iProd>=0?trimStr(c[iProd]):"", desc:iDesc>=0?trimStr(c[iDesc]):"", endereco:"", tipos:{ retorno:true } });
      }
      const ncFlag = iNC>=0 && sim(c[iNC]);
      if(!mat && !nome){ if(audMat || audNome) out.push({ data, codKey:"", nc:false, ncFlag, audMat, audNome, soAuditor:true }); continue; }     // sem repositor atribuído: não entra no ranking individual
      const etq = iEtq>=0 ? num(c[iEtq]) : null, fis = iFis>=0 ? num(c[iFis]) : null, dv = iDiv>=0 ? num(c[iDiv]) : null;
      const nc = (iNC>=0 && sim(c[iNC])) || (dv!==null && dv!==0) || (etq!==null && fis!==null && etq!==fis);
      out.push({ data, codKey: mat ? normStr(mat) : "NOME::"+normStr(nome), nc, ncFlag, audMat, audNome });
    }
    this.ncs = ncs; this.ncInfo = ncInfo;
    return out;
  },
  /** Auditorias de retorno feitas por um auditor (matrícula ou nome) no intervalo. null se a planilha não tem colunas de auditor. */
  /** linhas de Auditoria_Retorno feitas por um auditor (matrícula ou nome) no intervalo. */
  linhasDoAuditor(ini, fim, cod, nome){
    const i = dateOnly(ini), f = dateOnly(fim), dig = (v)=>String(v||"").replace(/\D/g,""), nn = normStr(nome||"");
    return (this.rows||[]).filter(r=>{
      const d = dateOnly(r.data); if(d<i || d>f) return false;
      if(cod && dig(r.audMat) && dig(r.audMat)===dig(cod)) return true;
      return !!(nn && r.audNome && normStr(r.audNome).includes(nn));
    });
  },
  /** Auditorias de retorno feitas por um auditor (matrícula ou nome) no intervalo. null se a planilha não tem colunas de auditor. */
  contarPorAuditor(ini, fim, cod, nome){
    if(!(this.rows||[]).some(r=>r.audMat || r.audNome)) return null;
    return this.linhasDoAuditor(ini, fim, cod, nome).length;
  },
  /** Erros de retorno (Possui_NC = TRUE) encontrados por um auditor no intervalo. */
  ncPorAuditor(ini, fim, cod, nome){
    if(!(this.rows||[]).some(r=>r.audMat || r.audNome)) return null;
    return this.linhasDoAuditor(ini, fim, cod, nome).filter(r=>r.ncFlag).length;
  },
  /** Map matrícula(só dígitos) → { nome, ncs, auditorias } dos auditores com erro encontrado no intervalo. */
  auditoresComNC(ini, fim){
    const i = dateOnly(ini), f = dateOnly(fim), m = new Map();
    (this.rows||[]).forEach(r=>{
      const d = dateOnly(r.data); if(d<i || d>f || !r.audMat) return;
      const k = String(r.audMat).replace(/\D/g,""); if(!k) return;
      if(!m.has(k)) m.set(k, { cod:k, nome:r.audNome||"", ncs:0, auditorias:0 });
      const e = m.get(k); e.auditorias++; if(r.ncFlag) e.ncs++;
    });
    return m;
  },
  /** Map codKey → { auditorias, qualidade } no intervalo. */
  porRepositor(ini, fim){
    const m = new Map(), i = dateOnly(ini), f = dateOnly(fim);
    (this.rows||[]).forEach(r=>{
      const d = dateOnly(r.data); if(d<i || d>f || r.soAuditor) return;
      if(!m.has(r.codKey)) m.set(r.codKey, { auditorias:0, ok:0 });
      const e = m.get(r.codKey); e.auditorias++; if(!r.nc) e.ok++;
    });
    m.forEach(e=>{ e.qualidade = e.auditorias ? e.ok/e.auditorias*100 : null; });
    return m;
  }
};
window.RetornoOnline = RetornoOnline;

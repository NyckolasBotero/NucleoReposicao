/* =========================================================================
   Núcleo Reposição — Feedbacks e Advertências (Gestão) + Alertas
   Depende de app.js (processed, currentTeam, Charts, Api, UI, helpers de formatação).
   ========================================================================= */
const FB_A_CADA = 3;               // a cada 3 feedbacks por motivo → 1 advertência
const FB_DIAS_SEM_FEEDBACK = 30;   // "sem feedback há mais de N dias"
const FB_PROBATORIO_DIAS = 90;     // período probatório
const FB_PROBATORIO_AVISO = 15;    // avisa quando faltam até N dias para acabar o probatório
const FB_SEM_MOTIVO = "SEM MOTIVO";

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

  suspensoes(){
    const p = this.proc(); const m = new Map(); if(!p) return m;
    (p.quadro||[]).forEach(r=>{ if(r.bucket==="SUSPENSAO") m.set(r.codKey, (m.get(r.codKey)||0)+1); });
    return m;
  },

  /** Mapa codKey → resumo do funcionário (feedbacks, advertências, motivos, farol...). */
  porFuncionario(feedbacks){
    const fbs = feedbacks || this.feedbacks(), ads = this.advertencias(), susp = this.suspensoes();
    const map = new Map();
    const get = (codKey, nome, cod)=>{
      if(!map.has(codKey)) map.set(codKey, { codKey, nome:this.nomeDe(codKey, nome), cod:cod||"", feedbacks:[], adv:[], susp:susp.get(codKey)||0 });
      return map.get(codKey);
    };
    fbs.forEach(r=>{ if(r.codKey) get(r.codKey, r.nome, r.cod).feedbacks.push(r); });
    ads.forEach(r=>{ if(r.codKey) get(r.codKey, r.nome, r.cod).adv.push(r); });
    // equipe atual sem nenhum registro também entra (para mostrar "sem feedback há X dias")
    const ct = window.APP_STATE && window.APP_STATE.currentTeam;
    if(ct) ct.members.forEach(m=>{ if(m.cargo!=="LIDER") get(m.codKey, m.nome, m.codigo); });
    map.forEach(e=>{
      e.feedbacks.sort((a,b)=>b.data-a.data); e.adv.sort((a,b)=>b.data-a.data);
      e.ultFb = e.feedbacks.length ? e.feedbacks[0].data : null;
      e.ultAdv = e.adv.length ? e.adv[0].data : null;
      e.diasSemFb = e.ultFb ? this.diasEntre(e.ultFb, this.hoje()) : null;
      e.diasSemAdv = e.ultAdv ? this.diasEntre(e.ultAdv, this.hoje()) : null;
      e.motivos = this.motivosDe(e);
      e.pendentes = e.motivos.reduce((n,m)=>n+m.pend, 0);
      e.farol = e.pendentes>0 ? "red" : (e.motivos.some(m=>m.fb - FB_A_CADA*m.adv === FB_A_CADA-1) ? "yellow" : "green");
    });
    return map;
  },

  motivosDe(e){
    const m = new Map();
    const get = (k, txt)=>{ if(!m.has(k)) m.set(k, { chave:k, motivo:txt, fb:0, adv:0 }); return m.get(k); };
    e.feedbacks.forEach(r=>{ get(this.mk(r.motivo), this.motivoTxt(r.motivo)).fb++; });
    e.adv.forEach(r=>{ get(this.mk(r.motivo), this.motivoTxt(r.motivo)).adv++; });
    return Array.from(m.values()).map(x=>({
      ...x,
      pend: x.chave===FB_SEM_MOTIVO ? 0 : Math.max(0, Math.floor(x.fb/FB_A_CADA) - x.adv),
      faltam: x.chave===FB_SEM_MOTIVO ? null : (FB_A_CADA - ((x.fb - FB_A_CADA*x.adv) % FB_A_CADA || FB_A_CADA)) // feedbacks até a próxima advertência
    })).sort((a,b)=> b.pend-a.pend || b.fb-a.fb);
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

  alertas(){
    const p = this.proc(), ct = window.APP_STATE && window.APP_STATE.currentTeam;
    if(!p) return { probatorio:[], advertir:[], semFeedback:[], ferias:[], total:0 };
    const hoje = this.hoje();
    const probatorio = (p.turnover||[]).filter(t=>t.ativo && t.dtAdm).map(t=>{
      const dias = this.diasEntre(t.dtAdm, hoje), restam = FB_PROBATORIO_DIAS - dias;
      const fim = new Date(t.dtAdm.getFullYear(), t.dtAdm.getMonth(), t.dtAdm.getDate()+FB_PROBATORIO_DIAS);
      return { nome:t.nome, codKey:t.codKey, restam, fim };
    }).filter(x=>x.restam>=0 && x.restam<=FB_PROBATORIO_AVISO).sort((a,b)=>a.restam-b.restam);

    const func = this.porFuncionario();
    const ativos = ct ? ct.codes : null;
    const advertir = [], semFeedback = [];
    func.forEach(e=>{
      if(ativos && !ativos.has(e.codKey)) return;
      e.motivos.filter(m=>m.pend>0).forEach(m=> advertir.push({ codKey:e.codKey, nome:e.nome, motivo:m.motivo, fb:m.fb, adv:m.adv, pend:m.pend }));
      if(e.diasSemFb===null || e.diasSemFb>FB_DIAS_SEM_FEEDBACK) semFeedback.push({ codKey:e.codKey, nome:e.nome, dias:e.diasSemFb });
    });
    advertir.sort((a,b)=>b.pend-a.pend);
    semFeedback.sort((a,b)=>(b.dias===null?1e9:b.dias)-(a.dias===null?1e9:a.dias));
    const ferias = this.feriasConflitos();
    return { probatorio, advertir, semFeedback, ferias, total: probatorio.length + advertir.length + semFeedback.length + ferias.length };
  },

  atualizarAlertas(){
    let n = 0;
    try{ n = this.alertas().total; }catch(e){ n = 0; }
    ["hdr-alertas-n","sb-alertas-n"].forEach(id=>{
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
      <h3 style="margin-top:0">🔔 Alertas</h3>
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
        <button class="btn btn-ghost btn-sm" id="anexo-dl" disabled>⬇ Baixar</button>
        <button class="btn btn-ghost btn-sm" id="anexo-x">✕ Fechar</button></div>
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
    return `<button type="button" class="btn btn-outline btn-sm" title="Ver sem baixar" onclick="event.stopPropagation();FeedbackAdv.verAnexo('${u}','${t}')">👁</button>
      <button type="button" class="btn btn-outline btn-sm" title="Baixar" onclick="event.stopPropagation();FeedbackAdv.baixarAnexo('${u}')">⬇</button>`;
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
        <div class="panel-header"><h3>📈 Histórico de feedbacks e advertências (12 meses)</h3></div>
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
    const equipe = lista.filter(e=>!ativos || ativos.has(e.codKey));
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
      <div class="panel-header"><h3>💡 Insights</h3></div>
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

  /* ------------------------------------------------------------------ */
  /* detalhe do funcionário                                               */
  /* ------------------------------------------------------------------ */
  renderDetalhe(codKey){
    const e = this.porFuncionario().get(codKey);
    if(!e){ this.sel = null; return this.render(); }
    const serie = this.serieMensal(e.feedbacks, e.adv, 12);
    const mg = e.feedbacks.filter(r=>r.avGestor!==null).map(r=>r.avGestor);
    const ultAdvComDoc = e.adv.find(r=>r.anexo);
    const lancar = (pane, rot)=> `<button type="button" class="btn btn-primary btn-sm" onclick="LancUI.prefill={mat:'${escapeHtml(e.cod||"")}'};UI.goTo('lancamentos','${pane}')">${rot}</button>`;
    $("#fb-content").innerHTML = `
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px">
        <button type="button" class="btn btn-outline btn-sm" onclick="FeedbackAdv.voltar()">← Voltar à lista</button>
        <h2 class="adm-h" style="margin:0">${escapeHtml(e.nome)} <span class="small-muted" style="font-size:13px">${escapeHtml(e.cod||"")}</span></h2>
        <span>${this.farolHtml(e.farol)}</span>
        <span style="flex:1"></span>
        ${Auth.can("lancamentos","lfeedback") ? lancar("lfeedback","＋ Lançar feedback") : ""}
        ${Auth.can("lancamentos","ladvertencia") ? lancar("ladvertencia","＋ Lançar advertência") : ""}
      </div>
      <div class="cards-grid">
        <div class="card"><div class="card-label">Feedbacks</div><div class="card-value">${e.feedbacks.length}</div></div>
        <div class="card ${e.adv.length?'neg':''}"><div class="card-label">Advertências</div><div class="card-value ${e.adv.length?'neg':''}">${e.adv.length}</div></div>
        <div class="card ${e.susp?'neg':''}"><div class="card-label">Suspensões (chamada)</div><div class="card-value ${e.susp?'neg':''}">${e.susp}</div></div>
        <div class="card"><div class="card-label">Último feedback</div><div class="card-value" style="font-size:20px">${e.ultFb?fmtDateBR(e.ultFb):"—"}</div><div class="small-muted">${e.diasSemFb===null?"nunca recebeu":"há "+e.diasSemFb+" dia(s)"}</div></div>
        <div class="card"><div class="card-label">Última advertência</div><div class="card-value" style="font-size:20px">${e.ultAdv?fmtDateBR(e.ultAdv):"—"}</div><div class="small-muted">${e.diasSemAdv===null?"nunca tomou":"há "+e.diasSemAdv+" dia(s)"}</div></div>
        <div class="card"><div class="card-label">Média Av. Gestor</div><div class="card-value">${mg.length?fmtNum(avg(mg),1):"-"}</div></div>
      </div>

      <div class="panel">
        <div class="panel-header"><h3>🚦 Farol por motivo</h3><span class="panel-note">A cada ${FB_A_CADA} feedbacks no mesmo motivo deve ser emitida 1 advertência</span></div>
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Motivo</th><th>Feedbacks</th><th>Advertências</th><th>A emitir</th><th>Situação</th></tr></thead>
          <tbody>${e.motivos.length ? e.motivos.map(m=>`<tr>
            <td>${escapeHtml(m.motivo)}</td><td>${m.fb}</td><td class="${m.adv?'cell-neg':''}">${m.adv}</td>
            <td class="${m.pend?'cell-neg':''}">${m.pend||"—"}</td>
            <td>${m.chave===FB_SEM_MOTIVO ? '<span class="small-muted">sem motivo — não conta</span>' : m.pend>0 ? this.farolHtml("red")+` <span class="small-muted">emitir ${m.pend}</span>` : (m.fb-FB_A_CADA*m.adv===FB_A_CADA-1 ? this.farolHtml("yellow")+' <span class="small-muted">falta 1 feedback</span>' : this.farolHtml("green"))}</td>
          </tr>`).join("") : '<tr><td colspan="5" class="small-muted">Sem feedbacks nem advertências registrados.</td></tr>'}</tbody>
        </table></div>
      </div>

      <div class="panel">
        <div class="panel-header"><h3>📈 Histórico (12 meses)</h3></div>
        <div class="chart-wrap"><canvas id="chart-fbadv-func"></canvas></div>
      </div>

      <div class="panel">
        <div class="panel-header"><h3>🗣️ Feedbacks (${e.feedbacks.length})</h3></div>
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Data</th><th>Motivo</th><th>Av. Pessoal</th><th>Av. Gestor</th><th>Desempenho</th><th>Resumo</th><th>Aplicador</th><th>Documento</th></tr></thead>
          <tbody>${e.feedbacks.length ? e.feedbacks.map(r=>`<tr>
            <td>${fmtDateBR(r.data)}</td><td>${escapeHtml(this.motivoTxt(r.motivo))}</td>
            <td>${r.avPessoal!==null?r.avPessoal:'-'}</td><td>${r.avGestor!==null?r.avGestor:'-'}</td>
            <td>${escapeHtml(r.desempenho||"-")}</td><td style="min-width:200px">${escapeHtml(r.resumo||"")}</td>
            <td>${escapeHtml(r.aplicador||"-")}</td>
            <td style="white-space:nowrap">${this.botoesAnexo(r.anexo, "Feedback — "+e.nome+" — "+fmtDateBR(r.data))}</td>
          </tr>`).join("") : '<tr><td colspan="8" class="small-muted">Nenhum feedback.</td></tr>'}</tbody>
        </table></div>
      </div>

      <div class="panel">
        <div class="panel-header"><h3>⚠️ Advertências (${e.adv.length})</h3></div>
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Data</th><th>Motivo</th><th>Resumo</th><th>Aplicador</th><th>Documento</th></tr></thead>
          <tbody>${e.adv.length ? e.adv.map(r=>`<tr>
            <td>${fmtDateBR(r.data)}</td><td>${escapeHtml(this.motivoTxt(r.motivo))}${r.legado?' <span class="small-muted">(registro antigo)</span>':''}</td>
            <td style="min-width:200px">${escapeHtml(r.resumo||"")}</td><td>${escapeHtml(r.aplicador||"-")}</td>
            <td style="white-space:nowrap">${this.botoesAnexo(r.anexo, "Advertência — "+e.nome+" — "+fmtDateBR(r.data))}</td>
          </tr>`).join("") : '<tr><td colspan="5" class="small-muted">Nenhuma advertência.</td></tr>'}</tbody>
        </table></div>
      </div>

      ${ultAdvComDoc ? `<div class="panel"><div class="panel-header"><h3>📄 Pré-visualização — última advertência com documento (${fmtDateBR(ultAdvComDoc.data)})</h3></div>
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
  rows: null, loading: false, error: null,
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
    const iEtq = col("Qtd_Etiqueta"), iFis = col("Qtd_Fisico"), iDiv = col("Divergencia_Un"), iFoto = col("Foto_Retorno");
    // a gviz devolve a 1ª aba quando o nome não existe: exige colunas próprias de Auditoria_Retorno
    if(iData<0 || iMat<0 || (iFoto<0 && iEtq<0)) throw new Error("A aba Auditoria_Retorno não foi encontrada na planilha de auditoria (ou está sem as colunas esperadas).");
    const sim = (v)=> /^(true|verdadeiro|sim|s|1|x)$/i.test(trimStr(v));
    const num = (v)=>{ const n = parseFloat(String(v).replace(/\./g,"").replace(",",".")); return isNaN(n) ? null : n; };
    const out = [];
    for(let i=1;i<lines.length;i++){
      const c = lines[i]; const data = AuditOnline.parseDateFlexible(c[iData]); if(!data) continue;
      const mat = trimStr(c[iMat]), nome = iNome>=0 ? trimStr(c[iNome]) : "";
      if(!mat && !nome) continue;     // sem repositor atribuído: não entra no ranking individual
      const etq = iEtq>=0 ? num(c[iEtq]) : null, fis = iFis>=0 ? num(c[iFis]) : null, dv = iDiv>=0 ? num(c[iDiv]) : null;
      const nc = (iNC>=0 && sim(c[iNC])) || (dv!==null && dv!==0) || (etq!==null && fis!==null && etq!==fis);
      out.push({ data, codKey: mat ? normStr(mat) : "NOME::"+normStr(nome), nc });
    }
    return out;
  },
  /** Map codKey → { auditorias, qualidade } no intervalo. */
  porRepositor(ini, fim){
    const m = new Map(), i = dateOnly(ini), f = dateOnly(fim);
    (this.rows||[]).forEach(r=>{
      const d = dateOnly(r.data); if(d<i || d>f) return;
      if(!m.has(r.codKey)) m.set(r.codKey, { auditorias:0, ok:0 });
      const e = m.get(r.codKey); e.auditorias++; if(!r.nc) e.ok++;
    });
    m.forEach(e=>{ e.qualidade = e.auditorias ? e.ok/e.auditorias*100 : null; });
    return m;
  }
};
window.RetornoOnline = RetornoOnline;

/* =========================================================================
   Núcleo Reposição — Não Conformidades (NC) por colaborador
   Fonte: Google Sheets de auditoria
     · Auditoria_Retorno (Possui_NC = TRUE)  → 1 erro de retorno para Matricula/Nome_Colaborador_NC
     · Auditoria_Ruas    (Possui_NC = TRUE)  → 1 erro de rua para CADA critério TRUE da linha:
                            Erro_Produto · Prox_Vencimento · Sem_Saldo · Avaria
   Regras de alerta (por colaborador e por motivo):
     · NC_POR_FB (2) NCs do mesmo motivo desde o último feedback desse motivo → gerar FEEDBACK (2 NC = 1 feedback)
     · NC_FB_PARA_ADV (2) feedbacks do mesmo motivo → gerar ADVERTÊNCIA (2 NC + 2 NC = 2 feedbacks = 1 advertência)
     · cada alerta carrega as ocorrências (NCs) que o motivaram, mostradas em Lançar Feedback / Lançar Advertência
   Depende de app.js (AuditOnline, helpers) e feedbacks.js (RetornoOnline, FeedbackAdv).
   ========================================================================= */
const NC_POR_FB = 2;         // NCs do mesmo motivo (desde o último feedback desse motivo) que geram 1 alerta de feedback
const NC_FB_PARA_ADV = 2;    // feedbacks do mesmo motivo que geram alerta de advertência

const NC = {
  /** motivo = texto usado no lançamento do feedback/advertência (e para casar com os já lançados) */
  TIPOS: [
    { key:"retorno",  label:"Erro de Retorno",           curto:"Retorno",       motivo:"NC Retorno" },
    { key:"produto",  label:"Erro Rua Produto Trocado",  curto:"Prod. Trocado", motivo:"NC Rua - Produto Trocado" },
    { key:"proxvenc", label:"Erro Rua Prox Venc.",       curto:"Prox. Venc.",   motivo:"NC Rua - Prox Venc." },
    { key:"semsaldo", label:"Erro Rua Sem Saldo",        curto:"Sem Saldo",     motivo:"NC Rua - Sem Saldo" },
    { key:"avaria",   label:"Erro Rua Avaria",           curto:"Avaria",        motivo:"NC Rua - Avaria" }
  ],
  tipo(k){ return this.TIPOS.find(t=>t.key===k); },

  carregado(){ return !!(window.AuditOnline && AuditOnline.rows!==null && window.RetornoOnline && RetornoOnline.rows!==null); },
  /** carrega as duas abas em background e chama cb quando chegar */
  garantir(cb){
    const ps = [];
    if(window.AuditOnline && AuditOnline.rows===null && !AuditOnline.loading) ps.push(AuditOnline.load());
    if(window.RetornoOnline && RetornoOnline.rows===null && !RetornoOnline.loading) ps.push(RetornoOnline.load());
    if(ps.length && cb) Promise.all(ps).then(()=>cb()).catch(()=>cb());
  },

  /** todas as ocorrências: 1 por critério TRUE (rua) ou 1 por NC de retorno */
  eventos(){
    const reg = window.APP_STATE && window.APP_STATE.nameRegistry;
    const out = [];
    const add = (r, tipoKey)=>{
      const codKey = r.cod ? normStr(r.cod) : (r.nome ? "NOME::"+normStr(r.nome) : null);
      if(!codKey) return;
      out.push({ data:r.data, codKey, cod:r.cod||"", nome:(reg && reg.get(codKey)) || r.nome || r.cod || codKey,
        tipo:tipoKey, origem:r.origem, rua:r.rua||"", produto:r.produto||"", desc:r.desc||"", endereco:r.endereco||"", auditor:r.auditor||"" });
    };
    ((window.AuditOnline && AuditOnline.ncRuas) || []).forEach(r=>{
      ["produto","proxvenc","semsaldo","avaria"].forEach(k=>{ if(r.tipos && r.tipos[k]) add(r, k); });
    });
    ((window.RetornoOnline && RetornoOnline.ncs) || []).forEach(r=> add(r, "retorno"));
    return out;
  },

  /** aplica os filtros da aba Auditoria (período, rua, repositor, auditor, quadro atual) */
  filtrar(evs, st){
    st = st || {};
    let r = evs;
    if(st.dataInicial){ const d = dateOnly(st.dataInicial); r = r.filter(e=>dateOnly(e.data)>=d); }
    if(st.dataFinal){ const d = dateOnly(st.dataFinal); r = r.filter(e=>dateOnly(e.data)<=d); }
    if(st.rua) r = r.filter(e=>String(e.rua)===String(st.rua));
    if(st.repositor) r = r.filter(e=>e.codKey===st.repositor);
    if(st.auditor) r = r.filter(e=>normStr(e.auditor)===normStr(st.auditor));
    if(st.apenasQuadroAtual==="SIM"){
      const ct = window.APP_STATE && window.APP_STATE.currentTeam;
      if(ct && ct.codes) r = r.filter(e=>ct.codes.has(e.codKey));
    }
    return r;
  },

  /** Map codKey → { nome, cod, por:{tipo:n}, total, ult } */
  porColab(evs){
    const m = new Map();
    evs.forEach(e=>{
      if(!m.has(e.codKey)) m.set(e.codKey, { codKey:e.codKey, nome:e.nome, cod:e.cod, por:{}, total:0, ult:null });
      const x = m.get(e.codKey);
      x.por[e.tipo] = (x.por[e.tipo]||0) + 1; x.total++;
      if(!x.ult || e.data > x.ult) x.ult = e.data;
    });
    return m;
  },

  /* ------------------------------------------------------------------ */
  /* alertas: gerar feedback / gerar advertência                          */
  /* ------------------------------------------------------------------ */
  alertas(){
    const res = { feedback:[], advertencia:[] };
    if(!this.carregado() || !window.FeedbackAdv) return res;
    const evs = this.eventos();
    if(!evs.length) return res;
    const ct = window.APP_STATE && window.APP_STATE.currentTeam;
    const fora = FeedbackAdv.dispensados();
    const fbs = FeedbackAdv.feedbacks(), ads = FeedbackAdv.advertencias();
    const porPessoaTipo = new Map();
    evs.forEach(e=>{ const k = e.codKey+"|"+e.tipo; if(!porPessoaTipo.has(k)) porPessoaTipo.set(k, []); porPessoaTipo.get(k).push(e); });
    porPessoaTipo.forEach((lista, k)=>{
      const [codKey, tipoKey] = k.split("|");
      if(ct && ct.codes && !ct.codes.has(codKey)) return;
      if(fora.has(codKey)) return;
      const t = this.tipo(tipoKey), mk = FeedbackAdv.mk(t.motivo);
      const f = fbs.filter(r=>r.codKey===codKey && FeedbackAdv.mk(r.motivo)===mk).sort((a,b)=>b.data-a.data);
      const a = ads.filter(r=>r.codKey===codKey && FeedbackAdv.mk(r.motivo)===mk);
      const base = { codKey, cod:lista[0].cod, nome:lista[0].nome, tipo:tipoKey, label:t.label, motivo:t.motivo, fb:f.length, adv:a.length, totalNc:lista.length };
      const advPend = Math.floor(f.length / NC_FB_PARA_ADV) - a.length;
      if(advPend > 0){
        // ocorrências por trás da advertência: NCs até o último feedback e depois da última advertência desse motivo
        const lastFb = dateOnly(f[0].data), lastAd = a.length ? dateOnly(a.map(r=>r.data).sort((x,y)=>y-x)[0]) : null;
        const ocorr = lista.filter(e=>{ const d = dateOnly(e.data); return d <= lastFb && (!lastAd || d > lastAd); }).sort((x,y)=>x.data-y.data);
        res.advertencia.push({ ...base, pend:advPend, ocorr }); return;
      }
      const corte = f.length ? dateOnly(f[0].data) : null;
      const desde = lista.filter(e=> !corte || dateOnly(e.data) > corte);
      if(desde.length >= NC_POR_FB){
        const prim = desde.reduce((m,e)=> e.data<m ? e.data : m, desde[0].data);
        res.feedback.push({ ...base, ncs:desde.length, desdeData:prim, proxFb:f.length+1, ocorr:desde.sort((x,y)=>x.data-y.data) });
      }
    });
    res.feedback.sort((x,y)=>y.ncs-x.ncs); res.advertencia.sort((x,y)=>y.pend-x.pend);
    return res;
  },

  /** texto com as ocorrências (NCs) que motivaram o alerta */
  ocorrTxt(lista){
    return (lista||[]).map(e=>`- ${fmtDateBR(e.data)} — ${e.origem==="RETORNO"?"retorno":"rua "+(e.rua||"?")}${e.produto?" — produto "+e.produto:""}${e.desc?" ("+e.desc+")":""}${e.auditor?" — auditor "+e.auditor:""}`).join("\n");
  },
  resumoPara(al, kind){
    const cab = kind==="adv"
      ? `Recorrência de não conformidade — ${al.label}: ${al.fb} feedback(s) já aplicado(s) pelo mesmo motivo, com as ocorrências abaixo.`
      : `Recorrência de não conformidade — ${al.label}: ${al.ncs} ocorrência(s) desde ${fmtDateBR(al.desdeData)}.`;
    return cab + "\nOcorrências:\n" + this.ocorrTxt(al.ocorr);
  },
  achar(kind, codKey, tipoKey){ return this.alertas()[kind==="adv" ? "advertencia" : "feedback"].find(x=>x.codKey===codKey && x.tipo===tipoKey); },
  /** abre Lançar Feedback / Advertência já com colaborador, motivo e resumo (com as ocorrências) preenchidos */
  gerar(kind, codKey, tipoKey){
    const al = this.achar(kind, codKey, tipoKey); if(!al) return;
    LancUI.prefill = { mat:al.cod||"", motivo:al.motivo, resumo:this.resumoPara(al, kind) };
    UI.goTo("lancamentos", kind==="adv" ? "ladvertencia" : "lfeedback");
  },
  /** dentro do formulário já aberto: aplica motivo e ocorrências */
  aplicar(kind, codKey, tipoKey){
    const al = this.achar(kind, codKey, tipoKey); if(!al) return;
    const p = kind==="adv" ? "ad" : "fb", sel = document.getElementById(p+"-motivo"), rs = document.getElementById(p+"-resumo");
    if(sel){
      if(!Array.from(sel.options).some(o=>o.value===al.motivo)){ const o = document.createElement("option"); o.value = o.textContent = al.motivo; sel.appendChild(o); }
      sel.value = al.motivo; sel.dispatchEvent(new Event("change"));
    }
    if(rs) rs.value = this.resumoPara(al, kind);
  },
  /** aviso dentro de Lançar Feedback / Lançar Advertência: o colaborador tem NC recorrente pedindo este lançamento */
  htmlIndicacao(mat, kind){
    const key = normStr(String(mat||"").trim()); if(!key) return "";
    if(!this.carregado()){ this.garantir(()=>{ const f = LancUI.ncIndicar; if(f) f.call(LancUI, kind==="adv"?"ad":"fb"); }); return ""; }
    const lista = this.alertas()[kind==="adv" ? "advertencia" : "feedback"].filter(x=>x.codKey===key);
    if(!lista.length) return "";
    return lista.map(x=>`<div class="warn-box nc-ind">
      <div class="nc-ind-h"><strong>⚠️ ${kind==="adv" ? "Advertência indicada" : "Feedback indicado"} por não conformidade</strong> — ${escapeHtml(x.label)}
        ${kind==="adv" ? `· ${x.fb} feedback(s) no motivo, ${x.adv} advertência(s) · <strong>${x.pend} a emitir</strong>` : `· <strong>${x.ncs} NC(s)</strong> desde ${fmtDateBR(x.desdeData)}`}</div>
      <ul class="nc-ind-l">${(x.ocorr||[]).map(e=>`<li>${fmtDateBR(e.data)} — ${e.origem==="RETORNO"?"retorno":"rua "+escapeHtml(e.rua||"?")}${e.produto?" — "+escapeHtml(e.produto):""}${e.desc?" ("+escapeHtml(e.desc)+")":""}</li>`).join("")}</ul>
      <button type="button" class="btn btn-primary btn-sm nc-btn" onclick="NC.aplicar('${kind}','${escapeHtml(x.codKey)}','${x.tipo}')">Usar motivo e ocorrências</button></div>`).join("");
  },
  botoesGerar(x, kind){
    const pane = kind==="adv" ? "ladvertencia" : "lfeedback";
    if(!Auth.can("lancamentos", pane)) return `<span class="small-muted">—</span>`;
    return `<button type="button" class="btn ${kind==="adv"?"btn-danger":"btn-primary"} btn-sm nc-btn" onclick="NC.gerar('${kind}','${escapeHtml(x.codKey)}','${x.tipo}')">${kind==="adv"?"Gerar advertência":"Gerar feedback"}</button>`;
  },

  /* ------------------------------------------------------------------ */
  /* Gestão > Auditoria                                                   */
  /* ------------------------------------------------------------------ */
  renderAuditoria(){
    const el = document.getElementById("aud-nc"); if(!el) return;
    this.garantir(()=>{ if(document.getElementById("aud-nc")) this.renderAuditoria(); });
    const st = AuditOnline.state;
    const head = `<div class="aud-sec aud-sec-nc"><strong>⚠️ Não Conformidades por colaborador</strong><span>fonte: Auditoria_Retorno + Auditoria_Ruas · Possui_NC = TRUE</span></div>`;
    if(!this.carregado()){ el.innerHTML = head + `<div class="hint-box">Carregando as não conformidades…</div>`; return; }
    const evs = this.filtrar(this.eventos(), st);
    const colab = Array.from(this.porColab(evs).values()).sort((a,b)=>b.total-a.total || a.nome.localeCompare(b.nome));
    const tot = {}; this.TIPOS.forEach(t=>tot[t.key]=0); evs.forEach(e=>tot[e.tipo]++);
    const al = this.alertas();
    const sit = new Map();
    al.advertencia.forEach(x=>sit.set(x.codKey, (sit.get(x.codKey)||0) | 2));
    al.feedback.forEach(x=>sit.set(x.codKey, (sit.get(x.codKey)||0) | 1));
    const ruas = this.TIPOS.filter(t=>t.key!=="retorno").reduce((s,t)=>s+tot[t.key],0);
    const info = [];
    const ai = AuditOnline.ncInfo, ri = RetornoOnline.ncInfo;
    if(ai && ai.semColuna) info.push("Auditoria_Ruas: coluna Possui_NC não encontrada.");
    if(ri && ri.semColuna) info.push("Auditoria_Retorno: coluna Possui_NC não encontrada.");
    if(ai && ai.semColab) info.push(`${ai.semColab} NC(s) de rua sem colaborador informado (ignoradas).`);
    if(ai && ai.semCriterio) info.push(`${ai.semCriterio} NC(s) de rua sem nenhum critério marcado (Erro_Produto, Prox_Vencimento, Sem_Saldo ou Avaria).`);
    if(ri && ri.semColab) info.push(`${ri.semColab} NC(s) de retorno sem colaborador informado (ignoradas).`);
    const badge = (c)=> (c&2) ? `<span class="nc-badge nc-adv">Advertir</span>` : (c&1) ? `<span class="nc-badge nc-fb">Gerar feedback</span>` : `<span class="small-muted">—</span>`;
    const cel = (n)=> n ? `<span class="cell-neg"><strong>${n}</strong></span>` : `<span class="small-muted">0</span>`;
    el.innerHTML = head + `
      <div class="cards-grid nc-cards">
        <div class="card ${evs.length?'neg':''}"><div class="card-label">Total de NCs</div><div class="card-value ${evs.length?'neg':''}">${fmtNum(evs.length)}</div><div class="small-muted">${fmtNum(colab.length)} colaborador(es)</div></div>
        <div class="card"><div class="card-label">Erro de Retorno</div><div class="card-value">${fmtNum(tot.retorno)}</div></div>
        <div class="card"><div class="card-label">Erros de Rua</div><div class="card-value">${fmtNum(ruas)}</div><div class="small-muted">soma dos 4 tipos</div></div>
        ${this.TIPOS.filter(t=>t.key!=="retorno").map(t=>`<div class="card"><div class="card-label">${t.label}</div><div class="card-value">${fmtNum(tot[t.key])}</div></div>`).join("")}
        <div class="card ${al.feedback.length?'warn':''}"><div class="card-label">Alerta de feedback</div><div class="card-value">${al.feedback.length}</div><div class="small-muted">${NC_POR_FB} NCs no motivo</div></div>
        <div class="card ${al.advertencia.length?'neg':''}"><div class="card-label">Alerta de advertência</div><div class="card-value ${al.advertencia.length?'neg':''}">${al.advertencia.length}</div><div class="small-muted">${NC_FB_PARA_ADV} feedbacks no mesmo motivo</div></div>
      </div>
      <div class="panel">
        <div class="panel-header"><h3>Contabilização por colaborador</h3><span class="panel-note">Clique no colaborador para ver cada ocorrência · respeita os filtros acima</span></div>
        <div class="table-wrap"><table class="data-table nc-table">
          <thead><tr><th>Colaborador</th>${this.TIPOS.map(t=>`<th class="num" title="${t.label}">${t.curto}</th>`).join("")}<th class="num">Total</th><th>Última NC</th><th>Situação</th></tr></thead>
          <tbody>${colab.length ? colab.map(c=>`<tr class="clickable" onclick="NC.detalhe('${escapeHtml(c.codKey)}')">
            <td><strong>${escapeHtml(c.nome)}</strong> <span class="small-muted">${escapeHtml(c.cod||"")}</span></td>
            ${this.TIPOS.map(t=>`<td class="num">${cel(c.por[t.key]||0)}</td>`).join("")}
            <td class="num"><strong>${c.total}</strong></td><td>${c.ult?fmtDateBR(c.ult):"—"}</td><td>${badge(sit.get(c.codKey)||0)}</td></tr>`).join("")
            : `<tr><td colspan="${this.TIPOS.length+4}" class="small-muted">Nenhuma não conformidade no período/filtros selecionados.</td></tr>`}</tbody>
        </table></div>
        ${info.length ? `<div class="small-muted" style="margin-top:8px">ℹ️ ${info.map(escapeHtml).join(" · ")}</div>` : ""}
      </div>`;
    this._filtro = st;
  },

  detalhe(codKey){
    const evs = this.filtrar(this.eventos(), this._filtro||{}).filter(e=>e.codKey===codKey).sort((a,b)=>b.data-a.data);
    if(!evs.length) return;
    const e0 = evs[0], por = {}; evs.forEach(e=>por[e.tipo]=(por[e.tipo]||0)+1);
    UI.openModal(`
      <h3 style="margin-top:0">${escapeHtml(e0.nome)} <span class="small-muted" style="font-size:13px">${escapeHtml(e0.cod||"")}</span></h3>
      <div class="nc-chips">${this.TIPOS.map(t=>`<span class="nc-chip ${por[t.key]?'on':''}">${t.curto}: <strong>${por[t.key]||0}</strong></span>`).join("")}<span class="nc-chip on">Total: <strong>${evs.length}</strong></span></div>
      <div class="table-wrap" style="max-height:55vh;overflow:auto"><table class="data-table">
        <thead><tr><th>Data</th><th>Tipo</th><th>Rua</th><th>Produto</th><th>Auditor</th></tr></thead>
        <tbody>${evs.map(e=>`<tr><td>${fmtDateBR(e.data)}</td><td>${escapeHtml(this.tipo(e.tipo).label)}</td><td>${escapeHtml(e.rua||"—")}</td>
          <td>${escapeHtml([e.produto, e.desc].filter(Boolean).join(" — ")||"—")}</td><td>${escapeHtml(e.auditor||"—")}</td></tr>`).join("")}</tbody>
      </table></div>`);
  },

  /* ------------------------------------------------------------------ */
  /* Gestão > Feedbacks e Advertências: resumo + botões                   */
  /* ------------------------------------------------------------------ */
  htmlResumoFeedbacks(){
    const head = `<div class="panel-header"><h3>⚠️ Não conformidades recorrentes</h3><span class="panel-note">${NC_POR_FB} NCs no mesmo motivo → 1 feedback · ${NC_FB_PARA_ADV} feedbacks no mesmo motivo → advertência</span></div>`;
    if(!this.carregado()){ this.garantir(()=>{ if(document.getElementById("fb-content")) FeedbackAdv.render(); }); return `<div class="panel">${head}<div class="hint-box">Carregando as não conformidades da planilha de auditoria…</div></div>`; }
    const al = this.alertas();
    const evs = this.eventos();
    const hoje = new Date(), ini = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const mes = evs.filter(e=>dateOnly(e.data)>=ini).length;
    const linhaFb = (x)=>`<tr><td><strong>${escapeHtml(x.nome)}</strong> <span class="small-muted">${escapeHtml(x.cod||"")}</span></td><td>${escapeHtml(x.label)}</td>
      <td class="num"><strong class="cell-neg">${x.ncs}</strong></td><td class="num">${x.fb}</td><td>${fmtDateBR(x.desdeData)}</td><td class="nc-act">${this.botoesGerar(x,"fb")}</td></tr>`;
    const linhaAd = (x)=>`<tr><td><strong>${escapeHtml(x.nome)}</strong> <span class="small-muted">${escapeHtml(x.cod||"")}</span></td><td>${escapeHtml(x.label)}</td>
      <td class="num">${x.fb}</td><td class="num">${x.adv}</td><td class="num"><strong class="cell-neg">${x.pend}</strong></td><td class="nc-act">${this.botoesGerar(x,"adv")}</td></tr>`;
    return `<div class="panel nc-panel">${head}
      <div class="cards-grid nc-cards">
        <div class="card ${al.feedback.length?'warn':''}"><div class="card-label">Gerar feedback</div><div class="card-value">${al.feedback.length}</div><div class="small-muted">${NC_POR_FB} NCs no motivo</div></div>
        <div class="card ${al.advertencia.length?'neg':''}"><div class="card-label">Gerar advertência</div><div class="card-value ${al.advertencia.length?'neg':''}">${al.advertencia.length}</div><div class="small-muted">${NC_FB_PARA_ADV} feedbacks no motivo</div></div>
        <div class="card"><div class="card-label">NCs no mês</div><div class="card-value">${fmtNum(mes)}</div></div>
        <div class="card"><div class="card-label">NCs no total</div><div class="card-value">${fmtNum(evs.length)}</div></div>
      </div>
      <div class="nc-duo">
        <div><div class="nc-sub">📝 Pedem feedback <span class="small-muted">(${al.feedback.length})</span></div>
          <div class="table-wrap"><table class="data-table nc-table"><thead><tr><th>Colaborador</th><th>Motivo</th><th class="num">NCs</th><th class="num">Feedb.</th><th>Desde</th><th></th></tr></thead>
          <tbody>${al.feedback.length ? al.feedback.map(linhaFb).join("") : `<tr><td colspan="6" class="small-muted">Ninguém com ${NC_POR_FB} NCs no mesmo motivo desde o último feedback.</td></tr>`}</tbody></table></div></div>
        <div><div class="nc-sub">🔴 Pedem advertência <span class="small-muted">(${al.advertencia.length})</span></div>
          <div class="table-wrap"><table class="data-table nc-table"><thead><tr><th>Colaborador</th><th>Motivo</th><th class="num">Feedb.</th><th class="num">Advert.</th><th class="num">A emitir</th><th></th></tr></thead>
          <tbody>${al.advertencia.length ? al.advertencia.map(linhaAd).join("") : `<tr><td colspan="6" class="small-muted">Ninguém com ${NC_FB_PARA_ADV} feedbacks sem advertência no mesmo motivo.</td></tr>`}</tbody></table></div></div>
      </div>
      <div class="small-muted" style="margin-top:8px">Os motivos usados são: ${this.TIPOS.map(t=>`<em>${escapeHtml(t.motivo)}</em>`).join(", ")}. O botão já abre o lançamento com colaborador, motivo e resumo preenchidos; o contador reinicia a cada feedback lançado nesse motivo.</div>
    </div>`;
  }
};
window.NC = NC;

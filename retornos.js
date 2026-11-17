/* ==========================================================================
   Núcleo Reposição — Qualidade de Retornos (dentro de Gestão > Auditoria)
   Fontes (mesma planilha da Auditoria): Auditoria_Retorno, Rotina_Retorno, Quadro_Repositores.

   Regra:
   - cada linha de Auditoria_Retorno é um retorno auditado, na RUA em questão; Possui_NC = TRUE = erro encontrado;
   - peso do erro por faixa de auditados na rua: até 10 = 1 · 11–20 = 2 · 21–30 = 3 ... (= ceil(auditados ÷ 10));
   - qualidade = 100% − (peso × erros × 100 ÷ auditados);
   - erro = Possui_NC = TRUE ou divergência etiqueta × físico (mesma contagem do PDF da auditoria de retorno);
   - por repositor: as linhas auditadas/erros são as do próprio repositor (Matricula_Colaborador_NC), igual ao PDF;
   - qualidade do repositor = 100% − (pontos perdidos dele ÷ auditados dele); cada erro perde o peso da rua; acuracidade = conformes ÷ auditados (igual ao PDF);
   - Rotina_Retorno informa quantos retornos a rua teve (cobertura = auditados ÷ retornos).
   ========================================================================== */
const RetornoQ = {
  abas: { aud:"Auditoria_Retorno", rot:"Rotina_Retorno", quadro:"Quadro_Repositores" },
  dados: null,       // { aud:[{rua,data,nc}], rot:[{rua,data}], reps:[{mat,nome,funcao,ruas:[]}], diag:{} }
  carregando: false, erro: null, quando: null,

  /* ---------------- leitura ---------------- */
  url(aba){ return `https://docs.google.com/spreadsheets/d/${AUDITORIA_ONLINE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(aba)}&_ts=${Date.now()}`; },
  async buscar(aba){
    const res = await fetch(this.url(aba), { cache:"no-store" });
    if(!res.ok) throw new Error(`HTTP ${res.status} ao ler a aba "${aba}". Confira se a planilha está compartilhada como "Qualquer pessoa com o link pode visualizar".`);
    const txt = await res.text();
    if(/^\s*</.test(txt)) throw new Error(`A aba "${aba}" não devolveu dados (planilha não pública ou aba com outro nome).`);
    let linhas = AuditOnline.splitCSV(txt);
    if(linhas.length > 1 && linhas[0].every(c=>/^\s*[A-Z]{0,2}\s*$/.test(c))) linhas = linhas.slice(1);
    return linhas;
  },
  chave(s){ return String(s==null?"":s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9]/g,""); },
  achar(cab, nomes, contem){
    const k = cab.map(c=>this.chave(c));
    for(const n of nomes){ const i = k.indexOf(this.chave(n)); if(i>=0) return i; }
    if(contem) for(const n of contem){ const i = k.findIndex(c=>c.includes(this.chave(n))); if(i>=0) return i; }
    return -1;
  },
  numRua(v){ const m = String(v==null?"":v).match(/\d+/); return m ? Number(m[0]) : null; },
  ehVerdade(v){ return /^(true|verdadeiro|sim|s|1|x|yes)$/i.test(String(v==null?"":v).trim()); },
  data(v){ return AuditOnline.parseDateFlexible(v); },

  async carregar(force){
    if(this.carregando && this._p) return this._p;
    if(this.dados && !force) return;
    this._p = this._carregar();
    return this._p;
  },
  async _carregar(){
    this.carregando = true; this.erro = null;
    try{
      // a leitura de Auditoria_Retorno é UMA só (RetornoOnline): NCs, feedbacks, PDF e esta tela usam as mesmas linhas
      const [, r, q] = await Promise.all([ RetornoOnline.load(true), this.buscar(this.abas.rot), this.buscar(this.abas.quadro) ]);
      if(RetornoOnline.error) throw new Error(RetornoOnline.error);
      const rowsA = RetornoOnline.rows || [];
      const diag = {};
      diag.aud = { cab:["DataHora","Rua","Possui_NC","Matricula_Colaborador_NC"], idx:{ rua:0, nc:0, data:0 }, linhas:rowsA.length };
      // Rotina_Retorno
      const cr = r[0]||[]; const ir = { rua:this.achar(cr,["Rua"],["rua"]), data:this.achar(cr,["Data","Data_Retorno"],["data","dt"]) };
      diag.rot = { cab:cr, idx:ir, linhas:Math.max(0,r.length-1) };
      // Quadro_Repositores
      const cq = q[0]||[]; const iq = { mat:this.achar(cq,["Matricula","Matrícula"],["matric","cod"]), nome:this.achar(cq,["Nome"],["nome"]), func:this.achar(cq,["Funcao","Função"],["func","cargo"]), ruas:this.achar(cq,["Ruas","Rua"],["rua"]) };
      diag.quadro = { cab:cq, idx:iq, linhas:Math.max(0,q.length-1) };
      const falta = [];
      if(ir.rua<0) falta.push(`${this.abas.rot}: coluna da rua`);
      if(iq.ruas<0) falta.push(`${this.abas.quadro}: coluna Ruas`); if(iq.nome<0 && iq.mat<0) falta.push(`${this.abas.quadro}: coluna Nome/Matricula`);
      diag.falta = falta;
      const aud = rowsA.map(x=>({ rua:this.numRua(x.rua), data:x.data, nc:!!x.nc, codKey:x.codKey||"", nome:x.nome||"" })).filter(x=>x.rua!=null);
      const rot = r.slice(1).map(l=>({ rua:this.numRua(l[ir.rua]), data: ir.data>=0 ? this.data(l[ir.data]) : null })).filter(x=>x.rua!=null);
      const reps = q.slice(1).map(l=>{ const mat = String(l[iq.mat]||"").trim(), nome = String(l[iq.nome]||"").trim();
        return { mat, nome, codKey: mat ? normStr(mat) : (nome ? "NOME::"+normStr(nome) : ""), funcao:String(l[iq.func]||"").trim(),
          ruas:String(l[iq.ruas]||"").split(/[,;\/\s]+/).map(x=>this.numRua(x)).filter(x=>x!=null) }; }).filter(x=>x.nome && x.ruas.length);
      this.dados = { aud, rot, reps, diag }; this.quando = new Date();
    }catch(e){ this.erro = e && e.message ? e.message : String(e); }
    finally{ this.carregando = false; }
  },

  /** quem responde pela rua numa data (histórico da Atribuição Ruas, se carregado; senão a coluna Ruas do Quadro_Repositores) */
  respHook: null,
  responsaveisEm(rua, data){
    if(this.respHook){ try{ const r = this.respHook(Number(rua), data); if(r) return r; }catch(e){} }
    const D = this.dados; if(!D) return [];
    return D.reps.filter(p=>p.ruas.includes(Number(rua))).map(p=>({ codKey:p.codKey, nome:p.nome }));
  },

  /* ---------------- regra ---------------- */
  peso(auditados){ return Math.max(1, Math.ceil(auditados / 10)); },
  perdidos(auditados, erros){ return auditados>0 ? this.peso(auditados) * erros : 0; },
  qualidade(auditados, perdidos){ return auditados>0 ? Math.max(0, 100 - perdidos*100/auditados) : null; },

  filtrar(lista, ini, fim){
    return lista.filter(x=>{
      if(!ini && !fim) return true;
      if(!x.data) return false;
      const d = dateOnly(x.data);
      return (!ini || d >= dateOnly(ini)) && (!fim || d <= dateOnly(fim));
    });
  },

  /** f (opcional): { rua:Number, codKey, quadro:Set<codKey> } — mesmos filtros da tela de Auditoria */
  calcular(ini, fim, f){
    f = f || {};
    const D = this.dados;
    let aud = this.filtrar(D.aud, ini, fim), rot = this.filtrar(D.rot, ini, fim);
    if(f.rua!=null){ aud = aud.filter(x=>x.rua===f.rua); rot = rot.filter(x=>x.rua===f.rua); }
    // linha com colaborador (NC) = dele; linha conforme (sem colaborador) = de quem respondia pela rua na data
    const expand = x=> x.codKey ? [x] : this.responsaveisEm(x.rua, x.data).filter(r=>r.codKey).map(r=>({ ...x, codKey:r.codKey, nome:r.nome }));
    if(f.codKey) aud = aud.filter(x=> expand(x).some(y=>y.codKey===f.codKey));
    const audR = []; aud.forEach(x=> expand(x).forEach(y=>audR.push(y)));
    const reg = window.APP_STATE && window.APP_STATE.nameRegistry;
    const ruasMap = new Map();
    const rua = n=>{ if(!ruasMap.has(n)) ruasMap.set(n,{ rua:n, retornos:0, auditados:0, erros:0 }); return ruasMap.get(n); };
    rot.forEach(x=> rua(x.rua).retornos++);
    aud.forEach(x=>{ const r = rua(x.rua); r.auditados++; if(x.nc) r.erros++; });
    const ruas = Array.from(ruasMap.values()).map(r=>({ ...r, peso:this.peso(r.auditados), perdidos:this.perdidos(r.auditados,r.erros) }))
      .map(r=>({ ...r, qualidade:this.qualidade(r.auditados, r.perdidos), cobertura: r.retornos ? r.auditados*100/r.retornos : null }))
      .sort((a,b)=>a.rua-b.rua);
    const porRua = new Map(ruas.map(r=>[r.rua,r]));
    // repositores de cada rua = quem teve retorno auditado nela no período; sem auditoria, quem responde pela rua no Quadro_Repositores
    ruas.forEach(r=>{
      const vistos = new Map(); audR.filter(x=>x.rua===r.rua && x.codKey).forEach(x=>vistos.set(x.codKey, (reg&&reg.get(x.codKey)) || x.nome || x.codKey));
      r.reps = vistos.size ? Array.from(vistos.values()) : D.reps.filter(p=>p.ruas.includes(r.rua)).map(p=>p.nome);
    });
    // por repositor: as linhas dele (igual ao PDF). Quem tem rua no Quadro_Repositores aparece mesmo sem auditoria.
    const porRep = new Map();
    const rep = (codKey, nome)=>{ if(!porRep.has(codKey)) porRep.set(codKey,{ codKey, nome:nome||codKey, mat:"", ruas:[], auditados:0, erros:0, perdidos:0, ruasAud:new Set(), retornos:0 }); return porRep.get(codKey); };
    D.reps.forEach(p=>{ if(!p.codKey) return; const e = rep(p.codKey, p.nome); e.mat = p.mat; e.ruas = p.ruas.slice(); p.ruas.forEach(n=>{ const r = porRua.get(n); if(r) e.retornos += r.retornos; }); });
    audR.forEach(x=>{ if(!x.codKey) return; if(f.codKey && x.codKey!==f.codKey) return; const e = rep(x.codKey, x.nome); e.auditados++; e.ruasAud.add(x.rua); if(x.nc){ e.erros++; e.perdidos += (porRua.get(x.rua)||{peso:1}).peso; } });
    let reps = Array.from(porRep.values()).map(e=>({ ...e, nome:(reg&&reg.get(e.codKey)) || e.nome, ruasAud:Array.from(e.ruasAud).sort((a,b)=>a-b),
      qualidade:this.qualidade(e.auditados, e.perdidos), acuracidade: e.auditados ? (e.auditados-e.erros)*100/e.auditados : null,
      cobertura: e.retornos ? e.auditados*100/e.retornos : null }));
    if(f.codKey) reps = reps.filter(e=>e.codKey===f.codKey);
    if(f.quadro) reps = reps.filter(e=>f.quadro.has(e.codKey));
    reps.sort((a,b)=> (a.qualidade==null?101:a.qualidade) - (b.qualidade==null?101:b.qualidade));
    const tot = ruas.reduce((t,r)=>({ retornos:t.retornos+r.retornos, auditados:t.auditados+r.auditados, erros:t.erros+r.erros, perdidos:t.perdidos+r.perdidos }), { retornos:0, auditados:0, erros:0, perdidos:0 });
    tot.qualidade = this.qualidade(tot.auditados, tot.perdidos); tot.cobertura = tot.retornos ? tot.auditados*100/tot.retornos : null;
    tot.acuracidade = tot.auditados ? (tot.auditados-tot.erros)*100/tot.auditados : null;
    return { ruas, reps, tot };
  },

  /** Map codKey → { auditados, erros, qualidade, acuracidade } no período, sem filtros de tela (usado no Ranking de Feedback, no PDF e no mapa de ruas) */
  porRepositor(ini, fim){
    const m = new Map();
    if(!this.dados || (this.dados.diag.falta||[]).length) return m;
    this.calcular(ini, fim).reps.forEach(e=>{ if(e.auditados) m.set(e.codKey, { auditados:e.auditados, erros:e.erros, qualidade:e.qualidade, acuracidade:e.acuracidade }); });
    return m;
  },

  /** qualidade geral mês a mês (todas as ruas), para a linha de evolução */
  serieMensal(){
    const D = this.dados, meses = new Map();
    const chave = d=> d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0");
    D.aud.forEach(x=>{ if(!x.data) return; const k = chave(x.data); if(!meses.has(k)) meses.set(k,{ k, ini:new Date(x.data.getFullYear(), x.data.getMonth(), 1) }); });
    return Array.from(meses.values()).sort((a,b)=>a.k<b.k?-1:1).map(m=>{
      const fim = new Date(m.ini.getFullYear(), m.ini.getMonth()+1, 0), c = this.calcular(m.ini, fim);
      return { label: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][m.ini.getMonth()]+"/"+String(m.ini.getFullYear()).slice(2), q:c.tot.qualidade, aud:c.tot.auditados, err:c.tot.erros };
    });
  },


  /** mesmos filtros da tela de Auditoria (rua, repositor, quadro atual) para os blocos de retorno */
  filtrosTela(){
    const st = AuditOnline.state, f = {};
    if(st.rua){ const n = this.numRua(st.rua); if(n!=null) f.rua = n; }
    if(st.repositor) f.codKey = st.repositor;
    if(st.apenasQuadroAtual==="SIM"){ const ct = window.APP_STATE && window.APP_STATE.currentTeam; if(ct && ct.codes) f.quadro = ct.codes; }
    return f;
  },
  /* ---------------- topo da Auditoria: % geral de Retornos, de Ruas e dos dois ---------------- */
  mesKey(d){ return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0"); },
  media(a, b){ const v = [a,b].filter(x=>x!=null); return v.length ? v.reduce((s,x)=>s+x,0)/v.length : null; },
  qRuas(rows){ return rows.length ? AuditOnline.qualidadeDe(rows) : null; },
  serieGeral(){
    const meses = new Map();
    const add = d=>{ if(d){ const k = this.mesKey(d); if(!meses.has(k)) meses.set(k, new Date(d.getFullYear(), d.getMonth(), 1)); } };
    (AuditOnline.rows||[]).forEach(x=>add(x.data));
    if(this.dados) this.dados.aud.forEach(x=>add(x.data));
    const nomes = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    return Array.from(meses.entries()).sort((a,b)=>a[0]<b[0]?-1:1).slice(-18).map(([k,ini])=>{
      const fim = new Date(ini.getFullYear(), ini.getMonth()+1, 0);
      const qr = this.dados ? this.calcular(ini, fim).tot : null;
      const qRet = qr ? qr.qualidade : null;
      const qRua = this.qRuas((AuditOnline.rows||[]).filter(x=>{ const d = dateOnly(x.data); return d>=ini && d<=fim; }));
      return { label:nomes[ini.getMonth()]+"/"+String(ini.getFullYear()).slice(2), ret:qRet, rua:qRua, geral:this.media(qRet, qRua) };
    });
  },
  renderTopo(){
    const box = document.getElementById("aud-topo"); if(!box) return;
    const st = AuditOnline.state, ini = st.dataInicial, fim = st.dataFinal;
    const rowsPer = (AuditOnline.rows||[]).filter(x=>{ const d = dateOnly(x.data); return (!ini || d>=dateOnly(ini)) && (!fim || d<=dateOnly(fim)); });
    const qRua = this.qRuas(rowsPer);
    const pronto = !!(this.dados && !this.dados.diag.falta.length);
    const qRet = pronto ? this.calcular(ini, fim, this.filtrosTela()).tot.qualidade : null;
    const geral = this.media(qRet, qRua);
    const cl = q=> q==null ? "" : q>=90 ? "pos" : q>=70 ? "warn" : "neg";
    const f = q=> q==null ? "—" : fmtNum(q,1)+"%";
    const per = (ini||fim) ? `${ini?fmtDateBR(ini):"início"} até ${fim?fmtDateBR(fim):"hoje"}` : "todo o histórico";
    const card = (t,v,sub,c,cor)=>`<div class="card ${c}" style="border-left:5px solid ${cor};"><div class="card-label">${t}</div><div class="card-value ${c}" style="font-size:30px">${v}</div><div class="card-sub">${sub}</div></div>`;
    box.innerHTML = `<div class="panel">
      <div class="adm-head"><h3 style="margin:0;">Qualidade geral <span class="small-muted" style="font-weight:500">· ${per}</span></h3></div>
      <div class="cards-grid" style="margin-top:10px;">
        ${card("% Qualidade · Retornos", f(qRet), pronto ? "auditoria de retornos (Auditoria_Retorno)" : (this.erro ? "não foi possível ler os retornos" : "carregando retornos..."), cl(qRet), "#2f6fce")}
        ${card("% Qualidade · Ruas", f(qRua), "auditoria de ruas (Auditoria_Ruas)", cl(qRua), "#e08a1f")}
        ${card("% Qualidade · Geral dos 2", f(geral), "média de Retornos e Ruas", cl(geral), "#1a9c62")}
      </div>
      <h4 style="margin:12px 0 8px;font-size:14px;">Evolução mês a mês</h4>
      <div class="chart-wrap short"><canvas id="chart-qualidade-geral"></canvas></div>
    </div>`;
    const s = this.serieGeral(); if(!s.length) return;
    const pt = (cor)=>({ borderColor:cor, backgroundColor:cor, tension:.3, pointRadius:4, pointHoverRadius:6, spanGaps:true });
    const vals = s.flatMap(m=>[m.ret,m.rua,m.geral]).filter(v=>v!=null);
    Charts.make("chart-qualidade-geral", { type:"line",
      data:{ labels:s.map(m=>m.label), datasets:[
        { label:"Retornos", data:s.map(m=>m.ret), ...pt("#2f6fce"), datalabels:{ display:false } },
        { label:"Ruas", data:s.map(m=>m.rua), ...pt("#e08a1f"), datalabels:{ display:false } },
        { label:"Geral dos 2", data:s.map(m=>m.geral), ...pt("#1a9c62"), borderWidth:3, pointRadius:5, datalabels:{ display:true, align:"top", anchor:"end", color:"#1a9c62", font:{size:11,weight:"700"}, formatter:v=>v==null?"":fmtNum(v,1)+"%" } }
      ]},
      options:{ responsive:true, maintainAspectRatio:false, layout:{ padding:{ top:20, right:12 } }, interaction:{ mode:"index", intersect:false },
        plugins:{ legend:{ labels:{font:{size:11}} }, tooltip:{ callbacks:{ label:c=>c.dataset.label+": "+(c.parsed.y==null?"-":fmtNum(c.parsed.y,1)+"%") } } },
        scales:{ y:{ min:Math.max(0, Math.floor(Math.min(100,...vals)/10)*10-10), max:100, ticks:{ callback:v=>v+"%" }, grid:{color:"rgba(128,140,160,.18)"} }, x:{ grid:{display:false} } } } });
  },

  /* ---------------- tela ---------------- */
  async render(){
    this.renderTopo();
    const box = document.getElementById("aud-retornos"); if(!box) return;
    if(!this.dados && !this.carregando && !this.erro){
      box.innerHTML = `<div class="panel"><h3 style="margin:0 0 6px;">Qualidade de Retornos</h3><p class="small-muted">Carregando Auditoria_Retorno, Rotina_Retorno e Quadro_Repositores...</p></div>`;
      await this.carregar(); return this.render();
    }
    if(this.carregando){ box.innerHTML = `<div class="panel"><p class="small-muted">Atualizando retornos...</p></div>`; return; }
    if(this.erro){
      box.innerHTML = `<div class="panel"><h3 style="margin:0 0 6px;">Qualidade de Retornos</h3><div class="error-box">${escapeHtml(this.erro)}</div><button class="btn btn-outline btn-sm" id="rq-retry">Tentar novamente</button></div>`;
      document.getElementById("rq-retry").addEventListener("click", async ()=>{ this.erro=null; this.dados=null; await this.carregar(true); this.render(); });
      return;
    }
    const D = this.dados, st = AuditOnline.state;
    if(D.diag.falta.length){
      const lista = k=> `<div class="small-muted"><strong>${this.abas[k]}</strong> (${D.diag[k].linhas} linhas): ${D.diag[k].cab.map(c=>escapeHtml(c||"∅")).join(" | ")}</div>`;
      box.innerHTML = `<div class="panel"><h3 style="margin:0 0 6px;">Qualidade de Retornos</h3><div class="warn-box">Não encontrei: <strong>${D.diag.falta.map(escapeHtml).join("; ")}</strong>.<br>Estas são as colunas que li (me passe se algum nome for diferente):</div>${lista("aud")}${lista("rot")}${lista("quadro")}</div>`;
      return;
    }
    const c = this.calcular(st.dataInicial, st.dataFinal, this.filtrosTela()), t = c.tot;
    const per = (st.dataInicial||st.dataFinal) ? `${st.dataInicial?fmtDateBR(st.dataInicial):"início"} até ${st.dataFinal?fmtDateBR(st.dataFinal):"hoje"}` : "todo o histórico";
    const cor = q=> q==null ? "" : q>=90 ? "cell-pos" : q>=70 ? "cell-warn" : "cell-neg";
    const fq = q=> q==null ? '<span class="small-muted">sem auditoria</span>' : fmtNum(q,1)+"%";
    const card = (tt,v,sub,cl)=>`<div class="card ${cl||""}"><div class="card-label">${tt}</div><div class="card-value ${cl||""}">${v}</div>${sub?`<div class="card-sub">${sub}</div>`:""}</div>`;
    const avisoData = (D.diag.aud.idx.data<0 || D.diag.rot.idx.data<0) ? `<div class="warn-box">Não achei a coluna de data em ${D.diag.aud.idx.data<0?this.abas.aud:""}${D.diag.aud.idx.data<0&&D.diag.rot.idx.data<0?" e ":""}${D.diag.rot.idx.data<0?this.abas.rot:""}: o filtro de período não se aplica a ela.</div>` : "";
    box.innerHTML = `<div class="panel" id="rq-panel">
      <div class="adm-head"><h3 style="margin:0;">Qualidade de Retornos <span class="small-muted" style="font-weight:500">· ${per} · segue o filtro de período acima</span></h3>
        <div class="adm-head-r"><span class="small-muted">${this.quando?("atualizado "+this.quando.toLocaleTimeString("pt-BR")):""}</span><button class="btn btn-outline btn-sm" id="rq-reload">↻ Atualizar retornos</button></div></div>
      <p class="small-muted" style="margin:6px 0 10px">Cada retorno auditado com <strong>Possui_NC = TRUE</strong> (ou divergência entre etiqueta e físico) é um erro, contado para o repositor da própria linha — mesma contagem do PDF da auditoria de retorno. <strong>Acuracidade</strong> = (auditados − erros) ÷ auditados. <strong>Qualidade</strong> = 100% − pontos perdidos ÷ auditados; cada erro perde o peso da rua pela quantidade auditada nela (até 10 = 1 · 11–20 = 2 · 21–30 = 3…).</p>
      ${avisoData}
      <div class="cards-grid">
        ${card("Retornos na rotina", fmtNum(t.retornos))}
        ${card("Retornos auditados", fmtNum(t.auditados), t.cobertura==null?"":fmtNum(t.cobertura,1)+"% dos retornos")}
        ${card("Erros encontrados", fmtNum(t.erros), "", t.erros?"neg":"")}
        ${card("Acuracidade", t.acuracidade==null?"—":fmtNum(t.acuracidade,1)+"%", "conformes ÷ auditados (igual ao PDF)", t.acuracidade==null?"":(t.acuracidade>=95?"pos":t.acuracidade>=85?"warn":"neg"))}
        ${card("Qualidade geral", t.qualidade==null?"—":fmtNum(t.qualidade,1)+"%", "com peso por rua", t.qualidade==null?"":(t.qualidade>=90?"pos":t.qualidade>=70?"warn":"neg"))}
      </div>
      <div>
        <div><h4 style="margin:6px 0 8px;font-size:14px;">Por repositor</h4>
          <div class="table-wrap"><table class="data-table"><thead><tr><th>Repositor</th><th>Ruas (Quadro_Repositores)</th><th>Auditados</th><th>Erros</th><th>Acuracidade</th><th>Qualidade</th></tr></thead><tbody>
          ${c.reps.map(p=>`<tr><td>${escapeHtml(p.nome)}</td><td>${p.ruas.join(", ")||'<span class="small-muted">—</span>'}</td><td>${fmtNum(p.auditados)}</td><td>${p.erros?`<strong style="color:var(--red)">${p.erros}</strong>`:"0"}</td><td class="${cor(p.acuracidade)}"><strong>${p.acuracidade==null?'<span class="small-muted">sem auditoria</span>':fmtNum(p.acuracidade,1)+"%"}</strong></td><td class="${cor(p.qualidade)}"><strong>${fq(p.qualidade)}</strong></td></tr>`).join("")||`<tr><td colspan="6" class="small-muted">Nenhum repositor com ruas em ${this.abas.quadro}.</td></tr>`}
          </tbody></table></div></div>
        <div style="margin-top:18px;"><h4 style="margin:6px 0 8px;font-size:14px;">Por rua <span class="small-muted" style="font-weight:500">· retornos auditados em cada rua</span></h4>
          <div class="table-wrap"><table class="data-table"><thead><tr><th>Rua</th><th>Repositor(es)</th><th>Retornos</th><th>Auditados</th><th>% audit.</th><th>Erros</th><th>Peso</th><th>Qualidade</th></tr></thead><tbody>
          ${c.ruas.map(r=>`<tr><td><strong>${r.rua}</strong></td><td>${r.reps.map(escapeHtml).join(", ")||'<span class="small-muted">sem repositor</span>'}</td><td>${fmtNum(r.retornos)}</td><td>${fmtNum(r.auditados)}</td><td>${r.cobertura==null?"—":fmtNum(r.cobertura,0)+"%"}</td><td>${r.erros?`<strong style="color:var(--red)">${r.erros}</strong>`:"0"}</td><td>${r.auditados?r.peso:"—"}</td><td class="${cor(r.qualidade)}"><strong>${fq(r.qualidade)}</strong></td></tr>`).join("")||`<tr><td colspan="8" class="small-muted">Sem retornos no período.</td></tr>`}
          </tbody></table></div></div>
      </div>
    </div>`;
    document.getElementById("rq-reload").addEventListener("click", async ()=>{ this.dados=null; this.erro=null; await this.carregar(true); this.render(); });
  }
};

window.RetornoQ = RetornoQ;

/* ==========================================================================
   Núcleo Reposição — Qualidade de Retornos (dentro de Gestão > Auditoria)
   Fontes (mesma planilha da Auditoria): Auditoria_Retorno, Rotina_Retorno, Quadro_Repositores.

   Regra:
   - cada linha de Auditoria_Retorno é um retorno auditado, na RUA em questão; Possui_NC = TRUE = erro encontrado;
   - peso do erro por faixa de auditados na rua: até 10 = 1 · 11–20 = 2 · 21–30 = 3 ... (= ceil(auditados ÷ 10));
   - qualidade = 100% − (peso × erros × 100 ÷ auditados);
   - rua com mais de um repositor: o erro conta para todos os repositores da rua (Quadro_Repositores);
   - qualidade do repositor = pontos perdidos somados nas ruas dele ÷ auditados somados nas ruas dele;
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
    if(this.carregando) return;
    if(this.dados && !force) return;
    this.carregando = true; this.erro = null;
    try{
      const [a, r, q] = await Promise.all([ this.buscar(this.abas.aud), this.buscar(this.abas.rot), this.buscar(this.abas.quadro) ]);
      const diag = {};
      // Auditoria_Retorno
      const ca = a[0]||[]; const ia = { rua:this.achar(ca,["Rua"],["rua"]), nc:this.achar(ca,["Possui_NC","PossuiNC"],["possuinc","nc"]), data:this.achar(ca,["Data","Data_Auditoria"],["data","dt"]) };
      diag.aud = { cab:ca, idx:ia, linhas:Math.max(0,a.length-1) };
      // Rotina_Retorno
      const cr = r[0]||[]; const ir = { rua:this.achar(cr,["Rua"],["rua"]), data:this.achar(cr,["Data","Data_Retorno"],["data","dt"]) };
      diag.rot = { cab:cr, idx:ir, linhas:Math.max(0,r.length-1) };
      // Quadro_Repositores
      const cq = q[0]||[]; const iq = { mat:this.achar(cq,["Matricula","Matrícula"],["matric","cod"]), nome:this.achar(cq,["Nome"],["nome"]), func:this.achar(cq,["Funcao","Função"],["func","cargo"]), ruas:this.achar(cq,["Ruas","Rua"],["rua"]) };
      diag.quadro = { cab:cq, idx:iq, linhas:Math.max(0,q.length-1) };
      const falta = [];
      if(ia.rua<0) falta.push(`${this.abas.aud}: coluna da rua`); if(ia.nc<0) falta.push(`${this.abas.aud}: coluna Possui_NC`);
      if(ir.rua<0) falta.push(`${this.abas.rot}: coluna da rua`);
      if(iq.ruas<0) falta.push(`${this.abas.quadro}: coluna Ruas`); if(iq.nome<0 && iq.mat<0) falta.push(`${this.abas.quadro}: coluna Nome/Matricula`);
      diag.falta = falta;
      const aud = a.slice(1).map(l=>({ rua:this.numRua(l[ia.rua]), data: ia.data>=0 ? this.data(l[ia.data]) : null, nc: ia.nc>=0 && this.ehVerdade(l[ia.nc]) })).filter(x=>x.rua!=null);
      const rot = r.slice(1).map(l=>({ rua:this.numRua(l[ir.rua]), data: ir.data>=0 ? this.data(l[ir.data]) : null })).filter(x=>x.rua!=null);
      const reps = q.slice(1).map(l=>({ mat:String(l[iq.mat]||"").trim(), nome:String(l[iq.nome]||"").trim(), funcao:String(l[iq.func]||"").trim(),
        ruas:String(l[iq.ruas]||"").split(/[,;\/\s]+/).map(x=>this.numRua(x)).filter(x=>x!=null) })).filter(x=>x.nome && x.ruas.length);
      this.dados = { aud, rot, reps, diag }; this.quando = new Date();
    }catch(e){ this.erro = e && e.message ? e.message : String(e); }
    finally{ this.carregando = false; }
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

  calcular(ini, fim){
    const D = this.dados, aud = this.filtrar(D.aud, ini, fim), rot = this.filtrar(D.rot, ini, fim);
    const ruasMap = new Map();
    const rua = n=>{ if(!ruasMap.has(n)) ruasMap.set(n,{ rua:n, retornos:0, auditados:0, erros:0 }); return ruasMap.get(n); };
    rot.forEach(x=> rua(x.rua).retornos++);
    aud.forEach(x=>{ const r = rua(x.rua); r.auditados++; if(x.nc) r.erros++; });
    const ruas = Array.from(ruasMap.values()).map(r=>({ ...r, peso:this.peso(r.auditados), perdidos:this.perdidos(r.auditados,r.erros) }))
      .map(r=>({ ...r, qualidade:this.qualidade(r.auditados, r.perdidos), cobertura: r.retornos ? r.auditados*100/r.retornos : null }))
      .sort((a,b)=>a.rua-b.rua);
    const porRua = new Map(ruas.map(r=>[r.rua,r]));
    ruas.forEach(r=>{ r.reps = D.reps.filter(p=>p.ruas.includes(r.rua)).map(p=>p.nome); });
    const reps = D.reps.map(p=>{
      let retornos=0, auditados=0, erros=0, perdidos=0; const detalhe = [];
      p.ruas.forEach(n=>{ const r = porRua.get(n); if(!r) return; retornos+=r.retornos; auditados+=r.auditados; erros+=r.erros; perdidos+=r.perdidos; detalhe.push(r); });
      return { ...p, retornos, auditados, erros, perdidos, qualidade:this.qualidade(auditados, perdidos), cobertura: retornos ? auditados*100/retornos : null, detalhe };
    }).sort((a,b)=> (a.qualidade==null?101:a.qualidade) - (b.qualidade==null?101:b.qualidade));
    const tot = ruas.reduce((t,r)=>({ retornos:t.retornos+r.retornos, auditados:t.auditados+r.auditados, erros:t.erros+r.erros, perdidos:t.perdidos+r.perdidos }), { retornos:0, auditados:0, erros:0, perdidos:0 });
    tot.qualidade = this.qualidade(tot.auditados, tot.perdidos); tot.cobertura = tot.retornos ? tot.auditados*100/tot.retornos : null;
    return { ruas, reps, tot };
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

  /* ---------------- tela ---------------- */
  async render(){
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
    const c = this.calcular(st.dataInicial, st.dataFinal), t = c.tot;
    const per = (st.dataInicial||st.dataFinal) ? `${st.dataInicial?fmtDateBR(st.dataInicial):"início"} até ${st.dataFinal?fmtDateBR(st.dataFinal):"hoje"}` : "todo o histórico";
    const cor = q=> q==null ? "" : q>=90 ? "cell-pos" : q>=70 ? "cell-warn" : "cell-neg";
    const fq = q=> q==null ? '<span class="small-muted">sem auditoria</span>' : fmtNum(q,1)+"%";
    const card = (tt,v,sub,cl)=>`<div class="card ${cl||""}"><div class="card-label">${tt}</div><div class="card-value ${cl||""}">${v}</div>${sub?`<div class="card-sub">${sub}</div>`:""}</div>`;
    const avisoData = (D.diag.aud.idx.data<0 || D.diag.rot.idx.data<0) ? `<div class="warn-box">Não achei a coluna de data em ${D.diag.aud.idx.data<0?this.abas.aud:""}${D.diag.aud.idx.data<0&&D.diag.rot.idx.data<0?" e ":""}${D.diag.rot.idx.data<0?this.abas.rot:""}: o filtro de período não se aplica a ela.</div>` : "";
    box.innerHTML = `<div class="panel" id="rq-panel">
      <div class="adm-head"><h3 style="margin:0;">Qualidade de Retornos <span class="small-muted" style="font-weight:500">· ${per} · segue o filtro de período acima</span></h3>
        <div class="adm-head-r"><span class="small-muted">${this.quando?("atualizado "+this.quando.toLocaleTimeString("pt-BR")):""}</span><button class="btn btn-outline btn-sm" id="rq-reload">↻ Atualizar retornos</button></div></div>
      <p class="small-muted" style="margin:6px 0 10px">Cada retorno auditado com <strong>Possui_NC = TRUE</strong> é um erro. Peso do erro pela quantidade auditada na rua: até 10 = 1 · 11–20 = 2 · 21–30 = 3… Qualidade = 100% − (peso × erros ÷ auditados). Rua com mais de um repositor: o erro conta para todos.</p>
      ${avisoData}
      <div class="cards-grid">
        ${card("Retornos na rotina", fmtNum(t.retornos))}
        ${card("Retornos auditados", fmtNum(t.auditados), t.cobertura==null?"":fmtNum(t.cobertura,1)+"% dos retornos")}
        ${card("Erros encontrados", fmtNum(t.erros), "", t.erros?"neg":"")}
        ${card("Qualidade geral", t.qualidade==null?"—":fmtNum(t.qualidade,1)+"%", "", t.qualidade==null?"":(t.qualidade>=90?"pos":t.qualidade>=70?"warn":"neg"))}
      </div>
      <div class="grid-2">
        <div><h4 style="margin:6px 0 8px;font-size:14px;">Por repositor</h4>
          <div class="table-wrap"><table class="data-table"><thead><tr><th>Repositor</th><th>Ruas</th><th>Retornos</th><th>Auditados</th><th>Erros</th><th>Qualidade</th></tr></thead><tbody>
          ${c.reps.map(p=>`<tr><td>${escapeHtml(p.nome)}</td><td>${p.ruas.join(", ")}</td><td>${fmtNum(p.retornos)}</td><td>${fmtNum(p.auditados)}</td><td>${p.erros?`<strong style="color:var(--red)">${p.erros}</strong>`:"0"}</td><td class="${cor(p.qualidade)}"><strong>${fq(p.qualidade)}</strong></td></tr>`).join("")||`<tr><td colspan="6" class="small-muted">Nenhum repositor com ruas em ${this.abas.quadro}.</td></tr>`}
          </tbody></table></div></div>
        <div><h4 style="margin:6px 0 8px;font-size:14px;">Por rua</h4>
          <div class="table-wrap"><table class="data-table"><thead><tr><th>Rua</th><th>Repositor(es)</th><th>Retornos</th><th>Auditados</th><th>% audit.</th><th>Erros</th><th>Peso</th><th>Qualidade</th></tr></thead><tbody>
          ${c.ruas.map(r=>`<tr><td><strong>${r.rua}</strong></td><td>${r.reps.map(escapeHtml).join(", ")||'<span class="small-muted">sem repositor</span>'}</td><td>${fmtNum(r.retornos)}</td><td>${fmtNum(r.auditados)}</td><td>${r.cobertura==null?"—":fmtNum(r.cobertura,0)+"%"}</td><td>${r.erros?`<strong style="color:var(--red)">${r.erros}</strong>`:"0"}</td><td>${r.auditados?r.peso:"—"}</td><td class="${cor(r.qualidade)}"><strong>${fq(r.qualidade)}</strong></td></tr>`).join("")||`<tr><td colspan="8" class="small-muted">Sem retornos no período.</td></tr>`}
          </tbody></table></div></div>
      </div>
      <h4 style="margin:14px 0 8px;font-size:14px;">Qualidade de retornos mês a mês</h4>
      <div class="chart-wrap short"><canvas id="chart-retornos-mes"></canvas></div>
    </div>`;
    document.getElementById("rq-reload").addEventListener("click", async ()=>{ this.dados=null; this.erro=null; await this.carregar(true); this.render(); });
    const s = this.serieMensal();
    Charts.make("chart-retornos-mes", { type:"line",
      data:{ labels:s.map(m=>m.label), datasets:[{ label:"Qualidade de retornos (%)", data:s.map(m=>m.q), borderColor:Charts.colors.blue, backgroundColor:"rgba(47,111,206,.12)", fill:true, tension:.3, pointRadius:5, pointHoverRadius:7,
        datalabels:{ display:true, align:"top", anchor:"end", color:Charts.colors.blue, font:{size:11,weight:"700"}, formatter:v=>v==null?"":fmtNum(v,1)+"%" } }] },
      options:{ responsive:true, maintainAspectRatio:false, layout:{ padding:{ top:20, right:12 } },
        plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:c=>"Qualidade: "+(c.parsed.y==null?"-":fmtNum(c.parsed.y,1)+"%"), afterBody:i=>{ const m=s[i[0].dataIndex]; return m?["", m.aud+" auditado(s) · "+m.err+" erro(s)"]:[]; } } } },
        scales:{ y:{ min:Math.max(0, Math.floor(Math.min(100,...s.map(m=>m.q==null?100:m.q))/10)*10-10), max:100, ticks:{ callback:v=>v+"%" }, grid:{color:"rgba(128,140,160,.18)"} }, x:{ grid:{display:false} } } } });
  }
};

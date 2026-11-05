/* =========================================================================
   Comissão — parâmetros versionados (salvos na planilha), cálculo unificado,
   resumo mensal, equipe de apoio e lançamentos do mês.
   Carregado depois do app.js (usa Commission, getComissaoTableData, etc.).
   ========================================================================= */

/* ---------------------------------------------------------------------- */
/* Parâmetros: versões (vigências) + lançamentos mensais                    */
/* ---------------------------------------------------------------------- */
const ComissaoParams = {
  KEY: "nucleo_comissao_v2",
  OLD_KEY: "nucleo_comissao_apoio_v1",
  _e: null, status: "", _remoto: false,

  clone(o){ return JSON.parse(JSON.stringify(o)); },
  ym(d){ return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0"); },
  ymRot(ym){ const [y,m] = ym.split("-"); return (MESES_PT[Number(m)-1]||m) + "/" + y; },

  padrao(){
    const d = (typeof DEFAULT_COMMISSION_CONFIG !== "undefined") ? DEFAULT_COMMISSION_CONFIG : { bands:[], exceptions:[] };
    return {
      bands: this.clone(d.bands||[]), exceptions: this.clone(d.exceptions||[]),
      aplicarDesconto: "SIM", considerarMissoes: "SIM",
      teto: 15000, metaFaturamento: 100000000, pontosMinimos: 660, valorFixoAbaixo: 300,
      auditor:    { cod:"", valorAudit:0.5, bonusNC:0, metaAuditorias:0, pctSeNaoBater:30, faixas:[{ min:0, max:49.99, value:0 }, { min:50, max:100, value:0 }] },
      recuperacao:{ cod:"", valorItem:0, metaItens:0, pctSeNaoBater:30, motivo:"RECUPERADO (REP) STO", extras:[] },
      fixos: [],      // [{ cod, tipo, valor }]  comissão fixa por código
      excecoes: []    // códigos que não contam como repositor (nem na meta do quadro)
    };
  },
  mesclar(base, p){
    const out = this.clone(base);
    Object.keys(p||{}).forEach(k=>{
      if(p[k] && typeof p[k]==="object" && !Array.isArray(p[k]) && out[k] && typeof out[k]==="object" && !Array.isArray(out[k])) out[k] = { ...out[k], ...p[k] };
      else out[k] = p[k];
    });
    return out;
  },
  normalizar(e){
    const base = this.padrao();
    e.versoes.forEach(v=>{ v.p = this.mesclar(base, v.p); });
    e.mensal = e.mensal || {};
    e.versoes.sort((a,b)=> a.desde < b.desde ? -1 : a.desde > b.desde ? 1 : 0);
    return e;
  },
  migrarAntigo(p, old){
    if(!old) return;
    if(old.geral && old.geral.teto!=null) p.teto = Number(old.geral.teto)||p.teto;
    if(old.ronny)   p.auditor = { ...p.auditor, cod:old.ronny.cod||"", valorAudit:old.ronny.valorAudit!=null?old.ronny.valorAudit:p.auditor.valorAudit, faixas:old.ronny.faixas||p.auditor.faixas };
    if(old.fabiane) p.recuperacao = { ...p.recuperacao, cod:old.fabiane.cod||"", valorItem:old.fabiane.valorItem!=null?old.fabiane.valorItem:0, motivo:old.fabiane.motivo||p.recuperacao.motivo };
  },
  estado(){
    if(this._e) return this._e;
    let e = null;
    try{ e = JSON.parse(localStorage.getItem(this.KEY) || "null"); }catch(x){}
    if(!e || !Array.isArray(e.versoes) || !e.versoes.length){
      e = { versoes:[{ desde:"0000-00", p:this.padrao() }], mensal:{} };
      try{ this.migrarAntigo(e.versoes[0].p, JSON.parse(localStorage.getItem(this.OLD_KEY) || "null")); }catch(x){}
    }
    return (this._e = this.normalizar(e));
  },
  paraMes(ym){
    const vs = this.estado().versoes; let achada = vs[0];
    vs.forEach(v=>{ if(v.desde <= ym) achada = v; });
    return achada.p;
  },
  ymPeriodo(ini, fim){
    const d = fim || ini || (typeof Production !== "undefined" && Production.maxDataDate()) || new Date();
    return this.ym(d);
  },
  paraPeriodo(ini, fim){ return this.paraMes(this.ymPeriodo(ini, fim)); },
  vigente(){ const vs = this.estado().versoes; return vs[vs.length-1].p; },

  mensalDe(ym){
    const m = this.estado().mensal[ym] || {};
    return { faturado: m.faturado!=null ? m.faturado : null, itensManual: m.itensManual!=null ? m.itensManual : null, audsManual: m.audsManual!=null ? m.audsManual : null, avariaValor: Number(m.avariaValor)||0, avariaPct: Number(m.avariaPct)||0, manuais: (m.manuais||[]).map(x=>({ nome:x.nome||"", valor:Number(x.valor)||0 })) };
  },
  setMensal(ym, obj){ this.estado().mensal[ym] = obj; },
  fatorFat(P, M){ return (M.faturado>0 && P.metaFaturamento>0) ? M.faturado / P.metaFaturamento : 1; },

  async persistir(){
    try{ localStorage.setItem(this.KEY, JSON.stringify(this._e)); }catch(x){}
    if(!Api.configured() || !Auth.user){ this.status = "Salvo só neste navegador"; return false; }
    try{
      const r = await Api.call({ acao:"lanc_comissao_cfg_salvar", cfg:this._e });
      if(r && r.ok){ this.status = "Salvo na planilha (" + (r.atualizado||"agora") + ")"; return true; }
      this.status = "Não foi possível salvar na planilha: " + ((r && r.erro) || "erro") + " (salvo neste navegador)";
    }catch(x){ this.status = "Sem conexão — salvo só neste navegador"; }
    return false;
  },
  async carregarRemoto(){
    if(this._remoto || !Api.configured() || !Auth.user) return;
    this._remoto = true;
    try{
      const r = await Api.call({ acao:"lanc_comissao_cfg_ler" });
      if(r && r.ok && r.cfg){
        let e = r.cfg;
        if(!Array.isArray(e.versoes)){        // formato antigo (só equipe de apoio)
          const novo = { versoes:[{ desde:"0000-00", p:this.padrao() }], mensal:{} };
          this.migrarAntigo(novo.versoes[0].p, e); e = novo;
        }
        this._e = this.normalizar(e);
        try{ localStorage.setItem(this.KEY, JSON.stringify(this._e)); }catch(x){}
        this.status = "Parâmetros carregados da planilha" + (r.atualizado ? " ("+r.atualizado+")" : "");
        if(window.ComissaoParamsUI) ComissaoParamsUI.aoCarregar();
      } else if(r && r.ok){ this.status = "Ainda não salvo na planilha"; }
    }catch(x){ this.status = "Planilha indisponível — usando o salvo neste navegador"; }
  },
  /** Salva o rascunho. congelar=true: meses anteriores a `desde` mantêm os parâmetros antigos. */
  async commit(draft, congelar, desde){
    const e = this.estado();
    if(congelar && desde){
      e.versoes = e.versoes.filter(v=> v.desde < desde);
      e.versoes.push({ desde, p:this.clone(draft) });
    } else {
      e.versoes[e.versoes.length-1].p = this.clone(draft);
    }
    return this.persistir();
  }
};
window.ComissaoParams = ComissaoParams;

function comAplicarDesconto(){ return ComissaoParams.paraMes(ComissaoParams.ymPeriodo(CommissionState.dataInicial, CommissionState.dataFinal)).aplicarDesconto; }
function comConsiderarMissoes(){ return ComissaoParams.paraMes(ComissaoParams.ymPeriodo(CommissionState.dataInicial, CommissionState.dataFinal)).considerarMissoes; }

/* ---------------------------------------------------------------------- */
/* Cálculo unificado de um mês (repositores + apoio + fixas + manuais)      */
/* ---------------------------------------------------------------------- */
const ComissaoCalc = {
  digits(v){ return String(v==null ? "" : v).replace(/\D/g,""); },
  nomeDe(cod){
    const d = this.digits(cod); if(!d) return "";
    const key = normStr(d), reg = window.APP_STATE.nameRegistry, pr = window.APP_STATE.processed || {};
    if(reg && reg.get(key)) return reg.get(key);
    const t = (pr.turnover||[]).find(x=>x.codKey===key); if(t && t.nome) return t.nome;
    const q = (pr.quadro||[]).find(x=>x.codKey===key); return q && q.nome ? q.nome : "";
  },
  excluidos(P){
    const s = new Set();
    (P.excecoes||[]).forEach(c=>{ const d = this.digits(c); if(d) s.add(d); });
    [P.auditor.cod, P.recuperacao.cod].forEach(c=>{ const d = this.digits(c); if(d) s.add(d); });
    (P.fixos||[]).forEach(f=>{ const d = this.digits(f.cod); if(d) s.add(d); });
    return s;
  },
  /** Quem lançou (Func.Lançamento) o motivo de recuperação no período, para conferência/atribuição. */
  lancadoresRec(P, ini, fim){
    const alvo = normStr(P.recuperacao.motivo||""), i = dateOnly(ini), f = dateOnly(fim), por = new Map();
    (window.APP_STATE.processed.p9712||[]).forEach(r=>{
      if(!r.dt || dateOnly(r.dt)<i || dateOnly(r.dt)>f || (r.codMotivo!=="1886" && normStr(r.motivo||"")!==alvo)) return;
      const k = this.digits(r.funcLanc); if(!k) return;
      const e = por.get(k) || { cod:k, nome: this.nomeDe(k) || r.nome || ("Cód. "+k), itens:0, lanc:0 };
      e.itens++; e.lanc++; por.set(k, e);
    });
    return Array.from(por.values()).sort((a,b)=>b.itens-a.itens);
  },
  mes(ini, fim, fator){
    fator = fator || 1;
    const P = ComissaoParams.paraPeriodo(ini, fim), ym = ComissaoParams.ymPeriodo(ini, fim), M = ComissaoParams.mensalDe(ym);
    const fatFat = ComissaoParams.fatorFat(P, M);
    const todosRows = Commission.computeAll(ini, fim);
    let rep = getComissaoTableData(ini, fim, todosRows);
    if(fator !== 1) rep = rep.map(e=> Commission.recalcular(e, Math.round(e.pontos*fator), P, fatFat));

    // ---- avaria: % do valor de avaria do mês diluído igualmente entre os repositores ----
    const avariaTotal = M.avariaValor * M.avariaPct / 100;
    const cota = rep.length ? avariaTotal / rep.length : 0;
    rep = rep.map(e=>{
      const desc = Math.min(cota, Math.max(e.comissaoTotal, 0));
      return { ...e, preAvaria: e.comissaoTotal, avariaCota: desc, comissaoTotal: e.comissaoTotal - desc,
        regra: desc>0 ? e.regra + ` — avaria −${fmtBRL(desc)}` : e.regra };
    });

    // ---- quadro: quem bateu a pontuação mínima (mesma regra da tabela, sem os códigos de exceção) ----
    const team = window.APP_STATE.currentTeam, excl = this.excluidos(P);
    const baseCodes = team.cargoDisponivel ? team.repositorCodes : team.codes;
    const membros = team.members.filter(m=> baseCodes.has(m.codKey) && !excl.has(this.digits(m.codigo)));
    const todos = new Map(todosRows.filter(e=>baseCodes.has(e.codKey)).map(e=>[e.codKey, Math.round(e.pontos*fator)]));
    const minimo = Number(P.pontosMinimos)||0;
    const bateu = [], nao = [];
    membros.forEach(m=>{ const pts = todos.get(m.codKey)||0; (pts >= minimo ? bateu : nao).push({ nome: window.APP_STATE.nameRegistry.get(m.codKey)||m.nome, pontos:pts }); });
    const baseN = membros.length, pctQuadro = baseN ? bateu.length/baseN*100 : null;

    const linhas = [];
    // ---- auditor ----
    let aud = null;
    const bonusNC = Number(P.auditor.bonusNC)||0;
    if(this.digits(P.auditor.cod)){
      const nome = this.nomeDe(P.auditor.cod) || ("Cód. " + P.auditor.cod);
      let auds = (window.RetornoOnline && RetornoOnline.rows) ? RetornoOnline.contarPorAuditor(ini || new Date(2000,0,1), fim || new Date(), P.auditor.cod, this.nomeDe(P.auditor.cod)) : undefined;
      const audsAuto = auds==null ? auds : Math.round(auds*fator);
      auds = M.audsManual!=null ? M.audsManual : audsAuto;
      const porAud = (auds||0) * (Number(P.auditor.valorAudit)||0);
      const faixa = pctQuadro==null ? null : (P.auditor.faixas||[]).find(f=> pctQuadro>=f.min && pctQuadro<=f.max);
      const premio = faixa ? Number(faixa.value)||0 : 0;
      // bônus por erro de retorno encontrado (Possui_NC = TRUE na auditoria feita por ele) — não sofre o desconto de meta
      const ncsAuto = (window.RetornoOnline && RetornoOnline.rows) ? RetornoOnline.ncPorAuditor(ini || new Date(2000,0,1), fim || new Date(), P.auditor.cod, this.nomeDe(P.auditor.cod)) : null;
      const ncs = ncsAuto==null ? 0 : Math.round(ncsAuto*fator), valorBonus = ncs * bonusNC;
      const base = porAud + premio, metaA = Number(P.auditor.metaAuditorias)||0;
      const bateuMeta = !(metaA>0) || (auds||0) >= metaA, pct = Number(P.auditor.pctSeNaoBater);
      const baseApos = bateuMeta ? base : base * ((isNaN(pct)?100:pct)/100);
      const bruto = base + valorBonus, apos = baseApos + valorBonus;
      aud = { cod:P.auditor.cod, nome, auds, audsAuto, manual: M.audsManual!=null, porAud, faixa, premio, ncs, valorBonus, bruto, apos, final: apos*fatFat, bateuMeta, metaA, pct };
      linhas.push({ chave:"esp:aud", tipo:"Auditor", cod:P.auditor.cod, nome, comissaoBase:bruto, posQualidade:apos, comissaoComDesconto:apos, comissaoTotal:aud.final,
        regra: `Auditor — ${auds==null?"—":fmtNum(auds)} auditoria(s) de retorno${M.audsManual!=null?" (ajustado manualmente)":""} × ${fmtBRL(Number(P.auditor.valorAudit)||0)}` + (premio? ` + prêmio quadro ${fmtBRL(premio)}` : "") + (bonusNC>0 ? ` + ${fmtNum(ncs)} erro(s) de retorno achado(s) × ${fmtBRL(bonusNC)}` : "") + (metaA>0 ? (bateuMeta ? ` · meta de ${fmtNum(metaA)} atingida` : ` · meta de ${fmtNum(metaA)} NÃO atingida: paga ${fmtNum(aud.pct,0)}%`) : "") });
    }
    // ---- bônus de outros auditores do quadro (qualquer pessoa da equipe que audite retornos e ache erros) ----
    let bonusOutrosB = 0, bonusOutrosF = 0;
    if(bonusNC > 0 && window.RetornoOnline && RetornoOnline.rows){
      const mapaNc = RetornoOnline.auditoresComNC(ini || new Date(2000,0,1), fim || new Date(2999,0,1));
      const doQuadro = new Map(team.members.map(m=>[this.digits(m.codigo), m]).filter(x=>x[0]));
      mapaNc.forEach((a, dig)=>{
        if(!a.ncs || dig===this.digits(P.auditor.cod) || !doQuadro.has(dig)) return;
        const n = Math.round(a.ncs*fator), v = n*bonusNC;
        bonusOutrosB += v; bonusOutrosF += v*fatFat;
        linhas.push({ chave:"esp:bon"+dig, tipo:"Auditor (bônus)", cod:dig, nome: this.nomeDe(dig) || a.nome || ("Cód. "+dig), comissaoBase:v, posQualidade:v, comissaoComDesconto:v, comissaoTotal:v*fatFat,
          regra:`Bônus de auditoria — ${fmtNum(n)} erro(s) de retorno achado(s) × ${fmtBRL(bonusNC)}` });
      });
    }
    // ---- recuperação ----
    let rec = null;
    if(this.digits(P.recuperacao.cod)){
      const nome = this.nomeDe(P.recuperacao.cod) || ("Cód. " + P.recuperacao.cod);
      const alvo = normStr(P.recuperacao.motivo||"");
      const cods = new Set([this.digits(P.recuperacao.cod)].concat((P.recuperacao.extras||[]).map(c=>this.digits(c))).filter(Boolean));
      const i = ini ? dateOnly(ini) : new Date(2000,0,1), f = fim ? dateOnly(fim) : new Date(2999,0,1);
      // recuperado = Cód.Motivo 1886 (ou o texto do motivo configurado); cada linha de Descrição conta 1 item
      const lin = (window.APP_STATE.processed.p9712||[]).filter(r=> r.dt && dateOnly(r.dt)>=i && dateOnly(r.dt)<=f && (r.codMotivo==="1886" || normStr(r.motivo||"")===alvo) && cods.has(this.digits(r.funcLanc)));
      const itensAuto = Math.round(lin.length * fator), valorItem = Number(P.recuperacao.valorItem)||0;
      const itens = M.itensManual!=null ? M.itensManual : itensAuto;
      const bruto = itens*valorItem, metaR = Number(P.recuperacao.metaItens)||0, bateuMeta = !(metaR>0) || itens >= metaR, pct = Number(P.recuperacao.pctSeNaoBater);
      const apos = bateuMeta ? bruto : bruto * ((isNaN(pct)?100:pct)/100);
      rec = { cod:P.recuperacao.cod, nome, itens, itensAuto, manual: M.itensManual!=null, lanc: Math.round(lin.length*fator), bruto, apos, final: apos*fatFat, bateuMeta, metaR, pct, valorItem };
      linhas.push({ chave:"esp:rec", tipo:"Recuperação", cod:P.recuperacao.cod, nome, comissaoBase:bruto, posQualidade:apos, comissaoComDesconto:apos, comissaoTotal:rec.final,
        regra: `Recuperação — ${fmtNum(itens)} item(ns)${M.itensManual!=null?" (ajustado manualmente)":""} × ${fmtBRL(valorItem)}` + (metaR>0 ? (bateuMeta ? ` · meta de ${fmtNum(metaR)} atingida` : ` · meta de ${fmtNum(metaR)} NÃO atingida: paga ${fmtNum(rec.pct,0)}%`) : "") });
    }
    // ---- fixas por código ----
    (P.fixos||[]).forEach((f,i)=>{
      if(!this.digits(f.cod)) return;
      const v = Number(f.valor)||0;
      linhas.push({ chave:"esp:fix"+i, tipo: f.tipo || "Fixa", cod:f.cod, nome: this.nomeDe(f.cod) || ("Cód. "+f.cod), comissaoBase:v, posQualidade:v, comissaoComDesconto:v, comissaoTotal:v, regra:`Comissão Fixa — ${f.tipo||"fixa"}` });
    });
    // ---- manuais (sem código) do mês ----
    M.manuais.forEach((m,i)=>{
      if(!m.nome && !m.valor) return;
      linhas.push({ chave:"esp:man"+i, tipo:"Manual", cod:"—", nome:m.nome||"(sem nome)", comissaoBase:m.valor, posQualidade:m.valor, comissaoComDesconto:m.valor, comissaoTotal:m.valor, regra:"Comissão manual (sem código)" });
    });

    const fixos = sum(linhas.filter(l=>l.chave.indexOf("esp:fix")===0).map(l=>l.comissaoTotal));
    const manuais = sum(linhas.filter(l=>l.chave.indexOf("esp:man")===0).map(l=>l.comissaoTotal));
    const repBase = sum(rep.map(e=>e.comissaoBase)), repQual = sum(rep.map(e=>e.posQualidade)), repFinal = sum(rep.map(e=>e.preAvaria)), repAvaria = sum(rep.map(e=>e.avariaCota));
    const audB = aud?aud.bruto:0, audA = aud?aud.apos:0, audF = aud?aud.final:0, recB = rec?rec.bruto:0, recA = rec?rec.apos:0, recF = rec?rec.final:0;
    const semDesc = repBase + audB + bonusOutrosB + recB + fixos + manuais;
    const subtotal = repFinal + audF + bonusOutrosF + recF + fixos + manuais;
    const avariaDesc = repAvaria;                 // quanto realmente foi descontado (limitado ao que cada repositor tem a receber)
    const total = subtotal - avariaDesc;
    const tot = {
      qtdOs: sum(rep.map(e=>e.pontos)), fixa: repFinal, fixaBase: repBase, aud: audF + bonusOutrosF, rec: recF, fixos, manuais,
      semDesc, total, descontos: semDesc - total, descQual: repBase - repQual, descMeta: (audB-audA)+(recB-recA),
      ajusteFat: (repFinal-repQual)+(audF-audA)+(bonusOutrosF-bonusOutrosB)+(recF-recA), avariaDesc, teto: Number(P.teto)||0, margem: (Number(P.teto)||0) - total
    };
    rep.forEach(e=>{ e.chave = e.codKey; e.tipo = "Repositor"; });
    return { P, ym, M, fatFat, rep, esp: linhas, tot, quadro:{ baseN, bateu, nao, pct:pctQuadro, minimo, faixa: aud?aud.faixa:null, premio: aud?aud.premio:0 }, aud, rec };
  }
};
window.ComissaoCalc = ComissaoCalc;

/* ---------------------------------------------------------------------- */
/* Resumo mensal (3 meses + projeção), qualidade e regras aplicadas        */
/* ---------------------------------------------------------------------- */
const ComissaoResumo = {
  /** mesma conta dos cards de Gestão > Auditoria: Retornos (RetornoQ), Ruas (AuditOnline) e Geral = média simples dos dois */
  qualidadeBruta(ini, fim){
    const i = dateOnly(ini), f = dateOnly(fim);
    const ar = (window.AuditOnline && AuditOnline.rows ? AuditOnline.rows : []).filter(r=>{ const d=dateOnly(r.data); return d>=i && d<=f; });
    const ruas = { q: ar.length ? AuditOnline.qualidadeDe(ar) : null, n: ar.length };
    let ret;
    if(window.RetornoQ && RetornoQ.dados && !(RetornoQ.dados.diag.falta||[]).length){
      const t = RetornoQ.calcular(i, f).tot;
      ret = { q: t.auditados ? t.qualidade : null, n: t.auditados||0 };
    } else {
      const rr = (window.RetornoOnline && RetornoOnline.rows ? RetornoOnline.rows : []).filter(r=>{ const d=dateOnly(r.data); return d>=i && d<=f && !r.soAuditor; });
      ret = { q: rr.length ? rr.filter(r=>!r.nc).length/rr.length*100 : null, n: rr.length };
    }
    return { ruas, ret, geral:{ q: this.media(ret.q, ruas.q), n: ruas.n + ret.n } };
  },
  media(a, b){ const v = [a,b].filter(x=>x!=null); return v.length ? v.reduce((s,x)=>s+x,0)/v.length : null; },
  /** período do mês atual (referência da tela) até a última data com dados */
  periodoMesAtual(){
    const ref = this.mesRef(), max = Production.maxDataDate();
    let fim = new Date(ref.getFullYear(), ref.getMonth()+1, 0);
    if(max && max >= ref && max < fim) fim = dateOnly(max);
    return { ini: ref, fim };
  },
  /** Mês sem % de qualidade (ruas/retornos) usa a qualidade do MÊS ATUAL; só se o atual também não tiver, cai na média dos meses anteriores. */
  qualidadeComFallback(ini, fim){
    const base = this.qualidadeBruta(ini, fim), out = {};
    let atual = null;
    ["ruas","ret"].forEach(k=>{
      if(base[k].q!==null){ out[k] = { q:base[k].q, n:base[k].n, estimada:false }; return; }
      if(!atual){ const pa = this.periodoMesAtual(); atual = this.qualidadeBruta(pa.ini, pa.fim); }
      if(atual[k].q!==null){ out[k] = { q:atual[k].q, n:0, estimada:true, doMesAtual:true }; return; }
      const qs = [];
      for(let m=0;m>=-5;m--){
        const a = new Date(dateOnly(ini).getFullYear(), dateOnly(ini).getMonth()+m, 1), b = new Date(a.getFullYear(), a.getMonth()+1, 0);
        const v = this.qualidadeBruta(a, b)[k]; if(v.q!==null) qs.push(v.q);
        if(qs.length>=3) break;
      }
      out[k] = { q: qs.length ? qs.reduce((x,y)=>x+y,0)/qs.length : null, n:0, estimada:qs.length>0 };
    });
    out.geral = { q: this.media(out.ruas.q, out.ret.q), n: out.ruas.n + out.ret.n, estimada: out.ruas.estimada || out.ret.estimada };
    return out;
  },
  mesRef(){
    const st = CommissionState, max = Production.maxDataDate();
    const ref = st.dataFinal || st.dataInicial || max || new Date();
    return new Date(ref.getFullYear(), ref.getMonth(), 1);
  },
  calcular(){
    const ref = this.mesRef(), max = Production.maxDataDate();
    const meses = [-2,-1,0].map(k=>{
      const ini = new Date(ref.getFullYear(), ref.getMonth()+k, 1);
      let fim = new Date(ini.getFullYear(), ini.getMonth()+1, 0);
      if(max && max >= ini && max < fim) fim = dateOnly(max);
      const c = ComissaoCalc.mes(ini, fim);
      return { ...c.tot, c, rot: MESES_PT[ini.getMonth()]+"/"+String(ini.getFullYear()).slice(2), ini, fim, atual:k===0, qual: this.qualidadeComFallback(ini, fim) };
    });
    let proj = null;
    const m = meses[2], mFim = new Date(m.ini.getFullYear(), m.ini.getMonth()+1, 0);
    const dec = diasUteisEntre(m.ini, m.fim), totM = diasUteisEntre(m.ini, mFim);
    if(dec > 0){
      const fator = m.fim >= mFim ? 1 : totM / dec;
      const c = ComissaoCalc.mes(m.ini, m.fim, fator);
      proj = { ...c.tot, rot:"Projeção "+m.rot, dec, totM, c };
    }
    return { meses, proj, regras: this.regras(meses[2].c) };
  },
  regras(c){
    const P = c.P, cont = new Map();
    c.rep.forEach(e=>{
      const k = e.regraTipo || e.regra.split(" — ")[0];
      cont.set(k, (cont.get(k)||0)+1);
    });
    const estimados = c.rep.filter(e=>e.qualidadeEstimada).length;
    const fixa = Array.from(cont.entries()).map(([k,n])=>`${k}: ${n} repositor(es)`)
      .concat([`Abaixo de ${fmtNum(P.pontosMinimos)} pts no mês: R$ ${fmtNum(P.valorFixoAbaixo,2)} fixo`])
      .concat([P.aplicarDesconto==="SIM" ? "Desconto por qualidade aplicado (<50% zera · 50–69% metade · ≥70% proporcional)" : "Desconto por qualidade NÃO aplicado"])
      .concat(estimados ? [`${estimados} repositor(es) sem auditoria no mês: aplicada a média da equipe`] : [])
      .concat([c.fatFat!==1 ? `Ajuste de faturamento: ×${fmtNum(c.fatFat,4)} (${fmtBRL(c.M.faturado)} ÷ ${fmtBRL(P.metaFaturamento)})` : "Sem ajuste de faturamento (faturamento do mês não informado ou igual à meta)"]);
    const q = c.quadro;
    const auditor = c.aud ? [
      `${c.aud.nome}: ${fmtBRL(Number(P.auditor.valorAudit)||0)} por auditoria de retorno × ${c.aud.auds==null?"—":fmtNum(c.aud.auds)} = ${fmtBRL(c.aud.porAud)}`,
      Number(P.auditor.bonusNC)>0 ? `Bônus por erro de retorno achado (Possui_NC = TRUE): ${fmtNum(c.aud.ncs)} × ${fmtBRL(Number(P.auditor.bonusNC))} = ${fmtBRL(c.aud.valorBonus)} (qualquer pessoa do quadro que audite retornos recebe o mesmo bônus)` : "Bônus por erro de retorno não definido",
      `Prêmio pelo quadro (≥ ${fmtNum(q.minimo)} pts): ${q.bateu.length} de ${q.baseN} (${q.pct==null?"—":fmtNum(q.pct,1)+"%"}) → ${c.aud.faixa ? fmtNum(c.aud.faixa.min,2)+"%–"+fmtNum(c.aud.faixa.max,2)+"% = "+fmtBRL(c.aud.premio) : "nenhuma faixa atingida"}`,
      c.aud.metaA>0 ? (c.aud.bateuMeta ? `Meta de ${fmtNum(c.aud.metaA)} auditorias atingida` : `Meta de ${fmtNum(c.aud.metaA)} auditorias NÃO atingida: recebe ${fmtNum(c.aud.pct,0)}%`) : "Sem meta de auditorias definida"
    ] : ["Nenhum código definido para a função Auditor"];
    const rec = c.rec ? [
      `${c.rec.nome}: ${fmtBRL(c.rec.valorItem)} por item (Cód.Motivo 1886 · "${P.recuperacao.motivo}", 9712 — cada Descrição conta 1 item) × ${fmtNum(c.rec.itens)} = ${fmtBRL(c.rec.bruto)}`,
      c.rec.metaR>0 ? (c.rec.bateuMeta ? `Meta de ${fmtNum(c.rec.metaR)} itens atingida` : `Meta de ${fmtNum(c.rec.metaR)} itens NÃO atingida: recebe ${fmtNum(c.rec.pct,0)}%`) : "Sem meta de recuperação definida"
    ] : ["Nenhum código definido para a função Recuperação"];
    return { fixa, auditor, rec };
  },
  fmtQ(o){ return o.q===null ? "—" : fmtNum(o.q,1)+"%"+(o.estimada?(o.doMesAtual?" (mês atual)":" (média)"):""); },
  linhasTabela(){
    return [
      ["Qtd O.S. (pontos)", t=>fmtNum(t.qtdOs), false, true],
      ["Comissão Fixa (repositores)", t=>fmtBRL(t.fixa), false, true],
      ["Comissão Auditor", t=>fmtBRL(t.aud), false, true],
      ["Comissão Recuperações", t=>fmtBRL(t.rec), false, true],
      ["Comissões fixas por código", t=>fmtBRL(t.fixos), false, true],
      ["Comissões manuais (sem código)", t=>fmtBRL(t.manuais), false, true],
      ["Valor total s/ descontos", t=>fmtBRL(t.semDesc), false, true],
      ["(−) Desconto por qualidade", t=>fmtBRL(t.descQual), false, true],
      ["(−) Desconto por meta (auditor/recuperação)", t=>fmtBRL(t.descMeta), false, true],
      ["(±) Ajuste por faturamento", t=>fmtBRL(t.ajusteFat), false, true],
      ["(−) Desconto de avaria (diluído nos repositores)", t=>fmtBRL(t.avariaDesc), false, true],
      ["Valor total descontos", t=>fmtBRL(t.descontos), false, true],
      ["Valor total a ser pago", t=>fmtBRL(t.total), true, true],
      ["Teto comissão", t=>fmtBRL(t.teto), false, true],
      ["Margem disponível (teto − total pago)", t=>`<span style="color:${t.margem<0?'#d64545':'#1a9c62'}">${fmtBRL(t.margem)}</span>`, true, true]
    ];
  },
  render(){
    const el = document.getElementById("comissao-resumo-mensal"); if(!el) return;
    let r; try{ r = this.calcular(); }catch(e){ el.innerHTML = `<div class="warn-box">Não foi possível montar o resumo: ${escapeHtml(e.message||String(e))}</div>`; return; }
    const th = r.meses.map(m=>`<th style="${m.atual?'background:#e8f1ff;':''}">${m.rot}${m.atual?' (visualizado)':''}</th>`).join("") + (r.proj ? `<th class="proj-col" style="background:#eef7f1" title="${r.proj.dec} de ${r.proj.totM} dias úteis">${r.proj.rot}</th>` : "");
    const row = (rot, fn, forte)=> `<tr${forte?' style="font-weight:700"':''}><td>${rot}</td>${r.meses.map(m=>`<td style="${m.atual?'background:#f4f8ff;':''}text-align:right">${fn(m)}</td>`).join("")}${r.proj ? `<td class="proj-col" style="background:#f6fbf8;text-align:right">${fn(r.proj)}</td>` : ""}</tr>`;
    const qrow = (rot, k)=> `<tr><td>${rot}</td>${r.meses.map(m=>`<td style="${m.atual?'background:#f4f8ff;':''}text-align:right">${this.fmtQ(m.qual[k])}</td>`).join("")}${r.proj ? `<td class="proj-col" style="text-align:right">—</td>` : ""}</tr>`;
    const chip = (cor, titulo, itens)=> `<div style="flex:1;min-width:260px;border-left:5px solid ${cor};background:${cor}14;padding:8px 12px;border-radius:6px"><strong style="color:${cor}">${titulo}</strong><ul style="margin:4px 0 0 16px;padding:0;font-size:12px">${itens.map(i=>`<li>${escapeHtml(i)}</li>`).join("")}</ul></div>`;
    const teto = r.meses[2].teto;
    el.innerHTML = `
      <div class="panel-header" style="margin-top:6px"><h3>Resumo Mensal — últimos 3 meses</h3><span class="small-muted">Teto de comissão: <strong>${fmtBRL(teto)}</strong> (definido em Definição de Parâmetros)</span></div>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th></th>${th}</tr></thead>
        <tbody>
          ${this.linhasTabela().map(l=>row(l[0], l[1], l[2])).join("")}
          ${qrow("Qualidade geral da equipe","geral")}
          ${qrow("Qualidade retornos","ret")}
          ${qrow("Qualidade ruas","ruas")}
        </tbody>
      </table></div>
      <p class="panel-note">A coluna de projeção (só na tela, fora das extrações) extrapola o mês pelo ritmo de dias úteis; qualidade não é projetada. Mês sem auditoria usa a qualidade do mês atual (marcada "(mês atual)").</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin:10px 0">
        ${chip("#2f6fce","Comissão Fixa — regra aplicada ("+r.meses[2].rot+")", r.regras.fixa)}
        ${chip("#e08a1f","Comissão Auditor — regra aplicada", r.regras.auditor)}
        ${chip("#1a9c62","Comissão Recuperações — regra aplicada", r.regras.rec)}
      </div>`;
  },
  aoa(){
    const r = this.calcular(), h = ["", ...r.meses.map(m=>m.rot)];
    const n2 = v=>+Number(v).toFixed(2);
    const money = new Set(["Qtd O.S. (pontos)"]);
    const lin = this.linhasTabela().map(l=>{
      const f = l[1];
      return [l[0].replace(/<[^>]+>/g,""), ...r.meses.map(m=>{
        const t = l[0]==="Qtd O.S. (pontos)" ? m.qtdOs : null;
        if(t!==null) return t;
        const txt = String(f(m)).replace(/<[^>]+>/g,"");
        const campo = ({"Comissão Fixa (repositores)":"fixa","Comissão Auditor":"aud","Comissão Recuperações":"rec","Comissões fixas por código":"fixos","Comissões manuais (sem código)":"manuais","Valor total s/ descontos":"semDesc","(−) Desconto por qualidade":"descQual","(−) Desconto por meta (auditor/recuperação)":"descMeta","(±) Ajuste por faturamento":"ajusteFat","(−) Desconto de avaria (diluído nos repositores)":"avariaDesc","Valor total descontos":"descontos","Valor total a ser pago":"total","Teto comissão":"teto","Margem disponível (teto − total pago)":"margem"})[l[0]];
        return campo ? n2(m[campo]) : txt;
      })];
    });
    return [
      ["Resumo Mensal — Comissão"], [], h, ...lin,
      ["Qualidade geral da equipe", ...r.meses.map(m=>this.fmtQ(m.qual.geral))],
      ["Qualidade retornos", ...r.meses.map(m=>this.fmtQ(m.qual.ret))],
      ["Qualidade ruas", ...r.meses.map(m=>this.fmtQ(m.qual.ruas))],
      [], ["Regras aplicadas ("+r.meses[2].rot+")"],
      ...r.regras.fixa.map((t,i)=>[i?"":"Comissão Fixa", t]),
      ...r.regras.auditor.map((t,i)=>[i?"":"Comissão Auditor", t]),
      ...r.regras.rec.map((t,i)=>[i?"":"Comissão Recuperações", t])
    ];
  }
};
window.ComissaoResumo = ComissaoResumo;

/* ---------------------------------------------------------------------- */
/* Interface: bloco "Definição de Parâmetros" (rascunho + salvar)           */
/* ---------------------------------------------------------------------- */
const ComissaoParamsUI = {
  draft: null, dirty: false,
  modelos: {
    bands: ()=>({ min:0, max:0, value:0, active:true }),
    exceptions: ()=>({ codigo:"", nome:"", valuePerPoint:0.4, active:true }),
    fixos: ()=>({ cod:"", tipo:"Líder", valor:0 }),
    excecoes: ()=>"",
    "auditor.faixas": ()=>({ min:0, max:0, value:0 }),
    "recuperacao.extras": ()=>""
  },
  garantirDraft(){ if(!this.draft) this.draft = ComissaoParams.clone(ComissaoParams.vigente()); return this.draft; },
  aoCarregar(){
    if(!this.dirty) this.draft = null;
    if(document.getElementById("comissao-params") && typeof renderComissao === "function") renderComissao();
  },
  caminho(o, path){ const ps = path.split("."); for(let i=0;i<ps.length-1;i++) o = o[ps[i]]; return [o, ps[ps.length-1]]; },
  nomeTag(cod){
    const d = ComissaoCalc.digits(cod); if(!d) return `<span class="small-muted">informe o código</span>`;
    const n = ComissaoCalc.nomeDe(d);
    return n ? `<strong>${escapeHtml(n)}</strong>` : `<span class="small-muted" style="color:#d64545">código não encontrado</span>`;
  },
  css(){
    if(document.getElementById("cp-css")) return;
    const st = document.createElement("style"); st.id = "cp-css";
    st.textContent = `
      #comissao-params *{box-sizing:border-box}
      #comissao-params .cp-sec{background:var(--white);border:1px solid var(--gray-200);border-radius:var(--radius);padding:14px 16px;margin-bottom:12px}
      #comissao-params .cp-sec>header{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--gray-100)}
      #comissao-params .cp-sec>header h4{margin:0;font-size:14px;color:var(--blue-dark);font-weight:700}
      #comissao-params .cp-sec>header span{font-size:12px;color:var(--gray-500)}
      #comissao-params .cp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px 14px;align-items:end}
      #comissao-params .cp-grid.cols2{grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:16px 24px;align-items:start}
      #comissao-params .cp-f{display:flex;flex-direction:column;gap:5px;min-width:0}
      #comissao-params .cp-f>label,#comissao-params .cp-lbl{font-size:11px;font-weight:700;color:var(--gray-500);text-transform:uppercase;letter-spacing:.02em}
      #comissao-params .cp-f input,#comissao-params .cp-rows input[type=text],#comissao-params .cp-rows input[type=number],#comissao-params .cp-aff input,#comissao-params input[type=month]{width:100%;height:36px;box-sizing:border-box;border:1px solid var(--gray-300);border-radius:8px;padding:0 10px;font:inherit;font-size:13px;background:var(--white);color:var(--ink)}
      #comissao-params input:focus{outline:2px solid var(--blue-soft);border-color:var(--blue-med)}
      #comissao-params .cp-aff{display:flex;align-items:center;border:1px solid var(--gray-300);border-radius:8px;background:var(--white);overflow:hidden;height:36px}
      #comissao-params .cp-aff:focus-within{outline:2px solid var(--blue-soft);border-color:var(--blue-med)}
      #comissao-params .cp-aff i{font-style:normal;font-size:12px;color:var(--gray-500);padding:0 9px;background:var(--gray-50);height:100%;display:flex;align-items:center;border-right:1px solid var(--gray-200)}
      #comissao-params .cp-aff i.suf{border-right:0;border-left:1px solid var(--gray-200)}
      #comissao-params .cp-aff input{border:0;border-radius:0;outline:0!important;height:100%;min-width:0}
      #comissao-params .cp-seg{display:inline-flex;border:1px solid var(--gray-300);border-radius:8px;overflow:hidden;height:36px}
      #comissao-params .cp-seg button{border:0;background:var(--white);padding:0 18px;font:inherit;font-size:13px;color:var(--gray-700);cursor:pointer}
      #comissao-params .cp-seg button+button{border-left:1px solid var(--gray-300)}
      #comissao-params .cp-seg button.active{background:var(--blue-med);color:#fff;font-weight:700}
      #comissao-params .cp-sub{margin:14px 0 8px;font-size:13px;font-weight:700;color:var(--ink);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
      #comissao-params .cp-sub .cp-nome{font-weight:600;color:var(--blue-dark)}
      #comissao-params .cp-rows{display:grid;gap:8px}
      #comissao-params .cp-row{display:grid;gap:10px;align-items:center}
      #comissao-params .cp-row.head{font-size:11px;font-weight:700;color:var(--gray-500);text-transform:uppercase;letter-spacing:.02em}
      #comissao-params .cp-row.bands{grid-template-columns:1fr 1fr 1fr 74px 36px}
      #comissao-params .cp-row.exc{grid-template-columns:110px minmax(120px,1.4fr) 1fr 74px 36px}
      #comissao-params .cp-row.fix{grid-template-columns:110px minmax(120px,1.4fr) 1fr 1fr 36px}
      #comissao-params .cp-row.ex1{grid-template-columns:110px minmax(120px,1fr) 36px}
      #comissao-params .cp-row.faixa{grid-template-columns:1fr 1fr 1fr 36px}
      #comissao-params .cp-row.man{grid-template-columns:minmax(160px,1.6fr) 1fr 36px}
      #comissao-params .cp-chk{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--gray-700)}
      #comissao-params .cp-x{width:36px;height:36px;border:1px solid var(--gray-200);border-radius:8px;background:var(--white);color:var(--red);cursor:pointer;font-size:14px}
      #comissao-params .cp-x:hover{background:var(--red-bg)}
      #comissao-params .cp-add{margin-top:10px}
      #comissao-params .cp-nome-tag{font-size:13px;color:var(--blue-dark);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #comissao-params .cp-hint{font-size:12px;color:var(--gray-500);margin:10px 0 0;line-height:1.5}
      #comissao-params .cp-calc{background:var(--blue-light);border-radius:8px;padding:8px 12px;font-size:13px;color:var(--blue-dark);min-height:20px}
      #comissao-params .cp-save{position:sticky;bottom:0;z-index:5;display:flex;align-items:center;gap:14px;flex-wrap:wrap;background:var(--blue-light);border:1px solid var(--blue-soft);border-radius:var(--radius);padding:10px 14px;margin:14px 0 12px;box-shadow:0 -4px 14px rgba(16,32,64,.08)}
      #comissao-params .cp-save .grow{flex:1;min-width:220px}
      #comissao-params .cp-save .cp-f{flex-direction:row;align-items:center;gap:8px}
      #comissao-params .cp-save input[type=month]{width:150px}
      #comissao-params .cp-state{font-size:12px;color:var(--gray-700)}
      #comissao-params .cp-state.dirty{color:var(--orange);font-weight:700}
      #comissao-params .cp-foot{display:flex;justify-content:flex-end;align-items:center;gap:12px;margin-top:14px;padding-top:12px;border-top:1px solid var(--gray-100)}
      @media (max-width:640px){#comissao-params .cp-row.bands,#comissao-params .cp-row.exc,#comissao-params .cp-row.fix,#comissao-params .cp-row.faixa,#comissao-params .cp-row.man{grid-template-columns:1fr 1fr}#comissao-params .cp-row.head{display:none}}
    `;
    document.head.appendChild(st);
  },
  nomeTag(cod){
    const d = ComissaoCalc.digits(cod); if(!d) return `<span class="cp-nome-tag" style="color:var(--gray-500);font-weight:400">informe o código</span>`;
    const n = ComissaoCalc.nomeDe(d);
    return n ? `<span class="cp-nome-tag" title="${escapeHtml(n)}">${escapeHtml(n)}</span>` : `<span class="cp-nome-tag" style="color:var(--red)">código não encontrado</span>`;
  },
  /** campo numérico/texto com prefixo (R$) ou sufixo (%) opcional */
  inp(path, val, opts){
    opts = opts || {};
    const t = opts.t || "number", v = val==null ? "" : val;
    const input = `<input type="${t}" ${t==="number"?`step="${opts.step||"any"}"`:""} data-p="${path}" ${opts.re?'data-re="1"':''} value="${escapeHtml(String(v))}" ${opts.ph?`placeholder="${opts.ph}"`:''}>`;
    if(opts.pre || opts.suf) return `<div class="cp-aff">${opts.pre?`<i>${opts.pre}</i>`:''}${input}${opts.suf?`<i class="suf">${opts.suf}</i>`:''}</div>`;
    return input;
  },
  toggle(path, val){
    return `<div class="cp-seg"><button type="button" data-tg="${path}" data-v="SIM" class="${val==='SIM'?'active':''}">Sim</button><button type="button" data-tg="${path}" data-v="NAO" class="${val==='NAO'?'active':''}">Não</button></div>`;
  },
  render(){
    const el = document.getElementById("comissao-params"); if(!el) return;
    this.css();
    ComissaoParams.carregarRemoto();
    const d = this.garantirDraft();
    const ref = ComissaoResumo.mesRef(), ym = ComissaoParams.ym(ref), M = ComissaoParams.mensalDe(ym);
    const vs = ComissaoParams.estado().versoes;
    const desdeDef = ComissaoParams.ym(Production.maxDataDate() || new Date());
    const aut = ComissaoCalc.mes(new Date(ref.getFullYear(), ref.getMonth(), 1), (Production.maxDataDate() && Production.maxDataDate()>=new Date(ref.getFullYear(), ref.getMonth(), 1) && Production.maxDataDate()<new Date(ref.getFullYear(), ref.getMonth()+1, 0)) ? Production.maxDataDate() : new Date(ref.getFullYear(), ref.getMonth()+1, 0));
    const fld = (rot, html)=>`<div class="cp-f"><label>${rot}</label>${html}</div>`;
    const sec = (titulo, nota, inner)=>`<section class="cp-sec"><header><h4>${titulo}</h4>${nota?`<span>${nota}</span>`:''}</header>${inner}</section>`;
    const xbtn = path=>`<button type="button" class="cp-x" data-del="${path}" title="Remover">✕</button>`;
    const ativa = path=>`<label class="cp-chk"><input type="checkbox" data-p="${path}" ${(path.indexOf("bands")===0?d.bands[Number(path.split(".")[1])].active:d.exceptions[Number(path.split(".")[1])].active)!==false?'checked':''}> Ativa</label>`;
    const rowBand = (b,i)=>`<div class="cp-row bands">${this.inp(`bands.${i}.min`,b.min)}${this.inp(`bands.${i}.max`,b.max)}${this.inp(`bands.${i}.value`,b.value,{step:0.01,pre:"R$"})}${ativa(`bands.${i}.active`)}${xbtn(`bands.${i}`)}</div>`;
    const rowExc = (x,i)=>`<div class="cp-row exc">${this.inp(`exceptions.${i}.codigo`,x.codigo,{t:"text",re:1,ph:"código"})}${this.nomeTag(x.codigo)}${this.inp(`exceptions.${i}.valuePerPoint`,x.valuePerPoint,{step:0.01,pre:"R$"})}${ativa(`exceptions.${i}.active`)}${xbtn(`exceptions.${i}`)}</div>`;
    const rowFix = (f,i)=>`<div class="cp-row fix">${this.inp(`fixos.${i}.cod`,f.cod,{t:"text",re:1,ph:"código"})}${this.nomeTag(f.cod)}${this.inp(`fixos.${i}.tipo`,f.tipo,{t:"text",ph:"Ex.: Líder"})}${this.inp(`fixos.${i}.valor`,f.valor,{step:0.01,pre:"R$"})}${xbtn(`fixos.${i}`)}</div>`;
    const rowEx = (c,i)=>`<div class="cp-row ex1">${this.inp(`excecoes.${i}`,c,{t:"text",re:1,ph:"código"})}${this.nomeTag(c)}${xbtn(`excecoes.${i}`)}</div>`;
    const rowFx = (f,i)=>`<div class="cp-row faixa">${this.inp(`auditor.faixas.${i}.min`,f.min,{step:0.01,suf:"%"})}${this.inp(`auditor.faixas.${i}.max`,f.max,{step:0.01,suf:"%"})}${this.inp(`auditor.faixas.${i}.value`,f.value,{step:0.01,pre:"R$"})}${xbtn(`auditor.faixas.${i}`)}</div>`;
    const a = d.auditor, r = d.recuperacao;
    const mIni = new Date(ref.getFullYear(), ref.getMonth(), 1), mFimTot = new Date(ref.getFullYear(), ref.getMonth()+1, 0), maxD = Production.maxDataDate();
    const lanc = ComissaoCalc.lancadoresRec(d, mIni, (maxD && maxD>=mIni && maxD<mFimTot) ? maxD : mFimTot);
    const contados = new Set([ComissaoCalc.digits(r.cod)].concat((r.extras||[]).map(c=>ComissaoCalc.digits(c))).filter(Boolean));
    const quem = `<div class="cp-lbl" style="margin:14px 0 6px">Quem lançou "${escapeHtml(r.motivo)}" em ${ComissaoParams.ymRot(ym)}</div>` + (lanc.length ? `<div class="cp-rows">${lanc.map(l=>`<div class="cp-row" style="grid-template-columns:minmax(120px,1fr) 90px 150px"><span class="cp-nome-tag" title="${escapeHtml(l.nome)}">${escapeHtml(l.nome)} <span style="color:var(--gray-500);font-weight:400">(${l.cod})</span></span><span class="small-muted">${fmtNum(l.itens)} item(ns)</span>${contados.has(l.cod) ? `<span class="small-muted">✔ conta para o responsável</span>` : `<button type="button" class="btn btn-outline btn-sm" data-conta="${l.cod}">Contar para o responsável</button>`}</div>`).join("")}</div>` : `<p class="small-muted" style="margin:0">Nenhum lançamento com esse motivo no mês.</p>`);
    el.innerHTML = `
      <div class="panel-header"><h3>Definição de Parâmetros</h3><span class="small-muted">Edite, depois clique em <strong>Salvar parâmetros</strong> (barra azul no fim do bloco)</span></div>

      ${sec("Parâmetros gerais", "Valem para o cálculo de todos os repositores", `
        <div class="cp-grid">
          ${fld("Desconto por qualidade?", this.toggle("aplicarDesconto", d.aplicarDesconto))}
          ${fld("Considerar Missões?", this.toggle("considerarMissoes", d.considerarMissoes))}
          ${fld("Teto de comissão", this.inp("teto", d.teto, {step:100, pre:"R$"}))}
          ${fld("Pontuação mínima no mês", this.inp("pontosMinimos", d.pontosMinimos, {suf:"O.S."}))}
          ${fld("Valor fixo abaixo da mínima", this.inp("valorFixoAbaixo", d.valorFixoAbaixo, {step:0.01, pre:"R$"}))}
          ${fld("Meta de faturamento", this.inp("metaFaturamento", d.metaFaturamento, {step:1000, pre:"R$"}))}
        </div>
        <p class="cp-hint">Qualidade: &lt;50% zera · 50–69% paga metade · ≥70% paga o % da qualidade. Com menos de ${fmtNum(d.pontosMinimos)} O.S. no mês o repositor recebe R$ ${fmtNum(d.valorFixoAbaixo,2)} fixo, com desconto de qualidade e ajuste de faturamento como os demais.</p>`)}

      ${sec("Faixas de Pontuação", "Valor pago por ponto em cada faixa", `
        <div class="cp-rows">
          <div class="cp-row head bands"><span>Pontuação inicial</span><span>Pontuação final</span><span>Valor por ponto</span><span></span><span></span></div>
          ${d.bands.map(rowBand).join("")}
        </div>
        <button type="button" class="btn btn-outline btn-sm cp-add" data-add="bands">+ Adicionar faixa</button>`)}

      ${sec("Exceções Individuais", "Valor por ponto próprio para um colaborador", `
        ${d.exceptions.length ? `<div class="cp-rows"><div class="cp-row head exc"><span>Código</span><span>Nome</span><span>Valor por ponto</span><span></span><span></span></div>${d.exceptions.map(rowExc).join("")}</div>` : `<p class="small-muted" style="margin:0">Nenhuma exceção cadastrada.</p>`}
        <button type="button" class="btn btn-outline btn-sm cp-add" data-add="exceptions">+ Adicionar exceção</button>`)}

      ${sec("Equipe de Apoio", "O nome vem do código informado", `
        <div class="cp-grid cols2">
          <div>
            <div class="cp-sub">Auditor <span class="cp-nome">${this.nomeTag(a.cod)}</span></div>
            <div class="cp-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">
              ${fld("Código", this.inp("auditor.cod", a.cod, {t:"text", re:1}))}
              ${fld("Valor por auditoria de retorno", this.inp("auditor.valorAudit", a.valorAudit, {step:0.01, pre:"R$"}))}
              ${fld("Bônus por erro de retorno encontrado", this.inp("auditor.bonusNC", a.bonusNC||0, {step:0.01, pre:"R$"}))}
              ${fld("Meta de auditorias (mês)", this.inp("auditor.metaAuditorias", a.metaAuditorias))}
              ${fld("Recebe se não bater a meta", this.inp("auditor.pctSeNaoBater", a.pctSeNaoBater, {suf:"%"}))}
            </div>
            <div class="cp-lbl" style="margin:14px 0 6px">Prêmio pelo % do quadro que bateu a pontuação mínima</div>
            <div class="cp-rows">
              <div class="cp-row head faixa"><span>De</span><span>Até</span><span>Prêmio</span><span></span></div>
              ${a.faixas.map(rowFx).join("")}
            </div>
            <button type="button" class="btn btn-outline btn-sm cp-add" data-add="auditor.faixas">+ Adicionar faixa</button>
          </div>
          <div>
            <div class="cp-sub">Recuperação (9712) <span class="cp-nome">${this.nomeTag(r.cod)}</span></div>
            <div class="cp-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">
              ${fld("Código (Func.Lançamento)", this.inp("recuperacao.cod", r.cod, {t:"text", re:1}))}
              ${fld("Valor por item recuperado", this.inp("recuperacao.valorItem", r.valorItem, {step:0.01, pre:"R$"}))}
              ${fld("Meta de recuperação (itens/mês)", this.inp("recuperacao.metaItens", r.metaItens))}
              ${fld("Recebe se não bater a meta", this.inp("recuperacao.pctSeNaoBater", r.pctSeNaoBater, {suf:"%"}))}
              <div class="cp-f" style="grid-column:1/-1"><label>Motivo na 9712</label>${this.inp("recuperacao.motivo", r.motivo, {t:"text"})}</div>
            </div>
            <div class="cp-lbl" style="margin:14px 0 6px">Outros códigos que lançam em nome do responsável</div>
            <div class="cp-rows">${(r.extras||[]).map((c,i)=>`<div class="cp-row ex1">${this.inp(`recuperacao.extras.${i}`,c,{t:"text",re:1,ph:"código"})}${this.nomeTag(c)}<button type="button" class="cp-x" data-del="recuperacao.extras.${i}" title="Remover">✕</button></div>`).join("")}</div>
            <button type="button" class="btn btn-outline btn-sm cp-add" data-add="recuperacao.extras">+ Adicionar código</button>
            ${quem}
          </div>
        </div>`)}

      ${sec("Comissão fixa por código", "Ex.: Líder. Esses códigos ficam fora da pontuação e da meta do quadro", `
        ${d.fixos.length ? `<div class="cp-rows"><div class="cp-row head fix"><span>Código</span><span>Nome</span><span>Tipo</span><span>Valor</span><span></span></div>${d.fixos.map(rowFix).join("")}</div>` : `<p class="small-muted" style="margin:0">Nenhuma comissão fixa cadastrada.</p>`}
        <button type="button" class="btn btn-outline btn-sm cp-add" data-add="fixos">+ Adicionar comissão fixa</button>`)}

      ${sec("Lista de exceção de repositor", "Auditor, Recuperação e fixas já ficam de fora automaticamente", `
        ${d.excecoes.length ? `<div class="cp-rows"><div class="cp-row head ex1"><span>Código</span><span>Nome</span><span></span></div>${d.excecoes.map(rowEx).join("")}</div>` : `<p class="small-muted" style="margin:0">Nenhum código na lista de exceção.</p>`}
        <button type="button" class="btn btn-outline btn-sm cp-add" data-add="excecoes">+ Adicionar código</button>`)}

      <div class="cp-save">
        <div class="grow">
          <div class="cp-state ${this.dirty?'dirty':''}" id="cp-status">${this.dirty ? "Alterações não salvas" : escapeHtml(ComissaoParams.status || "Parâmetros salvos")}</div>
          <div class="cp-hint" style="margin:2px 0 0">Vigências: ${vs.map(v=> v.desde==="0000-00" ? "início" : "a partir de "+ComissaoParams.ymRot(v.desde)).join(" → ")}</div>
        </div>
        <label class="cp-chk" style="font-weight:700;font-size:13px"><input type="checkbox" id="cp-congelar"> Congelar meses anteriores</label>
        <div class="cp-f" id="cp-desde-box" style="display:none"><label>Valer a partir de</label><input type="month" id="cp-desde" value="${desdeDef}"></div>
        <button type="button" class="btn btn-outline" id="cp-descartar" ${this.dirty?'':'disabled'}>Descartar</button>
        <button type="button" class="btn btn-primary" id="cp-salvar">Salvar parâmetros</button>
      </div>
      <p class="cp-hint" style="margin:-4px 0 14px"><strong>Desmarcado:</strong> os novos parâmetros valem também para os meses passados (histórico recalculado). <strong>Marcado:</strong> os meses anteriores ao escolhido mantêm os parâmetros antigos.</p>

      ${sec("Lançamentos do mês — " + ComissaoParams.ymRot(ym), "Salvos por mês (independem dos parâmetros acima)", `
        <div class="cp-grid cols2">
          <div>
            <div class="cp-grid" style="grid-template-columns:1fr">
              ${fld("Valor faturado no mês", `<input type="number" step="1000" id="mm-fat" value="${M.faturado==null?'':M.faturado}" placeholder="Ex.: 90000000">`)}
              <div class="cp-calc" id="mm-fat-calc"></div>
            </div>
          </div>
          <div>
            <div class="cp-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">
              ${fld("Valor de avaria do mês", `<div class="cp-aff"><i>R$</i><input type="number" step="0.01" id="mm-av" value="${M.avariaValor||''}"></div>`)}
              ${fld("% de desconto de avaria", `<div class="cp-aff"><input type="number" step="0.01" id="mm-avp" value="${M.avariaPct||''}"><i class="suf">%</i></div>`)}
              <div class="cp-calc" id="mm-av-calc" style="grid-column:1/-1"></div>
            </div>
          </div>
        </div>
        <div class="cp-sub" style="margin-top:16px">Ajuste manual do mês <span class="small-muted" style="font-weight:400">(deixe vazio para usar o valor automático)</span></div>
        <div class="cp-grid cols2">
          ${fld("Itens recuperados (automático: "+fmtNum(aut.rec?aut.rec.itensAuto:0)+")", `<input type="number" step="1" id="mm-itens" value="${M.itensManual==null?'':M.itensManual}" placeholder="automático">`)}
          ${fld("Auditorias de retorno do auditor (automático: "+(aut.aud&&aut.aud.audsAuto!=null?fmtNum(aut.aud.audsAuto):"—")+")", `<input type="number" step="1" id="mm-auds" value="${M.audsManual==null?'':M.audsManual}" placeholder="automático">`)}
        </div>
        <div class="cp-sub" style="margin-top:16px">Comissão manual — funcionários sem código</div>
        <div class="cp-rows" id="mm-manuais"></div>
        <button type="button" class="btn btn-outline btn-sm cp-add" id="mm-add">+ Adicionar</button>
        <div class="cp-foot"><span class="cp-state" id="mm-status"></span><button type="button" class="btn btn-primary" id="mm-salvar">Salvar lançamentos do mês</button></div>`)}
    `;
    this.ligar(el, ym, null);
  },
  ligar(el, ym, Pm){
    const d = this.draft;
    const marcar = ()=>{ if(!this.dirty){ this.dirty = true; const d2 = el.querySelector("#cp-descartar"); if(d2) d2.disabled = false; const st = el.querySelector("#cp-status"); if(st){ st.textContent = "Alterações não salvas"; st.classList.add("dirty"); } } };
    el.querySelectorAll("[data-p]").forEach(inp=> inp.addEventListener("change", ()=>{
      const [o,k] = this.caminho(d, inp.dataset.p);
      o[k] = inp.type==="checkbox" ? inp.checked : inp.type==="number" ? (inp.value==="" ? 0 : Number(inp.value)) : inp.value.trim();
      marcar();
      if(inp.dataset.re) this.render();
    }));
    el.querySelectorAll("[data-conta]").forEach(b=> b.addEventListener("click", ()=>{ (d.recuperacao.extras = d.recuperacao.extras||[]).push(b.dataset.conta); marcar(); this.render(); }));
    el.querySelectorAll("[data-tg]").forEach(b=> b.addEventListener("click", ()=>{ d[b.dataset.tg] = b.dataset.v; marcar(); this.render(); }));
    el.querySelectorAll("[data-add]").forEach(b=> b.addEventListener("click", ()=>{
      const [o,k] = this.caminho(d, b.dataset.add+".x"); const lista = o[k.replace(/x$/,"")] || (o);
      const path = b.dataset.add, ps = path.split("."); let arr = d; ps.forEach(p=>{ arr = arr[p]; });
      arr.push(this.modelos[path]()); marcar(); this.render();
    }));
    el.querySelectorAll("[data-del]").forEach(b=> b.addEventListener("click", ()=>{
      const ps = b.dataset.del.split("."), idx = Number(ps.pop()); let arr = d; ps.forEach(p=>{ arr = arr[p]; });
      arr.splice(idx, 1); marcar(); this.render();
    }));
    const cg = el.querySelector("#cp-congelar"), box = el.querySelector("#cp-desde-box");
    cg.addEventListener("change", ()=>{ box.style.display = cg.checked ? "" : "none"; });
    el.querySelector("#cp-descartar").addEventListener("click", ()=>{ this.draft = null; this.dirty = false; this.render(); });
    el.querySelector("#cp-salvar").addEventListener("click", async ()=>{
      const btn = el.querySelector("#cp-salvar"); btn.disabled = true;
      const desde = cg.checked ? (el.querySelector("#cp-desde").value || "") : "";
      if(cg.checked && !desde){ toast("Escolha o mês a partir do qual os novos parâmetros valem.", "error"); btn.disabled = false; return; }
      const ok = await ComissaoParams.commit(d, cg.checked, desde);
      this.dirty = false; this.draft = null;
      toast(ok ? "Parâmetros salvos na planilha." : (ComissaoParams.status || "Salvo."), ok ? "success" : "warn");
      renderComissao();
    });
    // ---- lançamentos do mês ----
    const mm = ComissaoParams.mensalDe(ym), man = mm.manuais;
    const calc = ()=>{
      const meta = Number(d.metaFaturamento)||0, fat = el.querySelector("#mm-fat").value;
      const F = el.querySelector("#mm-fat-calc"), A = el.querySelector("#mm-av-calc");
      if(fat===""||!meta) F.innerHTML = `Informe o faturamento para ajustar a comissão (meta ${fmtBRL(meta)}). Sem valor: sem ajuste (×1,0000).`;
      else { const f = Number(fat)/meta; F.innerHTML = `${fmtBRL(Number(fat))} ÷ ${fmtBRL(meta)} = <strong>${fmtNum(f*100,2)}%</strong> → comissão do quadro × <strong>${fmtNum(f,4)}</strong> (${f>=1?'+':''}${fmtNum((f-1)*100,2)}%)`; }
      const v = Number(el.querySelector("#mm-av").value)||0, p = Number(el.querySelector("#mm-avp").value)||0;
      A.innerHTML = `${fmtBRL(v)} × ${fmtNum(p,2)}% = <strong>${fmtBRL(v*p/100)}</strong> diluídos igualmente entre os repositores (cada um tem sua parte descontada da comissão)`;
    };
    const lista = ()=>{
      const box = el.querySelector("#mm-manuais");
      box.innerHTML = man.length ? `<div class="cp-row head man"><span>Nome</span><span>Valor</span><span></span></div>` + man.map((m,i)=>`<div class="cp-row man"><input type="text" data-mn="${i}" placeholder="Nome do funcionário" value="${escapeHtml(m.nome)}"><div class="cp-aff"><i>R$</i><input type="number" step="0.01" data-mv="${i}" value="${m.valor||''}"></div><button type="button" class="cp-x" data-mx="${i}" title="Remover">✕</button></div>`).join("") : `<p class="small-muted" style="margin:0">Nenhuma comissão manual neste mês.</p>`;
      box.querySelectorAll("[data-mn]").forEach(x=> x.addEventListener("change", ()=>{ man[Number(x.dataset.mn)].nome = x.value.trim(); }));
      box.querySelectorAll("[data-mv]").forEach(x=> x.addEventListener("change", ()=>{ man[Number(x.dataset.mv)].valor = Number(x.value)||0; }));
      box.querySelectorAll("[data-mx]").forEach(x=> x.addEventListener("click", ()=>{ man.splice(Number(x.dataset.mx),1); lista(); }));
    };
    ["#mm-fat","#mm-av","#mm-avp"].forEach(s=> el.querySelector(s).addEventListener("input", calc));
    el.querySelector("#mm-add").addEventListener("click", ()=>{ man.push({ nome:"", valor:0 }); lista(); });
    calc(); lista();
    el.querySelector("#mm-salvar").addEventListener("click", async ()=>{
      const fat = el.querySelector("#mm-fat").value;
      const nv = id=>{ const v = el.querySelector(id).value; return v==="" ? null : Number(v); };
      ComissaoParams.setMensal(ym, { faturado: fat==="" ? null : Number(fat), itensManual: nv("#mm-itens"), audsManual: nv("#mm-auds"), avariaValor: Number(el.querySelector("#mm-av").value)||0, avariaPct: Number(el.querySelector("#mm-avp").value)||0, manuais: man.filter(m=>m.nome||m.valor) });
      const ok = await ComissaoParams.persistir();
      toast(ok ? "Lançamentos do mês salvos." : (ComissaoParams.status||"Salvo."), ok ? "success" : "warn");
      renderComissao();
    });
  }
};
window.ComissaoParamsUI = ComissaoParamsUI;

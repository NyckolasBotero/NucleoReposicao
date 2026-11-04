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
      auditor:    { cod:"", valorAudit:0.5, metaAuditorias:0, pctSeNaoBater:30, faixas:[{ min:0, max:49.99, value:0 }, { min:50, max:100, value:0 }] },
      recuperacao:{ cod:"", valorItem:0, metaItens:0, pctSeNaoBater:30, motivo:"RECUPERADO (REP) STO" },
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
    return { faturado: m.faturado!=null ? m.faturado : null, avariaValor: Number(m.avariaValor)||0, avariaPct: Number(m.avariaPct)||0, manuais: (m.manuais||[]).map(x=>({ nome:x.nome||"", valor:Number(x.valor)||0 })) };
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
    if(this.digits(P.auditor.cod)){
      const nome = this.nomeDe(P.auditor.cod) || ("Cód. " + P.auditor.cod);
      let auds = (window.RetornoOnline && RetornoOnline.rows) ? RetornoOnline.contarPorAuditor(ini || new Date(2000,0,1), fim || new Date(), P.auditor.cod, this.nomeDe(P.auditor.cod)) : undefined;
      if(auds!=null) auds = Math.round(auds*fator);
      const porAud = (auds||0) * (Number(P.auditor.valorAudit)||0);
      const faixa = pctQuadro==null ? null : (P.auditor.faixas||[]).find(f=> pctQuadro>=f.min && pctQuadro<=f.max);
      const premio = faixa ? Number(faixa.value)||0 : 0;
      const bruto = porAud + premio, metaA = Number(P.auditor.metaAuditorias)||0;
      const bateuMeta = !(metaA>0) || (auds||0) >= metaA, pct = Number(P.auditor.pctSeNaoBater);
      const apos = bateuMeta ? bruto : bruto * ((isNaN(pct)?100:pct)/100);
      aud = { cod:P.auditor.cod, nome, auds, porAud, faixa, premio, bruto, apos, final: apos*fatFat, bateuMeta, metaA, pct };
      linhas.push({ chave:"esp:aud", tipo:"Auditor", cod:P.auditor.cod, nome, comissaoBase:bruto, posQualidade:apos, comissaoComDesconto:apos, comissaoTotal:aud.final,
        regra: `Auditor — ${auds==null?"—":fmtNum(auds)} auditoria(s) de retorno × ${fmtBRL(Number(P.auditor.valorAudit)||0)}` + (premio? ` + prêmio quadro ${fmtBRL(premio)}` : "") + (metaA>0 ? (bateuMeta ? ` · meta de ${fmtNum(metaA)} atingida` : ` · meta de ${fmtNum(metaA)} NÃO atingida: paga ${fmtNum(aud.pct,0)}%`) : "") });
    }
    // ---- recuperação ----
    let rec = null;
    if(this.digits(P.recuperacao.cod)){
      const nome = this.nomeDe(P.recuperacao.cod) || ("Cód. " + P.recuperacao.cod);
      const alvo = normStr(P.recuperacao.motivo||""), cd = this.digits(P.recuperacao.cod);
      const i = ini ? dateOnly(ini) : new Date(2000,0,1), f = fim ? dateOnly(fim) : new Date(2999,0,1);
      const lin = (window.APP_STATE.processed.p9712||[]).filter(r=> r.dt && dateOnly(r.dt)>=i && dateOnly(r.dt)<=f && normStr(r.motivo||"")===alvo && this.digits(r.funcLanc)===cd);
      const itens = Math.round(sum(lin.map(r=>r.qtd)) * fator), valorItem = Number(P.recuperacao.valorItem)||0;
      const bruto = itens*valorItem, metaR = Number(P.recuperacao.metaItens)||0, bateuMeta = !(metaR>0) || itens >= metaR, pct = Number(P.recuperacao.pctSeNaoBater);
      const apos = bateuMeta ? bruto : bruto * ((isNaN(pct)?100:pct)/100);
      rec = { cod:P.recuperacao.cod, nome, itens, lanc: Math.round(lin.length*fator), bruto, apos, final: apos*fatFat, bateuMeta, metaR, pct, valorItem };
      linhas.push({ chave:"esp:rec", tipo:"Recuperação", cod:P.recuperacao.cod, nome, comissaoBase:bruto, posQualidade:apos, comissaoComDesconto:apos, comissaoTotal:rec.final,
        regra: `Recuperação — ${fmtNum(itens)} item(ns) × ${fmtBRL(valorItem)}` + (metaR>0 ? (bateuMeta ? ` · meta de ${fmtNum(metaR)} atingida` : ` · meta de ${fmtNum(metaR)} NÃO atingida: paga ${fmtNum(rec.pct,0)}%`) : "") });
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
    const semDesc = repBase + audB + recB + fixos + manuais;
    const subtotal = repFinal + audF + recF + fixos + manuais;
    const avariaDesc = repAvaria;                 // quanto realmente foi descontado (limitado ao que cada repositor tem a receber)
    const total = subtotal - avariaDesc;
    const tot = {
      qtdOs: sum(rep.map(e=>e.pontos)), fixa: repFinal, fixaBase: repBase, aud: audF, rec: recF, fixos, manuais,
      semDesc, total, descontos: semDesc - total, descQual: repBase - repQual, descMeta: (audB-audA)+(recB-recA),
      ajusteFat: (repFinal-repQual)+(audF-audA)+(recF-recA), avariaDesc, teto: Number(P.teto)||0, margem: (Number(P.teto)||0) - total
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
  qualidadeBruta(ini, fim){
    const i = dateOnly(ini), f = dateOnly(fim);
    const ar = (window.AuditOnline && AuditOnline.rows ? AuditOnline.rows : []).filter(r=>{ const d=dateOnly(r.data); return d>=i && d<=f; });
    const rr = (window.RetornoOnline && RetornoOnline.rows ? RetornoOnline.rows : []).filter(r=>{ const d=dateOnly(r.data); return d>=i && d<=f && !r.soAuditor; });
    const ruas = { q: ar.length ? AuditOnline.qualidadeDe(ar) : null, n: ar.length };
    const ret  = { q: rr.length ? rr.filter(r=>!r.nc).length/rr.length*100 : null, n: rr.length };
    const n = ruas.n + ret.n;
    return { ruas, ret, geral:{ q: n ? (((ruas.q||0)*ruas.n) + ((ret.q||0)*ret.n))/n : null, n } };
  },
  qualidadeComFallback(ini, fim){
    const base = this.qualidadeBruta(ini, fim), out = {};
    ["ruas","ret"].forEach(k=>{
      if(base[k].q!==null){ out[k] = { q:base[k].q, n:base[k].n, estimada:false }; return; }
      const qs = [];
      for(let m=0;m>=-5;m--){
        const a = new Date(dateOnly(ini).getFullYear(), dateOnly(ini).getMonth()+m, 1), b = new Date(a.getFullYear(), a.getMonth()+1, 0);
        const v = this.qualidadeBruta(a, b)[k]; if(v.q!==null) qs.push(v.q);
        if(qs.length>=3) break;
      }
      out[k] = { q: qs.length ? qs.reduce((x,y)=>x+y,0)/qs.length : null, n:0, estimada:qs.length>0 };
    });
    const w = o=> o.q===null ? 0 : Math.max(o.n, 1), tw = w(out.ruas) + w(out.ret);
    out.geral = { q: tw ? ((out.ruas.q||0)*w(out.ruas) + (out.ret.q||0)*w(out.ret))/tw : null, n: out.ruas.n + out.ret.n, estimada: out.ruas.estimada || out.ret.estimada };
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
      `Prêmio pelo quadro (≥ ${fmtNum(q.minimo)} pts): ${q.bateu.length} de ${q.baseN} (${q.pct==null?"—":fmtNum(q.pct,1)+"%"}) → ${c.aud.faixa ? fmtNum(c.aud.faixa.min,2)+"%–"+fmtNum(c.aud.faixa.max,2)+"% = "+fmtBRL(c.aud.premio) : "nenhuma faixa atingida"}`,
      c.aud.metaA>0 ? (c.aud.bateuMeta ? `Meta de ${fmtNum(c.aud.metaA)} auditorias atingida` : `Meta de ${fmtNum(c.aud.metaA)} auditorias NÃO atingida: recebe ${fmtNum(c.aud.pct,0)}%`) : "Sem meta de auditorias definida"
    ] : ["Nenhum código definido para a função Auditor"];
    const rec = c.rec ? [
      `${c.rec.nome}: ${fmtBRL(c.rec.valorItem)} por item (motivo "${P.recuperacao.motivo}", 9712) × ${fmtNum(c.rec.itens)} = ${fmtBRL(c.rec.bruto)}`,
      c.rec.metaR>0 ? (c.rec.bateuMeta ? `Meta de ${fmtNum(c.rec.metaR)} itens atingida` : `Meta de ${fmtNum(c.rec.metaR)} itens NÃO atingida: recebe ${fmtNum(c.rec.pct,0)}%`) : "Sem meta de recuperação definida"
    ] : ["Nenhum código definido para a função Recuperação"];
    return { fixa, auditor, rec };
  },
  fmtQ(o){ return o.q===null ? "—" : fmtNum(o.q,1)+"%"+(o.estimada?" (média)":""); },
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
      <p class="panel-note">A coluna de projeção (só na tela, fora das extrações) extrapola o mês pelo ritmo de dias úteis; qualidade não é projetada. Sem auditoria no mês, a qualidade usa a média dos meses anteriores com dados e é marcada "(média)".</p>
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
    "auditor.faixas": ()=>({ min:0, max:0, value:0 })
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
  inp(path, val, opts){
    opts = opts || {};
    const t = opts.t || "number";
    const v = val==null ? "" : val;
    return `<input type="${t}" ${t==="number"?`step="${opts.step||"any"}"`:""} data-p="${path}" ${opts.re?'data-re="1"':''} value="${escapeHtml(String(v))}" style="width:${opts.w||100}px" ${opts.ph?`placeholder="${opts.ph}"`:''}>`;
  },
  toggle(path, val, rotulo){
    return `<div class="filter-group"><label>${rotulo}</label><div class="toggle-group">
      <button type="button" data-tg="${path}" data-v="SIM" class="${val==='SIM'?'active':''}">Sim</button>
      <button type="button" data-tg="${path}" data-v="NAO" class="${val==='NAO'?'active':''}">Não</button></div></div>`;
  },
  render(){
    const el = document.getElementById("comissao-params"); if(!el) return;
    ComissaoParams.carregarRemoto();
    const d = this.garantirDraft(), st = CommissionState;
    const ref = ComissaoResumo.mesRef(), ym = ComissaoParams.ym(ref), M = ComissaoParams.mensalDe(ym);
    const Pm = ComissaoParams.paraMes(ym);
    const vs = ComissaoParams.estado().versoes;
    const desdeDef = ComissaoParams.ym(Production.maxDataDate() || new Date());
    const rowBand = (b,i)=>`<div class="band-row">${this.inp(`bands.${i}.min`,b.min,{w:90})}${this.inp(`bands.${i}.max`,b.max,{w:90})}${this.inp(`bands.${i}.value`,b.value,{w:90,step:0.01})}
        <div style="display:flex;gap:6px;align-items:center"><label class="small-muted" style="display:flex;align-items:center;gap:4px"><input type="checkbox" data-p="bands.${i}.active" ${b.active!==false?'checked':''}> Ativa</label><button type="button" class="icon-btn" data-del="bands.${i}">✕</button></div></div>`;
    const rowExc = (x,i)=>`<div class="exception-row">${this.inp(`exceptions.${i}.codigo`,x.codigo,{t:"text",w:90,re:1})}<div>${this.nomeTag(x.codigo)}</div>${this.inp(`exceptions.${i}.valuePerPoint`,x.valuePerPoint,{w:80,step:0.01})}
        <label class="small-muted" style="display:flex;align-items:center;gap:4px"><input type="checkbox" data-p="exceptions.${i}.active" ${x.active!==false?'checked':''}> Ativa</label><button type="button" class="icon-btn" data-del="exceptions.${i}">✕</button></div>`;
    const rowFix = (f,i)=>`<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:4px">${this.inp(`fixos.${i}.cod`,f.cod,{t:"text",w:90,re:1,ph:"código"})}<span style="min-width:170px">${this.nomeTag(f.cod)}</span>
        ${this.inp(`fixos.${i}.tipo`,f.tipo,{t:"text",w:110,ph:"tipo (ex.: Líder)"})} R$ ${this.inp(`fixos.${i}.valor`,f.valor,{w:100,step:0.01})}<button type="button" class="icon-btn" data-del="fixos.${i}">✕</button></div>`;
    const rowEx = (c,i)=>`<div style="display:flex;gap:8px;align-items:center;margin-bottom:4px">${this.inp(`excecoes.${i}`,c,{t:"text",w:90,re:1,ph:"código"})}<span>${this.nomeTag(c)}</span><button type="button" class="icon-btn" data-del="excecoes.${i}">✕</button></div>`;
    const rowFx = (f,i)=>`<div style="display:flex;gap:6px;align-items:center;margin-bottom:4px">de ${this.inp(`auditor.faixas.${i}.min`,f.min,{w:70,step:0.01})}% até ${this.inp(`auditor.faixas.${i}.max`,f.max,{w:70,step:0.01})}% → R$ ${this.inp(`auditor.faixas.${i}.value`,f.value,{w:90,step:0.01})}<button type="button" class="icon-btn" data-del="auditor.faixas.${i}">✕</button></div>`;
    const sec = (t, inner)=>`<div style="border:1px solid var(--gray-200,#dde3ec);border-radius:8px;padding:10px 12px;margin-bottom:10px"><h4 style="margin:0 0 8px">${t}</h4>${inner}</div>`;
    const fld = (rot, html)=>`<div class="filter-group"><label>${rot}</label>${html}</div>`;
    const a = d.auditor, r = d.recuperacao;
    el.innerHTML = `
      <div class="panel-header"><h3>Definição de Parâmetros</h3><span class="small-muted" id="cp-status">${escapeHtml(ComissaoParams.status || "")}</span></div>
      ${this.dirty ? `<div class="warn-box">Há alterações não salvas. Os cálculos só mudam depois de clicar em <strong>Salvar parâmetros</strong>.</div>` : ""}

      ${sec("Parâmetros comissão", `<div class="toolbar" style="flex-wrap:wrap;gap:10px;margin:0">
        ${this.toggle("aplicarDesconto", d.aplicarDesconto, "Aplicar desconto por qualidade?")}
        ${this.toggle("considerarMissoes", d.considerarMissoes, "Considerar Missões?")}
        ${fld("Teto de comissão (R$)", this.inp("teto", d.teto, {w:110, step:100}))}
        ${fld("Pontuação mínima no mês (O.S.)", this.inp("pontosMinimos", d.pontosMinimos, {w:100}))}
        ${fld("R$ fixo se não atingir a mínima", this.inp("valorFixoAbaixo", d.valorFixoAbaixo, {w:100, step:0.01}))}
        ${fld("Meta de faturamento (R$)", this.inp("metaFaturamento", d.metaFaturamento, {w:150, step:1000}))}
      </div><p class="small-muted" style="margin:6px 0 0">Qualidade: &lt;50% zera · 50–69% paga metade · ≥70% paga o % da qualidade. Repositor com menos de ${fmtNum(d.pontosMinimos)} O.S. no mês recebe R$ ${fmtNum(d.valorFixoAbaixo,2)} fixo (com desconto de qualidade e ajuste de faturamento, como os demais).</p>`)}

      ${sec("Faixas de Pontuação", `<div class="band-row" style="font-size:11px;font-weight:700;color:var(--gray-500);text-transform:uppercase"><div>Pontuação Inicial</div><div>Pontuação Final</div><div>Valor por Ponto (R$)</div><div></div></div>
        ${d.bands.map(rowBand).join("")}<button type="button" class="btn btn-outline btn-sm" data-add="bands">+ Adicionar faixa</button>`)}

      ${sec("Exceções Individuais (valor por ponto próprio)", (d.exceptions.length ? `<div class="exception-row" style="font-size:11px;font-weight:700;color:var(--gray-500);text-transform:uppercase"><div>Código</div><div>Nome</div><div>R$/Ponto</div><div>Ativo</div><div></div></div>` : `<p class="small-muted">Nenhuma exceção cadastrada.</p>`)
        + d.exceptions.map(rowExc).join("") + `<button type="button" class="btn btn-outline btn-sm" data-add="exceptions">+ Adicionar exceção</button>`)}

      ${sec("Equipe de Apoio", `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:14px">
          <div><h5 style="margin:0 0 6px">Auditor — ${this.nomeTag(a.cod)}</h5>
            <div class="toolbar" style="flex-wrap:wrap;gap:8px;margin:0">
              ${fld("Código", this.inp("auditor.cod", a.cod, {t:"text", w:100, re:1}))}
              ${fld("R$ por auditoria de retorno", this.inp("auditor.valorAudit", a.valorAudit, {w:90, step:0.01}))}
              ${fld("Meta de auditorias (mês)", this.inp("auditor.metaAuditorias", a.metaAuditorias, {w:90}))}
              ${fld("% recebido se não bater a meta", this.inp("auditor.pctSeNaoBater", a.pctSeNaoBater, {w:90}))}
            </div>
            <div class="small-muted" style="margin:6px 0 4px">Prêmio (R$) conforme o % do quadro que bateu a pontuação mínima:</div>
            ${a.faixas.map(rowFx).join("")}<button type="button" class="btn btn-outline btn-sm" data-add="auditor.faixas">+ faixa</button>
          </div>
          <div><h5 style="margin:0 0 6px">Recuperação (9712) — ${this.nomeTag(r.cod)}</h5>
            <div class="toolbar" style="flex-wrap:wrap;gap:8px;margin:0">
              ${fld("Código (Func.Lançamento)", this.inp("recuperacao.cod", r.cod, {t:"text", w:100, re:1}))}
              ${fld("R$ por item recuperado", this.inp("recuperacao.valorItem", r.valorItem, {w:90, step:0.01}))}
              ${fld("Meta de recuperação (itens/mês)", this.inp("recuperacao.metaItens", r.metaItens, {w:90}))}
              ${fld("% recebido se não bater a meta", this.inp("recuperacao.pctSeNaoBater", r.pctSeNaoBater, {w:90}))}
              ${fld("Motivo na 9712", this.inp("recuperacao.motivo", r.motivo, {t:"text", w:190}))}
            </div>
          </div>
        </div>`)}

      ${sec("Comissão fixa por código (ex.: Líder)", `<p class="small-muted" style="margin:0 0 6px">O nome vem do código e a linha aparece na tabela com o tipo indicado. Esses códigos não entram na pontuação nem na meta do quadro.</p>
        ${d.fixos.map(rowFix).join("")}<button type="button" class="btn btn-outline btn-sm" data-add="fixos">+ Adicionar comissão fixa</button>`)}

      ${sec("Lista de exceção de repositor", `<p class="small-muted" style="margin:0 0 6px">Códigos que não contam como repositor (não entram na tabela de pontos nem no cálculo "quantos bateram a meta"). Auditor, Recuperação e as comissões fixas acima já ficam de fora automaticamente.</p>
        ${d.excecoes.map(rowEx).join("")}<button type="button" class="btn btn-outline btn-sm" data-add="excecoes">+ Adicionar código</button>`)}

      <div style="border:2px solid #2f6fce;border-radius:8px;padding:10px 12px;margin-bottom:12px;background:#f4f8ff">
        <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
          <label style="display:flex;align-items:center;gap:6px;font-weight:700"><input type="checkbox" id="cp-congelar"> Congelar meses anteriores</label>
          <span class="filter-group" id="cp-desde-box" style="display:none"><label>Novos parâmetros valem a partir de</label><input type="month" id="cp-desde" value="${desdeDef}"></span>
          <button type="button" class="btn btn-primary" id="cp-salvar">Salvar parâmetros</button>
          <button type="button" class="btn btn-outline btn-sm" id="cp-descartar" ${this.dirty?'':'disabled'}>Descartar alterações</button>
        </div>
        <p class="small-muted" style="margin:6px 0 0">Com o botão <strong>desmarcado</strong>, os novos parâmetros passam a valer também para os meses passados (o histórico é recalculado). <strong>Marcado</strong>: os meses anteriores ao escolhido mantêm os parâmetros antigos.<br>
        Vigências salvas: ${vs.map(v=> v.desde==="0000-00" ? "início" : "a partir de "+ComissaoParams.ymRot(v.desde)).join(" → ")}</p>
      </div>

      ${sec("Lançamentos do mês — " + ComissaoParams.ymRot(ym) + " (ficam salvos por mês)", `
        <div class="toolbar" style="flex-wrap:wrap;gap:12px;margin:0;align-items:flex-end">
          ${fld("Valor faturado no mês (R$)", `<input type="number" step="1000" id="mm-fat" value="${M.faturado==null?'':M.faturado}" style="width:160px">`)}
          <div id="mm-fat-calc" class="hint-box" style="margin:0"></div>
        </div>
        <div class="toolbar" style="flex-wrap:wrap;gap:12px;margin:8px 0 0;align-items:flex-end">
          ${fld("Valor de avaria do mês (R$)", `<input type="number" step="0.01" id="mm-av" value="${M.avariaValor||''}" style="width:140px">`)}
          ${fld("% de desconto de avaria", `<input type="number" step="0.01" id="mm-avp" value="${M.avariaPct||''}" style="width:100px">`)}
          <div id="mm-av-calc" class="hint-box" style="margin:0"></div>
        </div>
        <div style="margin-top:10px"><strong>Comissão manual (funcionários sem código)</strong>
          <div id="mm-manuais"></div>
          <button type="button" class="btn btn-outline btn-sm" id="mm-add">+ Adicionar</button>
        </div>
        <div style="margin-top:10px"><button type="button" class="btn btn-primary btn-sm" id="mm-salvar">Salvar lançamentos do mês</button> <span class="small-muted" id="mm-status"></span></div>`)}
    `;
    this.ligar(el, ym, Pm);
  },
  ligar(el, ym, Pm){
    const d = this.draft;
    const marcar = ()=>{ if(!this.dirty){ this.dirty = true; const d2 = el.querySelector("#cp-descartar"); if(d2) d2.disabled = false; const st = el.querySelector("#cp-status"); if(st) st.textContent = "Alterações não salvas"; } };
    el.querySelectorAll("[data-p]").forEach(inp=> inp.addEventListener("change", ()=>{
      const [o,k] = this.caminho(d, inp.dataset.p);
      o[k] = inp.type==="checkbox" ? inp.checked : inp.type==="number" ? (inp.value==="" ? 0 : Number(inp.value)) : inp.value.trim();
      marcar();
      if(inp.dataset.re) this.render();
    }));
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
      box.innerHTML = man.map((m,i)=>`<div style="display:flex;gap:8px;align-items:center;margin:4px 0"><input type="text" data-mn="${i}" placeholder="Nome" value="${escapeHtml(m.nome)}" style="width:220px"> R$ <input type="number" step="0.01" data-mv="${i}" value="${m.valor||''}" style="width:110px"><button type="button" class="icon-btn" data-mx="${i}">✕</button></div>`).join("") || `<p class="small-muted" style="margin:4px 0">Nenhuma comissão manual neste mês.</p>`;
      box.querySelectorAll("[data-mn]").forEach(x=> x.addEventListener("change", ()=>{ man[Number(x.dataset.mn)].nome = x.value.trim(); }));
      box.querySelectorAll("[data-mv]").forEach(x=> x.addEventListener("change", ()=>{ man[Number(x.dataset.mv)].valor = Number(x.value)||0; }));
      box.querySelectorAll("[data-mx]").forEach(x=> x.addEventListener("click", ()=>{ man.splice(Number(x.dataset.mx),1); lista(); }));
    };
    ["#mm-fat","#mm-av","#mm-avp"].forEach(s=> el.querySelector(s).addEventListener("input", calc));
    el.querySelector("#mm-add").addEventListener("click", ()=>{ man.push({ nome:"", valor:0 }); lista(); });
    calc(); lista();
    el.querySelector("#mm-salvar").addEventListener("click", async ()=>{
      const fat = el.querySelector("#mm-fat").value;
      ComissaoParams.setMensal(ym, { faturado: fat==="" ? null : Number(fat), avariaValor: Number(el.querySelector("#mm-av").value)||0, avariaPct: Number(el.querySelector("#mm-avp").value)||0, manuais: man.filter(m=>m.nome||m.valor) });
      const ok = await ComissaoParams.persistir();
      toast(ok ? "Lançamentos do mês salvos." : (ComissaoParams.status||"Salvo."), ok ? "success" : "warn");
      renderComissao();
    });
  }
};
window.ComissaoParamsUI = ComissaoParamsUI;

/* =========================================================================
   Núcleo Reposição — Regras configuráveis (Administração > Parâmetros)
   · regras_nc  : escalada NC → feedback → advertência → suspensão, por motivo
   · regras_aud : pesos e exceções da auditoria de ruas
   Valores padrão = regras em vigor. Quem lê (todas as telas) usa Regras.*; quem grava é o administrador.
   Carrega do servidor (param_ler) e guarda uma cópia local para abrir rápido/offline.
   ========================================================================= */
const REGRAS_PADRAO_NC = {
  global: { ncPorFb:4, fbParaAdvNC:3, fbParaAdvOutros:3, advParaSusp:3 },
  /* por motivo (chave = FeedbackAdv.mk(motivo)): { motivo, ncPorFb?, fbParaAdv?, advParaSusp?, alertaFb?, alertaAdv?, alertaSusp? } — o que não for informado usa o global */
  motivos: {}
};
const REGRAS_PADRAO_AUD = {
  pesos: { pickErrado:6, avariado:4, proxVenc:3, semSaldo:2, outra:1 },
  ruasFora: [14,15,21,31,50,51,52,53,54]
};

const Regras = {
  nc: JSON.parse(JSON.stringify(REGRAS_PADRAO_NC)),
  aud: JSON.parse(JSON.stringify(REGRAS_PADRAO_AUD)),
  admin: false, carregada: false,
  _ls: { regras_nc:"nr_regras_nc", regras_aud:"nr_regras_aud" },

  clone(o){ return JSON.parse(JSON.stringify(o)); },
  num(v, pad){ const n = parseInt(v, 10); return isFinite(n) && n >= 1 ? n : pad; },
  mesclarNC(c){
    const base = this.clone(REGRAS_PADRAO_NC); c = c || {};
    const g = c.global || {};
    Object.keys(base.global).forEach(k=>{ base.global[k] = this.num(g[k], base.global[k]); });
    Object.keys(c.motivos || {}).forEach(k=>{ const m = c.motivos[k] || {}; const o = { motivo:String(m.motivo || k) };
      ["ncPorFb","fbParaAdv","advParaSusp"].forEach(f=>{ if(m[f] !== undefined && m[f] !== null && m[f] !== "") o[f] = this.num(m[f], undefined); });
      ["alertaFb","alertaAdv","alertaSusp"].forEach(f=>{ if(m[f] === false) o[f] = false; });
      base.motivos[k] = o; });
    return base;
  },
  mesclarAud(c){
    const base = this.clone(REGRAS_PADRAO_AUD); c = c || {};
    Object.keys(base.pesos).forEach(k=>{ const v = parseFloat(((c.pesos||{})[k])); if(isFinite(v) && v >= 0) base.pesos[k] = v; });
    if(Array.isArray(c.ruasFora)) base.ruasFora = c.ruasFora.map(n=>parseInt(n,10)).filter(n=>isFinite(n) && n > 0);
    return base;
  },
  aplicarAud(){
    if(typeof AUDITORIA_PESOS_CRITERIOS !== "undefined") Object.assign(AUDITORIA_PESOS_CRITERIOS, this.aud.pesos);
    if(window.AuditOnline) AuditOnline.RUAS_FORA = new Set(this.aud.ruasFora);
  },

  /* ---- leitura das regras por motivo (chave já normalizada por FeedbackAdv.mk) ---- */
  g(k){ return this.nc.global[k]; },
  m(chave){ return (this.nc.motivos || {})[chave] || {}; },
  ehNC(chave){ return typeof NC !== "undefined" && NC.ehMotivo(chave); },
  ncPorFb(chave){ const v = this.m(chave).ncPorFb; return v || this.nc.global.ncPorFb; },
  fbParaAdv(chave){ const v = this.m(chave).fbParaAdv; return v || (this.ehNC(chave) ? this.nc.global.fbParaAdvNC : this.nc.global.fbParaAdvOutros); },
  advParaSusp(chave){ const v = this.m(chave).advParaSusp; return v || this.nc.global.advParaSusp; },
  alertaFb(chave){ return this.m(chave).alertaFb !== false; },
  alertaAdv(chave){ return this.m(chave).alertaAdv !== false; },
  alertaSusp(chave){ return this.m(chave).alertaSusp !== false; },

  /* ---- carga / gravação ---- */
  _ler(chave){ try{ return JSON.parse(localStorage.getItem(this._ls[chave]) || "null"); }catch(e){ return null; } },
  _guardar(chave, c){ try{ localStorage.setItem(this._ls[chave], JSON.stringify(c)); }catch(e){} },
  iniciar(){
    const a = this._ler("regras_nc"), b = this._ler("regras_aud");
    if(a) this.nc = this.mesclarNC(a);
    if(b) this.aud = this.mesclarAud(b);
    this.aplicarAud();
  },
  async carregar(){
    if(typeof Api === "undefined" || !Api.call) return false;
    try{
      const [a, b] = await Promise.all([ Api.call({ acao:"param_ler", chave:"regras_nc" }), Api.call({ acao:"param_ler", chave:"regras_aud" }) ]);
      if(a && a.ok){ this.nc = this.mesclarNC(a.config); this._guardar("regras_nc", this.nc); this.admin = !!a.admin; }
      if(b && b.ok){ this.aud = this.mesclarAud(b.config); this._guardar("regras_aud", this.aud); }
      this.aplicarAud(); this.carregada = true; return true;
    }catch(e){ return false; }
  },
  async salvar(chave, cfg){
    const r = await Api.call({ acao:"param_salvar", chave, config:cfg });
    if(!r || !r.ok) throw new Error((r && r.erro) || "Não foi possível salvar.");
    if(chave === "regras_nc") this.nc = this.mesclarNC(cfg); else this.aud = this.mesclarAud(cfg);
    this._guardar(chave, chave === "regras_nc" ? this.nc : this.aud); this.aplicarAud();
    return true;
  },
  /** redesenha as telas que dependem das regras (alertas, feedbacks, auditoria) */
  atualizarTelas(){
    try{ if(window.UI && UI.refreshActive) UI.refreshActive(); }catch(e){}
  }
};
window.Regras = Regras;
Regras.iniciar();

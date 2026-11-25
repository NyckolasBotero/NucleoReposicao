/* =========================================================================
   Gestão STA — Ecommerce (Indicadores > Ecommerce)
   Duas operações somadas: STA (e-commerce da Santa Therezinha) + SIA (tele venda). O total do Ecommerce é a soma das duas.
   Abas: Visão geral · Fechamento do dia · Pedidos pendentes (STA) · Expedição SIA
   Acesso: só quem tem Indicadores > Ecommerce liberado em Administração > Acessos (o servidor confere em toda ação).
   Dados: abas ECOM_* na planilha de dados (Apps Script, ações ecom_*).
   ========================================================================= */
const EcomUI = {
  pane: "ecommerce",
  tab: "geral",
  dados: null, carregando: false, erro: "",
  hoje: null,
  origem: "geral",                       // seletor Geral · STA · SIA
  per: "mes",                            // dia | mes | mesant | tudo
  fx: { data: null, vals: {}, aberto: false },   // formulário do fechamento
  pd: { filtro: "pend", busca: "", forma: null },
  ex: { ini: null, fim: null, transp: "", busca: "", ver: 300, ult: { transp: "", data: null } },

  /* ------------------------------ utilidades ------------------------------ */
  h(s){ return escapeHtml(s == null ? "" : String(s)); },
  pad(n){ return String(n).padStart(2, "0"); },
  isoDe(d){ return `${d.getFullYear()}-${this.pad(d.getMonth() + 1)}-${this.pad(d.getDate())}`; },
  aData(iso){ const [y, m, d] = String(iso).split("-").map(Number); return new Date(y, m - 1, d, 12); },
  soma(iso, n){ const d = this.aData(iso); d.setDate(d.getDate() + n); return this.isoDe(d); },
  dias(a, b){ return Math.round((this.aData(b) - this.aData(a)) / 86400000); },
  br(iso){ const p = String(iso || "").split("-"); return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : (iso || "—"); },
  br2(iso){ const p = String(iso || "").split("-"); return p.length === 3 ? `${p[2]}/${p[1]}` : (iso || "—"); },
  hojeIso(){ return this.hoje || this.isoDe(new Date()); },
  mesIni(iso){ return iso.slice(0, 8) + "01"; },
  mesFim(iso){ const d = this.aData(this.mesIni(iso)); d.setMonth(d.getMonth() + 1); d.setDate(0); return this.isoDe(d); },
  mesAnt(iso){ const d = this.aData(this.mesIni(iso)); d.setMonth(d.getMonth() - 1); return this.isoDe(d); },
  n(v, dec){ return (v === null || v === undefined || v === "" || isNaN(v)) ? "—" : fmtNum(Number(v), dec || 0); },
  brl(v){ return (v === null || v === undefined || v === "" || isNaN(v)) ? "—" : fmtBRL(Number(v)); },
  /** lê número digitado em português: 1.234,56 · 1234,56 · 1234.56 */
  num(v){
    if(v === null || v === undefined || v === "") return null;
    if(typeof v === "number") return isFinite(v) ? v : null;
    let t = String(v).trim().replace(/[^\d,.\-]/g, ""); if(!t) return null;
    if(t.includes(",")) t = t.replace(/\./g, "").replace(",", ".");
    else if(/^-?\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, "");
    const x = Number(t); return isFinite(x) ? x : null;
  },
  campo(v, dec){ return (v === null || v === undefined || v === "") ? "" : Number(v).toLocaleString("pt-BR", { maximumFractionDigits: dec == null ? 2 : dec, useGrouping: false }); },
  async chamar(payload){ try{ return await Api.call(payload); }catch(e){ return { ok: false, erro: e.message }; } },
  el(id){ return document.getElementById(id); },

  /* ------------------------------ carga e abas ------------------------------ */
  renderPane(){
    const pane = this.el("pane-" + this.pane); if(!pane) return;
    if(!Api.configured()){ pane.innerHTML = `<div class="panel">${AdminUI.semServidor()}</div>`; return; }
    if(!this.dados){ pane.innerHTML = `<div class="panel"><p class="small-muted">Carregando Ecommerce…</p></div>`; this.carregar(); return; }
    this.desenhar();
  },
  async carregar(){
    if(this.carregando) return; this.carregando = true;
    const r = await this.chamar({ acao: "ecom_ler" });
    this.carregando = false;
    if(!r || !r.ok){ this.erro = (r && r.erro) || "Não foi possível carregar o Ecommerce."; this.dados = null;
      const pane = this.el("pane-" + this.pane);
      if(pane){ pane.innerHTML = `<div class="panel"><div class="error-box">${this.h(this.erro)}</div><button class="btn btn-outline" id="ec-retry">Tentar novamente</button></div>`; this.el("ec-retry").addEventListener("click", () => this.renderPane()); }
      return; }
    this.erro = ""; this.dados = r; this.hoje = r.hoje;
    if(!this.fx.data) this.fx.data = r.hoje;
    if(!this.ex.ini){ this.ex.ini = this.mesIni(r.hoje); this.ex.fim = r.hoje; }
    this.fx.carregadoPara = null;
    this.desenhar();
  },
  desenhar(){
    const pane = this.el("pane-" + this.pane); if(!pane || !this.dados) return;
    const tabs = [["geral", "Visão geral"], ["fech", "Fechamento do dia"], ["ped", "Pedidos pendentes"], ["exp", "Expedição SIA"]];
    pane.innerHTML = `<div class="panel" style="padding-bottom:6px">
        <h2 class="adm-h" style="margin-bottom:2px">Ecommerce STA</h2>
        <p class="small-muted" style="margin:0 0 10px">Total do Ecommerce = STA (Santa Therezinha) + SIA (tele venda). Os números aparecem separados por origem e somados.</p>
        <div class="rf-tabs" role="tablist">${tabs.map(([id, rot]) => `<button type="button" class="rf-tab ${this.tab === id ? "on" : ""}" role="tab" data-ec-tab="${id}">${rot}</button>`).join("")}</div>
      </div><div id="ec-corpo"></div>`;
    pane.querySelectorAll("[data-ec-tab]").forEach(b => b.addEventListener("click", () => { this.tab = b.dataset.ecTab; this.desenhar(); }));
    this.corpo();
  },
  corpo(){
    const box = this.el("ec-corpo"); if(!box) return;
    ({ geral: () => this.telaGeral(box), fech: () => this.telaFech(box), ped: () => this.telaPed(box), exp: () => this.telaExp(box) })[this.tab]();
  },

  /* ------------------------------ dados derivados ------------------------------ */
  fechDia(data, origem){ const f = this.dados.fechamentos.find(x => x.data === data && x.origem === origem); return f ? f.campos : null; },
  /** soma dos fechamentos no período, por origem */
  somar(ini, fim, origem){
    const t = { fat: 0, vol: 0, peso: 0, ped: 0, horas: 0, dias: 0 };
    this.dados.fechamentos.forEach(f => {
      if(f.origem !== origem || f.data < ini || f.data > fim) return;
      const c = f.campos || {};
      t.fat += Number(c.fat) || 0; t.vol += Number(c.volumes) || 0; t.peso += Number(c.peso) || 0; t.ped += Number(c.pedidos) || 0; t.dias++;
      if(origem === "STA") t.horas += Number(c.horas) || 0;
    });
    return t;
  },
  total(a, b){ return { fat: a.fat + b.fat, vol: a.vol + b.vol, peso: a.peso + b.peso, ped: a.ped + b.ped, horas: a.horas, dias: Math.max(a.dias, b.dias) }; },
  datasFechadas(){ return Array.from(new Set(this.dados.fechamentos.map(f => f.data))).sort(); },
  periodo(){
    const hj = this.hojeIso(), ds = this.datasFechadas(), ult = ds.length ? ds[ds.length - 1] : hj;
    if(this.per === "dia"){ const ant = ds.filter(d => d < ult).pop() || null; return { ini: ult, fim: ult, rot: "Último dia fechado · " + this.br(ult), ant: ant ? { ini: ant, fim: ant, rot: "dia anterior (" + this.br2(ant) + ")" } : null }; }
    if(this.per === "mesant"){ const m = this.mesAnt(hj), a = this.mesAnt(m); return { ini: m, fim: this.mesFim(m), rot: "Mês anterior", ant: { ini: a, fim: this.mesFim(a), rot: "mês retrasado" } }; }
    if(this.per === "tudo") return { ini: ds[0] || hj, fim: hj, rot: "Todo o histórico", ant: null };
    const m = this.mesIni(hj), a = this.mesAnt(hj);
    return { ini: m, fim: hj, rot: "Mês atual", ant: { ini: a, fim: this.mesFim(a), rot: "mês anterior" } };
  },
  /** pedidos em aberto na data (entrou até a data e ainda não tinha nota) */
  abertosEm(data){
    return this.dados.pedidos.filter(p => p.entrada <= data && (!p.nota || p.dataNota > data));
  },
  idade(p, data){ return Math.max(0, this.dias(p.entrada, data || this.hojeIso())); },
  leadTime(data){
    const cont = new Array(17).fill(0), val = new Array(17).fill(0);
    this.abertosEm(data).forEach(p => { const i = Math.min(16, this.idade(p, data)); cont[i]++; val[i] += Number(p.valor) || 0; });
    return { cont, val };
  },
  variacao(atual, ant, fmt){
    if(ant === null || ant === undefined) return "";
    const dif = atual - ant, pct = ant ? dif / ant * 100 : null;
    const cor = dif > 0 ? "var(--green)" : dif < 0 ? "var(--red)" : "var(--gray-500)";
    const seta = dif > 0 ? "▲" : dif < 0 ? "▼" : "■";
    return `<span style="color:${cor};font-weight:700">${seta} ${dif > 0 ? "+" : ""}${fmt(dif)}${pct === null ? "" : ` (${pct > 0 ? "+" : ""}${fmtNum(pct, 1)}%)`}</span>`;
  },

  /* ------------------------------ ABA 1: Visão geral ------------------------------ */
  telaGeral(box){
    const P = this.periodo(), sta = this.somar(P.ini, P.fim, "STA"), sia = this.somar(P.ini, P.fim, "SIA"), tot = this.total(sta, sia);
    const aSta = P.ant ? this.somar(P.ant.ini, P.ant.fim, "STA") : null, aSia = P.ant ? this.somar(P.ant.ini, P.ant.fim, "SIA") : null, aTot = aSta ? this.total(aSta, aSia) : null;
    const col = [["STA", "STA · Santa Therezinha", sta, aSta], ["SIA", "SIA · Tele venda", sia, aSia], ["TOTAL", "TOTAL · Ecommerce", tot, aTot]]
      .filter(c => this.origem === "geral" || c[0] === this.origem || (this.origem === "TOTAL" && c[0] === "TOTAL"));
    const part = tot.fat ? { sta: sta.fat / tot.fat * 100, sia: sia.fat / tot.fat * 100 } : null;
    const horas = sta.horas;
    const bloco = ([id, rot, t, a]) => {
      const m = (lbl, v, fmtv, av, dec) => `<div class="ec-met"><div class="card-label">${lbl}</div><div class="card-value">${fmtv(v)}</div><div class="card-sub">${a ? this.variacao(v, av, x => fmtv(x)) + ` <span class="small-muted">vs ${this.h(P.ant.rot)}</span>` : ""}</div></div>`;
      const extra = id === "TOTAL" ? `<div class="ec-met"><div class="card-label">Volumes por hora</div><div class="card-value">${horas ? this.n(tot.vol / horas, 1) : "—"}</div><div class="card-sub small-muted">${horas ? `${this.n(tot.vol)} volumes em ${this.n(horas)} h` : "informe as horas no fechamento"}</div></div>`
        : `<div class="ec-met"><div class="card-label">Participação no faturamento</div><div class="card-value">${part ? fmtNum(id === "STA" ? part.sta : part.sia, 1) + "%" : "—"}</div><div class="card-sub small-muted">${this.n(t.dias)} dia(s) fechado(s)</div></div>`;
      return `<div class="panel ec-bloco ec-${id.toLowerCase()}"><div class="ec-bt">${this.h(rot)}</div>
        ${m("Faturamento", t.fat, v => this.brl(v), a && a.fat)}${m("Volumes", t.vol, v => this.n(v), a && a.vol)}${m("Peso manipulado", t.peso, v => this.n(v, 2), a && a.peso)}${m("Pedidos", t.ped, v => this.n(v), a && a.ped)}${extra}</div>`;
    };
    const ab = this.abertosEm(this.hojeIso()), vAbertos = ab.reduce((s, p) => s + (Number(p.valor) || 0), 0), bloq = ab.filter(p => p.bloq).length;
    const maisVelho = ab.length ? Math.max(...ab.map(p => this.idade(p))) : null;
    box.innerHTML = `<div class="panel"><div class="toolbar" style="margin:0;display:flex;gap:14px;flex-wrap:wrap;align-items:center;justify-content:space-between">
        <div class="ec-seg" role="group" aria-label="Origem">${[["geral", "Geral"], ["STA", "STA"], ["SIA", "SIA"]].map(([v, r]) => `<button type="button" class="ec-segb ${this.origem === v ? "on" : ""}" data-ec-orig="${v}">${r}</button>`).join("")}</div>
        <div class="ec-seg" role="group" aria-label="Período">${[["dia", "Último dia"], ["mes", "Mês atual"], ["mesant", "Mês anterior"], ["tudo", "Tudo"]].map(([v, r]) => `<button type="button" class="ec-segb ${this.per === v ? "on" : ""}" data-ec-per="${v}">${r}</button>`).join("")}</div></div>
        <p class="small-muted" style="margin:10px 0 0">${this.h(P.rot)} · ${this.br(P.ini)} a ${this.br(P.fim)}${this.datasFechadas().length ? "" : " · ainda não há fechamentos lançados"}</p></div>
      <div class="ec-grid">${col.map(bloco).join("")}</div>
      ${this.origem !== "SIA" ? `<div class="panel"><h3 class="adm-h">Pedidos pendentes do STA <span class="small-muted">· hoje</span></h3><div class="cards-grid" style="margin-bottom:0">
        <div class="card"><div class="card-label">Pendentes</div><div class="card-value">${this.n(ab.length)}</div><div class="card-sub">sem número de nota</div></div>
        <div class="card"><div class="card-label">Bloqueados</div><div class="card-value" style="color:${bloq ? "var(--orange)" : "inherit"}">${this.n(bloq)}</div><div class="card-sub">entre os pendentes</div></div>
        <div class="card"><div class="card-label">Pedido mais antigo</div><div class="card-value" style="color:${maisVelho >= 4 ? "var(--red)" : "inherit"}">${maisVelho === null ? "—" : this.n(maisVelho) + " d"}</div><div class="card-sub">dias em aberto</div></div>
        <div class="card"><div class="card-label">Valor a expedir</div><div class="card-value">${this.brl(vAbertos)}</div><div class="card-sub">soma dos pendentes</div></div></div></div>` : ""}
      <div class="grid-2" style="grid-template-columns:1fr"><div class="panel"><h3 class="adm-h">Faturamento por dia <span class="small-muted">· STA e SIA empilhados, linha = total</span></h3><div class="chart-wrap" style="height:300px"><canvas id="ec-ch1"></canvas></div></div>
      <div class="panel"><h3 class="adm-h">Volumes por dia</h3><div class="chart-wrap" style="height:260px"><canvas id="ec-ch2"></canvas></div></div></div>`;
    box.querySelectorAll("[data-ec-orig]").forEach(b => b.addEventListener("click", () => { this.origem = b.dataset.ecOrig; this.telaGeral(box); }));
    box.querySelectorAll("[data-ec-per]").forEach(b => b.addEventListener("click", () => { this.per = b.dataset.ecPer; this.telaGeral(box); }));
    this.graficos(P);
  },
  graficos(P){
    if(typeof Charts === "undefined" || typeof Chart === "undefined") return;
    const porMes = this.dias(P.ini, P.fim) > 62;
    const chave = d => porMes ? d.slice(0, 7) : d;
    const mapa = new Map();
    this.dados.fechamentos.forEach(f => {
      if(f.data < P.ini || f.data > P.fim) return;
      const k = chave(f.data); if(!mapa.has(k)) mapa.set(k, { STA: { fat: 0, vol: 0 }, SIA: { fat: 0, vol: 0 } });
      const o = mapa.get(k)[f.origem]; if(!o) return; o.fat += Number(f.campos.fat) || 0; o.vol += Number(f.campos.volumes) || 0;
    });
    const ks = Array.from(mapa.keys()).sort(), rot = ks.map(k => porMes ? k.slice(5) + "/" + k.slice(2, 4) : this.br2(k));
    const cor = Charts.colors, mostra = o => this.origem === "geral" || this.origem === o;
    const ds = (campo) => [
      mostra("STA") && { type: "bar", label: "STA", data: ks.map(k => mapa.get(k).STA[campo]), backgroundColor: cor.blue, stack: "s", datalabels: { display: false } },
      mostra("SIA") && { type: "bar", label: "SIA", data: ks.map(k => mapa.get(k).SIA[campo]), backgroundColor: cor.orange, stack: "s", datalabels: { display: false } }
    ].filter(Boolean);
    const lin = this.origem === "geral" ? { type: "line", label: "Total", data: ks.map(k => mapa.get(k).STA.fat + mapa.get(k).SIA.fat), borderColor: cor.blueDark, backgroundColor: cor.blueDark, tension: .25, pointRadius: 3, datalabels: { display: ks.length <= 16, align: "top", formatter: v => fmtNum(v) } } : null;
    const dsVol = ds("vol");
    const c1 = this.el("ec-ch1"), c2 = this.el("ec-ch2");
    if(c1) Charts.make("ec-ch1", { type: "bar", data: { labels: rot, datasets: ds("fat").concat(lin ? [lin] : []) }, options: Charts.baseOptions({ scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, beginAtZero: true, ticks: { callback: v => "R$ " + fmtNum(v) } } }, plugins: { tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmtBRL(c.parsed.y)}` } } } }) });
    if(c2) Charts.make("ec-ch2", { type: "bar", data: { labels: rot, datasets: dsVol }, options: Charts.baseOptions({ scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, beginAtZero: true } } }) });
  },

  /* ------------------------------ ABA 2: Fechamento do dia ------------------------------ */
  /** campos numéricos de cada bloco: [chave, rótulo, decimais, moeda?] */
  CAMPOS: {
    STA: [["peso", "Peso manipulado", 2], ["volumes", "Volumes manipulados", 0], ["pedidos", "Quantidade de pedidos", 0], ["fat", "Faturamento (R$)", 2]],
    SIA: [["peso", "Peso manipulado", 2], ["volumes", "Volumes manipulados", 0], ["pedidos", "Quantidade de pedidos", 0], ["fat", "Faturamento (R$)", 2]],
    OP: [["pesoOp", "Peso manipulado", 2], ["liberados", "Pedidos liberados", 0], ["volOp", "Total de volumes", 0], ["faturados", "Pedidos faturados", 0], ["montados", "Pedidos montados", 0], ["bloqueados", "Pedidos bloqueados", 0],
      ["valorFat", "Valor faturado (R$)", 2], ["aExpedir", "A expedir (R$)", 2], ["vendaDia", "Venda do dia (R$)", 2], ["fatMes", "Faturado no mês até agora (R$)", 2], ["qtdMes", "Pedidos faturados no mês", 0]]
  },
  fxLer(){
    // lê o que está digitado no formulário para o estado
    const v = {}, g = id => { const e = this.el(id); return e ? e.value : ""; };
    ["STA", "SIA", "OP"].forEach(b => this.CAMPOS[b].forEach(([k]) => { const e = this.el(`fx-${b}-${k}`); if(e) v[`${b}.${k}`] = e.value; }));
    const h = this.el("fx-horas"); if(h) v.horas = h.value;
    (this.dados.transportadoras || []).forEach(t => { const a = this.el(`fx-t-p-${this.slug(t)}`), b = this.el(`fx-t-v-${this.slug(t)}`); if(a) v[`T.${t}.p`] = a.value; if(b) v[`T.${t}.v`] = b.value; });
    this.fx.vals = v; return v;
  },
  slug(s){ return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "_"); },
  /** carrega os campos salvos da data escolhida para dentro do formulário */
  fxCarregar(data){
    const v = {}, sta = this.fechDia(data, "STA") || {}, sia = this.fechDia(data, "SIA") || {};
    this.CAMPOS.STA.forEach(([k, , d]) => { v[`STA.${k}`] = this.campo(sta[k], d); });
    this.CAMPOS.SIA.forEach(([k, , d]) => { v[`SIA.${k}`] = this.campo(sia[k], d); });
    this.CAMPOS.OP.forEach(([k, , d]) => { v[`OP.${k}`] = this.campo(sta[k], d); });
    v.horas = sta.horas != null ? this.campo(sta.horas, 2) : "9";
    const tr = sta.transp || {};
    Object.keys(tr).forEach(n => { v[`T.${n}.p`] = this.campo(tr[n].pedidos, 0); v[`T.${n}.v`] = this.campo(tr[n].volumes, 0); });
    this.fx.vals = v; this.fx.carregadoPara = data;
  },
  telaFech(box){
    const D = this.dados, data = this.fx.data || this.hojeIso();
    if(this.fx.carregadoPara !== data) this.fxCarregar(data);
    const V = this.fx.vals, val = k => this.h(V[k] || "");
    const inp = (b, [k, rot, dec]) => `<label>${rot}<input type="text" inputmode="decimal" autocomplete="off" id="fx-${b}-${k}" value="${val(b + "." + k)}" data-fx></label>`;
    const sta = this.fechDia(data, "STA"), sia = this.fechDia(data, "SIA");
    const metaSta = D.fechamentos.find(f => f.data === data && f.origem === "STA"), metaSia = D.fechamentos.find(f => f.data === data && f.origem === "SIA");
    const quem = m => m ? `<span class="small-muted">último envio ${this.h((m.em || "").replace("T", " ").slice(0, 16))} · ${this.h(m.por)}</span>` : `<span class="small-muted">ainda não lançado</span>`;
    const trs = (D.transportadoras || []).map(t => { const s = this.slug(t);
      return `<tr><td><strong>${this.h(t)}</strong></td><td><input type="text" inputmode="numeric" id="fx-t-p-${s}" value="${val(`T.${t}.p`)}" data-fx style="width:90px"></td><td><input type="text" inputmode="numeric" id="fx-t-v-${s}" value="${val(`T.${t}.v`)}" data-fx style="width:90px"></td></tr>`; }).join("");
    box.innerHTML = `<div class="panel"><h3 class="adm-h">Fechamento do dia</h3>
        <div class="adm-form" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr));align-items:end">
          <label>Data do fechamento<input type="date" id="fx-data" value="${this.h(data)}" max="${this.h(this.hojeIso())}"></label>
          <label>Horas trabalhadas<input type="text" inputmode="decimal" id="fx-horas" value="${val("horas")}" data-fx></label></div>
        <p class="small-muted" style="margin:8px 0 0">STA: ${quem(metaSta)} &nbsp;·&nbsp; SIA: ${quem(metaSia)}. Se a data já tem fechamento, os campos abrem preenchidos para corrigir.</p></div>
      <div class="ec-grid2">
        <div class="panel ec-bloco ec-sta"><div class="ec-bt">E-commerce Santa Therezinha (STA)</div><div class="adm-form ec-f">${this.CAMPOS.STA.map(c => inp("STA", c)).join("")}</div></div>
        <div class="panel ec-bloco ec-sia"><div class="ec-bt">Tele venda SIA · rodoviário/aéreo</div><div class="adm-form ec-f">${this.CAMPOS.SIA.map(c => inp("SIA", c)).join("")}</div>
          <div class="adm-actions" style="margin-top:8px"><button type="button" class="btn btn-outline btn-sm" id="fx-expsia">Preencher pela Expedição SIA do dia</button></div><div id="fx-expmsg"></div></div>
      </div>
      <div class="panel ec-bloco ec-total"><div class="ec-bt">Total do Ecommerce <span class="small-muted">· calculado</span></div><div class="cards-grid" id="fx-calc" style="margin-bottom:0"></div></div>
      <div class="panel"><h3 class="adm-h">Operação E-commerce <span class="small-muted">· STA</span></h3><div class="adm-form ec-f">${this.CAMPOS.OP.map(c => inp("OP", c)).join("")}</div></div>
      <div class="panel"><h3 class="adm-h">Transportadoras <span class="small-muted">· STA</span></h3>
        <div class="table-wrap"><table class="adm-table"><thead><tr><th>Transportadora</th><th>Pedidos</th><th>Volumes</th></tr></thead><tbody>${trs}</tbody></table></div>
        <div class="adm-actions"><button type="button" class="btn btn-outline btn-sm" id="fx-novat">+ Nova transportadora</button></div></div>
      <div class="panel"><h3 class="adm-h">Lead time a expedir <span class="small-muted">· pedidos pendentes do STA em ${this.br(data)} (automático)</span></h3><div id="fx-lead"></div></div>
      <div id="fx-msg"></div>
      <div class="adm-actions"><button type="button" class="btn btn-primary" id="fx-salvar">Salvar fechamento</button><button type="button" class="btn btn-outline" id="fx-zap">Copiar para WhatsApp</button></div>`;
    this.el("fx-data").addEventListener("change", e => { const d = e.target.value; if(!d) return; this.fx.data = d; this.fx.carregadoPara = null; this.telaFech(box); });
    box.querySelectorAll("[data-fx]").forEach(i => i.addEventListener("input", () => { this.fxLer(); this.fxCalc(); }));
    this.el("fx-novat").addEventListener("click", () => this.novaTransp(() => { this.fxLer(); this.telaFech(box); }));
    this.el("fx-expsia").addEventListener("click", () => this.fxPreencherSia());
    this.el("fx-salvar").addEventListener("click", () => this.fxSalvar());
    this.el("fx-zap").addEventListener("click", () => this.fxZap());
    this.fxCalc();
  },
  fxCalc(){
    const V = this.fxLer(), n = k => this.num(V[k]) || 0, data = this.fx.data || this.hojeIso();
    const fat = n("STA.fat") + n("SIA.fat"), vol = n("STA.volumes") + n("SIA.volumes"), peso = n("STA.peso") + n("SIA.peso"), ped = n("STA.pedidos") + n("SIA.pedidos"), h = this.num(V.horas) || 0;
    const calc = this.el("fx-calc");
    if(calc) calc.innerHTML = `<div class="card"><div class="card-label">Faturamento geral</div><div class="card-value">${this.brl(fat)}</div><div class="card-sub">STA ${this.brl(n("STA.fat"))} + SIA ${this.brl(n("SIA.fat"))}</div></div>
      <div class="card"><div class="card-label">Volumes manipulados</div><div class="card-value">${this.n(vol)}</div><div class="card-sub">peso ${this.n(peso, 2)} · ${this.n(ped)} pedidos</div></div>
      <div class="card"><div class="card-label">Volumes por hora</div><div class="card-value">${h ? this.n(vol / h, 1) : "—"}</div><div class="card-sub">${h ? this.n(h, 1) + " h trabalhadas" : "informe as horas"}</div></div>`;
    const lt = this.leadTime(data), lead = this.el("fx-lead");
    if(lead) lead.innerHTML = `<div class="table-wrap"><table class="adm-table"><thead><tr>${lt.cont.map((_, i) => `<th>${i === 16 ? "16+" : i} d</th>`).join("")}</tr></thead><tbody><tr>${lt.cont.map(c => `<td>${c || "·"}</td>`).join("")}</tr></tbody></table></div>`;
  },
  fxPreencherSia(){
    const data = this.fx.data || this.hojeIso(), L = this.dados.expedicao.filter(e => e.data === data), m = this.el("fx-expmsg");
    if(!L.length){ if(m) m.innerHTML = `<div class="warn-box" style="margin-top:8px">Não há notas lançadas na Expedição SIA em ${this.br(data)}.</div>`; return; }
    const set = (k, v) => { const e = this.el(`fx-SIA-${k}`); if(e) e.value = this.campo(v, k === "peso" || k === "fat" ? 2 : 0); };
    set("volumes", L.reduce((s, e) => s + e.volumes, 0)); set("peso", L.reduce((s, e) => s + (e.peso || 0), 0)); set("fat", L.reduce((s, e) => s + e.valor, 0));
    set("pedidos", new Set(L.map(e => e.carreg || e.nota)).size);
    this.fxLer(); this.fxCalc();
    if(m) m.innerHTML = `<div class="hint-box" style="margin-top:8px">Preenchido com ${L.length} nota(s) da Expedição SIA. Pedidos = carregamentos distintos; confira e ajuste se precisar.</div>`;
  },
  fxPayload(){
    const V = this.fxLer(), n = k => this.num(V[k]);
    const algum = b => this.CAMPOS[b].some(([k]) => V[`${b}.${k}`] !== undefined && String(V[`${b}.${k}`]).trim() !== "");
    const sta = {}, sia = {};
    this.CAMPOS.STA.forEach(([k]) => { const x = n(`STA.${k}`); if(x !== null) sta[k] = x; });
    this.CAMPOS.OP.forEach(([k]) => { const x = n(`OP.${k}`); if(x !== null) sta[k] = x; });
    const h = this.num(V.horas); if(h !== null) sta.horas = h;
    const tr = {};
    (this.dados.transportadoras || []).forEach(t => { const p = this.num(V[`T.${t}.p`]), v = this.num(V[`T.${t}.v`]); if(p !== null || v !== null) tr[t] = { pedidos: p, volumes: v }; });
    if(Object.keys(tr).length) sta.transp = tr;
    this.CAMPOS.SIA.forEach(([k]) => { const x = n(`SIA.${k}`); if(x !== null) sia[k] = x; });
    return { sta: (algum("STA") || algum("OP") || Object.keys(tr).length) ? sta : null, sia: algum("SIA") ? sia : null };
  },
  async fxSalvar(){
    const data = this.fx.data || this.hojeIso(), P = this.fxPayload(), btn = this.el("fx-salvar");
    if(!P.sta && !P.sia) return LancUI.aviso("fx-msg", "erro", "Preencha ao menos um campo do STA ou do SIA.");
    if(P.sta && P.sta.horas === undefined) P.sta.horas = 9;
    btn.disabled = true; btn.textContent = "Salvando…"; LancUI.aviso("fx-msg", "", "");
    const erros = [];
    for(const [orig, campos] of [["STA", P.sta], ["SIA", P.sia]]){
      if(!campos) continue;
      const r = await this.chamar({ acao: "ecom_fech_salvar", data, origem: orig, campos });
      if(!r || !r.ok){ erros.push(`${orig}: ${(r && r.erro) || "falha ao salvar"}`); continue; }
      const i = this.dados.fechamentos.findIndex(f => f.data === data && f.origem === orig), reg = { data, origem: orig, campos, em: r.em, por: r.por };
      if(i >= 0) this.dados.fechamentos[i] = reg; else this.dados.fechamentos.push(reg);
    }
    btn.disabled = false; btn.textContent = "Salvar fechamento";
    if(erros.length) LancUI.aviso("fx-msg", "erro", erros.map(e => this.h(e)).join("<br>"));
    else { toast("Fechamento de " + this.br(data) + " salvo.", "success"); this.fx.carregadoPara = null; this.telaFech(this.el("ec-corpo")); }
  },
  /** texto no mesmo formato que o encarregado já enviava no WhatsApp */
  fxZap(){
    const data = this.fx.data || this.hojeIso(), P = this.fxPayload(), s = P.sta || {}, a = P.sia || {};
    const R = v => v == null ? "" : fmtNum(v, 2), I = v => v == null ? "" : fmtNum(v, 0), M = v => v == null ? "" : "R$ " + R(v);
    const fat = (s.fat || 0) + (a.fat || 0), vol = (s.volumes || 0) + (a.volumes || 0), h = s.horas || 0, lt = this.leadTime(data);
    const L = [];
    L.push("E-commerce Santa Therezinha", `Peso manipulado: ${R(s.peso)}`, `Volumes manipulados ${I(s.volumes)}`, `Quantidade de pedidos ${I(s.pedidos)}`, `Faturamento ${M(s.fat)}`, "");
    L.push("Tele venda SIA rodoviário/aéreo", `Peso manipulado: ${R(a.peso)}`, `Volumes manipulados ${I(a.volumes)}`, `Quantidade de pedidos ${I(a.pedidos)}`, `Faturamento ${M(a.fat)}`,
      `Faturamento geral: ${M(fat)}`, `Total de volumes manipulados ${I(vol)}`, `Volumes manipulados por hora ${h ? fmtNum(vol / h, 0) : ""}`, "", "");
    L.push("Operação E-commerce", `Peso manipulado: ${R(s.pesoOp)}`, `Pedidos liberados: ${I(s.liberados)}`, `Total de volumes: ${I(s.volOp)}`, `Total de pedidos faturados: ${I(s.faturados)}`, `Total de pedidos montados: ${I(s.montados)}`,
      `Total de pedidos bloqueados: ${I(s.bloqueados)}`, `Valor faturado: ${M(s.valorFat)}`, `A expedir: ${M(s.aExpedir)}`, `Venda do dia: ${M(s.vendaDia)}`, `Valor já faturado até o momento mês: ${M(s.fatMes)}`, `Quantidade total de pedidos já faturado mês: ${I(s.qtdMes)}`);
    (this.dados.transportadoras || []).forEach(t => { const x = (s.transp || {})[t] || {}; L.push(`Transportadora ${t}`, `Pedidos: ${x.pedidos == null ? "" : I(x.pedidos)}`, `Volumes: ${x.volumes == null ? "" : I(x.volumes)}`, ""); });
    L.push("Lead time a expedir");
    lt.cont.forEach((c, i) => { if(i <= 15) L.push(`${i} dia ${c ? c + " pedidos" : ""}`.trim()); });
    if(lt.cont[16]) L.push(`16 dias ou mais ${lt.cont[16]} pedidos`);
    const txt = L.join("\n");
    const ok = () => toast("Texto copiado. É só colar no WhatsApp.", "success");
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, () => this.zapManual(txt));
    else this.zapManual(txt);
  },
  zapManual(txt){
    UI.openModal(`<h3 class="adm-h2">Texto do fechamento</h3><p class="small-muted">Selecione tudo, copie e cole no WhatsApp.</p><textarea id="ec-zap" rows="18" style="width:100%;font-family:monospace;font-size:13px">${this.h(txt)}</textarea>`);
    const t = this.el("ec-zap"); if(t){ t.focus(); t.select(); }
  },
  novaTransp(depois){
    const nome = prompt("Nome da nova transportadora:"); if(!nome || !nome.trim()) return;
    this.chamar({ acao: "ecom_transp_add", nome: nome.trim() }).then(r => {
      if(!r || !r.ok) return toast((r && r.erro) || "Não foi possível criar a transportadora.", "error");
      this.dados.transportadoras = r.transportadoras; toast("Transportadora " + r.nome + " disponível.", "success"); if(depois) depois(r.nome);
    });
  },

  /* ------------------------------ ABA 3: Pedidos pendentes (STA) ------------------------------ */
  optTransp(sel, vazio){ return (vazio ? `<option value="">${this.h(vazio)}</option>` : "") + (this.dados.transportadoras || []).map(t => `<option value="${this.h(t)}" ${t === sel ? "selected" : ""}>${this.h(t)}</option>`).join(""); },
  corIdade(d){ return d >= 4 ? "err" : d >= 2 ? "rep" : "acc"; },
  telaPed(box){
    const hj = this.hojeIso(), F = this.pd, todos = this.dados.pedidos;
    const abertos = todos.filter(p => !p.nota), lt = this.leadTime(hj);
    let lista = F.filtro === "pend" ? abertos : F.filtro === "nota" ? todos.filter(p => p.nota && p.dataNota >= this.soma(hj, -30)) : todos;
    const b = this.norm(F.busca);
    if(b) lista = lista.filter(p => this.norm([p.pedido, p.cliente, p.nota, p.transp].join(" ")).includes(b));
    lista = lista.slice().sort((x, y) => F.filtro === "nota" ? (y.dataNota > x.dataNota ? 1 : -1) : (x.entrada > y.entrada ? 1 : x.entrada < y.entrada ? -1 : String(x.pedido).localeCompare(String(y.pedido), "pt-BR", { numeric: true })));
    const soma = abertos.reduce((s, p) => s + (Number(p.valor) || 0), 0);
    box.innerHTML = `<div class="panel"><h3 class="adm-h">Lançar pedido <span class="small-muted">· pendente até receber o número da nota</span></h3>
        <div class="adm-form" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));align-items:end">
          <label>Nº do pedido<input type="text" id="pd-num" autocomplete="off" inputmode="numeric"></label>
          <label>Data de entrada<input type="date" id="pd-data" value="${hj}" max="${hj}"></label>
          <label>Cliente <span class="small-muted">(opcional)</span><input type="text" id="pd-cli" autocomplete="off"></label>
          <label>Valor (R$)<input type="text" id="pd-val" inputmode="decimal" autocomplete="off"></label>
          <label>Volumes<input type="text" id="pd-vol" inputmode="numeric" autocomplete="off"></label>
          <label>Transportadora<select id="pd-tr">${this.optTransp("", "—")}</select></label>
          <label style="justify-content:flex-end"><span class="adm-chk" style="margin-top:20px"><input type="checkbox" id="pd-bloq"> Bloqueado</span></label></div>
        <div id="pd-msg"></div>
        <div class="adm-actions"><button type="button" class="btn btn-primary" id="pd-add">Adicionar pedido</button><button type="button" class="btn btn-outline" id="pd-colar-t">Colar vários pedidos</button><button type="button" class="btn btn-outline btn-sm" id="pd-novat">+ Transportadora</button></div>
        <div id="pd-colar" style="display:none;margin-top:10px"><p class="small-muted" style="margin:0 0 6px">Uma linha por pedido, colunas separadas por TAB (cole do Excel) ou ponto e vírgula: <strong>Pedido ; Data (dd/mm/aaaa, opcional) ; Valor ; Volumes ; Transportadora ; Cliente</strong>. Sem data, vale a data de entrada acima.</p>
          <textarea id="pd-area" rows="6" style="width:100%" placeholder="123456;24/11/2026;1.250,00;3;QUICK"></textarea>
          <div class="adm-actions"><button type="button" class="btn btn-primary btn-sm" id="pd-lote">Lançar pedidos colados</button></div><div id="pd-lmsg"></div></div></div>
      <div class="panel"><h3 class="adm-h">Lead time a expedir <span class="small-muted">· ${this.n(abertos.length)} pendentes · ${this.brl(soma)}</span></h3>
        <div class="table-wrap"><table class="adm-table"><thead><tr><th></th>${lt.cont.map((_, i) => `<th>${i === 16 ? "16+" : i} d</th>`).join("")}</tr></thead><tbody>
          <tr><td><strong>Pedidos</strong></td>${lt.cont.map((c, i) => `<td>${c ? `<span class="adm-tag ${this.corIdade(i)}">${c}</span>` : `<span class="small-muted">·</span>`}</td>`).join("")}</tr>
          <tr><td><strong>Valor</strong></td>${lt.val.map(v => `<td class="small-muted" style="font-size:11px">${v ? this.n(v) : ""}</td>`).join("")}</tr></tbody></table></div>
        <p class="small-muted" style="margin:8px 0 0">Os dias aumentam sozinhos a cada dia. Verde 0–1 dia · amarelo 2–3 dias · vermelho 4 dias ou mais.</p></div>
      <div class="panel"><div class="toolbar" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between;margin:0 0 10px">
          <div class="ec-seg">${[["pend", "Pendentes"], ["nota", "Com nota (30 dias)"], ["todos", "Todos"]].map(([v, r]) => `<button type="button" class="ec-segb ${F.filtro === v ? "on" : ""}" data-pd-f="${v}">${r}</button>`).join("")}</div>
          <input type="search" id="pd-busca" placeholder="Buscar pedido, cliente ou nota" value="${this.h(F.busca)}" style="min-width:230px"></div>
        <div class="table-wrap"><table class="adm-table"><thead><tr><th>Pedido</th><th>Entrada</th><th>Dias</th><th>Cliente</th><th>Valor</th><th>Vol.</th><th>Transportadora</th><th>Bloq.</th><th>Nº da nota</th><th></th></tr></thead><tbody>
        ${lista.slice(0, 400).map(p => { const d = p.nota ? this.dias(p.entrada, p.dataNota) : this.idade(p, hj);
          return `<tr><td><strong>${this.h(p.pedido)}</strong></td><td>${this.br(p.entrada)}</td><td><span class="adm-tag ${p.nota ? "off" : this.corIdade(d)}" title="${p.nota ? "dias até a nota" : "dias em aberto"}">${d} d</span></td><td>${this.h(p.cliente) || "—"}</td><td>${p.valor == null ? "—" : this.brl(p.valor)}</td><td>${p.volumes == null ? "—" : this.n(p.volumes)}</td><td>${this.h(p.transp) || "—"}</td>
            <td><input type="checkbox" data-pd-bloq="${p.id}" ${p.bloq ? "checked" : ""} title="Marcar como bloqueado"></td>
            <td>${p.nota ? `<span class="adm-tag acc">${this.h(p.nota)}</span> <span class="small-muted">${this.br2(p.dataNota)}</span>` : `<span style="display:inline-flex;gap:4px"><input type="text" data-pd-nota="${p.id}" placeholder="nota" autocomplete="off" style="width:96px"><button type="button" class="btn btn-primary btn-sm" data-pd-baixa="${p.id}">Dar baixa</button></span>`}</td>
            <td style="white-space:nowrap"><button type="button" class="btn btn-outline btn-sm" data-pd-ed="${p.id}">Editar</button> <button type="button" class="btn btn-outline btn-sm" data-pd-ex="${p.id}">Excluir</button></td></tr>`; }).join("") || `<tr><td colspan="10" class="small-muted">Nenhum pedido neste filtro.</td></tr>`}</tbody></table></div>
        ${lista.length > 400 ? `<p class="small-muted">Mostrando 400 de ${lista.length}. Use a busca para achar os demais.</p>` : ""}</div>`;
    const $ = id => this.el(id), add = () => this.pdAdd();
    $("pd-add").addEventListener("click", add);
    ["pd-num", "pd-val", "pd-vol", "pd-cli"].forEach(id => $(id).addEventListener("keydown", e => { if(e.key === "Enter"){ e.preventDefault(); add(); } }));
    $("pd-colar-t").addEventListener("click", () => { const c = $("pd-colar"); c.style.display = c.style.display === "none" ? "block" : "none"; });
    $("pd-lote").addEventListener("click", () => this.pdLote());
    $("pd-novat").addEventListener("click", () => this.novaTransp(() => this.telaPed(box)));
    box.querySelectorAll("[data-pd-f]").forEach(x => x.addEventListener("click", () => { F.filtro = x.dataset.pdF; this.telaPed(box); }));
    let tm = null; $("pd-busca").addEventListener("input", e => { F.busca = e.target.value; clearTimeout(tm); tm = setTimeout(() => { this.telaPed(box); const i = this.el("pd-busca"); if(i){ i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }, 250); });
    box.querySelectorAll("[data-pd-baixa]").forEach(x => x.addEventListener("click", () => this.pdBaixa(x.dataset.pdBaixa)));
    box.querySelectorAll("[data-pd-nota]").forEach(x => x.addEventListener("keydown", e => { if(e.key === "Enter"){ e.preventDefault(); this.pdBaixa(x.dataset.pdNota); } }));
    box.querySelectorAll("[data-pd-bloq]").forEach(x => x.addEventListener("change", () => this.pdSalvar(x.dataset.pdBloq, { bloq: x.checked })));
    box.querySelectorAll("[data-pd-ed]").forEach(x => x.addEventListener("click", () => this.pdEditar(x.dataset.pdEd)));
    box.querySelectorAll("[data-pd-ex]").forEach(x => x.addEventListener("click", () => this.pdExcluir(x.dataset.pdEx)));
    $("pd-num").focus();
  },
  norm(s){ return typeof normStr === "function" ? normStr(s) : String(s || "").toLowerCase(); },
  pedBase(p){ return { id: p.id, pedido: p.pedido, entrada: p.entrada, cliente: p.cliente, valor: p.valor, volumes: p.volumes, transp: p.transp, bloq: p.bloq, nota: p.nota }; },
  /** grava um pedido (mudando só os campos informados) e atualiza a lista local */
  async pdSalvar(id, mudar){
    const p = this.dados.pedidos.find(x => x.id === id); if(!p) return null;
    const r = await this.chamar(Object.assign({ acao: "ecom_ped_salvar" }, this.pedBase(p), mudar));
    if(!r || !r.ok){ toast((r && r.erro) || "Não foi possível salvar o pedido.", "error"); this.telaPed(this.el("ec-corpo")); return null; }
    Object.assign(p, r.pedido); if(r.transportadoras) this.dados.transportadoras = r.transportadoras;
    return r;
  },
  async pdBaixa(id){
    const inp = document.querySelector(`[data-pd-nota="${id}"]`), nota = inp ? inp.value.trim() : "";
    if(!nota){ if(inp) inp.focus(); return toast("Digite o número da nota para dar baixa no pedido.", "error"); }
    const r = await this.pdSalvar(id, { nota });
    if(r){ toast("Pedido " + r.pedido.pedido + " saiu dos pendentes (nota " + nota + ").", "success"); this.telaPed(this.el("ec-corpo")); }
  },
  async pdAdd(){
    const $ = id => this.el(id), msg = (t, h) => LancUI.aviso("pd-msg", t, h);
    const item = { pedido: $("pd-num").value.trim(), entrada: $("pd-data").value, cliente: $("pd-cli").value.trim(), valor: this.num($("pd-val").value), volumes: this.num($("pd-vol").value), transp: $("pd-tr").value, bloq: $("pd-bloq").checked };
    if(!item.pedido) return msg("erro", "Informe o número do pedido.");
    if(!item.entrada) return msg("erro", "Informe a data de entrada.");
    msg("", ""); const btn = $("pd-add"); btn.disabled = true;
    const r = await this.chamar(Object.assign({ acao: "ecom_ped_salvar" }, item));
    btn.disabled = false;
    if(!r || !r.ok) return msg("erro", this.h((r && r.erro) || "Não foi possível salvar."));
    this.dados.pedidos.push(r.pedido); if(r.transportadoras) this.dados.transportadoras = r.transportadoras;
    toast("Pedido " + item.pedido + " lançado.", "success");
    const dt = item.entrada, tr = item.transp; this.telaPed(this.el("ec-corpo")); this.el("pd-data").value = dt; this.el("pd-tr").value = tr;
  },
  pdLinhas(txt, dataPadrao){
    const out = [], erros = [];
    String(txt || "").split(/\r?\n/).forEach((ln, i) => {
      if(!ln.trim()) return;
      const c = ln.split(/\t|;/).map(x => x.trim());
      const dt = this.dataBR(c[1]) || dataPadrao;
      if(!c[0]) return erros.push(`Linha ${i + 1}: sem número do pedido.`);
      out.push({ pedido: c[0], entrada: dt, valor: this.num(c[2]), volumes: this.num(c[3]), transp: c[4] || "", cliente: c[5] || "" });
    });
    return { out, erros };
  },
  dataBR(t){
    const s = String(t || "").trim(); let m;
    if((m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/))){ const y = m[3].length === 2 ? "20" + m[3] : m[3]; return `${y}-${this.pad(m[2])}-${this.pad(m[1])}`; }
    if(/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    return "";
  },
  async pdLote(){
    const dataPadrao = this.el("pd-data").value || this.hojeIso(), { out, erros } = this.pdLinhas(this.el("pd-area").value, dataPadrao), box = "pd-lmsg";
    if(!out.length) return LancUI.aviso(box, "erro", erros.length ? erros.map(e => this.h(e)).join("<br>") : "Cole ao menos uma linha.");
    const r = await this.chamar({ acao: "ecom_ped_lote", itens: out });
    if(!r || !r.ok) return LancUI.aviso(box, "erro", this.h((r && r.erro) || "Não foi possível lançar."));
    const rel = [`${r.gravados} pedido(s) lançado(s).`]; if(r.repetidos.length) rel.push(`${r.repetidos.length} já existiam (ignorados): ${this.h(r.repetidos.slice(0, 8).join(", "))}${r.repetidos.length > 8 ? "…" : ""}`);
    erros.concat(r.erros).forEach(e => rel.push(this.h(e)));
    this.dados.transportadoras = r.transportadoras || this.dados.transportadoras;
    await this.recarregarSilencioso();
    this.telaPed(this.el("ec-corpo")); LancUI.aviso("pd-lmsg", (r.erros.length || erros.length) ? "aviso" : "ok", rel.join("<br>"));
  },
  async recarregarSilencioso(){ const r = await this.chamar({ acao: "ecom_ler" }); if(r && r.ok){ this.dados = r; this.hoje = r.hoje; } },
  pdEditar(id){
    const p = this.dados.pedidos.find(x => x.id === id); if(!p) return;
    UI.openModal(`<h3 class="adm-h2">Editar pedido ${this.h(p.pedido)}</h3><div class="adm-form" style="grid-template-columns:1fr 1fr">
      <label>Nº do pedido<input type="text" id="ed-num" value="${this.h(p.pedido)}"></label><label>Data de entrada<input type="date" id="ed-data" value="${this.h(p.entrada)}" max="${this.hojeIso()}"></label>
      <label>Cliente<input type="text" id="ed-cli" value="${this.h(p.cliente)}"></label><label>Valor (R$)<input type="text" id="ed-val" value="${this.campo(p.valor)}"></label>
      <label>Volumes<input type="text" id="ed-vol" value="${this.campo(p.volumes, 0)}"></label><label>Transportadora<select id="ed-tr">${this.optTransp(p.transp, "—")}</select></label>
      <label>Nº da nota <span class="small-muted">(apague para voltar a pendente)</span><input type="text" id="ed-nota" value="${this.h(p.nota)}"></label>
      <label style="justify-content:flex-end"><span class="adm-chk" style="margin-top:20px"><input type="checkbox" id="ed-bloq" ${p.bloq ? "checked" : ""}> Bloqueado</span></label></div>
      <div id="ed-msg"></div><div class="adm-actions"><button type="button" class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button><button type="button" class="btn btn-primary" id="ed-ok">Salvar</button></div>`);
    this.el("ed-ok").addEventListener("click", async () => {
      const $ = i => this.el(i);
      const r = await this.pdSalvar(id, { pedido: $("ed-num").value.trim(), entrada: $("ed-data").value, cliente: $("ed-cli").value.trim(), valor: this.num($("ed-val").value), volumes: this.num($("ed-vol").value), transp: $("ed-tr").value, nota: $("ed-nota").value.trim(), bloq: $("ed-bloq").checked });
      if(r){ UI.closeModal(); toast("Pedido atualizado.", "success"); this.telaPed(this.el("ec-corpo")); }
    });
  },
  async pdExcluir(id){
    const p = this.dados.pedidos.find(x => x.id === id); if(!p) return;
    if(!confirm(`Excluir o pedido ${p.pedido}? Esta ação fica registrada no histórico de alterações.`)) return;
    const r = await this.chamar({ acao: "ecom_ped_excluir", id });
    if(!r || !r.ok) return toast((r && r.erro) || "Não foi possível excluir.", "error");
    this.dados.pedidos = this.dados.pedidos.filter(x => x.id !== id); toast("Pedido excluído.", "success"); this.telaPed(this.el("ec-corpo"));
  },

  /* ------------------------------ ABA 4: Expedição SIA ------------------------------ */
  telaExp(box){
    const hj = this.hojeIso(), X = this.ex, D = this.dados;
    if(!X.ult.data) X.ult.data = hj;
    let lista = D.expedicao.filter(e => e.data >= X.ini && e.data <= X.fim && (!X.transp || e.transp === X.transp));
    const b = this.norm(X.busca); if(b) lista = lista.filter(e => this.norm([e.nota, e.rca, e.carreg, e.uf, e.transp].join(" ")).includes(b));
    lista = lista.slice().sort((x, y) => x.data < y.data ? 1 : x.data > y.data ? -1 : String(y.nota).localeCompare(String(x.nota), "pt-BR", { numeric: true }));
    const T = lista.reduce((t, e) => ({ vol: t.vol + e.volumes, peso: t.peso + (e.peso || 0), valor: t.valor + e.valor }), { vol: 0, peso: 0, valor: 0 });
    const porT = new Map(); lista.forEach(e => { const o = porT.get(e.transp) || { n: 0, vol: 0, peso: 0, valor: 0 }; o.n++; o.vol += e.volumes; o.peso += e.peso || 0; o.valor += e.valor; porT.set(e.transp, o); });
    box.innerHTML = `<div class="panel"><h3 class="adm-h">Lançar nota expedida <span class="small-muted">· SIA</span></h3>
        <div class="adm-form" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr));align-items:end">
          <label>Data<input type="date" id="ex-data" value="${this.h(X.ult.data)}" max="${hj}"></label>
          <label>Volumes<input type="text" id="ex-vol" inputmode="numeric" autocomplete="off"></label>
          <label>Transportadora<select id="ex-tr">${this.optTransp(X.ult.transp, "Selecione")}</select></label>
          <label>RCA<input type="text" id="ex-rca" inputmode="numeric" autocomplete="off"></label>
          <label>Carregamento<input type="text" id="ex-car" inputmode="numeric" autocomplete="off"></label>
          <label>Nota<input type="text" id="ex-nota" inputmode="numeric" autocomplete="off"></label>
          <label>Valor (R$)<input type="text" id="ex-val" inputmode="decimal" autocomplete="off"></label>
          <label>Peso<input type="text" id="ex-peso" inputmode="decimal" autocomplete="off"></label>
          <label>UF <span class="small-muted">(opc.)</span><input type="text" id="ex-uf" maxlength="2" autocomplete="off" style="text-transform:uppercase"></label></div>
        <div id="ex-msg"></div>
        <div class="adm-actions"><button type="button" class="btn btn-primary" id="ex-add">Adicionar nota</button><button type="button" class="btn btn-outline btn-sm" id="ex-novat">+ Transportadora</button><button type="button" class="btn btn-outline" id="ex-colar-t">Colar várias notas</button><button type="button" class="btn btn-outline" id="ex-imp-t">Importar planilha CONTROLE_SIA</button></div>
        <div id="ex-colar" style="display:none;margin-top:10px"><p class="small-muted" style="margin:0 0 6px">Cole do Excel na mesma ordem das colunas da planilha: <strong>VOLUMES · TRANSPORTADORA · RCA · CARREGAMENTO · NOTA · VALOR · PESO · DATA · UF</strong>.</p>
          <textarea id="ex-area" rows="6" style="width:100%"></textarea><div class="adm-actions"><button type="button" class="btn btn-primary btn-sm" id="ex-lote">Lançar notas coladas</button></div><div id="ex-lmsg"></div></div>
        <div id="ex-imp" style="display:none;margin-top:10px"><p class="small-muted" style="margin:0 0 6px">Escolha o arquivo CONTROLE_SIA.xlsx (aba Sheet1). Notas que já existem no sistema são ignoradas, então dá para importar de novo sem duplicar.</p>
          <input type="file" id="ex-file" accept=".xlsx,.xls"><div id="ex-imsg" style="margin-top:8px"></div></div></div>
      <div class="panel"><div class="adm-form" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));align-items:end">
          <label>De<input type="date" id="exf-ini" value="${this.h(X.ini)}"></label><label>Até<input type="date" id="exf-fim" value="${this.h(X.fim)}"></label>
          <label>Transportadora<select id="exf-tr">${this.optTransp(X.transp, "Todas")}</select></label><label>Buscar<input type="search" id="exf-busca" placeholder="nota, RCA, carregamento, UF" value="${this.h(X.busca)}"></label></div>
        <div class="cards-grid" style="margin:12px 0 0"><div class="card"><div class="card-label">Notas</div><div class="card-value">${this.n(lista.length)}</div></div><div class="card"><div class="card-label">Volumes</div><div class="card-value">${this.n(T.vol)}</div></div>
          <div class="card"><div class="card-label">Peso</div><div class="card-value">${this.n(T.peso, 2)}</div></div><div class="card"><div class="card-label">Valor expedido</div><div class="card-value">${this.brl(T.valor)}</div></div></div></div>
      <div class="panel"><h3 class="adm-h">Por transportadora</h3><div class="table-wrap"><table class="adm-table"><thead><tr><th>Transportadora</th><th>Notas</th><th>Volumes</th><th>Peso</th><th>Valor</th></tr></thead><tbody>
        ${Array.from(porT.entries()).sort((a, c) => c[1].valor - a[1].valor).map(([t, o]) => `<tr><td><strong>${this.h(t)}</strong></td><td>${this.n(o.n)}</td><td>${this.n(o.vol)}</td><td>${this.n(o.peso, 2)}</td><td>${this.brl(o.valor)}</td></tr>`).join("") || `<tr><td colspan="5" class="small-muted">Sem notas no período.</td></tr>`}</tbody></table></div></div>
      <div class="panel"><h3 class="adm-h">Notas lançadas (${this.n(lista.length)})</h3><div class="table-wrap"><table class="adm-table"><thead><tr><th>Data</th><th>Transportadora</th><th>Nota</th><th>Carregamento</th><th>RCA</th><th>Vol.</th><th>Peso</th><th>Valor</th><th>UF</th><th></th></tr></thead><tbody>
        ${lista.slice(0, X.ver).map(e => `<tr><td>${this.br(e.data)}</td><td>${this.h(e.transp)}</td><td><strong>${this.h(e.nota)}</strong></td><td>${this.h(e.carreg) || "—"}</td><td>${this.h(e.rca) || "—"}</td><td>${this.n(e.volumes)}</td><td>${e.peso == null ? '<span class="adm-tag rep">sem peso</span>' : this.n(e.peso, 2)}</td><td>${this.brl(e.valor)}</td><td>${this.h(e.uf) || "—"}</td>
          <td style="white-space:nowrap"><button type="button" class="btn btn-outline btn-sm" data-ex-ed="${e.id}">Editar</button> <button type="button" class="btn btn-outline btn-sm" data-ex-ex="${e.id}">Excluir</button></td></tr>`).join("") || `<tr><td colspan="10" class="small-muted">Nenhuma nota no período e filtros escolhidos.</td></tr>`}</tbody></table></div>
        ${lista.length > X.ver ? `<button type="button" class="btn btn-outline btn-sm" id="ex-mais" style="margin-top:10px">Ver todas as ${this.n(lista.length)} notas</button>` : ""}</div>`;
    const $ = id => this.el(id), add = () => this.exAdd();
    $("ex-add").addEventListener("click", add);
    ["ex-vol", "ex-rca", "ex-car", "ex-nota", "ex-val", "ex-peso", "ex-uf"].forEach(id => $(id).addEventListener("keydown", e => { if(e.key === "Enter"){ e.preventDefault(); add(); } }));
    $("ex-novat").addEventListener("click", () => this.novaTransp(() => this.telaExp(box)));
    $("ex-colar-t").addEventListener("click", () => { const c = $("ex-colar"); c.style.display = c.style.display === "none" ? "block" : "none"; });
    $("ex-imp-t").addEventListener("click", () => { const c = $("ex-imp"); c.style.display = c.style.display === "none" ? "block" : "none"; });
    $("ex-lote").addEventListener("click", () => this.exLote());
    $("ex-file").addEventListener("change", e => this.exImportar(e.target.files[0]));
    const refiltra = () => { X.ini = $("exf-ini").value || X.ini; X.fim = $("exf-fim").value || X.fim; X.transp = $("exf-tr").value; this.telaExp(box); };
    ["exf-ini", "exf-fim", "exf-tr"].forEach(id => $(id).addEventListener("change", refiltra));
    let tm = null; $("exf-busca").addEventListener("input", e => { X.busca = e.target.value; clearTimeout(tm); tm = setTimeout(() => { this.telaExp(box); const i = this.el("exf-busca"); if(i){ i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }, 250); });
    const mais = $("ex-mais"); if(mais) mais.addEventListener("click", () => { X.ver = 99999; this.telaExp(box); });
    box.querySelectorAll("[data-ex-ed]").forEach(x => x.addEventListener("click", () => this.exEditar(x.dataset.exEd)));
    box.querySelectorAll("[data-ex-ex]").forEach(x => x.addEventListener("click", () => this.exExcluir(x.dataset.exEx)));
    if(!$("ex-vol").value) $("ex-vol").focus();
  },
  async exAdd(){
    const $ = id => this.el(id), msg = (t, h) => LancUI.aviso("ex-msg", t, h);
    const item = { data: $("ex-data").value, volumes: this.num($("ex-vol").value), transp: $("ex-tr").value, rca: $("ex-rca").value.trim(), carreg: $("ex-car").value.trim(), nota: $("ex-nota").value.trim(), valor: this.num($("ex-val").value), peso: this.num($("ex-peso").value), uf: $("ex-uf").value.trim() };
    if(!item.data) return msg("erro", "Informe a data.");
    if(!item.volumes) return msg("erro", "Informe os volumes."), $("ex-vol").focus();
    if(!item.transp) return msg("erro", "Selecione a transportadora.");
    if(!item.nota) return msg("erro", "Informe o número da nota."), $("ex-nota").focus();
    if(item.valor === null) return msg("erro", "Informe o valor.");
    if(!item.peso) return msg("erro", "Informe o peso."), $("ex-peso").focus();
    msg("", ""); const btn = $("ex-add"); btn.disabled = true;
    const r = await this.chamar(Object.assign({ acao: "ecom_exp_salvar" }, item));
    btn.disabled = false;
    if(!r || !r.ok) return msg("erro", this.h((r && r.erro) || "Não foi possível salvar."));
    this.dados.expedicao.push(r.item); if(r.transportadoras) this.dados.transportadoras = r.transportadoras;
    this.ex.ult = { transp: item.transp, data: item.data };
    if(item.data < this.ex.ini) this.ex.ini = item.data; if(item.data > this.ex.fim) this.ex.fim = item.data;
    toast("Nota " + item.nota + " lançada.", "success"); this.telaExp(this.el("ec-corpo")); this.el("ex-vol").focus();
  },
  exLinhas(txt){
    const out = [], erros = [];
    String(txt || "").split(/\r?\n/).forEach((ln, i) => {
      if(!ln.trim()) return;
      const c = ln.split("\t").map(x => x.trim());
      if(/^volumes?$/i.test(c[0])) return;                   // cabeçalho colado junto
      const dt = this.dataBR(c[7]);
      if(!dt) return erros.push(`Linha ${i + 1}: data inválida (${c[7] || "vazia"}).`);
      out.push({ volumes: this.num(c[0]), transp: c[1], rca: c[2], carreg: c[3], nota: c[4], valor: this.num(c[5]), peso: this.num(c[6]), data: dt, uf: c[8] || "" });
    });
    return { out, erros };
  },
  async exLote(){
    const { out, erros } = this.exLinhas(this.el("ex-area").value);
    if(!out.length) return LancUI.aviso("ex-lmsg", "erro", erros.length ? erros.map(e => this.h(e)).join("<br>") : "Cole ao menos uma linha.");
    const rel = await this.enviarLotes(out, false);
    await this.recarregarSilencioso(); this.telaExp(this.el("ec-corpo"));
    LancUI.aviso("ex-lmsg", (rel.erros.length || erros.length) ? "aviso" : "ok", this.relatorio(rel, erros));
  },
  relatorio(rel, extras){
    const l = [`${rel.gravados} nota(s) lançada(s).`];
    if(rel.repetidos) l.push(`${rel.repetidos} já existiam e foram ignoradas.`);
    (extras || []).concat(rel.erros).slice(0, 12).forEach(e => l.push(this.h(e)));
    if((extras || []).length + rel.erros.length > 12) l.push("…e mais erros.");
    return l.join("<br>");
  },
  /** envia em blocos (limite do servidor) e junta o resultado */
  async enviarLotes(itens, importacao, onProg){
    const rel = { gravados: 0, repetidos: 0, erros: [] }, T = 300;
    for(let i = 0; i < itens.length; i += T){
      const r = await this.chamar({ acao: "ecom_exp_lote", itens: itens.slice(i, i + T), importacao: !!importacao });
      if(!r || !r.ok){ rel.erros.push((r && r.erro) || "Falha ao enviar um bloco."); break; }
      rel.gravados += r.gravados; rel.repetidos += r.repetidos.length; r.erros.forEach(e => rel.erros.push(`Bloco ${i / T + 1} — ${e}`));
      if(onProg) onProg(Math.min(itens.length, i + T), itens.length);
    }
    return rel;
  },
  async exImportar(file){
    const msg = (t, h) => LancUI.aviso("ex-imsg", t, h);
    if(!file) return;
    if(typeof XLSX === "undefined") return msg("erro", "A biblioteca de planilhas ainda não carregou. Aguarde um instante e tente de novo.");
    try{
      msg("aviso", "Lendo a planilha…");
      const wb = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true });
      const ws = wb.Sheets["Sheet1"] || wb.Sheets[wb.SheetNames.find(n => /sheet1|dados|plan1/i.test(n))] || wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: "" });
      const cab = (rows[0] || []).map(x => this.norm(x).replace(/\s/g, ""));
      const col = n => cab.indexOf(n);
      const iVol = col("VOLUMES"), iTr = col("TRANSPORTADORA"), iRca = col("RCA"), iCar = col("CARREGAMENTO"), iNota = col("NOTA"), iVal = col("VALOR"), iPeso = col("PESO"), iData = col("DATA"), iUf = col("UF");
      if([iVol, iTr, iNota, iVal, iData].some(i => i < 0)) return msg("erro", "Não achei as colunas VOLUMES, TRANSPORTADORA, NOTA, VALOR e DATA na primeira linha. Confira se é a planilha CONTROLE_SIA.");
      const dataIso = v => v instanceof Date ? this.isoDe(new Date(v.getTime() + 12 * 3600 * 1000)) : this.dataBR(v);
      const itens = [], erros = [];
      rows.slice(1).forEach((r, i) => {
        if(r.every(x => x === "" || x === null)) return;
        const d = dataIso(r[iData]); if(!d) return erros.push(`Linha ${i + 2}: data inválida.`);
        itens.push({ volumes: this.num(r[iVol]), transp: String(r[iTr] || "").trim(), rca: String(iRca >= 0 ? r[iRca] : "").trim(), carreg: String(iCar >= 0 ? r[iCar] : "").trim(), nota: String(r[iNota] || "").trim(), valor: this.num(r[iVal]), peso: iPeso >= 0 ? this.num(r[iPeso]) : null, data: d, uf: String(iUf >= 0 ? r[iUf] : "").trim() });
      });
      if(!itens.length) return msg("erro", "Nenhuma linha válida encontrada.");
      if(!confirm(`Importar ${itens.length} nota(s) do SIA (${this.br(itens.reduce((m, x) => x.data < m ? x.data : m, "9999"))} a ${this.br(itens.reduce((m, x) => x.data > m ? x.data : m, ""))})? Notas que já existem são ignoradas.`)) return msg("", "");
      const rel = await this.enviarLotes(itens, true, (a, b) => msg("aviso", `Enviando… ${a} de ${b}`));
      await this.recarregarSilencioso(); this.telaExp(this.el("ec-corpo"));
      LancUI.aviso("ex-imsg", rel.erros.length || erros.length ? "aviso" : "ok", this.relatorio(rel, erros));
    }catch(e){ msg("erro", "Não foi possível ler a planilha: " + this.h(e.message)); }
  },
  exEditar(id){
    const e = this.dados.expedicao.find(x => x.id === id); if(!e) return;
    UI.openModal(`<h3 class="adm-h2">Editar nota ${this.h(e.nota)}</h3><div class="adm-form" style="grid-template-columns:1fr 1fr">
      <label>Data<input type="date" id="ed-data" value="${this.h(e.data)}" max="${this.hojeIso()}"></label><label>Volumes<input type="text" id="ed-vol" value="${this.campo(e.volumes, 0)}"></label>
      <label>Transportadora<select id="ed-tr">${this.optTransp(e.transp)}</select></label><label>Nota<input type="text" id="ed-nota" value="${this.h(e.nota)}"></label>
      <label>RCA<input type="text" id="ed-rca" value="${this.h(e.rca)}"></label><label>Carregamento<input type="text" id="ed-car" value="${this.h(e.carreg)}"></label>
      <label>Valor (R$)<input type="text" id="ed-val" value="${this.campo(e.valor)}"></label><label>Peso<input type="text" id="ed-peso" value="${this.campo(e.peso)}"></label>
      <label>UF<input type="text" id="ed-uf" maxlength="2" value="${this.h(e.uf)}"></label></div>
      <div id="ed-msg"></div><div class="adm-actions"><button type="button" class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button><button type="button" class="btn btn-primary" id="ed-ok">Salvar</button></div>`);
    this.el("ed-ok").addEventListener("click", async () => {
      const $ = i => this.el(i);
      const r = await this.chamar({ acao: "ecom_exp_salvar", id, data: $("ed-data").value, volumes: this.num($("ed-vol").value), transp: $("ed-tr").value, nota: $("ed-nota").value.trim(), rca: $("ed-rca").value.trim(), carreg: $("ed-car").value.trim(), valor: this.num($("ed-val").value), peso: this.num($("ed-peso").value), uf: $("ed-uf").value.trim() });
      if(!r || !r.ok) return LancUI.aviso("ed-msg", "erro", this.h((r && r.erro) || "Não foi possível salvar."));
      Object.assign(e, r.item); if(r.transportadoras) this.dados.transportadoras = r.transportadoras;
      UI.closeModal(); toast("Nota atualizada.", "success"); this.telaExp(this.el("ec-corpo"));
    });
  },
  async exExcluir(id){
    const e = this.dados.expedicao.find(x => x.id === id); if(!e) return;
    if(!confirm(`Excluir a nota ${e.nota} (${e.transp}, ${this.br(e.data)})? Esta ação fica registrada no histórico de alterações.`)) return;
    const r = await this.chamar({ acao: "ecom_exp_excluir", id });
    if(!r || !r.ok) return toast((r && r.erro) || "Não foi possível excluir.", "error");
    this.dados.expedicao = this.dados.expedicao.filter(x => x.id !== id); toast("Nota excluída.", "success"); this.telaExp(this.el("ec-corpo"));
  }
};
window.EcomUI = EcomUI;

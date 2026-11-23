/* =========================================================================
   Núcleo Reposição — Refeitório Interno (Controle de Entradas)
   Menu: Lançamentos > Liberações Refeitório  ·  Gestão > Histórico Almoço
   Abas: Liberações Refeitório · Solicitar Inclusão · Histórico e Indicadores · Cardápio e Adesão
   Perfis (Portaria/Bravo, Encarregado/Gestor, Gestor de Cozinha), nível (restrito/geral) e setores
   vêm de Administração > Acessos; aprovadores, de Administração > Parâmetros > Refeitório.
   Dados: abas REFEIT_* (Apps Script, ações refeit_*).
   Portaria: interface otimista — a marcação aparece na hora e vai para o servidor em segundo plano (fila).
   ========================================================================= */
const RefeitUI = {
  pane: "lrefeitorio",
  tab: null,
  sub: null,                       // "portaria" | "pre" (quando o usuário tem os dois papéis)
  perfil: null, setores: [], encarregados: {}, hoje: null,
  dataSel: null, dia: [], listas: {}, fixos: [], notif: { avulsos: [], aprovacoes: [] }, minhas: [],
  sel: {},                         // { setor: Set(códigos) } seleção da pré-liberação (sobrevive aos redesenhos)
  carregado: false, erro: "", sig: "", notifSig: "",
  fila: [], enviando: false, tentativas: 0, timerFila: null, timerPoll: null, sincEm: "",
  pessoas: null,                   // { matrícula: nome } (para completar o nome ao digitar o código)
  his: { ini: null, fim: null, setor: "", enc: "", busca: "", dados: null, carregando: false, erro: "", verTudo: false },
  car: { semana: null, dados: null, carregando: false, erro: "" },

  /* ------------------------------ utilidades ------------------------------ */
  h(s){ return escapeHtml(s == null ? "" : String(s)); },
  pad(n){ return String(n).padStart(2, "0"); },
  isoDe(d){ return `${d.getFullYear()}-${this.pad(d.getMonth() + 1)}-${this.pad(d.getDate())}`; },
  aData(iso){ const [y, m, d] = String(iso).split("-").map(Number); return new Date(y, m - 1, d, 12); },
  soma(iso, n){ const d = this.aData(iso); d.setDate(d.getDate() + n); return this.isoDe(d); },
  br(iso){ const p = String(iso || "").split("-"); return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : (iso || "—"); },
  br2(iso){ const p = String(iso || "").split("-"); return p.length === 3 ? `${p[2]}/${p[1]}` : (iso || "—"); },
  dsem(iso){ return ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"][this.aData(iso).getDay()]; },
  agoraIso(){ const d = new Date(); return `${this.isoDe(d)}T${this.pad(d.getHours())}:${this.pad(d.getMinutes())}:${this.pad(d.getSeconds())}`; },
  hojeIso(){ return this.hoje || this.isoDe(new Date()); },
  norm(s){ return typeof normStr === "function" ? normStr(s) : String(s || "").toLowerCase(); },
  pct(a, b){ return b ? Math.round(a / b * 1000) / 10 : 0; },
  num(n){ return typeof fmtNum === "function" ? fmtNum(n) : String(n); },
  mat(){ return (Auth.user && Auth.user.matricula) || ""; },
  guardar(k, v){ try{ localStorage.setItem(k, v); }catch(e){} },
  ler(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } },
  async chamar(payload){
    try{ return await Api.call(payload); }catch(e){ return { ok: false, erro: e.message, rede: true }; }
  },
  tem(papel){ return !!(this.perfil && this.perfil.papeis.includes(papel)); },
  encNome(setor){ const l = this.encarregados[this.norm(setor)] || []; return l.length ? l.map(x => x.nome).join("; ") : "—"; },
  pessoa(cod, nome){ return `${this.h(cod)} - ${this.h(nome)}`; },

  /* ------------------------------ abas ------------------------------ */
  tabsPermitidas(){
    const p = this.perfil; if(!p) return [];
    const t = [];
    if(this.tem("Portaria") || this.tem("Encarregado")) t.push({ id: "lib", rot: "Liberações Refeitório" });
    if(this.tem("Encarregado") || p.aprovador) t.push({ id: "sol", rot: "Solicitar Inclusão" });
    if(this.tem("Encarregado") || p.geral) t.push({ id: "his", rot: "Histórico e Indicadores" });
    if(this.tem("Cozinha")) t.push({ id: "car", rot: "Cardápio e Adesão" });
    return t;
  },

  /* ------------------------------ entrada ------------------------------ */
  abrir(pane){
    this.pane = pane;
    const el = document.getElementById("pane-" + pane); if(!el) return;
    if(!Api.configured()){ el.innerHTML = `<div class="panel">${AdminUI.semServidor()}</div>`; return; }
    if(!this.carregado){
      this.restaurarFila();
      const c = this.cacheLer();
      if(c){ this.perfil = c.perfil; this.setores = c.setores; this.encarregados = c.encarregados; this.hoje = c.hoje; this.dia = c.dia; this.carregado = true; this.dataSel = c.hoje; }
    }
    this.tab = this.proxTab || null; this.proxTab = null;
    this.desenhar();
    this.sync(false, true);
    this.iniciarPoll();
    if(this.fila.length) this.flush();
  },

  escolherTab(){
    const ts = this.tabsPermitidas().map(t => t.id);
    if(!ts.length) return null;
    if(this.tab && ts.includes(this.tab)) return this.tab;
    if(this.pane === "hrefeitorio" && ts.includes("his")) return "his";
    const salvo = this.ler("nr_ref_tab");
    if(salvo && ts.includes(salvo) && salvo !== "his") return salvo;
    return ts[0];
  },

  desenhar(){
    const el = document.getElementById("pane-" + this.pane); if(!el) return;
    if(!this.carregado){
      el.innerHTML = this.erro
        ? `<div class="panel"><div class="error-box">${this.h(this.erro)}</div><button class="btn btn-outline" id="rf-retry">Tentar novamente</button></div>`
        : `<div class="panel"><p class="small-muted">Carregando o refeitório…</p></div>`;
      const b = document.getElementById("rf-retry"); if(b) b.addEventListener("click", () => { this.erro = ""; this.desenhar(); this.sync(false, true); });
      return;
    }
    const tabs = this.tabsPermitidas();
    if(!tabs.length){
      el.innerHTML = `<div class="panel"><h2 class="adm-h">Refeitório</h2><div class="hint-box">Seu acesso ainda não tem um perfil do refeitório (Portaria, Encarregado, Gestor de Cozinha ou Visão Geral). Peça ao administrador para configurar em Administração > Acessos.</div></div>`;
      return;
    }
    this.tab = this.escolherTab();
    el.innerHTML = `<div class="rf-tabs" role="tablist">${tabs.map(t => `<button type="button" class="rf-tab ${this.tab === t.id ? "on" : ""}" role="tab" data-rf-tab="${t.id}">${this.h(t.rot)}</button>`).join("")}</div>
      <div id="rf-notif"></div><div id="rf-corpo"></div>`;
    el.querySelectorAll("[data-rf-tab]").forEach(b => b.addEventListener("click", () => {
      this.tab = b.dataset.rfTab; if(this.tab !== "his") this.guardar("nr_ref_tab", this.tab); this.desenhar();
    }));
    this.desenharNotif(true);
    const corpo = document.getElementById("rf-corpo");
    if(this.tab === "lib") this.telaLib(corpo);
    else if(this.tab === "sol") this.telaSol(corpo);
    else if(this.tab === "his") this.telaHis(corpo);
    else this.telaCar(corpo);
  },

  /* ------------------------------ sincronização ------------------------------ */
  async sync(quieto, forcar){
    if(this.fila.length || this.enviando) return;                       // há marcações a caminho: o servidor ainda não sabe delas
    const r = await this.chamar({ acao: "refeit_sync", data: this.dataSel || undefined });
    if(!r || !r.ok){
      if(!this.carregado){ this.erro = (r && r.erro) || "Não foi possível carregar o refeitório."; this.desenhar(); }
      else if(!quieto) toast((r && r.erro) || "Não foi possível atualizar.", "error");
      return;
    }
    if(this.fila.length || this.enviando) return;                       // chegou marcação nova durante a consulta
    const primeira = !this.carregado;
    this.perfil = r.perfil; this.setores = r.setores || []; this.encarregados = r.encarregados || {}; this.hoje = r.hoje;
    if(!this.dataSel) this.dataSel = r.hoje;
    this.dia = r.dia || []; this.listas = r.listas || {}; this.fixos = r.fixos || []; this.notif = r.notif || { avulsos: [], aprovacoes: [] }; this.minhas = r.minhas || [];
    this.carregado = true; this.erro = "";
    if(this.tem("Portaria") && this.dataSel === r.hoje) this.cacheGravar();
    const sig = JSON.stringify([this.dia, this.listas, this.fixos]);
    if(primeira || forcar && sig !== this.sig){ this.sig = sig; this.desenhar(); return; }
    if(sig !== this.sig){
      this.sig = sig;
      if(this.tab === "lib") this.atualizarLib();
    }
    this.desenharNotif(false);
  },

  iniciarPoll(){
    if(this.timerPoll) return;
    this.timerPoll = setInterval(() => {
      const el = document.getElementById("pane-" + this.pane);
      if(document.hidden || !el || !el.classList.contains("active")) return;
      this.sync(true, false);
    }, 12000);
  },

  cacheKey(){ return "nr_ref_dia_" + this.mat(); },
  cacheGravar(){ try{ localStorage.setItem(this.cacheKey(), JSON.stringify({ hoje: this.hoje, perfil: this.perfil, setores: this.setores, encarregados: this.encarregados, dia: this.dia })); }catch(e){} },
  cacheLer(){
    try{ const c = JSON.parse(localStorage.getItem(this.cacheKey()) || "null"); if(c && c.hoje === this.isoDe(new Date()) && c.perfil) return c; }catch(e){}
    return null;
  },
  restaurarFila(){
    try{ const f = JSON.parse(localStorage.getItem("nr_ref_fila") || "null"); if(f && f.mat === this.mat() && Array.isArray(f.ops)) this.fila = f.ops; }catch(e){}
  },
  gravarFila(){ try{ localStorage.setItem("nr_ref_fila", JSON.stringify({ mat: this.mat(), ops: this.fila })); }catch(e){} },

  /* ------------------------------ fila de envio (interface otimista) ------------------------------ */
  indicador(estado){
    const el = document.getElementById("rf-sync"); if(!el) return;
    if(estado === "sync"){ el.className = "rf-sync sync"; el.textContent = "Sincronizando…"; }
    else if(estado === "off"){ el.className = "rf-sync off"; el.textContent = `Sem conexão — ${this.fila.length} pendente(s), tentando de novo`; }
    else { el.className = "rf-sync ok"; el.textContent = this.sincEm ? `✓ Sincronizado ${this.sincEm}` : "✓ Sincronizado"; }
  },
  enfileirar(op){
    op.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    this.fila.push(op); this.gravarFila(); this.flush();
  },
  async flush(){
    if(this.enviando || !this.fila.length) return;
    this.enviando = true; this.indicador("sync");
    const lote = this.fila.slice(0, 30);
    const r = await this.chamar({ acao: "refeit_ops", ops: lote });
    this.enviando = false;
    if(!r || (!r.ok && !r.resultados)){
      const ocupado = r && /ocupado|bloqueio/i.test(r.erro || "");
      if(!r || r.rede || ocupado){                                       // sem rede ou servidor ocupado: tenta de novo
        this.tentativas++; this.indicador("off");
        clearTimeout(this.timerFila); this.timerFila = setTimeout(() => this.flush(), Math.min(30000, 3000 * this.tentativas));
        return;
      }
      this.fila = this.fila.filter(o => !lote.includes(o)); this.gravarFila();
      toast((r && r.erro) || "Não foi possível registrar.", "error");
      this.sync(false, true); return;
    }
    this.tentativas = 0;
    const falhas = [];
    (r.resultados || []).forEach(x => { if(!x.ok) falhas.push(x.erro || "Falha ao registrar."); });
    this.fila = this.fila.filter(o => !lote.includes(o)); this.gravarFila();
    const d = new Date(); this.sincEm = `${this.pad(d.getHours())}:${this.pad(d.getMinutes())}:${this.pad(d.getSeconds())}`;
    this.indicador("ok");
    if(falhas.length){ toast(falhas[0], "error"); this.sync(false, true); return; }
    if(this.fila.length) this.flush(); else this.cacheGravar();
  },

  /* ------------------------------ Tab 1: Liberações ------------------------------ */
  telaLib(corpo){
    const ambos = this.tem("Portaria") && this.tem("Encarregado");
    if(this.proxSub){ this.sub = this.proxSub; this.proxSub = null; }
    if(!this.sub || (this.sub === "portaria" && !this.tem("Portaria")) || (this.sub === "pre" && !this.tem("Encarregado"))) this.sub = this.tem("Portaria") ? "portaria" : "pre";
    const sw = ambos ? `<div class="toggle-group rf-sub"><button type="button" data-rf-sub="portaria" class="${this.sub === "portaria" ? "active" : ""}">Portaria (Bravo)</button><button type="button" data-rf-sub="pre" class="${this.sub === "pre" ? "active" : ""}">Pré-liberação</button></div>` : "";
    corpo.innerHTML = `${sw}<div id="rf-lib"></div>`;
    corpo.querySelectorAll("[data-rf-sub]").forEach(b => b.addEventListener("click", () => {
      this.sub = b.dataset.rfSub;
      if(this.sub === "portaria" && this.dataSel !== this.hoje){ this.dataSel = this.hoje; this.sync(false, true); }
      this.telaLib(corpo);
    }));
    const box = document.getElementById("rf-lib");
    if(this.sub === "portaria") this.viewPortaria(box); else this.viewPre(box);
  },
  atualizarLib(){
    const box = document.getElementById("rf-lib"); if(!box) return;
    if(this.sub === "portaria") this.atualizarTabela(); else this.viewPre(box);
  },

  /* ---- Portaria / Bravo ---- */
  ordenar(l){ return l.slice().sort((a, b) => String(a.nome).localeCompare(String(b.nome), "pt-BR")); },
  linhaHtml(r){
    return `<tr class="rf-row ${r.pres ? "on" : ""} ${r.tipo === "Avulso" ? "avu" : ""}" data-cod="${this.h(r.cod)}" data-q="${this.h(this.norm(r.cod + " " + r.nome))}">
      <td><strong>${this.h(r.cod)}</strong></td>
      <td>${this.h(r.nome)}${r.tipo === "Avulso" ? ` <span class="adm-tag rep">Avulso</span>` : r.tipo === "Pontual" ? ` <span class="adm-tag">Pontual</span>` : ""}</td>
      <td>${this.h(r.setor)}</td><td>${this.h(this.encNome(r.setor))}</td>
      <td class="rf-hora">${r.pres ? this.h(r.hora) : "—"}</td><td class="rf-data">${r.pres ? this.br(r.dreg) : "—"}</td>
      <td class="rf-pres"><label class="rf-chk" title="Presença"><input type="checkbox" ${r.pres ? "checked" : ""} aria-label="Presença de ${this.h(r.nome)}"><span></span></label></td></tr>`;
  },
  contagem(){
    const t = this.dia.length, p = this.dia.filter(r => r.pres).length, a = this.dia.filter(r => r.tipo === "Avulso").length;
    return `<span><strong>${this.num(t)}</strong> liberado(s)</span><span><strong>${this.num(p)}</strong> almoçaram</span><span><strong>${this.num(t - p)}</strong> faltam</span><span><strong>${this.num(a)}</strong> avulso(s)</span>`;
  },
  viewPortaria(box){
    box.innerHTML = `<div class="panel rf-bravo">
        <div class="adm-head"><h2 class="adm-h">Portaria — ${this.br(this.hojeIso())}</h2>
          <div class="panel-actions"><span class="rf-sync ok" id="rf-sync">${this.sincEm ? "✓ Sincronizado " + this.sincEm : "✓ Pronto"}</span>
            <button type="button" class="btn btn-primary" id="rf-avulso">＋ Registro Avulso</button></div></div>
        <div class="rf-cont" id="rf-cont">${this.contagem()}</div>
        <div class="filter-group rf-busca"><label for="rf-q">Buscar por código ou nome</label><input type="search" id="rf-q" placeholder="Digite o código e tecle Enter para registrar a presença" autocomplete="off" inputmode="search"></div>
        <div class="table-wrap rf-wrap"><table class="adm-table rf-tab-t"><thead><tr><th>Código</th><th>Nome</th><th>Setor</th><th>Encarregado</th><th>Horário Registro</th><th>Data</th><th>Presença</th></tr></thead>
        <tbody id="rf-tbody"></tbody></table></div></div>`;
    this.atualizarTabela();
    const q = document.getElementById("rf-q"), tb = document.getElementById("rf-tbody");
    q.addEventListener("input", () => this.filtrar());
    q.addEventListener("keydown", e => { if(e.key === "Enter"){ e.preventDefault(); this.enterBusca(); } });
    tb.addEventListener("click", e => {
      const tr = e.target.closest("tr[data-cod]"); if(!tr) return;
      const cod = tr.dataset.cod, r = this.dia.find(x => x.cod === cod); if(!r) return;
      if(e.target.closest(".rf-chk")){ e.preventDefault(); this.marcar(cod, !r.pres); return; }   // a caixa marca e desmarca
      if(!r.pres) this.marcar(cod, true);                                                           // clicar na linha só marca
    });
    document.getElementById("rf-avulso").addEventListener("click", () => this.modalAvulso(""));
    q.focus();
  },
  atualizarTabela(){
    const tb = document.getElementById("rf-tbody"); if(!tb) return;
    const l = this.ordenar(this.dia);
    tb.innerHTML = l.length ? l.map(r => this.linhaHtml(r)).join("")
      : `<tr><td colspan="7" class="small-muted">Nenhum colaborador liberado para hoje ainda. Os encarregados enviam a lista de cada setor; use "＋ Registro Avulso" para quem chegar sem estar na lista.</td></tr>`;
    const c = document.getElementById("rf-cont"); if(c) c.innerHTML = this.contagem();
    this.filtrar();
  },
  filtrar(){
    const q = this.norm((document.getElementById("rf-q") || {}).value || "");
    document.querySelectorAll("#rf-tbody tr[data-q]").forEach(tr => { tr.hidden = !!q && !tr.dataset.q.includes(q); });
  },
  enterBusca(){
    const inp = document.getElementById("rf-q"), q = this.norm(inp.value).trim(); if(!q) return;
    const vis = Array.from(document.querySelectorAll("#rf-tbody tr[data-cod]")).filter(tr => !tr.hidden);
    const exato = vis.find(tr => tr.dataset.cod === q);
    const tr = exato || (vis.length === 1 ? vis[0] : null);
    if(tr){
      const r = this.dia.find(x => x.cod === tr.dataset.cod);
      if(r.pres) toast(`${r.nome} já registrou presença às ${r.hora}.`, "info");
      else this.marcar(r.cod, true);
      inp.value = ""; this.filtrar(); inp.focus();
    }else if(!vis.length && /^\d+$/.test(q)){
      toast(`O código ${q} não está na lista de hoje. Registre como avulso.`, "info"); this.modalAvulso(q);
    }else toast("Há mais de um resultado: refine a busca ou clique na linha.", "info");
  },
  marcar(cod, presente){
    const r = this.dia.find(x => x.cod === cod); if(!r || r.pres === presente) return;
    const ts = this.agoraIso();
    r.pres = presente; r.hora = presente ? ts.slice(11, 19) : ""; r.dreg = presente ? ts.slice(0, 10) : "";
    const tr = document.querySelector(`#rf-tbody tr[data-cod="${CSS.escape(cod)}"]`);
    if(tr){
      tr.classList.toggle("on", presente); tr.querySelector(".rf-hora").textContent = presente ? r.hora : "—";
      tr.querySelector(".rf-data").textContent = presente ? this.br(r.dreg) : "—"; tr.querySelector("input").checked = presente;
      tr.classList.remove("flash"); void tr.offsetWidth; tr.classList.add("flash");
    }
    const c = document.getElementById("rf-cont"); if(c) c.innerHTML = this.contagem();
    this.enfileirar({ tipo: "presenca", data: this.hoje, cod, presente, ts });
  },
  modalAvulso(cod){
    this.carregarPessoas();
    const op = this.setores.map(s => `<option value="${this.h(s)}">${this.h(s)}</option>`).join("");
    UI.openModal(`<h3 style="margin-top:0;">Registro avulso</h3>
      <p class="small-muted">Para quem almoça sem estar na lista do dia. Entra na contagem como avulso e o encarregado do setor é avisado.</p>
      <div class="adm-form">
        <label>Código<input type="text" inputmode="numeric" id="av-cod" value="${this.h(cod)}" autocomplete="off"></label>
        <label>Nome<input type="text" id="av-nome" autocomplete="off"></label>
        <label>Setor<select id="av-setor"><option value="">Selecione o setor</option>${op}</select></label>
      </div><div id="av-msg"></div>
      <div class="adm-actions"><button class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button><button class="btn btn-primary" id="av-ok">Registrar</button></div>`);
    const cd = document.getElementById("av-cod"), nm = document.getElementById("av-nome");
    const auto = () => { const n = this.pessoas && this.pessoas[cd.value.replace(/\D/g, "")]; if(n && !nm.value) nm.value = n; };
    cd.addEventListener("change", auto); cd.addEventListener("input", auto);
    document.getElementById("av-ok").addEventListener("click", () => {
      const c = cd.value.replace(/\D/g, ""), n = nm.value.trim(), st = document.getElementById("av-setor").value, msg = document.getElementById("av-msg");
      if(!c || !n || !st){ msg.innerHTML = `<div class="error-box" style="margin-top:12px;">Informe código, nome e setor.</div>`; return; }
      const ja = this.dia.find(x => x.cod === c);
      UI.closeModal();
      const qb = document.getElementById("rf-q"); if(qb){ qb.value = ""; this.filtrar(); qb.focus(); }
      if(ja){ if(ja.pres) toast(`${ja.nome} já estava na lista e já registrou presença.`, "info"); else { this.marcar(c, true); toast(`${ja.nome} já estava na lista: presença registrada.`, "success"); } return; }
      const ts = this.agoraIso();
      this.dia.push({ cod: c, nome: n, setor: st, tipo: "Avulso", pres: true, hora: ts.slice(11, 19), dreg: ts.slice(0, 10), aut: "", inc: "" });
      this.atualizarTabela();
      const tr = document.querySelector(`#rf-tbody tr[data-cod="${CSS.escape(c)}"]`); if(tr){ tr.classList.add("flash"); tr.scrollIntoView({ block: "nearest" }); }
      this.enfileirar({ tipo: "avulso", data: this.hoje, cod: c, nome: n, setor: st, ts });
      toast("Avulso registrado. O encarregado do setor será avisado.", "success");
    });
    (cod ? document.getElementById("av-nome") : cd).focus();
  },
  async carregarPessoas(){
    if(this.pessoas) return;
    this.pessoas = {};
    try{
      const r = await Api.call({ acao: "lanc_init" });
      if(r && r.ok) (r.pessoas || []).forEach(p => { if(p.mat) this.pessoas[p.mat] = p.nome; });
    }catch(e){}
  },

  /* ---- Encarregado: pré-liberação ---- */
  viewPre(box){
    const dsel = this.dataSel || this.hojeIso(), meus = (this.perfil.setores || []);
    const cards = meus.map(st => this.cardSetor(st, dsel)).join("");
    box.innerHTML = `<div class="panel"><div class="adm-head"><h2 class="adm-h">Pré-liberação do refeitório</h2>
        <div class="panel-actions"><div class="filter-group" style="min-width:150px"><label for="pre-data">Data da lista</label><input type="date" id="pre-data" value="${dsel}" min="${this.hojeIso()}"></div></div></div>
        <p class="small-muted">Marque quem do seu setor está liberado para almoçar no Refeitório Interno nesse dia e envie a lista. A Portaria vê o resultado na hora.</p>
        <div class="panel-actions"><button type="button" class="btn btn-primary btn-sm" id="pre-add">＋ Adicionar pessoa ao dia</button><button type="button" class="btn btn-outline btn-sm" id="pre-perm">Solicitar inclusão permanente</button></div></div>
      ${cards || `<div class="panel"><div class="hint-box">Você ainda não está vinculado a nenhum setor. Peça ao administrador em Administração > Acessos.</div></div>`}`;
    document.getElementById("pre-data").addEventListener("change", e => {
      const v = e.target.value; if(!v || v < this.hojeIso()){ e.target.value = dsel; return; }
      this.dataSel = v; this.sel = {}; this.carregado = true; this.sync(false, true);
    });
    document.getElementById("pre-add").addEventListener("click", () => this.modalPontual());
    document.getElementById("pre-perm").addEventListener("click", () => { this.tab = "sol"; this.desenhar(); });
    box.querySelectorAll("[data-pre-pont]").forEach(b => b.addEventListener("click", () => this.removerPontual(b.dataset.prePont)));
    box.querySelectorAll("[data-pre-chk]").forEach(c => c.addEventListener("change", () => {
      const st = c.dataset.setor, s = this.sel[st] = this.sel[st] || new Set();
      if(c.checked) s.add(c.dataset.preChk); else s.delete(c.dataset.preChk);
      this.contarSel(st);
    }));
    box.querySelectorAll("[data-pre-todos]").forEach(b => b.addEventListener("click", () => {
      const st = b.dataset.setor, marcar = b.dataset.preTodos === "1";
      box.querySelectorAll(`[data-pre-chk][data-setor="${CSS.escape(st)}"]:not(:disabled)`).forEach(c => { c.checked = marcar; c.dispatchEvent(new Event("change")); });
    }));
    box.querySelectorAll("[data-pre-enviar]").forEach(b => b.addEventListener("click", () => this.enviarLista(b.dataset.preEnviar, b)));
    box.querySelectorAll("[data-pre-rem]").forEach(b => b.addEventListener("click", () => this.removerFixo(b.dataset.preRem, b.dataset.setor, b.dataset.nome)));
    box.querySelectorAll("[data-ir-sol]").forEach(b => b.addEventListener("click", () => { this.tab = "sol"; this.desenhar(); }));
    meus.forEach(st => this.contarSel(st));
  },
  cardSetor(st, data){
    const k = this.norm(st), lista = this.listas[k], fx = this.fixos.filter(f => this.norm(f.setor) === k);
    const doDia = this.dia.filter(r => this.norm(r.setor) === k);
    const noDia = new Set(doDia.filter(r => r.tipo === "Fixo").map(r => r.cod));
    if(!this.sel[st]) this.sel[st] = new Set(lista ? Array.from(noDia) : fx.map(f => f.cod));      // enviada: o que foi enviado; nova: todos marcados
    const s = this.sel[st];
    const status = lista ? `<span class="adm-tag acc">Lista enviada às ${this.h((lista.enviadoEm || "").slice(11, 16))} por ${this.h(lista.por)} · ${lista.total} liberado(s)</span>` : `<span class="adm-tag rep">Lista ainda não enviada</span>`;
    const presentes = new Set(doDia.filter(r => r.pres).map(r => r.cod));
    const linhas = fx.map(f => `<label class="rf-item ${presentes.has(f.cod) ? "bloq" : ""}"><input type="checkbox" data-pre-chk="${this.h(f.cod)}" data-setor="${this.h(st)}" ${s.has(f.cod) || presentes.has(f.cod) ? "checked" : ""} ${presentes.has(f.cod) ? "disabled" : ""}>
        <span>${this.pessoa(f.cod, f.nome)}${presentes.has(f.cod) ? ` <span class="adm-tag acc">já almoçou</span>` : ""}</span>
        <button type="button" class="rf-rem" data-pre-rem="${this.h(f.cod)}" data-setor="${this.h(st)}" data-nome="${this.h(f.nome)}" title="Excluir da lista fixa do setor">excluir da lista</button></label>`).join("");
    const pont = doDia.filter(r => r.tipo === "Pontual");
    const pontHtml = pont.length ? `<div class="rf-avs"><h4>Adicionados só para ${this.br(data)}</h4>${pont.map(r => `<div class="rf-av"><span>${this.pessoa(r.cod, r.nome)}</span>${r.pres ? `<span class="adm-tag acc">já almoçou</span>` : `<button type="button" class="rf-rem" data-pre-pont="${this.h(r.cod)}">excluir do dia</button>`}</div>`).join("")}</div>` : "";
    const avulsos = doDia.filter(r => r.tipo === "Avulso");
    const avHtml = avulsos.length ? `<div class="rf-avs"><h4>Avulsos deste dia</h4>${avulsos.map(r => `<div class="rf-av"><span>${this.pessoa(r.cod, r.nome)} <span class="small-muted">${this.h(r.hora)}</span></span>${r.aut === "Sim" ? `<span class="adm-tag acc">Autorizado</span>` : r.aut === "Não" ? `<span class="adm-tag err">Não autorizado</span>` : `<span class="adm-tag rep">Aguardando sua resposta</span>`}</div>`).join("")}</div>` : "";
    return `<div class="panel rf-setor"><div class="adm-head"><h3 class="adm-h" style="margin:0">${this.h(st)}</h3>${status}</div>
      ${fx.length ? `<div class="panel-actions rf-acoes"><button type="button" class="btn btn-outline btn-sm" data-pre-todos="1" data-setor="${this.h(st)}">Marcar todos</button><button type="button" class="btn btn-outline btn-sm" data-pre-todos="0" data-setor="${this.h(st)}">Limpar</button><span class="small-muted" id="pre-cont-${this.h(this.norm(st))}"></span></div>
        <div class="rf-lista">${linhas}</div>
        <div class="adm-actions"><button type="button" class="btn btn-primary" data-pre-enviar="${this.h(st)}">${lista ? "Atualizar lista" : "Enviar lista"} de ${this.br(data)}</button></div>`
        : `<div class="hint-box">Este setor ainda não tem colaboradores fixos. Inclua pela aba <a href="#" data-ir-sol>Solicitar Inclusão</a>.</div>`}
      ${pontHtml}${avHtml}</div>`;
  },
  proximoDiaUtil(){ let d = this.soma(this.hojeIso(), 1); while([0, 6].includes(this.aData(d).getDay())) d = this.soma(d, 1); return d; },
  modalPontual(){
    this.carregarPessoas();
    const meus = this.perfil.setores || [], hj = this.hojeIso(), am = this.proximoDiaUtil();
    UI.openModal(`<h3 style="margin-top:0;">Adicionar pessoa ao dia</h3>
      <p class="small-muted">Libera alguém só para a data escolhida, sem entrar na lista fixa. Para ficar permanente, use "Solicitar inclusão permanente".</p>
      <div class="adm-form" style="grid-template-columns:1fr;">
        <div class="filter-group"><label>Data</label><div class="toggle-group" id="pt-dias"><button type="button" class="active" data-d="${hj}">Hoje</button><button type="button" data-d="${am}">${this.soma(hj, 1) === am ? "Amanhã" : "Próximo dia útil"} (${this.br2(am)})</button><button type="button" data-d="">Outra data</button></div>
          <input type="date" id="pt-data" value="${hj}" min="${hj}" style="display:none;margin-top:6px"></div>
        <label>Código<input type="text" inputmode="numeric" id="pt-cod" autocomplete="off"></label>
        <label>Nome<input type="text" id="pt-nome" autocomplete="off"></label>
        <label>Setor<select id="pt-setor">${meus.length === 1 ? "" : `<option value="">Selecione o setor</option>`}${meus.map(s => `<option value="${this.h(s)}">${this.h(s)}</option>`).join("")}</select></label>
      </div><div id="pt-msg"></div>
      <div class="adm-actions"><button class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button><button class="btn btn-primary" id="pt-ok">Adicionar</button></div>`);
    const di = document.getElementById("pt-data"), g = document.getElementById("pt-dias");
    g.querySelectorAll("button").forEach(b => b.addEventListener("click", () => { g.querySelectorAll("button").forEach(x => x.classList.remove("active")); b.classList.add("active"); if(b.dataset.d){ di.value = b.dataset.d; di.style.display = "none"; } else { di.style.display = ""; di.focus(); } }));
    const cd = document.getElementById("pt-cod"), nm = document.getElementById("pt-nome");
    cd.addEventListener("change", () => { const n = this.pessoas && this.pessoas[cd.value.replace(/\D/g, "")]; if(n && !nm.value) nm.value = n; });
    document.getElementById("pt-ok").addEventListener("click", async e => {
      const f = { data: di.value, cod: cd.value.replace(/\D/g, ""), nome: nm.value.trim(), setor: document.getElementById("pt-setor").value }, msg = document.getElementById("pt-msg");
      if(!f.data || !f.cod || !f.nome || !f.setor){ msg.innerHTML = `<div class="error-box" style="margin-top:12px;">Informe data, código, nome e setor.</div>`; return; }
      const b = e.currentTarget; b.disabled = true; b.textContent = "Adicionando…";
      const r = await this.chamar(Object.assign({ acao: "refeit_pontual" }, f));
      if(!r || !r.ok){ b.disabled = false; b.textContent = "Adicionar"; msg.innerHTML = `<div class="error-box" style="margin-top:12px;">${this.h((r && r.erro) || "Não foi possível adicionar.")}</div>`; return; }
      UI.closeModal(); toast(`${f.cod} - ${f.nome} liberado para ${this.br(f.data)}.`, "success");
      this.dataSel = f.data; this.sel = {}; this.sync(false, true);
    });
    cd.focus();
  },
  async removerPontual(cod){
    const r = await this.chamar({ acao: "refeit_pontual_remover", data: this.dataSel || this.hojeIso(), cod });
    if(!r || !r.ok){ toast((r && r.erro) || "Não foi possível excluir.", "error"); return; }
    toast("Pessoa excluída da lista do dia.", "success"); this.sync(false, true);
  },
  contarSel(st){
    const el = document.getElementById("pre-cont-" + this.norm(st)); if(!el) return;
    const n = document.querySelectorAll(`[data-pre-chk][data-setor="${CSS.escape(st)}"]:checked`).length;
    el.textContent = `${n} marcado(s)`;
  },
  async enviarLista(st, btn){
    const cods = Array.from(document.querySelectorAll(`[data-pre-chk][data-setor="${CSS.escape(st)}"]:checked`)).map(c => c.dataset.preChk);
    const txt = btn.textContent; btn.disabled = true; btn.textContent = "Enviando…";
    const r = await this.chamar({ acao: "refeit_lista_salvar", data: this.dataSel || this.hojeIso(), setor: st, codigos: cods });
    btn.disabled = false; btn.textContent = txt;
    if(!r || !r.ok){ toast((r && r.erro) || "Não foi possível enviar a lista.", "error"); return; }
    toast(`Lista de ${st} enviada: ${r.total} liberado(s).`, "success");
    delete this.sel[st]; this.sync(false, true);
  },
  removerFixo(cod, setor, nome){
    UI.openModal(`<h3 style="margin-top:0;">Excluir da lista fixa?</h3><p>${this.pessoa(cod, nome)} deixa de aparecer na pré-liberação de <strong>${this.h(setor)}</strong> em todos os dias. Para voltar, será preciso solicitar a inclusão de novo. Para tirar só de um dia, desmarque a caixa e envie a lista.</p>
      <div class="adm-actions"><button class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button><button class="btn btn-primary" id="rf-rem-ok">Excluir da lista</button></div>`);
    document.getElementById("rf-rem-ok").addEventListener("click", async () => {
      const r = await this.chamar({ acao: "refeit_fixo_status", cod, setor, ativo: false });
      UI.closeModal();
      if(!r || !r.ok){ toast((r && r.erro) || "Não foi possível remover.", "error"); return; }
      toast("Colaborador excluído da lista fixa.", "success"); delete this.sel[setor]; this.sync(false, true);
    });
  },

  /* ------------------------------ Notificações (avulsos e aprovações) ------------------------------ */
  desenharNotif(forcar){
    const box = document.getElementById("rf-notif"); if(!box) return;
    const n = this.notif || { avulsos: [], aprovacoes: [] }, sig = JSON.stringify(n);
    if(!forcar && sig === this.notifSig) return;
    this.notifSig = sig;
    const total = n.avulsos.length + n.aprovacoes.length;
    if(!total){ box.innerHTML = ""; return; }
    const av = n.avulsos.map(a => `<div class="rf-nt"><div><span class="adm-tag rep">Avulso</span> <strong>${this.pessoa(a.cod, a.nome)}</strong> almoçou como avulso no setor ${this.h(a.setor)} em ${this.br(a.data)} às ${this.h(a.hora)}.</div>
        <button type="button" class="btn btn-primary btn-sm" data-nt-av="${this.h(a.data)}|${this.h(a.cod)}">Responder</button></div>`).join("");
    const ap = n.aprovacoes.map(a => `<div class="rf-nt"><div><span class="adm-tag rep">Aprovação</span> <strong>${this.h(a.pornome)}</strong> pede incluir <strong>${this.pessoa(a.cod, a.nome)}</strong> no setor ${this.h(a.setor)}${a.origem === "Avulso" ? " (veio de um avulso)" : ""}.
        <div class="small-muted">Motivo: ${this.h(a.motivo)}</div></div>
        <div class="rf-nt-b"><button type="button" class="btn btn-primary btn-sm" data-nt-ok="${this.h(a.id)}">Aceitar</button><button type="button" class="btn btn-outline btn-sm" data-nt-no="${this.h(a.id)}">Negar</button></div></div>`).join("");
    box.innerHTML = `<div class="panel rf-notif"><div class="adm-head"><h3 class="adm-h" style="margin:0">Notificações <span class="rf-badge">${total}</span></h3></div>${av}${ap}</div>`;
    box.querySelectorAll("[data-nt-av]").forEach(b => b.addEventListener("click", () => { const [d, c] = b.dataset.ntAv.split("|"); this.modalAvulsoResp(d, c); }));
    box.querySelectorAll("[data-nt-ok]").forEach(b => b.addEventListener("click", () => this.decidir(b.dataset.ntOk, true, b)));
    box.querySelectorAll("[data-nt-no]").forEach(b => b.addEventListener("click", () => this.decidir(b.dataset.ntNo, false, b)));
  },
  async decidir(id, aceitar, btn){
    const alvo = this.notif.aprovacoes.find(a => a.id === id); if(!alvo) return;
    const tudo = btn.closest(".rf-nt").querySelectorAll("button"); tudo.forEach(b => b.disabled = true);
    this.notif.aprovacoes = this.notif.aprovacoes.filter(a => a.id !== id); this.desenharNotif(true);          // some na hora
    const r = await this.chamar({ acao: "refeit_decidir", id, aceitar });
    if(!r || !r.ok){ this.notif.aprovacoes.push(alvo); this.desenharNotif(true); toast((r && r.erro) || "Não foi possível registrar a decisão.", "error"); return; }
    toast(aceitar ? `Inclusão aceita: ${alvo.cod} - ${alvo.nome} agora é fixo de ${alvo.setor}.` : "Solicitação negada.", "success");
    this.sync(true, true);
  },
  modalAvulsoResp(data, cod){
    const a = this.notif.avulsos.find(x => x.data === data && x.cod === cod); if(!a) return;
    UI.openModal(`<h3 style="margin-top:0;">Almoço avulso — ${this.h(a.setor)}</h3>
      <p>${this.pessoa(a.cod, a.nome)} almoçou no refeitório em ${this.br(a.data)} às ${this.h(a.hora)} sem estar na lista.</p>
      <div class="adm-form" style="grid-template-columns:1fr;">
        <div class="filter-group"><label>Você autorizou essa entrada avulsa?</label><div class="toggle-group" id="ar-aut"><button type="button" data-v="Sim">Sim</button><button type="button" data-v="Não">Não</button></div></div>
        <div class="filter-group"><label>Deseja solicitar a inclusão definitiva deste colaborador na lista fixa?</label><div class="toggle-group" id="ar-inc"><button type="button" data-v="Sim">Sim</button><button type="button" class="active" data-v="Não">Não</button></div></div>
        <div class="filter-group" id="ar-mot-box" style="display:none"><label for="ar-mot">Motivo da inclusão</label><textarea id="ar-mot" rows="2" placeholder="Por que ele deve almoçar no refeitório todos os dias?"></textarea></div>
      </div><div id="ar-msg"></div>
      <div class="adm-actions"><button class="btn btn-outline" onclick="UI.closeModal()">Depois</button><button class="btn btn-primary" id="ar-ok">Enviar resposta</button></div>`);
    const tg = id => { const g = document.getElementById(id); g.querySelectorAll("button").forEach(b => b.addEventListener("click", () => { g.querySelectorAll("button").forEach(x => x.classList.remove("active")); b.classList.add("active"); if(id === "ar-inc") document.getElementById("ar-mot-box").style.display = b.dataset.v === "Sim" ? "" : "none"; })); };
    tg("ar-aut"); tg("ar-inc");
    document.getElementById("ar-ok").addEventListener("click", async () => {
      const aut = (document.querySelector("#ar-aut .active") || {}).dataset; const inc = document.querySelector("#ar-inc .active").dataset.v === "Sim", mot = document.getElementById("ar-mot").value.trim(), msg = document.getElementById("ar-msg");
      if(!aut){ msg.innerHTML = `<div class="error-box" style="margin-top:12px;">Responda se você autorizou a entrada avulsa.</div>`; return; }
      if(inc && !mot){ msg.innerHTML = `<div class="error-box" style="margin-top:12px;">Informe o motivo da inclusão.</div>`; return; }
      const btn = document.getElementById("ar-ok"); btn.disabled = true; btn.textContent = "Enviando…";
      const r = await this.chamar({ acao: "refeit_avulso_responder", data: a.data, cod: a.cod, autorizou: aut.v, incluir: inc, motivo: mot });
      if(!r || !r.ok){ btn.disabled = false; btn.textContent = "Enviar resposta"; msg.innerHTML = `<div class="error-box" style="margin-top:12px;">${this.h((r && r.erro) || "Não foi possível enviar.")}</div>`; return; }
      UI.closeModal(); this.notif.avulsos = this.notif.avulsos.filter(x => x !== a); this.desenharNotif(true);
      toast(inc ? "Resposta registrada e solicitação de inclusão enviada aos aprovadores." : "Resposta registrada.", "success");
      this.sync(true, true);
    });
  },

  /* ------------------------------ Tab 2: Solicitar inclusão ------------------------------ */
  telaSol(corpo){
    if(!this.tem("Encarregado")){
      corpo.innerHTML = `<div class="panel"><h2 class="adm-h">Solicitar Inclusão</h2><div class="hint-box">Você é aprovador: as solicitações dos encarregados chegam em Notificações, no topo desta tela.</div></div>`; return;
    }
    const set = this.perfil.setores || [], unico = set.length === 1;
    const st = this.sol || {};
    corpo.innerHTML = `<div class="panel"><h2 class="adm-h">Solicitar Inclusão na lista fixa</h2>
      <p class="small-muted">Para incluir um colaborador de forma definitiva na lista do refeitório (exceções ou fora da janela padrão). ${this.perfil.aprovador ? "Como você é aprovador, a inclusão é aceita na hora." : "A solicitação vai para os aprovadores, que aceitam ou negam."}</p>
      <div class="adm-form">
        <label>Código<input type="text" inputmode="numeric" id="sl-cod" autocomplete="off" value="${this.h(st.cod || "")}"></label>
        <label>Nome<input type="text" id="sl-nome" autocomplete="off" value="${this.h(st.nome || "")}"></label>
        <label>Setor<select id="sl-setor">${unico ? "" : `<option value="">Selecione o setor</option>`}${set.map(s => `<option value="${this.h(s)}" ${st.setor === s ? "selected" : ""}>${this.h(s)}</option>`).join("")}</select></label>
        <label style="grid-column:1/-1">Motivo da inclusão<textarea id="sl-mot" rows="2" placeholder="Obrigatório">${this.h(st.mot || "")}</textarea></label>
      </div><div id="sl-msg"></div>
      <div class="adm-actions"><button class="btn btn-primary" id="sl-ok">Enviar solicitação</button></div></div>
      <div class="panel"><h3 class="adm-h">Minhas solicitações</h3><div class="table-wrap"><table class="adm-table"><thead><tr><th>Data</th><th>Colaborador</th><th>Setor</th><th>Motivo</th><th>Status</th></tr></thead><tbody>
        ${this.minhas.map(x => `<tr><td>${this.br((x.criado || "").slice(0, 10))}</td><td>${this.pessoa(x.cod, x.nome)}</td><td>${this.h(x.setor)}</td><td style="white-space:normal">${this.h(x.motivo)}</td>
          <td><span class="adm-tag ${x.status === "Aceita" ? "acc" : x.status === "Negada" ? "err" : "rep"}">${this.h(x.status)}</span></td></tr>`).join("") || `<tr><td colspan="5" class="small-muted">Você ainda não fez nenhuma solicitação.</td></tr>`}
      </tbody></table></div></div>`;
    this.carregarPessoas();
    const cd = document.getElementById("sl-cod"), nm = document.getElementById("sl-nome");
    cd.addEventListener("change", () => { const n = this.pessoas && this.pessoas[cd.value.replace(/\D/g, "")]; if(n && !nm.value) nm.value = n; });
    document.getElementById("sl-ok").addEventListener("click", async () => {
      const f = { cod: cd.value.replace(/\D/g, ""), nome: nm.value.trim(), setor: document.getElementById("sl-setor").value, motivo: document.getElementById("sl-mot").value.trim() }, msg = document.getElementById("sl-msg");
      if(!f.cod || !f.nome || !f.setor || !f.motivo){ msg.innerHTML = `<div class="error-box" style="margin-top:12px;">Preencha código, nome, setor e motivo.</div>`; return; }
      const btn = document.getElementById("sl-ok"); btn.disabled = true; btn.textContent = "Enviando…";
      const r = await this.chamar(Object.assign({ acao: "refeit_solicitar" }, f));
      btn.disabled = false; btn.textContent = "Enviar solicitação";
      if(!r || !r.ok){ msg.innerHTML = `<div class="error-box" style="margin-top:12px;">${this.h((r && r.erro) || "Não foi possível enviar.")}</div>`; return; }
      toast(r.status === "Aceita" ? "Colaborador incluído na lista fixa." : "Solicitação enviada aos aprovadores.", "success");
      this.sol = null; await this.sync(true, true); this.desenhar();
    });
  },

  /* ------------------------------ Tab 3: Histórico e indicadores ------------------------------ */
  telaHis(corpo){
    const H = this.his, hj = this.hojeIso();
    if(!H.ini){ H.ini = hj.slice(0, 8) + "01"; H.fim = hj; }
    const geral = this.perfil.geral;
    const setoresOp = (H.dados ? H.dados.setores : this.perfil.setores) || [];
    const encs = {}; Object.keys(this.encarregados).forEach(k => this.encarregados[k].forEach(e => { encs[e.mat] = e.nome; }));
    corpo.innerHTML = `<div class="panel"><div class="adm-head"><h2 class="adm-h">Histórico e Indicadores</h2><div class="panel-actions"><button class="btn btn-outline btn-sm" id="hs-atu">Atualizar</button></div></div>
      <div class="panel-actions rf-filtros">
        <div class="filter-group"><label for="hs-ini">Data inicial</label><input type="date" id="hs-ini" value="${H.ini}"></div>
        <div class="filter-group"><label for="hs-fim">Data final</label><input type="date" id="hs-fim" value="${H.fim}"></div>
        <div class="filter-group"><label>Atalhos</label><div class="toggle-group" id="hs-atalhos"><button type="button" data-a="mes">Mês atual</button><button type="button" data-a="ant">Mês anterior</button><button type="button" data-a="7">7 dias</button></div></div>
        <div class="filter-group"><label for="hs-setor">Setor</label><select id="hs-setor"><option value="">Todos${geral ? " os setores" : " os meus setores"}</option>${setoresOp.map(s => `<option value="${this.h(s)}" ${H.setor === s ? "selected" : ""}>${this.h(s)}</option>`).join("")}</select></div>
        ${geral ? `<div class="filter-group"><label for="hs-enc">Encarregado</label><select id="hs-enc"><option value="">Todos</option>${Object.keys(encs).sort((a, b) => encs[a].localeCompare(encs[b])).map(m => `<option value="${this.h(m)}" ${H.enc === m ? "selected" : ""}>${this.h(encs[m])}</option>`).join("")}</select></div>` : ""}
        <div class="filter-group"><label for="hs-q">Buscar colaborador</label><input type="search" id="hs-q" placeholder="Código ou nome" value="${this.h(H.busca)}"></div>
      </div></div><div id="hs-corpo"></div>`;
    const ir = () => { this.carregarHis(); };
    document.getElementById("hs-atu").addEventListener("click", () => { H.dados = null; ir(); });
    document.getElementById("hs-ini").addEventListener("change", e => { H.ini = e.target.value || H.ini; ir(); });
    document.getElementById("hs-fim").addEventListener("change", e => { H.fim = e.target.value || H.fim; ir(); });
    document.querySelectorAll("#hs-atalhos button").forEach(b => b.addEventListener("click", () => {
      const a = b.dataset.a, d = this.aData(hj);
      if(a === "mes"){ H.ini = hj.slice(0, 8) + "01"; H.fim = hj; }
      else if(a === "ant"){ const i = new Date(d.getFullYear(), d.getMonth() - 1, 1, 12), f = new Date(d.getFullYear(), d.getMonth(), 0, 12); H.ini = this.isoDe(i); H.fim = this.isoDe(f); }
      else { H.ini = this.soma(hj, -6); H.fim = hj; }
      document.getElementById("hs-ini").value = H.ini; document.getElementById("hs-fim").value = H.fim; ir();
    }));
    document.getElementById("hs-setor").addEventListener("change", e => { H.setor = e.target.value; this.desenharHis(); });
    const enc = document.getElementById("hs-enc"); if(enc) enc.addEventListener("change", e => { H.enc = e.target.value; this.desenharHis(); });
    document.getElementById("hs-q").addEventListener("input", e => { H.busca = e.target.value; const p = e.target.selectionStart; this.desenharHis(); const n = document.getElementById("hs-q"); n.focus(); try{ n.setSelectionRange(p, p); }catch(x){} });
    this.carregarHis();
  },
  async carregarHis(){
    const H = this.his;
    if(H.dados && H.ini >= H.dados.de && H.fim <= H.dados.ate){ this.desenharHis(); return; }
    H.carregando = true; H.erro = ""; this.desenharHis();
    const r = await this.chamar({ acao: "refeit_historico", ini: H.ini, fim: H.fim });
    H.carregando = false;
    if(!r || !r.ok) H.erro = (r && r.erro) || "Não foi possível carregar o histórico."; else H.dados = r;
    this.desenharHis();
  },
  desenharHis(){
    const box = document.getElementById("hs-corpo"); if(!box) return;
    const H = this.his;
    if(H.carregando && !H.dados){ box.innerHTML = `<div class="panel"><p class="small-muted">Carregando histórico…</p></div>`; return; }
    if(H.erro){ box.innerHTML = `<div class="panel"><div class="error-box">${this.h(H.erro)}</div><button class="btn btn-outline" id="hs-retry">Tentar novamente</button></div>`; document.getElementById("hs-retry").addEventListener("click", () => { H.erro = ""; this.carregarHis(); }); return; }
    if(!H.dados) return;
    const hj = H.dados.hoje, q = this.norm(H.busca);
    const setoresEnc = H.enc ? new Set(Object.keys(this.encarregados).filter(k => this.encarregados[k].some(e => e.mat === H.enc))) : null;
    const todas = H.dados.linhas.map(a => ({ data: a[0], cod: a[1], nome: a[2], setor: a[3], tipo: a[4], pres: a[5] === 1, hora: a[6], aut: a[7], inc: a[8] }))
      .filter(r => (!H.setor || this.norm(r.setor) === this.norm(H.setor)) && (!setoresEnc || setoresEnc.has(this.norm(r.setor))) && (!q || this.norm(r.cod + " " + r.nome).includes(q)));
    const res = rs => { const lib = rs.filter(r => r.tipo !== "Avulso"), alm = rs.filter(r => r.pres); return { lib: lib.length, alm: alm.length, aus: lib.filter(r => !r.pres).length, avu: rs.filter(r => r.tipo === "Avulso").length }; };
    const ontem = this.soma(hj, -1), mes0 = hj.slice(0, 8) + "01";
    const kHoje = res(todas.filter(r => r.data === hj)), kOntem = res(todas.filter(r => r.data === ontem)), kMes = res(todas.filter(r => r.data >= mes0 && r.data <= hj));
    const card = (t, k, sub) => `<div class="card"><div class="card-label">${t}</div><div class="card-value">${this.num(k.alm)} <span class="rf-de">almoçaram</span></div>
      <div class="card-sub"><strong style="color:${k.aus ? "var(--orange)" : "var(--green)"}">${this.num(k.aus)}</strong> liberado(s) que não almoçaram · ${this.pct(k.alm - k.avu, k.lib)}% de presença dos liberados</div>${sub ? `<div class="card-sub">${sub}</div>` : ""}</div>`;
    const per = todas.filter(r => r.data >= H.ini && r.data <= H.fim), kp = res(per);
    const avs = per.filter(r => r.tipo === "Avulso"), autS = avs.filter(r => r.aut === "Sim").length, autN = avs.filter(r => r.aut === "Não").length, semR = avs.length - autS - autN;
    // por setor
    const por = new Map(); per.forEach(r => { const k = r.setor; if(!por.has(k)) por.set(k, []); por.get(k).push(r); });
    const linhasSetor = Array.from(por.entries()).map(([s, rs]) => Object.assign({ setor: s }, res(rs))).sort((a, b) => b.alm - a.alm);
    // por dia
    const porDia = new Map(); per.forEach(r => { if(!porDia.has(r.data)) porDia.set(r.data, []); porDia.get(r.data).push(r); });
    const dias = Array.from(porDia.keys()).sort().slice(-31), maxD = Math.max(1, ...dias.map(d => porDia.get(d).length));
    const regs = per.slice().sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : String(a.nome).localeCompare(String(b.nome), "pt-BR")));
    const lim = H.verTudo ? regs.length : 200;
    box.innerHTML = `
      <div class="cards-grid">${card("Hoje · " + this.br2(hj), kHoje)}${card("Ontem · " + this.br2(ontem), kOntem)}${card("Acumulado do mês", kMes, `${this.num(kMes.alm)} refeições · ${this.num(kMes.aus)} ausências`)}</div>
      <div class="panel"><h3 class="adm-h">Período ${this.br(H.ini)} a ${this.br(H.fim)}</h3>
        <div class="cards-grid" style="margin-bottom:0">
          <div class="card"><div class="card-label">Refeições</div><div class="card-value">${this.num(kp.alm)}</div><div class="card-sub">${this.num(kp.lib)} liberados · ${this.num(kp.avu)} avulsos</div></div>
          <div class="card"><div class="card-label">Ausências</div><div class="card-value" style="color:${kp.aus ? "var(--orange)" : "inherit"}">${this.num(kp.aus)}</div><div class="card-sub">liberados que não almoçaram</div></div>
          <div class="card"><div class="card-label">Avulsos autorizados</div><div class="card-value">${this.num(autS)}</div><div class="card-sub">${this.num(autN)} não autorizados · ${this.num(semR)} sem resposta</div></div>
        </div></div>
      <div class="grid-2" style="grid-template-columns:1fr;">
        <div class="panel"><h3 class="adm-h">Por setor</h3><div class="table-wrap"><table class="adm-table"><thead><tr><th>Setor</th><th>Liberados</th><th>Almoçaram</th><th>Ausências</th><th>Avulsos</th><th>% presença</th></tr></thead><tbody>
          ${linhasSetor.map(l => `<tr><td><strong>${this.h(l.setor)}</strong></td><td>${this.num(l.lib)}</td><td>${this.num(l.alm)}</td><td>${l.aus ? `<span class="adm-tag err">${this.num(l.aus)}</span>` : "0"}</td><td>${this.num(l.avu)}</td><td>${this.pct(l.alm - l.avu, l.lib)}%</td></tr>`).join("") || `<tr><td colspan="6" class="small-muted">Sem registros no período e filtros escolhidos.</td></tr>`}</tbody></table></div></div>
        <div class="panel"><h3 class="adm-h">Dia a dia</h3>${dias.length ? dias.map(d => { const k = res(porDia.get(d)); return `<div class="rf-dia"><span class="rf-dia-l">${this.br2(d)} <span class="small-muted">${this.dsem(d).slice(0, 3)}</span></span>
            <div class="rf-bar"><div class="rf-bar-a" style="width:${Math.round(k.alm / maxD * 100)}%"></div><div class="rf-bar-b" style="width:${Math.round(k.aus / maxD * 100)}%"></div></div><span class="rf-dia-v">${k.alm} <span class="small-muted">/ ${k.aus} aus.</span></span></div>`; }).join("") + `<p class="small-muted" style="margin:8px 0 0">Azul: almoçaram · laranja: liberados que não almoçaram.</p>` : `<p class="small-muted">Sem registros no período.</p>`}</div>
        <div class="panel"><h3 class="adm-h">Auditoria de avulsos</h3><div class="table-wrap"><table class="adm-table"><thead><tr><th>Data</th><th>Colaborador</th><th>Setor</th><th>Encarregado</th><th>Autorizou?</th><th>Pediu inclusão?</th></tr></thead><tbody>
          ${avs.slice().sort((a, b) => a.data < b.data ? 1 : -1).map(r => `<tr><td>${this.br(r.data)} <span class="small-muted">${this.h(r.hora)}</span></td><td>${this.pessoa(r.cod, r.nome)}</td><td>${this.h(r.setor)}</td><td>${this.h(this.encNome(r.setor))}</td>
            <td>${r.aut === "Sim" ? `<span class="adm-tag acc">Sim</span>` : r.aut === "Não" ? `<span class="adm-tag err">Não</span>` : `<span class="adm-tag rep">Sem resposta</span>`}</td><td>${r.inc === "Sim" ? "Sim" : r.inc === "Não" ? "Não" : "—"}</td></tr>`).join("") || `<tr><td colspan="6" class="small-muted">Nenhum avulso no período.</td></tr>`}</tbody></table></div></div>
        <div class="panel"><h3 class="adm-h">Registros (${this.num(regs.length)})</h3><div class="table-wrap"><table class="adm-table"><thead><tr><th>Data</th><th>Código</th><th>Nome</th><th>Setor</th><th>Tipo</th><th>Situação</th><th>Horário</th></tr></thead><tbody>
          ${regs.slice(0, lim).map(r => `<tr><td>${this.br(r.data)}</td><td><strong>${this.h(r.cod)}</strong></td><td>${this.h(r.nome)}</td><td>${this.h(r.setor)}</td><td>${r.tipo === "Avulso" ? `<span class="adm-tag rep">Avulso</span>` : r.tipo === "Pontual" ? "Pontual" : "Fixo"}</td>
            <td>${r.pres ? `<span class="adm-tag acc">Almoçou no Refeitório STA</span>` : `<span class="adm-tag off">Não almoçou</span>`}</td><td>${r.pres ? this.h(r.hora) : "—"}</td></tr>`).join("") || `<tr><td colspan="7" class="small-muted">Sem registros no período e filtros escolhidos.</td></tr>`}</tbody></table></div>
          ${regs.length > lim ? `<button class="btn btn-outline btn-sm" id="hs-mais" style="margin-top:10px">Ver todos os ${this.num(regs.length)} registros</button>` : ""}</div>
      </div>`;
    const m = document.getElementById("hs-mais"); if(m) m.addEventListener("click", () => { H.verTudo = true; this.desenharHis(); });
  },

  /* ------------------------------ Tab 4: Cardápio e adesão ------------------------------ */
  segunda(iso){ const d = this.aData(iso), w = d.getDay(); return this.soma(iso, w === 0 ? -6 : 1 - w); },
  telaCar(corpo){
    const C = this.car; if(!C.semana) C.semana = this.segunda(this.hojeIso());
    corpo.innerHTML = `<div id="cd-corpo"><div class="panel"><p class="small-muted">Carregando cardápio…</p></div></div>`;
    this.carregarCar(!C.dados);
  },
  async carregarCar(buscar){
    const C = this.car;
    if(buscar){
      const hj = this.hojeIso();
      const r = await this.chamar({ acao: "refeit_cardapio_ler", ini: this.soma(hj, -120), fim: this.soma(hj, 60) });
      if(!r || !r.ok){ C.erro = (r && r.erro) || "Não foi possível carregar o cardápio."; C.dados = null; } else { C.erro = ""; C.dados = r; }
    }
    this.desenharCar();
  },
  desenharCar(){
    const box = document.getElementById("cd-corpo"); if(!box) return;
    const C = this.car;
    if(C.erro){ box.innerHTML = `<div class="panel"><div class="error-box">${this.h(C.erro)}</div><button class="btn btn-outline" id="cd-retry">Tentar novamente</button></div>`; document.getElementById("cd-retry").addEventListener("click", () => this.carregarCar(true)); return; }
    const D = C.dados; if(!D) return;
    const hj = D.hoje, dias = [0, 1, 2, 3, 4].map(i => this.soma(C.semana, i));
    const adesao = d => { const a = D.adesao[d]; return a ? { alm: a.almocaram, tot: a.liberados + a.avulsos, av: a.avulsos, lib: a.liberados } : null; };
    const cards = dias.map(d => {
      const its = D.itens.filter(i => i.data === d), a = adesao(d);
      return `<div class="panel rf-cd ${d === hj ? "hoje" : ""}"><div class="adm-head"><h3 class="adm-h" style="margin:0">${this.dsem(d).replace(/^./, c => c.toUpperCase())} <span class="small-muted">${this.br2(d)}</span></h3>
        <button type="button" class="btn btn-outline btn-sm" data-cd-novo="${d}">＋ Prato</button></div>
        ${its.map(i => `<div class="rf-prato"><div><strong>${this.h(i.prato)}</strong>${i.acomp ? `<div class="small-muted">${this.h(i.acomp)}</div>` : ""}${i.obs ? `<div class="small-muted">${this.h(i.obs)}</div>` : ""}</div>
          <button type="button" class="rf-rem" data-cd-ed="${this.h(i.id)}">editar</button></div>`).join("") || `<p class="small-muted" style="margin:6px 0">Cardápio ainda não cadastrado.</p>`}
        ${a ? `<div class="rf-ad"><span class="adm-tag acc">${this.num(a.alm)} almoçaram</span> <span class="small-muted">de ${this.num(a.lib)} liberados + ${this.num(a.av)} avulsos · ${this.pct(a.alm, a.tot)}% de adesão</span></div>` : ""}</div>`;
    }).join("");
    // adesão por prato (dias que já passaram, com registros)
    const por = new Map();
    D.itens.forEach(i => { const a = adesao(i.data); if(!a || !a.tot || i.data > hj) return; const k = this.norm(i.prato); if(!por.has(k)) por.set(k, { prato: i.prato, dias: 0, alm: 0, tot: 0 }); const p = por.get(k); p.dias++; p.alm += a.alm; p.tot += a.tot; });
    const rank = Array.from(por.values()).map(p => Object.assign(p, { media: Math.round(p.alm / p.dias), adesao: this.pct(p.alm, p.tot) })).sort((a, b) => b.adesao - a.adesao);
    box.innerHTML = `<div class="panel"><div class="adm-head"><h2 class="adm-h">Cardápio semanal</h2>
        <div class="panel-actions"><button type="button" class="btn btn-outline btn-sm" id="cd-ant">← Semana anterior</button><span class="small-muted">${this.br(dias[0])} a ${this.br(dias[4])}</span><button type="button" class="btn btn-outline btn-sm" id="cd-prox">Próxima semana →</button><button type="button" class="btn btn-outline btn-sm" id="cd-hoje">Esta semana</button></div></div></div>
      <div class="rf-semana">${cards}</div>
      <div class="panel"><h3 class="adm-h">Adesão por prato</h3><p class="small-muted">Almoçaram ÷ (liberados + avulsos) nos dias em que o prato foi servido. Dias com mais de um prato contam para todos os pratos do dia.</p>
        <div class="table-wrap"><table class="adm-table"><thead><tr><th>Prato</th><th>Dias servido</th><th>Média de pessoas</th><th>Adesão</th></tr></thead><tbody>
        ${rank.map(p => `<tr><td><strong>${this.h(p.prato)}</strong></td><td>${p.dias}</td><td>${this.num(p.media)}</td><td><div class="rf-bar" style="min-width:90px"><div class="rf-bar-a" style="width:${Math.min(100, p.adesao)}%"></div></div> ${p.adesao}%</td></tr>`).join("") || `<tr><td colspan="4" class="small-muted">Ainda não há dias passados com cardápio e presenças registradas.</td></tr>`}</tbody></table></div></div>`;
    document.getElementById("cd-ant").addEventListener("click", () => { C.semana = this.soma(C.semana, -7); this.desenharCar(); });
    document.getElementById("cd-prox").addEventListener("click", () => { C.semana = this.soma(C.semana, 7); this.desenharCar(); });
    document.getElementById("cd-hoje").addEventListener("click", () => { C.semana = this.segunda(hj); this.desenharCar(); });
    box.querySelectorAll("[data-cd-novo]").forEach(b => b.addEventListener("click", () => this.modalPrato(b.dataset.cdNovo, null)));
    box.querySelectorAll("[data-cd-ed]").forEach(b => b.addEventListener("click", () => this.modalPrato(null, D.itens.find(i => i.id === b.dataset.cdEd))));
  },
  modalPrato(data, it){
    UI.openModal(`<h3 style="margin-top:0;">${it ? "Editar prato" : "Novo prato"}</h3>
      <div class="adm-form"><label>Data<input type="date" id="cp-data" value="${this.h(it ? it.data : data)}"></label>
        <label>Prato principal<input type="text" id="cp-prato" value="${this.h(it ? it.prato : "")}" autocomplete="off"></label>
        <label>Acompanhamentos<input type="text" id="cp-acomp" value="${this.h(it ? it.acomp : "")}" autocomplete="off"></label>
        <label>Observação<input type="text" id="cp-obs" value="${this.h(it ? it.obs : "")}" autocomplete="off"></label></div><div id="cp-msg"></div>
      <div class="adm-actions">${it ? `<button class="btn btn-outline" id="cp-del">Excluir</button>` : ""}<button class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button><button class="btn btn-primary" id="cp-ok">Salvar</button></div>`);
    const salvar = async (extra, btn, okMsg) => {
      const txt = btn.textContent; btn.disabled = true; btn.textContent = "Salvando…";
      const r = await this.chamar(Object.assign({ acao: "refeit_cardapio_salvar", id: it ? it.id : "", data: document.getElementById("cp-data").value, prato: document.getElementById("cp-prato").value, acomp: document.getElementById("cp-acomp").value, obs: document.getElementById("cp-obs").value }, extra));
      if(!r || !r.ok){ btn.disabled = false; btn.textContent = txt; document.getElementById("cp-msg").innerHTML = `<div class="error-box" style="margin-top:12px;">${this.h((r && r.erro) || "Não foi possível salvar.")}</div>`; return; }
      UI.closeModal(); toast(okMsg, "success"); this.carregarCar(true);
    };
    document.getElementById("cp-ok").addEventListener("click", e => salvar({}, e.currentTarget, "Cardápio salvo."));
    const del = document.getElementById("cp-del"); if(del) del.addEventListener("click", e => salvar({ excluir: true }, e.currentTarget, "Prato excluído."));
  },

  /* ------------------------------ ligação com os menus ------------------------------ */
  renderLiberacoes(){ this.abrir("lrefeitorio"); },
  /** Chegada pelo lembrete (push): abre a pré-liberação de hoje */
  irRevisar(){
    if(!Auth.user || !Auth.can("lancamentos", "lrefeitorio")) return;
    this.proxTab = "lib"; this.proxSub = "pre"; this.dataSel = null;
    if(UI.currentPane === "lrefeitorio" && UI.currentView === "lancamentos") this.abrir("lrefeitorio"); else UI.goTo("lancamentos", "lrefeitorio");
  },
  renderHistorico(){ this.abrir("hrefeitorio"); }
};
window.RefeitUI = RefeitUI;
/* Link do lembrete (?ir=refeitorio) e clique na notificação com o aplicativo já aberto */
(function(){
  try{
    const ir = new URLSearchParams(location.search).get("ir");
    if(ir === "refeitorio"){
      let n = 0;
      const t = setInterval(() => {
        n++;
        const pronto = window.Auth && Auth.user && window.APP_STATE && APP_STATE.ready && !document.body.classList.contains("locked");
        if(pronto || n > 90){ clearInterval(t); if(Auth.user) RefeitUI.irRevisar(); try{ history.replaceState(null, "", location.pathname); }catch(e){} }
      }, 500);
    }
    if("serviceWorker" in navigator) navigator.serviceWorker.addEventListener("message", e => { if(e.data && e.data.tipo === "ir" && e.data.ir === "refeitorio") RefeitUI.irRevisar(); });
  }catch(e){}
})();

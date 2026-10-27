/* =========================================================================
   Núcleo Reposição — Sistema de design (tema claro/escuro, ícones, movimento,
   avisos, boas-vindas e menu recolhível).
   Carrega ANTES do app.js; só depende dele em tempo de execução.
   ========================================================================= */

/* ---------------------------------------------------------------------- */
/* Ícones de linha (24x24, traço 1.75) — minimalistas, herdam a cor do texto */
/* ---------------------------------------------------------------------- */
const Icons = {
  paths: {
    chart: '<path d="M4 4v16h16"/><path d="M8.5 16v-4.5"/><path d="M13 16V8"/><path d="M17.5 16v-6.5"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    sliders: '<path d="M21 6h-8"/><path d="M9 6H3"/><circle cx="11" cy="6" r="2"/><path d="M21 12h-3"/><path d="M14 12H3"/><circle cx="16" cy="12" r="2"/><path d="M21 18h-9"/><path d="M8 18H3"/><circle cx="10" cy="18" r="2"/>',
    bell: '<path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.5-3.5L3 10"/><path d="M3 4v6h6"/><path d="M4 13a8 8 0 0 0 14.5 3.5L21 14"/><path d="M21 20v-6h-6"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    download: '<path d="M12 4v11"/><path d="m7 11 5 5 5-5"/><path d="M5 20h14"/>',
    image: '<rect x="3.5" y="4" width="17" height="16" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m20.5 16-5-5L6 20"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    chevrons: '<path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/>',
    caret: '<path d="m6 9 6 6 6-6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8"/><path d="M18.5 14.2a6.5 6.5 0 0 1 3 5.8"/>',
    factory: '<path d="M3 21V9l6 4V9l6 4V5h6v16z"/><path d="M8 17h2M14 17h2"/>',
    trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    alert: '<path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>',
    gauge: '<path d="m12 14 4-4"/><path d="M3.3 17a9 9 0 1 1 17.4 0"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    cube: '<path d="m12 3 8.5 4.8v8.4L12 21l-8.5-4.8V7.8z"/><path d="m3.5 7.8 8.5 4.9 8.5-4.9"/><path d="M12 12.7V21"/>',
    message: '<path d="M21 12a8 8 0 0 1-11.7 7L4 20l1.2-4.4A8 8 0 1 1 21 12z"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9z"/><path d="m9 14 2 2 4-4"/>',
    shield: '<path d="M12 3 4.5 6v6c0 4.5 3.2 7.6 7.5 9 4.3-1.4 7.5-4.5 7.5-9V6z"/><path d="m9 12 2 2 4-4"/>',
    coins: '<circle cx="12" cy="12" r="9"/><path d="M14.8 9.4c-.5-.9-1.5-1.400-2.800-1.400-1.600 0-2.700.8-2.700 1.900 0 2.800 5.500 1.400 5.500 4.200 0 1.200-1.100 2-2.800 2-1.400 0-2.400-.6-2.900-1.600"/><path d="M12 6v2M12 16v2"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
    repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
    network: '<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/><rect x="15" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M6 16v-4h12v4"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    database: '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.700 3.600 3 8 3s8-1.300 8-3v-13"/><path d="M4 12c0 1.700 3.600 3 8 3s8-1.300 8-3"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m10.800 12.200 9.200-9.200M17 6l3 3M14.500 8.500l2 2"/>',
    link: '<path d="M10 14a4.500 4.500 0 0 0 6.400 0l3-3a4.500 4.500 0 0 0-6.400-6.400l-1 1"/><path d="M14 10a4.500 4.500 0 0 0-6.400 0l-3 3a4.500 4.500 0 0 0 6.400 6.400l1-1"/>',
    alertc: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><path d="M12 16.500h.01"/>',
    check: '<path d="m5 12.500 4.500 4.500L19 7.500"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8.500 14a4.500 4.500 0 0 0 7 0"/><path d="M9 9.500h.01M15 9.500h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.500-3.500"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.400 15a1.700 1.700 0 0 0 .3 1.800l.1.1a2 2 0 1 1-2.800 2.800l-.1-.1a1.700 1.700 0 0 0-1.800-.3 1.700 1.700 0 0 0-1 1.500V21a2 2 0 1 1-4 0v-.1a1.700 1.700 0 0 0-1-1.500 1.700 1.700 0 0 0-1.800.3l-.1.1a2 2 0 1 1-2.800-2.800l.1-.1a1.700 1.700 0 0 0 .3-1.800 1.700 1.700 0 0 0-1.500-1H3a2 2 0 1 1 0-4h.1a1.700 1.700 0 0 0 1.500-1 1.700 1.700 0 0 0-.3-1.800l-.1-.1a2 2 0 1 1 2.800-2.800l.1.1a1.700 1.700 0 0 0 1.800.3h0a1.700 1.700 0 0 0 1-1.500V3a2 2 0 1 1 4 0v.1a1.700 1.700 0 0 0 1 1.500h0a1.700 1.700 0 0 0 1.800-.3l.1-.1a2 2 0 1 1 2.800 2.800l-.1.100a1.700 1.700 0 0 0-.3 1.800v0a1.700 1.700 0 0 0 1.500 1H21a2 2 0 1 1 0 4h-.1a1.700 1.700 0 0 0-1.500 1z"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    dot: '<circle cx="12" cy="12" r="2.500"/>'
  },
  svg(nome, tam){
    const p = this.paths[nome] || this.paths.dot;
    const s = tam ? ` width="${tam}" height="${tam}"` : "";
    return `<svg viewBox="0 0 24 24"${s} fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${p}</svg>`;
  },
  /** ícone de cada categoria / sub aba do menu */
  nav: {
    indicadores:"chart", gestao:"compass", lancamentos:"pen", admin:"sliders",
    producao:"factory", projecao:"trend", individual:"user", avaria:"alert", operadores:"users", relacoes:"file",
    capacidade:"gauge", abastecimento:"layers", cd3d:"cube",
    feedbacks:"message", quadro:"users", chamada:"clipboard", auditoria:"shield", comissao:"coins", cronograma:"calendar",
    turnover:"repeat", ferias:"sun", organograma:"network",
    lfeedback:"message", ladvertencia:"alertc", lavaria:"alert", lchamada:"clipboard", lquadro:"users", lmissoes:"target",
    lcapacidade:"gauge", lferias:"sun",
    bases:"database", acessos:"key", links:"link"
  },
  forNav(id, tam){ return this.svg(this.nav[id] || "dot", tam); },
  /** troca <span data-ic="nome"> por svg (e mantém o que já foi trocado) */
  hidratar(raiz){
    (raiz || document).querySelectorAll("[data-ic]").forEach(el=>{
      const n = el.getAttribute("data-ic");
      if(el.dataset.icOk === n) return;
      el.innerHTML = this.svg(n); el.dataset.icOk = n; if(el.tagName !== "BUTTON") el.classList.add("ic");
    });
  }
};
window.Icons = Icons;

/* ---------------------------------------------------------------------- */
/* Design: tema, avisos, boas-vindas, menu recolhível, estado de carregando */
/* ---------------------------------------------------------------------- */
const APELIDOS = { "10003993": "Nyckolas" };   // como cada pessoa prefere ser chamada (matrícula → nome)

const Design = {
  /* ------------------------------ tema ------------------------------ */
  tema(){ return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"; },
  escuro(){ return this.tema() === "dark"; },
  aplicarTema(t, salvar){
    const html = document.documentElement;
    html.classList.add("theme-switching");
    html.setAttribute("data-theme", t);
    if(salvar){ try{ localStorage.setItem("nucleo_tema", t); }catch(e){} }
    const meta = document.querySelector('meta[name="theme-color"]'); if(meta) meta.setAttribute("content", t === "dark" ? "#0e1521" : "#ffffff");
    this.sincronizarTema();
    this.configurarGraficos();
    clearTimeout(this._tt); this._tt = setTimeout(()=> html.classList.remove("theme-switching"), 450);
  },
  alternarTema(){
    this.aplicarTema(this.escuro() ? "light" : "dark", true);
    this.redesenhar();
    this.toast(this.escuro() ? "Modo escuro ativado" : "Modo claro ativado", "info", { duracao:1800, icone: this.escuro() ? "moon" : "sun" });
  },
  sincronizarTema(){
    const esc = this.escuro();
    document.querySelectorAll("[data-theme-sw]").forEach(b=> b.setAttribute("aria-checked", esc ? "true" : "false"));
    document.querySelectorAll("[data-theme-ic]").forEach(el=>{ el.innerHTML = Icons.svg(esc ? "moon" : "sun"); });
    document.querySelectorAll("[data-theme-tx]").forEach(el=>{ el.textContent = esc ? "Modo escuro" : "Modo claro"; });
    // logos: arquivo branco sobre fundo escuro, colorido sobre fundo claro
    const logo = esc ? "logo-branco.png" : "logo.png";
    const h = document.getElementById("header-logo"); if(h) h.setAttribute("src", logo);
    const l = document.getElementById("login-logo"); if(l && !l.dataset.fixo) l.setAttribute("src", logo);
    const e = document.getElementById("empty-logo"); if(e && !e.dataset.fixo) e.setAttribute("src", logo);
  },
  /** cores usadas pelos gráficos (Chart.js) em cada tema */
  cores(){
    return this.escuro()
      ? { texto:"#c5d1e3", suave:"#93a3bb", grade:"#26334a", rotulo:"#dbe7f7", tooltip:"#0a111c" }
      : { texto:"#4a5568", suave:"#7a8798", grade:"#eaeef3", rotulo:"#123A6B", tooltip:"#123a6b" };
  },
  configurarGraficos(){
    if(typeof Chart === "undefined" || !Chart.defaults) return;
    const c = this.cores();
    Chart.defaults.color = c.texto;
    Chart.defaults.borderColor = c.grade;
  },
  /** refaz a tela atual (gráficos e HTML gerado em JS pegam as cores do tema novo) */
  redesenhar(){
    try{
      if(window.APP_STATE && APP_STATE.ready && typeof UI !== "undefined" && UI.switchPane && UI.currentPane) UI.switchPane(UI.currentPane);
    }catch(e){ console.warn("Falha ao redesenhar após trocar o tema:", e); }
  },
  /** exportações (PNG/PDF) saem sempre no tema claro, qualquer que seja o tema da tela */
  async emTemaClaro(fn){
    if(!this.escuro()) return fn();
    this.aplicarTema("light", false); this.redesenhar();
    await new Promise(r=> requestAnimationFrame(()=> requestAnimationFrame(r)));
    await new Promise(r=> setTimeout(r, 350));
    try{ return await fn(); }
    finally{ this.aplicarTema("dark", false); this.redesenhar(); }
  },

  /* ------------------------------ avisos ------------------------------ */
  _caixa(){
    let c = document.getElementById("toasts");
    if(!c){ c = document.createElement("div"); c.id = "toasts"; c.setAttribute("aria-live", "polite"); document.body.appendChild(c); }
    return c;
  },
  /**
   * toast(mensagem, tipo, { sub, duracao, icone, acao:{rotulo, fn} })
   * tipo: success | error | info | welcome
   */
  toast(msg, tipo, o){
    o = o || {}; tipo = tipo || "info";
    const caixa = this._caixa();
    const icone = o.icone || ({ success:"check", error:"alertc", welcome:"smile", info:"info" }[tipo] || "info");
    const dur = o.duracao || ({ error:7000, welcome:5200, success:4200 }[tipo] || 3600);
    const el = document.createElement("div");
    el.className = "tst tst-" + tipo; el.setAttribute("role", tipo === "error" ? "alert" : "status");
    el.style.setProperty("--dur", dur + "ms");
    el.innerHTML = `<span class="tst-ic">${Icons.svg(icone)}</span>
      <div class="tst-tx"><div class="tst-t">${escapeHtml(String(msg))}</div>${o.sub ? `<div class="tst-s">${escapeHtml(String(o.sub))}</div>` : ""}${o.acao ? `<button type="button" class="tst-a">${escapeHtml(o.acao.rotulo)}</button>` : ""}</div>
      <button type="button" class="tst-x" aria-label="Fechar">${Icons.svg("x")}</button><span class="tst-bar"></span>`;
    const fechar = ()=>{
      if(el._fechando) return; el._fechando = true; clearTimeout(el._t);
      el.classList.add("saindo"); setTimeout(()=> el.remove(), 260);
    };
    el.querySelector(".tst-x").addEventListener("click", fechar);
    if(o.acao) el.querySelector(".tst-a").addEventListener("click", ()=>{ fechar(); try{ o.acao.fn(); }catch(e){} });
    el.addEventListener("mouseenter", ()=>{ clearTimeout(el._t); el.classList.add("pausado"); });
    el.addEventListener("mouseleave", ()=>{ el.classList.remove("pausado"); el._t = setTimeout(fechar, 1600); });
    // máximo de 4 avisos empilhados
    while(caixa.children.length >= 4) caixa.firstElementChild.remove();
    caixa.appendChild(el);
    el._t = setTimeout(fechar, dur);
    return el;
  },

  /* ------------------------------ boas-vindas ------------------------------ */
  nomeCurto(){
    const u = (typeof Auth !== "undefined" && Auth.user) || {};
    if(u.matricula && APELIDOS[String(u.matricula)]) return APELIDOS[String(u.matricula)];
    const p = String(u.nome || "").trim().split(/\s+/)[0] || "";
    return p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : "";
  },
  saudacao(){ const h = new Date().getHours(); return h < 12 ? "Bom dia" : (h < 18 ? "Boa tarde" : "Boa noite"); },
  boasVindas(){
    const nome = this.nomeCurto();
    const ola = nome ? `Olá, ${nome}!` : "Olá!";
    const h = document.getElementById("empty-hello"); if(h) h.textContent = ola;
    if(this._saudou === nome) return; this._saudou = nome;
    this.toast(ola, "welcome", { sub: `${this.saudacao()}! Buscando os dados mais recentes…` });
  },

  /* ------------------------------ menu recolhível ------------------------------ */
  menuRecolhido(){ return document.body.classList.contains("sb-collapsed"); },
  recolherMenu(sim, salvar){
    document.body.classList.toggle("sb-collapsed", !!sim);
    const b = document.getElementById("sb-collapse"); if(b){ b.setAttribute("aria-expanded", sim ? "false" : "true"); b.title = sim ? "Expandir menu" : "Recolher menu"; }
    if(salvar){ try{ localStorage.setItem("nucleo_menu", sim ? "1" : "0"); }catch(e){} }
    // gráficos medem a largura do contêiner: recalcula depois da transição
    setTimeout(()=>{ try{ if(typeof Charts !== "undefined") Charts.resizeAll(); }catch(e){} }, 320);
  },

  /* ------------------------------ carregando / ocupado ------------------------------ */
  /** botão ocupado: gira o ícone, troca o texto e bloqueia cliques repetidos */
  ocupado(btn, sim, texto){
    if(!btn) return;
    if(sim){
      if(btn.classList.contains("is-busy")) return;
      btn.classList.add("is-busy"); btn.disabled = true;
      const tx = btn.querySelector(".btn-tx, .sb-lbl, .lbl");
      if(tx){ btn._tx = tx.textContent; if(texto) tx.textContent = texto; }
      else if(!btn.querySelector(".ic")){ btn._txt = btn.textContent; if(texto) btn.textContent = texto; }
    } else {
      btn.classList.remove("is-busy"); btn.disabled = false;
      const tx = btn.querySelector(".btn-tx, .sb-lbl, .lbl");
      if(tx && btn._tx != null){ tx.textContent = btn._tx; btn._tx = null; }
      if(btn._txt != null){ btn.textContent = btn._txt; btn._txt = null; }
    }
  },
  ocupadoAtualizar(sim){
    ["btn-refresh-online","sb-refresh","btn-empty-online"].forEach(id=> this.ocupado(document.getElementById(id), sim, "Atualizando…"));
  },
  /** chip “Atualizado às 14:32” no cabeçalho */
  marcarAtualizacao(origem){
    const chip = document.getElementById("last-update"), tx = document.getElementById("last-update-tx");
    if(!chip || !tx) return;
    const h = new Date().toLocaleTimeString("pt-BR", { hour:"2-digit", minute:"2-digit" });
    tx.textContent = (origem === "arquivo" ? "Arquivo · " : "Atualizado ") + h;
    chip.style.display = "";
    chip.classList.remove("flash"); void chip.offsetWidth; chip.classList.add("flash");
  },

  /* ------------------------------ movimento expressivo ------------------------------ */
  reduzirMovimento(){ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } },
  movimento(){
    // 1) onda no ponto do clique
    const alvos = ".btn, .sb-group-btn, .sb-foot-btn, .sb-theme, .toggle-group button, .subnav-btn, .nav-btn, .icon-btn";
    document.addEventListener("pointerdown", e=>{
      if(this.reduzirMovimento() || e.button > 0) return;
      const el = e.target.closest && e.target.closest(alvos);
      if(!el || el.disabled) return;
      const r = el.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.2;
      const o = document.createElement("span"); o.className = "rpl";
      o.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d/2}px;top:${e.clientY - r.top - d/2}px`;
      el.appendChild(o); setTimeout(()=> o.remove(), 760);
    }, { passive:true });

    // 2) menu recolhido: clicar numa aba expande o menu (com o efeito) e já abre o grupo
    const grupos = document.getElementById("sb-groups");
    if(grupos) grupos.addEventListener("click", e=>{
      const b = e.target.closest && e.target.closest(".sb-group-btn");
      if(!b || !this.menuRecolhido()) return;
      b.parentElement.classList.remove("open");      // o app.js alterna em seguida e deixa aberto
      this.recolherMenu(false, true);
    }, true);

    // 3) barra de progresso da página + sombra no cabeçalho
    let prog = document.getElementById("scroll-prog");
    if(!prog){ prog = document.createElement("div"); prog.id = "scroll-prog"; document.body.appendChild(prog); }
    const hdr = document.getElementById("app-header"); let tick = false;
    const atualizar = ()=>{
      tick = false;
      const max = document.documentElement.scrollHeight - innerHeight, y = window.scrollY;
      prog.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      prog.classList.toggle("on", y > 24 && max > 120);
      if(hdr) hdr.classList.toggle("scrolled", y > 6);
    };
    addEventListener("scroll", ()=>{ if(!tick){ tick = true; requestAnimationFrame(atualizar); } }, { passive:true });
    atualizar();

    // 4) rolagem suave com inércia (roda do mouse): a página desce aos poucos
    if(!this.reduzirMovimento() && !matchMedia("(pointer: coarse)").matches){
      let alvo = 0, atual = 0, raf = 0;
      const passo = ()=>{
        atual += (alvo - atual) * 0.14;
        if(Math.abs(alvo - atual) < 0.6){ atual = alvo; scrollTo(0, atual); raf = 0; return; }
        scrollTo(0, atual); raf = requestAnimationFrame(passo);
      };
      addEventListener("wheel", e=>{
        if(e.ctrlKey || e.defaultPrevented || e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        if(document.body.classList.contains("locked") || document.querySelector(".modal-overlay.show, #flow-overlay-root.show")) return;
        // deixa rolar sozinho o que tem rolagem própria (tabelas, listas, menu lateral, janelas)
        for(let el = e.target; el && el !== document.body && el.nodeType === 1; el = el.parentElement){
          const oy = getComputedStyle(el).overflowY;
          if((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 1){
            const sobe = e.deltaY < 0;
            if((sobe && el.scrollTop > 0) || (!sobe && el.scrollTop + el.clientHeight < el.scrollHeight - 1)) return;
          }
          if(getComputedStyle(el).position === "fixed") return;
        }
        let dy = e.deltaY; if(e.deltaMode === 1) dy *= 32; else if(e.deltaMode === 2) dy *= innerHeight;
        if(!raf){ atual = window.scrollY; alvo = atual; }
        alvo = Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, alvo + dy));
        e.preventDefault();
        if(!raf) raf = requestAnimationFrame(passo);
      }, { passive:false });
      // barra de rolagem arrastada / teclado: abandona a animação em curso
      addEventListener("keydown", ()=>{ if(raf){ cancelAnimationFrame(raf); raf = 0; } }, true);
      addEventListener("pointerdown", ()=>{ if(raf){ cancelAnimationFrame(raf); raf = 0; } }, true);
    }

    // 5) janelas criadas pelo código (fora do modal padrão) também entram em "pop"
    new MutationObserver(ms=> ms.forEach(m=> m.addedNodes.forEach(n=>{
      if(n.nodeType === 1 && n.parentNode === document.body && n.style && /position:\s*fixed/.test(n.style.cssText) && /inset:\s*0/.test(n.style.cssText) && /z-index:\s*(9999|2500)/.test(n.style.cssText)) n.classList.add("pop-in");
    }))).observe(document.body, { childList:true });
  },

  /* ------------------------------ inicialização ------------------------------ */
  iniciar(){
    Icons.hidratar();
    // menu recolhido: lembra a escolha (computador)
    let rec = false; try{ rec = localStorage.getItem("nucleo_menu") === "1"; }catch(e){}
    this.recolherMenu(rec, false);
    document.querySelectorAll("[data-theme-toggle]").forEach(b=> b.addEventListener("click", ()=> this.alternarTema()));
    const col = document.getElementById("sb-collapse"); if(col) col.addEventListener("click", ()=> this.recolherMenu(!this.menuRecolhido(), true));
    this.sincronizarTema();
    this.configurarGraficos();
    // acompanha mudança do tema do sistema enquanto a pessoa não escolheu manualmente
    try{
      matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e=>{
        let salvo = null; try{ salvo = localStorage.getItem("nucleo_tema"); }catch(x){}
        if(!salvo){ this.aplicarTema(e.matches ? "dark" : "light", false); this.redesenhar(); }
      });
    }catch(e){}
    document.addEventListener("loginOk", ()=> this.boasVindas());
    if(typeof Auth !== "undefined" && Auth.user && !document.body.classList.contains("locked")) this.boasVindas();
    this.movimento();
    this.ligarApp();
  },
  /** liga o que depende de objetos do app.js (carregado depois deste arquivo) */
  ligarApp(){
    const tentar = ()=>{
      if(typeof Export === "undefined" || typeof UI === "undefined"){ return setTimeout(tentar, 50); }
      if(UI.__designLigado) return; UI.__designLigado = true;
      // exportações sempre no tema claro
      ["toPNG","toPDF"].forEach(m=>{
        const o = Export[m]; if(typeof o !== "function") return;
        Export[m] = function(){ const a = arguments; return Design.emTemaClaro(()=> o.apply(Export, a)); };
      });
      // PDF de feedback por funcionário: gráficos e documento sempre em tema claro
      if(typeof FeedbackDoc !== "undefined" && FeedbackDoc.generateMultiple){
        const g = FeedbackDoc.generateMultiple;
        FeedbackDoc.generateMultiple = function(){ const a = arguments; return Design.emTemaClaro(()=> g.apply(FeedbackDoc, a)); };
      }
      // janela padrão: "pop" ao abrir e ao fechar (espera a animação de saída antes de esconder)
      const ov = ()=> document.getElementById("modal-overlay");
      const abrir = UI.openModal, fechar = UI.closeModal; let tFecha = 0;
      UI.openModal = function(){
        clearTimeout(tFecha); const o = ov(); if(o) o.classList.remove("fechando");
        return abrir.apply(UI, arguments);
      };
      UI.closeModal = function(){
        const o = ov();
        if(!o || !o.classList.contains("show") || o.classList.contains("fechando") || Design.reduzirMovimento()) return fechar.apply(UI, arguments);
        o.classList.add("fechando");
        tFecha = setTimeout(()=>{ o.classList.remove("fechando"); fechar.call(UI); }, 190);
      };
      // botões de atualizar mostram "Atualizando…" durante qualquer carga
      const imp = UI.importar;
      UI.importar = async function(){
        Design.ocupadoAtualizar(true);
        try{ return await imp.apply(UI, arguments); }
        finally{ Design.ocupadoAtualizar(false); }
      };
    };
    tentar();
  }
};
window.Design = Design;

if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", ()=> Design.iniciar());
else Design.iniciar();

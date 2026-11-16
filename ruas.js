/* Núcleo Reposição — Gestão > Atribuição Ruas
   Mapa 2D (visão de cima) do CD, ruas 1 a 49: 1–31 no eixo central (da esquerda para a direita), 41–49 no bloco de cima e 32–40 no bloco de baixo.
   · clique seleciona (várias ruas; Shift+clique seleciona faixa) · botão direito atribui repositor às ruas selecionadas
   · cada rua mostra o repositor, % qualidade retornos, ruas e geral dele e a produção média (O.S. 58 por dia trabalhado)
   · tudo que muda é gravado no Apps Script: estado atual + histórico (data e hora) na planilha de dados e cópia na Quadro_Repositores. */
const RuasUI = {
  W:1760, H:1090, MIN:1, MAX:49,
  estado:{}, pessoas:[], hist:[], sel:new Set(), ancora:null,
  periodo:"mes", colorir:"repositor", zoom:1, filtroHist:"",
  carregando:false, carregado:false, erro:null, quando:null, ocupado:false,

  /* ---------------- geometria ---------------- */
  geom(n){
    if(n<=31) return { x:60+(n-1)*52, y:400, w:44, h:290, v:true };
    if(n>=41) return { x:1010, y:30+(49-n)*34, w:690, h:28, v:false };
    return { x:1010, y:760+(n-32)*34, w:690, h:28, v:false };
  },
  ruas(){ const a = []; for(let n=this.MIN;n<=this.MAX;n++) a.push(n); return a; },
  ck(mat){ return normStr(String(mat||"")); },

  /* ---------------- util ---------------- */
  esc(s){ return escapeHtml(String(s==null?"":s)); },
  titulo(s){ return String(s||"").toLowerCase().replace(/(^|\s)(\S)/g,(m,a,b)=>a+b.toUpperCase()); },
  curto(nome){
    const p = String(nome||"").trim().split(/\s+/).filter(Boolean); if(!p.length) return "";
    const lig = /^(DE|DA|DO|DAS|DOS|E)$/i; const resto = p.slice(1).filter(x=>!lig.test(x));
    return this.titulo(p[0]) + (resto.length ? " " + resto[0][0].toUpperCase() + "." : "");
  },
  fq(v){ return v==null ? "—" : fmtNum(v,1)+"%"; },
  media(a,b){ const v = [a,b].filter(x=>x!=null); return v.length ? v.reduce((s,x)=>s+x,0)/v.length : null; },
  corQ(v){ if(v==null) return "#7a8798"; return v>=95 ? "#1a9c62" : v>=90 ? "#2f6fce" : v>=80 ? "#e08a1f" : "#d64545"; },
  parseBR(d, h){ const m = String(d||"").match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/); if(!m) return null; const t = String(h||"").match(/^(\d{1,2}):(\d{2})/); return new Date(+m[3], +m[2]-1, +m[1], t?+t[1]:0, t?+t[2]:0); },
  matsDe(rua){ return (this.estado[rua]||[]).map(p=>p.mat); },

  /* ---------------- período e métricas ---------------- */
  faixa(){
    let ref = null; try{ ref = Production.maxDataDate(); }catch(e){}
    ref = dateOnly(ref || new Date());
    const ini0 = new Date(ref.getFullYear(), ref.getMonth(), 1);
    if(this.periodo==="mesant"){ const i = addMonths(ini0,-1); return { ini:i, fim:new Date(i.getFullYear(), i.getMonth()+1, 0) }; }
    if(this.periodo==="3m") return { ini:addMonths(ini0,-2), fim:ref };
    if(this.periodo==="tudo") return { ini:new Date(2000,0,1), fim:ref };
    return { ini:ini0, fim:ref };
  },
  /** Map codKey → { ret, rua, geral, os, dias, media } no período escolhido */
  metricas(){
    const { ini, fim } = this.faixa(), m = new Map();
    const ret = (window.RetornoQ && RetornoQ.dados && !(RetornoQ.dados.diag.falta||[]).length) ? RetornoQ.porRepositor(ini, fim) : new Map();
    const rua = (window.AuditOnline && AuditOnline.rows) ? AuditOnline.qualidadePorRepositorNoIntervalo(ini, fim) : new Map();
    const prod = new Map();
    try{
      const p = window.APP_STATE && APP_STATE.processed;
      ((p && p.p8460) || []).forEach(r=>{
        if(r.tipoos!==58 || !r.dtinicio) return;
        const d = dateOnly(r.dtinicio); if(d<ini || d>fim) return;
        if(!prod.has(r.codKey)) prod.set(r.codKey, { os:0, dias:new Set() });
        const e = prod.get(r.codKey); e.os++; e.dias.add(ymdKey(d));
      });
    }catch(e){}
    const chaves = new Set([...ret.keys(), ...rua.keys(), ...prod.keys()]);
    chaves.forEach(k=>{
      const r = ret.get(k), u = rua.get(k), p = prod.get(k);
      const rq = r && r.qualidade!=null ? r.qualidade : null, uq = u && u.qualidadeMedia!=null ? u.qualidadeMedia : null;
      m.set(k, { ret:rq, retN:r?r.auditados:0, retErros:r?r.erros:0, rua:uq, ruaN:u?u.auditorias:0, geral:this.media(rq,uq),
        os:p?p.os:0, dias:p?p.dias.size:0, media:p&&p.dias.size ? p.os/p.dias.size : null });
    });
    return m;
  },

  /* ---------------- carga ---------------- */
  async carregar(force){
    if(this.carregando) return;
    if(this.carregado && !force) return;
    this.carregando = true; this.erro = null; this.renderTudo();
    try{
      const [a, h] = await Promise.all([ Api.call({ acao:"ruas_listar" }), Api.call({ acao:"ruas_historico" }) ]);
      if(!a || !a.ok) throw new Error((a && a.erro) || "Não foi possível ler as atribuições.");
      this.estado = a.ruas || {}; this.pessoas = a.pessoas || [];
      this.hist = (h && h.ok) ? (h.itens||[]) : [];
      this.carregado = true; this.quando = new Date();
      this.instalarHook();
      // bases de auditoria (qualidade) para os %: carrega em segundo plano e redesenha
      const ps = [];
      if(window.AuditOnline && AuditOnline.rows===null && !AuditOnline.loading) ps.push(AuditOnline.load());
      if(window.RetornoQ && !RetornoQ.dados && !RetornoQ.carregando && !RetornoQ.erro) ps.push(RetornoQ.carregar());
      if(ps.length) Promise.all(ps.map(p=>Promise.resolve(p).catch(()=>{}))).then(()=>this.renderTudo());
    }catch(e){ this.erro = e && e.message ? e.message : String(e); }
    finally{ this.carregando = false; this.renderTudo(); }
  },
  async atualizarTudo(){
    this.carregado = false;
    if(typeof audAtualizarTudo==="function") await audAtualizarTudo();
    await this.carregar(true);
  },
  /** a Auditoria usa isto para saber quem respondia pela rua na data da auditoria (desfaz as mudanças posteriores) */
  instalarHook(){
    if(!window.RetornoQ) return;
    RetornoQ.respHook = (rua, data)=>{
      if(!this.carregado || !data) return null;
      let lista = (this.estado[rua]||[]).map(p=>({ mat:p.mat, nome:p.nome }));
      const dia = dateOnly(data);
      this.hist.forEach(x=>{
        if(x.rua!==rua || x.acao==="Importado") return;
        const dh = this.parseBR(x.data, "00:00"); if(!dh || dh <= dia) return;
        const ms = String(x.matAnt||"").split(" / ").filter(Boolean), ns = String(x.nomeAnt||"").split(" / ");
        lista = ms.map((mat,i)=>({ mat, nome:ns[i]||"" }));
      });
      return lista.map(p=>({ codKey:this.ck(p.mat), nome:p.nome }));
    };
  },

  /* ---------------- cores ---------------- */
  corRep(mat, todos){ const i = todos.indexOf(mat); return `hsl(${Math.round((i*137.5)%360)} 58% 40%)`; },

  /* ---------------- mapa ---------------- */
  svg(met){
    const reps = Array.from(new Set(Object.keys(this.estado).flatMap(r=>this.matsDe(r)))).sort();
    let g = `<path class="rs-out" d="M30 370 H990 V10 H1730 V1075 H990 V720 H30 Z"/>`;
    this.ruas().forEach(n=>{
      const p = this.geom(n), rs = this.estado[n]||[], sel = this.sel.has(n);
      const m0 = rs.length ? met.get(this.ck(rs[0].mat)) : null;
      const geral = rs.length>1 ? this.media(...[0,1].map(i=>{ const x = met.get(this.ck(rs[i].mat)); return x ? x.geral : null; })) : (m0 ? m0.geral : null);
      let fill = "";
      if(rs.length) fill = this.colorir==="qualidade" ? this.corQ(geral) : this.corRep(rs[0].mat, reps);
      const nomes = rs.length ? this.curto(rs[0].nome) + (rs.length>1 ? ` +${rs.length-1}` : "") : "livre";
      const tip = `Rua ${n}` + (rs.length ? " — " + rs.map(x=>{ const m = met.get(this.ck(x.mat)); return this.titulo(x.nome) + (m ? ` · Retornos ${this.fq(m.ret)} · Ruas ${this.fq(m.rua)} · Geral ${this.fq(m.geral)} · Prod. ${m.media!=null?fmtNum(m.media,0)+"/dia":"—"}` : ""); }).join(" | ") : " — sem repositor");
      let t = "";
      if(p.v){
        const cx = p.x+p.w/2;
        t = `<text class="rs-n" x="${cx}" y="${p.y+22}" text-anchor="middle">${n}</text>`
          + `<text class="rs-nm" transform="rotate(-90 ${cx} ${p.y+p.h/2+8})" x="${cx}" y="${p.y+p.h/2+8}" text-anchor="middle" dominant-baseline="middle">${this.esc(nomes)}</text>`
          + (rs.length ? `<text class="rs-q" x="${cx}" y="${p.y+p.h-12}" text-anchor="middle">${geral==null?"—":Math.round(geral)+"%"}</text>` : "");
      }else{
        const cy = p.y+p.h/2;
        t = `<text class="rs-n" x="${p.x+12}" y="${cy}" dominant-baseline="middle">Rua ${n}</text>`
          + `<text class="rs-nm" x="${p.x+92}" y="${cy}" dominant-baseline="middle">${this.esc(nomes)}</text>`
          + (rs.length ? `<text class="rs-q" x="${p.x+p.w-12}" y="${cy}" text-anchor="end" dominant-baseline="middle">Ret ${this.fq(m0&&m0.ret)} · Ruas ${this.fq(m0&&m0.rua)} · Geral ${this.fq(geral)}${m0&&m0.media!=null ? " · "+fmtNum(m0.media,0)+"/dia" : ""}</text>` : "");
      }
      g += `<g class="rs-rua${sel?" sel":""}${rs.length?"":" vazia"}" data-r="${n}"><title>${this.esc(tip)}</title><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="5"${fill?` fill="${fill}"`:""}/>${t}</g>`;
    });
    g += `<text class="rs-lbl" x="60" y="352">Eixo central · ruas 1 a 31 →</text><text class="rs-lbl" x="1010" y="${30-8}">Ruas 49 a 41 ↓</text><text class="rs-lbl" x="1010" y="${760-10}">Ruas 32 a 40 ↓</text>`;
    return `<svg class="rs-svg" viewBox="0 0 ${this.W} ${this.H}" style="width:${Math.round(this.zoom*100)}%" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
  },

  /* ---------------- telas ---------------- */
  renderPane(){ const pane = document.getElementById("pane-ruas"); if(!pane) return; this.pane = pane; this.renderTudo(); if(!this.carregado && !this.carregando && !this.erro) this.carregar(); },
  renderTudo(){
    const pane = this.pane || document.getElementById("pane-ruas"); if(!pane) return;
    if(this.carregando && !this.carregado){ pane.innerHTML = `<div class="panel"><h3 class="adm-h2">Atribuição de Ruas</h3><p class="small-muted">Carregando as atribuições e o histórico…</p></div>`; return; }
    if(this.erro && !this.carregado){
      pane.innerHTML = `<div class="panel"><h3 class="adm-h2">Atribuição de Ruas</h3><div class="error-box">${this.esc(this.erro)}</div><p class="small-muted">Se a mensagem fala em permissão, peça ao administrador para liberar "Gestão &gt; Atribuição Ruas" na planilha de acessos. Se fala em ação desconhecida, atualize o Apps Script (Nova versão).</p><button class="btn btn-outline btn-sm" id="rs-retry">Tentar novamente</button></div>`;
      const b = document.getElementById("rs-retry"); if(b) b.addEventListener("click", ()=>{ this.erro = null; this.carregar(true); });
      return;
    }
    const met = this.metricas();
    const comRua = this.ruas().filter(n=>(this.estado[n]||[]).length).length;
    const periodos = [["mes","Mês atual"],["mesant","Mês anterior"],["3m","Últimos 3 meses"],["tudo","Todo o histórico"]];
    pane.innerHTML = `<div class="panel rs">
      <div class="adm-head"><h3 style="margin:0;">Atribuição de Ruas <span class="small-muted" style="font-weight:500">· ${comRua} de ${this.MAX} ruas com repositor</span></h3>
        <div class="adm-head-r"><span class="small-muted">${this.quando?("atualizado "+this.quando.toLocaleTimeString("pt-BR")):""}</span><button class="btn btn-outline btn-sm" id="rs-reload">↻ Atualizar</button></div></div>
      <div class="rs-bar">
        <label>Período dos %<select id="rs-per">${periodos.map(p=>`<option value="${p[0]}" ${this.periodo===p[0]?"selected":""}>${p[1]}</option>`).join("")}</select></label>
        <label>Colorir por<select id="rs-col"><option value="repositor" ${this.colorir==="repositor"?"selected":""}>Repositor</option><option value="qualidade" ${this.colorir==="qualidade"?"selected":""}>Qualidade geral</option></select></label>
        <span class="rs-zoom"><button class="btn btn-outline btn-sm" id="rs-z-" title="Diminuir">−</button><button class="btn btn-outline btn-sm" id="rs-z0" title="Ajustar à tela">Ajustar</button><button class="btn btn-outline btn-sm" id="rs-z+" title="Ampliar">+</button></span>
        <span class="small-muted rs-dica">Clique seleciona · Shift+clique seleciona faixa · botão direito atribui</span>
      </div>
      <div class="rs-main"><div class="rs-mapwrap" id="rs-mapa">${this.svg(met)}</div><aside class="rs-side" id="rs-lado"></aside></div>
      <div id="rs-hist"></div>
    </div>`;
    this.ligar(); this.lado(met); this.renderHist();
  },
  renderMapa(){ const w = document.getElementById("rs-mapa"); if(!w) return this.renderTudo(); const met = this.metricas(); w.innerHTML = this.svg(met); this.lado(met); },

  lado(met){
    const box = document.getElementById("rs-lado"); if(!box) return;
    const sel = Array.from(this.sel).sort((a,b)=>a-b);
    const card = (rot, v, cor)=>`<div class="rs-c"><b>${rot}</b><i style="color:${cor||"inherit"}">${v}</i></div>`;
    let det = "";
    if(sel.length===1){
      const n = sel[0], rs = this.estado[n]||[];
      det = `<h4>Rua ${n}</h4>` + (rs.length ? rs.map(p=>{
        const m = met.get(this.ck(p.mat)) || {};
        return `<div class="rs-rep"><strong>${this.esc(this.titulo(p.nome))}</strong> <span class="small-muted">${this.esc(p.mat)}</span>
          <div class="small-muted">desde ${this.esc(p.desde||"—")}${p.por?" · por "+this.esc(p.por):""}</div>
          <div class="rs-cards">${card("Retornos", this.fq(m.ret), this.corQ(m.ret))}${card("Ruas", this.fq(m.rua), this.corQ(m.rua))}${card("Geral", this.fq(m.geral), this.corQ(m.geral))}${card("Prod. média", m.media!=null?fmtNum(m.media,0)+"/dia":"—")}</div>
          <div class="small-muted">${m.os!=null?fmtNum(m.os||0)+" O.S. 58 em "+(m.dias||0)+" dia(s)":""} · ${m.retN||0} retorno(s) auditado(s), ${m.retErros||0} erro(s) · ${m.ruaN||0} auditoria(s) de rua</div></div>`;
      }).join("") : `<p class="small-muted">Rua sem repositor.</p>`);
    }else if(sel.length>1){
      det = `<h4>${sel.length} ruas selecionadas</h4><p class="small-muted">${sel.join(", ")}</p>`;
    }else{
      det = `<p class="small-muted">Selecione uma ou mais ruas no mapa. Com a seleção feita, clique com o botão direito (ou use os botões abaixo) para atribuir um repositor a todas de uma vez.</p>`;
    }
    const atrib = {};
    this.ruas().forEach(n=>(this.estado[n]||[]).forEach(p=>{ (atrib[p.mat] = atrib[p.mat]||{ mat:p.mat, nome:p.nome, ruas:[] }).ruas.push(n); }));
    const lista = Object.values(atrib).sort((a,b)=>a.nome.localeCompare(b.nome));
    const livres = this.pessoasRep().filter(p=>!atrib[p.mat]);
    box.innerHTML = `<div class="rs-acoes">
        <button class="btn btn-primary btn-sm" id="rs-a-set" ${sel.length?"":"disabled"}>Atribuir repositor…</button>
        <button class="btn btn-outline btn-sm" id="rs-a-add" ${sel.length?"":"disabled"} title="Mantém quem já está e coloca mais um repositor na rua">Adicionar à rua…</button>
        <button class="btn btn-outline btn-sm" id="rs-a-free" ${sel.length?"":"disabled"}>Liberar</button>
        <button class="btn btn-outline btn-sm" id="rs-a-clr" ${sel.length?"":"disabled"}>Limpar seleção</button></div>
      <div class="rs-det">${det}</div>
      <h4>Repositores e ruas</h4>
      <div class="table-wrap rs-tb"><table class="data-table"><thead><tr><th>Repositor</th><th>Ruas</th><th class="num">Geral</th><th class="num">Prod./dia</th></tr></thead><tbody>
        ${lista.map(r=>{ const m = met.get(this.ck(r.mat)) || {}; return `<tr class="clickable" data-sel="${this.esc(r.ruas.join(","))}"><td>${this.esc(this.curto(r.nome))}</td><td>${r.ruas.join(", ")}</td><td class="num" style="color:${this.corQ(m.geral)}"><strong>${this.fq(m.geral)}</strong></td><td class="num">${m.media!=null?fmtNum(m.media,0):"—"}</td></tr>`; }).join("") || `<tr><td colspan="4" class="small-muted">Nenhuma rua atribuída ainda.</td></tr>`}
      </tbody></table></div>
      ${livres.length ? `<p class="small-muted"><strong>Sem rua:</strong> ${livres.map(p=>this.esc(this.curto(p.nome))).join(", ")}</p>` : ""}
      <p class="small-muted rs-leg">Retornos / Ruas / Geral = % de qualidade do repositor no período (Geral = média dos dois). Prod. média = O.S. 58 por dia trabalhado.</p>`;
    const on = (id, fn)=>{ const b = box.querySelector("#"+id); if(b) b.addEventListener("click", fn); };
    on("rs-a-set", ()=>this.abrirAtribuir("substituir")); on("rs-a-add", ()=>this.abrirAtribuir("adicionar"));
    on("rs-a-free", ()=>this.abrirLiberar()); on("rs-a-clr", ()=>{ this.sel.clear(); this.renderMapa(); });
    box.querySelectorAll("tr[data-sel]").forEach(tr=>tr.addEventListener("click", ()=>{ this.sel = new Set(tr.dataset.sel.split(",").map(Number)); this.renderMapa(); }));
  },

  pessoasRep(todos){
    const ativos = (this.pessoas||[]);
    const rep = ativos.filter(p=> (typeof cargoDeTexto==="function" ? cargoDeTexto(p.cargo)==="REPOSITOR" : /REPOSITOR/i.test(p.cargo||"")));
    return (todos || !rep.length) ? ativos : rep;
  },

  ligar(){
    const $id = id=>document.getElementById(id);
    $id("rs-reload").addEventListener("click", ()=>this.atualizarTudo());
    $id("rs-per").addEventListener("change", e=>{ this.periodo = e.target.value; this.renderMapa(); });
    $id("rs-col").addEventListener("change", e=>{ this.colorir = e.target.value; this.renderMapa(); });
    $id("rs-z-").addEventListener("click", ()=>{ this.zoom = Math.max(.6, +(this.zoom-.2).toFixed(2)); this.renderMapa(); });
    $id("rs-z+").addEventListener("click", ()=>{ this.zoom = Math.min(2.6, +(this.zoom+.2).toFixed(2)); this.renderMapa(); });
    $id("rs-z0").addEventListener("click", ()=>{ this.zoom = 1; this.renderMapa(); });
    const mapa = $id("rs-mapa");
    const rua = ev=>{ const g = ev.target.closest && ev.target.closest(".rs-rua"); return g ? Number(g.dataset.r) : null; };
    mapa.addEventListener("click", ev=>{
      const n = rua(ev); if(n==null){ return; }
      if(ev.shiftKey && this.ancora!=null){ const a = Math.min(this.ancora, n), b = Math.max(this.ancora, n); for(let i=a;i<=b;i++) this.sel.add(i); }
      else{ if(this.sel.has(n)) this.sel.delete(n); else this.sel.add(n); this.ancora = n; }
      this.renderMapa();
    });
    mapa.addEventListener("contextmenu", ev=>{
      const n = rua(ev); if(n==null) return;
      ev.preventDefault();
      if(!this.sel.has(n)){ this.sel = new Set([n]); this.ancora = n; this.renderMapa(); }
      this.menu(ev.clientX, ev.clientY);
    });
  },

  menu(x, y){
    this.fecharMenu();
    const sel = Array.from(this.sel).sort((a,b)=>a-b), txt = sel.length>1 ? `${sel.length} ruas` : `rua ${sel[0]}`;
    const m = document.createElement("div"); m.className = "rs-menu"; m.id = "rs-menu";
    m.innerHTML = `<div class="rs-menu-h">${this.esc(txt)}</div>
      <button data-a="set">Atribuir repositor…</button><button data-a="add">Adicionar repositor à ${sel.length>1?"s ruas":"rua"}…</button>
      <button data-a="free">Liberar ${sel.length>1?"as ruas":"a rua"}</button><button data-a="hist">Histórico ${sel.length>1?"das ruas":"da rua"}</button><button data-a="clr">Limpar seleção</button>`;
    document.body.appendChild(m);
    const w = m.offsetWidth, h = m.offsetHeight;
    m.style.left = Math.max(6, Math.min(x, window.innerWidth-w-6))+"px"; m.style.top = Math.max(6, Math.min(y, window.innerHeight-h-6))+"px";
    m.addEventListener("click", ev=>{
      const b = ev.target.closest("button"); if(!b) return; const a = b.dataset.a; this.fecharMenu();
      if(a==="set") this.abrirAtribuir("substituir"); else if(a==="add") this.abrirAtribuir("adicionar"); else if(a==="free") this.abrirLiberar();
      else if(a==="hist"){ this.filtroHist = sel.length===1 ? String(sel[0]) : ""; this.renderHist(); const h2 = document.getElementById("rs-hist"); if(h2) h2.scrollIntoView({ behavior:"smooth", block:"start" }); }
      else if(a==="clr"){ this.sel.clear(); this.renderMapa(); }
    });
    setTimeout(()=>{ this._fm = ev=>{ if(!ev.target.closest || !ev.target.closest("#rs-menu")) this.fecharMenu(); }; document.addEventListener("mousedown", this._fm); document.addEventListener("keydown", this._fk = ev=>{ if(ev.key==="Escape") this.fecharMenu(); }); window.addEventListener("scroll", this._fs = ()=>this.fecharMenu(), true); }, 0);
  },
  fecharMenu(){
    const m = document.getElementById("rs-menu"); if(m) m.remove();
    if(this._fm){ document.removeEventListener("mousedown", this._fm); this._fm = null; }
    if(this._fk){ document.removeEventListener("keydown", this._fk); this._fk = null; }
    if(this._fs){ window.removeEventListener("scroll", this._fs, true); this._fs = null; }
  },

  /* ---------------- atribuir / liberar ---------------- */
  abrirAtribuir(modo){
    const ruas = Array.from(this.sel).sort((a,b)=>a-b); if(!ruas.length){ toast("Selecione ao menos uma rua.", "error"); return; }
    const met = this.metricas(), atrib = {};
    this.ruas().forEach(n=>this.matsDe(n).forEach(m=>{ (atrib[m] = atrib[m]||[]).push(n); }));
    this._escolha = null; this._modo = modo; this._todos = false;
    UI.openModal(`<h3 style="margin-top:0">${modo==="adicionar"?"Adicionar repositor à":"Atribuir repositor à"}${ruas.length>1?"s":""} rua${ruas.length>1?"s":""} ${ruas.join(", ")}</h3>
      <div class="rs-mod">
        <input type="text" id="rs-busca" placeholder="Buscar repositor por nome ou matrícula…" autocomplete="off">
        <label class="rs-chk"><input type="checkbox" id="rs-todos"> mostrar também outros cargos</label>
        <div class="rs-lista" id="rs-lista"></div>
        <div class="rs-modo"><label><input type="radio" name="rs-modo" value="substituir" ${modo==="substituir"?"checked":""}> <span><strong>Substituir</strong> — quem estiver na rua sai e o escolhido assume</span></label>
          <label><input type="radio" name="rs-modo" value="adicionar" ${modo==="adicionar"?"checked":""}> <span><strong>Adicionar</strong> — mantém quem já está e divide a rua com o escolhido</span></label></div>
        <p class="small-muted" id="rs-prev"></p>
        <div class="adm-actions"><button class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button><button class="btn btn-primary" id="rs-ok" disabled>Atribuir</button></div>
      </div>`);
    const lista = ()=>{
      const q = normStr(document.getElementById("rs-busca").value||"");
      const ps = this.pessoasRep(this._todos).filter(p=>!q || normStr(p.nome+" "+p.mat).includes(q)).sort((a,b)=>a.nome.localeCompare(b.nome));
      document.getElementById("rs-lista").innerHTML = ps.map(p=>{
        const m = met.get(this.ck(p.mat)) || {}, mine = atrib[p.mat];
        return `<button type="button" class="rs-p${this._escolha===p.mat?" on":""}" data-m="${this.esc(p.mat)}"><span><strong>${this.esc(this.titulo(p.nome))}</strong> <small>${this.esc(p.mat)}${p.cargo?" · "+this.esc(p.cargo):""}</small></span>
          <span class="small-muted">${mine?"hoje: rua "+mine.join(", "):"sem rua"} · Geral ${this.fq(m.geral)}${m.media!=null?" · "+fmtNum(m.media,0)+"/dia":""}</span></button>`;
      }).join("") || `<p class="small-muted">Ninguém encontrado.</p>`;
      document.querySelectorAll("#rs-lista .rs-p").forEach(b=>b.addEventListener("click", ()=>{ this._escolha = b.dataset.m; lista(); prev(); }));
    };
    const prev = ()=>{
      const ok = document.getElementById("rs-ok"), pv = document.getElementById("rs-prev");
      const p = (this.pessoas||[]).find(x=>x.mat===this._escolha);
      ok.disabled = !p; if(!p){ pv.textContent = ""; return; }
      const md = (document.querySelector("input[name=rs-modo]:checked")||{}).value;
      pv.innerHTML = ruas.slice(0,8).map(n=>{ const a = (this.estado[n]||[]).map(x=>this.curto(x.nome)).join(" + ") || "livre"; return `Rua ${n}: ${this.esc(a)} → <strong>${this.esc(md==="adicionar" && a!=="livre" ? a+" + "+this.curto(p.nome) : this.curto(p.nome))}</strong>`; }).join("<br>") + (ruas.length>8 ? `<br>… e mais ${ruas.length-8}` : "");
    };
    document.getElementById("rs-busca").addEventListener("input", lista);
    document.getElementById("rs-todos").addEventListener("change", e=>{ this._todos = e.target.checked; lista(); });
    document.querySelectorAll("input[name=rs-modo]").forEach(r=>r.addEventListener("change", prev));
    document.getElementById("rs-ok").addEventListener("click", ()=>{
      const p = (this.pessoas||[]).find(x=>x.mat===this._escolha); if(!p) return;
      this.enviar({ ruas, mat:p.mat, nome:p.nome, modo:(document.querySelector("input[name=rs-modo]:checked")||{}).value || "substituir" });
    });
    lista(); setTimeout(()=>{ const b = document.getElementById("rs-busca"); if(b) b.focus(); }, 50);
  },
  abrirLiberar(){
    const ruas = Array.from(this.sel).sort((a,b)=>a-b); if(!ruas.length){ toast("Selecione ao menos uma rua.", "error"); return; }
    const com = ruas.filter(n=>(this.estado[n]||[]).length);
    if(!com.length){ toast("As ruas selecionadas já estão livres.", "info"); return; }
    UI.openModal(`<h3 style="margin-top:0">Liberar rua${com.length>1?"s":""} ${com.join(", ")}?</h3>
      <p class="small-muted">${com.map(n=>`Rua ${n}: ${this.esc((this.estado[n]||[]).map(x=>this.curto(x.nome)).join(" + "))}`).join("<br>")}</p>
      <p class="small-muted">A rua fica sem repositor; fica registrado no histórico e na Quadro_Repositores.</p>
      <div class="adm-actions"><button class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button><button class="btn btn-danger" id="rs-liberar">Liberar</button></div>`);
    document.getElementById("rs-liberar").addEventListener("click", ()=>this.enviar({ ruas:com, mat:"", nome:"", modo:"remover" }));
  },
  async enviar(d){
    if(this.ocupado) return; this.ocupado = true;
    const ok = document.getElementById("rs-ok") || document.getElementById("rs-liberar"); if(ok){ ok.disabled = true; ok.textContent = "Gravando…"; }
    try{
      const j = await Api.call(Object.assign({ acao:"ruas_atribuir" }, d));
      if(!j || !j.ok) throw new Error((j && j.erro) || "Não foi possível gravar.");
      this.estado = j.ruas || {}; UI.closeModal();
      const h = await Api.call({ acao:"ruas_historico" }); if(h && h.ok) this.hist = h.itens || [];
      this.quando = new Date(); this.renderTudo();
      if(!j.mudou) toast("Nada mudou: a rua já estava assim.", "info");
      else if(j.sync && j.sync.ok === false) toast("Atribuição salva, mas a Quadro_Repositores não foi atualizada", "error", { sub:j.sync.msg, duracao:12000 });
      else toast("Atribuição salva", "success", { sub:`${j.mudou} rua(s) alterada(s) · histórico e Quadro_Repositores atualizados` });
    }catch(e){
      toast("Não foi possível gravar a atribuição", "error", { sub:e && e.message ? e.message : String(e) });
      if(ok){ ok.disabled = false; ok.textContent = d.modo==="remover" ? "Liberar" : "Atribuir"; }
    }finally{ this.ocupado = false; }
  },

  /* ---------------- histórico ---------------- */
  renderHist(){
    const box = document.getElementById("rs-hist"); if(!box) return;
    const itens = (this.hist||[]).filter(x=>!this.filtroHist || String(x.rua)===String(this.filtroHist)).slice(0, 120);
    box.innerHTML = `<details class="rs-dt" ${this.filtroHist||this._abreHist?"open":""}><summary>Histórico de atribuições <span class="small-muted">(${this.hist.length} registro(s) recentes)</span></summary>
      <div class="rs-hbar"><label>Rua<select id="rs-hrua"><option value="">Todas</option>${this.ruas().map(n=>`<option value="${n}" ${String(this.filtroHist)===String(n)?"selected":""}>Rua ${n}</option>`).join("")}</select></label>
        <label>Ver o estado em<input type="date" id="rs-hdia"></label><button class="btn btn-outline btn-sm" id="rs-hver">Ver</button></div>
      <div id="rs-hdet"></div>
      <div class="table-wrap"><table class="data-table"><thead><tr><th>Data</th><th>Hora</th><th>Rua</th><th>Antes</th><th>Depois</th><th>Ação</th><th>Por</th></tr></thead><tbody>
      ${itens.map(x=>`<tr><td>${this.esc(x.data)}</td><td>${this.esc(x.hora)}</td><td><strong>${x.rua}</strong></td><td>${this.esc(x.nomeAnt||"—")}</td><td>${this.esc(x.nomeNovo||"—")}</td><td>${this.esc(x.acao)}</td><td>${this.esc(x.por)}</td></tr>`).join("") || `<tr><td colspan="7" class="small-muted">Nenhuma mudança registrada${this.filtroHist?" para esta rua":""}.</td></tr>`}
      </tbody></table></div>
      <p class="small-muted">Cada mudança grava data e hora. Além disso, o sistema guarda uma foto do estado de todas as ruas uma vez por dia (aba ATRIBUICAO_RUAS_DIA da planilha de dados).</p></details>`;
    const det = box.querySelector("details"); det.addEventListener("toggle", ()=>{ this._abreHist = det.open; });
    document.getElementById("rs-hrua").addEventListener("change", e=>{ this.filtroHist = e.target.value; this._abreHist = true; this.renderHist(); });
    document.getElementById("rs-hver").addEventListener("click", ()=>this.verEstadoEm(document.getElementById("rs-hdia").value));
  },
  async verEstadoEm(iso){
    const box = document.getElementById("rs-hdet"); if(!box) return;
    if(!iso){ box.innerHTML = `<p class="small-muted">Escolha uma data.</p>`; return; }
    box.innerHTML = `<p class="small-muted">Buscando…</p>`;
    try{
      const j = await Api.call({ acao:"ruas_estado_em", data:iso });
      if(!j || !j.ok) throw new Error((j && j.erro) || "Falha ao buscar.");
      const br = d=>String(d||"").split("-").reverse().join("/");
      const linhas = this.ruas().map(n=>{ const ps = j.ruas && j.ruas[n]; return ps && ps.length ? `<tr><td><strong>${n}</strong></td><td>${this.esc(ps.map(p=>this.titulo(p.nome)).join(" + "))}</td></tr>` : ""; }).join("");
      box.innerHTML = `<div class="rs-foto"><strong>Estado das ruas em ${br(iso)}</strong> <span class="small-muted">${j.foto ? "(foto do início do dia "+br(j.foto)+")" : "(ainda não há foto desta data ou anterior)"}</span>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>Rua</th><th>Repositor(es)</th></tr></thead><tbody>${linhas || `<tr><td colspan="2" class="small-muted">Sem dados.</td></tr>`}</tbody></table></div>
        ${(j.mudancas||[]).length ? `<p class="small-muted">Mudanças em ${br(iso)}: ${j.mudancas.map(x=>`${this.esc(x.hora)} rua ${x.rua} (${this.esc(x.nomeAnt||"livre")} → ${this.esc(x.nomeNovo||"livre")})`).join(" · ")}</p>` : ""}</div>`;
    }catch(e){ box.innerHTML = `<div class="error-box">${this.esc(e && e.message ? e.message : String(e))}</div>`; }
  }
};
window.RuasUI = RuasUI;

/* =========================================================================
   Núcleo Reposição — Lançamentos (Feedback, Advertência, Avaria 9712, Chamada, Quadro, Missões, Capacidade, Férias)
   Depende de app.js (Api, Auth, UI, toast, escapeHtml, $) e scanner.js (DocScanner).
   Cada formulário grava direto nas abas do Google Sheets pelo Apps Script.
   ========================================================================= */
const LancUI = {
  ctx: null,
  nomes: {},

  /* ------------------------------------------------------------------ */
  /* utilidades                                                          */
  /* ------------------------------------------------------------------ */
  h(s){ return escapeHtml(s==null ? "" : String(s)); },
  pad(n){ return String(n).padStart(2, "0"); },
  isoDe(d){ return `${d.getFullYear()}-${this.pad(d.getMonth()+1)}-${this.pad(d.getDate())}`; },
  hojeISO(){ return (this.ctx && this.ctx.hoje) || this.isoDe(new Date()); },
  isoParaData(iso){ const [y,m,d] = String(iso).split("-").map(Number); return new Date(y, m-1, d, 12); },
  br(iso){ return iso ? String(iso).split("-").reverse().join("/") : ""; },
  somaDias(iso, n){ const d = this.isoParaData(iso); d.setDate(d.getDate()+n); return this.isoDe(d); },
  soDigitos(v){ return String(v==null ? "" : v).replace(/\D/g, ""); },
  nomeDe(mat){ return this.nomes[this.soDigitos(mat)] || ""; },

  options(lista, sel, vazio){
    const itens = (lista||[]).map(v=>`<option value="${this.h(v)}"${v===sel ? " selected" : ""}>${this.h(v)}</option>`).join("");
    return (vazio!==undefined ? `<option value="">${this.h(vazio)}</option>` : "") + itens;
  },
  datalistPessoas(id, soAtivos){
    const itens = (this.ctx.pessoas||[]).filter(p=>p.mat && (!soAtivos || p.ativo))
      .map(p=>`<option value="${this.h(p.mat)}">${this.h(p.nome)}${p.ativo ? "" : " (inativo)"}</option>`).join("");
    return `<datalist id="${id}">${itens}</datalist>`;
  },

  /** Caixa de aviso dentro do formulário. tipo: ok | erro | aviso | info */
  aviso(id, tipo, html){
    const el = document.getElementById(id); if(!el) return;
    if(!html){ el.innerHTML = ""; return; }
    const cls = tipo === "erro" ? "error-box" : (tipo === "aviso" ? "warn-box" : "hint-box");
    const extra = tipo === "ok" ? ' style="background:var(--green-bg);border-color:#b7e0cb;color:var(--green);"' : "";
    el.innerHTML = `<div class="${cls}"${extra}>${html}</div>`;
  },

  /** Carrega as listas e a equipe (uma vez; "força" recarrega). Mostra erros dentro do painel. */
  async abrir(paneId, desenhar, forca){
    const pane = document.getElementById("pane-" + paneId);
    if(!pane) return;
    if(!Api.configured()){ pane.innerHTML = `<div class="panel">${AdminUI.semServidor()}</div>`; return; }
    if(!this.ctx || forca){
      pane.innerHTML = `<div class="panel"><p class="small-muted">Carregando...</p></div>`;
      try{
        const r = await Api.call({ acao:"lanc_init" });
        if(!r || !r.ok) throw new Error((r && r.erro) || "Falha ao carregar.");
        this.ctx = r; this.nomes = {};
        (r.pessoas||[]).forEach(p=>{ if(p.mat) this.nomes[p.mat] = p.nome; });
      }catch(e){
        pane.innerHTML = `<div class="panel"><div class="error-box">${this.h(e.message)}</div><button class="btn btn-outline" id="lanc-retry">Tentar novamente</button></div>`;
        document.getElementById("lanc-retry").addEventListener("click", ()=> this.abrir(paneId, desenhar, true));
        return;
      }
    }
    desenhar.call(this, pane);
  },

  async enviar(btn, payload){
    const txt = btn.textContent; btn.disabled = true; btn.textContent = "Salvando...";
    try{ return await Api.call(payload); }
    catch(e){ return { ok:false, erro:e.message }; }
    finally{ btn.disabled = false; btn.textContent = txt; }
  },

  /** "＋ novo" ao lado de uma lista: cria a opção na aba Config_Lancamentos e já seleciona. */
  novoItem(lista, selectId, rotulo){
    const box = `ni-${selectId}`;
    return `<div class="lanc-novo"><button type="button" class="btn btn-outline btn-sm" data-novo="${selectId}" data-lista="${lista}">＋ ${this.h(rotulo)}</button>
      <span id="${box}" style="display:none"><input type="text" id="${box}-in" placeholder="Nome do novo item" style="min-width:180px">
      <button type="button" class="btn btn-primary btn-sm" data-novo-ok="${selectId}" data-lista="${lista}">Adicionar</button></span></div>`;
  },
  ligarNovoItem(pane){
    pane.querySelectorAll("[data-novo]").forEach(b=> b.addEventListener("click", ()=>{
      const box = document.getElementById("ni-" + b.dataset.novo); box.style.display = box.style.display === "none" ? "inline-flex" : "none";
      const inp = document.getElementById("ni-" + b.dataset.novo + "-in"); if(inp) inp.focus();
    }));
    pane.querySelectorAll("[data-novo-ok]").forEach(b=> b.addEventListener("click", async ()=>{
      const id = b.dataset.novoOk, lista = b.dataset.lista, inp = document.getElementById("ni-" + id + "-in"), valor = inp.value.trim();
      if(!valor){ inp.focus(); return; }
      const r = await this.enviar(b, { acao:"lanc_config_add", lista, valor });
      if(!r || !r.ok){ toast((r && r.erro) || "Não foi possível adicionar.", "error"); return; }
      this.ctx.listas = r.listas;
      const sel = document.getElementById(id);
      const novo = (r.listas[lista]||[]).find(v=>v.toLowerCase() === valor.toLowerCase()) || valor;
      sel.innerHTML = this.options(r.listas[lista], novo, sel.dataset.vazio);
      if(!sel.dataset.semEvento) sel.dispatchEvent(new Event("change"));
      if(this._onListas) this._onListas(lista);
      inp.value = ""; document.getElementById("ni-" + id).style.display = "none";
      toast(`"${novo}" adicionado à lista.`);
    }));
  },

  cabecalho(titulo, intro){
    return `<h2 class="adm-h">${titulo}</h2><p class="small-muted" style="margin:0 0 14px">${intro}</p>`;
  },
  rodapeAtualizar(){
    return `<p class="small-muted" style="margin-top:14px">Depois de lançar, use <strong>Atualizar dados</strong> (menu) para os indicadores enxergarem o que foi gravado.</p>`;
  },


  /* ------------------------------------------------------------------ */
  /* documento (foto digitalizada / PDF) — usado por Feedback e Advertência */
  /* ------------------------------------------------------------------ */
  anexos: {},
  anexoHtml(p, titulo){
    return `<fieldset class="adm-fs"><legend>${titulo}</legend>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <button type="button" class="btn btn-primary" id="${p}-foto">Tirar foto (digitalizar como scanner)</button>
        <button type="button" class="btn btn-outline" id="${p}-arq">Já tenho o arquivo (PDF ou imagem)</button>
        <input type="file" id="${p}-foto-in" accept="image/*" capture="environment" style="display:none">
        <input type="file" id="${p}-arq-in" accept="application/pdf,image/*" style="display:none">
      </div>
      <div id="${p}-anexo" class="small-muted" style="margin-top:10px">Nenhum documento anexado.</div>
    </fieldset>`;
  },
  /** Liga os botões do widget; devolve a função que redesenha o resumo do anexo. */
  ligarAnexo(p){
    const $$ = (id)=> document.getElementById(id);
    this.anexos[p] = null;
    const mostrar = ()=>{
      const a = this.anexos[p], el = $$(p + "-anexo");
      if(!el) return;
      if(!a){ el.innerHTML = "Nenhum documento anexado."; return; }
      el.innerHTML = `<div style="display:flex;gap:12px;align-items:center">${a.preview ? `<img src="${a.preview}" alt="" style="height:90px;border:1px solid var(--gray-200);border-radius:6px">` : ""}
        <div><strong>${this.h(a.nome)}</strong><div>${a.paginas ? a.paginas + " página(s) · " : ""}${Math.round(a.base64.length*0.75/1024)} KB</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">
          ${a.original ? `<button type="button" class="btn btn-primary btn-sm" id="${p}-dig">✂️ Digitalizar como scanner (recortar e endireitar)</button>` : ""}
          <button type="button" class="btn btn-outline btn-sm" id="${p}-rm">Remover</button></div></div></div>`;
      $$(p + "-rm").addEventListener("click", ()=>{ this.anexos[p] = null; mostrar(); });
      if(a.original) $$(p + "-dig").addEventListener("click", async ()=>{
        const n = await DocScanner.iniciar(a.original);
        if(n){ this.anexos[p] = n; mostrar(); }
      });
    };
    $$(p + "-foto").addEventListener("click", ()=> $$(p + "-foto-in").click());
    $$(p + "-foto-in").addEventListener("change", async (e)=>{
      const f = e.target.files[0]; e.target.value = ""; if(!f) return;
      const a = await DocScanner.iniciar(f);
      if(a){ this.anexos[p] = a; mostrar(); }
    });
    $$(p + "-arq").addEventListener("click", ()=> $$(p + "-arq-in").click());
    $$(p + "-arq-in").addEventListener("change", async (e)=>{
      const f = e.target.files[0]; e.target.value = ""; if(!f) return;
      if(f.size > 12*1024*1024){ toast("Arquivo muito grande (máximo 12 MB).", "error"); return; }
      const b64 = await new Promise((res, rej)=>{ const r = new FileReader(); r.onload = ()=> res(String(r.result).split(",")[1]); r.onerror = rej; r.readAsDataURL(f); });
      this.anexos[p] = { nome:f.name, mime:f.type || "application/octet-stream", base64:b64, paginas:0, preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : "",
        original: f.type.startsWith("image/") ? f : null };   // foto crua: dá para digitalizar depois
      mostrar();
    });
    return mostrar;
  },
  /** Preenche a matrícula vinda de outra tela (ex.: botão "Lançar advertência" no detalhe do funcionário). */
  aplicarPrefill(idMat){
    const pf = this.prefill; this.prefill = null;
    const el = document.getElementById(idMat);
    if(pf && pf.mat && el){ el.value = this.soDigitos(pf.mat); el.dispatchEvent(new Event("input")); el.dispatchEvent(new Event("change")); }
    // vindo de um alerta de não conformidade: já seleciona o motivo e sugere o resumo
    if(pf && pf.motivo){
      const sel = document.getElementById(idMat.replace(/-mat$/, "-motivo"));
      if(sel){
        if(!Array.from(sel.options).some(o=>o.value === pf.motivo)){ const o = document.createElement("option"); o.value = o.textContent = pf.motivo; sel.appendChild(o); }
        sel.value = pf.motivo; sel.dispatchEvent(new Event("change"));
      }
      const rs = pf.resumo && document.getElementById(idMat.replace(/-mat$/, "-resumo"));
      if(rs && !rs.value) rs.value = pf.resumo;
    }
  },
  /** mostra, abaixo da matrícula, a indicação de feedback/advertência vinda das não conformidades (p = "fb" | "ad") */
  ncIndicar(p){
    const box = document.getElementById(p+"-nc"), mat = document.getElementById(p+"-mat"); if(!box || !mat) return;
    box.innerHTML = (typeof NC!=="undefined" && window.APP_STATE && APP_STATE.ready) ? NC.htmlIndicacao(this.soDigitos(mat.value), p==="ad" ? "adv" : "fb") : "";
  },
  ligarNcIndicar(p){
    const mat = document.getElementById(p+"-mat"); if(!mat) return;
    ["input","change"].forEach(ev=> mat.addEventListener(ev, ()=> this.ncIndicar(p)));
    this.ncIndicar(p);
  },
  /** Chamadas são de segunda a sexta: recua até o último dia útil. */
  diaUtilAte(iso){ let d = iso; for(let i=0;i<3 && [0,6].includes(this.isoParaData(d).getDay()); i++) d = this.somaDias(d, -1); return d; },
  ehFimDeSemana(iso){ return [0,6].includes(this.isoParaData(iso).getDay()); },
  motivoSelect(id, sel){ return `<label>Motivo<select id="${id}" data-vazio="Selecione">${this.options(this.ctx.listas.MOTIVO_FEEDBACK, sel, "Selecione")}</select></label>`; },

  /* ================================================================== */
  /* FEEDBACK                                                            */
  /* ================================================================== */
  faixa(n){ return n <= 3 ? 0 : (n <= 6 ? 1 : 2); },
  desempenho(n){ return ["Desempenho Insatisfatório", "Regular, com margem p/ melhoria", "Bom Desempenho"][this.faixa(n)]; },

  renderFeedback(){ this.abrir("lfeedback", this._feedback); },
  _feedback(pane){
    const u = this.ctx.usuario || {}, notas = Array.from({length:11}, (_, i)=>i);
    pane.innerHTML = `<div class="panel">
      ${this.cabecalho("Lançar Feedback", "Registra o feedback na aba FEEDBACK REP. O nome do colaborador vem da matrícula; Desempenho e Classificação saem da nota do gestor.")}
      <div class="adm-form">
        <label>Data<input type="date" id="fb-data" value="${this.hojeISO()}"></label>
        <label>Matrícula do colaborador<input type="text" id="fb-mat" inputmode="numeric" list="dl-fb" placeholder="Ex.: 10002871" autocomplete="off"></label>
        <label>Nome (automático)<input type="text" id="fb-nome" readonly placeholder="—"></label>
      </div>
      ${this.datalistPessoas("dl-fb", false)}
      <div class="adm-form">
        ${this.motivoSelect("fb-motivo")}
      </div>
      ${this.novoItem("MOTIVO_FEEDBACK", "fb-motivo", "novo motivo")}
      <div id="fb-nc"></div>
      <div id="fb-sem"></div>
      <div class="adm-form">
        <label>Matrícula do aplicador<input type="text" id="fb-mat-apl" inputmode="numeric" list="dl-fb" value="${this.h(u.matricula||"")}"></label>
        <label>Nome do aplicador<input type="text" id="fb-nome-apl" value="${this.h(u.nome || this.nomeDe(u.matricula) || "")}"></label>
      </div>
      <div class="adm-form"><label style="grid-column:1/-1">Resumo do assunto<textarea id="fb-resumo" rows="3" style="padding:9px 10px;border:1.5px solid var(--gray-200);border-radius:8px;font-size:14px;font-family:inherit;text-transform:none;letter-spacing:0;font-weight:500;" placeholder="Descreva o assunto do feedback"></textarea></label></div>
      <div class="adm-form">
        <label>Avaliação pessoal (nota que o colaborador se deu)<select id="fb-ap">${this.options(notas, null, "Selecione")}</select></label>
        <label>Avaliação do gestor (0 a 10)<select id="fb-ag">${this.options(notas, null, "Selecione")}</select></label>
        <label>Desempenho (automático)<input type="text" id="fb-desemp" readonly placeholder="—"></label>
        <label>Classificação (automática)<input type="text" id="fb-classif" readonly placeholder="—"></label>
      </div>
      ${this.anexoHtml("fb", "Documento do feedback (opcional)")}
      <div id="fb-msg"></div>
      <div class="adm-actions"><button type="button" class="btn btn-primary" id="fb-salvar">Salvar feedback</button></div>
      ${this.rodapeAtualizar()}
    </div>
    <div class="panel" id="fb-pend"></div>`;
    const $$ = (id)=> document.getElementById(id);
    this.fbPendentes(true);
    const atualizarNome = ()=>{
      const n = this.nomeDe($$("fb-mat").value);
      $$("fb-nome").value = n; $$("fb-nome").placeholder = $$("fb-mat").value ? "matrícula não encontrada" : "—";
    };
    const atualizarApl = ()=>{ const n = this.nomeDe($$("fb-mat-apl").value); if(n) $$("fb-nome-apl").value = n; };
    const atualizarNota = ()=>{
      const v = $$("fb-ag").value;
      if(v === ""){ $$("fb-desemp").value = ""; $$("fb-classif").value = ""; return; }
      const f = this.faixa(Number(v));
      $$("fb-desemp").value = this.desempenho(Number(v));
      $$("fb-classif").value = (this.ctx.classificacao||["Negativo","Neutro","Positivo"])[f];
    };
    $$("fb-mat").addEventListener("input", atualizarNome); $$("fb-mat").addEventListener("change", atualizarNome);
    $$("fb-mat-apl").addEventListener("change", atualizarApl);
    $$("fb-ag").addEventListener("change", atualizarNota);

    const mostrarAnexo = this.ligarAnexo("fb");
    this.ligarNovoItem(pane);
    const semFb = (lista)=>{
      const el = $$("fb-sem"); if(!el) return;
      lista = lista || []; if(!lista.length){ el.innerHTML = ""; return; }
      el.innerHTML = `<details class="warn-box" style="margin:8px 0"><summary style="cursor:pointer;font-weight:700">📝 ${lista.length} colaborador(es) sem feedback há mais de ${this.ctx.diasSemFeedback||30} dias</summary>
        <div style="margin-top:6px;font-size:13px">${lista.slice(0,25).map(x=>`${this.h(x.nome)} — ${x.dias===null ? "nunca recebeu" : x.dias + " dias"}`).join("<br>")}${lista.length>25 ? `<br>+ ${lista.length-25} outros` : ""}</div></details>`;
    };
    semFb(this.ctx.semFeedback);
    this.ligarNcIndicar("fb");
    this.aplicarPrefill("fb-mat");

    $$("fb-salvar").addEventListener("click", async ()=>{
      this.aviso("fb-msg", "", "");
      const mat = this.soDigitos($$("fb-mat").value);
      if(!mat) return this.aviso("fb-msg", "erro", "Informe a matrícula do colaborador.");
      if(!this.nomeDe(mat)) return this.aviso("fb-msg", "erro", "Matrícula não encontrada no quadro (aba TURNOVER).");
      if(!$$("fb-motivo").value) return this.aviso("fb-msg", "erro", "Escolha o motivo do feedback.");
      if(!$$("fb-resumo").value.trim()) return this.aviso("fb-msg", "erro", "Escreva o resumo do assunto.");
      if($$("fb-ap").value === "" || $$("fb-ag").value === "") return this.aviso("fb-msg", "erro", "Informe as duas avaliações (0 a 10).");
      const a = this.anexos.fb;
      const r = await this.enviar($$("fb-salvar"), { acao:"lanc_feedback_salvar", data:$$("fb-data").value, mat, motivo:$$("fb-motivo").value,
        matAplicador:$$("fb-mat-apl").value, nomeAplicador:$$("fb-nome-apl").value, resumo:$$("fb-resumo").value,
        avPessoal:Number($$("fb-ap").value), avGestor:Number($$("fb-ag").value),
        anexo: a ? { nome:a.nome, mime:a.mime, base64:a.base64 } : null });
      if(!r || !r.ok) return this.aviso("fb-msg", "erro", this.h((r && r.erro) || "Não foi possível salvar."));
      this.aviso("fb-msg", "ok", `Feedback de <strong>${this.h(r.nome)}</strong> salvo — ${this.h(r.desempenho)} (${this.h(r.classificacao)})${r.anexo ? " · documento anexado" : ""}.`);
      toast("Feedback salvo.");
      this.ctx.semFeedback = r.semFeedback || []; semFb(this.ctx.semFeedback);
      if((r.semFeedback||[]).length) this.aviso("fb-msg", "ok", $$("fb-msg").firstElementChild.innerHTML + `<br>⚠️ Ainda há <strong>${r.semFeedback.length}</strong> colaborador(es) sem feedback há mais de ${this.ctx.diasSemFeedback||30} dias (veja a lista acima).`);
      $$("fb-mat").value = ""; $$("fb-nome").value = ""; $$("fb-resumo").value = ""; $$("fb-ap").value = ""; $$("fb-ag").value = ""; $$("fb-motivo").value = "";
      atualizarNota(); this.anexos.fb = null; mostrarAnexo();
      // sem documento agora? dá para escanear logo em seguida (ou depois, pela lista abaixo)
      if(!r.anexo && r.linha){
        const caixa = $$("fb-msg"), nomeColab = r.nome;
        const b = document.createElement("button"); b.type = "button"; b.className = "btn btn-primary btn-sm"; b.style.marginTop = "8px";
        b.textContent = "📷 Escanear o documento deste feedback agora";
        b.onclick = ()=> this.fbDocModal({ linha:r.linha, mat, data:r.data }, "Feedback — " + nomeColab + " — " + this.br(r.data), ()=>{ b.remove(); toast("Documento anexado."); this.fbPendentes(true); }, true);
        if(caixa) caixa.appendChild(b);
      }
      this.fbPendentes(true);
    });
  },

  /* ================================================================== */
  /* FEEDBACK JÁ LANÇADO — editar, e escanear/anexar o documento depois   */
  /* ================================================================== */
  async garantirCtx(){
    if(this.ctx) return;
    const r = await Api.call({ acao:"lanc_init" });
    if(!r || !r.ok) throw new Error((r && r.erro) || "Falha ao carregar.");
    this.ctx = r; this.nomes = {};
    (r.pessoas||[]).forEach(p=>{ if(p.mat) this.nomes[p.mat] = p.nome; });
  },
  _norm(t){ return String(t||"").replace(/\s+/g, " ").trim().toLowerCase(); },
  /** Acha na planilha a linha do feedback. ref: { item } | { linha, mat, data } | { mat, data(iso), resumo, ordem }. */
  async fbLocalizar(ref){
    if(ref.item) return ref.item;
    const r = await Api.call({ acao:"lanc_feedback_listar", mat:ref.mat, nome:ref.nome||"" });
    if(!r || !r.ok) throw new Error((r && r.erro) || "Não foi possível consultar a planilha.");
    const itens = r.itens||[], res = this._norm(ref.resumo);
    const trocada = (iso)=>{ const m = String(iso||"").match(/^(\d{4})-(\d{2})-(\d{2})$/); return m && +m[3] <= 12 ? `${m[1]}-${m[3]}-${m[2]}` : ""; };   // dia e mês invertidos (datas antigas)
    // do critério mais exato ao mais tolerante: data+resumo, data, resumo, data invertida
    const passos = [
      i=> i.data === ref.data && this._norm(i.resumo) === res,
      i=> i.data === ref.data,
      i=> res && this._norm(i.resumo) === res,
      i=> trocada(ref.data) && i.data === trocada(ref.data)
    ];
    let c = [];
    for(const p of passos){ c = itens.filter(p); if(c.length) break; }
    if(!c.length) throw new Error("Não achei este feedback na planilha desta pessoa (matrícula " + ref.mat + "). Use Atualizar dados e tente de novo.");
    if(c.length > 1 && !res) throw new Error("Há mais de um feedback desta pessoa nesta data. Edite pela tela Lançar Feedback (lista de feedbacks).");
    return c[Math.min(ref.ordem || 0, c.length-1)];
  },

  /** Edita um feedback já lançado. aoSalvar(patch, matMudou) recebe o que mudou, no formato da tela de Gestão. */
  async fbEditar(ref, aoSalvar){
    let it;
    try{ await this.garantirCtx(); it = await this.fbLocalizar(ref); }catch(e){ toast(e.message, "error"); return; }
    const notas = Array.from({length:11}, (_, i)=>i);
    const motivos = Array.from(new Set(((this.ctx.listas||{}).MOTIVO_FEEDBACK||[]).concat(it.motivo ? [it.motivo] : [])));
    UI.openModal(`<h3 style="margin-top:0;">Editar feedback</h3>
      <div class="adm-form">
        <label>Data<input type="date" id="fx-data" value="${this.h(it.data)}"></label>
        <label>Matrícula do colaborador<input type="text" id="fx-mat" inputmode="numeric" value="${this.h(it.mat)}"></label>
        <label>Nome (automático)<input type="text" id="fx-nome" readonly value="${this.h(this.nomeDe(it.mat) || it.nome)}"></label>
      </div>
      <div class="adm-form"><label>Motivo<select id="fx-motivo">${this.options(motivos, it.motivo, "Selecione")}</select></label></div>
      <div class="adm-form">
        <label>Matrícula do aplicador<input type="text" id="fx-mat-apl" inputmode="numeric" value="${this.h(it.matApl)}"></label>
        <label>Nome do aplicador<input type="text" id="fx-nome-apl" value="${this.h(it.nomeApl)}"></label>
      </div>
      <div class="adm-form"><label style="grid-column:1/-1">Resumo do assunto<textarea id="fx-resumo" rows="3" style="padding:9px 10px;border:1.5px solid var(--gray-200);border-radius:8px;font-size:14px;font-family:inherit;text-transform:none;width:100%">${this.h(it.resumo)}</textarea></label></div>
      <div class="adm-form">
        <label>Avaliação pessoal<select id="fx-ap">${this.options(notas, it.avPessoal, "Selecione")}</select></label>
        <label>Avaliação do gestor (0 a 10)<select id="fx-ag">${this.options(notas, it.avGestor, "Selecione")}</select></label>
        <label>Desempenho (automático)<input type="text" id="fx-desemp" readonly></label>
        <label>Classificação (automática)<input type="text" id="fx-classif" readonly></label>
      </div>
      <div class="small-muted" style="margin:6px 0">Documento atual: ${/^https?:/.test(it.anexo) ? `sim · <label><input type="checkbox" id="fx-rm-anexo"> remover</label>` : "nenhum"}</div>
      ${this.anexoHtml("fx", "Trocar / anexar documento (opcional)")}
      <div id="fx-msg"></div>
      <div class="adm-actions"><button class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button><button class="btn btn-primary" id="fx-salvar">Salvar alterações</button></div>`);
    const $$ = (id)=> document.getElementById(id);
    this.ligarAnexo("fx");
    const nota = ()=>{
      const v = $$("fx-ag").value;
      if(v === ""){ $$("fx-desemp").value = ""; $$("fx-classif").value = ""; return; }
      $$("fx-desemp").value = this.desempenho(Number(v));
      $$("fx-classif").value = (this.ctx.classificacao||["Negativo","Neutro","Positivo"])[this.faixa(Number(v))];
    };
    nota();
    $$("fx-ag").addEventListener("change", nota);
    $$("fx-mat").addEventListener("input", ()=>{ $$("fx-nome").value = this.nomeDe(this.soDigitos($$("fx-mat").value)); });
    $$("fx-mat-apl").addEventListener("change", ()=>{ const n = this.nomeDe($$("fx-mat-apl").value); if(n) $$("fx-nome-apl").value = n; });
    $$("fx-salvar").addEventListener("click", async ()=>{
      const mat = this.soDigitos($$("fx-mat").value);
      if(!$$("fx-data").value) return this.aviso("fx-msg", "erro", "Informe a data.");
      if(!mat) return this.aviso("fx-msg", "erro", "Informe a matrícula do colaborador.");
      if(!$$("fx-motivo").value) return this.aviso("fx-msg", "erro", "Escolha o motivo.");
      if(!$$("fx-resumo").value.trim()) return this.aviso("fx-msg", "erro", "Escreva o resumo do assunto.");
      if($$("fx-ap").value === "" || $$("fx-ag").value === "") return this.aviso("fx-msg", "erro", "Informe as duas avaliações (0 a 10).");
      const a = this.anexos.fx, rm = $$("fx-rm-anexo");
      const r = await this.enviar($$("fx-salvar"), { acao:"lanc_feedback_editar", linha:it.linha, matOriginal:it.mat, dataOriginal:it.data, data:$$("fx-data").value, mat,
        motivo:$$("fx-motivo").value, matAplicador:$$("fx-mat-apl").value, nomeAplicador:$$("fx-nome-apl").value, resumo:$$("fx-resumo").value,
        avPessoal:Number($$("fx-ap").value), avGestor:Number($$("fx-ag").value), removerAnexo: !!(rm && rm.checked),
        anexo: a ? { nome:a.nome, mime:a.mime, base64:a.base64 } : null });
      if(!r || !r.ok) return this.aviso("fx-msg", "erro", this.h((r && r.erro) || "Não foi possível salvar."));
      UI.closeModal(); toast("Feedback atualizado.");
      const patch = { data:this.isoParaData($$("fx-data").value), motivo:$$("fx-motivo").value, resumo:$$("fx-resumo").value.trim(), avPessoal:Number($$("fx-ap").value),
        avGestor:Number($$("fx-ag").value), desempenho:r.desempenho||"", classificacao:r.classificacao||"", aplicador:r.aplicador||"", anexo:r.anexo||"" };
      if(aoSalvar) aoSalvar(patch, mat !== it.mat);
    });
  },

  /** Tira a foto/escolhe o arquivo e anexa a um feedback já lançado. camera=true abre a câmera/seletor na hora. */
  fbDocModal(ref, titulo, aoSalvar, camera){
    UI.openModal(`<h3 style="margin-top:0;">Documento do feedback</h3><p class="small-muted">${this.h(titulo||"")}</p>
      ${this.anexoHtml("fy", "Foto digitalizada ou PDF")}
      <div id="fy-msg"></div>
      <div class="adm-actions"><button class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button><button class="btn btn-primary" id="fy-salvar">Salvar documento</button></div>`);
    const $$ = (id)=> document.getElementById(id);
    this.ligarAnexo("fy");
    if(camera) $$("fy-foto-in").click();   // ainda dentro do toque do usuário → abre a câmera
    $$("fy-salvar").addEventListener("click", async ()=>{
      const a = this.anexos.fy;
      if(!a) return this.aviso("fy-msg", "erro", "Tire a foto (ou escolha o arquivo) primeiro.");
      let it;
      try{ it = ref.linha ? { linha:ref.linha, mat:ref.mat, data:ref.data } : await this.fbLocalizar(ref); }
      catch(e){ return this.aviso("fy-msg", "erro", this.h(e.message)); }
      const r = await this.enviar($$("fy-salvar"), { acao:"lanc_feedback_anexar", linha:it.linha, matOriginal:it.mat, dataOriginal:it.data,
        anexo:{ nome:a.nome, mime:a.mime, base64:a.base64 } });
      if(!r || !r.ok) return this.aviso("fy-msg", "erro", this.h((r && r.erro) || "Não foi possível salvar o documento."));
      UI.closeModal(); toast("Documento anexado ao feedback.");
      if(aoSalvar) aoSalvar({ anexo:r.anexo });
    });
  },

  /* ---- feedbacks lançados sem documento (para escanear depois) ---- */
  fbPend: { itens:null, erro:null },
  async fbPendentes(recarregar){
    const box = document.getElementById("fb-pend"); if(!box) return;
    const st = this.fbPend;
    if(recarregar || !st.itens){
      box.innerHTML = `<h2 class="adm-h">Feedbacks sem documento</h2><p class="small-muted">Carregando...</p>`;
      try{
        const r = await Api.call({ acao:"lanc_feedback_listar" });
        if(r && r.ok){ st.itens = r.itens||[]; st.erro = null; } else st.erro = (r && r.erro) || "Não foi possível carregar a lista.";
      }catch(e){ st.erro = e.message; }
    }
    const b = document.getElementById("fb-pend"); if(!b) return;
    if(st.erro){ b.innerHTML = `<h2 class="adm-h">Feedbacks sem documento</h2><div class="error-box">${this.h(st.erro)}</div>`; return; }
    const lista = (st.itens||[]).filter(i=>!/^https?:/.test(i.anexo)).reverse();
    b.innerHTML = `<div class="adm-head"><h2 class="adm-h">Feedbacks sem documento</h2><div class="adm-head-r"><button class="btn btn-outline btn-sm" id="fp-reload">Atualizar lista</button></div></div>
      <p class="small-muted">Lançou o feedback sem a foto? Escaneie depois aqui (ou em Gestão &gt; Feedbacks e Advertências, no detalhe da pessoa). Mostrando os mais recentes.</p>
      <div class="table-wrap"><table class="adm-table"><thead><tr><th>Data</th><th>Matrícula</th><th>Nome</th><th>Motivo</th><th></th></tr></thead><tbody>
      ${lista.slice(0,40).map(i=>`<tr><td>${this.br(i.data)||"—"}</td><td><strong>${this.h(i.mat)}</strong></td><td>${this.h(i.nome)}</td><td>${this.h(i.motivo)}</td>
        <td style="white-space:nowrap"><button class="btn btn-primary btn-sm" data-fp-doc="${i.linha}">📷 Escanear</button> <button class="btn btn-outline btn-sm" data-fp-ed="${i.linha}">Editar</button></td></tr>`).join("") || `<tr><td colspan="5" class="small-muted">Todos os feedbacks recentes têm documento. 👍</td></tr>`}
      </tbody></table></div>${lista.length>40?`<p class="small-muted">Mostrando 40 de ${lista.length}.</p>`:""}`;
    document.getElementById("fp-reload").addEventListener("click", ()=> this.fbPendentes(true));
    const achar = (linha)=> (st.itens||[]).find(x=>x.linha === linha);
    b.querySelectorAll("[data-fp-doc]").forEach(x=> x.addEventListener("click", ()=>{
      const i = achar(Number(x.dataset.fpDoc)); if(!i) return;
      this.fbDocModal({ linha:i.linha, mat:i.mat, data:i.data }, "Feedback — " + i.nome + " — " + this.br(i.data), ()=> this.fbPendentes(true), true);
    }));
    b.querySelectorAll("[data-fp-ed]").forEach(x=> x.addEventListener("click", ()=>{
      const i = achar(Number(x.dataset.fpEd)); if(!i) return;
      this.fbEditar({ item:i }, ()=> this.fbPendentes(true));
    }));
  },


  /* ================================================================== */
  /* ADVERTÊNCIA                                                         */
  /* ================================================================== */
  renderAdvertencia(){ this.abrir("ladvertencia", this._advertencia); },
  _advertencia(pane){
    const u = this.ctx.usuario || {};
    pane.innerHTML = `<div class="panel">
      ${this.cabecalho("Lançar Advertência", "Registra a advertência na aba ADVERTÊNCIAS, com o documento (foto digitalizada ou PDF). Ao escolher o colaborador e o motivo você vê o histórico de feedbacks e advertências dele.")}
      <div class="adm-form">
        <label>Data<input type="date" id="ad-data" value="${this.hojeISO()}"></label>
        <label>Matrícula do colaborador<input type="text" id="ad-mat" inputmode="numeric" list="dl-ad" placeholder="Ex.: 10002871" autocomplete="off"></label>
        <label>Nome (automático)<input type="text" id="ad-nome" readonly placeholder="—"></label>
      </div>
      ${this.datalistPessoas("dl-ad", false)}
      <div class="adm-form">${this.motivoSelect("ad-motivo")}</div>
      ${this.novoItem("MOTIVO_FEEDBACK", "ad-motivo", "novo motivo")}
      <div id="ad-nc"></div>
      <div id="ad-hist" style="margin:10px 0"></div>
      <div class="adm-form">
        <label>Matrícula do aplicador<input type="text" id="ad-mat-apl" inputmode="numeric" list="dl-ad" value="${this.h(u.matricula||"")}"></label>
        <label>Nome do aplicador<input type="text" id="ad-nome-apl" value="${this.h(u.nome || this.nomeDe(u.matricula) || "")}"></label>
      </div>
      <div class="adm-form"><label style="grid-column:1/-1">Resumo da advertência<textarea id="ad-resumo" rows="3" style="padding:9px 10px;border:1.5px solid var(--gray-200);border-radius:8px;font-size:14px;font-family:inherit;text-transform:none;letter-spacing:0;font-weight:500;" placeholder="Descreva o motivo e o que ocorreu"></textarea></label></div>
      ${this.anexoHtml("ad", "Documento da advertência (opcional)")}
      <div id="ad-msg"></div>
      <div class="adm-actions"><button type="button" class="btn btn-primary" id="ad-salvar">Salvar advertência</button></div>
      ${this.rodapeAtualizar()}
    </div>
    <div class="panel" id="ad-lancadas"></div>`;
    const $$ = (id)=> document.getElementById(id);
    const mostrarAnexo = this.ligarAnexo("ad");
    this.ligarNovoItem(pane);
    const historico = ()=>{
      const mat = this.soDigitos($$("ad-mat").value), box = $$("ad-hist");
      $$("ad-nome").value = this.nomeDe(mat); $$("ad-nome").placeholder = mat ? "matrícula não encontrada" : "—";
      if(!mat){ box.innerHTML = ""; return; }
      if(!(window.APP_STATE && APP_STATE.ready && window.FeedbackAdv)){
        box.innerHTML = `<div class="hint-box">Para ver o histórico do colaborador, carregue os dados (<strong>Atualizar dados</strong>).</div>`; return;
      }
      const e = FeedbackAdv.statsPorMatricula(mat);
      const motivo = $$("ad-motivo").value, fab = motivo ? e.motivos.find(m=>m.chave === FeedbackAdv.mk(motivo)) : null;
      const linhas = (e.motivos||[]).map(m=>`<tr${motivo && m.chave === FeedbackAdv.mk(motivo) ? ' style="background:#fff8e1"' : ""}><td>${this.h(m.motivo)}</td><td>${m.fb}</td><td>${m.adv}</td><td>${m.pend ? `<strong style="color:#d64545">${m.pend} a emitir</strong>` : "—"}</td><td>${m.suspPend ? `<strong style="color:#8e1b1b">⛔ ${m.suspPend} suspensão a emitir</strong>` : `<span class="small-muted">${m.susp} · faltam ${m.faltamSusp} advert.</span>`}</td></tr>`).join("");
      let rec = "";
      if(motivo){
        rec = fab && fab.pend > 0 ? `<div class="warn-box" style="margin:8px 0 0">🔴 Indicada: ${fab.fb} feedback(s) em "${this.h(motivo)}" e ${fab.adv} advertência(s) — faltam ${fab.pend} advertência(s) pela regra (a cada ${fab ? fab.porAdv : FB_A_CADA} feedbacks).</div>`
          : `<div class="hint-box" style="margin:8px 0 0">Em "${this.h(motivo)}": ${fab ? fab.fb : 0} feedback(s) e ${fab ? fab.adv : 0} advertência(s). Pela regra de ${fab ? fab.porAdv : FB_A_CADA} feedbacks, ainda <strong>não</strong> há advertência pendente neste motivo.</div>`;
      }
      box.innerHTML = `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">
          <div class="card" style="min-width:120px"><div class="card-label">Feedbacks</div><div class="card-value">${e.feedbacks.length}</div></div>
          <div class="card" style="min-width:120px"><div class="card-label">Advertências</div><div class="card-value">${e.adv.length}</div></div>
          <div class="card" style="min-width:150px"><div class="card-label">Último feedback</div><div class="card-value" style="font-size:18px">${e.feedbacks[0] ? fmtDateBR(e.feedbacks[0].data) : "—"}</div></div></div>
        ${linhas ? `<div class="table-wrap"><table class="adm-table"><thead><tr><th>Motivo</th><th>Feedbacks</th><th>Advertências</th><th>Situação</th><th>Suspensão</th></tr></thead><tbody>${linhas}</tbody></table></div>` : `<div class="small-muted">Sem feedbacks nem advertências anteriores.</div>`}${rec}`;
    };
    $$("ad-mat").addEventListener("input", historico); $$("ad-mat").addEventListener("change", historico);
    $$("ad-motivo").addEventListener("change", historico);
    $$("ad-mat-apl").addEventListener("change", ()=>{ const n = this.nomeDe($$("ad-mat-apl").value); if(n) $$("ad-nome-apl").value = n; });
    this.ligarNcIndicar("ad");
    this.aplicarPrefill("ad-mat"); historico();
    $$("ad-salvar").addEventListener("click", async ()=>{
      this.aviso("ad-msg", "", "");
      const mat = this.soDigitos($$("ad-mat").value);
      if(!mat) return this.aviso("ad-msg", "erro", "Informe a matrícula do colaborador.");
      if(!this.nomeDe(mat)) return this.aviso("ad-msg", "erro", "Matrícula não encontrada no quadro (aba TURNOVER).");
      if(!$$("ad-motivo").value) return this.aviso("ad-msg", "erro", "Escolha o motivo da advertência.");
      if(!$$("ad-resumo").value.trim()) return this.aviso("ad-msg", "erro", "Escreva o resumo da advertência.");
      const a = this.anexos.ad;
      const r = await this.enviar($$("ad-salvar"), { acao:"lanc_advertencia_salvar", data:$$("ad-data").value, mat, motivo:$$("ad-motivo").value,
        matAplicador:$$("ad-mat-apl").value, nomeAplicador:$$("ad-nome-apl").value, resumo:$$("ad-resumo").value,
        anexo: a ? { nome:a.nome, mime:a.mime, base64:a.base64 } : null });
      if(!r || !r.ok) return this.aviso("ad-msg", "erro", this.h((r && r.erro) || "Não foi possível salvar."));
      this.aviso("ad-msg", "ok", `Advertência de <strong>${this.h(r.nome)}</strong> salva${r.anexo ? " · documento anexado" : ""}. Use <strong>Atualizar dados</strong> para ela aparecer em Gestão.`);
      toast("Advertência salva.");
      $$("ad-mat").value = ""; $$("ad-nome").value = ""; $$("ad-resumo").value = ""; $$("ad-motivo").value = "";
      this.anexos.ad = null; mostrarAnexo(); historico();
      this.advListar(true);
    });
    this.advListar(true);
  },

  /* ---- advertências já lançadas: lista + edição ---- */
  adv: { itens:null, erro:null, filtro:"" },
  async advListar(buscar){
    const box = document.getElementById("ad-lancadas"); if(!box) return;
    const st = this.adv;
    if(buscar || !st.itens){
      box.innerHTML = `<h2 class="adm-h">Advertências já lançadas</h2><p class="small-muted">Carregando...</p>`;
      try{
        const r = await Api.call({ acao:"lanc_advertencia_listar" });
        if(r && r.ok){ st.itens = r.itens||[]; st.erro = null; } else st.erro = (r && r.erro) || "Não foi possível carregar a lista.";
      }catch(e){ st.erro = e.message; }
    }
    this.advDesenhar();
  },
  advDesenhar(){
    const box = document.getElementById("ad-lancadas"); if(!box) return;
    const st = this.adv, f = (st.filtro||"").toLowerCase().trim();
    if(st.erro){ box.innerHTML = `<h2 class="adm-h">Advertências já lançadas</h2><div class="error-box">${this.h(st.erro)}</div><button class="btn btn-outline" id="ad-l-retry">Tentar novamente</button>`; document.getElementById("ad-l-retry").addEventListener("click", ()=> this.advListar(true)); return; }
    const lista = (st.itens||[]).filter(i=> !f || (i.mat+" "+i.nome+" "+i.motivo).toLowerCase().includes(f));
    box.innerHTML = `<div class="adm-head"><h2 class="adm-h">Advertências já lançadas</h2>
        <div class="adm-head-r"><input type="search" id="ad-l-busca" placeholder="Buscar matrícula, nome ou motivo" value="${this.h(st.filtro||"")}"><button class="btn btn-outline btn-sm" id="ad-l-reload">Atualizar lista</button></div></div>
      <p class="small-muted">Errou a data ou outro dado? Clique em <strong>Editar</strong> para corrigir. Depois use <strong>Atualizar dados</strong> (menu) para os indicadores enxergarem a mudança.</p>
      <div class="table-wrap"><table class="adm-table"><thead><tr><th>Data</th><th>Matrícula</th><th>Nome</th><th>Motivo</th><th>Aplicador</th><th>Doc.</th><th></th></tr></thead><tbody>
      ${lista.slice(0,100).map(i=>`<tr><td>${i.data ? i.data.split("-").reverse().join("/") : "—"}</td><td><strong>${this.h(i.mat)}</strong></td><td>${this.h(i.nome)}</td><td>${this.h(i.motivo)}</td><td>${this.h(i.nomeApl||i.matApl||"—")}</td>
        <td>${/^https?:/.test(i.anexo) ? `<a href="${this.h(i.anexo)}" target="_blank" rel="noopener">abrir</a>` : "—"}</td>
        <td><button class="btn btn-outline btn-sm" data-adv-ed="${i.linha}">Editar</button></td></tr>`).join("") || `<tr><td colspan="7" class="small-muted">Nenhuma advertência encontrada.</td></tr>`}
      </tbody></table></div>${lista.length>100?`<p class="small-muted">Mostrando 100 de ${lista.length}. Use a busca para filtrar.</p>`:""}`;
    document.getElementById("ad-l-busca").addEventListener("input", e=>{ st.filtro = e.target.value; const p = e.target.selectionStart; this.advDesenhar(); const n = document.getElementById("ad-l-busca"); n.focus(); try{ n.setSelectionRange(p,p); }catch(x){} });
    document.getElementById("ad-l-reload").addEventListener("click", ()=> this.advListar(true));
    box.querySelectorAll("[data-adv-ed]").forEach(b=> b.addEventListener("click", ()=> this.advEditar(Number(b.dataset.advEd))));
  },
  advEditar(linha){
    const it = (this.adv.itens||[]).find(x=>x.linha===linha); if(!it) return;
    UI.openModal(`<h3 style="margin-top:0;">Editar advertência</h3>
      <div class="adm-form">
        <label>Data<input type="date" id="ed-data" value="${this.h(it.data)}"></label>
        <label>Matrícula do colaborador<input type="text" id="ed-mat" inputmode="numeric" value="${this.h(it.mat)}"></label>
        <label>Nome (automático)<input type="text" id="ed-nome" readonly value="${this.h(this.nomeDe(it.mat) || it.nome)}"></label>
      </div>
      <div class="adm-form">${this.motivoSelect("ed-motivo", it.motivo)}</div>
      <div class="adm-form">
        <label>Matrícula do aplicador<input type="text" id="ed-mat-apl" inputmode="numeric" value="${this.h(it.matApl)}"></label>
        <label>Nome do aplicador<input type="text" id="ed-nome-apl" value="${this.h(it.nomeApl)}"></label>
      </div>
      <div class="adm-form"><label style="grid-column:1/-1">Resumo da advertência<textarea id="ed-resumo" rows="3" style="padding:9px 10px;border:1.5px solid var(--gray-200);border-radius:8px;font-size:14px;font-family:inherit;text-transform:none;letter-spacing:0;font-weight:500;">${this.h(it.resumo)}</textarea></label></div>
      <div class="small-muted" style="margin:6px 0">Documento atual: ${/^https?:/.test(it.anexo) ? `<a href="${this.h(it.anexo)}" target="_blank" rel="noopener">abrir</a> · <label><input type="checkbox" id="ed-rm-anexo"> remover</label>` : "nenhum"}</div>
      ${this.anexoHtml("ed", "Trocar / anexar documento (opcional)")}
      <div id="ed-msg"></div>
      <div class="adm-actions"><button class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button><button class="btn btn-primary" id="ed-salvar">Salvar alterações</button></div>`);
    const $$ = (id)=> document.getElementById(id);
    this.ligarAnexo("ed");
    $$("ed-mat").addEventListener("input", ()=>{ $$("ed-nome").value = this.nomeDe(this.soDigitos($$("ed-mat").value)); });
    $$("ed-mat-apl").addEventListener("change", ()=>{ const n = this.nomeDe($$("ed-mat-apl").value); if(n) $$("ed-nome-apl").value = n; });
    $$("ed-salvar").addEventListener("click", async ()=>{
      const mat = this.soDigitos($$("ed-mat").value);
      if(!$$("ed-data").value) return this.aviso("ed-msg", "erro", "Informe a data.");
      if(!mat) return this.aviso("ed-msg", "erro", "Informe a matrícula do colaborador.");
      if(!$$("ed-motivo").value) return this.aviso("ed-msg", "erro", "Escolha o motivo.");
      if(!$$("ed-resumo").value.trim()) return this.aviso("ed-msg", "erro", "Escreva o resumo.");
      const a = this.anexos.ed, rm = $$("ed-rm-anexo");
      const r = await this.enviar($$("ed-salvar"), { acao:"lanc_advertencia_editar", linha, matOriginal:it.mat, data:$$("ed-data").value, mat, motivo:$$("ed-motivo").value,
        matAplicador:$$("ed-mat-apl").value, nomeAplicador:$$("ed-nome-apl").value, resumo:$$("ed-resumo").value, removerAnexo: !!(rm && rm.checked),
        anexo: a ? { nome:a.nome, mime:a.mime, base64:a.base64 } : null });
      if(!r || !r.ok) return this.aviso("ed-msg", "erro", this.h((r && r.erro) || "Não foi possível salvar."));
      UI.closeModal(); toast("Advertência atualizada. Use Atualizar dados para refletir em Gestão.");
      this.advListar(true);
    });
  },

  /* ================================================================== */
  /* SUSPENSÃO (aba SUSPENSÕES) — 3 advertências no mesmo motivo         */
  /* ================================================================== */
  renderSuspensao(){ this.abrir("lsuspensao", this._suspensao); },
  somaDiasISO(iso, n){ return this.somaDias(iso, n); },
  _suspensao(pane){
    const u = this.ctx.usuario || {};
    const ta = `padding:9px 10px;border:1.5px solid var(--gray-200);border-radius:8px;font-size:14px;font-family:inherit;text-transform:none;letter-spacing:0;font-weight:500;`;
    pane.innerHTML = `<div class="panel">
      ${this.cabecalho("Lançar Suspensão", "Registra a suspensão disciplinar na aba SUSPENSÕES, com o documento (foto digitalizada ou PDF). Ao escolher o colaborador e o motivo você vê as advertências que levaram à suspensão (3 advertências no mesmo motivo).")}
      <div class="adm-form">
        <label>Início da suspensão<input type="date" id="sp-data" value="${this.hojeISO()}"></label>
        <label>Dias de suspensão<input type="number" id="sp-dias" min="1" max="30" step="1" value="1"></label>
        <label>Último dia (automático)<input type="text" id="sp-fim" readonly placeholder="—"></label>
      </div>
      <div class="adm-form">
        <label>Matrícula do colaborador<input type="text" id="sp-mat" inputmode="numeric" list="dl-sp" placeholder="Ex.: 10002871" autocomplete="off"></label>
        <label>Nome (automático)<input type="text" id="sp-nome" readonly placeholder="—"></label>
      </div>
      ${this.datalistPessoas("dl-sp", false)}
      <div class="adm-form">${this.motivoSelect("sp-motivo")}</div>
      ${this.novoItem("MOTIVO_FEEDBACK", "sp-motivo", "novo motivo")}
      <div id="sp-nc"></div>
      <div id="sp-hist" style="margin:10px 0"></div>
      <div class="adm-form">
        <label>Matrícula do aplicador<input type="text" id="sp-mat-apl" inputmode="numeric" list="dl-sp" value="${this.h(u.matricula||"")}"></label>
        <label>Nome do aplicador<input type="text" id="sp-nome-apl" value="${this.h(u.nome || this.nomeDe(u.matricula) || "")}"></label>
      </div>
      <div class="adm-form"><label style="grid-column:1/-1">Resumo da suspensão<textarea id="sp-resumo" rows="4" style="${ta}" placeholder="Descreva o motivo e as advertências anteriores"></textarea></label></div>
      ${this.anexoHtml("sp", "Documento da suspensão (opcional)")}
      <div id="sp-msg"></div>
      <div class="adm-actions"><button type="button" class="btn btn-primary" id="sp-salvar">Salvar suspensão</button></div>
      ${this.rodapeAtualizar()}
    </div>
    <div class="panel" id="sp-lancadas"></div>`;
    const $$ = (id)=> document.getElementById(id);
    const mostrarAnexo = this.ligarAnexo("sp");
    this.ligarNovoItem(pane);
    const fim = ()=>{ const d = $$("sp-data").value, n = Math.round(Number($$("sp-dias").value)||0); $$("sp-fim").value = d && n>0 ? this.br(this.somaDias(d, n-1)) : ""; };
    $$("sp-data").addEventListener("change", fim); $$("sp-dias").addEventListener("input", fim); fim();
    const contexto = ()=>{
      const mat = this.soDigitos($$("sp-mat").value), box = $$("sp-hist"), ind = $$("sp-nc");
      $$("sp-nome").value = this.nomeDe(mat); $$("sp-nome").placeholder = mat ? "matrícula não encontrada" : "—";
      if(!mat || !(window.APP_STATE && APP_STATE.ready && window.FeedbackAdv)){ box.innerHTML = ""; ind.innerHTML = ""; return; }
      ind.innerHTML = FeedbackAdv.htmlIndicacaoSusp(mat);
      const e = FeedbackAdv.statsPorMatricula(mat), motivo = $$("sp-motivo").value;
      const linhas = (e.motivos||[]).map(m=>`<tr${motivo && m.chave === FeedbackAdv.mk(motivo) ? ' style="background:#fff8e1"' : ""}><td>${this.h(m.motivo)}</td><td>${m.fb}</td><td>${m.adv}</td><td>${m.susp}</td><td>${m.suspPend ? `<strong style="color:#d64545">${m.suspPend} a emitir</strong>` : `<span class="small-muted">faltam ${m.faltamSusp} advert.</span>`}</td></tr>`).join("");
      box.innerHTML = linhas ? `<div class="table-wrap"><table class="adm-table"><thead><tr><th>Motivo</th><th>Feedbacks</th><th>Advertências</th><th>Suspensões</th><th>Situação</th></tr></thead><tbody>${linhas}</tbody></table></div>` : `<div class="small-muted">Sem feedbacks, advertências nem suspensões anteriores.</div>`;
    };
    $$("sp-mat").addEventListener("input", contexto); $$("sp-mat").addEventListener("change", contexto); $$("sp-motivo").addEventListener("change", contexto);
    $$("sp-mat-apl").addEventListener("change", ()=>{ const n = this.nomeDe($$("sp-mat-apl").value); if(n) $$("sp-nome-apl").value = n; });
    this.aplicarPrefill("sp-mat"); contexto();
    $$("sp-salvar").addEventListener("click", async ()=>{
      this.aviso("sp-msg", "", "");
      const mat = this.soDigitos($$("sp-mat").value), dias = Math.round(Number($$("sp-dias").value)||0);
      if(!mat) return this.aviso("sp-msg", "erro", "Informe a matrícula do colaborador.");
      if(!this.nomeDe(mat)) return this.aviso("sp-msg", "erro", "Matrícula não encontrada no quadro (aba TURNOVER).");
      if(!$$("sp-motivo").value) return this.aviso("sp-msg", "erro", "Escolha o motivo da suspensão.");
      if(dias < 1 || dias > 30) return this.aviso("sp-msg", "erro", "Informe os dias de suspensão (1 a 30).");
      if(!$$("sp-resumo").value.trim()) return this.aviso("sp-msg", "erro", "Escreva o resumo da suspensão.");
      const a = this.anexos.sp;
      const r = await this.enviar($$("sp-salvar"), { acao:"lanc_suspensao_salvar", data:$$("sp-data").value, dias, mat, motivo:$$("sp-motivo").value,
        matAplicador:$$("sp-mat-apl").value, nomeAplicador:$$("sp-nome-apl").value, resumo:$$("sp-resumo").value,
        anexo: a ? { nome:a.nome, mime:a.mime, base64:a.base64 } : null });
      if(!r || !r.ok) return this.aviso("sp-msg", "erro", this.h((r && r.erro) || "Não foi possível salvar."));
      this.aviso("sp-msg", "ok", `Suspensão de <strong>${this.h(r.nome)}</strong> salva${r.anexo ? " · documento anexado" : ""}. Use <strong>Atualizar dados</strong> para ela aparecer em Gestão.`);
      toast("Suspensão salva.");
      $$("sp-mat").value = ""; $$("sp-nome").value = ""; $$("sp-resumo").value = ""; $$("sp-motivo").value = "";
      this.anexos.sp = null; mostrarAnexo(); contexto();
      this.spListar(true);
    });
    this.spListar(true);
  },
  sp: { itens:null, erro:null, filtro:"" },
  async spListar(buscar){
    const box = document.getElementById("sp-lancadas"); if(!box) return;
    const st = this.sp;
    if(buscar || !st.itens){
      box.innerHTML = `<h2 class="adm-h">Suspensões já lançadas</h2><p class="small-muted">Carregando...</p>`;
      try{
        const r = await Api.call({ acao:"lanc_suspensao_listar" });
        if(r && r.ok){ st.itens = r.itens||[]; st.erro = null; } else st.erro = (r && r.erro) || "Não foi possível carregar a lista.";
      }catch(e){ st.erro = e.message; }
    }
    this.spDesenhar();
  },
  spDesenhar(){
    const box = document.getElementById("sp-lancadas"); if(!box) return;
    const st = this.sp, f = (st.filtro||"").toLowerCase().trim();
    if(st.erro){ box.innerHTML = `<h2 class="adm-h">Suspensões já lançadas</h2><div class="error-box">${this.h(st.erro)}</div><button class="btn btn-outline" id="sp-l-retry">Tentar novamente</button>`; document.getElementById("sp-l-retry").addEventListener("click", ()=> this.spListar(true)); return; }
    const lista = (st.itens||[]).filter(i=> !f || (i.mat+" "+i.nome+" "+i.motivo).toLowerCase().includes(f));
    box.innerHTML = `<div class="adm-head"><h2 class="adm-h">Suspensões já lançadas</h2>
        <div class="adm-head-r"><input type="search" id="sp-l-busca" placeholder="Buscar matrícula, nome ou motivo" value="${this.h(st.filtro||"")}"><button class="btn btn-outline btn-sm" id="sp-l-reload">Atualizar lista</button></div></div>
      <div class="table-wrap"><table class="adm-table"><thead><tr><th>Início</th><th>Fim</th><th>Dias</th><th>Matrícula</th><th>Nome</th><th>Motivo</th><th>Doc.</th><th></th></tr></thead><tbody>
      ${lista.slice(0,100).map(i=>`<tr><td>${this.br(i.data)||"—"}</td><td>${this.br(i.fim)||"—"}</td><td>${i.dias||"—"}</td><td><strong>${this.h(i.mat)}</strong></td><td>${this.h(i.nome)}</td><td>${this.h(i.motivo)}</td>
        <td>${/^https?:/.test(i.anexo) ? `<a href="${this.h(i.anexo)}" target="_blank" rel="noopener">abrir</a>` : "—"}</td>
        <td><button class="btn btn-outline btn-sm" data-sp-ed="${i.linha}">Editar</button></td></tr>`).join("") || `<tr><td colspan="8" class="small-muted">Nenhuma suspensão encontrada.</td></tr>`}
      </tbody></table></div>`;
    document.getElementById("sp-l-busca").addEventListener("input", e=>{ st.filtro = e.target.value; const p = e.target.selectionStart; this.spDesenhar(); const n = document.getElementById("sp-l-busca"); n.focus(); try{ n.setSelectionRange(p,p); }catch(x){} });
    document.getElementById("sp-l-reload").addEventListener("click", ()=> this.spListar(true));
    box.querySelectorAll("[data-sp-ed]").forEach(b=> b.addEventListener("click", ()=> this.spEditar(Number(b.dataset.spEd))));
  },
  spEditar(linha){
    const it = (this.sp.itens||[]).find(x=>x.linha===linha); if(!it) return;
    UI.openModal(`<h3 style="margin-top:0;">Editar suspensão</h3>
      <div class="adm-form">
        <label>Início<input type="date" id="sx-data" value="${this.h(it.data)}"></label>
        <label>Dias<input type="number" id="sx-dias" min="1" max="30" value="${it.dias||1}"></label>
        <label>Matrícula<input type="text" id="sx-mat" inputmode="numeric" value="${this.h(it.mat)}"></label>
      </div>
      <div class="adm-form">${this.motivoSelect("sx-motivo", it.motivo)}</div>
      <div class="adm-form"><label style="grid-column:1/-1">Resumo<textarea id="sx-resumo" rows="4" style="padding:9px 10px;border:1.5px solid var(--gray-200);border-radius:8px;font-size:14px;font-family:inherit;text-transform:none;letter-spacing:0;font-weight:500;">${this.h(it.resumo)}</textarea></label></div>
      <div class="small-muted" style="margin:6px 0">Documento atual: ${/^https?:/.test(it.anexo) ? `<a href="${this.h(it.anexo)}" target="_blank" rel="noopener">abrir</a> · <label><input type="checkbox" id="sx-rm-anexo"> remover</label>` : "nenhum"}</div>
      ${this.anexoHtml("sx", "Trocar / anexar documento (opcional)")}
      <div id="sx-msg"></div>
      <div class="adm-actions"><button class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button><button class="btn btn-primary" id="sx-salvar">Salvar alterações</button></div>`);
    const $$ = (id)=> document.getElementById(id);
    this.ligarAnexo("sx");
    $$("sx-salvar").addEventListener("click", async ()=>{
      const mat = this.soDigitos($$("sx-mat").value), a = this.anexos.sx, rm = $$("sx-rm-anexo");
      if(!$$("sx-data").value || !mat || !$$("sx-motivo").value || !$$("sx-resumo").value.trim()) return this.aviso("sx-msg", "erro", "Preencha data, matrícula, motivo e resumo.");
      const r = await this.enviar($$("sx-salvar"), { acao:"lanc_suspensao_editar", linha, matOriginal:it.mat, data:$$("sx-data").value, dias:Number($$("sx-dias").value)||0, mat,
        motivo:$$("sx-motivo").value, resumo:$$("sx-resumo").value, removerAnexo: !!(rm && rm.checked), anexo: a ? { nome:a.nome, mime:a.mime, base64:a.base64 } : null });
      if(!r || !r.ok) return this.aviso("sx-msg", "erro", this.h((r && r.erro) || "Não foi possível salvar."));
      UI.closeModal(); toast("Suspensão atualizada. Use Atualizar dados para refletir em Gestão."); this.spListar(true);
    });
  },

  /* ================================================================== */
  /* FÉRIAS                                                              */
  /* ================================================================== */
  renderFerias(){ this.abrir("lferias", this._ferias); },
  async _ferias(pane){
    const dias = this.ctx.diasFerias || [5,10,15,20,25,30,31];
    this.fe = { dias:null, lista:[], todas:false };
    pane.innerHTML = `<div class="panel">
      ${this.cabecalho("Lançar Férias", "Agende as férias do colaborador. Na chamada, os dias de férias já vêm marcados como FÉRIAS (segunda a sexta) e o agendamento aparece em Gestão > Férias.")}
      <div class="adm-form">
        <label>Matrícula do colaborador<input type="text" id="fe-mat" inputmode="numeric" list="dl-fe" placeholder="Ex.: 10003615" autocomplete="off"></label>
        <label>Nome (automático)<input type="text" id="fe-nome" readonly placeholder="—"></label>
        <label>Início das férias<input type="date" id="fe-ini" value="${this.hojeISO()}"></label>
      </div>
      ${this.datalistPessoas("dl-fe", true)}
      <div style="margin:6px 0 2px"><span class="small-muted" style="font-weight:700">Quantidade de dias:</span></div>
      <div id="fe-dias">${dias.map(n=>`<button type="button" class="btn btn-outline" data-dias="${n}" style="margin:3px 6px 3px 0;min-width:58px">${n === 31 ? "30/31" : n}</button>`).join("")}</div>
      <div id="fe-res" class="small-muted" style="margin:10px 0"></div>
      <div id="fe-alerta"></div>
      <div id="fe-msg"></div>
      <div class="adm-actions"><button type="button" class="btn btn-primary" id="fe-salvar">Agendar férias</button></div>
    </div>
    <div class="panel">
      <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center"><h3 class="adm-h2" style="margin:0">Férias agendadas</h3>
        <label class="adm-chk"><input type="checkbox" id="fe-todas"> Mostrar também as já encerradas e canceladas</label></div>
      <div id="fe-lista" style="margin-top:10px"><p class="small-muted">Carregando...</p></div>
    </div>`;
    const $$ = (id)=> document.getElementById(id);
    const fimDe = (ini, n)=> this.somaDias(ini, n - 1);
    const sobrepoe = (a1, a2, b1, b2)=> a1 <= b2 && b1 <= a2;
    const resumo = ()=>{
      const ini = $$("fe-ini").value, n = this.fe.dias, mat = this.soDigitos($$("fe-mat").value);
      $$("fe-nome").value = this.nomeDe(mat); $$("fe-nome").placeholder = mat ? "matrícula não encontrada" : "—";
      $$("fe-dias").querySelectorAll("[data-dias]").forEach(b=>{ const on = Number(b.dataset.dias) === n; b.classList.toggle("btn-primary", on); b.classList.toggle("btn-outline", !on); });
      if(!ini || !n){ $$("fe-res").textContent = n ? "" : "Escolha a quantidade de dias."; $$("fe-alerta").innerHTML = ""; return; }
      const fim = fimDe(ini, n);
      $$("fe-res").innerHTML = `Férias de <strong>${this.br(ini)}</strong> a <strong>${this.br(fim)}</strong> (${n === 31 ? "30/31" : n} dias corridos). Retorno em <strong>${this.br(this.somaDias(fim, 1))}</strong>.`;
      const outros = this.fe.lista.filter(f=> f.status !== "CANCELADA" && f.mat !== mat && sobrepoe(ini, fim, f.ini, f.fim));
      $$("fe-alerta").innerHTML = outros.length ? `<div class="warn-box">⚠️ Já há férias agendadas no mesmo período: ${outros.map(f=>`<strong>${this.h(f.nome)}</strong> (${this.br(f.ini)} a ${this.br(f.fim)})`).join("; ")}. Você ainda pode agendar, mas confira a cobertura da equipe.</div>` : "";
    };
    const desenharLista = ()=>{
      const hoje = this.hojeISO();
      const l = this.fe.lista.filter(f=> this.fe.todas || (f.status !== "CANCELADA" && f.fim >= hoje)).sort((a,b)=> a.ini < b.ini ? -1 : 1);
      $$("fe-lista").innerHTML = l.length ? `<div class="table-wrap"><table class="adm-table"><thead><tr><th>Matrícula</th><th>Colaborador</th><th>Início</th><th>Fim</th><th>Dias</th><th>Situação</th><th></th></tr></thead><tbody>
        ${l.map(f=>{ const canc = f.status === "CANCELADA", enc = f.fim < hoje, em = f.ini <= hoje && hoje <= f.fim;
          return `<tr><td>${this.h(f.mat)}</td><td>${this.h(f.nome)}</td><td>${this.br(f.ini)}</td><td>${this.br(f.fim)}</td><td>${f.dias}</td>
          <td>${canc ? "Cancelada" : em ? "<strong style='color:#7a3fc4'>Em andamento</strong>" : enc ? "Encerrada" : "Agendada"}</td>
          <td>${!canc && !enc ? `<button type="button" class="btn btn-outline btn-sm" data-cancel="${f.linha}">Cancelar</button>` : ""}</td></tr>`; }).join("")}</tbody></table></div>`
        : `<div class="small-muted">Nenhuma férias agendada.</div>`;
      $$("fe-lista").querySelectorAll("[data-cancel]").forEach(b=> b.addEventListener("click", async ()=>{
        if(!confirm("Cancelar este agendamento de férias?")) return;
        const r = await this.enviar(b, { acao:"lanc_ferias_cancelar", linha:Number(b.dataset.cancel) });
        if(!r || !r.ok) return toast((r && r.erro) || "Não foi possível cancelar.", "error");
        toast("Agendamento cancelado."); await carregar();
      }));
    };
    const carregar = async ()=>{
      const r = await Api.call({ acao:"lanc_ferias_listar" }).catch(e=>({ ok:false, erro:e.message }));
      if(!r || !r.ok){ $$("fe-lista").innerHTML = `<div class="error-box">${this.h((r && r.erro) || "Falha ao carregar.")}</div>`; return; }
      this.fe.lista = r.ferias || []; desenharLista(); resumo();
    };
    $$("fe-mat").addEventListener("input", resumo); $$("fe-mat").addEventListener("change", resumo);
    $$("fe-ini").addEventListener("change", resumo);
    $$("fe-dias").querySelectorAll("[data-dias]").forEach(b=> b.addEventListener("click", ()=>{ this.fe.dias = Number(b.dataset.dias); resumo(); }));
    $$("fe-todas").addEventListener("change", ()=>{ this.fe.todas = $$("fe-todas").checked; desenharLista(); });
    $$("fe-salvar").addEventListener("click", async ()=>{
      this.aviso("fe-msg", "", "");
      const mat = this.soDigitos($$("fe-mat").value);
      if(!mat) return this.aviso("fe-msg", "erro", "Informe a matrícula do colaborador.");
      if(!this.nomeDe(mat)) return this.aviso("fe-msg", "erro", "Matrícula não encontrada no quadro (aba TURNOVER).");
      if(!$$("fe-ini").value) return this.aviso("fe-msg", "erro", "Informe a data de início.");
      if(!this.fe.dias) return this.aviso("fe-msg", "erro", "Escolha a quantidade de dias.");
      const r = await this.enviar($$("fe-salvar"), { acao:"lanc_ferias_salvar", mat, ini:$$("fe-ini").value, dias:this.fe.dias });
      if(!r || !r.ok) return this.aviso("fe-msg", "erro", this.h((r && r.erro) || "Não foi possível agendar."));
      const conf = (r.conflitos||[]).length ? `<br>⚠️ Coincide com férias de: ${r.conflitos.map(c=>`<strong>${this.h(c.nome)}</strong> (${this.br(c.ini)} a ${this.br(c.fim)})`).join("; ")}.` : "";
      this.aviso("fe-msg", (r.conflitos||[]).length ? "aviso" : "ok", `Férias de <strong>${this.h(r.nome)}</strong> agendadas: ${this.br(r.ini)} a ${this.br(r.fim)} (${r.dias} dias).${conf}`);
      toast("Férias agendadas."); $$("fe-mat").value = ""; this.fe.dias = null; await carregar(); resumo();
    });
    this.aplicarPrefill("fe-mat");
    await carregar();
  },

  /* ================================================================== */
  /* AVARIA 9712 (aba REP.AVARIA)                                         */
  /* ================================================================== */
  renderAvaria(){ this.abrir("lavaria", this._avaria); },

  /** Num.Lançamento da 9712 que o site já tem em memória (carregados com os dados): conferência instantânea, sem rede. */
  nums9712(){
    const pr = window.APP_STATE && window.APP_STATE.processed;
    if(!pr) return { set:new Set(), data:new Map(), rows:new Map(), transacao:new Map(), ok:false };
    if(this._n9712 && this._n9712.src === pr.p9712) return this._n9712;
    const set = new Set(), data = new Map(), rows = new Map(), transacao = new Map();
    (pr.p9712||[]).forEach(r=>{
      const n = this.soDigitos(r.numLanc);
      if(n){ set.add(n); if(r.dt && !data.has(n)) data.set(n, r.dt); if(!rows.has(n)) rows.set(n, []); rows.get(n).push(r); }
      const t = this.soDigitos(r.numReg);
      if(t && n){ if(!transacao.has(t)) transacao.set(t, new Set()); transacao.get(t).add(n); }
    });
    return (this._n9712 = { src:pr.p9712, set, data, rows, transacao, ok:!!pr.p9712dispo && set.size>0 });
  },
  /** número digitado → Num.Lançamento efetivo (aceita também o Num. Transação, quando ele aponta para um único lançamento) */
  resolver9712(num){
    const d = this.nums9712();
    if(d.set.has(num)) return { num, via:"lancamento" };
    const t = d.transacao.get(num);
    if(t && t.size === 1) return { num:Array.from(t)[0], via:"transacao", original:num };
    return { num, via:"lancamento" };
  },
  /** resumo de um lançamento da 9712: quem lançou, data, motivo (Cód.Motivo) e itens */
  info9712(num){
    const rows = this.nums9712().rows.get(num); if(!rows || !rows.length) return null;
    const p = rows[0], cods = Array.from(new Set(rows.map(r=>r.codMotivo).filter(Boolean)));
    const rec = rows.some(r=>r.codMotivo === "1886");
    return { num, rows, func:p.funcLanc, nomeFunc:p.nome, dt:(rows.find(r=>r.dt)||{}).dt || null, motivo:p.motivo || "", codMotivo: rec ? "1886" : (cods[0] || ""), cods, rec,
      total: rows.reduce((n,r)=>n+(r.valor||0),0), qtd: rows.reduce((n,r)=>n+(r.qtd||0),0) };
  },
  /** quem é o Func.Lançamento: está no quadro atual, já esteve (histórico) ou não consta */
  quemE(func){
    const mat = this.soDigitos(func); if(!mat) return { cls:"off", txt:"Func.Lançamento não informado na 9712" };
    const p = (this.ctx.pessoas||[]).find(x=>this.soDigitos(x.mat) === mat);
    if(p) return p.ativo ? { cls:"acc", txt:`👤 ${this.h(p.nome)} (${mat}) — no quadro atual` } : { cls:"rep", txt:`👤 ${this.h(p.nome)} (${mat}) — já esteve no quadro (não está mais ativo)` };
    const reg = window.APP_STATE && window.APP_STATE.nameRegistry, k = reg && typeof normStr==="function" ? normStr(mat) : null;
    if(reg && k && reg.get(k)) return { cls:"rep", txt:`👤 ${this.h(reg.get(k))} (${mat}) — consta no histórico da chamada, fora do quadro atual` };
    return { cls:"err", txt:`👤 Func.Lançamento ${mat} — não consta no quadro nem no histórico` };
  },
  /** tipo de lançamento esperado pelo Cód.Motivo da 9712 (1886 = Recuperado Repositor) */
  tipoLista(chaveNorm, padrao){
    const l = (this.ctx.listas.TIPO_REP_AVARIA||[]).find(t=>normStr(t) === chaveNorm);
    return l || padrao;
  },
  tipoPorMotivo(tipoAtual, inf){
    if(!inf || !inf.codMotivo) return tipoAtual;
    const recup = this.tipoLista("RECUPERADO REPOSITOR", "Recuperado Repositor"), rel = this.tipoLista("RELACAO REPOSITOR", "Relação Repositor"), n = normStr(tipoAtual||"");
    if(inf.rec) return recup;
    if(n === "RECUPERADO REPOSITOR") return rel;
    return tipoAtual;
  },
  tabelaItens(rows){
    const f = (v)=> (Number(v)||0).toLocaleString("pt-BR",{ minimumFractionDigits:2, maximumFractionDigits:2 });
    return `<div class="table-wrap"><table class="adm-table"><thead><tr><th>Cód.Produto</th><th>Descrição</th><th style="text-align:right">Qtd</th><th style="text-align:right">Valor</th><th>Cód.Motivo</th><th>Motivo</th></tr></thead><tbody>
      ${rows.map(r=>`<tr><td>${this.h(r.codProd||"")}</td><td>${this.h(r.descr||"")}</td><td style="text-align:right">${this.h(r.qtd||0)}</td><td style="text-align:right">${f(r.valor)}</td><td>${this.h(r.codMotivo||"")}</td><td>${this.h(r.motivo||"")}</td></tr>`).join("")}
      </tbody></table></div>`;
  },
  dataBR(d){ return d ? (d instanceof Date ? fmtDateBR(d) : this.br(d)) : ""; },
  agoraBR(){ const d = new Date(), p = (n)=>String(n).padStart(2,"0"); return `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`; },

  resumoInfo(inf){
    const q = this.quemE(inf.func);
    return `<div style="margin:2px 0 8px;display:flex;flex-wrap:wrap;gap:4px"><span class="adm-tag ${q.cls}">${q.txt}</span><span class="adm-tag off">📅 ${this.dataBR(inf.dt) || "—"}</span><span class="adm-tag ${inf.rec?"acc":"off"}">Motivo: ${this.h(inf.motivo||"—")}${inf.codMotivo?" ("+this.h(inf.codMotivo)+")":""}</span><span class="adm-tag off">${inf.rows.length} item(ns) · valor ${(inf.total||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</span></div>`;
  },
  avItensModal(num){
    const inf = this.info9712(num);
    if(!inf) return UI.openModal(`<h3 style="margin-top:0">Itens do lançamento ${this.h(num)}</h3><p class="small-muted">Este número não está na 9712 carregada no site. Use <strong>Atualizar dados</strong> ou confira a planilha.</p><div class="adm-actions"><button class="btn btn-primary" onclick="UI.closeModal()">Fechar</button></div>`);
    UI.openModal(`<h3 style="margin-top:0">Itens do lançamento ${this.h(num)}</h3>${this.resumoInfo(inf)}<div style="max-height:380px;overflow:auto">${this.tabelaItens(inf.rows)}</div><div class="adm-actions"><button class="btn btn-primary" onclick="UI.closeModal()">Fechar</button></div>`);
  },
  /** busca por Cód.Produto: quais Num.Lançamento (no intervalo de Data) contêm o produto */
  produtoBuscar(cod, ini, fim){
    const pr = window.APP_STATE && window.APP_STATE.processed, alvo = String(cod||"").trim().replace(/^0+/, "");
    const di = ini ? dateOnly(this.isoParaData(ini)) : null, df = fim ? dateOnly(this.isoParaData(fim)) : null;
    const mapa = new Map();
    ((pr && pr.p9712)||[]).forEach(r=>{
      if(!r.codProd || String(r.codProd).trim().replace(/^0+/,"") !== alvo) return;
      if((di || df) && !r.dt) return;
      if(di && dateOnly(r.dt) < di) return; if(df && dateOnly(r.dt) > df) return;
      const n = this.soDigitos(r.numLanc); if(!n) return;
      if(!mapa.has(n)) mapa.set(n, { num:n, dt:r.dt, qtd:0, valor:0, linhas:0 });
      const e = mapa.get(n); e.qtd += r.qtd||0; e.valor += r.valor||0; e.linhas++;
    });
    return Array.from(mapa.values()).sort((a,b)=>(b.dt||0)-(a.dt||0));
  },

  _avaria(pane){
    const L = this;
    // estado da tela: sobrevive a trocar de aba para não perder a fila
    const av = this.av = this.av || { abertos:new Set(), fila:[], rodando:false, itens:null, carregando:false, erroLista:"", filtro:"", tipoFiltro:"", limite:100, srv:new Map() };
    const proc = window.APP_STATE && window.APP_STATE.processed;
    const jaLocal = (num)=>{
      const it = (av.itens||[]).find(x=>x.num === num); if(it) return it.tipo || "—";
      const q = av.fila.find(x=>x.num === num && x.status !== "erro"); if(q) return q.tipo;
      if(!av.itens && proc && proc.numLancAvaria && proc.numLancAvaria.has(num)) return "—";
      return null;
    };
    pane.innerHTML = `<div class="panel">
      ${this.cabecalho("Lançar Avaria 9712", "Digite o Num.Lançamento e tecle Enter: a conferência é instantânea (lista da 9712 já carregada) e a gravação roda em segundo plano — pode ir digitando o próximo.")}
      <div class="adm-form">
        <label>Num.Lançamento<input type="text" id="av-num" inputmode="numeric" placeholder="Ex.: 597172" autocomplete="off"></label>
        <label>Tipo de lançamento<select id="av-tipo" data-vazio="">${this.options(this.ctx.listas.TIPO_REP_AVARIA, av.tipo || null)}</select></label>
      </div>
      ${this.novoItem("TIPO_REP_AVARIA", "av-tipo", "novo tipo de lançamento")}
      <div id="av-ind" style="min-height:34px;margin-top:10px"></div>
      <div id="av-conf" style="display:none;margin:4px 0;min-height:34px"><label class="adm-chk"><input type="checkbox" id="av-conf-ck"> Confirmo lançar mesmo sem constar na 9712</label></div>
      <div id="av-msg"></div>
      <div class="adm-actions"><button type="button" class="btn btn-outline" id="av-itens">Ver itens</button><button type="button" class="btn btn-outline" id="av-ver">Conferir na planilha</button><button type="button" class="btn btn-primary" id="av-salvar">Lançar (Enter)</button></div>
    </div>
    <div class="panel" style="margin-top:14px">
      <h3 class="adm-h2" style="margin:0 0 4px">Buscar por Cód.Produto</h3>
      <p class="small-muted" style="margin:0 0 8px">Veja em quais Num.Lançamento da 9712 o produto aparece, dentro do intervalo de Data.</p>
      <div class="adm-form"><label>Cód.Produto<input type="text" id="avp-cod" inputmode="numeric" autocomplete="off" placeholder="Ex.: 69"></label>
        <label>Data de<input type="date" id="avp-ini" value="${this.somaDias(this.hojeISO(), -30)}"></label><label>Data até<input type="date" id="avp-fim" value="${this.hojeISO()}"></label></div>
      <div class="adm-actions" style="margin-top:8px"><button type="button" class="btn btn-primary" id="avp-go">Buscar</button></div>
      <div id="avp-res" style="margin-top:10px"></div>
    </div>
    <div class="panel" style="margin-top:14px">
      <div class="adm-head"><h3 class="adm-h2" style="margin:0">Lançamentos <span class="small-muted" id="av-cont"></span></h3>
        <div class="adm-head-r"><input type="search" id="av-busca" placeholder="Buscar número ou tipo" value="${this.h(av.filtro)}" autocomplete="off"><select id="av-tf"></select><button type="button" class="btn btn-outline btn-sm" id="av-reload">Atualizar lista</button></div></div>
      <div id="av-lista" class="small-muted">Carregando…</div>
    </div>`;
    this.ligarNovoItem(pane);
    const $$ = (id)=> document.getElementById(id);
    const vivo = (id)=> document.getElementById(id);   // a tela pode ter sido trocada enquanto a fila roda
    if(av.tipo) $$("av-tipo").value = av.tipo;

    /* ---------------- busca por produto ---------------- */
    const buscarProd = ()=>{
      const cod = $$("avp-cod").value.trim(), box = $$("avp-res");
      if(!cod){ box.innerHTML = `<span class="small-muted">Digite o código do produto.</span>`; return; }
      const r = this.produtoBuscar(cod, $$("avp-ini").value, $$("avp-fim").value);
      const f = (v)=> (Number(v)||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
      box.innerHTML = r.length ? `<div class="small-muted" style="margin-bottom:4px">${r.length} lançamento(s) com o produto ${this.h(cod)}. Clique na linha para ver os itens.</div><div class="table-wrap"><table class="adm-table"><thead><tr><th>Num.Lançamento</th><th>Data</th><th style="text-align:right">Qtd do produto</th><th style="text-align:right">Valor</th><th>Func.Lançamento</th><th>Tipo lançado</th></tr></thead><tbody>
        ${r.map(x=>{ const inf = this.info9712(x.num), it = (av.itens||[]).find(i=>i.num === x.num);
          return `<tr data-avp="${this.h(x.num)}" style="cursor:pointer"><td><strong>${this.h(x.num)}</strong></td><td>${this.dataBR(x.dt)}</td><td style="text-align:right">${this.h(x.qtd)}</td><td style="text-align:right">${f(x.valor)}</td><td>${inf ? this.h(inf.nomeFunc||"")+' <span class="small-muted">'+this.h(inf.func||"")+'</span>' : "—"}</td><td>${it ? this.h(it.tipo||"—") : '<span class="small-muted">não lançado</span>'}</td></tr>`; }).join("")}</tbody></table></div>`
        : `<span class="small-muted">Nenhum lançamento da 9712 com esse produto no intervalo.</span>`;
      box.querySelectorAll("[data-avp]").forEach(tr=> tr.addEventListener("click", ()=> this.avItensModal(tr.dataset.avp)));
    };
    $$("avp-go").addEventListener("click", buscarProd);
    $$("avp-cod").addEventListener("keydown", (e)=>{ if(e.key === "Enter"){ e.preventDefault(); buscarProd(); } });

    /* ---------------- lista ---------------- */
    const statusTxt = { fila:"⏳ na fila", enviando:"⏳ gravando…", ok:"✔ gravado", erro:"⛔ erro" };
    const lista = ()=>{
      const box = vivo("av-lista"); if(!box) return;
      const f = normStr(av.filtro||""), tf = av.tipoFiltro;
      const pend = av.fila.filter(x=>x.status !== "ok");
      const srv = (av.itens||[]).filter(x=> (!tf || x.tipo === tf) && (!f || normStr(x.num + " " + x.tipo).includes(f)));
      const tipos = Array.from(new Set((av.itens||[]).map(x=>x.tipo).filter(Boolean).concat(this.ctx.listas.TIPO_REP_AVARIA||[])));
      const sel = vivo("av-tf"); if(sel) sel.innerHTML = `<option value="">Todos os tipos</option>` + tipos.map(t=>`<option ${t===tf?"selected":""}>${this.h(t)}</option>`).join("");
      const cont = vivo("av-cont"); if(cont) cont.textContent = av.itens ? `· ${srv.length} de ${av.itens.length}` : "";
      const d9 = this.nums9712();
      const linhaPend = (x)=>`<tr class="${x.status==="erro"?"av-erro":""}"><td></td><td><strong>${this.h(x.num)}</strong></td><td>${this.h(x.tipo)}</td><td>${statusTxt[x.status]||x.status}${x.erro?` <span class="small-muted">${this.h(x.erro)}</span>`:""}</td><td></td><td></td><td></td>
        <td style="text-align:right">${x.status==="erro"?`<button type="button" class="btn btn-outline btn-sm" data-av-rm="${x.id}">Descartar</button>`:""}</td></tr>`;
      const linha = (x)=>{
        const inf = this.info9712(x.num), na = x.na9712===true || d9.set.has(x.num), aberto = av.abertos.has(x.num);
        const dt = x.data9712 ? this.br(x.data9712) : (inf && inf.dt ? this.dataBR(inf.dt) : "—");
        const quem = inf ? `${this.h(inf.nomeFunc || "")} <span class="small-muted">${this.h(inf.func||"")}</span>` : "—";
        return `<tr class="av-lin" data-av-ex="${this.h(x.num)}" style="cursor:pointer"><td style="width:26px;color:#7a8798">${inf ? (aberto ? "▾" : "▸") : ""}</td><td><strong>${this.h(x.num)}</strong></td><td>${this.h(x.tipo||"—")}</td><td>${this.h(x.lancadoEm||"—")}</td><td>${dt}</td><td>${quem}</td>
        <td>${na ? '<span class="adm-tag acc">✔</span>' : (x.na9712===false ? '<span class="adm-tag rep">⚠</span>' : "—")}</td>
        <td style="text-align:right;white-space:nowrap"><button type="button" class="btn btn-outline btn-sm" data-av-ed="${this.h(x.num)}">✏️ Editar</button> <button type="button" class="btn btn-outline btn-sm btn-danger" data-av-del="${this.h(x.num)}">🗑 Excluir</button></td></tr>`
        + (aberto && inf ? `<tr><td></td><td colspan="7" style="background:#f7f9fc">${this.resumoInfo(inf)}${this.tabelaItens(inf.rows)}</td></tr>` : "");
      };
      let corpo = pend.map(linhaPend).join("") + srv.slice(0, av.limite).map(linha).join("");
      if(!corpo) corpo = `<tr><td colspan="8" class="small-muted">${av.itens ? "Nenhum lançamento encontrado." : (av.erroLista ? this.h(av.erroLista) : "Carregando a lista…")}</td></tr>`;
      const div = divergentes();
      box.innerHTML = (div.length ? `<div class="warn-box" style="margin-bottom:10px">⚠️ <strong>${div.length}</strong> lançamento(s) com tipo diferente do motivo da 9712 (Cód.Motivo 1886 = Recuperado Repositor). <button type="button" class="btn btn-outline btn-sm" id="av-div" style="margin-left:8px">Revisar e corrigir</button></div>` : "")
        + `<div class="table-wrap"><table class="adm-table"><thead><tr><th></th><th>Num.Lançamento</th><th>Tipo</th><th>Lançado em</th><th>Data na 9712</th><th>Func.Lançamento</th><th>9712</th><th></th></tr></thead><tbody>${corpo}</tbody></table></div>
        ${srv.length > av.limite ? `<div style="margin-top:8px"><button type="button" class="btn btn-outline btn-sm" id="av-mais">Mostrar mais (${srv.length - av.limite})</button></div>` : ""}`;
      box.querySelectorAll("[data-av-ex]").forEach(tr=> tr.addEventListener("click", (e)=>{ if(e.target.closest("button")) return; const n = tr.dataset.avEx; if(!this.info9712(n)) return toast("Este número não está na 9712 carregada — sem itens para mostrar.", "error"); av.abertos.has(n) ? av.abertos.delete(n) : av.abertos.add(n); lista(); }));
      box.querySelectorAll("[data-av-ed]").forEach(b=> b.addEventListener("click", ()=> editar(b.dataset.avEd)));
      box.querySelectorAll("[data-av-del]").forEach(b=> b.addEventListener("click", ()=> excluir(b.dataset.avDel)));
      box.querySelectorAll("[data-av-rm]").forEach(b=> b.addEventListener("click", ()=>{ av.fila = av.fila.filter(x=>String(x.id) !== b.dataset.avRm); lista(); }));
      const mais = vivo("av-mais"); if(mais) mais.addEventListener("click", ()=>{ av.limite += 200; lista(); });
      const dv = vivo("av-div"); if(dv) dv.addEventListener("click", ()=> corrigirTipos());
    };
    /** exclui um lançamento da REP.AVARIA (pede confirmação) */
    const excluir = (num)=>{
      const x = (av.itens||[]).find(i=>i.num === num); if(!x) return;
      UI.openModal(`<h3 style="margin-top:0">Excluir lançamento ${this.h(num)}?</h3>
        <p style="margin-top:0">A linha será <strong>removida</strong> da planilha REP.AVARIA (tipo <strong>${this.h(x.tipo||"—")}</strong>, lançado em ${this.h(x.lancadoEm||"—")}). A ação fica registrada no log.</p>
        <div id="avx-msg"></div>
        <div class="adm-actions"><button class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button><button class="btn btn-danger" id="avx-ok">Excluir</button></div>`);
      document.getElementById("avx-ok").addEventListener("click", async ()=>{
        const r = await this.enviar(document.getElementById("avx-ok"), { acao:"lanc_avaria_excluir", num });
        if(!r || !r.ok) return this.aviso("avx-msg", "erro", this.h((r && r.erro) || "Não foi possível excluir."));
        av.itens = (av.itens||[]).filter(i=>i.num !== num); av.abertos.delete(num); av.srv.delete(num);
        if(this.nums9712().set) { /* o número volta a poder ser lançado */ }
        UI.closeModal(); toast("Lançamento " + num + " excluído."); lista(); indicador();
      });
    };
    /** lançamentos "Recuperado Repositor" sem motivo 1886 → Relação Repositor, e "Relação Repositor" com motivo 1886 → Recuperado Repositor */
    const divergentes = ()=>{
      const out = [];
      (av.itens||[]).forEach(x=>{
        const n = normStr(x.tipo||""); if(n !== "RECUPERADO REPOSITOR" && n !== "RELACAO REPOSITOR") return;
        const inf = this.info9712(x.num); if(!inf) return;
        const certo = inf.rec ? this.tipoLista("RECUPERADO REPOSITOR", "Recuperado Repositor") : this.tipoLista("RELACAO REPOSITOR", "Relação Repositor");
        if(normStr(certo) !== n) out.push({ num:x.num, de:x.tipo, para:certo, cod:inf.codMotivo || "—" });
      });
      return out;
    };
    const corrigirTipos = ()=>{
      const div = divergentes(); if(!div.length) return;
      UI.openModal(`<h3 style="margin-top:0">Corrigir tipos pelo Cód.Motivo da 9712</h3>
        <p class="small-muted" style="margin-top:0">Motivo 1886 vira <strong>Recuperado Repositor</strong>; os demais que estavam como Recuperado Repositor viram <strong>Relação Repositor</strong>.</p>
        <div class="table-wrap" style="max-height:320px;overflow:auto"><table class="adm-table"><thead><tr><th>Num.Lançamento</th><th>Cód.Motivo</th><th>Tipo atual</th><th>Novo tipo</th></tr></thead><tbody>
        ${div.map(d=>`<tr><td>${this.h(d.num)}</td><td>${this.h(d.cod)}</td><td>${this.h(d.de)}</td><td><strong>${this.h(d.para)}</strong></td></tr>`).join("")}</tbody></table></div>
        <div id="avc-msg"></div>
        <div class="adm-actions"><button class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button><button class="btn btn-primary" id="avc-ok">Corrigir ${div.length} lançamento(s)</button></div>`);
      document.getElementById("avc-ok").addEventListener("click", async ()=>{
        const r = await this.enviar(document.getElementById("avc-ok"), { acao:"lanc_avaria_corrigir", itens: div.map(d=>({ num:d.num, tipo:d.para })) });
        if(!r || !r.ok) return this.aviso("avc-msg", "erro", this.h((r && r.erro) || "Não foi possível corrigir."));
        div.forEach(d=>{ const it = (av.itens||[]).find(x=>x.num === d.num); if(it) it.tipo = d.para; });
        UI.closeModal(); toast(`${r.corrigidos} lançamento(s) corrigido(s).`); lista();
      });
    };
    const carregarLista = async (forcar)=>{
      if(av.carregando || (av.itens && !forcar)) return;
      av.carregando = true; av.erroLista = "";
      const r = await Api.call({ acao:"lanc_avaria_listar" }).catch(e=>({ ok:false, erro:e.message }));
      av.carregando = false;
      if(r && r.ok){ av.itens = r.itens || []; } else av.erroLista = (r && r.erro) || "Não foi possível carregar a lista.";
      lista(); if(vivo("av-num")) indicador();
    };

    /* ---------------- conferência instantânea ---------------- */
    const indicador = ()=>{
      const ind = vivo("av-ind"), cf = vivo("av-conf"); if(!ind) return null;
      const digitado = this.soDigitos($$("av-num").value);
      if(!digitado){ ind.innerHTML = ""; cf.style.display = "none"; return null; }
      const rs = this.resolver9712(digitado), num = rs.num;
      const b = (cls, txt)=> `<span class="adm-tag ${cls}" style="margin:2px 6px 2px 0">${txt}</span>`;
      const ja = jaLocal(num), d9 = this.nums9712(), srv = av.srv.get(num);
      const na = d9.set.has(num) ? true : (srv !== undefined ? srv : null);   // true/false/null (não sabe)
      let html = ja !== null ? b("err", `⛔ Já lançado${ja && ja!=="—" ? " ("+this.h(ja)+")" : ""}`) : b("acc", "✔ Ainda não lançado");
      if(na === true) html += b("acc", "✔ Existe na 9712");
      else if(na === false) html += b("rep", "⚠ Não encontrado na 9712 (coluna K)");
      else html += b("off", d9.ok ? "Não está na lista carregada — tecle Enter para conferir na planilha" : "Conferindo na planilha…");
      const inf = this.info9712(num);
      if(rs.via === "transacao") html += b("off", `Num. Transação ${this.h(digitado)} → Num.Lançamento ${this.h(num)}`);
      if(inf){
        const q = this.quemE(inf.func);
        html += `<br>` + b(q.cls, q.txt);
        html += b("off", `📅 Data na 9712: ${this.dataBR(inf.dt) || "—"}`);
        html += b(inf.rec ? "acc" : "off", `Motivo: ${this.h(inf.motivo || "—")}${inf.codMotivo ? " (Cód. "+this.h(inf.codMotivo)+")" : ""} · ${inf.rows.length} item(ns)`);
        const atual = $$("av-tipo").value, novo = this.tipoPorMotivo(atual, inf);
        if(novo && novo !== atual && Array.from($$("av-tipo").options).some(o=>o.value === novo)){
          $$("av-tipo").value = novo; av.tipo = novo;
          html += `<br>` + b("acc", `Cód.Motivo ${inf.rec ? "1886" : this.h(inf.codMotivo)} → tipo definido como <strong>${this.h(novo)}</strong>`);
        } else if(inf.rec && atual === novo) html += b("acc", "Tipo: " + this.h(novo) + " (motivo 1886)");
      }
      ind.innerHTML = html;
      cf.style.display = (na === false && ja === null) ? "block" : "none";
      if(cf.style.display === "none") $$("av-conf-ck").checked = false;
      return { ja, na, num, inf };
    };
    /** pergunta ao servidor só quando a lista local não conhece o número */
    const conferirServidor = async (num)=>{
      if(!num || this.nums9712().set.has(num) || av.srv.has(num)) return;
      const r = await Api.call({ acao:"lanc_avaria_verificar", num }).catch(e=>({ ok:false, erro:e.message }));
      if(r && r.ok){ if(r.na9712 && r.na9712.aba) av.srv.set(num, !!r.na9712.existe); if(r.jaLancado && jaLocal(num) === null) (av.itens = av.itens || []).unshift({ num, tipo:"", lancadoEm:"", data9712:"", na9712:null }); }
      else this.aviso("av-msg", "erro", this.h((r && r.erro) || "Falha ao conferir."));
      if(vivo("av-num") && this.soDigitos(vivo("av-num").value) === num) indicador();
    };
    $$("av-num").addEventListener("input", ()=>{ this.aviso("av-msg", "", ""); indicador(); });

    /* ---------------- fila de gravação (em segundo plano) ---------------- */
    const rodar = async ()=>{
      if(av.rodando) return; av.rodando = true;
      try{
        let x; while((x = av.fila.find(i=>i.status === "fila"))){
          x.status = "enviando"; lista();
          const r = await Api.call({ acao:"lanc_avaria_salvar", num:x.num, tipo:x.tipo, confirmarSem9712:x.confirma, na9712Cliente:x.na9712Cliente }).catch(e=>({ ok:false, erro:e.message }));
          if(r && r.ok){
            x.status = "ok"; const d9 = this.nums9712();
            (av.itens = av.itens || []).unshift({ linha:r.linha, num:x.num, tipo:x.tipo, lancadoEm:this.agoraBR(), data9712:"", na9712: r.na9712 && r.na9712.aba ? !!r.na9712.existe : null });
            av.fila = av.fila.filter(i=>i !== x);
            toast(`Avaria ${x.num} lançada.`);
          } else { x.status = "erro"; x.erro = (r && r.erro) || "Não foi possível lançar."; }
          lista(); if(vivo("av-num")) indicador();          // só atualiza a lista e o indicador — nunca mexe no que está sendo digitado
        }
      } finally { av.rodando = false; }
    };
    const lancar = async ()=>{
      const digitado = this.soDigitos($$("av-num").value);
      let tipo = $$("av-tipo").value;
      this.aviso("av-msg", "", "");
      if(!digitado) return this.aviso("av-msg", "erro", "Informe o número do lançamento.");
      const num = this.resolver9712(digitado).num;
      if(!tipo) return this.aviso("av-msg", "erro", "Escolha o tipo do lançamento.");
      const ind = indicador();
      if(ind.ja !== null) return this.aviso("av-msg", "erro", `O lançamento ${this.h(num)} já foi lançado${ind.ja && ind.ja!=="—" ? " ("+this.h(ind.ja)+")" : ""}.`);
      if(ind.na === null){ await conferirServidor(num); const i2 = indicador(); ind.na = i2 ? i2.na : null; ind.ja = i2 ? i2.ja : ind.ja; if(ind.ja !== null) return this.aviso("av-msg", "erro", `O lançamento ${this.h(num)} já foi lançado.`); }
      if(ind.na === false && !$$("av-conf-ck").checked){
        $$("av-conf").style.display = "block";
        return this.aviso("av-msg", "aviso", `O número ${this.h(num)} não foi encontrado na 9712 (coluna K). Marque a confirmação e lance de novo.`);
      }
      tipo = this.tipoPorMotivo(tipo, this.info9712(num)) || tipo;        // Cód.Motivo 1886 = Recuperado Repositor
      av.tipo = tipo;
      av.fila.unshift({ id:Date.now()+"_"+num, num, tipo, status:"fila", confirma: ind.na === false, na9712Cliente: ind.na === true });
      // libera o campo na hora para o próximo código
      $$("av-num").value = ""; $$("av-ind").innerHTML = ""; $$("av-conf").style.display = "none"; $$("av-conf-ck").checked = false; $$("av-num").focus();
      lista(); rodar();
    };
    $$("av-salvar").addEventListener("click", lancar);
    $$("av-num").addEventListener("keydown", (e)=>{ if(e.key === "Enter"){ e.preventDefault(); lancar(); } });
    $$("av-ver").addEventListener("click", async ()=>{ const n = this.resolver9712(this.soDigitos($$("av-num").value)).num; if(!n) return; av.srv.delete(n); await conferirServidor(n); indicador(); });
    $$("av-itens").addEventListener("click", ()=>{ const n = this.resolver9712(this.soDigitos($$("av-num").value)).num; if(!n) return this.aviso("av-msg","erro","Digite o número para ver os itens."); this.avItensModal(n); });
    $$("av-tipo").addEventListener("change", ()=>{ av.tipo = $$("av-tipo").value; });

    /* ---------------- edição ---------------- */
    const editar = (num)=>{
      const it = (av.itens||[]).find(x=>x.num === num); if(!it) return;
      const tipos = Array.from(new Set((this.ctx.listas.TIPO_REP_AVARIA||[]).concat(it.tipo ? [it.tipo] : [])));
      UI.openModal(`<h3 style="margin-top:0">Editar lançamento</h3>
        <div class="adm-form">
          <label>Num.Lançamento<input type="text" id="avx-num" inputmode="numeric" value="${this.h(it.num)}"></label>
          <label>Tipo de lançamento<select id="avx-tipo">${this.options(tipos, it.tipo, "Selecione")}</select></label>
        </div>
        <div class="small-muted" style="margin:6px 0">Use para corrigir um tipo lançado por engano (ou um número digitado errado).</div>
        <div id="avx-msg"></div>
        <div class="adm-actions"><button class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button><button class="btn btn-primary" id="avx-salvar">Salvar alterações</button></div>`);
      document.getElementById("avx-salvar").addEventListener("click", async ()=>{
        const novo = this.soDigitos(document.getElementById("avx-num").value), tipo = document.getElementById("avx-tipo").value;
        if(!novo) return this.aviso("avx-msg", "erro", "Informe o número.");
        if(!tipo) return this.aviso("avx-msg", "erro", "Escolha o tipo.");
        if(novo !== it.num && jaLocal(novo) !== null) return this.aviso("avx-msg", "erro", `O número ${this.h(novo)} já está na lista.`);
        const r = await this.enviar(document.getElementById("avx-salvar"), { acao:"lanc_avaria_editar", numOriginal:it.num, num:novo, tipo });
        if(!r || !r.ok) return this.aviso("avx-msg", "erro", this.h((r && r.erro) || "Não foi possível salvar."));
        it.num = r.num; it.tipo = r.tipo; UI.closeModal(); toast("Lançamento atualizado."); lista(); if(vivo("av-num")) indicador();
      });
    };

    $$("av-busca").addEventListener("input", (e)=>{ av.filtro = e.target.value; av.limite = 100; lista(); });
    $$("av-tf").addEventListener("change", (e)=>{ av.tipoFiltro = e.target.value; av.limite = 100; lista(); });
    $$("av-reload").addEventListener("click", ()=> carregarLista(true));
    lista(); carregarLista(false);
    if(av.fila.some(x=>x.status === "fila")) rodar();
    $$("av-num").focus();
  },

  /* ================================================================== */
  /* CHAMADA                                                             */
  /* ================================================================== */
  renderChamada(){ this.abrir("lchamada", this._chamada); },
  _chamada(pane){
    this.ch = { data: this.diaUtilAte(this.hojeISO()), itens: [], jaExiste:false };
    const stat = this.ctx.listas.STATUS_CHAMADA;
    const ativos = (this.ctx.pessoas||[]).filter(p=>p.ativo && p.mat);
    pane.innerHTML = `<div class="panel">
      ${this.cabecalho("Lançar Chamada", "Grava na aba QUADRO REP. Chamadas são sempre de segunda a sexta. Toque no status de cada colaborador (toque de novo para limpar). Se o dia já tem chamada, os valores existentes aparecem para editar. A equipe é a que está ATIVA na aba TURNOVER.")}
      <div class="adm-form">
        <label>Dia da chamada<input type="date" id="ch-data" value="${this.ch.data}"></label>
      </div>
      <div style="margin:4px 0 2px"><span class="small-muted" style="font-weight:700">Marcar todos como:</span> <span id="ch-todos-box"></span></div>
      ${this.novoItem("STATUS_CHAMADA", "ch-novo-st", "novo status")}
      <select id="ch-novo-st" data-vazio="" data-sem-evento="1" style="display:none"></select>
      <div id="ch-info" style="margin:10px 0"></div>
      <div id="ch-tab"></div>
      <div id="ch-msg"></div>
      <div class="adm-actions"><button type="button" class="btn btn-primary" id="ch-salvar">Salvar chamada do dia</button></div>
    </div>
    <div class="panel">
      <h3 class="adm-h2">Lançamento em lote (um ou mais colaboradores, vários dias)</h3>
      <p class="small-muted" style="margin:0 0 10px">Ex.: um colaborador faltou a semana toda → selecione-o, escolha FALTA e clique em "Últimos 7 dias". Dias que já têm chamada são atualizados; os que não têm são criados.</p>
      <div class="adm-form">
        <label>Status<select id="lt-status" data-vazio="">${this.options(stat, null, "Selecione")}</select></label>
        <label>De<input type="date" id="lt-ini" value="${this.diaUtilAte(this.hojeISO())}"></label>
        <label>Até<input type="date" id="lt-fim" value="${this.diaUtilAte(this.hojeISO())}"></label>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
        ${[[1,"Último 1 dia"],[3,"Últimos 3 dias"],[7,"Últimos 7 dias (1 semana)"],[15,"Últimos 15 dias"],[30,"Últimos 30 dias"]].map(([n,t])=>`<button type="button" class="btn btn-outline btn-sm" data-ult="${n}">${t}</button>`).join("")}
      </div>
      <p class="small-muted" style="margin:0 0 6px">O lote só marca <strong>segunda a sexta</strong> (sábado e domingo são ignorados).</p>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:8px 0">
        <input type="search" id="lt-busca" placeholder="Buscar colaborador..." style="padding:9px 10px;border:1.5px solid var(--gray-200);border-radius:8px;font-size:14px;min-width:220px">
        <button type="button" class="btn btn-outline btn-sm" id="lt-all">Selecionar todos</button>
        <button type="button" class="btn btn-outline btn-sm" id="lt-none">Limpar</button>
        <span class="small-muted" id="lt-cont"></span>
      </div>
      <div id="lt-lista" class="adm-checks" style="max-height:260px;overflow:auto;border:1px solid var(--gray-200);border-radius:8px;padding:8px 12px">
        ${ativos.map(p=>`<label class="adm-chk" data-nome="${this.h((p.mat+" "+p.nome).toLowerCase())}"><input type="checkbox" value="${this.h(p.mat)}" class="lt-ck"> ${this.h(p.nome)} <span class="small-muted">${this.h(p.mat)}</span></label>`).join("") || `<span class="small-muted">Nenhum colaborador ativo na aba TURNOVER.</span>`}
      </div>
      <div id="lt-resumo" class="small-muted" style="margin:10px 0"></div>
      <div id="lt-msg"></div>
      <div class="adm-actions"><button type="button" class="btn btn-primary" id="lt-aplicar">Aplicar em lote</button></div>
    </div>`;
    this.ligarNovoItem(pane);
    const $$ = (id)=> document.getElementById(id);
    const corStatus = (st)=>{
      const n = String(st||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toUpperCase();
      if(n.includes("PRESENT")) return "#1a9c62";
      if(n.includes("FALTA")) return "#d64545";
      if(n.includes("FERIAS")) return "#7a3fc4";
      if(n.includes("ATESTADO")) return "#e08a1f";
      if(n.includes("SUSPENS")) return (window.Design && Design.escuro()) ? "#ff7b7b" : "#8b1d1d";
      if(n.includes("FOLGA")) return "#5f7388";
      return "#2f6fce";
    };
    const chip = (st, ativo, attrs)=>{ const c = corStatus(st);
      return `<button type="button" ${attrs} style="border:1.5px solid ${c};background:${ativo ? c : "#fff"};color:${ativo ? "#fff" : c};border-radius:999px;padding:7px 12px;font-size:12.5px;font-weight:700;cursor:pointer;margin:2px 4px 2px 0;min-height:34px">${this.h(st)}</button>`; };
    const desenharTodos = ()=>{
      $$("ch-todos-box").innerHTML = this.ctx.listas.STATUS_CHAMADA.map(st=> chip(st, false, `data-todos="${this.h(st)}"`)).join("");
      $$("ch-todos-box").querySelectorAll("[data-todos]").forEach(b=> b.addEventListener("click", ()=>{
        if(this.ehFimDeSemana(this.ch.data)) return;
        this.ch.itens.forEach(it=> it.status = b.dataset.todos); desenharTabela();
      }));
    };

    const desenharTabela = ()=>{
      const c = this.ch;
      $$("ch-info").innerHTML = c.jaExiste
        ? `<div class="warn-box" style="margin:0">Já existe chamada para <strong>${this.br(c.data)}</strong>. Você está <strong>editando</strong> — altere o que precisar e salve.${c.fora ? ` (${c.fora} registro(s) do dia são de pessoas que não estão mais ativas e não aparecem aqui.)` : ""}</div>`
        : `<div class="hint-box" style="margin:0">Nenhuma chamada lançada para <strong>${this.br(c.data)}</strong>. Marque o status de cada colaborador.</div>`;
      const stat = this.ctx.listas.STATUS_CHAMADA;
      $$("ch-tab").innerHTML = c.itens.length ? `<div class="table-wrap"><table class="adm-table"><thead><tr><th>Matrícula</th><th>Colaborador</th><th>Status (toque para marcar)</th></tr></thead><tbody>
        ${c.itens.map((it,i)=>`<tr><td>${this.h(it.mat)}</td><td>${this.h(it.nome)}${it.sugerido ? `<div class="small-muted" style="font-size:11px">${it.status==="SUSPENSÃO" ? "⛔ suspensão lançada (Lançar Suspensão)" : "🏖️ férias agendadas"}</div>` : ""}</td>
          <td style="min-width:260px">${stat.map(st=> chip(st, it.status === st, `data-i="${i}" data-st="${this.h(st)}" class="ch-chip"`)).join("")}</td></tr>`).join("")}</tbody></table></div>`
        : `<div class="warn-box">Nenhum colaborador ativo na aba TURNOVER.</div>`;
      $$("ch-tab").querySelectorAll(".ch-chip").forEach(b=> b.addEventListener("click", ()=>{
        const it = c.itens[Number(b.dataset.i)]; it.status = it.status === b.dataset.st ? "" : b.dataset.st; it.sugerido = false;
        // redesenha só a linha para manter a rolagem
        const linha = b.closest("tr");
        linha.querySelectorAll(".ch-chip").forEach(x=>{ const ativo = it.status === x.dataset.st, cor = corStatus(x.dataset.st); x.style.background = ativo ? cor : "#fff"; x.style.color = ativo ? "#fff" : cor; });
        const sug = linha.querySelector(".small-muted"); if(sug) sug.remove();
      }));
    };
    const carregarDia = async (manterMsg)=>{
      const data = $$("ch-data").value; if(!data) return;
      if(this.ehFimDeSemana(data)){
        this.ch = { data, itens:[], jaExiste:false };
        $$("ch-info").innerHTML = ""; $$("ch-tab").innerHTML = "";
        return this.aviso("ch-msg", "erro", `${this.br(data)} cai no fim de semana. A chamada é sempre de segunda a sexta — escolha um dia útil.`);
      }
      $$("ch-tab").innerHTML = `<p class="small-muted">Carregando o dia...</p>`; if(manterMsg !== true) this.aviso("ch-msg", "", "");
      const r = await Api.call({ acao:"lanc_chamada_dia", data }).catch(e=>({ ok:false, erro:e.message }));
      if(!r || !r.ok){ $$("ch-tab").innerHTML = ""; return this.aviso("ch-msg", "erro", this.h((r && r.erro) || "Falha ao carregar o dia.")); }
      this.ch = { data, itens:r.itens, jaExiste:r.jaExiste, fora:r.foraDoQuadro };
      desenharTabela();
    };
    $$("ch-data").addEventListener("change", ()=>{ $$("lt-fim").value = $$("ch-data").value || $$("lt-fim").value; carregarDia(); });
    $$("ch-salvar").addEventListener("click", async ()=>{
      this.aviso("ch-msg", "", "");
      if(this.ehFimDeSemana(this.ch.data)) return this.aviso("ch-msg", "erro", "A chamada é sempre de segunda a sexta. Escolha um dia útil.");
      const r = await this.enviar($$("ch-salvar"), { acao:"lanc_chamada_salvar", data:this.ch.data, itens:this.ch.itens.map(i=>({ mat:i.mat, nome:i.nome, status:i.status })) });
      if(!r || !r.ok) return this.aviso("ch-msg", "erro", this.h((r && r.erro) || "Não foi possível salvar."));
      this.aviso("ch-msg", "ok", `Chamada de ${this.br(this.ch.data)} salva: ${r.criadas} nova(s), ${r.atualizadas} atualizada(s).`);
      toast("Chamada salva."); carregarDia(true);
    });

    // ---- lote ----
    const marcados = ()=> Array.from(pane.querySelectorAll(".lt-ck:checked")).map(c=>c.value);
    const resumo = ()=>{
      const n = marcados().length, ini = $$("lt-ini").value, fim = $$("lt-fim").value, st = $$("lt-status").value;
      $$("lt-cont").textContent = n ? `${n} selecionado(s)` : "";
      if(!n || !ini || !fim || !st){ $$("lt-resumo").textContent = ""; return; }
      let dias = 0, d = ini;
      for(let i=0; i<400 && d <= fim; i++){ if(!this.ehFimDeSemana(d)) dias++; d = this.somaDias(d, 1); }
      $$("lt-resumo").innerHTML = `Vai marcar <strong>${this.h(st)}</strong> para <strong>${n}</strong> colaborador(es), de <strong>${this.br(ini)}</strong> a <strong>${this.br(fim)}</strong> (${dias} dia(s) útil(eis), sem sábado e domingo).`;
    };
    pane.querySelectorAll("[data-ult]").forEach(b=> b.addEventListener("click", ()=>{
      const fim = this.diaUtilAte($$("lt-fim").value || this.hojeISO());
      $$("lt-fim").value = fim; $$("lt-ini").value = this.somaDias(fim, -(Number(b.dataset.ult) - 1)); resumo();
    }));
    ["lt-status","lt-ini","lt-fim"].forEach(id=> $$(id).addEventListener("change", resumo));
    pane.querySelectorAll(".lt-ck").forEach(c=> c.addEventListener("change", resumo));
    $$("lt-all").addEventListener("click", ()=>{ pane.querySelectorAll("#lt-lista label").forEach(l=>{ if(l.style.display !== "none") l.querySelector("input").checked = true; }); resumo(); });
    $$("lt-none").addEventListener("click", ()=>{ pane.querySelectorAll(".lt-ck").forEach(c=> c.checked = false); resumo(); });
    $$("lt-busca").addEventListener("input", ()=>{
      const q = $$("lt-busca").value.trim().toLowerCase();
      pane.querySelectorAll("#lt-lista label").forEach(l=>{ l.style.display = !q || l.dataset.nome.includes(q) ? "" : "none"; });
    });
    $$("lt-aplicar").addEventListener("click", async ()=>{
      this.aviso("lt-msg", "", "");
      const mats = marcados(), status = $$("lt-status").value;
      if(!mats.length) return this.aviso("lt-msg", "erro", "Selecione ao menos um colaborador.");
      if(!status) return this.aviso("lt-msg", "erro", "Escolha o status.");
      if(!$$("lt-ini").value || !$$("lt-fim").value) return this.aviso("lt-msg", "erro", "Informe o período.");
      const r = await this.enviar($$("lt-aplicar"), { acao:"lanc_chamada_lote", mats, status, ini:$$("lt-ini").value, fim:$$("lt-fim").value, pularDomingo:true });
      if(!r || !r.ok) return this.aviso("lt-msg", "erro", this.h((r && r.erro) || "Não foi possível aplicar."));
      this.aviso("lt-msg", "ok", `Lote aplicado: ${r.criadas} registro(s) criado(s) e ${r.atualizadas} atualizado(s).`);
      toast("Lote aplicado."); carregarDia();
    });
    this._onListas = (lista)=>{
      if(lista !== "STATUS_CHAMADA") return;
      const atual = $$("lt-status").value;
      $$("lt-status").innerHTML = this.options(this.ctx.listas.STATUS_CHAMADA, atual, "Selecione");
      desenharTodos(); desenharTabela();
    };
    desenharTodos(); carregarDia(); resumo();
  },

  /* ================================================================== */
  /* QUADRO (aba TURNOVER)                                               */
  /* ================================================================== */
  renderQuadro(){ this.abrir("lquadro", this._quadro); },
  async _quadro(pane){
    this.qd = { pessoas:[], editar:null, mostrarInativos:false, busca:"" };
    const L = this.ctx.listas;
    pane.innerHTML = `<div class="panel">
      ${this.cabecalho("Lançar Quadro (contratação, desligamento, transferência)", "Grava na aba TURNOVER. O quadro ativo do painel é quem está com ATIVO = Sim. Quem foi desligado ou transferido passa a NÃO ativo e sai dos indicadores.")}
      <div id="qd-titulo" style="font-weight:700;color:var(--blue-dark);margin-bottom:8px">Nova contratação</div>
      <div class="adm-form">
        <label>Matrícula<input type="text" id="qd-mat" inputmode="numeric" list="dl-qd" autocomplete="off"></label>
        <label>Nome<input type="text" id="qd-nome"></label>
        <label>Ativo (automático)<input type="text" id="qd-ativo" readonly value="Sim"></label>
        <label>Data de contratação<input type="date" id="qd-adm" value="${this.hojeISO()}"></label>
      </div>
      ${this.datalistPessoas("dl-qd", false)}
      <fieldset class="adm-fs"><legend>Saída do quadro (preencha só se a pessoa saiu)</legend>
        <div class="adm-form">
          <label>Tipo<select id="qd-tipo" data-vazio="">${this.options(L.TIPO_DESLIGAMENTO, null, "— continua ativo")}</select></label>
          <label>Motivo do desligamento<select id="qd-motivo" data-vazio="">${this.options(L.MOTIVO_DESLIGAMENTO, null, "—")}</select></label>
          <label>Data do desligamento<input type="date" id="qd-desl"></label>
          <label id="qd-l-transf" style="display:none">Data da transferência<input type="date" id="qd-transf"></label>
          <label id="qd-l-setor" style="display:none">Transferido para qual setor?<input type="text" id="qd-setor" placeholder="Ex.: Expedição"></label>
          <label id="qd-l-enc" style="display:none">Data do encostamento (INSS)<input type="date" id="qd-enc"></label>
        </div>
        ${this.novoItem("TIPO_DESLIGAMENTO", "qd-tipo", "novo tipo")}
        ${this.novoItem("MOTIVO_DESLIGAMENTO", "qd-motivo", "novo motivo")}
      </fieldset>
      <div class="adm-form"><label style="grid-column:1/-1">Outras observações<input type="text" id="qd-obs"></label></div>
      <div id="qd-msg"></div>
      <div class="adm-actions">
        <button type="button" class="btn btn-outline" id="qd-novo" style="display:none">Cancelar edição</button>
        <button type="button" class="btn btn-primary" id="qd-salvar">Salvar</button>
      </div>
    </div>
    <div class="panel">
      <div class="adm-head"><h3 class="adm-h2" style="margin:0">Quadro (aba TURNOVER)</h3>
        <div class="adm-head-r"><input type="search" id="qd-busca" placeholder="Buscar..."><label class="adm-chk"><input type="checkbox" id="qd-inat"> Mostrar inativos</label></div></div>
      <div id="qd-lista" class="table-wrap" style="margin-top:10px"><p class="small-muted">Carregando...</p></div>
    </div>`;
    this.ligarNovoItem(pane);
    const $$ = (id)=> document.getElementById(id);

    const atualizarAtivo = ()=>{
      const tipo = $$("qd-tipo").value, transf = /transfer/i.test(tipo), enc = /encost/i.test(tipo);
      const saiu = !!($$("qd-desl").value || transf || enc);   // desligado, transferido ou encostado = ativo "Não"
      $$("qd-ativo").value = saiu ? "Não" : "Sim";
      $$("qd-l-transf").style.display = $$("qd-l-setor").style.display = transf ? "" : "none";
      $$("qd-l-enc").style.display = enc ? "" : "none";
      if(!transf){ $$("qd-transf").value = ""; $$("qd-setor").value = ""; }
      if(!enc) $$("qd-enc").value = "";
      $$("qd-motivo").disabled = transf || enc;
    };
    ["qd-tipo","qd-desl"].forEach(id=> $$(id).addEventListener("change", atualizarAtivo));
    $$("qd-mat").addEventListener("change", ()=>{
      const mat = this.soDigitos($$("qd-mat").value);
      // matrícula já ativa no quadro: carrega o registro (inclui data de contratação) para edição
      const reg = !this.qd.editar && mat && (this.qd.pessoas||[]).find(p=> this.soDigitos(p.mat) === mat && p.ativo);
      if(reg){
        const b = $$("qd-lista").querySelector(`[data-ed="${reg.linha}"]`);
        if(b){ b.click(); this.aviso("qd-msg", "ok", "Matrícula já está no quadro — registro carregado (data de contratação incluída). Edite e salve."); return; }
        this.qd.editar = reg.linha; $$("qd-nome").value = reg.nome; $$("qd-adm").value = reg.adm || ""; $$("qd-tipo").value = reg.tipo; $$("qd-motivo").value = reg.motivo;
        $$("qd-desl").value = reg.desl; $$("qd-transf").value = reg.transf; $$("qd-setor").value = reg.setor||""; $$("qd-enc").value = reg.enc||""; $$("qd-obs").value = reg.obs; $$("qd-titulo").textContent = "Editando " + reg.nome; $$("qd-novo").style.display = ""; atualizarAtivo();
        return;
      }
      const n = this.nomeDe($$("qd-mat").value); if(n && !$$("qd-nome").value) $$("qd-nome").value = n;
    });

    const limpar = ()=>{
      this.qd.editar = null;
      ["qd-mat","qd-nome","qd-obs","qd-desl","qd-transf","qd-setor","qd-enc"].forEach(id=> $$(id).value = "");
      $$("qd-adm").value = this.hojeISO(); $$("qd-tipo").value = ""; $$("qd-motivo").value = "";
      $$("qd-titulo").textContent = "Nova contratação"; $$("qd-novo").style.display = "none"; $$("qd-mat").readOnly = false; atualizarAtivo();
    };
    $$("qd-novo").addEventListener("click", limpar);

    const lista = ()=>{
      const q = this.qd.busca.toLowerCase();
      const rows = this.qd.pessoas.filter(p=> (this.qd.mostrarInativos || p.ativo) && (!q || (p.mat+" "+p.nome).toLowerCase().includes(q)))
        .sort((a,b)=> (b.ativo - a.ativo) || a.nome.localeCompare(b.nome));
      $$("qd-lista").innerHTML = rows.length ? `<table class="adm-table"><thead><tr><th>Matrícula</th><th>Nome</th><th>Ativo</th><th>Tipo / Motivo</th><th>Contratação</th><th>Saída</th><th></th></tr></thead><tbody>
        ${rows.map(p=>`<tr><td>${this.h(p.mat)}</td><td>${this.h(p.nome)}</td><td><span class="adm-tag ${p.ativo ? "acc" : "off"}">${p.ativo ? "Sim" : "Não"}</span></td>
          <td>${this.h([p.tipo, p.motivo].filter(Boolean).join(" · "))}</td><td>${this.br(p.adm)}</td><td>${this.br(p.desl || p.transf || p.enc)}${p.setor ? " → " + this.h(p.setor) : ""}</td>
          <td><button type="button" class="btn btn-outline btn-sm" data-ed="${p.linha}">Editar</button></td></tr>`).join("")}</tbody></table>`
        : `<p class="small-muted">Nenhum registro.</p>`;
      $$("qd-lista").querySelectorAll("[data-ed]").forEach(b=> b.addEventListener("click", ()=>{
        const p = this.qd.pessoas.find(x=>x.linha === Number(b.dataset.ed)); if(!p) return;
        this.qd.editar = p.linha;
        $$("qd-mat").value = p.mat; $$("qd-nome").value = p.nome; $$("qd-adm").value = p.adm; $$("qd-tipo").value = p.tipo; $$("qd-motivo").value = p.motivo;
        $$("qd-desl").value = p.desl; $$("qd-transf").value = p.transf; $$("qd-setor").value = p.setor||""; $$("qd-enc").value = p.enc||""; $$("qd-obs").value = p.obs;
        $$("qd-titulo").textContent = "Editando " + p.nome; $$("qd-novo").style.display = ""; atualizarAtivo();
        window.scrollTo({ top:0, behavior:"smooth" });
      }));
    };
    const carregar = async ()=>{
      const r = await Api.call({ acao:"lanc_quadro_listar" }).catch(e=>({ ok:false, erro:e.message }));
      if(!r || !r.ok){ $$("qd-lista").innerHTML = `<div class="error-box">${this.h((r && r.erro) || "Falha ao carregar o quadro.")}</div>`; return; }
      this.qd.pessoas = r.pessoas; lista();
    };
    $$("qd-busca").addEventListener("input", ()=>{ this.qd.busca = $$("qd-busca").value; lista(); });
    $$("qd-inat").addEventListener("change", ()=>{ this.qd.mostrarInativos = $$("qd-inat").checked; lista(); });
    $$("qd-salvar").addEventListener("click", async ()=>{
      this.aviso("qd-msg", "", "");
      const r = await this.enviar($$("qd-salvar"), { acao:"lanc_quadro_salvar", linha:this.qd.editar || 0, matric:$$("qd-mat").value, nome:$$("qd-nome").value.trim(),
        tipo:$$("qd-tipo").value, motivo:$$("qd-motivo").disabled ? "" : $$("qd-motivo").value, obs:$$("qd-obs").value,
        dtAdm:$$("qd-adm").value, dtDesl:$$("qd-desl").value, dtTransf:$$("qd-transf").value, setor:$$("qd-setor").value.trim(), dtEnc:$$("qd-enc").value });
      if(!r || !r.ok) return this.aviso("qd-msg", "erro", this.h((r && r.erro) || "Não foi possível salvar."));
      this.aviso("qd-msg", "ok", `Registro salvo — ${r.ativo ? "colaborador <strong>ATIVO</strong>" : "colaborador <strong>NÃO ativo</strong> (fora dos indicadores)"}.`);
      toast("Quadro atualizado.");
      // atualiza a lista de nomes usada pelos outros formulários
      this.ctx = null; limpar(); carregar();
    });
    atualizarAtivo(); carregar();
  },

  /* ================================================================== */
  /* MISSÕES                                                             */
  /* ================================================================== */
  renderMissoes(){ this.abrir("lmissoes", this._missoes); },
  _missoes(pane){
    pane.innerHTML = `<div class="panel">
      ${this.cabecalho("Lançar Missão", "Grava na aba MISSÕES. O tempo total é calculado pela hora início e fim.")}
      <div class="adm-form">
        <label>Data<input type="date" id="ms-data" value="${this.hojeISO()}"></label>
        <label>Hora início<input type="time" id="ms-ini"></label>
        <label>Hora fim<input type="time" id="ms-fim"></label>
        <label>Tempo total (automático)<input type="text" id="ms-tot" readonly placeholder="—"></label>
      </div>
      <div class="adm-form">
        <label>Código do colaborador<input type="text" id="ms-cod" inputmode="numeric" list="dl-ms" autocomplete="off"></label>
        <label>Nome (automático)<input type="text" id="ms-nome" readonly placeholder="—"></label>
        <label>Tipo<select id="ms-tipo" data-vazio="">${this.options(this.ctx.listas.TIPO_MISSAO, null, "Selecione")}</select></label>
      </div>
      ${this.datalistPessoas("dl-ms", true)}
      ${this.novoItem("TIPO_MISSAO", "ms-tipo", "novo tipo de missão")}
      <div id="ms-msg"></div>
      <div class="adm-actions"><button type="button" class="btn btn-primary" id="ms-salvar">Salvar missão</button></div>
      ${this.rodapeAtualizar()}
    </div>`;
    this.ligarNovoItem(pane);
    const $$ = (id)=> document.getElementById(id);
    const min = (t)=>{ const m = String(t||"").match(/^(\d{1,2}):(\d{2})/); return m ? (+m[1])*60 + (+m[2]) : null; };
    const total = ()=>{
      const a = min($$("ms-ini").value), b = min($$("ms-fim").value);
      if(a === null || b === null){ $$("ms-tot").value = ""; return; }
      let t = b - a; if(t < 0) t += 1440;
      $$("ms-tot").value = `${Math.floor(t/60)}h${this.pad(t%60)}min`;
    };
    $$("ms-ini").addEventListener("input", total); $$("ms-fim").addEventListener("input", total);
    const nome = ()=>{ $$("ms-nome").value = this.nomeDe($$("ms-cod").value); $$("ms-nome").placeholder = $$("ms-cod").value ? "código não encontrado" : "—"; };
    $$("ms-cod").addEventListener("input", nome); $$("ms-cod").addEventListener("change", nome);
    $$("ms-salvar").addEventListener("click", async ()=>{
      this.aviso("ms-msg", "", "");
      if(!this.nomeDe($$("ms-cod").value)) return this.aviso("ms-msg", "erro", "Código não encontrado no quadro (aba TURNOVER).");
      if(!$$("ms-ini").value || !$$("ms-fim").value) return this.aviso("ms-msg", "erro", "Informe a hora de início e a de fim.");
      if(!$$("ms-tipo").value) return this.aviso("ms-msg", "erro", "Escolha o tipo da missão.");
      const r = await this.enviar($$("ms-salvar"), { acao:"lanc_missao_salvar", data:$$("ms-data").value, ini:$$("ms-ini").value, fim:$$("ms-fim").value,
        cod:$$("ms-cod").value, nome:$$("ms-nome").value, tipo:$$("ms-tipo").value });
      if(!r || !r.ok) return this.aviso("ms-msg", "erro", this.h((r && r.erro) || "Não foi possível salvar."));
      this.aviso("ms-msg", "ok", `Missão de <strong>${this.h(r.nome)}</strong> salva (${Math.floor(r.totalMin/60)}h${this.pad(r.totalMin%60)}min).`);
      toast("Missão salva."); $$("ms-ini").value = ""; $$("ms-fim").value = ""; $$("ms-cod").value = ""; $$("ms-nome").value = ""; total();
    });
  },

  /* ================================================================== */
  /* CAPACIDADE REALIZADA                                                */
  /* ================================================================== */
  renderCapacidade(){ this.abrir("lcapacidade", this._capacidade); },
  _capacidade(pane){
    pane.innerHTML = `<div class="panel">
      ${this.cabecalho("Lançar Capacidade Realizada", "Grava na aba Capacidade Realizada (código do produto, data e tipo). Você pode colar vários códigos de uma vez — um por linha, ou separados por espaço, vírgula ou ponto e vírgula. Repetidos (mesmo produto, dia e tipo) são ignorados.")}
      <div class="adm-form">
        <label>Data<input type="date" id="cp-data" value="${this.hojeISO()}"></label>
        <label>Tipo<select id="cp-tipo"><option value="CORRETIVO">CORRETIVO</option><option value="PREVENTIVO">PREVENTIVO</option></select></label>
      </div>
      <div class="adm-form"><label style="grid-column:1/-1">Código(s) do produto<textarea id="cp-cod" rows="4" inputmode="numeric" style="padding:9px 10px;border:1.5px solid var(--gray-200);border-radius:8px;font-size:14px;font-family:inherit;text-transform:none;letter-spacing:0;font-weight:500;" placeholder="Ex.: 123456"></textarea></label></div>
      <div id="cp-msg"></div>
      <div class="adm-actions"><button type="button" class="btn btn-primary" id="cp-salvar">Lançar</button></div>
      ${this.rodapeAtualizar()}
    </div>`;
    const $$ = (id)=> document.getElementById(id);
    $$("cp-salvar").addEventListener("click", async ()=>{
      this.aviso("cp-msg", "", "");
      const codigos = Array.from(new Set($$("cp-cod").value.split(/[\s,;]+/).map(s=>s.trim()).filter(Boolean)));
      if(!codigos.length) return this.aviso("cp-msg", "erro", "Informe ao menos um código de produto.");
      const btn = $$("cp-salvar"), txt = btn.textContent; btn.disabled = true;
      let ok = 0; const falhas = [];
      for(let i=0; i<codigos.length; i++){
        btn.textContent = `Salvando ${i+1}/${codigos.length}...`;
        const r = await Api.call({ acao:"lanc_capacidade_salvar", cod:codigos[i], data:$$("cp-data").value, tipo:$$("cp-tipo").value }).catch(e=>({ ok:false, erro:e.message }));
        if(r && r.ok) ok++; else falhas.push({ cod:codigos[i], erro:(r && r.erro) || "falha" });
        if(r && r.login) break;
      }
      btn.disabled = false; btn.textContent = txt;
      if(!falhas.length){ this.aviso("cp-msg", "ok", `${ok} produto(s) lançado(s).`); toast("Capacidade lançada."); $$("cp-cod").value = ""; }
      else this.aviso("cp-msg", ok ? "aviso" : "erro", `${ok} lançado(s). ${falhas.length} não gravado(s):<ul style="margin:6px 0 0 18px">${falhas.slice(0,20).map(f=>`<li>${this.h(f.cod)} — ${this.h(f.erro)}</li>`).join("")}</ul>`);
      if(falhas.length) $$("cp-cod").value = falhas.map(f=>f.cod).join("\n");
    });
  }
};
window.LancUI = LancUI;

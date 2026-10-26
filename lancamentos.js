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
        <button type="button" class="btn btn-primary" id="${p}-foto">📷 Tirar foto (digitalizar como scanner)</button>
        <button type="button" class="btn btn-outline" id="${p}-arq">📄 Já tenho o arquivo (PDF ou imagem)</button>
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
        <button type="button" class="btn btn-outline btn-sm" id="${p}-rm" style="margin-top:6px">Remover</button></div></div>`;
      $$(p + "-rm").addEventListener("click", ()=>{ this.anexos[p] = null; mostrar(); });
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
      this.anexos[p] = { nome:f.name, mime:f.type || "application/octet-stream", base64:b64, paginas:0, preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : "" };
      mostrar();
    });
    return mostrar;
  },
  /** Preenche a matrícula vinda de outra tela (ex.: botão "Lançar advertência" no detalhe do funcionário). */
  aplicarPrefill(idMat){
    const pf = this.prefill; this.prefill = null;
    const el = document.getElementById(idMat);
    if(pf && pf.mat && el){ el.value = this.soDigitos(pf.mat); el.dispatchEvent(new Event("input")); el.dispatchEvent(new Event("change")); }
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
    </div>`;
    const $$ = (id)=> document.getElementById(id);
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
    });
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
    </div>`;
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
      const linhas = (e.motivos||[]).map(m=>`<tr${motivo && m.chave === FeedbackAdv.mk(motivo) ? ' style="background:#fff8e1"' : ""}><td>${this.h(m.motivo)}</td><td>${m.fb}</td><td>${m.adv}</td><td>${m.pend ? `<strong style="color:#d64545">${m.pend} a emitir</strong>` : "—"}</td></tr>`).join("");
      let rec = "";
      if(motivo){
        rec = fab && fab.pend > 0 ? `<div class="warn-box" style="margin:8px 0 0">🔴 Indicada: ${fab.fb} feedback(s) em "${this.h(motivo)}" e ${fab.adv} advertência(s) — faltam ${fab.pend} advertência(s) pela regra (a cada ${FB_A_CADA} feedbacks).</div>`
          : `<div class="hint-box" style="margin:8px 0 0">Em "${this.h(motivo)}": ${fab ? fab.fb : 0} feedback(s) e ${fab ? fab.adv : 0} advertência(s). Pela regra de ${FB_A_CADA} feedbacks, ainda <strong>não</strong> há advertência pendente neste motivo.</div>`;
      }
      box.innerHTML = `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">
          <div class="card" style="min-width:120px"><div class="card-label">Feedbacks</div><div class="card-value">${e.feedbacks.length}</div></div>
          <div class="card" style="min-width:120px"><div class="card-label">Advertências</div><div class="card-value">${e.adv.length}</div></div>
          <div class="card" style="min-width:150px"><div class="card-label">Último feedback</div><div class="card-value" style="font-size:18px">${e.feedbacks[0] ? fmtDateBR(e.feedbacks[0].data) : "—"}</div></div></div>
        ${linhas ? `<div class="table-wrap"><table class="adm-table"><thead><tr><th>Motivo</th><th>Feedbacks</th><th>Advertências</th><th>Situação</th></tr></thead><tbody>${linhas}</tbody></table></div>` : `<div class="small-muted">Sem feedbacks nem advertências anteriores.</div>`}${rec}`;
    };
    $$("ad-mat").addEventListener("input", historico); $$("ad-mat").addEventListener("change", historico);
    $$("ad-motivo").addEventListener("change", historico);
    $$("ad-mat-apl").addEventListener("change", ()=>{ const n = this.nomeDe($$("ad-mat-apl").value); if(n) $$("ad-nome-apl").value = n; });
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
  _avaria(pane){
    this.avVer = null;
    pane.innerHTML = `<div class="panel">
      ${this.cabecalho("Lançar Avaria 9712", "Lança o número da transação (Num.Lançamento) da 9712 na aba REP.AVARIA. Antes de gravar, o sistema confere se o número já foi lançado e se existe na 9712 (coluna K).")}
      <div class="adm-form">
        <label>Num.Lançamento<input type="text" id="av-num" inputmode="numeric" placeholder="Ex.: 597172" autocomplete="off"></label>
        <label>Tipo de lançamento<select id="av-tipo" data-vazio="">${this.options(this.ctx.listas.TIPO_REP_AVARIA, null)}</select></label>
      </div>
      ${this.novoItem("TIPO_REP_AVARIA", "av-tipo", "novo tipo de lançamento")}
      <div style="margin:12px 0"><button type="button" class="btn btn-outline" id="av-ver">🔎 Verificar número</button></div>
      <div id="av-ind" style="min-height:34px"></div>
      <div id="av-conf" style="display:none;margin:8px 0;min-height:34px"><label class="adm-chk"><input type="checkbox" id="av-conf-ck"> Confirmo lançar mesmo sem constar na 9712</label></div>
      <div id="av-msg"></div>
      <div class="adm-actions"><button type="button" class="btn btn-primary" id="av-salvar">Lançar</button></div>
      <h3 class="adm-h2" style="margin-top:18px">Lançados nesta sessão</h3>
      <div id="av-hist" class="small-muted">Nenhum ainda.</div>
    </div>`;
    this.ligarNovoItem(pane);
    const $$ = (id)=> document.getElementById(id);
    this.avHist = this.avHist || [];
    const hist = ()=>{ $$("av-hist").innerHTML = this.avHist.length ? `<table class="adm-table"><thead><tr><th>Num.Lançamento</th><th>Tipo</th><th>Na 9712</th></tr></thead><tbody>${this.avHist.map(x=>`<tr><td>${this.h(x.num)}</td><td>${this.h(x.tipo)}</td><td>${x.na9712}</td></tr>`).join("")}</tbody></table>` : "Nenhum ainda."; };
    hist();
    const indicador = (r)=>{
      const b = (cls, txt)=> `<span class="adm-tag ${cls}" style="margin:2px 6px 2px 0">${txt}</span>`;
      let html = "";
      if(r.jaLancado) html += b("err", "⛔ Já lançado na REP.AVARIA");
      else html += b("acc", "✔ Ainda não lançado");
      if(!r.na9712.aba) html += b("off", "Aba 9712 não encontrada");
      else if(r.na9712.existe) html += b("acc", "✔ Existe na 9712 (coluna K)");
      else html += b("rep", "⚠ Não encontrado na 9712 (coluna K)");
      $$("av-ind").innerHTML = html;
      $$("av-conf").style.display = (r.na9712.aba && !r.na9712.existe && !r.jaLancado) ? "block" : "none";
      if($$("av-conf").style.display === "none") $$("av-conf-ck").checked = false;
    };
    const verificar = async ()=>{
      const num = this.soDigitos($$("av-num").value);
      if(!num){ $$("av-ind").innerHTML = ""; $$("av-conf").style.display = "none"; return null; }
      // não mexe no layout enquanto confere (senão o botão "Lançar" sai de baixo do dedo/mouse)
      const r = await Api.call({ acao:"lanc_avaria_verificar", num }).catch(e=>({ ok:false, erro:e.message }));
      if(!r || !r.ok){ $$("av-ind").innerHTML = ""; this.aviso("av-msg", "erro", this.h((r && r.erro) || "Falha ao conferir.")); return null; }
      this.aviso("av-msg", "", "");
      this.avVer = r; indicador(r); return r;
    };
    $$("av-ver").addEventListener("click", verificar);
    $$("av-num").addEventListener("change", verificar);
    $$("av-num").addEventListener("keydown", (e)=>{ if(e.key === "Enter"){ e.preventDefault(); verificar(); } });
    $$("av-salvar").addEventListener("click", async ()=>{
      const num = this.soDigitos($$("av-num").value), tipo = $$("av-tipo").value;
      this.aviso("av-msg", "", "");
      if(!num) return this.aviso("av-msg", "erro", "Informe o número do lançamento.");
      if(!tipo) return this.aviso("av-msg", "erro", "Escolha o tipo do lançamento.");
      const r = await this.enviar($$("av-salvar"), { acao:"lanc_avaria_salvar", num, tipo, confirmarSem9712: $$("av-conf-ck").checked });
      if(r && r.precisaConfirmar){
        $$("av-conf").style.display = "block";
        return this.aviso("av-msg", "aviso", this.h(r.erro) + " Marque a confirmação e lance de novo.");
      }
      if(!r || !r.ok){ if(r && /já existe/i.test(r.erro||"")) verificar(); return this.aviso("av-msg", "erro", this.h((r && r.erro) || "Não foi possível lançar.")); }
      this.avHist.unshift({ num, tipo, na9712: r.na9712 && r.na9712.aba ? (r.na9712.existe ? "✔ sim" : "⚠ não") : "—" });
      hist(); this.aviso("av-msg", "ok", `Lançamento <strong>${this.h(num)}</strong> gravado (${this.h(tipo)}).`);
      toast("Avaria 9712 lançada.");
      $$("av-num").value = ""; $$("av-ind").innerHTML = ""; $$("av-conf").style.display = "none"; $$("av-conf-ck").checked = false; $$("av-num").focus();
    });
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
      if(n.includes("SUSPENS")) return "#8b1d1d";
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
        ${c.itens.map((it,i)=>`<tr><td>${this.h(it.mat)}</td><td>${this.h(it.nome)}${it.sugerido ? `<div class="small-muted" style="font-size:11px">🏖️ férias agendadas</div>` : ""}</td>
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
          <label>Data da transferência<input type="date" id="qd-transf"></label>
        </div>
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
      const tipo = $$("qd-tipo").value, saiu = !!($$("qd-desl").value || $$("qd-transf").value || /transfer/i.test(tipo));
      $$("qd-ativo").value = saiu ? "Não" : "Sim";
      const transf = /transfer/i.test(tipo);
      $$("qd-motivo").disabled = transf;
    };
    ["qd-tipo","qd-desl","qd-transf"].forEach(id=> $$(id).addEventListener("change", atualizarAtivo));
    $$("qd-mat").addEventListener("change", ()=>{ const n = this.nomeDe($$("qd-mat").value); if(n && !$$("qd-nome").value) $$("qd-nome").value = n; });

    const limpar = ()=>{
      this.qd.editar = null;
      ["qd-mat","qd-nome","qd-obs","qd-desl","qd-transf"].forEach(id=> $$(id).value = "");
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
          <td>${this.h([p.tipo, p.motivo].filter(Boolean).join(" · "))}</td><td>${this.br(p.adm)}</td><td>${this.br(p.desl || p.transf)}</td>
          <td><button type="button" class="btn btn-outline btn-sm" data-ed="${p.linha}">Editar</button></td></tr>`).join("")}</tbody></table>`
        : `<p class="small-muted">Nenhum registro.</p>`;
      $$("qd-lista").querySelectorAll("[data-ed]").forEach(b=> b.addEventListener("click", ()=>{
        const p = this.qd.pessoas.find(x=>x.linha === Number(b.dataset.ed)); if(!p) return;
        this.qd.editar = p.linha;
        $$("qd-mat").value = p.mat; $$("qd-nome").value = p.nome; $$("qd-adm").value = p.adm; $$("qd-tipo").value = p.tipo; $$("qd-motivo").value = p.motivo;
        $$("qd-desl").value = p.desl; $$("qd-transf").value = p.transf; $$("qd-obs").value = p.obs;
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
        dtAdm:$$("qd-adm").value, dtDesl:$$("qd-desl").value, dtTransf:$$("qd-transf").value });
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

/* =========================================================================
   Núcleo Reposição — Administração > Parâmetros
   Abas modulares: Não Conformidades e Feedbacks · Auditoria · Comissão · Painel TV
   Regras em Regras (regras.js). Só o administrador grava; os demais veem (desabilitado).
   ========================================================================= */
const ParametrosUI = {
  aba: (()=>{ try{ return localStorage.getItem("nr_param_aba") || "nc"; }catch(e){ return "nc"; } })(),
  rascNC: null, rascAud: null, sujo: false,
  ABAS: [ ["nc","Não Conformidades e Feedbacks"], ["aud","Auditoria"], ["com","Comissão"], ["tv","Painel TV"] ],
  h(s){ return escapeHtml(String(s===undefined||s===null ? "" : s)); },

  devolverTV(){   // o painel de parâmetros da TV é o #pane-tv; ao sair da aba ele volta para seu lugar
    const tv = document.getElementById("pane-tv"), casa = document.getElementById("pane-parametros");
    if(tv && casa && casa.contains(tv)){ tv.classList.remove("active"); tv.style.animation = ""; casa.parentNode.appendChild(tv); }
  },

  async renderPane(){
    const pane = document.getElementById("pane-parametros"); if(!pane) return;
    this.devolverTV();
    if(!Regras.carregada){ await Regras.carregar(); }
    if(!this.rascNC) this.rascNC = Regras.clone(Regras.nc);
    if(!this.rascAud) this.rascAud = Regras.clone(Regras.aud);
    const abas = this.ABAS.map(a=>`<button type="button" class="pm-tab ${this.aba===a[0]?"on":""}" data-pm="${a[0]}">${this.h(a[1])}</button>`).join("");
    pane.innerHTML = `<div class="pm-tabs" role="tablist">${abas}</div><div id="pm-corpo"></div>`;
    pane.querySelectorAll(".pm-tab").forEach(b=> b.addEventListener("click", ()=>{
      this.aba = b.dataset.pm; try{ localStorage.setItem("nr_param_aba", this.aba); }catch(e){}
      this.renderPane();
    }));
    const corpo = document.getElementById("pm-corpo");
    if(this.aba === "nc") this.desenharNC(corpo);
    else if(this.aba === "aud") this.desenharAud(corpo);
    else if(this.aba === "com") this.desenharCom(corpo);
    else this.desenharTV(corpo);
  },

  /* ----------------------------- Não Conformidades e Feedbacks ----------------------------- */
  /** motivos conhecidos: os de NC + os que já aparecem em feedbacks/advertências lançados + os que o admin já configurou */
  motivosConhecidos(){
    const m = new Map();
    const add = (txt)=>{ const k = FeedbackAdv.mk(txt); if(k === FB_SEM_MOTIVO) return; if(!m.has(k)) m.set(k, { chave:k, motivo:FeedbackAdv.motivoTxt(txt), nc:false }); };
    NC.TIPOS.forEach(t=>{ add(t.motivo); m.get(FeedbackAdv.mk(t.motivo)).nc = true; });
    try{ FeedbackAdv.feedbacks().forEach(r=>add(r.motivo)); FeedbackAdv.advertencias().forEach(r=>add(r.motivo)); }catch(e){}
    Object.keys(this.rascNC.motivos).forEach(k=>{ if(!m.has(k)) m.set(k, { chave:k, motivo:this.rascNC.motivos[k].motivo || k, nc:false }); });
    return Array.from(m.values()).sort((a,b)=> (b.nc-a.nc) || a.motivo.localeCompare(b.motivo));
  },
  campoNum(id, rot, val, dica, dis){
    return `<div class="filter-group"><label for="${id}">${this.h(rot)}</label><input type="number" min="1" step="1" id="${id}" value="${this.h(val)}" ${dis?"disabled":""}>${dica?`<span class="small-muted" style="font-size:11.5px">${this.h(dica)}</span>`:""}</div>`;
  },
  chk(attrs, marcado, dis){ return `<label class="pm-chk"><input type="checkbox" ${attrs} ${marcado?"checked":""} ${dis?"disabled":""}><span></span></label>`; },

  desenharNC(el){
    const dis = !Regras.admin, g = this.rascNC.global, h = this.h.bind(this);
    const motivos = this.motivosConhecidos();
    const linhas = motivos.map(mo=>{
      const o = this.rascNC.motivos[mo.chave] || {};
      const num = (campo, pad)=> `<input type="number" min="1" step="1" class="pm-n" data-mo="${h(mo.chave)}" data-campo="${campo}" value="${o[campo]||""}" placeholder="${pad}" ${dis?"disabled":""}>`;
      const padFb = mo.nc ? g.fbParaAdvNC : g.fbParaAdvOutros;
      return `<tr>
        <td><strong>${h(mo.motivo)}</strong>${mo.nc?` <span class="vd-comp c-filtergroup">NC</span>`:""}</td>
        <td>${mo.nc ? num("ncPorFb", g.ncPorFb) : `<span class="small-muted">—</span>`}</td>
        <td>${num("fbParaAdv", padFb)}</td>
        <td>${num("advParaSusp", g.advParaSusp)}</td>
        <td class="c">${mo.nc ? this.chk(`data-mo="${h(mo.chave)}" data-al="alertaFb"`, o.alertaFb !== false, dis) : `<span class="small-muted">—</span>`}</td>
        <td class="c">${this.chk(`data-mo="${h(mo.chave)}" data-al="alertaAdv"`, o.alertaAdv !== false, dis)}</td>
        <td class="c">${this.chk(`data-mo="${h(mo.chave)}" data-al="alertaSusp"`, o.alertaSusp !== false, dis)}</td></tr>`;
    }).join("");
    el.innerHTML = `
      <div class="panel">
        <div class="adm-head"><h2 class="adm-h">Escalada: NC → Feedback → Advertência → Suspensão</h2>
          <div class="panel-actions"><button class="btn btn-outline btn-sm" id="pm-nc-pad" ${dis?"disabled":""}>Restaurar padrão</button><button class="btn btn-primary btn-sm" id="pm-nc-salvar" ${dis?"disabled":""}>Salvar regras</button></div></div>
        <p class="small-muted" style="margin:6px 0 0">${dis ? "Somente o administrador altera estas regras. " : ""}Cada erro conta como 1 NC. As regras gerais valem para todos os motivos; na tabela abaixo cada motivo pode ter números próprios (deixe em branco para usar o geral) e desligar alertas. Efeito imediato nos alertas, no Insights e no documento de feedback.</p>
        <div class="vd-bar">
          ${this.campoNum("pm-g-nc","NC para 1 feedback", g.ncPorFb, "mesmo motivo, desde o último feedback", dis)}
          ${this.campoNum("pm-g-fbnc","Feedbacks para 1 advertência (motivos de NC)", g.fbParaAdvNC, "", dis)}
          ${this.campoNum("pm-g-fbo","Feedbacks para 1 advertência (demais motivos)", g.fbParaAdvOutros, "", dis)}
          ${this.campoNum("pm-g-susp","Advertências para solicitar suspensão", g.advParaSusp, "mesmo motivo", dis)}
        </div></div>
      <div class="panel">
        <div class="adm-head"><h3 class="adm-h2" style="margin:0">Regras por motivo</h3></div>
        <p class="small-muted" style="margin:6px 0 0">Ex.: um feedback de gestão uma vez ao mês, sem alerta de advertência na 3ª ocorrência → desmarque <em>Alerta de advertência</em> nesse motivo. O feedback continua podendo ser lançado normalmente.</p>
        <div class="vd-tbl"><table class="pm-tbl"><thead><tr><th>Motivo</th><th>NC → feedback</th><th>Feedbacks → advertência</th><th>Advertências → suspensão</th><th class="c">Alerta de feedback</th><th class="c">Alerta de advertência</th><th class="c">Alerta de suspensão</th></tr></thead><tbody>${linhas}</tbody></table></div>
        <div class="vd-bar" style="margin-top:10px"><div class="filter-group" style="min-width:260px"><label for="pm-novo">Incluir outro motivo</label><input type="text" id="pm-novo" placeholder="Ex.: Feedback de gestão" ${dis?"disabled":""}></div>
          <button class="btn btn-outline btn-sm" id="pm-add" ${dis?"disabled":""}>Adicionar</button></div>
        <div class="cp-state" id="pm-nc-st" style="margin-top:8px;font-size:12px;color:var(--gray-700)">${this.sujo ? "Alterações não salvas" : ""}</div>
      </div>`;
    if(dis) return;
    const ler = ()=>{   // lê o formulário para o rascunho
      const d = this.rascNC;
      d.global = { ncPorFb:Regras.num(el.querySelector("#pm-g-nc").value, 4), fbParaAdvNC:Regras.num(el.querySelector("#pm-g-fbnc").value, 3), fbParaAdvOutros:Regras.num(el.querySelector("#pm-g-fbo").value, 3), advParaSusp:Regras.num(el.querySelector("#pm-g-susp").value, 3) };
      const novo = {};
      motivos.forEach(mo=>{
        const o = { motivo:mo.motivo };
        el.querySelectorAll(`[data-mo="${CSS.escape(mo.chave)}"]`).forEach(inp=>{
          if(inp.dataset.campo){ const v = parseInt(inp.value, 10); if(isFinite(v) && v >= 1) o[inp.dataset.campo] = v; }
          else if(inp.dataset.al && !inp.checked) o[inp.dataset.al] = false;
        });
        if(Object.keys(o).length > 1) novo[mo.chave] = o;
      });
      d.motivos = novo;
    };
    const marcar = ()=>{ this.sujo = true; const st = el.querySelector("#pm-nc-st"); if(st) st.textContent = "Alterações não salvas"; };
    el.querySelectorAll("input").forEach(i=> i.addEventListener("change", ()=>{ if(i.id === "pm-novo") return; ler(); marcar(); }));
    el.querySelector("#pm-add").addEventListener("click", ()=>{
      const t = trimStr(el.querySelector("#pm-novo").value); if(!t) return;
      ler(); const k = FeedbackAdv.mk(t);
      if(!this.rascNC.motivos[k]) this.rascNC.motivos[k] = { motivo:FeedbackAdv.motivoTxt(t) };
      marcar(); this.desenharNC(el);
    });
    el.querySelector("#pm-nc-pad").addEventListener("click", ()=>{ this.rascNC = Regras.clone(REGRAS_PADRAO_NC); marcar(); this.desenharNC(el); });
    el.querySelector("#pm-nc-salvar").addEventListener("click", async ()=>{
      ler(); const b = el.querySelector("#pm-nc-salvar"); b.disabled = true;
      try{ await Regras.salvar("regras_nc", this.rascNC); this.sujo = false; this.rascNC = Regras.clone(Regras.nc); toast("Regras salvas. Alertas atualizados.", "success"); try{ FeedbackAdv.atualizarAlertas(); }catch(e){} this.desenharNC(el); }
      catch(e){ toast(e.message || "Não foi possível salvar.", "error"); b.disabled = false; }
    });
  },

  /* ----------------------------- Auditoria ----------------------------- */
  desenharAud(el){
    const dis = !Regras.admin, p = this.rascAud.pesos, h = this.h.bind(this);
    el.innerHTML = `<div class="panel">
        <div class="adm-head"><h2 class="adm-h">Auditoria de ruas — pesos e exceções</h2>
          <div class="panel-actions"><button class="btn btn-outline btn-sm" id="pm-au-pad" ${dis?"disabled":""}>Restaurar padrão</button><button class="btn btn-primary btn-sm" id="pm-au-salvar" ${dis?"disabled":""}>Salvar regras</button></div></div>
        <p class="small-muted" style="margin:6px 0 0">${dis ? "Somente o administrador altera estas regras. " : ""}Qualidade da rua = 1 − (pontos ÷ endereços da rua). No mesmo lançamento os pesos somam; o mesmo endereço lançado mais de uma vez vale o maior peso. Os resultados são recalculados ao atualizar a Auditoria.</p>
        <div class="vd-bar">
          ${this.campoNum("pm-p-pick","Picking errado (produto trocado)", p.pickErrado, "pontos", dis)}
          ${this.campoNum("pm-p-av","Avaria", p.avariado, "pontos", dis)}
          ${this.campoNum("pm-p-pv","Próximo do vencimento", p.proxVenc, "pontos", dis)}
          ${this.campoNum("pm-p-ss","Sem saldo", p.semSaldo, "pontos", dis)}
          ${this.campoNum("pm-p-ou","Outra não conformidade", p.outra, "pontos", dis)}
        </div>
        <div class="vd-bar"><div class="filter-group" style="min-width:320px"><label for="pm-fora">Ruas fora da auditoria</label><input type="text" id="pm-fora" value="${h(this.rascAud.ruasFora.join(", "))}" ${dis?"disabled":""}><span class="small-muted" style="font-size:11.5px">números separados por vírgula</span></div></div>
        <div class="small-muted" id="pm-au-st" style="margin-top:8px;font-size:12px"></div></div>
      <div class="panel"><h3 class="adm-h2" style="margin:0 0 6px">Retornos</h3><p class="small-muted" style="margin:0">Erro de retorno = Possui NC ou divergência (unidades ≠ 0 ou etiqueta ≠ físico). Acuracidade = (auditados − erros) ÷ auditados. A qualidade ponderada por rua (usada na comissão) segue o peso por quantidade auditada: até 10 = 1, 11–20 = 2, e assim por diante.</p></div>`;
    if(dis) return;
    const ler = ()=>{
      const n = (id, pad)=>{ const v = parseFloat(String(el.querySelector(id).value).replace(",", ".")); return isFinite(v) && v >= 0 ? v : pad; };
      this.rascAud = { pesos:{ pickErrado:n("#pm-p-pick",6), avariado:n("#pm-p-av",4), proxVenc:n("#pm-p-pv",3), semSaldo:n("#pm-p-ss",2), outra:n("#pm-p-ou",1) },
        ruasFora: String(el.querySelector("#pm-fora").value).split(/[^0-9]+/).map(x=>parseInt(x,10)).filter(x=>isFinite(x) && x > 0) };
    };
    el.querySelectorAll("input").forEach(i=> i.addEventListener("change", ()=>{ ler(); el.querySelector("#pm-au-st").textContent = "Alterações não salvas"; }));
    el.querySelector("#pm-au-pad").addEventListener("click", ()=>{ this.rascAud = Regras.clone(REGRAS_PADRAO_AUD); this.desenharAud(el); el.querySelector("#pm-au-st").textContent = "Alterações não salvas"; });
    el.querySelector("#pm-au-salvar").addEventListener("click", async ()=>{
      ler(); const b = el.querySelector("#pm-au-salvar"); b.disabled = true;
      try{ await Regras.salvar("regras_aud", this.rascAud); this.rascAud = Regras.clone(Regras.aud); toast("Regras de auditoria salvas.", "success");
        try{ if(typeof audAtualizarTudo === "function") audAtualizarTudo(); }catch(e){} this.desenharAud(el); }
      catch(e){ toast(e.message || "Não foi possível salvar.", "error"); b.disabled = false; }
    });
  },

  /* ----------------------------- Comissão (bloco já existente) ----------------------------- */
  desenharCom(el){
    el.innerHTML = `<div class="panel" id="comissao-params" style="border:1.5px solid #2f6fce;"></div>`;
    try{ if(window.ComissaoParamsUI) ComissaoParamsUI.render(); else el.firstChild.innerHTML = `<p class="small-muted">Parâmetros de comissão indisponíveis.</p>`; }
    catch(e){ el.firstChild.innerHTML = `<p class="small-muted">Carregue os dados (Bases) para editar os parâmetros de comissão.</p>`; }
  },

  /* ----------------------------- Painel TV ----------------------------- */
  desenharTV(el){
    const tv = document.getElementById("pane-tv"); if(!tv){ el.innerHTML = `<div class="panel"><p class="small-muted">Painel TV indisponível.</p></div>`; return; }
    el.appendChild(tv); tv.classList.add("active");
    try{ if(window.PainelTV) PainelTV.renderPane(); }catch(e){}
  }
};
window.ParametrosUI = ParametrosUI;

/* =========================================================================
   Núcleo Reposição — Devolução de Mercadorias (Lançamentos > Devolução de Mercadorias)
   Digite/cole vários códigos de produto: o sistema valida na 8022, busca o endereço de picking (NIVEL = 1),
   monta a rota de devolução (crescente ou decrescente, opcionalmente em serpentina) e imprime etiquetas 50×50 mm
   já na ordem da rota (endereço, código e descrição). Mostra quando a 8022 foi atualizada pela última vez.
   Depende de lancamentos.js (LancUI) e dos dados carregados (processed.p8022CDRows).
   ========================================================================= */
Object.assign(LancUI, {
  dv: { codigos:[], ordem:"asc", serp:false, base:null, baseErro:"" },

  renderDevolucao(){ this.abrir("ldevolucao", this._devolucao); },

  /** mapa codprod/código auxiliar → endereço de picking (nível 1) da 8022 */
  dvIndice(){
    const pr = window.APP_STATE && window.APP_STATE.processed, rows = pr && pr.p8022CDRows;
    if(!rows) return null;
    if(this._dvIdx && this._dvIdx.src === rows) return this._dvIdx;
    const porProd = new Map(), porAux = new Map();
    const picking = (r)=> !/^(S|SIM|1|TRUE|Y)$/i.test(String(r.pulmao||"").trim());
    rows.forEach(r=>{
      const cp = String(r.codprod||"").trim().replace(/^0+/, ""); if(!cp) return;
      if(!porProd.has(cp)) porProd.set(cp, []);
      porProd.get(cp).push(r);
      [r.codauxiliar, r.codauxiliar2].forEach(a=>{ const k = String(a||"").trim().replace(/^0+/, ""); if(k && !porAux.has(k)) porAux.set(k, cp); });
    });
    const idx = { src:rows, porProd, porAux, picking, total:rows.length };
    this._dvIdx = idx; return idx;
  },
  dvEndereco(r){ return [r.rua, r.predio, r.nivel, r.apto].map(v=>String(v==null?"":v).trim()).join("-"); },
  dvNum(v){ const n = parseInt(String(v||"").replace(/\D/g,""), 10); return isNaN(n) ? null : n; },
  dvCmp(a, b){ const x = this.dvNum(a), y = this.dvNum(b); if(x!==null && y!==null && x!==y) return x - y; return String(a||"").localeCompare(String(b||""), "pt-BR", { numeric:true }); },

  /** resolve os códigos digitados: válidos (com endereço) e inválidos */
  dvResolver(){
    const idx = this.dvIndice(), st = this.dv;
    const validos = [], invalidos = [], vistos = new Set();
    st.codigos.forEach(c=>{
      const k = String(c).trim().replace(/^0+/, "");
      const cp = idx ? (idx.porProd.has(k) ? k : idx.porAux.get(k)) : null;
      if(!cp){ invalidos.push(c); return; }
      if(vistos.has(cp)) return; vistos.add(cp);
      const rs = idx.porProd.get(cp), r = rs.find(idx.picking) || rs[0];
      validos.push({ digitado:c, cod:String(r.codprod).trim(), descricao:r.descricao || "", rua:r.rua, predio:r.predio, nivel:r.nivel, apto:r.apto, end:this.dvEndereco(r), extras:rs.length - 1 });
    });
    // rota: rua → prédio → apto (crescente ou decrescente; serpentina alterna o sentido do prédio a cada rua)
    const dir = st.ordem === "desc" ? -1 : 1;
    validos.sort((a, b)=> dir * this.dvCmp(a.rua, b.rua) || 0);
    const ruas = Array.from(new Set(validos.map(v=>v.rua)));
    const posRua = new Map(ruas.map((r,i)=>[r,i]));
    validos.sort((a, b)=>{
      const rr = dir * this.dvCmp(a.rua, b.rua); if(rr) return rr;
      const sentido = st.serp && posRua.get(a.rua) % 2 === 1 ? -dir : dir;
      return sentido * this.dvCmp(a.predio, b.predio) || sentido * this.dvCmp(a.apto, b.apto) || this.dvCmp(a.cod, b.cod);
    });
    return { validos, invalidos, ruas: ruas.length, idx };
  },

  _devolucao(pane){
    const st = this.dv, idx = this.dvIndice();
    pane.innerHTML = `<div class="panel">
      ${this.cabecalho("Devolução de Mercadorias", "Digite ou cole os códigos dos produtos (um por linha ou separados por espaço/vírgula). O sistema confere na 8022, busca o endereço de picking nível 1 e monta a rota. Imprima as etiquetas 50×50 já na ordem de devolução.")}
      <div id="dv-base" style="margin:4px 0 10px"></div>
      <div class="adm-form" style="grid-template-columns:2fr 1fr 1fr">
        <label>Código do produto<input type="text" id="dv-cod" inputmode="numeric" autocomplete="off" placeholder="Digite e tecle Enter — ou cole vários códigos"></label>
        <label>Ordem da rota<select id="dv-ordem"><option value="asc" ${st.ordem==="asc"?"selected":""}>Crescente (rua 1 → última)</option><option value="desc" ${st.ordem==="desc"?"selected":""}>Decrescente (última → rua 1)</option></select></label>
        <label style="justify-content:flex-end"><span class="adm-chk" style="margin-top:20px"><input type="checkbox" id="dv-serp" ${st.serp?"checked":""}> Serpentina <span class="small-muted">(ida e volta nos prédios)</span></span></label>
      </div>
      <div id="dv-msg"></div>
      <div class="adm-actions"><button type="button" class="btn btn-outline" id="dv-limpar">Limpar lista</button><button type="button" class="btn btn-outline" id="dv-pdf">Baixar PDF</button><button type="button" class="btn btn-primary" id="dv-print">🖨️ Imprimir etiquetas 50×50</button></div>
    </div>
    <div class="panel" style="margin-top:14px" id="dv-res"></div>`;
    const $$ = (id)=> document.getElementById(id);
    if(!idx) this.aviso("dv-msg", "erro", "A base 8022 não está carregada no site. Use <strong>Atualizar dados</strong> (ou confira se a aba 8022 existe) e abra esta tela de novo.");
    const add = (txt)=>{
      const lista = String(txt||"").split(/[\s,;]+/).map(x=>x.trim()).filter(x=>/^\d+$/.test(x));
      if(!lista.length) return;
      lista.forEach(c=>{ if(!st.codigos.includes(c)) st.codigos.push(c); });
      desenhar();
    };
    $$("dv-cod").addEventListener("keydown", (e)=>{ if(e.key === "Enter"){ e.preventDefault(); add($$("dv-cod").value); $$("dv-cod").value = ""; } });
    $$("dv-cod").addEventListener("paste", (e)=>{ const t = (e.clipboardData || window.clipboardData).getData("text"); if(/[\s,;]/.test(t.trim())){ e.preventDefault(); add(t); } });
    $$("dv-ordem").addEventListener("change", ()=>{ st.ordem = $$("dv-ordem").value; desenhar(); });
    $$("dv-serp").addEventListener("change", ()=>{ st.serp = $$("dv-serp").checked; desenhar(); });
    $$("dv-limpar").addEventListener("click", ()=>{ if(!st.codigos.length || confirm("Limpar toda a lista de códigos?")){ st.codigos = []; desenhar(); } });
    $$("dv-pdf").addEventListener("click", ()=> this.dvEtiquetas(false));
    $$("dv-print").addEventListener("click", ()=> this.dvEtiquetas(true));

    const desenhar = ()=>{
      const R = this.dvResolver(), box = $$("dv-res"); if(!box) return;
      $$("dv-print").disabled = $$("dv-pdf").disabled = !R.validos.length;
      box.innerHTML = `<div class="adm-head"><h3 class="adm-h2" style="margin:0">Rota de devolução <span class="small-muted">· ${R.validos.length} produto(s) em ${R.ruas} rua(s)${R.invalidos.length ? ` · <span style="color:#d64545">${R.invalidos.length} código(s) não encontrado(s)</span>` : ""}</span></h3></div>
        ${R.invalidos.length ? `<div class="error-box" style="margin:8px 0">Código(s) que não existem na 8022 (nível 1): ${R.invalidos.map(c=>`<span class="adm-tag err" style="margin:2px 4px">${this.h(c)} <a href="#" data-dv-rm="${this.h(c)}" style="color:inherit;text-decoration:none" title="Remover">✕</a></span>`).join("")}</div>` : ""}
        <div class="table-wrap"><table class="adm-table"><thead><tr><th style="width:44px">Rota</th><th>Endereço</th><th>Cód.Produto</th><th>Descrição</th><th></th></tr></thead><tbody>
        ${R.validos.map((v,i)=>`<tr><td><strong>${i+1}</strong></td><td style="font-size:17px;font-weight:800;color:#123a6b;white-space:nowrap">${this.h(v.end)}${v.extras ? ` <span class="small-muted" style="font-size:11px;font-weight:400" title="O produto tem mais de um endereço nível 1; foi usado o de picking">+${v.extras} end.</span>` : ""}</td><td>${this.h(v.cod)}${v.digitado!==v.cod ? ` <span class="small-muted">(lido: ${this.h(v.digitado)})</span>` : ""}</td><td>${this.h(v.descricao)}</td>
          <td style="text-align:right"><button type="button" class="btn btn-outline btn-sm" data-dv-rm="${this.h(v.digitado)}">Remover</button></td></tr>`).join("") || `<tr><td colspan="5" class="small-muted">Nenhum produto na lista. Digite um código e tecle Enter.</td></tr>`}
        </tbody></table></div>`;
      box.querySelectorAll("[data-dv-rm]").forEach(b=> b.addEventListener("click", (e)=>{ e.preventDefault(); st.codigos = st.codigos.filter(c=>c !== b.dataset.dvRm); desenhar(); }));
    };
    desenhar();
    this.dvBase();
    $$("dv-cod").focus();
  },

  /** quando a 8022 foi atualizada pela última vez (carga feita em Administração > Bases) */
  async dvBase(){
    const st = this.dv, box = document.getElementById("dv-base"); if(!box) return;
    const idx = this.dvIndice();
    const pinta = ()=>{
      const el = document.getElementById("dv-base"); if(!el) return;
      let quando = st.base && st.base.quando, dias = null;
      if(quando){ const m = String(quando).match(/(\d{2})\/(\d{2})\/(\d{4})/); if(m) dias = Math.floor((Date.now() - new Date(Number(m[3]), Number(m[2])-1, Number(m[1])).getTime()) / 86400000); }
      const cls = dias === null ? "off" : dias > 7 ? "err" : dias > 2 ? "rep" : "acc";
      el.innerHTML = `<span class="adm-tag acc" style="margin-right:6px">8022: ${idx ? idx.total.toLocaleString("pt-BR") + " endereços de nível 1" : "não carregada"}</span>`
        + (quando ? `<span class="adm-tag ${cls}">Última atualização da 8022: ${this.h(quando)}${st.base.usuario ? " · "+this.h(st.base.usuario) : ""}${dias!==null ? " ("+(dias===0?"hoje":dias+" dia(s) atrás")+")" : ""}</span>${dias > 2 ? ` <span class="small-muted">endereços podem estar desatualizados — confira antes de devolver</span>` : ""}`
          : `<span class="adm-tag off">${st.baseErro ? this.h(st.baseErro) : "Buscando a data da última atualização da 8022…"}</span>`);
    };
    pinta();
    if(st.base || st.baseTentou) return;
    st.baseTentou = true;
    const r = await Api.call({ acao:"lanc_base_atualizada", base:"8022" }).catch(e=>({ ok:false, erro:e.message }));
    if(r && r.ok && r.quando) st.base = r; else st.baseErro = (r && r.ok) ? "Sem registro de carga da 8022 em Administração > Bases." : ((r && r.erro) || "Não foi possível consultar a última atualização da 8022.");
    pinta();
  },

  /** etiquetas 50×50 mm, uma por produto, na ordem da rota (texto vetorial = nitidez total na impressora térmica) */
  dvEtiquetas(imprimir){
    const R = this.dvResolver();
    if(!R.validos.length) return toast("Adicione ao menos um código válido.", "error");
    if(typeof window.jspdf === "undefined") return toast("A biblioteca de PDF ainda não carregou. Aguarde um instante e tente de novo.", "error");
    const { jsPDF } = window.jspdf, pdf = new jsPDF({ unit:"mm", format:[50, 50], orientation:"portrait" }), W = 50, M = 2.5, total = R.validos.length;
    R.validos.forEach((v, i)=>{
      if(i > 0) pdf.addPage([50, 50], "portrait");
      pdf.setTextColor(0, 0, 0);
      // topo: ordem na rota
      pdf.setFont("helvetica", "bold"); pdf.setFontSize(8);
      pdf.text(`ROTA ${i+1}/${total}`, M, 5.5);
      pdf.setFont("helvetica", "normal"); pdf.text(`Rua ${v.rua}`, W - M, 5.5, { align:"right" });
      pdf.setLineWidth(0.3); pdf.line(M, 7, W - M, 7);
      // endereço: maior fonte que cabe na largura útil
      let fs = 30; pdf.setFont("helvetica", "bold");
      while(fs > 10){ pdf.setFontSize(fs); if(pdf.getTextWidth(v.end) <= W - 2*M) break; fs -= 1; }
      pdf.text(v.end, W/2, 18, { align:"center" });
      pdf.setLineWidth(0.3); pdf.line(M, 21.5, W - M, 21.5);
      // código do produto
      pdf.setFontSize(18); pdf.setFont("helvetica", "bold");
      pdf.text(String(v.cod), W/2, 30, { align:"center" });
      // descrição (até 3 linhas)
      pdf.setFont("helvetica", "normal");
      let dfs = 9, linhas = [];
      while(dfs >= 6){ pdf.setFontSize(dfs); linhas = pdf.splitTextToSize(String(v.descricao||"").toUpperCase(), W - 2*M); if(linhas.length <= 3) break; dfs -= 0.5; }
      if(linhas.length > 3){ linhas = linhas.slice(0, 3); linhas[2] = linhas[2].replace(/.{0,2}$/, "…"); }
      pdf.text(linhas, W/2, 35, { align:"center", lineHeightFactor:1.15 });
    });
    const nome = `Devolucao_${new Date().toISOString().slice(0,10)}_${total}_etiquetas.pdf`;
    if(imprimir){
      pdf.autoPrint();
      const url = pdf.output("bloburl"), w = window.open(url, "_blank");
      if(!w){ pdf.save(nome); toast("O navegador bloqueou a janela de impressão. O PDF foi baixado — abra e imprima em 50×50 mm.", "error"); }
      else toast(`${total} etiqueta(s) prontas. Na impressão, escolha o papel 50×50 mm e escala 100%.`);
    } else { pdf.save(nome); toast(`${total} etiqueta(s) baixadas (50×50 mm).`); }
  }
});

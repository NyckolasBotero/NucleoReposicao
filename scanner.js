/* =========================================================================
   Núcleo Reposição — Scanner de documentos (foto → "digitalizado")
   Detecta as pontas da folha, corrige a perspectiva (a folha "fecha" em retângulo),
   limpa sombras/fundo como uma impressora multifuncional e gera um PDF.
   Tudo roda no aparelho (nada é enviado antes de você confirmar).
   API: DocScanner.iniciar(file) → Promise<{nome,mime,base64,paginas,preview}|null>
   ========================================================================= */
const DocScanner = {
  MAX_ORIGEM: 2400,   // lado maior da imagem de trabalho
  SAIDA_LONGO: 1754,  // lado maior do resultado (A4 a ~150 dpi)

  /* ---------------- imagem ---------------- */
  async carregarImagem(file){
    try{ return await createImageBitmap(file, { imageOrientation:"from-image" }); }
    catch(e){
      return await new Promise((res, rej)=>{
        const img = new Image();
        img.onload = ()=> res(img); img.onerror = ()=> rej(new Error("Não foi possível abrir a imagem."));
        img.src = URL.createObjectURL(file);
      });
    }
  },
  paraCanvas(img, max){
    const w = img.width || img.naturalWidth, h = img.height || img.naturalHeight;
    const k = Math.min(1, max / Math.max(w, h));
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(w*k)); c.height = Math.max(1, Math.round(h*k));
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return c;
  },

  /* ---------------- detecção das pontas ---------------- */
  _limiarOtsu(hist, total){
    let soma = 0; for(let i=0;i<256;i++) soma += i*hist[i];
    let sB = 0, wB = 0, melhor = 0, limiar = 128;
    for(let t=0;t<256;t++){
      wB += hist[t]; if(!wB) continue;
      const wF = total - wB; if(!wF) break;
      sB += t*hist[t];
      const mB = sB/wB, mF = (soma - sB)/wF, v = wB*wF*(mB-mF)*(mB-mF);
      if(v > melhor){ melhor = v; limiar = t; }
    }
    return limiar;
  },
  _blur(gray, w, h, r){
    // média em caixa (2 passadas separáveis) com soma acumulada
    const tmp = new Float32Array(w*h), out = new Float32Array(w*h);
    for(let y=0;y<h;y++){
      let s = 0; const o = y*w;
      for(let x=-r;x<=r;x++) s += gray[o + Math.min(w-1, Math.max(0,x))];
      for(let x=0;x<w;x++){
        tmp[o+x] = s/(2*r+1);
        s += gray[o + Math.min(w-1, x+r+1)] - gray[o + Math.max(0, x-r)];
      }
    }
    for(let x=0;x<w;x++){
      let s = 0;
      for(let y=-r;y<=r;y++) s += tmp[Math.min(h-1, Math.max(0,y))*w + x];
      for(let y=0;y<h;y++){
        out[y*w+x] = s/(2*r+1);
        s += tmp[Math.min(h-1, y+r+1)*w + x] - tmp[Math.max(0, y-r)*w + x];
      }
    }
    return out;
  },
  _maiorComponente(mask, w, h){
    const rot = new Int32Array(w*h), pilha = new Int32Array(w*h);
    let melhorId = 0, melhorArea = 0, id = 0;
    for(let i=0;i<w*h;i++){
      if(!mask[i] || rot[i]) continue;
      id++; let topo = 0, area = 0; pilha[topo++] = i; rot[i] = id;
      while(topo){
        const p = pilha[--topo]; area++;
        const x = p % w, y = (p / w) | 0;
        if(x>0   && mask[p-1] && !rot[p-1]){ rot[p-1] = id; pilha[topo++] = p-1; }
        if(x<w-1 && mask[p+1] && !rot[p+1]){ rot[p+1] = id; pilha[topo++] = p+1; }
        if(y>0   && mask[p-w] && !rot[p-w]){ rot[p-w] = id; pilha[topo++] = p-w; }
        if(y<h-1 && mask[p+w] && !rot[p+w]){ rot[p+w] = id; pilha[topo++] = p+w; }
      }
      if(area > melhorArea){ melhorArea = area; melhorId = id; }
    }
    return { rot, id: melhorId, area: melhorArea };
  },
  _areaQuad(q){
    let a = 0;
    for(let i=0;i<4;i++){ const p = q[i], n = q[(i+1)%4]; a += p.x*n.y - n.x*p.y; }
    return Math.abs(a)/2;
  },
  /** Devolve as 4 pontas [topo-esq, topo-dir, base-dir, base-esq] em coordenadas do canvas. */
  detectar(canvas){
    const W = canvas.width, H = canvas.height, k = Math.min(1, 360/Math.max(W,H));
    const w = Math.max(8, Math.round(W*k)), h = Math.max(8, Math.round(H*k));
    const pq = document.createElement("canvas"); pq.width = w; pq.height = h;
    pq.getContext("2d").drawImage(canvas, 0, 0, w, h);
    const px = pq.getContext("2d").getImageData(0, 0, w, h).data;
    let gray = new Float32Array(w*h);
    for(let i=0;i<w*h;i++) gray[i] = 0.299*px[i*4] + 0.587*px[i*4+1] + 0.114*px[i*4+2];
    gray = this._blur(this._blur(gray, w, h, 2), w, h, 2);
    const hist = new Float64Array(256);
    for(let i=0;i<w*h;i++) hist[Math.min(255, Math.max(0, Math.round(gray[i])))]++;
    const t = this._limiarOtsu(hist, w*h), N = w*h;

    const tentar = (claro)=>{
      const mask = new Uint8Array(N);
      for(let i=0;i<N;i++) mask[i] = (claro ? gray[i] > t : gray[i] <= t) ? 1 : 0;
      return { mask, comp: this._maiorComponente(mask, w, h) };
    };
    let r = tentar(true);
    if(r.comp.area < 0.12*N || r.comp.area > 0.97*N) r = tentar(false);

    const fallback = ()=>{
      const mx = Math.round(W*0.04), my = Math.round(H*0.04);
      return [{x:mx,y:my},{x:W-mx,y:my},{x:W-mx,y:H-my},{x:mx,y:H-my}];
    };
    if(r.comp.area < 0.12*N || r.comp.area > 0.97*N) return fallback();

    let tl = null, tr = null, br = null, bl = null, sTL = 1e9, sBR = -1e9, dTR = -1e9, dBL = 1e9;
    const rot = r.comp.rot, id = r.comp.id;
    for(let y=0;y<h;y++) for(let x=0;x<w;x++){
      if(rot[y*w+x] !== id) continue;
      const s = x+y, d = x-y;
      if(s < sTL){ sTL = s; tl = {x,y}; }
      if(s > sBR){ sBR = s; br = {x,y}; }
      if(d > dTR){ dTR = d; tr = {x,y}; }
      if(d < dBL){ dBL = d; bl = {x,y}; }
    }
    if(!tl || !tr || !br || !bl) return fallback();
    // as extremas ficam dentro do pixel → empurra meio pixel para fora e volta à escala original
    const q = [tl, tr, br, bl].map(p=>({ x: (p.x + 0.5)/k, y: (p.y + 0.5)/k }));
    if(this._areaQuad(q) < 0.15*W*H) return fallback();
    return q.map(p=>({ x: Math.min(W-1, Math.max(0, p.x)), y: Math.min(H-1, Math.max(0, p.y)) }));
  },

  /* ---------------- perspectiva ---------------- */
  _homografia(dst, src){
    // resolve h tal que (u,v) de dst → (x,y) de src
    const A = [], b = [];
    for(let i=0;i<4;i++){
      const u = dst[i].x, v = dst[i].y, x = src[i].x, y = src[i].y;
      A.push([u, v, 1, 0, 0, 0, -u*x, -v*x]); b.push(x);
      A.push([0, 0, 0, u, v, 1, -u*y, -v*y]); b.push(y);
    }
    for(let i=0;i<8;i++){
      let p = i; for(let j=i+1;j<8;j++) if(Math.abs(A[j][i]) > Math.abs(A[p][i])) p = j;
      [A[i], A[p]] = [A[p], A[i]]; [b[i], b[p]] = [b[p], b[i]];
      const d = A[i][i] || 1e-12;
      for(let j=i+1;j<8;j++){
        const f = A[j][i]/d; if(!f) continue;
        for(let c=i;c<8;c++) A[j][c] -= f*A[i][c];
        b[j] -= f*b[i];
      }
    }
    const h = new Array(8).fill(0);
    for(let i=7;i>=0;i--){
      let s = b[i]; for(let c=i+1;c<8;c++) s -= A[i][c]*h[c];
      h[i] = s/(A[i][i] || 1e-12);
    }
    return h;
  },
  _dist(a, b){ return Math.hypot(a.x-b.x, a.y-b.y); },
  /** Tamanho do resultado: mantém a proporção medida; se estiver perto do A4, "encaixa" no A4. */
  tamanhoSaida(q){
    let w = Math.max(this._dist(q[0],q[1]), this._dist(q[3],q[2]));
    let h = Math.max(this._dist(q[0],q[3]), this._dist(q[1],q[2]));
    const A4 = 297/210, r = Math.max(w,h)/Math.min(w,h);
    if(Math.abs(r - A4)/A4 < 0.12){ if(h >= w) w = h/A4; else h = w/A4; }
    const k = this.SAIDA_LONGO / Math.max(w,h);
    return { w: Math.max(32, Math.round(w*k)), h: Math.max(32, Math.round(h*k)) };
  },
  warp(srcCanvas, q, outW, outH){
    const sw = srcCanvas.width, sh = srcCanvas.height;
    const src = srcCanvas.getContext("2d").getImageData(0, 0, sw, sh).data;
    const H = this._homografia([{x:0,y:0},{x:outW,y:0},{x:outW,y:outH},{x:0,y:outH}], q);
    const out = document.createElement("canvas"); out.width = outW; out.height = outH;
    const ctx = out.getContext("2d"), img = ctx.createImageData(outW, outH), o = img.data;
    for(let v=0; v<outH; v++){
      for(let u=0; u<outW; u++){
        const den = H[6]*u + H[7]*v + 1;
        let x = (H[0]*u + H[1]*v + H[2])/den, y = (H[3]*u + H[4]*v + H[5])/den;
        x = Math.min(sw-1.001, Math.max(0, x)); y = Math.min(sh-1.001, Math.max(0, y));
        const x0 = x|0, y0 = y|0, fx = x-x0, fy = y-y0;
        const i00 = (y0*sw + x0)*4, i10 = i00+4, i01 = i00 + sw*4, i11 = i01+4;
        const p = (v*outW + u)*4;
        for(let c=0;c<3;c++){
          o[p+c] = (src[i00+c]*(1-fx) + src[i10+c]*fx)*(1-fy) + (src[i01+c]*(1-fx) + src[i11+c]*fx)*fy;
        }
        o[p+3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return out;
  },

  /* ---------------- "cara de scanner" ---------------- */
  /** modo: "scanner" (cinza limpo, fundo branco) | "pb" (preto e branco) | "cor" (cores com fundo clareado) | "original" */
  melhorar(canvas, modo){
    if(modo === "original") return canvas;
    const w = canvas.width, h = canvas.height, ctx = canvas.getContext("2d");
    const img = ctx.getImageData(0, 0, w, h), d = img.data, N = w*h;
    const gray = new Float32Array(N);
    for(let i=0;i<N;i++) gray[i] = 0.299*d[i*4] + 0.587*d[i*4+1] + 0.114*d[i*4+2];
    // fundo estimado = média local grande (corrige sombra e iluminação desigual)
    const r = Math.max(10, Math.round(Math.min(w,h)/14));
    const sw = Math.max(8, Math.round(w/4)), shh = Math.max(8, Math.round(h/4));
    const peq = new Float32Array(sw*shh);
    for(let y=0;y<shh;y++) for(let x=0;x<sw;x++) peq[y*sw+x] = gray[Math.min(h-1,y*4)*w + Math.min(w-1,x*4)];
    const bgPeq = this._blur(this._blur(peq, sw, shh, Math.max(2, Math.round(r/4))), sw, shh, Math.max(2, Math.round(r/4)));
    const fundo = (x, y)=>{
      const fx = Math.min(sw-1, x/4), fy = Math.min(shh-1, y/4), x0 = fx|0, y0 = fy|0, x1 = Math.min(sw-1,x0+1), y1 = Math.min(shh-1,y0+1);
      const a = fx-x0, b = fy-y0;
      return (bgPeq[y0*sw+x0]*(1-a) + bgPeq[y0*sw+x1]*a)*(1-b) + (bgPeq[y1*sw+x0]*(1-a) + bgPeq[y1*sw+x1]*a)*b;
    };
    for(let y=0;y<h;y++) for(let x=0;x<w;x++){
      const i = y*w + x, p = i*4;
      const bg = Math.max(40, fundo(x, y)*1.07);
      if(modo === "cor"){
        const f = Math.min(1.6, 238/bg);
        d[p] = Math.min(255, d[p]*f); d[p+1] = Math.min(255, d[p+1]*f); d[p+2] = Math.min(255, d[p+2]*f);
        continue;
      }
      const v = Math.min(1, gray[i]/bg);
      let s;
      if(modo === "pb") s = v < 0.82 ? 0 : 255;
      else { const t = Math.min(1, Math.max(0, (v - 0.5)/0.42)); s = 255*t*t*(3 - 2*t); }
      d[p] = d[p+1] = d[p+2] = s;
    }
    ctx.putImageData(img, 0, 0);
    return canvas;
  },
  girar(canvas){
    const c = document.createElement("canvas"); c.width = canvas.height; c.height = canvas.width;
    const x = c.getContext("2d"); x.translate(c.width, 0); x.rotate(Math.PI/2); x.drawImage(canvas, 0, 0);
    return c;
  },
  clonar(canvas){
    const c = document.createElement("canvas"); c.width = canvas.width; c.height = canvas.height;
    c.getContext("2d").drawImage(canvas, 0, 0); return c;
  },

  /* ---------------- PDF ---------------- */
  async montarAnexo(paginas){
    const J = window.jspdf && window.jspdf.jsPDF;
    const miniatura = (()=>{
      const c = paginas[0], k = 160/Math.max(c.width, c.height), m = document.createElement("canvas");
      m.width = Math.round(c.width*k); m.height = Math.round(c.height*k); m.getContext("2d").drawImage(c, 0, 0, m.width, m.height);
      return m.toDataURL("image/jpeg", 0.7);
    })();
    if(J){
      let doc = null;
      paginas.forEach((cv, i)=>{
        const paisagem = cv.width > cv.height;
        if(i === 0) doc = new J({ orientation: paisagem ? "l" : "p", unit:"mm", format:"a4", compress:true });
        else doc.addPage("a4", paisagem ? "l" : "p");
        const pw = doc.internal.pageSize.getWidth(), ph = doc.internal.pageSize.getHeight();
        const k = Math.min(pw/cv.width, ph/cv.height), w = cv.width*k, h = cv.height*k;
        doc.addImage(cv.toDataURL("image/jpeg", 0.82), "JPEG", (pw-w)/2, (ph-h)/2, w, h, undefined, "FAST");
      });
      const b64 = doc.output("datauristring").split(",")[1];
      return { nome:"feedback_digitalizado.pdf", mime:"application/pdf", base64:b64, paginas:paginas.length, preview:miniatura };
    }
    // sem a biblioteca de PDF: segue com a 1ª página em JPEG
    return { nome:"feedback_digitalizado.jpg", mime:"image/jpeg", base64: paginas[0].toDataURL("image/jpeg", 0.82).split(",")[1], paginas:1, preview:miniatura };
  },

  /* ---------------- tela do scanner ---------------- */
  _css(){
    if(document.getElementById("scan-css")) return;
    const st = document.createElement("style"); st.id = "scan-css";
    st.textContent = `
#scan-overlay{ position:fixed; inset:0; z-index:3000; background:#0b1b33; color:#fff; display:flex; flex-direction:column; }
#scan-overlay .sc-top{ display:flex; align-items:center; gap:10px; padding:calc(10px + env(safe-area-inset-top)) 14px 10px; background:#073A7C; }
#scan-overlay .sc-top h3{ margin:0; font-size:15px; flex:1; }
#scan-overlay .sc-x{ background:rgba(255,255,255,.15); color:#fff; border:0; border-radius:8px; width:38px; height:38px; font-size:20px; cursor:pointer; }
#scan-overlay .sc-stage{ flex:1; min-height:0; display:flex; align-items:center; justify-content:center; padding:10px; position:relative; overflow:hidden; }
#scan-overlay .sc-wrap{ position:relative; touch-action:none; line-height:0; }
#scan-overlay .sc-wrap canvas, #scan-overlay .sc-res{ max-width:100%; display:block; box-shadow:0 4px 24px rgba(0,0,0,.5); background:#fff; }
#scan-overlay .sc-svg{ position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
#scan-overlay .sc-h{ position:absolute; width:34px; height:34px; margin:-17px 0 0 -17px; border-radius:50%; background:rgba(245,166,35,.9); border:3px solid #fff; touch-action:none; cursor:grab; box-shadow:0 2px 8px rgba(0,0,0,.5); }
#scan-overlay .sc-foot{ padding:10px 12px calc(12px + env(safe-area-inset-bottom)); background:#0d2547; display:flex; gap:8px; flex-wrap:wrap; justify-content:center; }
#scan-overlay .sc-foot .btn{ flex:1 1 auto; min-width:120px; justify-content:center; }
#scan-overlay .sc-dica{ font-size:12.5px; color:#cfe3fb; text-align:center; padding:6px 12px 0; }
#scan-overlay .sc-modos{ display:flex; gap:6px; justify-content:center; padding:8px 12px 0; flex-wrap:wrap; }
#scan-overlay .sc-modo{ background:rgba(255,255,255,.12); color:#fff; border:1px solid rgba(255,255,255,.3); border-radius:20px; padding:7px 14px; font-size:13px; cursor:pointer; }
#scan-overlay .sc-modo.on{ background:#F5A623; border-color:#F5A623; color:#1b1b1b; font-weight:700; }
#scan-overlay .sc-load{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(11,27,51,.75); font-size:15px; }
`;
    document.head.appendChild(st);
  },

  /** Abre o scanner com o arquivo (foto) já escolhido. Resolve com o anexo ou null se cancelar. */
  iniciar(file){
    this._css();
    return new Promise((resolve)=>{
      const S = this;
      const paginas = [];
      let origem = null, quad = null, saida = null, modo = "scanner", base = null;
      const ov = document.createElement("div"); ov.id = "scan-overlay";
      ov.innerHTML = `
        <div class="sc-top"><h3 id="sc-titulo">Digitalizar documento</h3><button class="sc-x" id="sc-x" aria-label="Fechar">×</button></div>
        <div class="sc-stage" id="sc-stage"></div>
        <div id="sc-dica" class="sc-dica"></div>
        <div id="sc-modos" class="sc-modos" style="display:none"></div>
        <div class="sc-foot" id="sc-foot"></div>
        <input type="file" id="sc-nova" accept="image/*" capture="environment" style="display:none">`;
      document.body.appendChild(ov);
      const stage = ov.querySelector("#sc-stage"), foot = ov.querySelector("#sc-foot"), dica = ov.querySelector("#sc-dica"), titulo = ov.querySelector("#sc-titulo");
      const modos = ov.querySelector("#sc-modos");
      const fechar = (v)=>{ ov.remove(); resolve(v); };
      ov.querySelector("#sc-x").onclick = ()=>{
        if(paginas.length && !confirm("Descartar as páginas digitalizadas?")) return;
        fechar(null);
      };
      const btn = (txt, cls, fn)=>{ const b = document.createElement("button"); b.type = "button"; b.className = "btn " + cls; b.textContent = txt; b.onclick = fn; foot.appendChild(b); return b; };
      const carregando = (msg)=>{ const d = document.createElement("div"); d.className = "sc-load"; d.textContent = msg; stage.appendChild(d); };

      /* --- passo 1: ajustar as pontas --- */
      const ajustar = ()=>{
        titulo.textContent = "Ajuste as pontas da folha" + (paginas.length ? ` · página ${paginas.length+1}` : "");
        dica.textContent = "Arraste as 4 bolinhas laranja até os cantos do papel.";
        modos.style.display = "none"; foot.innerHTML = ""; stage.innerHTML = "";
        const wrap = document.createElement("div"); wrap.className = "sc-wrap";
        const cv = document.createElement("canvas"); cv.width = origem.width; cv.height = origem.height;
        cv.getContext("2d").drawImage(origem, 0, 0);
        const maxW = stage.clientWidth - 20, maxH = stage.clientHeight - 20;
        const esc = Math.min(maxW/origem.width, maxH/origem.height, 1);
        cv.style.width = Math.round(origem.width*esc) + "px"; cv.style.height = Math.round(origem.height*esc) + "px";
        wrap.appendChild(cv);
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("class", "sc-svg");
        svg.setAttribute("viewBox", `0 0 ${origem.width} ${origem.height}`); svg.setAttribute("preserveAspectRatio", "none");
        const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        poly.setAttribute("fill", "rgba(245,166,35,.15)"); poly.setAttribute("stroke", "#F5A623");
        poly.setAttribute("stroke-width", Math.max(2, origem.width/300)); svg.appendChild(poly); wrap.appendChild(svg);
        const hs = quad.map((p, i)=>{
          const h = document.createElement("div"); h.className = "sc-h"; h.dataset.i = i; wrap.appendChild(h);
          h.addEventListener("pointerdown", (e)=>{
            h.setPointerCapture(e.pointerId); e.preventDefault();
            const mover = (ev)=>{
              const r = cv.getBoundingClientRect();
              quad[i] = { x: Math.min(origem.width, Math.max(0, (ev.clientX - r.left)/r.width*origem.width)),
                          y: Math.min(origem.height, Math.max(0, (ev.clientY - r.top)/r.height*origem.height)) };
              desenhar();
            };
            const fim = ()=>{ h.removeEventListener("pointermove", mover); h.removeEventListener("pointerup", fim); h.removeEventListener("pointercancel", fim); };
            h.addEventListener("pointermove", mover); h.addEventListener("pointerup", fim); h.addEventListener("pointercancel", fim);
          });
          return h;
        });
        const desenhar = ()=>{
          poly.setAttribute("points", quad.map(p=>p.x + "," + p.y).join(" "));
          hs.forEach((h, i)=>{ h.style.left = (quad[i].x/origem.width*100) + "%"; h.style.top = (quad[i].y/origem.height*100) + "%"; });
        };
        desenhar(); stage.appendChild(wrap);
        btn("↻ Detectar de novo", "btn-ghost", ()=>{ quad = S.detectar(origem); desenhar(); });
        btn("Cancelar", "btn-ghost", ()=>{ if(!paginas.length) fechar(null); else resultado(); });
        btn("✂️ Recortar e digitalizar", "btn-primary", ()=>{
          carregando("Digitalizando...");
          setTimeout(()=>{ try{
            const { w, h } = S.tamanhoSaida(quad);
            base = S.warp(origem, quad, w, h); modo = "scanner"; saida = S.melhorar(S.clonar(base), modo); resultado();
          }catch(e){ stage.innerHTML = ""; toast("Não foi possível digitalizar: " + e.message, "error"); ajustar(); } }, 40);
        });
      };

      /* --- passo 2: resultado --- */
      const resultado = ()=>{
        titulo.textContent = "Documento digitalizado" + (paginas.length ? ` · ${paginas.length} página(s) salva(s)` : "");
        dica.textContent = saida ? "Confira a leitura. Se precisar, gire ou refaça os cortes." : "";
        foot.innerHTML = ""; stage.innerHTML = "";
        if(!saida){ // só páginas já salvas (cancelou uma nova página)
          dica.textContent = ""; modos.style.display = "none";
          const t = document.createElement("div"); t.className = "sc-load"; t.style.position = "static"; t.textContent = `${paginas.length} página(s) pronta(s).`; stage.appendChild(t);
          btn("＋ Outra página", "btn-ghost", ()=> ov.querySelector("#sc-nova").click());
          btn("✓ Usar documento", "btn-primary", concluir);
          return;
        }
        const cv = saida; cv.className = "sc-res";
        const maxW = stage.clientWidth - 20, maxH = stage.clientHeight - 20, esc = Math.min(maxW/cv.width, maxH/cv.height, 1);
        cv.style.width = Math.round(cv.width*esc) + "px"; cv.style.height = Math.round(cv.height*esc) + "px";
        stage.appendChild(cv);
        modos.style.display = "flex"; modos.innerHTML = "";
        [["scanner","Scanner"],["pb","Preto e branco"],["cor","Cores"],["original","Original"]].forEach(([id, nome])=>{
          const b = document.createElement("button"); b.type = "button"; b.className = "sc-modo" + (modo===id ? " on" : ""); b.textContent = nome;
          b.onclick = ()=>{ modo = id; saida = S.melhorar(S.clonar(base), id); resultado(); };
          modos.appendChild(b);
        });
        btn("⟳ Girar", "btn-ghost", ()=>{ base = S.girar(base); saida = S.girar(saida); resultado(); });
        btn("✂️ Refazer cortes", "btn-ghost", ()=>{ saida = null; ajustar(); });
        btn("＋ Outra página", "btn-ghost", ()=>{ paginas.push(saida); saida = null; ov.querySelector("#sc-nova").click(); });
        btn("✓ Usar documento", "btn-primary", ()=>{ paginas.push(saida); saida = null; concluir(); });
      };

      const concluir = async ()=>{
        carregando("Gerando o PDF...");
        try{ const anexo = await S.montarAnexo(paginas); fechar(anexo); }
        catch(e){ stage.innerHTML = ""; toast("Falha ao gerar o PDF: " + e.message, "error"); resultado(); }
      };

      const abrirArquivo = async (f)=>{
        carregando("Lendo a foto...");
        try{
          const img = await S.carregarImagem(f);
          origem = S.paraCanvas(img, S.MAX_ORIGEM);
          quad = S.detectar(origem);
          ajustar();
        }catch(e){ toast(e.message, "error"); if(paginas.length){ saida = null; resultado(); } else fechar(null); }
      };
      ov.querySelector("#sc-nova").addEventListener("change", (e)=>{ const f = e.target.files[0]; e.target.value = ""; if(f) abrirArquivo(f); else resultado(); });
      requestAnimationFrame(()=> abrirArquivo(file));
    });
  }
};
window.DocScanner = DocScanner;

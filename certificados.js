/* Núcleo Reposição — Certificados (Lançamentos > Certificados)
   Editor visual de certificado A4 paisagem: modelos de texto por função, layouts, cores, fontes, selo, ícones,
   medalhas laterais, exportação em PNG/PDF e registro (lançamento) de cada certificado emitido. */
const CertUI = {
  W:1123, H:794,
  FONTES:{
    georgia:{ n:"Georgia (clássica)", f:"Georgia, 'Times New Roman', serif" },
    palatino:{ n:"Palatino (elegante)", f:"'Palatino Linotype', Palatino, 'Book Antiqua', serif" },
    garamond:{ n:"Garamond", f:"Garamond, 'Times New Roman', serif" },
    times:{ n:"Times New Roman", f:"'Times New Roman', Times, serif" },
    inter:{ n:"Moderna (Inter / Segoe)", f:"Inter, 'Segoe UI', Roboto, Arial, sans-serif" },
    trebuchet:{ n:"Trebuchet", f:"'Trebuchet MS', Verdana, sans-serif" },
    verdana:{ n:"Verdana", f:"Verdana, Geneva, sans-serif" },
    manuscrita:{ n:"Manuscrita", f:"'Brush Script MT', 'Segoe Script', 'Lucida Handwriting', cursive" },
    impact:{ n:"Impacto (negrito forte)", f:"Impact, 'Arial Black', sans-serif" }
  },
  TEMAS:{
    azul:{ n:"Azul Santa Therezinha", c1:"#2150a8", c2:"#3d6fd6", c3:"#9db8e8", tx:"#1c2b4d", nome:"#14224f", bg:"#ffffff", ac:"#f2b84b" },
    dourado:{ n:"Dourado", c1:"#8a6a1f", c2:"#b8892b", c3:"#e3cd8f", tx:"#3a2f17", nome:"#2b2210", bg:"#fffaf0", ac:"#b8892b" },
    verde:{ n:"Verde", c1:"#14683f", c2:"#1f9a5f", c3:"#a5d8bd", tx:"#173a2a", nome:"#0f2f21", bg:"#ffffff", ac:"#e0b73a" },
    vinho:{ n:"Vinho", c1:"#7a1f3d", c2:"#a8325a", c3:"#e1a9bd", tx:"#3d1424", nome:"#2e0e1b", bg:"#fffafb", ac:"#d9a441" },
    grafite:{ n:"Grafite", c1:"#2b3440", c2:"#4d5d73", c3:"#b4bfce", tx:"#232b36", nome:"#151b23", bg:"#ffffff", ac:"#e6a93a" },
    roxo:{ n:"Roxo", c1:"#4b2a91", c2:"#7a4fd6", c3:"#c9b7f0", tx:"#2a1b4d", nome:"#1d1238", bg:"#ffffff", ac:"#f0b13c" }
  },
  LAYOUTS:{
    classico:{ n:"Clássico (moldura dupla)", borda:"dupla", laterais:"nenhum", logoPos:"marca", alinhar:"center", fonteTitulo:"georgia", fonteNome:"georgia", fonteTexto:"inter" },
    faixas:{ n:"Faixas laterais + medalhas", borda:"faixas", laterais:"medalhas", logoPos:"topo-centro", alinhar:"center", fonteTitulo:"georgia", fonteNome:"georgia", fonteTexto:"inter" },
    moderno:{ n:"Moderno (painel lateral)", borda:"painel", laterais:"nenhum", logoPos:"painel", alinhar:"left", fonteTitulo:"inter", fonteNome:"inter", fonteTexto:"inter" },
    elegante:{ n:"Elegante (cantos ornamentais)", borda:"ornamental", laterais:"louros", logoPos:"marca", alinhar:"center", fonteTitulo:"palatino", fonteNome:"palatino", fonteTexto:"palatino" },
    honra:{ n:"Quadro de honra (medalhas e faixa)", borda:"simples", laterais:"faixa", logoPos:"topo-esq", alinhar:"center", fonteTitulo:"impact", fonteNome:"georgia", fonteTexto:"trebuchet" }
  },
  SELOS:{
    mes:{ n:"Funcionário do mês", rot:"FUNCIONÁRIO DO MÊS", icone:"estrela" },
    semana:{ n:"Destaque da semana", rot:"DESTAQUE DA SEMANA", icone:"raio" },
    trimestre:{ n:"Destaque do trimestre", rot:"DESTAQUE DO TRIMESTRE", icone:"trofeu" },
    semestre:{ n:"Destaque do semestre", rot:"DESTAQUE DO SEMESTRE", icone:"coroa" },
    ano:{ n:"Destaque do ano", rot:"DESTAQUE DO ANO", icone:"trofeu" },
    especial:{ n:"Reconhecimento especial", rot:"RECONHECIMENTO", icone:"medalha" },
    custom:{ n:"Texto personalizado", rot:"", icone:"estrela" }
  },
  ESTILOS_SELO:{ circulo:"Círculo", rosetta:"Rosetta", escudo:"Escudo", hexagono:"Hexágono", fita:"Medalha com fita" },
  ICONES:{
    estrela:["Estrela","M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"],
    trofeu:["Troféu","M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"],
    coroa:["Coroa","M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"],
    medalha:["Medalha","M12 1a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm-3.5 15.5L6 23l6-2.5 6 2.5-2.5-6.5A9 9 0 0 1 12 17a9 9 0 0 1-3.5-.5z"],
    escudo:["Escudo","M12 2L4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3zm-1 14l-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7z"],
    raio:["Raio","M13 2L4 14h6l-1 8 9-12h-6z"],
    foguete:["Foguete","M12 2c3 2 5 5.5 5 9.5 0 1.5-.3 3-.8 4.3L14 18h-4l-2.2-2.2A12 12 0 0 1 7 11.5C7 7.5 9 4 12 2zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7.5 17.5L5 22l4.5-1.5zm9 0L19 22l-4.5-1.5z"],
    coracao:["Coração","M12 21l-1.5-1.3C5.4 15.4 2 12.3 2 8.5 2 5.4 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2.1C13.1 3.8 14.8 3 16.5 3 19.6 3 22 5.4 22 8.5c0 3.8-3.4 6.9-8.5 11.2L12 21z"],
    check:["Aprovado","M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 15l-5-5 1.4-1.4L10 14.2l7.6-7.6L19 8l-9 9z"],
    diamante:["Diamante","M6 3h12l4 6-10 12L2 9z"],
    alvo:["Alvo (meta)","M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-14a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"],
    joia:["Joinha","M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.3l1-4.6v-.3c0-.4-.2-.8-.4-1.1L14.2 1 7.6 7.6C7.2 8 7 8.5 7 9v10c0 1.1.9 2 2 2h9c.8 0 1.5-.5 1.8-1.2l3-7c.1-.3.2-.5.2-.8v-2z"],
    chama:["Chama","M13.5.7s.7 3.4-1.8 6.3C9.3 9.800 7 11.500 7 15a5 5 0 0 0 10 0c0-2-1-3.500-2-4.500 0 1.500-1 2.500-2 2.500 1-3 1.500-6.500.5-12.300z"],
    grafico:["Crescimento","M3 3v18h18v-2H5V3H3zm4 10h3v5H7zm5-4h3v9h-3zm5-3h3v12h-3z"]
  },
  PADRAO:{
    layout:"classico", tema:"azul",
    cores:{ c1:"#2150a8", c2:"#3d6fd6", c3:"#9db8e8", tx:"#1c2b4d", nome:"#14224f", bg:"#ffffff", ac:"#f2b84b" },
    empresa1:"SANTA THEREZINHA ATACADISTA", empresa2:"CENTRO DE DISTRIBUIÇÃO · LOGÍSTICA",
    topo:"CERTIFICADO DE", destaque:"Excelência", certificamos:"Certificamos que", nome:"Nome do colaborador", texto:"",
    fonteTitulo:"georgia", fonteNome:"georgia", fonteTexto:"inter", tamDest:100, tamNome:68, tamTexto:20, espLetras:6,
    alinhar:"center", borda:"dupla",
    logoPos:"marca", logoTam:55, logoOp:9, logoImg:"padrao", logoData:"",
    selo:{ tipo:"ano", periodo:"", texto:"", estilo:"circulo", icone:"estrela", c1:"#2150a8", c2:"#9db8e8" },
    ordem:"dsa",
    laterais:{ estilo:"nenhum", icone:"medalha", qtd:2, cor:"#2150a8" },
    assinante:"Fábio Nyckolas Figueiredo Botero", cargoAssin:"ENCARREGADO DE LOGÍSTICA", local:"Ceilândia – DF", data:"", dataBranco:true
  },
  ORDENS:{ dsa:"Data · Selo · Assinatura", asd:"Assinatura · Selo · Data", sda:"Selo · Data · Assinatura", ads:"Assinatura · Data · Selo", das:"Data · Assinatura · Selo", sad:"Selo · Assinatura · Data" },

  /* ------------------------------ util ------------------------------ */
  h(s){ return typeof escapeHtml === "function" ? escapeHtml(s) : String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); },
  clone(o){ return JSON.parse(JSON.stringify(o)); },
  get(p){ return p.split(".").reduce((o,k)=> o == null ? o : o[k], this.cfg); },
  set(p, v){ const ks = p.split("."), u = ks.pop(); const o = ks.reduce((a,k)=> a[k], this.cfg); o[u] = v; },
  periodoAuto(tipo){
    const d = new Date(), M = ["JANEIRO","FEVEREIRO","MARÇO","ABRIL","MAIO","JUNHO","JULHO","AGOSTO","SETEMBRO","OUTUBRO","NOVEMBRO","DEZEMBRO"], a = d.getFullYear();
    if(tipo === "mes") return M[d.getMonth()] + " " + a;
    if(tipo === "trimestre") return (Math.floor(d.getMonth()/3)+1) + "º TRIMESTRE " + a;
    if(tipo === "semestre") return (d.getMonth() < 6 ? 1 : 2) + "º SEMESTRE " + a;
    if(tipo === "semana"){ const s = new Date(d); s.setDate(d.getDate() - ((d.getDay()+6)%7)); return "SEMANA DE " + String(s.getDate()).padStart(2,"0") + "/" + String(s.getMonth()+1).padStart(2,"0"); }
    return String(a);
  },
  dataExtenso(iso){
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso||""); if(!m) return "";
    const M = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
    return `${Number(m[3])} de ${M[Number(m[2])-1]} de ${m[1]}`;
  },
  grupoDoCargo(cargo){
    const n = String(cargo||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toUpperCase();
    if(/RECUPER/.test(n)) return "recuperacao";
    if(/AUXILIAR|LIDER|AUDITOR|SUPERVIS|COORDEN|GESTOR|ENCARREG/.test(n)) return "auxiliar";
    return "repositor";
  },
  rich(t){ return this.h(t).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").split(/\n+/).map(p=>`<p>${p}</p>`).join(""); },

  /* ------------------------------ ícones / selo ------------------------------ */
  ico(nome, cor, tam, extra){ const i = this.ICONES[nome] || this.ICONES.estrela; return `<svg viewBox="0 0 24 24" width="${tam}" height="${tam}" fill="${cor}" fill-rule="evenodd" ${extra||""}><path d="${i[1]}"/></svg>`; },
  /** selo circular/escudo etc. em SVG 200x200 */
  selo(s, c, id){
    const rot = s.tipo === "custom" ? (s.texto || "") : (this.SELOS[s.tipo] || this.SELOS.especial).rot, per = s.periodo || "";
    const a = s.c1, b = s.c2, est = s.estilo;
    let base = "";
    if(est === "rosetta"){ let pts = []; for(let i=0;i<48;i++){ const r = i%2 ? 88 : 98, an = i*Math.PI/24; pts.push((100+r*Math.sin(an)).toFixed(1)+","+(100-r*Math.cos(an)).toFixed(1)); } base = `<polygon points="${pts.join(" ")}" fill="${a}"/><circle cx="100" cy="100" r="74" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="3 4" opacity=".85"/>`; }
    else if(est === "escudo") base = `<path d="M100 6L178 32V100C178 148 142 180 100 196 58 180 22 148 22 100V32Z" fill="${a}"/><path d="M100 18L166 40V100C166 140 136 168 100 182 64 168 34 140 34 100V40Z" fill="none" stroke="${b}" stroke-width="2" stroke-dasharray="3 4"/>`;
    else if(est === "hexagono") base = `<polygon points="100,6 182,53 182,147 100,194 18,147 18,53" fill="${a}"/><polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill="none" stroke="${b}" stroke-width="2" stroke-dasharray="3 4"/>`;
    else if(est === "fita") base = `<path d="M62 120L44 196l32-16 20 18 8-70z" fill="${b}"/><path d="M138 120l18 76-32-16-20 18-8-70z" fill="${b}"/><circle cx="100" cy="90" r="78" fill="${b}" opacity=".55"/><circle cx="100" cy="90" r="68" fill="${a}"/><circle cx="100" cy="90" r="60" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="3 4" opacity=".85"/>`;
    else base = `<circle cx="100" cy="100" r="96" fill="none" stroke="${b}" stroke-width="3"/><circle cx="100" cy="100" r="82" fill="${a}"/><circle cx="100" cy="100" r="75" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="3 4" opacity=".85"/>`;
    const cy = est === "fita" ? 90 : 100, arcos = est === "circulo" || est === "rosetta";
    let txt = "";
    const fs = Math.max(8, Math.min(13, 170 / (Math.max(rot.length,1)*0.78)));
    if(arcos){
      txt = `<defs><path id="${id}t" d="M 36 100 A 64 64 0 0 1 164 100"/><path id="${id}b" d="M 29 100 A 71 71 0 0 0 171 100"/></defs>
        <text font-size="${fs.toFixed(1)}" font-weight="700" fill="#fff" letter-spacing="1" text-anchor="middle"><textPath href="#${id}t" startOffset="50%">${this.h(rot)}</textPath></text>
        <text font-size="14" font-weight="800" fill="#fff" letter-spacing="1.5" text-anchor="middle"><textPath href="#${id}b" startOffset="50%">${this.h(per)}</textPath></text>`;
    } else {
      const partes = rot.length > 18 ? (()=>{ const k = rot.lastIndexOf(" ", Math.ceil(rot.length/2)+3); return k > 0 ? [rot.slice(0,k), rot.slice(k+1)] : [rot]; })() : [rot];
      const tl = (t, y, fz, max)=>{ const nat = t.length * fz * 0.78; return `<text x="100" y="${y}" font-size="${fz}" font-weight="700" fill="#fff" letter-spacing=".8" text-anchor="middle" ${nat > max ? `textLength="${max}" lengthAdjust="spacingAndGlyphs"` : ""}>${this.h(t)}</text>`; };
      txt = partes.map((t,i)=> tl(t, cy - 40 + i*12, 10, 98)).join("") + tl(per, cy + 48, 11.5, 82).replace('font-weight="700"','font-weight="800"');
    }
    const ic = this.ICONES[s.icone] || this.ICONES.estrela;
    const tam = arcos ? 62 : 50, y = cy - tam/2 + (arcos ? -2 : 0);
    return `<svg viewBox="0 0 200 200" class="ctx-selo-svg" xmlns="http://www.w3.org/2000/svg">${base}${txt}<svg x="${100-tam/2}" y="${y}" width="${tam}" height="${tam}" viewBox="0 0 24 24"><path d="${ic[1]}" fill="#fff" fill-rule="evenodd"/></svg></svg>`;
  },
  /** medalha lateral: disco + ícone + fita */
  medalhaLat(icone, cor, tam, corIc){
    return `<svg viewBox="0 0 80 110" width="${tam}" height="${tam*1.375}" xmlns="http://www.w3.org/2000/svg"><path d="M22 0h14l10 40H32z" fill="${cor}" opacity=".85"/><path d="M58 0H44L34 40h14z" fill="${cor}" opacity=".6"/><circle cx="40" cy="70" r="32" fill="${cor}"/><circle cx="40" cy="70" r="26" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="2.5 3" opacity=".9"/><svg x="22" y="52" width="36" height="36" viewBox="0 0 24 24"><path d="${(this.ICONES[icone]||this.ICONES.medalha)[1]}" fill="${corIc||"#fff"}" fill-rule="evenodd"/></svg></svg>`;
  },
  louro(cor, lado){
    let f = ""; for(let i=0;i<9;i++){ const y = 20 + i*36, x = 12 + Math.sin(i/8*Math.PI)*14; f += `<ellipse cx="${(x+16).toFixed(1)}" cy="${y}" rx="15" ry="6.5" transform="rotate(${-38+i*4} ${(x+16).toFixed(1)} ${y})" fill="${cor}"/><ellipse cx="${(x-6).toFixed(1)}" cy="${y+12}" rx="13" ry="5.5" transform="rotate(${36-i*3} ${(x-6).toFixed(1)} ${y+12})" fill="${cor}" opacity=".75"/>`; }
    return `<svg viewBox="-12 0 94 360" width="94" height="360" style="${lado === "d" ? "transform:scaleX(-1)" : ""}" xmlns="http://www.w3.org/2000/svg"><path d="M30 350C6 270 6 90 34 6" fill="none" stroke="${cor}" stroke-width="3" stroke-linecap="round"/>${f}</svg>`;
  },
  canto(cor, rot){
    return `<svg viewBox="0 0 120 120" width="120" height="120" style="transform:rotate(${rot}deg)" xmlns="http://www.w3.org/2000/svg"><path d="M6 114V30C6 16 16 6 30 6h84" fill="none" stroke="${cor}" stroke-width="3"/><path d="M18 114V36c0-10 8-18 18-18h78" fill="none" stroke="${cor}" stroke-width="1.2"/><path d="M6 6c20 0 30 10 30 30" fill="none" stroke="${cor}" stroke-width="2"/><circle cx="36" cy="36" r="4.5" fill="${cor}"/><path d="M48 6c0 8 6 14 14 14M6 48c8 0 14 6 14 14" fill="none" stroke="${cor}" stroke-width="1.6"/></svg>`;
  },

  /* ------------------------------ o certificado ------------------------------ */
  css(){
    if(document.getElementById("ctx-css")) return;
    const s = document.createElement("style"); s.id = "ctx-css";
    s.textContent = `
.ctx{ position:relative; width:1123px; height:794px; overflow:hidden; box-sizing:border-box; background:var(--bg); color:var(--tx); }
.ctx *{ box-sizing:border-box; }
.ctx-abs{ position:absolute; }
.ctx-corpo{ position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; padding:var(--pt) var(--px) var(--pb); text-align:var(--al); }
.ctx[data-al="left"] .ctx-corpo{ align-items:flex-start; }
.ctx-emp{ display:flex; align-items:center; gap:22px; font-family:var(--ft); }
.ctx-emp i{ display:block; width:116px; height:2px; background:var(--c3); } .ctx[data-al="left"] .ctx-emp i, .ctx[data-lp="topo-esq"] .ctx-emp i, .ctx[data-lp="topo-dir"] .ctx-emp i{ display:none; }
.ctx-emp b{ display:block; font-size:19px; letter-spacing:.34em; font-weight:800; color:var(--c1); text-transform:uppercase; }
.ctx-emp2{ margin-top:8px; font-size:15px; letter-spacing:.22em; color:var(--c1); opacity:.7; text-transform:uppercase; font-family:var(--ft); }
.ctx-topo{ margin-top:20px; font-size:22px; letter-spacing:var(--esp); font-weight:800; color:var(--c1); text-transform:uppercase; font-family:var(--ft); }
.ctx-dest{ margin-top:-2px; line-height:1.02; font-weight:600; color:var(--c2); letter-spacing:-.02em; font-family:var(--ft); white-space:nowrap; }
.ctx-div{ display:flex; align-items:center; gap:14px; margin:12px 0 14px; } .ctx[data-al="left"] .ctx-div{ margin-left:0; }
.ctx-div i{ width:110px; height:2px; background:var(--c3); } .ctx-div u{ width:14px; height:14px; background:var(--c3); transform:rotate(45deg); }
.ctx-cert{ font-size:19px; letter-spacing:.08em; color:var(--c1); opacity:.72; font-family:var(--fx); }
.ctx-nome{ margin-top:2px; padding:0 40px 6px; font-weight:600; color:var(--cn); line-height:1.1; font-family:var(--fn); border-bottom:2px solid var(--c3); white-space:nowrap; max-width:100%; }
.ctx-txt{ margin-top:14px; font-size:var(--tt); line-height:1.5; max-width:var(--mw); font-family:var(--fx); color:var(--tx); } .ctx-txt p{ margin:0 0 4px; } .ctx-txt b{ color:var(--c1); font-weight:800; }
.ctx-rod{ margin-top:auto; width:100%; display:grid; grid-template-columns:minmax(0,1fr) auto minmax(0,1fr); align-items:end; gap:20px; }
.ctx-rod>div{ display:flex; flex-direction:column; align-items:center; } .ctx[data-lp="painel"] .ctx-rod{ gap:8px; } .ctx[data-lp="painel"] .ctx-dt{ font-size:13px; } .ctx[data-lp="painel"] .ctx-as b{ font-size:15px; } .ctx[data-lp="painel"] .ctx-lb{ letter-spacing:.1em; font-size:11px; } .ctx[data-lp="painel"] .ctx-rod .ctx-sel{ width:128px; height:128px; }
.ctx-rod .ctx-sel{ width:150px; height:150px; margin-bottom:-4px; } .ctx-selo-svg{ width:100%; height:100%; display:block; }
.ctx-dt{ font-size:17px; white-space:nowrap; padding:0 8px 4px; border-bottom:2px solid var(--c1); width:100%; text-align:center; font-family:var(--fx); color:var(--tx); } .ctx-lb{ margin-top:8px; font-size:14px; letter-spacing:.2em; color:var(--c1); opacity:.7; text-transform:uppercase; font-family:var(--fx); }
.ctx-as{ width:100%; display:flex; flex-direction:column; align-items:center; } .ctx-as hr{ width:100%; border:0; border-top:2px solid var(--c1); margin:0 0 10px; } .ctx-as b{ font-size:19px; color:var(--cn); font-family:var(--fx); font-weight:800; }
.ctx-sw{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); pointer-events:none; }
.ctx-sw img{ display:block; }
`;
    document.head.appendChild(s);
  },
  logoSrc(c, escuro){ return c.logoImg === "custom" && c.logoData ? c.logoData : (escuro ? "logo-branco.png" : "logo.png"); },
  stage(c){
    const F = this.FONTES, cs = c.cores, painel = c.borda === "painel", faixas = c.borda === "faixas";
    const lat = c.laterais, temLat = lat.estilo !== "nenhum";
    const px = painel ? 60 : (temLat ? 150 : 100), larg = painel ? 700 : 840;
    let deco = "";
    if(c.borda === "dupla") deco = `<div class="ctx-abs" style="left:0;right:0;top:0;height:18px;background:${cs.c1}"></div><div class="ctx-abs" style="left:0;right:0;bottom:0;height:18px;background:${cs.c1}"></div><div class="ctx-abs" style="inset:38px;border:5px solid ${cs.c1}"></div><div class="ctx-abs" style="inset:58px;border:2px solid ${cs.c3}"></div>`;
    else if(c.borda === "simples") deco = `<div class="ctx-abs" style="inset:30px;border:4px solid ${cs.c1}"></div><div class="ctx-abs" style="inset:42px;border:1.5px solid ${cs.c3}"></div>`;
    else if(faixas) deco = `<div class="ctx-abs" style="left:0;top:0;bottom:0;width:104px;background:linear-gradient(180deg,${cs.c1},${cs.c2})"></div><div class="ctx-abs" style="right:0;top:0;bottom:0;width:104px;background:linear-gradient(180deg,${cs.c1},${cs.c2})"></div><div class="ctx-abs" style="left:104px;top:0;bottom:0;width:6px;background:${cs.ac}"></div><div class="ctx-abs" style="right:104px;top:0;bottom:0;width:6px;background:${cs.ac}"></div><div class="ctx-abs" style="inset:26px 134px;border:1.5px solid ${cs.c3}"></div>`;
    else if(painel) deco = `<div class="ctx-abs" style="left:0;top:0;bottom:0;width:300px;background:linear-gradient(170deg,${cs.c1},${cs.c2})"></div><div class="ctx-abs" style="left:300px;top:0;bottom:0;width:8px;background:${cs.ac}"></div><div class="ctx-abs" style="left:344px;right:44px;top:44px;bottom:44px;border:1.5px solid ${cs.c3}"></div>`;
    else if(c.borda === "ornamental") deco = `<div class="ctx-abs" style="inset:26px;border:3px solid ${cs.ac}"></div><div class="ctx-abs" style="inset:38px;border:1px solid ${cs.ac}"></div><div class="ctx-abs" style="left:20px;top:20px">${this.canto(cs.ac,0)}</div><div class="ctx-abs" style="right:20px;top:20px">${this.canto(cs.ac,90)}</div><div class="ctx-abs" style="right:20px;bottom:20px">${this.canto(cs.ac,180)}</div><div class="ctx-abs" style="left:20px;bottom:20px">${this.canto(cs.ac,270)}</div>`;
    // laterais (medalhas, louros, faixa)
    let lados = "";
    if(temLat){
      const x1 = faixas ? 14 : (c.borda === "dupla" ? 70 : 54), cor = lat.cor;
      const lado = (esq)=>{
        const pos = esq ? `left:${x1}px` : `right:${x1}px`;
        if(lat.estilo === "medalhas"){ const q = Math.max(1, Math.min(3, Number(lat.qtd)||2)); let m = ""; for(let i=0;i<q;i++) m += `<div style="margin:${i ? 22 : 0}px 0 0">${this.medalhaLat(i===0 ? lat.icone : (i===1 ? "estrela" : "coroa"), faixas ? "#fff" : cor, 72, faixas ? cs.c1 : "#fff")}</div>`; return `<div class="ctx-abs" style="${pos};top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;align-items:center;width:${faixas ? 76 : 72}px">${m}</div>`; }
        if(lat.estilo === "louros") return `<div class="ctx-abs" style="${esq ? "left:" : "right:"}${(c.borda === "ornamental" ? 56 : x1)}px;top:217px">${this.louro(cor, esq ? "e" : "d")}</div>`;
        const n = 7; let st = ""; for(let i=0;i<n;i++) st += this.ico(lat.icone === "medalha" ? "estrela" : lat.icone, cs.ac, 26, 'style="margin:14px 0"'); return `<div class="ctx-abs" style="${esq ? "left:" : "right:"}${c.borda === "dupla" ? 66 : 32}px;top:0;bottom:0;width:52px;display:flex;flex-direction:column;justify-content:center;align-items:center;background:${cor};opacity:.95">${st}</div>`;
      };
      lados = lado(true) + lado(false);
    }
    // logo
    let logo = ""; const lg = Number(c.logoTam)||55, escuro = painel;
    if(c.logoPos === "marca") logo = `<div class="ctx-sw" style="opacity:${(Number(c.logoOp)||9)/100}"><img src="${this.logoSrc(c,false)}" style="width:${lg*9}px" alt=""></div>`;
    else if(c.logoPos === "painel" && painel) logo = `<div class="ctx-abs" style="left:0;top:50px;width:300px;display:flex;justify-content:center"><img src="${this.logoSrc(c,true)}" style="width:${Math.min(240, lg*4.2)}px" alt=""></div>`;
    else if(c.logoPos === "topo-esq") logo = `<div class="ctx-abs" style="left:${temLat||faixas ? 130 : 84}px;top:${faixas ? 30 : 30}px"><img src="${this.logoSrc(c,false)}" style="width:${lg*1.7}px" alt=""></div>`;
    else if(c.logoPos === "topo-dir") logo = `<div class="ctx-abs" style="right:${temLat||faixas ? 130 : 84}px;top:${faixas ? 30 : 30}px"><img src="${this.logoSrc(c,false)}" style="width:${lg*1.7}px" alt=""></div>`;
    else if(c.logoPos === "rodape") logo = `<div class="ctx-abs" style="left:0;right:0;bottom:34px;display:flex;justify-content:center"><img src="${this.logoSrc(c,false)}" style="width:${lg*2}px" alt=""></div>`;
    const logoTopoC = c.logoPos === "topo-centro" ? `<img src="${this.logoSrc(c,false)}" style="width:${lg*2.2}px;margin:-6px 0 8px" alt="">` : "";
    const painelLogoOutro = painel && c.logoPos !== "painel" ? "" : "";
    // rodapé
    const dt = c.dataBranco || !c.data ? `${this.h(c.local)}, ___ de _______ de ${new Date().getFullYear()}` : `${this.h(c.local)}, ${this.h(this.dataExtenso(c.data))}`;
    const blocos = {
      d:`<div><div class="ctx-dt">${dt}</div><div class="ctx-lb">Local e data</div></div>`,
      s:`<div class="ctx-sel">${this.selo(c.selo, cs, "sl")}</div>`,
      a:`<div class="ctx-as"><hr><b>${this.h(c.assinante)}</b><div class="ctx-lb" style="margin-top:2px">${this.h(c.cargoAssin)}</div></div>`
    };
    const ord = String(c.ordem||"dsa").split("");
    const rod = `<div class="ctx-rod" style="${painel ? "" : ""}">${ord.map(k=>blocos[k]).join("")}</div>`;
    const emp = `<div class="ctx-emp"><i></i><b>${this.h(c.empresa1)}</b><i></i></div>${c.empresa2 ? `<div class="ctx-emp2">${this.h(c.empresa2)}</div>` : ""}`;
    const paddingTop = painel ? 56 : (c.borda === "dupla" ? 78 : (c.borda === "simples" || c.borda === "ornamental" ? 64 : 50));
    const style = `--bg:${cs.bg};--tx:${cs.tx};--c1:${cs.c1};--c2:${cs.c2};--c3:${cs.c3};--cn:${cs.nome};--ac:${cs.ac};--ft:${F[c.fonteTitulo].f};--fn:${F[c.fonteNome].f};--fx:${F[c.fonteTexto].f};--tt:${c.tamTexto}px;--esp:${c.espLetras*0.07}em;--al:${c.alinhar};--pt:${paddingTop}px;--pb:${painel ? 56 : (c.borda === "dupla" ? 82 : (c.borda === "simples" || c.borda === "ornamental" ? 66 : 46))}px;--px:${px}px;--mw:${larg}px;${painel ? "padding-left:0;" : ""}`;
    const corpoStyle = painel ? `left:340px;right:50px;padding-left:20px;padding-right:20px;` : "";
    return `<div class="ctx" data-al="${c.alinhar}" data-lp="${c.logoPos}" data-mw="${painel ? 650 : 1123 - 2*px - 30}" style="${style}">${deco}${lados}${logo}
      <div class="ctx-corpo" style="${corpoStyle}">${logoTopoC}${emp}<div class="ctx-topo">${this.h(c.topo)}</div>
        <div class="ctx-dest" style="font-size:${c.tamDest}px">${this.h(c.destaque)}</div>
        <div class="ctx-div"><i></i><u></u><i></i></div>
        <div class="ctx-cert">${this.h(c.certificamos)}</div>
        <div class="ctx-nome" style="font-size:${c.tamNome}px">${this.h(c.nome)}</div>
        <div class="ctx-txt">${this.rich(c.texto)}</div>${rod}</div></div>`;
  },
  /** nome/destaque longos e texto grande demais: reduz sozinho até tudo caber no certificado */
  ajustar(){
    const st = this.box && this.box.querySelector(".ctx"); if(!st) return;
    const n = st.querySelector(".ctx-nome"), d = st.querySelector(".ctx-dest"), t = st.querySelector(".ctx-txt"), corpo = st.querySelector(".ctx-corpo");
    const maxW = Number(st.dataset.mw) || 860;
    let tn = this.cfg.tamNome, td = this.cfg.tamDest, tt = this.cfg.tamTexto;
    const w = ()=>{ n.style.fontSize = tn + "px"; d.style.fontSize = td + "px"; st.style.setProperty("--tt", tt + "px"); };
    w(); let guard = 0;
    while((n.scrollWidth > maxW || d.scrollWidth > maxW) && guard++ < 40){ if(n.scrollWidth > maxW && tn > 28) tn -= 2; if(d.scrollWidth > maxW && td > 40) td -= 3; w(); }
    guard = 0;
    while(corpo.scrollHeight > corpo.clientHeight + 1 && guard++ < 30){ if(tt > 15) tt -= 1; else if(td > 60) td -= 4; else if(tn > 44) tn -= 3; else break; w(); }
  },

  /* ------------------------------ editor ------------------------------ */
  ctl(tipo, path, rot, o){
    o = o || {}; const v = this.get(path), id = "ct-" + path.replace(/\./g,"-");
    if(tipo === "text") return `<label class="ct-f"><span>${rot}</span><input type="text" data-k="${path}" id="${id}" value="${this.h(v)}"${o.ph ? ` placeholder="${this.h(o.ph)}"` : ""}></label>`;
    if(tipo === "area") return `<label class="ct-f"><span>${rot}</span><textarea data-k="${path}" id="${id}" rows="${o.rows||6}">${this.h(v)}</textarea></label>`;
    if(tipo === "date") return `<label class="ct-f"><span>${rot}</span><input type="date" data-k="${path}" id="${id}" value="${this.h(v)}"></label>`;
    if(tipo === "color") return `<label class="ct-f ct-cor"><span>${rot}</span><input type="color" data-k="${path}" id="${id}" value="${this.h(v)}"></label>`;
    if(tipo === "range") return `<label class="ct-f"><span>${rot}: <b>${v}</b>${o.un||""}</span><input type="range" data-k="${path}" id="${id}" min="${o.min}" max="${o.max}" step="${o.step||1}" value="${v}"></label>`;
    if(tipo === "check") return `<label class="ct-f ct-chk"><input type="checkbox" data-k="${path}" id="${id}"${v ? " checked" : ""}><span>${rot}</span></label>`;
    if(tipo === "select"){ const op = o.opts; return `<label class="ct-f"><span>${rot}</span><select data-k="${path}" id="${id}">${Object.keys(op).map(k=>`<option value="${k}"${String(v)===k ? " selected" : ""}>${this.h(typeof op[k] === "string" ? op[k] : op[k].n)}</option>`).join("")}</select></label>`; }
    if(tipo === "icons") return `<div class="ct-f"><span>${rot}</span><div class="ct-ics" data-ic="${path}">${Object.keys(this.ICONES).map(k=>`<button type="button" class="${v === k ? "on" : ""}" data-v="${k}" title="${this.ICONES[k][0]}">${this.ico(k,"currentColor",22)}</button>`).join("")}</div></div>`;
    return "";
  },
  grupo(titulo, corpo, aberto){ return `<details class="ct-g"${aberto ? " open" : ""}><summary>${titulo}</summary><div class="ct-gb">${corpo}</div></details>`; },
  async render(pane){
    this.css(); this.pane = pane;
    if(!this.cfg){ this.cfg = this.clone(this.PADRAO); this.cfg.selo.periodo = this.periodoAuto(this.cfg.selo.tipo); this.cfg.texto = this.textoDe("auxiliar", "a-ret"); this.cfg.nome = "Nome do colaborador"; this.pessoa = null; this.grupo_ = "auxiliar"; this.modeloId = "a-ret"; }
    pane.innerHTML = `<div class="panel"><div class="adm-head"><h3 class="adm-h2" style="margin:0">Certificados</h3><div class="adm-head-r"><span class="small-muted" id="ct-aviso"></span></div></div>
      <p class="small-muted">Escolha o colaborador, o modelo de texto e ajuste o visual. O que você vê abaixo é exatamente o que será baixado.</p>
      <div class="ct-wrap"><div class="ct-ed" id="ct-ed"></div><div class="ct-pv"><div class="ct-pvbox" id="ct-box"><div class="ct-esc" id="ct-esc"></div></div>
        <div class="ct-acoes"><button type="button" class="btn btn-outline" id="ct-png">${Icons.svg("image",16)} Baixar PNG</button><button type="button" class="btn btn-outline" id="ct-pdf">${Icons.svg("download",16)} Baixar PDF</button><button type="button" class="btn btn-primary" id="ct-lancar">${Icons.svg("check",16)} Lançar certificado</button></div>
        <div id="ct-msg"></div></div></div>
      <h4 class="adm-h" style="margin:22px 0 6px">Certificados já lançados</h4><div id="ct-hist" class="table-wrap"><p class="small-muted">Carregando...</p></div></div>`;
    this.box = document.getElementById("ct-esc");
    this.desenharEditor(); this.pintar();
    const ro = window.ResizeObserver ? new ResizeObserver(()=> this.escala()) : null; if(ro) ro.observe(document.getElementById("ct-box")); window.addEventListener("resize", ()=> this.escala());
    document.getElementById("ct-png").addEventListener("click", ()=> this.baixar("png"));
    document.getElementById("ct-pdf").addEventListener("click", ()=> this.baixar("pdf"));
    document.getElementById("ct-lancar").addEventListener("click", ()=> this.lancar());
    this.carregarPessoas(); this.carregarHist();
  },
  textoDe(grupo, id){
    const g = CERT_MODELOS[grupo]; const m = g && (g.modelos.find(x=>x.id === id) || g.modelos[0]); if(!m) return "";
    return m.texto.replace(/\{ano\}/g, String(new Date().getFullYear()));
  },
  aplicarModelo(){
    const g = CERT_MODELOS[this.grupo_], m = g.modelos.find(x=>x.id === this.modeloId) || g.modelos[0]; if(!m) return;
    this.cfg.texto = this.textoDe(this.grupo_, m.id); this.cfg.destaque = m.destaque; this.cfg.selo.tipo = m.selo; this.cfg.selo.icone = this.SELOS[m.selo].icone; this.cfg.selo.periodo = this.periodoAuto(m.selo);
  },
  desenharEditor(){
    const c = this.cfg, C = (t,p,r,o)=> this.ctl(t,p,r,o);
    const modelos = CERT_MODELOS[this.grupo_].modelos, ops = {}; modelos.forEach(m=> ops[m.id] = m.nome);
    const grupos = {}; Object.keys(CERT_MODELOS).forEach(k=> grupos[k] = CERT_MODELOS[k].nome);
    const dl = (this.pessoas||[]).filter(p=>p.ativo).map(p=>`<option value="${this.h(p.mat + " — " + p.nome)}"></option>`).join("");
    const p = this.pessoa;
    const g1 = `<label class="ct-f"><span>Colaborador do quadro (digite matrícula ou nome)</span><input type="text" id="ct-pessoa" list="ct-dl" autocomplete="off" placeholder="Selecione..." value="${p ? this.h(p.mat + " — " + p.nome) : ""}"><datalist id="ct-dl">${dl}</datalist></label>
      <div class="small-muted" id="ct-cargo">${p ? `Cargo: <strong>${this.h(p.cargo || "não informado")}</strong> · modelos de <strong>${this.h(CERT_MODELOS[this.grupo_].nome)}</strong>` : "Ao escolher a pessoa, o modelo da função dela é selecionado."}</div>
      <label class="ct-f"><span>Grupo de modelos</span><select id="ct-grupo">${Object.keys(grupos).map(k=>`<option value="${k}"${k === this.grupo_ ? " selected" : ""}>${this.h(grupos[k])}</option>`).join("")}</select></label>
      <label class="ct-f"><span>Modelo de texto</span><select id="ct-modelo">${modelos.map(m=>`<option value="${m.id}"${m.id === this.modeloId ? " selected" : ""}>${this.h(m.nome)}</option>`).join("")}</select></label>
      <div class="small-muted">Trocar o modelo atualiza o texto, a palavra em destaque e o selo. Depois você pode editar tudo à mão.</div>`;
    const g2 = C("text","nome","Nome no certificado") + C("text","destaque","Palavra em destaque") + C("text","topo","Texto acima (ex.: CERTIFICADO DE)") + C("text","certificamos","Texto abaixo do destaque") + C("area","texto","Texto do elogio (use **negrito**)",{rows:7})
      + C("text","empresa1","Empresa (linha 1)") + C("text","empresa2","Empresa (linha 2)") + C("text","assinante","Nome do assinante") + C("text","cargoAssin","Cargo do assinante") + C("text","local","Local") + C("check","dataBranco","Deixar a data em branco para escrever à mão") + (c.dataBranco ? "" : C("date","data","Data do certificado"));
    const sel = c.selo;
    const g3 = C("select","selo.tipo","Tipo de selo",{opts:this.SELOS}) + (sel.tipo === "custom" ? C("text","selo.texto","Texto do selo") : "") + C("text","selo.periodo","Período no selo (mês, trimestre, ano...)") + C("select","selo.estilo","Estilo do selo",{opts:this.ESTILOS_SELO}) + C("icons","selo.icone","Ícone do selo") + C("color","selo.c1","Cor principal do selo") + C("color","selo.c2","Cor do anel / fita");
    const lay = `<div class="ct-lays">${Object.keys(this.LAYOUTS).map(k=>`<button type="button" class="${c.layout === k ? "on" : ""}" data-lay="${k}">${this.h(this.LAYOUTS[k].n)}</button>`).join("")}</div><div class="ct-lays">${Object.keys(this.TEMAS).map(k=>`<button type="button" class="ct-tema${c.tema === k ? " on" : ""}" data-tema="${k}"><i style="background:${this.TEMAS[k].c1}"></i><i style="background:${this.TEMAS[k].c2}"></i><i style="background:${this.TEMAS[k].ac}"></i>${this.h(this.TEMAS[k].n)}</button>`).join("")}</div>`;
    const g4 = lay + `<div class="ct-grid">${C("color","cores.c1","Cor principal")}${C("color","cores.c2","Cor do destaque")}${C("color","cores.c3","Linhas claras")}${C("color","cores.tx","Cor do texto")}${C("color","cores.nome","Cor do nome")}${C("color","cores.bg","Fundo")}${C("color","cores.ac","Detalhes (dourado)")}</div>` + C("select","borda","Moldura",{opts:{dupla:"Dupla com faixas",simples:"Simples",faixas:"Faixas laterais",painel:"Painel lateral",ornamental:"Ornamental (cantos)",nenhuma:"Sem moldura"}});
    const g5 = C("select","fonteTitulo","Fonte do título e destaque",{opts:this.FONTES}) + C("select","fonteNome","Fonte do nome",{opts:this.FONTES}) + C("select","fonteTexto","Fonte do texto",{opts:this.FONTES}) + C("range","tamDest","Tamanho do destaque",{min:50,max:150,un:"px"}) + C("range","tamNome","Tamanho do nome",{min:36,max:110,un:"px"}) + C("range","tamTexto","Tamanho do texto",{min:14,max:26,un:"px"}) + C("range","espLetras","Espaço entre letras do título",{min:0,max:12}) + C("select","alinhar","Alinhamento do texto",{opts:{center:"Centralizado",left:"À esquerda"}});
    const g6 = C("select","logoPos","Posição da logo",{opts:{marca:"Marca d'água (centro)","topo-centro":"Topo, centralizada","topo-esq":"Topo, à esquerda","topo-dir":"Topo, à direita",rodape:"Rodapé",painel:"No painel lateral (layout moderno)",nenhum:"Sem logo"}}) + C("range","logoTam","Tamanho da logo",{min:20,max:100}) + C("range","logoOp","Intensidade da marca d'água",{min:3,max:30,un:"%"})
      + `<label class="ct-f"><span>Outra logo (PNG/JPG)</span><input type="file" id="ct-logofile" accept="image/*"></label><button type="button" class="btn btn-outline btn-sm" id="ct-logopadrao">Voltar para a logo Santa Therezinha</button>` + C("select","ordem","Ordem no rodapé",{opts:this.ORDENS});
    const g7 = C("select","laterais.estilo","Destaques laterais",{opts:{nenhum:"Nenhum",medalhas:"Medalhas",louros:"Ramos de louro",faixa:"Faixa com ícones"}}) + C("icons","laterais.icone","Ícone das medalhas / faixa") + C("range","laterais.qtd","Quantidade de medalhas",{min:1,max:3}) + C("color","laterais.cor","Cor dos destaques laterais");
    document.getElementById("ct-ed").innerHTML = this.grupo("1. Colaborador e modelo", g1, true) + this.grupo("2. Textos do certificado", g2, true) + this.grupo("3. Selo (mês, trimestre, semestre, ano)", g3) + this.grupo("4. Layout, cores e moldura", g4) + this.grupo("5. Fontes e tamanhos", g5) + this.grupo("6. Logo e posições", g6) + this.grupo("7. Medalhas e destaques laterais", g7);
    this.ligarEditor();
  },
  ligarEditor(){
    const ed = document.getElementById("ct-ed");
    const mudou = ()=>{ this.pintar(); };
    ed.querySelectorAll("[data-k]").forEach(el=>{
      const ev = el.type === "checkbox" || el.tagName === "SELECT" || el.type === "date" || el.type === "color" ? "input" : "input";
      el.addEventListener(ev, ()=>{
        const p = el.dataset.k; let v = el.type === "checkbox" ? el.checked : (el.type === "range" ? Number(el.value) : el.value);
        this.set(p, v);
        if(el.type === "range"){ const b = el.closest("label").querySelector("b"); if(b) b.textContent = v; }
        if(p === "selo.tipo"){ this.cfg.selo.icone = this.SELOS[v].icone; this.cfg.selo.periodo = this.periodoAuto(v); this.desenharEditor(); }
        else if(p === "dataBranco" || p === "selo.estilo" && false) this.desenharEditor();
        this.pintar();
      });
    });
    ed.querySelectorAll("[data-ic]").forEach(box=> box.querySelectorAll("button").forEach(b=> b.addEventListener("click", ()=>{
      this.set(box.dataset.ic, b.dataset.v); box.querySelectorAll("button").forEach(x=> x.classList.toggle("on", x === b)); mudou();
    })));
    ed.querySelectorAll("[data-lay]").forEach(b=> b.addEventListener("click", ()=>{
      const L = this.LAYOUTS[b.dataset.lay]; this.cfg.layout = b.dataset.lay;
      ["borda","laterais","logoPos","alinhar","fonteTitulo","fonteNome","fonteTexto"].forEach(k=>{ if(k === "laterais") this.cfg.laterais.estilo = L.laterais; else this.cfg[k] = L[k]; });
      if(b.dataset.lay === "honra"){ this.cfg.tamDest = 100; } this.desenharEditor(); this.pintar();
    }));
    ed.querySelectorAll("[data-tema]").forEach(b=> b.addEventListener("click", ()=>{
      const T = this.TEMAS[b.dataset.tema]; this.cfg.tema = b.dataset.tema;
      this.cfg.cores = { c1:T.c1, c2:T.c2, c3:T.c3, tx:T.tx, nome:T.nome, bg:T.bg, ac:T.ac };
      this.cfg.selo.c1 = T.c1; this.cfg.selo.c2 = T.c3; this.cfg.laterais.cor = T.c1; this.desenharEditor(); this.pintar();
    }));
    const pe = document.getElementById("ct-pessoa");
    pe.addEventListener("change", ()=>{
      const mat = String(pe.value).split("—")[0].trim().replace(/\D/g,"");
      const p = (this.pessoas||[]).find(x=> String(x.mat).replace(/\D/g,"") === mat) || (this.pessoas||[]).find(x=> (x.mat + " — " + x.nome) === pe.value);
      if(!p) return; this.pessoa = p; this.grupo_ = this.grupoDoCargo(p.cargo); this.modeloId = CERT_MODELOS[this.grupo_].modelos[0].id;
      this.cfg.nome = p.nome; this.aplicarModelo(); this.desenharEditor(); this.pintar();
    });
    document.getElementById("ct-grupo").addEventListener("change", e=>{ this.grupo_ = e.target.value; this.modeloId = CERT_MODELOS[this.grupo_].modelos[0].id; this.aplicarModelo(); this.desenharEditor(); this.pintar(); });
    document.getElementById("ct-modelo").addEventListener("change", e=>{ this.modeloId = e.target.value; this.aplicarModelo(); this.desenharEditor(); this.pintar(); });
    const lf = document.getElementById("ct-logofile");
    if(lf) lf.addEventListener("change", ()=>{ const f = lf.files[0]; if(!f) return; const r = new FileReader(); r.onload = ()=>{ this.cfg.logoImg = "custom"; this.cfg.logoData = String(r.result); this.pintar(); }; r.readAsDataURL(f); });
    const lp = document.getElementById("ct-logopadrao"); if(lp) lp.addEventListener("click", ()=>{ this.cfg.logoImg = "padrao"; this.cfg.logoData = ""; this.pintar(); });
  },
  pintar(){
    if(!this.box) return;
    this.box.innerHTML = this.stage(this.cfg); this.ajustar(); this.escala();
  },
  escala(){
    const bx = document.getElementById("ct-box"), esc = document.getElementById("ct-esc"); if(!bx || !esc) return;
    const s = Math.min(1, bx.clientWidth / this.W); esc.style.transform = `scale(${s})`; esc.style.width = this.W + "px"; esc.style.height = this.H + "px"; bx.style.height = (this.H * s) + "px";
  },
  aviso(t, tipo){ const m = document.getElementById("ct-msg"); if(m) m.innerHTML = t ? `<div class="${tipo === "erro" ? "error-box" : "ok-box"}">${t}</div>` : ""; },

  /* ------------------------------ exportar / lançar ------------------------------ */
  async renderizar(){
    if(typeof html2canvas === "undefined") throw new Error("A biblioteca de imagem ainda não carregou. Aguarde alguns segundos e tente de novo.");
    const wrap = document.createElement("div"); wrap.style.cssText = `position:fixed;left:0;top:0;z-index:-1;pointer-events:none;width:${this.W}px;height:${this.H}px`;
    wrap.innerHTML = this.stage(this.cfg); document.body.appendChild(wrap);
    const st = wrap.querySelector(".ctx"), box = this.box; this.box = wrap; this.ajustar(); this.box = box;
    try{ await new Promise(r=> setTimeout(r, 60)); return await html2canvas(st, { scale:2, backgroundColor:null, useCORS:true, width:this.W, height:this.H }); }
    finally{ wrap.remove(); }
  },
  nomeArq(ext){ return "certificado-" + String(this.cfg.nome||"colaborador").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-zA-Z0-9]+/g,"-").replace(/^-|-$/g,"").toLowerCase() + "." + ext; },
  async baixar(tipo){
    this.aviso("");
    try{
      const cv = await this.renderizar(), a = document.createElement("a");
      if(tipo === "png"){ a.href = cv.toDataURL("image/png"); a.download = this.nomeArq("png"); document.body.appendChild(a); a.click(); a.remove(); }
      else{
        if(!window.jspdf) throw new Error("A biblioteca de PDF ainda não carregou. Aguarde e tente de novo.");
        const pdf = new window.jspdf.jsPDF({ orientation:"landscape", unit:"mm", format:"a4" });
        pdf.addImage(cv.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 297, 210); pdf.save(this.nomeArq("pdf"));
      }
    }catch(e){ this.aviso(this.h(e.message || "Não foi possível gerar o arquivo."), "erro"); }
  },
  async lancar(){
    this.aviso("");
    const p = this.pessoa; if(!p) return this.aviso("Selecione o colaborador do quadro antes de lançar.", "erro");
    const cfg = this.clone(this.cfg); cfg.logoData = ""; if(cfg.logoImg === "custom") cfg.logoImg = "padrao";
    const b = document.getElementById("ct-lancar"); b.disabled = true;
    try{
      const r = await Api.call({ acao:"lanc_cert_lancar", matric:p.mat, nome:this.cfg.nome, cargo:p.cargo || "", grupo:this.grupo_, modelo:(CERT_MODELOS[this.grupo_].modelos.find(m=>m.id === this.modeloId)||{}).nome || "", destaque:this.cfg.destaque, selo:(this.cfg.selo.tipo === "custom" ? this.cfg.selo.texto : this.SELOS[this.cfg.selo.tipo].rot) + " " + this.cfg.selo.periodo, config:JSON.stringify({ cfg, grupo:this.grupo_, modeloId:this.modeloId }) });
      if(!r || !r.ok) throw new Error((r && r.erro) || "Não foi possível lançar.");
      this.aviso("Certificado lançado no histórico. Use Baixar PNG ou PDF para imprimir.", "ok"); this.carregarHist();
    }catch(e){ this.aviso(this.h(e.message), "erro"); }
    finally{ b.disabled = false; }
  },
  async carregarPessoas(){
    const r = await Api.call({ acao:"lanc_quadro_listar" }).catch(()=>null);
    if(r && r.ok){ this.pessoas = r.pessoas || []; const dl = document.getElementById("ct-dl"); if(dl) dl.innerHTML = this.pessoas.filter(p=>p.ativo).map(p=>`<option value="${this.h(p.mat + " — " + p.nome)}"></option>`).join(""); }
  },
  async carregarHist(){
    const box = document.getElementById("ct-hist"); if(!box) return;
    const r = await Api.call({ acao:"lanc_cert_listar" }).catch(e=>({ ok:false, erro:e.message }));
    if(!r || !r.ok){ box.innerHTML = `<div class="error-box">${this.h((r && r.erro) || "Falha ao carregar o histórico.")}</div>`; return; }
    this.hist = r.itens || [];
    box.innerHTML = this.hist.length ? `<table class="adm-table"><thead><tr><th>Lançado em</th><th>Matrícula</th><th>Nome</th><th>Modelo</th><th>Selo</th><th></th></tr></thead><tbody>${this.hist.map((i,ix)=>`<tr><td>${this.h(i.quando)}</td><td>${this.h(i.mat)}</td><td>${this.h(i.nome)}</td><td>${this.h(i.modelo)}</td><td>${this.h(i.selo)}</td><td><button type="button" class="btn btn-outline btn-sm" data-ct-re="${ix}">Reabrir</button></td></tr>`).join("")}</tbody></table>` : `<p class="small-muted">Nenhum certificado lançado ainda.</p>`;
    box.querySelectorAll("[data-ct-re]").forEach(b=> b.addEventListener("click", ()=>{
      const i = this.hist[Number(b.dataset.ctRe)]; if(!i) return;
      try{ const o = JSON.parse(i.config); this.cfg = this.mesclar(this.clone(this.PADRAO), o.cfg); this.grupo_ = o.grupo || this.grupo_; this.modeloId = o.modeloId || this.modeloId;
        this.pessoa = (this.pessoas||[]).find(p=> String(p.mat) === String(i.mat)) || { mat:i.mat, nome:i.nome, cargo:i.cargo, ativo:true };
        this.desenharEditor(); this.pintar(); window.scrollTo({ top:0, behavior:"smooth" }); this.aviso("Certificado reaberto. Ajuste o que precisar e baixe de novo.", "ok");
      }catch(e){ this.aviso("Não foi possível reabrir esse certificado.", "erro"); }
    }));
  },
  mesclar(a, b){ Object.keys(b||{}).forEach(k=>{ if(b[k] && typeof b[k] === "object" && !Array.isArray(b[k]) && a[k] && typeof a[k] === "object") this.mesclar(a[k], b[k]); else a[k] = b[k]; }); return a; },
  renderPane(){ const pane = document.getElementById("pane-lcertificado"); if(pane) this.render(pane); }
};
window.CertUI = CertUI;

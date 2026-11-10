/* =========================================================================
   Painel de TV — ranking de repositores em tela cheia (botão Play, no topo).
   Usa os mesmos números da Comissão (pontos + % qualidade), sem filtros manuais.
   Abre na 2ª tela quando existir (Window Management API); senão, na tela atual.
   ========================================================================= */
const PainelTV = {
  aberto:false, root:null, _t:[], _dados:null, _id:0, _ver:0, _cacheMes:{}, fotos:{}, cfg:null,
  /* parâmetros padrão (o administrador muda em Administração > Parâmetros Painel TV) */
  DEF: {
    destaque:"anterior",            // "anterior" = mês passado | "atual" = mês atual
    criterio:"pontos",              // "pontos" | "combinado" (pontos × qualidade)
    mostrarQualidade:false,
    mostrarFotos:true, mostrarObs:true, mostrarTrimestre:true,
    colunas:{ media3:true, mesAnt:true, mesAtu:true, proj:true, ritmo:true },
    ritmoSemana:true, ritmoMes:true,
    sequenciaMin:2,
    fundo:"aurora", velocidade:3,
    cores:{ preset:"azul", c0:"#0a1f3f", c1:"#2a63b8", c2:"#f28c28" },
    pulso1:true,
    aura:{ 1:{ estilo:"brilho", cor:"#ffd24d" }, 2:{ estilo:"brilho", cor:"#cfd6df" }, 3:{ estilo:"brilho", cor:"#e0955a" } },
    auraSeq:{ ativa:true, cor:"#4dd8ff" }
  },
  PRESETS: {
    azul:     { nome:"Azul e laranja", c0:"#0a1f3f", c1:"#2a63b8", c2:"#f28c28", b1:"#4d8fff", b2:"#7be0c3" },
    verde:    { nome:"Verde",          c0:"#06261c", c1:"#1f8f68", c2:"#e0c23a", b1:"#3ee0a0", b2:"#9be37a" },
    roxo:     { nome:"Roxo e rosa",    c0:"#1a0d3a", c1:"#6a3fd0", c2:"#f0509a", b1:"#a77bff", b2:"#ff8ad0" },
    vermelho: { nome:"Vermelho",       c0:"#2a0b10", c1:"#b3283a", c2:"#f2a33a", b1:"#ff6b6b", b2:"#ffc36b" },
    grafite:  { nome:"Grafite",        c0:"#111418", c1:"#3a4658", c2:"#8aa0b8", b1:"#7c8da4", b2:"#c6d2e0" }
  },
  FUNDOS: { aurora:"Aurora (luzes suaves)", particulas:"Partículas subindo", grade:"Grade em movimento", estatico:"Estático (sem animação)" },
  AURAS: { nenhuma:"Sem aura", brilho:"Brilho suave", anel:"Anel giratório", energia:"Energia", chama:"Chama" },
  mesclar(a, b){
    const o = Array.isArray(a) ? a.slice() : Object.assign({}, a);
    if(!b || typeof b !== "object") return o;
    Object.keys(b).forEach(k=>{ o[k] = (o[k] && typeof o[k] === "object" && !Array.isArray(o[k]) && b[k] && typeof b[k] === "object") ? this.mesclar(o[k], b[k]) : b[k]; });
    return o;
  },
  cfgAtual(){ return this.cfg || (this.cfg = this.mesclar(this.DEF, {})); },
  async cfgCarregar(){
    try{ const r = await Api.call({ acao:"tv_cfg_ler" }); if(r && r.ok){ const novo = this.mesclar(this.DEF, r.config || {}); const mudou = JSON.stringify(novo) !== JSON.stringify(this.cfg); this.cfg = novo; return mudou; } }catch(e){}
    this.cfgAtual(); return false;
  },
  chaveFoto(c){ return String(c||"").replace(/\D/g,"").replace(/^0+/,""); },
  async fotosCarregar(){
    try{ const r = await Api.call({ acao:"tv_fotos_ler" }); if(r && r.ok){ const m = {}; Object.keys(r.fotos||{}).forEach(k=>{ m[this.chaveFoto(k)] = r.fotos[k]; }); this.fotos = m; } }catch(e){}
  },
  MESES: ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],

  /* ------------------------------ dados ------------------------------ */
  pronto(){ return !!(window.APP_STATE && APP_STATE.ready && APP_STATE.processed && Production.maxDataDate()); },
  nomeCurto(n){ const p = String(n||"").trim().toLowerCase().split(/\s+/).filter(Boolean).slice(0,2); return p.map(x=>x.charAt(0).toUpperCase()+x.slice(1)).join(" ") || "—"; },
  idx(p, q){ return this.cfgAtual().criterio === "combinado" ? p * (q === null || q === undefined ? 1 : q/100) : p; },
  /** top 3 de um mês fechado (usa o mesmo critério do painel); guardado em cache até a próxima carga de dados */
  topMes(m0){
    const k = this._ver + ":" + m0.getFullYear() + "-" + m0.getMonth();
    if(this._cacheMes[k]) return this._cacheMes[k];
    let r = [];
    try{
      const fim = new Date(m0.getFullYear(), m0.getMonth()+1, 0);
      r = getComissaoTableData(m0, fim).filter(e=>e.pontos > 0)
        .map(e=>({ cod:e.codKey, p:e.pontos, i:this.idx(e.pontos, e.qualidade) })).sort((x,y)=>y.i-x.i || y.p-x.p).slice(0,3).map(x=>x.cod);
    }catch(e){}
    return (this._cacheMes[k] = r);
  },
  calc(){
    const max = Production.maxDataDate(); if(!max) return null;
    const cfg = this.cfgAtual(), usaAtual = cfg.destaque === "atual";
    const hoje = dateOnly(max), m0 = new Date(hoje.getFullYear(), hoje.getMonth(), 1), fim0 = new Date(hoje.getFullYear(), hoje.getMonth()+1, 0);
    const m1 = addMonths(m0,-1), fim1 = new Date(m1.getFullYear(), m1.getMonth()+1, 0), m3 = addMonths(m0,-3);
    const mapa = (a,b)=>{ const mp = new Map(); try{ getComissaoTableData(a,b).forEach(e=>mp.set(e.codKey,e)); }catch(e){} return mp; };
    const ant = mapa(m1, fim1), tri = mapa(m3, fim1), atu = mapa(m0, hoje);
    // semana: últimos 7 dias contra os 7 dias anteriores (pontos por dia útil)
    const s0i = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()-6), s1f = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()-7), s1i = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()-13);
    const sem0 = mapa(s0i, hoje), sem1 = mapa(s1i, s1f), du0 = diasUteisEntre(s0i, hoje) || 0, du1 = diasUteisEntre(s1i, s1f) || 0;
    // meses (dos 3 anteriores) que realmente têm produção: a média não pode contar mês vazio
    const tem = new Set(); APP_STATE.processed.p8460.forEach(r=>{ if(r.tipoos===58 && r.dtinicio) tem.add(r.dtinicio.getFullYear()*12+r.dtinicio.getMonth()); });
    const n3 = [-3,-2,-1].map(k=>{ const d = addMonths(m0,k); return d.getFullYear()*12+d.getMonth(); }).filter(k=>tem.has(k)).length || 1;
    const dec = diasUteisEntre(m0, hoje) || 1, totMes = diasUteisEntre(m0, fim0) || dec, totAnt = diasUteisEntre(m1, fim1) || 1;
    // quadro atual (repositores)
    const team = APP_STATE.currentTeam, reg = APP_STATE.nameRegistry;
    let base = new Set(Array.from(atu.keys()));
    if(team && team.members){ team.members.forEach(m=>{ if(!team.cargoDisponivel || m.cargo === "REPOSITOR") base.add(m.codKey); }); }
    const var_ = (novo, velho)=> velho > 0 ? (novo/velho - 1)*100 : null;
    const linhas = [];
    base.forEach(cod=>{
      const a = ant.get(cod), t = tri.get(cod), c = atu.get(cod);
      const nome = (reg && reg.get(cod)) || (c && c.nome) || (a && a.nome) || (t && t.nome) || cod;
      const pAnt = a ? a.pontos : 0, p3 = t ? t.pontos / n3 : 0, pAtu = c ? c.pontos : 0;
      const ritmo = pAtu / dec, ritmoAnt = pAnt / totAnt;
      const rs0 = du0 ? ((sem0.get(cod)||{}).pontos||0) / du0 : 0, rs1 = du1 ? ((sem1.get(cod)||{}).pontos||0) / du1 : 0;
      linhas.push({ cod, nome:this.nomeCurto(nome),
        pAnt, qAnt:a ? a.qualidade : null, p3, q3:t ? t.qualidade : null, pAtu, qAtu:c ? c.qualidade : null,
        proj:Math.round(ritmo * totMes), ritmo, dMes:var_(ritmo, ritmoAnt), dSem:var_(rs0, rs1), estAtu: !!(c && c.qualidadeEstimada) });
    });
    linhas.forEach(l=>{ l.iAnt = this.idx(l.pAnt, l.qAnt); l.i3 = this.idx(l.p3, l.q3); l.iAtu = this.idx(l.pAtu, l.qAtu); });
    const top = (campo, ind)=> linhas.filter(l=>l[campo] > 0).sort((x,y)=>y[ind]-x[ind] || y[campo]-x[campo]).slice(0,3);
    const tabela = linhas.filter(l=> l.pAtu>0 || l.pAnt>0 || l.p3>0).sort((x,y)=>y.iAtu-x.iAtu || y.pAtu-x.pAtu);
    const pod = usaAtual ? top("pAtu","iAtu") : top("pAnt","iAnt");
    const medal = new Map(); pod.forEach((l,i)=> medal.set(l.cod, i+1));
    // sequência: meses seguidos no top 3 (conta o mês de referência e volta enquanto a pessoa continuar entre os 3)
    const seq = new Map(); pod.forEach(l=> seq.set(l.cod, 1));
    const vivos = new Set(seq.keys()), mRef = usaAtual ? m0 : m1;
    for(let i=1; i<=12 && vivos.size; i++){
      const t = new Set(this.topMes(addMonths(mRef,-i)));
      Array.from(vivos).forEach(c=>{ if(t.has(c)) seq.set(c, seq.get(c)+1); else vivos.delete(c); });
    }
    const rot3 = [-3,-1].map(k=>{ const d = addMonths(m0,k); return this.MESES[d.getMonth()].slice(0,3); }).join(" a ");
    const mp = usaAtual ? m0 : m1;
    return { ref:hoje, usaAtual, mesAnt:`${this.MESES[m1.getMonth()]}/${m1.getFullYear()}`, mesAtu:`${this.MESES[m0.getMonth()]}`, rot3, dec, totMes,
      mesDestaque:`${this.MESES[mp.getMonth()]} ${mp.getFullYear()}`,
      podio:pod, trimestre:top("p3","i3"), tabela, medal, seq };
  },

  /* ------------------------------ medalhas ------------------------------ */
  medalha(pos, tam){
    const id = "mdl" + pos + "_" + (++this._id);
    const c = { 1:["#fff3b0","#f2c230","#a9750b","#7d1f2a","#b3283a"], 2:["#ffffff","#cfd6df","#7d8897","#1d4f91","#2f6fce"], 3:["#ffd9b5","#d08a4b","#8a4f1f","#1c6b4a","#2a9a6b"] }[pos];
    return `<svg class="tv-medal" viewBox="0 0 120 168" width="${tam}" height="${Math.round(tam*1.4)}" aria-label="${pos}º lugar">
      <defs>
        <linearGradient id="${id}r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset=".45" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></linearGradient>
        <linearGradient id="${id}d" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset=".55" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></linearGradient>
        <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[4]}"/><stop offset="1" stop-color="${c[3]}"/></linearGradient>
        <radialGradient id="${id}h" cx=".3" cy=".25" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
        <filter id="${id}s" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="3" stdDeviation="3.2" flood-color="#000" flood-opacity=".45"/></filter>
      </defs>
      <g filter="url(#${id}s)">
        <path d="M30 2h22l22 62-24 10z" fill="url(#${id}f)"/><path d="M90 2H68L46 64l24 10z" fill="url(#${id}f)" opacity=".92"/>
        <path d="M30 2h10l22 62-9 4z M90 2H80L58 64l9 4z" fill="#fff" opacity=".16"/>
        <path d="M52 2h16l-8 22z" fill="#000" opacity=".18"/>
        <circle cx="60" cy="108" r="50" fill="url(#${id}r)"/>
        <circle cx="60" cy="108" r="50" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.2"/>
        <circle cx="60" cy="108" r="40" fill="url(#${id}d)"/>
        <circle cx="60" cy="108" r="40" fill="none" stroke="${c[2]}" stroke-opacity=".55" stroke-width="1.4"/>
        <circle cx="60" cy="108" r="34" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1" stroke-dasharray="2 3"/>
        <ellipse cx="46" cy="86" rx="24" ry="14" fill="url(#${id}h)" transform="rotate(-28 46 86)"/>
        <text x="60" y="124" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="46" font-weight="700" fill="${c[2]}" fill-opacity=".9" stroke="#fff" stroke-opacity=".5" stroke-width=".8">${pos}</text>
        <path d="M60 70l3.2 6.5 7.2 1-5.2 5 1.2 7.1-6.4-3.4-6.4 3.4 1.2-7.1-5.2-5 7.2-1z" fill="#fff" fill-opacity=".85" transform="translate(0,-2) scale(1) "/>
      </g></svg>`;
  },
  iniciais(n){ return String(n).split(" ").map(x=>x.charAt(0)).join("").slice(0,2).toUpperCase(); },
  cor(n){ let h = 0; for(const ch of String(n)) h = (h*31 + ch.charCodeAt(0)) % 360; return h; },
  fotoDe(l){ return this.cfgAtual().mostrarFotos ? (this.fotos[this.chaveFoto(l.cod)] || "") : ""; },
  av(l){ const f = this.fotoDe(l); return f ? `<span class="tv-av foto"><img src="${f}" alt=""></span>` : `<span class="tv-av" style="--h:${this.cor(l.nome)}">${this.iniciais(l.nome)}</span>`; },
  q(v, est){ return v === null || v === undefined ? "—" : fmtNum(v,1) + "%" + (est ? "*" : ""); },
  qcls(v){ return v === null || v === undefined ? "" : v >= 90 ? "ok" : v >= 70 ? "mid" : "bad"; },
  n(v){ return fmtNum(Math.round(v)); },
  BOLT: `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M13.2 2 4.5 13.4h6.1L9.8 22l9.7-12.2h-6.3z"/></svg>`,
  /** meses seguidos entre os 3 destaques (0 se não atingiu o mínimo configurado) */
  meses(d, l){ const n = (d.seq && d.seq.get(l.cod)) || 0; return n >= Math.max(2, Number(this.cfgAtual().sequenciaMin) || 2) ? n : 0; },
  selo(n, peq){ return n ? `<i class="tv-selo s${Math.min(n,4)}${peq ? " peq" : ""}" title="${n} meses seguidos entre os 3 destaques">${n}x</i>` : ""; },
  /** foto (ou iniciais) redonda com aura, medalha e selo de sequência */
  foto(d, l, pos, tam){
    const c = this.cfgAtual(), n = this.meses(d, l), f = this.fotoDe(l);
    let estilo = "nenhuma", cor = "#fff";
    const ap = pos && c.aura && c.aura[pos]; if(ap){ estilo = ap.estilo; cor = ap.cor; }
    if(n && c.auraSeq && c.auraSeq.ativa){ estilo = "energia"; cor = c.auraSeq.cor; }
    const mid = f ? `<img src="${f}" alt="">` : `<b style="--h:${this.cor(l.nome)}">${this.iniciais(l.nome)}</b>`;
    return `<span class="tv-ph ${tam} au-${estilo}" style="--ac:${this.h(cor)}"><i class="tv-sp"></i><span class="tv-pi${f ? "" : " ini"}">${mid}</span>${pos ? this.medalha(pos, 60) : ""}${this.selo(n)}</span>`;
  },

  /* ------------------------------ tela ------------------------------ */
  colunas(d){
    const c = this.cfgAtual(), col = c.colunas || {}, q = !!c.mostrarQualidade, out = [];
    const ritmoTxt = (l)=>{
      const dl = (v, rot)=> v === null || v === undefined ? "" : `<span class="tv-dl ${v>=0?"up":"dn"}">${v>=0?"▲":"▼"} ${fmtNum(Math.abs(v),0)}% <em>${rot}</em></span>`;
      return `<div class="rit"><b>${fmtNum(l.ritmo,1)}</b>${c.ritmoSemana ? dl(l.dSem, "sem.") : ""}${c.ritmoMes ? dl(l.dMes, "mês") : ""}</div>`;
    };
    if(col.media3){ out.push({ h:`Média 3 meses<small>pontos/mês</small>`, c:l=>this.n(l.p3) }); if(q) out.push({ h:`Qual. 3 meses`, c:l=>this.q(l.q3), k:l=>this.qcls(l.q3) }); }
    if(col.mesAnt){ out.push({ h:`${this.h(d.mesAnt.split("/")[0])}<small>pontos</small>`, c:l=>this.n(l.pAnt) }); if(q) out.push({ h:`Qual. mês ant.`, c:l=>this.q(l.qAnt), k:l=>this.qcls(l.qAnt) }); }
    if(col.mesAtu){ out.push({ h:`${this.h(d.mesAtu)}<small>pontos até hoje</small>`, c:l=>this.n(l.pAtu), k:()=>"strong" }); if(q) out.push({ h:`Qual. mês atual`, c:l=>this.q(l.qAtu, l.estAtu), k:l=>this.qcls(l.qAtu) }); }
    if(col.proj) out.push({ h:`Projetado<small>fim do mês</small>`, c:l=>this.n(l.proj), k:()=>"strong proj" });
    if(col.ritmo) out.push({ h:`Ritmo<small>pontos/dia útil${c.ritmoSemana || c.ritmoMes ? " · variação" : ""}</small>`, c:ritmoTxt, k:()=>"rit-c", w:(c.ritmoSemana && c.ritmoMes) ? "22%" : "" });
    return out;
  },
  html(d){
    const cfg = this.cfgAtual(), q = !!cfg.mostrarQualidade;
    const f = d.ref, dd = `${String(f.getDate()).padStart(2,"0")}/${String(f.getMonth()+1).padStart(2,"0")}/${f.getFullYear()}`;
    const ordem = [d.podio[1], d.podio[0], d.podio[2]];             // 2º - 1º - 3º (1º no centro, mais alto)
    const campoP = d.usaAtual ? "pAtu" : "pAnt", campoQ = d.usaAtual ? "qAtu" : "qAnt";
    const card = (l, pos)=>{ if(!l) return `<div class="tv-pc vazio"></div>`;
      const n = this.meses(d, l);
      return `<div class="tv-pc p${pos}${pos===1 && cfg.pulso1 ? " pulso" : ""}">
        ${this.foto(d, l, pos, pos===1 ? "g" : "m")}
        <div class="tv-pn">${this.h(l.nome)}</div>
        ${n ? `<div class="tv-seq">${this.BOLT}<span>${n} meses seguidos</span></div>` : ""}
        <div class="tv-pm"><div><b>${this.n(l[campoP])}</b><span>pontos</span></div>${q ? `<div class="${this.qcls(l[campoQ])}"><b>${this.q(l[campoQ])}</b><span>qualidade</span></div>` : ""}</div></div>`; };
    const tri = d.trimestre.map((l,i)=>`<div class="tv-tr"><span class="tv-trm">${this.medalha(i+1, 40)}</span>${this.av(l)}
        <div class="tv-trn"><strong>${this.h(l.nome)}</strong><small>média de ${this.n(l.p3)} pontos/mês</small></div>
        ${q ? `<div class="tv-trq ${this.qcls(l.q3)}"><b>${this.q(l.q3)}</b><small>qualidade</small></div>` : `<div class="tv-trq"><b>${this.n(l.p3)}</b><small>pts/mês</small></div>`}</div>`).join("") || `<div class="tv-vazio">Sem dados no período.</div>`;
    const cols = this.colunas(d);
    const thead = `<tr><th class="c">#</th><th>Colaborador</th>${cols.map(c=>`<th class="r">${c.h}</th>`).join("")}</tr>`;
    const linhas = d.tabela.map((l,i)=>{ const m = d.medal.get(l.cod), n = this.meses(d, l);
      return `<tr><td class="c pos">${i+1}</td><td class="nm"><div class="nmw">${this.av(l)}<span>${this.h(l.nome)}</span>${m?`<i class="tv-mm">${this.medalha(m, 18)}</i>`:""}${this.selo(n, true)}</div></td>
        ${cols.map(c=>`<td class="r ${c.k ? c.k(l) : ""}">${c.c(l)}</td>`).join("")}</tr>`; }).join("");
    const nCols = cols.length + 2;
    const cg = `<colgroup><col style="width:3.4em"><col style="width:${cols.length > 6 ? "20%" : "24%"}">${cols.map(c=>`<col${c.w ? ` style="width:${c.w}"` : ""}>`).join("")}</colgroup>`;
    const obs = cfg.criterio === "combinado"
      ? `Para <b>1º, 2º e 3º lugar</b> avaliamos a <b>pontuação</b> e a <b>qualidade da rua</b> juntas: quanto maior a pontuação e maior o % de qualidade, melhor a posição.`
      : `Para <b>1º, 2º e 3º lugar</b> avaliamos a <b>pontuação</b>: quanto maior a pontuação, melhor a posição.`;
    const ordemTxt = cfg.criterio === "combinado" ? "pontos × qualidade" : "pontos";
    return `<div class="tv-wrap${cfg.mostrarTrimestre ? "" : " sem-tri"}${cfg.mostrarObs ? "" : " sem-obs"}">
      <header class="tv-top"><img src="logo-branco.png" alt="" class="tv-logo"><div class="tv-tt"><h1>Ranking de Repositores</h1><p>Dados até ${dd} · ${d.dec} dia(s) útil(eis) no mês</p></div>
        <div class="tv-clock"><b id="tv-hora"></b><small id="tv-upd"></small></div><button type="button" class="tv-x" id="tv-x" title="Fechar (Esc)">${Icons.svg("x",22)}</button></header>
      <section class="tv-hero">
        <div class="tv-box tv-podio"><h2><span>Funcionários do Mês</span><small>${this.h(d.mesDestaque)}</small></h2>
          <div class="tv-pg">${card(ordem[0],2)}${card(ordem[1],1)}${card(ordem[2],3)}</div></div>
        ${cfg.mostrarTrimestre ? `<div class="tv-box tv-tri"><h2><span>Melhores dos últimos 3 meses</span><small>${this.h(d.rot3)}</small></h2>${tri}</div>` : ""}
      </section>
      ${cfg.mostrarObs ? `<div class="tv-obs">${Icons.svg("info",22)}<p>${obs}</p></div>` : ""}
      <section class="tv-box tv-lista"><div class="tv-lh"><img src="logo-branco.png" alt="" class="tv-logo2"><h2>Quadro completo <small>— ordenado pelo mês atual (${ordemTxt})</small></h2></div>
        <div class="tv-th"><table>${cg}<thead>${thead}</thead></table></div>
        <div class="tv-sc" id="tv-sc"><table>${cg}<tbody>${linhas || `<tr><td colspan="${nCols}" class="tv-vazio">Sem dados.</td></tr>`}</tbody></table></div>
        <div class="tv-rod">${q ? "* qualidade estimada pela média da equipe (sem auditoria no período) · " : ""}Projeção = ritmo por dia útil × dias úteis do mês${cfg.ritmoSemana || cfg.ritmoMes ? " · ▲▼ ritmo comparado com a semana anterior (7 dias) e com o mês anterior" : ""}</div></section></div>`;
  },
  h(s){ return typeof escapeHtml === "function" ? escapeHtml(String(s)) : String(s); },

  /** cores, fundo animado e velocidade vindos dos parâmetros */
  aplicarTema(){
    const r = this.root; if(!r) return; const c = this.cfgAtual(), cs = c.cores || {};
    const pr = this.PRESETS[cs.preset];
    const t = pr ? pr : { c0:cs.c0, c1:cs.c1, c2:cs.c2, b1:cs.c1, b2:cs.c2 };
    r.style.setProperty("--tv0", t.c0); r.style.setProperty("--tv1", t.c1); r.style.setProperty("--tv2", t.c2); r.style.setProperty("--tvb1", t.b1); r.style.setProperty("--tvb2", t.b2);
    r.className = "fx-" + (this.FUNDOS[c.fundo] ? c.fundo : "aurora");
    let fx = r.querySelector(":scope > .tv-fx");
    if(!fx){ fx = document.createElement("div"); fx.className = "tv-fx"; fx.setAttribute("aria-hidden","true"); r.insertBefore(fx, r.firstChild); }
    if(c.fundo === "particulas" && !fx.firstChild){
      let h = ""; for(let i=0;i<30;i++){ const sz = 3+Math.random()*8; h += `<span style="left:${(Math.random()*100).toFixed(1)}%;width:${sz.toFixed(1)}px;height:${sz.toFixed(1)}px;animation-duration:${(14+Math.random()*16).toFixed(1)}s;animation-delay:-${(Math.random()*28).toFixed(1)}s;opacity:${(.25+Math.random()*.45).toFixed(2)}"></span>`; }
      fx.innerHTML = h;
    } else if(c.fundo !== "particulas"){ fx.innerHTML = ""; }
  },
  desenhar(){
    if(!this.root) return;
    let d = null; try{ d = this.calc(); }catch(e){ console.error(e); }
    this._dados = d;
    if(!d){ this.root.innerHTML = `<div class="tv-wrap"><div class="tv-vazio">Sem dados para o painel. Atualize os dados e tente de novo.</div><button type="button" class="tv-x" id="tv-x">${Icons.svg("x",22)}</button></div>`; }
    else this.root.innerHTML = this.html(d);
    this.aplicarTema();
    const x = this.root.querySelector("#tv-x"); if(x) x.onclick = ()=> this.fechar();
    this.relogio(); this.rolar(true);
  },
  relogio(){
    const h = this.root && this.root.querySelector("#tv-hora"); if(!h) return;
    const n = new Date(), p = v=>String(v).padStart(2,"0");
    h.textContent = `${p(n.getHours())}:${p(n.getMinutes())}`;
    const u = this.root.querySelector("#tv-upd"); if(u) u.textContent = `atualizado às ${this._upd || `${p(n.getHours())}:${p(n.getMinutes())}`}`;
  },
  /** rolagem automática suave da lista (para quando cabe tudo) */
  rolar(reinicia){
    if(this._rol){ clearInterval(this._rol); this._rol = null; }
    const sc = this.root && this.root.querySelector("#tv-sc"); if(!sc) return;
    let pausa = 60, fase = "desce"; if(reinicia) sc.scrollTop = 0;
    this._rol = setInterval(()=>{
      if(sc.scrollHeight <= sc.clientHeight + 2) return;
      if(pausa > 0){ pausa--; return; }
      if(fase === "desce"){ sc.scrollTop += 1; if(sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 1){ fase = "sobe"; pausa = 100; } }
      else { sc.scrollTop = 0; fase = "desce"; pausa = 80; }
    }, Math.max(8, Math.round(120 / Math.min(10, Math.max(1, Number(this.cfgAtual().velocidade) || 3)))));   // velocidade 1 (lenta) a 10 (rápida)
  },

  /* ------------------------------ abrir / fechar ------------------------------ */
  async tocar(){
    if(this.aberto){ this.fechar(); return; }
    if(!this.pronto()){ toast("Carregue os dados primeiro (Atualizar dados).", "error"); return; }
    this.aberto = true; this._upd = null;
    try{ if(window.AuditOnline && AuditOnline.rows === null) await AuditOnline.load(); }catch(e){}
    await Promise.all([this.cfgCarregar(), this.fotosCarregar()]);
    if(!this.aberto) return;
    const r = document.createElement("div"); r.id = "tv-root"; r.setAttribute("role","dialog"); r.setAttribute("aria-label","Painel de pontuação");
    document.body.appendChild(r); this.root = r; this.desenhar();
    this._t.push(setInterval(()=> this.relogio(), 20000));
    this._t.push(setInterval(async ()=>{ if(!this.aberto) return; await this.cfgCarregar(); await this.fotosCarregar(); this.desenhar(); }, 5*60*1000));   // pega mudanças de parâmetros e fotos
    this._t.push(setInterval(()=>{ const b = document.getElementById("btn-refresh-online"); if(b && this.aberto) b.click(); }, 15*60*1000));   // recarrega os dados sozinho
    this._esc = ()=>{ if(!document.fullscreenElement && this.aberto && !this._entrando) this.fechar(); };
    document.addEventListener("fullscreenchange", this._esc);
    try{ this._wl = navigator.wakeLock && await navigator.wakeLock.request("screen"); }catch(e){}
    await this.telaCheia();
  },
  /** tela cheia na 2ª tela, se existir; senão, na tela atual */
  async telaCheia(){
    this._entrando = true; let alvo = null;
    try{
      if(window.getScreenDetails){
        const det = await getScreenDetails();
        const outra = det.screens.find(s=>s !== det.currentScreen && !s.isPrimary) || det.screens.find(s=>s !== det.currentScreen);
        if(outra) alvo = outra;
      }
    }catch(e){}
    try{ await this.root.requestFullscreen(alvo ? { screen:alvo, navigationUI:"hide" } : { navigationUI:"hide" }); this._seg = alvo ? "2ª tela" : "tela atual"; }
    catch(e){
      // o navegador pediu um clique novo para entrar em tela cheia
      const b = document.createElement("button"); b.type = "button"; b.className = "tv-go";
      b.innerHTML = `${Icons.svg("play",26)} Clique para abrir em tela cheia${alvo ? " na 2ª tela" : ""}`;
      b.onclick = async ()=>{ try{ await this.root.requestFullscreen(alvo ? { screen:alvo, navigationUI:"hide" } : { navigationUI:"hide" }); }catch(x){} b.remove(); };
      this.root.appendChild(b);
    }
    setTimeout(()=>{ this._entrando = false; }, 800);
  },
  fechar(){
    this.aberto = false; this._entrando = false;
    this._t.forEach(clearInterval); this._t = []; if(this._rol){ clearInterval(this._rol); this._rol = null; }
    document.removeEventListener("fullscreenchange", this._esc);
    try{ if(document.fullscreenElement) document.exitFullscreen(); }catch(e){}
    try{ if(this._wl) this._wl.release(); }catch(e){} this._wl = null;
    if(this.root){ this.root.remove(); this.root = null; }
  },
  /* ------------------------------ Administração > Parâmetros Painel TV ------------------------------ */
  async renderPane(){
    const pane = document.getElementById("pane-tv"); if(!pane) return;
    pane.innerHTML = `<div class="panel"><p class="small-muted">Carregando parâmetros...</p></div>`;
    await this.cfgCarregar();
    const c = this.cfgAtual(), h = s=>this.h(s);
    const chk = (id, v, t, d)=>`<label class="tvp-chk"><input type="checkbox" id="tvp-${id}"${v ? " checked" : ""}><span><b>${t}</b>${d ? `<small>${d}</small>` : ""}</span></label>`;
    const sel = (id, opts, v)=>`<select id="tvp-${id}">${Object.keys(opts).map(k=>`<option value="${k}"${k===v ? " selected" : ""}>${h(typeof opts[k]==="string" ? opts[k] : opts[k].nome)}</option>`).join("")}</select>`;
    const aura = (pos, nome)=>`<div class="tvp-aura"><strong>${nome}</strong>${sel("au"+pos, this.AURAS, (c.aura[pos]||{}).estilo)}<input type="color" id="tvp-ac${pos}" value="${h((c.aura[pos]||{}).cor)}" title="Cor da aura"></div>`;
    pane.innerHTML = `<div class="panel tvp">
      <div class="adm-head"><h3 class="adm-h2" style="margin:0">Parâmetros do Painel TV</h3>
        <div class="adm-head-r"><button type="button" class="btn btn-outline" id="tvp-abrir">${Icons.svg("play",16)} Abrir painel</button></div></div>
      <p class="small-muted">O painel da TV lê estes parâmetros sozinho (confere a cada 5 minutos, sem precisar fechar).</p>

      <fieldset class="tvp-fs"><legend>Funcionários do Mês</legend>
        <div class="adm-form">
          <label>Mostrar os funcionários de<select id="tvp-destaque"><option value="anterior"${c.destaque==="anterior" ? " selected" : ""}>Mês passado</option><option value="atual"${c.destaque==="atual" ? " selected" : ""}>Mês atual (até hoje)</option></select></label>
          <label>Critério do ranking<select id="tvp-criterio"><option value="pontos"${c.criterio==="pontos" ? " selected" : ""}>Somente pontuação</option><option value="combinado"${c.criterio==="combinado" ? " selected" : ""}>Pontuação × qualidade</option></select></label>
          <label>Selo de sequência a partir de (meses)<input type="number" id="tvp-seqmin" min="2" max="12" value="${Number(c.sequenciaMin)||2}"></label>
        </div>
        <p class="small-muted">Quem ficar entre os 3 destaques por meses seguidos ganha o selo 2x, 3x, 4x... e a aura de energia na foto.</p>
      </fieldset>

      <fieldset class="tvp-fs"><legend>O que aparece no painel</legend>
        <div class="tvp-grid">
          ${chk("q", c.mostrarQualidade, "Qualidade (%)", "Desmarcado: nenhuma informação de qualidade aparece.")}
          ${chk("fotos", c.mostrarFotos, "Fotos dos colaboradores", "Cadastradas em Lançar Quadro.")}
          ${chk("tri", c.mostrarTrimestre, "Melhores dos últimos 3 meses")}
          ${chk("obs", c.mostrarObs, "Observação sobre 1º, 2º e 3º lugar")}
          ${chk("rs", c.ritmoSemana, "Ritmo × semana anterior", "Subiu ou caiu em relação aos 7 dias anteriores.")}
          ${chk("rm", c.ritmoMes, "Ritmo × mês anterior", "Subiu ou caiu em relação ao mês passado.")}
        </div>
        <h4 class="tvp-h">Colunas do quadro completo</h4>
        <div class="tvp-grid">
          ${chk("c-media3", c.colunas.media3, "Média 3 meses")}${chk("c-mesAnt", c.colunas.mesAnt, "Mês anterior")}${chk("c-mesAtu", c.colunas.mesAtu, "Mês atual")}
          ${chk("c-proj", c.colunas.proj, "Projetado")}${chk("c-ritmo", c.colunas.ritmo, "Ritmo")}
        </div>
      </fieldset>

      <fieldset class="tvp-fs"><legend>Aparência</legend>
        <div class="adm-form">
          <label>Efeito do fundo${sel("fundo", this.FUNDOS, c.fundo)}</label>
          <label>Cores predominantes${sel("preset", Object.assign({}, this.PRESETS, { custom:"Personalizadas (escolher abaixo)" }), c.cores.preset in this.PRESETS ? c.cores.preset : "custom")}</label>
          <label>Velocidade da rolagem da tabela: <b id="tvp-vv">${Number(c.velocidade)||3}</b><input type="range" id="tvp-vel" min="1" max="10" step="1" value="${Number(c.velocidade)||3}"></label>
        </div>
        <div class="tvp-cores" id="tvp-cores"><label>Fundo<input type="color" id="tvp-c0" value="${h(c.cores.c0)}"></label><label>Destaque 1<input type="color" id="tvp-c1" value="${h(c.cores.c1)}"></label><label>Destaque 2<input type="color" id="tvp-c2" value="${h(c.cores.c2)}"></label></div>
        <div class="tvp-grid">${chk("pulso", c.pulso1, "1º lugar pulsando devagar")}</div>
        <h4 class="tvp-h">Aura ao redor da foto</h4>
        <div class="tvp-auras">${aura(1,"1º lugar")}${aura(2,"2º lugar")}${aura(3,"3º lugar")}
          <div class="tvp-aura"><strong>Em sequência</strong><label class="tvp-mini"><input type="checkbox" id="tvp-as"${c.auraSeq.ativa ? " checked" : ""}> energia</label><input type="color" id="tvp-asc" value="${h(c.auraSeq.cor)}" title="Cor da aura de sequência"></div></div>
      </fieldset>
      <div id="tvp-msg"></div>
      <div class="adm-actions"><button type="button" class="btn btn-outline" id="tvp-padrao">Restaurar padrão</button><button type="button" class="btn btn-primary" id="tvp-salvar">Salvar parâmetros</button></div></div>`;
    const $ = id=> document.getElementById("tvp-"+id);
    const custom = ()=>{ $("cores").style.display = $("preset").value === "custom" ? "" : "none"; };
    $("preset").addEventListener("change", custom); custom();
    $("vel").addEventListener("input", ()=>{ $("vv").textContent = $("vel").value; });
    const coletar = ()=>({
      destaque:$("destaque").value, criterio:$("criterio").value, sequenciaMin:Math.min(12, Math.max(2, Number($("seqmin").value)||2)),
      mostrarQualidade:$("q").checked, mostrarFotos:$("fotos").checked, mostrarTrimestre:$("tri").checked, mostrarObs:$("obs").checked,
      ritmoSemana:$("rs").checked, ritmoMes:$("rm").checked,
      colunas:{ media3:$("c-media3").checked, mesAnt:$("c-mesAnt").checked, mesAtu:$("c-mesAtu").checked, proj:$("c-proj").checked, ritmo:$("c-ritmo").checked },
      fundo:$("fundo").value, velocidade:Number($("vel").value)||3, pulso1:$("pulso").checked,
      cores:{ preset:$("preset").value, c0:$("c0").value, c1:$("c1").value, c2:$("c2").value },
      aura:{ 1:{ estilo:$("au1").value, cor:$("ac1").value }, 2:{ estilo:$("au2").value, cor:$("ac2").value }, 3:{ estilo:$("au3").value, cor:$("ac3").value } },
      auraSeq:{ ativa:$("as").checked, cor:$("asc").value }
    });
    const msg = (t, ok)=>{ $("msg").innerHTML = t ? `<div class="${ok ? "ok-box" : "error-box"}">${h(t)}</div>` : ""; };
    const salvar = async ()=>{
      const b = $("salvar"); b.disabled = true; msg("");
      try{
        const cfg = coletar(), r = await Api.call({ acao:"tv_cfg_salvar", config:cfg });
        if(!r || !r.ok) throw new Error((r && r.erro) || "Não foi possível salvar.");
        this.cfg = this.mesclar(this.DEF, cfg); toast("Parâmetros do Painel TV salvos."); msg("Parâmetros salvos. O painel aberto na TV se ajusta em até 5 minutos.", true);
        return true;
      }catch(e){ msg(e.message); return false; }
      finally{ b.disabled = false; }
    };
    $("salvar").addEventListener("click", salvar);
    $("padrao").addEventListener("click", ()=>{ this.cfg = this.mesclar(this.DEF, {}); this.renderPaneLocal(); });
    $("abrir").addEventListener("click", async ()=>{ if(await salvar()) this.tocar(); });
  },
  renderPaneLocal(){ // restaura o padrão apenas no formulário (não grava até clicar em Salvar)
    const guardado = this.cfg; this.cfg = guardado;
    const antes = this.cfgCarregar; this.cfgCarregar = async ()=>false;
    this.renderPane().finally(()=>{ this.cfgCarregar = antes; });
  },

  /** chamado depois de cada carga de dados: redesenha o painel aberto */
  atualizar(){
    if(!this.aberto || !this.root) return;
    const n = new Date(), p = v=>String(v).padStart(2,"0"); this._upd = `${p(n.getHours())}:${p(n.getMinutes())}`;
    this._ver++; this._cacheMes = {};   // dados novos: refaz o histórico de sequência
    Promise.all([this.cfgCarregar(), this.fotosCarregar()]).then(()=> this.desenhar());
  }
};
window.PainelTV = PainelTV;

/* =========================================================================
   Painel de TV — ranking de repositores em tela cheia (botão Play, no topo).
   Usa os mesmos números da Comissão (pontos + % qualidade), sem filtros manuais.
   Abre na 2ª tela quando existir (Window Management API); senão, na tela atual.
   ========================================================================= */
const PainelTV = {
  aberto:false, root:null, _t:[], _dados:null, _id:0,
  MESES: ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],

  /* ------------------------------ dados ------------------------------ */
  pronto(){ return !!(window.APP_STATE && APP_STATE.ready && APP_STATE.processed && Production.maxDataDate()); },
  nomeCurto(n){ const p = String(n||"").trim().toLowerCase().split(/\s+/).filter(Boolean).slice(0,2); return p.map(x=>x.charAt(0).toUpperCase()+x.slice(1)).join(" ") || "—"; },
  idx(p, q){ return p * (q === null || q === undefined ? 1 : q/100); },
  calc(){
    const max = Production.maxDataDate(); if(!max) return null;
    const hoje = dateOnly(max), m0 = new Date(hoje.getFullYear(), hoje.getMonth(), 1), fim0 = new Date(hoje.getFullYear(), hoje.getMonth()+1, 0);
    const m1 = addMonths(m0,-1), fim1 = new Date(m1.getFullYear(), m1.getMonth()+1, 0), m3 = addMonths(m0,-3);
    const mapa = (a,b)=>{ const mp = new Map(); try{ getComissaoTableData(a,b).forEach(e=>mp.set(e.codKey,e)); }catch(e){} return mp; };
    const ant = mapa(m1, fim1), tri = mapa(m3, fim1), atu = mapa(m0, hoje);
    // meses (dos 3 anteriores) que realmente têm produção: a média não pode contar mês vazio
    const tem = new Set(); APP_STATE.processed.p8460.forEach(r=>{ if(r.tipoos===58 && r.dtinicio) tem.add(r.dtinicio.getFullYear()*12+r.dtinicio.getMonth()); });
    const n3 = [-3,-2,-1].map(k=>{ const d = addMonths(m0,k); return d.getFullYear()*12+d.getMonth(); }).filter(k=>tem.has(k)).length || 1;
    const dec = diasUteisEntre(m0, hoje) || 1, totMes = diasUteisEntre(m0, fim0) || dec, totAnt = diasUteisEntre(m1, fim1) || 1;
    // quadro atual (repositores)
    const team = APP_STATE.currentTeam, reg = APP_STATE.nameRegistry;
    let base = new Set(Array.from(atu.keys()));
    if(team && team.members){ team.members.forEach(m=>{ if(!team.cargoDisponivel || m.cargo === "REPOSITOR") base.add(m.codKey); }); }
    const linhas = [];
    base.forEach(cod=>{
      const a = ant.get(cod), t = tri.get(cod), c = atu.get(cod);
      const nome = (reg && reg.get(cod)) || (c && c.nome) || (a && a.nome) || (t && t.nome) || cod;
      const pAnt = a ? a.pontos : 0, p3 = t ? t.pontos / n3 : 0, pAtu = c ? c.pontos : 0;
      const ritmo = pAtu / dec, ritmoAnt = pAnt / totAnt;
      linhas.push({ cod, nome:this.nomeCurto(nome),
        pAnt, qAnt:a ? a.qualidade : null, p3, q3:t ? t.qualidade : null, pAtu, qAtu:c ? c.qualidade : null,
        proj:Math.round(ritmo * totMes), ritmo, delta: ritmoAnt > 0 ? (ritmo/ritmoAnt - 1)*100 : null, estAtu: !!(c && c.qualidadeEstimada) });
    });
    linhas.forEach(l=>{ l.iAnt = this.idx(l.pAnt, l.qAnt); l.i3 = this.idx(l.p3, l.q3); l.iAtu = this.idx(l.pAtu, l.qAtu); });
    const top = (campo, ind)=> linhas.filter(l=>l[campo] > 0).sort((x,y)=>y[ind]-x[ind] || y[campo]-x[campo]).slice(0,3);
    const tabela = linhas.filter(l=> l.pAtu>0 || l.pAnt>0 || l.p3>0).sort((x,y)=>y.iAtu-x.iAtu || y.pAtu-x.pAtu);
    const pod = top("pAnt","iAnt");
    const medal = new Map(); pod.forEach((l,i)=> medal.set(l.cod, i+1));
    const rot3 = [-3,-1].map(k=>{ const d = addMonths(m0,k); return this.MESES[d.getMonth()].slice(0,3); }).join(" a ");
    return { ref:hoje, mesAnt:`${this.MESES[m1.getMonth()]}/${m1.getFullYear()}`, mesAtu:`${this.MESES[m0.getMonth()]}`, rot3, dec, totMes,
      podio:pod, trimestre:top("p3","i3"), tabela, medal };
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
  av(n){ return `<span class="tv-av" style="--h:${this.cor(n)}">${this.iniciais(n)}</span>`; },
  q(v, est){ return v === null || v === undefined ? "—" : fmtNum(v,1) + "%" + (est ? "*" : ""); },
  qcls(v){ return v === null || v === undefined ? "" : v >= 90 ? "ok" : v >= 70 ? "mid" : "bad"; },
  n(v){ return fmtNum(Math.round(v)); },

  /* ------------------------------ tela ------------------------------ */
  html(d){
    const f = d.ref, dd = `${String(f.getDate()).padStart(2,"0")}/${String(f.getMonth()+1).padStart(2,"0")}/${f.getFullYear()}`;
    const ordem = [d.podio[1], d.podio[0], d.podio[2]];             // 2º - 1º - 3º (1º no centro, mais alto)
    const card = (l, pos)=> !l ? `<div class="tv-pc vazio"></div>` : `<div class="tv-pc p${pos}">
        ${this.medalha(pos, pos===1 ? 118 : 96)}
        <div class="tv-pn">${this.h(l.nome)}</div>
        <div class="tv-pm"><div><b>${this.n(l.pAnt)}</b><span>pontos</span></div><div class="${this.qcls(l.qAnt)}"><b>${this.q(l.qAnt)}</b><span>qualidade</span></div></div></div>`;
    const tri = d.trimestre.map((l,i)=>`<div class="tv-tr"><span class="tv-trm">${this.medalha(i+1, 40)}</span>${this.av(l.nome)}
        <div class="tv-trn"><strong>${this.h(l.nome)}</strong><small>média de ${this.n(l.p3)} pontos/mês</small></div>
        <div class="tv-trq ${this.qcls(l.q3)}"><b>${this.q(l.q3)}</b><small>qualidade</small></div></div>`).join("") || `<div class="tv-vazio">Sem dados no período.</div>`;
    const linhas = d.tabela.map((l,i)=>{ const m = d.medal.get(l.cod);
      const dl = l.delta === null ? "" : `<span class="tv-dl ${l.delta>=0?"up":"dn"}">${l.delta>=0?"▲":"▼"} ${fmtNum(Math.abs(l.delta),0)}%</span>`;
      return `<tr><td class="c pos">${i+1}</td><td class="nm"><div class="nmw">${this.av(l.nome)}<span>${this.h(l.nome)}</span>${m?`<i class="tv-mm">${this.medalha(m, 18)}</i>`:""}</div></td>
        <td class="r">${this.n(l.p3)}</td><td class="r ${this.qcls(l.q3)}">${this.q(l.q3)}</td>
        <td class="r">${this.n(l.pAnt)}</td><td class="r ${this.qcls(l.qAnt)}">${this.q(l.qAnt)}</td>
        <td class="r strong">${this.n(l.pAtu)}</td><td class="r ${this.qcls(l.qAtu)}">${this.q(l.qAtu, l.estAtu)}</td>
        <td class="r strong proj">${this.n(l.proj)}</td><td class="r rit">${fmtNum(l.ritmo,1)} ${dl}</td></tr>`; }).join("");
    return `<div class="tv-wrap">
      <header class="tv-top"><img src="logo-branco.png" alt="" class="tv-logo"><div class="tv-tt"><h1>Ranking de Repositores</h1><p>Dados até ${dd} · ${d.dec} dia(s) útil(eis) no mês</p></div>
        <div class="tv-clock"><b id="tv-hora"></b><small id="tv-upd"></small></div><button type="button" class="tv-x" id="tv-x" title="Fechar (Esc)">${Icons.svg("x",22)}</button></header>
      <section class="tv-hero">
        <div class="tv-box tv-podio"><h2><span>Destaques de ${this.h(d.mesAnt)}</span><small>mês anterior</small></h2>
          <div class="tv-pg">${card(ordem[0],2)}${card(ordem[1],1)}${card(ordem[2],3)}</div></div>
        <div class="tv-box tv-tri"><h2><span>Melhores dos últimos 3 meses</span><small>${this.h(d.rot3)}</small></h2>${tri}</div>
      </section>
      <div class="tv-obs">${Icons.svg("info",22)}<p>Para <b>1º, 2º e 3º lugar</b> avaliamos a <b>pontuação</b> e a <b>qualidade da rua</b> juntas: quanto maior a pontuação e maior o % de qualidade, melhor a posição.</p></div>
      <section class="tv-box tv-lista"><div class="tv-lh"><img src="logo-branco.png" alt="" class="tv-logo2"><h2>Quadro completo <small>— ordenado pelo mês atual (pontos × qualidade)</small></h2></div>
        <div class="tv-th"><table><thead><tr><th class="c">#</th><th>Colaborador</th><th class="r">Média 3 meses<small>pontos/mês</small></th><th class="r">Qual. 3 meses</th><th class="r">${this.h(d.mesAnt.split("/")[0])}<small>pontos</small></th><th class="r">Qual. mês ant.</th><th class="r">${this.h(d.mesAtu)}<small>pontos até hoje</small></th><th class="r">Qual. mês atual</th><th class="r">Projetado<small>fim do mês</small></th><th class="r">Ritmo<small>pontos/dia útil</small></th></tr></thead></table></div>
        <div class="tv-sc" id="tv-sc"><table><tbody>${linhas || `<tr><td colspan="10" class="tv-vazio">Sem dados.</td></tr>`}</tbody></table></div>
        <div class="tv-rod">* qualidade estimada pela média da equipe (sem auditoria no período) · Projeção = ritmo por dia útil × dias úteis do mês</div></section></div>`;
  },
  h(s){ return typeof escapeHtml === "function" ? escapeHtml(String(s)) : String(s); },

  desenhar(){
    if(!this.root) return;
    let d = null; try{ d = this.calc(); }catch(e){ console.error(e); }
    this._dados = d;
    if(!d){ this.root.innerHTML = `<div class="tv-wrap"><div class="tv-vazio">Sem dados para o painel. Atualize os dados e tente de novo.</div><button type="button" class="tv-x" id="tv-x">${Icons.svg("x",22)}</button></div>`; }
    else this.root.innerHTML = this.html(d);
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
    }, 45);
  },

  /* ------------------------------ abrir / fechar ------------------------------ */
  async tocar(){
    if(this.aberto){ this.fechar(); return; }
    if(!this.pronto()){ toast("Carregue os dados primeiro (Atualizar dados).", "error"); return; }
    this.aberto = true; this._upd = null;
    try{ if(window.AuditOnline && AuditOnline.rows === null) await AuditOnline.load(); }catch(e){}
    const r = document.createElement("div"); r.id = "tv-root"; r.setAttribute("role","dialog"); r.setAttribute("aria-label","Painel de pontuação");
    document.body.appendChild(r); this.root = r; this.desenhar();
    this._t.push(setInterval(()=> this.relogio(), 20000));
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
  /** chamado depois de cada carga de dados: redesenha o painel aberto */
  atualizar(){
    if(!this.aberto || !this.root) return;
    const n = new Date(), p = v=>String(v).padStart(2,"0"); this._upd = `${p(n.getHours())}:${p(n.getMinutes())}`;
    this.desenhar();
  }
};
window.PainelTV = PainelTV;

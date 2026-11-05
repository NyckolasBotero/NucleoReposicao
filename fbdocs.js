/* =========================================================================
   Núcleo Reposição — Folhas de Feedback para impressão (A4 vertical, para o colaborador assinar)
   Dois formatos atrás do mesmo botão (Feedbacks e Advertências > Download Feedback):
     · "nc"  — Feedback por Não Conformidades: NCs discriminadas por motivo, regra de contagem,
               situação (NC → feedback → advertência → suspensão), presença, qualidade, avaliações e assinaturas
     · "prod" — Feedback de Produção e Qualidade: o antigo (histórico de O.S., gráficos de evolução/projeção,
               acompanhamento da meta) agora vertical, com o mesmo bloco de presença, qualidade, NCs e regras
   Regra de NC: 1 NC = 1 colaborador + 1 data + 1 rua (20 erros na rua 34 e 10 na 33 no mesmo dia = 2 NC).
   Depende de app.js (FeedbackDoc, Export, Attendance), nc.js (NC) e feedbacks.js (FeedbackAdv).
   ========================================================================= */
const FeedbackFolha = {
  PW: 794, PH: 1123,
  STATUS: [["PRESENTE","Presente"],["SEGUNDO_TURNO","Segundo turno"],["FALTA","Falta"],["ATESTADO","Atestado"],["FERIAS","Férias"],["FOLGA","Folga"],["SUSPENSAO","Suspensão"]],

  /* ------------------------------ seleção ------------------------------ */
  escolher(emps){
    if(!emps || !emps.length) return;
    UI.openModal(`<h3 style="margin-top:0">Download do Feedback (PDF)</h3>
      <p class="small-muted" style="margin-top:0">${emps.length} funcionário(s) selecionado(s). Cada um sai em folha A4 vertical, pronta para imprimir e assinar.</p>
      <div class="adm-form" style="grid-template-columns:1fr">
        <label style="flex-direction:row;gap:10px;align-items:flex-start;text-transform:none;letter-spacing:0;font-size:14px;font-weight:600"><input type="radio" name="fbf-tipo" value="nc" checked style="margin-top:3px"><span>Feedback por Não Conformidades<br><span class="small-muted" style="font-weight:400">NCs por motivo, regra de contagem, advertências e suspensões, presença, qualidade e avaliações.</span></span></label>
        <label style="flex-direction:row;gap:10px;align-items:flex-start;text-transform:none;letter-spacing:0;font-size:14px;font-weight:600"><input type="radio" name="fbf-tipo" value="prod" style="margin-top:3px"><span>Feedback de Produção e Qualidade<br><span class="small-muted" style="font-weight:400">Histórico de O.S., gráficos de evolução e projeção, meta, presença, qualidade e avaliações.</span></span></label>
        <label>Período dos dados<select id="fbf-per"><option value="3m">Últimos 3 meses</option><option value="mes">Mês atual</option><option value="tudo">Todo o histórico</option></select></label>
      </div>
      <div class="adm-actions"><button class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button><button class="btn btn-primary" id="fbf-go">Gerar PDF</button></div>`);
    document.getElementById("fbf-go").addEventListener("click", ()=>{
      const tipo = (document.querySelector("input[name=fbf-tipo]:checked")||{}).value || "nc";
      const per = document.getElementById("fbf-per").value;
      UI.closeModal();
      if(tipo === "nc") this.gerarNC(emps, per); else FeedbackDoc.generateMultiple(emps, { periodo:per });
    });
  },

  /* ------------------------------ dados ------------------------------ */
  periodo(per){
    let ref = null; try{ ref = Production.maxDataDate(); }catch(e){}
    const fim = dateOnly(ref || new Date());
    let ini = null;
    if(per === "mes") ini = new Date(fim.getFullYear(), fim.getMonth(), 1);
    else if(per !== "tudo") ini = addMonths(new Date(fim.getFullYear(), fim.getMonth(), 1), -2);
    const label = ini ? `${fmtDateBR(ini)} a ${fmtDateBR(fim)}` : `Todo o histórico até ${fmtDateBR(fim)}`;
    return { ini, fim, label, per };
  },
  dentro(d, P){ const x = dateOnly(d); return (!P.ini || x >= P.ini) && x <= P.fim; },

  presenca(codKey, P){
    const rows = ((window.APP_STATE.processed.quadro)||[]).filter(r=>r.codKey===codKey && r.data && this.dentro(r.data, P));
    const counts = {}; rows.forEach(r=>{ counts[r.bucket] = (counts[r.bucket]||0) + 1; });
    const base = (counts.PRESENTE||0) + (counts.SEGUNDO_TURNO||0), den = base + (counts.FALTA||0);
    return { counts, total:rows.length, pct: den>0 ? base/den*100 : null };
  },

  /** NCs do colaborador no período (1 por data + rua) e contagem por motivo */
  ncDados(codKey, P){
    const all = (typeof NC !== "undefined" && NC.carregado()) ? NC.grupos().filter(g=>g.codKey===codKey) : [];
    const lista = all.filter(g=>this.dentro(g.data, P));
    const porTipo = NC.TIPOS.map(t=>({ tipo:t.key, label:t.label, curto:t.curto, nc: lista.filter(g=>g.tipos[t.key]).length, erros: lista.reduce((n,g)=>n+(g.tipos[t.key]||0),0) }));
    const soma = porTipo.reduce((n,x)=>n+x.nc,0);
    porTipo.forEach(x=>{ x.pct = soma ? x.nc/soma*100 : 0; });
    return { all, lista, porTipo, totalNC: lista.length,
      errosRua: lista.filter(g=>g.origem==="RUA").reduce((n,g)=>n+g.qtd,0), errosRet: lista.filter(g=>g.origem==="RETORNO").reduce((n,g)=>n+g.qtd,0),
      ncRua: lista.filter(g=>g.origem==="RUA").length, ncRet: lista.filter(g=>g.origem==="RETORNO").length };
  },

  /** situação por motivo: NC → feedback → advertência → suspensão (histórico completo do colaborador) */
  situacao(codKey, nd, P){
    const mk = (m)=> FeedbackAdv.mk(m);
    const fbs = FeedbackAdv.feedbacks().filter(r=>r.codKey===codKey), ads = FeedbackAdv.advertencias().filter(r=>r.codKey===codKey), sps = FeedbackAdv.suspensoesDisc().filter(r=>r.codKey===codKey);
    const motivos = new Map();
    NC.TIPOS.forEach(t=> motivos.set(mk(t.motivo), { motivo:t.motivo, tipo:t.key }));
    fbs.concat(ads, sps).forEach(r=>{ const k = mk(r.motivo); if(!motivos.has(k)) motivos.set(k, { motivo:r.motivo || "Sem motivo", tipo:null }); });
    const linhas = [];
    motivos.forEach((info, chave)=>{
      const f = fbs.filter(r=>mk(r.motivo)===chave).sort((a,b)=>b.data-a.data), a = ads.filter(r=>mk(r.motivo)===chave), s = sps.filter(r=>mk(r.motivo)===chave);
      const ncPer = info.tipo ? (nd.porTipo.find(x=>x.tipo===info.tipo)||{nc:0}).nc : 0;
      const kfb = FeedbackAdv.fbPorAdv(chave), ehNC = !!info.tipo;
      const ultFb = f.length ? dateOnly(f[0].data) : null;
      const ncDesde = ehNC ? nd.all.filter(g=>g.tipos[info.tipo] && (!ultFb || dateOnly(g.data) > ultFb)).length : 0;
      if(!ncPer && !f.length && !a.length && !s.length && !ncDesde) return;
      const fbSobra = f.length - a.length * kfb, advSobra = a.length - s.length * FB_ADV_PARA_SUSP;
      let sit, cor = "#4a5568";
      if(advSobra >= FB_ADV_PARA_SUSP){ sit = "Solicitar suspensão"; cor = "#d64545"; }
      else if(fbSobra >= kfb){ sit = "Gerar advertência"; cor = "#d64545"; }
      else if(ehNC && ncDesde >= NC_POR_FB){ sit = "Gerar feedback"; cor = "#e08a1f"; }
      else if(ehNC && ncDesde > 0){ sit = `Falta ${NC_POR_FB-ncDesde} NC p/ feedback`; }
      else if(f.length || a.length){ sit = "Em acompanhamento"; }
      else sit = "—";
      linhas.push({ motivo:info.motivo, ehNC, ncPer, ncDesde, fb:f.length, adv:a.length, susp:s.length, kfb, sit, cor });
    });
    return { linhas, fb:fbs.length, adv:ads.length, susp:sps.length };
  },

  /* ------------------------------ blocos HTML ------------------------------ */
  CSS: `<style>
    .fbf *{box-sizing:border-box}
    .fbf{font-family:-apple-system,Segoe UI,Arial,sans-serif;color:#1f2937;background:#fff;font-size:11px;line-height:1.35}
    .fbf h2{margin:0 0 5px;font-size:12px;font-weight:800;color:#123a6b;border-bottom:1.5px solid #123a6b;padding-bottom:3px}
    .fbf .sec{margin-bottom:11px}
    .fbf table{width:100%;border-collapse:collapse}
    .fbf td,.fbf th{border:1px solid #c3ccd6;padding:4px 6px;font-size:10.5px;vertical-align:middle}
    .fbf th{background:#123a6b;color:#fff;text-align:left;font-weight:700;font-size:10px}
    .fbf td.l{background:#eaeef3;font-weight:700;color:#123a6b;width:19%}
    .fbf .cards{display:flex;gap:7px}
    .fbf .card{flex:1;border:1px solid #dde3ea;border-left:3px solid #2f6fce;border-radius:5px;padding:6px 8px;background:#fff}
    .fbf .card b{display:block;font-size:8.5px;color:#7a8798;text-transform:uppercase;letter-spacing:.3px}
    .fbf .card i{display:block;font-style:normal;font-size:17px;font-weight:800;color:#123a6b;line-height:1.2}
    .fbf .card u{display:block;text-decoration:none;font-size:8.5px;color:#7a8798}
    .fbf .num{text-align:right;white-space:nowrap}
    .fbf .bar{height:8px;background:#eaeef3;border-radius:4px;overflow:hidden}
    .fbf .bar span{display:block;height:100%;background:#2f6fce}
    .fbf .rule{background:#f0f6ff;border:1px solid #c3d6f5;border-left:4px solid #2f6fce;border-radius:5px;padding:7px 10px;font-size:10px;color:#2f4e7a}
    .fbf .rule li{margin:1px 0}
    .fbf .scale td{text-align:center;font-weight:800;font-size:12px;padding:5px 0;width:9.09%}
    .fbf .foot{position:absolute;left:30px;right:30px;bottom:14px;font-size:8.5px;color:#7a8798;display:flex;justify-content:space-between;border-top:1px solid #dde3ea;padding-top:4px}
  </style>`,
  pagina(html, n, total, doc){
    const el = document.createElement("div");
    el.className = "fbf keep-light";
    el.style.cssText = `position:fixed;left:-99999px;top:0;width:${this.PW}px;height:${this.PH}px;padding:26px 30px;overflow:hidden;`;
    el.innerHTML = this.CSS + html + `<div class="foot"><span>Documento gerado pelo Núcleo Reposição em ${fmtDateBR(new Date())} · ${escapeHtml(doc)}</span><span>Página ${n} de ${total}</span></div>`;
    document.body.appendChild(el);
    return el;
  },
  cab(titulo, sub, doc){
    return `<table style="margin-bottom:8px"><tr>
      <td style="width:104px;text-align:center;padding:5px"><img src="data:image/png;base64,${LOGO_BASE64}" style="height:44px;width:auto"></td>
      <td style="background:#eaeef3;padding:7px 12px"><div style="font-size:17px;font-weight:800;color:#123a6b">${titulo}</div><div style="font-size:10px;color:#4a5568">${sub}</div></td>
      <td style="width:150px;text-align:right;font-size:9px;color:#7a8798;line-height:1.5">Nº ${escapeHtml(doc)}<br>Emitido em ${fmtDateBR(new Date())}</td></tr></table>`;
  },
  ident(emp, P){
    return `<div class="sec"><h2>Identificação</h2><table>
      <tr><td class="l">Colaborador</td><td><strong>${escapeHtml(emp.nome||"-")}</strong></td><td class="l">Matrícula</td><td>${escapeHtml(emp.cod||"-")}</td></tr>
      <tr><td class="l">Avaliador</td><td>${escapeHtml(AVALIADOR_FIXO.nome)}</td><td class="l">Matrícula</td><td>${escapeHtml(AVALIADOR_FIXO.codigo)}</td></tr>
      <tr><td class="l">Período analisado</td><td colspan="3">${escapeHtml(P.label)}</td></tr></table></div>`;
  },
  corQ(v){ return v===null||v===undefined ? "#7a8798" : v>=90 ? "#1a9c62" : v>=70 ? "#e08a1f" : "#d64545"; },
  card(rot, val, sub, cor){ return `<div class="card" style="border-left-color:${cor||'#2f6fce'}"><b>${rot}</b><i style="color:${cor||'#123a6b'}">${val}</i>${sub?`<u>${sub}</u>`:""}</div>`; },
  fq(v){ return v===null||v===undefined ? "s/ auditoria" : fmtNum(v,1)+"%"; },

  blocoQualidade(emp, nd){
    const cq = this.corQ(emp.qualidade), cr = this.corQ(emp.retornoQual);
    return `<div class="sec"><h2>Qualidade — resumo das auditorias</h2><div class="cards">
      ${this.card("Qualidade · Ruas", this.fq(emp.qualidade), (emp.auditorias||0)+" auditoria(s) · "+nd.ncRua+" NC · "+nd.errosRua+" erro(s) apontado(s)", cq)}
      ${this.card("Qualidade · Retornos", this.fq(emp.retornoQual), (emp.retornoAud||0)+" retorno(s) auditado(s) · "+nd.errosRet+" erro(s) encontrado(s)", cr)}
      ${(emp.qualMeses||[]).map(q=> this.card("Ruas "+q.rot, this.fq(q.qualidade), q.auditorias+" auditoria(s)", this.corQ(q.qualidade))).join("")}
    </div></div>`;
  },
  blocoPresenca(pr){
    const linhas = this.STATUS.filter(([k])=>pr.counts[k]).map(([k,l])=>{ const n = pr.counts[k], p = pr.total ? n/pr.total*100 : 0;
      return `<tr><td>${l}</td><td class="num">${n}</td><td class="num">${fmtNum(p,1)}%</td><td style="width:38%"><div class="bar"><span style="width:${p}%;background:${k==="FALTA"||k==="SUSPENSAO"?"#d64545":k==="PRESENTE"||k==="SEGUNDO_TURNO"?"#1a9c62":"#8a8f98"}"></span></div></td></tr>`; }).join("");
    return `<div class="sec"><h2>Presença no período</h2><div style="display:flex;gap:10px;align-items:flex-start">
      <div style="width:170px">${this.card("% Presença", pr.pct===null?"—":fmtNum(pr.pct,1)+"%", pr.total+" registro(s) na chamada", pr.pct===null?"#7a8798":pr.pct>=95?"#1a9c62":pr.pct>=90?"#e08a1f":"#d64545")}
        <div style="font-size:8.5px;color:#7a8798;margin-top:3px">% Presença = (presente + segundo turno) ÷ (presente + segundo turno + faltas). Folga, férias e atestado não entram no cálculo.</div></div>
      <table style="flex:1"><thead><tr><th>Ocorrência</th><th class="num">Dias</th><th class="num">% do total</th><th></th></tr></thead><tbody>${linhas || `<tr><td colspan="4" style="color:#7a8798">Sem registros de chamada no período.</td></tr>`}</tbody></table></div></div>`;
  },
  blocoTipos(nd){
    return `<div class="sec"><h2>Não conformidades por motivo (1 NC = 1 data + 1 rua)</h2><table><thead><tr><th>Motivo</th><th class="num">NC</th><th class="num">% do total</th><th class="num">Erros apontados</th><th style="width:30%"></th></tr></thead><tbody>
      ${nd.porTipo.map(x=>`<tr><td>${x.label}</td><td class="num"><strong>${x.nc}</strong></td><td class="num">${fmtNum(x.pct,1)}%</td><td class="num">${x.erros}</td><td><div class="bar"><span style="width:${x.pct}%;background:#d64545"></span></div></td></tr>`).join("")}
      <tr><td><strong>Total de NC</strong></td><td class="num"><strong>${nd.totalNC}</strong></td><td class="num">100%</td><td class="num">${nd.errosRua+nd.errosRet}</td><td></td></tr></tbody></table>
      <div style="font-size:8.5px;color:#7a8798;margin-top:3px">Uma NC que reúne mais de um motivo conta uma vez em cada motivo; o total de NC conta cada data + rua uma única vez.</div></div>`;
  },
  blocoDetalhe(nd, max){
    const lista = nd.lista.slice().sort((a,b)=>b.data-a.data), vis = lista.slice(0, max), resto = lista.length - vis.length;
    const mot = (g)=> Object.keys(g.tipos).map(k=> NC.tipo(k).curto + (g.tipos[k]>1 ? " ×"+g.tipos[k] : "")).join(", ");
    const itens = (g)=>{ const it = g.itens.slice(0,2).map(i=> escapeHtml([i.produto, (i.desc||"").slice(0,22)].filter(Boolean).join(" – "))).filter(Boolean); return it.join("; ") + (g.itens.length>2 ? ` (+${g.itens.length-2})` : ""); };
    return `<div class="sec"><h2>Não conformidades registradas</h2><table><thead><tr><th style="width:62px">Data</th><th style="width:78px">Local</th><th>Motivo(s)</th><th class="num" style="width:44px">Erros</th><th>Itens (exemplos)</th></tr></thead><tbody>
      ${vis.map(g=>`<tr><td>${fmtDateBR(g.data)}</td><td>${g.origem==="RETORNO"?"Retorno"+(g.rua?" · rua "+escapeHtml(g.rua):""):"Rua "+escapeHtml(g.rua||"?")}</td><td>${mot(g)}</td><td class="num">${g.qtd}</td><td style="font-size:9.5px">${itens(g)}</td></tr>`).join("") || `<tr><td colspan="5" style="color:#7a8798">Nenhuma não conformidade no período.</td></tr>`}
      </tbody></table>${resto>0 ? `<div style="font-size:9px;color:#7a8798;margin-top:3px">+ ${resto} NC mais antiga(s) no período, detalhada(s) na aba Gestão &gt; Auditoria do sistema.</div>` : ""}</div>`;
  },
  blocoRegra(){
    return `<div class="rule"><strong>Como contamos e como as penalizações acontecem</strong><ul style="margin:3px 0 0 14px;padding:0">
      <li><strong>Não conformidade (NC):</strong> 1 por colaborador, data e rua. Várias falhas na mesma rua no mesmo dia contam como 1 NC (ex.: 20 erros na rua 34 e 10 na rua 33 no mesmo dia = 2 NC).</li>
      <li><strong>Feedback:</strong> ${NC_POR_FB} NC pelo mesmo motivo geram 1 feedback.</li>
      <li><strong>Advertência:</strong> ${NC_FB_PARA_ADV} feedbacks pelo mesmo motivo de NC geram 1 advertência (demais motivos: ${FB_A_CADA} feedbacks).</li>
      <li><strong>Suspensão:</strong> ${FB_ADV_PARA_SUSP} advertências pelo mesmo motivo geram solicitação de suspensão.</li></ul></div>`;
  },
  blocoSituacao(sit){
    return `<div class="sec"><h2>Seu resumo: NC, feedbacks, advertências e suspensões</h2>
      <div class="cards" style="margin-bottom:6px">${this.card("Feedbacks", sit.fb, "no histórico")}${this.card("Advertências", sit.adv, "no histórico", sit.adv?"#e08a1f":"#2f6fce")}${this.card("Suspensões", sit.susp, "no histórico", sit.susp?"#d64545":"#2f6fce")}</div>
      <table><thead><tr><th>Motivo</th><th class="num">NC (período)</th><th class="num">NC desde o últ. feedback</th><th class="num">Feedbacks</th><th class="num">Advertências</th><th class="num">Suspensões</th><th>Situação</th></tr></thead><tbody>
      ${sit.linhas.map(l=>`<tr><td>${escapeHtml(l.motivo)}</td><td class="num">${l.ehNC?l.ncPer:"—"}</td><td class="num">${l.ehNC?l.ncDesde+"/"+NC_POR_FB:"—"}</td><td class="num">${l.fb}/${l.kfb}</td><td class="num">${l.adv}/${FB_ADV_PARA_SUSP}</td><td class="num">${l.susp}</td><td style="color:${l.cor};font-weight:700">${l.sit}</td></tr>`).join("") || `<tr><td colspan="7" style="color:#7a8798">Sem NC, feedbacks, advertências ou suspensões registrados.</td></tr>`}
      </tbody></table>
      <div style="font-size:8.5px;color:#7a8798;margin-top:3px">Feedbacks x/${NC_FB_PARA_ADV} (ou ${FB_A_CADA}) = andamento rumo à advertência · Advertências x/${FB_ADV_PARA_SUSP} = andamento rumo à suspensão.</div></div>`;
  },
  escala(titulo, cor, texto){
    let c = ""; for(let i=0;i<=10;i++) c += `<td style="border-color:${cor}">${i}</td>`;
    return `<div style="margin-bottom:7px"><div style="background:${cor};color:#fff;padding:3px 9px;font-size:10px;font-weight:800">${titulo}</div>
      <div style="font-size:8.5px;color:#4a5568;font-style:italic;margin:2px 0">${texto}</div><table class="scale"><tr>${c}</tr></table></div>`;
  },
  caixa(rot, alt){ return `<table style="margin-bottom:7px"><tr><td class="l" style="width:auto">${rot}</td></tr><tr><td style="height:${alt||34}px"></td></tr></table>`; },
  assinaturas(emp){
    const bl = (nome, papel, mat)=>`<div style="flex:1"><div style="border-bottom:1px solid #333;height:26px"></div><div style="font-size:10px;font-weight:700;margin-top:3px">${papel}</div><div style="font-size:9.5px">${escapeHtml(nome)}</div><div style="font-size:8.5px;color:#7a8798">${mat?"Matrícula "+escapeHtml(mat)+" · ":""}Data: ___/___/______</div></div>`;
    return `<div style="display:flex;gap:30px;margin-top:6px">${bl(emp.nome||"Colaborador","Colaborador",emp.cod)}${bl(AVALIADOR_FIXO.nome,"Avaliador / Encarregado",AVALIADOR_FIXO.codigo)}</div>`;
  },
  termo(emp, P, extra){
    return `<div style="background:#fff7ec;border:1px solid #f0d3a8;border-radius:5px;padding:7px 10px;font-size:10px;margin-bottom:8px"><strong>Termo de ciência.</strong> ${extra||""} Declaro ter recebido este feedback, com o resumo das minhas presenças, auditorias e não conformidades do período ${escapeHtml(P.label)}, e estar ciente das regras de contagem e das etapas de feedback, advertência e suspensão descritas nesta folha. Este documento tem finalidade de orientação, correção do processo e prevenção de reincidência.</div>`;
  },
  docNum(tipo, emp){ const d = new Date(); return `FB-${tipo}-${String(d.getFullYear()).slice(2)}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}-${emp.cod||"0"}`; },

  /* ------------------------------ Feedback por Não Conformidades ------------------------------ */
  paginasNC(emp, P){
    const nd = this.ncDados(emp.codKey, P), pr = this.presenca(emp.codKey, P), sit = this.situacao(emp.codKey, nd, P), doc = this.docNum("NC", emp);
    const resumoTxt = nd.totalNC ? `${nd.totalNC} não conformidade(s) no período (${nd.porTipo.filter(x=>x.nc).map(x=>x.curto+": "+x.nc).join(" · ")}).` : "Nenhuma não conformidade no período.";
    const p1 = this.cab("Feedback — Não Conformidades", "Histórico de não conformidades, regras e situação do colaborador", doc)
      + this.ident(emp, P)
      + `<div class="sec"><div class="cards">${this.card("Não conformidades", nd.totalNC, nd.ncRua+" de rua · "+nd.ncRet+" de retorno", nd.totalNC?"#d64545":"#1a9c62")}${this.card("Feedbacks", sit.fb, "no histórico")}${this.card("Advertências", sit.adv, "no histórico", sit.adv?"#e08a1f":"#2f6fce")}${this.card("Suspensões", sit.susp, "no histórico", sit.susp?"#d64545":"#2f6fce")}</div></div>`
      + this.blocoTipos(nd) + this.blocoQualidade(emp, nd) + this.blocoPresenca(pr);
    const p2 = this.blocoDetalhe(nd, 11) + this.blocoRegra() + `<div style="height:9px"></div>` + this.blocoSituacao(sit)
      + this.termo(emp, P, resumoTxt)
      + this.caixa("Resumo do assunto tratado / plano de ação combinado:", 40)
      + this.escala("AUTOAVALIAÇÃO — preenchida pelo colaborador", "#1a9c62", "Marque de 0 a 10 a nota que representa o seu desempenho e a sua atenção à qualidade no período.")
      + this.escala("AVALIAÇÃO DO GESTOR — preenchida por " + escapeHtml(AVALIADOR_FIXO.nome), "#e08a1f", "Marque de 0 a 10 a nota que representa a avaliação do desempenho e da qualidade do colaborador no período.")
      + this.assinaturas(emp);
    return [this.pagina(p1, 1, 2, doc), this.pagina(p2, 2, 2, doc)];
  },

  /* ------------------------------ Feedback de Produção e Qualidade (vertical) ------------------------------ */
  paginasProducao(emp, hist, snap, idx, ind, P){
    const nd = this.ncDados(emp.codKey, P), pr = this.presenca(emp.codKey, P), sit = this.situacao(emp.codKey, nd, P), doc = this.docNum("PD", emp);
    const exec = snap.exec, cmp = snap.cmp, proj = snap.proj;
    let meta = "";
    if(ind){
      const m = individualState.meta, corte = individualState.linhaDeCorteMes, nec = ind.mediaNecessaria!==null ? fmtNum(ind.mediaNecessaria,1) : "—";
      const msg = ind.projetadoRitmoAtual >= m ? `🎯 No ritmo atual, a projeção é de <strong style="color:#1a9c62">${fmtNum(ind.projetadoRitmoAtual)} O.S.</strong> no mês — acima da meta. Continue assim.`
        : ind.projetadoRitmoAtual >= corte ? `💪 Acima da linha de corte. Com <strong style="color:#e08a1f">${nec} O.S./dia</strong> nos próximos ${ind.diasRestantes} dias úteis a meta de ${fmtNum(m)} O.S. é alcançada.`
        : `🚀 Restam ${ind.diasRestantes} dias úteis. Mantendo <strong style="color:#2f6fce">${nec} O.S./dia</strong>, a meta de ${fmtNum(m)} O.S. fica ao alcance.`;
      meta = `<div class="sec"><h2>Acompanhamento da meta</h2><div class="cards">${this.card("O.S. atual", fmtNum(ind.osAtual), "de "+fmtNum(m)+" na meta")}${this.card("Dias restantes", ind.diasRestantes, "de "+ind.diasUteisMes+" úteis")}${this.card("Ritmo atual", fmtNum(ind.mediaDiaMesAtual,1), "O.S./dia")}${this.card("Projeção", fmtNum(ind.projetadoRitmoAtual), "no ritmo atual")}${this.card("Para a meta", nec, "O.S./dia")}</div>
        <div class="rule" style="margin-top:6px">${msg}</div></div>`;
    }
    const p1 = this.cab("Feedback — Produção e Qualidade", "Desempenho de produção, qualidade, presença e regras", doc)
      + this.ident(emp, P)
      + `<div class="sec"><h2>Histórico de produção (O.S. 58)</h2><div class="cards">${this.card("O.S. dia anterior", fmtNum(hist.osDiaAnterior), hist.ontem?fmtDateBR(hist.ontem):"-")}${this.card("O.S. última semana", fmtNum(hist.osSemana))}${this.card("O.S. mês anterior", fmtNum(hist.osMesAnterior), hist.mesAnteriorLabel||"")}${this.card("O.S. últimos 3 meses", fmtNum(hist.os3Meses))}</div></div>`
      + `<div class="sec"><h2>Indicadores de desempenho — comparação mensal</h2><div class="cards">${this.card("O.S. atual", fmtNum(exec?exec.totalAtual:0), cmp?cmp.labelAtual:"")}${this.card("Mês anterior (mesmo período)", fmtNum(cmp?cmp.anterior:0), cmp?cmp.labelAnterior:"")}${this.card("Variação", cmp&&cmp.variacao!==null?fmtPct(cmp.variacao,1):"s/ base", "", cmp&&cmp.variacao>0?"#1a9c62":cmp&&cmp.variacao<0?"#d64545":"#7a8798")}${this.card("Média diária", exec?fmtNum(exec.mediaDiaria,1):"0", "O.S./dia útil", "#e08a1f")}</div></div>`
      + `<div class="sec" style="display:flex;gap:8px"><div style="flex:1;border:1px solid #dde3ea;border-radius:5px;padding:5px"><div style="font-size:9.5px;font-weight:700;color:#123a6b;margin-bottom:2px">Evolução real + projeção — ${proj?proj.mesAtual:""}</div><canvas id="fbdoc-chart-evo-${idx}" width="350" height="180"></canvas></div>
        <div style="flex:1;border:1px solid #dde3ea;border-radius:5px;padding:5px"><div style="font-size:9.5px;font-weight:700;color:#123a6b;margin-bottom:2px">Ano atual — mês a mês com projeção</div><canvas id="fbdoc-chart-ano-${idx}" width="350" height="180"></canvas></div></div>`
      + meta + this.blocoQualidade(emp, nd) + this.blocoPresenca(pr);
    const p2 = this.blocoTipos(nd) + this.blocoSituacao(sit) + this.blocoRegra() + `<div style="height:9px"></div>`
      + this.termo(emp, P, "")
      + this.caixa("Resumo do assunto tratado:", 44)
      + `<table style="margin-bottom:7px"><tr><td colspan="3" style="background:#d8e4f5;font-weight:800;color:#123a6b">Avaliação geral</td></tr><tr><td style="height:24px;text-align:center">Bom desempenho ( )</td><td style="text-align:center">Regular, com margem p/ melhoria ( )</td><td style="text-align:center">Desempenho insatisfatório ( )</td></tr></table>`
      + this.escala("AUTOAVALIAÇÃO — preenchida pelo colaborador", "#1a9c62", "Marque de 0 a 10 a nota que representa o seu desempenho no período.")
      + this.escala("AVALIAÇÃO DO GESTOR — preenchida por " + escapeHtml(AVALIADOR_FIXO.nome), "#e08a1f", "Marque de 0 a 10 a nota que representa a avaliação do desempenho do colaborador no período.")
      + this.assinaturas(emp);
    return [this.pagina(p1, 1, 2, doc), this.pagina(p2, 2, 2, doc)];
  },

  /* ------------------------------ geração ------------------------------ */
  async gerarNC(emps, per){
    if(typeof html2canvas === "undefined" || typeof window.jspdf === "undefined"){ toast("As bibliotecas de exportação (html2canvas/jsPDF) ainda não carregaram. Aguarde e tente novamente.", "error"); return; }
    toast("Carregando as auditorias para montar o feedback…");
    try{
      const ps = [];
      if(window.AuditOnline && AuditOnline.rows===null && !AuditOnline.loading) ps.push(AuditOnline.load());
      if(window.RetornoOnline && RetornoOnline.rows===null && !RetornoOnline.loading) ps.push(RetornoOnline.load());
      if(ps.length) await Promise.all(ps);
    }catch(e){ console.warn(e); }
    const P = this.periodo(per), pages = [];
    try{
      emps.forEach(e=> this.paginasNC(e, P).forEach(p=>pages.push(p)));
      const nome = emps.length===1 ? "Feedback_NC_" + (emps[0].nome||"funcionario").replace(/[^a-zA-Z0-9]+/g,"_") : "Feedback_NC_" + emps.length + "_funcionarios";
      await Export.toPDFMultiPage(pages, nome, "portrait");
    }catch(err){ console.error(err); toast("Falha ao gerar o documento: " + err.message, "error"); }
    finally{ pages.forEach(p=>{ if(p.parentNode) p.parentNode.removeChild(p); }); }
  }
};
window.FeedbackFolha = FeedbackFolha;

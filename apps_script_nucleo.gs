/**
 * Núcleo Reposição – servidor (Google Apps Script)
 *
 * Faz 3 coisas para o site:
 *   1) LOGIN por matrícula + senha, lendo a aba "Logins e Permissões" (planilha de permissionamento);
 *   2) ACESSOS: o administrador cria/edita matrículas, senhas e permissões pelo próprio site;
 *   3) BASES: recebe os arquivos (8460, 8022, 1707 etc.) e grava na planilha de dados, validando
 *      duplicidade antes de gravar, e registra a data de cada carga na aba "Bases_Log".
 *
 * COMO IMPLANTAR (uma vez):
 *   Apps Script → Implantar → Nova implantação → Tipo: App da Web
 *   Executar como: Eu   |   Quem pode acessar: Qualquer pessoa
 *   Copie a URL que termina em /exec e cole em NUCLEO_API_URL no app.js.
 *   Ao mudar este código: Implantar → Gerenciar implantações → lápis → Nova versão.
 *
 * ANTES DO PRIMEIRO LOGIN: na aba "Logins e Permissões", crie a coluna D "Senha" e digite uma senha na
 * primeira linha de cada matrícula (a coluna E "Status" é criada sozinha, com "Ativo").
 * A planilha de permissões NÃO precisa (e não deve) ser pública: o script lê com a conta de quem implantou.
 */
const PERMISSOES_SHEET_ID = '1_BamBhG9JaLcwCJumEB7oQg-kKLWGGwcP56xzbcGsW8';
const ABA_PERMISSOES = 'Logins e Permissões';
const DADOS_SHEET_ID = '1KCLXuzpf6j4yvd6e5ALcthyW483TOMk5rzJ7XJaLmhQ';
const ABA_LOG_BASES = 'Bases_Log';
const VALIDADE_LOGIN_DIAS = 180;
const PERM_ACESSOS = ['Administração', 'Acessos'];
const PERM_BASES = ['Administração', 'Bases'];

/**
 * Bases que podem ser carregadas pelo site (o nome é o da aba na planilha de dados).
 *   modo 'acumular'   → só entram linhas que ainda NÃO existem (compara a linha inteira); nada é apagado.
 *   modo 'substituir' → a aba inteira é trocada pelo arquivo novo (foto do momento: saldos, cadastros).
 *   semCabecalho      → a aba não tem linha de títulos (lida por posição de coluna).
 */
const BASES = {
  '8460':               { modo: 'acumular',   desc: 'Produção por O.S. (separação / reposição)' },
  '8271':               { modo: 'acumular',   desc: 'O.S. por rua' },
  '8457':               { modo: 'acumular',   desc: 'Produção de operadores (endereços)' },
  '9712':               { modo: 'acumular',   desc: 'Lançamentos de avaria / baixas' },
  'REP.AVARIA':         { modo: 'acumular',   desc: 'Avarias de reposição' },
  'QUADRO REP':         { modo: 'acumular',   desc: 'Quadro diário de repositores' },
  'FEEDBACK REP':       { modo: 'acumular',   desc: 'Feedbacks dos repositores' },
  'AUDITORIA REP':      { modo: 'acumular',   desc: 'Auditoria por rua e dia' },
  'MISSÕES':            { modo: 'acumular',   desc: 'Missões' },
  'TURNOVER':           { modo: 'substituir', desc: 'Turnover' },
  'CRONOGRAMA':         { modo: 'substituir', desc: 'Cronograma de atividades' },
  '8022':               { modo: 'substituir', desc: 'Cadastro de produtos / ruas' },
  '8022 Nova':          { modo: 'substituir', desc: 'Cadastro de produtos (nova)' },
  '1707':               { modo: 'substituir', desc: '1707 GERAL – saldo por endereço', semCabecalho: true },
  'Capacidade Realizada': { modo: 'substituir', desc: 'Capacidade realizada' },
  'Tipo':               { modo: 'substituir', desc: 'Tipos' }
};

/* ===================== Entradas ===================== */

function doGet(e) {
  return resposta({ ok: true, servico: 'Núcleo Reposição', versao: 1 });
}

function doPost(e) {
  if (!e || !e.postData) return resposta({ ok: false, erro: 'Chame pelo site.' });
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return resposta({ ok: false, erro: 'Dados inválidos.' }); }
  try {
    if (d.acao === 'login') return resposta(login(d.matricula, d.senha));

    const s = validarToken(d.token);
    if (!s.ok) return resposta({ ok: false, erro: s.erro, login: true });
    if (d.acao === 'sessao') return resposta(s);

    const lk = LockService.getScriptLock(); lk.waitLock(30000);
    try {
      if (d.acao === 'admin_listar') { exigir(s, PERM_ACESSOS); return resposta(adminListar()); }
      if (d.acao === 'admin_salvar') { exigir(s, PERM_ACESSOS); return resposta(adminSalvar(d, s)); }
      if (d.acao === 'bases_status') { exigir(s, PERM_BASES); return resposta(basesStatus()); }
      if (d.acao === 'bases_enviar') { exigir(s, PERM_BASES); return resposta(basesEnviar(d)); }
      if (d.acao === 'bases_concluir') { exigir(s, PERM_BASES); return resposta(basesConcluir(d, s)); }
    } finally { lk.releaseLock(); }
    return resposta({ ok: false, erro: 'Ação desconhecida.' });
  } catch (err) {
    return resposta({ ok: false, erro: String(err && err.message ? err.message : err) });
  }
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ===================== Login e permissões ===================== */

function normalizar(s) {
  return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}
const bloqueado = function (s) { return normalizar(s) === 'BLOQUEADO'; };

/** Lê a aba de permissões. Cria as colunas Senha e Status se ainda não existirem. */
function tabelaPermissoes() {
  const sh = SpreadsheetApp.openById(PERMISSOES_SHEET_ID).getSheetByName(ABA_PERMISSOES);
  if (!sh) throw new Error('Aba "' + ABA_PERMISSOES + '" não encontrada.');
  let ultCol = Math.max(sh.getLastColumn(), 3);
  const cab = sh.getRange(1, 1, 1, ultCol).getDisplayValues()[0].map(normalizar);
  const achar = function (p) { return cab.findIndex(function (h) { return h.indexOf(p) === 0; }); };
  const T = { sh: sh, iMat: achar('MATRIC'), iAba: achar('ABA'), iSub: achar('SUBABA'), iSen: achar('SENHA'), iSta: achar('STATUS') };
  if (T.iMat < 0 || T.iAba < 0 || T.iSub < 0) throw new Error('A aba precisa das colunas Matricula, Aba e Sub Aba.');
  if (T.iSen < 0) { T.iSen = ultCol; sh.getRange(1, ultCol + 1).setValue('Senha').setFontWeight('bold'); ultCol++; }
  if (T.iSta < 0) {
    T.iSta = ultCol; sh.getRange(1, ultCol + 1).setValue('Status').setFontWeight('bold'); ultCol++;
    if (sh.getLastRow() > 1) sh.getRange(2, ultCol, sh.getLastRow() - 1, 1).setValue('Ativo');
  }
  T.ultCol = ultCol;
  T.linhas = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, ultCol).getDisplayValues() : [];
  return T;
}

/** { matricula: { senha, status, perms:[{aba,sub}] } } – status = Bloqueado se QUALQUER linha estiver bloqueada. */
function lerUsuarios() {
  const T = tabelaPermissoes(), mapa = {};
  T.linhas.forEach(function (l) {
    const mat = String(l[T.iMat]).trim(), aba = String(l[T.iAba]).trim(), sub = String(l[T.iSub]).trim();
    if (!mat) return;
    const u = mapa[mat] = mapa[mat] || { matricula: mat, senha: '', bloqueado: false, perms: [], _vistos: {} };
    const sen = String(l[T.iSen]).trim();
    if (sen && !u.senha) u.senha = sen;
    if (bloqueado(l[T.iSta])) u.bloqueado = true;
    if (aba && sub) {
      const k = normalizar(aba) + '|' + normalizar(sub);
      if (!u._vistos[k]) { u._vistos[k] = true; u.perms.push({ aba: aba, sub: sub }); }
    }
  });
  return { T: T, usuarios: mapa };
}

function login(matricula, senha) {
  const mat = String(matricula || '').trim(), sen = String(senha || '').trim();
  if (!mat || !sen) return { ok: false, erro: 'Informe matrícula e senha.' };
  const u = lerUsuarios().usuarios[mat];
  if (!u || !u.senha || u.senha !== sen) {
    if (u && !u.senha) return { ok: false, erro: 'Senha ainda não definida. Fale com o administrador.' };
    return { ok: false, erro: 'Matrícula ou senha inválidas.' };
  }
  if (u.bloqueado) return { ok: false, erro: 'Acesso bloqueado. Fale com o administrador.' };
  if (!u.perms.length) return { ok: false, erro: 'Matrícula sem nenhuma aba liberada.' };
  return { ok: true, matricula: mat, nome: nomeDaMatricula(mat), perms: u.perms, token: gerarToken(mat) };
}

function segredo() {
  const pr = PropertiesService.getScriptProperties();
  let s = pr.getProperty('SEGREDO');
  if (!s) { s = Utilities.getUuid() + Utilities.getUuid(); pr.setProperty('SEGREDO', s); }
  return s;
}
function assinar(texto) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(texto, segredo())).replace(/=+$/, '');
}
function gerarToken(mat) { const base = mat + '.' + Date.now(); return base + '.' + assinar(base); }

/** Confere o token e devolve as permissões ATUAIS (tirar a matrícula da planilha = perde o acesso). */
function validarToken(token) {
  const t = String(token || '').split('.');
  if (t.length !== 3) return { ok: false, erro: 'Faça login.' };
  if (assinar(t[0] + '.' + t[1]) !== t[2]) return { ok: false, erro: 'Login inválido. Entre novamente.' };
  if (Date.now() - Number(t[1]) > VALIDADE_LOGIN_DIAS * 864e5) return { ok: false, erro: 'Login expirado. Entre novamente.' };
  const u = lerUsuarios().usuarios[t[0]];
  if (!u || u.bloqueado || !u.perms.length) return { ok: false, erro: 'Acesso removido ou bloqueado.' };
  return { ok: true, matricula: t[0], nome: nomeDaMatricula(t[0]), perms: u.perms };
}

function exigir(sessao, par) {
  const alvo = normalizar(par[0]) + '|' + normalizar(par[1]);
  const ok = sessao.perms.some(function (p) { return normalizar(p.aba) + '|' + normalizar(p.sub) === alvo; });
  if (!ok) throw new Error('Sem permissão para ' + par[0] + ' > ' + par[1] + '.');
}

/** Nome vem do QUADRO REP da planilha de dados (CODIGO / NOME), linha mais recente. */
function nomeDaMatricula(mat) {
  try {
    const cache = CacheService.getScriptCache(), chave = 'nome_' + mat;
    const c = cache.get(chave); if (c !== null) return c;
    const sh = SpreadsheetApp.openById(DADOS_SHEET_ID).getSheetByName('QUADRO REP');
    let nome = '';
    if (sh && sh.getLastRow() > 1) {
      const cab = sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0].map(normalizar);
      const iC = cab.indexOf('CODIGO'), iN = cab.indexOf('NOME');
      if (iC >= 0 && iN >= 0) {
        const v = sh.getRange(2, 1, sh.getLastRow() - 1, Math.max(iC, iN) + 1).getDisplayValues();
        for (let i = v.length - 1; i >= 0; i--) if (String(v[i][iC]).trim() === mat) { nome = String(v[i][iN]).trim(); break; }
      }
    }
    cache.put(chave, nome, 21600);
    return nome;
  } catch (e) { return ''; }
}

/* ===================== Acessos (Administração > Acessos) ===================== */

function adminListar() {
  const r = lerUsuarios();
  const lista = Object.keys(r.usuarios).map(function (m) {
    const u = r.usuarios[m];
    return { matricula: m, nome: nomeDaMatricula(m), status: u.bloqueado ? 'Bloqueado' : 'Ativo', temSenha: !!u.senha, perms: u.perms };
  }).sort(function (a, b) { return (a.nome || a.matricula).localeCompare(b.nome || b.matricula); });
  return { ok: true, usuarios: lista };
}

/** Regrava TODAS as linhas da matrícula. senha vazia = mantém a atual. */
function adminSalvar(d, sessao) {
  const orig = String(d.original || '').trim();
  const mat = String(d.matricula || '').replace(/\D/g, '');
  const status = d.status === 'Bloqueado' ? 'Bloqueado' : 'Ativo';
  const perms = (Array.isArray(d.perms) ? d.perms : []).filter(function (p) { return p && p.aba && p.sub; });
  if (!mat) throw new Error('Informe a matrícula.');
  const r = lerUsuarios(), T = r.T;
  const atual = r.usuarios[orig || mat];
  let senha = String(d.senha || '').trim();
  if (!senha) {
    if (!atual || !atual.senha) throw new Error('Defina uma senha (mínimo 4 caracteres).');
    senha = atual.senha;
  }
  if (senha.length < 4) throw new Error('A senha precisa ter ao menos 4 caracteres.');
  if (!orig && atual) throw new Error('Já existe um acesso com a matrícula ' + mat + '.');
  if (orig && mat !== orig && r.usuarios[mat]) throw new Error('Já existe um acesso com a matrícula ' + mat + '.');
  if (!perms.length && status === 'Ativo') throw new Error('Libere ao menos uma aba (ou bloqueie o acesso).');
  const alvo = normalizar(PERM_ACESSOS[0]) + '|' + normalizar(PERM_ACESSOS[1]);
  const mantemAcessos = perms.some(function (p) { return normalizar(p.aba) + '|' + normalizar(p.sub) === alvo; });
  if ((orig || mat) === sessao.matricula && (!mantemAcessos || status === 'Bloqueado'))
    throw new Error('Você não pode tirar o seu próprio acesso a Administração > Acessos.');

  const sh = T.sh, ref = orig || mat;
  // apaga as linhas atuais da matrícula (de baixo para cima)
  for (let i = T.linhas.length - 1; i >= 0; i--) if (String(T.linhas[i][T.iMat]).trim() === ref) sh.deleteRow(i + 2);
  // grava as novas (matrícula e senha como TEXTO)
  const linhas = perms.map(function (p) {
    const l = new Array(T.ultCol).fill('');
    l[T.iMat] = mat; l[T.iAba] = p.aba; l[T.iSub] = p.sub; l[T.iSen] = senha; l[T.iSta] = status;
    return l;
  });
  if (!linhas.length) { // bloqueado sem permissões: mantém uma linha para não perder a matrícula
    const l = new Array(T.ultCol).fill(''); l[T.iMat] = mat; l[T.iSen] = senha; l[T.iSta] = 'Bloqueado'; linhas.push(l);
  }
  const ini = sh.getLastRow() + 1;
  sh.getRange(ini, 1, linhas.length, T.ultCol).setNumberFormat('@').setValues(linhas);
  CacheService.getScriptCache().remove('nome_' + mat);
  return { ok: true };
}

/** Rode no editor se precisar derrubar todos os logins (todos terão de entrar de novo). */
function revogarTodosOsLogins() { PropertiesService.getScriptProperties().deleteProperty('SEGREDO'); }

/* ===================== Bases (Administração > Bases) ===================== */

function dadosSS() { return SpreadsheetApp.openById(DADOS_SHEET_ID); }

function basesStatus() {
  const ss = dadosSS(), ultimas = ultimasCargas(ss);
  const bases = Object.keys(BASES).map(function (nome) {
    const cfg = BASES[nome], sh = ss.getSheetByName(nome);
    const lin = sh ? Math.max(0, sh.getLastRow() - (cfg.semCabecalho ? 0 : 1)) : 0;
    return { base: nome, modo: cfg.modo, desc: cfg.desc, semCabecalho: !!cfg.semCabecalho, existe: !!sh, linhasAtuais: lin, ultimaCarga: ultimas[nome] || null };
  });
  return { ok: true, bases: bases };
}

function ultimasCargas(ss) {
  const sh = ss.getSheetByName(ABA_LOG_BASES), out = {};
  if (!sh || sh.getLastRow() < 2) return out;
  const v = sh.getRange(2, 1, sh.getLastRow() - 1, 9).getDisplayValues();
  v.forEach(function (l) { // as últimas linhas ganham
    out[l[0]] = { quando: l[1], usuario: l[2], matricula: l[3], arquivo: l[4], modo: l[5], enviadas: Number(l[6]) || 0, novas: Number(l[7]) || 0, duplicadas: Number(l[8]) || 0 };
  });
  return out;
}

const RE_DATA = /^(\d{2})\/(\d{2})\/(\d{4})(?: (\d{2}):(\d{2}):(\d{2}))?$/;
/** Texto dd/MM/aaaa [hh:mm:ss] enviado pelo site → data de verdade na planilha. */
function converter(v) {
  if (typeof v === 'string') {
    const m = v.match(RE_DATA);
    if (m) return new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
  }
  return v === undefined || v === null ? '' : v;
}
function chaveLinha(arr, tz) {
  return arr.map(function (v) {
    if (v instanceof Date) return Utilities.formatDate(v, tz, 'dd/MM/yyyy HH:mm:ss');
    if (v === '' || v === null || v === undefined) return '';
    return String(v).trim();
  }).join('␟');
}
function garantirTamanho(sh, linhasTotal, colunas) {
  if (sh.getMaxRows() < linhasTotal) sh.insertRowsAfter(sh.getMaxRows(), linhasTotal - sh.getMaxRows());
  if (sh.getMaxColumns() < colunas) sh.insertColumnsAfter(sh.getMaxColumns(), colunas - sh.getMaxColumns());
}

/**
 * Recebe uma parte do arquivo. simular=true só confere (nada é gravado).
 * substituir: na parte 1 limpa a aba e grava; nas demais acrescenta.
 * acumular:   grava só as linhas cuja linha inteira ainda não existe na aba (e que não repetem no arquivo).
 */
function basesEnviar(d) {
  const nome = String(d.base || ''), cfg = BASES[nome];
  if (!cfg) throw new Error('Base desconhecida: ' + nome);
  const simular = d.simular === true, parte = Number(d.parte) || 1;
  const tz = Session.getScriptTimeZone();
  const cab = cfg.semCabecalho ? null : (Array.isArray(d.cabecalho) ? d.cabecalho.map(function (s) { return String(s == null ? '' : s).trim(); }) : []);
  if (!cfg.semCabecalho && !cab.filter(String).length) throw new Error('O arquivo não tem linha de títulos.');
  const entrada = (Array.isArray(d.linhas) ? d.linhas : []).map(function (l) { return l.map(converter); });
  const ss = dadosSS();
  let sh = ss.getSheetByName(nome);

  if (cfg.modo === 'substituir') {
    const atuais = sh ? Math.max(0, sh.getLastRow() - (cfg.semCabecalho ? 0 : 1)) : 0;
    if (simular) return { ok: true, simulacao: true, modo: cfg.modo, recebidas: entrada.length, novas: entrada.length, duplicadas: 0, substituira: atuais };
    if (!sh) sh = ss.insertSheet(nome);
    const colunas = cfg.semCabecalho ? Math.max.apply(null, entrada.map(function (l) { return l.length; }).concat([1])) : cab.length;
    if (parte === 1) {
      sh.clear();
      if (cab) { garantirTamanho(sh, 1, colunas); sh.getRange(1, 1, 1, cab.length).setNumberFormat('@').setValues([cab]); sh.getRange(1, 1, 1, cab.length).setNumberFormat('General'); }
    }
    if (entrada.length) {
      const ini = Math.max(sh.getLastRow(), cab ? 1 : 0) + 1;
      garantirTamanho(sh, ini + entrada.length - 1, colunas);
      const larg = entrada.map(function (l) { const c = l.slice(0, colunas); while (c.length < colunas) c.push(''); return c; });
      sh.getRange(ini, 1, larg.length, colunas).setValues(larg);
    }
    return { ok: true, modo: cfg.modo, recebidas: entrada.length, novas: entrada.length, duplicadas: 0 };
  }

  // ---- acumular ----
  let shCab;
  if (!sh || sh.getLastRow() === 0) {
    shCab = cab;
    if (!simular) {
      if (!sh) sh = ss.insertSheet(nome);
      garantirTamanho(sh, 1, cab.length);
      sh.getRange(1, 1, 1, cab.length).setValues([cab]);
    }
  } else {
    shCab = sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0].map(function (s) { return String(s).trim(); });
    while (shCab.length && !shCab[shCab.length - 1]) shCab.pop();
    const novasCols = cab.filter(function (c) { return c && shCab.indexOf(c) < 0; });
    if (novasCols.length) throw new Error('O arquivo tem colunas que não existem na base "' + nome + '": ' + novasCols.join(', ') + '. Confira se é o arquivo certo.');
  }
  const mapa = shCab.map(function (c) { return cab.indexOf(c); }); // posição de cada coluna da aba dentro do arquivo
  if (mapa.every(function (i) { return i < 0; })) throw new Error('Nenhuma coluna do arquivo confere com a base "' + nome + '".');

  const existentes = new Set();
  if (sh && sh.getLastRow() > 1) {
    sh.getRange(2, 1, sh.getLastRow() - 1, shCab.length).getValues().forEach(function (l) { existentes.add(chaveLinha(l, tz)); });
  }
  const novas = [];
  entrada.forEach(function (l) {
    const linha = mapa.map(function (i) { return i < 0 ? '' : (l[i] === undefined ? '' : l[i]); });
    if (linha.every(function (v) { return v === '' || v === null; })) return;
    const k = chaveLinha(linha, tz);
    if (existentes.has(k)) return;
    existentes.add(k); novas.push(linha);
  });
  const dup = entrada.length - novas.length;
  if (!simular && novas.length) {
    const ini = Math.max(sh.getLastRow(), 1) + 1;
    garantirTamanho(sh, ini + novas.length - 1, shCab.length);
    sh.getRange(ini, 1, novas.length, shCab.length).setValues(novas);
  }
  return { ok: true, simulacao: simular, modo: cfg.modo, recebidas: entrada.length, novas: novas.length, duplicadas: dup };
}

/** Registra a carga (data/hora, quem, arquivo e totais) em Bases_Log. */
function basesConcluir(d, sessao) {
  const nome = String(d.base || '');
  if (!BASES[nome]) throw new Error('Base desconhecida: ' + nome);
  const ss = dadosSS();
  let sh = ss.getSheetByName(ABA_LOG_BASES);
  if (!sh) {
    sh = ss.insertSheet(ABA_LOG_BASES);
    sh.getRange(1, 1, 1, 9).setValues([['Base', 'DataHora', 'Usuario', 'Matricula', 'Arquivo', 'Modo', 'Linhas_Enviadas', 'Linhas_Novas', 'Linhas_Duplicadas']]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  const agora = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');
  const n = sh.getLastRow() + 1;
  sh.getRange(n, 1, 1, 9).setNumberFormat('@').setValues([[nome, agora, sessao.nome || sessao.matricula, sessao.matricula, String(d.arquivo || ''), BASES[nome].modo,
    Number(d.enviadas) || 0, Number(d.novas) || 0, Number(d.duplicadas) || 0]]);
  return { ok: true, quando: agora };
}

/* ===================== Testes pelo editor ===================== */

function autorizar() {
  Logger.log('Permissões: ' + SpreadsheetApp.openById(PERMISSOES_SHEET_ID).getName());
  Logger.log('Dados: ' + dadosSS().getName());
  Logger.log('Matrículas: ' + Object.keys(lerUsuarios().usuarios).join(', '));
  segredo();
}

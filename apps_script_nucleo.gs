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
const ABA_LOG_ACESSOS = 'Acessos_Log';   // histórico de logins, falhas, trocas de senha e tempo de uso
const VALIDADE_LOGIN_DIAS = 180;
const PERM_ACESSOS = ['Administração', 'Acessos'];
const PERM_BASES = ['Administração', 'Bases'];
const ABA_LANC = 'Lançamentos';
const SUBS_LANC = ['Lançar Feedback', 'Lançar Advertência', 'Lançar Avaria 9712', 'Lançar Chamada', 'Lançar Quadro', 'Lançar Missões', 'Lançar Capacidade', 'Lançar Férias'];
/** Nomes antigos de abas continuam valendo (quem já tinha "Feedbacks" ou "Lançar REP.AVARIA" não perde o acesso). */
const NOMES_ANTIGOS = { 'FEEDBACKSEADVERTENCIAS': 'FEEDBACKS', 'LANCARAVARIA9712': 'LANCARREPAVARIA' };
const ABA_ADVERTENCIAS = 'ADVERTÊNCIAS';
const ABA_FERIAS = 'FÉRIAS AGENDADAS';
const DIAS_FERIAS = [5, 10, 15, 20, 25, 30, 31];
const DIAS_SEM_FEEDBACK = 30;
const ABA_CONFIG = 'Config_Lancamentos';
const ABA_LOG_LANC = 'Lancamentos_Log';
const PASTA_FEEDBACK = 'Núcleo Reposição - Feedbacks';

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
    if (d.acao === 'senha_redefinir') return resposta(senhaRedefinir(d));
    if (d.acao === 'senha_solicitar') return resposta(senhaSolicitar(d));

    const s = validarToken(d.token);
    if (!s.ok) return resposta({ ok: false, erro: s.erro, login: true });
    if (d.acao === 'sessao') return resposta(s);
    if (d.acao === 'uso') return resposta(usoRegistrar(d, s));

    const lk = LockService.getScriptLock(); lk.waitLock(30000);
    try {
      if (d.acao === 'admin_listar') { exigir(s, PERM_ACESSOS); return resposta(adminListar()); }
      if (d.acao === 'admin_historico') { exigir(s, PERM_ACESSOS); return resposta(historicoAcessos(d)); }
      if (d.acao === 'admin_salvar') { exigir(s, PERM_ACESSOS); return resposta(adminSalvar(d, s)); }
      if (d.acao === 'bases_status') { exigir(s, PERM_BASES); return resposta(basesStatus()); }
      if (d.acao === 'bases_enviar') { exigir(s, PERM_BASES); return resposta(basesEnviar(d)); }
      if (d.acao === 'bases_concluir') { exigir(s, PERM_BASES); return resposta(basesConcluir(d, s)); }
      if (String(d.acao || '').indexOf('lanc_') === 0) return resposta(lancamento(d, s));
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
  // Quem administra "Acessos" recebe automaticamente as telas de Lançamentos (sem precisar digitar na planilha).
  Object.keys(mapa).forEach(function (m) {
    const u = mapa[m];
    const admin = u.perms.some(function (p) { return normalizar(p.aba) + '|' + normalizar(p.sub) === normalizar(PERM_ACESSOS[0]) + '|' + normalizar(PERM_ACESSOS[1]); });
    if (!admin) return;
    SUBS_LANC.forEach(function (sub) {
      const k = normalizar(ABA_LANC) + '|' + normalizar(sub);
      const velho = normalizar(ABA_LANC) + '|' + (NOMES_ANTIGOS[normalizar(sub)] || '#');
      if (!u._vistos[k] && !u._vistos[velho]) { u._vistos[k] = true; u.perms.push({ aba: ABA_LANC, sub: sub }); }
    });
  });
  return { T: T, usuarios: mapa };
}

function login(matricula, senha) {
  const mat = String(matricula || '').trim(), sen = String(senha || '').trim();
  if (!mat || !sen) return { ok: false, erro: 'Informe matrícula e senha.' };
  const u = lerUsuarios().usuarios[mat];
  if (!u || !u.senha || u.senha !== sen) {
    if (u && !u.senha) { logAcesso(mat, 'LOGIN_FALHA', 'Senha ainda não definida'); return { ok: false, erro: 'Senha ainda não definida. Fale com o administrador.' }; }
    logAcesso(mat, 'LOGIN_FALHA', u ? 'Senha incorreta' : 'Matrícula não cadastrada');
    return { ok: false, erro: 'Matrícula ou senha inválidas.' };
  }
  if (u.bloqueado) { logAcesso(mat, 'LOGIN_FALHA', 'Acesso bloqueado'); return { ok: false, erro: 'Acesso bloqueado. Fale com o administrador.' }; }
  if (!u.perms.length) { logAcesso(mat, 'LOGIN_FALHA', 'Sem nenhuma aba liberada'); return { ok: false, erro: 'Matrícula sem nenhuma aba liberada.' }; }
  logAcesso(mat, 'LOGIN_OK', '');
  return { ok: true, matricula: mat, nome: nomeDaMatricula(mat), perms: u.perms, token: gerarToken(mat) };
}

/* ===================== Histórico de acessos / uso / redefinição de senha ===================== */

/** Grava uma linha em Acessos_Log. Nunca pode impedir login ou uso. */
function logAcesso(mat, evento, detalhe, segundos) {
  try {
    const ss = dadosSS();
    let sh = ss.getSheetByName(ABA_LOG_ACESSOS);
    if (!sh) {
      sh = ss.insertSheet(ABA_LOG_ACESSOS);
      sh.getRange(1, 1, 1, 6).setValues([['DataHora', 'Matricula', 'Nome', 'Evento', 'Detalhe', 'Segundos']]).setFontWeight('bold');
      sh.getRange('A:B').setNumberFormat('@');
      sh.setFrozenRows(1);
    }
    const q = Utilities.formatDate(new Date(), tzDados(), 'yyyy-MM-dd HH:mm:ss');
    let nome = '';
    if (evento !== 'USO') { try { nome = nomeDaMatricula(String(mat)); } catch (e) {} }
    const lin = sh.getLastRow() + 1;
    sh.getRange(lin, 1, 1, 6).setNumberFormat('@').setValues([[q, String(mat || ''), nome, evento, detalhe || '', segundos || '']]);
    if (segundos) sh.getRange(lin, 6).setNumberFormat('0').setValue(Number(segundos));
  } catch (e) { /* o log nunca pode atrapalhar */ }
}

/** O site envia, a cada poucos minutos, quantos segundos o usuário ficou ativo em cada tela. */
function usoRegistrar(d, s) {
  const itens = (Array.isArray(d.itens) ? d.itens : []).slice(0, 30);
  itens.forEach(function (it) {
    const seg = Math.max(0, Math.min(3600, Math.round(Number(it && it.seg) || 0)));
    const pane = String((it && it.pane) || '').slice(0, 80);
    if (seg > 0 && pane) logAcesso(s.matricula, 'USO', pane, seg);
  });
  return { ok: true };
}

/** Troca de senha feita pelo próprio usuário na tela de login (exige a senha atual). */
function senhaRedefinir(d) {
  const mat = String(d.matricula || '').trim(), atual = String(d.senhaAtual || '').trim(), nova = String(d.novaSenha || '').trim();
  if (!mat || !atual || !nova) return { ok: false, erro: 'Preencha matrícula, senha atual e a nova senha.' };
  if (nova.length < 4) return { ok: false, erro: 'A nova senha precisa ter ao menos 4 caracteres.' };
  if (nova === atual) return { ok: false, erro: 'A nova senha precisa ser diferente da atual.' };
  const lk = LockService.getScriptLock(); lk.waitLock(30000);
  try {
    const r = lerUsuarios(), u = r.usuarios[mat], T = r.T;
    if (!u || !u.senha || u.senha !== atual) { logAcesso(mat, 'LOGIN_FALHA', 'Redefinição: senha atual incorreta'); return { ok: false, erro: 'Matrícula ou senha atual inválidas.' }; }
    if (u.bloqueado) { logAcesso(mat, 'LOGIN_FALHA', 'Redefinição: acesso bloqueado'); return { ok: false, erro: 'Acesso bloqueado. Fale com o administrador.' }; }
    T.linhas.forEach(function (l, i) {
      if (String(l[T.iMat]).trim() === mat) T.sh.getRange(i + 2, T.iSen + 1).setNumberFormat('@').setValue(nova);
    });
    logAcesso(mat, 'SENHA_ALTERADA', 'Pelo próprio usuário');
    return { ok: true };
  } finally { lk.releaseLock(); }
}

/** "Esqueci a senha": registra um pedido para o administrador definir uma senha nova em Acessos. */
function senhaSolicitar(d) {
  const mat = String(d.matricula || '').trim();
  if (!mat) return { ok: false, erro: 'Informe a matrícula.' };
  const cache = CacheService.getScriptCache(), chave = 'pedsenha_' + mat;
  if (!cache.get(chave)) {
    cache.put(chave, '1', 600);
    let existe = false;
    try { existe = !!lerUsuarios().usuarios[mat]; } catch (e) {}
    logAcesso(mat, 'SENHA_SOLICITADA', existe ? 'Pediu ao administrador para redefinir' : 'Matrícula não cadastrada');
  }
  return { ok: true }; // resposta igual exista ou não a matrícula
}

/** Últimos registros do log (o site agrega por dia, usuário e tela). */
function historicoAcessos(d) {
  const sh = dadosSS().getSheetByName(ABA_LOG_ACESSOS);
  if (!sh || sh.getLastRow() < 2) return { ok: true, eventos: [], total: 0 };
  const max = Math.min(Number(d.max) || 6000, 15000);
  const total = sh.getLastRow() - 1, qtd = Math.min(total, max), ini = sh.getLastRow() - qtd + 1;
  const v = sh.getRange(ini, 1, qtd, 6).getDisplayValues();
  return { ok: true, eventos: v, total: total, truncado: total > qtd, hoje: Utilities.formatDate(new Date(), tzDados(), 'yyyy-MM-dd') };
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
  const sub = normalizar(par[1]), alvo = normalizar(par[0]) + '|' + sub, antigo = normalizar(par[0]) + '|' + (NOMES_ANTIGOS[sub] || '');
  const ok = sessao.perms.some(function (p) { const k = normalizar(p.aba) + '|' + normalizar(p.sub); return k === alvo || k === antigo; });
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
  const tz = tzPadrao();
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
  const agora = Utilities.formatDate(new Date(), tzPadrao(), 'dd/MM/yyyy HH:mm:ss');
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
  DriveApp.getRootFolder().getName(); // pede a permissão do Drive (fotos/PDF de feedback)
}


/* ===================== Lançamentos (categoria "Lançamentos") ===================== */

const CONFIG_PADRAO = {
  STATUS_CHAMADA: ['PRESENTE', 'FALTA', 'SEG TURNO', 'FOLGA', 'FÉRIAS', 'ATESTADO', 'SUSPENSÃO'],
  TIPO_REP_AVARIA: ['Recuperado Repositor', 'Relação Repositor'],
  MOTIVO_DESLIGAMENTO: ['BAIXO DESEMPENHO', 'BAIXA QUALIDADE', 'TRABALHO INFORMAL', 'OUTRA OPORTUNIDADE',
    'SOLICITAÇÃO RECEBIMENTO', 'SOLICITAÇÃO ARMAZENAGEM', 'SOLICITAÇÃO EXPEDIÇÃO'],
  TIPO_DESLIGAMENTO: ['DESLIGAMENTO S. JUSTA', 'PEDIU DESLIGAMENTO', 'TRANSFERENCIA'],
  TIPO_MISSAO: [],
  MOTIVO_FEEDBACK: ['Má Conduta', 'Insubordinação', 'Ausência Injustificada', 'Atrasos Frequentes', 'Desrespeito às Regras',
    'Violação Política Moral da Empresa', 'Baixa Produção', 'Desempenho Geral', 'Desídia']
};
const LISTAS_EDITAVEIS = ['STATUS_CHAMADA', 'TIPO_REP_AVARIA', 'MOTIVO_DESLIGAMENTO', 'TIPO_DESLIGAMENTO', 'TIPO_MISSAO', 'MOTIVO_FEEDBACK'];
const SUB_DA_ACAO = {
  lanc_init: null, lanc_config_add: null,
  lanc_feedback_salvar: 'Lançar Feedback', lanc_advertencia_salvar: 'Lançar Advertência',
  lanc_avaria_verificar: 'Lançar Avaria 9712', lanc_avaria_salvar: 'Lançar Avaria 9712',
  lanc_ferias_listar: 'Lançar Férias', lanc_ferias_salvar: 'Lançar Férias', lanc_ferias_cancelar: 'Lançar Férias',
  lanc_anexo_ler: null,
  lanc_chamada_dia: 'Lançar Chamada', lanc_chamada_salvar: 'Lançar Chamada', lanc_chamada_lote: 'Lançar Chamada',
  lanc_quadro_listar: 'Lançar Quadro', lanc_quadro_salvar: 'Lançar Quadro',
  lanc_missao_salvar: 'Lançar Missões', lanc_capacidade_salvar: 'Lançar Capacidade'
};
const LISTA_DA_SUB = { STATUS_CHAMADA: 'Lançar Chamada', TIPO_REP_AVARIA: 'Lançar Avaria 9712', MOTIVO_FEEDBACK: 'Lançar Feedback', MOTIVO_DESLIGAMENTO: 'Lançar Quadro', TIPO_DESLIGAMENTO: 'Lançar Quadro', TIPO_MISSAO: 'Lançar Missões' };

function lancamento(d, s) {
  if (!(d.acao in SUB_DA_ACAO)) throw new Error('Ação desconhecida.');
  const sub = SUB_DA_ACAO[d.acao];
  if (sub) exigir(s, [ABA_LANC, sub]);
  switch (d.acao) {
    case 'lanc_init': return lancInit(s);
    case 'lanc_config_add': return lancConfigAdd(d, s);
    case 'lanc_feedback_salvar': return feedbackSalvar(d, s);
    case 'lanc_advertencia_salvar': return advertenciaSalvar(d, s);
    case 'lanc_ferias_listar': return feriasListar();
    case 'lanc_ferias_salvar': return feriasSalvar(d, s);
    case 'lanc_ferias_cancelar': return feriasCancelar(d, s);
    case 'lanc_anexo_ler': return anexoLer(d, s);
    case 'lanc_avaria_verificar': return avariaVerificar(d);
    case 'lanc_avaria_salvar': return avariaSalvar(d, s);
    case 'lanc_chamada_dia': return chamadaDia(d);
    case 'lanc_chamada_salvar': return chamadaSalvar(d, s);
    case 'lanc_chamada_lote': return chamadaLote(d, s);
    case 'lanc_quadro_listar': return quadroListar();
    case 'lanc_quadro_salvar': return quadroSalvar(d, s);
    case 'lanc_missao_salvar': return missaoSalvar(d, s);
    case 'lanc_capacidade_salvar': return capacidadeSalvar(d, s);
  }
}

/* ---------- utilidades ---------- */

/** Fuso horário em texto. Se a planilha ou o projeto estiverem sem fuso definido, usa o de São Paulo. */
function tzPadrao() { return String(Session.getScriptTimeZone() || '') || 'America/Sao_Paulo'; }
function tzDados() {
  let tz = '';
  try { tz = String(dadosSS().getSpreadsheetTimeZone() || ''); } catch (e) {}
  return tz || tzPadrao();
}
function abaDados(nome) {
  const sh = dadosSS().getSheetByName(nome);
  if (!sh) throw new Error('A aba "' + nome + '" não existe na planilha de dados.');
  return sh;
}
/** Cabeçalho da aba: { sh, cab:[texto], n:[normalizado], ult } */
function infoAba(nome) {
  const sh = abaDados(nome);
  const ult = Math.max(sh.getLastColumn(), 1);
  const cab = sh.getRange(1, 1, 1, ult).getDisplayValues()[0].map(function (c) { return String(c).trim(); });
  return { sh: sh, cab: cab, n: cab.map(normalizar), ult: ult };
}
function acharCol(info, aliases) {
  for (let i = 0; i < aliases.length; i++) { const k = info.n.indexOf(normalizar(aliases[i])); if (k >= 0) return k; }
  return -1;
}
/** Acha a coluna; se não existir, cria no fim com o título dado. */
function garantirCol(info, aliases, titulo) {
  let k = acharCol(info, aliases);
  if (k >= 0) return k;
  k = info.cab.length;
  while (k > 0 && !info.cab[k - 1]) k--;          // primeira coluna livre depois do último título
  if (info.sh.getMaxColumns() < k + 1) info.sh.insertColumnsAfter(info.sh.getMaxColumns(), k + 1 - info.sh.getMaxColumns());
  info.sh.getRange(1, k + 1).setValue(titulo).setFontWeight('bold');
  while (info.cab.length <= k) { info.cab.push(''); info.n.push(''); }
  info.cab[k] = titulo; info.n[k] = normalizar(titulo); info.ult = Math.max(info.ult, k + 1);
  return k;
}
function lerLinhas(info) {
  const ult = info.sh.getLastRow();
  if (ult < 2) return [];
  return info.sh.getRange(2, 1, ult - 1, info.ult).getValues();
}
function isoParaData(iso) {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) throw new Error('Data inválida.');
  return Utilities.parseDate(iso, tzDados(), 'yyyy-MM-dd');
}
/** Qualquer valor de célula de data → 'yyyy-MM-dd' ('' se não for data). */
function chaveData(v) {
  const tz = tzDados();
  if (v instanceof Date) return Utilities.formatDate(v, tz, 'yyyy-MM-dd');
  if (typeof v === 'number' && v > 20000 && v < 80000) return Utilities.formatDate(new Date(Math.round((v - 25569) * 864e5)), 'UTC', 'yyyy-MM-dd');
  const t = String(v == null ? '' : v).trim();
  let m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m) return m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2);
  m = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? m[0] : '';
}
function soDigitos(v) { return String(v == null ? '' : v).replace(/\D/g, ''); }
function texto(v) { return String(v == null ? '' : v).trim(); }
function hoje() { return Utilities.formatDate(new Date(), tzDados(), 'yyyy-MM-dd'); }
function formatarDatas(sh, col, ini, qtd) { if (qtd > 0) sh.getRange(ini, col + 1, qtd, 1).setNumberFormat('dd/MM/yyyy'); }

function registrarLog(s, tipo, detalhe) {
  try {
    const ss = dadosSS();
    let sh = ss.getSheetByName(ABA_LOG_LANC);
    if (!sh) {
      sh = ss.insertSheet(ABA_LOG_LANC);
      sh.getRange(1, 1, 1, 5).setValues([['DataHora', 'Matricula', 'Usuario', 'Tipo', 'Detalhe']]).setFontWeight('bold');
      sh.setFrozenRows(1);
    }
    const q = Utilities.formatDate(new Date(), tzDados(), 'dd/MM/yyyy HH:mm:ss');
    sh.getRange(sh.getLastRow() + 1, 1, 1, 5).setNumberFormat('@').setValues([[q, s.matricula, s.nome || s.matricula, tipo, detalhe]]);
  } catch (e) { /* o log nunca pode impedir um lançamento */ }
}

/* ---------- listas configuráveis (aba Config_Lancamentos) ---------- */

function lerConfig() {
  const ss = dadosSS();
  let sh = ss.getSheetByName(ABA_CONFIG);
  if (!sh) {
    sh = ss.insertSheet(ABA_CONFIG);
    const linhas = [['Lista', 'Valor']];
    Object.keys(CONFIG_PADRAO).forEach(function (k) { CONFIG_PADRAO[k].forEach(function (v) { linhas.push([k, v]); }); });
    sh.getRange(1, 1, linhas.length, 2).setValues(linhas);
    sh.getRange(1, 1, 1, 2).setFontWeight('bold'); sh.setFrozenRows(1);
  }
  const cfg = {};
  LISTAS_EDITAVEIS.forEach(function (k) { cfg[k] = []; });
  if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, 2).getDisplayValues().forEach(function (l) {
    const k = texto(l[0]), v = texto(l[1]);
    if (cfg[k] && v && cfg[k].map(normalizar).indexOf(normalizar(v)) < 0) cfg[k].push(v);
  });
  return cfg;
}

function lancConfigAdd(d, s) {
  const lista = texto(d.lista), valor = texto(d.valor);
  if (LISTAS_EDITAVEIS.indexOf(lista) < 0) throw new Error('Lista desconhecida.');
  exigir(s, [ABA_LANC, LISTA_DA_SUB[lista]]);
  if (!valor) throw new Error('Digite o nome do novo item.');
  const cfg = lerConfig();
  if (cfg[lista].map(normalizar).indexOf(normalizar(valor)) >= 0) throw new Error('"' + valor + '" já existe nessa lista.');
  const sh = dadosSS().getSheetByName(ABA_CONFIG);
  sh.getRange(sh.getLastRow() + 1, 1, 1, 2).setNumberFormat('@').setValues([[lista, valor]]);
  registrarLog(s, 'Nova opção', lista + ': ' + valor);
  return { ok: true, listas: lerConfig() };
}

/* ---------- funcionários (quadro = aba TURNOVER) ---------- */

const ALIAS_TURN = {
  mat: ['MATRIC', 'MATRICULA', 'CODIGO', 'COD'], nome: ['NOME'], ativo: ['ATIVO'], tipo: ['TIPO'], motivo: ['MOTIVO'],
  obs: ['OBS', 'OUTRAS OBS', 'OBSERVACAO'], adm: ['DATA CONTRATACAO', 'DATA CONTRATA', 'DATA ADMISSAO', 'DT ADMISSAO', 'ADMISSAO'],
  desl: ['DATA DESLIGAMENTO', 'DT DESLIGAMENTO', 'DESLIGAMENTO', 'DEMISSAO'],
  transf: ['DATA TRANSFERENCIA', 'DT TRANSFERENCIA']
};

function lerTurnover() {
  const info = infoAba('TURNOVER');
  const idx = {}; Object.keys(ALIAS_TURN).forEach(function (k) { idx[k] = acharCol(info, ALIAS_TURN[k]); });
  if (idx.mat < 0 || idx.nome < 0) throw new Error('A aba TURNOVER precisa das colunas Matrícula (MATRIC/CODIGO) e NOME.');
  const linhas = lerLinhas(info), out = [];
  linhas.forEach(function (l, i) {
    const mat = texto(l[idx.mat]);
    if (!mat && !texto(l[idx.nome])) return;
    out.push({
      linha: i + 2, mat: mat, nome: texto(l[idx.nome]),
      ativo: idx.ativo >= 0 && ['SIM', 'S', 'TRUE', '1'].indexOf(normalizar(l[idx.ativo])) >= 0,
      tipo: idx.tipo >= 0 ? texto(l[idx.tipo]) : '', motivo: idx.motivo >= 0 ? texto(l[idx.motivo]) : '', obs: idx.obs >= 0 ? texto(l[idx.obs]) : '',
      adm: idx.adm >= 0 ? chaveData(l[idx.adm]) : '', desl: idx.desl >= 0 ? chaveData(l[idx.desl]) : '', transf: idx.transf >= 0 ? chaveData(l[idx.transf]) : ''
    });
  });
  return { info: info, idx: idx, pessoas: out };
}

function lancInit(s) {
  const cfg = lerConfig();
  // tipos de missão já usados na aba MISSÕES entram na lista
  try {
    const m = infoAba('MISSÕES'), iT = acharCol(m, ['TIPO', 'REGRA']);
    if (iT >= 0) lerLinhas(m).forEach(function (l) {
      const v = texto(l[iT]); if (v && cfg.TIPO_MISSAO.map(normalizar).indexOf(normalizar(v)) < 0) cfg.TIPO_MISSAO.push(v);
    });
  } catch (e) { /* aba MISSÕES ainda não existe */ }
  let pessoas = [], aviso = '';
  try { pessoas = lerTurnover().pessoas; } catch (e) { aviso = String(e.message || e); }
  const nomes = {};
  pessoas.forEach(function (p) { if (p.mat && p.nome) nomes[p.mat] = p.nome; });
  return { ok: true, listas: cfg, pessoas: pessoas.map(function (p) { return { mat: p.mat, nome: p.nome, ativo: p.ativo }; }),
    aviso: aviso, usuario: { matricula: s.matricula, nome: s.nome || nomes[s.matricula] || '' }, classificacao: mapaClassificacao(), hoje: hoje(), semFeedback: semFeedbackLista(), diasSemFeedback: DIAS_SEM_FEEDBACK, diasFerias: DIAS_FERIAS };
}

/* ---------- Feedback ---------- */

function faixaNota(n) { return n <= 3 ? 0 : (n <= 6 ? 1 : 2); }
function desempenhoDaNota(n) { return ['Desempenho Insatisfatório', 'Regular, com margem p/ melhoria', 'Bom Desempenho'][faixaNota(n)]; }

/** Classificação automática: aprende com o que já está na aba (mais usada em cada faixa de nota do gestor). */
function mapaClassificacao() {
  const padrao = ['Negativo', 'Neutro', 'Positivo'];
  try {
    const info = infoAba('FEEDBACK REP');
    const iN = acharCol(info, ['AVALIACAO GESTOR']), iC = acharCol(info, ['CLASSIFICACAO']);
    if (iN < 0 || iC < 0) return padrao;
    const cont = [{}, {}, {}];
    lerLinhas(info).forEach(function (l) {
      const n = Number(String(l[iN]).replace(',', '.')), c = texto(l[iC]);
      if (!c || isNaN(n) || String(l[iN]) === '') return;
      const f = faixaNota(n); cont[f][c] = (cont[f][c] || 0) + 1;
    });
    return cont.map(function (o, i) {
      const k = Object.keys(o).sort(function (a, b) { return o[b] - o[a]; })[0];
      return k || padrao[i];
    });
  } catch (e) { return padrao; }
}

function nomePorMatricula(mat) {
  try { const p = lerTurnover().pessoas.filter(function (x) { return x.mat === mat; })[0]; if (p && p.nome) return p.nome; } catch (e) {}
  return nomeDaMatricula(mat);
}

/** Grava o documento (PDF/imagem) na pasta do Drive e devolve o link. */
function salvarAnexo(a, prefixo, mat, iso) {
  if (!a || !a.base64) return '';
  const ext = /pdf/i.test(a.mime) ? 'pdf' : (/png/i.test(a.mime) ? 'png' : 'jpg');
  const it = DriveApp.getFoldersByName(PASTA_FEEDBACK);
  const pasta = it.hasNext() ? it.next() : DriveApp.createFolder(PASTA_FEEDBACK);
  const nomeArq = prefixo + '_' + mat + '_' + iso + '_' + Utilities.formatDate(new Date(), tzDados(), 'HHmmss') + '.' + ext;
  const blob = Utilities.newBlob(Utilities.base64Decode(a.base64), a.mime || 'application/octet-stream', nomeArq);
  return pasta.createFile(blob).getUrl();
}

function idDoLink(ref) {
  const t = String(ref || '');
  let m = t.match(/\/d\/([A-Za-z0-9_-]{10,})/) || t.match(/[?&]id=([A-Za-z0-9_-]{10,})/);
  if (m) return m[1];
  return /^[A-Za-z0-9_-]{20,}$/.test(t) ? t : '';
}

/** Devolve o arquivo (base64) para o site mostrar sem baixar. Só arquivos da pasta de documentos do Núcleo. */
function anexoLer(d, s) {
  const ok = [['Gestão', 'Feedbacks e Advertências'], ['Lançamentos', 'Lançar Feedback'], ['Lançamentos', 'Lançar Advertência']].some(function (par) {
    try { exigir(s, par); return true; } catch (e) { return false; }
  });
  if (!ok) throw new Error('Sem permissão para ver documentos.');
  const id = idDoLink(d.ref);
  if (!id) throw new Error('Link do documento inválido.');
  const f = DriveApp.getFileById(id);
  let dentro = false;
  const pais = f.getParents();
  while (pais.hasNext()) if (pais.next().getName() === PASTA_FEEDBACK) dentro = true;
  if (!dentro) throw new Error('Este arquivo não está na pasta de documentos do Núcleo Reposição.');
  const blob = f.getBlob();
  if (blob.getBytes().length > 20 * 1024 * 1024) throw new Error('Arquivo grande demais para visualizar aqui. Abra pelo Drive.');
  return { ok: true, nome: f.getName(), mime: blob.getContentType(), base64: Utilities.base64Encode(blob.getBytes()) };
}

/** Colaboradores ativos sem feedback há mais de DIAS_SEM_FEEDBACK dias (ou nunca). Líderes ficam de fora (se houver CARGO). */
function semFeedbackLista(ignorarMat) {
  try {
    const hojeIso = hoje(), ultimo = {};
    const info = infoAba('FEEDBACK REP'), iD = acharCol(info, ['DATA']), iC = acharCol(info, ['COD', 'MATRICULA', 'CODIGO']);
    if (iD >= 0 && iC >= 0) lerLinhas(info).forEach(function (l) {
      const m = soDigitos(l[iC]), dt = chaveData(l[iD]);
      if (m && dt && (!ultimo[m] || dt > ultimo[m])) ultimo[m] = dt;
    });
    const lideres = {};
    try {
      const q = infoQuadro();
      if (q.c.cargo >= 0) lerLinhas(q.info).forEach(function (l) { lideres[soDigitos(l[q.c.cod])] = /LIDER/.test(normalizar(l[q.c.cargo])); });
    } catch (e) {}
    const ms = function (iso) { return isoParaData(iso).getTime(); };
    const out = [];
    funcionariosAtivos().forEach(function (p) {
      if (lideres[p.mat] || p.mat === ignorarMat) return;
      const u = ultimo[p.mat];
      const dias = u ? Math.round((ms(hojeIso) - ms(u)) / 864e5) : null;
      if (dias === null || dias > DIAS_SEM_FEEDBACK) out.push({ mat: p.mat, nome: p.nome, dias: dias, ultimo: u || '' });
    });
    out.sort(function (a, b) { return (b.dias === null ? 1e9 : b.dias) - (a.dias === null ? 1e9 : a.dias); });
    return out.slice(0, 200);
  } catch (e) { return []; }
}

function feedbackSalvar(d, s) {
  const mat = soDigitos(d.mat), matApl = soDigitos(d.matAplicador) || s.matricula;
  if (!mat) throw new Error('Informe a matrícula do colaborador.');
  const nome = nomePorMatricula(mat) || texto(d.nome);
  if (!nome) throw new Error('Matrícula não encontrada. Confira o número.');
  const nomeApl = texto(d.nomeAplicador) || nomePorMatricula(matApl) || s.nome || '';
  const motivo = texto(d.motivo);
  if (!motivo) throw new Error('Escolha o motivo do feedback.');
  const resumo = texto(d.resumo);
  if (!resumo) throw new Error('Escreva o resumo do assunto.');
  const nP = Number(d.avPessoal), nG = Number(d.avGestor);
  if (isNaN(nP) || nP < 0 || nP > 10) throw new Error('Avaliação pessoal deve ser de 0 a 10.');
  if (isNaN(nG) || nG < 0 || nG > 10) throw new Error('Avaliação do gestor deve ser de 0 a 10.');
  const data = isoParaData(d.data);
  const link = salvarAnexo(d.anexo, 'Feedback', mat, d.data);

  const info = infoAba('FEEDBACK REP');
  const c = {
    data: garantirCol(info, ['DATA'], 'Data'), mat: garantirCol(info, ['COD', 'MATRICULA', 'CODIGO'], 'Cod'), nome: garantirCol(info, ['NOME'], 'Nome'),
    matApl: garantirCol(info, ['COD APLICADOR', 'MATRICULA APLICADOR'], 'Cod Aplicador'), nomeApl: garantirCol(info, ['NOME APLICADOR'], 'Nome Aplicador'),
    motivo: garantirCol(info, ['MOTIVO'], 'Motivo'),
    resumo: garantirCol(info, ['RESUMO ASSUNTO'], 'Resumo Assunto'), avP: garantirCol(info, ['AVALIACAO PESSOAL'], 'Avaliação Pessoal'),
    avG: garantirCol(info, ['AVALIACAO GESTOR'], 'Avaliação Gestor'), desemp: garantirCol(info, ['DESEMPENHO'], 'Desempenho'),
    classif: garantirCol(info, ['CLASSIFICACAO'], 'Classificação'), anexo: garantirCol(info, ['ANEXO', 'LINK ANEXO'], 'Anexo')
  };
  const linha = new Array(info.ult).fill('');
  linha[c.data] = data; linha[c.mat] = mat; linha[c.nome] = nome; linha[c.matApl] = matApl; linha[c.nomeApl] = nomeApl; linha[c.motivo] = motivo;
  linha[c.resumo] = resumo; linha[c.avP] = nP; linha[c.avG] = nG;
  linha[c.desemp] = desempenhoDaNota(nG); linha[c.classif] = mapaClassificacao()[faixaNota(nG)]; linha[c.anexo] = link;
  const n = Math.max(info.sh.getLastRow(), 1) + 1;
  garantirTamanho(info.sh, n, info.ult);
  info.sh.getRange(n, 1, 1, info.ult).setValues([linha]);
  formatarDatas(info.sh, c.data, n, 1);
  registrarLog(s, 'Feedback', mat + ' ' + nome + ' · ' + motivo + ' · nota ' + nG + (link ? ' · com anexo' : ''));
  return { ok: true, nome: nome, desempenho: linha[c.desemp], classificacao: linha[c.classif], anexo: link, semFeedback: semFeedbackLista(mat) };
}

/* ---------- Advertências (aba ADVERTÊNCIAS) ---------- */

function abaComCabecalho(nome, cab) {
  const ss = dadosSS();
  let sh = ss.getSheetByName(nome);
  if (!sh) {
    sh = ss.insertSheet(nome);
    sh.getRange(1, 1, 1, cab.length).setValues([cab]).setFontWeight('bold'); sh.setFrozenRows(1);
  }
  return sh;
}

function advertenciaSalvar(d, s) {
  const mat = soDigitos(d.mat), matApl = soDigitos(d.matAplicador) || s.matricula;
  if (!mat) throw new Error('Informe a matrícula do colaborador.');
  const nome = nomePorMatricula(mat) || texto(d.nome);
  if (!nome) throw new Error('Matrícula não encontrada. Confira o número.');
  const motivo = texto(d.motivo), resumo = texto(d.resumo);
  if (!motivo) throw new Error('Escolha o motivo da advertência.');
  if (!resumo) throw new Error('Escreva o resumo da advertência.');
  const data = isoParaData(d.data);
  const link = salvarAnexo(d.anexo, 'Advertencia', mat, d.data);
  abaComCabecalho(ABA_ADVERTENCIAS, ['Data', 'Cod', 'Nome', 'Motivo', 'Resumo Assunto', 'Cod Aplicador', 'Nome Aplicador', 'Anexo']);
  const info = infoAba(ABA_ADVERTENCIAS);
  const c = {
    data: garantirCol(info, ['DATA'], 'Data'), mat: garantirCol(info, ['COD', 'MATRICULA'], 'Cod'), nome: garantirCol(info, ['NOME'], 'Nome'),
    motivo: garantirCol(info, ['MOTIVO'], 'Motivo'), resumo: garantirCol(info, ['RESUMO ASSUNTO', 'RESUMO'], 'Resumo Assunto'),
    matApl: garantirCol(info, ['COD APLICADOR'], 'Cod Aplicador'), nomeApl: garantirCol(info, ['NOME APLICADOR'], 'Nome Aplicador'), anexo: garantirCol(info, ['ANEXO'], 'Anexo')
  };
  const l = new Array(info.ult).fill('');
  l[c.data] = data; l[c.mat] = mat; l[c.nome] = nome; l[c.motivo] = motivo; l[c.resumo] = resumo;
  l[c.matApl] = matApl; l[c.nomeApl] = texto(d.nomeAplicador) || nomePorMatricula(matApl) || s.nome || ''; l[c.anexo] = link;
  const n = Math.max(info.sh.getLastRow(), 1) + 1;
  garantirTamanho(info.sh, n, info.ult);
  info.sh.getRange(n, 1, 1, info.ult).setValues([l]);
  formatarDatas(info.sh, c.data, n, 1);
  registrarLog(s, 'Advertência', mat + ' ' + nome + ' · ' + motivo + (link ? ' · com anexo' : ''));
  return { ok: true, nome: nome, anexo: link };
}

/* ---------- REP.AVARIA ---------- */

function numerosAvaria(sh) {
  const set = {};
  if (sh.getLastRow() < 1) return set;
  sh.getRange(1, 1, sh.getLastRow(), Math.max(sh.getLastColumn(), 1)).getValues().forEach(function (l) {
    l.forEach(function (v) { const t = texto(v); if (/^\d{5,}$/.test(t)) set[t] = true; });
  });
  return set;
}
function existeNa9712(num) {
  const sh = dadosSS().getSheetByName('9712');
  if (!sh) return { aba: false, existe: false };
  const ult = sh.getLastRow();
  if (ult < 2) return { aba: true, existe: false };
  const cab = sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0].map(normalizar);
  let col = cab.indexOf('NUMLANCAMENTO');
  if (col < 0) col = 10; // coluna K
  const v = sh.getRange(2, col + 1, ult - 1, 1).getValues();
  for (let i = 0; i < v.length; i++) if (soDigitos(v[i][0]) === num) return { aba: true, existe: true };
  return { aba: true, existe: false };
}
function avariaVerificar(d) {
  const num = soDigitos(d.num);
  if (!num) throw new Error('Informe o número do lançamento.');
  const sh = abaDados('REP.AVARIA');
  return { ok: true, num: num, jaLancado: !!numerosAvaria(sh)[num], na9712: existeNa9712(num) };
}
function avariaSalvar(d, s) {
  const num = soDigitos(d.num), tipo = texto(d.tipo);
  if (!num) throw new Error('Informe o número do lançamento.');
  if (!tipo) throw new Error('Escolha o tipo do lançamento.');
  const sh = abaDados('REP.AVARIA');
  if (numerosAvaria(sh)[num]) throw new Error('O lançamento ' + num + ' já existe na REP.AVARIA. Nada foi gravado.');
  const na = existeNa9712(num);
  if (na.aba && !na.existe && d.confirmarSem9712 !== true) return { ok: false, precisaConfirmar: true, erro: 'O número ' + num + ' não foi encontrado na 9712 (coluna K). Confirme para lançar mesmo assim.' };
  const info = infoAba('REP.AVARIA');
  const iN = acharCol(info, ['NUM LANCAMENTO', 'NUMLANCAMENTO', 'LANCAMENTO']), iT = acharCol(info, ['TIPO', 'TIPO LANCAMENTO', 'TIPO DE LANCAMENTO', 'RELACAO']);
  const n = Math.max(sh.getLastRow(), 1) + 1;
  if (iN >= 0 && iT >= 0) {
    const l = new Array(info.ult).fill(''); l[iN] = Number(num); l[iT] = tipo;
    garantirTamanho(sh, n, info.ult); sh.getRange(n, 1, 1, info.ult).setValues([l]);
  } else {  // aba sem títulos reconhecíveis: grava número e tipo nas duas primeiras colunas
    garantirTamanho(sh, n, 2); sh.getRange(n, 1, 1, 2).setValues([[Number(num), tipo]]);
  }
  registrarLog(s, 'REP.AVARIA', num + ' · ' + tipo);
  return { ok: true, num: num, na9712: na };
}

/* ---------- Chamada (aba QUADRO REP) ---------- */

const ALIAS_Q = { data: ['DATA'], cod: ['CODIGO', 'COD', 'MATRICULA'], nome: ['NOME'], status: ['STATUS'], cargo: ['CARGO'] };
function infoQuadro() {
  const info = infoAba('QUADRO REP'), c = {};
  Object.keys(ALIAS_Q).forEach(function (k) { c[k] = acharCol(info, ALIAS_Q[k]); });
  if (c.data < 0 || c.cod < 0 || c.status < 0) throw new Error('A aba QUADRO REP precisa das colunas DATA, CODIGO e STATUS.');
  return { info: info, c: c };
}
function funcionariosAtivos() { return lerTurnover().pessoas.filter(function (p) { return p.ativo && p.mat; }); }

function diaDaSemana(iso) { return Number(Utilities.formatDate(isoParaData(iso), tzDados(), 'u')); } // 1 = segunda … 7 = domingo
function somaDiasIso(iso, n) { return Utilities.formatDate(new Date(isoParaData(iso).getTime() + n * 864e5), tzDados(), 'yyyy-MM-dd'); }
function exigirDiaUtil(iso) { if (diaDaSemana(iso) >= 6) throw new Error('A chamada é de segunda a sexta. ' + iso.split('-').reverse().join('/') + ' cai no fim de semana.'); }

function chamadaDia(d) {
  const iso = texto(d.data); isoParaData(iso);
  exigirDiaUtil(iso);
  const q = infoQuadro(), dia = {};
  lerLinhas(q.info).forEach(function (l) { if (chaveData(l[q.c.data]) === iso) dia[soDigitos(l[q.c.cod])] = texto(l[q.c.status]); });
  const ativos = funcionariosAtivos();
  const emFerias = {};
  feriasLer(false).forEach(function (f) { if (f.status !== 'CANCELADA' && f.ini <= iso && iso <= f.fim) emFerias[f.mat] = true; });
  const itens = ativos.map(function (p) {
    if (dia[p.mat]) return { mat: p.mat, nome: p.nome, status: dia[p.mat] };
    return { mat: p.mat, nome: p.nome, status: emFerias[p.mat] ? 'FÉRIAS' : '', sugerido: !!emFerias[p.mat] };   // férias agendadas já vêm marcadas
  });
  const foraDoQuadro = Object.keys(dia).filter(function (m) { return !ativos.some(function (p) { return p.mat === m; }); }).length;
  return { ok: true, data: iso, jaExiste: Object.keys(dia).length > 0, itens: itens, foraDoQuadro: foraDoQuadro };
}

/** Grava (cria ou atualiza) o status de cada matrícula em cada dia. itens = [{data, mat, nome, status}] */
function gravarChamada(itens) {
  const q = infoQuadro(), c = q.c, sh = q.info.sh;
  const linhas = lerLinhas(q.info), indice = {}, cargo = {};
  linhas.forEach(function (l, i) {
    const k = chaveData(l[c.data]) + '|' + soDigitos(l[c.cod]);
    indice[k] = i + 2;
    if (c.cargo >= 0 && texto(l[c.cargo])) cargo[soDigitos(l[c.cod])] = texto(l[c.cargo]);
  });
  let criadas = 0, atualizadas = 0; const novas = [];
  itens.forEach(function (it) {
    const st = texto(it.status), mat = soDigitos(it.mat);
    if (!st || !mat) return;
    const k = it.data + '|' + mat;
    if (indice[k]) {
      const cel = sh.getRange(indice[k], c.status + 1);
      if (texto(cel.getValue()) !== st) { cel.setValue(st); atualizadas++; }
    } else {
      const l = new Array(q.info.ult).fill('');
      l[c.data] = isoParaData(it.data); l[c.cod] = mat; if (c.nome >= 0) l[c.nome] = texto(it.nome); l[c.status] = st;
      if (c.cargo >= 0 && cargo[mat]) l[c.cargo] = cargo[mat];
      novas.push(l); indice[k] = -1; criadas++;
    }
  });
  if (novas.length) {
    const n = Math.max(sh.getLastRow(), 1) + 1;
    garantirTamanho(sh, n + novas.length - 1, q.info.ult);
    sh.getRange(n, 1, novas.length, q.info.ult).setValues(novas);
    formatarDatas(sh, c.data, n, novas.length);
  }
  return { criadas: criadas, atualizadas: atualizadas };
}

function chamadaSalvar(d, s) {
  const iso = texto(d.data); isoParaData(iso);
  exigirDiaUtil(iso);
  const itens = (Array.isArray(d.itens) ? d.itens : []).map(function (x) { return { data: iso, mat: x.mat, nome: x.nome, status: x.status }; });
  if (!itens.some(function (x) { return texto(x.status); })) throw new Error('Marque o status de ao menos um colaborador.');
  const r = gravarChamada(itens);
  registrarLog(s, 'Chamada', iso + ' · ' + r.criadas + ' novas, ' + r.atualizadas + ' atualizadas');
  return { ok: true, criadas: r.criadas, atualizadas: r.atualizadas };
}

function chamadaLote(d, s) {
  const mats = (Array.isArray(d.mats) ? d.mats : []).map(soDigitos).filter(String), status = texto(d.status);
  if (!mats.length) throw new Error('Selecione ao menos um colaborador.');
  if (!status) throw new Error('Escolha o status.');
  const ini = isoParaData(d.ini), fim = isoParaData(d.fim);
  if (fim < ini) throw new Error('A data final é anterior à inicial.');
  const dias = Math.round((fim - ini) / 864e5) + 1;
  if (dias > 62) throw new Error('Período muito longo (máximo 62 dias por vez).');
  const nomes = {}; lerTurnover().pessoas.forEach(function (p) { nomes[p.mat] = p.nome; });
  const itens = [], tz = tzDados();
  for (let i = 0; i < dias; i++) {
    const dt = new Date(ini.getTime() + i * 864e5), iso = Utilities.formatDate(dt, tz, 'yyyy-MM-dd');
    const dow = Number(Utilities.formatDate(dt, tz, 'u')); // 6 = sábado, 7 = domingo
    if (dow >= 6) continue;                                 // chamada é de segunda a sexta
    mats.forEach(function (m) { itens.push({ data: iso, mat: m, nome: nomes[m] || nomeDaMatricula(m), status: status }); });
  }
  const r = gravarChamada(itens);
  registrarLog(s, 'Chamada em lote', status + ' · ' + d.ini + ' a ' + d.fim + ' · ' + mats.length + ' colaborador(es)');
  return { ok: true, criadas: r.criadas, atualizadas: r.atualizadas, dias: dias };
}

/* ---------- Quadro (aba TURNOVER) ---------- */

function quadroListar() { const t = lerTurnover(); return { ok: true, pessoas: t.pessoas }; }

function quadroSalvar(d, s) {
  const t = lerTurnover(), info = t.info, sh = info.sh;
  const mat = soDigitos(d.matric), nome = texto(d.nome), linhaEd = Number(d.linha) || 0;
  if (!mat) throw new Error('Informe a matrícula.');
  if (!nome) throw new Error('Informe o nome.');
  const tipo = texto(d.tipo), motivo = texto(d.motivo), obs = texto(d.obs);
  const dtAdm = texto(d.dtAdm), dtDesl = texto(d.dtDesl), dtTransf = texto(d.dtTransf);
  [dtAdm, dtDesl, dtTransf].forEach(function (x) { if (x) isoParaData(x); });
  const saiu = !!(dtDesl || dtTransf || /TRANSFER/.test(normalizar(tipo)));
  if (saiu && !tipo) throw new Error('Informe o tipo (desligamento, pediu desligamento ou transferência).');
  if (/TRANSFER/.test(normalizar(tipo)) && !dtTransf) throw new Error('Informe a data da transferência.');
  if (saiu && !/TRANSFER/.test(normalizar(tipo)) && !motivo) throw new Error('Informe o motivo do desligamento.');
  const ativo = !saiu;
  if (!linhaEd && t.pessoas.some(function (p) { return p.mat === mat && p.ativo; }))
    throw new Error('A matrícula ' + mat + ' já está ATIVA no quadro. Edite o registro existente.');
  if (linhaEd && !t.pessoas.some(function (p) { return p.linha === linhaEd; })) throw new Error('Registro não encontrado (a aba mudou). Recarregue.');

  const c = {
    mat: t.idx.mat, nome: t.idx.nome,
    ativo: garantirCol(info, ALIAS_TURN.ativo, 'ATIVO'), tipo: garantirCol(info, ALIAS_TURN.tipo, 'TIPO'),
    motivo: garantirCol(info, ALIAS_TURN.motivo, 'MOTIVO'), obs: garantirCol(info, ALIAS_TURN.obs, 'OBS'),
    adm: garantirCol(info, ALIAS_TURN.adm, 'DATA CONTRATAÇÃO'), desl: garantirCol(info, ALIAS_TURN.desl, 'DATA DESLIGAMENTO'),
    transf: garantirCol(info, ALIAS_TURN.transf, 'DATA TRANSFERÊNCIA')
  };
  const l = new Array(info.ult).fill('');
  if (linhaEd) { const atual = sh.getRange(linhaEd, 1, 1, info.ult).getValues()[0]; for (let i = 0; i < atual.length; i++) l[i] = atual[i]; }
  l[c.mat] = mat; l[c.nome] = nome; l[c.ativo] = ativo ? 'Sim' : 'Não'; l[c.tipo] = tipo; l[c.motivo] = motivo; l[c.obs] = obs;
  l[c.adm] = dtAdm ? isoParaData(dtAdm) : ''; l[c.desl] = dtDesl ? isoParaData(dtDesl) : ''; l[c.transf] = dtTransf ? isoParaData(dtTransf) : '';
  const n = linhaEd || (Math.max(sh.getLastRow(), 1) + 1);
  garantirTamanho(sh, n, info.ult);
  sh.getRange(n, 1, 1, info.ult).setValues([l]);
  [c.adm, c.desl, c.transf].forEach(function (k) { formatarDatas(sh, k, n, 1); });
  CacheService.getScriptCache().remove('nome_' + mat);
  registrarLog(s, linhaEd ? 'Quadro (edição)' : 'Quadro (novo)', mat + ' ' + nome + ' · ' + (ativo ? 'ATIVO' : 'NÃO ativo' + (tipo ? ' (' + tipo + ')' : '')));
  return { ok: true, ativo: ativo, linha: n };
}

/* ---------- Missões ---------- */

function horaParaMin(t) {
  const m = String(t || '').match(/^(\d{1,2}):(\d{2})/);
  if (!m || +m[1] > 23 || +m[2] > 59) throw new Error('Hora inválida (use HH:MM).');
  return +m[1] * 60 + +m[2];
}
function missaoSalvar(d, s) {
  const iso = texto(d.data), cod = soDigitos(d.cod), tipo = texto(d.tipo);
  isoParaData(iso);
  if (!cod) throw new Error('Informe o código do colaborador.');
  const nome = nomePorMatricula(cod) || texto(d.nome);
  if (!nome) throw new Error('Código não encontrado no quadro.');
  if (!tipo) throw new Error('Escolha o tipo da missão.');
  const ini = horaParaMin(d.ini), fim = horaParaMin(d.fim);
  let tot = fim - ini; if (tot < 0) tot += 1440;
  if (tot === 0) throw new Error('Hora início e fim iguais.');
  const info = infoAba('MISSÕES');
  const c = {
    data: garantirCol(info, ['DATA'], 'DATA'), ini: garantirCol(info, ['HORA INICIO'], 'HORA INICIO'), fim: garantirCol(info, ['HORA FIM'], 'HORA FIM'),
    cod: garantirCol(info, ['CODIGO', 'COD'], 'CODIGO'), nome: garantirCol(info, ['NOME'], 'NOME'), tipo: garantirCol(info, ['TIPO', 'REGRA'], 'TIPO'),
    tot: acharCol(info, ['TEMPO TOTAL'])
  };
  const dup = lerLinhas(info).some(function (l) {
    return chaveData(l[c.data]) === iso && soDigitos(l[c.cod]) === cod && texto(l[c.tipo]) === tipo && minDaCelula(l[c.ini]) === ini && minDaCelula(l[c.fim]) === fim;
  });
  if (dup) throw new Error('Essa missão já foi lançada (mesma data, colaborador, horário e tipo).');
  const l = new Array(info.ult).fill('');
  l[c.data] = isoParaData(iso); l[c.ini] = ini / 1440; l[c.fim] = fim / 1440; l[c.cod] = cod; l[c.nome] = nome; l[c.tipo] = tipo;
  if (c.tot >= 0) l[c.tot] = tot / 1440;
  const n = Math.max(info.sh.getLastRow(), 1) + 1;
  garantirTamanho(info.sh, n, info.ult);
  info.sh.getRange(n, 1, 1, info.ult).setValues([l]);
  formatarDatas(info.sh, c.data, n, 1);
  info.sh.getRange(n, c.ini + 1).setNumberFormat('HH:mm:ss'); info.sh.getRange(n, c.fim + 1).setNumberFormat('HH:mm:ss');
  if (c.tot >= 0) info.sh.getRange(n, c.tot + 1).setNumberFormat('[h]:mm:ss');
  registrarLog(s, 'Missão', cod + ' ' + nome + ' · ' + iso + ' · ' + tipo + ' · ' + Math.floor(tot / 60) + 'h' + ('0' + (tot % 60)).slice(-2));
  return { ok: true, nome: nome, totalMin: tot };
}
function minDaCelula(v) {
  if (v instanceof Date) return v.getHours() * 60 + v.getMinutes();
  if (typeof v === 'number') return Math.round((v % 1) * 1440);
  const m = String(v || '').match(/^(\d{1,2}):(\d{2})/);
  return m ? +m[1] * 60 + +m[2] : -1;
}

/* ---------- Capacidade Realizada ---------- */

function capacidadeSalvar(d, s) {
  const iso = texto(d.data), cod = texto(d.cod), tipo = texto(d.tipo).toUpperCase();
  isoParaData(iso);
  if (!cod) throw new Error('Informe o código do produto.');
  if (['CORRETIVO', 'PREVENTIVO'].indexOf(tipo) < 0) throw new Error('O tipo deve ser CORRETIVO ou PREVENTIVO.');
  const info = infoAba('Capacidade Realizada');
  const c = { cod: garantirCol(info, ['CODIGO', 'COD', 'CODPROD'], 'CODIGO'), data: garantirCol(info, ['DATA'], 'DATA'), tipo: garantirCol(info, ['TIPO'], 'TIPO') };
  const dup = lerLinhas(info).some(function (l) { return texto(l[c.cod]) === cod && chaveData(l[c.data]) === iso && texto(l[c.tipo]).toUpperCase() === tipo; });
  if (dup) throw new Error('O produto ' + cod + ' já tem lançamento ' + tipo + ' em ' + iso.split('-').reverse().join('/') + '.');
  const l = new Array(info.ult).fill('');
  l[c.cod] = /^\d+$/.test(cod) ? Number(cod) : cod; l[c.data] = isoParaData(iso); l[c.tipo] = tipo;
  const n = Math.max(info.sh.getLastRow(), 1) + 1;
  garantirTamanho(info.sh, n, info.ult);
  info.sh.getRange(n, 1, 1, info.ult).setValues([l]);
  formatarDatas(info.sh, c.data, n, 1);
  registrarLog(s, 'Capacidade Realizada', cod + ' · ' + tipo + ' · ' + iso);
  return { ok: true };
}


/* ---------- Férias (aba FÉRIAS AGENDADAS) ---------- */

const CAB_FERIAS = ['Cod', 'Nome', 'Data Inicio', 'Data Fim', 'Dias', 'Status', 'Lancado Em', 'Lancado Por'];

function feriasLer(criar) {
  const ss = dadosSS();
  if (!criar && !ss.getSheetByName(ABA_FERIAS)) return [];
  abaComCabecalho(ABA_FERIAS, CAB_FERIAS);
  const info = infoAba(ABA_FERIAS);
  const c = { mat: acharCol(info, ['COD', 'MATRICULA']), nome: acharCol(info, ['NOME']), ini: acharCol(info, ['DATA INICIO']), fim: acharCol(info, ['DATA FIM']),
    dias: acharCol(info, ['DIAS']), st: acharCol(info, ['STATUS']) };
  const out = [];
  lerLinhas(info).forEach(function (l, i) {
    const mat = soDigitos(l[c.mat]); if (!mat) return;
    out.push({ linha: i + 2, mat: mat, nome: texto(l[c.nome]), ini: chaveData(l[c.ini]), fim: chaveData(l[c.fim]), dias: Number(l[c.dias]) || 0,
      status: normalizar(l[c.st]) === 'CANCELADA' ? 'CANCELADA' : 'AGENDADA' });
  });
  return out;
}
function feriasListar() { return { ok: true, ferias: feriasLer(true), dias: DIAS_FERIAS }; }

function feriasSalvar(d, s) {
  const mat = soDigitos(d.mat), dias = Number(d.dias), ini = texto(d.ini);
  if (!mat) throw new Error('Informe a matrícula.');
  const nome = nomePorMatricula(mat);
  if (!nome) throw new Error('Matrícula não encontrada no quadro (aba TURNOVER).');
  if (DIAS_FERIAS.indexOf(dias) < 0) throw new Error('Escolha 5, 10, 15, 20, 25, 30 ou 31 dias.');
  isoParaData(ini);
  const fim = somaDiasIso(ini, dias - 1);
  const todas = feriasLer(true).filter(function (f) { return f.status !== 'CANCELADA'; });
  const meus = todas.filter(function (f) { return f.mat === mat && f.ini <= fim && ini <= f.fim; });
  if (meus.length) throw new Error(nome + ' já tem férias agendadas de ' + meus[0].ini.split('-').reverse().join('/') + ' a ' + meus[0].fim.split('-').reverse().join('/') + ' (período sobreposto).');
  const conflitos = todas.filter(function (f) { return f.mat !== mat && f.ini <= fim && ini <= f.fim; })
    .map(function (f) { return { mat: f.mat, nome: f.nome, ini: f.ini, fim: f.fim }; });
  const info = infoAba(ABA_FERIAS);
  const l = new Array(info.ult).fill('');
  const c = { mat: acharCol(info, ['COD', 'MATRICULA']), nome: acharCol(info, ['NOME']), ini: acharCol(info, ['DATA INICIO']), fim: acharCol(info, ['DATA FIM']),
    dias: acharCol(info, ['DIAS']), st: acharCol(info, ['STATUS']), em: acharCol(info, ['LANCADO EM']), por: acharCol(info, ['LANCADO POR']) };
  l[c.mat] = mat; l[c.nome] = nome; l[c.ini] = isoParaData(ini); l[c.fim] = isoParaData(fim); l[c.dias] = dias; l[c.st] = 'Agendada';
  l[c.em] = Utilities.formatDate(new Date(), tzDados(), 'dd/MM/yyyy HH:mm:ss'); l[c.por] = s.nome || s.matricula;
  const n = Math.max(info.sh.getLastRow(), 1) + 1;
  garantirTamanho(info.sh, n, info.ult);
  info.sh.getRange(n, 1, 1, info.ult).setValues([l]);
  formatarDatas(info.sh, c.ini, n, 1); formatarDatas(info.sh, c.fim, n, 1);
  info.sh.getRange(n, c.em + 1).setNumberFormat('@');
  registrarLog(s, 'Férias', mat + ' ' + nome + ' · ' + ini + ' a ' + fim + ' (' + dias + ' dias)');
  return { ok: true, nome: nome, ini: ini, fim: fim, dias: dias, conflitos: conflitos };
}

function feriasCancelar(d, s) {
  const linha = Number(d.linha) || 0;
  const info = infoAba(ABA_FERIAS), cSt = acharCol(info, ['STATUS']), cM = acharCol(info, ['COD', 'MATRICULA']), cN = acharCol(info, ['NOME']);
  if (linha < 2 || linha > info.sh.getLastRow()) throw new Error('Registro não encontrado. Recarregue a lista.');
  info.sh.getRange(linha, cSt + 1).setValue('Cancelada');
  registrarLog(s, 'Férias (cancelamento)', soDigitos(info.sh.getRange(linha, cM + 1).getValue()) + ' ' + texto(info.sh.getRange(linha, cN + 1).getValue()));
  return { ok: true };
}

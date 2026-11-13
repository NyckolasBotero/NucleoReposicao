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
const SUBS_LANC = ['Lançar Feedback', 'Lançar Advertência', 'Lançar Suspensão', 'Lançar Avaria 9712', 'Lançar Chamada', 'Lançar Quadro', 'Lançar Missões', 'Lançar Capacidade', 'Lançar Férias', 'Controle de Coletores', 'Devolução de Mercadorias', 'Certificados'];
/** Nomes antigos de abas continuam valendo (quem já tinha "Feedbacks" ou "Lançar REP.AVARIA" não perde o acesso). */
const NOMES_ANTIGOS = { 'FEEDBACKSEADVERTENCIAS': 'FEEDBACKS', 'LANCARAVARIA9712': 'LANCARREPAVARIA' };
const ABA_ADVERTENCIAS = 'ADVERTÊNCIAS';
const ABA_SUSPENSOES = 'SUSPENSÕES';
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
 *   data              → título da coluna de data. Habilita a CONFERÊNCIA RÁPIDA (só o último mês da base, por dia).
 *                       Sem "data", a base só tem a verificação completa (linha a linha, mais lenta).
 *   os                → título da coluna do número da O.S. (opcional): a conferência rápida também compara O.S. distintas por dia.
 */
/* Bases com oculta:true não aparecem em Administração > Bases (são gravadas pelas telas de Lançamentos ou por link externo). */
const BASES = {
  '8460':               { modo: 'acumular',   desc: 'Produção por O.S. (separação / reposição)', data: 'DTFIMSEPARACAO', os: 'NUMOS' },
  '8271':               { modo: 'acumular',   desc: 'O.S. por rua', data: 'DATA', os: 'NUMOS' },
  '8457':               { modo: 'acumular',   desc: 'Produção de operadores (endereços)', data: 'DATA' },
  '9712':               { modo: 'acumular',   desc: 'Lançamentos de avaria / baixas', data: 'Data' },
  'REP.AVARIA':         { oculta: true, modo: 'acumular',   desc: 'Avarias de reposição' },
  'QUADRO REP':         { oculta: true, modo: 'acumular',   desc: 'Quadro diário de repositores', data: 'DATA' },
  'FEEDBACK REP':       { oculta: true, modo: 'acumular',   desc: 'Feedbacks dos repositores', data: 'Data' },
  'AUDITORIA REP':      { oculta: true, modo: 'acumular',   desc: 'Auditoria por rua e dia', data: 'DATA' },
  'MISSÕES':            { oculta: true, modo: 'acumular',   desc: 'Missões', data: 'DATA' },
  'TURNOVER':           { oculta: true, modo: 'substituir', desc: 'Turnover' },
  'CRONOGRAMA':         { modo: 'substituir', desc: 'Cronograma de atividades' },
  '8022':               { modo: 'substituir', desc: 'Cadastro de produtos / ruas' },
  '8022 Nova':          { modo: 'substituir', desc: 'Cadastro de produtos (nova)' },
  '1707':               { modo: 'substituir', desc: '1707 GERAL – saldo por endereço', semCabecalho: true },
  'Capacidade Realizada': { oculta: true, modo: 'substituir', desc: 'Capacidade realizada' },
  'Tipo':               { oculta: true, modo: 'substituir', desc: 'Tipos' }
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

    // Só quem GRAVA espera na fila (trava global). Consultas não travam ninguém — era isso que gerava
    // "Tempo limite do bloqueio" quando uma carga grande estava em andamento.
    const lk = LEITURAS_SEM_TRAVA[d.acao] ? null : LockService.getScriptLock();
    if (lk) lk.waitLock(90000);
    try {
      if (d.acao === 'admin_listar') { exigir(s, PERM_ACESSOS); return resposta(adminListar()); }
      if (d.acao === 'admin_historico') { exigir(s, PERM_ACESSOS); return resposta(historicoAcessos(d)); }
      if (d.acao === 'admin_salvar') { exigir(s, PERM_ACESSOS); return resposta(adminSalvar(d, s)); }
      if (d.acao === 'bases_status') { exigir(s, PERM_BASES); return resposta(basesStatus()); }
      if (d.acao === 'bases_resumo') { exigir(s, PERM_BASES); return resposta(basesResumo(d)); }
      if (d.acao === 'bases_enviar') { exigir(s, PERM_BASES); return resposta(basesEnviar(d)); }
      if (d.acao === 'bases_dias') { exigir(s, PERM_BASES); return resposta(basesDias(d)); }
      if (d.acao === 'bases_aplicar') { exigir(s, PERM_BASES); return resposta(basesAplicar(d)); }
      if (d.acao === 'alertas_ler') return resposta(alertasLer(s));
      if (d.acao === 'alertas_cfg_salvar') return resposta(alertasSalvarCfg(d, s));
      if (d.acao === 'alertas_prefs_salvar') return resposta(alertasSalvarPrefs(d, s));
      if (d.acao === 'alertas_concluir') return resposta(alertasConcluir(d, s));
      if (d.acao === 'tv_cfg_ler') return resposta({ ok: true, config: alertasLerChave('tv_cfg') || {}, admin: ehAdminAlertas(s) });
      if (d.acao === 'tv_cfg_salvar') return resposta(tvCfgSalvar(d, s));
      if (d.acao === 'tv_fotos_ler') return resposta(tvFotosLer());
      if (d.acao === 'push_chave') return resposta(pushChave(s));
      if (d.acao === 'push_inscrever') return resposta(pushInscrever(d, s));
      if (d.acao === 'push_remover') return resposta(pushRemover(d, s));
      if (d.acao === 'push_teste') return resposta(pushTeste(s));
      if (d.acao === 'bases_modo') { exigir(s, PERM_BASES); return resposta(basesModo(d)); }
      if (d.acao === 'bases_excluir') { exigir(s, PERM_BASES); return resposta(basesExcluir(d, s)); }
      if (d.acao === 'bases_concluir') { exigir(s, PERM_BASES); return resposta(basesConcluir(d, s)); }
      if (String(d.acao || '').indexOf('lanc_') === 0) return resposta(lancamento(d, s));
    } finally { if (lk) lk.releaseLock(); }
    return resposta({ ok: false, erro: 'Ação desconhecida.' });
  } catch (err) {
    let msg = String(err && err.message ? err.message : err);
    if (/bloqueio|lock/i.test(msg)) msg = 'O servidor está ocupado com outra gravação. Aguarde alguns segundos e tente de novo.';
    return resposta({ ok: false, erro: msg });
  }
}

/** Ações que só leem: rodam sem a trava global (várias pessoas podem consultar enquanto alguém grava). */
const LEITURAS_SEM_TRAVA = {
  admin_listar: 1, admin_historico: 1, alertas_ler: 1, tv_cfg_ler: 1, tv_fotos_ler: 1, push_chave: 1, bases_status: 1, bases_resumo: 1, bases_dias: 1,
  lanc_avaria_listar: 1, lanc_avaria_verificar: 1, lanc_anexo_ler: 1, lanc_base_atualizada: 1, lanc_chamada_dia: 1,
  lanc_feedback_listar: 1, lanc_advertencia_listar: 1, lanc_ferias_listar: 1
};

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
  const T = { sh: sh, iMat: achar('MATRIC'), iAba: achar('ABA'), iSub: achar('SUBABA'), iSen: achar('SENHA'), iSta: achar('STATUS'), iNome: achar('NOME') };
  if (T.iMat < 0 || T.iAba < 0 || T.iSub < 0) throw new Error('A aba precisa das colunas Matricula, Aba e Sub Aba.');
  if (T.iSen < 0) { T.iSen = ultCol; sh.getRange(1, ultCol + 1).setValue('Senha').setFontWeight('bold'); ultCol++; }
  if (T.iSta < 0) {
    T.iSta = ultCol; sh.getRange(1, ultCol + 1).setValue('Status').setFontWeight('bold'); ultCol++;
    if (sh.getLastRow() > 1) sh.getRange(2, ultCol, sh.getLastRow() - 1, 1).setValue('Ativo');
  }
  if (T.iNome < 0) { T.iNome = ultCol; sh.getRange(1, ultCol + 1).setValue('Nome').setFontWeight('bold'); ultCol++; }
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
    const u = mapa[mat] = mapa[mat] || { matricula: mat, nome: '', senha: '', bloqueado: false, perms: [], _vistos: {} };
    const nm = String(l[T.iNome] || '').trim(); if (nm && !u.nome) u.nome = nm;
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
/** Usuário (permissões, bloqueio) com cache de 60 s: evita reabrir a planilha de permissões em toda chamada. */
function usuarioRapido(mat) {
  const cache = CacheService.getScriptCache();
  let ver = cache.get('usr_v');
  if (!ver) { ver = String(Date.now()); cache.put('usr_v', ver, 21600); }
  const chave = 'usr_' + ver + '_' + mat;
  try { const c = cache.get(chave); if (c) return JSON.parse(c); } catch (e) {}
  const u = lerUsuarios().usuarios[mat];
  if (u) { try { cache.put(chave, JSON.stringify({ bloqueado: u.bloqueado, perms: u.perms, nome: u.nome }), 60); } catch (e) {} }
  return u;
}
/** Chame depois de qualquer mudança em permissões/bloqueios para valer na hora. */
function invalidarUsuarios() { try { CacheService.getScriptCache().put('usr_v', String(Date.now()), 21600); } catch (e) {} }

function validarToken(token) {
  const t = String(token || '').split('.');
  if (t.length !== 3) return { ok: false, erro: 'Faça login.' };
  if (assinar(t[0] + '.' + t[1]) !== t[2]) return { ok: false, erro: 'Login inválido. Entre novamente.' };
  if (Date.now() - Number(t[1]) > VALIDADE_LOGIN_DIAS * 864e5) return { ok: false, erro: 'Login expirado. Entre novamente.' };
  const u = usuarioRapido(t[0]);
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
    // nome digitado em Administração > Acessos tem prioridade sobre o do QUADRO REP
    try { const ud = lerUsuarios().usuarios[mat]; if (ud && ud.nome) { cache.put(chave, ud.nome, 21600); return ud.nome; } } catch (e) {}
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
    return { matricula: m, nome: r.usuarios[m].nome || nomeDaMatricula(m), status: u.bloqueado ? 'Bloqueado' : 'Ativo', temSenha: !!u.senha, perms: u.perms };
  }).sort(function (a, b) { return (a.nome || a.matricula).localeCompare(b.nome || b.matricula); });
  return { ok: true, usuarios: lista };
}

/** Regrava TODAS as linhas da matrícula. senha vazia = mantém a atual. */
function adminSalvar(d, sessao) {
  invalidarUsuarios();
  const orig = String(d.original || '').trim();
  const mat = String(d.matricula || '').replace(/\D/g, '');
  const status = d.status === 'Bloqueado' ? 'Bloqueado' : 'Ativo';
  const nomeDigitado = String(d.nome || '').replace(/\s+/g, ' ').trim().slice(0, 80);
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
  const nomeFinal = nomeDigitado || (atual && atual.nome) || '';  // em branco = mantém o nome já cadastrado
  // apaga as linhas atuais da matrícula (de baixo para cima)
  for (let i = T.linhas.length - 1; i >= 0; i--) if (String(T.linhas[i][T.iMat]).trim() === ref) sh.deleteRow(i + 2);
  // grava as novas (matrícula e senha como TEXTO)
  const linhas = perms.map(function (p) {
    const l = new Array(T.ultCol).fill('');
    l[T.iMat] = mat; l[T.iAba] = p.aba; l[T.iSub] = p.sub; l[T.iSen] = senha; l[T.iSta] = status; l[T.iNome] = nomeFinal;
    return l;
  });
  if (!linhas.length) { // bloqueado sem permissões: mantém uma linha para não perder a matrícula
    const l = new Array(T.ultCol).fill(''); l[T.iMat] = mat; l[T.iSen] = senha; l[T.iSta] = 'Bloqueado'; l[T.iNome] = nomeFinal; linhas.push(l);
  }
  const ini = sh.getLastRow() + 1;
  sh.getRange(ini, 1, linhas.length, T.ultCol).setNumberFormat('@').setValues(linhas);
  CacheService.getScriptCache().remove('nome_' + mat); if (orig) CacheService.getScriptCache().remove('nome_' + orig);
  invalidarUsuarios();
  return { ok: true };
}

/** Rode no editor se precisar derrubar todos os logins (todos terão de entrar de novo). */
function revogarTodosOsLogins() { PropertiesService.getScriptProperties().deleteProperty('SEGREDO'); }

/* ===================== Bases (Administração > Bases) ===================== */

function dadosSS() { return SpreadsheetApp.openById(DADOS_SHEET_ID); }

function basesStatus() {
  const ss = dadosSS(), ultimas = ultimasCargas(ss);
  const LIMITE = 10000000; // limite do Google Sheets: células alocadas (linhas x colunas de todas as abas)
  let usadas = 0;
  ss.getSheets().forEach(function (s) { usadas += s.getMaxRows() * s.getMaxColumns(); });
  const livres = Math.max(0, LIMITE - usadas);
  const bases = Object.keys(BASES).filter(function (n) { return !BASES[n].oculta; }).map(function (nome) {
    const cfg = cfgBase(nome), sh = ss.getSheetByName(nome);
    const lin = sh ? Math.max(0, sh.getLastRow() - (cfg.semCabecalho ? 0 : 1)) : 0;
    let colunas = null, disp = null;
    if (sh) {
      colunas = Math.max(1, sh.getMaxColumns());
      // linhas vazias que a aba já tem + linhas que ainda cabem na planilha
      disp = Math.max(0, sh.getMaxRows() - sh.getLastRow()) + Math.floor(livres / colunas);
    }
    return { base: nome, modo: cfg.modo, desc: cfg.desc, semCabecalho: !!cfg.semCabecalho, existe: !!sh, linhasAtuais: lin, ultimaCarga: ultimas[nome] || null,
             colData: cfg.data || null, colOS: cfg.os || null, colunas: colunas, linhasDisponiveis: disp };
  });
  return { ok: true, bases: bases, planilha: { limite: LIMITE, usadas: usadas, livres: livres, pct: Math.round(usadas / LIMITE * 1000) / 10 } };
}

/** Configuração da base com o "modo de gravação" escolhido no site (guardado nas propriedades do script). */
function cfgBase(nome) {
  const b = BASES[nome];
  if (!b) return undefined;
  const o = PropertiesService.getScriptProperties().getProperty('modo_' + nome);
  const c = {};
  Object.keys(b).forEach(function (k) { c[k] = b[k]; });
  if (o === 'acumular' || o === 'substituir') c.modo = o;
  return c;
}

/** Troca o modo de gravação (agregar / substituir) de uma base. */
function basesModo(d) {
  const nome = String(d.base || ''), modo = String(d.modo || '');
  if (!BASES[nome]) throw new Error('Base desconhecida: ' + nome);
  if (modo !== 'acumular' && modo !== 'substituir') throw new Error('Modo inválido.');
  PropertiesService.getScriptProperties().setProperty('modo_' + nome, modo);
  return { ok: true, base: nome, modo: modo };
}

/** Exclui TODOS os dados da base (mantém só o cabeçalho) e libera o espaço da planilha. */
function basesExcluir(d, sessao) {
  const nome = String(d.base || '');
  const cfg = cfgBase(nome);
  if (!cfg) throw new Error('Base desconhecida: ' + nome);
  const ss = dadosSS(), sh = ss.getSheetByName(nome);
  if (!sh) throw new Error('A aba "' + nome + '" não existe.');
  const antes = Math.max(0, sh.getLastRow() - (cfg.semCabecalho ? 0 : 1));
  const manter = cfg.semCabecalho ? 0 : 1;
  if (cfg.semCabecalho) sh.clearContents(); else if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, Math.max(1, sh.getLastColumn())).clearContent();
  if (sh.getMaxRows() > manter + 1) sh.deleteRows(manter + 2, sh.getMaxRows() - manter - 1);
  // registra no histórico de cargas
  let lg = ss.getSheetByName(ABA_LOG_BASES);
  if (lg) {
    const agora = Utilities.formatDate(new Date(), tzPadrao(), 'dd/MM/yyyy HH:mm:ss');
    lg.getRange(lg.getLastRow() + 1, 1, 1, 9).setNumberFormat('@').setValues([[nome, agora, sessao.nome || sessao.matricula, sessao.matricula, '[BASE EXCLUÍDA]', cfg.modo, 0, 0, 0]]);
  }
  return { ok: true, base: nome, removidas: antes };
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

/* ----- Conferência rápida: só o último mês da base, comparado por dia ----- */

/** Dia (aaaa-MM-dd) de uma célula de data: Date, texto dd/MM/aaaa [hh:mm:ss] ou número serial do Excel. '' se não for data. */
function diaChave(v, tz) {
  if (v instanceof Date) return (isNaN(v.getTime()) || v.getFullYear() < 1902) ? '' : Utilities.formatDate(v, tz, 'yyyy-MM-dd');
  if (typeof v === 'string') {
    const m = v.trim().match(RE_DATA);
    return m ? m[3] + '-' + m[2] + '-' + m[1] : '';
  }
  if (typeof v === 'number' && v > 36526 && v < 80000) return Utilities.formatDate(new Date(Math.round((v - 25569) * 86400000)), 'UTC', 'yyyy-MM-dd');
  return '';
}

/** Posição (0 = primeira coluna) da coluna pelo título, ignorando acento/maiúscula/pontuação. -1 se não existir. */
function colunaPorTitulo(sh, titulo) {
  if (!titulo || !sh || sh.getLastColumn() < 1) return -1;
  return sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0].map(normalizar).indexOf(normalizar(titulo));
}

/**
 * Resumo do ÚLTIMO MÊS da base: quantas linhas (e quantas O.S. distintas, se a base tem coluna de O.S.) há em cada dia.
 * Lê só a coluna de data (e a de O.S.), nunca a base inteira. O site compara isso com o arquivo novo.
 */
function basesResumo(d) {
  const nome = String(d.base || ''), cfg = cfgBase(nome);
  if (!cfg) throw new Error('Base desconhecida: ' + nome);
  if (cfg.modo !== 'acumular' || !cfg.data) throw new Error('A base "' + nome + '" não tem conferência rápida por data. Use a verificação completa.');
  const sh = dadosSS().getSheetByName(nome);
  if (!sh || sh.getLastRow() < 2) return { ok: true, vazia: true, linhasTotal: sh ? sh.getLastRow() : 0 };
  const iD = colunaPorTitulo(sh, cfg.data);
  if (iD < 0) throw new Error('A coluna "' + cfg.data + '" não existe na base "' + nome + '".');
  const iO = cfg.os ? colunaPorTitulo(sh, cfg.os) : -1;
  const n = sh.getLastRow() - 1, tz = tzPadrao();
  const datas = sh.getRange(2, iD + 1, n, 1).getValues();
  const os = iO >= 0 ? sh.getRange(2, iO + 1, n, 1).getValues() : null;
  const chaves = new Array(n);
  let max = '', semData = 0;
  for (let i = 0; i < n; i++) {
    const k = diaChave(datas[i][0], tz);
    chaves[i] = k;
    if (!k) { semData++; continue; }
    if (k > max) max = k;
  }
  if (!max) return { ok: true, vazia: true, semData: semData, linhasTotal: sh.getLastRow() };
  const mes = max.slice(0, 7), dias = {}, setsOS = {};
  for (let i = 0; i < n; i++) {
    const k = chaves[i];
    if (!k || k.slice(0, 7) !== mes) continue;
    const x = dias[k] || (dias[k] = { l: 0, o: 0 });
    x.l++;
    if (os) { const v = String(os[i][0]).trim(); if (v) (setsOS[k] || (setsOS[k] = {}))[v] = 1; }
  }
  if (os) Object.keys(setsOS).forEach(function (k) { dias[k].o = Object.keys(setsOS[k]).length; });
  return { ok: true, linhasTotal: sh.getLastRow(), ultimaData: max, mes: mes, dias: dias, semData: semData, temOS: !!os };
}

/** Chaves das linhas que a aba já tem num dia (lê só o trecho desse dia, não a base inteira). */
function chavesDoDia(sh, iD, corte, tz, largura) {
  const n = sh.getLastRow() - 1, set = new Set();
  const datas = sh.getRange(2, iD + 1, n, 1).getValues();
  let ini = -1, fim = -1;
  for (let i = 0; i < n; i++) if (diaChave(datas[i][0], tz) === corte) { if (ini < 0) ini = i; fim = i; }
  if (ini < 0) return set;
  sh.getRange(2 + ini, 1, fim - ini + 1, largura).getValues().forEach(function (l) { set.add(chaveLinha(l, tz)); });
  return set;
}

/**
 * Gravação rápida (modo acumular). O site já conferiu o último mês e manda só as linhas do último dia da base
 * (diaCorte) em diante, sem repetições dentro do arquivo.
 *  - 1ª parte: confere que a base não mudou desde a conferência (mesmo número de linhas).
 *  - linhas do próprio dia de corte: só entram se ainda não existirem naquele dia (completa um dia parcial, sem duplicar).
 *  - linhas dos dias seguintes: apenas acrescentadas ao fim.
 */
function basesEnviarRapido(d, nome, cfg) {
  if (cfg.modo !== 'acumular' || !cfg.data) throw new Error('A base "' + nome + '" não aceita gravação rápida. Use a verificação completa.');
  const corte = String(d.diaCorte || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(corte)) throw new Error('Dia de corte inválido.');
  const parte = Number(d.parte) || 1, tz = tzPadrao();
  const cab = (Array.isArray(d.cabecalho) ? d.cabecalho : []).map(function (s) { return String(s == null ? '' : s).trim(); });
  const entrada = (Array.isArray(d.linhas) ? d.linhas : []).map(function (l) { return l.map(converter); });
  const sh = dadosSS().getSheetByName(nome);
  if (!sh || sh.getLastRow() < 2) throw new Error('A base "' + nome + '" está vazia. Use a verificação completa.');
  if (parte === 1 && Number(d.linhasTotal) !== sh.getLastRow())
    throw new Error('A base mudou desde a conferência (outra carga foi gravada?). Confira o arquivo de novo antes de gravar.');

  const shCab = sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0].map(function (s) { return String(s).trim(); });
  while (shCab.length && !shCab[shCab.length - 1]) shCab.pop();
  const novasCols = cab.filter(function (c) { return c && shCab.indexOf(c) < 0; });
  if (novasCols.length) throw new Error('O arquivo tem colunas que não existem na base "' + nome + '": ' + novasCols.join(', ') + '. Confira se é o arquivo certo.');
  const mapa = shCab.map(function (c) { return cab.indexOf(c); });
  const iD = shCab.map(normalizar).indexOf(normalizar(cfg.data));
  if (iD < 0 || mapa[iD] < 0) throw new Error('A coluna "' + cfg.data + '" não está no arquivo / na base "' + nome + '".');

  let existentes = null, ignoradas = 0;
  const novas = [];
  entrada.forEach(function (l) {
    const linha = mapa.map(function (i) { return i < 0 ? '' : (l[i] === undefined ? '' : l[i]); });
    if (linha.every(function (v) { return v === '' || v === null; })) return;
    const k = diaChave(l[mapa[iD]], tz);
    if (!k || k < corte) { ignoradas++; return; }       // o site não manda isso; proteção extra
    if (k === corte) {
      if (!existentes) existentes = chavesDoDia(sh, iD, corte, tz, shCab.length);
      const ch = chaveLinha(linha, tz);
      if (existentes.has(ch)) return;
      existentes.add(ch);
    }
    novas.push(linha);
  });
  if (novas.length) {
    const ini = Math.max(sh.getLastRow(), 1) + 1;
    garantirTamanho(sh, ini + novas.length - 1, shCab.length);
    sh.getRange(ini, 1, novas.length, shCab.length).setValues(novas);
  }
  return { ok: true, rapido: true, modo: cfg.modo, recebidas: entrada.length, novas: novas.length, duplicadas: entrada.length - novas.length - ignoradas, ignoradas: ignoradas };
}

/**
 * Recebe uma parte do arquivo. simular=true só confere (nada é gravado).
 * substituir: na parte 1 limpa a aba e grava; nas demais acrescenta.
 * acumular:   grava só as linhas cuja linha inteira ainda não existe na aba (e que não repetem no arquivo).
 */
function basesEnviar(d) {
  const nome = String(d.base || ''), cfg = cfgBase(nome);
  if (!cfg) throw new Error('Base desconhecida: ' + nome);
  if (d.rapido === true) return basesEnviarRapido(d, nome, cfg);
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

/**
 * Contagem de linhas POR DIA na base, a partir de `de` (aaaa-MM-dd; vazio = tudo). Lê só a coluna de data.
 * O site usa isso para comparar, dia a dia, só os dias que o arquivo novo e a base têm em comum.
 */
function basesDias(d) {
  const nome = String(d.base || ''), cfg = cfgBase(nome);
  if (!cfg) throw new Error('Base desconhecida: ' + nome);
  if (cfg.modo !== 'acumular' || !cfg.data) throw new Error('A base "' + nome + '" não tem coluna de data para comparar por dia.');
  const ss = dadosSS(), sh = ss.getSheetByName(nome), ultima = ultimasCargas(ss)[nome] || null;
  if (!sh || sh.getLastRow() < 2) return { ok: true, vazia: true, linhasTotal: sh ? sh.getLastRow() : 0, dias: {}, ultimaData: '', ultimaCarga: ultima };
  const iD = colunaPorTitulo(sh, cfg.data);
  if (iD < 0) throw new Error('A coluna "' + cfg.data + '" não existe na base "' + nome + '".');
  const de = String(d.de || ''), n = sh.getLastRow() - 1, tz = tzPadrao(), datas = sh.getRange(2, iD + 1, n, 1).getValues();
  const dias = {}; let max = '', semData = 0;
  for (let i = 0; i < n; i++) {
    const k = diaChave(datas[i][0], tz);
    if (!k) { semData++; continue; }
    if (k > max) max = k;
    if (!de || k >= de) dias[k] = (dias[k] || 0) + 1;
  }
  return { ok: true, linhasTotal: sh.getLastRow(), ultimaData: max, dias: dias, semData: semData, ultimaCarga: ultima };
}

/**
 * Grava o plano aprovado pelo site, em blocos grandes (uma escrita por bloco):
 *  - parte 1: apaga da base os dias a SUBSTITUIR (d.substituir = ['aaaa-MM-dd', ...]) e acrescenta o 1º bloco ao fim;
 *  - demais partes: só acrescentam ao fim.
 * d.linhasTotal = nº de linhas que a base deve ter ANTES desta parte (garante que nada mudou no meio do caminho
 * e impede gravar o mesmo arquivo duas vezes). Devolve linhasApos, para a próxima parte.
 */
function basesAplicar(d) {
  const nome = String(d.base || ''), cfg = cfgBase(nome);
  if (!cfg) throw new Error('Base desconhecida: ' + nome);
  if (cfg.modo !== 'acumular' || !cfg.data) throw new Error('A base "' + nome + '" não aceita gravação por dia.');
  const parte = Number(d.parte) || 1, tz = tzPadrao(), ss = dadosSS();
  const cab = (Array.isArray(d.cabecalho) ? d.cabecalho : []).map(function (x) { return String(x == null ? '' : x).trim(); });
  const entrada = (Array.isArray(d.linhas) ? d.linhas : []).map(function (l) { return l.map(converter); });
  let sh = ss.getSheetByName(nome);
  if (!sh || sh.getLastRow() === 0) {
    if (!cab.filter(String).length) throw new Error('O arquivo não tem linha de títulos.');
    if (!sh) sh = ss.insertSheet(nome);
    garantirTamanho(sh, 1, cab.length);
    sh.getRange(1, 1, 1, cab.length).setValues([cab]);
  }
  if (Number(d.linhasTotal) !== sh.getLastRow())
    throw new Error('A base mudou desde a conferência (outra carga foi gravada ou este arquivo já foi enviado). Confira o arquivo de novo.');

  const shCab = sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0].map(function (x) { return String(x).trim(); });
  while (shCab.length && !shCab[shCab.length - 1]) shCab.pop();
  const novasCols = cab.filter(function (c) { return c && shCab.indexOf(c) < 0; });
  if (novasCols.length) throw new Error('O arquivo tem colunas que não existem na base "' + nome + '": ' + novasCols.join(', ') + '. Confira se é o arquivo certo.');
  const mapa = shCab.map(function (c) { return cab.indexOf(c); });
  if (mapa.every(function (i) { return i < 0; })) throw new Error('Nenhuma coluna do arquivo confere com a base "' + nome + '".');

  let removidas = 0;
  const sub = {}; (Array.isArray(d.substituir) ? d.substituir : []).forEach(function (k) { sub[String(k)] = 1; });
  if (parte === 1 && Object.keys(sub).length && sh.getLastRow() > 1) {
    const iD = shCab.map(normalizar).indexOf(normalizar(cfg.data));
    const datas = sh.getRange(2, iD + 1, sh.getLastRow() - 1, 1).getValues(), runs = [];
    let ini = -1;
    for (let i = 0; i <= datas.length; i++) {
      const alvo = i < datas.length && sub[diaChave(datas[i][0], tz)] === 1;
      if (alvo && ini < 0) ini = i;
      if (!alvo && ini >= 0) { runs.push([ini, i - ini]); ini = -1; }
    }
    for (let r = runs.length - 1; r >= 0; r--) { sh.deleteRows(2 + runs[r][0], runs[r][1]); removidas += runs[r][1]; }
  }
  const novas = [];
  entrada.forEach(function (l) {
    const linha = mapa.map(function (i) { return i < 0 ? '' : (l[i] === undefined ? '' : l[i]); });
    if (!linha.every(function (v) { return v === '' || v === null; })) novas.push(linha);
  });
  if (novas.length) {
    const ini = Math.max(sh.getLastRow(), 1) + 1;
    garantirTamanho(sh, ini + novas.length - 1, shCab.length);
    sh.getRange(ini, 1, novas.length, shCab.length).setValues(novas);
  }
  return { ok: true, gravadas: novas.length, removidas: removidas, linhasApos: sh.getLastRow() };
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
  sh.getRange(n, 1, 1, 9).setNumberFormat('@').setValues([[nome, agora, sessao.nome || sessao.matricula, sessao.matricula, String(d.arquivo || ''), cfgBase(nome).modo,
    Number(d.enviadas) || 0, Number(d.novas) || 0, Number(d.duplicadas) || 0]]);
  return { ok: true, quando: agora };
}


/* ===================== Central de Alertas (configuração e preferências) ===================== */

const ABA_ALERTAS = 'ALERTAS_CONFIG';
/** Só o Fabio Nyckolas define quais alertas existem e quem recebe cada um. */
function ehAdminAlertas(s) { return normalizar(s.nome || '').indexOf('FABIONYCKOLAS') === 0; }

function alertasSheet() { return abaComCabecalho(ABA_ALERTAS, ['Chave', 'Json', 'Atualizado']); }
function alertasLerChave(chave) {
  const sh = alertasSheet(), ult = sh.getLastRow();
  if (ult < 2) return null;
  const v = sh.getRange(2, 1, ult - 1, 2).getValues();
  for (let i = 0; i < v.length; i++) if (String(v[i][0]) === chave) { try { return JSON.parse(String(v[i][1] || 'null')); } catch (e) { return null; } }
  return null;
}
function alertasGravarChave(chave, obj) {
  const sh = alertasSheet(), ult = sh.getLastRow(), json = JSON.stringify(obj);
  if (json.length > 45000) throw new Error('Configuração grande demais. Remova alertas ou vetos antigos.');
  const agora = Utilities.formatDate(new Date(), tzPadrao(), 'dd/MM/yyyy HH:mm:ss');
  if (ult >= 2) {
    const v = sh.getRange(2, 1, ult - 1, 1).getValues();
    for (let i = 0; i < v.length; i++) if (String(v[i][0]) === chave) { sh.getRange(i + 2, 1, 1, 3).setNumberFormat('@').setValues([[chave, json, agora]]); return; }
  }
  sh.getRange(ult + 1, 1, 1, 3).setNumberFormat('@').setValues([[chave, json, agora]]);
}

/** Guarda quem fez a chamada do dia, quando, e quem não está presente (o painel de alertas mostra isso). Mantém os 15 últimos. */
function alertasRegistrarChamada(iso, itens, s) {
  try {
    const aus = [], outros = { FOLGA: 0, FERIAS: 0 }; let presentes = 0;
    itens.forEach(function (x) {
      const st = normalizar(texto(x.status));
      if (!st) return;
      if (st === 'FALTA' || st === 'ATESTADO' || st === 'SUSPENSAO') aus.push({ nome: texto(x.nome) || nomeDaMatricula(soDigitos(x.mat)), status: texto(x.status) });
      else if (st === 'FOLGA') outros.FOLGA++;
      else if (st === 'FERIAS') outros.FERIAS++;
      else presentes++;
    });
    const lista = alertasLerChave('evt_chamada') || [];
    const novo = { data: iso, quando: Utilities.formatDate(new Date(), tzPadrao(), "yyyy-MM-dd'T'HH:mm:ss"), mat: s.matricula, quem: s.nome || s.matricula, presentes: presentes, folgas: outros.FOLGA, ferias: outros.FERIAS, ausentes: aus };
    const resto = lista.filter(function (e) { return !(e.data === iso && e.mat === s.matricula); });
    resto.unshift(novo);
    alertasGravarChave('evt_chamada', resto.slice(0, 15));
    const hora = novo.quando.slice(11, 16), dd = iso.split('-').reverse().join('/');
    const corpo = aus.length ? aus.length + ' sem presença: ' + aus.slice(0, 5).map(function (x) { return x.nome + ' (' + String(x.status).toLowerCase() + ')'; }).join(', ') + (aus.length > 5 ? ' e mais ' + (aus.length - 5) : '')
      : 'Todos presentes (' + presentes + ').';
    pushEnviar(alertasDestinatarios('chamada', 'admin'), 'Chamada de ' + dd + ' feita por ' + novo.quem + ' às ' + hora, corpo, 'chamada');
  } catch (e) { /* o alerta nunca pode impedir a chamada */ }
}

/* ===================== Painel TV: parâmetros e fotos ===================== */

const ABA_FOTOS_TV = 'FOTOS_TV';
function fotosSheet() { return abaComCabecalho(ABA_FOTOS_TV, ['Matrícula', 'Foto', 'Atualizado']); }

/** Só o administrador (Fabio) altera o que o painel mostra. Todos os usuários leem (o painel abre para qualquer um). */
function tvCfgSalvar(d, s) {
  if (!ehAdminAlertas(s)) throw new Error('Só o administrador pode alterar os parâmetros do Painel TV.');
  const c = d.config;
  if (!c || typeof c !== 'object') throw new Error('Configuração inválida.');
  alertasGravarChave('tv_cfg', c);
  registrarLog(s, 'Painel TV (parâmetros)', 'atualizados');
  return { ok: true };
}

/** { matricula: 'data:image/jpeg;base64,...' } — fotos já reduzidas pelo navegador (~256 px). */
function tvFotosLer() {
  const sh = fotosSheet(), ult = sh.getLastRow(), out = {};
  if (ult >= 2) sh.getRange(2, 1, ult - 1, 2).getValues().forEach(function (r) {
    const m = soDigitos(r[0]), f = String(r[1] || '');
    if (m && f.indexOf('data:image/') === 0) out[m] = f;
  });
  return { ok: true, fotos: out };
}

/** Troca (ou remove, com foto vazia) a foto de um colaborador do quadro. */
function quadroFoto(d, s) {
  const mat = soDigitos(d.matric);
  if (!mat) throw new Error('Informe a matrícula.');
  const foto = String(d.foto || '');
  if (foto && !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(foto)) throw new Error('Foto inválida.');
  if (foto.length > 48000) throw new Error('Foto grande demais. Escolha outra imagem.');
  const sh = fotosSheet(), ult = sh.getLastRow(), agora = Utilities.formatDate(new Date(), tzPadrao(), 'dd/MM/yyyy HH:mm:ss');
  let linha = 0;
  if (ult >= 2) { const v = sh.getRange(2, 1, ult - 1, 1).getValues(); for (let i = 0; i < v.length; i++) if (soDigitos(v[i][0]) === mat) { linha = i + 2; break; } }
  if (!foto) { if (linha) sh.deleteRow(linha); }
  else if (linha) sh.getRange(linha, 1, 1, 3).setNumberFormat('@').setValues([[mat, foto, agora]]);
  else sh.getRange(ult + 1, 1, 1, 3).setNumberFormat('@').setValues([[mat, foto, agora]]);
  registrarLog(s, 'Quadro (foto)', mat + (foto ? ' · foto atualizada' : ' · foto removida'));
  return { ok: true };
}

/** Configuração geral + preferências de quem está logado (+ lista de usuários para o administrador). */
function alertasLer(s) {
  const admin = ehAdminAlertas(s);
  const out = { ok: true, admin: admin, matricula: s.matricula, config: alertasLerChave('config') || {}, prefs: alertasLerChave('prefs_' + s.matricula) || {}, eventos: alertasLerChave('evt_chamada') || [] };
  if (admin) {
    const r = lerUsuarios();
    out.usuarios = Object.keys(r.usuarios).filter(function (m) { return !r.usuarios[m].bloqueado; }).map(function (m) { return { matricula: m, nome: r.usuarios[m].nome || nomeDaMatricula(m) }; })
      .sort(function (a, b) { return String(a.nome).localeCompare(String(b.nome)); });
  }
  return out;
}
function alertasSalvarCfg(d, s) {
  if (!ehAdminAlertas(s)) throw new Error('Só o administrador dos alertas pode alterar esta configuração.');
  const c = d.config || {};
  alertasGravarChave('config', { tipos: c.tipos || {}, custom: Array.isArray(c.custom) ? c.custom : [], feitos: c.feitos || {}, abrirAoEntrar: c.abrirAoEntrar !== false, padroesOk: !!c.padroesOk });
  registrarLog(s, 'Alertas (configuração)', 'atualizada');
  return { ok: true };
}
function alertasSalvarPrefs(d, s) {
  const p = d.prefs || {};
  alertasGravarChave('prefs_' + s.matricula, { descartados: p.descartados || {}, vetos: Array.isArray(p.vetos) ? p.vetos : [] });
  return { ok: true };
}
/** Marca um alerta recorrente como concluído no ciclo atual (qualquer pessoa que o receba pode marcar). */
function alertasConcluir(d, s) {
  const id = String(d.id || ''), ciclo = String(d.ciclo || '');
  if (!id) throw new Error('Alerta inválido.');
  const c = alertasLerChave('config') || {};
  c.feitos = c.feitos || {};
  if (d.desfazer) delete c.feitos[id]; else c.feitos[id] = { ciclo: ciclo, quando: Utilities.formatDate(new Date(), tzPadrao(), 'dd/MM/yyyy HH:mm'), quem: s.nome || s.matricula };
  alertasGravarChave('config', c);
  return { ok: true, feitos: c.feitos };
}

/* ===================== Notificações push (celular) =====================
   O envio é feito por um pequeno servidor gratuito (Cloudflare Worker, arquivo push/worker_push.js).
   Propriedades do script (Configurações do projeto > Propriedades do script): PUSH_URL, PUSH_SEGREDO, VAPID_PUBLICA. */

function pushProps() {
  const p = PropertiesService.getScriptProperties();
  return { url: String(p.getProperty('PUSH_URL') || '').trim(), segredo: String(p.getProperty('PUSH_SEGREDO') || '').trim(), publica: String(p.getProperty('VAPID_PUBLICA') || '').trim() };
}
function pushChave(s) {
  const c = pushProps(), subs = alertasLerChave('push_' + s.matricula) || [];
  return { ok: true, ativo: !!(c.url && c.segredo && c.publica), publica: c.publica, aparelhos: subs.length };
}
function pushInscrever(d, s) {
  const sub = d.sub || {};
  if (!sub.endpoint || !sub.keys || !sub.keys.p256dh || !sub.keys.auth) throw new Error('Inscrição inválida.');
  if (String(sub.endpoint).indexOf('https://') !== 0) throw new Error('Endereço de push inválido.');
  const lista = (alertasLerChave('push_' + s.matricula) || []).filter(function (x) { return x.endpoint !== sub.endpoint; });
  lista.unshift({ endpoint: sub.endpoint, keys: { p256dh: String(sub.keys.p256dh), auth: String(sub.keys.auth) }, quando: Utilities.formatDate(new Date(), tzPadrao(), 'dd/MM/yyyy HH:mm') });
  alertasGravarChave('push_' + s.matricula, lista.slice(0, 5));
  return { ok: true, aparelhos: Math.min(lista.length, 5) };
}
function pushRemover(d, s) {
  const lista = (alertasLerChave('push_' + s.matricula) || []).filter(function (x) { return x.endpoint !== d.endpoint; });
  alertasGravarChave('push_' + s.matricula, lista);
  return { ok: true, aparelhos: lista.length };
}
function pushTeste(s) {
  const r = pushEnviar([String(s.matricula)], 'Teste de notificação', 'Se você viu esta mensagem, o celular está recebendo os alertas do Núcleo Reposição.', 'teste');
  if (!r.config) throw new Error('O envio de notificações ainda não foi configurado no servidor (PUSH_URL, PUSH_SEGREDO e VAPID_PUBLICA).');
  if (!r.aparelhos) throw new Error('Nenhum aparelho ativado para esta pessoa. Ative as notificações neste aparelho primeiro.');
  if (!r.enviados) throw new Error('O serviço de notificações recusou o envio (' + (r.motivo || 'sem detalhe') + ').');
  return { ok: true, enviados: r.enviados };
}

/** Converte o destino configurado ('*', 'admin' ou lista de matrículas) em matrículas. */
function alertasResolverDest(dest) {
  if (Array.isArray(dest)) return dest.map(String);
  const us = lerUsuarios().usuarios, mats = Object.keys(us).filter(function (m) { return !us[m].bloqueado; });
  if (dest === 'admin') return mats.filter(function (m) { return normalizar(us[m].nome || '').indexOf('FABIONYCKOLAS') === 0; });
  return mats;
}

/** Matrículas que recebem um tipo de alerta, conforme a configuração (padrão do tipo se o administrador nunca mudou). */
function alertasDestinatarios(tipo, padrao) {
  const cfg = alertasLerChave('config') || {}, t = (cfg.tipos || {})[tipo] || {};
  if (t.ativo === false) return [];
  return alertasResolverDest(t.dest !== undefined ? t.dest : padrao);
}

/** Roda a cada 5 minutos (gatilho): envia ao celular os lembretes que têm horário e estão no dia certo. */
function alertasAgendados() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return;
  try {
    const cfg = alertasLerChave('config') || {};
    const agora = new Date(), tz = tzPadrao();
    const hojeIso = Utilities.formatDate(agora, tz, 'yyyy-MM-dd');
    const minAgora = Number(Utilities.formatDate(agora, tz, 'H')) * 60 + Number(Utilities.formatDate(agora, tz, 'm'));
    const dow = Number(Utilities.formatDate(agora, tz, 'u')) % 7;      // 0 = domingo
    const dia = Number(Utilities.formatDate(agora, tz, 'd'));
    const enviados = alertasLerChave('push_enviados') || {};
    let mudou = false;
    (cfg.custom || []).forEach(function (c) {
      const r = c.regra || {};
      if (c.ativo === false || !/^\d{1,2}:\d{2}$/.test(String(r.hora || ''))) return;
      const p = r.hora.split(':'), m = Number(p[0]) * 60 + Number(p[1]);
      if (minAgora < m || minAgora > m + 90) return;                    // só dentro de 90 min após o horário
      let ciclo = null;
      if (r.tipo === 'diario') ciclo = hojeIso;
      else if (r.tipo === 'semanal' && Array.isArray(r.dias)) { if (r.dias.map(Number).indexOf(dow) >= 0) ciclo = hojeIso; }
      else if (r.tipo === 'semanal') { if (Number(r.dia) === dow) ciclo = hojeIso; }
      else if (r.tipo === 'mensal') { if (dia === (Number(r.inicio) || 1)) ciclo = hojeIso.slice(0, 7); }
      else if (r.tipo === 'unica') { if (r.data === hojeIso) ciclo = 'unica'; }
      if (!ciclo) return;
      const marca = ciclo + '|' + r.hora;
      if (enviados[c.id] === marca) return;
      const f = (cfg.feitos || {})[c.id];
      if (f && f.ciclo === ciclo) return;                              // já marcado como feito
      pushEnviar(alertasResolverDest(c.dest === undefined ? '*' : c.dest), c.nome || 'Lembrete', c.texto || 'Hora de fazer este lembrete.', 'lembrete-' + c.id);
      enviados[c.id] = marca; mudou = true;
    });
    if (mudou) alertasGravarChave('push_enviados', enviados);
  } catch (e) { /* o gatilho nunca deve quebrar */ } finally { lock.releaseLock(); }
}

/** Rode UMA vez no editor (pede autorização): liga o gatilho de 5 em 5 minutos dos lembretes com horário. */
function ativarAgendador() {
  desativarAgendador();
  ScriptApp.newTrigger('alertasAgendados').timeBased().everyMinutes(5).create();
  Logger.log('Agendador de alertas ligado (a cada 5 minutos).');
}
function desativarAgendador() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'alertasAgendados') ScriptApp.deleteTrigger(t); });
}

/** Envia a notificação aos aparelhos das matrículas. Nunca lança erro (não pode atrapalhar quem está lançando). */
function pushEnviar(mats, titulo, corpo, tag) {
  const r = { config: false, aparelhos: 0, enviados: 0, motivo: '' };
  try {
    const c = pushProps();
    if (!c.url || !c.segredo || !c.publica) return r;
    r.config = true;
    const donos = [], subs = [];
    (mats || []).forEach(function (m) { (alertasLerChave('push_' + m) || []).forEach(function (x) { subs.push(x); donos.push(String(m)); }); });
    r.aparelhos = subs.length;
    if (!subs.length) return r;
    const resp = UrlFetchApp.fetch(c.url, { method: 'post', contentType: 'application/json', headers: { 'X-Segredo': c.segredo }, muteHttpExceptions: true,
      payload: JSON.stringify({ subs: subs, titulo: titulo, corpo: corpo, tag: tag || 'nucleo', url: './' }) });
    if (resp.getResponseCode() !== 200) { r.motivo = 'servidor respondeu ' + resp.getResponseCode(); return r; }
    const res = (JSON.parse(resp.getContentText()).resultados) || [], mortos = {};
    res.forEach(function (x) {
      if (x.status >= 200 && x.status < 300) r.enviados++;
      else { if (x.status === 404 || x.status === 410) mortos[x.endpoint] = true; r.motivo = r.motivo || ('código ' + x.status + (x.erro ? ' ' + x.erro : '')); }
    });
    Object.keys(mortos).length && donos.filter(function (m, i) { return donos.indexOf(m) === i; }).forEach(function (m) {
      alertasGravarChave('push_' + m, (alertasLerChave('push_' + m) || []).filter(function (x) { return !mortos[x.endpoint]; }));
    });
  } catch (e) { r.motivo = String(e && e.message || e); }
  return r;
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
  TIPO_DESLIGAMENTO: ['DESLIGAMENTO S. JUSTA', 'PEDIU DESLIGAMENTO', 'TRANSFERENCIA', 'ENCOSTADO', 'FALTANTES'],
  TIPO_MISSAO: [],
  SETOR_COLETOR: ['Reposição', 'Picking', 'Recebimento', 'Armazenagem', 'Expedição', 'Conferência'],
  MOTIVO_FEEDBACK: ['Má Conduta', 'Insubordinação', 'Ausência Injustificada', 'Atrasos Frequentes', 'Desrespeito às Regras',
    'Violação Política Moral da Empresa', 'Baixa Produção', 'Desempenho Geral', 'Desídia']
};
const LISTAS_EDITAVEIS = ['SETOR_COLETOR', 'STATUS_CHAMADA', 'TIPO_REP_AVARIA', 'MOTIVO_DESLIGAMENTO', 'TIPO_DESLIGAMENTO', 'TIPO_MISSAO', 'MOTIVO_FEEDBACK'];
const SUB_DA_ACAO = {
  lanc_init: null, lanc_config_add: null, lanc_comissao_cfg_ler: null, lanc_comissao_cfg_salvar: null,
  lanc_feedback_salvar: 'Lançar Feedback', lanc_feedback_listar: 'Lançar Feedback', lanc_feedback_editar: 'Lançar Feedback', lanc_feedback_anexar: 'Lançar Feedback',
  lanc_advertencia_salvar: 'Lançar Advertência',
  lanc_advertencia_listar: 'Lançar Advertência', lanc_advertencia_editar: 'Lançar Advertência',
  lanc_coletor_listar: 'Controle de Coletores', lanc_coletor_salvar: 'Controle de Coletores', lanc_coletor_termo: 'Controle de Coletores',
  lanc_suspensao_salvar: 'Lançar Suspensão', lanc_suspensao_listar: 'Lançar Suspensão', lanc_suspensao_editar: 'Lançar Suspensão',
  lanc_avaria_verificar: 'Lançar Avaria 9712', lanc_avaria_salvar: 'Lançar Avaria 9712', lanc_avaria_listar: 'Lançar Avaria 9712', lanc_avaria_editar: 'Lançar Avaria 9712', lanc_avaria_corrigir: 'Lançar Avaria 9712', lanc_avaria_excluir: 'Lançar Avaria 9712', lanc_base_atualizada: 'Devolução de Mercadorias',
  lanc_ferias_listar: 'Lançar Férias', lanc_ferias_salvar: 'Lançar Férias', lanc_ferias_cancelar: 'Lançar Férias',
  lanc_anexo_ler: null,
  lanc_chamada_dia: 'Lançar Chamada', lanc_chamada_salvar: 'Lançar Chamada', lanc_chamada_lote: 'Lançar Chamada',
  lanc_quadro_listar: 'Lançar Quadro', lanc_quadro_salvar: 'Lançar Quadro', lanc_quadro_foto: 'Lançar Quadro', lanc_cargo_add: 'Lançar Quadro', lanc_cert_lancar: 'Certificados', lanc_cert_listar: 'Certificados',
  lanc_missao_salvar: 'Lançar Missões', lanc_capacidade_salvar: 'Lançar Capacidade'
};
const LISTA_DA_SUB = { SETOR_COLETOR: 'Controle de Coletores', STATUS_CHAMADA: 'Lançar Chamada', TIPO_REP_AVARIA: 'Lançar Avaria 9712', MOTIVO_FEEDBACK: 'Lançar Feedback', MOTIVO_DESLIGAMENTO: 'Lançar Quadro', TIPO_DESLIGAMENTO: 'Lançar Quadro', TIPO_MISSAO: 'Lançar Missões' };

function lancamento(d, s) {
  if (!(d.acao in SUB_DA_ACAO)) throw new Error('Ação desconhecida.');
  const sub = SUB_DA_ACAO[d.acao];
  if (sub) exigir(s, [ABA_LANC, sub]);
  switch (d.acao) {
    case 'lanc_init': return lancInit(s);
    case 'lanc_config_add': return lancConfigAdd(d, s);
    case 'lanc_comissao_cfg_ler': return comissaoCfgLer();
    case 'lanc_comissao_cfg_salvar': return comissaoCfgSalvar(d, s);
    case 'lanc_feedback_salvar': return feedbackSalvar(d, s);
    case 'lanc_feedback_listar': return feedbackListar(d);
    case 'lanc_feedback_editar': return feedbackEditar(d, s);
    case 'lanc_feedback_anexar': return feedbackAnexar(d, s);
    case 'lanc_advertencia_salvar': return advertenciaSalvar(d, s);
    case 'lanc_advertencia_listar': return advertenciaListar(d);
    case 'lanc_advertencia_editar': return advertenciaEditar(d, s);
    case 'lanc_coletor_listar': return coletorListar();
    case 'lanc_coletor_salvar': return coletorSalvar(d, s);
    case 'lanc_coletor_termo': return coletorTermo(d, s);
    case 'lanc_suspensao_salvar': return suspensaoSalvar(d, s);
    case 'lanc_suspensao_listar': return suspensaoListar(d);
    case 'lanc_suspensao_editar': return suspensaoEditar(d, s);
    case 'lanc_ferias_listar': return feriasListar();
    case 'lanc_ferias_salvar': return feriasSalvar(d, s);
    case 'lanc_ferias_cancelar': return feriasCancelar(d, s);
    case 'lanc_anexo_ler': return anexoLer(d, s);
    case 'lanc_avaria_verificar': return avariaVerificar(d);
    case 'lanc_avaria_salvar': return avariaSalvar(d, s);
    case 'lanc_avaria_listar': return avariaListar(d);
    case 'lanc_avaria_editar': return avariaEditar(d, s);
    case 'lanc_avaria_corrigir': return avariaCorrigir(d, s);
    case 'lanc_avaria_excluir': return avariaExcluir(d, s);
    case 'lanc_base_atualizada': return baseAtualizada(d);
    case 'lanc_chamada_dia': return chamadaDia(d);
    case 'lanc_chamada_salvar': return chamadaSalvar(d, s);
    case 'lanc_chamada_lote': return chamadaLote(d, s);
    case 'lanc_quadro_listar': return quadroListar();
    case 'lanc_quadro_salvar': return quadroSalvar(d, s);
    case 'lanc_quadro_foto': return quadroFoto(d, s);
    case 'lanc_cargo_add': return quadroCargoAdd(d, s);
    case 'lanc_cert_lancar': return certLancar(d, s);
    case 'lanc_cert_listar': return certListar();
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
  // lista criada depois da planilha de configuração: grava os valores padrão uma única vez
  if (!cfg.SETOR_COLETOR.length) {
    CONFIG_PADRAO.SETOR_COLETOR.forEach(function (v) { sh.getRange(sh.getLastRow() + 1, 1, 1, 2).setNumberFormat('@').setValues([['SETOR_COLETOR', v]]); cfg.SETOR_COLETOR.push(v); });
  }
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

/* ---------- parâmetros da comissão da equipe de apoio (aba Config_Comissao) ---------- */

const ABA_CFG_COMISSAO = 'Config_Comissao';
function comissaoCfgLer() {
  const sh = dadosSS().getSheetByName(ABA_CFG_COMISSAO);
  if (!sh || sh.getLastRow() < 2) return { ok: true, cfg: null };
  const l = sh.getRange(2, 1, sh.getLastRow() - 1, 3).getDisplayValues();
  for (let i = 0; i < l.length; i++) if (texto(l[i][0]) === 'apoio') {
    try { return { ok: true, cfg: JSON.parse(l[i][1]), atualizado: l[i][2] }; } catch (e) { return { ok: true, cfg: null }; }
  }
  return { ok: true, cfg: null };
}
function comissaoCfgSalvar(d, s) {
  exigir(s, ['Gestão', 'Comissão']);
  if (!d.cfg || typeof d.cfg !== 'object') throw new Error('Configuração inválida.');
  const json = JSON.stringify(d.cfg);
  if (json.length > 40000) throw new Error('Configuração grande demais.');
  const ss = dadosSS();
  let sh = ss.getSheetByName(ABA_CFG_COMISSAO);
  if (!sh) { sh = ss.insertSheet(ABA_CFG_COMISSAO); sh.getRange(1, 1, 1, 3).setValues([['Chave', 'Valor (JSON)', 'Atualizado em / por']]).setFontWeight('bold'); sh.setFrozenRows(1); }
  const quando = Utilities.formatDate(new Date(), tzDados(), 'dd/MM/yyyy HH:mm') + ' · ' + (s.nome || s.matricula || '');
  let linha = 0;
  if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues().forEach(function (r, i) { if (!linha && texto(r[0]) === 'apoio') linha = i + 2; });
  if (!linha) linha = Math.max(sh.getLastRow(), 1) + 1;
  sh.getRange(linha, 1, 1, 3).setNumberFormat('@').setValues([['apoio', json, quando]]);
  registrarLog(s, 'Comissão (parâmetros)', 'Parâmetros da equipe de apoio atualizados');
  return { ok: true, atualizado: quando };
}

/* ---------- funcionários (quadro = aba TURNOVER) ---------- */

const ALIAS_TURN = {
  mat: ['MATRIC', 'MATRICULA', 'CODIGO', 'COD'], nome: ['NOME'], ativo: ['ATIVO'], tipo: ['TIPO'], motivo: ['MOTIVO'],
  obs: ['OBS', 'OUTRAS OBS', 'OBSERVACAO'], adm: ['DATA CONTRATACAO', 'DATA CONTRATA', 'DATA ADMISSAO', 'DT ADMISSAO', 'ADMISSAO'],
  desl: ['DATA DESLIGAMENTO', 'DT DESLIGAMENTO', 'DESLIGAMENTO', 'DEMISSAO'],
  transf: ['DATA TRANSFERENCIA', 'DT TRANSFERENCIA'],
  enc: ['DATA ENCOSTAMENTO', 'ENCOSTAMENTO', 'DATA ENCOSTAMENTO INSS'], setor: ['SETOR DESTINO', 'SETOR'], cargo: ['CARGO']
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
      adm: idx.adm >= 0 ? chaveData(l[idx.adm]) : '', desl: idx.desl >= 0 ? chaveData(l[idx.desl]) : '', transf: idx.transf >= 0 ? chaveData(l[idx.transf]) : '',
      enc: idx.enc >= 0 ? chaveData(l[idx.enc]) : '', setor: idx.setor >= 0 ? texto(l[idx.setor]) : '',
      cargo: idx.cargo >= 0 ? texto(l[idx.cargo]) : ''
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
  const ok = [['Gestão', 'Feedbacks e Advertências'], ['Lançamentos', 'Lançar Feedback'], ['Lançamentos', 'Lançar Advertência'], ['Lançamentos', 'Lançar Suspensão'], ['Lançamentos', 'Controle de Coletores']].some(function (par) {
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

/** Matrículas fora das cobranças de feedback: TIPO ENCOSTADO/FALTANTES no quadro, ou DESISTENTE (falta na chamada por 7+ dias seguidos, sem voltar). */
function dispensadosFeedback() {
  const out = {};
  lerTurnover().pessoas.forEach(function (p) {
    const t = normalizar(p.tipo);
    if (p.ativo && p.mat && (t.indexOf('ENCOST') >= 0 || t.indexOf('FALTANTE') >= 0)) out[p.mat] = 'ESPECIAL';
  });
  try {
    const q = infoQuadro(), por = {};
    lerLinhas(q.info).forEach(function (l) {
      const m = soDigitos(l[q.c.cod]), dt = chaveData(l[q.c.data]);
      if (m && dt) (por[m] = por[m] || []).push({ dt: dt, falta: normalizar(l[q.c.status]) === 'FALTA' });
    });
    Object.keys(por).forEach(function (m) {
      const r = por[m].sort(function (a, b) { return a.dt < b.dt ? 1 : a.dt > b.dt ? -1 : 0; });
      if (!r[0].falta || out[m]) return;
      let i = 0; while (i + 1 < r.length && r[i + 1].falta) i++;
      if (Math.round((isoParaData(r[0].dt).getTime() - isoParaData(r[i].dt).getTime()) / 864e5) >= 7) out[m] = 'DESISTENTE';
    });
  } catch (e) {}
  return out;
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
    const out = [], fora = dispensadosFeedback();
    funcionariosAtivos().forEach(function (p) {
      if (lideres[p.mat] || p.mat === ignorarMat || fora[p.mat]) return;
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
  return { ok: true, nome: nome, desempenho: linha[c.desemp], classificacao: linha[c.classif], anexo: link, linha: n, data: d.data, semFeedback: semFeedbackLista(mat) };
}

/* ---------- Feedbacks já lançados: listar, editar e anexar documento depois ---------- */

function colunasFeedback() {
  const info = infoAba('FEEDBACK REP');
  return { info: info, c: {
    data: garantirCol(info, ['DATA'], 'Data'), mat: garantirCol(info, ['COD', 'MATRICULA', 'CODIGO'], 'Cod'), nome: garantirCol(info, ['NOME'], 'Nome'),
    matApl: garantirCol(info, ['COD APLICADOR', 'MATRICULA APLICADOR'], 'Cod Aplicador'), nomeApl: garantirCol(info, ['NOME APLICADOR'], 'Nome Aplicador'),
    motivo: garantirCol(info, ['MOTIVO'], 'Motivo'),
    resumo: garantirCol(info, ['RESUMO ASSUNTO'], 'Resumo Assunto'), avP: garantirCol(info, ['AVALIACAO PESSOAL'], 'Avaliação Pessoal'),
    avG: garantirCol(info, ['AVALIACAO GESTOR'], 'Avaliação Gestor'), desemp: garantirCol(info, ['DESEMPENHO'], 'Desempenho'),
    classif: garantirCol(info, ['CLASSIFICACAO'], 'Classificação'), anexo: garantirCol(info, ['ANEXO', 'LINK ANEXO'], 'Anexo') } };
}

/** Feedbacks lançados, na ordem da planilha (linha crescente). Filtra por matrícula se informada. */
function feedbackListar(d) {
  const X = colunasFeedback(), info = X.info, c = X.c, filtro = soDigitos(d.mat), nomeF = normalizar(d.nome || '');
  const ult = info.sh.getLastRow();
  if (ult < 2) return { ok: true, itens: [] };
  const v = info.sh.getRange(2, 1, ult - 1, info.ult).getValues(), itens = [];
  for (let i = 0; i < v.length; i++) {
    const l = v[i], mat = soDigitos(l[c.mat]);
    // feedbacks antigos podem estar sem matrícula: nesse caso acha pelo nome
    if (!mat) { if (!(nomeF && normalizar(l[c.nome]) === nomeF)) continue; }
    else if (filtro && mat !== filtro) continue;
    itens.push({ linha: i + 2, data: chaveData(l[c.data]), mat: mat, nome: texto(l[c.nome]), motivo: texto(l[c.motivo]), resumo: texto(l[c.resumo]),
      avPessoal: l[c.avP] === '' ? null : Number(l[c.avP]), avGestor: l[c.avG] === '' ? null : Number(l[c.avG]),
      matApl: soDigitos(l[c.matApl]), nomeApl: texto(l[c.nomeApl]), anexo: texto(l[c.anexo]) });
  }
  return { ok: true, itens: filtro ? itens : itens.slice(-400) };
}

/** Confere que a linha ainda é o registro que o site mostrou (a planilha pode ter mudado). */
function feedbackLinhaConfere(X, d) {
  const info = X.info, c = X.c, linha = Number(d.linha) || 0;
  if (linha < 2 || linha > info.sh.getLastRow()) throw new Error('Registro não encontrado. Recarregue os dados e tente de novo.');
  const atual = info.sh.getRange(linha, 1, 1, info.ult).getValues()[0];
  if (soDigitos(atual[c.mat]) !== soDigitos(d.matOriginal)) throw new Error('A planilha mudou desde que a lista foi carregada. Atualize os dados e tente de novo.');
  if (d.dataOriginal && chaveData(atual[c.data]) !== String(d.dataOriginal)) throw new Error('A planilha mudou desde que a lista foi carregada. Atualize os dados e tente de novo.');
  return { linha: linha, atual: atual };
}

/** Corrige um feedback já lançado (data, colaborador, motivo, resumo, notas, aplicador e documento). */
function feedbackEditar(d, s) {
  const X = colunasFeedback(), info = X.info, c = X.c, ch = feedbackLinhaConfere(X, d), linha = ch.linha, atual = ch.atual;
  const mat = soDigitos(d.mat);
  if (!mat) throw new Error('Informe a matrícula do colaborador.');
  const nome = nomePorMatricula(mat) || (mat === soDigitos(atual[c.mat]) ? texto(atual[c.nome]) : '');
  if (!nome) throw new Error('Matrícula não encontrada. Confira o número.');
  const motivo = texto(d.motivo);
  if (!motivo) throw new Error('Escolha o motivo do feedback.');
  const resumo = texto(d.resumo);
  if (!resumo) throw new Error('Escreva o resumo do assunto.');
  const nP = Number(d.avPessoal), nG = Number(d.avGestor);
  if (isNaN(nP) || nP < 0 || nP > 10) throw new Error('Avaliação pessoal deve ser de 0 a 10.');
  if (isNaN(nG) || nG < 0 || nG > 10) throw new Error('Avaliação do gestor deve ser de 0 a 10.');
  const data = isoParaData(d.data);
  const matApl = soDigitos(d.matAplicador) || soDigitos(atual[c.matApl]);
  let anexo = texto(atual[c.anexo]);
  if (d.anexo && d.anexo.base64) anexo = salvarAnexo(d.anexo, 'Feedback', mat, d.data);
  else if (d.removerAnexo) anexo = '';
  const l = atual.slice();
  l[c.data] = data; l[c.mat] = mat; l[c.nome] = nome; l[c.motivo] = motivo; l[c.resumo] = resumo; l[c.avP] = nP; l[c.avG] = nG;
  l[c.matApl] = matApl; l[c.nomeApl] = texto(d.nomeAplicador) || nomePorMatricula(matApl) || texto(atual[c.nomeApl]); l[c.anexo] = anexo;
  // Desempenho/Classificação acompanham a nota do gestor (só recalcula se a nota mudou ou se estavam vazios)
  if (String(atual[c.avG]) !== String(nG) || !texto(atual[c.desemp]) || !texto(atual[c.classif])) {
    l[c.desemp] = desempenhoDaNota(nG); l[c.classif] = mapaClassificacao()[faixaNota(nG)];
  }
  info.sh.getRange(linha, 1, 1, info.ult).setValues([l]);
  formatarDatas(info.sh, c.data, linha, 1);
  registrarLog(s, 'Feedback (edição)', mat + ' ' + nome + ' · ' + motivo + ' · nota ' + nG + ' · ' + d.data);
  return { ok: true, nome: nome, desempenho: l[c.desemp], classificacao: l[c.classif], anexo: anexo, aplicador: l[c.nomeApl] };
}

/** Anexa (ou troca) só o documento de um feedback já lançado — usado para escanear a foto depois. */
function feedbackAnexar(d, s) {
  if (!d.anexo || !d.anexo.base64) throw new Error('Nenhum documento recebido.');
  const X = colunasFeedback(), info = X.info, c = X.c, ch = feedbackLinhaConfere(X, d), linha = ch.linha, atual = ch.atual;
  const mat = soDigitos(atual[c.mat]), iso = chaveData(atual[c.data]) || hoje();
  const link = salvarAnexo(d.anexo, 'Feedback', mat, iso);
  info.sh.getRange(linha, c.anexo + 1).setValue(link);
  registrarLog(s, 'Feedback (documento)', mat + ' ' + texto(atual[c.nome]) + ' · ' + iso);
  return { ok: true, anexo: link };
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

/** Colunas da aba ADVERTÊNCIAS (cria as que faltarem). */
function colunasAdvertencia() {
  abaComCabecalho(ABA_ADVERTENCIAS, ['Data', 'Cod', 'Nome', 'Motivo', 'Resumo Assunto', 'Cod Aplicador', 'Nome Aplicador', 'Anexo']);
  const info = infoAba(ABA_ADVERTENCIAS);
  return { info: info, c: {
    data: garantirCol(info, ['DATA'], 'Data'), mat: garantirCol(info, ['COD', 'MATRICULA'], 'Cod'), nome: garantirCol(info, ['NOME'], 'Nome'),
    motivo: garantirCol(info, ['MOTIVO'], 'Motivo'), resumo: garantirCol(info, ['RESUMO ASSUNTO', 'RESUMO'], 'Resumo Assunto'),
    matApl: garantirCol(info, ['COD APLICADOR'], 'Cod Aplicador'), nomeApl: garantirCol(info, ['NOME APLICADOR'], 'Nome Aplicador'), anexo: garantirCol(info, ['ANEXO'], 'Anexo') } };
}

/** Advertências já lançadas (mais recentes primeiro). Filtra por matrícula se informada. */
function advertenciaListar(d) {
  const X = colunasAdvertencia(), info = X.info, c = X.c, filtro = soDigitos(d.mat);
  const ult = info.sh.getLastRow();
  if (ult < 2) return { ok: true, itens: [] };
  const v = info.sh.getRange(2, 1, ult - 1, info.ult).getValues(), itens = [];
  for (let i = v.length - 1; i >= 0 && itens.length < 300; i--) {
    const l = v[i], mat = soDigitos(l[c.mat]);
    if (!mat || (filtro && mat !== filtro)) continue;
    itens.push({ linha: i + 2, data: chaveData(l[c.data]), mat: mat, nome: texto(l[c.nome]), motivo: texto(l[c.motivo]), resumo: texto(l[c.resumo]),
      matApl: soDigitos(l[c.matApl]), nomeApl: texto(l[c.nomeApl]), anexo: texto(l[c.anexo]) });
  }
  return { ok: true, itens: itens };
}

/** Corrige uma advertência já lançada (data, colaborador, motivo, resumo, aplicador e documento). */
function advertenciaEditar(d, s) {
  const X = colunasAdvertencia(), info = X.info, c = X.c, linha = Number(d.linha) || 0;
  if (linha < 2 || linha > info.sh.getLastRow()) throw new Error('Registro não encontrado. Recarregue a lista.');
  const atual = info.sh.getRange(linha, 1, 1, info.ult).getValues()[0];
  if (soDigitos(atual[c.mat]) !== soDigitos(d.matOriginal)) throw new Error('A planilha mudou desde que a lista foi carregada. Recarregue a lista e tente de novo.');
  const mat = soDigitos(d.mat);
  if (!mat) throw new Error('Informe a matrícula do colaborador.');
  const nome = nomePorMatricula(mat) || (mat === soDigitos(atual[c.mat]) ? texto(atual[c.nome]) : '');
  if (!nome) throw new Error('Matrícula não encontrada. Confira o número.');
  const motivo = texto(d.motivo), resumo = texto(d.resumo);
  if (!motivo) throw new Error('Escolha o motivo da advertência.');
  if (!resumo) throw new Error('Escreva o resumo da advertência.');
  const data = isoParaData(d.data);
  const matApl = soDigitos(d.matAplicador) || soDigitos(atual[c.matApl]);
  let anexo = texto(atual[c.anexo]);
  if (d.anexo && d.anexo.base64) anexo = salvarAnexo(d.anexo, 'Advertencia', mat, d.data);
  else if (d.removerAnexo) anexo = '';
  const l = atual.slice();
  l[c.data] = data; l[c.mat] = mat; l[c.nome] = nome; l[c.motivo] = motivo; l[c.resumo] = resumo;
  l[c.matApl] = matApl; l[c.nomeApl] = texto(d.nomeAplicador) || nomePorMatricula(matApl) || texto(atual[c.nomeApl]); l[c.anexo] = anexo;
  info.sh.getRange(linha, 1, 1, info.ult).setValues([l]);
  formatarDatas(info.sh, c.data, linha, 1);
  registrarLog(s, 'Advertência (edição)', mat + ' ' + nome + ' · ' + motivo + ' · ' + d.data);
  return { ok: true, nome: nome, anexo: anexo };
}

/* ---------- Suspensões disciplinares (aba SUSPENSÕES) ---------- */

const CAB_SUSP = ['Data', 'Cod', 'Nome', 'Motivo', 'Dias', 'Data Fim', 'Resumo Assunto', 'Cod Aplicador', 'Nome Aplicador', 'Anexo'];
function colunasSuspensao() {
  abaComCabecalho(ABA_SUSPENSOES, CAB_SUSP);
  const info = infoAba(ABA_SUSPENSOES);
  return { info: info, c: {
    data: garantirCol(info, ['DATA'], 'Data'), mat: garantirCol(info, ['COD', 'MATRICULA'], 'Cod'), nome: garantirCol(info, ['NOME'], 'Nome'),
    motivo: garantirCol(info, ['MOTIVO'], 'Motivo'), dias: garantirCol(info, ['DIAS'], 'Dias'), fim: garantirCol(info, ['DATA FIM'], 'Data Fim'),
    resumo: garantirCol(info, ['RESUMO ASSUNTO', 'RESUMO'], 'Resumo Assunto'),
    matApl: garantirCol(info, ['COD APLICADOR'], 'Cod Aplicador'), nomeApl: garantirCol(info, ['NOME APLICADOR'], 'Nome Aplicador'), anexo: garantirCol(info, ['ANEXO'], 'Anexo') } };
}
function suspensaoLinha(d, s, info, c, atual) {
  const mat = soDigitos(d.mat), matApl = soDigitos(d.matAplicador) || (atual ? soDigitos(atual[c.matApl]) : s.matricula);
  if (!mat) throw new Error('Informe a matrícula do colaborador.');
  const nome = nomePorMatricula(mat) || (atual && mat === soDigitos(atual[c.mat]) ? texto(atual[c.nome]) : texto(d.nome));
  if (!nome) throw new Error('Matrícula não encontrada. Confira o número.');
  const motivo = texto(d.motivo), resumo = texto(d.resumo), dias = Math.round(Number(d.dias) || 0);
  if (!motivo) throw new Error('Escolha o motivo da suspensão.');
  if (!resumo) throw new Error('Escreva o resumo da suspensão.');
  if (dias < 1 || dias > 30) throw new Error('Informe os dias de suspensão (1 a 30).');
  const data = isoParaData(d.data), fim = new Date(data.getTime() + (dias - 1) * 864e5);
  const l = atual ? atual.slice() : new Array(info.ult).fill('');
  l[c.data] = data; l[c.mat] = mat; l[c.nome] = nome; l[c.motivo] = motivo; l[c.dias] = dias; l[c.fim] = fim; l[c.resumo] = resumo;
  l[c.matApl] = matApl; l[c.nomeApl] = texto(d.nomeAplicador) || nomePorMatricula(matApl) || (atual ? texto(atual[c.nomeApl]) : s.nome || '');
  return { l: l, mat: mat, nome: nome, motivo: motivo };
}
function suspensaoSalvar(d, s) {
  const X = colunasSuspensao(), info = X.info, c = X.c;
  const r = suspensaoLinha(d, s, info, c, null);
  r.l[c.anexo] = salvarAnexo(d.anexo, 'Suspensao', r.mat, d.data);
  const n = Math.max(info.sh.getLastRow(), 1) + 1;
  garantirTamanho(info.sh, n, info.ult);
  info.sh.getRange(n, 1, 1, info.ult).setValues([r.l]);
  formatarDatas(info.sh, c.data, n, 1); formatarDatas(info.sh, c.fim, n, 1);
  registrarLog(s, 'Suspensão', r.mat + ' ' + r.nome + ' · ' + r.motivo + ' · ' + d.dias + ' dia(s)' + (r.l[c.anexo] ? ' · com anexo' : ''));
  return { ok: true, nome: r.nome, anexo: r.l[c.anexo] };
}
function suspensaoListar(d) {
  const X = colunasSuspensao(), info = X.info, c = X.c, filtro = soDigitos(d.mat), ult = info.sh.getLastRow();
  if (ult < 2) return { ok: true, itens: [] };
  const v = info.sh.getRange(2, 1, ult - 1, info.ult).getValues(), itens = [];
  for (let i = v.length - 1; i >= 0 && itens.length < 300; i--) {
    const l = v[i], mat = soDigitos(l[c.mat]);
    if (!mat || (filtro && mat !== filtro)) continue;
    itens.push({ linha: i + 2, data: chaveData(l[c.data]), fim: chaveData(l[c.fim]), dias: Number(l[c.dias]) || 0, mat: mat, nome: texto(l[c.nome]), motivo: texto(l[c.motivo]), resumo: texto(l[c.resumo]),
      matApl: soDigitos(l[c.matApl]), nomeApl: texto(l[c.nomeApl]), anexo: texto(l[c.anexo]) });
  }
  return { ok: true, itens: itens };
}
function suspensaoEditar(d, s) {
  const X = colunasSuspensao(), info = X.info, c = X.c, linha = Number(d.linha) || 0;
  if (linha < 2 || linha > info.sh.getLastRow()) throw new Error('Registro não encontrado. Recarregue a lista.');
  const atual = info.sh.getRange(linha, 1, 1, info.ult).getValues()[0];
  if (soDigitos(atual[c.mat]) !== soDigitos(d.matOriginal)) throw new Error('A planilha mudou desde que a lista foi carregada. Recarregue a lista e tente de novo.');
  const r = suspensaoLinha(d, s, info, c, atual);
  let anexo = texto(atual[c.anexo]);
  if (d.anexo && d.anexo.base64) anexo = salvarAnexo(d.anexo, 'Suspensao', r.mat, d.data); else if (d.removerAnexo) anexo = '';
  r.l[c.anexo] = anexo;
  info.sh.getRange(linha, 1, 1, info.ult).setValues([r.l]);
  formatarDatas(info.sh, c.data, linha, 1); formatarDatas(info.sh, c.fim, linha, 1);
  registrarLog(s, 'Suspensão (edição)', r.mat + ' ' + r.nome + ' · ' + r.motivo + ' · ' + d.data);
  return { ok: true, nome: r.nome, anexo: anexo };
}

/* ---------- Controle de coletores (abas COLETORES e COLETORES_HIST) ---------- */

const ABA_COLETORES = 'COLETORES', ABA_COLETORES_HIST = 'COLETORES_HIST';
const CAB_COLETOR = ['ID Coletor', 'Nome Coletor', 'Login Coletor', 'Winthor Usuario', 'Matricula', 'Colaborador', 'Setor', 'Ultimo Inventario', 'Observacoes', 'Termo', 'Data Termo', 'Status', 'Data Atribuicao', 'Senha Coletor', 'Senha Winthor'];
function colunasColetor() {
  abaComCabecalho(ABA_COLETORES, CAB_COLETOR);
  const info = infoAba(ABA_COLETORES);
  return { info: info, c: {
    id: garantirCol(info, ['ID COLETOR', 'ID'], 'ID Coletor'), nome: garantirCol(info, ['NOME COLETOR'], 'Nome Coletor'), login: garantirCol(info, ['LOGIN COLETOR'], 'Login Coletor'),
    winthor: garantirCol(info, ['WINTHOR USUARIO', 'WINTHOR'], 'Winthor Usuario'), mat: garantirCol(info, ['MATRICULA'], 'Matricula'), colab: garantirCol(info, ['COLABORADOR'], 'Colaborador'),
    setor: garantirCol(info, ['SETOR'], 'Setor'), inv: garantirCol(info, ['ULTIMO INVENTARIO'], 'Ultimo Inventario'), obs: garantirCol(info, ['OBSERVACOES'], 'Observacoes'),
    termo: garantirCol(info, ['TERMO'], 'Termo'), dtTermo: garantirCol(info, ['DATA TERMO'], 'Data Termo'), status: garantirCol(info, ['STATUS'], 'Status'), dtAtrib: garantirCol(info, ['DATA ATRIBUICAO'], 'Data Atribuicao'),
    senhaCol: garantirCol(info, ['SENHA COLETOR'], 'Senha Coletor'), senhaWin: garantirCol(info, ['SENHA WINTHOR'], 'Senha Winthor') } };
}
function coletorListar() {
  const X = colunasColetor(), info = X.info, c = X.c, ult = info.sh.getLastRow(), itens = [];
  if (ult >= 2) {
    const vals = info.sh.getRange(2, 1, ult - 1, info.ult).getValues();
    // migração única: "login | senha" na mesma célula passa para duas colunas
    const parte = function (v) { const t = texto(v), k = t.indexOf('|'); return k < 0 ? null : [t.slice(0, k).trim(), t.slice(k + 1).trim()]; };
    let mudou = false;
    vals.forEach(function (l) {
      const a = parte(l[c.login]); if (a && !texto(l[c.senhaCol])) { l[c.login] = a[0]; l[c.senhaCol] = a[1]; mudou = true; }
      const b = parte(l[c.winthor]); if (b && !texto(l[c.senhaWin])) { l[c.winthor] = b[0]; l[c.senhaWin] = b[1]; mudou = true; }
    });
    if (mudou) [c.login, c.winthor, c.senhaCol, c.senhaWin].forEach(function (col) {
      info.sh.getRange(2, col + 1, vals.length, 1).setNumberFormat('@').setValues(vals.map(function (l) { return [l[col]]; }));
    });
    vals.forEach(function (l, i) {
    const id = texto(l[c.id]); if (!id) return;
    itens.push({ linha: i + 2, id: id, nome: texto(l[c.nome]), login: texto(l[c.login]), senhaCol: texto(l[c.senhaCol]), winthor: texto(l[c.winthor]), senhaWin: texto(l[c.senhaWin]), mat: soDigitos(l[c.mat]), colab: texto(l[c.colab]),
      setor: texto(l[c.setor]), inv: chaveData(l[c.inv]), obs: texto(l[c.obs]), termo: texto(l[c.termo]), dtTermo: chaveData(l[c.dtTermo]), status: texto(l[c.status]) || 'Ativo', dtAtrib: chaveData(l[c.dtAtrib]) });
    });
  }
  abaComCabecalho(ABA_COLETORES_HIST, ['Data', 'ID Coletor', 'Setor', 'Matricula', 'Status', 'Usuario']);
  const hs = dadosSS().getSheetByName(ABA_COLETORES_HIST), hist = [];
  if (hs.getLastRow() >= 2) hs.getRange(2, 1, hs.getLastRow() - 1, 6).getValues().forEach(function (l) {
    const d = chaveData(l[0]), id = texto(l[1]); if (d && id) hist.push({ d: d, id: id, setor: texto(l[2]), mat: soDigitos(l[3]), status: texto(l[4]) || 'Ativo' });
  });
  return { ok: true, itens: itens, hist: hist, hoje: hoje() };
}
function coletorHist(s, id, setor, mat, status) {
  abaComCabecalho(ABA_COLETORES_HIST, ['Data', 'ID Coletor', 'Setor', 'Matricula', 'Status', 'Usuario']);
  const sh = dadosSS().getSheetByName(ABA_COLETORES_HIST), n = Math.max(sh.getLastRow(), 1) + 1;
  garantirTamanho(sh, n, 6);
  sh.getRange(n, 1, 1, 6).setValues([[isoParaData(hoje()), id, setor, mat, status, s.nome || s.matricula]]);
  formatarDatas(sh, 0, n, 1);
}
/** Cria (sem linha) ou atualiza (com linha) um coletor. O ID não pode repetir. */
function coletorSalvar(d, s) {
  const X = colunasColetor(), info = X.info, c = X.c, id = texto(d.id), linha = Number(d.linha) || 0;
  if (!id) throw new Error('Informe o ID do coletor.');
  const mat = soDigitos(d.mat), status = texto(d.status) || 'Ativo', setor = texto(d.setor);
  if (!setor) throw new Error('Escolha o setor.');
  const ult = info.sh.getLastRow(), ids = ult >= 2 ? info.sh.getRange(2, c.id + 1, ult - 1, 1).getValues() : [];
  for (let i = 0; i < ids.length; i++) if (normalizar(texto(ids[i][0])) === normalizar(id) && i + 2 !== linha) throw new Error('Já existe um coletor com o ID ' + id + '.');
  const colab = mat ? (nomePorMatricula(mat) || texto(d.colab)) : '';
  if (mat && !colab) throw new Error('Matrícula não encontrada. Confira o número.');
  let l, antes = null;
  if (linha) {
    if (linha < 2 || linha > ult) throw new Error('Registro não encontrado. Recarregue a lista.');
    l = info.sh.getRange(linha, 1, 1, info.ult).getValues()[0];
    if (normalizar(texto(l[c.id])) !== normalizar(texto(d.idOriginal))) throw new Error('A planilha mudou desde que a lista foi carregada. Recarregue e tente de novo.');
    antes = { setor: texto(l[c.setor]), mat: soDigitos(l[c.mat]), status: texto(l[c.status]) || 'Ativo' };
  } else l = new Array(info.ult).fill('');
  l[c.id] = id; l[c.nome] = texto(d.nome); l[c.login] = texto(d.login); l[c.senhaCol] = texto(d.senhaCol); l[c.winthor] = texto(d.winthor); l[c.senhaWin] = texto(d.senhaWin); l[c.mat] = mat; l[c.colab] = colab;
  l[c.setor] = setor; l[c.inv] = d.inv ? isoParaData(d.inv) : ''; l[c.obs] = texto(d.obs); l[c.status] = status;
  if (!antes || antes.mat !== mat) l[c.dtAtrib] = mat ? isoParaData(d.dtAtrib || hoje()) : '';
  let n = linha;
  if (!linha) { n = Math.max(ult, 1) + 1; garantirTamanho(info.sh, n, info.ult); }
  info.sh.getRange(n, 1, 1, info.ult).setValues([l]);
  formatarDatas(info.sh, c.inv, n, 1); formatarDatas(info.sh, c.dtTermo, n, 1); formatarDatas(info.sh, c.dtAtrib, n, 1);
  // histórico (alimenta o gráfico mês a mês): só quando setor, atribuição ou status mudam
  if (!antes || antes.setor !== setor || antes.mat !== mat || antes.status !== status) coletorHist(s, id, setor, mat, status);
  registrarLog(s, linha ? 'Coletor (edição)' : 'Coletor', id + ' · ' + setor + (mat ? ' · ' + mat + ' ' + colab : ''));
  return { ok: true, linha: n, colab: colab };
}
/** Anexa o termo de compromisso assinado (foto/PDF) a um coletor. */
function coletorTermo(d, s) {
  const X = colunasColetor(), info = X.info, c = X.c, linha = Number(d.linha) || 0;
  if (linha < 2 || linha > info.sh.getLastRow()) throw new Error('Registro não encontrado. Recarregue a lista.');
  const l = info.sh.getRange(linha, 1, 1, info.ult).getValues()[0], id = texto(l[c.id]);
  if (normalizar(id) !== normalizar(texto(d.idOriginal))) throw new Error('A planilha mudou desde que a lista foi carregada. Recarregue e tente de novo.');
  if (d.remover) { info.sh.getRange(linha, c.termo + 1, 1, 1).setValue(''); info.sh.getRange(linha, c.dtTermo + 1, 1, 1).setValue(''); registrarLog(s, 'Coletor (termo removido)', id); return { ok: true, termo: '' }; }
  if (!d.anexo || !d.anexo.base64) throw new Error('Anexe o termo assinado.');
  const link = salvarAnexo(d.anexo, 'TermoColetor', soDigitos(l[c.mat]) || id.replace(/\W/g, ''), hoje());
  info.sh.getRange(linha, c.termo + 1, 1, 1).setValue(link);
  info.sh.getRange(linha, c.dtTermo + 1, 1, 1).setValue(isoParaData(d.dataTermo || hoje()));
  formatarDatas(info.sh, c.dtTermo, linha, 1);
  registrarLog(s, 'Coletor (termo assinado)', id + ' · ' + texto(l[c.colab]));
  return { ok: true, termo: link };
}

/* ---------- REP.AVARIA ---------- */

/** Colunas da REP.AVARIA: { iN, iT, ini, cols } — a aba pode não ter título (1ª linha já é dado): então A = número e B = tipo. */
function avariaCols(info) {
  const iN = acharCol(info, ['NUM LANCAMENTO', 'NUMLANCAMENTO', 'LANCAMENTO']), iT = acharCol(info, ['TIPO', 'TIPO LANCAMENTO', 'TIPO DE LANCAMENTO', 'RELACAO']);
  if (iN >= 0 && iT >= 0) return { iN: iN, iT: iT, ini: 2, titulos: true };
  return { iN: 0, iT: 1, ini: 1, titulos: false };
}
/** Lê só as colunas de número e tipo (rápido). Devolve [{ linha, num, tipo }]. */
function avariaLer(sh, ac) {
  const ult = sh.getLastRow(), out = [];
  if (ult < ac.ini) return out;
  const n = ult - ac.ini + 1, ncol = Math.max(ac.iN, ac.iT) + 1;
  const v = sh.getRange(ac.ini, 1, n, ncol).getValues();
  for (let i = 0; i < v.length; i++) {
    const num = soDigitos(v[i][ac.iN]);
    if (/^\d{5,}$/.test(num)) out.push({ linha: ac.ini + i, num: num, tipo: texto(v[i][ac.iT]) });
  }
  return out;
}
function numerosAvaria(sh) {
  const set = {};
  if (sh.getLastRow() < 1) return set;
  sh.getRange(1, 1, sh.getLastRow(), Math.max(sh.getLastColumn(), 1)).getValues().forEach(function (l) {
    l.forEach(function (v) { const t = texto(v); if (/^\d{5,}$/.test(t)) set[t] = true; });
  });
  return set;
}
/** Colunas da 9712 que interessam: Num.Lançamento (K) e Data. */
function colunas9712(sh) {
  const cab = sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0].map(normalizar);
  let col = cab.indexOf('NUMLANCAMENTO'); if (col < 0) col = 10; // coluna K
  return { num: col, data: cab.indexOf('DATA') };
}
function existeNa9712(num) {
  const sh = dadosSS().getSheetByName('9712');
  if (!sh) return { aba: false, existe: false };
  const ult = sh.getLastRow();
  if (ult < 2) return { aba: true, existe: false };
  const c = colunas9712(sh);
  const v = sh.getRange(2, c.num + 1, ult - 1, 1).getValues();
  for (let i = 0; i < v.length; i++) if (soDigitos(v[i][0]) === num) return { aba: true, existe: true };
  return { aba: true, existe: false };
}
/** Conferência de vários números de uma vez (um só acesso à 9712): { num: true|false } */
function existemNa9712(nums) {
  const sh = dadosSS().getSheetByName('9712'), res = {};
  if (!sh) return { aba: false, mapa: res };
  const ult = sh.getLastRow();
  if (ult < 2) { nums.forEach(function (n) { res[n] = false; }); return { aba: true, mapa: res }; }
  const c = colunas9712(sh), v = sh.getRange(2, c.num + 1, ult - 1, 1).getValues(), set = {};
  for (let i = 0; i < v.length; i++) { const t = soDigitos(v[i][0]); if (t) set[t] = true; }
  nums.forEach(function (n) { res[n] = !!set[n]; });
  return { aba: true, mapa: res };
}
function avariaVerificar(d) {
  const num = soDigitos(d.num);
  if (!num) throw new Error('Informe o número do lançamento.');
  const sh = abaDados('REP.AVARIA'), ac = avariaCols(infoAba('REP.AVARIA'));
  const ja = avariaLer(sh, ac).some(function (x) { return x.num === num; });
  return { ok: true, num: num, jaLancado: ja, na9712: existeNa9712(num) };
}
/** Lista tudo que já foi lançado (mais recente primeiro) + data do lançamento (log) + data na 9712. */
function avariaListar(d) {
  const sh = abaDados('REP.AVARIA'), ac = avariaCols(infoAba('REP.AVARIA'));
  const itens = avariaLer(sh, ac);
  // quando foi lançado: vem do log de lançamentos (os antigos, de antes do log, ficam sem data)
  const quando = {}, ss = dadosSS(), lg = ss.getSheetByName(ABA_LOG_LANC);
  if (lg && lg.getLastRow() > 1) {
    const ini = Math.max(2, lg.getLastRow() - 20000 + 1);
    lg.getRange(ini, 1, lg.getLastRow() - ini + 1, 5).getDisplayValues().forEach(function (l) {
      if (String(l[3]).indexOf('REP.AVARIA') !== 0 || String(l[3]).indexOf('edição') >= 0) return;
      const num = soDigitos(String(l[4]).split('·')[0]);
      if (num) quando[num] = String(l[0]);
    });
  }
  // data da transação na 9712 + se existe lá
  const na = {}, sh9 = ss.getSheetByName('9712');
  if (sh9 && sh9.getLastRow() > 1) {
    const c = colunas9712(sh9), ult = sh9.getLastRow(), nx = {};
    itens.forEach(function (x) { nx[x.num] = true; });
    const vn = sh9.getRange(2, c.num + 1, ult - 1, 1).getValues();
    const vd = c.data >= 0 ? sh9.getRange(2, c.data + 1, ult - 1, 1).getValues() : null;
    for (let i = 0; i < vn.length; i++) {
      const t = soDigitos(vn[i][0]);
      if (t && nx[t] && !na[t]) na[t] = vd ? chaveData(vd[i][0]) : '';
    }
  }
  const out = itens.map(function (x) {
    return { linha: x.linha, num: x.num, tipo: x.tipo, lancadoEm: quando[x.num] || '', data9712: na[x.num] || '', na9712: sh9 ? (x.num in na) : null };
  }).reverse();
  return { ok: true, itens: out, tipos: lerConfig().TIPO_REP_AVARIA || [] };
}
function avariaSalvar(d, s) {
  const num = soDigitos(d.num), tipo = texto(d.tipo);
  if (!num) throw new Error('Informe o número do lançamento.');
  if (!tipo) throw new Error('Escolha o tipo do lançamento.');
  const sh = abaDados('REP.AVARIA'), info = infoAba('REP.AVARIA'), ac = avariaCols(info);
  if (avariaLer(sh, ac).some(function (x) { return x.num === num; })) throw new Error('O lançamento ' + num + ' já existe na REP.AVARIA. Nada foi gravado.');
  // o site já conferiu na lista que tem em memória; só acessa a 9712 se ele não soube dizer
  const na = d.na9712Cliente === true ? { aba: true, existe: true } : existeNa9712(num);
  if (na.aba && !na.existe && d.confirmarSem9712 !== true) return { ok: false, precisaConfirmar: true, erro: 'O número ' + num + ' não foi encontrado na 9712 (coluna K). Confirme para lançar mesmo assim.' };
  const n = Math.max(sh.getLastRow(), ac.titulos ? 1 : 0) + 1;
  if (ac.titulos) {
    const l = new Array(info.ult).fill(''); l[ac.iN] = Number(num); l[ac.iT] = tipo;
    garantirTamanho(sh, n, info.ult); sh.getRange(n, 1, 1, info.ult).setValues([l]);
  } else {  // aba sem títulos reconhecíveis: grava número e tipo nas duas primeiras colunas
    garantirTamanho(sh, n, 2); sh.getRange(n, 1, 1, 2).setValues([[Number(num), tipo]]);
  }
  registrarLog(s, 'REP.AVARIA', num + ' · ' + tipo);
  return { ok: true, num: num, linha: n, na9712: na };
}
/** Corrige o tipo (e, se precisar, o número) de um lançamento já gravado. */
function avariaEditar(d, s) {
  const orig = soDigitos(d.numOriginal), num = soDigitos(d.num) || orig, tipo = texto(d.tipo);
  if (!orig) throw new Error('Lançamento não informado.');
  if (!tipo) throw new Error('Escolha o tipo do lançamento.');
  const sh = abaDados('REP.AVARIA'), ac = avariaCols(infoAba('REP.AVARIA')), itens = avariaLer(sh, ac);
  const it = itens.filter(function (x) { return x.num === orig; })[0];
  if (!it) throw new Error('O lançamento ' + orig + ' não está mais na REP.AVARIA. Atualize a lista.');
  if (num !== orig && itens.some(function (x) { return x.num === num; })) throw new Error('O número ' + num + ' já existe na REP.AVARIA.');
  sh.getRange(it.linha, ac.iN + 1).setValue(Number(num));
  sh.getRange(it.linha, ac.iT + 1).setValue(tipo);
  registrarLog(s, 'REP.AVARIA (edição)', orig + (num !== orig ? ' → ' + num : '') + ' · ' + it.tipo + ' → ' + tipo);
  return { ok: true, num: num, tipo: tipo, linha: it.linha };
}

/** Corrige o tipo de vários lançamentos de uma vez (ex.: Recuperado Repositor × Relação Repositor pelo Cód.Motivo da 9712).
 *  d.itens = [{ num, tipo }] — só altera a coluna de tipo; números que não existem são ignorados. */
function avariaCorrigir(d, s) {
  const lista = (d.itens || []).slice(0, 500);
  if (!lista.length) throw new Error('Nada para corrigir.');
  const sh = abaDados('REP.AVARIA'), ac = avariaCols(infoAba('REP.AVARIA')), itens = avariaLer(sh, ac), porNum = {};
  itens.forEach(function (x) { porNum[x.num] = x; });
  let feitos = 0; const log = [];
  lista.forEach(function (it) {
    const num = soDigitos(it.num), tipo = texto(it.tipo), x = porNum[num];
    if (!x || !tipo || x.tipo === tipo) return;
    sh.getRange(x.linha, ac.iT + 1).setValue(tipo);
    log.push(num + ': ' + x.tipo + ' → ' + tipo); feitos++;
  });
  if (feitos) registrarLog(s, 'REP.AVARIA (correção de tipos)', feitos + ' lançamento(s) · ' + log.slice(0, 8).join(' | '));
  return { ok: true, corrigidos: feitos };
}

/** Exclui um lançamento da REP.AVARIA pelo Num.Lançamento (a linha some da planilha; fica registrado no log). */
function avariaExcluir(d, s) {
  const num = soDigitos(d.num);
  if (!num) throw new Error('Informe o número do lançamento.');
  const sh = abaDados('REP.AVARIA'), ac = avariaCols(infoAba('REP.AVARIA')), x = avariaLer(sh, ac).filter(function (i) { return i.num === num; });
  if (!x.length) throw new Error('O lançamento ' + num + ' não existe mais na planilha.');
  x.map(function (i) { return i.linha; }).sort(function (a, b) { return b - a; }).forEach(function (l) { sh.deleteRow(l); });
  registrarLog(s, 'REP.AVARIA (exclusão)', 'Lançamento ' + num + ' (' + x[0].tipo + ') excluído');
  return { ok: true, excluidas: x.length };
}

/** Última carga de uma base (ex.: 8022) feita pelo site em Administração > Bases — usada para saber se os endereços podem estar velhos. */
function baseAtualizada(d) {
  const nome = texto(d.base) || '8022', c = ultimasCargas(dadosSS())[nome];
  return { ok: true, base: nome, quando: c ? c.quando : '', usuario: c ? c.usuario : '', arquivo: c ? c.arquivo : '' };
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
  const suspensos = {};   // suspensão lançada em Lançar Suspensão (Data … Data Fim) já vem marcada na chamada, com ou sem anexo
  try {
    const X = colunasSuspensao(), ult = X.info.sh.getLastRow();
    if (ult >= 2) X.info.sh.getRange(2, 1, ult - 1, X.info.ult).getValues().forEach(function (l) {
      const mat = soDigitos(l[X.c.mat]), ini = chaveData(l[X.c.data]), fim = chaveData(l[X.c.fim]) || ini;
      if (mat && ini && ini <= iso && iso <= fim) suspensos[mat] = true;
    });
  } catch (e) { /* sem aba de suspensões: segue sem sugestão */ }
  const itens = ativos.map(function (p) {
    if (dia[p.mat]) return { mat: p.mat, nome: p.nome, status: dia[p.mat] };
    if (suspensos[p.mat]) return { mat: p.mat, nome: p.nome, status: 'SUSPENSÃO', sugerido: true };
    return { mat: p.mat, nome: p.nome, status: emFerias[p.mat] ? 'FÉRIAS' : '', sugerido: !!emFerias[p.mat] };   // férias agendadas já vêm marcadas
  });
  const foraDoQuadro = Object.keys(dia).filter(function (m) { return !ativos.some(function (p) { return p.mat === m; }); }).length;
  return { ok: true, data: iso, jaExiste: Object.keys(dia).length > 0, itens: itens, foraDoQuadro: foraDoQuadro };
}

/** Grava (cria ou atualiza) o status de cada matrícula em cada dia. itens = [{data, mat, nome, status}] */
function gravarChamada(itens) {
  const q = infoQuadro(), c = q.c, sh = q.info.sh;
  const linhas = lerLinhas(q.info), indice = {}, cargo = {};
  let cargoCad = {}; try { lerTurnover().pessoas.forEach(function (p) { if (p.cargo && p.mat) cargoCad[soDigitos(p.mat)] = p.cargo; }); } catch (e) { cargoCad = {}; }
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
      if (c.cargo >= 0 && (cargoCad[mat] || cargo[mat])) l[c.cargo] = cargoCad[mat] || cargo[mat];
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
  alertasRegistrarChamada(iso, itens, s);
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

/* ---------- Certificados (histórico dos certificados lançados) ---------- */
const ABA_CERT = 'CERTIFICADOS';
function certSheet() { return abaComCabecalho(ABA_CERT, ['Lançado em', 'Matrícula', 'Nome', 'Cargo', 'Grupo', 'Modelo', 'Destaque', 'Selo', 'Lançado por', 'Configuração']); }
function certLancar(d, s) {
  const mat = soDigitos(d.matric), nome = texto(d.nome);
  if (!mat || !nome) throw new Error('Selecione o colaborador do quadro.');
  const cfg = String(d.config || '');
  if (cfg.length > 45000) throw new Error('Configuração grande demais.');
  const sh = certSheet(), n = Math.max(sh.getLastRow(), 1) + 1, agora = Utilities.formatDate(new Date(), tzPadrao(), 'dd/MM/yyyy HH:mm');
  sh.getRange(n, 1, 1, 10).setNumberFormat('@').setValues([[agora, mat, nome, texto(d.cargo), texto(d.grupo), texto(d.modelo), texto(d.destaque), texto(d.selo), (s && (s.nome || s.matricula)) || '', cfg]]);
  registrarLog(s, 'Certificado', mat + ' ' + nome + ' · ' + texto(d.modelo));
  return { ok: true };
}
function certListar() {
  const sh = certSheet(), ult = sh.getLastRow(), itens = [];
  if (ult >= 2) {
    const ini = Math.max(2, ult - 199);
    sh.getRange(ini, 1, ult - ini + 1, 10).getValues().forEach(function (r) {
      itens.push({ quando: String(r[0]), mat: String(r[1]), nome: String(r[2]), cargo: String(r[3]), grupo: String(r[4]), modelo: String(r[5]), destaque: String(r[6]), selo: String(r[7]), por: String(r[8]), config: String(r[9]) });
    });
  }
  return { ok: true, itens: itens.reverse() };
}

/** Cargos disponíveis no cadastro do quadro: padrão + os adicionados pelo usuário + os já usados na aba TURNOVER. */
const CARGOS_PADRAO = ['Líder', 'Auxiliar', 'Auditor', 'Repositor', 'Recuperação'];
function cargosLista(pessoas) {
  const salvos = alertasLerChave('cargos'), out = [], vistos = {};
  CARGOS_PADRAO.concat(Array.isArray(salvos) ? salvos : [], (pessoas || []).map(function (p) { return p.cargo; })).forEach(function (c) {
    c = texto(c); const k = normalizar(c); if (c && !vistos[k]) { vistos[k] = 1; out.push(c); }
  });
  return out;
}
function quadroListar() { const t = lerTurnover(); return { ok: true, pessoas: t.pessoas, cargos: cargosLista(t.pessoas) }; }
function quadroCargoAdd(d, s) {
  const nome = texto(d.nome).replace(/\s+/g, ' ');
  if (!nome) throw new Error('Digite o nome do cargo.');
  if (nome.length > 30) throw new Error('Nome de cargo muito longo (máximo 30 letras).');
  const atuais = cargosLista(lerTurnover().pessoas), k = normalizar(nome);
  const ja = atuais.filter(function (c) { return normalizar(c) === k; })[0];
  if (ja) return { ok: true, cargos: atuais, cargo: ja };
  const salvos = alertasLerChave('cargos'); const lista = Array.isArray(salvos) ? salvos.slice() : [];
  lista.push(nome); alertasGravarChave('cargos', lista);
  registrarLog(s, 'Quadro (cargo)', 'novo cargo: ' + nome);
  return { ok: true, cargos: atuais.concat([nome]), cargo: nome };
}

function quadroSalvar(d, s) {
  const t = lerTurnover(), info = t.info, sh = info.sh;
  const mat = soDigitos(d.matric), nome = texto(d.nome), linhaEd = Number(d.linha) || 0;
  if (!mat) throw new Error('Informe a matrícula.');
  if (!nome) throw new Error('Informe o nome.');
  const tipo = texto(d.tipo), motivo = texto(d.motivo), obs = texto(d.obs);
  const dtAdm = texto(d.dtAdm), dtDesl = texto(d.dtDesl);
  const ehTransf = /TRANSFER/.test(normalizar(tipo)), ehEnc = /ENCOST/.test(normalizar(tipo));
  const dtTransf = ehTransf ? texto(d.dtTransf) : '', dtEnc = ehEnc ? texto(d.dtEnc) : '', setor = ehTransf ? texto(d.setor) : '';
  if (!ehTransf && texto(d.dtTransf)) throw new Error('A data de transferência só vale para o tipo TRANSFERENCIA.');
  [dtAdm, dtDesl, dtTransf, dtEnc].forEach(function (x) { if (x) isoParaData(x); });
  if (ehTransf && !dtTransf) throw new Error('Informe a data da transferência.');
  if (ehTransf && !setor) throw new Error('Informe para qual setor a pessoa foi transferida.');
  if (ehEnc && !dtEnc) throw new Error('Informe a data do encostamento (INSS).');
  const saiu = !!(dtDesl || ehTransf || ehEnc);   // desligado, transferido ou encostado = ATIVO "Não" no quadro
  if (saiu && !tipo) throw new Error('Informe o tipo (desligamento, pediu desligamento, transferência ou encostado).');
  if (saiu && !ehTransf && !ehEnc && !motivo) throw new Error('Informe o motivo do desligamento.');
  const ativo = !saiu;
  if (!linhaEd && t.pessoas.some(function (p) { return p.mat === mat && p.ativo; }))
    throw new Error('A matrícula ' + mat + ' já está ATIVA no quadro. Edite o registro existente.');
  if (linhaEd && !t.pessoas.some(function (p) { return p.linha === linhaEd; })) throw new Error('Registro não encontrado (a aba mudou). Recarregue.');

  const c = {
    mat: t.idx.mat, nome: t.idx.nome,
    ativo: garantirCol(info, ALIAS_TURN.ativo, 'ATIVO'), tipo: garantirCol(info, ALIAS_TURN.tipo, 'TIPO'),
    motivo: garantirCol(info, ALIAS_TURN.motivo, 'MOTIVO'), obs: garantirCol(info, ALIAS_TURN.obs, 'OBS'),
    adm: garantirCol(info, ALIAS_TURN.adm, 'DATA CONTRATAÇÃO'), desl: garantirCol(info, ALIAS_TURN.desl, 'DATA DESLIGAMENTO'),
    transf: garantirCol(info, ALIAS_TURN.transf, 'DATA TRANSFERÊNCIA'),
    enc: garantirCol(info, ALIAS_TURN.enc, 'DATA ENCOSTAMENTO'), setor: garantirCol(info, ALIAS_TURN.setor, 'SETOR DESTINO'),
    cargo: garantirCol(info, ALIAS_TURN.cargo, 'CARGO')
  };
  const l = new Array(info.ult).fill('');
  if (linhaEd) { const atual = sh.getRange(linhaEd, 1, 1, info.ult).getValues()[0]; for (let i = 0; i < atual.length; i++) l[i] = atual[i]; }
  l[c.mat] = mat; l[c.nome] = nome; l[c.ativo] = ativo ? 'Sim' : 'Não'; l[c.tipo] = tipo; l[c.motivo] = motivo; l[c.obs] = obs;
  l[c.adm] = dtAdm ? isoParaData(dtAdm) : ''; l[c.desl] = dtDesl ? isoParaData(dtDesl) : ''; l[c.transf] = dtTransf ? isoParaData(dtTransf) : '';
  l[c.enc] = dtEnc ? isoParaData(dtEnc) : ''; l[c.setor] = setor; l[c.cargo] = texto(d.cargo);
  const n = linhaEd || (Math.max(sh.getLastRow(), 1) + 1);
  garantirTamanho(sh, n, info.ult);
  sh.getRange(n, 1, 1, info.ult).setValues([l]);
  [c.adm, c.desl, c.transf, c.enc].forEach(function (k) { formatarDatas(sh, k, n, 1); });
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

/* =========================================================================
   Núcleo Reposição — versão e notas de atualização
   A cada publicação: aumentar APP_VERSAO e acrescentar uma entrada NO TOPO de NOTAS_VERSAO.
   Regra: funcionalidade nova = sobe o 2º número (2.7.0 → 2.8.0); correção ou ajuste = sobe o 3º (2.7.0 → 2.7.1);
   mudança grande de estrutura = sobe o 1º número.
   ========================================================================= */
const APP_VERSAO = "2.12.0";

const NOTAS_VERSAO = [
  { v:"2.12.0", data:"2026-11-10", titulo:"Parâmetros do Painel TV, fotos e sequência", itens:[
    "Administração > Parâmetros Painel TV (somente administrador): escolhe o que aparece (qualidade, fotos, colunas, observação, melhores de 3 meses), o critério do ranking, o efeito do fundo, as cores, a velocidade da rolagem e a aura de cada posição.",
    "'Destaques' agora é 'Funcionários do Mês': dá para mostrar o mês passado ('Outubro 2026') ou o mês atual ('Novembro 2026').",
    "Ritmo mostra se subiu ou caiu em relação à semana anterior (7 dias) e ao mês anterior.",
    "Lançar Quadro: foto do colaborador (cadastro e troca na edição). A foto aparece no pódio e no quadro do Painel TV, junto com a medalha.",
    "Sequência: quem fica meses seguidos entre os 3 destaques ganha selo 2x, 3x, 4x..., faixa 'x meses seguidos' e aura de energia na foto (mínimo de meses configurável). 1º lugar pode pulsar devagar.",
    "Requer atualizar o código do Apps Script (nova versão da implantação)."
  ] },
  { v:"2.11.0", data:"2026-11-10", titulo:"Painel de TV e horários nos alertas", itens:[
    "Painel de TV (botão Play 'Painel TV', ao lado de Atualizar dados): ranking de repositores em tela cheia, abre na 2ª tela quando houver (senão na tela atual).",
    "Pódio do mês anterior com medalhas de 1º, 2º e 3º com fita; melhores dos últimos 3 meses; observação de que o ranking considera pontuação e % de qualidade da rua.",
    "Tabela completa com média de 3 meses, último mês, mês atual até hoje, valor projetado (média por dia útil), ritmo e variação contra o mês anterior, com rolagem automática.",
    "Alertas: repetição 'Todos os dias' e 'Dias da semana' (segunda a domingo, escolha livre) e horário em todos os alertas (nos do sistema: 'a partir de').",
    "Lembretes com horário chegam ao celular na hora marcada (rodar ativarAgendador uma vez no Apps Script). Atualizar o Apps Script."
  ]},
  { v:"2.11.0", data:"2026-11-10", titulo:"Base 8460: só tipo 58 e conferência da última linha", itens:[
    "Ao ler o arquivo da 8460, o sistema avisa se a coluna TIPOOS tem algum tipo diferente de 58 e mostra quantas linhas há de cada tipo.",
    "Havendo outro tipo, a gravação normal fica bloqueada. O novo botão “Gravar só tipo 58” grava apenas as linhas de tipo 58, conferindo por dia com a base e pedindo confirmação.",
    "A última linha do arquivo (o total) é sempre verificada e mostrada na tela: se for o total, é retirada e nunca é gravada; se não parecer um total, o sistema avisa para conferir se o arquivo veio completo."
  ]},
  { v:"2.10.3", data:"2026-11-07", titulo:"Ajuste nos alertas personalizados", itens:[
    "Configurar alertas: o botão liga/desliga dos alertas criados por você não ultrapassa mais a caixa no celular (o botão de quem recebe encolhe para dar espaço)."
  ]},
  { v:"2.10.2", data:"2026-11-07", titulo:"Atualização sempre completa no celular", itens:[
    "O aplicativo agora confere cada arquivo com o servidor a cada abertura, ignorando o cache do navegador. Evita misturar arquivos novos com antigos (ex.: botão do menu à esquerda com o menu ainda abrindo à direita)."
  ]},
  { v:"2.10.1", data:"2026-11-07", titulo:"Ajustes dos alertas e do menu no celular", itens:[
    "Menu lateral do celular agora abre pela esquerda (botão no início do cabeçalho; deslizar para a esquerda fecha) e mostra a versão instalada, as notas de atualização e o botão Atualizar agora.",
    "Sino abre na hora: usa os dados já carregados e confere o servidor em segundo plano (antes esperava ~5 s e um segundo toque fechava o painel).",
    "No celular o painel de alertas não fecha sozinho; no computador continua com o timer de 4 s.",
    "A engrenagem abre as configurações sozinhas (o painel sai da frente) e, ao salvar ou fechar, volta para a tela de alertas.",
    "Configurações redesenhadas: janela mais larga, cartões com mais espaço, textos sem aperto e controles em linha própria no celular."
  ]},
  { v:"2.10.0", data:"2026-11-07", titulo:"Alertas no celular (push)", itens:[
    "Notificações push mesmo com o aplicativo fechado: Configurar alertas > Notificações no celular > Ativar neste aparelho (há botão de teste).",
    "A chamada do dia é enviada na hora ao celular de quem recebe esse alerta, com quem lançou, o horário e quem não está presente.",
    "No iPhone é preciso adicionar o aplicativo à tela inicial e abrir por lá.",
    "Envio feito por um servidor gratuito (Cloudflare Worker) — instruções em push/LEIA-ME.md. Atualizar o Apps Script."
  ]},
  { v:"2.9.0", data:"2026-11-07", titulo:"Novos alertas (etapa 2)", itens:[
    "Produto transferido: resumo dos produtos cujo endereço na 8022 é diferente do da 8022 Nova, com urgência; clique abre Capacidade CD.",
    "Chamada do dia: mostra quem lançou, a que horas e quem não está presente (falta, atestado, suspensão). O painel confere a cada 2 min e abre com aviso quando sai uma chamada nova.",
    "Férias vencendo: vencidas ou que vencem em até 1 mês e ainda sem agendamento.",
    "Documento sem anexo: advertência/suspensão lançada sem o anexo continua como 'não aplicada' até o documento ser anexado.",
    "Lembretes prontos para o administrador: enviar comissão (a partir do dia 1) e resumo de folgas (até o dia 20); dá para editar ou apagar em Configurar alertas.",
    "Notificação do navegador opcional (botão em Configurar alertas). Os alertas de feedback sem registro e NC recorrente continuam como antes.",
    "Atualizar o Apps Script (novo código da chamada e dos alertas)."
  ]},
  { v:"2.8.0", data:"2026-11-07", titulo:"Nova central de alertas", itens:[
    "Alertas abrem à direita, a partir do sino, com visual translúcido e ícones minimalistas (sem emojis).",
    "Barra de contagem regressiva de 4 s: o painel fecha sozinho, pausa com o mouse em cima e fica fixo se você clicar.",
    "Em cada aviso: descartar (volta se a situação mudar) ou não mostrar mais para aquela pessoa (veto); dá para restaurar em Configurar alertas.",
    "Engrenagem do painel e nova guia Administração > Alertas: ligar/desligar cada tipo, escolher quem recebe (somente o administrador dos alertas), abrir o painel ao entrar e criar alertas recorrentes (mensal, semanal ou data única) com “marcar como feito”."
  ]},
  { v:"2.7.3", data:"2026-11-07", titulo:"Mais velocidade ao editar feedback", itens:[
    "Editar feedback abre na hora: o formulário usa os dados que o painel já tem e a busca da linha na planilha roda em paralelo, só sendo exigida ao salvar.",
    "Pessoas e motivos são preparados em segundo plano depois da carga; a lista de feedbacks da pessoa fica 90 s em memória (a 2ª edição é imediata).",
    "Servidor: as permissões do usuário ficam 60 s em cache, sem reabrir a planilha de permissões em toda chamada (mudanças em Acessos valem na hora)."
  ]},
  { v:"2.7.2", data:"2026-11-07", titulo:"Versão discreta no menu", itens:[
    "Menu lateral: a versão aparece em texto simples abaixo de Administração e, quando há versão nova, o aviso “disponível ↻” atualiza com um clique."
  ]},
  { v:"2.7.1", data:"2026-11-07", titulo:"Versão no menu lateral", itens:[
    "Menu lateral, abaixo das guias: versão instalada, versão mais recente e botão Atualizar agora (o quadro fica laranja quando há versão nova)."
  ]},
  { v:"2.7.0", data:"2026-11-07", titulo:"Bases mais flexíveis, registro de carga e notas de atualização", itens:[
    "Administração > Bases: coluna Modo gravação com lista AGREGAR / SUBSTITUIR (muda o comportamento da base na hora), botão Excluir base (com dupla confirmação) e Gravar sem conferir (com alerta).",
    "Bases controladas por Lançamentos ou por link externo saíram da tela de carregamento (Turnover, Rep.Avaria, Quadro Rep, Feedback Rep, Auditoria Rep, Missões, Capacidade Realizada e Tipo).",
    "Ícones próprios para Lançar Suspensão, Controle de Coletores e Devolução de Mercadorias; nenhuma guia repete ícone.",
    "Registro de carga (login e atualização): mostra o que está sendo buscado, um item por vez, com a quantidade de linhas; abas sem data própria e a Auditoria deixaram de gerar alerta falso.",
    "Controle de Coletores: login e senha separados para o coletor e para o Winthor, formulário reorganizado em seções e exemplos conforme os dados cadastrados.",
    "Editar feedbacks antigos: a busca na planilha ficou tolerante (resumo, data invertida e registros sem matrícula).",
    "Nova guia Atualizações (Administração) com versão atual, verificação de versão nova e este histórico."
  ]},
  { v:"2.6.0", data:"2026-11-06", titulo:"Carga de bases por dia e fila de carregamentos", itens:[
    "Carga por dia nas bases que acumulam: compara só os dias em comum, mantém a maior quantidade de linhas, grava em bloco único e agrega os dias novos ao fim do histórico.",
    "Leituras não esperam mais pela trava de gravação (fim do erro “Tempo limite do bloqueio”).",
    "Indicador de linhas disponíveis por aba e do espaço total da planilha (limite de 10 milhões de células).",
    "Fila de carregamentos: coloque vários arquivos na fila (ex.: 8460 e 9712) e eles gravam um por vez enquanto você prepara o próximo.",
    "Conferência por dia ignora datas inválidas e lista as linhas de cada dia novo.",
    "Lançar Avaria 9712: opção para excluir lançamentos."
  ]},
  { v:"2.5.0", data:"2026-11-05", titulo:"Não conformidades, suspensão, coletores e folhas de feedback", itens:[
    "Não conformidades por colaborador (1 NC = colaborador + data + rua), ligadas a Auditoria, Feedbacks e alertas; regra de 4 NC = 1 feedback, 3 feedbacks = 1 advertência e 3 advertências = suspensão.",
    "Lançar Suspensão: alerta de advertências no mesmo motivo, cadeia completa NC → feedback → advertência → suspensão e suspensão pré-marcada na Chamada.",
    "Controle de Coletores: cadastro, termo de compromisso em PDF, termo assinado, cards de total e gráfico mês a mês por setor.",
    "Folhas de feedback A4 vertical para assinatura (por não conformidade e de produção/qualidade) com regras, presença, qualidade, avaliações e assinaturas.",
    "Avaria 9712: quem lançou, data, itens da transação, busca por produto, motivo 1886 (Recuperado Repositor) e correção de tipos.",
    "Devolução de Mercadorias: rota mais rápida (crescente ou decrescente), endereços da 8022 e etiquetas 50x50."
  ]},
  { v:"2.4.0", data:"2026-11-04", titulo:"Comissão completa", itens:[
    "Equipe de Apoio (auditorias de retorno e itens recuperados) e resumo mensal com teto e qualidade.",
    "Definição de Parâmetros salva e versionada na planilha, com pontuação mínima, fixas, manuais, faturamento e avaria diluída entre os repositores.",
    "Projeção completa da comissão (fixa, a pagar, auditor, recuperações), exportação e histórico mensal com linha de teto."
  ]},
  { v:"2.3.0", data:"2026-11-03", titulo:"Feedbacks editáveis e regras do Quadro", itens:[
    "Editar feedback já lançado e escanear o documento depois; scanner mais preciso e nítido.",
    "Gerar feedback em PDF direto do detalhe do funcionário.",
    "Alertas ignoram desistentes (falta 7+ dias) e encostados; Lançar Quadro com TIPO, transferência com setor e encostado com data INSS.",
    "Bases: conferência rápida do último mês (compara por dia e grava só o que falta)."
  ]},
  { v:"2.2.0", data:"2026-10-27", titulo:"Mobile, acessos, chamada e auditoria de retornos", itens:[
    "Datas no padrão brasileiro (corrige 12/08/26 lido como 08/12 e linhas perdidas).",
    "Carregamento minimalista com barra no topo e resumo; correção do travamento com sessão salva.",
    "Chamada com % de presença e absenteísmo mês a mês; Férias não marcam vencido quem já tem férias lançadas.",
    "Mobile: menu em acordeão, conteúdo dentro da largura da tela e rolagem corrigida.",
    "Administração > Acessos: histórico de logins, falhas, tempo ativo, abas mais usadas e redefinição de senha.",
    "Qualidade de Retornos por rua e repositor (Auditoria_Retorno, Rotina_Retorno, Quadro_Repositores), com cards e gráfico mensal.",
    "Lançar Advertência com lista e edição; Comissão abre no mês atual; Acompanhamento Individual usa só o quadro atual."
  ]},
  { v:"2.1.0", data:"2026-10-26", titulo:"Lançamentos e novo visual", itens:[
    "Lançamentos: Feedback (scanner/PDF), Rep.Avaria, Chamada em lote, Quadro/Turnover, Missões e Capacidade.",
    "Feedbacks e Advertências, alertas e férias agendadas; chamada por botões.",
    "Revisão de design: tema claro/escuro, ícones de linha, menu recolhível, avisos e animações (com chave para ligar/desligar).",
    "Exportação em PDF/PNG corrigida."
  ]},
  { v:"2.0.0", data:"2026-10-23", titulo:"Painel online no Google Sheets", itens:[
    "O painel lê as abas direto do Google Sheets, sem upload de Excel.",
    "Novo aplicativo: menu lateral, barra inferior no celular, login por matrícula, permissões por aba, PWA instalável.",
    "Administração: Bases, Acessos e Links de acesso, com servidor em Apps Script.",
    "Auditoria lê da planilha online; novos pesos da qualidade (Avariados×4, Prox.Venc×3, Picking×6, Sem Saldo×2)."
  ]},
  { v:"1.1.0", data:"2026-10-17", titulo:"Organograma, abastecimento e 3D", itens:[
    "Gestão > Organograma.",
    "Indicadores > Nível Abastecimento (picking) com tabela, gráfico por rua, itens sem AE e saldo baixo; capacidade pelo Cap Pick da 1707.",
    "NVL 3D: visualização do CD (flowracks, meios empilhados e drive-in).",
    "Auditoria passa a usar a nova planilha, com uma linha por produto."
  ]},
  { v:"1.0.0", data:"2026-08-17", titulo:"Primeira versão (carga por Excel)", itens:[
    "Dashboard em um único HTML alimentado por arquivo Excel: Produção, Projeção, Acompanhamento Individual, Produção de Operadores e Relações Rep.",
    "Cronograma, Turnover, Avaria XML, Capacidade CD e Auditoria com critérios ponderados.",
    "Exportação em PDF/PNG, ordenação de tabelas, paginação e urgência de endereços."
  ]}
];

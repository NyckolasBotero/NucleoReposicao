/* =========================================================================
   Núcleo Reposição — versão e notas de atualização
   A cada publicação: aumentar APP_VERSAO e acrescentar uma entrada NO TOPO de NOTAS_VERSAO.
   Regra: funcionalidade nova = sobe o 2º número (2.7.0 → 2.8.0); correção ou ajuste = sobe o 3º (2.7.0 → 2.7.1);
   mudança grande de estrutura = sobe o 1º número.
   ========================================================================= */
const APP_VERSAO = "2.25.0";

const NOTAS_VERSAO = [
  { v:"2.25.0", data:"2026-11-23", titulo:"Refeitório: solicitação de inclusão em lote", itens:[
    "Solicitar Inclusão agora aceita vários colaboradores de uma vez (mesmo setor e mesmo motivo): adicione linhas ou use \"Colar lista\" (um por linha, código e nome, pode copiar do Excel). Se algum der problema (já é fixo, já tem pedido pendente), os demais seguem e só as linhas com problema ficam na tela com o motivo.",
    "Atenção: reimplantar o Apps Script (apps_script_nucleo.gs)."
  ]},
  { v:"2.24.0", data:"2026-11-23", titulo:"Refeitório: lembrete no celular para revisar a lista", itens:[
    "Parâmetros > Refeitório: lembrete push (\"Quase na hora do almoço, gostaria de revisar sua lista?\") com horário personalizado, dias da semana, mensagem editável e destinatários (todos os encarregados ou gestores escolhidos), mais botão para enviar um teste.",
    "Ao tocar na notificação, o aplicativo abre direto a pré-liberação de hoje.",
    "Pré-liberação: ＋ Adicionar pessoa ao dia (hoje, próximo dia útil ou data específica, sem entrar na lista fixa), Solicitar inclusão permanente e excluir da lista fixa ou só do dia.",
    "Atenção: reimplantar o Apps Script e ligar o agendador (rodar ativarAgendador uma vez, se ainda não estiver ligado). O lembrete roda no mesmo gatilho de 5 em 5 minutos dos alertas."
  ]},
  { v:"2.23.0", data:"2026-11-23", titulo:"Refeitório Interno: controle de entradas digital", itens:[
    "Novo módulo no lugar das listas em papel: Lançamentos > Liberações Refeitório e Gestão > Histórico Almoço, com abas Liberações Refeitório, Solicitar Inclusão, Histórico e Indicadores e Cardápio e Adesão (cada pessoa vê só as abas do seu perfil).",
    "Portaria (Bravo): lista do dia de todos os setores com busca instantânea por código ou nome. A presença marca na hora (horário e data automáticos) e sincroniza em segundo plano, sem telas de carregamento. Digitar o código e teclar Enter registra a presença.",
    "Registro Avulso: quem almoça sem estar na lista entra na contagem como avulso e o encarregado do setor é avisado (notificação no sistema e push no celular). O encarregado responde se autorizou e se quer pedir a inclusão fixa; a resposta fica para auditoria.",
    "Encarregado: pré-liberação diária por setor (marcar e enviar a lista, com status de envio) e solicitação de inclusão fixa com motivo obrigatório. Os aprovadores aceitam ou negam pelas notificações.",
    "Histórico e Indicadores: hoje, ontem e acumulado do mês (almoçaram x liberados que não almoçaram), por setor, dia a dia, auditoria de avulsos e registros, com filtros de período, setor e encarregado (Visão Geral).",
    "Cardápio e Adesão (Gestor de Cozinha): cardápio semanal por dia e adesão por prato.",
    "Administração > Acessos: papéis do refeitório, nível (restrito aos setores ou visão geral) e vários setores por usuário, com \"＋ Novo Setor\". Administração > Parâmetros > Refeitório: lista de aprovadores.",
    "Atenção: reimplantar o Apps Script (apps_script_nucleo.gs). As abas REFEIT_* são criadas sozinhas no primeiro uso."
  ]},
  { v:"2.22.1", data:"2026-11-17", titulo:"Comissão: faixas de qualidade voltam como opção nos parâmetros", itens:[
    "Novo parâmetro \"Usar faixas de qualidade?\" (Parâmetros > Comissão, junto de Desconto por qualidade). Em Não (padrão), a qualidade geral é direto o % da comissão que sobra; em Sim, vale a regra antiga por faixas: abaixo de 50% zera, 50 a 69% paga metade, 70% ou mais paga o % da qualidade.",
    "A regra aplicada de cada repositor, o resumo e o PDF indicam qual modo está ativo. Como os demais parâmetros, vale por mês e é gravado ao salvar os parâmetros."
  ]},
  { v:"2.22.0", data:"2026-11-17", titulo:"Comissão: a qualidade geral (ruas + retornos) é o que sobra da comissão", itens:[
    "A qualidade do repositor na comissão passa a ser a QUALIDADE GERAL: ruas e retornos juntos, ponderados pelo número de auditorias de cada um (retornos pela acuracidade). Antes entrava só a qualidade das ruas.",
    "O valor da qualidade é direto o % da comissão que o repositor recebe (ex.: 85% de qualidade paga 85% do valor). As antigas faixas (abaixo de 50% zera, 50 a 69% metade) deixam de existir.",
    "Repositor sem nenhuma auditoria no período continua usando a qualidade geral da equipe; a qualidade geral da equipe também passa a juntar ruas e retornos pelo nº de auditorias.",
    "A regra aplicada de cada repositor mostra a qualidade geral e, quando há, os valores de ruas e retornos."
  ]},
  { v:"2.21.1", data:"2026-11-17", titulo:"Capacidade: alternadores Sim/Não no padrão do sistema", itens:[
    "Revenda, Não Validado, Corretivo, Transferido, Rua por página, Últimas Validações e Mostrar detalhes agora usam o mesmo componente de alternar das demais telas (toggle-group), inclusive no modo escuro.",
    "A documentação de filtros foi atualizada; em Capacidade ainda restam campos de data e seleção com estilo próprio."
  ]},
  { v:"2.21.0", data:"2026-11-17", titulo:"Digitalização de documentos com frente e verso", itens:[
    "No scanner, a 1ª página agora é a Frente; ao usar o documento, o sistema pergunta se ele tem verso e já abre a digitalização do verso (botão \"Digitalizar o verso\"). Páginas extras seguem como Página 3, 4...",
    "Em \"Já tenho o arquivo\", dá para escolher várias imagens de uma vez (frente e depois verso): elas são juntadas num único PDF, na ordem escolhida.",
    "Vale para todos os anexos digitalizados: feedback, advertência, suspensão, termo de coletor e documentos escaneados depois."
  ]},
  { v:"2.20.0", data:"2026-11-17", titulo:"Certificado com verso de desempenho, medalha arrastável e layouts salvos", itens:[
    "Certificado agora tem frente e verso. O verso traz produção média por mês, média por dia no último ano, produção do mês atual e, mês a mês e no geral (12 meses): produção, média/dia, qualidade de ruas, qualidade de retorno, qualidade geral e % de presença do colaborador.",
    "O PDF sai com 2 páginas (frente e verso) quando a opção \"Incluir o verso\" está marcada; o PNG baixa o lado que está na tela.",
    "A medalha (selo) pode ser arrastada no preview; a posição é guardada no layout e respeitada no PNG e no PDF, com botão para voltar à posição original.",
    "Novo grupo \"Layouts salvos\": salve o visual atual com um nome (cores, moldura, fontes, logo, rodapé, medalha e posição) e reaplique em outros certificados. Ficam salvos neste navegador."
  ]},
  { v:"2.19.0", data:"2026-11-17", titulo:"Administração > Parâmetros (regras de NC, auditoria, comissão e Painel TV)", itens:[
    "Nova página Administração > Parâmetros, em abas: Não Conformidades e Feedbacks, Auditoria, Comissão e Painel TV (a antiga página Parâmetros Painel TV foi incorporada; o bloco de parâmetros saiu da tela Comissão).",
    "Não Conformidades e Feedbacks: regras gerais (NC por feedback, feedbacks por advertência, advertências por suspensão) e regras por motivo, com números próprios e alertas de feedback, advertência e suspensão que podem ser desligados (ex.: feedback de gestão 1 vez ao mês sem alerta de advertência).",
    "As regras valem na hora nos alertas, no Insights, nas telas de NC e no documento de feedback (que passa a mostrar os números de cada motivo).",
    "Auditoria: pesos dos critérios (picking, avaria, vencimento, sem saldo, outra) e ruas fora da auditoria passam a ser ajustáveis.",
    "Painel TV: transmissão em tela cheia por toggle (desligado por padrão): ligado, abre já na 2ª tela sem clique de confirmação; sem 2ª tela, abre numa janela menor. Novo botão Ver ao vivo (PIP) mostra o painel em miniatura na tela de parâmetros.",
    "Só o administrador grava os parâmetros; os demais usuários só recebem as regras. Requer atualizar o Apps Script (rotas param_ler e param_salvar)."
  ]},
  { v:"2.18.4", data:"2026-11-17", titulo:"Ordenação preservada e último tipo de feedback pré-selecionado", itens:[
    "Todas as tabelas ordenáveis lembram a coluna e a direção escolhidas: ao clicar em outro funcionário (ou redesenhar a tela) a ordem não é perdida.",
    "Download do Feedback (PDF): o tipo de documento e o período usados por último já vêm marcados na próxima geração."
  ]},
  { v:"2.18.3", data:"2026-11-17", titulo:"Código - Nome nos documentos de feedback", itens:[
    "PDFs de feedback (NC e Produção/Qualidade): Identificação com Código antes do Colaborador e do Avaliador; linhas de assinatura mostram Código - Nome."
  ]},
  { v:"2.18.2", data:"2026-11-17", titulo:"Padronização de atalhos de período e Código - Nome", itens:[
    "Atalhos de período iguais em todas as telas: Mês Atual, Mês Anterior, Últimos 3 Meses, Ano Atual, Ano Anterior e Tudo (Produção, Projeção, Operadores, Relações, Capacidade, Quadro, Chamada, Feedbacks, Auditoria, Comissão e Turnover).",
    "Projeção, Chamada e Feedbacks ganharam os atalhos de período.",
    "Relações: Apenas Reposição e Apenas REP.AVARIA passam a usar o Sim/Não padrão do site.",
    "Código - Nome também em Projeção por funcionário, Acompanhamento Individual, Operadores, Retornos, NC (colaborador, feedbacks, advertências e suspensões) e Atribuição Ruas.",
    "Documentação de filtros atualizada com as mudanças."
  ]},
  { v:"2.18.1", data:"2026-11-17", titulo:"Insights em cards e padrão Código - Nome", itens:[
    "Feedbacks > Insights reorganizado em blocos: destaques em cards coloridos e rankings em caixas com hover, sem links soltos; clicar na pessoa abre o histórico.",
    "Ranking de Repositores: coluna Código antes de Funcionário.",
    "Gestão > Auditoria: tabelas com Código antes do Repositor (Qualidade por Repositor, Qualidade por Rua/Repositor e detalhe).",
    "Listas Funcionário (Produção e Acompanhamento Individual) e Repositor (Auditoria) agora mostram Código - Nome.",
    "Tabela de Feedbacks e Advertências e os Insights identificam a pessoa como Código - Nome."
  ]},
  { v:"2.18.0", data:"2026-11-17", titulo:"Documentação de filtros ao lado das notas de atualização", itens:[
    "Administração > Atualizações e Documentação: dois botões verticais no topo (Notas de atualização e Documentação) alternam o conteúdo.",
    "Documentação: levantamento de todos os filtros de cada página (tipo, componente usado e detalhe), com busca, filtro por menu e botão Copiar como texto.",
    "Em cada página dá para marcar se ela precisa de filtros (A revisar / Sim / Não); a escolha fica salva no navegador.",
    "Achados da revisão: atalhos de período diferentes por tela, nome sem código nas listas de funcionário, Sim/Não e campos fora do padrão, telas sem filtro."
  ]},
  { v:"2.17.2", data:"2026-11-17", titulo:"Qualidade de retornos por repositor", itens:[
    "Na planilha, só as linhas com erro trazem o colaborador. Agora as auditorias conformes são atribuídas a quem respondia pela rua na data, e os erros ficam com o colaborador apontado.",
    "Corrige a qualidade/acuracidade de retornos zerada no feedback, no ranking e em Gestão > Auditoria (ex.: 47 auditados, 5 erros, 89,4%)."
  ]},
  { v:"2.17.1", data:"2026-11-16", titulo:"Correções no Feedback de Produção e Qualidade", itens:[
    "O.S. dia anterior = último dia em que o colaborador produziu antes da data base (sem produção no dia anterior, mostra o último dia produzido).",
    "O.S. última semana = soma de segunda a sexta da última semana fechada (a semana em andamento não entra); o card mostra o período.",
    "Média diária, Ritmo atual e Projeção usam a média de O.S. do mês atual (O.S. do mês ÷ dias produzidos); projeção = média × dias úteis do mês.",
    "Qualidade · Ruas é do mês atual; Qualidade · Retornos mostra o % de acerto sobre os retornos auditados (ex.: 47 auditados, 5 erros, 89,4%).",
    "Tabela \"Não conformidades por motivo\" ganhou as colunas Auditorias e % de erro sobre as auditorias, para entender o percentual."
  ]},
  { v:"2.17.0", data:"2026-11-16", titulo:"Regras e pesos da auditoria de ruas", itens:[
    "Qualidade da rua = 1 − (pontos ÷ endereços da rua). Pesos: picking errado 6, avaria 4, próximo do vencimento 3, sem saldo 2 e outra não conformidade 1; no mesmo lançamento os pesos somam.",
    "O mesmo endereço lançado mais de uma vez na auditoria da rua vale o maior peso (não soma). Endereços da rua = picking na 8022; se a auditoria tiver mais endereços, vale a quantidade auditada.",
    "Fechamento: cada rua usa a última auditoria do período e a qualidade média é a média dessas ruas. Ruas 14, 15, 21, 31 e 50 a 54 ficam fora da auditoria.",
    "Exemplo conferido: rua com 260 endereços, 2 picking errado e 1 avaria = 16 pontos = 93,8%."
  ] },
  { v:"2.16.0", data:"2026-11-16", titulo:"Atribuição Ruas e revisão das auditorias", itens:[
    "Nova aba Gestão > Atribuição Ruas: mapa 2D do CD (ruas 1 a 49) com o repositor de cada rua, % qualidade de retornos, de ruas e geral, e a produção média (O.S. 58 por dia). Clique seleciona várias ruas (Shift+clique seleciona faixa) e o botão direito atribui um repositor a todas de uma vez (substituir, adicionar ou liberar).",
    "Cada mudança grava data e hora no histórico (aba ATRIBUICAO_RUAS_HIST) e o sistema guarda uma foto diária do estado de todas as ruas (ATRIBUICAO_RUAS_DIA). O estado atual fica em ATRIBUICAO_RUAS e é copiado para a coluna Ruas da Quadro_Repositores da planilha de auditoria.",
    "Correção: 'Atualizar dados' da Auditoria agora relê também Auditoria_Retorno, Rotina_Retorno e Quadro_Repositores (antes só relia a Auditoria de Ruas e os retornos ficavam velhos).",
    "Correção: erros de retorno contam um a um (1 linha com erro = 1 NC), igual ao PDF da auditoria de retorno; antes eram agrupados por dia/rua (a Alice aparecia com 2 em vez de 5). Erro = Possui_NC ou divergência etiqueta × físico, em todas as telas.",
    "Correção: Auditoria > Retornos por repositor usa as linhas do próprio repositor (auditados, erros, acuracidade e qualidade com o peso por rua) e respeita os filtros de rua, repositor e quadro atual.",
    "Correção: a qualidade de ruas por repositor passa a incluir as auditorias impecáveis das ruas dele (quem respondia pela rua na data), e os filtros 'Repositor' e 'Somente quadro atual' não descartam mais essas auditorias.",
    "Correção: PDF de feedback agora lê as bases de auditoria antes de montar e mostra Qualidade Ruas e Retornos do período escolhido (com erros e acuracidade). O Ranking de Repositores usa a mesma conta da Auditoria.",
    "Quadro: o cargo lançado em Lançar Quadro também é gravado na aba QUADRO REP (coluna CARGO, criada se faltar) para aquele código e aparece como Repositor em Gestão > Quadro.",
    "Requer atualizar o código do Apps Script (nova versão da implantação) e liberar 'Gestão > Atribuição Ruas' na planilha de acessos para quem for usar (administradores dos Acessos já veem). Para a foto diária automática, rode instalarGatilhoRuas uma vez no editor."
  ] },
  { v:"2.15.0", data:"2026-11-13", titulo:"Certificados", itens:[
    "Lançamentos > Certificados: editor de certificado A4 com visualização ao vivo, download em PNG e PDF e lançamento no histórico (aba CERTIFICADOS), com opção de reabrir um certificado lançado.",
    "Ao escolher o colaborador do quadro, o grupo de modelos vem do cargo: Repositor (12 modelos), Recuperação (10) e Auxiliar/Gestão (10). Cada modelo preenche o texto, a palavra em destaque e o selo.",
    "Personalização: 5 layouts, 6 temas de cor, cores livres, fontes, tamanhos, logo (posição, tamanho, marca d'água ou outra imagem), ordem do rodapé, nome do assinante, local e data.",
    "Selo por período (funcionário do mês, semana, trimestre, semestre, ano, especial ou texto livre) com 5 estilos e 14 ícones; medalhas, louros e faixa nas laterais.",
    "Novo cargo padrão 'Recuperação' no Lançar Quadro. A tela Certificados aparece para quem administra os Acessos; para os demais, dê a permissão 'Certificados' em Lançamentos.",
    "Requer atualizar o código do Apps Script (nova versão da implantação)."
  ] },
  { v:"2.14.0", data:"2026-11-11", titulo:"Cargo no Lançar Quadro", itens:[
    "Lançar Quadro: novo campo Cargo (Líder, Auxiliar, Auditor, Repositor) no cadastro e na edição, com o botão '+ Novo cargo' para criar outros.",
    "O cargo do cadastro (aba TURNOVER, coluna CARGO) vale mais que o da chamada. 'Op. Reposição' conta como Repositor; Auditor e outros cargos ficam fora do ranking de repositores.",
    "Requer atualizar o código do Apps Script (nova versão da implantação). A coluna CARGO é criada sozinha na aba TURNOVER."
  ] },
  { v:"2.13.0", data:"2026-11-10", titulo:"Painel TV em janela própria, prévia e comparações justas", itens:[
    "O botão Painel TV agora abre o painel em uma nova janela (o computador continua livre). Com a janela aberta, o botão vira 'Encerrar painel'; a janela também tem o botão 'Encerrar painel'. Se houver 2ª tela, a janela vai para ela.",
    "Administração > Parâmetros Painel TV: botão 'Prévia' mostra como o painel vai ficar com as opções atuais, sem gravar.",
    "Ritmo: compara somente períodos iguais. Semana: seg a hoje contra seg ao mesmo dia da semana anterior. Mês: dia 1 até hoje contra dia 1 até o mesmo dia do mês anterior.",
    "Correção: colaborador que aparecia zerado no painel (por exclusão/filtro da Comissão) agora mostra a produção real (O.S. 58 + missões)."
  ] },
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

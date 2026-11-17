/* =========================================================================
   DOCUMENTAÇÃO DE FILTROS — o que existe em cada página
   Gerada a partir da leitura do código (v2.18.0). Ao criar/alterar um filtro, atualize esta lista
   (ou peça a revisão de front para refazer o levantamento).
   Cada filtro: [rótulo, tipo, componente, observação]
   Tipos: data · lista · busca · alternar (Sim/Não ou opções) · atalho (botões de período) · número · hora · marcar
   Componentes: filter-group (padrão do site) · atalhos (renderAtalhos) · toggle-group · próprio (estilo/CSS à parte) · inline (estilo solto na tela)
   ========================================================================= */
const DOC_FILTROS = {
  geradoEm: "2026-11-17",
  menus: { indicadores:"Indicadores", gestao:"Gestão", lancamentos:"Lançamentos", admin:"Administração" },

  /* padrões que o site já usa (referência para a revisão) */
  padroes: [
    { nome:"Caixa de filtros", desc:"Linha de .filter-group (rótulo em cima, campo embaixo) dentro de um .panel, com .panel-actions à direita para botões." },
    { nome:"Período", desc:"Data Inicial + Data Final (type=date) e, ao lado, os botões de atalho de período (renderAtalhos). O atalho ativo é detectado pelas datas (atalhoAtivoPorDatas)." },
    { nome:"Sim / Não", desc:"Pergunta curta com .toggle-group de dois botões (ex.: Quadro Atual?, Mesma periodicidade?)." },
    { nome:"Lista", desc:"<select> dentro de .filter-group; primeira opção \"Todos\"/\"Todas\" limpa o filtro." },
    { nome:"Busca", desc:"Campo de texto/search com placeholder descrevendo o que pesquisa." },
    { nome:"Identificação de colaborador", desc:"Padrão pedido: sempre Código primeiro, depois Nome (Código - Nome)." }
  ],

  paginas: [
    /* ------------------------------ INDICADORES ------------------------------ */
    { id:"producao", menu:"indicadores", nome:"Produção", filtros:[
      ["Período dia / semana / mês","alternar","toggle-group","prod-mode-toggle (Dia, Semana, Mês)"],
      ["Data Inicial","data","filter-group","prod-data-ini"],
      ["Data Final","data","filter-group","prod-data-fim"],
      ["Funcionário","lista","filter-group","prod-employees — Código - Nome"],
      ["Quadro Atual?","alternar","toggle-group","Sim / Não"],
      ["Comparar semana com","alternar","toggle-group","só no modo Semana (Semana anterior / Mês anterior)"],
      ["Mesma periodicidade?","alternar","toggle-group","só no modo Mês"],
      ["Atalhos de período","atalho","atalhos","Mês Atual, Mês Anterior, Últimos 3 Meses, Ano Atual, Ano Anterior, Tudo"],
      ["Comparar ano × ano","lista","inline","year-cmp-select-1 / 2 — sem rótulo, sem filter-group"],
      ["Mês da produção diária","lista","inline","prod-daily-mes-select — estilo solto na tela"],
      ["Base da projeção","lista","filter-group","proj-base-select"],
      ["Ranking: só repositor","alternar","toggle-group","prod-ranking-repositor-toggle"]
    ]},
    { id:"projecao", menu:"indicadores", nome:"Projeção", filtros:[
      ["Data Inicial","data","filter-group","proj-data-ini"],
      ["Data Final","data","filter-group","proj-data-fim"],
      ["Atalhos de período","atalho","atalhos","Mês Atual, Mês Anterior, Últimos 3 Meses, Ano Atual, Ano Anterior, Tudo"]
    ], obs:"Sem filtro de funcionário e sem Quadro Atual — diferente de Produção." },
    { id:"individual", menu:"indicadores", nome:"Acompanhamento Individual", filtros:[
      ["Funcionário","lista","filter-group","ind-emp-select — Código - Nome"],
      ["Meta Mensal (O.S.)","número","inline","ind-meta — largura fixa no estilo da tela"],
      ["Linha de Corte (O.S./mês)","número","inline","ind-corte — largura fixa no estilo da tela"]
    ], obs:"Sem filtro de período." },
    { id:"avaria", menu:"indicadores", nome:"Avaria XML", filtros:[
      ["Data inicial","data","filter-group","av-dt-ini"],
      ["Data final","data","filter-group","av-dt-fim"],
      ["Atalhos de período","atalho","atalhos","montados na tela a partir das datas dos XMLs (não usam renderAtalhos)"],
      ["Categoria","lista","filter-group","av-cat-sel"],
      ["Busca (NF, motivo, arquivo)","busca","filter-group","av-busca"],
      ["Baixa TF Comprador soma à Avaria?","alternar","toggle-group","av-toggle-tf"],
      ["Mesmo período","alternar","toggle-group","comparativo de períodos"]
    ]},
    { id:"operadores", menu:"indicadores", nome:"Produção Operadores", filtros:[
      ["Atalhos de período","atalho","atalhos","Mês Atual, Mês Anterior, Últimos 3 Meses, Ano Atual, Ano Anterior, Tudo"],
      ["Data Inicial","data","filter-group","op-dt-ini"],
      ["Data Final","data","filter-group","op-dt-fim"],
      ["Operador","lista","filter-group","op-oper-select"],
      ["Mesma periodicidade","alternar","toggle-group","Sim / Não"]
    ]},
    { id:"relacoes", menu:"indicadores", nome:"Relações Rep", filtros:[
      ["Atalhos de período","atalho","atalhos","Mês Atual, Mês Anterior, Últimos 3 Meses, Ano Atual, Ano Anterior, Tudo"],
      ["Data Inicial","data","filter-group","rel-dt-ini"],
      ["Data Final","data","filter-group","rel-dt-fim"],
      ["Busca (funcionário, produto, motivo, rua, depto)","busca","filter-group","rel-busca"],
      ["Apenas Reposição?","alternar","toggle-group","Sim / Não"],
      ["Apenas REP.AVARIA?","alternar","toggle-group","Sim / Não"]
    ]},
    { id:"capacidade", menu:"indicadores", nome:"Capacidade CD", filtros:[
      ["Produto / Código","busca","filter-group","cap-prod-search"],
      ["Data Inicial","data","filter-group","cap-dt-ini"],
      ["Data Final","data","filter-group","cap-dt-fim"],
      ["Atalhos de período","atalho","próprio","Mês Atual, Mês Anterior, Últimos 3 Meses, Ano Atual, Ano Anterior, Tudo — versão própria do capSetAtalho, com o mesmo conjunto"],
      ["Período Sheet Tipo (início / fim)","data","inline","demanda por tipo"],
      ["Intervalo de ruas (início / fim)","número","inline","Rua ini / Rua fim"],
      ["Qtd total de itens","número","inline","simulação"],
      ["Diferença (de / até)","número","inline","filtro da tabela"],
      ["Mostrar Últimas Validações","alternar","padrão","toggle-group"],
      ["Mostrar detalhes","alternar","padrão","toggle-group"]
    ], obs:"Os alternadores Sim/Não já usam o padrão toggle-group; ainda restam inputs de data e selects com estilo próprio." },
    { id:"abastecimento", menu:"indicadores", nome:"Nível Abastecimento", filtros:[
      ["Buscar código ou descrição","busca","inline","abast-busca"],
      ["Saldo baixo: até (caixas)","número","inline","abast-limite"],
      ["Opções Sim / Não de cálculo","alternar","filter-group","toggle-group com dica (title)"],
      ["Faixas de nível (cards clicáveis)","alternar","próprio","filtram a tabela ao clicar"]
    ]},
    { id:"cd3d", menu:"indicadores", nome:"NVL 3D", filtros:[], obs:"Sem filtros. Visualização do CD — avaliar filtro por rua/faixa de nível." },

    /* ------------------------------ GESTÃO ------------------------------ */
    { id:"feedbacks", menu:"gestao", nome:"Feedbacks e Advertências", filtros:[
      ["Data Inicial","data","filter-group","fb-data-ini"],
      ["Data Final","data","filter-group","fb-data-fim"],
      ["Atalhos de período","atalho","atalhos","Mês Atual, Mês Anterior, Últimos 3 Meses, Ano Atual, Ano Anterior, Tudo"],
      ["Apenas Quadro Atual?","alternar","toggle-group","Ranking de Repositores"],
      ["Apenas Repositor?","alternar","toggle-group","Ranking de Repositores"],
      ["Ordenação por coluna","alternar","próprio","clique no cabeçalho da tabela"],
      ["Seleção de funcionários","marcar","inline","checkbox por linha + marcar todos (para gerar PDF)"],
      ["Período dos dados (ao gerar documento)","lista","próprio","fbf-per — janela de geração do feedback"]
    ], obs:"Contém o bloco Insights (cards sem filtro próprio: usa o período da página). Pendência pedida: manter ordenação ao selecionar funcionário." },
    { id:"quadro", menu:"gestao", nome:"Quadro", filtros:[
      ["Data Inicial","data","filter-group","quadro-data-ini"],
      ["Data Final","data","filter-group","quadro-data-fim"],
      ["Atalhos de período","atalho","atalhos","Mês Atual, Mês Anterior, Últimos 3 Meses, Ano Atual, Ano Anterior, Tudo"]
    ]},
    { id:"chamada", menu:"gestao", nome:"Chamada", filtros:[
      ["Data Inicial","data","filter-group","cham-data-ini"],
      ["Data Final","data","filter-group","cham-data-fim"],
      ["Atalhos de período","atalho","atalhos","Mês Atual, Mês Anterior, Últimos 3 Meses, Ano Atual, Ano Anterior, Tudo"]
    ], obs:"Sem filtro de colaborador/status/Quadro Atual." },
    { id:"auditoria", menu:"gestao", nome:"Auditoria", filtros:[
      ["Atalhos de período","atalho","atalhos","Mês Atual, Mês Anterior, Últimos 3 Meses, Ano Atual, Ano Anterior, Tudo"],
      ["Data Inicial","data","filter-group","aud-data-ini"],
      ["Data Final","data","filter-group","aud-data-fim"],
      ["Rua","lista","filter-group","aud-rua"],
      ["Repositor","lista","filter-group","aud-rep — Código - Nome"],
      ["Auditor","lista","filter-group","aud-auditor"],
      ["Quadro Atual?","alternar","toggle-group","aud-quadro-toggle"]
    ]},
    { id:"comissao", menu:"gestao", nome:"Comissão", filtros:[
      ["Data Inicial","data","filter-group","comm-data-ini"],
      ["Data Final","data","filter-group","comm-data-fim"],
      ["Atalhos de período","atalho","atalhos","Mês Atual, Mês Anterior, Últimos 3 Meses, Ano Atual, Ano Anterior, Tudo"],
      ["Quadro Atual?","alternar","toggle-group","comm-quadro-toggle"],
      ["Apenas Repositor?","alternar","toggle-group","comm-repositor-toggle"],
      ["Valer a partir de (parâmetros)","data","próprio","cp-desde (mês)"]
    ]},
    { id:"cronograma", menu:"gestao", nome:"Cronograma", filtros:[], obs:"Só formulário de atividade (nome, hora início/fim, prioridade). Sem filtros de listagem." },
    { id:"turnover", menu:"gestao", nome:"Turnover", filtros:[
      ["Atalhos de período","atalho","atalhos","Mês Atual, Mês Anterior, Últimos 3 Meses, Ano Atual, Ano Anterior, Tudo"],
      ["Data Inicial","data","filter-group","tv-filtro-ini"],
      ["Data Final","data","filter-group","tv-filtro-fim"],
      ["Período de análise","lista","inline","tv-periodo-select"],
      ["Transferências: Data Início / Fim","data","filter-group","tv-transf-ini / tv-transf-fim"]
    ]},
    { id:"ferias", menu:"gestao", nome:"Férias", filtros:[], obs:"Sem filtros no código de análise." },
    { id:"organograma", menu:"gestao", nome:"Organograma", filtros:[
      ["Mostrar outros setores?","alternar","toggle-group","Não / Sim"]
    ]},
    { id:"ruas", menu:"gestao", nome:"Atribuição Ruas", filtros:[
      ["Período dos %","lista","próprio","rs-per"],
      ["Colorir por","lista","próprio","rs-col (Repositor / Qualidade)"],
      ["Buscar repositor (na atribuição)","busca","próprio","rs-busca + \"mostrar também outros cargos\""],
      ["Histórico: Rua","lista","próprio","rs-hrua"],
      ["Histórico: Ver o estado em (data)","data","próprio","rs-hdia"]
    ], obs:"Usa o CSS .rs-* próprio, não o filter-group." },

    /* ------------------------------ LANÇAMENTOS ------------------------------ */
    { id:"lfeedback", menu:"lancamentos", nome:"Lançar Feedback", filtros:[], obs:"Só formulário (Data, Matrícula, Nome, Motivo, Aplicador, Resumo, Avaliações). Nenhum filtro de listagem encontrado — avaliar busca/período para os feedbacks já lançados." },
    { id:"ladvertencia", menu:"lancamentos", nome:"Lançar Advertência", filtros:[
      ["Buscar matrícula, nome ou motivo","busca","inline","ad-l-busca"]
    ]},
    { id:"lsuspensao", menu:"lancamentos", nome:"Lançar Suspensão", filtros:[
      ["Buscar matrícula, nome ou motivo","busca","inline","sp-l-busca"]
    ]},
    { id:"lcoletores", menu:"lancamentos", nome:"Controle de Coletores", filtros:[
      ["Buscar ID, nome, login, usuário","busca","inline","col-q"],
      ["Setor","lista","inline","col-fs (Todos os setores)"],
      ["Status","lista","inline","col-fst (Todos os status)"],
      ["Termo","lista","inline","col-ft (todos / com / sem termo)"],
      ["Inventário","lista","inline","col-fi (todos / vencido)"]
    ]},
    { id:"ldevolucao", menu:"lancamentos", nome:"Devolução de Mercadorias", filtros:[
      ["Código do produto","busca","inline","dv-cod"],
      ["Ordem da rota","lista","inline","dv-ordem"]
    ]},
    { id:"lavaria", menu:"lancamentos", nome:"Lançar Avaria 9712", filtros:[
      ["Buscar número ou tipo","busca","inline","av-busca"],
      ["Tipo (filtro)","lista","inline","av-tf"],
      ["Cód. Produto","busca","inline","avp-cod"],
      ["Data de / Data até","data","inline","avp-ini / avp-fim"]
    ]},
    { id:"lchamada", menu:"lancamentos", nome:"Lançar Chamada", filtros:[
      ["Dia da chamada","data","inline","ch-data"],
      ["Status","lista","inline","lt-status"],
      ["De / Até","data","inline","lt-ini / lt-fim"],
      ["Buscar colaborador","busca","inline","lt-busca"]
    ]},
    { id:"lquadro", menu:"lancamentos", nome:"Lançar Quadro", filtros:[
      ["Buscar","busca","inline","qd-busca"],
      ["Mostrar inativos","marcar","inline","qd-inat"]
    ]},
    { id:"lmissoes", menu:"lancamentos", nome:"Lançar Missões", filtros:[], obs:"Só formulário (Data, horários, código, tipo)." },
    { id:"lcapacidade", menu:"lancamentos", nome:"Lançar Capacidade", filtros:[], obs:"Só formulário (Data, Tipo)." },
    { id:"lferias", menu:"lancamentos", nome:"Lançar Férias", filtros:[
      ["Mostrar todas","marcar","inline","fe-todas"]
    ]},
    { id:"lcertificado", menu:"lancamentos", nome:"Certificados", filtros:[
      ["Pessoa","busca","próprio","ct-pessoa"],
      ["Grupo","lista","próprio","ct-grupo"],
      ["Modelo","lista","próprio","ct-modelo"]
    ]},

    /* ------------------------------ ADMINISTRAÇÃO ------------------------------ */
    { id:"bases", menu:"admin", nome:"Bases", filtros:[
      ["Modo de gravação por base","lista","próprio","acumular / ... (adm-select)"],
      ["Forçar leitura","marcar","próprio","bases-forcar"],
      ["Histórico: período","lista","próprio","hs-per (Hoje, Últimos 7 dias...)"],
      ["Histórico: só falhas","marcar","próprio","hs-falhas"]
    ]},
    { id:"acessos", menu:"admin", nome:"Acessos", filtros:[
      ["Buscar matrícula ou nome","busca","próprio","ac-busca"],
      ["Status","lista","próprio","ac-status (no cadastro)"]
    ]},
    { id:"links", menu:"admin", nome:"Links de acesso", filtros:[], obs:"Sem filtros." },
    { id:"versoes", menu:"admin", nome:"Atualizações e Documentação", filtros:[
      ["Notas / Documentação","alternar","próprio","botões verticais no topo"],
      ["Documentação: buscar / filtrar páginas","busca","próprio","dc-busca, dc-menu, dc-decisao"]
    ]},
    { id:"alertas", menu:"admin", nome:"Alertas", filtros:[
      ["Horário \"a partir de\"","hora","próprio","por alerta"],
      ["Destinatários","marcar","próprio","todos / admin / pessoas específicas"],
      ["Repetição","lista","próprio","cf-tipo (alerta personalizado)"]
    ]},
    { id:"parametros", menu:"admin", nome:"Parâmetros", filtros:[
      ["Abas: NC e Feedbacks / Auditoria / Comissão / Painel TV","alternar","próprio","pm-tab"],
      ["Regras gerais da escalada (4 números)","número","filter-group","pm-g-*"],
      ["Regras por motivo (números e alertas)","marcar","próprio","tabela pm-tbl"],
      ["Pesos e ruas fora da auditoria","número","filter-group","pm-p-*, pm-fora"],
      ["Transmitir em tela cheia na 2ª tela","marcar","próprio","tvp-transmitir (desligado por padrão)"],
      ["Mostrar os funcionários de","lista","próprio","tvp-destaque (Mês passado / ...)"],
      ["Critério do ranking","lista","próprio","tvp-criterio"],
      ["Opções de exibição","marcar","próprio","checkboxes tvp-*"]
    ], obs:"Substitui a antiga página Parâmetros Painel TV; o bloco de comissão saiu da tela Comissão." }
  ],

  /* inconsistências já detectadas na leitura do código */
  achados: [
    { sev:"baixa", t:"Atalhos de período padronizados (v2.18.2)", d:"Todas as telas com período usam os mesmos 6 atalhos. Exceção: Avaria XML, que monta os atalhos a partir das datas dos arquivos carregados." },
    { sev:"média", t:"Colaborador sem Código na frente", d:"Listas Funcionário (Produção, Individual) e Repositor (Auditoria), Ranking de Feedbacks, Insights e tabelas de Auditoria já seguem Código - Nome (v2.18.1). NC, Retornos e Atribuição Ruas também (v2.18.2). Tabelas de Lançamentos e Acessos usam Matrícula antes de Nome; PDFs de feedback já seguem o padrão; Painel TV mantém só o nome curto, por ser uma tela de exibição." },
    { sev:"média", t:"Sim / Não montado de formas diferentes", d:"toggle-group é o padrão e agora vale também em Capacidade (Relações já havia sido convertida). Restam inputs/selects com estilo solto em Capacidade." },
    { sev:"média", t:"Campos fora do filter-group", d:"Selects de comparação ano × ano e mês da produção diária (Produção), Meta/Linha de Corte (Individual), Período de análise (Turnover), buscas das telas de Lançamento e inputs da Capacidade usam estilo inline." },
    { sev:"média", t:"Filtro de Quadro Atual só em parte das telas", d:"Existe em Produção, Auditoria e Comissão; não existe em Projeção, Chamada, Quadro, Operadores e Relações." },
    { sev:"baixa", t:"Telas de análise sem nenhum filtro", d:"NVL 3D, Férias e Cronograma." }
  ]
};

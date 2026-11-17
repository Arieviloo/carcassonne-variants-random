// Dados das variações oficiais de Carcassonne
// Fonte: carcassonne_variantes.pdf (compilação da Hans im Glück, tradução Romir G. E. Paulino)

const VARIANTS = [
  {
    id: "monasterios",
    name: "A Luta pelos Monastérios Finalizados",
    author: "Frank Rudloff",
    rules: [
      "Cada jogador tem, quando é sua vez, duas cartas para escolha na mão.",
      "Cada monastério não acabado conta, no final do jogo, pontos para o oponente. Para jogos com mais de um oponente, o jogador mais próximo, em sentido horário, recebe os pontos, de modo que os interesses dos jogadores serão bastante diferentes entre si."
    ],
    note: "Nesta variação existe a possibilidade de alterar a vantagem do monastério de um oponente em uma vantagem para você quando você não deixa seu oponente completar os monastérios."
  },
  {
    id: "mudanca-vida",
    name: "Mudança de Vida",
    author: "Tobias Stapelfeldt",
    rules: [
      "No lugar de colocar um seguidor, o jogador pode realizar uma das seguintes ações:",
      "Sedentarismo: um ladrão próprio é movido para um dos campos desocupados ao lado da estrada onde o mesmo se encontrava.",
      "Apropriação: caso haja um fazendeiro em um campo que faça fronteira com uma cidade incompleta, então ele pode ser levado para esta cidade.",
      "Revolta Religiosa: dois cavaleiros próprios devem ser retirados de seus castelos e colocados junto a um monastério de um oponente qualquer. O oponente deve retirar seu monge e trazê-lo novamente para o estoque.",
      "Cavaleiro Ladrão: um cavaleiro próprio é movido para uma estrada que se encontre em uma carta na qual haja um pedaço da cidade em que o mesmo se encontrava até o momento."
    ]
  },
  {
    id: "galope",
    name: "Galope",
    author: "Tobias Stapelfeldt",
    rules: [
      "Valem as mesmas regras de “Mudança de Vida”.",
      "Após cada ação ou colocação de seguidor, o jogador pode dar um de seus pontos de vitória para, em troca, realizar uma nova ação ou colocar outro seguidor."
    ]
  },
  {
    id: "montanhas",
    name: "Montanhas",
    author: "Tobias Stapelfeldt",
    rules: [
      "No lugar de posicionar uma carta de terreno da maneira comum, o jogador pode colocá-la com o verso para cima, fazendo fronteira com uma placa de terreno que possua somente campo na fronteira, valendo esta como uma montanha.",
      "Os cantos de uma montanha devem sempre fazer fronteira com campos sem estradas indo em direção à montanha.",
      "Seguidores podem ser posicionados como mineiros, permanecendo até o fim do jogo na montanha em que os mesmos foram colocados.",
      "Caso haja escudos (ferreiros) a uma distância de 1 a 2 campos da mina, então o mineiro: (1) será contado como um cavaleiro quando a cidade for fechada e (2) será contado como fazendeiro extra na contagem final para a cidade em questão."
    ]
  },
  {
    id: "reforma",
    name: "Reforma",
    author: "Tobias Stapelfeldt",
    rules: [
      "Após o jogador ter posicionado sua placa de terreno, o mesmo pode, no lugar do fluxo normal de jogo, fazer o seguinte:",
      "Ele posiciona seu contador de pontos uma quantidade de pontos para trás.",
      "Para cada ponto retirado, o jogador pode tomar uma placa de terreno desocupada da mesa e a reposicionar imediatamente em um novo lugar. (A placa pode, inicialmente, estar conectada por, no máximo, 2 lados e o tabuleiro não deve ser dividido em dois pela retirada das peças.)",
      "Sobre a placa que acabou de ser recolocada, o jogador pode posicionar um seguidor, conforme as regras normais.",
      "A contagem de pontos acontece como usual."
    ]
  },
  {
    id: "um-tem-a-palavra",
    name: "Um tem a Palavra",
    author: "Robert Vötter",
    rules: [
      "Para esta variação é necessária uma figura a mais, para indicar qual jogador tem a vez.",
      "Este jogador pode comprar tantas placas de terreno quanto houverem jogadores. Ele olha as placas e as distribui, de acordo com sua vontade, uma para cada oponente. Naturalmente ele mantém uma placa para si.",
      "Variante a) As placas são distribuídas fechadas.",
      "Variante b) As placas são distribuídas abertas. Com isto, cada um pode ver as cartas que os oponentes têm.",
      "Os jogadores posicionam, em ordem, cada um sua placa. O jogador inicial, naturalmente, começa com a colocação. Posteriormente a figura de marcação do jogador inicial é passada adiante e o jogo continua com o mesmo princípio."
    ],
    note: "Dica: é muito comum que, nesta variação, o jogador dê uma placa que ele considere muito ruim, mas que o outro jogador utilize de tal maneira que o jogador inicial fique vermelho de raiva."
  },
  {
    id: "mais-cartas",
    name: "Mais Cartas na Mão",
    author: "Anônimo",
    rules: [
      "Nesta variação mais “tática”, os jogadores mantêm, sempre, 2 ou 3 placas de terreno na mão, entre as quais ele pode escolher qual utilizar.",
      "Desta maneira é possível se planejar mais “concretamente” o futuro.",
      "Após a colocação de uma placa de terreno, uma nova deve ser comprada pelo jogador, de modo a manter a quantidade de placas na mão sempre igual."
    ]
  },
  {
    id: "planejamento-coletivo",
    name: "Planejamento Coletivo do Terreno",
    author: "Bernd Eisenstein",
    rules: [
      "Três placas de terreno são deixadas abertas para todos os jogadores, os quais podem escolher se querem usar uma das 3 placas abertas ou se querem comprar uma placa fechada.",
      "Após cada rodada a quantidade de placas abertas deve, novamente, ser completada para que hajam sempre 3 placas abertas."
    ]
  },
  {
    id: "monasterio-todos",
    name: "Monastério para Todos",
    author: "Bernd Eisenstein",
    rules: [
      "Todos os jogadores recebem, antes do início do jogo, um monastério, o qual deve ser mantido aberto na frente do respectivo dono.",
      "Este monastério pode ser trazido para o tabuleiro a qualquer momento do jogo, no lugar de comprar uma outra placa."
    ]
  },
  {
    id: "arquiteto",
    name: "O Arquiteto",
    author: "Tobias Stapelfeldt",
    rules: [
      "Todas as placas de terreno são distribuídas inicialmente e igualmente entre todos os jogadores, sendo que cada um pode olhar suas placas quantas vezes quiser.",
      "Nesta variação bastante estratégica pode haver sentido em uma distribuição separada dos monastérios."
    ]
  },
  {
    id: "impontualidade",
    name: "A Impontualidade dos Seguidores",
    author: "Bernd Eisenstein",
    rules: [
      "Não se pode posicionar seguidores na última placa de terreno trazida para o jogo, mas sim em qualquer outra placa de terreno já posicionada anteriormente (naturalmente em concordância com as regras usuais)."
    ]
  },
  {
    id: "carencia",
    name: "Carência de Seguidores",
    author: "Holger Peine",
    rules: [
      "O número de seguidores é dependente da quantidade de jogadores: 2 jogadores → 7 figuras; 3 jogadores → 6 figuras; 4 jogadores → 5 figuras.",
      "A grande diferença desta regra é que a cada placa posicionada os jogadores devem pensar se realmente vale a pena “usar” uma de suas figuras."
    ]
  },
  {
    id: "prisioneiro",
    name: "Prisioneiro",
    author: "Anônimo",
    rules: [
      "Caso um jogador, através de uma “união”, coloque uma figura própria em um terreno já ocupado, então este jogador pode escolher aprisionar a outra figura presente no terreno.",
      "Ambas as figuras são retiradas para a mesa do jogador ativo. Este, por sua vez, também precisa abrir mão de sua figura, a qual deverá ficar “guardando” o prisioneiro.",
      "O “guardião” pode voltar a ser colocado novamente no jogo, mas neste caso o prisioneiro volta para seu dono."
    ]
  },
  {
    id: "todos-devem",
    name: "...pra falar a verdade, todos devem!",
    author: "Bernd Eisenstein",
    rules: [
      "Como existem 71 placas de terreno, nem sempre todos têm a mesma participação nas rodadas. Por isto, dependendo do número de jogadores, uma ou mais placas devem ser deixadas (escondidas) fora do jogo:",
      "Para 2 jogadores: 1 placa · Para 3 jogadores: 2 placas · Para 4 jogadores: 3 placas · Para 5 jogadores: 1 placa."
    ]
  }
];

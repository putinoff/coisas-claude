/* =========================================================
   TEXTOS DO SITE — edite aqui à vontade
   ========================================================= */

export const CARTA = {
  saudacao: 'Mariana, meu amor,',
  paragrafos: [
    'Se a vida fosse uma estrada, eu queria percorrer cada quilômetro dela do seu lado — com a janela aberta, a nossa música tocando e a sua mão segurando a minha.',
    'Você é o meu lugar favorito, o meu sorriso sem motivo e a parte mais bonita de todos os meus dias. Com você, até trânsito parado vira passeio, e qualquer tarde comum ganha um tom de rosa, igualzinho ao laço da Hello Kitty.',
    'Obrigado por ser tão carinhosa, tão linda e tão você. Prometo ser seu co-piloto, seu porto seguro e o seu fã número um, pra sempre.',
    'Te amo mais do que ontem e menos do que amanhã.',
  ],
  assinatura: 'Lucas',
};

/* Cada recado vem com uma reação da Kitty: pisca, bochecha, pulo ou laco */
export const RECADOS_KITTY = [
  { t: 'Mariana, você é a pessoa mais fofa do universo.', r: 'bochecha' },
  { t: 'Sabia que tem alguém que pensa em você o dia inteiro?', r: 'pisca' },
  { t: 'Seu sorriso brilha mais que farol de BMW à noite.', r: 'pulo' },
  { t: 'Hoje é um ótimo dia pra ganhar um beijinho.', r: 'bochecha' },
  { t: 'Você e ele: a combinação mais bonita que eu já vi.', r: 'laco' },
  { t: 'Lembrete oficial da Kitty: você é linda.', r: 'pisca' },
  { t: 'A Kitty contou um segredo: tem alguém aqui completamente apaixonado por você.', r: 'bochecha' },
  { t: 'Se cada sorriso seu virasse estrela, o céu ia ficar pequeno.', r: 'pulo' },
  { t: 'A Kitty aprova esse casal. Oficialmente, com laço e tudo.', r: 'laco' },
  { t: 'Recado importante: você merece todos os carinhos do mundo hoje.', r: 'bochecha' },
  { t: 'Ele disse que você é o lugar favorito dele. A Kitty ouviu.', r: 'pisca' },
  { t: 'Toda vez que você sorri, nasce um laço rosa em algum lugar do mundo.', r: 'laco' },
  { t: 'Bebe uma água, linda. A Kitty se preocupa com você.', r: 'pulo' },
  { t: 'Nenhum laço do mundo é tão bonito quanto o de vocês dois.', r: 'laco' },
];
export const RECADO_FINAL_KITTY = 'Você já leu todos os recados — mas a Kitty guarda mais um: ele te ama, e muito.';

export const MOTIVOS = [
  { tit: 'Seu sorriso', t: 'Ele liga o meu dia mais rápido que a partida de uma BMW.', icone: 'sorriso' },
  { tit: 'Seu jeitinho', t: 'Essa fofura de Hello Kitty que você tem sem nem tentar.', icone: 'laco' },
  { tit: 'Única', t: 'Você é tipo uma BMW: linda, potente e sem igual no mundo.', icone: 'carro', bmw: true },
  { tit: 'Seu abraço', t: 'O meu lugar favorito para estacionar.', icone: 'abraco' },
  { tit: 'Nossas risadas', t: 'Aquelas sem motivo nenhum, que viram as melhores lembranças.', icone: 'brilho' },
  { tit: 'Todo dia', t: 'Porque é em você que eu penso antes de dormir — e ao acordar.', icone: 'lua' },
];

/* Data em que vocês começaram (ano-mês-diaThora:minuto) — troque pela de vocês */
export const DATA_INICIO = '2025-08-12T00:00:00';

/* Uma frase para cada estrela da constelação (a quantidade define o desenho) */
export const DESEJOS_ESTRELAS = [
  'Que a gente viaje o mundo inteiro, de janela aberta.',
  'Que nunca falte motivo pra você sorrir.',
  'Que todo domingo tenha preguiça e abraço.',
  'Que a gente ria até a barriga doer, sempre.',
  'Que eu te faça sentir amada todos os dias.',
  'Que a nossa playlist nunca acabe.',
  'Que cada aniversário seu seja mais bonito que o anterior.',
  'Que a gente envelheça junto, de mãos dadas.',
  'Que cada viagem vire uma história pra contar.',
  'Que você nunca duvide do quanto é especial.',
  'Que a gente dance na cozinha, mesmo sem música.',
  'Que todos os seus sonhos tenham a minha torcida.',
];
export const MENSAGEM_CONSTELACAO = 'Você completou o céu: ele desenha um coração. O meu, que é todinho seu.';

/* Raspadinhas — tom: noir, rosa ou marfim */
export const VALES = [
  { emoji: '🍝', tit: 'Um jantar romântico', obs: 'você escolhe o lugar, eu pago a conta', tom: 'noir' },
  { emoji: '🚗', tit: 'Um passeio sem destino', obs: 'janela aberta e sua playlist no máximo', tom: 'rosa' },
  { emoji: '🎀', tit: 'Um dia Hello Kitty', obs: 'filme, doce e tudo do jeitinho que você quiser', tom: 'marfim' },
  { emoji: '💆‍♀️', tit: 'Uma massagem', obs: 'sem hora pra acabar, válido pra sempre', tom: 'rosa' },
  { emoji: '🍫', tit: 'Chocolate ilimitado', obs: 'resgate a qualquer momento de TPM ou não', tom: 'marfim' },
  { emoji: '💋', tit: '1.000 beijos', obs: 'parcelados em quantas vezes você quiser', tom: 'noir' },
];

/* Minigame da corrida — abre quando ela aceita ser a co-piloto */
export const CORRIDA = {
  convite: 'Agora que você é minha co-piloto, a Kitty assumiu o volante. Desvie dos obstáculos, pegue os corações e chegue até o meu coração.',
  // placas que aparecem pelo caminho, em ordem
  placas: [
    'Rua do primeiro olhar',
    'Avenida das risadas',
    'Ponte da saudade',
    'Estrada dos abraços',
    'Curva do "eu te amo"',
    'Chegando no meu coração…',
  ],
  // frases quando a Kitty bate em alguma coisa
  sustos: ['Ops! Nada nos para.', 'Foi só um susto!', 'A Kitty segurou firme!', 'Segue o amor!', 'Nem senti!'],
  chegada: 'Você chegou ao meu coração.',
  chegadaSub: 'E pode estacionar aqui pra sempre — ele é todinho seu.',
};

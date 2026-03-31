export const challenges = [
  {
    id: 'challenge-1',
    name: 'O Corredor das Vassouras',
    description: 'Dizem que a Bruxa Morgava enfeitiça vassouras para não ter que limpar o próprio chão. É algo bem simples e útil mas isso me parece um tanto preguiçoso também... Enfim, travesse o corredor e não deixe nenhuma vassoura te varrer!'
  },
  {
    id: 'challenge-2',
    name: 'O Jardim dos Ingredientes',
    description: 'O Jardim de uma Bruxa é um lugar curioso, nele podemos encontrar uma variedade de... coisas. Você precisa coletar os ingredientes para cada poção, mas tome cuidado na ordem em que coleta.'
  }
];

export const RECIPES_LIST = [
  {
    id: 0,
    items: ['dente_de_lobo', 'noz_da_floresta']
  },
  {
    id: 1,
    items: ['cera_vela_negra', 'olho_de_sapo', 'folha_de_salvia_roxa', 'pedra_de_sal_negro']
  }
]

const SPRITES_CHARACTERS = {
  'Morgava': '/assets/sprites/characters/morgava.png',
  'Professor': '/assets/sprites/characters/professor.png',
  'Vassoura': '/assets/sprites/characters/vassoura.png'
}

export const DIALOG_CHALLENGE_GARDEN_RECIPE_01 = [
  {
    id: 0,
    character: 'Morgava',
    portrait: SPRITES_CHARACTERS.Morgava,
    text: "Aqui está o jardim. Os ingredientes crescem onde querem, não espere que fiquem te esperando quietinhos. Vou te falar a receita uma vez. Apenas uma. Grave bem."
  },
  {
    id: 1,
    character: 'Morgava',
    portrait: SPRITES_CHARACTERS.Morgava,
    text: "Chá do Sono Tranquilo: Um chá básico. Qualquer bruxa de terceiro ano deveria saber de cabeça."
  },
  {
    id: 2,
    character: 'Morgava',
    portrait: SPRITES_CHARACTERS.Morgava,
    text: "Os ingredientes são: Dente de Lobo e Noz da Floresta."
  },
  {
    id: 3,
    character: 'Morgava',
    portrait: SPRITES_CHARACTERS.Morgava,
    text: "Pode começar quando se sentir pronta. Ou quando eu perder a paciência. O que vier primeiro."
  },
]

export const DIALOG_CHALLENGE_GARDEN_RECIPE_02 = [
  {
    id: 0,
    character: 'Morgava',
    portrait: SPRITES_CHARACTERS.Morgava,
    text: "A próxima receita é Unguento da Visão Noturna. Preste atenção nos ingredientes: Cera de Vela Negra, Olho de Sapo, Folha de Sálvia Roxa e Pedra de Sal Negro."
  },
  {
    id: 1,
    character: 'Morgava',
    portrait: SPRITES_CHARACTERS.Morgava,
    text: "Não torça o nariz para o olho. Ele é o coração da mistura."
  }
]

export const DIALOG_CHALLENGE_BROOM = [
  {
    id: 0,
    character: 'Morgava',
    portrait: SPRITES_CHARACTERS.Morgava,
    text: "O Corredor das Vassouras, elas nunca param de limpar, por isso esse lugar é um brinco!"
  },
  {
    id: 1,
    character: 'Morgava',
    portrait: SPRITES_CHARACTERS.Morgava,
    text: "Chegue até a porta do outro lado e não seja varrida no caminho."
  }
]

export const DIALOG_CHALLENGE_BROOM_RESTART = [
  {
    id: 0,
    character: 'Morgava',
    portrait: SPRITES_CHARACTERS.Morgava,
    text: "Se não prestar atenção você nunca se tornará uma bruxa!"
  },
]
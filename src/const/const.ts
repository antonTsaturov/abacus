export const BALL_COUNT = 10
export const BALL_SIZES = {
    desktop: 32 ,
    tablet: 28,
    mobile: 20
}
export const MIN_SPACING = 5
export const TRACK_WIDTH = 1200
export const DIGIT_VALUES = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000]
export const LEVEL = [
    {id: 0, name: 'Beginer', rows: 3},
    {id: 1, name: 'Intermediate', rows: 4},
    {id: 2, name: 'Advanced', rows: 5},
    {id: 3, name: 'Expert', rows: 6},
    {id: 4, name: 'Master', rows: 7},
    {id: 5, name: 'Grand Master', rows: 8},
    {id: 6, name: 'Legendary', rows: 9},
]

export const MODE = ['Common', 'Ascent']


// Пастельные тона
const CALM = [
    'linear-gradient(135deg, #6A8CAF 0%, #4A6C8F 100%)',  // Серо-голубой → темнее
    'linear-gradient(135deg, #A3D9B1 0%, #83B991 100%)',  // Мятный → темнее
    'linear-gradient(135deg, #FFC8A2 0%, #DFA882 100%)',  // Персиковый → темнее
    'linear-gradient(135deg, #D4A5A5 0%, #B48585 100%)',  // Розовый → темнее
    'linear-gradient(135deg, #B8B8FF 0%, #9898DF 100%)',  // Лавандовый → темнее
    'linear-gradient(135deg, #FFD6A5 0%, #DFB685 100%)',  // Абрикосовый → темнее
    'linear-gradient(135deg, #9AD4D6 0%, #7AB4B6 100%)',  // Мятно-голубой → темнее
    'linear-gradient(135deg, #E2C2C6 0%, #C2A2A6 100%)',  // Розовый чай → темнее
    'linear-gradient(135deg, #FFB347 0%, #DF9337 100%)',  // Новый: Апельсиновый → темнее
  ];
//  Яркие тона
const BRIGHT = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',    // Royal
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',    // Pink Sunrise
    'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',    // Aqua Marine
    'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',    // Purple Dreams
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',    // Sunset
    'linear-gradient(135deg, #42e695 0%, #3bb2b8 100%)',    // Emerald Water
    'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',    // Green Beach
    'linear-gradient(135deg, #ff7eb3 0%, #ff758c 100%)',    // Pink Flamingo
    'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',    // Deep Purple
];

const CLASSIC = [
    'linear-gradient(135deg, rgb(184, 168, 134) 0%, #895907 100%)',  // Коричневый → темнее
]

export const CLASSIC_BLACK = [
    'linear-gradient(135deg, rgb(97, 97, 97) 0%, rgb(69, 69, 69) 100%)'
]

export const COLORS = [
    {name: 'calm', value: CALM},
    {name: 'bright', value: BRIGHT},
    {name: 'classic', value: CLASSIC}
]
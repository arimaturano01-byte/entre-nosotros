import {
  AppSettings,
  CoupleProfile,
  DailyQuestion,
  DailyThought,
  LetterItem,
  MemoryItem,
  MilestoneItem,
  PlanItem,
} from '../types';

export const IMAGES = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1UFr9tsDfEa6Dz1y0JIlmBU2jiDG7WprJLIQpwV8Z553N5D8cMdCbbHVAFSddgBSqsvOAerOb3OzoR94HE3iX175_-fHWqnoivT81uTVNj4NJ4vfsQLsXL9p4DARMHh2WehwJxaH2D6e2OIPWWY5_4IS8hOpTnz3vIzdfbQ937pJCygbb2jX98QejM54jY4STeRRS4_urFzLpXGrAC8Lc6kQS-UUIf-rkSWvUeZdho2vvGJsolB4Uj53w',
  sofiaAvatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCfjOWOCYfCZYeZTgUIYpk10N42RtJj8OX2rE9OevLVjFGAOepNB7SA1BTOPPdxGFrlSFAF-m6iX6Uz18cbpGjiWjQ-SXuxLJ7Zqd5SkEyJOQFGst6JRT1q3whwtfY9f3iyxSBGwr_j75AndDXtEcO2VkF7fno1eyYvo89NS1jWXUCcAqcG1teu2QcBJJVDQUI3ok_EHRfcde6WVNODUmZDmmG2e9nkpa4ET422ZMDweWCcSIrhMyE',
  mateoAvatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCOCA7axtDG1Im3_LVH8quA-bC6cIWYsaf7IctECfybztnnuFVs7jwNHAdI8OqaiEaqQBMntz-PgaNemR1bwz82N2No1ZyIzVCoQcNad2XrVU8zRO4r2Hxg7Mj2uM_GUFCNR7pq7paD8RNOBB65jUxWQ0Gaq7tY7VV0NHijYWQ4krFMOiAgAdnfUrgD5YgP6tooH-kOkkdy5cJjzVeHFb1RuBsnCA3vRIEQwtknjkFzsc2CISE5WsM',
  heroMirador:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD16BbLeNaqnn-bzRj20OC_TcLoUroHmCj_tWPCefGtzO64ThqdfJDCYGGDH_72o7HkU8MVNFZBQQvCM3EC8mCvK_5kIurVx8oHfmfYevZTT1v9cDljHJo6MsKlzxXZZV_WDYYL6NnCfmnndlm-p2V-vLBMTVjvqzU985yJOq9JT45mfcGWvGKwTRLzDWgh7bm9GQCqTe6B9AYyVJv8gZ-4dYmJS0Oy4zxLs9cfYhz9efpkyCuFxzY',
  welcomePolaroid:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCjT9G077DVUXnpJcG6_qEf1AUh-w0GsQ2T75J6g_1VD33LLS5-ndv5uo1ucBG42ObVmKbmBK1_yCCPO_J30N_SkKL3upgwvHlNznTqW-yka1IE6EsvWzTeWaUZ7Ji8khQtCcUlX3DSL4_FTfXxEOHT4umWmRi99LSdhzDtYh9SxRWz3SjLFJSr6HcjOa1n3hxIM4yaSlwJM8FHL_DjCsF9frigv50wdS3UzbJ3tK-aupAzoOLnqng',
  barilocheRoad:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ8fXeFLdRjdeY_MnXER2jkEc9UjKjy1fV4NvRLM3eWHuxfjRaZZYAnzFqvUILCk0jRUuNuTTeWm_qy49mdMXPhQKOp5rhf050rSkCWV9795d5rgHj7gB0KXjbG1BCZNHH4DqhHM-G55B3Iv8JT3CIzqXNDiqbMnzPmG0NS3XurDNKbJdr1ghy78lYweVVVvQgignM5eoIHG3sp920FnQd_-HrNJmgGyNNY_zIU31LcwA4GUIrWR0',
  coffeeSunday:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDcV6hC06lzhy3fsphLqUtUX-YFxpre3BcnwdsOWgR4AfVx6da-SYL_wSDUUWdFjpN8zS5kNq6wM7O8BIzcfJJOJz_1u2W1UCfW0SOTs4NJ6R9MNPljGfG7gap4x2Ys4dAGZPx-DBchptywO-OcZj8Y5G8CbC6nfc2w594TCqJbOaIGGzWhr1Lf3OudmKxEeYGLBJuaArdIcyZOq6atvUCzxV9qJF47_iVGh8KjsPC4WfRmCD8ymwg',
  pizzaDisaster:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCxuk4gbPWgIBRq-rfL4szd74Gmwq37w61IdyRnwdjubu-n4T6Wou6C5Gqz5K4Z0BEtZyZWEPpNLO0oxAAtwrer_aBkd39m1UVpQk38JnfQ0HQv_WJseojhvHUOLTI6qBhCTKIOl8ux89-cJgCXllPC5pF4AGWKtQSwF_24XdvwadbWBnD-NrBcvMGtylItS5M80uO2TktPqKHmfRaYk24VXdKmCMvFVtX7ktNMRfL1c6BvNqJf4nc',
  coastTrain:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCMaPeBoLKmfY_IpioJfYsOy2tPJCrF9_6jjP23xBITbsQVYck3lLJyBZXySH8_Xx7mMDl5AezzmkeXJ62b9HrCw20HAHIcXlcf58G6Dw8ZsyW_Cnh8Ybr4L97jCulS6vK0eGysVG_bCgBnEwzh8UkNzHZhjO_m0S3pgkN22qYrS2eeF4_bj6imILOKHnmAVQ7IPOdi-FghnzKwguIEBIdaX_pEjnkmHc5msBs5MHPkamaIdfMVC_s',
  cafeConfession:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCgALXr6Om3UkTVcVPeZjKLag3bBE6cLqJXArHmiA98GtIrdIvbHZIODGUAjfHE48uFD7uqCtKU71H0bCGvqOO-6_o_SoMNKRoW5RRl12I2ZLT2nfJFflZqfHOiHkAOdv9GStXcEdtv1ku89LUB8wPCIk3kRZiyjCTH62uLXb2MrUCgo_LV1iq_emHEn1IgLNQGtU51oAMZr3LAPDhxTsvVpN832WRcSQMsuRYE5v6k2xGvLcznQ7M',
  rainUmbrella:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCTyn3LQJ_qu8kS1G-odP0FZK6rtZAxI58PYevEDKoes5DsT5H_K9L-S9JloRhGkO0FpTlSS0e0nrfx1cRaZbsFdpGh9P8NMoPVyi09iRlSfvoAqQatK98NlQwYXP9k5v22mYDr-A78vuw66REVO0SpBrLIgxOrJGPGiJ_57gf6dIOpmhAvHpeAumEGH5nct7YEVZZqIEmwjVgsz85lHTclfS2wVwhJdke_DCgUTMMYq8nwt7ABbkM',
  chocolateCake:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAo0XDlsxhxFov2rvH3OJdNYKV7ZDjrdG_a1PrK2KhljCPNPGZmC9PYmqme3zQhPklivF1J3UFvcoX7dyl8JN6k1XxxPCAbFsSNwmrEnTpKf75UFjfoRH5aSQ9YCnKVYI8K8y-kJ0ntwxIPzbKHMq_HdYTLua8xn7JD7_XHp5gvufu3ql-lY-PuB2hcgpy1LIFI5HE1FHqE_zxgarUxzcxsSKlHvO3Np3v-eNSO5W4uz9do2Q6JO6M',
  sunsetView:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBSAvTdwm9nw7i7bAZBKXALXFk7mioTGOnoh_hM81aoEz04BcTgXPlOZH6OKfPuw_T1UTJh_RN44ymiDDHMlJ37Gf-OwJO08QCCCFEZ73ra7zPoSWyoyokQGFf_uvaLC1hsCVoR0LuBArqyzydkKMEp2W-SVnR3p4NRXtVJu3TV_EIdvn4NjTGOOBqBwPRdaTP8kLmDqWyPX4AyOHevbyluGut3BrPozE2trcuWqFIkJ2yPmMlP6TM',
  planPicnic:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBDojsftVQcd7j0acPteyB72wekrszLVeyZhowrHRKPGpyHqsrrLnH5SfHesOhy9JpMtL9g_T2SyPWDGGzr_79_Atlh7k-Ta2eOCi4NeQ5fHTM5k34A3oLL43OvmsI8h5jr0RUqWldvCzn4Xhp1J8jRlTj5zXtKHPcnm-3IjvObqqYMJ7OmIQ5xGRElyVGy3twNYrHNdn-IXgu0gc-P8tcKtqEyOhwA6u3HVOJYuFoP-hRHcnpPuzc',
  planPasta:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBmdpyOKHwsBxGrRuJDa6V2tdulIyhZY6TDbwAmz-bvOCDypyOsyJsO1hkB2sU8yAXNiYDu4quO_dMQd69imzbVCL6T-Uhu2OliCzRkORD16luYYAGWqgprgWfEYbqdB1_JP6ZWXaVOPAaKm9fvwZed1xU-7cN1blysM6g1l7fC_w86vofhPVBNpmSxtHbCMR_hTJAEdyK7CESZKJaMb-cpoHYdBdGKcBELEJyVwWo8qXbMXdZIVpc',
  planCabin:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDezozqDf6EHbkV12bar5PLSzSxcZSIbDZ5K90fccM2th1lKoj7Eb-tckwLe-qeYw0ie8W0tmIJq8mQgY76ve4GiPovFzLRb7H7YSEJXseRNC0PcpgST_MLrJcATtcrqn2r9lIOMjnCsvyb9clSUmifIQspyQifEta5SHjqGx4d0phymAes__ViYLmaOCgsEjsiJpyZYXTbyMlj62wAPwXmrnSbMheHKkgPM4Ea9Xd5V20uxYg7nIw',
  doneHotChoco:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDXYvW-FTbkJvjnwQkgbv05Vb_VLZTeiJOfUcHhy3uNPPK1lidLgnB3bwyDlIDxygCWYPtcT2UhlQyu1Dzqk6Y2KjELpRk9vfp41TITFFIefCNlN9bMT146dmKVJApdH8gZEIi3-jekMDVgw2LsnYFsPqfKupRX2cyXslLQ_Usy0v4tSiQPizmjifTATY1d6_3QsTnVDsOUD-9uvRCu8ZXSXpfSnbWX_G0Fyds2JMbC97tFzx04Q3A',
  donePottery:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBiN4Cb8vbV7BwjZYodLjsX_J1BdeQ-MTEujtAVA8fHnLL7_pEXDypFepVCO83If0uUtxjnZBtCa1Gnl9BnDa7NKjFBUvvXmk_A-VWclhxRIdddNSWlOM5uDH2xrf2bOLYubvt-iiYOgGlW-GtHutB7DIicWjCLGkAyYkJZtxuKRskmvHlxZKd21r4bXNP2YEeeEVy61SO-wJd9BZRjKrQoMy6y66DlBm5UKOGAOZXqVzsZMt-Bh_I',
};

export const INITIAL_COUPLE: CoupleProfile = {
  partner1: 'Sofía',
  partner2: 'Mateo',
  startDate: '2022-02-14',
  coupleCode: 'AMOR-8492',
  avatar1Url: IMAGES.sofiaAvatar,
  avatar2Url: IMAGES.mateoAvatar,
  heroPhotoUrl: IMAGES.heroMirador,
  heroLocation: 'Mirador del Valle',
};

export const INITIAL_THOUGHTS: DailyThought[] = [
  {
    id: 't1',
    quote: 'Te elijo hoy en los días fáciles, y todavía más en los días difíciles.',
    signature: 'Para nosotros dos',
    isFavorite: true,
  },
  {
    id: 't2',
    quote: 'Hogar no es una dirección en el mapa, es la calma que siento cuando apoyas tu mano en la mía.',
    signature: 'Siempre tuyo',
    isFavorite: false,
  },
  {
    id: 't3',
    quote: 'Me encanta la versión de nosotros que aparece cuando nadie más está mirando.',
    signature: 'Nuestro secreto',
    isFavorite: true,
  },
];

export const INITIAL_QUESTIONS: DailyQuestion[] = [
  {
    id: 'q1',
    prompt: '¿Qué pequeño momento conmigo te hizo sonreír últimamente?',
    partner1Answer: {
      author: 'Sofía',
      timeAgo: 'Hace 2 horas',
      text: 'Cuando te diste vuelta medio dormido buscando mi mano esta mañana antes de que sonara la alarma.',
    },
  },
  {
    id: 'q2',
    prompt: 'Si pudiéramos teletransportarnos este fin de semana, ¿a dónde me llevarías?',
    partner1Answer: {
      author: 'Sofía',
      timeAgo: 'Ayer',
      text: 'A una cabaña pequeña frente al lago con café caliente, lluvia en los ventanales y cero relojes.',
    },
  },
];

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'm1',
    title: 'Ruta improvisada a la costa — Liguria',
    date: '2024-09-12',
    displayDate: '12 Sep 2024',
    category: 'Viajes',
    description:
      'Compramos los billetes cinco minutos antes de que el tren arrancara. La mejor decisión de aquel verano.',
    imageUrl: IMAGES.coastTrain,
    washiLabel: 'viaje · liguria 2024',
    washiColor: 'sage',
    isFavorite: true,
    notes: [
      {
        id: 'n1',
        author: 'Sofía',
        text: 'Todavía recuerdo la brisa salada entrando por la ventanilla del tren.',
        createdAt: '12 Sep 2024',
      },
      {
        id: 'n2',
        author: 'Mateo',
        text: 'Y lo mucho que nos reímos corriendo por el andén con las mochilas.',
        createdAt: '13 Sep 2024',
      },
    ],
  },
  {
    id: 'm2',
    title: 'El café donde nos confesamos todo',
    date: '2024-08-03',
    displayDate: '3 Ago 2024',
    category: 'Citas',
    description:
      'Entre páginas subrayadas y dos tazas humeantes, nos contamos los miedos y los sueños que nunca habíamos dicho en voz alta.',
    imageUrl: IMAGES.cafeConfession,
    washiColor: 'rose',
    isFavorite: true,
    notes: [
      {
        id: 'n3',
        author: 'Mateo',
        text: 'Ese día supe que podía contarte absolutamente todo.',
        createdAt: '3 Ago 2024',
      },
    ],
  },
  {
    id: 'm3',
    title: 'Risas bajo el aguacero',
    date: '2024-07-18',
    displayDate: '18 Jul 2024',
    category: 'Momentos cotidianos',
    description:
      'Nos sorprendió la tormenta de verano sin abrigo, pero un paraguas transparente y tus carcajadas lo cambiaron todo.',
    imageUrl: IMAGES.rainUmbrella,
    washiColor: 'sage',
    isFavorite: true,
    notes: [
      {
        id: 'n4',
        author: 'Sofía',
        text: 'Terminamos empapados pero felices como niños.',
        createdAt: '18 Jul 2024',
      },
    ],
  },
  {
    id: 'm4',
    title: 'El peor pastel más rico del mundo',
    date: '2024-06-22',
    displayDate: '22 Jun 2024',
    category: 'Cocina',
    description:
      'Se nos olvidó la levadura pero nunca nos habíamos reído tanto en una cocina.',
    imageUrl: IMAGES.chocolateCake,
    washiLabel: 'cocina casera',
    washiColor: 'rose',
    isFavorite: true,
    notes: [
      {
        id: 'n5',
        author: 'Mateo',
        text: 'Tenías harina hasta en las pestañas.',
        createdAt: '22 Jun 2024',
      },
    ],
  },
  {
    id: 'm5',
    title: 'Café de domingo',
    date: '2024-10-19',
    displayDate: '19 Oct 2024',
    category: 'Momentos cotidianos',
    description:
      'Bajo la lluvia y charlas eternas en nuestra cafetería escondida de la esquina.',
    imageUrl: IMAGES.coffeeSunday,
    washiColor: 'sage',
    isFavorite: true,
    notes: [],
  },
  {
    id: 'm6',
    title: 'Primera cena desastrosa',
    date: '2024-10-12',
    displayDate: '12 Oct 2024',
    category: 'Cocina',
    description:
      'La pizza se quemó un poco en los bordes pero reímos cenando en el piso de la sala.',
    imageUrl: IMAGES.pizzaDisaster,
    washiColor: 'rose',
    isFavorite: false,
    notes: [],
  },
];

export const INITIAL_LETTERS: LetterItem[] = [
  {
    id: 'l-open-featured',
    title: 'Querido amor mío',
    sender: 'Sofía',
    recipient: 'Mateo',
    body: 'Me quedé mirándote esta mañana mientras preparabas el café y comprendí que los momentos pequeños son los que están construyendo nuestra casa entera. No te lo dije porque estabas distraído, pero aquí te lo dejo guardado.',
    dateLabel: 'Miércoles, 15 de Noviembre',
    status: 'unread',
    isFavorite: false,
    stampCode: 'CORREO 04',
  },
  {
    id: 'l-capsule-anniv',
    title: 'Para abrir en nuestro próximo aniversario',
    sender: 'Mateo',
    recipient: 'Sofía',
    body: 'Si estás leyendo esto, ya cumplimos un año más caminando juntos. Gracias por seguir eligiendo mi mano incluso en los días de prisa. Prometo seguir escribiendo nuestra historia con la misma ternura del primer café.',
    dateLabel: '14 Feb 2025',
    status: 'capsule',
    unlockDate: '2025-02-14',
    daysRemaining: 112,
    progressPercent: 68,
    stampCode: 'LACRE 01',
  },
  {
    id: 'l-emergency',
    title: 'Para cuando tengas un día difícil en el trabajo',
    sender: 'Sofía',
    recipient: 'Mateo',
    body: 'Respira hondo, amor. No tienes que cargar con todo el mundo sobre tus hombros hoy. Ya casi estás en casa, hoy preparo la cena yo y te espera un abrazo largo sin preguntas ni relojes. Te amo muchísimo.',
    dateLabel: 'Disponible cuando lo necesites',
    status: 'unread',
    isEmergency: true,
    stampCode: 'SALVIA 02',
  },
  {
    id: 'l-chest-1',
    title: 'Gracias por esperarme ayer en la lluvia',
    sender: 'Sofía',
    recipient: 'Mateo',
    body: 'Verte debajo del toldo con el paraguas en la mano y una sonrisa cansada pero tierna me hizo sentir la persona más afortunada del mundo. Gracias por cuidarme siempre en los detalles silenciosos.',
    dateLabel: 'Leída hace 3 días',
    status: 'read',
    isFavorite: true,
  },
  {
    id: 'l-chest-2',
    title: 'Diez cosas que amo de tus mañanas',
    sender: 'Mateo',
    recipient: 'Sofía',
    body: '1. Tu voz ronca antes del primer café.\n2. Cómo buscas el rayo de sol en la ventana.\n3. La paciencia con la que ordenas tus libros.\n4. Tu risa espontánea cuando algo se me cae en la cocina.\n5. Que siempre dices buenos días antes de mirar el teléfono.',
    dateLabel: 'Leída el 1 Oct',
    status: 'read',
    isFavorite: true,
  },
  {
    id: 'l-chest-3',
    title: 'Nuestra primera noche en Lisboa',
    sender: 'Mateo',
    recipient: 'Sofía',
    body: 'Las calles empedradas brillaban después de la lluvia y nos perdimos buscando una pastelería abierta. No encontramos los pasteles, pero encontré tu mirada frente al mirador y me bastó para toda la vida.',
    dateLabel: 'Leída el 18 Ago',
    status: 'read',
  },
  {
    id: 'l-draft-1',
    title: 'Notas para nuestra próxima escapada',
    sender: 'Mateo',
    recipient: 'Sofía',
    body: 'Quiero agradecerte por hacer que cualquier rincón se sienta hogar cuando estamos juntos...',
    dateLabel: 'Borrador guardado',
    status: 'draft',
  },
];

export const INITIAL_PLANS: PlanItem[] = [
  {
    id: 'p1',
    title: 'Noche de picnic bajo las estrellas en el jardín botánico',
    category: 'citas',
    categoryLabel: 'Citas',
    dateLabel: 'Este sábado 26 · 19:30 hs',
    notes: 'Manta a cuadros, uvas verdes y luces cálidas.',
    imageUrl: IMAGES.planPicnic,
    isNext: true,
    completed: false,
  },
  {
    id: 'p2',
    title: 'Aprender a preparar pasta casera desde cero',
    category: 'comidas',
    categoryLabel: 'Comidas',
    dateLabel: 'Cuando tengamos un domingo libre',
    notes: 'Comprar harina 00, albahaca fresca y poner música italiana.',
    imageUrl: IMAGES.planPasta,
    completed: false,
  },
  {
    id: 'p3',
    title: 'Escapada de fin de semana a una cabaña en el bosque',
    category: 'lugares',
    categoryLabel: 'Lugares por conocer',
    dateLabel: 'Soñado para el próximo puente',
    notes: 'Chimenea encendida, bosque con niebla y vista al lago.',
    imageUrl: IMAGES.planCabin,
    isPriority: true,
    completed: false,
  },
  {
    id: 'p4',
    title: 'Ver toda la saga del Señor de los Anillos en pijama',
    category: 'peliculas',
    categoryLabel: 'Películas',
    dateLabel: 'Maratón de fin de semana',
    notes: 'Con mantita, chocolate caliente y palomitas caseras.',
    isMovieMarathon: true,
    completed: false,
  },
  {
    id: 'p5',
    title: 'Café de especialidad y chocolate caliente en otoño',
    category: 'citas',
    categoryLabel: 'Citas',
    dateLabel: 'Logrado el 14 Feb',
    notes: 'Tarde tranquila entre hojas secas y malvaviscos.',
    imageUrl: IMAGES.doneHotChoco,
    completed: true,
    completedDateLabel: '14 Feb',
  },
  {
    id: 'p6',
    title: 'Taller de cerámica para hacer nuestras tazas',
    category: 'citas',
    categoryLabel: 'Citas',
    dateLabel: 'Logrado el 03 Ene',
    notes: 'Nos manchamos las manos de arcilla pero quedaron preciosas.',
    imageUrl: IMAGES.donePottery,
    completed: true,
    completedDateLabel: '03 Ene',
  },
];

export const INITIAL_MILESTONES: MilestoneItem[] = [
  {
    id: 'ms1',
    dateLabel: '18 Oct 2021',
    tag: 'Cita #1',
    icon: 'coffee',
    title: 'El primer café',
    description:
      'Hablamos cuatro horas sin mirar el reloj en aquella mesita de la esquina bajo la lluvia suave.',
    accentColor: 'primary',
  },
  {
    id: 'ms2',
    dateLabel: '14 Feb 2022',
    tag: 'Oficial',
    icon: 'heart',
    title: 'Nuestro primer viaje juntos',
    description:
      'Comenzamos oficialmente este camino frente a las sierras cubiertas de niebla.',
    imageUrl: IMAGES.barilocheRoad,
    imageCaption: "Bariloche '22",
    accentColor: 'primary',
  },
  {
    id: 'ms3',
    dateLabel: '20 May 2023',
    tag: 'Familia',
    icon: 'pets',
    title: 'Adoptamos a Pepa',
    description:
      'Nuestra pequeña cachorrita durmió en tu regazo todo el viaje de regreso a casa.',
    accentColor: 'secondary',
  },
  {
    id: 'ms4',
    dateLabel: '15 Ene 2024',
    tag: 'Mudanza',
    icon: 'key',
    title: 'Nuestro hogar compartido',
    description:
      'Primera noche en nuestra casita, comiendo pizza sobre cajas de cartón sin desempacar.',
    accentColor: 'primary',
  },
];

export const INITIAL_SETTINGS: AppSettings = {
  faceIdLock: true,
  softNotifications: true,
  anniversaryReminder: true,
  cloudSynced: true,
};

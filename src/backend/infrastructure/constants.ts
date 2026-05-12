import { Expression as SharedExpression } from "@/shared/types/expression";

export const INITIAL_EXPRESSION: SharedExpression = {
  id: "initial",
  text: "is packed with",
  translation: "está lleno de / está repleto de",
  meaning: "To be completely full of something or someone.",
  secondaryMeanings: ["crammed with", "crowded with", "brimming with"],
  type: "phrasal verb / collocation",
  cefr: "B2",
  ipa: "/ɪz pækt wɪð/",
  frequency: 0.75,
  formality: "Neutral / Informal",
  mnemonic: "Imagine two gears that 'fit together' perfectly to work without noise.",
  imageUrl: "/Users/mauroociappina/.gemini/antigravity/brain/3681305e-92dc-4eaf-b866-34ecea1b4aed/get_along_visual_1778506922743.png",
  usageTips: {
    context: "Used to describe places, events, or objects that are at full capacity.",
    naturalness: "Very natural in both spoken and written English.",
    commonMistake: "Students often forget the 'with' or the 'ed' (e.g., 'is pack with').",
  },
  tenses: {
    present_simple: { text: "The stadium is packed with fans.", translation: "El estadio está repleto de fans." },
    past_simple: { text: "The stadium was packed with people last night.", translation: "El estadio estaba lleno de gente anoche." },
    future_simple: { text: "The stadium will be packed with supporters tomorrow.", translation: "El estadio estará lleno de seguidores mañana." },
    present_continuous: { text: "The stadium is being packed with fans for the event.", translation: "El estadio se está llenando de fans para el evento." },
    past_continuous: { text: "The stadium was being packed with fans when it started to rain.", translation: "El estadio se estaba llenando de fans cuando empezó a llover." },
    future_continuous: { text: "The stadium will be being packed with fans at 8 PM.", translation: "El estadio se estará llenando de fans a las 8 PM." },
    present_perfect: { text: "The stadium has been packed with fans all afternoon.", translation: "El estadio ha estado lleno de fans toda la tarde." },
    past_perfect: { text: "The stadium had been packed with fans before the game was cancelled.", translation: "El estadio había estado lleno de fans antes de que el juego se cancelara." },
    future_perfect: { text: "The stadium will have been packed with fans by the time you arrive.", translation: "El estadio habrá estado lleno de fans para cuando llegues." },
    present_perfect_continuous: { text: "The stadium has been being packed with fans for hours.", translation: "El estadio se ha estado llenando de fans por horas." },
    past_perfect_continuous: { text: "The stadium had been being packed with fans before the gates closed.", translation: "El estadio se había estado llenando de fans antes de que cerraran las puertas." },
    future_perfect_continuous: { text: "The stadium will have been being packed with fans for three hours by then.", translation: "El estadio se habrá estado llenando de fans por tres horas para ese entonces." },
    present_passive: { text: "The venue is packed with equipment by the crew.", translation: "El lugar es llenado con equipos por el equipo de trabajo." },
    past_passive: { text: "The stadium was packed with people by the organizers.", translation: "El estadio fue llenado con gente por los organizadores." },
    future_passive: { text: "The stadium will be packed with fans by the marketing team.", translation: "El estadio será llenado con fans por el equipo de marketing." },
    present_perfect_passive: { text: "The venue has been packed with equipment.", translation: "El lugar ha sido llenado con equipos." },
    past_perfect_passive: { text: "The venue had been packed with equipment before the show.", translation: "El lugar había sido llenado con equipos antes del show." },
    future_perfect_passive: { text: "The venue will have been packed with equipment by noon.", translation: "El lugar habrá sido llenado con equipos para el mediodía." },
    conditional_2: { text: "If the concert were free, the stadium would be packed with fans.", translation: "Si el concierto fuera gratis, el estadio estaría lleno de fans." },
    used_to: { text: "The stadium used to be packed with fans every weekend.", translation: "El estadio solía estar lleno de fans cada fin de semana." },
  },
  wordFamilies: {
    noun: ["pack", "package", "packaging", "packet"],
    verb: ["pack", "repack", "unpack"],
    adjective: ["packed", "packing"],
    adverb: []
  },
  phrasalVerbDetails: {
    verb: "is",
    particle: "packed with",
    separable: "no",
    transitive: true,
    commonCollocations: ["is packed with fans", "is packed with information", "is packed with flavor"]
  },
  examples: [
    {
      category: "cotidiano",
      text: "The bus was packed with commuters this morning.",
      translation: "El colectivo estaba repleto de gente que iba a trabajar esta mañana.",
      explanation: "A common daily scenario."
    },
    {
      category: "avanzado",
      text: "The manuscript is packed with intricate metaphors and historical references.",
      translation: "El manuscrito está lleno de metáforas intrincadas y referencias históricas.",
      explanation: "Academic/Literary usage."
    },
    {
      category: "dialectal",
      text: "The pub was absolutely Chock-a-block! (British English)",
      translation: "¡El pub estaba absolutamente hasta las manos! (Inglés británico)",
      explanation: "Chock-a-block is a common British idiom meaning packed."
    }
  ]
};

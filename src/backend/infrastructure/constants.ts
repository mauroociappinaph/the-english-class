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
    present_perfect_continuous: { text: "The stadium has been being packed with fans for hours.", translation: "El estadio se ha estado llenando de fans por horas." },
    past_perfect_continuous: { text: "The stadium had been being packed with fans before the gates closed.", translation: "El estadio se había estado llenando de fans antes de que cerraran las puertas." },
    conditional_2: { text: "If the concert were free, the stadium would be packed with fans.", translation: "Si el concierto fuera gratis, el estadio estaría lleno de fans." },
    present_passive: { text: "The venue is packed with equipment by the crew.", translation: "El lugar es llenado con equipos por el equipo de trabajo." },
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

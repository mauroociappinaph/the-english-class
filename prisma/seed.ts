import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  try {
    const isPackedWith = await prisma.expression.upsert({
      where: { text: 'is packed with' },
      update: {},
      create: {
        text: 'is packed with',
        translation: 'está lleno de / está repleto de',
        meaning: 'To be completely full of something or someone.',
        secondaryMeanings: JSON.stringify(["crammed with", "crowded with", "brimming with"]),
        type: 'phrasal verb / collocation',
        cefr: 'B2',
        ipa: '/ɪz pækt wɪð/',
        frequency: 0.75,
        formality: 'Neutral / Informal',
        usageTips: JSON.stringify({
          context: "Used to describe places, events, or objects that are at full capacity.",
          naturalness: "Very natural in both spoken and written English.",
          avoid: "Don't use for abstract concepts like 'packed with love' (though possible, 'full of' is more common).",
          common_errors: "Students often forget the 'with' or the 'ed' (e.g., 'is pack with').",
        }),
        tenses: JSON.stringify({
          present_simple: "The stadium is packed with fans.",
          past_simple: "The stadium was packed with people last night.",
          present_perfect: "The stadium has been packed with tourists all week.",
          future: "The stadium will be packed with supporters tomorrow.",
        }),
        examples: {
          create: [
            {
              category: 'cotidiano',
              text: 'The bus was packed with commuters this morning.',
              explanation: 'A common daily scenario.'
            },
            {
              category: 'avanzado',
              text: 'The manuscript is packed with intricate metaphors and historical references.',
              explanation: 'Academic/Literary usage.'
            },
            {
              category: 'dialectal',
              text: 'The pub was absolutely Chock-a-block! (British English)',
              explanation: 'Chock-a-block is a common British idiom meaning packed.'
            }
          ]
        }
      },
    })
    console.log('Seeded successfully:', isPackedWith.text)
  } catch (err) {
    console.error('SEED ERROR:', err)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('GLOBAL SEED ERROR:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

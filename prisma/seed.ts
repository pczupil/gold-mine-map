import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌍 Seeding database with global mine data...')

  // Clear existing data
  await prisma.mineDetail.deleteMany()
  await prisma.mine.deleteMany()
  await prisma.user.deleteMany()

  // Create a sample user
  const user = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@goldminemap.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.sKq', // password: admin123
    },
  })

  console.log('✅ Created admin user')

  // Major Gold Mines
  const goldMines = [
    {
      name: "Carlin Gold Mine",
      type: "Gold",
      latitude: 40.7128,
      longitude: -116.1619,
      country: "USA",
      region: "Nevada",
      production: "1.2M oz/year",
      status: "Active",
      description: "One of the largest gold mines in the world, operated by Newmont Corporation.",
      website: "https://www.newmont.com"
    },
    {
      name: "Grasberg Mine",
      type: "Gold",
      latitude: -4.0584,
      longitude: 137.1164,
      country: "Indonesia",
      region: "Papua",
      production: "2.5M oz gold/year",
      status: "Active",
      description: "World's largest gold mine and second-largest copper mine.",
      website: "https://www.fcx.com"
    },
    {
      name: "Muruntau Gold Mine",
      type: "Gold",
      latitude: 41.5333,
      longitude: 64.6167,
      country: "Uzbekistan",
      region: "Navoiy",
      production: "2.8M oz/year",
      status: "Active",
      description: "Largest open-pit gold mine in the world by production.",
      website: "https://www.ngmk.uz"
    },
    {
      name: "Olimpiada Gold Mine",
      type: "Gold",
      latitude: 55.0167,
      longitude: 88.5167,
      country: "Russia",
      region: "Krasnoyarsk",
      production: "1.2M oz/year",
      status: "Active",
      description: "One of Russia's largest gold mines, operated by Polyus.",
      website: "https://polyus.com"
    },
    {
      name: "Boddington Gold Mine",
      type: "Gold",
      latitude: -32.8000,
      longitude: 116.4667,
      country: "Australia",
      region: "Western Australia",
      production: "700K oz/year",
      status: "Active",
      description: "Australia's largest gold mine by production.",
      website: "https://www.newmont.com"
    }
  ]

  // Major Copper Mines
  const copperMines = [
    {
      name: "Escondida",
      type: "Copper",
      latitude: -24.2667,
      longitude: -69.0833,
      country: "Chile",
      region: "Antofagasta",
      production: "1.2M tons copper/year",
      status: "Active",
      description: "World's largest copper mine by production.",
      website: "https://www.bhp.com"
    },
    {
      name: "Collahuasi",
      type: "Copper",
      latitude: -20.9667,
      longitude: -68.6500,
      country: "Chile",
      region: "Tarapacá",
      production: "500K tons copper/year",
      status: "Active",
      description: "One of the world's largest copper deposits.",
      website: "https://www.collahuasi.cl"
    },
    {
      name: "Oyu Tolgoi",
      type: "Copper",
      latitude: 43.0167,
      longitude: 106.8667,
      country: "Mongolia",
      region: "Ömnögovi",
      production: "500K tons copper/year",
      status: "Active",
      description: "One of the world's largest copper-gold deposits.",
      website: "https://ot.mn"
    },
    {
      name: "Olympic Dam",
      type: "Copper",
      latitude: -30.4444,
      longitude: 136.8869,
      country: "Australia",
      region: "South Australia",
      production: "200K tons copper/year",
      status: "Active",
      description: "World's fourth-largest copper deposit and largest uranium deposit.",
      website: "https://www.bhp.com"
    }
  ]

  // Mixed Mineral Mines
  const mixedMines = [
    {
      name: "Olympic Dam",
      type: "Copper, Uranium, Gold",
      latitude: -30.4444,
      longitude: 136.8869,
      country: "Australia",
      region: "South Australia",
      production: "200K oz gold/year, 4K tons uranium/year",
      status: "Active",
      description: "Multi-commodity mine producing copper, uranium, gold, and silver.",
      website: "https://www.bhp.com"
    },
    {
      name: "Grasberg",
      type: "Copper & Gold",
      latitude: -4.0584,
      longitude: 137.1164,
      country: "Indonesia",
      region: "Papua",
      production: "2.5M oz gold/year, 1.2M tons copper/year",
      status: "Active",
      description: "World's largest gold mine and second-largest copper mine.",
      website: "https://www.fcx.com"
    },
    {
      name: "Oyu Tolgoi",
      type: "Copper & Gold",
      latitude: 43.0167,
      longitude: 106.8667,
      country: "Mongolia",
      region: "Ömnögovi",
      production: "500K oz gold/year, 500K tons copper/year",
      status: "Active",
      description: "One of the world's largest copper-gold deposits.",
      website: "https://ot.mn"
    }
  ]

  // Iron Ore Mines
  const ironMines = [
    {
      name: "Carajás Mine",
      type: "Iron",
      latitude: -6.0000,
      longitude: -50.0000,
      country: "Brazil",
      region: "Pará",
      production: "150M tons iron ore/year",
      status: "Active",
      description: "World's largest iron ore mine.",
      website: "https://www.vale.com"
    },
    {
      name: "Pilbara Operations",
      type: "Iron",
      latitude: -22.0000,
      longitude: 120.0000,
      country: "Australia",
      region: "Western Australia",
      production: "300M tons iron ore/year",
      status: "Active",
      description: "Rio Tinto's major iron ore operations in the Pilbara region.",
      website: "https://www.riotinto.com"
    },
    {
      name: "Mount Whaleback",
      type: "Iron",
      latitude: -23.0000,
      longitude: 119.0000,
      country: "Australia",
      region: "Western Australia",
      production: "80M tons iron ore/year",
      status: "Active",
      description: "Australia's largest open-cut iron ore mine.",
      website: "https://www.bhp.com"
    }
  ]

  // Diamond Mines
  const diamondMines = [
    {
      name: "Jwaneng Mine",
      type: "Diamond",
      latitude: -24.5167,
      longitude: 24.5167,
      country: "Botswana",
      region: "Southern",
      production: "15M carats/year",
      status: "Active",
      description: "World's richest diamond mine by value.",
      website: "https://www.debeersgroup.com"
    },
    {
      name: "Orapa Mine",
      type: "Diamond",
      latitude: -21.3000,
      longitude: 25.4000,
      country: "Botswana",
      region: "Central",
      production: "20M carats/year",
      status: "Active",
      description: "World's largest diamond mine by area.",
      website: "https://www.debeersgroup.com"
    },
    {
      name: "Catoca Mine",
      type: "Diamond",
      latitude: -9.4333,
      longitude: 20.3167,
      country: "Angola",
      region: "Lunda Sul",
      production: "7M carats/year",
      status: "Active",
      description: "Fourth-largest diamond mine in the world.",
      website: "https://www.catoca.com"
    }
  ]

  // Combine all mines
  const allMines = [...goldMines, ...copperMines, ...mixedMines, ...ironMines, ...diamondMines]

  // Create mines in database
  for (const mineData of allMines) {
    const mine = await prisma.mine.create({
      data: {
        ...mineData,
        userId: user.id,
      },
    })

    // Add mine details for some mines
    if (mine.type === "Gold") {
      await prisma.mineDetail.create({
        data: {
          mineId: mine.id,
          mineralType: "Gold",
          grade: "2.5 g/t",
          reserves: "15M oz",
          production: mine.production,
          year: 2024,
        },
      })
    } else if (mine.type === "Copper") {
      await prisma.mineDetail.create({
        data: {
          mineId: mine.id,
          mineralType: "Copper",
          grade: "0.8%",
          reserves: "50M tons",
          production: mine.production,
          year: 2024,
        },
      })
    }
  }

  console.log(`✅ Created ${allMines.length} mines with details`)
  console.log('🌍 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
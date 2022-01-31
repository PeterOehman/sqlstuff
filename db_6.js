const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/sqlstuff', {
  logging: false
})

// const Ship = db.define('ship', {
//   name: Sequelize.TEXT,
//   crewCapacity: Sequelize.INTEGER,
//   amountOfSails: Sequelize.INTEGER
// }, { timestamps: false })
// const Captain = db.define('captain', {
//   name: Sequelize.TEXT,
//   skillLevel: {
//     type: Sequelize.INTEGER,
//     validate: { min: 1, max: 10 }
//   }
// }, { timestamps: false })

// async function seed() {
//   try {
//     await Captain.create({ name: 'Jack Sparrow', skillLevel: 9 })
//     await Ship.create({ name: 'Old Reliable', crewCapacity: 20, amountOfSails: 5 })
//   } catch (error) {
//     console.error(error)
//   }
// }

// async function associate() {
//   try {
//     await seed()
//     Captain.hasOne(Ship)
//     Ship.belongsTo(Captain)
//     //lazy loading
//     const awesomeCaptain = await Captain.findOne({
//       where: { name: 'Jack Sparrow' }
//     })
//     console.log(awesomeCaptain.name)
//     const hisShip = await awesomeCaptain.getShip()
//     console.log(hisShip.name)
//   } catch (error) {
//     console.error(error)
//   }
// }

const Movie = db.define('Movie', { name: Sequelize.STRING })
const Actor = db.define('Actor', { name: Sequelize.STRING })

async function create() {
  Movie.belongsToMany(Actor, { through: 'ActorMovies' })
  Actor.belongsToMany(Movie, { through: 'ActorMovies' })
}

async function connect() {
  try {
    await db.sync({ force: true })
    await create()
    // await associate()
    await db.close()
  } catch (error) {
    console.error(error)
  }
}

connect()

const { Sequelize, Op, QueryTypes } = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/sqlstuff', {
  logging: false
})

const Age = db.define('Age', { age: Sequelize.INTEGER }, { timestamps: false })

const User = db.define('User', { name: Sequelize.STRING }, { timestamps: false })

const Movie = db.define('Movie', { name: Sequelize.STRING })

const Actor = db.define('Actor', { name: Sequelize.STRING })


  User.belongsToMany(Age, { through: 'UserAges' })
Age.belongsToMany(User, { through: 'UserAges' })
Movie.belongsToMany(Actor, { through: 'ActorMovies' })
Actor.belongsToMany(Movie, { through: 'ActorMovies' })


async function create() {
  try {
    //Both Users and Ages Table are created. Both tables are properly populated
    // const people = await User.bulkCreate([
    //   { firstName: 'Tyler', lastName: 'Kumar'},
    //   { firstName: 'Sabi', lastName: 'Kumar'}
    // ], { validate: true }, { fields: ['firstName', 'lastName']})
    // const myAge = await Age.create({ age: 22 })
    // //Line 22 and 23 do not create a through table
    // User.belongsToMany(Age, { through: 'UserAges' })
    // Age.belongsToMany(User, { through: 'UserAges' })
    // //Line 25 creates the error 'relation "UserAges" does not exist'
    // await people[1].addAge(myAge)
    make()
    const person = await User.create({ name: 'Yox' })
    const age = await Age.create({ age: 22 })

    const movie = await Movie.create({ name: 'myMovie' })
    const actor = await Actor.create({ name: 'myActor' })

    await movie.addActor(actor)
    await person.addAge(age)
  } catch (error) {
    console.error(error)
  }
}

async function connect() {
  try {
    await db.sync({ force: true })
    await create()
    await db.close()
  } catch (error) {
    console.error(error)
  }
}

connect()

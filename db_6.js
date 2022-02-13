const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/sqlstuff', {
  logging: false
})

const Ship = db.define('ship', {
  name: Sequelize.TEXT,
  crewCapacity: Sequelize.INTEGER,
  amountOfSails: Sequelize.INTEGER
}, { timestamps: false })
const Captain = db.define('captain', {
  name: Sequelize.TEXT,
  skillLevel: {
    type: Sequelize.INTEGER,
    validate: { min: 1, max: 10 }
  }
}, { timestamps: false })

Captain.hasOne(Ship /* , { as: 'leader' } */ )
Ship.belongsTo(Captain /* , { as: 'leader', foreignKey: 'bossId' } */ )

async function seed() {
  try {
    await Captain.create({ name: 'Jack Sparrow', skillLevel: 9 })
    await Ship.create({ name: 'Old Reliable', crewCapacity: 20, amountOfSails: 5 /*, captainId: 1 */ })
  } catch (error) {
    console.error(error)
  }
}

async function associate() {
  try {
    await seed()
    //lazy loading
    // const awesomeCaptain = await Captain.findOne({ where: { name: 'Jack Sparrow' } })
    // const hisShip = await awesomeCaptain.getShip()
    const ship = await Ship.findOne()
    const captain = await Captain.findOne()
    await captain.setShip(ship)
    console.log((await captain.getShip()).toJSON())
    // console.log(hisShip.name)
    //eager loading
    // const captainWithShip = await Ship.findOne({
    //   where: { name: 'Old Reliable' },
    //   include: 'captain'
    // })
    // console.log(captainWithShip.toJSON())
    await captain.createShip({ name: 'speedy', crewCapacity: 10, amountOfSails: 2 })
    // const newShip = await captain.getShip()
    // console.log(newShip.name)
    console.log((await captain.getShip()).toJSON())
    await captain.setShip(null)
    console.log((await captain.getShip()).toJSON())
    await captain.createShip({ name: 'speedster', crewCapacity: 10, amountOfSails: 2 })
    console.log((await captain.getShip()).toJSON())
  } catch (error) {
    console.error(error)
  }
}

async function connect() {
  try {
    await db.sync({ force: true })
    await associate()
    await db.close()
  } catch (error) {
    console.error(error)
  }
}

connect()

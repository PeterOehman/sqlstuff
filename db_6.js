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

Captain.hasOne(Ship)
Ship.belongsTo(Captain)

async function seed() {
  try {
    const captain = await Captain.create({ name: 'Jack Sparrow', skillLevel: 9 })
    const ship = await Ship.create({ name: 'Old Reliable', crewCapacity: 20, amountOfSails: 5 })
    await captain.setShip(ship)
  } catch (error) {
    console.error(error)
  }
}

async function associate() {
  try {
    await seed()
    //lazy loading
    const awesomeCaptain = await Captain.findOne({ where: { name: 'Jack Sparrow' } })
    const hisShip = await awesomeCaptain.getShip()
    console.log(hisShip.name)
    //eager loading
    const captainWithShip = await Captain.findOne({
      where: { name: 'Jack Sparrow' },
      include: Ship
    })
    console.log(captainWithShip.ship.name)
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

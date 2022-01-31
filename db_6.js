const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/sqlstuff', {
  logging: false
})

const Ship = db.define('ship', {
  name: Sequelize.TEXT,
  crewCapacity: Sequelize.INTEGER,
  amountOfSails: Sequelize.INTEGER
}, { timeStamps: false })
const Captain = db.define('captain', {
  name: Sequelize.TEXT,
  skillLevel: {
    type: Sequelize.INTEGER,
    validate: { min: 1, max: 10 }
  }
}, { timeStamps: false })

async function create() {
  try {
    Captain.hasOne(Ship)
    Ship.belongsTo(Captain)
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

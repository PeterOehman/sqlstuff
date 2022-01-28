const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/sqlstuff')

async function connect() {
  try {
    await db.authenticate()
    console.log('worked')
    await db.close()
  } catch (error) {
    console.log('didnt work')
  }
}

connect()

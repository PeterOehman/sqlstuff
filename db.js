const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/sqlstuff', {
  logging: false
})

const User = db.define('User', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING
  }}, {
    timestamps: false
})

async function connect() {
  try {
    await db.sync({ alter: true })
    console.log('worked')
    await db.close()
  } catch (error) {
    console.log('didnt work')
  }
}

connect()

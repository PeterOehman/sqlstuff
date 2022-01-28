const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/sqlstuff', {
  logging: false
})

const User = db.define('User', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: Sequelize.STRING
  }, {
    timestamps: false
})

User.prototype.respond = function() {
  return this.firstName + ' ' + this.lastName
}

async function create() {
  const user = await User.create({ firstName: 'Peter', lastName: 'Oehman' })
  console.log(user.respond())
  console.log(user.toJSON())
}

create()


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

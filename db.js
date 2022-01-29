const { Sequelize, Op } = require('sequelize')
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

const Age = db.define('Age', { age: Sequelize.INTEGER }, { timestamps: false })

User.prototype.respond = function() {
  return this.firstName + ' ' + this.lastName
}

User.talk = function() {
  console.log('Im a class method!')
}

async function create() {
  try {
    await User.create({ firstName: 'Peter', lastName: 'Oehman' })
    await User.create({ firstName: 'Bob', lastName: 'Bobby' })
    const myUser = await User.findAll({
      where: {
        firstName: {
          [Op.or]: ['Peter', 'Bob']
        },
        lastName: 'Oehman',
        id: [1,2]
      }
    })
    console.log(JSON.stringify(myUser, null, 2))
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
    console.log('didnt work')
  }
}

connect()

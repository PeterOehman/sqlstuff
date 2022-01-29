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

const Age = db.define('Age', { age: Sequelize.INTEGER }, { timestamps: false })

User.prototype.respond = function() {
  return this.firstName + ' ' + this.lastName
}

User.talk = function() {
  console.log('Im a class method!')
}

async function create() {
  try {
    User.talk()
    const user = await User.create({ firstName: 'Peter', lastName: 'Oehman' })
    user.set({
      firstName: "John",
      lastName: "Duffy"
    })
    await user.save()
    const user2 = await User.create({ firstName: 'Bob', lastName: 'Bobby' })
    user2.firstName = 'jack'
    user2.lastName = 'jacky'
    await user2.save({ fields: ['firstName'] })
    await user2.reload()
    const myAge = await Age.create({ age: 22 })
    await myAge.increment('age', { by: 2 })
    const users = await User.findAll({
      attributes: {
        include: [[db.fn('upper', db.col('firstName')), 'uppercase']]
    }})
    console.log(JSON.stringify(users, null, 2))
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

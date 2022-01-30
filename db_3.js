const { Sequelize, Op } = require('sequelize')
const bcrypt = require('bcrypt')
const db = new Sequelize('postgres://localhost:5432/sqlstuff', {
  logging: false
})

const User = db.define('User', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    get() {
      //if we used this.firstName, we would get infinite loop, this is why getDataValue is a thing
      const value = this.getDataValue('firstName')
      return value ? value.toUpperCase() : null
    }
  },
  lastName: {
    type: Sequelize.STRING,
    set(value) {
      let hashed = bcrypt.hashSync(value, 5)
      this.setDataValue('lastName', hashed)
    }
  }
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
    const peter = await User.create({ firstName: 'Peter', lastName: 'Oehman' })
    await User.create({ firstName: 'Bob', lastName: 'Bobby' })
    await User.bulkCreate([
      { firstName: 'Tyler', lastName: 'Kumar'},
      { firstName: 'Sabi', lastName: 'Kumar'}
    ], { validate: true }, { fields: ['firstName', 'lastName']})
   const user1 = await User.findByPk(1)
   console.log(JSON.stringify(user1, null, 2))
   const Sabi = await User.findOne({ where: { firstName: 'Sabi' }})
   console.log(JSON.stringify(Sabi, null, 2))
   const [user, created] = await User.findOrCreate({
     where: { firstName: 'Owen' },
     defaults: { lastName: 'Noe' }
   })
   console.log(created)
   const { count, rows } = await User.findAndCountAll({
     where: { lastName: 'Kumar' },
     offset: 1,
     limit: 2
   })
   console.log('count: ', count)
   console.log(JSON.stringify(rows, null, 2))
   console.log(peter.firstName)
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

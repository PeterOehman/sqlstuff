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
    await User.bulkCreate([
      { firstName: 'Tyler', lastName: 'Kumar'},
      { firstName: 'Sabi', lastName: 'Kumar'}
    ], { validate: true }, { fields: ['firstName', 'lastName']})
    const myUser = await User.findAll({
      attributes: [[db.fn('COUNT', db.col('firstName')), 'n_names'], 'lastName'],
      where: {
        firstName: {
          [Op.or]: ['Peter', 'Sabi', 'Tyler']
        },
        id: [1,2,3,4],
      },
      group: 'lastName'
    })
    const otherUser = await User.findAll({
      where: {
        [Op.or]: [
          db.where(db.fn('char_length', db.col('firstName')), 3),
          { firstName: 'Peter' }
        ]
      },
      order: [['firstName', 'ASC']]
    })
    const countMe = await User.count({
      where: {
        id: {
          [Op.gt]: 1
        }
      }
    })
    console.log(countMe)
    const onlyOne = await User.findAll({ limit: 1, offset: 2 })
    // console.log(JSON.stringify(myUser, null, 2))
    // console.log(JSON.stringify(otherUser, null, 2))
    console.log(JSON.stringify(onlyOne, null, 2))
    await User.update({ lastName: 'Doe' }, {
      where: { lastName: 'Oehman' }
    })
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

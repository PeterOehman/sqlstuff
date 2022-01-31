const { Sequelize, Op, QueryTypes } = require('sequelize')
const bcrypt = require('bcrypt')
const db = new Sequelize('postgres://localhost:5432/sqlstuff', {
  logging: false
})

const Age = db.define('Age', { age: Sequelize.INTEGER }, { timestamps: false })

const User = db.define('User', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notIn: {
        args: [['foo', 'bar']],
        msg: 'cant be foo or bar!'
      },
      lengthCheck(value) {
        if (value.length < 2) {
          throw new Error('must have a longer first name!')
        }
      }
    },
    get() {
      //if we used this.firstName, we would get infinite loop, this is why getDataValue is a thing
      const value = this.getDataValue('firstName')
      return value ? value.toUpperCase() : null
    }
  },
  lastName: {
    type: Sequelize.STRING,
    // set(value) {
    //   let hashed = bcrypt.hashSync(value, 5)
    //   this.setDataValue('lastName', hashed)
    // }
  },
  fullName: {
    type: Sequelize.VIRTUAL,
    get() {
      return `${this.firstName} ${this.lastName}`
    }
  }
  }, {
    timestamps: false,
    validate: {
      firstIsLast() {
        if (this.getDataValue('firstName') === this.getDataValue('lastName')) {
          throw new Error('first and last name must be different!')
        }
      }
    },
    // freezeTableName: true
})
// const UserAges = db.define('UserAges', {
//   UserId: {
//     type: Sequelize.STRING,
//     references: {
//       model: User,
//       key: 'id'
//     }
//   },
//   AgeId: {
//     type: Sequelize.STRING,
//     references: {
//       model: Age,
//       key: 'id'
//     }
//   }
// })

User.prototype.respond = function() {
  return this.firstName + ' ' + this.lastName
}

User.talk = function() {
  console.log('Im a class method!')
}

async function create() {
  try {
    const me = await User.create({ firstName: 'Peter', lastName: 'Oehman' })
    await User.create({ firstName: 'Bob', lastName: 'Bobby' })
    await User.bulkCreate([
      { firstName: 'Tyler', lastName: 'Kumar'},
      { firstName: 'Sabi', lastName: 'Kumar'}
    ], { validate: true }, { fields: ['firstName', 'lastName']})
    const myAge = await Age.create({ age: 22 })
  //  User.hasOne(Age, {
  //    foreignKey: {
  //      name: 'myUserId',
  //      allowNull: false,
  //      validate: {
  //        notIn: [500, 600]
  //      }
  //    }
  //  })
  //  Age.belongsTo(User)
    User.belongsToMany(Age, { through: 'stuff' })
    Age.belongsToMany(User, { through: 'stuff' })

    // Movie.belongsToMany(Actor, { through: 'ActorMovies' })
    // Actor.belongsToMany(Movie, { through: 'ActorMovies' })
    await me.addAge(myAge)
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

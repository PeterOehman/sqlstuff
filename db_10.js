const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/sqlstuff', {
  logging: false
})

const User = db.define('user', {
  username: Sequelize.STRING,
  points: Sequelize.INTEGER
}, { timestamps: false })

const Profile = db.define('profile', {
  name: Sequelize.STRING
}, { timestamps: false })

const Grant = db.define('Grant', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  selfGranted: Sequelize.BOOLEAN
}, { timestamps: false })

User.belongsToMany(Profile, { through: Grant })
Profile.belongsToMany(User, { through: Grant })

//This is effectively the same as a many to many between user and profile with grant as the through
//doing both with give you lots of association methods to work with
User.hasMany(Grant)
Grant.belongsTo(User)

Profile.hasMany(Grant)
Grant.belongsTo(Profile)

async function create() {
  try {
    // const amildala = await User.create({ username: 'p4dm3', points: 1000 })
    // const queen = await Profile.create({ name: 'Queen' })
    // await amildala.addProfile(queen, { through: { selfGranted: false }})
   await User.create({
      username: 'p4dm3',
      points: 1000,
      profiles: [{
        name: 'Queen',
        User_Profile: {
          selfGranted: false
        }
      }]
    }, {
      include: Profile
    })
    const result = await User.findOne({
      where: { username: 'p4dm3' },
      include: Profile
    })
    console.log(JSON.stringify(result, null, 2))

    //with two one to many relationships you can do these:
    //Grant.findAll({include: User})
    //Grant.findAll({include: Profile})

    //however, you cant do these
    //User.findAll({include: Profile})
    //Profile.findAll({include: User})

    //although you can emulate it with nested includes
    //User.fndAll({
      //include: {
        // model: Grant,
    //     include: Profile
    //   }
    // })
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

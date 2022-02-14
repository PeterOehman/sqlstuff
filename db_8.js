const { Sequelize, Op } = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/sqlstuff', {
  logging: false
})

const User = db.define('user', {
  name: Sequelize.STRING
}, { timestamps: false })

const Task = db.define('task', {
  name: Sequelize.STRING
}, { timestamps: false })

const Tool = db.define('tool', {
  name: Sequelize.STRING,
  size: Sequelize.STRING
}, { timestamps: false })

User.hasMany(Task)
Task.belongsTo(User)
User.hasMany(Tool, { as: 'Instruments' })
// Tool.belongsTo(User)

async function create() {
  try {
    const user = await User.create({ name: 'John Doe' })
    const task = await Task.create({ name: 'A Task' })
    const tool = await Tool.create({ name: 'scissor', size: 'small' })
    await user.addTask(task)
    await user.addInstrument(tool)
    //required true will not return any tasks that dont have a user
    // const tasks = await Task.findAll({ include: { model: User, required: true }})
    // console.log(JSON.stringify(tasks, null, 2))
    // const users = await User.findAll({ include: Task })
    // console.log(JSON.stringify(users, null, 2))
    const tools = await User.findAll({
      // where: {
      //   '$Instruments.size$': { [Op.ne]: 'medium'}
      // },
      include: {
        model: Tool,
        as: 'Instruments',
        where: {
          // size: { [Op.ne]: 'medium' }
          '$Instruments.size$': {
            [Op.ne]: 'small'
          }
        },
        required: false
      }
    })
    console.log(JSON.stringify(tools, null, 2))
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

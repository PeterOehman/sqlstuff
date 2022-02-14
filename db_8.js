const Sequelize = require('sequelize')
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

async function create() {
  try {
    const user = await User.create({ name: 'John Doe' })
    const task = await Task.create({ name: 'A Task' })
    await user.addTask(task)
    const tasks = await Task.findAll({ include: User })
    console.log(JSON.stringify(tasks, null, 2))
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

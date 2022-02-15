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

const Foo = db.define('foo', {
  name: Sequelize.TEXT
}, { timestamps: false})

const Bar = db.define('bar', {
  name: Sequelize.TEXT
}, { timestamps: false })

User.hasMany(Task)
Task.belongsTo(User)
User.hasMany(Tool, { as: 'Instruments' })
// Tool.belongsTo(User)
Foo.belongsToMany(Bar, { through: 'Foo_Bar', })
Bar.belongsToMany(Foo, { through: 'Foo_Bar' })

async function create() {
  try {
    const user = await User.create({ name: 'John Doe' })
    const task = await Task.create({ name: 'A Task' })
    const tool = await Tool.create({ name: 'scissor', size: 'small' })
    const task2 = await Task.create({ name: 'Another Task' })
    await user.addTasks([task, task2])
    await user.addInstrument(tool)
    const foo = await Foo.create({ name: 'foo' })
    const bar = await Bar.create({ name: 'bar' })
    await foo.addBar(bar)
    //required true will not return any tasks that dont have a user
    // const tasks = await Task.findAll({ include: { model: User, required: true }})
    // console.log(JSON.stringify(tasks, null, 2))
    // const users = await User.findAll({ include: Task })
    // console.log(JSON.stringify(users, null, 2))
    const tools = await User.findAll({
      // where: {
      //   '$Instruments.size$': { [Op.ne]: 'medium'}
      // },
      include: [{
        model: Tool,
        as: 'Instruments',
        where: {
          // size: { [Op.ne]: 'medium' }
          '$Instruments.size$': {
            [Op.ne]: 'small'
          }
        },
        required: false
      },
      Task]
    })
    console.log(JSON.stringify(tools, null, 2))

    const fetchedFoo = await Foo.findOne({
      include: [{
        model: Bar,
        through: {
          attributes: ['createdAt'],
          where: { fooId: 1 }
        }
      }]
    })
    console.log(JSON.stringify(fetchedFoo, null, 2))

    const users = await User.findAll({
      include: { all: true },
      order: [[Task, 'name', 'DESC']]
    })
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
    console.error(error)
  }
}

connect()

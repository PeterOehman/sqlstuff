const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/sqlstuff', {
  logging: false
})

const Product = db.define('product', {
  title: Sequelize.STRING
}, { timestamps: false })

const User = db.define('user', {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING
}, { timestamps: false })

const Address = db.define('address', {
  type: Sequelize.STRING,
  line1: Sequelize.STRING,
  line2: Sequelize.STRING,
  city: Sequelize.STRING,
  state: Sequelize.STRING,
  zip: Sequelize.STRING
}, { timestamps: false })

const Tag = db.define('tag', {
  name: Sequelize.STRING
}, { timestamps: false })

// Product.User = Product.belongsTo(User)
const Creator = Product.belongsTo(User, { as: 'creator' })
User.hasMany(Product)
User.Addresses = User.hasMany(Address)
Address.belongsTo(User)
Product.hasMany(Tag)

async function create() {
  try {
    // await Product.create({
    //   title: 'chair',
    //   user: {
    //     firstName: 'Mick',
    //     lastName: 'VBroadstone',
    //     addresses: [{
    //       type: 'home',
    //       line1: '100 Main St.',
    //       city: 'Austin',
    //       state: 'TX',
    //       zip: '78704'
    //     }]
    //   }
    // }, {
    //   include: [{
    //     association: Product.User,
    //     include: [ User.Addresses ]
    //   }]
    // })
    await Product.create({
      title: 'chair',
      creator: {
        firstName: 'Matt',
        lastName: 'Manson'
      }
    }, { include: [ Creator ]})
    await Product.create({
      title: 'table',
      tags: [
        { name: 'alpha' },
        { name: 'beta' }
      ]
    }, { include: [ Tag ]})
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

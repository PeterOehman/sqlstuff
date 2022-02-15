const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/sqlstuff', {
  logging: false
})

const Product = db.define('product', {
  title: Sequelize.STRING
}, { logging: false })

const User = db.define('user', {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING
}, { logging: false })

const Address = db.define('address', {
  type: Sequelize.STRING,
  line1: Sequelize.STRING,
  line2: Sequelize.STRING,
  city: Sequelize.STRING,
  state: Sequelize.STRING,
  zip: Sequelize.STRING
}, { logging: false })

Product.User = Product.belongsTo(User)
User.hasMany(Product)
User.Addresses = User.hasMany(Address)
Address.belongsTo(User)

async function create() {
  try {
    await Product.create({
      title: 'chair',
      user: {
        firstName: 'Mick',
        lastName: 'VBroadstone',
        addresses: [{
          type: 'home',
          line1: '100 Main St.',
          city: 'Austin',
          state: 'TX',
          zip: '78704'
        }]
      }
    }, {
      include: [{
        association: Product.User,
        include: [ User.Addresses ]
      }]
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
    console.error(error)
  }
}

connect()

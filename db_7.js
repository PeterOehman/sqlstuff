const Sequelize = require('Sequelize')
const db = new Sequelize('postgres://localhost:5432/sqlstuff', {
  logging: false
})

const Foo = db.define('foo', {
  name: {
    type: Sequelize.STRING,
    unique: true
  }
}, { paranoid: true })

const Bar = db.define('bar', {
  name: {
    type: Sequelize.STRING,
    unique: true
  }
}, { timestamps: false })

Foo.hasMany(Bar)
Bar.belongsTo(Foo, { targetKey: 'name', foreignKey: 'fooName' })


// methods with one to one
// const create = async function() {
//   const foo = await Foo.create({ name: 'the-foo' });
//   const bar1 = await Bar.create({ name: 'some-bar', fooName: 'the-foo' });
//   const bar2 = await Bar.create({ name: 'another-bar' });
  // console.log(await foo.getBar()); // null
  // await foo.setBar(bar1);
  // console.log((await foo.getBar()).toJSON()); // 'some-bar'
  // await foo.setBar(null)
  // await foo.createBar({ name: 'yet-another-bar' });
  // const newlyAssociatedBar = await foo.getBar();
  // console.log(newlyAssociatedBar.name); // 'yet-another-bar'
  // await foo.setBar(null); // Un-associate
  // console.log((await foo.getBar())); // null
// }

// methods with one to many
const create = async function() {
  const foo = await Foo.create({ name: 'the-foo' })
  const bar1 = await Bar.create({ name: 'some-bar' })
  const bar2 = await Bar.create({ name: 'another-bar' })
  console.log(await foo.getBars())
  console.log(await foo.countBars())
  console.log(await foo.hasBar(bar1))
  await foo.addBars([bar1, bar2])
  console.log(await foo.countBars())
  const bars = (await foo.getBars())
  console.log(JSON.stringify(bars, null, 2))
  await foo.addBar(bar1)
  console.log(await foo.countBars())
  console.log(await foo.hasBar(bar1))
  await foo.removeBar(bar2)
  console.log(await foo.countBars())
  await foo.createBar({ name: 'yet-another-bar' })
  console.log(await foo.countBars())
  // await foo.setBars([])
  await foo.destroy( /* { force: true } */ )
  console.log((await Foo.findByPk(1, { paranoid: false })).toJSON())
  await foo.restore()
}


const connect = async function() {
  try {
    await db.sync({ force: true })
    await create()
    await db.close()
  } catch (error) {
    console.error(error)
  }
}

connect()

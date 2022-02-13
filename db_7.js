const Sequelize = require('Sequelize')
const db = new Sequelize('postgres://localhost:5432/sqlstuff', {
  logging: false
})

const Foo = db.define('foo', {
  name: Sequelize.STRING
}, { timestamps: false })

const Bar = db.define('bar', {
  name: Sequelize.STRING
}, { timestamps: false })

Foo.hasMany(Bar)
Bar.belongsTo(Foo)


//methods with one to one
// const create = async function() {
//   const foo = await Foo.create({ name: 'the-foo' });
//   const bar1 = await Bar.create({ name: 'some-bar' });
//   const bar2 = await Bar.create({ name: 'another-bar' });
//   console.log(await foo.getBar()); // null
//   await foo.setBar(bar1);
//   console.log((await foo.getBar()).name); // 'some-bar'
//   await foo.setBar(null)
//   await foo.createBar({ name: 'yet-another-bar' });
//   const newlyAssociatedBar = await foo.getBar();
//   console.log(newlyAssociatedBar.name); // 'yet-another-bar'
//   await foo.setBar(null); // Un-associate
//   console.log((await foo.getBar())); // null
// }

const create = async function() {
  const foo = await Foo.create({ name: 'the-foo' })
  const bar1 = await Bar.create({ name: 'some-bar' })
  const bar2 = await Bar.create({ name: 'another-bar' })
  console.log(await foo.getBars())
  console.log(await foo.countBars())
  console.log(await foo.hasBar(bar1))
  await foo.addBars([bar1, bar2])
  console.log(await foo.countBars())
  await foo.addBar(bar1)
  console.log(await foo.countBars())
  console.log(await foo.hasBar(bar1))
  await foo.removeBar(bar2)
  console.log(await foo.countBars())
  await foo.createBar({ name: 'yet-another-bar' })
  console.log(await foo.countBars())
  await foo.setBars([])
  console.log(await foo.countBars())
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

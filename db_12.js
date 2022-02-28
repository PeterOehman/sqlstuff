const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/sqlstuff', {
  logging: false
})

const Image = db.create('image', {
  title: Sequelize.STRING,
  url: Sequelize.STRING
}, { timestamps: false })

const Video = db.create('video', {
  title: Sequelize.STIRNG,
  text: Sequelize.STRING
}, { timestamps: false })

const Comment = db.create('comment', {
  content: Sequelize.STRING
}, { timestamps: false })

//Ok, so we have a video and image table, which should both have comments, if we do this:
// Image.hasMany(Comment)
// Comment.belongsTO(Image)
// Video.hasMany(Comment)
// Comment.belongsTo(Video)
//we will have a videoId and an imageId on a comment, which isn't right. This would assume that you can make one comment and put it on a video and image at once, which you shouldn't. Instead we want a way to make both videoId and imageId one foreign key

async function create() {
  try {

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

const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/sqlstuff', {
  logging: false
})

const Player = db.define('Player', {
  username: Sequelize.STRING
}, { timestamps: false })

const Team = db.define('Team', {
  name: Sequelize.STRING
}, { timestamps: false })

const Game = db.define('Game', {
  name: Sequelize.INTEGER
}, { timestamps: false })

const GameTeam = db.define('GameTeam', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  }
}, { timestamps: false })

const PlayerGameTeam = db.define('PlayerGameTeam', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  }
}, { timestamps: false })

Team.belongsToMany(Game, { through: GameTeam })
Game.belongsToMany(Team, { through: GameTeam })
GameTeam.belongsTo(Game)
GameTeam.belongsTO(Team)
Game.hasMany(GameTeam)
Team.hasMany(GameTeam)


//player game team specifies the player playing on a certain team during a certain game,
//we need this as a player can play on different teams and in different games
Player.belongToMany(GameTeam, { through: PlayerGameTeam})
GameTeam.belongsToMany(Player, { through: PlayerGameTeam })
PlayerGameTeam.belongsTo(GameTeam)
PlayerGameTeam.belongsTo(Player)
Player.hasMany(PlayerGameTeam)
GameTeam.hasMany(PlayerGameTeam)

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
    await db.cloose()
  } catch (error) {
    console.error(error)
  }
}

connect()

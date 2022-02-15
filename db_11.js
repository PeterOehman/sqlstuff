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
  name: Sequelize.STRING
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
GameTeam.belongsTo(Team)
Game.hasMany(GameTeam)
Team.hasMany(GameTeam)


//player game team specifies the player playing on a certain team during a certain game,
//we need this as a player can play on different teams and in different games
Player.belongsToMany(GameTeam, { through: PlayerGameTeam})
GameTeam.belongsToMany(Player, { through: PlayerGameTeam })
PlayerGameTeam.belongsTo(GameTeam)
PlayerGameTeam.belongsTo(Player)
Player.hasMany(PlayerGameTeam)
GameTeam.hasMany(PlayerGameTeam)

async function create() {
  try {
    await Player.bulkCreate([
      { username: 's0me0ne' },
      { username: 'empty' },
      { username: 'greenhead' },
      { username: 'not_spock' },
      { username: 'bowl_of_petunias' },
    ])

    await Game.bulkCreate([
      { name: 'The Big Clash' },
      { name: 'Winter Showdown' },
      { name: 'Sukmer Beatdown' },
    ])

    await Team.bulkCreate([
      { name: 'The Martians' },
      { name: 'The Earthlings' },
      { name: 'The Plutonians' },
    ])

    //we could do this with game.setTeams if we have variables for each game instance and team instance
    await GameTeam.bulkCreate([
      { GameId: 1, TeamId: 1 },
      { GameId: 1, TeamId: 2 },
      { GameId: 2, TeamId: 1 },
      { GameId: 2, TeamId: 3 },
      { GameId: 3, TeamId: 2 },
      { GameId: 3, TeamId: 3 },
    ])

    //to keep it short this will only be for one game
    await PlayerGameTeam.bulkCreate([
      { PlayerId: 1, GameTeamId: 3 }, //s0me0ne playing for martians in game 2
      { PlayerId: 3, GameTeamId: 3 }, //greenhead playing for martians in game 2
      { PlayerId: 4, GameTeamId: 4 }, //not_spock playing for plutonians in game 2
      { PlayerId: 5, GameTeamId: 4 }, //bowl_of_petunias playing for plutonians in game 2
    ])

    //making a query with this setup
    const game = await Game.findOne({
      where: {
        name: "Winter Showdown"
      },
      include: {
        model: GameTeam,
        include: [
          {
            model: Player,
            through: { attributes: [] }
          },
          Team
        ]
      }
    })
    console.log(JSON.stringify(game, null, 2))
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

var jsdom = require("jsdom")

function StatsScraper() {}

StatsScraper.SCRAPER_SCRIPT_URL = 'http://code.jquery.com/jquery.js'

StatsScraper.PLAYER_STATS_URL = 'http://www.omhockey.com/stats/index.php'
StatsScraper.PLAYER_STATS_COLUMNS = {
  playerName: 'playerName',
  teamName: 'teamName',
  gamesPlayed: 'gamesPlayed',
  goals: 'goals',
  assists: 'assists',
  penalties: 'penalties'
}

StatsScraper.GOALIE_STATS_URL = 'http://omhockey.com/stats/goalieStats.php'
StatsScraper.GOALIE_STATS_COLUMNS = {
  playerName: 'playerName',
  teamName: 'teamName',
  gamesPlayed: 'gamesPlayed',
  goalsAgainst: 'goalsAgainst',
  shutouts: 'shutouts',
  penalties: 'penalties'
}

StatsScraper.STANDINGS_STATS_URL = 'http://omhockey.com/standings/index.php'
StatsScraper.STANDINGS_STATS_COLUMNS = {
  teamName: 'teamName',
  gamesPlayed: 'gamesPlayed',
  wins: 'wins',
  losses: 'losses',
  ties: 'ties',
  goalsFor: 'goalsFor',
  goalsAgainst: 'goalsAgainst'
}

StatsScraper.prototype.getPageContentAndConvertToJson = function(url, htmlToJsonConverter, callback) {
  jsdom.env({
    url: url,
    scripts: [StatsScraper.SCRAPER_SCRIPT_URL],
    done: function(err, window) {
      if(err) {
        return callback(err)
      }
      htmlToJsonConverter(window.$, function(err, json) {
        window.close()
        callback(err, json)
      })
    }
  })
}

StatsScraper.prototype.getPlayerStatsAsJson = function(callback) {
  this.getPageContentAndConvertToJson(
    StatsScraper.PLAYER_STATS_URL,
    function($, done) {
      var playerStats = []
      $('div#stats tr:not(:first)').filter(function(i, row){
        // exclude the players that have no team
        return $(row).find('td:empty').length == 0
      }).each(function(i, row) {
        var playerStat = {}
        $(row).find('td').filter(function(i) {
          return i != 5 && i != 7
        }).each(function(i, cell) {
          if (i == 0) playerStat[StatsScraper.PLAYER_STATS_COLUMNS.playerName] = $(cell).html()
          else if (i == 1) playerStat[StatsScraper.PLAYER_STATS_COLUMNS.teamName] = $(cell).html()
          else if (i == 2) playerStat[StatsScraper.PLAYER_STATS_COLUMNS.gamesPlayed] = $(cell).html()
          else if (i == 3) playerStat[StatsScraper.PLAYER_STATS_COLUMNS.goals] = $(cell).html()
          else if (i == 4) playerStat[StatsScraper.PLAYER_STATS_COLUMNS.assists] = $(cell).html()
          else if (i == 5) {
            playerStat[StatsScraper.PLAYER_STATS_COLUMNS.penalties] = $(cell).html()
            playerStats.push(playerStat)
          }
        })
      })
      done(null, playerStats)
    },
    callback)
}

StatsScraper.prototype.getGoalieStatsAsJson = function(callback) {
  this.getPageContentAndConvertToJson(
    StatsScraper.GOALIE_STATS_URL,
    function($, done) {
      var goalieStats = []
      $('div#stats tr:not(:first)').each(function(i, row) {
        var goalieStat = {}
        $(row).find('td').filter(function(i) {
          return i != 4
        }).each(function(i, cell) {
          if (i == 0) goalieStat[StatsScraper.GOALIE_STATS_COLUMNS.playerName] = $(cell).html()
          else if (i == 1) goalieStat[StatsScraper.GOALIE_STATS_COLUMNS.teamName] = $(cell).html()
          else if (i == 2) goalieStat[StatsScraper.GOALIE_STATS_COLUMNS.gamesPlayed] = $(cell).html()
          else if (i == 3) goalieStat[StatsScraper.GOALIE_STATS_COLUMNS.goalsAgainst] = $(cell).html()
          else if (i == 4) goalieStat[StatsScraper.GOALIE_STATS_COLUMNS.shutouts] = $(cell).html()
          else if (i == 5) {
            goalieStat[StatsScraper.GOALIE_STATS_COLUMNS.penalties] = $(cell).html()
            goalieStats.push(goalieStat)
          }
        })
      })
      done(null, goalieStats)
    },
    callback)
}

StatsScraper.prototype.getStandingsStatsAsJson = function(callback) {
  this.getPageContentAndConvertToJson(
    StatsScraper.STANDINGS_STATS_URL,
    function($, done) {
      var standingsStats = []
      $('div#standings tr:not(:first)').each(function(i, row) {
        var standingsStat = {}
        $(row).find('td').filter(function(i) {
          return i != 5 && i != 8 && i != 9
        }).each(function(i, cell) {
          if (i == 0) standingsStat[StatsScraper.STANDINGS_STATS_COLUMNS.teamName] = $(cell).html()
          else if (i == 1) standingsStat[StatsScraper.STANDINGS_STATS_COLUMNS.gamesPlayed] = $(cell).html()
          else if (i == 2) standingsStat[StatsScraper.STANDINGS_STATS_COLUMNS.wins] = $(cell).html()
          else if (i == 3) standingsStat[StatsScraper.STANDINGS_STATS_COLUMNS.losses] = $(cell).html()
          else if (i == 4) standingsStat[StatsScraper.STANDINGS_STATS_COLUMNS.ties] = $(cell).html()
          else if (i == 5) standingsStat[StatsScraper.STANDINGS_STATS_COLUMNS.goalsFor] = $(cell).html()
          else if (i == 6) {
            standingsStat[StatsScraper.STANDINGS_STATS_COLUMNS.goalsAgainst] = $(cell).html()
            standingsStats.push(standingsStat)
          }
        })
      })
      done(null, standingsStats)
    },
    callback)
}

module.exports = StatsScraper

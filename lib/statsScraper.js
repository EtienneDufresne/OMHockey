var jsdom = require("jsdom")

function StatsScraper() {}

StatsScraper.SCRAPER_SCRIPT_URL = 'http://code.jquery.com/jquery.js'

StatsScraper.PLAYER_STATS_URL = 'http://www.omhockey.com/stats/index.php'
StatsScraper.PLAYER_STATS_COLUMNS = {
  playerName: 'playerName',
  teamName: 'teamName',
  gamesPlayed: 'gamesPlayed',
  goals: 'goals',
  assists: 'assiss',
  penalties: 'penalties'
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
      $('div#stats tr:not(:first)').each(function(i, row) {
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

module.exports = StatsScraper

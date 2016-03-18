var should = require('should')
var StatsScraper = require('../lib/statsScraper')

describe('statsScraper', function() {

  describe('getPageContentAndConvertToJson', function() {
    it('should return an error when an invalid url is specified', function(done) {
      var scraper = new StatsScraper()
      scraper.getPageContentAndConvertToJson('invalid url', null, function(err, playerStats) {
        should.exist(err)
        should.not.exist(playerStats)
        done()
      })
    })
  })

  describe('getPageContentAndConvertToJson', function() {
    it('should call html to json converter', function(done) {
      var expectedHeader = 'Player Stats'
      var scraper = new StatsScraper()
      scraper.getPageContentAndConvertToJson(StatsScraper.PLAYER_STATS_URL,
      function($, doneConversion) {
        var header = $('h1:not(:first)').text()
        header.should.eql(expectedHeader)
        doneConversion(null, { header: header })
      },
      function(err, header) {
        should.not.exist(err)
        should.exist(header)
        header.should.eql({ header: expectedHeader})
        done()
      })
    })
  })

  describe('getPlayerStatsAsJson', function() {
    it('should return player stats as json', function(done) {
      var scraper = new StatsScraper()
      scraper.getPlayerStatsAsJson(function(err, playerStats) {
        should.not.exist(err)
        should.exist(playerStats)
        playerStats.should.be.type('object')
        playerStats[0].should.be.type('object')
        playerStats[0][StatsScraper.PLAYER_STATS_COLUMNS.playerName].should.exist
        playerStats[0][StatsScraper.PLAYER_STATS_COLUMNS.teamName].should.exist
        playerStats[0][StatsScraper.PLAYER_STATS_COLUMNS.gamesPlayed].should.exist
        playerStats[0][StatsScraper.PLAYER_STATS_COLUMNS.goals].should.exist
        playerStats[0][StatsScraper.PLAYER_STATS_COLUMNS.assists].should.exist
        playerStats[0][StatsScraper.PLAYER_STATS_COLUMNS.penalties].should.exist
        done()
      })
    })
  })

  describe('getGoalieStatsAsJson', function() {
    it('should return golie stats as json', function(done) {
      var scraper = new StatsScraper()
      scraper.getGoalieStatsAsJson(function(err, goalieStats) {
        should.not.exist(err)
        should.exist(goalieStats)
        goalieStats.should.be.type('object')
        goalieStats[0].should.be.type('object')
        goalieStats[0][StatsScraper.GOALIE_STATS_COLUMNS.playerName].should.exist
        goalieStats[0][StatsScraper.GOALIE_STATS_COLUMNS.teamName].should.exist
        goalieStats[0][StatsScraper.GOALIE_STATS_COLUMNS.gamesPlayed].should.exist
        goalieStats[0][StatsScraper.GOALIE_STATS_COLUMNS.goalsAgainst].should.exist
        goalieStats[0][StatsScraper.GOALIE_STATS_COLUMNS.shutouts].should.exist
        goalieStats[0][StatsScraper.GOALIE_STATS_COLUMNS.penalties].should.exist
        done()
      })
    })
  })

  describe('getStandingsStatsAsJson', function() {
    it('should return standings stats as json', function(done) {
      var scraper = new StatsScraper()
      scraper.getStandingsStatsAsJson(function(err, standingsStats) {
        should.not.exist(err)
        should.exist(standingsStats)
        standingsStats.should.be.type('object')
        standingsStats[0].should.be.type('object')
        standingsStats[0][StatsScraper.STANDINGS_STATS_COLUMNS.teamName].should.exist
        standingsStats[0][StatsScraper.STANDINGS_STATS_COLUMNS.gamesPlayed].should.exist
        standingsStats[0][StatsScraper.STANDINGS_STATS_COLUMNS.wins].should.exist
        standingsStats[0][StatsScraper.STANDINGS_STATS_COLUMNS.losses].should.exist
        standingsStats[0][StatsScraper.STANDINGS_STATS_COLUMNS.ties].should.exist
        standingsStats[0][StatsScraper.STANDINGS_STATS_COLUMNS.goalsFor].should.exist
        standingsStats[0][StatsScraper.STANDINGS_STATS_COLUMNS.goalsAgainst].should.exist
        done()
      })
    })
  })

})

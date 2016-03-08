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
    it('should display player stats as json', function(done) {
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

})

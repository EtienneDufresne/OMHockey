var async = require('async')
var StatsScraper = require('./lib/statsScraper')
var CsvUtils = require('./lib/csvUtils')
var express = require('express')
var app = express()

var playerStatsFileName = 'PlayerStats.csv'
var goalieStatsFileName = 'GolaieStats.csv'
var standingsStatsFileName = 'StandingsStats.csv'

app.get('/player-stats', function (req, res) {
  var csvUtils = new CsvUtils()
  async.waterfall([
    function(callback) {
      var scraper = new StatsScraper()
      scraper.getPlayerStatsAsJson(function(err, playerStats) {
        if(err) return callback(err)
        callback(null, playerStats)
      })
    },
    function(playerStats, callback) {
      csvUtils.jsonToCsv(playerStats, function(err, csv) {
        if(err) return callback(err)
        callback(null, csv)
      })
    },
    function(csv, callback) {
      csvUtils.saveCsvToFile(playerStatsFileName, csv, function(err) {
        if(err) return callback(err)
        callback(null, playerStatsFileName)
      })
    }
  ], function (err, result) {
    if(err) throw err
    console.log('Player stats written to %s', result)
  })
})

app.get('/goalie-stats', function (req, res) {
  var csvUtils = new CsvUtils()
  async.waterfall([
    function(callback) {
      var scraper = new StatsScraper()
      scraper.getGoalieStatsAsJson(function(err, goalieStats) {
        if(err) return callback(err)
        callback(null, goalieStats)
      })
    },
    function(goalieStats, callback) {
      csvUtils.jsonToCsv(goalieStats, function(err, csv) {
        if(err) return callback(err)
        callback(null, csv)
      })
    },
    function(csv, callback) {
      csvUtils.saveCsvToFile(goalieStatsFileName, csv, function(err) {
        if(err) return callback(err)
        callback(null, goalieStatsFileName)
      })
    }
  ], function (err, result) {
    if(err) throw err
    console.log('Goalie stats written to %s', result)
  })
})

app.get('/standings-stats', function (req, res) {
  var csvUtils = new CsvUtils()
  async.waterfall([
    function(callback) {
      var scraper = new StatsScraper()
      scraper.getStandingsStatsAsJson(function(err, standingsStats) {
        if(err) return callback(err)
        callback(null, standingsStats)
      })
    },
    function(standingsStats, callback) {
      csvUtils.jsonToCsv(standingsStats, function(err, csv) {
        if(err) return callback(err)
        callback(null, csv)
      })
    },
    function(csv, callback) {
      csvUtils.saveCsvToFile(standingsStatsFileName, csv, function(err) {
        if(err) return callback(err)
        callback(null, standingsStatsFileName)
      })
    }
  ], function (err, result) {
    if(err) throw err
    console.log('Standings stats written to %s', result)
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})

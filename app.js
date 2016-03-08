var async = require('async')
var scraper = require('./lib/statsScraper')
var csvUtils = require('./lib/csvUtils')
var express = require('express')
var app = express()

app.get('/', function (req, res) {
  async.waterfall([
    function(callback) {
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
      var path = 'stats.csv'
      csvUtils.saveCsvToFile(path, csv, function(err) {
        if(err) return callback(err)
        callback(null, path)
      })
    }
  ], function (err, result) {
    if(err) throw err
    console.log('Player stats written to %s', result)
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})

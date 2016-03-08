var async = require('async')
var should = require('should')
var CsvUtils = require('../lib/csvUtils')
var fs = require('fs')

describe('csvUtls', function() {

  describe('jsonToCsv', function() {
    it('should return an err when invalid json is specifed', function(done) {
      var json = [{column1: 'r1c1', column2: 'r1c2'}, {column3: 'r2c1', column4: 'r2c2'}, ]
      var csvUtils = new CsvUtils()
      csvUtils.jsonToCsv(json, function(err, csv) {
        should.exist(err)
        should.not.exist(csv)
        done()
      })
    })
  })

  describe('jsonToCsv', function() {
    it('should return a two column csv with 2 data rows', function(done) {
      var json = [{column1: 'r1c1', column2: 'r1c2'}, {column1: 'r2c1', column2: 'r2c2'}, ]
      var csvUtils = new CsvUtils()
      csvUtils.jsonToCsv(json, function(err, csv) {
        should.not.exist(err)
        should.exist(csv)
        var rows = csv.split('\n')
        rows.length.should.eql(4)
        rows[0].should.eql('column1,column2')
        rows[2].should.eql('r2c1,r2c2')
        done()
      })
    })
  })

  describe('saveCsvToFile', function() {
    it('should return an error when an invalid path is specified', function(done) {
      var csvUtils = new CsvUtils()
      csvUtils.saveCsvToFile("/invalid/path", "column1, column2\nr1c1,r1c2\nr2c1,r2c2",function(err) {
        should.exist(err)
        done()
      })
    })
  })

  describe('saveCsvToFile', function() {
    it('should create a test.csv file', function(done) {
      var csvPath = 'test.csv'
      var csvData = 'column1, column2\nr1c1,r1c2\nr2c1,r2c2'
      async.waterfall([
        function(callback) {
          var csvUtils = new CsvUtils()
          csvUtils.saveCsvToFile(csvPath, csvData, function(err) {
            should.not.exist(err)
            callback(null)
          })
        },
        function(callback) {
          fs.lstat(csvPath, function(err, stats) {
            should.not.exist(err)
            should.exist(stats)
            callback(null)
          })
        },
        function(callback) {
          fs.readFile(csvPath, 'utf8', function (err,data) {
            should.not.exist(err)
            data.should.be.eql(csvData)
            callback(null)
          })
        },
        function(callback) {
          fs.unlink(csvPath, function(err) {
            should.not.exist(err)
            callback(null)
          })
        },
        function(callback) {
          fs.lstat(csvPath, function(err, stats) {
            should.exist(err)
            callback(null)
          })
        }
      ], function (err, result) {
        done()
      })
    })
  })

})

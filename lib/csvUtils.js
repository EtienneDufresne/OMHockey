var converter = require('json-2-csv')
var fs = require('fs')

function CsvUtils() {}

CsvUtils.prototype.jsonToCsv = function(json, callback) {
  converter.json2csv(json, function(err, csv) {
    if(err) {
      return callback(err)
    }
    callback(null, csv)
  })
}

CsvUtils.prototype.saveCsvToFile = function(path, csv, callback) {
  fs.writeFile(path, csv, function(err) {
      if(err) {
          return callback(err)
      }
      callback(null)
  })
}

module.exports = CsvUtils

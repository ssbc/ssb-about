var FlumeReduce = require('flumeview-reduce')
var ref = require('ssb-ref')

exports.name = 'about'
exports.version = require('./package.json').version
exports.manifest = {
  stream: 'source',
  get: 'async'
}

exports.init = function (ssb, config) {
  return ssb._flumeUse('about', FlumeReduce(1, reduce, map))
}

function reduce (result, item) {
  if (!result) result = {}
  if (item) {
    for (var target in item) {
      var valuesForId = result[target] = result[target] || {}
      for (var key in item[target]) {
        var valuesForKey = valuesForId[key] = valuesForId[key] || {}
        for (var author in item[target][key]) {
          var value = item[target][key][author]
          if (!valuesForKey[author] || value[1] > valuesForKey[author][1]) {
            valuesForKey[author] = value
          }
        }
      }
    }
  }
  return result
}

function map (msg) {
  if (msg.value.content && msg.value.content.type === 'about' && ref.isLink(msg.value.content.about)) {
    var author = msg.value.author
    var target = msg.value.content.about
    var values = {}

    for (var key in msg.value.content) {
      if (key !== 'about' && key !== 'type') {
        values[key] = {
          [author]: [msg.value.content[key], msg.value.timestamp]
        }
      }
    }

    return {
      [target]: values
    }
  }
}

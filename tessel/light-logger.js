/*
 *  periodially POSTs light levels with a timestamp
 *  usage: `$ tessel [run|push] light-logger.js <hostname> <port>`
 *
 */


var tessel = require('tessel')
,  ambientlib = require('ambient-attx4')
,  ambient = ambientlib.use(tessel.port['A'])
,  requester = require('./requester')

if (process.argv.length !== 4) {
  console.log('USAGE: `$0 <hostname> <port>`')
  process.exit(1)
}

requester.configure({
  hostname: process.argv[2],
  port: process.argv[3],
  path: '/data'
})

var intervalHandler = setInterval(postLightData, 2000)

function postLightData() {
  ambient.getLightLevel(function(err, data){
    if (err) {
      console.log('error collecting light level:', err)
      return false
    }

    requester.post({
      timestamp : Date.now(),
      lightLevel : data
    })

  })
}

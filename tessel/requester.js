/*
 *  a quick HTTP POST utility
 *
 */

var http = require('http')

var options = {
  hostname: null,
  port: null,
  path: null,
  method: 'POST',
  headers: {
    'Accept' : '*/*',
    'User-Agent' : 'tessel',
    'Content-Type' : 'application/json',
    'Connection': 'keep-alive'
  }
}

exports.configure = function(config) {
  options.hostname = config.hostname || 'localhost'
  options.port = config.port || 3000
  options.path = config.path || '/'
}

exports.post = function(data) {
  var req = http.request(options, function(res) {
    console.log('response status: ' + res.statusCode)
    res.setEncoding('utf8')
    res.on('data', function (chunk) {
      console.log(chunk.toString())
    })
  })

  req.on('error', function(e) {
    console.log('POST error:', e)
  })

  // write data to request body
  req.write(JSON.stringify(data))
  req.end();

}

/*
 *  sends a POST when a sound exceeding a certain threshold occurs
 *  usage: `$ tessel [run|push] sound-monitor.js <hostname> <port>`
 *
 */

var tessel = require('tessel')
,  ambientlib = require('ambient-attx4')
,  ambient = ambientlib.use(tessel.port['A'])
,  requester = require('./requester')
,  soundTrigger = 0.2

if (process.argv.length !== 4) {
  console.error('USAGE: `$0 <hostname> <port>`')
  process.exit(1)
}

requester.configure({
  hostname: process.argv[2],
  port: process.argv[3],
  path: '/data'
})

ambient.setSoundTrigger(soundTrigger);

ambient.on('sound-trigger', function() {

  ambient.clearSoundTrigger()

  ambient.getSoundBuffer(function(err, data){
    if (err) {
      console.log('error getting sound buffer:', err)
      return false
    }

    requester.post({
      type : 'sound-trigger',
      time : Date.now(),
      buffers : data
    })

  })

  setTimeout(function() {
    ambient.setSoundTrigger(soundTrigger)
  }, 1000)

});

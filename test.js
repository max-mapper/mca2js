var regionFile = process.argv[2] || 'worlds/nyc/r.0.0.mca'
var x = +process.argv[3] || 0
var z = +process.argv[4] || 0
var mca2js = require('./')
var fs = require('fs')
var crunch = require('voxel-crunch')

fs.readFile(regionFile, function(err, buf) {
  convert(toArrayBuffer(buf), x, z)
})

function convert(buffer, X, Z) {
  var converter = mca2js()
  converter.on('data', function(chunk) {
    var rle = crunch.encode(chunk.voxels)
    console.log(chunk.position.join('|'), rle.byteLength)
  })
  converter.on('end', function() {
    console.log('done')
  })
  converter.on('error', function(e) {
    console.log('error', e)
  })
  converter.convert(buffer, X, Z)
}

function toArrayBuffer(buffer) {
  var ab = new ArrayBuffer(buffer.length)
  var typedarray = new Uint8Array(ab)
  for (var i = 0; i < buffer.length; ++i) {
    typedarray[i] = buffer[i]
  }
  return ab
}
var mca2json = require('./')
var crunch = require('voxel-crunch')
var chunks = []
window.chunks = chunks
function handleFileSelect(evt) {
  var files = evt.target.files
  var file = files[0]
  var parts = file.name.split('.')
  if (parts[0] !== 'r' && parts[3] !== 'mca') return
  var reader = new FileReader()
  reader.onloadend = function() {
    var converter = mca2json()
    var count = 1022
    console.log(console.time('load'))
    converter.on('data', function(chunk) {
      // var rle = crunch.encode(chunk.voxels)
      chunks.push(chunk)
      console.log(count--)
      if (count === 0) console.timeEnd('load')
      // crunch.decode(rle, new Uint32Array(chunk.voxels.length))
    })
    converter.convert(reader.result, parts[1], parts[2])
  }
  reader.readAsArrayBuffer(file)
}

document.getElementById('file').addEventListener('change', handleFileSelect, false)

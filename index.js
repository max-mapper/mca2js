var mcRegion = require('minecraft-region')
var mca = require('minecraft-mca')
var stream = require('stream')
var util = require('util')
var width = 16
var height = 256

module.exports = MCA2JSON

function MCA2JSON(opts) {
  if (!(this instanceof MCA2JSON)) return new MCA2JSON(opts)
  if (!opts) opts = {}
  this.opts = opts
  var self = this
  stream.Stream.call(self)
  self.readable = true
}

util.inherits(MCA2JSON, stream.Stream)

MCA2JSON.prototype.convert = function(buf, regionX, regionZ) {
  var self = this
  var region = mcRegion(buf, regionX, regionZ)
  var chunk, lastChunk
  var voxels = newEmptyChunk()
  var opts = {ymin: 0, onVoxel: function(x, y, z, block, chunkX, chunkZ) {
    if (!chunk) chunk = {
      dimensions: [16, 256, 16],
      position: [chunkX, 0, chunkZ]
    }
    var currentChunk = chunkX + ',' + chunkZ
    if (!lastChunk) lastChunk = currentChunk
    if (currentChunk !== lastChunk) {
      chunk.voxels = voxels
      self.emit('data', chunk)
      chunk = {
        dimensions: [16, 256, 16],
        position: [chunkX, 0, chunkZ]
      }
      voxels = newEmptyChunk()
      lastChunk = currentChunk
    }
    x = Math.abs((width + x % width) % width)
    y = Math.abs((height + y % height) % height)
    z = Math.abs((width + z % width) % width)
    var idx = x + y*height + z*width*height
    voxels[idx] = block.id
  }}
  var mcaReader = mca(region, opts)
  var distance = this.opts.distance || 1
  if (this.opts.start) return mcaReader.loadNearby(this.opts.start, distance)
  if (this.opts.distance) return mcaReader.loadNearby(mcaReader.positionBounds()[0], distance)
  mcaReader.loadAll()
}

function newEmptyChunk() {
  return new Uint32Array(width * height * width)
}
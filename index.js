var mcRegion = require('minecraft-region')
var mca = require('minecraft-mca')
var stream = require('stream')
var util = require('util')

var width = 16
var height = 256
var size = 16
var length = size * size * size
var bufferType = Uint32Array

module.exports = MCA2JSON

function MCA2JSON(opts) {
  if (!(this instanceof MCA2JSON)) return new MCA2JSON(opts)
  if (!opts) opts = {}
  this.opts = opts
  this.chunks = {}
  var self = this
  stream.Stream.call(self)
  self.readable = true
}

util.inherits(MCA2JSON, stream.Stream)

MCA2JSON.prototype.chunksInChunk = function(chunkX, chunkZ) {
  var chunks = []
  for (var i = 0; i < 256/size; i++) {
    chunks.push([chunkX * size, i * size, chunkZ * size])
  }
  return chunks
}

MCA2JSON.prototype.convert = function(buf, regionX, regionZ) {
  var self = this
  var region = mcRegion(buf, regionX, regionZ)
  var lastChunk
  var opts = {ymin: 0, onVoxel: function(x, y, z, block, chunkX, chunkZ) {
    var currentChunk = chunkX + ',' + chunkZ
    if (!lastChunk) lastChunk = currentChunk
    if (currentChunk !== lastChunk) {
      var lc = lastChunk.split(',').map(function(n) { return +n })
      self.chunksInChunk(lc[0], lc[1]).map(function(c) {
        var cidx = c.join('|')
        var finishedChunk = self.chunks[cidx]
        if (!finishedChunk) return
        self.emit('data', finishedChunk)
      })
      lastChunk = currentChunk
    }
    var chunkY = Math.floor(y / size)
    y = y % size
    var chunkPos = [chunkX * size, chunkY * size, chunkZ * size]
    var chunkIDX = chunkPos.join('|')
    x = Math.abs((size + x % size) % size)
    y = Math.abs((size + y % size) % size)
    z = Math.abs((size + z % size) % size)
    var idx = x + (y * size) + (z * size * size)
    if (!self.chunks[chunkIDX]) {
      var chunk = {
        dimensions: [size, size, size],
        position: chunkPos,
        voxels: new bufferType(length)
      }
      self.chunks[chunkIDX] = chunk
    }
    self.chunks[chunkIDX].voxels[idx] = block.id
  }}
  var mcaReader = mca(region, opts)
  var distance = this.opts.distance || 1
  if (this.opts.start) {
    mcaReader.loadNearby(this.opts.start, distance)
  } else if (this.opts.distance) {
    mcaReader.loadNearby(mcaReader.positionBounds()[0], distance)
  } else {
    mcaReader.loadAll()
  }
  self.emit('end')
}

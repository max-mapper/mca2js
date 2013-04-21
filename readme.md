# mca2js

convert minecraft(tm) .mca region files to JS typed arrays

## install

```js
npm install mca2js
```

## usage

```js
var converter = require('mca2json')({start: [0,0,0], distance: 1})
converter.convert(buf, regionX, regionZ).on('data', function(chunk) {})
```

returns a readable stream that emits [voxel chunks](https://github.com/maxogden/voxel-engine#voxel-interchange-format)

## benchmarks

loading all 1024 chunks from a 5mb .mca file and storing the resulting typed arrays in memory in chrome:
total time elapsed: 38s, tab memory usage: 328mb

loading all 1024 chunks from a 5mb .mca file, running voxel-crunch on them (RLE) and storing the resulting crunched typed arrays in memory in chrome:
total time elapsed: 40s, tab memory usage: 75mb

## license

BSD

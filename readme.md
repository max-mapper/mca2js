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

## license

BSD

40s, 75mb
38s, 328mb
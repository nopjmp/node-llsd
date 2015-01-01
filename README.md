node-llsd [![npm](https://img.shields.io/npm/l/node-llsd.svg)]() [![npm](https://img.shields.io/npm/v/node-llsd.svg)]()
=========

LLSD parser in node using node-expat

[![david](https://david-dm.org/nopjmp/node-llsd.svg)]()

###Example Usage###
```
llsd = require('node-llsd');

llsd.parse('<llsd><undef /></llsd>', function(json) {
  console.log(json);
}, function(e) {
  console.log(e);
})
```

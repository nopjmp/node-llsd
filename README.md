node-llsd [![npm](https://img.shields.io/npm/l/node-llsd.svg)]() [![npm](https://img.shields.io/npm/v/node-llsd.svg)]()
=========

[![David](https://img.shields.io/david/nopjmp/node-llsd.svg)]()

LLSD parser in node using node-expat. Pull Requests are accepted and encouraged.

###Example Usage###
```
var llsd = require('node-llsd');

llsd.parse('<llsd><undef /></llsd>', function(json) {
  console.log(json);
}, function(e) {
  console.log(e);
})
```

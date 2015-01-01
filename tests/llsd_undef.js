var tape = require('tape')

var llsd = require('../index.js');

tape('undef', function(t) {
  t.plan(2)
  llsd.parse("<llsd><undef /></llsd>", function(data) {
    t.equal(typeof data, 'object', "object")
    t.equal(data.length, 0, "array length")
  }, function(e) {
    t.fail(e)
  })
})

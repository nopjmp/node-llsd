var tape = require('tape')

var llsd = require('../index')

var test_data = "<llsd>\
<array>\
<integer>1</integer>\
<integer>2</integer>\
<integer>3</integer>\
</array>\
</llsd>";

tape('array', function(t) {
  t.plan(1)
  llsd.parse(test_data, function(r) {
    t.same(r, [1, 2, 3])
  }, function(e) {
    t.fail(e)
  })
})

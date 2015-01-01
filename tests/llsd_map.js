var tape = require('tape')

var llsd = require('../index')

var test_data = "<llsd>\
<map>\
<key>One</key>\
<integer>1</integer>\
<key>Two</key>\
<integer>2</integer>\
<key>Three</key>\
<integer>3</integer>\
</map>\
</llsd>";

tape('map', function(t) {
  t.plan(1)
  llsd.parse(test_data, function(r) {
    t.same(r, {
      One: 1,
      Two: 2,
      Three: 3
    })
  }, function(e) {
    t.fail(e)
  })
})

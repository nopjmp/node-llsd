import test from "tape";
import * as llsd from "../src"

let test_data = "<llsd>\
<map>\
<key>One</key>\
<integer>1</integer>\
<key>Two</key>\
<integer>2</integer>\
<key>Three</key>\
<integer>3</integer>\
</map>\
</llsd>";

test('map', function (t) {
  t.plan(1)
  llsd.parseXML(test_data)
    .then(r => {
      t.same(r, {
        One: 1,
        Two: 2,
        Three: 3
      })
    })
    .catch(e => {
      t.fail(e)
    })
})

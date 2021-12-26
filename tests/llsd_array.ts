import test from "tape";
import * as llsd from "../src"

let test_data = "<llsd>\
<array>\
<integer>1</integer>\
<integer>2</integer>\
<integer>3</integer>\
</array>\
</llsd>";

test('array', function(t) {
  t.plan(1)
  llsd.parseXML(test_data, function(r) {
    t.same(r, [1, 2, 3])
  }, function(e: any) {
    t.fail(e)
  })
})

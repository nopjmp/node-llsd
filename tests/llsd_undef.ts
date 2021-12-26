import test from "tape";
import * as llsd from "../src"

test('undef', function(t) {
  t.plan(2)
  llsd.parseXML("<llsd><undef /></llsd>", function(data) {
    t.equal(typeof data, 'object', "object")
    t.equal(data.length, 0, "array length")
  }, function(e: any) {
    t.fail(e)
  })
})

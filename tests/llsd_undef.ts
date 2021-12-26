import test from "tape";
import * as llsd from "../src"

test('undef', function (t) {
  t.plan(2)
  llsd.parseXML("<llsd><undef /></llsd>")
    .then(data => {
      t.equal(typeof data, 'object', "object")
      t.equal(data.length, 0, "array length")
    })
    .catch(e => {
      t.fail(e)
    })
})

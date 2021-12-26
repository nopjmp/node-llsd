import test from "tape";
import * as llsd from "../src"

let test_data = `<?xml version="1.0" encoding="UTF-8"?>
<llsd>
	<map>
	  <key>region_id</key>
	    <uuid>67153d5b-3659-afb4-8510-adda2c034649</uuid>
	  <key>scale</key>
	    <string>one minute</string>
	  <key>simulator statistics</key>
	  <map>
	    <key>time dilation</key><real>0.9878624</real>
	    <key>sim fps</key><real>44.38898</real>
	  </map>
	</map>
</llsd>`

test('example', function (t) {
    t.plan(1)
    llsd.parseXML(test_data)
        .then(r => {
            t.same(r, {
                region_id: '67153d5b-3659-afb4-8510-adda2c034649',
                scale: 'one minute',
                'simulator statistics': {
                    'time dilation': 0.9878624,
                    'sim fps': 44.38898
                }
            })
        })
        .catch(e => {
            t.fail(e)
        })
})
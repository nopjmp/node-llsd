import test from "tape";
import * as llsd from "../src"

let asset = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\
<llsd>\
<array>\
<map>\
<key>creation-date</key>\
<date>2007-03-15T18:30:18Z</date>\
<key>creator-id</key>\
<uuid>3c115e51-04f4-523c-9fa6-98aff1034730</uuid>\
</map>\
<string>0123456789</string>\
<string>Where's the beef?</string>\
<string>Over here.</string>\
<string>default\
{\
	state_entry()\
{\
	llSay(0, \"Hello, Avatar!\");\
}\
\
touch_start(integer total_number)\
{\
	llSay(0, \"Touched.\");\
}\
}</string>\
<binary encoding='base64'>AABAAAAAAAAAAAIAAAA//wAAP/8AAADgAAAA5wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkAAAAZAAAAAAAAAAAAAAAZAAAAAAAAAABAAAAAAAAAAAAAAAAAAAABQAAAAEAAAAQAAAAAAAAAAUAAAAFAAAAABAAAAAAAAAAPgAAAAQAAAAFAGNbXgAAAABgSGVsbG8sIEF2YXRhciEAZgAAAABcXgAAAAhwEQjRABeVAAAABQBjW14AAAAAYFRvdWNoZWQuAGYAAAAAXF4AAAAIcBEI0QAXAZUAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</binary>\
</array>\
</llsd>"

let script = "default\
{\
	state_entry()\
{\
	llSay(0, \"Hello, Avatar!\");\
}\
\
touch_start(integer total_number)\
{\
	llSay(0, \"Touched.\");\
}\
}"

let binary =
  "AABAAAAAAAAAAAIAAAA//wAAP/8AAADgAAAA5wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkAAAAZAAAAAAAAAAAAAAAZAAAAAAAAAABAAAAAAAAAAAAAAAAAAAABQAAAAEAAAAQAAAAAAAAAAUAAAAFAAAAABAAAAAAAAAAPgAAAAQAAAAFAGNbXgAAAABgSGVsbG8sIEF2YXRhciEAZgAAAABcXgAAAAhwEQjRABeVAAAABQBjW14AAAAAYFRvdWNoZWQuAGYAAAAAXF4AAAAIcBEI0QAXAZUAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"

test('asset', function(t) {
  t.plan(7)

  llsd.parseXML(asset,
    function(data) {
      t.equal(data[0]['creation-date'].toISOString(),
        "2007-03-15T18:30:18.000Z",
        "creation-date")
      t.equal(data[0]['creator-id'],
        "3c115e51-04f4-523c-9fa6-98aff1034730", "creator-id")
      t.equal(data[1], "0123456789")
      t.equal(data[2], "Where's the beef?")
      t.equal(data[3], "Over here.")
      t.equal(data[4], script)
      t.equal(data[5], binary)
    },
    function(e: any) {
      t.fail(e)
      t.end()
    }
  )
})

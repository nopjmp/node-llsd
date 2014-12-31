var llsd_parser = require('../index.js');
new llsd_parser.Parser(console.error, console.log).end(
	"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\
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
)

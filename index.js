var expat = require('node-expat')

var llsdp = require('./types/llsd.js')
var array = require('./types/array.js')
var map = require('./types/map.js')
var convert = require('./types/convert.js')

var helpers = require('./lib/helpers.js')

//undef is an array to give is some value, might want to make it null.
var generateSubParser = function(name, attrs, subparser, state) {
  switch (name) {
    case 'llsd':
      return new llsdp()
      break
    case 'undef':
    case 'array':
      return new array(subparser)
      break
    case 'map':
      return new map(subparser)
      break
    case 'key':
      state.in_data = true
      return new subparser.key()
      break
    case 'integer':
      state.in_data = true
      return new convert(0, subparser, helpers.stringToInteger)
      break
    case 'binary':
      state.in_data = true
      return new convert("", subparser, helpers.convertBase64.bind(undefined,
        attrs.encoding))
    case 'uri':
    case 'string':
      state.in_data = true
      return new convert("", subparser, helpers.noop)
      break
    case 'real':
      state.in_data = true
      return new convert(0.0, subparser, Float.parseFloat)
      break
    case 'boolean':
      state.in_data = true
      return new convert(false, subparser, helpers.stringToBoolean)
      break
    case 'uuid':
      //TODO: use node-uuid to check validity
      state.in_data = true
      return new convert("00000000-0000-0000-0000-000000000000", subparser,
        helpers.noop)
      break
    case 'date':
      state.in_data = true
      return new convert(new Date(), subparser, helpers.stringToDate)
      break
    default:
      throw new Error("unimplemented: " + name)
  }
}

exports.Parser = function(callback, error) {
  var self = this
  this.state = {
    working: false,
    in_data: false,
    tag_stack: []
  }
  this.subparser = null // current subparser

  xml_parser = new expat.Parser('UTF-8')
  xml_parser.on('startElement', function(name, attrs) {
    console.log(name)
    if (self.state.in_data) {
      throw new Error("array tag inside data tag")
      xml_parser.stop()
    }
    self.state.tag_stack.push(name)
    if (name === 'llsd') {
      if (self.state.working) {
        throw new Error("cannot parse another llsd")
        xml_parser.stop()
      } else {
        self.state.working = true
      }
    }
    //generates a recursive call tree to translate llsd to json
    try {
      self.subparser = generateSubParser(name, attrs, self.subparser,
        self.state)
    } catch (e) {
      error(e)
      xml_parser.stop()
    }
  })

  xml_parser.on('endElement', function(name) {
    var last_name = self.state.tag_stack.pop()

    if (last_name !== name) {
      throw new Error("unmatched tag: " + name + "!=" + last_name)
      xml_parser.stop()
    }

    if (name === "llsd") {
      self.state.working = false
      xml_parser.stop()

      //return the data after the llsd tag (array or map)
      callback(self.subparser.data)
    }
    self.subparser = self.subparser.end()

    //always reset this to false in endElement to reset the check
    self.state.in_data = false
  })

  xml_parser.on('text', function(text) {
    if (self.state.in_data) {
      self.subparser.newData(text)
    } else {
      throw new Error("got data in non-data section")
      xml_parser.stop()
    }
  })

  xml_parser.on('error', error)

  xml_parser.on('end', function() {
    if (self.state.working) {
      error("end before finding </llsd>")
    }
  })

  this._called_parse = false
  this.end = function(data) {
    if (self._called_parse) {
      error("called parse twice");
    } else {
      xml_parser.end(data)
    }
  }
}

exports.parse = function(data, callback, error) {
  var p = new exports.Parser(callback, error);
  p.end(data);
}

const htmlparser2 = require("htmlparser2");

const llsdp = require('./types/llsd')
const array = require('./types/array')
const map = require('./types/map')
const convert = require('./types/convert')

const helpers = require('./lib/helpers')

//contacts for the parser
const MAX_DEPTH = 32 //prevent infinate recursion

//TODO: currently undef is an alias for array, it would be preferred to make it some kind of 'null' type.
const generateSubParser = function(name, attrs, subparser, state) {
  state.depth = state.depth + 1
  if (state.depth > MAX_DEPTH) {
    throw new Error("max depth of " + MAX_DEPTH + " was reached.")
  }
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


exports.Parser = function(callback, errorCallback) {
  let self = this
  this.state = {
    depth: 1, //calculation is skipped on llsd
    working: false,
    in_data: false,
    tag_stack: []
  }
  this.subparser = null // current subparser
  this.parsed_data = null
  xml_parser = new htmlparser2.Parser({
    onopentag(name, attrs) {
      if (self.state.in_data) {
        throw new Error("array tag inside data tag")
      }
      self.state.tag_stack.push(name)
      if (name === 'llsd') {
        if (self.state.working) {
          throw new Error("cannot parse another llsd")
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

      }
    },
    ontext(text) {
      if (self.state.in_data) {
        self.subparser.newData(text)
      } else {
        throw new Error("got data in non-data section")
      }
    },
    onclosetag(name) {
      let last_name = self.state.tag_stack.pop()

      if (last_name !== name) {
        throw new Error("unmatched tag: " + name + "!=" + last_name)
      }

      if (name === "llsd") {
        self.state.working = false

        // return the data after the llsd tag (array or map)
        self.parsed_data = self.subparser.data
      }
      self.subparser = self.subparser.end()

      //always reset this to false in endElement to reset the check
      self.state.in_data = false
    },
    onerror(error) {
      errorCallback(error)
    },
    onend() {
      if (self.state.working) {
        error("end before finding </llsd>")
      } else if (self.parsed_data) {
        callback(self.parsed_data)
        self.parsed_data = null;
      }
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

import { Parser } from "htmlparser2";
import { Handler } from "htmlparser2/lib/Parser";
import { convertBase64, noop, stringToBoolean, stringToDate, stringToInteger } from "./helpers";
import { LLSDArrayParser, LLSDMapKeyParser, LLSDMapParser, LLSDTypeConvertParser, LLSDTypeParser, TypeParser } from "./type_parser";

//contacts for the parser
const MAX_DEPTH = 32 //prevent infinate recursion

interface ParserState {
  depth: number; //calculation is skipped on llsd
  working: boolean; in_data: boolean; tag_stack: any[];
};

type ParsedData = any | null;

type ParserCallback = (data: ParsedData) => void
type ParserErrorCallback = (e: Error | string) => void

//TODO: currently undef is an alias for array, it would be preferred to make it some kind of 'null' type.
export class LLSDParser implements Partial<Handler> {
  state: ParserState
  subparser: TypeParser | null | undefined;
  parsed_data: ParsedData;
  private _called_parse: any;
  xml_parser: Parser;
  errorCallback: ParserErrorCallback;
  callback: ParserCallback;

  constructor(callback: ParserCallback, errorCallback: ParserErrorCallback) {
    this.callback = callback
    this.errorCallback = errorCallback

    this.state = {
      depth: 1,
      working: false,
      in_data: false,
      tag_stack: []
    }
    this.subparser = new LLSDTypeParser() // current subparser
    this.parsed_data = null

    this.xml_parser = new Parser(this, { xmlMode: true, lowerCaseTags: true, lowerCaseAttributeNames: true })

    this._called_parse = false
  }

  onopentag(name: string, attrs: {
    [s: string]: string;
}) {
    if (this.state.in_data) {
      throw new Error("array tag inside data tag")
    }
    this.state.tag_stack.push(name)
    if (name === 'llsd') {
      if (this.state.working) {
        throw new Error("cannot parse another llsd")
      } else {
        this.state.working = true
      }
    }
    //generates a recursive call tree to translate llsd to json
    try {
      this.subparser = this.generateSubParser(name, attrs)
    } catch (e: any) {
      this.errorCallback(e)
      this.xml_parser.end()
    }
  }

  ontext(text: string) {
    if (this.state.in_data) {
      this.subparser?.newData(text)
    } else if (!/\s+/.test(text)) {
      throw new Error("got data in non-data section")
    }
  }

  onclosetag(name: string) {
    let last_name = this.state.tag_stack.pop()

    if (last_name !== name) {
      throw new Error("unmatched tag: " + name + "!=" + last_name)
    }

    if (name === "llsd") {
      this.state.working = false

      // return the data after the llsd tag (array or map)
      this.parsed_data = this.subparser?.data
      this.xml_parser.end()
    }
    this.subparser = this.subparser?.end()

    //always reset this to false in endElement to reset the check
    this.state.in_data = false
  }

  onerror(error: Error) {
    this.errorCallback(error)
  }

  onend() {
    if (this.state.working) {
      this.errorCallback("end before finding </llsd>")
    } else if (this.parsed_data) {
      this.callback(this.parsed_data)
      this.parsed_data = null;
    }
  }

  generateSubParser(name: string, attrs: any): TypeParser | null | undefined {
    if (!this.subparser) {
      return undefined;
    }

    this.state.depth = this.state.depth + 1
    if (this.state.depth > MAX_DEPTH) {
      throw new Error("max depth of " + MAX_DEPTH + " was reached.")
    }
    switch (name) {
      case 'llsd':
        return new LLSDTypeParser()
        break
     case 'undef':
      case 'array':
        return new LLSDArrayParser(this.subparser)
        break
      case 'map':
        return new LLSDMapParser(this.subparser)
        break
      case 'key':
        this.state.in_data = true
        return new LLSDMapKeyParser(this.subparser as LLSDMapParser) // TODO: check previous subparser
        break
      case 'integer':
        this.state.in_data = true
        return new LLSDTypeConvertParser(0, this.subparser, stringToInteger)
        break
      case 'binary':
        this.state.in_data = true
        return new LLSDTypeConvertParser("", this.subparser, convertBase64.bind(undefined,
          attrs.encoding))
      case 'uri':
      case 'string':
        this.state.in_data = true
        return new LLSDTypeConvertParser("", this.subparser, noop)
        break
      case 'real':
        this.state.in_data = true
        return new LLSDTypeConvertParser(0.0, this.subparser, parseFloat)
        break
      case 'boolean':
        this.state.in_data = true
        return new LLSDTypeConvertParser(false, this.subparser, stringToBoolean)
        break
      case 'uuid':
        //TODO: use node-uuid to check validity
        this.state.in_data = true
        return new LLSDTypeConvertParser("00000000-0000-0000-0000-000000000000", this.subparser,
          noop)
        break
      case 'date':
        this.state.in_data = true
        return new LLSDTypeConvertParser(new Date(), this.subparser, stringToDate)
        break
      default:
        throw new Error("unimplemented: " + name)
    }
  }

  end(data: any) {
    if (this._called_parse) {
      this.errorCallback("called parse twice");
    } else {
      this.xml_parser.end(data)
    }
  }
}

export function parseXML(data: string, callback: ParserCallback, error: ParserErrorCallback) {
  var p = new LLSDParser(callback, error);
  p.end(data);
}

export interface TypeParser {
    data: any;
    newData(text: any): void
    end(): TypeParser | null
}

export class LLSDTypeParser implements TypeParser {
    data: any;
    constructor() {
        this.data = null
    }

    newData(text: any) {
        this.data = text
    }

    end() {
        return null
    }
}

export class LLSDArrayParser implements TypeParser {
    data: any[];
    prev: TypeParser;

    constructor(prev: TypeParser) {
        this.data = []
        this.prev = prev
    }

    newData(text: any) {
        this.data.push(text)
    }

    end() {
        this.prev.newData(this.data)
        return this.prev
    }
}

export type ConvertCallback = (text: any) => void
export class LLSDTypeConvertParser implements TypeParser {
    data: any;
    prev: TypeParser;
    convert: ConvertCallback;
    constructor(init: any, prev: TypeParser, convert: ConvertCallback) {
        this.data = init
        this.prev = prev
        this.convert = convert
    }

    newData(text: any) {
        this.data = this.convert(text)
    }

    end() {
        this.prev.newData(this.data)
        return this.prev
    }
}

export class LLSDMapParser implements TypeParser {
    data: {};
    key: any;
    prev: TypeParser;
    constructor(prev: TypeParser) {
        this.data = {}
        this.key = null
        this.prev = prev
    }

    newKey(text: any) {
        this.key = text
    }

    newData(text: any): void {
        this.data = {...this.data, [this.key]: text}
    }

    end(): TypeParser | null {
        this.prev.newData(this.data)
        return this.prev
    }
}

export class LLSDMapKeyParser implements TypeParser {
    parent: LLSDMapParser;
    data: any;
    constructor(parent: LLSDMapParser) {
        this.parent = parent
        this.data = null
    }

    newData(text: any) {
        this.parent.newKey(text)
    }

    end() {
        return this.parent
    }
}
  
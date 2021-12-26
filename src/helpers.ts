import * as uuid from "uuid"

export function noop(a: any) {
	return a
}

export function stringToInteger(string: string) {
	return Number(string);
}
export function stringToBoolean(string: string) {
	switch (string.toLowerCase()) {
		case "true":
		case "yes":
		case "1":
			return true;
		case "false":
		case "no":
		case "0":
		case null:
			return false;
		default:
			return Boolean(string);
	}
}

export function stringToDate(string: string) {
	return new Date(string);
}

export function convertBase64(encoding: string, data: string) {
	// don't support base85, but never seen it used
	if (encoding === "base16") {
		var buf = Buffer.from(data, "hex")
		return buf.toString("base64")
	}
	return data
}

export function parseLLSDReal(str: string): number {
	// Workaround parseFloat
	// NOTE: these will still convert to the normal values using the built in JSON functions
	switch (str) {
		case '-Infinity':
			return -Infinity;
		case '-Zero':
			return -0.0;
		case '0.0':
			return 0.0;
		case '+Zero':
			return 0.0;
		case 'Infinity':
		case '+Infinity':
			return Infinity;
		case 'NaNS':
			return NaN;
		case 'NaNQ':
			return NaN;
	}
	return parseFloat(str);
}

export function checkUUID(str: string): string {
	// NOTE(http://wiki.secondlife.com/wiki/UUID): SL uses Version 4 UUIDs as defined in RFC-4122, though there are some that are not V4.
	if (uuid.validate(str)) {
		return str
	} else {
		throw new TypeError(str + " is not a valid uuid")
	}
}
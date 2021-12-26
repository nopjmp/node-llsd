
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

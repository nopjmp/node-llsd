exports.noop = function(a) {
  return a
}
exports.stringToInteger = function(string) {
  return Number(string);
}
exports.stringToBoolean = function(string) {
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

exports.stringToDate = function(string) {
  return new Date(string);
}

exports.convertBase64 = function(encoding, data) {
  // don't support base85, but never seen it used
  if (encoding === "base16") {
    var buf = new Buffer(data, "hex");
    return buf.toString("base64")
  }
  return data
}

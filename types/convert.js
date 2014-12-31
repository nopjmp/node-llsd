module.exports = function(init, prev, convert) {
  var self = this;
  this.data = init;
  this.newData = function (text) {
    self.data = convert(text)
  }
  this.end = function() {
    prev.newData(self.data)
    return prev
  }
}

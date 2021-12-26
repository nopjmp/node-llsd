module.exports = function(prev) {
  let self = this;
  this.data = "";
  this.newData = function (text) {
    self.data = text
  }
  this.end = function() {
    prev.newData(self.data)
    return prev
  }
}

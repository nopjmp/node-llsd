module.exports = function(prev){
  var self = this;
  this.data = []
  this.newData = function(text) {
    self.data.push(text)
  }
  this.end = function() {
    prev.newData(self)
    return prev
  }
}

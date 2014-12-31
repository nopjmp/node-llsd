module.exports = function() {
  var self = this
  this.data = null
  this.newData = function (data) {
    self.data = data
  }
  this.end = function() { return null }
}

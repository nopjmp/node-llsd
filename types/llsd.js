module.exports = function() {
  let self = this
  this.data = null
  this.newData = function (data) {
    self.data = data
  }
  this.end = function() { return null }
}

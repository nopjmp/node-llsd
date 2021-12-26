module.exports = function(prev){
  let self = this
  this.previous = prev
  this.data = {}
  this._key = null
  this.key = function() {
    this.newData = function(text) {
      self._key = text;
    }
    this.end = function() {
      return self;
    }
  }
  this.newData = function(data) {
    self.data[self._key] = data;
  }
  this.end = function() {
    prev.newData(self.data)
    return prev
  }
}

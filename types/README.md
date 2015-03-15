Types
=====

This directory contains the definitions of different data types for LLSD.

For more information on each data type, please refer to the [documentation on the Second Life wiki](http://wiki.secondlife.com/wiki/LLSD)

Here is how most of the types should be formatted for the recursive parser to work properly.

	module.exports = function(prev){
	  var self = this;
	  // put data structure here
	  this.newData = function(text) {
	  	// put data structure manipulation herew
	  }
	  this.end = function() {
	    prev.newData(self.data)
	    return prev
	  }
	}

var utility = require('utility');
var CONSTANT = require('constant');

var colonyDirector = {
    run: function() {
        colonyDirector.memoryCheck()
    },

    memoryCheck: function() {
        utility.runForAllFlags(colonyDirector.memoryCheckForFlag)
    },

    memoryCheckForFlag: function(flag) {

    },

}
module.exports = colonyDirector

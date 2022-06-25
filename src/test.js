// Object.assign(exports, {
//     QUARANTINED: "quarantined"
// })


var test = {
    run: function(){
        RawMemory.setActiveSegments([0,1,2,3,4,5,6,7,8,9])
        console.log(RawMemory.segments[0])
        RawMemory.segments[0] = JSON.stringify({test: 'hello'})
        // console.log(RawMemory.get())
    }
}


var test2 = {
    run: function() {
        RawMemory.setActiveForeignSegment()
    }
}

module.exports = test

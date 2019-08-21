export default AFRAME.registerComponent('testcomponent', {
    schema: {},
    init: function () {
        console.log('test component')
     },
    update: function (oldData) { },
    tick: function (time, timeDelta) { },
    tock: function (time, timeDelta, camera){ },
    remove: function () { },
    pause: function () { },
    play: function () { },
    updateSchema: function(data) { }
});
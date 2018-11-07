let Game = require('Game');

cc.Class({
    extends: cc.Component,

    properties: {
        mask: cc.Node
    },

    onLoad: function () {},

    onEnable: function () {
        this.mask.on('touchstart', function (event) {
            event.stopPropagation();
        });
        this.mask.on('touchend', function (event) {
            event.stopPropagation();
        });
    },

    onDisable: function () {
        this.mask.off('touchstart', function (event) {
            event.stopPropagation();
        });
        this.mask.off('touchend', function (event) {
            event.stopPropagation();
        });
    }
});

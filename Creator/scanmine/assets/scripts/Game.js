let Game = cc.Class({
    extends: cc.Component,

    properties: {
        tileUI: cc.Node,
        sfTiles: {
        	default: [],
        	type: cc.SpriteFrame
        }
    },

    statics: {
        instance: null
    },

    onLoad () {
        Game.instance = this;
    }

});

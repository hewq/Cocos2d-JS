let Game = cc.Class({
    extends: cc.Component,

    properties: {
        time: cc.Label,
        sfTiles: {
        	default: [],
        	type: cc.SpriteFrame
        },
        wrapMine: cc.Node,
        dialogFail: cc.Node,
        dialogSuccess: cc.Node,
        dialogShare: cc.Node,
        dialogBg: cc.Node,
        dialogRule: cc.Node,
        dialogTips: cc.Node,
        rootNode: cc.Node
    },

    statics: {
        instance: null
    },

    onLoad () {
        Game.instance = this;
        console.log('game onload');
    }

});

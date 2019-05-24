let wxGame = require('WxGameComm');

cc.Class({
    extends: cc.Component,

    properties: {
        btnRankNode: cc.Node,
        btnBookNode: cc.Node,
        btnShareNode: cc.Node,
        sfTitle: {
            default: [],
            type: cc.SpriteFrame
        },
        titleNode: cc.Node,
        levelLabel: cc.Label
    },

    onLoad () {
        this.titleNode.getComponent(cc.Sprite).spriteFrame = this.sfTitle[localStorage.getItem('title')];
        this.levelLabel.string = localStorage.getItem('level');
        this.btnRankNode.on('touchend', function () {
            localStorage.setItem('whereToRank', 'result');
            cc.director.loadScene('rank');
        });
        this.btnBookNode.on('touchend', function () {

        });
        this.btnShareNode.on('touchend', function () {
            localStorage.setItem('toPlayGame', false);
            localStorage.setItem('closeTime', new Date().getTime());
            wxGame.shareAppMessage();
        });
    }
});

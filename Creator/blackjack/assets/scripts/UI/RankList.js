const players = require('PlayerData').players;

cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        prefabRankItem: cc.Prefab,
        rankCount: 0
    },

    onLoad: function () {
        this.content = this.scrollView.content;
        this.populateList();
    },

    populateList: function () {
        for (let i = 0; i < this.rankCount; ++i) {
            let playerInfo = players[i];
            let item = cc.instantiate(this.prefabRankItem);
            item.getComponent('RankItem').init(i, playerInfo);
            this.content.addChild(item);
        }
    },

    update: function (dt) {

    },
});

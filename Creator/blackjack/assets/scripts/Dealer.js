let Actor = require('Actor');
let Utils = require('Utils');

cc.Class({
    extends: Actor,

    properties: {
        // 手上最接近 21 点的点数（有可能超过 21 点）
        bestPoint: {
            get: function () {
                let cards = this.holeCard ? [this.holeCard].concat(this.cards) : this.cards;
                let minMax = Utils.getMinMaxPoint(cards);
                return minMax.max;
            },
            override: true
        }
    },

    init: function () {
        this._super();
        this.renderer.initDealer();
    },

    // 返回是否要牌
    wantHit: function () {
        let Game = require('Game');
        let Types = require('Types');

        let bestPoint = this.bestPoint;

        // 已经最大点数
        if (bestPoint === 21) {
            return false;
        }

        // 不论抽到什么牌肯定不会爆，那就接着抽
        if (bestPoint <= 21 - 10) {
            return true;
        }

        let player = Game.instance.player;
        let outcome = Game.instance._getPlayerResult(player, this);

        switch (outcome) {
            case Types.Outcome.Win:
                return true;
            case Types.Outcome.Lose:
                return false;
        }

        return this.bestPoint < 17;
    },
});

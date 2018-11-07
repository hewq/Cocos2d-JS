let Actor = require('Actor');

cc.Class({
    extends: Actor,

    init: function () {
        this._super();
        this.labelStake = this.renderer.labelStakeOnTable;
        this.stakeNum = 0;
    },

    reset: function () {
        this._super();
        this.resetStake();
    },

    addCard: function (card) {
        this._super(card);
    },

    addStake: function (delta) {
        this.stakeNum += delta;
        this.updateStake(this.stakeNum);
    },

    resetStake: function (delta) {
        this.stakeNum = 0;
        this.updateStake(this.stakeNum);
    },

    updateStake: function (number) {
        this.labelStake.string = number;
    },
});

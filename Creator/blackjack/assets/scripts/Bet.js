let Game = require('Game');

cc.Class({
    extends: cc.Component,

    properties: {
        chipPrefab: cc.Prefab,
        btnChips: {
            default: [],
            type: cc.Node
        },
        chipValues: {
            default: [],
            type: 'Integer'
        },
        anchorChipToss: cc.Node
    },

    init: function () {
        this._registerBtns();
    },

    _registerBtns: function () {
        let self = this;
        let registerBtn = function (index) {
            self.btnChips[i].on('touchstart', function (event) {
                if (Game.instance.addStake(self.chipValues[index])) {
                    self.playAddChip();
                }
            }, this);
        };

        for (let i = 0; i < self.btnChips.length; ++i) {
            registerBtn(i);
        }
    },

    playAddChip: function () {
        let startPos = cc.v2((Math.random() - 0.5) * 2 * 50, (Math.random() - 0.5) * 2 * 50);
        let chip = cc.instantiate(this.chipPrefab);
        this.anchorChipToss.addChild(chip);
        chip.setPosition(startPos);
        chip.getComponent('TossChip').play();
    },

    resetChips: function () {
        Game.instance.resetStake();
        Game.instance.info.enabled = false;
        this.resetTossedChips();
    },

    resetTossedChips: function () {
        this.anchorChipToss.removeAllChildren();
    },
});

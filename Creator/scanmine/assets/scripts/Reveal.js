let Game = require('Game');

cc.Class({
    extends: cc.Component,

    properties: {
        clickTimes: 0, // 检测单击还是双击
        btnTiles: {
            default: null,
            type: cc.Prefab
        }
    },

    init () {
        this._registerTiles();
    },

    _registerTiles () {
        let self = this;
        let registerTile = (index) => {
            self.btnTiles[index].on('touchstart', (event) => {
                this.clickTimes++;
            }, this);

            self.btnTiles[index].on('touchend', (event) => {
                setTimeout(() => {
                    if (this.clickTimes === 1) {
                        self.btnTiles[index].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[1];
                        this.clickTimes = 0;
                    } else if (this.clickTimes === 2) {
                        self.btnTiles[index].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[0];
                        this.clickTimes = 0;
                    }
                }, 400);
            }, this);
        }

        for (let i = 0; i < self.btnTiles.length; i++) {
            registerTile(i);
        }
    },
});

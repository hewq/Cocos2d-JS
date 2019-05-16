let Game = require('Game');

cc.Class({
    extends: cc.Component,

    properties: {
        clickTimes: 0,
       tiles: {
            default: null,
            type: cc.Prefab
       }
    },

    _init () {
        let tile = null;
        let self = this;
        for (let i = 0; i < 5; i++) {
            tile = cc.instantiate(this.tiles);
            tile.parent = this.node;
            tile.y = i * -100;
            cc.log(tile.type);
            (function (tile) {
                tile.on('touchstart', function (event) {
                    self.clickTimes++;
                }, this);

                tile.on('touchend', function (event) {
                    setTimeout(() => {
                        if (self.clickTimes === 1) {
                            tile.getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[1];
                            self.clickTimes = 0;
                        } else if (self.clickTimes === 2) {
                            tile.getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[0];
                            self.clickTimes = 0;
                        }
                    }, 200);
                }, this);
            })(tile);
        }
    },

    onLoad () {
        this._init();
    }
});

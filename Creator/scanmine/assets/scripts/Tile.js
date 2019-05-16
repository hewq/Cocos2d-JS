let Game = require('Game');
let MineInfo = require('MineInfo').mineInfo;

cc.Class({
    extends: cc.Component,

    properties: {
        clickTimes: 0,
        tiles: {
            default: null,
            type: cc.Prefab
        },
        mineTile: []
    },

    _init () {
        this._getMine();
        this._setTile();
    },

    _setTile () {
        let tile = null;
        let self = this;
        for (let i = 0; i < MineInfo.pos.length; i++) {
            tile = cc.instantiate(this.tiles);
            tile.parent = this.node;
            tile.x = MineInfo.pos[i].x;
            tile.y = MineInfo.pos[i].y;
            if (self.mineTile.includes(i)) {
                tile.type = 7;
                cc.log(i);
                cc.log(self._getRelation(i));
            } else {
                tile.type = 0;
            }
            (function (tile) {
                tile.on('touchstart', function (event) {
                    self.clickTimes++;
                }, this);

                tile.on('touchend', function (event) {
                    cc.log(event.target.type);
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

    _getMine () {
        let total = [];
        let random = 0;
        let totalLength = MineInfo.tileNum;
        for (let i = 0; i < MineInfo.tileNum; i++) {
            total.push(i);
        }
        for (let i = 0; i < MineInfo.mineNum; i++) {
            random = Math.floor(Math.random() * totalLength);
            this.mineTile.push(total[random]);
            total.splice(random, 1);
        }
    },

    _getRelation (num) {
        let relation = [];
        let sideTopNum = [72, 54, 34, 12, 0, 23, 44, 63, 80];
        let sideBottomNum = [79, 62, 43, 22, 11, 33, 53, 71, 87];
        if (sideTopNum.includes(num)) {
            relation.push(num + 1);
            switch (num) {
                case 72:
                    relation.push(54);
                    relation.push(55);
                    break;
                case 54:
                    relation.push(34);
                    relation.push(35);
                    relation.push(72);
                    break;
                case 34:
                    relation.push(12);
                    relation.push(13);
                    relation.push(54);
                    break;
                case 12:
                    relation.push(34);
                    relation.push(0);
                    relation.push(1);
                    break;
                case 0:
                    relation.push(12);
                    relation.push(23);
                    break;
                case 23:
                    relation.push(0);
                    relation.push(1);
                    relation.push(44);
                    break;
                case 44:
                    relation.push(23);
                    relation.push(24);
                    relation.push(63);
                    break;
                case 63:
                    relation.push(44);
                    relation.push(45);
                    relation.push(80);
                    break;
                case 80:
                    relation.push(63);
                    relation.push(64);
                    break;
            }
            return relation;
        } else if (sideBottomNum.includes(num)) {
            relation.push(num - 1);
            switch (num) {
                case 79:
                    relation.push(61);
                    relation.push(62);
                    break;
                case 62:
                    relation.push(79);
                    relation.push(42);
                    relation.push(43);
                    break;
                case 43:
                    relation.push(62);
                    relation.push(21);
                    relation.push(22);
                    break;
                case 22:
                    relation.push(43);
                    relation.push(10);
                    relation.push(11);
                    break;
                case 11:
                    relation.push(22);
                    relation.push(33);
                    break;
                case 33:
                    relation.push(10);
                    relation.push(11);
                    relation.push(53);
                    break;
                case 53:
                    relation.push(32);
                    relation.push(33);
                    relation.push(71);
                    break;
                case 71:
                    relation.push(52);
                    relation.push(53);
                    relation.push(87);
                    break;
                case 87:
                    relation.push(70);
                    relation.push(71);
                    break;
            }
            return relation;
        } else {
            relation.push(num - 1);
            relation.push(num + 1);
            if (num < 11) {
                relation.push(num + 11);
                relation.push(num + 12);
                relation.push(num + 22);
                relation.push(num + 23);
            } else if (num > 12 && num < 22) {
                relation.push(num - 11);
                relation.push(num - 12);
                relation.push(num + 21);
                relation.push(num + 22);
            } else if (num > 23 && num < 33) {
                relation.push(num - 22);
                relation.push(num - 23);
                relation.push(num + 20);
                relation.push(num + 21);
            } else if (num > 34 && num < 43) {
                relation.push(num - 21);
                relation.push(num - 22);
                relation.push(num + 19);
                relation.push(num + 20);
            } else if (num > 44 && num < 53) {
                relation.push(num - 20);
                relation.push(num - 21);
                relation.push(num + 19);
                relation.push(num + 18);
            } else if (num > 54 && num < 62) {
                relation.push(num - 20);
                relation.push(num - 19);
                relation.push(num + 17);
                relation.push(num + 18);
            } else if (num > 63 && num < 71) {
                relation.push(num - 18);
                relation.push(num - 19);
                relation.push(num + 17);
                relation.push(num + 16);
            } else if (num > 72 && num < 79) {
                relation.push(num - 18);
                relation.push(num - 17);
            } else if (num > 80 && num < 87) {
                relation.push(num - 16);
                relation.push(num - 17);
            }
            return relation;
        }
    },

    onLoad () {
        this._init();
    }
});

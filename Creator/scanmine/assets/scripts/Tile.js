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
        mineTile: [],
        tilesArr: [],
        opend: 0
    },

    _init () {
        this._getMine();
        this._setTile();
        this._setType();
    },

    _setTile () {
        let tile = null;
        let self = this;
        for (let i = 0; i < MineInfo.pos.length; i++) {
            tile = cc.instantiate(this.tiles);
            tile.parent = this.node;
            tile.x = MineInfo.pos[i].x;
            tile.y = MineInfo.pos[i].y;
            tile.id = i;

            // 设置雷
            if (self.mineTile.includes(i)) {
                tile.type = MineInfo.type.MINE;
            } else {
                tile.type = MineInfo.type.BLANK;
            }

            self.tilesArr.push(tile);
            (function (tile) {
                tile.on('touchend', function (event) {
                    if (tile.opend) return;
                    tile.opend = true;
                    self.opend++;
                    tile.getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[tile.type];
                    if (tile.type === MineInfo.type.MINE) {
                        alert('you lose')
                    } else if (tile.type === MineInfo.type.BLANK){
                        self._autoOpen(tile.id);
                    } else {
                        if (self.opend === (MineInfo.tileNum - MineInfo.mineNum)) {
                            alert('you win');
                        }
                    }
                }, this);
            })(tile);
        }
    },

    _getMine () {
        let total = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 
                    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 
                    21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
                    31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
                    41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
                    51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
                    61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
                    71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
                    81, 82, 83, 84, 85, 86, 87
        ];
        let random = 0;
        for (let j = 0; j < MineInfo.mineNum; j++) {
            random = Math.floor(Math.random() * total.length);
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

    _setType () {
        for (let i = 0; i < this.mineTile.length; i++) {
            let rela = this._getRelation(this.mineTile[i]);
            for (let j = 0; j < rela.length; j++) {
                if (this.tilesArr[rela[j]]['type'] !== MineInfo.type.MINE) {
                    this.tilesArr[rela[j]]['type'] += 1;
                }
            }
        }
    },

    _autoOpen (blankNum) {
        let rela = this._getRelation(blankNum);
        let tile = null;
        for (let i = 0; i < rela.length; i++) {
            tile = this.tilesArr[rela[i]];
            if (tile.type !== MineInfo.type.MINE && !tile.opend) {
                tile.getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[tile.type];
                tile.opend = true;
                this.opend++;
            }
        }
        if (this.opend === (MineInfo.tileNum - MineInfo.mineNum)) {
            alert('you win');
        }
    },

    onLoad () {
        this._init();
    }
});

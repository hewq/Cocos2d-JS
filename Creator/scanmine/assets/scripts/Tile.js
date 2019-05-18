let Game = require('Game');
let MineInfo = require('MineInfo').mineInfo;

cc.Class({
    extends: cc.Component,

    properties: {
        clickTimes: 0,
        tilePrefab: {
            default: null,
            type: cc.Prefab
        },
        linePrefab: {
            default: null,
            type: cc.Prefab
        },
        mineTile: [],
        tilesArr: [],
        opened: 0,
        topTile: [],
        rightTile: [],
        bottomTile: [],
        leftTile: [],
        leftBottomTile: [],
        rightBottomTile: [],
        leftTopTile: [],
        rightTopTile: [],
        lineC: [],
        lineL: [],
        lineR: [],
        tilesSlice: [],
        tilesC: [],
        tilesL: [],
        tilesR: []
    },

    _init () {
        this.topTile = [72, 54, 34, 12, 0, 23, 44, 63, 80];
        this.rightTile = [80, 81, 82, 83, 84, 85, 86, 87];
        this.bottomTile = [79, 62, 43, 22, 11, 33, 53, 71, 87];
        this.leftTile = [72, 73, 74, 75, 76, 77, 78, 79];
        this.leftBottomTile = [79, 62, 43, 22, 11];
        this.rightBottomTile = [11, 33, 53, 71, 87];
        this.leftTopTile = [72, 54, 34, 12, 0];
        this.rightTopTile = [0, 23, 44, 63, 80];
        this.tilesC = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        this.tilesL = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 
                       22, 34, ,35, 36, 37, 38, 39, 40, 41, 42, 
                       43, 54, 55, 56, 57, 58, 59, 60, 61, 62,
                       72, 73, 74, 75, 76, 77, 78, 79];
        this.tilesR = [23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
                       33, 44, 45, 46, 47, 48, 49, 50, 51, 52, 
                       53, 63, 64, 65, 66, 67, 68, 69, 70 ,71, 
                       80, 81, 82, 83, 84, 85, 86, 87];
        this._getMine();
        this._setTile();
        this._setPos(4, 12, 0);
        this._setPos(3, 11, 12);
        this._setPos(5, 11, 23);
        this._setPos(2, 10, 34);
        this._setPos(6, 10, 44);
        this._setPos(1, 9, 54);
        this._setPos(7, 9, 63);
        this._setPos(0, 8, 72);
        this._setPos(8, 8, 80);
        this._setType();
        this._sliceTilesArr();
    },

    _setTile () {
        let tile = null;
        let self = this;
        for (let i = 0; i < MineInfo.pos.length; i++) {
            tile = cc.instantiate(this.tilePrefab);
            tile.parent = this.node;
            tile.x = MineInfo.pos[i].x;
            tile.y = MineInfo.pos[i].y;
            tile.$id = i;

            this._drawLine(this.node, tile.$id, tile.x, tile.y);

            // 设置雷
            if (self.mineTile.includes(i)) {
                tile.$type = MineInfo.type.MINE;
            } else {
                tile.$type = MineInfo.type.BLANK;
            }

            self.tilesArr.push(tile);
            (function (tile) {
                tile.on('touchend', function (event) {
                    if (tile.opened) return;
                    tile.opened = true;
                    self.opened++;
                    tile.getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[tile.$type];

                    self._checkTBOpen(tile);
                    self._checkLTRBOpen(tile);

                    if (tile.$type === MineInfo.type.MINE) {
                        alert('you lose')
                    } else if (tile.$type === MineInfo.type.BLANK){
                        self._autoOpen(tile.$id);
                    } else {
                        if (self.opened === (MineInfo.tileNum - MineInfo.mineNum)) {
                            alert('you win');
                        }
                    }
                }, this);
            })(tile);
        }
        this._fixLineCenter();
    },

    _checkTBOpen (node) { // 判断上下是否打开
        if (node.$id !== 87) {
            if (this.tilesArr[node.$id + 1].opened) {
                this.lineC[node.$id].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[10];
            } 
        }

        if (node.$id !== 0) {
            if (this.tilesArr[node.$id - 1].opened) {
                this.lineC[node.$id - 1].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[10];
            } 
        }
    },

    _checkLTRBOpen (node) { // 判断左下右上是否打开
        if (node.$id === 0) {
            if (this.tilesArr[12].opened) {
                this.lineL[12].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[10];
            } 
            return;
        }
        if (this.tilesL.includes(node.$id) || this.tilesC.includes(node.$id)) {
            if (this.leftBottomTile.includes(node.$id) || this.leftTile.includes(node.$id)) {
                if (this.tilesSlice[node.$col + 1][node.$colPos].opened) {
                    this.lineL[this.tilesSlice[node.$col + 1][node.$colPos].$id].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[10];
                }
            } else {
                if (this.tilesSlice[node.$col + 1][node.$colPos].opened) {
                    this.lineL[this.tilesSlice[node.$col + 1][node.$colPos].$id].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[10];
                }
                if (this.tilesSlice[node.$col - 1][node.$colPos].opened) {
                    this.lineL[this.tilesSlice[node.$col][node.$colPos].$id].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[10];
                }
            }
        } else {
            if (this.rightTopTile.includes(node.$id) || this.rightTile.includes(node.$id)) {
                if (this.tilesSlice[node.$col - 1][node.$colPos + 1].opened) {
                    this.lineL[this.tilesSlice[node.$col][node.$colPos].$id].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[10];
                }
            } else {
                if (this.tilesSlice[node.$col - 1][node.$colPos + 1].opened) {
                    this.lineL[this.tilesSlice[node.$col][node.$colPos].$id].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[10];
                }
                if (this.tilesSlice[node.$col + 1][node.$colPos - 1].opened) {
                    this.lineL[this.tilesSlice[node.$col + 1][node.$colPos - 1].$id].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[10];
                }
            }
        }
    },

    _drawLine (parent, id, x, y) {
        let line = null; 
        for (let i = 0; i < 3; i++) {
            if (i === 0 && !this.bottomTile.includes(id)) {
                line = cc.instantiate(this.linePrefab);
                line.parent = parent;
                line.x = x;
                line.y = y - MineInfo.mineH;
                this.lineC.push(line);
            } else if (i === 1 && !this.leftTile.includes(id) && !this.leftBottomTile.includes(id)) {
                line = cc.instantiate(this.linePrefab);
                line.parent = parent;
                line.x = x - MineInfo.mineW / 2;
                line.y = y - (MineInfo.disV + (MineInfo.mineH - MineInfo.disV) / 2);
                line.setRotation(55);
                this.lineL.push(line)
            } else if (i === 2 && !this.rightTile.includes(id) && !this.rightBottomTile.includes(id)) {
                line = cc.instantiate(this.linePrefab);
                line.parent = parent;
                line.x = x + MineInfo.mineW / 2;
                line.y = y - (MineInfo.disV + (MineInfo.mineH - MineInfo.disV) / 2);
                line.setRotation(-55);
                this.lineR.push(line)
            }
        }
    },

    _fixLineCenter () {
        for (let i = 0; i < this.bottomTile.length; i++) {
            this.lineC.splice(this.bottomTile[i], 0, 'space');
        }

        for (let i = 0; i < this.leftTile.length; i++) {
            this.lineL.splice(this.leftTile[i], 0, 'space');
        }

        for (let i = 0; i < this.leftBottomTile.length; i++) {
            this.lineL.splice(this.leftBottomTile[i], 0, 'space');
        }

        for (let i = 0; i < this.rightTile.length; i++) {
            this.lineR.splice(this.rightTile[i], 0, 'space');
        }

        for (let i = 0; i < this.rightBottomTile.length; i++) {
            this.lineR.splice(this.rightBottomTile[i], 0, 'space');
        }
    },

    _sliceTilesArr () {
        this.tilesSlice.push(this.tilesArr.slice(72, 80));
        this.tilesSlice.push(this.tilesArr.slice(54, 63));
        this.tilesSlice.push(this.tilesArr.slice(34, 44));
        this.tilesSlice.push(this.tilesArr.slice(12, 23));
        this.tilesSlice.push(this.tilesArr.slice(0, 12));
        this.tilesSlice.push(this.tilesArr.slice(23, 34));
        this.tilesSlice.push(this.tilesArr.slice(44, 54));
        this.tilesSlice.push(this.tilesArr.slice(63, 72));
        this.tilesSlice.push(this.tilesArr.slice(80, 88));
    },

    _setPos (colNo, colNum, start) {
        let pos = 0;
        for (let i = start; i < colNum + start; i++) {
            this.tilesArr[i].$col = colNo;
            this.tilesArr[i].$colPos = pos++;
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
        if (this.topTile.includes(num)) {
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
        } else if (this.bottomTile.includes(num)) {
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
                if (this.tilesArr[rela[j]]['$type'] !== MineInfo.type.MINE) {
                    this.tilesArr[rela[j]]['$type'] += 1;
                }
            }
        }
    },

    _autoOpen (blankNum) {
        let rela = this._getRelation(blankNum);
        let tile = null;
        for (let i = 0; i < rela.length; i++) {
            tile = this.tilesArr[rela[i]];
            if (tile.$type !== MineInfo.type.MINE && !tile.opened) {
                tile.getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[tile.$type];
                tile.opened = true;
                this.opened++;
                this._checkTBOpen(tile);
                this._checkLTRBOpen(tile);
            }
        }
        if (this.opened === (MineInfo.tileNum - MineInfo.mineNum)) {
            alert('you win');
        }
    },

    onLoad () {
        this._init();
    }
});

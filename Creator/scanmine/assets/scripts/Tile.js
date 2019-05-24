let Game = require('Game');
let TileInfo = require('TileInfo').tileInfo;
let wxGame = require('WxGameComm');

cc.Class({
    extends: cc.Component,

    properties: {
        tilePrefab: {
            default: null,
            type: cc.Prefab
        },
        linePrefab: {
            default: null,
            type: cc.Prefab
        },
        btnFailAgain: cc.Node,
        btnSuccessAgain: cc.Node,
        btnShare: cc.Node,
        btnOb: cc.Node,
        btnOther: cc.Node,
        btnCloseShare: cc.Node,
        btnCloseRule: cc.Node,
        btnRule: cc.Node,
        btnCloseTips: cc.Node,
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
        tilesR: [],
        tilesNoLineL: [],
        tilesNoLineR: [],
        tileLine: 10,
        mineLine: 11,
        min: 0,
        sec: 0,
        useTime: 0,
        isWin: false,
        touchStartTime: 0
    },

    _startGame () {
        this._initGame();
        this._init();
    },

    _init () {
        this.topTile = TileInfo.topTile;
        this.rightTile = TileInfo.rightTile;
        this.bottomTile = TileInfo.bottomTile;
        this.leftTile = TileInfo.leftTile;
        this.leftBottomTile = TileInfo.leftBottomTile;
        this.rightBottomTile = TileInfo.rightBottomTile;
        this.leftTopTile = TileInfo.leftTopTile;
        this.rightTopTile = TileInfo.rightTopTile;
        this.tilesC = TileInfo.tilesC;
        this.tilesL = TileInfo.tilesL;
        this.tilesR = TileInfo.tilesR;
        this.tilesNoLineL = TileInfo.tilesNoLineL;
        this.tilesNoLineR = TileInfo.tilesNoLineR;
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

    _playAgain (showClose) {
        if (localStorage.getItem('afterShare')) {
            localStorage.setItem('afterShare', false);
            Game.instance.dialogShare.active = false;
            Game.instance.dialogFail.active = false;
            Game.instance.dialogSuccess.active = false;
            this._startGame();
            Game.instance.dialogBg.active = true;
            Game.instance.dialogTips.active = true;
            Game.instance.dialogTips.runAction(cc.scaleTo(.5, 1));
            return;
        }
        if (localStorage.getItem('playTimes') > 3) {
            if (!showClose) {
                this.btnCloseShare.active = false;
            } else {
                this.btnCloseShare.active = true;
            }
            Game.instance.dialogBg.active = true;
            Game.instance.dialogShare.active = true;
            Game.instance.dialogShare.runAction(cc.scaleTo(.5, 1));
        } else {
            Game.instance.dialogBg.active = true;
            Game.instance.dialogTips.active = true;
            Game.instance.dialogTips.runAction(cc.scaleTo(.5, 1));
            this._startGame();
            Game.instance.dialogShare.active = false;
            Game.instance.dialogFail.active = false;
            Game.instance.dialogSuccess.active = false;
            wxGame.updatePlayTimes(false, function (res) {});
            localStorage.setItem('playTimes', localStorage.getItem('playTimes') + 1);
        }
    },

    _btnHandler () {
        this.btnFailAgain.on('touchend', function (event) {
            this._playAgain(true);
        }, this);
        this.btnSuccessAgain.on('touchend', function (event) {
            this._playAgain(true);
        }, this);
        this.btnOb.on('touchend', function (event) {
            cc.director.loadScene('result');
        }, this);
        this.btnOther.on('touchend', function (event) {
            cc.director.loadScene('result');
        }, this);
        this.btnCloseShare.on('touchend', function () {
            Game.instance.dialogShare.runAction(cc.scaleTo(.5, 0));
            setTimeout(function () {Game.instance.dialogShare.active = false;}, 500);
        });
        this.btnCloseRule.on('touchend', function () {
            Game.instance.dialogBg.active = false;
            Game.instance.dialogRule.runAction(cc.scaleTo(.5, 0));
            setTimeout(function () {Game.instance.dialogRule.active = false;}, 500);
        });
        this.btnCloseTips.on('touchend', function () {
            Game.instance.dialogBg.active = false;
            Game.instance.dialogTips.runAction(cc.scaleTo(.5, 0));
            setTimeout(function () {Game.instance.dialogTips.active = false;}, 500);
        });
        this.btnShare.on('touchend', function () {
            localStorage.setItem('toPlayGame', true);
            localStorage.setItem('closeTime', new Date().getTime());
            wxGame.shareAppMessage();
        });
        this.btnRule.on('touchend', function () {
            Game.instance.dialogBg.active = true;
            Game.instance.dialogRule.active = true;
            Game.instance.dialogRule.runAction(cc.scaleTo(.5, 1));
        });
    },

    _setTile () {
        let tile = null;
        let self = this;
        for (let i = 0; i < TileInfo.pos.length; i++) {
            tile = cc.instantiate(this.tilePrefab);
            tile.parent = Game.instance.wrapMine;
            tile.x = TileInfo.pos[i].x;
            tile.y = TileInfo.pos[i].y;
            tile.$id = i;

            this._drawLine(Game.instance.wrapMine, tile.$id, tile.x, tile.y);

            // 设置雷
            if (self.mineTile.includes(i)) {
                tile.$type = TileInfo.type.MINE;
            } else {
                tile.$type = TileInfo.type.BLANK;
            }

            self.tilesArr.push(tile);
            (function (tile) {
                tile.on('touchstart', function (event) {
                    self.touchStartTime = new Date().getTime();
                });

                tile.on('touchend', function (event) {
                    let nowTime = new Date().getTime();
                    if (tile.opened) return;
                    if (nowTime - self.touchStartTime > 300) { // 长按
                        if (tile.flag) {
                            tile.getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[9];
                            tile.flag = false;
                        } else {
                            tile.getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[12];
                            tile.flag = true;
                        }
                        return;
                    }
                    tile.opened = true;
                    self.opened++;
                    tile.getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[tile.$type];

                    self._checkTBOpen(tile, self.tileLine);
                    self._checkLBRTOpen(tile, self.tileLine);
                    self._checkLTRBOpen(tile, self.tileLine);

                    if (tile.$type === TileInfo.type.MINE) {
                        self.unschedule(self._timeSchedule);
                        for (let i = 0; i < self.mineTile.length; i++) {
                            self.tilesArr[self.mineTile[i]].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[7];
                        }
                        tile.getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[8];
                        self._checkTBOpen(tile, self.mineLine);
                        self._checkLBRTOpen(tile, self.mineLine);
                        self._checkLTRBOpen(tile, self.mineLine);
                        Game.instance.dialogBg.opacity = 0;
                        Game.instance.dialogBg.active = true;
                        setTimeout(function () {
                            Game.instance.dialogBg.opacity = 100;
                            Game.instance.dialogFail.active = true;
                            Game.instance.dialogFail.runAction(cc.scaleTo(.5, 1));
                        }, 1000);

                        self._setTitle({num: self.opened});
                        self._setLevel({num: self.opened});
                    } else if (tile.$type === TileInfo.type.BLANK){
                        self._autoOpen(tile.$id);
                    } else {
                        if (self.opened === (TileInfo.tileNum - TileInfo.mineNum)) {
                            Game.instance.dialogBg.active = true;
                            Game.instance.dialogSuccess.active = true;
                            Game.instance.dialogSuccess.runAction(cc.scaleTo(.5, 1));
                            self.unschedule(self._timeSchedule);
                            self._submitScore();
                            wxGame.updateScore(self.useTime, function (res) {console.log(res)}, function (err) {console.error(err)});
                            self._setTitle({time: self.useTime});
                            self._setLevel({time: self.useTime});
                        }
                    }
                }, this);
            })(tile);
        }
        this._fixLine();
    },

    _setTitle ({num = 0, time = 0} = {}) {
        if (num !== 0) {
            localStorage.setItem('title', Math.floor(72 / num));
        } else if (time !== 0) {
            if (time <= 20) {
                localStorage.setItem('title', 4);
            } else if (time > 20 && time <= 220) {
                localStorage.setItem('title', 5);
            } else if (time > 220 && time <= 420) {
                localStorage.setItem('title', 6);
            } else {
                localStorage.setItem('title', 7);
            }
        }
    },

    _setLevel ({num = 0, time = 0} = {}) {
        if (num !== 0) {
            localStorage.setItem('level', this.opened * 7);
        } else if (time !== 0) {
            if (time <= 20) {
                localStorage.setItem('level', 1500);
            } else if (time > 518) {
                localStorage.setItem('level', 500);
            } else {
                localStorage.setItem('level', 1500 - (time - 20) * 2);
            }
        }
    },

    _submitScore () {
        let gameScoreData = {
            wxgame: {
                score: this.useTime,
                update_time: new Date().getTime()
            },
            cost_ms: this.useTime
        };
        let userKVData = {
            key: "score",
            value: "" + this.useTime
            // value: JSON.stringify(gameScoreData)
        };
        wxGame.setUserCloudStorage(userKVData, function (res) {console.log(res)}, function (err) {console.error(err)});
    },

    _checkTBOpen (node, num) { // 判断上下是否打开
        if (!this.bottomTile.includes(node.$id)) { // 下
            if (this.tilesArr[node.$id + 1].opened) {
                this.lineC[node.$id].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[num];
            } 
        }

        if (!this.topTile.includes(node.$id)) { // 上
            if (this.tilesArr[node.$id - 1].opened) {
                this.lineC[node.$id - 1].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[num];
            } 
        }
    },

    _checkLBRTOpen (node, num) { // 判断左下右上是否打开
        if (node.$id === 0) {
            if (this.tilesArr[12].opened) {
                this.lineL[0].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[num];
            } 
            
            return;
        }
        if (node.$id === 11) {
            if (this.tilesArr[33].opened) {
                this.lineL[33].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[num];
            } 
            return;
        }
        if (this.tilesL.includes(node.$id)) {
        	if (this.tilesSlice[node.$col + 1][node.$colPos].opened) { // 右上
                this.lineL[this.tilesSlice[node.$col + 1][node.$colPos].$id].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[num];
            }
            if (!this.leftBottomTile.includes(node.$id) && !this.leftTile.includes(node.$id)) { // 左下
                if (this.tilesSlice[node.$col - 1][node.$colPos].opened) {
                    this.lineL[this.tilesSlice[node.$col][node.$colPos].$id].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[num];
                }
            }
        } else if (this.tilesR.includes(node.$id)) {
        	if (this.tilesSlice[node.$col - 1][node.$colPos + 1].opened) { // 左下
                this.lineL[this.tilesSlice[node.$col][node.$colPos].$id].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[num];
            }
            if (!this.rightTopTile.includes(node.$id) && !this.rightTile.includes(node.$id)) { // 右上
                if (this.tilesSlice[node.$col + 1][node.$colPos - 1].opened) {
                    this.lineL[this.tilesSlice[node.$col + 1][node.$colPos - 1].$id].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[num];
                }
            }
        } else {
        	if (this.tilesSlice[node.$col - 1][node.$colPos].opened) { // 左下
                this.lineL[this.tilesSlice[node.$col][node.$colPos].$id].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[num];
            }
            if (!this.rightTopTile.includes(node.$id) && !this.rightTile.includes(node.$id)) { // 右上
                if (this.tilesSlice[node.$col + 1][node.$colPos - 1].opened) {
                    this.lineL[this.tilesSlice[node.$col + 1][node.$colPos - 1].$id].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[num];
                }
            }
        }
    },

    _checkLTRBOpen (node, num) { // 判断左上右下是否打开
        if (node.$id === 0) {
            if (this.tilesArr[23].opened) {
                this.lineR[0].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[num];
            } 
            return;
        }
        if (node.$id === 11) {
            if (this.tilesArr[22].opened) {
                this.lineR[22].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[num];
            } 
            return;
        }
        if (this.tilesL.includes(node.$id)) {
        	if (this.tilesSlice[node.$col + 1][node.$colPos + 1].opened) { // 右下
                this.lineR[this.tilesSlice[node.$col][node.$colPos].$id].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[num];
            }
            if (!this.leftTopTile.includes(node.$id) && !this.leftTile.includes(node.$id)) { // 左上
                if (this.tilesSlice[node.$col - 1][node.$colPos - 1].opened) {
                    this.lineR[this.tilesSlice[node.$col - 1][node.$colPos - 1].$id].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[num];
                }
            }
        } else if (this.tilesR.includes(node.$id)) {
        	if (this.tilesSlice[node.$col - 1][node.$colPos].opened) { // 左上
                this.lineR[this.tilesSlice[node.$col - 1][node.$colPos].$id].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[num];
            }
            if (!this.rightBottomTile.includes(node.$id) && !this.rightTile.includes(node.$id)) { // 右下
                if (this.tilesSlice[node.$col + 1][node.$colPos].opened) {
                    this.lineR[this.tilesSlice[node.$col][node.$colPos].$id].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[num];
                }
            }
        } else {
            if (this.tilesSlice[node.$col + 1][node.$colPos].opened) { // 右下
                this.lineR[this.tilesSlice[node.$col][node.$colPos].$id].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[num];
            }
            if (!this.leftTopTile.includes(node.$id) && !this.leftTile.includes(node.$id)) { // 左上
                if (this.tilesSlice[node.$col - 1][node.$colPos - 1].opened) {
                    this.lineR[this.tilesSlice[node.$col - 1][node.$colPos - 1].$id].getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[num];
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
                line.y = y - TileInfo.tileH;
                this.lineC.push(line);
            } else if (i === 1 && !this.leftTile.includes(id) && !this.leftBottomTile.includes(id)) {
                line = cc.instantiate(this.linePrefab);
                line.parent = parent;
                line.x = x - TileInfo.tileW / 2 + 2;
                line.y = y - (TileInfo.disV + (TileInfo.tileH - TileInfo.disV) / 2) - 4;
                line.setRotation(57);
                this.lineL.push(line)
            } else if (i === 2 && !this.rightTile.includes(id) && !this.rightBottomTile.includes(id)) {
                line = cc.instantiate(this.linePrefab);
                line.parent = parent;
                line.x = x + TileInfo.tileW / 2 - 2;
                line.y = y - (TileInfo.disV + (TileInfo.tileH - TileInfo.disV) / 2) - 4;
                line.setRotation(-57);
                this.lineR.push(line)
            }
        }
    },

    _fixLine () {
    	let noLineL = '';
        for (let i = 0; i < this.bottomTile.length; i++) {
            this.lineC.splice(this.bottomTile[i], 0, 'space');
        }

        for (let i = 0; i < this.tilesNoLineL.length; i++) {
            this.lineL.splice(this.tilesNoLineL[i], 0, 'space');
        }

        for (let i = 0; i < this.tilesNoLineR.length; i++) {
            this.lineR.splice(this.tilesNoLineR[i], 0, 'space');
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
        for (let j = 0; j < TileInfo.mineNum; j++) {
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
                if (this.tilesArr[rela[j]]['$type'] !== TileInfo.type.MINE) {
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
            if (tile.$type !== TileInfo.type.MINE && !tile.opened) {
                tile.getComponent(cc.Sprite).spriteFrame = Game.instance.sfTiles[tile.$type];
                tile.opened = true;
                this.opened++;
                this._checkTBOpen(tile, this.tileLine);
                this._checkLBRTOpen(tile, this.tileLine);
                this._checkLTRBOpen(tile, this.tileLine);
            }
        }
        if (this.opened === (TileInfo.tileNum - TileInfo.mineNum)) {
            Game.instance.dialogBg.active = true;
            Game.instance.dialogSuccess.active = true;
            Game.instance.dialogSuccess.runAction(cc.scaleTo(.5, 1));
        }
    },

    _timeSchedule () {
        this.useTime++;
        Game.instance.time.string = (this.min < 10 ? '0' + this.min : this.min) + ':' + (this.sec < 10 ? '0' + this.sec : this.sec);
        if (this.sec === 59) {
            this.sec = 0;
            this.min++;
        } else {
            this.sec++;
        }
    },

    _initGame () {
        this.schedule(this._timeSchedule, 1);
        Game.instance.dialogBg.active = false;
        Game.instance.dialogFail.setScale(0);
        Game.instance.dialogSuccess.setScale(0);
        Game.instance.dialogShare.setScale(0);
        Game.instance.dialogRule.setScale(0);
        Game.instance.dialogTips.setScale(0);
        Game.instance.dialogBg.zIndex = 1;
        Game.instance.dialogFail.zIndex = 1;
        Game.instance.dialogSuccess.zIndex = 1;
        Game.instance.dialogShare.zIndex = 1;
        Game.instance.dialogRule.zIndex = 1;
        Game.instance.dialogTips.zIndex = 1;
        this.isWin = false;
        this.opened = 0;
        this.min = 0;
        this.sec = 0;
        this.useTime = 0;
        this.mineTile = [];
        this.tilesArr = [];
        this.lineC = [];
        this.lineR = [];
        this.lineL = [];
        this.tilesSlice = [];
        Game.instance.wrapMine.destroy();
        let node = new cc.Node();
        node.x = 0;
        node.y = 526;
        node.width = 684;
        node.height = 1032;
        node.parent = Game.instance.rootNode;
        Game.instance.wrapMine = node;
    },

    onLoad () {
        console.log('game scene load');
        this._playAgain();
        this._btnHandler();
    }
});

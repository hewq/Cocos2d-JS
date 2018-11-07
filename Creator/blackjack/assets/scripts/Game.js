let players = require('PlayerData').players;
let Decks = require('Decks');
let Types = require('Types');
let ActorPlayingState = Types.ActorPlayingState;
let Fsm = require('game-fsm');

let Game = cc.Class({
    extends: cc.Component,

    properties: {
        playerAnchors: {
            default: [],
            type: cc.Node
        },
        playerPrefab: cc.Prefab,
        dealer: cc.Node,
        inGameUI: cc.Node,
        betUI: cc.Node,
        assetMng: cc.Node,
        audioMng: cc.Node,
        turnDuration: 0,
        betDuration: 0,
        totalChipsNum: 0,
        totalDiamondNum: 0,
        numberOfDecks: {
            default: 1,
            type: 'Integer'
        }
    },

    statics: {
        instance: null
    },

    onLoad: function () {
        Game.instance = this;
        this.inGameUI = this.inGameUI.getComponent('InGameUI');
        this.assetMng = this.assetMng.getComponent('AssetMng');
        this.audioMng = this.audioMng.getComponent('AudioMng');
        this.betUI = this.betUI.getComponent('Bet');
        this.inGameUI.init(this.betDuration);
        this.betUI.init();
        this.dealer = this.dealer.getComponent('Dealer');
        this.dealer.init();

        this.player = null;
        this.createPlayers();

        this.info = this.inGameUI.resultTxt;
        this.totalChips = this.inGameUI.labelTotalChips;

        this.decks = new Decks(this.numberOfDecks);
        this.fsm = Fsm;
        this.fsm.init(this);

        this.updateTotalChips();

        this.audioMng.playMusic();
    },

    addStake: function (delta) {
        if (this.totalChipsNum < delta) {
            console.log('not enough chips!');
            this.info.enabled = true;
            this.info.string = '金币不足!';
            return false;
        } else {
            this.totalChipsNum -= delta;
            this.updateTotalChips();
            this.player.addStake(delta);
            this.audioMng.playChips();
            this.info.enabled = false;
            this.info.string = '请下注';
            return true;
        }
    },

    resetStake: function () {
        this.totalChipsNum += this.player.stakeNum;
        this.player.resetStake();
        this.updateTotalChips();
    },

    updateTotalChips: function () {
        this.totalChips.string = this.totalChipsNum;
        this.player.renderer.updateTotalStake(this.totalChipsNum);
    },

    createPlayers: function () {
        for (let i = 0; i < 5; ++i) {
            let playerNode = cc.instantiate(this.playerPrefab);
            let anchor = this.playerAnchors[i];
            let switchSide = (i > 2);
            anchor.addChild(playerNode);
            playerNode.position = cc.v2(0, 0);

            let playerInfoPos = cc.find('anchorPlayerInfo', anchor).getPosition();
            let stakePos = cc.find('anchorStake', anchor).getPosition();
            let actorRenderer = playerNode.getComponent('ActorRenderer');

            actorRenderer.init(players[i], playerInfoPos, stakePos, this.turnDuration, switchSide);
            if (i === 2) {
                this.player = playerNode.getComponent('Player');
                this.player.init();
            }
        }
    },

    // 玩家要牌
    hit: function () {
        this.player.addCard(this.decks.draw());
        if (this.player.state === ActorPlayingState.Bust) {
            this.fsm.onPlayerActed();
        }

        this.audioMng.playCard();

        this.audioMng.playButton();
    },

    // 玩家停牌
    stand: function () {
        this.player.stand();

        this.audioMng.playButton();

        this.fsm.onPlayerActed();
    },

    deal: function () {
        this.fsm.toDeal();
        this.audioMng.playButton();
    },

    start: function () {
        this.fsm.toBet();
        this.audioMng.playButton();
    },

    report: function () {
        this.player.report();

        this.fsm.onPlayerActed();
    },

    quitToMenu: function () {
        cc.director.loadScene('menu');
    },

    onEnterDealState: function () {
        this.betUI.resetTossedChips();
        this.inGameUI.resetCountdown();
        this.player.renderer.showStakeChips(this.player.stakeNum);
        this.player.addCard(this.decks.draw());

        let holdCard = this.decks.draw();

        this.dealer.addHoleCard(holdCard);
        this.player.addCard(this.decks.draw());
        this.dealer.addCard(this.decks.draw());
        this.audioMng.playCard();
        this.fsm.onDealed();
    },

    onPlayersTurnState: function (enter) {
        if (enter) {
            this.inGameUI.showGameState();
        }
    },

    onEnterDealersTurnState: function () {
        while (this.dealer.state === ActorPlayingState.Normal) {
            if (this.dealer.wantHit()) {
                this.dealer.addCard(this.decks.draw());
            } else {
                this.dealer.stand();
            }
        }
        this.fsm.onDealerActed();
    },

    // 结算
    onEndState: function (enter) {
        if (enter) {
            this.dealer.revealHoldCard();
            this.inGameUI.showResultState();

            let outcome = this._getPlayerResult(this.player, this.dealer);
            switch (outcome) {
                case Types.Outcome.Win: 
                    this.info.string = 'You Win';
                    this.audioMng.pauseMusic();
                    this.audioMng.playWin();

                    // 拿回原先自己的筹码
                    this.totalChipsNum += this.player.stakeNum;

                    // 奖励筹码
                    let winChipsNum = this.player.stakeNum;

                    if (!this.player.state === Types.ActorPlayingState.Report) {
                        if (this.player.hand === Types.Hand.BlackJack) {
                            winChipsNum *= 1.5;
                        } else {
                            // 五小龙
                            winChipsNum *= 2.0;
                        }
                    }

                    this.totalChipsNum += winChipsNum;
                    this.updateTotalChips();
                    break;

                case Types.Outcome.Lose: 
                    this.info.string = 'You Lose';
                    this.audioMng.pauseMusic();
                    this.audioMng.playLose();
                    break;

                case Types.Outcome.Tie:
                    this.info.string = 'Draw';
                    // 退还筹码
                    this.totalChipsNum += this.player.stakeNum;
                    this.updateTotalChips();
                    break;
            }
        }

        this.info.enabled = enter;
    },

    // 下注
    onBetState: function (enter) {
        if (enter) {
            this.decks.reset();
            this.player.reset();
            this.dealer.reset();
            this.info.string = '请下注';
            this.inGameUI.showBetState();
            this.inGameUI.startCountdown();

            this.audioMng.resumeMusic();
        }

        this.info.enabled = enter;
    },

    // 判断玩家输赢
    _getPlayerResult: function (player, dealer) {
        let Outcome = Types.Outcome;
        if (player.state === ActorPlayingState.Bust) {
            return Outcome.Lose;
        } else if (dealer.state === ActorPlayingState.Bust) {
            return Outcome.Win;
        } else {
            if (player.state === ActorPlayingState.Report) {
                return Outcome.Win;
            } else {
                if (player.hand > dealer.hand) {
                    return Outcome.Win;
                } else if (player.hand < dealer.hand) {
                    return Outcome.Lose;
                } else {
                    if (player.bestPoint === dealer.bestPoint) {
                        return Outcome.Tie;
                    } else if (player.bestPoint < dealer.bestPoint) {
                        return Outcome.Lose;
                    } else {
                        return Outcome.Win;
                    }
                }
            }
        }
    },

});
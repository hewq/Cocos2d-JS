let Types = require('Types');
let Utils = require('Utils');
let ActorPlayingState = Types.ActorPlayingState;

cc.Class({
    extends: cc.Component,

    properties: {
        // 所有明牌
        cards: {
            default: [],
            serializeble: false,
            visible: false
        },
        // 暗牌，demo 暂存
        holeCard: {
            default: null,
            serializeble: false,
            visible: false
        },

        // 手上最接近 21 点的点数（有可能超过 21 点）
        bestPoint: {
            get: function () {
                let minMax = Utils.getMinMaxPoint(this.cards);
                return minMax.max;
            }
        },

        // 牌型，不考虑是否爆牌
        hand: {
            get: function () {
                let count = this.cards.length;
                if (this.holeCard) {
                    ++count;
                }
                if (count >= 5) {
                    return Types.Hand.FiveCard;
                }
                if (count === 2 && this.bestPoint === 21) {
                    return Types.Hand.BlackJack;
                }
                return Types.Hand.Normal;
            }
        },
        
        canReport: {
            get: function () {
                return this.hand !== Types.Hand.Normal;
            },
            visible: false
        },

        renderer: {
            default: null,
            type: cc.Node
        },

        state: {
            default: ActorPlayingState.Normal,
            notify: function (oldState) {
                if (this.state !== oldState) {
                    this.renderer.updateState();
                }
            },
            type: ActorPlayingState,
            serializeble: false,
        },
    },

    init: function () {
        this.ready = true;
        this.renderer = this.getComponent('ActorRenderer');
    },

    addCard: function (card) {
        this.cards.push(card);
        this.renderer.onDeal(card, true);

        let cards = this.holeCard ? [this.holeCard].concat(this.cards) : this.cards;
        if (Utils.isBust(cards)) {
            this.state = ActorPlayingState.Bust;
        }
    },

    addHoleCard: function (card) {
        this.holeCard = card;
        this.renderer.onDeal(card, false);
    },

    stand: function () {
        this.state = ActorPlayingState.Stand;
    },

    revealHoldCard: function () {
        if (this.holeCard) {
            this.cards.unshift(this.holeCard);
            this.holeCard = null;
            this.renderer.onRevealHoldCard();
        }
    },

    report: function () {
        this.state = ActorPlayingState.Report;
    },

    reset: function () {
        this.cards = [];
        this.holeCard = null;
        this.reported = false;
        this.state = ActorPlayingState.Normal;
        this.renderer.onReset();
    }
});

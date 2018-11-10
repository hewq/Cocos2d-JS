let GamePlayScene = cc.Scene.extend({
    betPoolInfo: [
        {
            num: '1000',
            pos: {
                x: 340,
                y: cc.winSize.height - 60
            }
        },
        {
            num: '2000',
            pos: {
                x: 440,
                y: cc.winSize.height - 260
            }
        },
        {
            num: '3000',
            pos: {
                x: cc.winSize.width / 2 - 130,
                y: cc.winSize.height / 2 + 50
            }
        },
        {
            num: '4000',
            pos: {
                x: cc.winSize.width / 2 + 90,
                y: cc.winSize.height - 260
            }
        },
        {
            num: '5000',
            pos: {
                x: cc.winSize.width - 650,
                y: cc.winSize.height - 50
            }
        }
    ],
    ctor: function () {
        this._super();

        return true;
    },
    onEnter: function () {
        this.loadBackground();

        this.loadIcon();

        this.loadBetPool();

        this.loadPlayers();

        this.loadBetBox();
    },
    loadBackground: function () {
        this.addChild(new GPBackgroundLayer());
    },
    loadIcon: function () {
        this.addChild(new GPIconLayer());
    },
    loadBetPool: function () {
        let betPoolLayer = null;
        for (let i = 0; i < this.betPoolInfo.length; i++) {
            betPoolLayer = new BetPoolLayer(this.betPoolInfo[i].num, this.betPoolInfo[i].pos);
            this.addChild(betPoolLayer);
        }
    },
    loadPlayers: function () {},
    loadBetBox: function () {
        this.addChild(new BetBoxLayer());
    },
});
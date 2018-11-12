let GamePlayScene = cc.Scene.extend({
    betPoolInfo: [
        {
            num: '1000',
            pos: {
                x: -320,
                y: 320
            }
        },
        {
            num: '2000',
            pos: {
                x: -220,
                y: 120
            }
        },
        {
            num: '3000',
            pos: {
                x: 0,
                y: 45
            }
        },
        {
            num: '4000',
            pos: {
                x: 240,
                y: 120
            }
        },
        {
            num: '5000',
            pos: {
                x: 320,
                y: 320
            }
        }
    ],
    playerInfo: [
        {
            name: '快递可',
            goldNums: '$1000',
            headPhoto: '#user/circle_2.png',
            pos: {
                x: 340,
                y: 540
            }
        },
        {
            name: '哈哈呵呵',
            goldNums: '$5600',
            headPhoto: '#user/circle_1.png',
            pos: {
                x: 440,
                y: 320
            }
        },
        {
            name: '快乐的',
            goldNums: '$100',
            headPhoto: '#user/circle_3.png',
            pos: {
                x: 750,
                y: 210
            }
        },
        {
            name: '开心的',
            goldNums: '$5400',
            headPhoto: '#user/circle_4.png',
            pos: {
                x: 1180,
                y: 310
            }
        },
        {
            name: '帮霸道',
            goldNums: '$13200',
            headPhoto: '#user/circle_5.png',
            pos: {
                x: 1280,
                y: 540
            }
        },
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
    loadPlayers: function () {
        let playerLayer = null;
        let info = null;
        for (let i = 0; i < this.playerInfo.length; i++) {
            info = this.playerInfo[i];
            if (i > 2) {
                playerLayer = new PlayerLayer(info.name, info.goldNums, info.headPhoto, info.pos, true);
            } else {
                playerLayer = new PlayerLayer(info.name, info.goldNums, info.headPhoto, info.pos, false);
            }
            this.addChild(playerLayer);
        }
    },
    loadBetBox: function () {
        this.addChild(new BetBoxLayer());
    },
});
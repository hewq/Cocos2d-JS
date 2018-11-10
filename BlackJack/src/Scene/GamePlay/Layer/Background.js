let GPBackgroundLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        this.loadBackground();

        this.loadDealer();

        return true;
    },
    loadBackground: function () {
        let deskLeft = new cc.Sprite('res/zhuozi.jpg');
        let deskRight = new cc.Sprite('res/zhuozi.jpg');

        this.addChild(deskLeft);
        this.addChild(deskRight);

        deskLeft.setAnchorPoint(0, 0.5);
        deskLeft.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        deskLeft.scaleX = -deskLeft.scaleX;

        deskRight.setAnchorPoint(0, 0.5);
        deskRight.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
    },
    loadDealer: function () {
        let dealer = new cc.Sprite('#dealer.png');
        this.addChild(dealer);
        dealer.setAnchorPoint(0.5, 1);
        dealer.setPosition(cc.winSize.width / 2, cc.winSize.height);
    }
});
let BetPoolLayer = cc.Layer.extend({
    ctor: function (num, playerPos) {
        this._super();

        this.loadBetPool(num, playerPos);

        return true;
    },
    loadBetPool: function (num, playerPos) {
        let layout = new ccui.Layout();
        this.addChild(layout);
        layout.setContentSize(1624, 750);
        layout.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);

        let poolBg = new cc.Scale9Sprite('res/bg_gold.png', cc.rect(0, 0, 70, 42), cc.rect(20, 0, 25, 42));
        poolBg.setContentSize(130, 42);
        poolBg.setOpacity(90);
        layout.addChild(poolBg);

        poolBg.setPosition(playerPos.x, playerPos.y);

        let iconGold = null;
        for (let i = 0; i < 5; i++) {
            iconGold = new cc.Sprite('#icon_gold_big.png');
            poolBg.addChild(iconGold);
            iconGold.setPosition(0, 6 + i * 6);
        }

        // TODO
        let goldNum = new ccui.Text('1111', 'AmericanTypewriter', 30);
        layout.addChild(goldNum);
        goldNum.setPosition(300, 100);
    }
});
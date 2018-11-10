let BetPoolLayer = cc.Layer.extend({
    ctor: function (num, playerPos) {
        this._super();

        this.loadBetPool(num, playerPos);

        return true;
    },
    loadBetPool: function (num, playerPos) {
        let poolBg = new cc.Scale9Sprite('res/bg_gold.png', cc.rect(0, 0, 70, 42), cc.rect(20, 0, 25, 42));
        poolBg.setContentSize(130, 42);
        poolBg.setOpacity(90);
        this.addChild(poolBg);
        this.setPosition(playerPos.x, playerPos.y);

        let iconGold = null;
        for (let i = 0; i < 5; i++) {
            iconGold = new cc.Sprite('#icon_gold_big.png');
            poolBg.addChild(iconGold);
            iconGold.setPosition(0, 6 + i * 6);
        }

        // TODO
        let goldNum = new ccui.Text(num, 'AmericanTypewriter', 30);
        poolBg.addChild(goldNum);
        goldNum.setPosition(30, 0);
    }
});
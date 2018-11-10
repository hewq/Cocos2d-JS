let BetBoxLayer = cc.Layer.extend({
    goldNum: ['#10K.png', '#5K.png', '#2K.png', '#1K.png'],
    ctor: function () {
        this._super();

        this.loadBox();

        return true;
    },
    loadBox: function () {
        let boxBg = new cc.Scale9Sprite('res/bg_gold_touzhu.png', cc.rect(0, 0, 141, 103), cc.rect(120, 0, 130, 103));
        boxBg.setContentSize(640, 103);
        this.addChild(boxBg);
        // TODO anchor 设置无效
        // this.setAnchorPoint(1, 0);
        this.setPosition(cc.winSize.width - 320, 103 / 2);

        let boxBgSize = boxBg.getContentSize();

        let clear = new cc.Sprite('#icon_qingkongtouzhu.png');
        boxBg.addChild(clear);
        clear.setAnchorPoint(0, 0.5);
        clear.setPosition(35, boxBgSize.height / 2 - 5);

        let goldNum = null;
        let goldBg = null;
        for (let i = 0; i < this.goldNum.length; i++) {
            goldBg = new cc.Sprite('#bg_gold(1).png');
            boxBg.addChild(goldBg);
            goldBg.setAnchorPoint(0, 0.5);
            goldBg.setPosition(i * 85 + 120, boxBgSize.height / 2);
            goldNum = new cc.Sprite(this.goldNum[i]);
            goldNum.setPosition(goldBg.getContentSize().width / 2, goldBg.getContentSize().height / 2);
            goldBg.addChild(goldNum);
        }

        let btnBet = new cc.Sprite('#icon_touzhu-.png');
        boxBg.addChild(btnBet);
        btnBet.setAnchorPoint(1, 0);
        btnBet.setPosition(boxBg.width + 20, -20);
    }
});
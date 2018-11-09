let RankItemLayer = cc.Layer.extend({
    ctor: function (num, headImg, name, golds) {
        this._super();

        this.loadItem(num, headImg, name, golds);

        return true;
    },
    loadItem: function (num, headImg, name, golds) {
        let layout = new ccui.Layout();
        this.addChild(layout);
        layout.setContentSize(504, 100);

        let bottomLine = new cc.Scale9Sprite('res/fengexian.png', cc.rect(0, 0, 20, 2), cc.rect(5, 0, 15, 2));
        layout.addChild(bottomLine);
        bottomLine.setContentSize(504, 2);
        bottomLine.setAnchorPoint(0.5, 0);
        bottomLine.setPosition(layout.getContentSize().width / 2, 0);

        let rankList1 = new cc.Sprite('#rankinglist_1.png');
        layout.addChild(rankList1);
        rankList1.setAnchorPoint(0, 0.5);
        rankList1.setPosition(30, layout.getContentSize().height / 2);

        let playerBorder = new cc.Sprite('#Stroke_photo.png');
        layout.addChild(playerBorder);
        playerBorder.setPosition(180, layout.getContentSize().height / 2);

        let playerPhoto = new cc.Sprite('#' + headImg + '.png');
        playerBorder.addChild(playerPhoto);
        playerPhoto.setPosition(playerBorder.getContentSize().width / 2, playerBorder.getContentSize().height / 2);

        let gold = new cc.Sprite('#icon_gold_big.png');
        layout.addChild(gold);
        gold.setAnchorPoint(0, 0);
        gold.setPosition(240, 0);

        let nameText = new ccui.Text(name, "AmericanTypewriter", 26);
        layout.addChild(nameText);
        nameText.setAnchorPoint(0, 1);
        nameText.setPosition(260, 90);

        let goldNum = new ccui.Text(golds, "AmericanTypewriter", 30);
        layout.addChild(goldNum);
        goldNum.setAnchorPoint(0, 0);
        goldNum.setPosition(310, 10);
        goldNum.setTextColor(cc.color('#E7BA1A'));
    }
});
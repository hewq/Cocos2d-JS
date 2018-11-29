let cardSprite = cc.Sprite.extend({
    ctor: function (dipai, cardInfo) {
        this._super(dipai, cardInfo);

        this.loadCard(dipai, cardInfo);

        this.setTag(Tag.CARD);

        return true;
    },
    loadCard: function (dipai, cardInfo) {
        if (dipai) {
            let dealerPoker = new cc.Sprite('#poker_dipai.png');
            this.addChild(dealerPoker);
            return true;
        }

        let playerPoker = new cc.Sprite('#poker_bg.png');

        this.addChild(playerPoker);

        let text = new cc.LabelTTF(cardInfo.text, 'res/Font/poker_number.fnt');
        playerPoker.addChild(text);
        text.setAnchorPoint(0, 1);
        text.setPosition(10, playerPoker.getContentSize().height - 5);
        if (cardInfo.color === 'red') {
            text.setColor(cc.color(200, 0, 0));
        } else {
            text.setColor(cc.color(0, 0, 0));
        }

        let iconSmall = new cc.Sprite(cardInfo.iconSmall);
        playerPoker.addChild(iconSmall);
        iconSmall.setAnchorPoint(0, 1);
        iconSmall.setPosition(10, playerPoker.getContentSize().height - 30);

        let iconBig = new cc.Sprite(cardInfo.iconBig);
        playerPoker.addChild(iconBig);
        iconBig.setAnchorPoint(1, 0);
        iconBig.setPosition(playerPoker.getContentSize().width - 15, 20);
    }
});
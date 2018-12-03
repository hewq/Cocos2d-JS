var GPIconLayer = cc.Layer.extend({
    result: '',
    ctor: function () {
        this._super();

        this.loadBackIcon();

        this.loadMsgIcon();

        return true;
    },
    loadBackIcon: function () {
        var backIconBg = new cc.Sprite('#bg_icon.png');
        this.addChild(backIconBg);
        backIconBg.setAnchorPoint(0, 1);
        backIconBg.setPosition(50, cc.winSize.height);

        var backIcon = new cc.Sprite('#icon_back.png');
        backIconBg.addChild(backIcon);
        backIcon.setPosition(backIconBg.getContentSize().width / 2, backIcon.getContentSize().height / 2 + 10);
    },
    loadMsgIcon: function () {
        var msgIconBg = new cc.Sprite('#bg_icon.png');
        this.addChild(msgIconBg);
        msgIconBg.setAnchorPoint(1, 1);
        msgIconBg.setPosition(cc.winSize.width - 50, cc.winSize.height);

        var msgIcon = new cc.Sprite('#icon_message.png');
        msgIconBg.addChild(msgIcon);
        msgIcon.setPosition(msgIconBg.getContentSize().width / 2, msgIconBg.getContentSize().height / 2);
    }
});
let MMMainLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        // 加载邮件按钮
        this.loadBtnMsg();

        // 加载排行榜
        this.loadRankList();

        // 加载开始游戏按钮
        this.loadBtnMain();

        // 加载底部项
        this.loadBottomItem();

        return true;
    },
    loadBtnMsg: function () {
        let btnMsg = new ccui.Button();
        let msgBg = new cc.Sprite('#bg_icon.png');
        let msgIcon = new cc.Sprite('#icon_message.png');

        // TODO ccui.button 的锚点问题
        this.addChild(btnMsg);
        btnMsg.setContentSize(msgBg.getContentSize().width, msgBg.getContentSize().height);
        btnMsg.setAnchorPoint(0.5, 0.5);
        btnMsg.setPosition(cc.winSize.width - 50, cc.winSize.height);

        btnMsg.addChild(msgBg);
        msgBg.setPosition(btnMsg.getContentSize().width / 2, btnMsg.getContentSize().height / 2);
        btnMsg.addChild(msgIcon);
        msgIcon.setPosition(btnMsg.getContentSize().width / 2, btnMsg.getContentSize().height / 2);

        btnMsg.setTouchEnabled(true);
    },
    loadRankList: function () {
        // TODO cc.Scale9Sprite 为什么不能用 plist
        let rankListBg = new cc.Scale9Sprite('res/bg_rankinglist.png', cc.rect(0, 0, 504, 144), cc.rect(0, 80, 504, 20));
        this.addChild(rankListBg);
        rankListBg.setContentSize(504, 500);
        rankListBg.setPosition(cc.winSize.width / 4, cc.winSize.height / 2);

        let rankListTitle = new cc.Sprite('#rankinglist_title.png');
        rankListBg.addChild(rankListTitle);
        rankListTitle.setAnchorPoint(0, 1);
        rankListTitle.setPosition(20, rankListBg.getContentSize().height - 20);
    },
    loadBtnMain: function () {
        let quickStartNormal = new cc.Sprite('#button_ksks.png');
        let quickStart = new cc.MenuItemSprite(quickStartNormal, '', '', function () {
            cc.log('dddd');
        }.bind(this));

        quickStart.setPosition(cc.winSize.width * 3 / 5 + 30, cc.winSize.height * 3 / 4);

        let advanceNormal = new cc.Sprite('#button_jjc.png');
        let advance = new cc.MenuItemSprite(advanceNormal, '', '', function () {
            cc.log('advance');
        }.bind(this));

        advance.setPosition(cc.winSize.width * 3 / 5 + 30, cc.winSize.height / 2);

        let tournamentNormal = new cc.Sprite('#button_zbc.png');
        let tournament = new cc.MenuItemSprite(tournamentNormal, '', '', function () {
            cc.log('dddd');
        }.bind(this));

        tournament.setPosition(cc.winSize.width * 3 / 5 + 30, cc.winSize.height / 4);

        let menu = new cc.Menu(quickStart, advance, tournament);
        this.addChild(menu);
        menu.setPosition(110, 0);
    },
    loadBottomItem: function () {}
});
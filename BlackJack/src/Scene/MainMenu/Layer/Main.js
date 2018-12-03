var MMMainLayer = cc.Layer.extend({
    playersData: [
        {
            name: '燃烧吧，蛋蛋君君',
            golds: '34500',
            rankNum: 1,
            headImg: 'user-image2'
        },
        {
            name: '和 i 来的',
            golds: '34500',
            rankNum: 2,
            headImg: 'user-image6'
        },
        {
            name: '呼咯速度',
            golds: '34500',
            rankNum: 3,
            headImg: 'user-image3'
        },
        {
            name: '以暗地里',
            golds: '34500',
            rankNum: 4,
            headImg: 'user-image4'
        },
        {
            name: '阿迪咯多少',
            golds: '34500',
            rankNum: 5,
            headImg: 'user-image5'
        },
        {
            name: '奥迪的地方',
            golds: '34500',
            rankNum: 6,
            headImg: 'user-image6'
        }
    ],

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
        var btnMsg = new ccui.Button();
        var msgBg = new cc.Sprite('#bg_icon.png');
        var msgIcon = new cc.Sprite('#icon_message.png');

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
        var rankListBg = new cc.Scale9Sprite('res/bg_rankinglist.png', cc.rect(0, 0, 504, 144), cc.rect(0, 80, 504, 20));
        this.addChild(rankListBg);
        rankListBg.setContentSize(504, 500);
        rankListBg.setPosition(cc.winSize.width / 4 + 50, cc.winSize.height / 2 + 40);

        var rankListTitle = new cc.Sprite('#rankinglist_title.png');
        rankListBg.addChild(rankListTitle);
        rankListTitle.setAnchorPoint(0, 1);
        rankListTitle.setPosition(20, rankListBg.getContentSize().height - 20);

        var listView = new ccui.ScrollView();
        rankListBg.addChild(listView);
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setTouchEnabled(true);
        listView.setContentSize(504, 430);

        var nextPosX = 650;
        var imageView = null;
        for (var i = 0; i < this.playersData.length; i++) {
            imageView = new RankItemLayer(this.playersData[i].rankNum, this.playersData[i].headImg, this.playersData[i].name, this.playersData[i].golds);
            listView.addChild(imageView);
            imageView.setAnchorPoint(cc.p(0, 1));
            imageView.setPosition(0, nextPosX);
            nextPosX -= 100;
        }
        listView.setInnerContainerSize(cc.size(504, 750));
    },
    loadBtnMain: function () {
        var quickStartNormal = new cc.Sprite('#button_ksks.png');
        var quickStart = new cc.MenuItemSprite(quickStartNormal, '', '', function () {
            quickStart.setScale(0.9);
            cc.director.runScene(new GamePlayScene());
        }.bind(this));

        quickStart.setPosition(cc.winSize.width * 3 / 5 + 30, cc.winSize.height * 3 / 4);

        var advanceNormal = new cc.Sprite('#button_jjc.png');
        var advance = new cc.MenuItemSprite(advanceNormal, '', '', function () {
            advance.setScale(0.9);
            cc.log('advance');
        }.bind(this));

        advance.setPosition(cc.winSize.width * 3 / 5 + 30, cc.winSize.height / 2);

        var tournamentNormal = new cc.Sprite('#button_zbc.png');
        var tournament = new cc.MenuItemSprite(tournamentNormal, '', '', function () {
            tournament.setScale(0.9);
            cc.log('dddd');
        }.bind(this));

        tournament.setPosition(cc.winSize.width * 3 / 5 + 30, cc.winSize.height / 4);

        var menu = new cc.Menu(quickStart, advance, tournament);
        this.addChild(menu);
        menu.setPosition(110, 40);
    },
    loadBottomItem: function () {
        var bottomLeft = new cc.Sprite('#bg_xiamian.png');
        var bottomRight = new cc.Sprite('#bg_xiamian.png');

        this.addChild(bottomLeft);
        bottomLeft.setAnchorPoint(1, 0);
        bottomLeft.setPosition(cc.winSize.width / 2, 0);
        // 翻转
        bottomLeft.setFlippedX(true);

        this.addChild(bottomRight);
        bottomRight.setAnchorPoint(0, 0);
        bottomRight.setPosition(cc.winSize.width / 2, 0);

        var bottomLeftSize = bottomLeft.getContentSize();
        var bottomRightSize = bottomRight.getContentSize();

        var userPhoto = new cc.Sprite('#Stroke_photo_oneself.png');
        bottomRight.addChild(userPhoto);
        userPhoto.setPosition(bottomRightSize.width - 100, 80);
        var photoFrame = new cc.Sprite('#circle_2.png');
        userPhoto.addChild(photoFrame);
        photoFrame.setScale(0.9);
        photoFrame.setPosition(userPhoto.getContentSize().width / 2 - 1, userPhoto.getContentSize().height / 2 + 2);

        var userName = new ccui.Text('莫里亚蒂',"AmericanTypewriter", 40);
        bottomRight.addChild(userName);
        userName.setPosition(bottomRightSize.width / 2 + 80, 50);

        var setting = new cc.Sprite('#icon_set.png');
        bottomRight.addChild(setting);
        setting.setPosition(50, bottomRightSize.height / 2);

        var rule = new cc.Sprite('#icon_guizhe.png');
        bottomLeft.addChild(rule);
        rule.setPosition(bottomLeftSize.width - 50, bottomLeftSize.height / 2);

        var diamondBg = new cc.Scale9Sprite('res/bg_gold.png', cc.rect(0, 0, 70, 42), cc.rect(20, 0, 25, 42));
        var goldBg = new cc.Scale9Sprite('res/bg_gold.png', cc.rect(0, 0, 70, 42), cc.rect(20, 0, 25, 42));
        diamondBg.setContentSize(180, 42);
        goldBg.setContentSize(180, 42);
        bottomLeft.addChild(diamondBg);
        bottomLeft.addChild(goldBg);

        var diamondBgSize = diamondBg.getContentSize();
        var goldBgSize = goldBg.getContentSize();

        diamondBg.setPosition(200, bottomLeftSize.height / 2);
        goldBg.setPosition(430, bottomLeftSize.height / 2);

        var diamond = new cc.Sprite('#icon_diamond.png');
        diamondBg.addChild(diamond);
        diamond.setPosition(0, diamondBgSize.height / 2);

        var diamondNum = new ccui.Text('99999',"AmericanTypewriter", 30);
        diamondBg.addChild(diamondNum);
        diamondNum.setPosition(80, diamondBgSize.height / 2);

        var diamondPlus = new cc.Sprite('#icon_.png');
        diamondBg.addChild(diamondPlus);
        diamondPlus.setAnchorPoint(1, 0.5);
        diamondPlus.setPosition(diamondBgSize.width - 10, diamondBgSize.height / 2);

        var gold = new cc.Sprite('#icon_gold_big.png');
        goldBg.addChild(gold);
        gold.setPosition(0, goldBgSize.height / 2);

        var goldNum = new ccui.Text('99999',"AmericanTypewriter", 30);
        goldBg.addChild(goldNum);
        goldNum.setPosition(80, goldBgSize.height / 2);

        var goldPlus = new cc.Sprite('#icon_.png');
        goldBg.addChild(goldPlus);
        goldPlus.setAnchorPoint(1, 0.5);
        goldPlus.setPosition(goldBgSize.width - 10, goldBgSize.height / 2);
    }
});
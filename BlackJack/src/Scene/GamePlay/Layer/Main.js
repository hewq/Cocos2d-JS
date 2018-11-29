let GPMainLayer = cc.Layer.extend({
    goldBgArr: [],
    btnClear: null,
    btnBet: null,
    gamingLayout: null,
    betBox: null,
    btnStart: null,
    listener: null,
    startListener: null,
    labelOwnChip: null,
    labelBetChip: null,
    labelSystemTips: null,
    ctor: function () {
        this._super();

        this.loadTips();

        this.loadBetPool();

        this.loadPlayer();

        this.registerEvent();

        this.loadStart();

        return true;
    },
    loadTips: function () {
        let tips = new ccui.Text(GameManager.getSystemTips(), 'AmericanTypewriter', 40);
        tips.setPosition(cc.winSize.width / 2 - 150, cc.winSize.height - 150);
        this.addChild(tips);
        this.labelSystemTips = tips;
    },
    loadBetPool: function () {
        let layout = new ccui.Layout();
        this.addChild(layout);
        layout.setContentSize(1624, 750);
        layout.setAnchorPoint(0.5, 0.5);
        layout.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);

        let poolBg = null,
            iconGold = null,
            goldNum = null;

        for (let i = 0; i < betPoolInfo.length; i++) {
            poolBg = new cc.Scale9Sprite('res/bg_gold.png', cc.rect(0, 0, 70, 42), cc.rect(20, 0, 25, 42));
            poolBg.setContentSize(130, 42);
            poolBg.setAnchorPoint(0.5, 0.5);
            poolBg.setOpacity(90);
            poolBg.setPosition(betPoolInfo[i].pos.x, betPoolInfo[i].pos.y);
            layout.addChild(poolBg);

            for (let j = 0; j < 5; j++) {
                iconGold = new cc.Sprite('#icon_gold_big.png');
                poolBg.addChild(iconGold);
                iconGold.setPosition(0, 6 + j * 6);
            }

            goldNum = new cc.LabelTTF('0', 'AmericanTypewriter', 20);
            poolBg.addChild(goldNum);
            goldNum.setPosition(poolBg.getContentSize().width / 2, poolBg.getContentSize().height / 2);

            if (i === 2) {
                this.labelBetChip = goldNum;
            }
        }
    },
    loadStart: function () {
        let node = new ccui.Button();
        this.addChild(node);
        node.loadTextures('button_blue.png', '', '', ccui.Widget.PLIST_TEXTURE);
        node.setPosition(cc.winSize.width / 2, 60);
        node.setTouchEnabled(true);

        let text = new cc.LabelTTF('下注', 'AmericanTypewriter', 35);
        node.addChild(text);
        text.setPosition(node.getContentSize().width / 2, node.getContentSize().height / 2 + 10);

        this.btnStart = node;

        node.setTag(Tag.START);

        node.addTouchEventListener(function (sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:
                    let parent = sender.parent;
                    parent.loadBox();
                    parent.removeChildByTag(Tag.START);
                    GameManager.setSystemTips('请下注');
                    parent.labelSystemTips.setString(GameManager.getSystemTips());
                    while (parent.getChildByTag(Tag.CARD)) {
                        parent.removeChildByTag(Tag.CARD, true);
                    }
                    parent.restart();
                    parent.labelBetChip.setString(GameManager.getBetChip());

                    break;
                default:
                    break;
            }
        }, this);
    },
    loadBox: function () {
        let boxBg = new cc.Scale9Sprite('res/bg_gold_touzhu.png', cc.rect(0, 0, 141, 103), cc.rect(120, 0, 130, 103));
        boxBg.setContentSize(640, 103);
        this.addChild(boxBg);

        boxBg.setTag(Tag.BTN_BET_BOX);

        this.betBox = boxBg;

        boxBg.anchorX = 1;
        boxBg.anchorY = 0;

        boxBg.setPosition(cc.winSize.width, 0);

        let boxBgSize = boxBg.getContentSize();

        let btnClear = new ccui.Button();
        boxBg.addChild(btnClear);
        btnClear.loadTextures('icon_qingkongtouzhu.png', '', '', ccui.Widget.PLIST_TEXTURE);
        btnClear.setAnchorPoint(0, 0.5);
        btnClear.setPosition(35, boxBgSize.height / 2 - 5);
        btnClear.setTouchEnabled(true);

        btnClear.addTouchEventListener(function (sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:
                    let that = sender.parent.parent;
                    let betChip = GameManager.getBetChip();
                    let ownChip = GameManager.getOwnChip();

                    GameManager.setSystemTips('请下注');
                    GameManager.setOwnChip(ownChip + betChip);
                    GameManager.setBetChip(0);

                    while (that.getChildByTag(Tag.AM_BET_CHIP)) {
                        that.removeChildByTag(Tag.AM_BET_CHIP, true);
                    }

                    that.labelBetChip.setString('0');
                    that.labelSystemTips.setString(GameManager.getSystemTips());
                    that.labelOwnChip.setString('$' + GameManager.getOwnChip());
                    break;
                default:
                    break;
            }
        }, this);
        this.btnClear = btnClear;

        let chip = null;
        let goldBg = null;

        for (let i = 0; i < chipPng.length; i++) {
            goldBg = new cc.Sprite('#bg_gold(1).png');
            boxBg.addChild(goldBg);
            goldBg.setAnchorPoint(0, 0.5);
            goldBg.setPosition(i * 85 + 120, boxBgSize.height / 2);
            chip = new cc.Sprite(chipPng[i]);
            chip.setPosition(goldBg.getContentSize().width / 2, goldBg.getContentSize().height / 2);
            goldBg.addChild(chip);

            goldBg.setTag(i);

            this.goldBgArr[i] = goldBg;
        }

        for (let i = 0; i < this.goldBgArr.length; i++) {
            cc.eventManager.addListener(this.listener.clone(), this.goldBgArr[i]);
        }

        let btnBet = new ccui.Button();
        boxBg.addChild(btnBet);
        btnBet.loadTextures('icon_touzhu-.png', '', '', ccui.Widget.PLIST_TEXTURE);
        btnBet.setAnchorPoint(1, 0);
        btnBet.setPosition(boxBg.width + 20, -20);
        btnBet.setTouchEnabled(true);

        btnBet.addTouchEventListener(function (sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:
                    let that = sender.parent.parent;
                    let betChip = GameManager.getBetChip();
                    if (betChip !== 0) {
                        that.removeChildByTag(Tag.BTN_BET_BOX);
                        that.loadBtnGaming();
                        that.loadCard();
                    }
                    break;
                default:
                    break;
            }
        }, this);
        this.btnBet = btnBet;
    },
    loadPlayer: function () {
        let layout = new ccui.Layout();
        this.addChild(layout);
        layout.setContentSize(1624, 750);
        layout.setAnchorPoint(0.5, 0.5);
        layout.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);

        for (let i = 0; i < playerInfo.length; i++) {
            let playerLayout = new ccui.Layout();
            layout.addChild(playerLayout);
            playerLayout.setAnchorPoint(0.5, 0.5);
            playerLayout.setContentSize(400, 140);
            playerLayout.setPosition(playerInfo[i].pos.x, playerInfo[i].pos.y);

            let layoutSize = playerLayout.getContentSize();

            let photoFrame = new cc.Sprite('#daojishi_photo.png');
            playerLayout.addChild(photoFrame);
            photoFrame.setAnchorPoint(0.5, 0.5);
            photoFrame.setPosition(layoutSize.width / 2, layoutSize.height / 2);

            let photo = new cc.Sprite(playerInfo[i].headPhoto);
            photoFrame.addChild(photo);
            photo.setPosition(photoFrame.getContentSize().width / 2, photoFrame.getContentSize().height / 2);

            let playerName = new cc.LabelTTF(playerInfo[i].name, 'AmericanTypewriter', 24);
            playerLayout.addChild(playerName);

            let goldNum = new cc.LabelBMFont('$' + playerInfo[i].goldNums, res.stake_fnt);
            playerLayout.addChild(goldNum);

            if (i === 2) {
                this.labelOwnChip = goldNum;
                GameManager.setOwnChip(playerInfo[i].goldNums);
            }

            if (i < 3) {
                playerName.setAnchorPoint(1, 0);
                playerName.setPosition(layoutSize.width / 2 - 85, layoutSize.height / 2);
                goldNum.setAnchorPoint(1, 1);
                goldNum.setPosition(layoutSize.width / 2 - 85, layoutSize.height / 2);
            } else {
                playerName.setAnchorPoint(0, 0);
                playerName.setPosition(layoutSize.width / 2 + 85, layoutSize.height / 2);
                goldNum.setAnchorPoint(0, 1);
                goldNum.setPosition(layoutSize.width / 2 + 85, layoutSize.height / 2);
            }
        }
    },
    amBetChip: function () {
        let chip = new cc.Sprite('#icon_gold_big.png');
        this.addChild(chip);
        chip.setTag(Tag.AM_BET_CHIP);
        chip.setPosition(cc.winSize.width - 300, 0);
        let bezierToConfig = [
            cc.p(cc.winSize.width - 300, cc.winSize.height),
            cc.p(cc.winSize.width / 2, cc.winSize.height / 2),
            cc.p(cc.winSize.width / 2 - 30 + Math.random() * 80, cc.winSize.height / 2 + 150 - Math.random() * 60)
        ];
        let bezierTo = cc.bezierTo(.5, bezierToConfig);
        chip.runAction(bezierTo);
    },
    loadBtnGaming: function () {
        let layout = new ccui.Layout();
        this.addChild(layout);
        this.gamingLayout = layout;
        layout.setContentSize(740, 100);
        layout.setAnchorPoint(1, 0);
        layout.setPosition(cc.winSize.width - 30, 0);
        layout.setTag(Tag.LAYOUT_BTN_GAMING);

        let btnStand = new ccui.Button();
        layout.addChild(btnStand);
        btnStand.loadTextures('button_orange.png', '', '', ccui.Widget.PLIST_TEXTURE);
        btnStand.setTouchEnabled(true);
        btnStand.setAnchorPoint(0, 0);
        btnStand.setPosition(0, 0);

        let textStand = new cc.Sprite('#stand.png');
        btnStand.addChild(textStand);
        textStand.setPosition(btnStand.getContentSize().width / 2, btnStand.getContentSize().height / 2 + 10);

        btnStand.addTouchEventListener(function (sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:
                    let that = sender.parent.parent;
                    let betChip = GameManager.getBetChip();
                    let ownChip = GameManager.getOwnChip();
                    let status = '';

                    while (that.getChildByTag(Tag.DEALER_DIPAI)) {
                        that.removeChildByTag(Tag.DEALER_DIPAI, true);
                    }

                    that.showDealerCard();
                    that.computePlayer();
                    that.computeRes();
                    that.resultText();
                    if (GameManager.getIsWin() === 1) {
                        GameManager.setOwnChip(ownChip + betChip * 2);
                    } else if (GameManager.getIsWin() === 0) {
                        GameManager.setOwnChip(ownChip + betChip);
                    }

                    while (that.getChildByTag(Tag.AM_BET_CHIP)) {
                        that.removeChildByTag(Tag.AM_BET_CHIP, true);
                    }

                    that.loadStart();
                    that.removeChildByTag(Tag.LAYOUT_BTN_GAMING);
                    status = that.labelSystemTips.getString();

                    that.labelBetChip.setString(betChip + '');
                    that.labelSystemTips.setString(status);
                    that.labelOwnChip.setString('$' + GameManager.getOwnChip());
                    GameManager.setBetChip(0);

                    break;
                default:
                    break;
            }
        }, this);

        let btnHit = new ccui.Button();
        layout.addChild(btnHit);
        btnHit.loadTextures('button_blue.png', '', '', ccui.Widget.PLIST_TEXTURE);
        btnHit.setTouchEnabled(true);
        btnHit.setAnchorPoint(0.5, 0);
        btnHit.setPosition(370, 0);

        let textHit = new cc.Sprite('#hit.png');
        btnHit.addChild(textHit);
        textHit.setPosition(btnHit.getContentSize().width / 2, btnHit.getContentSize().height / 2 + 10);

        btnHit.addTouchEventListener(function (sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:
                    sender.parent.parent.getOneCard();

                    break;
                default:
                    break;
            }
        }, this);

        let btnDouble = new ccui.Button();
        layout.addChild(btnDouble);
        btnDouble.loadTextures('button_blue.png', '', '', ccui.Widget.PLIST_TEXTURE);
        btnDouble.setTouchEnabled(true);
        btnDouble.setAnchorPoint(1, 0);
        btnDouble.setPosition(740, 0);

        let textDouble = new cc.Sprite('#double.png');
        btnDouble.addChild(textDouble);
        textDouble.setPosition(btnDouble.getContentSize().width / 2, btnDouble.getContentSize().height / 2 + 10);

        btnDouble.addTouchEventListener(function (sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:
                    sender.parent.parent.getDoubleCard();;
                    break;
                default:
                    break;
            }
        }, this);

    },
    registerEvent: function () {
        let eventListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            target: this,
            onTouchBegan: function (touch, event) {
                // 获取当前触发事件的对象
                let target = event.getCurrentTarget();

                // 将点击坐标转换为基于当前触发事件对象的本地坐标
                let posInNode = target.convertToNodeSpace(touch.getLocation());

                // 获取当前节点大小
                let size = target.getContentSize();

                // 区域设定
                let rect = cc.rect(0, 0, size.width, size.height);

                // 判断触摸点是否在节点区域内
                if (!(cc.rectContainsPoint(rect, posInNode))) {
                    return false;
                }

                return true;
            },
            onTouchEnded: function (touch, event) {
                let that = event.getCurrentTarget().parent.parent;
                let status = '';
                let ownChip = GameManager.getOwnChip();

                function checkBalance(chip) {
                    if (ownChip >= chip) {
                        GameManager.setBetChip(GameManager.getBetChip() + chip);
                        GameManager.setOwnChip(ownChip - chip);
                        that.amBetChip();
                    } else {
                        status = '金币不足！'
                    }
                }

                switch (event.getCurrentTarget().tag) {
                    case Tag.CHIP_10K:
                        checkBalance(10000);
                        break;
                    case Tag.CHIP_5K:
                        checkBalance(5000);
                        break;
                    case Tag.CHIP_2K:
                        checkBalance(2000);
                        break;
                    case Tag.CHIP_1K:
                        checkBalance(1000);
                        break;
                }

                that.labelBetChip.setString(GameManager.getBetChip() + '');
                that.labelSystemTips.setString(status);
                that.labelOwnChip.setString('$' + GameManager.getOwnChip());
            }
        });

        this.listener = eventListener;
    },
    loadCard: function () {
        let dealerPoker_1 = new cardSprite(true);
        let dealerPoker_2 = new cardSprite(true);

        this.addChild(dealerPoker_1);
        this.addChild(dealerPoker_2);

        dealerPoker_1.setTag(Tag.DEALER_DIPAI);
        dealerPoker_2.setTag(Tag.DEALER_DIPAI);

        dealerPoker_1.setPosition(cc.winSize.width / 2 - 10, cc.winSize.height - 140);
        dealerPoker_2.setPosition(cc.winSize.width / 2 - 10, cc.winSize.height - 140);

        let dealerPokerMove = cc.moveTo(.3, cc.p(cc.winSize.width / 2 + 10, cc.winSize.height - 140));

        dealerPoker_2.runAction(dealerPokerMove);

        GameManager.getDealerCard().push(this.getPokerRandom());
        GameManager.getDealerCard().push(this.getPokerRandom());
        GameManager.setDealerCard(GameManager.getDealerCard());

        GameManager.getPlayerCard().push(this.getPokerRandom());
        GameManager.getPlayerCard().push(this.getPokerRandom());
        GameManager.setPlayerCard(GameManager.getPlayerCard());

        let playerCard = GameManager.getPlayerCard();
        let playerPoker_1 = new cardSprite(false, playerCard[0]);
        let playerPoker_2 = new cardSprite(false, playerCard[1]);

        this.addChild(playerPoker_1);
        this.addChild(playerPoker_2);

        playerPoker_1.setPosition(cc.winSize.width / 2 + 20, cc.winSize.height / 2 - 45);
        playerPoker_2.setPosition(cc.winSize.width / 2 + 20, cc.winSize.height / 2 - 45);

        let playerPokerMove = cc.moveTo(.3, cc.p(cc.winSize.width / 2 + 50, cc.winSize.height / 2 - 45));

        playerPoker_2.runAction(playerPokerMove);
    },
    showDealerCard: function () {
        let layout = new ccui.Layout();
        this.addChild(layout);
        layout.setPosition(cc.winSize.width / 2, cc.winSize.height - 140);
        layout.setTag(Tag.CARD);
        let dealerCard = null;
        this.computeDealer();
        let dealerCardArr = GameManager.getDealerCard();

        for (let i = 0; i < dealerCardArr.length; i++) {
            dealerCard = new cardSprite(false, dealerCardArr[i]);
            layout.addChild(dealerCard);
            dealerCard.setAnchorPoint(0, 0.5);
            dealerCard.setPosition(0, layout.getContentSize().height / 2);
            let dealerPokerMove = cc.moveTo(.3, cc.p(i * 30, layout.getContentSize().height / 2));

            dealerCard.runAction(dealerPokerMove);
        }
    },
    computeDealer: function () {
        let dealerCard = GameManager.getDealerCard(); // 庄家牌
        let dealerCard0 = dealerCard[0].num;
        let dealerCard1 = dealerCard[1].num;
        let getCard = null;

        // double jack
        if (dealerCard0 === 1 && dealerCard1 === 1) {
            GameManager.setDealerDoubleJack(true);
            return;
        }

        // black jack
        if (dealerCard0 === 1 && dealerCard1 === 10 || dealerCard0 === 10 && dealerCard1 === 1) {
            GameManager.setDealerBlackJack(true);
            return;
        }

        // has jack
        if (dealerCard0 === 1 || dealerCard1 === 1) {
            let notJackCard = dealerCard0 === 1 ? dealerCard1 : dealerCard0;

            GameManager.setDealerNum(11 + notJackCard);
            if (notJackCard > 3) {
                return;
            }

            if (notJackCard === 3) { // 13~14
                getCard = this.getDealerCard(); // 3

                if (getCard.num > 8) { // > 21
                    GameManager.setDealerNum(getCard.num + 4);
                    this.getDealerCard(); // 4

                    if (this.checkBoom(GameManager.getDealerNum())) {
                        GameManager.setDealerBust(true);
                        return;
                    }

                    if (this.checkPoint(GameManager.getDealerNum())) return;

                    this.getDealerCard(); // 5
                    if (this.checkBoom(GameManager.getDealerNum())) {
                        GameManager.setDealerBust(true);
                        return;
                    }

                    GameManager.setDealerFive(true);
                    return;
                }

                if (getCard.num === 8 || getCard.num === 7) { // 21
                    GameManager.setDealerNum(21);
                    return;
                }

                if (getCard.num === 1) { // 21
                    GameManager.setDealerNum(5);
                    this.getDealerCard();  // 4

                    if(this.checkPoint(GameManager.getDealerNum())) return;

                    this.getDealerCard();  // 5

                    if (this.checkBoom(GameManager.getDealerNum()))  {
                        GameManager.setDealerBust(true);
                        return;
                    }

                    GameManager.setDealerFive(true);
                    return;
                }

                return;
            }

            if (notJackCard === 2) { // 12~13
                getCard = this.getDealerCard(); // 3

                if (getCard.num === 10) {
                    GameManager.setDealerNum(13);
                    this.getDealerCard();  // 4

                    if (this.checkBoom(GameManager.getDealerNum())) {
                        GameManager.setDealerBust(true);
                        return;
                    }

                    if (this.checkPoint(GameManager.getDealerNum())) return;

                    this.getDealerCard(); // 5

                    if (this.checkBoom(GameManager.getDealerNum())) {
                        GameManager.setDealerBust(true);
                        return;
                    }

                    GameManager.setDealerFive(true);
                    return;
                }

                if (getCard.num === 9 || getCard.num === 8) { // 21
                    GameManager.setDealerNum(21);
                    return;
                }

                if (getCard.num === 1) {
                    GameManager.setDealerNum(4);
                    this.getDealerCard(); // 4
                    this.getDealerCard(); // 5

                    if (this.checkBoom(GameManager.getDealerNum())) {
                        GameManager.setDealerBust(true);
                        return;
                    }

                    GameManager.setDealerFive(true);
                    return;
                }

                return;
            }
        }

        // has not jack
        GameManager.setDealerNum(dealerCard0 + dealerCard1);

        if (this.checkPoint(GameManager.getDealerNum())) return;

        if(GameManager.getDealerNum() > 11){ // 12~14
            this.getDealerCard();  // 3

            if (this.checkBoom(GameManager.getDealerNum())) {
                GameManager.setDealerBust(true);
                return;
            }

            if (this.checkPoint(GameManager.getDealerNum())) return;

            // 13~14
            this.getDealerCard(); // 4
            if (this.checkBoom(GameManager.getDealerNum())) {
                GameManager.setDealerBust(true);
                return;
            }

            if (this.checkPoint(GameManager.getDealerNum())) return;

            // 14
            this.getDealerCard();

            if (this.checkBoom(GameManager.getDealerNum())) {
                GameManager.setDealerBust(true);
                return;
            }

            GameManager.setDealerFive(true);
            return;
        }

        if (GameManager.getDealerNum() === 11) { // 11
            getCard = this.getDealerCard();  // 3
            if (getCard.num === 1) {
                GameManager.setDealerNum(21);
                return;
            }

            if (this.checkPoint(GameManager.getDealerNum())) return;

            this.getDealerCard(); // 4
            if (this.checkBoom(GameManager.getDealerNum())) {
                GameManager.setDealerBust(true);
                return;
            }

            if (this.checkPoint(GameManager.getDealerNum())) return;

            // 14
            this.getDealerCard();

            if (this.checkBoom(GameManager.getDealerNum())) {
                GameManager.setDealerBust(true);
                return;
            }

            GameManager.setDealerFive(true);
            return;
        }

        if (GameManager.getDealerNum() === 10) {  // 10
            getCard = this.getDealerCard(); // 3
            if (getCard.num === 1) {  // 21
                GameManager.setDealerNum(21);
                return;
            }

            if (this.checkPoint(GameManager.getDealerNum())) return;

            this.getDealerCard(); // 4

            if (this.checkBoom(GameManager.getDealerNum())) {
                GameManager.setDealerBust(true);
                return;
            }

            if (this.checkPoint(GameManager.getDealerNum())) return;

            this.getDealerCard();

            if (this.checkBoom(GameManager.getDealerNum())) {
                GameManager.setDealerBust(true);
                return;
            }

            GameManager.setDealerFive(true);
            return;
        }

        // 4~9
        getCard = this.getDealerCard(); // 3
        if (getCard.num === 1) { // 15~20
            GameManager.setDealerNum(GameManager.getDealerNum() + 10);
            return;
        }

        if (this.checkPoint(GameManager.getDealerNum())) return;

        // 6~14
        getCard = this.getDealerCard(); // 4

        if (getCard.num === 1) {
            if (GameManager.getDealerNum() < 12) { // 6~10
                GameManager.setDealerNum(GameManager.getDealerNum() + 10);
                return;
            }

            if (GameManager.getDealerNum() === 12) { // 11
                GameManager.setDealerNum(21);
                return;
            }

            if (this.checkPoint(GameManager.getDealerNum())) return;

            // 13~14
            this.getDealerCard(); // 5

            if (this.checkBoom(GameManager.getDealerNum())) {
                GameManager.setDealerBust(true);
                return;
            }

            GameManager.setDealerFive(true);
            return;
        }

        if (this.checkBoom(GameManager.getDealerNum())) {
            GameManager.setDealerBust(true);
            return;
        }

        if (this.checkPoint(GameManager.getDealerNum())) return;

        // 8~14
        this.getDealerCard(); // 5
        if (this.checkBoom(GameManager.getDealerNum())) {
            GameManager.setDealerBust(true);
            return;
        }
        GameManager.setDealerFive(true);
    },
    checkBoom: function (num) {
        return num > 21;
    },
    checkPoint: function (num) {
        return num > 14 && num < 22;
    },
    getDealerCard: function () {
        let card = this.getPokerRandom();
        GameManager.getDealerCard().push(card);
        GameManager.setDealerCard(GameManager.getDealerCard());
        GameManager.setDealerNum(GameManager.getDealerNum() + card.num);

        return card;
    },
    getOneCard: function () {
        let sprite = null;
        let playerCard = GameManager.getPlayerCard();
        if (playerCard.length >= 5) return;

        if (playerCard.length === 2) {
            GameManager.getPlayerCard().push(this.getPokerRandom());
            playerCard = GameManager.getPlayerCard();
            sprite = new cardSprite(false, playerCard[2]);
            this.addChild(sprite);
            sprite.setPosition(cc.winSize.width / 2 + 80, cc.winSize.height / 2 - 45);
            return;
        }

        if (playerCard.length === 3) {
            GameManager.getPlayerCard().push(this.getPokerRandom());
            playerCard = GameManager.getPlayerCard();
            sprite = new cardSprite(false, playerCard[3]);
            this.addChild(sprite);
            sprite.setPosition(cc.winSize.width / 2 + 110, cc.winSize.height / 2 - 45);
            return;
        }

        if (playerCard.length === 4) {
            GameManager.getPlayerCard().push(this.getPokerRandom());
            playerCard = GameManager.getPlayerCard();
            sprite = new cardSprite(false, playerCard[4]);
            this.addChild(sprite);
            sprite.setPosition(cc.winSize.width / 2 + 140, cc.winSize.height / 2 - 45);
        }
    },
    getDoubleCard: function () {
        let sprite = null;
        let playerCard = GameManager.getPlayerCard();
        if (playerCard.length >= 4) return;

        if (playerCard.length === 2) {
            GameManager.getPlayerCard().push(this.getPokerRandom());
            playerCard = GameManager.getPlayerCard();
            sprite = new cardSprite(false, playerCard[2]);
            this.addChild(sprite);
            sprite.setPosition(cc.winSize.width / 2 + 80, cc.winSize.height / 2 - 45);

            GameManager.getPlayerCard().push(this.getPokerRandom());
            playerCard = GameManager.getPlayerCard();
            sprite = new cardSprite(false, playerCard[3]);
            this.addChild(sprite);
            sprite.setPosition(cc.winSize.width / 2 + 110, cc.winSize.height / 2 - 45);
            return;
        }

        if (playerCard.length === 3) {
            GameManager.getPlayerCard().push(this.getPokerRandom());
            playerCard = GameManager.getPlayerCard();
            sprite = new cardSprite(false, playerCard[3]);
            this.addChild(sprite);
            sprite.setPosition(cc.winSize.width / 2 + 110, cc.winSize.height / 2 - 45);

            GameManager.getPlayerCard().push(this.getPokerRandom());
            playerCard = GameManager.getPlayerCard();
            sprite = new cardSprite(false, playerCard[4]);
            this.addChild(sprite);
            sprite.setPosition(cc.winSize.width / 2 + 140, cc.winSize.height / 2 - 45);
        }
    },
    getPokerRandom: function () {
        let random = Math.floor(Math.random() * GameManager.getPokerNum());
        let cardInfo = poker[random];
        poker.splice(random, 1);

        GameManager.setPokerNum(GameManager.getPokerNum() - 1);

        return cardInfo;
    },
    computePlayer: function () {
        let playerCard = GameManager.getPlayerCard();
        let playerCardLength = playerCard.length;

        if (playerCardLength === 2) {
            let playerCard0 = playerCard[0].num;
            let playerCard1 = playerCard[1].num;

            // double jack
            if (playerCard0 === 1 && playerCard1 === 1) {
                GameManager.setPlayerDoubleJack(true);
                return;
            }

            // black jack
            if (playerCard0 === 1 && playerCard1 === 10 || playerCard0 === 10 && playerCard1 === 1) {
                GameManager.setPlayerBlackJack(true);
                return;
            }

            // has jack
            if (playerCard0 === 1 || playerCard1 === 1) {
                let notJackCard = playerCard0 === 1 ? playerCard1 : playerCard0;
                GameManager.setPlayerNum(11 + notJackCard);
                return;
            }

            GameManager.setPlayerNum(playerCard0 + playerCard1)
            return;
        }

        if (playerCardLength === 3) {
            let jackLen = 0;
            let total = playerCard[0].num + playerCard[1].num + playerCard[2].num;
            for (let i = 0; i < playerCardLength; i++) {
                if (playerCard[i].num === 1) {
                    jackLen++;
                }
            }

            if (jackLen === 1) {
                if (total - 1 < 11) {
                    GameManager.setPlayerNum(total + 10);
                    return;
                }

                if (total - 1 === 11) {
                    GameManager.setPlayerNum(total + 9);
                    return;
                }
            }

            GameManager.setPlayerNum(total);
            if (total > 21) {
                GameManager.setPlayerBust(true);
            }
            return;
        }

        if (playerCardLength === 4) {
            let jackLen = 0;
            let total = playerCard[0].num + playerCard[1].num + playerCard[2].num+ playerCard[3].num;
            for (let i = 0; i < playerCardLength; i++) {
                if (playerCard[i].num === 1) {
                    jackLen++;
                }
            }

            if (jackLen === 1) {
                if (total - 1 < 11) {
                    GameManager.setPlayerNum(total + 10);
                    return;
                }

                if (total - 1 === 11) {
                    GameManager.setPlayerNum(total + 9);
                    return;
                }
            }

            GameManager.setPlayerNum(total);
            if (total > 21) {
                GameManager.setPlayerBust(true);
            }
            return;
        }

        if (playerCardLength === 5) {
            let total = playerCard[0].num + playerCard[1].num + playerCard[2].num + playerCard[3].num + playerCard[4].num;

            if (total > 21) {
                GameManager.setPlayerBust(true);
                return;
            }

            GameManager.setPlayerFive(true);
        }
    },
    computeRes: function () {
        let res = 0;
        let isPDJ = GameManager.getPlayerDoubleJack(),
            isPBJ = GameManager.getPlayerBlackJack(),
            isPF = GameManager.getPlayerFive(),
            isPB = GameManager.getPlayerBust(),
            PN = GameManager.getPlayerNum(),
            isDDJ = GameManager.getDealerDoubleJack(),
            isDBJ = GameManager.getDealerBlackJack(),
            isDF = GameManager.getDealerFive(),
            isDB = GameManager.getDealerBust(),
            DN = GameManager.getDealerNum();

        if (isDDJ) {
            res = isPDJ ? 0 : -1;
        } else if (isDBJ) {
            res = isPDJ ? 1 : (isPBJ ? 0 : -1);
        } else if (isDF) {
            res = isPDJ || isPBJ ? 1 : (isPF ? 0 : -1);
        } else if (isPBJ || isPDJ || isPF) {
            res = 1;
        } else if (isDB) {
            this.playBust();
            res = isPB ? 0 : (PN > 14 ? 1 : -1);
        } else if (isPB) {
            res = DN < 14 ? 1 : -1;
        } else {
            res = PN > DN ? 1 : (PN < DN ? -1 : 0);
        }

        GameManager.setIsWin(res);
    },
    resultText: function () {
        if (GameManager.getIsWin() === 1) {
            this.labelSystemTips.setString('你赢了');
            cc.audioEngine.playEffect(res.win_mp3, false);
        } else if (GameManager.getIsWin() === -1) {
            this.labelSystemTips.setString('你输了');
            cc.audioEngine.playEffect(res.fail_mp3, false);
        } else {
            this.labelSystemTips.setString('和局');
        }
    },
    restart: function () {
        GameManager.betAgain();
        poker = [].concat(resetPoker);
    },
    playBust: function () {
        let bust = new cc.Sprite('#BUST_1.png');
        this.addChild(bust);
        bust.setPosition(cc.winSize.width / 2, cc.winSize.height - 250);
        let frames = [];
        for (let i = 1; i < 11; i++) {
            let str = 'BUST_' + i + '.png';
            let frame = cc.spriteFrameCache.getSpriteFrame(str);
            frames.push(frame);
        }
        let animation = new cc.Animation(frames, 0.15);
        animation.setRestoreOriginalFrame(false);
        let animate = cc.animate(animation);
        bust.runAction(animate);
    }
});
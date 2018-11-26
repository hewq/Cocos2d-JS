let GPMainLayer = cc.Layer.extend({
    playing: null,
    playingChip: 0,
    playerChip: null,
    goldBgArr: [],
    btnClear: null,
    btnBet: null,
    playerStatus: null,
    gamingLayout: null,
    betBox: null,
    btnStart: null,
    listener: null,
    startListener: null,
    pokerNum: 52,
    playerCardNum: 0,
    dealerCard: [],
    dealerBlackJack: false,
    dealerDoubleJack: false,
    dealerFive: false,
    playerBlackJack: false,
    playerDoubleJack: false,
    playerFive: false,
    dealerNum: 0,
    playerNum: 0,
    dealerBoom: false,
    playerBoom: false,
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
        let tips = new cc.LabelTTF('请下注', 'AmericanTypewriter', 40);
        tips.setPosition(cc.winSize.width / 2, cc.winSize.height - 150);
        this.addChild(tips);
        this.playerStatus = tips;
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
                this.playing = goldNum;
            }
        }
    },
    loadStart: function () {
        let btnStartBg = new cc.Sprite('#button_blue.png');
        this.addChild(btnStartBg);
        btnStartBg.setPosition(cc.winSize.width / 2, 60);

        this.btnStart = btnStartBg;

        btnStartBg.setTag(Tag.START);

        let btnStart = new cc.LabelTTF('下注', 'AmericanTypewriter', 35);
        btnStartBg.addChild(btnStart);
        btnStart.setPosition(btnStartBg.getContentSize().width / 2, btnStartBg.getContentSize().height / 2 + 10);

        cc.eventManager.addListener(this.startListener, btnStartBg);
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

        let clear = new cc.Sprite('#icon_qingkongtouzhu.png');
        boxBg.addChild(clear);
        clear.setAnchorPoint(0, 0.5);
        clear.setPosition(35, boxBgSize.height / 2 - 5);
        clear.setTag(Tag.CLEAR);

        this.btnClear = clear;

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

        let btnBet = new cc.Sprite('#icon_touzhu-.png');
        boxBg.addChild(btnBet);
        btnBet.setAnchorPoint(1, 0);
        btnBet.setPosition(boxBg.width + 20, -20);
        btnBet.setTag(Tag.BET);
        this.btnBet = btnBet;

        for (let i = 0; i < this.goldBgArr.length; i++) {
            cc.eventManager.addListener(this.listener.clone(), this.goldBgArr[i]);
        }

        cc.eventManager.addListener(this.listener.clone(), this.btnClear);
        cc.eventManager.addListener(this.listener.clone(), this.btnBet);
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
                this.playerChip = goldNum;
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

        let btnStopBg = new cc.Sprite('#button_orange.png');
        layout.addChild(btnStopBg);
        btnStopBg.setAnchorPoint(0, 0);
        btnStopBg.setPosition(0, 0);
        btnStopBg.setTag(Tag.STOP);

        cc.eventManager.addListener(this.listener.clone(), btnStopBg);

        let btnStop = new cc.Sprite('#stand.png');
        btnStopBg.addChild(btnStop);
        btnStop.setPosition(btnStopBg.getContentSize().width / 2, btnStopBg.getContentSize().height / 2 + 10);

        let btnHitBg = new cc.Sprite('#button_blue.png');
        layout.addChild(btnHitBg);
        btnHitBg.setAnchorPoint(0.5, 0);
        btnHitBg.setPosition(370, 0);

        let btnHit = new cc.Sprite('#hit.png');
        btnHitBg.addChild(btnHit);
        btnHit.setPosition(btnHitBg.getContentSize().width / 2, btnHitBg.getContentSize().height / 2 + 10);


        let btnDoubleBg = new cc.Sprite('#button_blue.png');
        layout.addChild(btnDoubleBg);
        btnDoubleBg.setAnchorPoint(1, 0);
        btnDoubleBg.setPosition(740, 0);

        let btnDouble = new cc.Sprite('#double.png');
        btnDoubleBg.addChild(btnDouble);
        btnDouble.setPosition(btnDoubleBg.getContentSize().width / 2, btnDoubleBg.getContentSize().height / 2 + 10);
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
                let betChip = event.getCurrentTarget().parent.parent.playingChip;
                let playingStatus = '';
                let playerChip = +that.playerChip.getString().slice(1);

                function checkBalance(chip) {
                    playerChip = +that.playerChip.getString().slice(1);
                    if (playerChip >= chip) {
                        betChip += chip;
                        playerChip -= chip;
                        that.amBetChip();
                    } else {
                        playingStatus = '余额不足！'
                    }
                }

                function removeBetChip() {
                    while (that.getChildByTag(Tag.AM_BET_CHIP)) {
                        that.removeChildByTag(Tag.AM_BET_CHIP, true);
                    }
                }

                function removeDealerDipai() {
                    while (that.getChildByTag(Tag.DEALER_DIPAI)) {
                        that.removeChildByTag(Tag.DEALER_DIPAI, true);
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
                    case Tag.CLEAR:
                        playingStatus = '请下注';
                        playerChip = playerChip + betChip;
                        betChip = 0;
                        removeBetChip();
                        break;
                    case Tag.BET:
                        if (betChip !== 0) {
                            that.removeChildByTag(Tag.BTN_BET_BOX);
                            that.loadBtnGaming();
                            that.loadCard();
                        }
                        break;
                    case Tag.STOP:
                        removeDealerDipai();
                        that.showDealerCard();
                        break;
                }

                if (event.getCurrentTarget().tag < 5) {
                    that.playing.setString(betChip + '');
                    that.playerStatus.setString(playingStatus);
                    that.playerChip.setString('$' + playerChip);
                    event.getCurrentTarget().parent.parent.playingChip = betChip;
                }
            }
        });

        this.listener = eventListener;

        let startEventListener = cc.EventListener.create({
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
                let startThat = event.getCurrentTarget().parent;

                switch (event.getCurrentTarget().tag) {
                    case Tag.START:
                        startThat.loadBox();
                        startThat.removeChildByTag(Tag.START);
                        break;
                }
            }
        });

        this.startListener = startEventListener;
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

        this.dealerCard.push(this.getPokerRandom());
        this.dealerCard.push(this.getPokerRandom());

        let playerPoker_1 = new cardSprite(false, this.getPokerRandom());
        let playerPoker_2 = new cardSprite(false, this.getPokerRandom());

        this.addChild(playerPoker_1);
        this.addChild(playerPoker_2);

        playerPoker_1.setPosition(cc.winSize.width / 2 + 20, cc.winSize.height / 2 - 45);
        playerPoker_2.setPosition(cc.winSize.width / 2 + 20, cc.winSize.height / 2 - 45);

        let playerPokerMove = cc.moveTo(.3, cc.p(cc.winSize.width / 2 + 45, cc.winSize.height / 2 - 45));

        playerPoker_2.runAction(playerPokerMove);
    },
    showDealerCard: function () {
        let layout = new ccui.Layout();
        this.addChild(layout);
        layout.setPosition(cc.winSize.width / 2, cc.winSize.height - 140);
        let dealerCard = null;
        this.computeDealer();

        for (let i = 0; i < this.dealerCard.length; i++) {
            let dealerCard = new cardSprite(false, this.dealerCard[i]);
            layout.addChild(dealerCard);
            dealerCard.setAnchorPoint(0, 0.5);
            dealerCard.setPosition(0, layout.getContentSize().height / 2);
            let dealerPokerMove = cc.moveTo(.3, cc.p(i * 30, layout.getContentSize().height / 2));

            dealerCard.runAction(dealerPokerMove);
        }
    },
    computeDealer: function () {
        let dealerCard0 = this.dealerCard[0].num;
        let dealerCard1 = this.dealerCard[1].num;
        let getCard = null;
        let getCard2 = null;
        let getCard3 = null;

        // double jack
        if (dealerCard0 === 1 && dealerCard1 === 1) {
            this.dealerDoubleJack = true;
            return;
        }

        // black jack
        if (dealerCard0 === 1 && dealerCard1 === 10 || dealerCard0 === 10 && dealerCard1 === 1) {
            this.dealerBlackJack = true;
            return;
        }

        // has jack
        if (dealerCard0 === 1 || dealerCard1 === 1) {
            let notJackCard = dealerCard0 === 1 ? dealerCard1 : dealerCard0;

            this.dealerNum = 11 + notJackCard; // > 15
            if (notJackCard > 3) {
                return;
            }

            if (notJackCard === 3) { // 13~14
                getCard = this.getDealerCard();

                if (getCard.num > 8) { // > 21
                    this.dealerBoom = true;
                    return;
                }

                if (getCard.num === 8 || getCard.num === 7) { // 21
                    this.dealerNum = 21;
                    return;
                }

                return;
            }

            if (notJackCard === 2) { // 12~13
                getCard = this.getDealerCard();

                if (getCard.num === 10) {
                    this.dealerNum = 13;
                    getCard2 = this.getDealerCard();

                    if (getCard2.num === 1) {
                        this.dealerNum = 14;
                        getCard3 = this.getDealerCard();

                        if (this.checkBoom(this.dealerNum)) return;

                        this.dealerFive = true;
                        return;
                    }

                    // 15~23
                    if (this.checkBoom(this.dealerNum)) return;

                    return;
                }

                if (getCard.num === 9 || getCard.num === 8) { // 21
                    this.dealerNum = 21;
                    return;
                }

                if (getCard.num === 1) {
                    getCard2 = this.getDealerCard();

                    if (getCard2.num < 8) {
                        getCard3 = this.getDealerCard();
                        this.dealerFive = true;
                        return;
                    }

                    if (getCard2.num === 8) {
                        this.dealerNum = 21;
                        return;
                    }

                    if (getCard2.num > 8) {
                        this.dealerNum = 4 + getCard2.num;
                        getCard3 = this.getDealerCard();

                        if (this.checkBoom(this.dealerNum)) return;

                        this.dealerFive = true;
                        return;
                    }
                }

                return;
            }
        }

        // has not jack
        this.dealerNum = dealerCard0 + dealerCard1; // 4~20

        if (this.checkPoint(this.dealerNum)) return;

        if(this.dealerNum > 11){ // 12~14
            getCard = this.getDealerCard();

            if (this.checkBoom(this.dealerNum)) return;

            if (this.checkPoint(this.dealerNum)) return;

            // 13~14
            getCard2 = this.getDealerCard();

            if (this.checkBoom(this.dealerNum)) return;

            if (this.checkPoint(this.dealerNum)) return;

            // 14
            getCard3 = this.getDealerCard();

            if (this.checkBoom(this.dealerNum)) return;

            this.dealerFive = true; // 15~21
            return;
        }

        if (this.dealerNum === 11) { // 11
            getCard = this.getDealerCard();
            if (getCard.num === 1) {
                this.dealerNum = 21;
                return;
            }

            if (this.checkPoint(this.dealerNum)) return;

            // 13~14
            getCard2 = this.getDealerCard();

            if (this.checkBoom(this.dealerNum)) return;

            if (this.checkPoint(this.dealerNum)) return;

            // 14
            getCard3 = this.getDealerCard();

            if (this.checkBoom(this.dealerNum)) return;

            this.dealerFive = true;
            return;
        }

        if (this.dealerNum === 10) {  // 10
            getCard = this.getDealerCard();
            if (getCard.num === 1) {  // 21
                this.dealerNum = 21;
                return;
            }

            if (this.checkPoint(this.dealerNum)) return;

            // 12~14
            this.getDealerCard();

            if (this.checkBoom(this.dealerNum)) return;

            if (this.checkPoint(this.dealerNum)) return;

            // 13~14
            this.getDealerCard();

            if (this.checkBoom(this.dealerNum)) return;

            this.dealerFive = true;
            return;
        }

        // 4~9
        getCard = this.getDealerCard();
        if (getCard.num === 1) { // 15~20
            this.dealerNum += 10;
            return;
        }

        if (this.checkPoint(this.dealerNum)) return;

        // 6~14
        getCard2 = this.getDealerCard();

        if (getCard2.num === 1) {
            if (this.dealerNum < 12) { // 6~10
                this.dealerNum += 10;
                return;
            }

            if (this.dealerNum === 12) { // 11
                this.dealerNum = 21;
                return;
            }

            if (this.checkPoint(this.dealerNum)) return;

            // 13~14
            this.getDealerCard();

            if (this.checkBoom(this.dealerNum)) return;

            this.dealerFive = true;
            return;
        }

        if (this.checkBoom(this.dealerNum)) return;

        if (this.checkPoint(this.dealerNum)) return;

        // 8~14
        this.getDealerCard();

        if (this.checkBoom(this.dealerNum)) return;

        this.dealerFive = true;
        return;
    },
    checkBoom: function (num) {
        if (num > 21) return true;

        return false;
    },
    checkPoint: function (num) {
        if (num > 14 && num < 22) return true;

        return false;
    },
    getDealerCard: function () {
        let card = this.getPokerRandom();
        this.dealerCard.push(card);
        this.dealerNum += card.num;

        return card;
    },
    getPokerRandom: function () {
        let random = Math.floor(Math.random() * this.pokerNum);
        let cardInfo = poker[random];
        poker.splice(random, 1);

        this.pokerNum--;

        return cardInfo;
    }
});
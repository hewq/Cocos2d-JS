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

        btnStartBg.setTag(97);

        let btnStart = new cc.LabelTTF('下注', 'AmericanTypewriter', 35);
        btnStartBg.addChild(btnStart);
        btnStart.setPosition(btnStartBg.getContentSize().width / 2, btnStartBg.getContentSize().height / 2 + 10);

        cc.eventManager.addListener(this.listener.clone(), btnStartBg);
    },
    loadBox: function () {
        let boxBg = new cc.Scale9Sprite('res/bg_gold_touzhu.png', cc.rect(0, 0, 141, 103), cc.rect(120, 0, 130, 103));
        boxBg.setContentSize(640, 103);
        this.addChild(boxBg);

        boxBg.setTag(98);

        this.betBox = boxBg;

        boxBg.anchorX = 1;
        boxBg.anchorY = 0;

        boxBg.setPosition(cc.winSize.width, 0);

        let boxBgSize = boxBg.getContentSize();

        let clear = new cc.Sprite('#icon_qingkongtouzhu.png');
        boxBg.addChild(clear);
        clear.setAnchorPoint(0, 0.5);
        clear.setPosition(35, boxBgSize.height / 2 - 5);
        clear.setTag(4);

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
        btnBet.setTag(5);
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
        chip.setTag(99);
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
        layout.setTag(96);

        let btnStopBg = new cc.Sprite('#button_orange.png');
        layout.addChild(btnStopBg);
        btnStopBg.setAnchorPoint(0, 0);
        btnStopBg.setPosition(0, 0);

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
                let startThat = event.getCurrentTarget().parent;
                let betChip = event.getCurrentTarget().parent.parent.playingChip;
                let playingStatus = '';
                let playerChip = 0;

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
                    while (that.getChildByTag(99)) {
                        that.removeChildByTag(99, true);
                    }
                }

                switch (event.getCurrentTarget().tag) {
                    case 0:
                        checkBalance(10000);
                        break;
                    case 1:
                        checkBalance(5000);
                        break;
                    case 2:
                        checkBalance(2000);
                        break;
                    case 3:
                        checkBalance(1000);
                        break;
                    case 4:
                        playingStatus = '请下注';
                        playerChip = playerChip + betChip;
                        betChip = 0;
                        removeBetChip();
                        break;
                    case 5:
                        if (betChip !== 0) {
                            that.loadBtnGaming();
                            that.removeChildByTag(98);
                            that.loadBtnGaming();
                        }
                        break;
                    case 97:
                        startThat.loadBox();
                        startThat.removeChildByTag(97);
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
    }
});
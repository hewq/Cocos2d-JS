let BetPoolLayer = cc.Layer.extend({
    betPoolInfo: [
        {
            num: '1000',
            pos: {
                x: 500,
                y: 700
            }
        },
        {
            num: '2000',
            pos: {
                x: 600,
                y: 500
            }
        },
        {
            num: '3000',
            pos: {
                x: 820,
                y: 420
            }
        },
        {
            num: '4000',
            pos: {
                x: 1060,
                y: 500
            }
        },
        {
            num: '5000',
            pos: {
                x: 1150,
                y: 700
            }
        }
    ],
    goldNum: ['#10K.png', '#5K.png', '#2K.png', '#1K.png'],
    playing: null,
    playingChip: 0,
    ctor: function () {
        this._super();

        this.loadBetPool();

        this.loadBox();

        return true;
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

        for (let i = 0; i < this.betPoolInfo.length; i++) {
            poolBg = new cc.Scale9Sprite('res/bg_gold.png', cc.rect(0, 0, 70, 42), cc.rect(20, 0, 25, 42));
            poolBg.setContentSize(130, 42);
            poolBg.setAnchorPoint(0.5, 0.5);
            poolBg.setOpacity(90);
            poolBg.setPosition(this.betPoolInfo[i].pos.x, this.betPoolInfo[i].pos.y);
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
    loadBox: function () {
        let boxBg = new cc.Scale9Sprite('res/bg_gold_touzhu.png', cc.rect(0, 0, 141, 103), cc.rect(120, 0, 130, 103));
        boxBg.setContentSize(640, 103);
        this.addChild(boxBg);

        boxBg.anchorX = 1;
        boxBg.anchorY = 0;

        boxBg.setPosition(cc.winSize.width, 0);

        let boxBgSize = boxBg.getContentSize();

        let listener = cc.EventListener.create({
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
                let target = event.getCurrentTarget().parent.parent.playing;
                let chip = event.getCurrentTarget().parent.parent.playingChip;

                event.getCurrentTarget().parent.parent.playing.setString('1000');
                switch (event.getCurrentTarget().tag) {
                    case 0:
                        chip += 10000;
                        break;
                    case 1:
                        chip += 5000;
                        break;
                    case 2:
                        chip += 2000;
                        break;
                    case 3:
                        chip += 1000;
                        break;
                    case 4:
                        chip = 0;
                        break;
                }

                target.setString(chip + '');
                event.getCurrentTarget().parent.parent.playingChip = chip;
            }
        });

        let clear = new cc.Sprite('#icon_qingkongtouzhu.png');
        boxBg.addChild(clear);
        clear.setAnchorPoint(0, 0.5);
        clear.setPosition(35, boxBgSize.height / 2 - 5);
        clear.setTag(4);

        cc.eventManager.addListener(listener.clone(), clear);

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

            goldBg.setTag(i);

            cc.eventManager.addListener(listener.clone(), goldBg);
        }

        let btnBet = new cc.Sprite('#icon_touzhu-.png');
        boxBg.addChild(btnBet);
        btnBet.setAnchorPoint(1, 0);
        btnBet.setPosition(boxBg.width + 20, -20);
    }
});
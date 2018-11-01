let MMMainLayer = cc.Layer.extend({
    actionDuration: 1,  // 时间基数，页面上所有节点运行的动作
    upLock: null,
    isUpUnlock: "",

    ctor: function () {
        this._super();

        // 加载配置
        this.loadConfig();

        // 加载"开始冒险"和"天天向上"菜单
        this.loadMenu();

        // 加载"设置"按钮
        this.loadSet();

        // 加载"帮助"按钮
        this.loadHelp();

        // 加载怪物（底部 1 号和3号怪）
        this.loadBackMonster();

        // 加载云朵（底部遮挡在 1 号、3 号以及 6 号怪之前的云朵）
        this.loadBackSmoke();

        // 加载怪物（前面 5 号怪）
        this.loadForeMonster();

        // 加载云朵（前面遮罩在 5 号怪身上）
        this.loadForeSmoke();

        // 加载萝卜
        this.loadCarrot();

        // 加载前景
        this.loadForeground();

        // 注册事件
        this.registerEvent();

        return true;
    },
    loadConfig: function () {
        // 测试用，启动游戏时，向保存文件写入 NO，开启加锁
        // cc.sys.localStorage.setItem(Config.IS_UP_UNLOCK_KEY, "NO");

        // 是否已经解锁了"天天向上"
        this.isUpUnlock = cc.sys.localStorage.getItem(Config.IS_UP_UNLOCK_KEY) || "NO";
    },
    loadMenu: function () {
        // 开始冒险
        let startNormal = new cc.Sprite("res/MainMenu/zh/front_btn_start_normal.png");
        let startPress = new cc.Sprite("res/MainMenu/zh/front_btn_start_pressed.png");
        let startDisabled = new cc.Sprite("res/MainMenu/zh/front_btn_start_normal.png");
        let start = new cc.MenuItemSprite(
            startNormal,
            startPress,
            startDisabled,
            function () {
                cc.audioEngine.playEffect("res/Sound/MainMenu/Select.mp3");
                cc.director.runScene(new ChooseLevelScene());
            }.bind(this));
        start.setPosition(cc.winSize.width / 2 - 8, cc.winSize.height / 2 + 75);

        // 天天向上
        let floorNormal = new cc.Sprite("res/MainMenu/zh/front_btn_floor_normal.png");
        let floorPress = new cc.Sprite("res/MainMenu/zh/front_btn_floor_pressed.png");
        let floorDisabled = new cc.Sprite("res/MainMenu/zh/front_btn_floor_normal.png");
        let floor = new cc.MenuItemSprite(
            floorNormal,
            floorPress,
            floorDisabled,
            function () {
                cc.audioEngine.playEffect("res/Sound/MainMenu/Select.mp3");
                cc.log("点击天天向上按钮");
            }.bind(this));
        floor.setPosition(cc.winSize.width / 2 - 8, cc.winSize.height / 2 - 50);

        if (this.isUpUnlock == "NO") {
            let upLock = new cc.Sprite(res.front_btn_floor_locked_png);
            floor.addChild(upLock);
            this.upLock = upLock;
            upLock.setPosition(floor.width + 5, floor.height / 2 + 25);
        }

        let menu = new cc.Menu(start, floor);
        this.addChild(menu);
        menu.setPosition(0, 0);
    },
    loadSet: function () {
        let setBg = new cc.Sprite(res.front_monster4_png);
        this.addChild(setBg);
        setBg.setPosition(cc.winSize.width / 2 - 350, 490);

        // 上下移动
        let moveBy1 = cc.moveBy(this.actionDuration, cc.p(0, -10));
        let moveBy2 = cc.moveBy(this.actionDuration, cc.p(0, 10));
        let seq = cc.sequence(moveBy1, moveBy2);
        let action = seq.repeatForever();
        setBg.runAction(action);

        let set = new cc.Sprite(res.front_btn_setting_normal_png);
        setBg.addChild(set);
        set.setPosition(157, 80);
    },
    loadHelp: function () {
        let helpBg = new cc.Sprite(res.front_monster_6_hand_png);
        this.addChild(helpBg);
        helpBg.setPosition(cc.winSize.width / 2 + 270, 270);

        // 左右摆动
        let rotateBy1 = cc.rotateBy(this.actionDuration * 0.8, -5);
        let rotateBy2 = cc.rotateBy(this.actionDuration * 0.8, 5);
        let seq = cc.sequence(rotateBy1, rotateBy2);
        let action = seq.repeatForever();
        helpBg.runAction(action);

        let help = new cc.Sprite(res.front_btn_help_normal_png);
        helpBg.addChild(help);
        help.setPosition(153, 365);

        let helpBody = new cc.Sprite(res.front_monster6_png);
        this.addChild(helpBody);
        helpBody.setPosition(cc.winSize.width / 2 + 400, 280);

        // 上下移动
        let helpBodyMoveBy1 = cc.moveBy(this.actionDuration * 2, cc.p(0, 5));
        let helpBodyMoveBy2 = cc.moveBy(this.actionDuration * 2, cc.p(0, -5));
        let helpBodySeq = cc.sequence(helpBodyMoveBy1, helpBodyMoveBy2);
        let helpBodyAction = helpBodySeq.repeatForever();
        helpBody.runAction(helpBodyAction);
    },
    loadBackMonster: function () {
        let leftYellow = new cc.Sprite(res.front_monster3_png);
        this.addChild(leftYellow);
        leftYellow.setPosition(cc.winSize.width / 2 - 360, 220);

        // 上下移动
        let yellowMoveBy1 = cc.moveBy(this.actionDuration * 0.8, cc.p(0, 5));
        let yellowMoveBy2 = cc.moveBy(this.actionDuration * 0.8, cc.p(0, -5));
        let yellowSeq = cc.sequence(yellowMoveBy1, yellowMoveBy2);
        let yellowAction = yellowSeq.repeatForever();
        leftYellow.runAction(yellowAction);

        let leftGreen = new cc.Sprite(res.front_monster1_png);
        this.addChild(leftGreen);
        leftGreen.setPosition(cc.winSize.width / 2 - 300, 185);

        // 左右移动
        let greenMoveBy1 = cc.moveBy(this.actionDuration * 0.7, cc.p(-3, 0));
        let greenMoveBy2 = cc.moveBy(this.actionDuration * 0.7, cc.p(3, 0));
        let greenSeq = cc.sequence(greenMoveBy1, greenMoveBy2);
        let greenAction = greenSeq.repeatForever();
        leftGreen.runAction(greenAction);
    },
    loadBackSmoke: function () {
        let left = new cc.Sprite(res.front_smoke1_png);
        this.addChild(left);
        left.setPosition(cc.winSize.width / 2 - 410, 188);

        let right = new cc.Sprite(res.front_smoke3_png);
        this.addChild(right);
        right.setPosition(cc.winSize.width / 2 + 405, 190);
    },
    loadForeMonster: function () {
        let rightYellow = new cc.Sprite(res.front_monster5_png);
        this.addChild(rightYellow);
        rightYellow.setPosition(cc.winSize.width / 2 + 290, 185);

        // 左右移动
        let yellowMoveBy1 = cc.moveBy(this.actionDuration * 0.85, cc.p(-3, 0));
        let yellowMoveBy2 = cc.moveBy(this.actionDuration * 0.85, cc.p(3, 0));
        let yellowSeq = cc.sequence(yellowMoveBy1, yellowMoveBy2);
        let greenAction = yellowSeq.repeatForever();
        rightYellow.runAction(greenAction);

        let leftCambridgeBlue = new cc.Sprite(res.front_monster2_png);
        this.addChild(leftCambridgeBlue);
        leftCambridgeBlue.setPosition(cc.winSize.width / 2 - 300, 150);

        // 上下移动
        let action0 = cc.moveTo(this.actionDuration * 0.2, cc.p(cc.winSize.width /2 - 220, 170), null);
        let action1 = cc.sequence(action0, cc.callFunc(function () {
            let blueMoveBy1 = cc.moveBy(this.actionDuration * 0.55, cc.p(0, -5));
            let blueMoveBy2 = cc.moveBy(this.actionDuration * 0.55, cc.p(0, 5));
            let blueSeq = cc.sequence(blueMoveBy1, blueMoveBy2);
            let blueAction = blueSeq.repeatForever();
            leftCambridgeBlue.runAction(blueAction);
        }, this));

        leftCambridgeBlue.runAction(action1);
    },
    loadForeSmoke: function () {
        let node = new cc.Sprite(res.front_smoke2_png);
        this.addChild(node);
        node.setPosition(cc.winSize.width / 2 + 320, 150);
    },
    loadCarrot: function () {
        let node = new cc.Sprite("res/MainMenu/front_carrot.png");
        this.addChild(node);
        node.setPosition(cc.winSize.width / 2 + 100, 20);

        // 萝卜，贝塞尔曲线 + 缩放运动
        node.setScale(0.7);
        node.setPosition(cc.winSize.width / 2 + 320, 120);
        let controlPointTo = [
            cc.p(cc.winSize.width / 2 + 400, 100), // 起点控制点
            cc.p(cc.winSize.width / 2 + 120, 0), // 终点控制点
            cc.p(cc.winSize.width / 2 + 100, 20)]; // 终点
        let bezierTo = cc.bezierTo(this.actionDuration * 0.8, controlPointTo);
        let scaleTo = cc.scaleTo(this.actionDuration * 0.8, 1);
        let spawn = cc.spawn(bezierTo, scaleTo);
        node.runAction(spawn);
    },
    loadForeground: function () {
        let node = new cc.Sprite(res.front_front_png);
        this.addChild(node);
        node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
    },
    registerEvent: function () {
        let listener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            target: this,
            eventName: jf.EventName.UNLOCK_UP,
            callback: this.onUnLockUp
        });

        cc.eventManager.addListener(listener, this);
    },
    // 解锁天天向上
    onUnLockUp: function () {
        let target = event.getCurrentTarget();
        let data = event.getUserData();
        if (data.isSuccess !== undefined && data.isSuccess) {
            // 数据保存（解锁成功）
            cc.sys.localStorage.setItem(Config.IS_UP_UNLOCK_KEY, "YES");
            target.isUpUnlock = "YES";
            target.upLock.removeFromParent();
        }
    }
});

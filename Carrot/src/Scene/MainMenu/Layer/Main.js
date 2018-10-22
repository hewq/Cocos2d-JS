let MMMainLayer = cc.Layer.extend({
    actionDuration: 1,  // 时间基数，页面上所有节点运行的动作
    ctor: function () {
        this._super();

        // 加载背景
        this.loadBackground();

        // 加载"开始冒险"和"天天向上"菜单
        this.loadMenu();

        // 加载"设置"按钮

        // 加载怪物
        this.loadForeMonster();

        // 加载云朵
        this.loadCloud();

        // 加载"帮助"按钮
        this.loadHelp();

        // 加载萝卜
        this.loadCarrot();

        // 加载前景
        this.loadFront();

        return true;
    },
    loadBackground: function () {
        let node = new cc.Sprite("res/MainMenu/zh/front_bg.png");
        this.addChild(node);
        node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
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
                cc.log("点击开始冒险按钮");
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

        let menu = new cc.Menu(start, floor);
        this.addChild(menu);
        menu.setPosition(0, 0);
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
    loadHelp: function () {
        let helpBody = new cc.Sprite("res/MainMenu/front_btn_help_normal.png");
        helpBody.setPosition(cc.p(cc.winSize.width / 2 + 260, 425));
        this.addChild(helpBody);
    },
    loadForeMonster: function () {
        let leftCambridgeBlue = new cc.Sprite("res/MainMenu/front_monster_2.png");
        let numThreeMonster = new cc.Sprite("res/MainMenu/front_monster_3.png");
        let numFiveMonster = new cc.Sprite("res/MainMenu/front_monster_5.png");
        let numFourMonster = new cc.Sprite("res/MainMenu/front_monster_4.png");
        let numSixMonster = new cc.Sprite("res/MainMenu/front_monster_6.png");
        let numSixHandMonster = new cc.Sprite("res/MainMenu/front_monster_6_hand.png");
        let numOneMonster = new cc.Sprite("res/MainMenu/front_monster_1.png");
        this.addChild(leftCambridgeBlue);
        this.addChild(numThreeMonster);
        this.addChild(numOneMonster);
        this.addChild(numFourMonster);
        this.addChild(numSixHandMonster);
        this.addChild(numSixMonster);
        this.addChild(numFiveMonster);

        // 上下移动
        let action0 = cc.moveTo(this.actionDuration * 0.2, cc.winSize.width / 2 - 220, 170);
        let action1 = cc.sequence(action0, cc.callFunc(function () {
            let blueMoveBy1 = cc.moveBy(this.actionDuration * 0.55, 0, -5);
            let blueMoveBy2 = cc.moveBy(this.actionDuration * 0.55, 0, 5);
            let blueSeq = cc.sequence(blueMoveBy1, blueMoveBy2);
            let blueAction = blueSeq.repeatForever();
            leftCambridgeBlue.runAction(blueAction);
        }, this));
        leftCambridgeBlue.runAction(action1);

        numThreeMonster.setPosition(cc.p(cc.winSize.width / 2 - 380, 200));
        let numThreeMoveBy1 = cc.moveBy(this.actionDuration * 0.55, 0, -5);
        let numThreeMoveBy2 = cc.moveBy(this.actionDuration * 0.55, 0, 5);
        let numThreeSeq = cc.sequence(numThreeMoveBy1, numThreeMoveBy2);
        let numThreeAction = numThreeSeq.repeatForever();
        numThreeMonster.runAction(numThreeAction);

        numFourMonster.setPosition(cc.p(cc.winSize.width / 2 - 340, 480));
        let numFourMoveBy1 = cc.moveBy(this.actionDuration * 0.55, 0, -5);
        let numFourMoveBy2 = cc.moveBy(this.actionDuration * 0.55, 0, 5);
        let numFourSeq = cc.sequence(numFourMoveBy1, numFourMoveBy2);
        let numFourAction = numFourSeq.repeatForever();
        numFourMonster.runAction(numFourAction);

        numSixMonster.setPosition(cc.p(cc.winSize.width / 2 + 380, 270));
        let numSixMoveBy1 = cc.moveBy(this.actionDuration * 0.55, 0, -5);
        let numSixMoveBy2 = cc.moveBy(this.actionDuration * 0.55, 0, 5);
        let numSixSeq = cc.sequence(numSixMoveBy1, numSixMoveBy2);
        let numSixAction = numSixSeq.repeatForever();
        numSixMonster.runAction(numSixAction);

        numSixHandMonster.setPosition(cc.p(cc.winSize.width / 2 + 275, 270));
        numSixHandMonster.setRotation(20);
        let numSixHandRotateBy1 = cc.rotateBy(this.actionDuration * 0.55, -30, 0);
        let numSixHandRotateBy2 = cc.rotateBy(this.actionDuration * 0.55, 30, 0);
        let numSixHandSeq = cc.sequence(numSixHandRotateBy1, numSixHandRotateBy2);
        let numSixHandAction = numSixHandSeq.repeatForever();
        numSixHandMonster.runAction(numSixHandAction);

        // 左右移动
        numOneMonster.setPosition(cc.p(cc.winSize.width / 2 - 300, 170));
        let numOneMoveBy1 = cc.moveBy(this.actionDuration * 0.55, cc.p(-5, 0));
        let numOneMoveBy2 = cc.moveBy(this.actionDuration * 0.55, cc.p(5, 0));
        let numOneSeq = cc.sequence(numOneMoveBy1, numOneMoveBy2);
        let numOneAction = numOneSeq.repeatForever();
        numOneMonster.runAction(numOneAction);

        // 左右移动
        numFiveMonster.setPosition(cc.p(cc.winSize.width / 2 + 300, 170));
        let numFiveMoveBy1 = cc.moveBy(this.actionDuration * 0.55, cc.p(-5, 0));
        let numFiveMoveBy2 = cc.moveBy(this.actionDuration * 0.55, cc.p(5, 0));
        let numFiveSeq = cc.sequence(numFiveMoveBy1, numFiveMoveBy2);
        let numFiveAction = numFiveSeq.repeatForever();
        numFiveMonster.runAction(numFiveAction);
    },
    loadCloud: function () {
        let cloud1 = new cc.Sprite("res/MainMenu/front_smoke_1.png");
        let cloud2 = new cc.Sprite("res/MainMenu/front_smoke_2.png");
        let cloud3 = new cc.Sprite("res/MainMenu/front_smoke_3.png");
        cloud1.setPosition(cc.p(150, 150));
        cloud2.setPosition(cc.p(750, 350));
        cloud3.setPosition(cc.p(980, 170));
        this.addChild(cloud1);
        this.addChild(cloud2);
        this.addChild(cloud3);
    },
    loadFront: function () {
        let front = new cc.Sprite("res/MainMenu/front_front.png");
        front.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
        this.addChild(front);
    }
});

let MMMainScene = cc.Scene.extend({
    backgroundLayer: null,
    mainLayer: null,
    ctor: function () {
        this._super();
        cc.audioEngine.playMusic("res/Sound/MainMenu/BGMusic.mp3", true);
    },
    onEnter: function () {
        this._super();
        let layer = new MMMainLayer();
        this.addChild(layer);
    }
});
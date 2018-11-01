let CLBackgroundLayer = cc.Layer.extend({
    scrollView: null, // 滚动视图
    zOrderMap: {}, // 层级枚举
    routeButtonArray: [], // 关卡按钮数组
    ctor: function () {
        this._super();

        return true;
    },
    onEnter: function () {
        this._super();
        // 加载属性
        this.loadProperty();

        // 加载滚动视图
        this.loadScrollView();

        // 加载地图
        this.loadTiledMap();

        // 加载关卡，根据存储加载
        let level = cc.sys.localStorage.getItem(Config.LEVEL);
        if (level) {
            this.loadLevel(level);
        } else {
            this.loadLevel(1);
        }
    },
    loadScrollView: function () {
        let node = new ccui.ScrollView();
        this.addChild(node);
        this.scrollView = node;
        node.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        node.setTouchEnabled(true);
        node.setContentSize(cc.winSize);

        let nextPosX = 0;
        let imageView = null;
        for (let i = 0; i < 14; i++) {
            imageView = new ccui.ImageView("res/ChooseLevel/Map/stage_map_"  + i + ".png");
            node.addChild(imageView);
            imageView.setAnchorPoint(cc.p(0, 0.5));
            imageView.setPosition(nextPosX, cc.winSize.height / 2);
            nextPosX += imageView.width;
        }
        node.setInnerContainerSize(cc.size(nextPosX, cc.winSize.height));
    },
    loadProperty: function () {
        this.zOrderMap.route = 1; // （层级）道路
        this.zOrderMap.routeButtonEffect = 5; // (层级) 按钮特效
        this.zOrderMap.levelButton = 10; // （层级）按钮

        this.routeButtonArray = []; // 清空按钮数组
    },
    loadTiledMap: function () {
        let node = new cc.TMXTiledMap(res.cl_road_tiledMap_tmx);
        let objectGroup = node.getObjectGroup("point");
        let objs = objectGroup.getObjects();
        for (let i = 0; i < objs.length; i++) {
            let button = new ccui.Button();
            this.scrollView.addChild(button, this.zOrderMap.levelButton, i);
            this.routeButtonArray.push(button);
            // 图片纹理
            let texture = "res/ChooseLevel/stagepoint_adv.png";
            // 编辑器中配置的属性
            if (objs[i].isBoos == "YES") {
                texture = "res/ChooseLevel/stagepoint_boss.png";
            } else if (objs[i].isTime == "YES") {
                texture = "res/ChooseLevel/stagepoint_time.png";
            } else if (objs[i].isChange == "YES") {
                texture = "res/ChooseLevel/stagepoint_chance.png";
            } else {
                texture = "res/ChooseLevel/stagepoint_adv.png";
            }
            button.loadTextures(texture, texture, "");
            button.setPosition(objs[i].x, objs[i].y);
            button.setTag(i);
            button.setPressedActionEnabled(true);
            button.addTouchEventListener(this.onLevelButtonEvent, this);
        }
    },
    loadLevel: function (level) {
        this.loadRoute(level);
        this.loadLevelEffects(level);
    },
    onLevelButtonEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                let level = sender.getTag(); // 当前等级
                let configLevel = cc.sys.localStorage.getItem(Config.LEVEL);

                // 禁止跳级
                if (configLevel && level >= +configLevel) return;
                if (!configLevel) {
                    if (level != 0) return;
                }

                // 停止音乐
                cc.audioEngine.stopMusic();
                // 关卡设置
                GameManager.setLevel(level);
                // 加载资源，并进入游戏
                cc.LoaderScene.preload(g_gamePlay_resources, function () {
                    GameManager.loadLevelData(GameManager.getLevel());
                    cc.director.runScene(new GamePlayScene());
                }, this);
                break;
        }
    },
    // 加载 关卡道路
    loadRoute: function (level) {
        let node = null;
        for (let i = 0; i < level - 1; i++) {
            // 读取精灵表单
            node = new cc.Sprite("#route_" + (i + 1) + ".png");
            if (i % 10 === 9) {
                node.setAnchorPoint(0, 0.5);
            }
            node.x = node.width / 2 + Math.floor(i / 10) * node.width;
            node.y = this.scrollView.getInnerContainerSize().height / 2;
            this.scrollView.addChild(node, this.zOrderMap.route);
        }
    },
    // 加载指定关卡按钮特效
    loadLevelEffects: function (level) {
        let index = level - 1;
        let button = this.routeButtonArray[index];

        let node = new RouteButtonEffect();
        this.scrollView.addChild(node, this.zOrderMap.routeButtonEffect);
        node.setPosition(button.getPosition);
    }
});
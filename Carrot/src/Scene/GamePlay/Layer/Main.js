// GPMainLayer 中要做的主要事情：
// 1.根据配置加载怪物移动路径
// 2.根据配置加载起点和终点
// 3.判断当前位置是否可以创建炮塔，若可以创建，若不行，则给出警告
// 4.子弹和怪物的碰撞检测
// 游戏胜利或失败的场景跳转

let GPMainLayer = cc.Layer.extend({
    tiledMap: null, // 瓦片地图
    tileSize: null, // 瓦片大小
    roadPointArray: [], // 怪物路径
    ZOrderEnum: {}, //  对象层级枚举

    carrot: {}, // 萝卜对象
    carrotHpBg: {}, // 萝卜血量背景
    carrotHpText: {}, // 萝卜血量

    tiledMapRectArray: [], // 瓦片地图区域（二维区域）
    tiledMapRectArrayMap: [], // 瓦片地图区域映射
    tiledMapRectMapEnum: {}, // 瓦片地图区域映射枚举
    touchWarningNode: null, // 触摸警告节点
    towerPanel: null, // 构建塔的面板
    currGroupCreatedMonsterCount: 0, //  当前组已经创建的怪物数量
    currGroupCreatedMonsterSum: 0, // 当前组怪物总数量
    onEnter: function () {
        this._super();
    },
    // 加载路径背景
    loadPath: function () {
        let themeID = GameManager.getThemeID();
        let level = GameManager.getLevel() + 1;
        let node = new cc.Sprite("res/GamePlay/Theme/Theme" + themeID + "/BG" + level + "/Path" + level + ".png");
        this.addChild(node);
        node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
    },
    // 加载 瓦片地图
    loadTiledMap: function () {
        let themeID = GameManager.getThemeID();
        let level = GameManager.getLevel() + 1;
        let node = new cc.TMXTiledMap("res/GamePlay/Theme/Theme" + themeID + "/BG" + level + "/Level" + level + ".tmx");
        this.addChild(node);
        this.tiledMap = node;
        this.tileSize = node.getTileSize();
        node.x = (cc.winSize.width - node.width) / 2;
        node.y = (cc.winSize.height - node.height) / 2;
        node.setVisible(false);

        // 设置所有对象组坐标偏移量
        let groups = this.tiledMap.getObjectGroups();
        let group = null;
        let offsetX = (cc.winSize.width - this.tiledMap.width) / 2;
        let offsetY = (cc.winSize.height - this.tiledMap.height) / 2;
        let finalOffsetX = 0;
        let finalOffsetY = 0;
        let groupName = "";
        for (let i = 0; i < groups.length; i++) {
            group = groups[i];
            groupName = group.getGroupName();
            if (groupName == 'road' || groupName == "start_end") {
                finalOffsetX = offsetX + this.tileSize.width / 2;
                finalOffsetY = offsetY + this.tileSize.height / 2;
            } else {
                cc.warn("GPMainLayer.loadTileMap():" + groupName + "对象组的坐标未调整");
            }
            group.setPositionOffset(cc.p(finalOffsetX, finalOffsetY));
        }
    },
    // 加载路径坐标
    loadRoadPointArray: function () {
        this.roadPointArray = [];
        let roadGroup = this.tiledMap.getObjectGroup('road');
        let roads = roadGroup.getObjects();
        for (let i = 0; i < roads.length; i++) {
            this.roadPointArray.push(cc.p(roads[i].x + roadGroup.getPositionOffset().x, roads[i].y + roadGroup.getPositionOffset().y));
        }
    },
    // 加载下一组怪物
    loadNextGroupMonster: function () {
        if (GameManager.getGroup() > GameManager.getMaxGroup()) {
            cc.log("GPMainLayer.loadNextGroupMonster(): 怪物添加完毕");
            return;
        }

        // 弹出一组怪物数据，并保存在GameManager.currMonsterDataPool数组中。
        GameManager.currMonsterDataPool = GameManager.popNextMonsterGroupData();
        // 重置当前怪物节点
        GameManager.currMonsterPool[GameManager.getGroup() - 1] = [];

        // 重置当前组已经创建的怪物数量
        this.currGroupCreatedMonsterCount = 0;
        // 怪物总数设计
        this.currGroupCreatedMonsterSum = GameManager.getCurrGroupMonsterSum();

        let groupDelay = cc.delayTime(GameManager.getGroupInterval());
        // 延迟时间
        let enemyDelay = cc.delayTime(GameManager.getEnemyInterval());
        let callback = cc.callFunc(this.createMonster.bind(this));
        let createMonsterAction = cc.sequence(enemyDelay.clone(), callback).repeat(this.currGroupCreatedMonsterSum);
        let finalAction = cc.sequence(groupDelay, createMonsterAction);
        this.runAction(finalAction);
    },
    createMonster: function () {
        let data = GameManager.currMonsterDataPool[0];
        // 创建怪物数量 + 1
        this.currGroupCreatedMonsterCount++;

        let monsterData = {
            road: this.roadPointArray,
            speed: data.speed,
            index: data.index
        };

        let namePrefix = data.name.substring(0, data.name.length - 1);
        let fileNamePrefix = "Theme" + GameManager.getThemeID() + "/Monster" + namePrefix;
        let fileName = "#" + fileNamePrefix + "1.png";
        let node = new Monster(fileName, monsterData, fileNamePrefix);
        this.addChild(node, this.ZOrderEnum.MONSTER);
        GameManager.currMonsterPool[GameManager.getGroup() - 1].push(node);
        node.run();

        // 删除第一个数据
        GameManager.currMonsterDataPool.splice(0, 1);
    },
    // 注册事件监听
    registerEvent: function () {
        // （事件监听）怪物吃到萝卜
        let onMonsterEatCarrotListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            target: this,
            eventName: jf.EventName.GP_MONSTER_EAT_CARROT,
            callback: this.onMonsterEatCarrot
        });
        cc.eventManager.addListener(onMonsterEatCarrotListener, this);

        // （事件监听）萝卜血量更新
        let onUpdateCarrotBloodListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            target: this,
            eventName: jf.EventName.GP_UPDATE_CARROT_BLOOD,
            callback: this.onUpdateCarrotBlood
        });

        cc.eventManager.addListener(onUpdateCarrotBloodListener, this);
    },
    // 怪物吃到萝卜
    onMonsterEatCarrot: function (event) {
        let self = event.getCurrentTarget();
        // 萝卜和血
        GameManager.subtractCarrotBlood();
        // 删除敌人
        let monster = event.getUserData().target;
        self.removeMonster(monster);
        // 进入下一组
        if (self.isNeedLoadNextGroup()) {
            self.loadNextGroupMonster();
        }
    },
    // 事件更新萝卜血量
    onUpdateCarrotBlood: function (event) {
        let self = event.getCurrentTarget();
        let blood = event.getUserData().blood;
        self.carrotHpText.setString(blood + "");
    },
    // 萝卜每次扣一滴血
    subtractCarrotBlood: function () {
        this.carrotBlood = this.carrotBlood <= 0 ? 0 : this.carrotBlood - 1;
        // 抛出血量更新事件
        let event = new cc.EventCustom(jf.EventName.GP_UPDATE_CARROT_BLOOD);
        event.setUserData({
            blood: this.carrotBlood
        });
        cc.eventManager.dispatchEvent(event);

        // 抛出游戏结束事件
        if (this.carrotBlood == 0) {
            let gameOverEvnet = new cc.EventCustom(jf.EventName.GP_GAME_OVER);
            gameOverEvnet.setUserData({
                isWin: false
            });
            cc.eventManager.dispatchEvent(gameOverEvnet);
        }
    },
    // 移除怪物
    removeMonster: function (obj) {
        let monster = null;
        for (let i = 0; i < GameManager.currMonsterPool.length; i++) {
            for (let j = 0; j < GameManager.currMonsterPool[i].length; i++) {
                monster = GameManager.currMonsterPool[i][j];
                if (monster == obj) {
                    this.removeMonsterByIndex(i, j);
                }
            }
        }
    },
    // 根据数组下标删除怪物
    removeMonsterByIndex: function (i, j) {
        this.removeChild(GameManager.currMonsterPool[i][j]);
        GameManager.currBulletPool[i].splice(j, 1);
    },
    // 判断是否需要进入到下一组
    isNeedLoadNextGroup: function () {
        let isNeed = false;
        if (GameManager.currMonsterPool[GameManager.group - 1].length == 0 && this.currGroupCreatedMonsterCount == this.currGroupCreatedMonsterSum) {
            isNeed = true;
        }
        return isNeed;
    }
});
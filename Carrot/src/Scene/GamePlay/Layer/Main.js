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

            // 大障碍物（占4格）
            if (groupName == 'big') {
                finalOffsetX = offsetX;
                finalOffsetY = offsetY;
            } else if (groupName == "little") { // 中等障碍物（占用左右 2 格）
                finalOffsetX = offsetX;
                finalOffsetY = offsetY + this.tileSize.height / 2;
            } else if (groupName == 'small' || groupName == 'road' || groupName == "start_end" || groupName =="invalid") {
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

        // （事件监听）创建炮塔的事件
        let onCreateTowerListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            target: this,
            eventName: jf.EventName.GP_CREATE_TOWER,
            callback: this.onCreateTower
        });
        cc.eventManager.addListener(onCreateTowerListener, this);
    },
    // (事件)创建炮塔
    onCreateTower: function (event) {
        let self = event.getCurrentTarget();
        let data = event.getUserData();
        // 根据数据创建出炮塔
        let node = self.createTower(data);
        self.addChild(node);
        // 移除创建炮塔的面板
        self.removeChild(self.towerPanel);
        self.towerPanel = null;
    },
    // 创建炮塔
    createTower: function () {
        cc.assert(data.name, "GPMainLayer.createTower(): 名字无效！");
        cc.assert(data.x, "GPMainLayer.createTower(): x 轴坐标无效！");
        cc.assert(data.y, "GPMainLayer.createTower(): y 轴坐标无效！");

        let towerData = {};
        towerData.name = data.name;
        towerData.x = data.x;
        towerData.y = data.y;

        let node = null;
        switch (data.name) {
            case "Bottle":
                towerData.scope = 300;
                towerData.bulletSpeed = 20;
                node = new Bottle(towerData);
                break;
            default:
                cc.warn("GPMainLayer.createTower(): 异常");
                break;
        }

        if (node != null) {
            // 标记当前位置有炮塔
            this.tiledMapRectArrayMap[data.row][data.cel] = this.tiledMapRectMapEnum.TOWER;
        }

        return node;
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
    },
    // 加载瓦片区域
    loadTileRect: function () {
        let mapSize = this.tiledMap.getMapSize();
        let nextPosX = (cc.winSize.width - this.tiledMap.width) / 2 + this.tileSize.width / 2;
        let nextPosY = (cc.winSize.height - this.tiledMap.height) / 2 + this.tileSize.height / 2;
        for (let i = 0; i < mapSize.height; i++) {
            this.tiledMapRectArray[i][j] = cc.rect(nextPosX - this.tileSize.width / 2,
                                                    nextPosY - this.tileSize.height / 2,
                                                    this.tileSize.width,
                                                    this.tileSize.height);
            // 测试节点
            let node = new cc.Sprite();
            this.addChild(node, 100);
            node.setTextureRect(cc.rect(0, 0, this.tileSize.width - 3, this.tileSize.height - 3));
            node.setPosition(nextPosX, nextPosY);
            node.setColor(cc.color(255, 0, 255));
            node.setOpacity(100);

            nextPosX += this.tileSize.width;
        }
        nextPosX = (cc.winSize.width - this.tiledMap.width) / 2 + this.tileSize.width / 2;
        nextPosY += this.tileSize.height;
    },
    // 加载瓦片地图区域映射
    loadTiledMapRectArrayMap: function () {
        let i;
        let mapSize = this.tiledMap.getMapSize();
        for (i = 0; i < mapSize.height; i++) {
            this.tiledMapRectArrayMap[i][j] = this.tiledMapRectMapEnum.NONE;
        }
    },
    // 加载属性
    loadProperty: function () {
        this.tiledMapRectMapEnum.NONE = 0; // 无
        this.tiledMapRectMapEnum.ROAD = 1; // 道路
        this.tiledMapRectMapEnum.SMALL = 1; // 小障碍物（占 1 格）
        this.tiledMapRectMapEnum.LITTLE = 1; // 中障碍物（占 2 格）
        this.tiledMapRectMapEnum.BIG = 1; // 大障碍物（占 4 格）
        this.tiledMapRectMapEnum.INVALID = 1; // 无效区域
        this.tiledMapRectMapEnum.TOWER = 1; // 塔
    },
    // 根据坐标获取在地图格子区域中的信息
    getInfoFromMapByPos: function (x, y) {
        cc.assert(y !== undefined, "GPMainLayer.getInfoFromMapByPos(): Y坐标不能为空！");
        let isInMap = false; // 是否在地图中
        let index = {x: -1, y: -1};
        let rect = null;
        for (let i = 0; i < this.tiledMapRectArray.length; i++) {
            for (let j = 0; j < this.tiledMapRectArray[i].length; j++) {
                rect = this.tiledMapRectArray[i][j];
                if (cc.rectContainsPoint(rect, cc.p(x, y))) {
                    index.row = i;
                    index.cel = j;
                    index.x = rect.x;
                    index.y = rect.y;
                    isInMap = true;
                }
            }
        }

        return {
            isInMap: isInMap,
            row: index.row, // 行
            cel: index.cel, // 列
            x: index.x,
            y: index.y
        };
    },
    // 加载最小的障碍物
    loadSmallObstacle: function () {
        let smallGroup = this.tiledMap.getObjectGroup("small");
        let smalls = smallGroup.getObjects();
        let node = null;
        let info = null;
        for (let i = 0; i < smalls.length; i++) {
            node = new cc.Sprite("res/GamePlay/Object/Theme" + GameManager.getThemeID() +"/Object/" + smalls[i].name + ".png");
            this.addChild(node);
            node.x = smalls[i].x + smallGroup.getPositionOffset().x;
            node.y = smalls[i].y + smallGroup.getPositionOffset().y;
            info = this.getInfoFromMapByPos(node.x, node.y);
            this.tiledMapRectArrayMap[info.row][info.cel] = this.tiledMapRectMapEnum.SMALL;
        }
    },
    // 加载大障碍物
    loadBigObstacle: function () {
        let bigGroup = this.tiledMap.getObjectGroup("big");
        let bigs = bigGroup.getObjects();
        let node = null;
        let info = null;
        for (let i = 0; i < bigs.length; i++) {
            node = new cc.Sprite("res/GamePlay/Object/Theme" + GameManager.getThemeID() +"/Object/" + bigs[i].name + ".png");
            this.addChild(node);
            node.x = bigs[i].x + bigGroup.getPositionOffset().x;
            node.y = bigs[i].y + bigGroup.getPositionOffset().y;
            info = this.getInfoFromMapByPos(node.x, node.y);
            this.tiledMapRectArrayMap[info.row][info.cel] = this.tiledMapRectMapEnum.BIG;
            this.tiledMapRectArrayMap[info.row][info.cel - 1] = this.tiledMapRectMapEnum.BIG;
            this.tiledMapRectArrayMap[info.row - 1][info.cel] = this.tiledMapRectMapEnum.BIG;
            this.tiledMapRectArrayMap[info.row - 1][info.cel - 1] = this.tiledMapRectMapEnum.BIG;
        }
    },
    onTouchEnded: function (touch, event) {
        let self = event.getCurrentTarget();
        let info = self.getInfoFromMapByPos(touch.getLocation().x, touch.getLocation().y);
        // 没有触摸到地图区域内
        if (!info.isInMap) {
            self.loadTouchWarning(touch.getLocation().x, touchgetLocation().y);
        } else {
            // 已经有炮塔或者障碍物
            if (self.tiledMapRectArrayMap[info.row][info.cel] != self.tiledMapRectMapEnum.NONE) {
                self.loadTouchWarning(info.x + self.tileSize.width / 2, info.y + self.tileSize.height / 2);
            } else {
                // 当前位置没有炮塔和障碍物
                if (self.towerPanel == null) {
                    let data = {};
                    data.row = info.row;
                    data.cel = info.cel;
                    data.x = info.x;
                    data.y = info.y;
                    self.loadTowerPanel(data);
                } else {
                    self.removeChild(self.towerPanel);
                    self.towerPanel = null;
                }
            }
        }

        // target 指向对应炮塔的图标
        let target = event.getCurrentTarget();
        // 创建炮塔事件分发
        let createTowerEvent = new cc.EventCustom(jf.EventName.GP_CREATE_TOWER);
        createTowerEvent.setUserData({
            name: target.getName(),
            // target.getParent() 指向 TowerPanel
            x: target.getParent().getPositionX(),
            y: target.getParent().getPositionY(),
            cel: target.getParent().cel,
            row: target.getParent().row
        });
        cc.eventManager.dispatchEvent(createTowerEvent);
    },
    // 加载创建炮塔到面板
    loadTowerPanel: function (args) {
        // 接受行号和列号
        let node = new TowerPanel(args);
        this.addChild(node, this.ZOrderEnum.TOWER_PANEL);
        this.towerPanel = node;
    }
});
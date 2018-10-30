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

        // 加载属性
        this.loadProperty();

        // 加载路径
        this.loadPath();

        // 加载瓦片地图
        this.loadTiledMap();

        //  加载开始和结束标志
        this.loadStartAndEnd();

        // 加载萝卜血量
        this.loadCarrotHp();

        // 加载可以触摸区域
        this.loadCanTouchRect();

        // 加载瓦片地图区域映射
        this.loadTiledMapRectArrayMap();

        // 加载怪物移动路径
        this.loadRoadPointArray();

        // 加载障碍物
        this.loadObstacle();

        // 加载道路映射
        this.loadRoadMap();

        // 加载下一组怪物
        this.loadNextGroupMonster();

        // 调度器
        this.scheduleUpdate();

        // 注册事件
        this.registerEvent();
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

        // （事件监听）游戏结束监听
        let onGameOverListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            target: this,
            eventName: jf.EventName.GP_GAME_OVER,
            callback: this.onGameOver
        });
        cc.eventManager.addListener(onGameOverListener, this);

        // （事件监听）萝卜血量更新
        let onUpdateCarrotBloodListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            target: this,
            eventName: jf.EventName.GP_UPDATE_CARROT_BLOOD,
            callback: this.onUpdateCarrotBlood
        });

        cc.eventManager.addListener(onUpdateCarrotBloodListener, this);

        // （事件监听）触摸事件
        let onTouchEventListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            target: this,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        });

        cc.eventManager.addListener(onTouchEventListener, this);

        // （事件监听）创建炮塔的事件
        let onCreateTowerListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            target: this,
            eventName: jf.EventName.GP_CREATE_TOWER,
            callback: this.onCreateTower
        });
        cc.eventManager.addListener(onCreateTowerListener, this);

        let onRemoveBulletListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            target: this,
            eventName: jf.EventName.GP_REMOVE_BULLET,
            callback: this.onRemoveBullet
        });

        cc.eventManager.addListener(onRemoveBulletListener, this);
    },
    // 加载属性
    loadProperty: function () {
        this.ZOrderEnum.START = 10; // 起点标识
        this.ZOrderEnum.CARROT = 0; // 萝卜
        this.ZOrderEnum.MONSTER = 20; // 怪物
        this.ZOrderEnum.WAMING = 30; //  警告提示
        this.ZOrderEnum.TOWER_PANEL = 50; // 创建塔面板

        this.tiledMapRectMapEnum.NONE = 0; // 空地
        this.tiledMapRectMapEnum.ROAD = 1; // 道路
        this.tiledMapRectMapEnum.SMALL = 2; // 小障碍物（占 1 格）
        this.tiledMapRectMapEnum.LITTLE = 3; // 中障碍物（占 2 格）
        this.tiledMapRectMapEnum.BIG = 4; // 大障碍物（占 4 格）
        this.tiledMapRectMapEnum.INVALID = 5; // 无效区域
        this.tiledMapRectMapEnum.TOWER = 6; // 塔
    },
    // 加载路径
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
    // 加载可以触摸区域
    loadCanTouchRect: function () {
        let mapSize = this.tiledMap.getMapSize();

        let nextPosX = (cc.winSize.width - this.tiledMap.width) / 2 + this.tileSize.width / 2;
        let nextPosY = (cc.winSize.height - this.tiledMap.height) / 2 + this.tileSize.height / 2;

        for (let i = 0; i < mapSize.height; i++) {
            this.tiledMapRectArray[i] = [];
            for (let j = 0; j < mapSize.width; j++) {
                // 空地
                this.tiledMapRectArray[i][j] = cc.rect(nextPosX - this.tileSize.width / 2, nextPosY - this.tileSize.height / 2, this.tileSize.width, this.tileSize.height);

                // node = new cc.Sprite();
                // this.addChild(node);
                // node.setTextureRect(cc.rect(0, 0, tileSize.width - 2, tileSize.height - 2));
                // node.setColor(cc.color(122, 122, 255));
                // node.setPosition(nextPosX, nextPosY);
                // node.setOpacity(120);

                nextPosX += this.tileSize.width;
            }

            nextPosX = (cc.winSize.width - this.tiledMap.width) / 2 + this.tileSize.width / 2;
            nextPosY += this.tileSize.height;
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
    // 加载瓦片地图区域映射
    loadTiledMapRectArrayMap: function () {
        let i;
        let mapSize = this.tiledMap.getMapSize(); // 获取长宽分别多少块
        for (i = 0; i < mapSize.height; i++) {
            this.tiledMapRectArrayMap[i] = [];
            for (let j = 0; j < mapSize.width; j++) {
                this.tiledMapRectArrayMap[i][j] = this.tiledMapRectMapEnum.NONE;
            }
        }
    },
    // 加载障碍物
    loadObstacle: function () {
        this.loadSmallObstacle();
        this.loadLittleObstacle();
        this.loadBigObstacle();
        this.loadInvalidRect();
    },
    // 加载最小的障碍物（占 1 格）
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
    // 加载中等障碍物（占 2 格）
    loadLittleObstacle: function () {
        let littleGroup = this.tiledMap.getObjectGroup("little");
        let objs = littleGroup.getObjects();
        let node = null;
        let info = null;
        for (let i = 0; i < objs.length; i++) {
            node = new cc.Sprite("res/GamePlay/Object/Theme" + GameManager.getThemeID() + "/Object/" + objs[i].name + ".png");
            this.addChild(node);
            node.x = objs[i].x + littleGroup.getPositionOffset().x;
            node.y = objs[i].y + littleGroup.getPositionOffset().y;

            info = this.getInfoFromMapByPos(node.x, node.y);
            this.tiledMapRectArrayMap[info.row][info.cel] = this.tiledMapRectMapEnum.LITTLE;
            this.tiledMapRectArrayMap[info.row][info.cel - 1] = this.tiledMapRectMapEnum.LITTLE;
        }
    },
    // 加载大障碍物(占 4 格)
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
    // 加载无效区域
    loadInvalidRect: function () {
        let invalidGroup = this.tiledMap.getObjectGroup("invalid");
        let invalids = invalidGroup.getObjects();
        let data = null;
        let info = null;
        for (let i = 0; i < invalids.length; i++) {
            data = invalids[i];
            data.x += invalidGroup.getPositionOffset().x;
            data.y += invalidGroup.getPositionOffset().y;

            info = this.getInfoFromMapByPos(data.x, data.y);
            this.tiledMapRectArrayMap[info.row][info.cel] = this.tiledMapRectMapEnum.INVALID;
        }
    },
    // 加载道路映射
    loadRoadMap: function () {
        let roadGroup = this.tiledMap.getObjectGroup("road");
        let roads = roadGroup.getObjects();

        let currPoint = null;
        let nextPoint = null;
        let offsetCount = 0;
        let info = null;
        let j = 0;
        for (let i = 0; i < roads.length - 1; i++) {
            currPoint = cc.p(roads[i].x + roadGroup.getPositionOffset().x, roads[i].y + roadGroup.getPositionOffset().y);
            nextPoint = cc.p(roads[i + 1].x + roadGroup.getPositionOffset().x, roads[i + 1].y + roadGroup.getPositionOffset().y);
            info = this.getInfoFromMapByPos(currPoint.x, currPoint.y);

            if (currPoint.y == nextPoint.y) { // X 轴方向
                offsetCount = Math.abs(nextPoint.x - currPoint.x) / this.tileSize.width + 1;
                // X 轴方向（向左）
                if (currPoint.x > nextPoint.x) {
                    for (j = 0; j < offsetCount; j++) {
                        this.tiledMapRectArrayMap[info.row][info.cel - j] = this.tiledMapRectMapEnum.ROAD;
                    }
                } else { // X 轴方向（向右）
                    for (j = 0; j < offsetCount; j++) {
                        this.tiledMapRectArrayMap[info.row][info.cel + j] = this.tiledMapRectMapEnum.ROAD;
                    }
                }
            } else { // Y 轴方向
                offsetCount = Math.abs(nextPoint.y - currPoint.y) / this.tileSize.height + 1;
                // Y 轴方向
                if (currPoint.y > nextPoint.y) {
                    for (j = 0; j < offsetCount; j++) {
                        this.tiledMapRectArrayMap[info.row - j][info.cel] = this.tiledMapRectMapEnum.ROAD;
                    }
                } else { // Y 轴方向（向上）
                    for (j = 0; j < offsetCount; j++) {
                        this.tiledMapRectArrayMap[info.row + j][info.cel] = this.tiledMapRectMapEnum.ROAD;
                    }
                }
            }
        }
    },
    // 加载起点和萝卜
    loadStartAndEnd: function () {
        this.loadStartFlag();
        this.loadEndFlag();
    },
    // 加载起点
    loadStartFlag: function () {
        let themeId = GameManager.getThemeID();
        let fileName = "res/GamePlay/Object/Theme" + themeId + "/Object/start01.png";
        let node = new cc.Sprite(fileName);
        this.addChild(node, this.ZOrderEnum.START);

        let group = this.tiledMap.getObjectGroup("start_end");
        let obj = group.getObjects()[0];
        node.x = obj.x + group.getPositionOffset().x;
        node.y = obj.y + group.getPositionOffset().y + this.tileSize.height / 2 + 20;
    },
    // 加载终点萝卜
    loadEndFlag: function () {
      let node = new cc.Sprite("#hlb1_10.png");
      this.addChild(node, this.ZOrderEnum.CARROT);
      this.carrot = node;

      let group = this.tiledMap.getObjectGroup("start_end");
      let obj = group.getObjects()[1];

      node.x = obj.x + group.getPositionOffset().x;
      node.y = obj.y + group.getPositionOffset.y + this.tileSize.height / 2 + 20;
    },
    // 加载血量
    loadCarrotHp: function () {
        this.loadBloodBg();
        this.loadBlood();
    },
    // 加载萝卜血量背景
    loadBloodBg: function () {
        let node = new cc.Sprite("res/GamePlay/carrot_hp_bg.png");
        this.addChild(node, -1);
        this.carrotHpBg = node;
        node.setPosition(this.carrot.x + 75, this.carrot.y - 50);
    },
    // 加载萝卜血量
    loadBlood: function () {
        let node = new ccui.TextAtlas("10", "res/Font/num_blood.png", 16, 22, "0");
        this.carrotHpText = node;
        node.setPosition(this.carrotHpBg.width / 2 - 15, this.carrotHpBg.height / 2 - 3);
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
    // 加载警告精灵节点
    loadTouchWarning: function () {
        let node = null;
        if (this.touchWarningNode != null) {
            node = this.touchWarningNode;
            node.stopAllActions();
            node.setOpacity(255);
        } else {
            node = new cc.Sprite("res/GamePlay/warning.png");
            this.addChild(node, this.ZOrderEnum.WAMING);
            this.touchWarningNode = node;
        }
        node.setPosition(x, y);

        let delayTime = cc.delayTime(0.4);
        let fadeOut = cc.fadeOut(0.3);
        let callfunc = cc.callFunc(function () {
            this.removeChild(this.touchWarningNode);
            this.touchWarningNode = null;
        }.bind(this));
        let seq = cc.sequence(delayTime, fadeOut, callfunc);
        node.runAction(seq);
    },
    loadTowerPanel: function (args) {
        // 接收行和列号
        let node = new TowerPanel(args);
        this.addChild(node, this.ZOrderEnum.TOWER_PANEL);
        this.towerPanel = node;
    },
    createMonster: function () {
        let data = GameManager.currMonsterDataPool[0];
        // 创建怪物数量 + 1
        this.currGroupCreatedMonsterCount++;

        let monsterData = {
            road: this.roadPointArray,
            speed: data.speed,
            index: data.index,
            blood: data.blood
        };

        let namePrefix = data.name.substring(0, data.name.length - 1);
        let fileNamePrefix = "Theme" + GameManager.getThemeID() + "/Monster" + namePrefix;
        let fileName = "#" + fileNamePrefix + "1.png";
        let node = new Monster(fileName, monsterData, fileNamePrefix);
        this.addChild(node, this.ZOrderEnum.MONSTER);
        GameManager.currMonsterPool[GameManager.getGroup() - 1].push(node);
        node.setPosition(this.roadPointArray[0]);
        node.run();

        // 删除第一个数据
        GameManager.currMonsterDataPool.splice(0, 1);
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
        GameManager.currMonsterPool[i].splice(j, 1);
    },
    // 移除子弹
    removeBullet: function (obj) {
        let bullet = null;
        for (let i = 0; i < GameManager.currBulletPool.length; i++) {
            bullet = GameManager.currBulletPool[i];
            if (bullet == obj) {
                this.removeBulletByIndex(i);
            }
        }
    },
    // 根据数组下标删除子弹
    removeBulletByIndex: function (index) {
        this.removeChild(GameManager.currBulletPool[index]);
        GameManager.currBulletPool.splice(index, 1);
    },
    update: function () {
        this.checkCollide();
    },
    removeTowerPanel: function () {
        this.removeChild(this.towerPanel);
        this.towerPanel = null;
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

        // 属性设置
        if (node != null) {
            // 标记当前位置有炮塔
            this.tiledMapRectArrayMap[data.row][data.cel] = this.tiledMapRectMapEnum.TOWER;
        }

        return node;
    },
    // 子弹和怪物的碰撞检测
    checkCollide: function () {
        let bullet = null;
        let enemy = null;
        let enemyRect = null;
        for (let x = 0; x < GameManager.currBulletPool.length; x++) {
            bullet = GameManager.currBulletPool[x];
            for (let y = 0; y < GameManager.currMonsterPool.length; y++) {
                for (let z = 0; z < GameManager.currMonsterPool[y].length; z++) {
                    enemy = GameManager.currMonsterPool[y][z];
                    enemyRect = cc.rect(enemy.x - enemy.width / 2, enemy.y - enemy.height / 2, enemy.width, enemy.height);
                    if (cc.rectContainsPoint(enemyRect, bullet.getPosition())) {
                        // 移除子弹
                        this.removeBulletByIndex(x);
                        enemy.blood -= 2;

                        // 移除怪物
                        if (enemy.blood <= 0) {
                            this.removeMonsterByIndex(y, z);
                        }

                        // 是否进入下一组
                        if (this.isNeedLoadNextGroup()) {
                            this.loadNextGroupMonster();
                        } else {
                            if (GameManager.getGroup() > GameManager.getMaxGroup()) {
                                let event = new cc.EventCustom(jf.EventName.GP_GAME_OVER);
                                let nextlevel = GameManager.level + 1 + 1;
                                let level = cc.sys.localStorage.getItem(config.LEVEL);
                                if (!level) {
                                    level = 1;
                                }
                                if (nextlevel > level) {
                                    cc.sys.localStorage.setItem(Config.LEVEL, nextlevel);
                                }
                                event.setUserData({
                                    isWin: true
                                });
                                cc.eventManager.dispatchEvent(event);
                            }
                        }
                    }
                }
            }
        }
    },
    // 判断是否需要进入到下一组
    isNeedLoadNextGroup: function () {
        let isNeed = false;
        if (GameManager.currMonsterPool[GameManager.group - 1].length == 0 && this.currGroupCreatedMonsterCount == this.currGroupCreatedMonsterSum) {
            isNeed = true;
        }
        return isNeed;
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
    // 更新萝卜血量
    onUpdateCarrotBlood: function (event) {
        let self = event.getCurrentTarget();
        let blood = event.getUserData().blood;
        cc.log(self.carrotHpText);
        self.carrotHpText.setString(blood + "");
    },
    // （事件）游戏结束
    onGameOver: function (event) {
        let self = event.getCurrentTarget();
        let data = event.getUserData();
        GameManager.setIsWin(data.isWin);
        cc.audioEngine.stopMusic();

        let scene = new GameResultScene();
        cc.director.runScene(scene);
        let str = data.isWin ? "赢了!" : "输了";
        cc.log("GPMainLayer.onGameOver(): 游戏结束， 你" + str);
    },
    // （事件）创建塔
    onCreateTower: function (event) {
        let self = event.getCurrentTarget();
        let data = event.getUserData();

        // 工厂模式
        let node = self.createTower(data);
        self.addChild(node);

        self.removeTowerPanel();
    },
    // （事件）移除子弹
    onRemoveBullet: function (event) {
        let self = event.getCurrentTarget();
        let bullet = event.getUserData().target;
        self.removeBullet(bullet);
    },
    // （事件）触摸
    onTouchBegan: function (touch, event) {
        let self = event.getCurrenttarget();
        return true;
    },
    onTouchMoved: function (touch, event) {
        let self = event.getCurrentTarget();
    },
    onTouchEnded: function (touch, event) {
        let self = event.getCurrentTarget();
        let info = self.getInfoFromMapByPos(touch.getLocation().x, touch.getLocation().y);
        // 没有触摸到地图区域内
        if (!info.isInMap) {
            self.loadTouchWarning(touch.getLocation().x, touch.getLocation().y);
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
    // 根据坐标获取在地图中的信息
    getInfoFromMapByPos: function (x, y) {
        cc.assert(y !== undefined, "GPMainLayer.getInfoFromMapByPos(): Y 坐标不能为空！");

        let isInMap = false;
        let index = {
            x: -1,
            y: -1
        };
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
            row: index.row,
            cel: index.cel,
            x: index.x,
            y: index.y
        }
    }
});
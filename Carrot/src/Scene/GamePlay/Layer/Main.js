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
    }
});
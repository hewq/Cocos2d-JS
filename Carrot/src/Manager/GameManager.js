// 游戏管理对象
let GameManager = {
    level: 0, // 关卡（从 0 开始）
    levelData: [], // 关卡（数据）
    themeID: 0, // 主题
    monsterGroup: [], // 怪物（数据）池
    group: 0, // 组别
    maxGroup: 0, // 组别（最大值）
    _groupIndex: 0, // 组别索引（仅在遍历时使用）
    carrotBlood: 0, // 萝卜的血量
    gold: 0, // 初始金币
    enemyInterval: 0, // 刷怪时间间隔
    groupInterval: 0, // 组数时间间隔
    levelName: 0, // 关卡名字

    // 获取下一个怪物数据相关属性
    _teamIndex: 0, // 队伍游标
    _teamCount: 0, // 队伍总数
    _teamMonsterCount: 0, // 当前队伍怪物总数
    _teamMonsterIndex: 0, // 当前队伍怪物游标
    isMonsterGetFinish: false, // 所有怪物是否获取完毕

    // 弹出下一组怪物数据相关属性
    _monsterDataArray: [], // 怪物数据二维数组
    currMonsterDataPool: [], // 当前怪物数据池
    currMonsterPool: [], // 当前怪物节点池
    currBulletPool: [], // 当前子弹节点池

    isWin: false, // 是否赢了

    // 加载关卡数据
    loadLevelData: function (level) {
        this.level = level;
        this.levelData = LevelData[level];
        this.themeID = this.levelData.themeID;
        this.monsterGroup = this.levelData.monsterGroup;
        this.group = 0;
        this.maxGroup = this.monsterGroup.length - 1;
        this._groupIndex = 0;
        this.carrotBlood = this.levelData.blood;
        this.gold = this.levelData.enemyInterval;
        this.groupInterval = this.levelData.groupInterval;
        this.levelName = this.levelData.levelName;

        this._teamIndex = 0;
        this._teamCount = this.monsterGroup[0].team.length - 1;
        this._teamMonsterIndex = 0;
        this._teamMonsterCount = this.monsterGroup[0].team[0],count - 1;
        this.isMonsterGetFinish = false;

        this._monsterDataArray = [];
        this.currMonsterDataPool = [];
        this.currBulletPool = [];

        this.isWin = false;

        // 加载怪物数据
        this._loadMonsterData();
    },
    // 加载怪物数据
    _loadMonsterData: function () {
        let group; // 组
        let team;  // 队
        let unit;  // 只
        let data = {};
        this._monsterDataArray = [];
        for (group = 0; group < this.monsterGroup.length; group++) {
            this._monsterDataArray[group] = [];
            for (team = 0; team < this.monsterGroup[group].team.length; team++) {
                for (unit = 0; unit < this.monsterGroup[group].team[team].count; unit++) {
                    data = this._getNextMonsterData();
                    this._monsterDataArray[group].push(data);
                }
            }
        }
    }
};

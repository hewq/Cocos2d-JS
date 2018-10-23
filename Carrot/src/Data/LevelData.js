let LevelData = [
    {   // 第 1 关
        themeID: 1, // 主题
        group: 6,   // 组数
        gold: 800,  // 初始金币
        enemyInterval: 1,    // 刷怪时间间隔
        groupInterval: 1,   // 组数时间间隔
        levelName: "level 1",   // 关卡名字
        blood: 10,  // 萝卜血量
        monsterGroup: [ // 每一关的怪物数据
            {   // 第 1 组
                index: 1,
                team: [
                    { name: "L11", count: 5, blood: 5.0, speed: 180}
                ]
            },
            {   // 第 2 组
                index: 2,
                team: [
                    { name: "L12", count: 8, blood: 5.1, speed: 190}
                ]
            }
        ]
    }
];
var MMMainLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        // 加载"开始冒险"和"天天向上"菜单
        // 加载"设置"按钮
        // 加载"帮助"按钮
        // 加载底部的 1 号和 3 号怪物
        // 加载底部遮挡在 1 号、5 号以及 6 号怪物之前的云朵
        // 加载前面的 5 号怪物
        // 加载前面遮罩在 5 号怪物身上的云朵
        // 加载萝卜
        // 加载前景
    },
    loadMenu: function () {
        // 开始冒险
        var startNormal = new cc.Sprite("res/MainMenu/zh/front_btn_start_normal.png");
        var startPress = new cc.Sprite("res/MainMenu/zh/front_btn_start_pressed.png");
        var startDisabled = new cc.Sprite("res/MainMenu/zh/front_btn_start_normal.png");
        var start = new cc.MenuItemSprite(
            startNormal,
            startPress,
            startDisabled,
            function () {
                cc.log("点击开始冒险按钮");
            }.bind(this));
        start.setPosition(cc.winSize.width / 2 - 8, cc.winSize.height / 2 + 75);

        // 天天向上
        var floorNormal = new cc.Sprite("res/MainMenu/zh/front_btn_floor_normal.png");
        var floorPress = new cc.Sprite("res/MainMenu/zh/front_btn_floor_pressed.png");
        var floorDisabled = new cc.Sprite("res/MainMenu/zh/front_btn_floor_normal.png");
        var floor = new cc.MenuItemSprite(
            floorNormal,
            floorPress,
            floorDisabled,
            function () {
                cc.log("点击天天向上按钮");
            }.bind(this));
        floor.setPosition(cc.winSize.width / 2 + 8, cc.winSize.height / 2 + 75);

        var menu = new cc.Menu(start, floor);
        this.addChild(menu);
        menu.setPosition(0, 0);
    },
    loadCarrot: function () {
        var node = new cc.Sprite("res/MainMenu/front_carrot.png");
        this.addChild(node);
        node.setPosition(cc.winSize.width / 2 + 100, 20);
    }
});
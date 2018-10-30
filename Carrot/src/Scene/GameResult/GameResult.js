let GameResultScene = cc.Scene.extend({
    backgroundLayer: null, // 背景层
    mainLayer: null, // 玩法层
    onEnter: function () {
        this._super();
        // 加载资源
        this.loadResource();
        // 加载背景层
        this.loadBackgroundLayer();
        // 加载主层
        this.loadMainLayer();
        // 注册事件
        this.registerEvent();

        return true;
    },
    registerEvent: function () {

    },
    loadResource: function () {

    },
    loadBackgroundLayer: function () {
        let node = new GSBackgroundLayer();
        this.backgroundLayer = node;
    },
    loadMainLayer: function () {
        let node = new GSMainLayer();
        this.addChild(node);
        this.mainLayer = node;
    }
});
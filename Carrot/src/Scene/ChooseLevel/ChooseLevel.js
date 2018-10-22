let ChooseLevelScene = cc.Scene.extend({
    backgroundLayer: null,
    uiLayer: null,
    onEnter: function () {
        this._super();
        // 加载精灵表单
        this.loadResource();

        // 加载背景层
        this.loadBackgroundLayer();

        // 加载主层
        this.loadMainLayer();
    },
    loadBackgroundLayer: function () {
        this.backgroundLayer = new CLBackgroundLayer();
        this.addChild(this.backgroundLayer);
    },
    loadMainLayer: function () {
        this.uiLayer = new CLUILayer();
        this.addChild(this.uiLayer);
    },
    loadResource: function () {
        cc.spriteFrameCache.addSpriteFrames(res.route_plist, res.route_png);
    }
});
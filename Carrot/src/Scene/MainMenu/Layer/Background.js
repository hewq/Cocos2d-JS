var MMbackgroundLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        // 加载背景
        this.loadBackground();
        return true;
    },
    loadBackground: function () {
        let node = new cc.Sprite("res/MainMenu/zh/front_bg.png");
        this.addChild(node);
        node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
    }
});
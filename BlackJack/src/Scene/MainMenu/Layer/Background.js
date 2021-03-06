var MMBackgroundLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        // 加载背景
        this.loadBackground();

        return true;
    },

    loadBackground: function () {
        var node = new cc.Sprite(res.bg_png);
        this.addChild(node);
        node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
    }
});
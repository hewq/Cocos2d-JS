var GamePlayScene = cc.Scene.extend({
    ctor: function () {
        this._super();

        return true;
    },
    onEnter: function () {
        this._super();

        this.loadBackground();

        this.loadIcon();

        this.loadMainLayer();
    },
    loadBackground: function () {
        this.addChild(new GPBackgroundLayer());
    },
    loadIcon: function () {
        this.GPIconLayer = new GPIconLayer();
        this.addChild(this.GPIconLayer);
    },
    loadMainLayer: function () {
        this.addChild(new GPMainLayer());
    }
});

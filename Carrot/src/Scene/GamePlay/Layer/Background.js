let GPBackgroundLayer = cc.Layer.extend({
    onEnter: function () {
        this._super();
        // 加载背景
        this.loadBackground();
    },
    loadBackground: function () {
        let themeID = GameManager.getThemeID();
        let node = new cc.Sprite("res/GamePlay/Theme/Theme" + themeID + "/BG0/BG" + themeID + ".png");
        this.addChild(node);
        node.setPosition(cc.winSize / 2, cc.winSize.height / 2);
    }
});
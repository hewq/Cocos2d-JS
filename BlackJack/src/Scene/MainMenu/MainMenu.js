let MainMenuScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        cc.audioEngine.playMusic(res.bgm_mp3, true);

        return true;
    },

    onEnter: function () {
        this._super();

        // 加载资源
        this.loadResource();

        // 加载背景层
        this.loadBackgroundLayer();

        // 加载主层
        this.loadMainLayer();
    },

    loadResource: function () {
        cc.spriteFrameCache.addSpriteFrames(res.animation_plist, res.animation_png);
        cc.spriteFrameCache.addSpriteFrames(res.card_plist, res.card_png);
        cc.spriteFrameCache.addSpriteFrames(res.menu_plist, res.menu_png);
        cc.spriteFrameCache.addSpriteFrames(res.share_plist, res.share_png);
        cc.spriteFrameCache.addSpriteFrames(res.table_plist, res.table_png);
        cc.spriteFrameCache.addSpriteFrames(res.bust_plist, res.bust_png);
    },

    loadBackgroundLayer: function () {
        this.backgroundLayer = new MMBackgroundLayer();
        this.addChild(this.backgroundLayer);
    },

    loadMainLayer: function () {
        this.mainLayer = new MMMainLayer();
        this.addChild(this.mainLayer);
    },
    onLoadUnlockLayer: function () {
        let target = event.getCurrentTarget(); // 获取当前事件监听器的事件源
        target.unlockLayer = new MMUnlockLayer();
        target.addChild(target.unlockLayer);
    }
});
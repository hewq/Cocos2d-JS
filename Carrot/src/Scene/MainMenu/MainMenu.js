let MainMenuScene = cc.Scene.extend({
    backgroundLayer: null,
    mainLayer: null,
    unlockLayer: null,

    ctor: function () {
        this._super();
        cc.audioEngine.playMusic(res.sd_mm_BGMusic_mp3, true);
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

        // 注册事件
        this.registerEvent();
    },

    loadResource: function () {},

    loadBackgroundLayer: function () {
        this.backgroundLayer = new MMBackgroundLayer();
        this.addChild(this.backgroundLayer);
    },

    loadMainLayer: function () {
        this.mainLayer = new MMMainLayer();
        this.addChild(this.mainLayer);
    },

    registerEvent: function () {
        let listener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            target: this,
            eventName: jf.EventName.OPEN_UNLOCK_UP_LAYER,
            callback: this.onLoadUnlockLayer
        });

        cc.eventManager.addListener(listener, this);
    },

    onLoadUnlockLayer: function () {
        let target = event.getCurrentTarget(); // 获取当前事件监听器的事件源
        target.unlockLayer = new MMUnlockLayer();
        target.addChild(target.unlockLayer);
    }

});
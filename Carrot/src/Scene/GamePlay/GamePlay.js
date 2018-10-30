let GamePlayScene = cc.Scene.extend({
    backgroundLayer: null, // 背景层
    mainLayer: null, // 玩法层
    uiLayer: null, // UI 层
    menuLayer: null, // 菜单层
    ctor: function () {
        this._super();
        cc.audioEngine.playMusic("res/Sound/GamePlay/BGMusic01.mp3", true);

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

        // 加载 UI 层
        this.loadUILayer();

        // 注册事件
        this.registerEvent();
    },
    loadResource: function () {
        cc.spriteFrameCache.addSpriteFrames("res/GamePlay/Carrot/Carrot1/hlb1.plist", "res/GamePlay/Carrot/Carrot1/hlb1.png");
        cc.spriteFrameCache.addSpriteFrames("res/GamePlay/Tower/Bottle.plist", "res/GamePlay/Tower/Bottle.png");

        let themeId = GameManager.getThemeID();
        cc.spriteFrameCache.addSpriteFrames("res/GamePlay/Object/Theme" + themeId + "/Monster/theme_" + themeId + ".plist", "res/GamePlay/Object/Theme" + themeId + "/Monster/theme_" + themeId + ".png");
    },
    loadBackgroundLayer: function () {
        let node = new GPBackgroundLayer();
        this.addChild(node);
        this.backgroundLayer = node;
    },
    loadMainLayer: function () {
        let node = new GPMainLayer();
        this.addChild(node);
        this.mainLayer = node;
    },
    loadUILayer: function () {
        let node = new GPUILayer();
        this.addChild(node);
        this.uiLayer = node;
    },
    loadMenuLayer: function () {
        let node = new GPMainLayer();
        this.addChild(node);
        this.menuLayer = node;
    },
    // 注册事件
    registerEvent: function () {
        // （事件监听器）创建菜单层
        let onCreateMenuLayerListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            target: this,
            eventName: jf.EventName.GP_CREATE_MENU_LAYER,
            callback: this.onCreateMenuLayer
        });
        cc.eventManager.addListener(onCreateMenuLayerListener, this);

        // (事件监听器)移除菜单层
        let onRemoveMenuLayerListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            target: this,
            eventName: jf.EventName.GP_REMOVE_MENU_LAYER,
            callback: this.onRemoveMenuLayer
        });
        cc.eventManager.addListener(onRemoveMenuLayerListener, this);
    },
    onCreateMenuLayer : function (event) {
        let self = event.getCurrentTarget();
        self.loadMenuLayer();
    },
    onRemoveMenuLayer: function (event) {
        let self = event.getCurrentTarget();
        self.removeChild(self.menuLayer);
    }
});
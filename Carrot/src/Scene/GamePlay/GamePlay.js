let GamePlayScene = cc.Scene.extend({
    // 注册事件
    register: function () {
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
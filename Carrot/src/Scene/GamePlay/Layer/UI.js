let GPUILayer = cc.Layer.extend({
    onEnter: function () {
        this._super();
        // 注册事件
        this.registerEvent();
    },
    registerEvent: function () {
        // 组更新
        let onUpdateGroupListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            target: this,
            eventName: jf.EventName.GP_UPDATE_GROUP,
            callback: this.onUpdateGroup
        })
    },
    onUpdateGroup: function (event) {
        let group = event.getUserData().group;
        let self = event.getCurrentTarget();
        self.groupText.setString(group + "");
    },
    // 加载菜单按钮
    loadMenuButton: function () {
        let node = new ccui.Button();
        node.addTouchEventListener(function (sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:   // 触摸事件结束时响应
                    let event = new cc.EventCustom(js.EventName.GP_CREATE_MENU_LAYER);
                    cc.eventManager.dispatchEvent(event);
                    break;
            }
        }.bind(this));
    }
});
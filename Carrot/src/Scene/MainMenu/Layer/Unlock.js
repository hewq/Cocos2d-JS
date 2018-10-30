let MMUnlockLayer = cc.Layer.extend({
    layout: null,
    background: null,
    ctor: function () {
        this._super();

        // 加载 Layout
        this.loadLayout();

        // 加载背景边框
        this.loadBackground();

        // 加载文字提示
        this.loadInfo();

        // 加载按钮
        this.loadButton();

        return true;
    },
    loadLayout: function () {
        this.layout = new ccui.Layout();
        this.addChild(this.layout);
        this.layout.setContentSize(cc.winSize);
        this.layout.setTouchEnabled(true);
    },
    loadBackground: function () {
        let node = new ccui.ImageView(res.woodbj_notice_png);
        this.layout.addChild(node);
        this.background = node;
        node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
    },
    loadInfo: function () {
        let node = new ccui.ImageView(res.unlock_floor_png);
        this.background.addChild(node);
        node.setPosition(this.background.width / 2, this.background.height / 2 + 100);
    },
    loadButton: function () {
        let offsetX = 15;
        let posY = 150;
        this.loadConfirmButton(offsetX, posY);
        this.loadCancelButton(offsetX, posY);
    },
    // 加载确定按钮
    loadConfirmButton: function (offsetX, posY) {
        let node = new ccui.Button();
        this.background.addChild(node);
        node.loadTextures(res.btn_blue_m_png, res.btn_blue_m_pressed_png, "");
        node.setPosition(this.background.width / 2 - node.width / 2 - offsetX, posY);
        node.addTouchEventListener(function(sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:
                    let event = new cc.EventCustom(jf.EventName.UNLOCK_UP);
                    event.setUserData({
                        isSuccess: true
                    });
                    cc.eventManager.dispatchEvent(event);
                    this.removeFromParent();
                    break;
            }
        }, this);

        // （确定）文字图片
        let infoNode = new ccui.ImageView(res.btn_blue_m_ok_png);
        node.addChild(infoNode);
        infoNode.setPosition(node.width / 2, node.height / 2);
    },
    // 加载（取消按钮）
    loadCancelButton: function (offsetX, posY) {
        let node = new ccui.Button();
        this.background.addChild(node);
        node.loadTextures(res.btn_green_m_png, res.btn_green_m_pressed_png, "");
        node.setPosition(this.background.width / 2 + node.width / 2 + offsetX, posY);
        node.addTouchEventListener(function (sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:
                    this.removeFromParent();
                    break;
            }
        }, this);

        // （取消）文字图片
        let infoNode = new ccui.ImageView(res.btn_green_m_cancel_png);
        node.addChild(infoNode);
        infoNode.setPosition(node.width / 2, node.height / 2);
    }
});
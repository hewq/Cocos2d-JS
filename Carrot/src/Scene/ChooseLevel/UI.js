let CLUILayer = cc.Layer.extend({
    onEnter: function () {
        this._super();
        this.loadTopLeftButtons();
        this.loadTopRightButtons();

        this.loadDiscountButton();
    },
    // 加载左上角按钮
    loadTopLeftButtons: function () {
        let leftPanel = new ccui.ImageView("res/ChooseLevel/stagemap_toolbar_leftbg.png");
        this.addChild(leftPanel);
        leftPanel.setAnchorPoint(0, 1);
        leftPanel.setPosition(0, cc.winSize.height);

        // 加载首页按钮
        this.loadHomeButton(leftPanel);

        // 加载商店按钮
        this.loadShopButton(leftPanel);

        // 加载排行榜按钮
        this.loadRankingButton(leftPanel);
    },
    loadHomeButton: function (parent) {
        let node = new ccui.Button();
        parent.addChild(node);
        let textures = "res/ChooseLevel/stagemap_toolbar_home.png";
        node.loadTextures(textures, textures, "");
        node.setPressedActionEnabled(true);
        node.setZoomScale(0.2);
        node.setPosition(60, 55);
        node.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                cc.director.runScene(new MainMenuScene());
            }
        }, this);
    },
    loadShopButton: function (parent) {
        let node = new ccui.Button();
        parent.addChild(node);
        let textures = "res/ChooseLevel/stagemap_toolbar_shop.png";
        node.loadTextures(textures, textures, "");
        node.setPressedActionEnabled(true);
        node.setZoomScale(0.2);
        node.setPosition(162, 55);
        node.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                cc.director.runScene(new MainMenuScene());
            }
        }, this);
    },
    loadRankingButton: function (parent) {
        let node = new ccui.Button();
        parent.addChild(node);
        let textures = "res/ChooseLevel/stagemap_toolbar_leaderboard.png";
        node.loadTextures(textures, textures, "");
        node.setPressedActionEnabled(true);
        node.setZoomScale(0.2);
        node.setPosition(263, 55);
        node.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                cc.director.runScene(new MainMenuScene());
            }
        }, this);
    },
    // 加载中间促销按钮
    loadDiscountButton: function () {
        let button = new ccui.Button();
        this.addChild(button);
        let resourceStr = "res/ChooseLevel/zh/discount_tag_stone.png";
        button.loadTextures(resourceStr, resourceStr, "");
        button.setAnchorPoint(0.5, 1);
        button.setPosition(cc.winSize.width / 2, cc.winSize.height);
        button.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                cc.log("点击了促销按钮");
            }
        }, this);
        // 折扣显示
        let text = new ccui.TextBMFont("8", res.discount_fnt);
        this.discountText = text;
        button.addChild(text);
        text.setAnchorPoint(0, 0);
        text.setPosition(148, 60);
    },
    // 加载右上角按钮
    loadTopRightButtons: function () {
        let rightPanel = new ccui.ImageView("res/ChooseLevel/stagemap_toolbar_rightbg.png");
        this.addChild(rightPanel);
        rightPanel.setAnchorPoint(1, 1);
        rightPanel.setPosition(cc.winSize.width, cc.winSize.height);
    }
});
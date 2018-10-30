let GSBackgroundLayer = cc.Layer.extend({
    onEnter: function () {
        this._super();
        // 加载输或赢背景
        this.loadWinOrLoseBg();
        // 加载背景
        this.loadForeground();
    },
    loadWinOrLoseBg: function () {
        let fileName = GameManager.getIsWin() ? "res/GameResult/Win/win_bg.png" : "res/GameResult/Lose/lose_bg.png";
        let node = new ccui.ImageView(fileName);
        this.addChild(node);
        node.setAnchorPoint(0.5, 1);
        node.setPosition(cc.winSize.width / 2, cc.winSize.height);
    },
    loadForeground: function () {
        let node = new ccui.ImageView("res/GameResult/GameOver/winlose_bg.png");
        this.addChild(node);
        node.setAnchorPoint(0.5, 0);
        node.setPosition(cc.winSize.width /2, 0);
    }
});
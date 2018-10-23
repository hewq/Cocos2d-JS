let GPMenuLayer = ccui.Layout.extend({
    onEnter: function () {
        this._super();
        cc.director.pause(); // 导演暂停
    },
    onExit: function () {
        cc.director.resume(); // 导演恢复
        this._super();
    }
});
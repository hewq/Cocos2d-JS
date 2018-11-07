cc.Class({
    extends: cc.Component,

    properties: {
        anim: cc.Animation
    },

    play: function () {
        this.anim.play('chip_toss');
    },
});

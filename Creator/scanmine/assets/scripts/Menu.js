cc.Class({
    extends: cc.Component,

    properties: {
        audioMng: cc.Node
    },

    onLoad () {
        this.audioMng = this.audioMng.getComponent('AudioMng');
        this.audioMng.playMusic();
        cc.director.preloadScene('game', () => {
            cc.log('next scene preloaded');
        })
    },

    playGame () {
        this.audioMng.playButton();
        cc.director.loadScene('game');
    }
});

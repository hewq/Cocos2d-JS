cc.Class({
    extends: cc.Component,

    properties: {
        audioMng: cc.Node
    },

    onLoad () {
        wx.cloud.init();
        wx.cloud.callFunction({
          // 云函数名称
          name: 'getUserInfo',
          success(res) {
            console.log(res) // 3
            localStorage.setItem('openid', res.result.OPENID);
          },
          fail: console.error
        })
        this.audioMng = this.audioMng.getComponent('AudioMng');
        this.audioMng.playMusic();
        cc.director.preloadScene('game', () => {
            cc.log('next scene preloaded');
        })
    },

    playGame () {
        this.audioMng.playButton();
        let _id = localStorage.getItem('openid');
        
        wx.cloud.callFunction({
          // 云函数名称
          name: 'updatePlayTimes',
          // 传给云函数的参数
          data: {
            id: _id,
            isFirst: true
          },
          success(res) {
            console.log(res) // 3
          },
          fail: console.error
        })
        cc.director.loadScene('game');
    }
});

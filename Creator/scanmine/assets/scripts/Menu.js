let wxGame = require('WxGameComm');
cc.Class({
    extends: cc.Component,

    properties: {
        audioMng: cc.Node,
        dialogShare: cc.Node,
        btnShare: cc.Node,
        ruleNode: cc.Node,
        closeRuleNode: cc.Node,
        dialogBg: cc.Node,
        closeShareNode: cc.Node
    },

    onLoad () {

        // let canvas = cc.game.canvas;
        // console.log(canvas);

        // canvas.toTempFilePath({
        //     success: (res) => {
        //         wxGame.authSavePhoto();
        //         console.log(res.tempFilePath);
        //         wxGame.saveImage(res.tempFilePath, function () {
        //             console.log('save success');
        //         })
        //     }
        // });

        var canvas = cc.game.canvas;
        var width  = cc.winSize.width;
        var height  = cc.winSize.height;
        canvas.toTempFilePath({
            x: 0,
            y: 0,
            width: 30,
            height: 30,
            destWidth: 30,
            destHeight: 30,
            success (res) {
                //.可以保存该截屏图片
                console.log(res)
                wx.previewImage({
                     current: res.tempFilePath,
                     urls: [res.tempFilePath]
                })
            }
        })


        // console.log(temp);
        // wxGame.authSavePhoto();
        // wxGame.saveImage(temp, function () {
        //     console.log('save success');
        // })

		let self = this;
        let now = new Date().getTime();
        let limitTime = 24 * 60 * 60 * 1000; // 24 hour

        wxGame.getDevice();
        // wxGame.book();
        wxGame.getPlayTimes(function (res) {
            if (!res.result.data[0]) {
                localStorage.setItem('playTimes', 0);
                localStorage.setItem('isFirst', true);
            } else if (now - res.result.data[0].date > limitTime) {
                localStorage.setItem('playTimes', 0);
                localStorage.setItem('isFirst', false);
                wxGame.updatePlayTimes(true, function (res) {});
            } else {
                localStorage.setItem('playTimes', res.result.data[0].times);
                localStorage.setItem('isFirst', false);
            }
        });  

        wxGame.getScore(function (res) {
            if (!res.result.data[0]) {
                localStorage.setItem('hasScore', false);
            } else {
                localStorage.setItem('hasScore', true);
            }
        }); 

        localStorage.setItem('toPlayGame', false);

		wxGame.showShareMenu();
		wxGame.onShareAppMessage();
		wxGame.onShow();

        wxGame.getOpenId();
        wxGame.auth();
		wxGame.getUserInfo();

    	this.btnShare.on('touchend', function () {
            localStorage.setItem('closeTime', new Date().getTime());
			localStorage.setItem('toPlayGame', true);
			wxGame.shareAppMessage();
		});
        
        this.audioMng = this.audioMng.getComponent('AudioMng');
        this.audioMng.playMusic();
        cc.director.preloadScene('game', () => {
            cc.log('next scene preloaded');
        })
    },

    playGame () {
        cc.director.loadScene('game');
    },

    showRank () {
        localStorage.setItem('whereToRank', 'start');
    	cc.director.loadScene('rank');
    },

    showRule () {
        this.dialogBg.active = true;
        this.ruleNode.active = true;
        this.ruleNode.runAction(cc.scaleTo(.5, 1));
    },

    closeRule () {
        this.dialogBg.active = false;
        this.ruleNode.runAction(cc.scaleTo(.5, 0));
    },

    closeShare () {
        this.dialogBg.active = false;
        this.dialogShare.runAction(cc.scaleTo(.5, 0));
    }
});

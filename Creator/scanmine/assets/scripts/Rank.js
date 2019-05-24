let wxGame = require('WxGameComm');

cc.Class({
    extends: cc.Component,

    properties: {
        dialogShare: cc.Node,
        btnShare: cc.Node,
        closeShare: cc.Node,
        closeRank: cc.Node,
        dialogShareBg: cc.Node,
        wxSubContextView: cc.Node,
        btnAgain: cc.Node,
        rankWorld: cc.Node,
        content: cc.Node,
        prefab1: cc.Prefab,
        prefab2: cc.Prefab,
        icon: {
            default: [],
            type: cc.SpriteFrame
        },
        btnWorld: cc.Node,
        btnFriend: cc.Node 
    },

    onLoad () {
        let self = this;

        wx.getOpenDataContext().postMessage({
            message: "User info get success."
        });

        this._context = wx.getOpenDataContext();
        let sharedCanvas = this._context.canvas;

        this.btnShare.on('touchend', function () {
            localStorage.setItem('toPlayGame', true);
            localStorage.setItem('closeTime', new Date().getTime());
            wxGame.shareAppMessage();
        });

        this.btnAgain.on('touchend', () => {
            this.playAgain();
        });

        this.closeShare.on('touchend', function () {
                self.dialogShare.runAction(cc.scaleTo(.5, 0));
                setTimeout(function () {self.dialogShare.active = false}, 500);
                self.dialogShareBg.active = false;
        });

        this.closeRank.on('touchend', function () {
            cc.director.loadScene(localStorage.getItem('whereToRank'));
        });

        this.btnWorld.on('touchend', () => {
            this.rankWorld.active = true;
            this.wxSubContextView.active = false;
            this.btnFriend.getComponent(cc.Sprite).spriteFrame = '';
            this.btnWorld.getComponent(cc.Sprite).spriteFrame = this.icon[3];
        });

        this.btnFriend.on('touchend', () => {
            this.rankWorld.active = false;
            this.wxSubContextView.active = true;
            this.btnWorld.getComponent(cc.Sprite).spriteFrame = '';
            this.btnFriend.getComponent(cc.Sprite).spriteFrame = this.icon[3];
        });

        this.initRankInfo();
    },

    playAgain () {
        let self = this;
        cc.director.loadScene('game');
    },

    initRankInfo () {
      wxGame.getScoreTotal((res) => {
        console.log(res);
        if (res.result && res.result.data) {
            let listData = this.sortList(res.result.data, true);
            for (let i = 0; i < listData.length; ++i) {
              this.createUserBlock(listData[i], i)
            }
          }
      });
    },

    createUserBlock (user, num) {
      let node = null;
      if (num > 2) {
        node = cc.instantiate(this.prefab2);
        node.parent = this.content;
        node.x = 0;
        let no = node.getChildByName('no').getComponent(cc.Label);
        no.string = num + 1;
      } else {
        node = cc.instantiate(this.prefab1);
        node.parent = this.content;
        node.x = 0;
        let icon_1 = node.getChildByName('icon_1').getComponent(cc.Sprite);
        icon_1.spriteFrame = this.icon[num];
      }

      let nickName = node.getChildByName('nickname').getComponent(cc.Label);
      nickName.string = user.nickName;

      cc.loader.load({url: user.avatarUrl, type: 'png'}, (err, texture) => {
        if (err) console.log(err);
        let userNode = node.getChildByName('mask').children[0];
        let userIcon = userNode.getComponent(cc.Sprite);
        userIcon.spriteFrame = new cc.SpriteFrame(texture);

        if (num > 2) {
            userNode.width = 70;
            userNode.height = 70;
        } else {
            userNode.width = 90;
            userNode.height = 90;
        }
      })
    },
    sortList: function(ListData, order){ //排序(ListData：res.data;order:false降序，true升序)
      ListData.sort(function(a,b){
        var AMaxScore = 0;
        var KVDataList = a.KVDataList;
        for(let i = 0; i < KVDataList.length; i++){
          if(KVDataList[i].key == "score"){
            AMaxScore = KVDataList[i].value;
          }
        }


        var BMaxScore = 0;
        KVDataList = b.KVDataList;
        for(let i = 0; i < KVDataList.length; i++){
          if(KVDataList[i].key == "driver_MaxScore"){
            BMaxScore = KVDataList[i].value;
          }
        }


        if(order){
          return parseInt(AMaxScore) - parseInt(BMaxScore);
        }else{
          return parseInt(BMaxScore) - parseInt(AMaxScore);
        }
      });
      return ListData;
    }

});

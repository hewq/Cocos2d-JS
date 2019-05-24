cc.Class({
    extends: cc.Component,

    properties: {
       content: cc.Node,
       prefab1: cc.Prefab,
       prefab2: cc.Prefab,
       icon: {
        default: [],
        type: cc.SpriteFrame
       } 
    },

    start () {
      if (typeof wx === 'undefined') {
        return;
      }

      wx.onMessage(data => {
        if (data.message) {
          console.log(data.message);
        }
      })

      this.initFriendInfo();
    },

    initFriendInfo () {
      wx.getFriendCloudStorage({
        keyList: ['score'],
        success: (res) => {
          if (res && res.data) {
            let listData = this.sortList(res.data, true);
            for (let i = 0; i < listData.length; ++i) {
              this.createUserBlock(listData[i], i)
            }
          }
        },
        fail: (res) => {
          console.error(res);
        }
      })
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
      nickName.string = user.nickName || user.nickname;

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

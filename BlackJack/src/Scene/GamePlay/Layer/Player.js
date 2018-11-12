let PlayerLayer = cc.Layer.extend({
    ctor: function (name, goldNums, headPhoto, pos, rightPos) {
        this._super();

        this.loadPlayer(name, goldNums, headPhoto, pos, rightPos);

        return true;
    },
    loadPlayer: function (name, goldNums, headPhoto, pos, rightPos) {
        let layout = new ccui.Layout();
        this.addChild(layout);
        layout.setContentSize(1624, 750);
        layout.setAnchorPoint(0.5, 0.5);
        layout.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);

        let playerLayout = new ccui.Layout();
        layout.addChild(playerLayout);
        playerLayout.setAnchorPoint(0.5, 0.5);
        playerLayout.setContentSize(400, 140);
        playerLayout.setPosition(pos.x, pos.y);

        let layoutSize = playerLayout.getContentSize();

        let photoFrame = new cc.Sprite('#daojishi_photo.png');
        playerLayout.addChild(photoFrame);
        photoFrame.setAnchorPoint(0.5, 0.5);
        photoFrame.setPosition(layoutSize.width / 2, layoutSize.height / 2);

        let photo = new cc.Sprite(headPhoto);
        photoFrame.addChild(photo);
        photo.setPosition(photoFrame.getContentSize().width / 2, photoFrame.getContentSize().height / 2);

        let playerName = new cc.LabelTTF(name, 'AmericanTypewriter', 24);
        playerLayout.addChild(playerName);

        let goldNum = new cc.LabelBMFont(goldNums, res.stake_fnt);
        playerLayout.addChild(goldNum);

        if (!rightPos) {
            playerName.setAnchorPoint(1, 0);
            playerName.setPosition(layoutSize.width / 2 - 85, layoutSize.height / 2);
            goldNum.setAnchorPoint(1, 1);
            goldNum.setPosition(layoutSize.width / 2 - 85, layoutSize.height / 2);
        } else {
            playerName.setAnchorPoint(0, 0);
            playerName.setPosition(layoutSize.width / 2 + 85, layoutSize.height / 2);
            goldNum.setAnchorPoint(0, 1);
            goldNum.setPosition(layoutSize.width / 2 + 85, layoutSize.height / 2);
        }
    }
});
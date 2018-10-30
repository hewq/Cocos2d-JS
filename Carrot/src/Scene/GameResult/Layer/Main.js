let GSMainLayer = cc.Layer.extend({
    onEnter : function(){
        this._super();
        this.loadTitle();
        this.loadTitleIcon();
        this.loadAdvance();
        this.loadTipPanel();
        this.loadMenu();
    },
    loadTitle : function(){
        let fileName = GameManager.getIsWin() ? "res/GameResult/Win/win_title_whb.png" : "res/GameResult/Lose/lose_title_whb.png";
        let node = new ccui.ImageView(fileName);
        this.addChild(node);
        node.setPosition(cc.winSize.width / 2, cc.winSize.height - node.height);
    },
    loadTitleIcon : function(){
        let fileName = GameManager.getIsWin() ? "res/GameResult/Win/cup_gold.png" : "res/GameResult/Lose/lose_rip.png";
        let node = new ccui.ImageView(fileName);
        this.addChild(node);
        node.setPosition(cc.winSize.width / 2, cc.winSize.height - node.height / 2 - 30);
    },
    loadAdvance : function(){
        let fileName = GameManager.getIsWin() ? "res/GameResult/Win/win_getstone.png" : "res/GameResult/Lose/lose_adv.png";
        let node = new ccui.ImageView(fileName);
        this.addChild(node);
        node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 + 60);

        if (GameManager.getIsWin()) {
            // 数据写死
            let stoneText = new ccui.Text("04", "", 38);
            node.addChild(stoneText);
            stoneText.setPosition(node.width - 140, node.height / 2);
        }else{
            let currGroup = new ccui.Text(GameManager.getGroup(), "", 38);
            node.addChild(currGroup);
            currGroup.setPosition(node.width / 2 - 15, node.height / 2);

            let maxGroup = new ccui.Text(GameManager.getMaxGroup(), "", 38);
            node.addChild(maxGroup);
            maxGroup.setPosition(node.width / 2 + 60, node.height / 2);
        }
    },
    loadTipPanel : function(){
        let fileName = GameManager.getIsWin() ? "res/GameResult/Win/winlose_winover.png" : "res/GameResult/Lose/winlose_loseover.png";
        let node = new ccui.ImageView(fileName);
        this.addChild(node);
        node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 10);

        if (GameManager.getIsWin()) {
            let mission = null;
            let icon = null;
            let count = null;
            let nextPosX = 310;

            let iconName = ["micon_b5","micon_b5", "micon_b4"];
            for (let i = 0; i < 3; i++) {
                mission = new ccui.ImageView("res/GameResult/Win/mission1_" + (i + 1) + ".png");
                this.addChild(mission);
                mission.setPosition(nextPosX, 240);

                icon = new ccui.ImageView("res/GameResult/Win/" + iconName[i] + ".png");
                this.addChild(icon);
                icon.setPosition(nextPosX - 120, 240);

                nextPosX += 300;
            }

        }else{
            let randomIndex = 1 + Math.floor(Math.random() * 10);
            let tip = new ccui.ImageView("res/GameResult/Lose/lose_tip_" + randomIndex + ".png");
            node.addChild(tip);
            tip.setPosition(node.width / 2, node.height / 2 - 75);
        }

        if (GameManager.getIsWin()) {
            let level = new ccui.Text("3", "", 32);
            node.addChild(level);
            level.setPosition(node.width / 2, node.height / 2 + 13);
        }
    },
    loadMenu : function(){
        let posY = 90;
        let offsetX = 260;
        let homeNormal = new cc.Sprite("res/UI/btn_blue_s.png");
        let homePress = new cc.Sprite("res/UI/btn_blue_s_pressed.png");
        let homeDisabled  = new cc.Sprite("res/UI/btn_blue_s.png");
        let home = new cc.MenuItemSprite(
            homeNormal,
            homePress,
            homeDisabled,
            function(){
                cc.audioEngine.stopMusic();
                let scene = new ChooseLevelScene();
                cc.director.runScene(scene);
            }.bind(this));
        home.setPosition(cc.winSize.width / 2 - offsetX, posY);

        let homeIcon = new ccui.ImageView("res/GameResult/GameOver/winlose_home.png");
        home.addChild(homeIcon);
        homeIcon.setPosition(home.width / 2, home.height / 2);

        let playNormal = new cc.Sprite("res/UI/btn_green_b.png");
        let playPress = new cc.Sprite("res/UI/btn_green_b_pressed.png");
        let playDisabled  = new cc.Sprite("res/UI/btn_green_b.png");
        let play = new cc.MenuItemSprite(
            playNormal,
            playPress,
            playDisabled,
            function(){
                let level = 0;
                if (GameManager.getIsWin()) {
                    level = GameManager.getLevel() + 1;
                }else{
                    level = GameManager.getLevel();
                }
                GameManager.loadLevelData(level);
                let scene = new GamePlayScene();
                cc.director.runScene(scene);
            }.bind(this));
        play.setPosition(cc.winSize.width / 2 , posY);

        let playIcon = null;
        if (GameManager.getIsWin()) {
            playIcon = new ccui.ImageView("res/GameResult/Win/win_continue.png");
        }else{
            playIcon = new ccui.ImageView("res/GameResult/Lose/lose_retry.png");
        }
        play.addChild(playIcon);
        playIcon.setPosition(play.width / 2, play.height / 2);

        let weiboNormal = new cc.Sprite("res/UI/btn_blue_s.png");
        let weiboPress = new cc.Sprite("res/UI/btn_blue_s_pressed.png");
        let weiboDisabled  = new cc.Sprite("res/UI/btn_blue_s.png");
        let weibo = new cc.MenuItemSprite(
            weiboNormal,
            weiboPress,
            weiboDisabled,
            function(){

            }.bind(this));
        weibo.setPosition(cc.winSize.width / 2 + offsetX, posY);
        let weiboIcon = new ccui.ImageView("res/GameResult/GameOver/win_weibo.png");
        weibo.addChild(weiboIcon);
        weiboIcon.setPosition(weibo.width / 2, weibo.height / 2);



        let menu = new cc.Menu(home, play, weibo);
        this.addChild(menu);
        menu.setPosition(0, 0);
    }
});
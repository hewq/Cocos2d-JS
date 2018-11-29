let GameManager = {
    betChip: 0, // 投注的金币
    ownChip: 0, // 拥有的金币
    systemTips: '', // 系统提示信息
    pokerNum: 52,   // 剩下的扑克牌数量
    dealerCard: [], // 庄家拥有的扑克牌
    playerCard: [], // 玩家拥有的扑克牌
    dealerBlackJack: false, // 庄家是否 black jack
    dealerDoubleJack: false, // 庄家是否 double jack
    dealerFive: false, // 庄家是否五小龙
    playerBlackJack: false, // 玩家是否 black jack
    playerDoubleJack: false, // 玩家是否 double jack
    playerFive: false, // 玩家是否五小龙
    dealerNum: 0, // 庄家点数
    playerNum: 0, // 玩家点数
    dealerBust: false, // 庄家是否爆牌
    playerBust: false, // 玩家是否爆牌
    pokerUseUp: false, // 扑克牌是否没牌
    isWin: -1, // 赢：1，输，-1，平：0
    
    betAgain: function () {
        this.betChip= 0;
        this.pokerNum= 52;
        this.dealerCard= [];
        this.playerCard= [];
        this.dealerBlackJack= false;
        this.dealerDoubleJack= false;
        this.dealerFive= false;
        this.playerBlackJack= false;
        this.playerDoubleJack= false;
        this.playerFive= false;
        this.dealerNum= 0;
        this.playerNum= 0;
        this.dealerBust= false;
        this.playerBust= false;
        this.pokerUseUp= false;
        this.isWin= -1; 
    },

    // getter & setter
    getBetChip: function () {
        return this.betChip;
    },
    setBetChip: function (betChip) {
        this.betChip = betChip;
    },
    getOwnChip: function () {
        return this.ownChip;
    },
    setOwnChip: function (ownChip) {
        this.ownChip = ownChip;
    },
    getSystemTips: function () {
        return this.systemTips;
    },
    setSystemTips: function (systemTips) {
        this.systemTips = systemTips;
    },
    getPokerNum: function () {
        return this.pokerNum;
    },
    setPokerNum: function (pokerNum) {
        this.pokerNum = pokerNum;
    },
    getDealerCard: function () {
        return this.dealerCard;
    },
    setDealerCard: function (dealerCard) {
        this.dealerCard = dealerCard;
    },
    getPlayerCard: function () {
        return this.playerCard;
    },
    setPlayerCard: function (playerCard) {
        this.playerCard = playerCard;
    },
    getDealerBlackJack: function () {
        return this.dealerBlackJack;
    },
    setDealerBlackJack: function (dealerBlackJack) {
        this.dealerBlackJack = dealerBlackJack;
    },
    getDealerDoubleJack: function () {
        return this.dealerDoubleJack;
    },
    setDealerDoubleJack: function (dealerDoubleJack) {
        this.dealerDoubleJack = dealerDoubleJack;
    },
    getDealerFive: function () {
        return this.dealerFive;
    },
    setDealerFive: function (dealerFive) {
        this.dealerFive = dealerFive;
    },
    getPlayerBlackJack: function () {
        return this.playerBlackJack;
    },
    setPlayerBlackJack: function (playerBlackJack) {
        this.playerBlackJack = playerBlackJack;
    },
    getPlayerDoubleJack: function () {
        return this.playerDoubleJack;
    },
    setPlayerDoubleJack: function (playerDoubleJack) {
        this.playerDoubleJack = playerDoubleJack;
    },
    getPlayerFive: function () {
        return this.playerFive;
    },
    setPlayerFive: function (playerFive) {
        this.playerFive = playerFive;
    },
    getDealerNum: function () {
        return this.dealerNum;
    },
    setDealerNum: function (dealerNum) {
        this.dealerNum = dealerNum;
    },
    getPlayerNum: function () {
        return this.playerNum;
    },
    setPlayerNum: function (playerNum) {
        this.playerNum = playerNum;
    },
    getDealerBust: function () {
        return this.dealerBust;
    },
    setDealerBust: function (dealerBust) {
        this.dealerBust = dealerBust;
    },
    getPlayerBust: function () {
        return this.playerBust;
    },
    setPlayerBust: function (playerBust) {
        this.playerBust = playerBust;
    },
    getPokerUseUp: function () {
        return this.pokerUseUp;
    },
    setPokerUseUp: function (pokerUseUp) {
        this.pokerUseUp = pokerUseUp;
    },
    getIsWin: function () {
        return this.isWin;
    },
    setIsWin: function (isWin) {
        this.isWin = isWin;
    }
};


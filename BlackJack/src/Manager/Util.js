let Util = {
    computeDealer: function () {
        let dealerCard = GameManager.getDealerCard(); // 庄家牌
        let dealerCard0 = dealerCard[0].num;
        let dealerCard1 = dealerCard[1].num;
        let getCard = null;

        GameManager.setDealerNum(dealerCard0 + dealerCard1);

        let twoNum = GameManager.getDealerNum(),
            threeNum = 0,
            fourNum = 0;

        // double jack
        if (dealerCard0 === 1 && dealerCard1 === 1) {
            GameManager.setDealerDoubleJack();
        } else if (dealerCard0 === 1 && dealerCard1 === 10 || dealerCard0 === 10 && dealerCard1 === 1) {
            GameManager.setDealerBlackJack();
        } else if (dealerCard0 === 1 || dealerCard1 === 1) {
            let notJackCard = dealerCard0 === 1 ? dealerCard1 : dealerCard0;

            GameManager.setDealerNum(11 + notJackCard);

            if (notJackCard === 3) {
                getCard = this.getDealerCard();

                if (getCard.num > 8) {
                    GameManager.setDealerNum(getCard.num + 4);
                    fourNum = this.getDealerCardAndNum();
                    this.checkBoomAndLess(fourNum);
                } else if (getCard.num === 8 || getCard.num === 7) {
                    GameManager.setDealerNum(21);
                } else if (getCard.num === 1) {
                    GameManager.setDealerNum(5);
                    fourNum = this.getDealerCardAndNum();
                    this.checkBoomAndLess(fourNum);
                }
            } else if (notJackCard === 2) {
                getCard = this.getDealerCard();

                if (getCard.num === 10) {
                    GameManager.setDealerNum(13);
                    fourNum = this.getDealerCardAndNum();
                    this.checkBoomAndLess(fourNum);
                } else if (getCard.num === 9 || getCard.num === 8) {
                    GameManager.setDealerNum(21);
                } else if (getCard.num === 1) {
                    GameManager.setDealerNum(4);
                    this.getDealerCard();
                    this.getCardAndCheckBoomOrFive();
                }
            }
        } else if (this.checkLess(twoNum)) {
            getCard = this.getDealerCard();
            threeNum = GameManager.getDealerNum();

            if(twoNum > 11){
                if (this.checkBoom(threeNum)) {
                    GameManager.setDealerBust();
                } else if (this.checkLess(threeNum)) {
                    fourNum = this.getDealerCardAndNum();
                    this.checkBoomAndLess(fourNum);
                }
            } else if (twoNum === 10 || twoNum === 11) {
                if (getCard.num === 1) {
                    GameManager.setDealerNum(21);
                } else if (this.checkLess(threeNum)) {
                    fourNum = this.getDealerCardAndNum();
                    this.checkBoomAndLess(fourNum);
                }
            } else {
                if (getCard.num === 1) {
                    GameManager.setDealerNum(GameManager.getDealerNum() + 10);
                } else if (this.checkLess(threeNum)) {
                    getCard = this.getDealerCard();
                    fourNum = GameManager.getDealerNum();
                    if (getCard.num === 1) {
                        if (fourNum < 12) {
                            GameManager.setDealerNum(fourNum + 10);
                        } else if (fourNum === 12) {
                            GameManager.setDealerNum(21);
                        } else if (this.checkLess(fourNum)) {
                            this.getCardAndCheckBoomOrFive();
                        }
                    } else {
                        this.checkBoomAndLess(fourNum);
                    }
                }
            }
        }
    },
    checkBoom: function (num) {
        return num > 21;
    },
    checkBoomOrFive: function () {
        if (this.checkBoom(GameManager.getDealerNum())) {
            GameManager.setDealerBust();
        } else {
            GameManager.setDealerFive();
        }
    },
    checkBoomAndLess: function (num) {
        if (this.checkBoom(num)) {
            GameManager.setDealerBust();
        } else if (this.checkLess(num)) {
            this.getCardAndCheckBoomOrFive();
        }
    },
    getCardAndCheckBoomOrFive: function () {
        this.getDealerCard();
        this.checkBoomOrFive();
    },
    getDealerCardAndNum: function () {
        this.getDealerCard();
        return GameManager.getDealerNum();
    },
    checkLess: function (num) {
        return num < 15;
    },
    getDealerCard: function () {
        let card = this.getPokerRandom();
        GameManager.getDealerCard().push(card);
        GameManager.setDealerNum(GameManager.getDealerNum() + card.num);
        GameManager.setDealerRes(GameManager.getDealerNum());

        return card;
    },
    getPokerRandom: function () {
        let random = Math.floor(Math.random() * GameManager.getPokerNum());
        let cardInfo = poker[random];
        poker.splice(random, 1);

        GameManager.setPokerNum(GameManager.getPokerNum() - 1);

        return cardInfo;
    },
    computePlayer: function () {
        let playerCard = GameManager.getPlayerCard();
        let playerCardLength = playerCard.length;

        let playerCard0 = playerCard[0].num;
        let playerCard1 = playerCard[1].num;

        if (playerCardLength === 2) {
            if (playerCard0 === 1 && playerCard1 === 1) {
                GameManager.setPlayerDoubleJack();
            } else if (playerCard0 === 1 && playerCard1 === 10 || playerCard0 === 10 && playerCard1 === 1) {
                GameManager.setPlayerBlackJack();
            } else if (playerCard0 === 1 || playerCard1 === 1) {
                let notJackCard = playerCard0 === 1 ? playerCard1 : playerCard0;
                GameManager.setPlayerNum(11 + notJackCard);
                GameManager.setPlayerRes(GameManager.getPlayerNum());
            } else if (playerCard0 + playerCard1 < 15) {
                GameManager.setPlayerLess();
            } else {
                GameManager.setPlayerNum(playerCard0 + playerCard1);
                GameManager.setPlayerRes(GameManager.getPlayerNum());
            }
        } else if (playerCardLength === 5) {
            let total = playerCard0 + playerCard1 + playerCard[2].num + playerCard[3].num + playerCard[4].num;

            if (total > 21) {
                GameManager.setPlayerBust();
            } else {
                GameManager.setPlayerFive();
            }
        } else {
            this.getJackLen(playerCard);
        }
    },
    getJackLen: function (arr) {
        let jackLen = 0;
        let total = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].num === 1) {
                jackLen++;
            }
            total += arr[i].num;
        }

        if (jackLen === 1) {
            if (total < 12) {
                GameManager.setPlayerNum(total + 10);
                GameManager.setPlayerRes(GameManager.getPlayerNum());
            } else if (total === 12) {
                GameManager.setPlayerNum(total + 9);
                GameManager.setPlayerRes(GameManager.getPlayerNum());
            }
        } else {
            GameManager.setPlayerNum(total);
            GameManager.setPlayerRes(GameManager.getPlayerNum());
            if (total > 21) {
                GameManager.setPlayerBust();
            } else if (total < 15) {
                GameManager.setPlayerLess();
            }
        }
    },
    computeRes: function () {
        let res = 0;
        let resDealer = GameManager.getDealerRes(),
            resPlayer = GameManager.getPlayerRes();

        switch (true) {
            case resPlayer === -1:
                res = -1;
                break;
            case resDealer === resPlayer:
                res = 0;
                break;
            case resDealer > resPlayer:
                res = -1;
                break;
            case resDealer < resPlayer:
                res = 1;
                break;
        }

        GameManager.setIsWin(res);
    },
    resultText: function () {
        let resText = '和局';
        if (GameManager.getIsWin() === 1) {
            resText = '你赢了';
            cc.audioEngine.playEffect(res.win_mp3, false);
        } else if (GameManager.getIsWin() === -1) {
            resText =  '你输了';
            cc.audioEngine.playEffect(res.fail_mp3, false);
        }
        GameManager.setSystemTips(resText);
    },
    restart: function () {
        GameManager.betAgain();
        poker = [].concat(resetPoker);
    },
};
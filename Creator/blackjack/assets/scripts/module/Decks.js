let Types = require('Types');

/**
 * 扑克管理类，用来管理一副或多副牌
 * @class Decks
 * @constructor
 * @param {number} numberOfDecks - 总共几副牌
 */

function Decks (numberOfDecks) {
    // 总共几副牌
    this._numberOfDecks = numberOfDecks;

    // 还没发出去的牌
    this._cardIds = new Array(numberOfDecks * 52);

    this.reset();
}

/**
 * 重置所有牌
 * @method reset
 */
Decks.prototype.reset = function () {
    this._cardIds.length = this._numberOfDecks * 52;
    let index = 0;
    let fromId = Types.Card.fromId;
    for (let i = 0; i < this._numberOfDecks; ++i) {
        for (let cardId = 0; cardId < 52; ++cardId) {
            this._cardIds[index] = fromId(cardId);
            ++index;
        }
    }
};

/**
 * 随机抽一张牌，如果已经没牌了，将返回 null
 * @method  draw
 * @return {Card}
 */
Decks.prototype.draw = function () {
    let cardIds = this._cardIds;
    let len = cardIds.length;
    if (len === 0) {
        return null;
    }

    let random = Math.random();
    let index = (random * len) | 0;
    let result = cardIds[index];

    // 保持数组紧凑
    let last = cardIds[len - 1];
    cardIds[index] = last;
    cardIds.length = len - 1;

    return result;
};

module.exports = Decks;

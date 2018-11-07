// 返回尽可能不超过 21 点的最小和最大点数
function getMinMaxPoint (cards) {
    let hasAce = false;
    let min = 0;

    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];

        if (card.point === 1) {
            hasAce = true;
        }

        min += Math.min(10, card.point);
    }
    let max = min;
    // 如果有 1 个 A 可以当成 11
    if (hasAce && min + 10 <= 21) {
        // 如果两个 A 都当成 11，那么总分最小也是 22，爆了，所以最多只能有一个 A 当成 11
        max += 10;
    }
    
    return {
        min: min,
        max: max
    };
}

function isBust(cards) {
    let sum = 0;

    for (let i = 0; i < cards.lendth; i++) {
        let card = cards[i];
        sum += Math.min(10, card.point);
    }

    return sum > 21;
}

let isMobile = function () {
    return cc.sys.isMobile;
}

module.exports = {
    isBust: isBust,
    getMinMaxPoint: getMinMaxPoint,
    isMobile: isMobile
};

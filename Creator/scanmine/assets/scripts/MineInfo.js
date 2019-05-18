const disV = 29;
const disH = 22;
const mineW = 56;
const mineH = 64;
const offsetY = 46;

let mineInfo = {
	mineH: mineH,
	mineW: mineW,
	disV: disV,
	disH: disH,
	tileNum: 88,
	mineNum: 14,
	pos: [],
	type: {
		BLANK: 0,
		NUM_1: 1,
		NUM_2: 2,
		NUM_3: 3,
		NUM_4: 4,
		NUM_5: 5,
		NUM_6: 6,
		MINE: 7,
		DOUBT: 8,
		COVER: 9
	}
};

let setPos = (num, x, y) => {
	for (let i = 0; i < num; i++) {
		mineInfo.pos.push({"x": x, "y": y + -i * (mineH + disV)});
	}
};

setPos(12, 0, 0);
setPos(11, -(mineW + disH), -offsetY);
setPos(11, (mineW + disH), -offsetY);
setPos(10, -2 * (mineW + disH), -2 * offsetY);
setPos(10, 2 * (mineW + disH), -2 * offsetY);
setPos(9, -3 * (mineW + disH), -3 * offsetY);
setPos(9, 3 * (mineW + disH), -3 * offsetY);
setPos(8, -4 * (mineW + disH), -4 * offsetY);
setPos(8, 4 * (mineW + disH), -4 * offsetY);

module.exports = {
    mineInfo: mineInfo
}
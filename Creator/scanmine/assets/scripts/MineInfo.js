const disV = 29;
const disH = 22;
const mineW = 56;
const mineH = 64;
const offsetY = 46;

let mineInfo = {
	tileNum: 88,
	mineNum: 14,
	pos: []
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
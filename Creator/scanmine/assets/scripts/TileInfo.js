const disV = 24;
const disH = 18;
const tileW = 60;
const tileH = 64;
const offsetY = 46;

let tileInfo = {
	tileH: tileH,
	tileW: tileW,
	disV: disV,
	disH: disH,
	tileNum: 88,
	mineNum: 16,
    topTile: [0, 12, 23, 34, 44, 54, 63, 72, 80],
    rightTile: [80, 81, 82, 83, 84, 85, 86, 87],
    bottomTile: [11, 22, 33, 43, 53, 62, 71, 79, 87],
    leftTile: [72, 73, 74, 75, 76, 77, 78, 79],
    leftBottomTile: [11, 22, 43, 62, 79],
    rightBottomTile: [11, 33, 53, 71, 87],
    leftTopTile: [0, 12, 34, 54, 72],
    rightTopTile: [0, 23, 44, 63, 80],
    tilesC: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    tilesL: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 
             22, 34, ,35, 36, 37, 38, 39, 40, 41, 42, 
             43, 54, 55, 56, 57, 58, 59, 60, 61, 62,
             72, 73, 74, 75, 76, 77, 78, 79],
    tilesR: [23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
             33, 44, 45, 46, 47, 48, 49, 50, 51, 52, 
             53, 63, 64, 65, 66, 67, 68, 69, 70 ,71, 
             80, 81, 82, 83, 84, 85, 86, 87],
    tilesNoLineL: [11, 22, 43, 62, 72, 73, 74, 75, 76, 77, 78, 79],
    tilesNoLineR: [11, 33, 53, 71, 80, 81, 82, 83, 84, 85, 86, 87],
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
		tileInfo.pos.push({"x": x, "y": y + -i * (tileH + disV)});
	}
};

setPos(12, 0, 0);
setPos(11, -(tileW + disH), -offsetY);
setPos(11, (tileW + disH), -offsetY);
setPos(10, -2 * (tileW + disH), -2 * offsetY);
setPos(10, 2 * (tileW + disH), -2 * offsetY);
setPos(9, -3 * (tileW + disH), -3 * offsetY);
setPos(9, 3 * (tileW + disH), -3 * offsetY);
setPos(8, -4 * (tileW + disH), -4 * offsetY);
setPos(8, 4 * (tileW + disH), -4 * offsetY);

module.exports = {
    tileInfo: tileInfo
}
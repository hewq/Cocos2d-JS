let playerInfo = [
    {
        name: '洪兴陈浩南',
        goldNums: 1000,
        headPhoto: '#user/circle_5.png',
        pos: {
            x: 340,
            y: 540
        }
    },
    {
        name: '红花双棍啊敏',
        goldNums: 5600,
        headPhoto: '#user/circle_5.png',
        pos: {
            x: 440,
            y: 320
        }
    },
    {
        name: '塘朗山秋哥',
        goldNums: 200000,
        headPhoto: '#user/circle_1.png',
        pos: {
            x: 750,
            y: 210
        }
    },
    {
        name: '山口组山鸡',
        goldNums: 5400,
        headPhoto: '#user/circle_5.png',
        pos: {
            x: 1180,
            y: 310
        }
    },
    {
        name: '秋名山虎哥',
        goldNums: 13200,
        headPhoto: '#user/circle_5.png',
        pos: {
            x: 1280,
            y: 540
        }
    },
];

let betPoolInfo = [
    {
        num: '1000',
        pos: {
            x: 500,
            y: 700
        }
    },
    {
        num: '2000',
        pos: {
            x: 600,
            y: 500
        }
    },
    {
        num: '3000',
        pos: {
            x: 820,
            y: 420
        }
    },
    {
        num: '4000',
        pos: {
            x: 1060,
            y: 500
        }
    },
    {
        num: '5000',
        pos: {
            x: 1150,
            y: 700
        }
    }
];

let chipPng = ['#10K.png', '#5K.png', '#2K.png', '#1K.png'];

let poker = [
    {
        'text': '2',
        'num': 2,
        'color': 'red',
        'iconSmall': '#fangkuai_small.png',
        'iconBig': '#fangkuai_big.png'
    },
    {
        'text': '3',
        'num': 3,
        'color': 'red',
        'iconSmall': '#fangkuai_small.png',
        'iconBig': '#fangkuai_big.png'
    },
    {
        'text': '4',
        'num': 4,
        'color': 'red',
        'iconSmall': '#fangkuai_small.png',
        'iconBig': '#fangkuai_big.png'
    },
    {
        'text': '5',
        'num': 5,
        'color': 'red',
        'iconSmall': '#fangkuai_small.png',
        'iconBig': '#fangkuai_big.png'
    },
    {
        'text': '6',
        'num': 6,
        'color': 'red',
        'iconSmall': '#fangkuai_small.png',
        'iconBig': '#fangkuai_big.png'
    },
    {
        'text': '7',
        'num': 7,
        'color': 'red',
        'iconSmall': '#fangkuai_small.png',
        'iconBig': '#fangkuai_big.png'
    },
    {
        'text': '8',
        'num': 8,
        'color': 'red',
        'iconSmall': '#fangkuai_small.png',
        'iconBig': '#fangkuai_big.png'
    },
    {
        'text': '9',
        'num': 9,
        'color': 'red',
        'iconSmall': '#fangkuai_small.png',
        'iconBig': '#fangkuai_big.png'
    },
    {
        'text': '10',
        'num': 10,
        'color': 'red',
        'iconSmall': '#fangkuai_small.png',
        'iconBig': '#fangkuai_big.png'
    },
    {
        'text': 'J',
        'num': 10,
        'color': 'red',
        'iconSmall': '#fangkuai_small.png',
        'iconBig': '#fangkuai_big.png'
    },
    {
        'text': 'Q',
        'num': 10,
        'color': 'red',
        'iconSmall': '#fangkuai_small.png',
        'iconBig': '#fangkuai_big.png'
    },
    {
        'text': 'K',
        'num': 10,
        'color': 'red',
        'iconSmall': '#fangkuai_small.png',
        'iconBig': '#fangkuai_big.png'
    },
    {
        'text': 'A',
        'num': 1,
        'color': 'red',
        'iconSmall': '#fangkuai_small.png',
        'iconBig': '#fangkuai_big.png'
    },
    {
        'text': '2',
        'num': 2,
        'color': 'black',
        'iconSmall': '#heimei_small.png',
        'iconBig': '#heimei_big.png'
    },
    {
        'text': '3',
        'num': 3,
        'color': 'black',
        'iconSmall': '#heimei_small.png',
        'iconBig': '#heimei_big.png'
    },
    {
        'text': '4',
        'num': 4,
        'color': 'black',
        'iconSmall': '#heimei_small.png',
        'iconBig': '#heimei_big.png'
    },
    {
        'text': '5',
        'num': 5,
        'color': 'black',
        'iconSmall': '#heimei_small.png',
        'iconBig': '#heimei_big.png'
    },
    {
        'text': '6',
        'num': 6,
        'color': 'black',
        'iconSmall': '#heimei_small.png',
        'iconBig': '#heimei_big.png'
    },
    {
        'text': '7',
        'num': 7,
        'color': 'black',
        'iconSmall': '#heimei_small.png',
        'iconBig': '#heimei_big.png'
    },
    {
        'text': '8',
        'num': 8,
        'color': 'black',
        'iconSmall': '#heimei_small.png',
        'iconBig': '#heimei_big.png'
    },
    {
        'text': '9',
        'num': 9,
        'color': 'black',
        'iconSmall': '#heimei_small.png',
        'iconBig': '#heimei_big.png'
    },
    {
        'text': '10',
        'num': 10,
        'color': 'black',
        'iconSmall': '#heimei_small.png',
        'iconBig': '#heimei_big.png'
    },
    {
        'text': 'J',
        'num': 10,
        'color': 'black',
        'iconSmall': '#heimei_small.png',
        'iconBig': '#heimei_big.png'
    },
    {
        'text': 'Q',
        'num': 10,
        'color': 'black',
        'iconSmall': '#heimei_small.png',
        'iconBig': '#heimei_big.png'
    },
    {
        'text': 'K',
        'num': 10,
        'color': 'black',
        'iconSmall': '#heimei_small.png',
        'iconBig': '#heimei_big.png'
    },
    {
        'text': 'A',
        'num': 1,
        'color': 'black',
        'iconSmall': '#heimei_small.png',
        'iconBig': '#heimei_big.png'
    },
    {
        'text': '2',
        'num': 2,
        'color': 'red',
        'iconSmall': '#hongtao_small.png',
        'iconBig': '#hongtao_big.png'
    },
    {
        'text': '3',
        'num': 3,
        'color': 'red',
        'iconSmall': '#hongtao_small.png',
        'iconBig': '#hongtao_big.png'
    },
    {
        'text': '4',
        'num': 4,
        'color': 'red',
        'iconSmall': '#hongtao_small.png',
        'iconBig': '#hongtao_big.png'
    },
    {
        'text': '5',
        'num': 5,
        'color': 'red',
        'iconSmall': '#hongtao_small.png',
        'iconBig': '#hongtao_big.png'
    },
    {
        'text': '6',
        'num': 6,
        'color': 'red',
        'iconSmall': '#hongtao_small.png',
        'iconBig': '#hongtao_big.png'
    },
    {
        'text': '7',
        'num': 7,
        'color': 'red',
        'iconSmall': '#hongtao_small.png',
        'iconBig': '#hongtao_big.png'
    },
    {
        'text': '8',
        'num': 8,
        'color': 'red',
        'iconSmall': '#hongtao_small.png',
        'iconBig': '#hongtao_big.png'
    },
    {
        'text': '9',
        'num': 9,
        'color': 'red',
        'iconSmall': '#hongtao_small.png',
        'iconBig': '#hongtao_big.png'
    },
    {
        'text': '10',
        'num': 10,
        'color': 'red',
        'iconSmall': '#hongtao_small.png',
        'iconBig': '#hongtao_big.png'
    },
    {
        'text': 'J',
        'num': 10,
        'color': 'red',
        'iconSmall': '#hongtao_small.png',
        'iconBig': '#hongtao_big.png'
    },
    {
        'text': 'Q',
        'num': 10,
        'color': 'red',
        'iconSmall': '#hongtao_small.png',
        'iconBig': '#hongtao_big.png'
    },
    {
        'text': 'K',
        'num': 10,
        'color': 'red',
        'iconSmall': '#hongtao_small.png',
        'iconBig': '#hongtao_big.png'
    },
    {
        'text': 'A',
        'num': 1,
        'color': 'red',
        'iconSmall': '#hongtao_small.png',
        'iconBig': '#hongtao_big.png'
    },
    {
        'text': '2',
        'num': 2,
        'color': 'black',
        'iconSmall': '#heitao_small.png',
        'iconBig': '#heitao_big.png'
    },
    {
        'text': '3',
        'num': 3,
        'color': 'black',
        'iconSmall': '#heitao_small.png',
        'iconBig': '#heitao_big.png'
    },
    {
        'text': '4',
        'num': 4,
        'color': 'black',
        'iconSmall': '#heitao_small.png',
        'iconBig': '#heitao_big.png'
    },
    {
        'text': '5',
        'num': 5,
        'color': 'black',
        'iconSmall': '#heitao_small.png',
        'iconBig': '#heitao_big.png'
    },
    {
        'text': '6',
        'num': 6,
        'color': 'black',
        'iconSmall': '#heitao_small.png',
        'iconBig': '#heitao_big.png'
    },
    {
        'text': '7',
        'num': 7,
        'color': 'black',
        'iconSmall': '#heitao_small.png',
        'iconBig': '#heitao_big.png'
    },
    {
        'text': '8',
        'num': 8,
        'color': 'black',
        'iconSmall': '#heitao_small.png',
        'iconBig': '#heitao_big.png'
    },
    {
        'text': '9',
        'num': 9,
        'color': 'black',
        'iconSmall': '#heitao_small.png',
        'iconBig': '#heitao_big.png'
    },
    {
        'text': '10',
        'num': 10,
        'color': 'black',
        'iconSmall': '#heitao_small.png',
        'iconBig': '#heitao_big.png'
    },
    {
        'text': 'J',
        'num': 10,
        'color': 'black',
        'iconSmall': '#heitao_small.png',
        'iconBig': '#heitao_big.png'
    },
    {
        'text': 'Q',
        'num': 10,
        'color': 'black',
        'iconSmall': '#heitao_small.png',
        'iconBig': '#heitao_big.png'
    },
    {
        'text': 'K',
        'num': 10,
        'color': 'black',
        'iconSmall': '#heitao_small.png',
        'iconBig': '#heitao_big.png'
    },
    {
        'text': 'A',
        'num': 1,
        'color': 'black',
        'iconSmall': '#heitao_small.png',
        'iconBig': '#heitao_big.png'
    }
];
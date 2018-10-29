let res = {
    HelloWorld_png : "res/HelloWorld.png",

    front_bg_png: "res/MainMenu/zh/front_bg.png",
    TiledMap_tmx: "res/ChooseLevel/Map/TiledMap.tmx",

    discount_fnt: "res/ChooseLevel/discount.fnt",

    stage_map_0_png: "res/ChooseLevel/Map/stage_map_0.png",
    stage_map_1_png: "res/ChooseLevel/Map/stage_map_1.png",
    stage_map_2_png: "res/ChooseLevel/Map/stage_map_2.png",
    stage_map_3_png: "res/ChooseLevel/Map/stage_map_3.png",
    stage_map_4_png: "res/ChooseLevel/Map/stage_map_4.png",
    stage_map_5_png: "res/ChooseLevel/Map/stage_map_5.png",
    stage_map_6_png: "res/ChooseLevel/Map/stage_map_6.png",
    stage_map_7_png: "res/ChooseLevel/Map/stage_map_7.png",
    stage_map_8_png: "res/ChooseLevel/Map/stage_map_8.png",
    stage_map_9_png: "res/ChooseLevel/Map/stage_map_9.png",
    stage_map_10_png: "res/ChooseLevel/Map/stage_map_10.png",
    stage_map_11_png: "res/ChooseLevel/Map/stage_map_11.png",
    stage_map_12_png: "res/ChooseLevel/Map/stage_map_12.png",
    stage_map_13_png: "res/ChooseLevel/Map/stage_map_13.png",

    route_plist: "res/ChooseLevel/route.plist",
    route_png: "res/ChooseLevel/route.png",

    level1_tmx: "res/GamePlay/Theme/Theme1/BG1/Level1.tmx",
    level2_tmx: "res/GamePlay/Theme/Theme1/BG2/Level2.tmx"
};

let g_resources = [];
for (let i in res) {
    g_resources.push(res[i]);
}

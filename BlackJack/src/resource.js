var res = {
    // Sound
    bgm_mp3: 'res/Sound/bgm2.mp3',
    button_mp3: 'res/Sound/button.mp3',
    card_mp3: 'res/Sound/card_deal.mp3',
    chips_mp3: 'res/Sound/chips_place.mp3',
    win_mp3: 'res/Sound/achievement_won.mp3',
    fail_mp3: 'res/Sound/fail.mp3',

    // MainMenu
    bg_png: 'res/bg.png',

    // Menu
    menu_png: 'res/Menu/menu.png',
    menu_plist: 'res/Menu/menu.plist',

    // Share
    share_png: 'res/Share/shared.png',
    share_plist: 'res/Share/shared.plist',

    // Table
    table_png: 'res/Table/table.png',
    table_plist: 'res/Table/table.plist',

    // Card
    card_png: 'res/Card/card.png',
    card_plist: 'res/Card/card.plist',

    // Animation
    animation_png: 'res/Animation/fx_animation.png',
    animation_plist: 'res/Animation/fx_animation.plist',


    // Bust
    bust_png: 'res/Bust/bust.png',
    bust_plist: 'res/Bust/bust.plist',

    // Font
    stake_png: 'res/Font/stake_number.png',
    stake_fnt: 'res/Font/stake_number.fnt',
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}

cc.Class({
    extends: cc.Component,

    properties: {
        winAudio: {
            default: null,
            url: cc.AudioClip
        },
        loseAudio: {
            default: null,
            url: cc.AudioClip
        },
        buttonAudio: {
            default: null,
            url: cc.AudioClip
        },
        bgm: {
            default: null,
            url: cc.AudioClip
        }
    },

    playMusic () {
        cc.audioEngine.playMusic(this.bgm, true);
    },

    pauseMusic () {
        cc.audioEngine.pauseMusic();
    },

    resumeMusic () {
        cc.audioEngine.resumeMusic();
    },

    _playSound (clip) {
        cc.audioEngine.playEffect(clip, false);
    },

    playWin () {
        this._playSound(this.winAudio);
    },

    playLose () {
        this._playSound(this.loseAudio);
    },

    playButton () {
        this._playSound(this.buttonAudio);
    }
});

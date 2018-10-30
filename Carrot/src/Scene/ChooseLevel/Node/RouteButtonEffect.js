let EffectNode = cc.Sprite.extend({
    ctor: function (fileName, rect, rotated) {
        this._super(fileName, rect, rotated);
        this.loadAction();
        return true;
    },
    loadAction: function () {
        this.stopAllActions();
        this.setScale(0.35);
        this.setOpacity(255);
        let time = 0.8;

        let delay = cc.delayTime(time * 0.8);
        let fadeOut = cc.fadeOut(time * 0.7).easing(cc.easeExponentialOut());
        let delayOut = cc.sequence(delay, fadeOut);
        this.runAction(delayOut);

        let callback = cc.callFunc(this.loadAction.bind(this), this);
        let scaleTo12 = cc.scaleTo(time, 1.35);
        let delayCall = cc.delayTime(1);
        let seq = cc.sequence(scaleTo12, delayCall, callback);
        this.runAction(seq);
    }
});

let RouteButtonEffect = cc.Node.extend({
    effectArray: [],
    ctor: function () {
        this._super();
        this.loadEffectNode();
        return true;
    },
    loadEffectNode: function () {
        function addEffectNode () {
            node = new EffectNode("res/ChooseLevel/stagemap_local.png");
            this.addChild(node);
            this.effectArray.push(node);
        }
        let node = null;

        for (let i = 0; i < 3; i++) {
            let delayTime = cc.delayTime(0.25 * i);
            let callback = cc.callFunc(addEffectNode.bind(this), this);
            let seq = cc.sequence(delayTime, callback);
            this.runAction(seq);
        }
    }
});
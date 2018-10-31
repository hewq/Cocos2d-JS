let Bottle = TowerBase.extend({
    ctor: function (data) {
        this._super("#Bottle_3.png", data);
        // 0.5 秒开火一次
        this.schedule(this.onRotateAndFire, 0.5);
        return true;
    },
    loadWeapon: function () {
        let node = new cc.Sprite("#Bottle31.png");
        this.addChild(node);
        this.weapon = node;
        node.setPosition(this.width / 2, this.height / 2);
        node.setRotation(90);
    },
    onRotateAndFire: function () {
        let nearestEnemy = this.findNearestMonster();
        if (nearestEnemy != null) {
            this.weapon.stopAllActions();

            this.fireTargetPos = nearestEnemy.getPosition();
            let rotateVector = cc.pSub(nearestEnemy.getPosition(), this.getPosition());
            let rotateRadians = cc.pToAngle(rotateVector);
            // 弧度转为角度
            let rotateDegrees = cc.radiansToDegrees(-1 * rotateRadians);

            // speed 表示炮塔旋转的速度， 0.5 / M_PI 就是 1 / 2PI，它表示 1 秒钟旋转 1 个圆
            let speed = 0.5 / cc.PI;

            // rotateDuration 表示旋转特定的角度需要的时间，计算它用弧度乘以速度
            let rotateDuration = Math.abs(rotateRadians * speed);

            let move = cc.rotateTo(rotateDuration, rotateDegrees);
            let callBack = cc.callFunc(this.onFire, this);
            let action = cc.sequence(move, callBack);
            this.weapon.runAction(action);
        }
    },
    onFire: function () {
        let currBullet = this.createBullet();
        this.getParent().addChild(currBullet);
        GameManager.currBulletPool.push(currBullet);

        // 确保子弹会发射
        let shootVector = cc.pNormalize(cc.pSub(this.fireTargetPos, this.getPosition()));
        let normalizedShootVector = cc.pNeg(shootVector);

        let farthesDistance = 1.5 * cc.winSize.width;
        let overshotVector = cc.pMult(normalizedShootVector, farthesDistance);
        let offscreenPoint = cc.pSub(this.weapon.getPosition(), overshotVector);

        let move = cc.moveTo(this.bulletMoveTime, offscreenPoint);
        let callBack = cc.callFunc(this.removeBullet, currBullet);
        let action = cc.sequence(move, callBack);
        currBullet.runAction(action);
    },
    createBullet: function () {
        let node = new cc.Sprite("#PBottle31.png");
        node.setPosition(this.getPosition());
        node.setRotation(this.weapon.getRotation());
        return node;
    },
    removeBullet: function (sender) {
        let event = new cc.EventCustom(jf.EventName.GP_REMOVE_BULLET);
        event.setUserData({
            target: sender
        });
        cc.eventManager.dispatchEvent(event);
    }
});
let Bottle = TowerBase.extend({
    ctor: function (data) {
        this._super("#Bottle_3.png", data);
        // 0.5 秒开火一次
        this.schedule(this.onRotateAndFire, 0.5);
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
    }
});
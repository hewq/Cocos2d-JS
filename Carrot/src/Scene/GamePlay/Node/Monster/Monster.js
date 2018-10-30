let Monster = cc.Sprite.extend({
    road: [], // 移动路径
    data: {}, // 数据
    speed: 0, // 速度
    index: 0, // 索引
    blood: 0, // 血量
    roadIndex: 0, // 当前移动路径的前缀
    fileNamePrefix: "", // 帧前缀
    ctor: function (fileName, data, fileNamePrefix) {
        this._super(fileName);
        // 加载配置属性
        this.loadProperty(data, fileNamePrefix);
    },
    // 加载属性配置
    loadProperty: function (data, fileNamePrefix) {
        cc.assert(data.speed, "Monster.loadProperty(): 速度不能为空!");
        cc.assert(data.road, "Monster.loadProperty(): 移动路径不能为空！");
        cc.assert(data.index >= 0, "Monster.loadProperty(): 索引不能为空！");
        cc.assert(fileNamePrefix, "Monster.loadProperty(): 文件名前缀不能为空！");

        this.data = data;
        this.speed = data.speed;
        this.road = data.road;
        this.index = data.index;
        this.blood = data.blood;
        this.fileNamePrefix = fileNamePrefix;
    },
    run: function () {
        // 跑到下一个标记点上
        this.runNextRoad();
        this.playRunAnimation();
    },
    // 跑到下一个标记点上
    runNextRoad: function () {
        // 转方向
        if (this.road[this.roadIndex].x <= this.road[this.roadIndex + 1].x) {
            this.setFlippedX(false);
        } else {
            this.setFlippedX(true);
        }

        let distance = cc.pDistance(this.road[this.roadIndex], this.road[this.roadIndex + 1]);
        let time = distance / this.speed;
        let moveTo = cc.moveTo(time, this.road[this.roadIndex + 1]);
        let callback = cc.callFunc(function () {
            if (this.roadIndex < this.road.length - 1) {
                this.runNextRoad();
            } else {
                // 吃到萝卜事件抛出
                let event = new cc.EventCustom(jf.EventName.GP_MONSTER_EAT_CARROT);
                event.setUserData({
                    target: this
                });
                cc.eventManager.dispatchEvent(event);
            }
        }.bind(this));
        let seq = cc.sequence(moveTo, callback);
        this.runAction(seq);
        this.roadIndex++;
    },
    playRunAnimation: function () {
        let frames = [];
        for (let i = 1; i < 4; i++) {
            let str = this.fileNamePrefix + i + ".png"; // 注意：这里不需要加 # 号
            let frame = cc.spriteFrameCache.getSpriteFrame(str);
            frames.push(frame);
        }
        let animation = new cc.Animation(frames, 0.15);
        animation.setRestoreOriginalFrame(true); // 设置 是否恢复到第一帧

        let animate = cc.animate(animation);
        this.runAction(animate.repeatForever());
    },
    getRoad: function () {
        return this.road;
    },
    setRoad: function (road) {
        this.road = road;
    },
    getData: function () {
        return this.data;
    },
    getSpeed: function () {
        return this.speed;
    },
    setSpeed: function () {
        this.speed = speed;
    },
    getIndex: function () {
        return this.index;
    },
    setIndex: function () {
        this.index = index;
    }
});
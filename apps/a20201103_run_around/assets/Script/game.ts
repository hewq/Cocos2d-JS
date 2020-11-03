// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Graphics)
    bg: cc.Graphics = null;

    @property(cc.Graphics)
    circle: cc.Graphics = null;

    @property(cc.Graphics)
    highlightCircle: cc.Graphics = null;

    @property(cc.Sprite)
    ball: cc.Sprite = null;

    @property(cc.Label)
    percent: cc.Label = null;
    
    @property(cc.SceneAsset)
    game: cc.SceneAsset = null;

    @property
    jumps: number = 0;

    @property
    jumpForce: number = 0;

    @property
    jumpOffset: number = 0;

    @property
    gravity: number = 0.8;

    @property
    speed: number = 0.6;

    @property
    currentAngle: number = 0;

    @property
    previousAngle: number = 0;

    @property
    distanceFromCenter: number = 0;

    @property
    revolutions: number = 0;

    @property
    paintedRatio: number = 0;

    @property
    paintArcs: number[][] = [];

    @property
    restartLock: boolean = true;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let jumpForceList: number[] = [12, 8];

        // draw bg
        this.bg.rect(-this.node.width / 2, -this.node.height / 2, this.node.width, this.node.height);
        this.bg.fill();

        // draw circle
        this.circle.circle(0, 0, this.circle.node.width / 2);
        this.circle.stroke();

        // listener
        this.node.on('touchstart', function() {
            if (this.jumps < 2) {
                this.jumps++;
                this.jumpForce = jumpForceList[this.jumps - 1];
            }
        }, this);
    }

    update () {
        this.revolutions = (this.circle.node.width / 2) / (this.ball.node.width / 2);
        this.distanceFromCenter = (this.circle.node.width / 2) - (this.ball.node.width / 2) - 10 - this.jumpOffset;

        this.previousAngle = this.currentAngle;

        this.currentAngle += this.speed;

        let currentAngleRad: number = (this.currentAngle / 180 * Math.PI) % (Math.PI * 2);
        let previousAngleRad: number = (this.previousAngle / 180 * Math.PI) % (Math.PI * 2);

        this.ball.node.angle = this.currentAngle * this.revolutions;

        this.ball.node.x = this.distanceFromCenter * Math.cos(currentAngleRad);
        this.ball.node.y = this.distanceFromCenter * Math.sin(currentAngleRad);

        if (this.jumps > 0) {
            this.jumpOffset += this.jumpForce;

            this.jumpForce -= this.gravity;

            if (this.jumpOffset < 0) {
                this.jumpOffset = 0;
                this.jumps = 0;
                this.jumpForce = 0;
            }
        }

        if (this.jumpOffset === 0) {
            if (currentAngleRad >= previousAngleRad) {
                this.paintArcs.push([previousAngleRad, currentAngleRad]);
            } else {
                this.paintArcs.push([0, currentAngleRad]);
                this.paintArcs.push([previousAngleRad, Math.PI * 2]);
            }

            this.paintArcs = this.mergeIntervals(this.paintArcs);
            
            this.highlightCircle.clear();

            this.paintedRatio = 0;
            this.paintArcs.forEach((item) => {
                this.paintedRatio += (item[1] - item[0]);
                this.highlightCircle.arc(0, 0, this.circle.node.width / 2, item[0], item[1], true)
                this.highlightCircle.stroke();
            });
            this.paintedRatio = Math.round(this.paintedRatio / Math.PI * 180 / 360 * 100);
            this.percent.string = this.paintedRatio + '%';
            if (this.paintedRatio === 100 && this.restartLock) {
                this.restartLock = false;
                // 2 秒后重启
                setTimeout(() => {
                    this.restart();
                }, 2000);
            }
        }
    }
    restart(): void {
        this.paintArcs = [];
        this.previousAngle = 0;
        this.currentAngle = 0;
        this.restartLock = true;
    }
    mergeIntervals(intervals: number[][]): number[][] {
        if (intervals.length <= 1) {
            return intervals;
        }

        let stack: number[][] = [];
        let top: number[] = [];
        intervals = intervals.sort((a, b) => {
            return a[0] - b[0];
        });

        stack.push(intervals[0]);

        for (let i = 1; i < intervals.length; i++) {
            top = stack[stack.length - 1];
            if (top[1] < intervals[i][0]) {
                stack.push(intervals[i]);
            } else {
                if (top[1] < intervals[i][1]) {
                    top[1] = intervals[i][1];
                    stack.pop();
                    stack.push(top);
                }
            }
        }

        return stack;
    }
}

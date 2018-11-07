cc.Class({
    extends: cc.Component,

    properties: {
        retainSideNodes: {
            default: [],
            type: cc.Node
        }
    },

    switchSide: function () {
        this.node.scaleX = -this.node.scaleX;
        for (let i = 0; i < this.retainSideNodes.length; ++i) {
            let curNode = this.retainSideNodes[i];
            curNode.scaleX = -curNode.scaleX;
        }
    },
});

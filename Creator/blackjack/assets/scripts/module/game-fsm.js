let State = require('state.com');

let instance = null;
let model = null;
let playing = null;

function on (message) {
    return function (msgToEvaluate) {
        return msgToEvaluate === message;
    };
}

let evaluating = false;

exports = {
    init: function (target) {
        State.console = console;

        model = new State.StateMachine('root');
        let initial = new State.PseudoState('init-root', model, State.PseudoStateKind.initial);

        // 当前这一把的状态
        let bet = new State.State('下注', model);
        playing = new State.State('已开局', model);
        let settled = new State.State('结算', model);

        initial.to(bet);
        bet.to(playing).when(on('deal'));
        playing.to(settled).when(on('end'));
        settled.to(bet).when(on('bet'));

        bet.entry(function () {
            target.onBetState(true);
        });

        bet.exit(function () {
            target.onBetState(false);
        });

        settled.entry(function () {
            target.onEndState(true);
        });

        settled.exit(function () {
            target.onEndState(false);
        });

        // 开局后的子状态
        let initialP = new State.PseudoState('init 已开局', playing, State.PseudoStateKind.initial);
        let deal = new State.State('发牌', playing);
        let playersTurn = new State.State('玩家决策', playing);
        let dealersTurn = new State.State('庄家决策', playing);

        initialP.to(deal);
        deal.to(playersTurn).when(on('dealed'));
        playersTurn.to(dealersTurn).when(on('player acted'));

        deal.entry(function () {
            target.onEnterDealState();
        });

        playersTurn.entry(function () {
            target.onPlayersTurnState(true);
        });

        playersTurn.exit(function () {
            target.onPlayersTurnState(false);
        });

        dealersTurn.entry(function () {
            target.onEnterDealersTurnState();
        });

        instance = new State.StateMachineInstance('fsm');
        State.initialise(model, instance);
    },

    toDeal: function () {
        this._evaluate('deal');
    },

    toBet: function () {
        this._evaluate('bet');
    },

    onDealed: function () {
        this._evaluate('dealed');
    },

    onPlayerActed: function () {
        this._evaluate('player acted');
    },

    onDealerActed: function () {
        this._evaluate('end');
    },

    _evaluate: function (message) {
        if (evaluating) {
            setTimeout(function () {
                State.evaluate(model, instance, message);
            }, 1);
            return;
        }
        evaluating = true;
        State.evaluate(model, instance, message);
        evaluating = false;
    },

    _getInstance: function () {
        return instance;
    },

    _getModel: function () {
        return model;
    }
};

module.exports = exports;
export function createStore() {
    let state;
    let listeners = [];
    const getState = () => state;
    //subscribe 每次调用，都会返回一个取消订阅的方法
    const subscribe = (ln) => {
        listeners.push(ln);
        //订阅之后，也要允许取消订阅。
        //难道我订了某本杂志之后，就不允许我退订吗？可怕~
        const unsubscribe = () => {
            listeners = listeners.filter(listener => ln !== listener);
        }
        return unsubscribe;
    };
    const dispatch = (action) => {
        //reducer(state, action) 返回一个新状态
        state = reducer(state, action);
        listeners.forEach(ln => ln());

    }
    //你要是有个 action 的 type 的值正好和 `@@redux/__INIT__${Math.random()}` 相等，我敬你是个狠人
    dispatch({ type: `@@redux/__INIT__${Math.random()}` });

    return {
        getState,
        dispatch,
        subscribe
    }
}


export function combineReducers(reducers) {
    return function combination(state = {}, action) {
        let nextState = {};
        let hasChanged = false; //状态是否改变
        for (let key in reducers) {
            const previousStateForKey = state[key];
            const nextStateForKey = reducers[key](previousStateForKey, action);
            nextState[key] = nextStateForKey;
            //只有所有的 nextStateForKey 均与 previousStateForKey 相等时，hasChanged 的值才是 false
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        }
        //state 没有改变时，返回原对象
        return hasChanged ? nextState : state;
    }
}
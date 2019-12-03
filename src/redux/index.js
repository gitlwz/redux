export function createStore(reducer) {
    let state;
    let listeners = [];
    const getState = () => state;
    const subscribe = (ln) => {
        listeners.push(ln);
        //订阅之后，也要允许取消订阅。不能只准订，不准退~
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




export function compose(...funcs) {
    //如果没有中间件
    if (funcs.length === 0) {
        return arg => arg
    }
    //中间件长度为1
    if (funcs.length === 1) {
        return funcs[0]
    }

    return funcs.reduce((prev, current) => (...args) => prev(current(...args)));
}

export const applyMiddleware = (...middlewares) => createStore => (...args) => {

    let store = createStore(...args);
    let dispatch;
    const middlewareAPI = {
        getState: store.getState,
        dispatch: (...args) => dispatch(...args)
    }
    let middles = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose(...middles)(store.dispatch);
    return {
        ...store,
        dispatch
    }
}
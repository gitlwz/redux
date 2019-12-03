import React from 'react'
import PropTypes from 'prop-types'

//provider

export class Provider extends React.Component {
    static childContextTypes = {
        store: PropTypes.object.isRequired
    }
    getChildContext() {
        return { store: this.store }
    }
    constructor(props, context) {
        super(props, context)
        this.store = props.store
    }
    render() {
        return this.props.children
    }
}



//connect

function bindActionCreator(actionCreator, dispatch) {
    return (...args) => dispatch(actionCreator(...args));
}
function bindActionCreators(actionCreator, dispatch) {
    //actionCreators 可以是一个普通函数或者是一个对象
    if (typeof actionCreator === 'function') {
        //如果是函数，返回一个函数，调用时，dispatch 这个函数的返回值
        bindActionCreator(actionCreator, dispatch);
    } else if (typeof actionCreator === 'object') {
        //如果是一个对象，那么对象的每一项都要都要返回 bindActionCreator
        const boundActionCreators = {}
        for (let key in actionCreator) {
            boundActionCreators[key] = bindActionCreator(actionCreator[key], dispatch);
        }
        return boundActionCreators;
    }
}

export const connect = (
    mapStateToProps = state => ({}),
    mapDispatchToProps = {}
) => (WrapComponent) => {
    return class ConnectComponent extends React.Component {
        static contextTypes = {
            store: PropTypes.object
        }
        constructor(props, context) {
            super(props, context)
            this.state = {
                props: {}
            }
        }
        // 2 实现了mapStateToProps
        componentDidMount() {
            const { store } = this.context
            this.unsub = store.subscribe(() => this.update())
            this.update()
        }
        update() {
            const { store } = this.context
            // store.getState()这就是为什么mapStateToProps函数里面能拿到state 
            const stateProps = mapStateToProps(store.getState(), this.props)
            // 方法不能直接给，因为需要dispatch
            /**
              function addGun() {
                return { type: ADD_GUN }
              }
              直接执行addGun() 毫无意义
              要 addGun = () => store.dispatch(addGun()) 才有意义，其实就是把actionCreator包了一层
              bindActionCreators在手写redux api实现了
             */
            const dispatchProps = bindActionCreators(mapDispatchToProps, store.dispatch)
            // 注意state的顺序问题会覆盖

            //这里应该对比一下 props 是否发生变化
            this.setState({
                props: {
                    ...this.state.props,
                    ...stateProps,
                    ...dispatchProps,
                }
            })
        }
        componentWillUnmount() {
            //取消订阅
            this.unsub();
        }
        // 1
        render() {
            return <WrapComponent {...this.state.props}></WrapComponent>
        }
    }
}
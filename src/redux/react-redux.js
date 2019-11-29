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

function bindActionCreator(creator, dispatch) {
    return (...args) => dispatch(creator(...args))
}

export function bindActionCreators(creators, dispatch) {
    let bound = {}
    Object.keys(creators).forEach(v => {
        let creator = creators[v]
        bound[v] = bindActionCreator(creator, dispatch)
    })
    return bound
}


export const connect = (
    mapStateToProps = state => state,
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
            store.subscribe(() => this.update())
            this.update()
        }
        update() {
            const { store } = this.context
            // store.getState()这就是为什么mapStateToProps函数里面能拿到state 
            const stateProps = mapStateToProps(store.getState())
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
            this.setState({
                props: {
                    ...this.state.props,
                    ...stateProps,
                    ...dispatchProps,
                }
            })
        }
        // 1
        render() {
            return <WrapComponent {...this.state.props}></WrapComponent>
        }
    }
}
import React, { Component, Fragment } from 'react';
import ReactDom from 'react-dom';
import { createStore, applyMiddleware } from "./redux/index"
import { Provider, connect } from "./redux/react-redux"
import { logger } from "./redux/logger"
import reduxThunk from "./redux/redux-thunk"
import reducer from "./reducers.js"
import { add, del, asyAdd } from "./action";


let createStoreWithMiddleware = applyMiddleware(reduxThunk, logger)(createStore)
let store = createStoreWithMiddleware(reducer)

class _Show extends Component {
    render() {
        return <div>
            number：{this.props.number}
        </div>
    }
}

let Show = connect(({ counter }) => {
    const { number } = counter;
    return {
        number
    }
})(_Show)

class _App extends Component {
    onADD = () => {
        this.props.add(1)
    }
    onDel = () => {
        this.props.del(1)
    }
    onasyAdd = () => {
        this.props.asyAdd(1)
    }
    render() {

        return <div className="todo-list">
            <button onClick={this.onADD}>ADD</button>
            <button onClick={this.onDel}>Del</button>
            <button onClick={this.onasyAdd}>asyAdd</button>
            <div>
                <Show />
            </div>
        </div>
    }
}
let App = connect((store) => {
    return {}
}, {
        add: add,
        del: del,
        asyAdd
    })(_App)

ReactDom.render(<Provider store={store}>
    < App />
</Provider>, document.querySelector('#root'));
import React, { Component, Fragment } from 'react';
import ReactDom from 'react-dom';

class App extends Component {

    render() {

        return <div className="todo-list">
            <button onClick={this.onClick}>修改</button>
            123
        </div>
    }
}
ReactDom.render(< App store={store} />, document.querySelector('#root'));
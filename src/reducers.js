import { INCRENENT, DECREMENT, CHANGE_COLOR } from './action-types.js';
import { combineReducers } from "./redux/index.js"
export function counter(state = { number: 0 }, action) {
    switch (action.type) {
        case INCRENENT:
            return {
                ...state,
                number: state.number + action.number
            }
        case DECREMENT:
            return {
                ...state,
                number: state.number - action.number
            }
        default:
            return state;
    }
}




export function theme(state = { color: 'blue' }, action) {
    switch (action.type) {
        case CHANGE_COLOR:
            return {
                ...state,
                color: action.color
            }
        default:
            return state;
    }
}


export default combineReducers({
    counter,
    theme
})
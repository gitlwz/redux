import { INCRENENT, DECREMENT } from "./action-types"

export function add(number) {
    return {
        type: INCRENENT,
        number
    }
}

export function del(number) {
    return {
        type: DECREMENT,
        number
    }
}

export function asyAdd(number) {
    return (dispatch) => {
        setTimeout(() => {
            dispatch(add(number))
        }, 1000)
    }
}

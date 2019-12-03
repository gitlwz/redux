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

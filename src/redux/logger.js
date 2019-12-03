export const logger = store => next => action => {
    if (typeof action !== 'function') {
        console.log('dispatching', action)
    }
    let result = next(action)
    console.log('next state', store.getState())
    return result
}
export const postBoxStateAcTypes = {
    SET: 'SETPOSTBOXSTATE',
}


export const setPostBoxState = (payload) => {
    return {
        type: postBoxStateAcTypes.SET,
        payload
    }
}
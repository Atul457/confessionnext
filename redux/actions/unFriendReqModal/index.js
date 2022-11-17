export const unFriendActionTypes = {
    UPDATE: 'UPDATECANCELREQUESTMODELSTATE'
}

const updateUnFriendModalState = (payload) => {
    return {
        type: unFriendActionTypes.UPDATE,
        payload
    }
}

export const unFriendActionCreators = {
    updateUnFriendModalState
}
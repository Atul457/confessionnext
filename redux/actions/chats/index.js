export const getChatChit = (data) => {
    return dispatch => {
        dispatch({
            type: 'update',
            data: data
        })
    }
}


export const toggleChat = (payload) => {
    return {
        type: "TOGGLE_CHAT_F",
        payload
    }
}
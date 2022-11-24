const initialState = {
    data: [],
    total: 1,
    params: {},
    allData: [],
    chatVisible: false
}

const ChatTable = (state = initialState, action) => {
    switch (action.type) {
        case 'update':
            return {
                ...state,
                data: action.data,
            }
        case 'TOGGLE_CHAT_F':
            return {
                ...state,
                chatVisible: action.payload.chatVisible,
            }
        default:
            return state
    }
}

export default ChatTable;
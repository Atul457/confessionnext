// ** Initial State
// const initialState = {
//     data: [],
//     total: 1,
//     params: {},
//     allData: []
// }

// const ChatTable = (state = initialState, action) => {
//     switch (action.type) {
//         case 'GET_DATA':
//             return {
//                 ...state,
//                 allData: action.allData,
//                 data: action.data,
//                 total: action.totalPages,
//             }
//         default:
//             return state
//     }
// }

// export default ChatTable;
const initialState = {
    data: [],
    total: 1,
    params: {},
    allData: []
}

const ChatTable = (state = initialState, action) => {
    switch (action.type) {
        case 'update':
            return {
                ...state,
                data: action.data,
            }
        default:
            return state
    }
}

export default ChatTable;
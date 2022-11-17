
const GetFriend = (state = [], action) => {
    switch (action.type) {
        case 'FRIEND':
            return [action.friendDetails]

        default:
            return state
    }
}

export default GetFriend
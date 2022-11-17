const initialState = {
    user: null
}
const Comments = (state = initialState, action) => {
    switch (action.type) {
        case "COMMENTS": return { comments: action.data }

        default: return state
    }
}
export default Comments
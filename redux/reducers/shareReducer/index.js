const initialState = {
    selectedPost: null,
    menuShow: false,
    sharekitShow: false,
    isPost: false
}

const ShareReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLEMENU':
            return {
                ...state,
                selectedPost: action.postid,
                menuShow: action.menuShow,
                isPost : action.isPost
            }
        case 'TOGGLESHAREKIT':
            return {
                ...state,
                sharekitShow: action.sharekitShow
            }
        default:
            return state
    }
}

export default ShareReducer
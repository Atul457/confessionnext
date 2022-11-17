export const togglemenu = (id, value, post = false) => {
        return dispatch => {
            dispatch({
                type: 'TOGGLEMENU',
                postid: id,
                menuShow : value,
                isPost : post
            })
        }
}

export const toggleSharekitMenu = (value, isPost = false) => {
    return dispatch => {
        dispatch({
            type: 'TOGGLESHAREKIT',
            sharekitShow : value,
            isPost: isPost
        })
    }
}
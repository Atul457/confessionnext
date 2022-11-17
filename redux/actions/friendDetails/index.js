export const Friend = (friendDetails) => {
    return dispatch => {
        dispatch({
            type: 'FRIEND',
            friendDetails
        })
    };
}

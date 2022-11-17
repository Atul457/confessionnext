export const confessionsAction = (confessionArr) => {
    return dispatch => {
        dispatch({
            type: 'CONFESSION',
            confessionArr
        })
    };
}

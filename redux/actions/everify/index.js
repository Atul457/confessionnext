export const EVerifyModal = (eVerifyState) => {
    return dispatch => {
        dispatch({
            type: 'EVERIFY',
            eVerifyState
        })
    };
}

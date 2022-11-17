export const terms = (terms) => {
    return dispatch => {
        dispatch({
            type: 'TERMS',
            terms
        })
    };
}




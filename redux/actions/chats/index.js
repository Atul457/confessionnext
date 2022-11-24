export const getChatChit = (data) => {

    return dispatch => {
                dispatch({
                    type: 'update',
                    data: data
                })
            }
    }

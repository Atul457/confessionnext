import { commentsModActions } from "../../actions/commentsModal";


const initialState = {
    visible: false,
    state: null,
    commentField: {
        comment_id: null
    },
    updateField: {
        comment_id: null,
    }
}


const commentsModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case commentsModActions.OPENMODAL:
            return {
                ...state,
                visible: true,
                state: action.payload
            }

        case commentsModActions.CLOSEMODAL:
            return {
                ...state,
                visible: false,
            }


        case commentsModActions.REOPEN:
            return {
                ...state,
                visible: true,
            }

        case commentsModActions.UPDATEMODAL:
            return {
                ...state,
                state: {
                    ...state.state,
                    isNotFriend: action.payload
                }
            }

        case commentsModActions.UPDATMODALSTATE:
            return {
                ...state,
                state: {
                    ...state.state,
                    ...action.payload
                }
            }

        case commentsModActions.SETCOMMENTFIELD:
            return {
                ...state,
                commentField: {
                    comment_id: action.payload
                }
            }

        case commentsModActions.MUTATEUPDATEBOX:
            return {
                ...state,
                updateField: {
                    ...state.updateField,
                    ...action.payload
                }
            }

        case commentsModActions.RESET:
            return initialState

        default:
            return state;
    }
}

export default commentsModalReducer;
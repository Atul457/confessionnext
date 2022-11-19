import forgotUPassActions from "../../actions/forgotUPassword"

const statuses = {
    LOADING: "LOADING",
    ERROR: "ERROR",
    STOP: "STOP"
}

const initialState = {
    status: statuses.STOP,
    modal: {
        isOpen: false
    },
    message: ''
}


export const forgotUserPassReducer = (state = initialState, action) => {
    switch (action.type) {
        case forgotUPassActions.OPENMODAL:
            return {
                ...state,
                modal: {
                    isOpen: true
                }
            }

        case forgotUPassActions.CLOSEMODAL:
            return initialState

        case forgotUPassActions.CHANGESTATUS:
            return {
                ...state,
                status: action.payload,
                message: ''
            }

        case forgotUPassActions.UPDATEERROR:
            if (action.payload.isError) {
                return {
                    ...state,
                    message: action.payload.message,
                    status: statuses.ERROR
                }
            } else {
                return {
                    ...state,
                    message: action.payload.message,
                    status: statuses.STOP
                }
            }
        default: return state
    }
}


export default statuses;

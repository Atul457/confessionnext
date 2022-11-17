import UpdateUPassActions from "../../actions/updateUserPassword";


const statuses = {
    LOADING: "LOADING",
    ERROR: "ERROR",
    STOP: "STOP",
    SUCCESS : "SUCCESS",
    PASSWORDCHANGED: "PASSWORDCHANGED"
}

const initialState = {
    status: statuses.STOP,
    bodyStatus: statuses.STOP,
    modal: {
        isOpen: false
    },
    message: '',
}


export const updateUserPassReducer = (state = initialState, action) => {
    switch (action.type) {
        case UpdateUPassActions.OPENMODAL:
            return {
                ...state,
                modal: {
                    isOpen: true
                }
            }

        case UpdateUPassActions.CLOSEMODAL:
            return initialState

        case UpdateUPassActions.CHANGESTATUS:
            return {
                ...state,
                status: action.payload,
                message: ''
            }

        case UpdateUPassActions.UPDATEERROR:
            return {
                ...state,
                message: action.payload,
                status: statuses.STOP
            }

        // Used in reset password
        case UpdateUPassActions.HIDEFIELDS:
            return {
                ...state,
                hideFields: true,
                message : action.payload,
                status : statuses.STOP,
                bodyStatus : statuses.STOP
            }

        // Used in reset password
        case UpdateUPassActions.UPDATEBODYSTATUS:
            return {
                ...state,
                bodyStatus: action.payload,
            }

        // Used in reset password
        case UpdateUPassActions.STATUSNMESSAGE:
            return {
                ...state,
                status: action.payload.status,
                message: action.payload.message,
            }

        // Used in reset password
        case UpdateUPassActions.UPDATEBODYSTATUS:
            return {
                ...state,
                bodyStatus: action.payload,
            }

        default: return state
    }
}


export default statuses;

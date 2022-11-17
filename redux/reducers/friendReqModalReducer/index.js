import { friendReqActions } from "../../actions/friendReqModal"


const initialState = {
    visible: false,
    data: null,
    visible: false,
    loading: false,
    requested: false,
    cancelled: false
}


const friendReqModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case friendReqActions.OPENMODAL:
            return {
                ...state,
                visible: true,
                data: action.payload
            }

        case friendReqActions.CLOSEMODAL:
            return {
                ...state,
                visible: false,
                ...action.payload
            }

        case friendReqActions.CHANGECANCELLED:
            return {
                ...state,
                cancelled: true,
                loading: false,
                requested: false
            }


        case friendReqActions.CHANGEREQUESTED:
            return {
                ...state,
                requested: true,
                loading: false,
                cancelled: false
            }


        case friendReqActions.TOGGLELOADINGFN:
            return {
                ...state,
                loading: !state.loading
            }

        case friendReqActions.RESET:
            return initialState

        default:
            return state;
    }
}

export default friendReqModalReducer;
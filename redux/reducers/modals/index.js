import { apiStatus } from "../../../utils/api";
import { modalActions } from "../../actions/modals/ModalsAc";

const initialState = {
    nfsw_modal: {
        isVisible: false,
        forumLink: null,
        status: apiStatus.IDLE
    }
}


const modalsReducer = (state = initialState, action) => {
    switch (action.type) {
        case modalActions.NFSW_MODAL: {
            return ({ ...state, nfsw_modal: { ...state?.nfsw_modal, ...action.payload } })
        }
        default: return state;
    }
}


export default modalsReducer;
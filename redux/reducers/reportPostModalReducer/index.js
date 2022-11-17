import { apiStatus } from "../../../utils/api";
import { reportPostActions } from "../../actions/reportPostModal";


// INITIAL STATE
const initialState = {
    visible: false,
    staus: apiStatus.IDLE,
    message: "",
    data: {
        confessionId: null,
        index: null
    }
};

const reportPostModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case reportPostActions.TOGGLE_REPORT_POST_MODAL: return {
            ...state,
            ...action.payload
        };
        case reportPostActions.RESET_REPORT_POST_MODAL: return initialState
        default: return state;
    }
}

export default reportPostModalReducer;
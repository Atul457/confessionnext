import { apiStatus } from "../../../utils/api";
import { reportCommActions } from "../../actions/reportcommentModal";


// INITIAL STATE
const initialState = {
    isReported: 0,
    visible: false,
    staus: apiStatus.IDLE,
    message: "",
    data: {
        confessionId: null,
        commentId: null
    }
};

const reportComModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case reportCommActions.TOGGLE_REPORT_COM_MODAL: return {
            ...state,
            ...action.payload
        };
        case reportCommActions.RESET_REPORT_MODAL: return initialState
        default: return state;
    }
}

export default reportComModalReducer;
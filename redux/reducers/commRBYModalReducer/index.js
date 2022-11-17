import { commReportedByAc } from "../../actions/commReportedBy";


// INITIAL STATE
const initialState = {
    visible: false,
    data: {
        confession_id: null,
        comment_id: null
    }
};

const commRBYModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case commReportedByAc.TOGGLE_COMMREPORTED_MODAL: return {
            ...state,
            ...action.payload
        };
        case commReportedByAc.RESET_COMMREPORTED_MODAL: return initialState
        default: return state;
    }
}

export default commRBYModalReducer;
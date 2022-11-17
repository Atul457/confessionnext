import { postReportedByAc } from "../../actions/postReportedBy";


// INITIAL STATE
const initialState = {
    visible: false,
    data: {
        confession_id: null
    }
};

const postRBYModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case postReportedByAc.TOGGLE_POST_REPORTED_MODAL: return {
            ...state,
            ...action.payload
        };
        case postReportedByAc.RESET_POST_REPORTED_MODAL: return initialState
        default: return state;
    }
}

export default postRBYModalReducer;
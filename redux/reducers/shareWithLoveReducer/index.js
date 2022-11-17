import { apiStatus } from "../../../utils/api";
import { shareWithLoveActions } from "../../actions/shareWithLoveAc/shareWithLoveAc";


// INITIAL STATE
const initialState = {
    visible: false,
    status: apiStatus.IDLE,
    message: "",
    data: {},
    appreciationModal: {
        visible: false
    }
};

const shareWithLoveReducer = (state = initialState, action) => {
    switch (action.type) {
        case shareWithLoveActions.TOGGLE_SHARE_WITH_LOVE_MODAL: return {
            ...state,
            ...action.payload
        };
        case shareWithLoveActions.TOGGLE_APPRECIATION_MODAL: return {
            ...state,
            ...action.payload
        }
        case shareWithLoveActions.RESET_SHARE_WITH_LOVE_MODAL: return initialState
        default: return state;
    }
}

export default shareWithLoveReducer;
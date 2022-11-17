import { avatarModalActions } from "../../actions/avatarSelModalAC";


// INITIAL STATE
const initialState = {
    selected: null,
    visible: false,
    avatarLink: "",
    defaultImg: "",
    type: 1
};

const avatarModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case avatarModalActions.TOGGLE_AVATAR_MODAL: return {
            ...state,
            ...action.payload
        };
        case avatarModalActions.RESET_AVATAR_MODAL: return initialState
        default: return state;
    }
}

export default avatarModalReducer;
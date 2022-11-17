import { avatarIntroModalActions } from "../../actions/avatarsIntroModalAc/avatarsIntroModalAc";


// INITIAL STATE
const initialState = {
    visible: false,
    isShown: false
};

const avatarsIntroModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case avatarIntroModalActions.TOGGLE_AVATAR_INTRO_MODAL: return {
            ...state,
            ...action.payload
        };
        case avatarIntroModalActions.RESET_AVATAR_INTRO_MODAL: return initialState
        default: return state;
    }
}

export default avatarsIntroModalReducer;
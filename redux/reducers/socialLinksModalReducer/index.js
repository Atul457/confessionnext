import { socialLinksModalActions } from "../../actions/socialLinksModal";


const initialState = {
    visible: false
}

const socialLinksModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case socialLinksModalActions.OPENMODAL:
            return { visible: true };
        case socialLinksModalActions.CLOSEMODAL:
            return { visible: false };
        default:
            return initialState;
    }
}

export default socialLinksModalReducer;
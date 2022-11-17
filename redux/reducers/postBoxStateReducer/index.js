import { postBoxStateAcTypes } from "../../actions/postBoxState";


// INITIAL STATE
const initialState = {
    feed: { selectedCat: '', description: '' },
    create: { selectedCat: '', description: '' }
};

const postBoxStateReducer = (state = initialState, action) => {
    switch (action.type) {
        case postBoxStateAcTypes.SET: return { ...state, ...action.payload };
        default: return state;
    }
}

export default postBoxStateReducer;
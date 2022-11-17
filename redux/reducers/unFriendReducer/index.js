import { unFriendActionTypes } from "../../actions/unFriendReqModal";


const initialState = {
    data: {},
    visible: false,
    confirmUnfriend: false
}


export const unFriendReducer = (state = initialState, action) => {
    switch (action.type) {
        case unFriendActionTypes.UPDATE: return {
            ...state, ...action.payload
        }
        default: return state;
    }
}
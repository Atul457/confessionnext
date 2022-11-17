import { notiActionTypes } from "../../actions/notificationAC";


const initialState = {
    data: [],
    isVisible: false,
    newNotifications: false,
    messagesCount: 0
}


const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case notiActionTypes.OPENPOPUP: return { ...state, isVisible: true }
        case notiActionTypes.CLOSEPOPUP: return { ...state, isVisible: false }
        case notiActionTypes.UPDATEPOPUP: return { ...state, ...action.payload }
        case notiActionTypes.MESSAGESCOUNT: return { ...state, messagesCount: action.payload }
        default: return state;
    }
}


export default notificationReducer;
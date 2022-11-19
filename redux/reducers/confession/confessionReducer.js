// Third party imports
import produce, { current } from "immer";

// Utils
import { apiStatus } from "../../../utils/api";
import { confAcs } from "../../actions/confession/confessionAc";


const initialstate = {
    confessions: {
        status: apiStatus.LOADING,
        data: [],
        message: "",
        actionBox: {},
        page: 1,
        hasMore: true,
        activeTab: 0,
        count: 0
    },
    postComment: {
        status: apiStatus.IDLE,
        message: "",
        lightBox: {
            visible: false,
            data: []
        }
    }
}

const confessionReducer = (state = initialstate, action) => {

    switch (action.type) {

        // Handle confessions
        case confAcs.SET_CONFESSIONS: return produce(state, draft => {
            // Works in case of append
            if (action.payload?.append === true && action?.payload?.data)
                action.payload.data = [...draft.confessions?.data, ...action.payload?.data]

            // Reset
            if (action.payload?.reset === true) {
                draft.confessions = {
                    status: apiStatus.LOADING,
                    data: [],
                    message: "",
                    actionBox: {},
                    page: 1,
                    hasMore: true,
                    activeTab: 0,
                    count: 0
                }
            }

            draft.confessions = {
                ...draft.confessions,
                ...action.payload
            }
        });

        // Update a single confession
        case confAcs.UPDATE_CONFESSION: return produce(state, draft => {
            draft.confessions.data[action.payload.index] = {
                ...draft.confessions.data[action.payload.index],
                ...action.payload.data
            }
        });

        default: return state;
    }

}

export { confessionReducer }
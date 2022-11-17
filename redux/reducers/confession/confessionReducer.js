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
    }
}

const confessionReducer = (state = initialstate, action) => {

    switch (action.type) {
        case confAcs.SET_CONFESSIONS: return produce(state, draft => {
            draft.confessions = {
                ...draft.confessions,
                ...action.payload
            }
        });

        default: return state;
    }

}

export { confessionReducer }
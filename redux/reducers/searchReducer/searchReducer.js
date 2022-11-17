import { apiStatus } from "../../../utils/api";
import { searchAcs } from "../../actions/searchAc/searchAc";

const initialState = {
    status: apiStatus.IDLE,
    message: "",
    data: [],
    type: 0,
    page: 1,
    visible: false,
    hasMore: true,
    searchStr: "",
    searchedWith: "",
    activeCategory: "all"
}


const SearchReducer = (state = initialState, action) => {
    switch (action.type) {
        case searchAcs.SEARCH_ALL: return {
            ...state,
            ...action.payload
        };

        case searchAcs.MUTATE_SEARCH_DATA: return {
            ...state,
            data: state?.data?.splice(action?.payload?.forum_index, 1, {
                ...state?.data[action?.payload?.forum_index],
                ...action?.payload
            }),
        };

        default:
            return state
    }
}

export default SearchReducer;
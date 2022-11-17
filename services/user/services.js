import auth from "../../utils/auth";
import { apiStatus, getMessageToShow, resHandler } from "../../utils/api";
import { forumHandlers } from "../../redux/actions/forumsAc/forumsAc";
import { http } from "../../utils/http";
import { setConfessions } from "../../redux/actions/confession/confessionAc";

// Vars
const {
    isAdminLoggedIn,
    getKeyProfileLoc,
    isUserLoggedIn
} = auth
const loggedIn = isAdminLoggedIn ?? isUserLoggedIn;

// Functions

// Get category service
const getCategoriesService = async ({ dispatch = () => { } }) => {

    var token = "";
    if (loggedIn) token = getKeyProfileLoc("token", true, true) ?? (getKeyProfileLoc("token", true, false))

    dispatch(forumHandlers.handleForumCatsAcFn({ status: apiStatus.LOADING }))

    let obj = {
        data: {},
        token: token,
        method: isAdminLoggedIn ? "post" : "get",
        url: isAdminLoggedIn ? "admin/getcategories" : "getcategories"
    }

    try {

        let res = await http(obj)
        res = resHandler(res)
        dispatch(forumHandlers.handleForumCatsAcFn({
            data: res?.categories,
            status: apiStatus.IDLE
        }))

    } catch (err) {
        dispatch(forumHandlers.handleForumCatsAcFn({ status: apiStatus.REJECTED }))
    }

}

// Get confession service
const getConfessionsService = async ({
    act = "all",
    page = 1,
    append = false,
    dispatch
}) => {

    // Vars
    var token = getKeyProfileLoc("token", true) ?? "";

    dispatch(setConfessions({ status: apiStatus.LOADING, message: "" }))

    let obj = {
        data: {},
        token: token,
        method: "get",
        url: `getconfessions/${act}/${page}`
    }

    try {
        let res = await http(obj)
        res = resHandler(res)
        const confessions = res.confessions ?? []
        dispatch(setConfessions({
            status: apiStatus.FULFILLED,
            data: confessions,
            count: res?.count,
            page,
            hasMore: confessions.length
        }))

    } catch (err) {
        //SERVER ERROR
        dispatch(setConfessions({ status: apiStatus.REJECTED, message: getMessageToShow(err?.message) }))
    }
}


export { getCategoriesService, getConfessionsService }
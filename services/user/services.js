import auth from "../../utils/auth";
import { apiStatus, getMessageToShow, resHandler } from "../../utils/api";
import { forumHandlers } from "../../redux/actions/forumsAc/forumsAc";
import { http } from "../../utils/http";
import { setConfessions, updateConfession } from "../../redux/actions/confession/confessionAc";

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
            hasMore: confessions.length,
            append
        }))

    } catch (err) {
        console.log({ err })
        //Server error
        dispatch(setConfessions({ status: apiStatus.REJECTED, message: getMessageToShow(err?.message) }))
    }
}


const likeDislikeService = async ({
    isLiked,
    post,
    dispatch
}) => {

    let is_liked, ip_address, check_ip, token = '', data;
    is_liked = isLiked ? 1 : 2;
    ip_address = localStorage.getItem("ip")
    check_ip = ip_address.split(".").length
    if (isUserLoggedIn) {
        token = localStorage.getItem("userDetails");
        token = JSON.parse(token).token;
    }

    if (check_ip === 4) {
        let obj = {
            data: { is_liked, ip_address },
            token: token,
            method: "post",
            url: `likedislike/${post.confession_id}`
        }
        try {
            data = {
                like: isLiked ? post.like + 1 : post.like - 1,
                is_liked: isLiked ? 1 : 2
            }

            dispatch(updateConfession({ index: post?.index, data }))
            await http(obj)

        } catch (error) {
            console.log(error);
            console.log("Some error occured");
        }
    } else {
        console.log("Invalid ip");
    }
}


export { getCategoriesService, getConfessionsService, likeDislikeService }
import auth from "./auth"

const { getKeyProfileLoc, checkAuth } = auth

// Returns profile visit link
const profileLinkToVisit = (obj) => {
    var isMyProfile = getKeyProfileLoc("user_id") === obj?.user_id
    if (!obj?.userslug) return "#"
    var linkToOtherProfile = `/userprofile/${obj?.userslug}`
    return `${(checkAuth() && isMyProfile) ? "/profile" : linkToOtherProfile}`
}

export { profileLinkToVisit }
// Returns profile visit link
const profileLinkToVisit = (obj) => {
    var isMyProfile = getKeyProfileLoc("user_id") === obj?.user_id
    if (!obj?.userslug) return "#"
    var linkToOtherProfile = `/userProfile/${obj?.userslug}`
    return `${(auth() && isMyProfile) ? "/profile" : linkToOtherProfile}`
}

export { profileLinkToVisit }
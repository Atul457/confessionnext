const confAcs = {
    "SET_CONFESSIONS": "SET_CONFESSIONS_F",
    "HANDLE_LIGHTBOX": "HANDLE_LIGHTBOX_FEED",
    "UPDATE_CONFESSION": "UPDATE_CONFESSION_F",
}

const setConfessions = payload => {
    return {
        type: confAcs.SET_CONFESSIONS,
        payload
    }
}

const postComment = payload => {
    return {

    }
}

const handleLightBox = payload => {
    return {
        type: confAcs.HANDLE_LIGHTBOX,
        payload
    }
}

const updateConfession = payload => {
    return {
        type: confAcs.UPDATE_CONFESSION,
        payload
    }
}

export {
    setConfessions,
    confAcs,
    postComment,
    handleLightBox,
    updateConfession
}
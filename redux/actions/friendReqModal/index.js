export const friendReqActions = {
    OPENMODAL: "OPEN_FRIEND_REQ_MODAL",
    CLOSEMODAL: "CLOSE_FRIEND_REQ_MODAL",
    RESETMODAL: "RESET_FRIEND_REQ_MODAL",
    CHANGECANCELLED: "CHANGECANCELLED",
    CHANGEREQUESTED: "CHANGEREQUESTED",
    TOGGLELOADINGFN: "TOGGLELOADINGFN"
}

export const openCFRModal = payload => {
    return {
        type: friendReqActions.OPENMODAL,
        payload
    }
}


export const closeFRModal = payload => {
    return {
        type: friendReqActions.CLOSEMODAL,
        payload
    }
}

export const resetFRModal = () => {
    return {
        type: friendReqActions.RESET,
    }
}

export const changeCancelled = () => {
    return {
        type: friendReqActions.CHANGECANCELLED
    }
}

export const changeRequested = () => {
    return {
        type: friendReqActions.CHANGEREQUESTED
    }
}

export const toggleLoadingFn = () => {
    return {
        type: friendReqActions.TOGGLELOADINGFN
    }
}


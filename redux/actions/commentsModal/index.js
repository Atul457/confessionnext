export const commentsModActions = {
    OPENMODAL: "OPENCOMMENTSGOTMODAL",
    CLOSEMODAL: "CLOSECOMMENTSGOTMODAL",
    RESET: "RESETCOMMENTSGOTMODAL",
    REOPEN: "REOPENCOMMENTSGOTMODAL",
    UPDATEMODAL: "UPDATECOMMENTSMODAL",
    UPDATMODALSTATE: "UPDATECOMMENTSMODALSTATE",
    SETCOMMENTFIELD: "SETCOMMENTFIELD",
    MUTATEUPDATEBOX: "SHOWORHIDEUPDATETEXTAREA"
}


export const openCModal = payload => {
    return {
        type: commentsModActions.OPENMODAL,
        payload
    }
}


export const closeCModal = () => {
    return {
        type: commentsModActions.CLOSEMODAL,
    }
}

export const reOpenCModal = () => {
    return {
        type: commentsModActions.REOPEN,
    }
}

export const resetCModal = () => {
    return {
        type: commentsModActions.RESET,
    }
}

export const setCommentField = payload => {
    return {
        type: commentsModActions.SETCOMMENTFIELD,
        payload: payload.id
    }
}

export const updateCModal = (payload) => {
    return {
        type: commentsModActions.UPDATEMODAL,
        payload
    }
}

export const updateCModalState = (payload) => {
    return {
        type: commentsModActions.UPDATMODALSTATE,
        payload
    }
}

export const setUpdateFieldCModal = payload => {
    return {
        type: commentsModActions.MUTATEUPDATEBOX,
        payload: payload
    }
}
// Actions
const shareWithLoveActions = {
    TOGGLE_SHARE_WITH_LOVE_MODAL: "TOGGLE_SHARE_WITH_LOVE_MODAL",
    RESET_SHARE_WITH_LOVE_MODAL: "RESET_SHARE_WITH_LOVE_MODAL",
    TOGGLE_APPRECIATION_MODAL: "TOGGLE_APPRECIATION_MODAL"
}

// Actions creators
const toggleShareWithLoveModal = payload => {
    return {
        type: shareWithLoveActions.TOGGLE_SHARE_WITH_LOVE_MODAL,
        payload
    }
}

const resetShareWithLoveModal = () => {
    return {
        type: shareWithLoveActions.RESET_SHARE_WITH_LOVE_MODAL
    }
}

const toggleAppreciationModal = payload => {
    return {
        type: shareWithLoveActions.TOGGLE_APPRECIATION_MODAL,
        payload
    }
}

// Exports
export { toggleShareWithLoveModal, shareWithLoveActions, resetShareWithLoveModal, toggleAppreciationModal }

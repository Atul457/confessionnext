// Actions
const avatarModalActions = {
    TOGGLE_AVATAR_MODAL: "TOGGLE_AVATAR_MODAL",
    RESET_AVATAR_MODAL: "RESET_AVATAR_MODAL"
}

// Actions creators
const toggleAvatarModal = payload => {
    return {
        type: avatarModalActions.TOGGLE_AVATAR_MODAL,
        payload
    }
}
const resetAvatarModal = () => {
    return {
        type: avatarModalActions.RESET_AVATAR_MODAL
    }
}


// Exports
export { avatarModalActions, toggleAvatarModal, resetAvatarModal }

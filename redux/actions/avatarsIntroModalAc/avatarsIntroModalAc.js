// Actions
const avatarIntroModalActions = {
    TOGGLE_AVATAR_INTRO_MODAL: "TOGGLE_AVATAR_INTRO_MODAL",
    RESET_AVATAR_INTRO_MODAL: "RESET_AVATAR_INTRO_MODAL"
}

// Actions creators
const toggleAvatarIntroModal = payload => {
    return {
        type: avatarIntroModalActions.TOGGLE_AVATAR_INTRO_MODAL,
        payload
    }
}
const resetAvatarIntroModal = () => {
    return {
        type: avatarIntroModalActions.RESET_AVATAR_INTRO_MODAL
    }
}


// Exports
export { avatarIntroModalActions, toggleAvatarIntroModal, resetAvatarIntroModal }

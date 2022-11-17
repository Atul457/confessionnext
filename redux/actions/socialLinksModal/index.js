export const socialLinksModalActions = {
    OPENMODAL: "SOCIALLINKSMODALOPEN",
    CLOSEMODAL: "SOCIALLINKSMODALCLOSE",
}

const openSLinksModal = () => {
    return {
        type: socialLinksModalActions.OPENMODAL,
    }
}

const closeSLinksModl = () => {
    return {
        type: socialLinksModalActions.CLOSEMODAL,
    }
}

const openSLinksModalActionCreators = {
    openModal: openSLinksModal,
    closeModal: closeSLinksModl,
}

export default openSLinksModalActionCreators;
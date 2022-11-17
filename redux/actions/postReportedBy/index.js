// Actions
const postReportedByAc = {
    TOGGLE_POST_REPORTED_MODAL: "TOGGLE_POST_REPORTED_MODAL",
    RESET_POST_REPORTED_MODAL: "RESET_POST_REPORTED_MODAL"
}

// Actions creators
const togglePRBModal = payload => {
    return {
        type: postReportedByAc.TOGGLE_POST_REPORTED_MODAL,
        payload
    }
}
const resetPRBModal = () => {
    return {
        type: postReportedByAc.RESET_POST_REPORTED_MODAL
    }
}


// Exports
export { postReportedByAc, togglePRBModal, resetPRBModal }

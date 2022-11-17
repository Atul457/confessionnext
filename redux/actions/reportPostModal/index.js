// Actions
const reportPostActions = {
    TOGGLE_REPORT_POST_MODAL: "TOGGLE_REPORT_POST_MODAL",
    RESET_REPORT_POST_MODAL: "RESET_REPORT_POST_MODAL"
}

// Actions creators
const toggleReportPostModal = payload => {
    return {
        type: reportPostActions.TOGGLE_REPORT_POST_MODAL,
        payload
    }
}
const resetReportPostModal = () => {
    return {
        type: reportPostActions.RESET_REPORT_POST_MODAL
    }
}


// Exports
export { toggleReportPostModal, reportPostActions, resetReportPostModal }

// Actions
const reportCommActions = {
    TOGGLE_REPORT_COM_MODAL: "TOGGLE_REPORT_COM_MODAL",
    RESET_REPORT_MODAL: "RESET_COMM_REPORT_MODAL"
}

// Actions creators
const toggleReportComModal = payload => {
    return {
        type: reportCommActions.TOGGLE_REPORT_COM_MODAL,
        payload
    }
}
const resetReportModal = () => {
    return {
        type: reportCommActions.RESET_REPORT_MODAL
    }
}


// Exports
export { toggleReportComModal, reportCommActions, resetReportModal }

// Actions
const commReportedByAc = {
    TOGGLE_COMMREPORTED_MODAL: "TOGGLE_COMMREPORTED_MODAL",
    RESET_COMMREPORTED_MODAL: "RESET_COMMREPORTED_MODAL"
}

// Actions creators
const toggleCRBModal = payload => {
    return {
        type: commReportedByAc.TOGGLE_COMMREPORTED_MODAL,
        payload
    }
}
const resetCRBModal = () => {
    return {
        type: commReportedByAc.RESET_COMMREPORTED_MODAL
    }
}


// Exports
export { commReportedByAc, toggleCRBModal, resetCRBModal }

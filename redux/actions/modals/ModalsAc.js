// Actions
const modalActions = {
    "NFSW_MODAL": "NFSW_MODAL"
}

// Actions creators
const toggleNfswModal = payload => {
    return {
        type: modalActions.NFSW_MODAL,
        payload
    }
}


// Exports
export { toggleNfswModal, modalActions }

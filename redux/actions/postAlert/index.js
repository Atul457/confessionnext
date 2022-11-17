export const postAlertActions = {
    OPENMODAL: "OPENPOSTALERTMODAL",
    CLOSEMODAL: "CLOSEPOSTALERTMODAL",
    UPDATEMODAL : "UPDATEPSOTALERTMODAL",
    UPDATEMODAL_FROM_SWLP: "UPDATEMODAL_FROM_SWLP"
}

const openPAlertModal = () => {
    return {
        type: postAlertActions.OPENMODAL,
    }
}

const updatePAlertModal = (newState) => {
    return {
        type: postAlertActions.UPDATEMODAL,
        payload: newState
    }
}

const closePAlertModal = () => {
    return {
        type: postAlertActions.CLOSEMODAL
    }
}

const updateFromSWLP  = payload => {
    return {
        type: postAlertActions.UPDATEMODAL_FROM_SWLP,
        payload
    }
}

const postAlertActionCreators = {
    openModal: openPAlertModal,
    closeModal: closePAlertModal,
    updateModal: updatePAlertModal,
    updateFromSWLP
}

export default postAlertActionCreators;
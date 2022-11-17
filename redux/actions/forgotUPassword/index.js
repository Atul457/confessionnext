import statuses from "../../reducers/updateUserPassReducer"


const forgotUPassActions = {
    OPENMODAL: 'OPENFORGOTMODAL',
    CLOSEMODAL: 'CLOSEFORGOTMODAL',
    CHANGESTATUS: 'CHANGEFORGOTSTATUS',
    UPDATEERROR: 'UPDATEFORGOTERROR'
}


const openChangePassModal = () => {
    return {
        type: forgotUPassActions.OPENMODAL
    }
}

const closeChangePassModal = () => {
    return {
        type: forgotUPassActions.CLOSEMODAL
    }
}

const changeStatusUPassModal = (payload = statuses.STOP) => {
    return {
        type: forgotUPassActions.CHANGESTATUS,
        payload
    }
}

const updateErrorUpassModal = (payload) => {
    return {
        type: forgotUPassActions.UPDATEERROR,
        payload
    }
}


export const forgotUPassActionCreators = {
    openChangePassModal,
    closeChangePassModal,
    changeStatusUPassModal,
    updateErrorUpassModal
}



export default forgotUPassActions
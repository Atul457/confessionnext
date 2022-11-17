import statuses from "../../reducers/updateUserPassReducer"


const UpdateUPassActions = {
    OPENMODAL: 'OPENMODAL',
    CLOSEMODAL: 'CLOSEMODAL',
    CHANGESTATUS: 'CHANGESTATUS',
    UPDATEERROR: 'UPDATEERROR',
    HIDEFIELDS: 'HIDEFIELDS',
    UPDATEBODYSTATUS: "UPDATEBODYSTATUS",
    RESETMODAL: "RESETUPDATEPASSWORDMODAL",
    STATUSNMESSAGE: "CHANGESTATUSANDMESSAGE"
}


const openChangePassModal = () => {
    return {
        type: UpdateUPassActions.OPENMODAL
    }
}

const closeChangePassModal = () => {
    return {
        type: UpdateUPassActions.CLOSEMODAL
    }
}

const changeStatusUPassModal = (payload = statuses.STOP) => {
    return {
        type: UpdateUPassActions.CHANGESTATUS,
        payload
    }
}

const updateErrorUpassModal = (payload) => {
    return {
        type: UpdateUPassActions.UPDATEERROR,
        payload
    }
}

const hideFieldsUpassModal = (payload) => {
    return {
        type: UpdateUPassActions.HIDEFIELDS,
        payload
    }
}

const changeBodyStatusUpassModal = (payload = statuses.STOP) => {
    return {
        type: UpdateUPassActions.UPDATEBODYSTATUS,
        payload
    }
}

const changeMessageNstatus = payload => {
    return {
        type: UpdateUPassActions.STATUSNMESSAGE,
        payload
    }
}


export const UpdateUPassActionCreators = {
    openChangePassModal,
    closeChangePassModal,
    changeStatusUPassModal,
    updateErrorUpassModal,
    hideFieldsUpassModal,
    changeBodyStatusUpassModal,
    changeMessageNstatus
}



export default UpdateUPassActions
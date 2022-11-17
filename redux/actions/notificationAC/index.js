export const notiActionTypes = {
    'OPENPOPUP': 'NOTIFICATIONOPENPOPUP',
    'CLOSEPOPUP': 'NOTIFICATIONCLOSEPOPUP',
    'UPDATEPOPUP': 'UPDATENOTIFICATIONPOPUPSTATE',
    'MESSAGESCOUNT': 'UPDATENEWMESSAGESCOUNT'
}


export const openNotiPopup = () => {
    return {
        type: notiActionTypes.OPENPOPUP
    }
}


export const updateNotiPopState = (payload) => {
    return {
        type: notiActionTypes.UPDATEPOPUP,
        payload
    }
}


export const closeNotiPopup = () => {
    return {
        type: notiActionTypes.CLOSEPOPUP
    }
}


export const updateMessagesCount = count => {
    return {
        type: notiActionTypes.MESSAGESCOUNT,
        payload: count
    }
}
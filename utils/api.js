const resHandler = res => {
    const { data } = res
    if (data?.status === true)
        return data
    const errorToThrow = res?.data?.message ?? "Something went wrong"
    throw { message: errorToThrow }
}

const apiStatus = {
    LOADING: "LOADING",
    IDLE: "IDLE",
    REJECTED: "REJECTED",
    FULFILLED: "FULLFILLED"
}

Object.freeze(apiStatus)

const defaultErrorMessage = "Something went wrong"

const getMessageToShow = (message) => {
    let messageToReturn = message
    messageToReturn = (message === "" || !message) ? defaultErrorMessage : message
    return messageToReturn
}


export { apiStatus, resHandler, defaultErrorMessage, getMessageToShow }
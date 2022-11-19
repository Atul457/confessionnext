// Check whether token is saved or not
const IsTokenSent = () => {
    const saved_token = localStorage.getItem("saved_token");
    if (saved_token === "true") return true
    return false
}

// Sets token is sent or not
const setTokenSentFlag = isSaved => localStorage.setItem("saved_token", isSaved)

// Sets FCM token
const setFCMToken = token => {
    if (token) localStorage.setItem("fcm_token", token)
}

const removeFCMToken = () => localStorage.removeItem("fcm_token")

// Checks fcm token and if exists returns it
const getFCMToken = () => {
    const fcm_token = localStorage.getItem("fcm_token");
    if (fcm_token !== "" && fcm_token?.length > 10) return {
        status: true,
        token: fcm_token
    }
    return {
        status: false,
        token: fcm_token
    }
}

const runFbOrNot = "serviceWorker" in navigator

// Exports
export { IsTokenSent, setTokenSentFlag, setFCMToken, getFCMToken, removeFCMToken, runFbOrNot }
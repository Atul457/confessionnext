const envConfig = {
    isProdMode: process.env.REACT_APP_ISPROD_MODE === "true",
    tagManagerLiveKey: process.env.REACT_APP_TAGMANAGER_LIVE_KEY,
    tagManagerDevKey: process.env.REACT_APP_TAGMANAGER_DEV_KEY,
    pixelId: process.env.REACT_APP_PIXELID,
    devBaseUrl: process.env.REACT_APP_DEV_BASEURL,
    liveBaseUrl: process.env.REACT_APP_LIVE_BASEURL,
    recaptchaKey: process.env.REACT_APP_RECAPTCHA_KEY,
}

export { envConfig }
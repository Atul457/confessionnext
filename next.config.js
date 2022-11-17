/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REACT_APP_FIREBASE_APIKEY: "AIzaSyCiYN-kSdQw6Rtxe7g15YMffE1iZtg94wE",
    REACT_APP_FIREBASE_AUTHDOMAIN: "the-talk-place-project.firebaseapp.com",
    REACT_APP_FIREBASE_PROJECTID: "the-talk-place-project",
    REACT_APP_FIREBASE_STORAGEBUCKET: "the-talk-place-project.appspot.com",
    REACT_APP_FIREBASE_MESSAGINGSENDERID: "564992561843",
    REACT_APP_FIREBASE_APPID: "1:564992561843:web:4873cd7344d53fadccd6c6",
    REACT_APP_FIREBASE_MEASUREMENTID: "G-EYWYJJWFVL",
    REACT_APP_FIREBASE_KEY_PAIR: "BPVJNQieDsClLyn_mLQp6N1w4tbW9nphDORpB4WQBFvLIp6yDGIEmMHbJrICYnxI4Tt5mc8MgSXSaI_vtGzf2fA",
    REACT_APP_ISPROD_MODE: true,
    REACT_APP_TAGMANAGER_LIVE_KEY: "GTM-KKNFBVT",
    REACT_APP_TAGMANAGER_DEV_KEY: "GTM-WP65TWC",
    REACT_APP_PIXELID: "1638738963149766",
    REACT_APP_DEV_BASEURL: "https://cloudart.com.au:3235/api/",
    REACT_APP_LIVE_BASEURL: "https://apis.thetalkplace.com:3235/api/",
    REACT_APP_LIVE_HOMEPAGE: "https://thetalkplace.com/",
    REACT_APP_DEV_HOMEPAGE: "https://cloudart.com.au/confessionNew",
    REACT_APP_RECAPTCHA_KEY: "https://www.google.com/recaptcha/api.js?render=6LcFvPEfAAAAAL7pDU8PGSIvTJfysBDrXlBRMWgt",
  }
}

module.exports = nextConfig

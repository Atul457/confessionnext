import { isWindowPresent } from "./checkDom";

const checkAuth = () => {

    if (isWindowPresent()) {
        const localStorageR = localStorage.getItem("authenticated");

        if (localStorageR === '' || localStorageR === null || localStorageR === '0') {
            localStorage.setItem("authenticated", "0");
            return (false);
        }
        else if (localStorageR === '1') {
            localStorage.setItem("authenticated", "1");
            return (true);
        }
        else {
            localStorage.setItem("authenticated", "0");
            return (false);
        }
    }
    else return false

}


const setAuth = (data) => {

    if (isWindowPresent()) {
        const dataG = data;
        if (dataG === 1) {
            localStorage.setItem("authenticated", "1");
        }
        else {
            localStorage.setItem("authenticated", "0");
            localStorage.removeItem("userDetails");
        }
    }

}

const adminAuthCheck = () => {

    if (isWindowPresent()) {
        const localStorageR = localStorage.getItem("adminAuthenticated");

        if (localStorageR === '' || localStorageR === null || localStorageR === '0') {
            localStorage.setItem("adminAuthenticated", "0");
            return (false);
        }
        else if (localStorageR === '1') {
            localStorage.setItem("adminAuthenticated", "1");
            return (true);
        }
        else {
            localStorage.setItem("adminAuthenticated", "0");
            return (false);
        }
    }
    else return false

}

const adminSetAuth = data => {

    if (isWindowPresent()) {
        const dataG = data;
        if (dataG === 1) {
            localStorage.setItem("adminAuthenticated", "1");
        }
        else {
            localStorage.setItem("adminAuthenticated", "0");
            localStorage.removeItem("adminDetails");
        }
    }
    else return false

}


const roleTypes = {
    "USER": "USER",
    "ADMIN": "ADMIN",
}

const getRole = () => {

    const isAdminLoggedIn = adminAuthCheck()
    const isUserLoggedIn = adminAuthCheck()
    let role = false;

    if (isAdminLoggedIn) role = roleTypes.ADMIN
    if (isUserLoggedIn) role = roleTypes.USER

    return role

}

const isAdminLoggedIn = getRole() === roleTypes.ADMIN
const isUserLoggedIn = getRole() === roleTypes.USER


const updateKeyProfileLoc = (key, value, isToken = false) => {

    if (isWindowPresent()) {
        let userDetails = localStorage.getItem("userDetails")
        if (!userDetails) userDetails = {}
        userDetails = JSON.parse(userDetails)
        if (isToken) userDetails = { ...userDetails, token: value }
        userDetails = { ...userDetails, profile: { ...userDetails.profile, [key]: value } }
        localStorage.setItem("userDetails", JSON.stringify(userDetails))
    }
}

const getKeyProfileLoc = (key, isToken = false, isAdmin = false) => {

    if (isWindowPresent()) {
        let userData = '';
        userData = localStorage.getItem(isAdmin ? "adminDetails" : "userDetails");
        userData = JSON.parse(userData);
        if (isAdmin ? adminAuthCheck() : checkAuth()) userData = isToken ? (userData?.token ?? "not found") : userData.profile[key]
        return userData;
    }
    return false

}


const auth = {
    checkAuth,
    setAuth,
    adminAuthCheck,
    adminSetAuth,
    getRole,
    roleTypes,
    getKeyProfileLoc,
    updateKeyProfileLoc,
    isAdminLoggedIn,
    isUserLoggedIn
}

export default auth;
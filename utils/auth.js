import { isWindowPresent } from "./checkDom";

// const checkAuth = () => {
//   if (isWindowPresent()) {
//     const localStorageR = localStorage.getItem("userDetail")?.user_id;

//     if (!localStorageR) {
//       localStorage.clear();
//       return false;
//     } else {
//       return false;
//     }
//   }
// };

// const checkAuth = () => {
//   if (isWindowPresent()) {
//     const localStorageR = localStorage.getItem("authenticated");

//     if (
//       localStorageR === "" ||
//       localStorageR === null ||
//       localStorageR === "0"
//     ) {
//       localStorage.setItem("authenticated", "0");
//       return false;
//     } else if (localStorageR === "1") {
//       localStorage.setItem("authenticated", "1");
//       return true;
//     } else {
//       localStorage.setItem("authenticated", "0");
//       return false;
//     }
//   } else return false;
// };

const checkAuth = () => {
  if (isWindowPresent()) {
    const localStorageR = localStorage.getItem("userDetails")?.user_id;
    return localStorageR ? true : false;
  }
};

const setAuth = (data) => {
  if (isWindowPresent()) {
    const dataG = data;
    if (dataG == 1) {
      localStorage.setItem("authenticated", "1");
    } else {
      localStorage.setItem("authenticated", "0");
      localStorage.removeItem("userDetails");
    }
  }
};

const getToken = () => {
  return getKeyProfileLoc("token");
};

const getAdminToken = () => {
  return getKeyProfileLoc("token");
};

const adminAuthCheck = () => {
  if (isWindowPresent()) {
    const localStorageR = localStorage.getItem("adminAuthenticated");

    if (
      localStorageR === "" ||
      localStorageR === null ||
      localStorageR === "0"
    ) {
      localStorage.setItem("adminAuthenticated", "0");
      return false;
    } else if (localStorageR === "1") {
      localStorage.setItem("adminAuthenticated", "1");
      return true;
    } else {
      localStorage.setItem("adminAuthenticated", "0");
      return false;
    }
  } else return false;
};

const adminSetAuth = (data) => {
  if (isWindowPresent()) {
    const dataG = data;
    if (dataG === 1) {
      localStorage.setItem("adminAuthenticated", "1");
    } else {
      localStorage.setItem("adminAuthenticated", "0");
      localStorage.removeItem("adminDetails");
    }
  } else return false;
};

const roleTypes = {
  USER: "USER",
  ADMIN: "ADMIN",
};

const getRole = () => {
  const isAdminLoggedIn = adminAuthCheck();
  const isUserLoggedIn = checkAuth();
  let role = false;

  if (isAdminLoggedIn) role = roleTypes.ADMIN;
  if (isUserLoggedIn) role = roleTypes.USER;

  return role;
};

const isAdminLoggedIn = getRole() === roleTypes.ADMIN;
const isUserLoggedIn = getRole() === roleTypes.USER;

const updateKeyProfileLoc = (key, value, isToken = false) => {
  if (isWindowPresent()) {
    let userDetails = localStorage.getItem("userDetails");
    if (!userDetails) userDetails = {};
    userDetails = JSON.parse(userDetails);
    if (isToken) userDetails = { ...userDetails, token: value };
    userDetails = {
      ...userDetails,
      [key]: value,
    };
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
  }
};

const getKeyProfileLoc = (key, isAdmin = false) => {
  if (isWindowPresent() && (adminAuthCheck() || checkAuth())) {
    let userData = "";
    userData = localStorage.getItem(isAdmin ? "adminDetails" : "userDetails");
    userData = JSON.parse(userData);
    if (userData && key in userData) userData = userData[key];
    return userData;
  }
  return false;
};

// LOGS OUT THE USER
const logout = async () => {
  setAuth(0);
  localStorage.clear();
  setTokenSentFlag(false);
  removeFCMToken(false);

  let obj = {
    data: {},
    token: token,
    method: "get",
    url: "logout",
  };
  try {
    await http(obj);
    window.location.href = "/login";
  } catch (err) {
    window.location.href = "/login";
  }
};

const handleUserDetails = ({ userDetails = {}, remove = false }) => {
  if (remove) return localStorage.removeItem("userDetails");
  localStorage.setItem("userDetails", userDetails);
};

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
  isUserLoggedIn,
  getToken,
  getAdminToken,
  logout,
};

export { handleUserDetails };

export default auth;

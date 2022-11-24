import toastMethods from "../components/common/Toaster";
import moment from "moment";
import { isWindowPresent } from "./checkDom";
import { apiStatus } from "./api";
import axios from "axios";
import auth from "./auth";
import { avatars } from "./provider";

const { isUserLoggedIn, getKeyProfileLoc, checkAuth } = auth;

const getIP = async () => {
  try {
    if (isWindowPresent()) {
      const res = await axios.get("https://geolocation-db.com/json/");
      if (res.status) {
        localStorage.setItem("ip", res.data.IPv4);
      }
    }
  } catch (err) {
    console.log(err?.message, "ip could not be loaded.");
  }
};

// Returns profile visit link
const profileLinkToVisit = (obj) => {
  var isMyProfile = getKeyProfileLoc("user_id") === obj?.user_id;
  if (!obj?.userslug) return "#";
  var linkToOtherProfile = `/userprofile/${obj?.userslug}`;
  return `${isUserLoggedIn && isMyProfile ? "/profile" : linkToOtherProfile}`;
};

// Generates message
const messageGenerator = (status = false, message = "", data = {}) => {
  return { status, message, data };
};

// Copies the passed text to clipboard
const copyTextToClipboard = (text) => {
  if (isWindowPresent()) var input = document.createElement("input");
  input.value = text;
  if (isWindowPresent()) document.body.appendChild(input);
  input.select();
  try {
    if (isWindowPresent()) var successful = document.execCommand("copy");
    toastMethods.toaster2Info(
      successful ? "Copied successfully" : "Unable to copy"
    );
  } catch (err) {
    toastMethods.toaster2Info("Unable to copy");
  }
  if (isWindowPresent()) document.body.removeChild(input);
};

const areAtLastPage = (pageSize = 20, commentsCount = 0, currPage) => {
  var totalPages,
    isAtLastPage = false;
  pageSize = 20;
  totalPages = Math.ceil(commentsCount / pageSize);
  totalPages = totalPages === 0 ? totalPages + 1 : totalPages;
  isAtLastPage = totalPages === currPage;
  return isAtLastPage;
};

const convert = (convertedDate, originalDate) => {
  const arrCheck = ["minute", "minutes"];
  const obj = ["min", "mins"];
  let copyOrgData = originalDate;

  if (convertedDate === "a few seconds ago")
    return (convertedDate = "Just now");

  if (convertedDate === "in a few seconds") return (convertedDate = "Just now");

  convertedDate = convertedDate.toString().split(" ");
  let toMatch = convertedDate[1];
  let newArr = [];
  arrCheck.forEach((curr, index) => {
    if (toMatch === curr) {
      newArr = [{ curr, index }];
      return false;
    }
  });

  if (newArr.length) {
    let toBeReplaceWith = obj[newArr[0].index];
    originalDate = originalDate.replace(newArr[0].curr, toBeReplaceWith);
    copyOrgData = originalDate;
  }

  copyOrgData = copyOrgData.toString().replace("a ", "1 ");
  copyOrgData = copyOrgData.toString().replace("an ", "1 ");
  return copyOrgData;
};

const dateConverter = (date) => {
  let convertedDate = moment.utc(date?.toString()).fromNow();
  convertedDate = convert(convertedDate?.toString(), convertedDate?.toString());
  return convertedDate;
};

const showSubCommentsFn = (countChild, SLOMT = 3) => {
  if (countChild && countChild > SLOMT)
    return {
      present: true,
      show: false,
      isShown: false,
      isBeingExpanded: false,
    };
  if (countChild && countChild <= SLOMT)
    return {
      present: true,
      show: true,
      isShown: false,
      isBeingExpanded: false,
    };
  if (countChild === 0)
    return {
      present: false,
      show: false,
      isShown: false,
      isBeingExpanded: false,
    };

  return {
    present: false,
    show: false,
    isShown: false,
    isBeingExpanded: false,
  };
};

const subComIniVal = {
  status: apiStatus.IDLE,
  data: [],
  message: "",
};

const showSubComValue = {
  present: false,
  show: false,
  isShown: false,
  isBeingExpanded: false,
};

const extValidator = (props) => {
  let fileName, ext, validExtensions;
  validExtensions = ["png", "jpeg", "gif", "jpg"];
  fileName = props;
  fileName = fileName.name;

  ext = fileName;
  ext = ext.split(".");
  ext = ext[ext.length - 1];

  if (validExtensions.includes(ext)) {
    return true;
  } else {
    return false;
  }
};

const goUp = () => {
  if (isWindowPresent())
    document
      .querySelector("#postsMainCont")
      .scrollTo({ top: "0px", behavior: "smooth" });
};

const requestedStatus = {
  is_not_requested: 0,
  is_requested: 1,
  approved: 2,
};

const forum_types = {
  private: 2,
  public: 1,
  closed: 3,
};

const searchTypes = {
  TOP: 0,
  POST: 1,
  FORUM: 2,
  TAGS: 3,
};

const reportedFormStatus = {
  reported: 1,
};

const getLocalStorageKey = (key) => {
  let value = localStorage.getItem(key) ?? false;
  return value;
};

const setLocalStoragekey = (key, value) => {
  if (!key || value === undefined)
    return messageGenerator(false, "key or value is undefined");
  localStorage.setItem(key, value);
  return messageGenerator(false, "data is saved to localstorage", {
    key: value,
  });
};

// Checks whether or not avatar image is used on profile currently
const isAvatarSelectedCurr = () => {
  let imgurl = "",
    check;
  if (isUserLoggedIn) {
    imgurl = getKeyProfileLoc("image");
    if (imgurl && typeof imgurl === "string" && imgurl?.indexOf("avatar") !== -1)
      avatars.forEach((curr, index) => {
        let src = curr.src;
        src = src.split("/");
        imgurl = `${imgurl}`.split("/");
        src = src[src.length - 1];
        imgurl = imgurl[imgurl.length - 1];
        if (src === imgurl) {
          check = messageGenerator(true, "Avatar is selected", {
            currentSelected: curr.src,
            avatarImageIndex: index,
          });
          return false;
        }
      });
  }

  if (!check || check === "") {
    check = messageGenerator(false, "Avatar is not selected");
  }

  return check;
};

const myForum = 2;

const isAllowedToComment = (currForum) => {
  const isClosed = currForum?.type === forum_types.closed;
  const isApproved = currForum?.is_requested === requestedStatus.approved;
  const isAllowedType = currForum?.type === forum_types.public;
  const allowToComment =
    (!isClosed && (isAllowedType || isApproved)) ||
    currForum?.isReported === myForum ||
    currForum?.isAllowedToComment === true;
  return checkAuth() && allowToComment;
};

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    padding: "5px 13px",
    color: "#495057",
    background: "#fff",
    background: "#ebebeb",
  }),
  control: (styles) => ({
    ...styles,
    backgroundColor: "transparent",
    padding: "3px 0px 3px 13px",
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    backgroundColor: "transparent",
    paddingRight: 0,
    color: "#495057",
  }),
  clearIndicator: (styles) => ({
    ...styles,
    color: "#495057",
    background: "#2E4C6D !important",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    background: "#2E4C6D !important",
  }),
  placeholder: () => ({
    color: "#495057",
  }),
  menuList: (provided) => ({
    ...provided,
    overflowY: "auto",
    height: 100,
    position: "absolute",
    width: "100%",
    zIndex: 99999999,
  }),
  indicatorsContainer: (provided, state) => ({
    display: "none",
  }),
  multiValue: () => ({
    background: "#2E4C6D",
    borderRadius: 50,
    padding: "3px 10px",
    margin: "2px 5px",
    color: "#fff",
    display: "inline-flex",
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";
    return {
      ...provided,
      opacity,
      transition,
      color: "#fff",
      padding: 8,
      fontSize: 13,
      fontWeight: 600,
    };
  },
  valueContainer: () => ({
    display: "flex",
    alignItems: "center",
    background: "transparent",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  }),
  multiValueLabel: () => ({
    color: "#fff",
  }),
};

const pulsationHelper = () => {
  if (isWindowPresent()) {
    let nodes = document.querySelectorAll("[pulsate]");
    let data, result;
    nodes.forEach((curr) => {
      data = curr.getAttribute("pulsate");
      let [date, classes] = data.split(",");
      if (date) {
        date = moment(date, "DD-MM-YYYY").add(30, "days");
        result = date.isAfter(moment());
        if (!result) return false;
        if (!classes) return false;
        if (curr.className.includes(classes)) return false;
        curr.setAttribute("class", curr.getAttribute("class") + " " + classes);
      }
    });
  }
};

export {
  copyTextToClipboard,
  dateConverter,
  areAtLastPage,
  showSubCommentsFn,
  showSubComValue,
  getIP,
  extValidator,
  pulsationHelper,
  getLocalStorageKey,
  setLocalStoragekey,
  isAvatarSelectedCurr,
  profileLinkToVisit,
  isAllowedToComment,
  subComIniVal
};

// import { apiStatus } from "../../../../helpers/status"
import { apiStatus } from "../../../../../utils/api"
import auth from "../../../../../utils/auth"
// import auth from "../../../../user/behindScenes/Auth/AuthCheck"

const showSubCommentsFn = (countChild, SLOMT = 3) => {
    if (countChild && countChild > SLOMT)
        return {
            present: true,
            show: false,
            isShown: false,
            isBeingExpanded: false
        }
    if (countChild && countChild <= SLOMT)
        return {
            present: true,
            show: true,
            isShown: false,
            isBeingExpanded: false
        }
    if (countChild === 0)
        return {
            present: false,
            show: false,
            isShown: false,
            isBeingExpanded: false
        }

    return {
        present: false,
        show: false,
        isShown: false,
        isBeingExpanded: false
    }
}

const subComIniVal = {
    status: apiStatus.IDLE,
    data: [],
    message: ""
}

const showSubComValue = {
    present: false,
    show: false,
    isShown: false,
    isBeingExpanded: false
}


const goUp = () => {
    document.querySelector("#postsMainCont").scrollTo({ top: "0px", behavior: "smooth" });
}

const requestedStatus = {
    is_not_requested: 0,
    is_requested: 1,
    approved: 2
}

const forum_types = {
    private: 2,
    public: 1,
    closed: 3
}

const searchTypes = {
    TOP: 0,
    POST: 1,
    FORUM: 2,
    TAGS: 3
}

const reportedFormStatus = {
    reported: 1
}

const myForum = 2

const isAllowedToComment = currForum => {
    const isClosed = currForum?.type === forum_types.closed
    const isApproved = currForum?.is_requested === requestedStatus.approved
    const isAllowedType = currForum?.type === forum_types.public
    const allowToComment = (!isClosed && (isAllowedType || isApproved) || currForum?.isReported === myForum || currForum?.isAllowedToComment === true)
    return auth.isUserLoggedIn && allowToComment
}

const customStyles = {
    option: (provided, state) => ({
        ...provided,
        padding: "5px 13px",
        color: "#495057",
        background: "#fff",
        background: "#ebebeb"
    }),
    control: (styles) => ({ ...styles, backgroundColor: 'transparent', padding: "3px 0px 3px 13px" }),
    dropdownIndicator: (styles) => ({ ...styles, backgroundColor: 'transparent', paddingRight: 0, color: "#495057" }),
    clearIndicator: (styles) => ({ ...styles, color: "#495057", background: "#2E4C6D !important" }),
    multiValueRemove: (styles) => ({
        ...styles,
        background: "#2E4C6D !important"
    }),
    placeholder: () => ({
        color: "#495057"
    }),
    menuList: (provided) => ({
        ...provided,
        overflowY: 'auto',
        height: 100,
        position: "absolute",
        width: "100%",
        zIndex: 99999999,
    }),
    indicatorsContainer: (provided, state) => ({
        display: 'none'
    }),
    multiValue: () => ({
        background: '#2E4C6D',
        borderRadius: 50,
        padding: "3px 10px",
        margin: "2px 5px",
        color: '#fff',
        display: 'inline-flex',
    }),
    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';
        return { ...provided, opacity, transition, color: '#fff', padding: 8, fontSize: 13, fontWeight: 600 };
    },
    valueContainer: () => ({
        display: 'flex',
        alignItems: 'center',
        background: "transparent",
        flexWrap: "wrap",
        justifyContent: 'flex-start'
    }),
    multiValueLabel: () => ({
        color: "#fff"
    })
}

export {
    showSubCommentsFn,
    showSubComValue,
    subComIniVal,
    goUp,
    requestedStatus,
    forum_types,
    reportedFormStatus,
    isAllowedToComment,
    customStyles,
    myForum,
    searchTypes
}
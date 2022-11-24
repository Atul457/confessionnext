import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeNotiPopup,
  openNotiPopup,
  updateMessagesCount,
  updateNotiPopState,
} from "../../../redux/actions/notificationAC";
import { searchAcFn } from "../../../redux/actions/searchAc/searchAc";
import auth from "../../../utils/auth";
import { signOut } from "next-auth/react";
import { togglemenu } from "../../../redux/actions/share";
import { http } from "../../../utils/http";
import { EVerifyModal } from "../../../redux/actions/everify";
import VerifyEmailModal from "../modals/VerifyEmailModal";
import _ from "lodash";
import { isWindowPresent } from "../../../utils/checkDom";
import { getForumsNConfessions } from "../../../services/user/forumServices";
import openSLinksModalActionCreators from "../../../redux/actions/socialLinksModal";


const UserIcon = () => {

  // Hooks and vars
  const { getKeyProfileLoc, setAuth } = auth;
  const { data: session } = useSession();
  const [requestsIndicator, setRequestIndicator] = useState(0);
  const [profileImage, setProfileImage] = useState(false)
  const profileInLocalStorage = (session && isWindowPresent() ? JSON.parse(localStorage.getItem("userDetails") ?? "{ }") : false)?.image
  const [showEModal, setShowEModal] = useState(false);
  const store = useSelector((store) => store);
  const ShareReducer = store.ShareReducer;
  const SearchReducer = store.SearchReducer;
  const verifyEState = store.VerifyEmail;
  const searchBoxRef = useRef(null);
  const name = getKeyProfileLoc("name");
  const email = session?.user?.email;
  const router = useRouter();
  const pathname = router.pathname.replace("/")
  const history = router.push;
  const dispatch = useDispatch();
  const notificationReducer = store.notificationReducer;
  const [profile, setProfile] = useState(false);
  const [showProfileOption, setShowProfileOption] = useState(false);
  const [newCommentsCount, setNewCommentsCount] = useState(0);

  useEffect(() => {
    setRequestIndicator(
      localStorage.getItem("requestsCount")
        ? parseInt(localStorage.getItem("requestsCount"))
        : 0
    );
    setProfile(session ? JSON.parse(localStorage.getItem("userDetails") ?? "{}") : false)
  }, [session]);

  useEffect(() => {
    setProfile(session ? JSON.parse(localStorage.getItem("userDetails") ?? "{}") : false)
  }, [])

  useEffect(() => {
    setProfileImage(profileInLocalStorage)
  }, [profileInLocalStorage])

  useEffect(() => {
    if (ShareReducer.selectedPost?.value) {
      document.addEventListener("click", catchEvent2);
    }
    return () => {
      document.removeEventListener("click", catchEvent2);
    };
  }, [ShareReducer.selectedPost?.value]);

  useEffect(() => {
    let interval;
    if (session) {
      interval = setInterval(() => {
        getUnreadCommentsCount(notificationReducer);
      }, 3000);
    }
    return () => {
      if (session) clearInterval(interval);
    };
  }, [
    notificationReducer.data,
    notificationReducer.messagesCount,
    verifyEState,
  ]);

  useEffect(() => {
    getNotiStatus();
  }, [notificationReducer.data]);

  useEffect(() => {
    const listener = (e) => {
      const toIgnore = ["seach_boxinput", "headerUserAccIcon", "search_box"];
      const elementClass = e.target.classList;
      let ignorableItem = false;
      toIgnore.forEach((curr) => {
        if (elementClass.contains(curr)) ignorableItem = true;
      });
      if (!ignorableItem) {
        dispatch(searchAcFn({ visible: false }));
      }
    };
    if (SearchReducer.visible) {
      document.addEventListener("click", listener);
      if (searchBoxRef) searchBoxRef.current.focus()
    }
    return () => {
      document.removeEventListener("click", listener);
    };
  }, [SearchReducer.visible]);

  useEffect(() => {
    if (showProfileOption) {
      document.addEventListener("click", catchEvent);
    }
    return () => {
      document.removeEventListener("click", catchEvent);
    };
  }, [showProfileOption]);

  useEffect(() => {
    if (notificationReducer.isVisible === true) {
      document.addEventListener("click", catchEventNoti);
    }

    return () => {
      document.removeEventListener("click", catchEventNoti);
    };
  }, [notificationReducer.isVisible]);

  // Functions

  // Handles sharekit
  function catchEvent2(e) {
    var classes = e.target.classList;
    if (
      !classes.contains("shareReqCont") &&
      !classes.contains("shareReqRows") &&
      !classes.contains("shareKitImgIcon") &&
      !classes.contains("sharekitdots") &&
      !classes.contains("dontHide")
    ) {
      dispatch(
        togglemenu({
          id: null,
          value: false,
        })
      );
    }
  }

  // Handles profile popup
  function catchEvent(e) {
    var classes = e.target.classList;
    if (!classes.contains("takeAction") && !classes.contains("userAccIcon")) {
      setShowProfileOption(false);
    }
  }

  // Handles notification
  function catchEventNoti(e) {
    var classes = e.target.classList;
    let result =
      !classes.contains("takeActionNoti") &&
      !classes.contains("noti") &&
      !classes.contains("takeActionOptions") &&
      !classes.contains("notificationIcon");
    if (result) {
      dispatch(closeNotiPopup());
    }
  }

  const navigateToSearch = (e) => {
    e.preventDefault();
    dispatch(
      searchAcFn({
        visible: false,
        searchedWith: searchBoxRef.current?.value,
        page: 1,
      })
    );

    getForumsNConfessions({
      SearchReducer: {
        ...SearchReducer,
        searchedWith: searchBoxRef.current?.value,
        dispatch,
        append: false,
      },
    });

    history("/search");
  };

  // Opens Update password modal
  const openUpdatePassModal = () => {
    dispatch(UpdateUPassActionCreators.openChangePassModal());
  };

  // Checks which key is pressed
  const checkKeyPressed = (event, updateValue = true) => {
    const isSearchPage = pathname === "search";
    const value = event.target.value;
    if (updateValue) {
      if (isSearchPage) scrollToTop();

      dispatch(
        searchAcFn({
          searchStr: value,
        })
      );
    }
  };

  // Opens the social links modal
  const openSocialLinksModal = () => {
    dispatch(openSLinksModalActionCreators.openModal());
  };

  // Toggles search box
  const toggleSearchBox = () => {
    if (SearchReducer.visible) {
      return dispatch(
        searchAcFn({
          visible: false,
        })
      );
    }

    dispatch(
      searchAcFn({
        visible: true,
      })
    );
  };

  // Toggles the notifications container
  const toggleNotificationCont = () => {
    if (!notificationReducer.isVisible) return dispatch(openNotiPopup());

    dispatch(closeNotiPopup());
  };

  const HandleShowHide = () => {
    setShowProfileOption(!showProfileOption);
  };

  const getNotiHtml = () => {
    let data,
      arr,
      html,
      count = 0,
      arrForums;
    data = notificationReducer.data;
    arr = [
      {
        iconClass: "fa fa-comments",
        label: "You have got a new comment on your post",
      },
      {
        iconClass: "fa fa-envelope",
        label: "You have got a new reply on your comment",
      },
      {
        iconClass: "fa fa-comment-o",
        label: "You have got a new reply on your reply",
      },
      {
        iconClass: "fa fa-comment-o",
        label: "You have got a new reply on your reply",
      },
      { iconClass: "fa fa-ban", label: "No new notifications" },
    ];
    arrForums = [
      {
        iconClass: "fa fa-comments",
        label: "You have got a new comment on your forum",
      },
      {
        iconClass: "fa fa-envelope",
        label: "You have got a new reply on your comment",
      },
      {
        iconClass: "fa fa-comment-o",
        label: "You have got a new reply on your reply",
      },
      {
        iconClass: "fa fa-comment-o",
        label: "You have been tagged in a forum",
      },
      { iconClass: "fa fa-ban", label: "No new notifications" },
    ];

    if (data.length === 0) {
      return (
        <div
          type="button"
          className="takeActionOptions takeActionOptionsOnHov textDecNone py-2"
        >
          <i className={arr[arr.length - 1].iconClass} aria-hidden="true"></i>
          {arr[arr.length - 1].label}
        </div>
      );
    }

    let link = "";
    let typeOfForum = 2;

    html = data.map((curr, index) => {
      let isForum = +curr?.ptype === typeOfForum;
      if (curr.is_unread === 1) count++;

      link = `/${isForum ? "forums" : "confession"}/${curr.slug}`;

      return (
        <Link
          className="notiDivsLinkTag"
          key={
            "notiDivs" +
            curr.confession_id +
            "type" +
            curr.type +
            Math.floor(Math.random() * 1000000)
          }
          onClick={() => {
            dispatch(closeNotiPopup());
          }}
          href={link}
        >
          <>
            {index > 0 && <hr className="m-0" />}
            <div
              type="button"
              className={`takeActionOptions takeActionOptionsOnHov textDecNone py-2 ${curr.is_unread === 1 ? "unread" : ""
                }`}
            >
              {isForum ? (
                <i
                  className={arr[curr.type - 1].iconClass}
                  aria-hidden="true"
                ></i>
              ) : (
                <i
                  className={arrForums[curr.type - 1].iconClass}
                  aria-hidden="true"
                ></i>
              )}
              <span className="notificationLabel">
                {isForum
                  ? arrForums[curr.type - 1].label
                  : arr[curr.type - 1].label}
              </span>
            </div>
          </>
        </Link>
      );
    });

    return html;
  };

  function getNotiStatus() {
    let data,
      count = 0;
    data = notificationReducer.data;
    data.forEach(function (curr) {
      if (curr.is_unread === 1) {
        count++;
      }
    });

    if (count > 0 && notificationReducer.newNotifications !== true) {
      dispatch(updateNotiPopState({ newNotifications: true }));
    }

    if (count === 0 && notificationReducer.newNotifications !== false) {
      dispatch(updateNotiPopState({ newNotifications: false }));
    }
  }

  //GETS THE TOTAL NO OF NEW COMMENTS
  async function getUnreadCommentsCount() {
    let obj = {
      data: {},
      token: getKeyProfileLoc("token") ?? "",
      method: "get",
      url: "newcommentscount",
    };

    try {
      const res = http(obj);
      res.then((res) => {
        if (res.data.status === true) {
          let count = parseInt(res.data.friendrequests);
          let count_ = parseInt(res.data.messages);
          setNewCommentsCount(res.data.comments);

          if (res.data.messages !== notificationReducer.messagesCount) {
            dispatch(updateMessagesCount(res.data.messages));
          }

          setRequestIndicator(count);
          localStorage.setItem("requestsCount", count);
          localStorage.setItem("mssgCount", count_);

          // IF NOTIFICATION DATA IS NOT UPDATED THE ONLY UPDATE IT
          if (!_.isEqual(res.data.commentscenter, notificationReducer.data)) {
            dispatch(updateNotiPopState({ data: res.data.commentscenter }));
          }

          // EMAIL VERIFICATION LOGIC
          var email_verified = res.data.email_verified; // 0 NOT VERIFIED , 1 VERIFIED

          let currPath;

          // if (params.postId) {
          //   currPath = `confession/${params.postId}`;
          // }

          // if (email_verified !== "" && email_verified === 0 && pathname !== currPath) {
          //   if (verifyEState.verified === false) {
          //     setShowEModal(true);
          //   }

          if (email_verified !== "" && email_verified === 0) {
            if (verifyEState.verified === false) {
              setShowEModal(true);
            }
          } else if (email_verified === 1 && verifyEState.verified === false) {
            dispatch(EVerifyModal({ verified: true }));
          }
        }
      });
    } catch (err) {
      console.log(err?.messages);
    }
  }

  // Logs the user out
  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
    setAuth(0);
    localStorage.clear();
  };

  return (
    <>

      {!session ? <div
        className='socialLinksIconWrapper authProfileIcon'
        pulsate='07-07-22,pulsatingIcon mobile'>
        <img
          src="/images/socialLinksIcon.svg"
          alt="socialLinksIcon"
          onClick={openSocialLinksModal} />
      </div> : null}

      {session ? (
        <>
          {/* Email verification modal */}
          {verifyEState && verifyEState.verified === false && (
            <VerifyEmailModal showEModal={showEModal} />
          )}
          {/* Email verification modal */}

          {/* Search icon */}
          <div className="authProfileIcon noti search_box_cont">
            <div
              className="notifications search_box"
              onClick={toggleSearchBox}
              pulsate="07-07-22,pulsatingIcon mobile"
            >
              <img
                src="/images/searchIconActive.svg"
                alt="searchIconActive"
                className="headerUserAccIcon mobile_view"
              />
              <img
                src={
                  !SearchReducer.visible
                    ? "/images/searchIcon.svg"
                    : "/images/searchIconActive.svg"
                }
                alt="searchIconActive"
                className={`headerUserAccIcon web_view`}
              />
            </div>
            {SearchReducer.visible ? (
              <form className="search_form" onSubmit={navigateToSearch}>
                <input
                  type="text"
                  value={SearchReducer?.searchStr ?? ""}
                  onChange={(e) => checkKeyPressed(e)}
                  onKeyDown={(e) => checkKeyPressed(e, false)}
                  placeholder="Search"
                  ref={searchBoxRef}
                  className="seach_boxinput"
                />
              </form>
            ) : null}
          </div>
          {/* Search icon */}

          <div className="authProfileIcon noti">
            <div
              className="notifications"
              onClick={toggleNotificationCont}
              pulsate="07-07-22,pulsatingIcon mobile"
            >
              <img
                src="/images/bell.svg"
                alt="bellIcon"
                className="notificationIcon headerUserAccIcon"
              />

              <img
                src="/images/orangebell.svg"
                alt="bellActive"
                className="notificationIcon headerUserAccIcon mobIcon"
              />

              {notificationReducer.newNotifications && (
                <span className="requestIndicator"></span>
              )}
            </div>

            {notificationReducer.isVisible && (
              <div className="takeActionNoti p-1 pb-0 d-block">
                <div className="NotiWrapper">{getNotiHtml()}</div>
              </div>
            )}
          </div>

          <div className="authProfileIcon" onClick={HandleShowHide}>
            <span className="requestsIndicatorNuserIconCont" type="button">
              <img
                src={profileImage && profileImage !== "" ? profileImage : "/images/userAcc.svg"}
                alt="profileImage"
                className="userAccIcon headerUserAccIcon"
              />

              <img
                src={profileImage && profileImage !== "" ? profileImage : "/images/userAcc.svg"}
                alt="profileImage"
                className="userAccIcon headerUserAccIcon mobIcon"
              />

              {requestsIndicator > 0 && (
                <span className="requestIndicator"></span>
              )}

              {profile?.email_verified === 1 ? (
                <img
                  src="/images/verifiedIcon.svg"
                  title="Verified user"
                  alt="verified_user_icon"
                  className="verified_user_icon"
                />
              ) : null}
            </span>

            {showProfileOption && (
              <div className="takeAction p-1 pb-0 d-block">
                <Link href="/profile" className="textDecNone border-bottom">
                  <div
                    type="button"
                    className="profileImgWithEmail takeActionOptions d-flex align-items-center mt-2 textDecNone"
                  >
                    <span className="profileHeaderImage">
                      <img
                        src={profileImage && profileImage !== "" ? profileImage : "/images/userAcc.svg"}
                        alt="profileIcon"
                      />

                      {profile?.email_verified === 1 ? (
                        <img
                          src="/images/verifiedIcon.svg"
                          title="Verified user"
                          alt="verified_user_icon"
                          className="verified_user_icon"
                        />
                      ) : null}
                    </span>
                    <div className="nameEmailWrapperHeader">
                      <span className="userDropDown userProfileHeading">
                        {name}
                      </span>
                      <span className="userDropDown userProfileSubHeadings">
                        {email}
                      </span>
                    </div>
                  </div>

                  <hr className="m-0" />
                  <div
                    type="button"
                    className="takeActionOptions takeActionOptionsOnHov textDecNone py-2"
                  >
                    <img
                      src="/images/profileIcon.svg"
                      alt="profileIcon"
                      className="profilePopUpIcons"
                    />
                    <span className="viewProfileNcommentsCont">
                      <div className="userProfileHeading">View profile</div>
                      {newCommentsCount > 0 && (
                        <div className="userProfileSubHeadings">
                          Unread Replies ({newCommentsCount})
                        </div>
                      )}
                    </span>
                  </div>
                </Link>
                <hr className="m-0" />
                <div
                  type="button"
                  onClick={openSocialLinksModal}
                  className="takeActionOptions takeActionOptionsOnHov textDecNone py-2"
                >
                  <img
                    src="/images/follow_usIcon.svg"
                    alt="socialLinksIcon"
                    className="profilePopUpIcons"
                  />
                  <span className="viewProfileNcommentsCont">
                    <div className="userProfileHeading">Follow us</div>
                  </span>
                </div>
                <Link href="/profile" className="textDecNone border-bottom">
                  {requestsIndicator > 0 ? (
                    <>
                      <hr className="m-0" />
                      <div
                        type="button"
                        className="takeActionOptions takeActionOptionsOnHov textDecNone py-2"
                      >
                        <img
                          src="/images/friendRequests.svg"
                          alt="friendRequestsIcon"
                          className="profilePopUpIcons friendReqIcon diff"
                        />
                        <span className="viewProfileNcommentsCont">
                          <div className="userProfileHeading">
                            Friend requests
                          </div>
                          {requestsIndicator > 0 && (
                            <div className="userProfileSubHeadings">
                              {requestsIndicator > 1
                                ? `${requestsIndicator} Friend Requests`
                                : `${requestsIndicator} Friend Request`}
                            </div>
                          )}
                        </span>
                      </div>
                    </>
                  ) : null}
                </Link>

                {profile?.source === 1 && (
                  <>
                    <hr className="m-0" />
                    <div
                      type="button"
                      onClick={openUpdatePassModal}
                      className="takeActionOptions  userProfileHeading takeActionOptionsOnHov userProfileHeading textDecNone py-2"
                    >
                      <img
                        src="/images/profileResetPass.svg"
                        alt="resetPasswordIcon"
                        className="profilePopUpIcons"
                      />
                      Reset Password
                    </div>
                  </>
                )}

                <hr className="m-0" />
                <div
                  type="button"
                  className="takeActionOptions userProfileHeading py-2 takeActionOptionsOnHov textDecNone mb-0"
                  onClick={() => logout()}
                >
                  <img
                    src="/images/logoutIcon.svg"
                    alt="logoutIcon"
                    className="profilePopUpIcons"
                  />
                  Logout
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <Link href="/login" className="linkToLogin">
          <div>
            <span className="requestsIndicatorNuserIconCont">
              <img
                src="/images/userAcc.svg"
                alt="userIcon"
                className="userAccIcon headerUserAccIcon"
              />
              <img
                src="/images/mobileProfileIcon.svg"
                alt="profileIcon"
                className="userAccIcon headerUserAccIcon mobIcon"
              />
            </span>
          </div>
        </Link>
      )}
    </>
  );
};

export default UserIcon;

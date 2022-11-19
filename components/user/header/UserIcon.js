import Image from "next/image";
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

const { getKeyProfileLoc, checkAuth } = auth;

const UserIcon = () => {
  const [requestsIndicator, setRequestIndicator] = useState(0);
  const store = useSelector((store) => store);
  const SearchReducer = store.SearchReducer;
  const [authenticated, setAuthenticated] = useState(false);
  const searchBoxRef = useRef(null);
  const image = getKeyProfileLoc("image");
  const name = getKeyProfileLoc("name");
  const email = getKeyProfileLoc("email");
  const router = useRouter();
  const history = router.push;
  const dispatch = useDispatch();
  const notificationReducer = store.notificationReducer;
  const [profile, setProfile] = useState({});
  const [showProfileOption, setShowProfileOption] = useState(false);
  const [newCommentsCount, setNewCommentsCount] = useState(0);

  useEffect(() => {
    setRequestIndicator(
      localStorage.getItem("requestsCount")
        ? parseInt(localStorage.getItem("requestsCount"))
        : 0
    );

    setProfile(() => {
      if (checkAuth()) {
        let profile = localStorage.getItem("userDetails");
        profile = JSON.parse(profile);
        profile = profile.profile;
        return profile;
      }
      return {};
    });

    setAuthenticated(checkAuth());
  }, []);

  // Functions

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

    // console.log(first)

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
              className={`takeActionOptions takeActionOptionsOnHov textDecNone py-2 ${
                curr.is_unread === 1 ? "unread" : ""
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

  return (
    <>
      {authenticated ? (
        <>
          {/* Search icon */}
          <div className="authProfileIcon noti search_box_cont">
            <div
              className="notifications search_box"
              onClick={toggleSearchBox}
              pulsate="07-07-22,pulsatingIcon mobile"
            >
              <Image
                width={20}
                height={20}
                src="/images/searchIconActive.svg"
                alt="searchIconActive"
                className="headerUserAccIcon mobile_view"
              />
              <Image
                width={20}
                height={20}
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
              <Image
                width={20}
                height={20}
                src="/images/bell.svg"
                alt="bellIcon"
                className="notificationIcon headerUserAccIcon"
              />

              <Image
                width={20}
                height={20}
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
              <Image
                width={20}
                height={20}
                src={image === "" ? "/images/userAcc.svg" : image}
                alt="profileImage"
                className="userAccIcon headerUserAccIcon"
              />

              <Image
                width={20}
                height={20}
                src={image === "" ? "/images/mobileProfileIcon.svg" : image}
                alt="profileIcon"
                className="userAccIcon headerUserAccIcon mobIcon"
              />

              {requestsIndicator > 0 && (
                <span className="requestIndicator"></span>
              )}

              {getKeyProfileLoc("email_verified") === 1 ? (
                <Image
                  width={20}
                  height={20}
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
                      <Image
                        width={20}
                        height={20}
                        src={
                          image === "" ? "/images/mobileProfileIcon.svg" : image
                        }
                        alt="profileIcon"
                      />

                      {getKeyProfileLoc("email_verified") === 1 ? (
                        <Image
                          width={20}
                          height={20}
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
                    <Image
                      width={20}
                      height={20}
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
                  <Image
                    width={20}
                    height={20}
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
                        <Image
                          width={20}
                          height={20}
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
                      <Image
                        width={20}
                        height={20}
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
                  <Image
                    width={20}
                    height={20}
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
              <Image
                width={20}
                height={20}
                src="/images/userAcc.svg"
                alt="userIcon"
                className="userAccIcon headerUserAccIcon"
              />
              <Image
                width={20}
                height={20}
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

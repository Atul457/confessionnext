import Image from 'next/image';
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { searchAcFn } from '../../../redux/actions/searchAc/searchAc';
import auth from '../../../utils/auth';


const UserIcon = () => {

    const { getKeyProfileLoc, checkAuth } = auth
    const SearchReducer = useSelector(store => store.SearchReducer);
    const image = getKeyProfileLoc("image")
    const name = getKeyProfileLoc("name")
    const email = getKeyProfileLoc("email")
    const dispatch = useDispatch()

    const toggleSearchBox = () => {
        if (SearchReducer.visible) {
            return dispatch(searchAcFn({
                visible: false
            }))
        }

        dispatch(searchAcFn({
            visible: true
        }))
    }

    return (
        <>
            {checkAuth() ?
                (
                    <>
                        {/* Search icon */}
                        <div className="authProfileIcon noti search_box_cont">
                            <div className="notifications search_box"
                                onClick={toggleSearchBox}
                                pulsate='07-07-22,pulsatingIcon mobile'>
                                <Image
                                    width={20}
                                    height={20}
                                    src="/images/searchIconActive.svg"
                                    alt="searchIconActive"
                                    className="headerUserAccIcon mobile_view" />
                                <Image
                                    width={20}
                                    height={20}
                                    src={!SearchReducer.visible ? "/images/searchIcon.svg" : "/images/searchIconActive.svg"}
                                    alt="searchIconActive"
                                    className={`headerUserAccIcon web_view`} />
                            </div>
                            {SearchReducer.visible ?
                                (
                                    <form className='search_form' onSubmit={navigateToSearch}>
                                        <input
                                            type="text"
                                            value={SearchReducer?.searchStr ?? ""}
                                            onChange={(e) => checkKeyPressed(e)}
                                            onKeyDown={(e) => checkKeyPressed(e, false)}
                                            placeholder='Search'
                                            ref={searchBoxRef}
                                            className="seach_boxinput" />
                                    </form>
                                )
                                : null}
                        </div>
                        {/* Search icon */}

                        <div className="authProfileIcon noti">
                            <div className="notifications"
                                onClick={toggleNotificationCont}
                                pulsate='07-07-22,pulsatingIcon mobile'>

                                <Image
                                    width={20}
                                    height={20}
                                    src="/images/bell.svg"
                                    alt="bellIcon"
                                    className="notificationIcon headerUserAccIcon" />

                                <Image
                                    width={20}
                                    height={20}
                                    src="/images/orangebell.svg"
                                    alt="bellActive"
                                    className="notificationIcon headerUserAccIcon mobIcon" />

                                {notificationReducer.newNotifications && (
                                    <span className="requestIndicator"></span>
                                )}
                            </div>

                            {notificationReducer.isVisible &&
                                <div className="takeActionNoti p-1 pb-0 d-block">
                                    <div className="NotiWrapper">
                                        {getNotiHtml()}
                                    </div>
                                </div>}
                        </div>


                        <div className="authProfileIcon" onClick={HandleShowHide}>
                            <span className="requestsIndicatorNuserIconCont" type="button">

                                <Image
                                    width={20}
                                    height={20}
                                    src={image === '' ? "/images/userAcc.svg" : image}
                                    alt="profileImage"
                                    className='userAccIcon headerUserAccIcon' />

                                <Image
                                    width={20}
                                    height={20}
                                    src={image === '' ? "/images/mobileProfileIcon.svg" : image}
                                    alt="profileIcon"
                                    className='userAccIcon headerUserAccIcon mobIcon' />

                                {requestsIndicator > 0 && (
                                    <span className="requestIndicator"></span>
                                )}

                                {getKeyProfileLoc("email_verified") === 1 ?
                                    <Image
                                        width={20}
                                        height={20}
                                        src="/images/verifiedIcon.svg"
                                        title="Verified user"
                                        alt="verified_user_icon" className='verified_user_icon' /> : null}
                            </span>

                            {showProfileOption && <div className="takeAction p-1 pb-0 d-block">
                                <Link href="/profile" className="textDecNone border-bottom">
                                    <div type="button" className="profileImgWithEmail takeActionOptions d-flex align-items-center mt-2 textDecNone">
                                        <span className="profileHeaderImage">

                                            <Image
                                                width={20}
                                                height={20}
                                                src={image === '' ? "/images/mobileProfileIcon.svg" : image} alt="profileIcon" />

                                            {getKeyProfileLoc("email_verified") === 1 ?
                                                <Image
                                                    width={20}
                                                    height={20}
                                                    src="/images/verifiedIcon.svg"
                                                    title="Verified user"
                                                    alt="verified_user_icon" className='verified_user_icon' /> : null}

                                        </span>
                                        <div className="nameEmailWrapperHeader">
                                            <span className="userDropDown userProfileHeading">{name}</span>
                                            <span className="userDropDown userProfileSubHeadings">{email}</span>
                                        </div>
                                    </div>

                                    <hr className="m-0" />
                                    <div type="button" className="takeActionOptions takeActionOptionsOnHov textDecNone py-2">
                                        <Image
                                            width={20}
                                            height={20}
                                            src="/images/profileIcon.svg"
                                            alt="profileIcon"
                                            className='profilePopUpIcons' />
                                        <span className="viewProfileNcommentsCont">
                                            <div className='userProfileHeading'>
                                                View profile
                                            </div>
                                            {newCommentsCount > 0 &&
                                                <div className='userProfileSubHeadings'>
                                                    Unread Replies ({newCommentsCount})
                                                </div>
                                            }
                                        </span>
                                    </div>
                                </Link>
                                <hr className="m-0" />
                                <div
                                    type="button"
                                    onClick={openSocialLinksModal}
                                    className="takeActionOptions takeActionOptionsOnHov textDecNone py-2">
                                    <Image
                                        width={20}
                                        height={20}
                                        src="/images/follow_usIcon.svg"
                                        alt="socialLinksIcon"
                                        className='profilePopUpIcons' />
                                    <span className="viewProfileNcommentsCont">
                                        <div className='userProfileHeading'>
                                            Follow us
                                        </div>
                                    </span>
                                </div>
                                <Link href="/profile" className="textDecNone border-bottom">
                                    {requestsIndicator > 0 ?
                                        <>
                                            <hr className="m-0" />
                                            <div type="button" className="takeActionOptions takeActionOptionsOnHov textDecNone py-2">
                                                <Image
                                                    width={20}
                                                    height={20}
                                                    src="/images/friendRequests.svg"
                                                    alt="friendRequestsIcon"
                                                    className='profilePopUpIcons friendReqIcon diff' />
                                                <span className="viewProfileNcommentsCont">
                                                    <div className='userProfileHeading'>
                                                        Friend requests
                                                    </div>
                                                    {
                                                        requestsIndicator > 0 &&
                                                        <div className='userProfileSubHeadings'>
                                                            {requestsIndicator > 1 ?
                                                                `${requestsIndicator} Friend Requests` :
                                                                `${requestsIndicator} Friend Request`}
                                                        </div>
                                                    }
                                                </span>
                                            </div>
                                        </> : null}
                                </Link>

                                {profile?.source === 1 &&
                                    <>
                                        <hr className="m-0" />
                                        <div type="button"
                                            onClick={openUpdatePassModal} className="takeActionOptions  userProfileHeading takeActionOptionsOnHov userProfileHeading textDecNone py-2">
                                            <Image
                                                width={20}
                                                height={20}
                                                src="/images/profileResetPass.svg"
                                                alt="resetPasswordIcon"
                                                className='profilePopUpIcons' />
                                            Reset Password
                                        </div>
                                    </>}

                                <hr className="m-0" />
                                <div type="button" className="takeActionOptions userProfileHeading py-2 takeActionOptionsOnHov textDecNone mb-0" onClick={() => logout()}>
                                    <Image
                                        width={20}
                                        height={20}
                                        src="/images/logoutIcon.svg"
                                        alt="logoutIcon"
                                        className='profilePopUpIcons' />Logout
                                </div>
                            </div>
                            }
                        </div>
                    </>
                )
                :
                <Link href="/login" className='linkToLogin'>
                    <div>
                        <span className="requestsIndicatorNuserIconCont">

                            <Image
                                width={20}
                                height={20}
                                src="/images/userAcc.svg"
                                alt="userIcon"
                                className="userAccIcon headerUserAccIcon" />
                            <Image
                                width={20}
                                height={20}
                                src="/images/mobileProfileIcon.svg"
                                alt="profileIcon"
                                className="userAccIcon headerUserAccIcon mobIcon" />

                        </span>
                    </div>
                </Link>
            }
        </>
    )
}

export default UserIcon
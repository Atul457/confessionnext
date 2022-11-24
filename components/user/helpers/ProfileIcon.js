export const ProfileIcon = ({
    profileImg = "",
    isNotFriend = 0,
    email_verified = 0,
    openFrReqModalFn_Post = () => { }
}) => {

    // isNotFriend :
    // 0 : SHOW NOTHING
    // 1 : SHOW REQUEST
    // 2: SHOW CANCEL 
    // 3: ALREADY FRIEND

    let profileImage, profileBPlate;

    profileImage = profileImg !== '' ? profileImg : "/images/userAcc.svg";
    const userIcon = "/images/userAcc.svg"

    const getHtml = () => {

        if (isNotFriend === 1) {
            return <>
                <img
                    src="/images/canBeRequested.svg"
                    type="button"
                    alt="canBeRequested"
                    onClick={openFrReqModalFn_Post}
                    className='registeredUserIndicator' />
                <img
                    src={profileImg !== '' ? profileImg : userIcon}
                    className="userAccIcon generated"
                    onClick={openFrReqModalFn_Post}
                    alt="userProfileImage"
                />
            </>
        }

        if (isNotFriend === 2) {
            return <>
                <img
                    src="/images/alFriends.svg"
                    onClick={openFrReqModalFn_Post}
                    type="button"
                    alt="alreadyFriendsIcon"
                    className='registeredUserIndicator' />
                <img
                    src={profileImg !== '' ? profileImg : "/images/userAcc.svg"}
                    onClick={openFrReqModalFn_Post}
                    className="userAccIcon"
                    alt="userAccIcon"
                />
            </>
        }

        if (isNotFriend === 3) {
            return <>
                <img
                    src="/images/alRequested.svg"
                    type="button"
                    alt="alreadyFriendsIcon"
                    className='registeredUserIndicator' />
                <img
                    src={profileImg !== '' ? profileImg : userIcon}
                    className="userAccIcon"
                    alt="userAccIcon"
                />
            </>
        }

        return <img
            src={profileImage}
            className="userAccIcon"
            alt="userAccIcon" />
    }


    profileBPlate = getHtml();
    if (email_verified === 1)
        profileBPlate = (
            <>
                {profileBPlate}
                <img src="/images/verifiedIcon.svg" title="Verified user" className="verified_user_icon" alt="verified_user_icon" />
            </>)
    return profileBPlate;
}
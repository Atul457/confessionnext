import Image from 'next/image';

export const ProfileIcon = ({
    profileImg = "",
    isNotFriend = 0,
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
                <Image
                    width={20}
                    height={20}
                    src="/images/canBeRequested.svg"
                    type="button"
                    alt="canBeRequested"
                    onClick={openFrReqModalFn_Post}
                    className='registeredUserIndicator' />
                <Image
                    width={20}
                    height={20}
                    src={profileImg !== '' ? profileImg : userIcon}
                    className="userAccIcon generated"
                    onClick={openFrReqModalFn_Post}
                    alt="userProfileImage"
                />
            </>
        }

        if (isNotFriend === 2) {
            return <>
                <Image
                    width={20}
                    height={20}
                    src={alFriends}
                    onClick={openFrReqModalFn_Post}
                    type="button"
                    alt="alreadyFriendsIcon"
                    className='registeredUserIndicator' />
                <Image
                    width={20}
                    height={20}
                    src={profileImg !== '' ? profileImg : userIcon}
                    onClick={openFrReqModalFn_Post}
                    className="userAccIcon"
                    alt="userAccIcon"
                />
            </>
        }

        if (isNotFriend === 3) {
            return <>
                <Image
                    width={20}
                    height={20}
                    src="/images/alRequested.svg"
                    type="button"
                    alt="alreadyFriendsIcon"
                    className='registeredUserIndicator' />
                <Image
                    width={20}
                    height={20}
                    src={profileImg !== '' ? profileImg : userIcon}
                    className="userAccIcon"
                    alt="userAccIcon"
                />
            </>
        }

        return <Image
            width={20}
            height={20}
            src={profileImage}
            className="userAccIcon"
            alt="userAccIcon" />
    }


    profileBPlate = getHtml();
    return profileBPlate;
}
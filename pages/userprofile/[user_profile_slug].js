import React, { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { http } from "../../utils/http";
import Post from "../../components/user/Post";
import { useRouter } from "next/router";
import Badge from "../../components/common/Badge";
import { useSession } from "next-auth/react";
import ReportCommentModal from "../../components/user/modals/ReportCommentModal";
import auth from "../../utils/auth";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import Loader from "../../components/common/Loader";
import AppLogo from "../../components/common/AppLogo";
import { setConfessions } from "../../redux/actions/confession/confessionAc";
import { getConfessionsService } from "../../services/user/services";
import { apiStatus } from "../../utils/api";
import ErrorFlash from "../../components/common/ErrorFlash";
import { isWindowPresent } from "../../utils/checkDom";
import Head from "next/head";
import ReportPostModal from "../../components/user/modals/ReportPostModal";


const { getKeyProfileLoc } = auth;


export default function userProfile(props) {

    // Hooks and vars
    const serverSideData = props?.profile
    const { data: session } = useSession();
    const router = useRouter();
    const user_profile_slug = router?.query?.user_profile_slug
    const unread = useRef();
    const dispatch = useDispatch();
    const [goDownArrow, setGoDownArrow] = useState(false);
    const { confessionReducer, reportPostModalReducer } = useSelector(store => store);
    const [profile, setProfile] = useState(false);
    const confessionRed = confessionReducer.confessions;
    const myConfession = confessionRed?.data;
    const noConfessionsToShow =
        myConfession.length === 0 && confessionRed.status === apiStatus.FULFILLED;
    const confessionsLoading =
        myConfession.length === 0 && confessionRed.status === apiStatus.LOADING;

    useEffect(() => {
        getOthersConfessions();
        return () => {
            dispatch(setConfessions({ reset: true }));
        };
    }, []);


    // Gets profile data
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        async function getOthersProfile() {
            let data = { profile_id: user_profile_slug };

            let obj = {
                data: data,
                token: getKeyProfileLoc("token") ?? "",
                method: "post",
                url: "getotherprofile"
            }

            try {
                const res = await http(obj)
                if (res.data.status === true) {
                    setProfile({
                        ...profile,
                        "isProfileLoading": false,
                        "isProfileErr": false,
                        "profileDetails": res.data.profile,
                    });
                } else {
                    setProfile({
                        ...profile,
                        "isProfileLoading": false,
                        "isProfileErr": false,
                        "message": res.data.message
                    });
                }
            } catch {
                setProfile({
                    ...profile,
                    "isProfileLoading": false,
                    "isProfileErr": true,
                });
            }
        }

        getOthersProfile();
    }, [])


    // Functions


    // Sends friend request
    const sendFriendRequest = async (isCancelling = 0) => {

        let data = {
            friend_id: profile.profileDetails?.profile_id,
            is_cancelled: isCancelling
        }

        let obj = {
            data: data,
            token: getKeyProfileLoc("token"),
            method: "post",
            url: "sendfriendrequest"
        }

        try {
            const res = await http(obj)
            if (res.data.status === true) {
                setProfile({
                    ...profile, "profileDetails":
                    {
                        ...profile.profileDetails,
                        is_requested: isCancelling === 1 ? 0 : 1
                    }
                });
            }
        } catch {
            console.log("Some error occured");
        }
    }

    const getOthersConfessions = (append = false, page = 1) => {
        getConfessionsService({
            page,
            dispatch,
            append,
            profilePage: {
                myProfile: false,
                profile_id: serverSideData.profile_id
            }
        });
    };

    //GET MY CONFESSIONS
    useEffect(() => {
        getOthersConfessions();
    }, []);

    // HANDLES SCROLL TO TOP BUTTON
    useEffect(() => {
        let ref, handleArrow

        if (isWindowPresent()) {

            const isMobile = window.innerWidth < 768;
            ref = isMobile ? document.getElementById("postsWrapper") : document;

            handleArrow = () => {
                let scroll = isMobile
                    ? document.querySelector("#postsWrapper").scrollTop
                    : window?.scrollY;
                if (scroll > 1000) {
                    setGoDownArrow(true);
                } else {
                    setGoDownArrow(false);
                }
            };

            ref?.addEventListener("scroll", handleArrow);
        }

        return () => {
            ref?.removeEventListener("scroll", handleArrow);
        };
    }, [isWindowPresent()]);

    //SCROLLS TO BOTTOM
    const goUp = () => {
        const isMobile = window?.innerWidth < 768;
        let ref = isMobile ? document.getElementById("postsWrapper") : window;
        ref.scrollTo({ top: "0px", behavior: "smooth" });
    };


    const fetchMoreConfessions = () => {
        getOthersConfessions(true, confessionRed?.page + 1);
    };


    if (!serverSideData?.profile_id)
        return <h5 className='w-100'>
            <ErrorFlash message="User Profile not found" />
        </h5>

    return (
        <div className="container-fluid toUp user_profile">

            {serverSideData?.profile_id ?
                <Head>
                    <title>{`${serverSideData.name} - The Talk Place`}</title>
                    <meta property="og:title" content={`${serverSideData?.name} - The Talk Place`} />
                    <meta name="twitter:title" content={`${serverSideData?.name} - The Talk Place`} />
                </Head> : null}

            <div className="row">

                {/* Children to pass */}
                <div className="leftColumn leftColumnFeed mypriflelocc profileSidebar">
                    <div className="leftColumnWrapper">

                        <div className="roundCorners">__</div>
                        <AppLogo />

                        <div className="middleContLoginReg feedMiddleCont profile">
                            <div className="profileDetailsCont">
                                <span className="round11">
                                    <span className="round22">
                                        <span className="round33">
                                            <span className="profilePicCont">
                                                <span className="profilePicCont">
                                                    <img
                                                        src={serverSideData?.image ? serverSideData?.image : "/images/userAcc.png"}
                                                        className="loggedInUserPic"
                                                        type="button"
                                                        alt="profile image"
                                                    />

                                                    {serverSideData?.email_verified === 1 ? (
                                                        <img
                                                            src="/images/verifiedIcon.svg"
                                                            title="Verified user"
                                                            alt="verified_user_icon"
                                                            className="verified_user_icon"
                                                        />
                                                    ) : null}
                                                </span>
                                            </span>
                                        </span>
                                    </span>
                                </span>
                                <span className="loggedInUserName mt-2">
                                    <div className="left">
                                        <span className="firstName">{serverSideData.name}</span>
                                        <Badge points={serverSideData.points} classlist="ml-2" />
                                    </div>
                                </span>


                                {session && <>
                                    {
                                        //FRIENDS
                                        (profile?.profileDetails?.is_friend === 1) ?
                                            <div type="button" className="form-group wProfile contantSupportCont d-flex">
                                                <label className="profilePageLabels">You are now Friend With {serverSideData.name}</label>
                                            </div>
                                            :
                                            //NOT FRIENDS, REQUESTED
                                            (profile?.profileDetails?.is_requested) ?

                                                <div
                                                    type="button"
                                                    className="form-group wProfile contantSupportCont d-flex"
                                                    onClick={() => sendFriendRequest(1)}>
                                                    <label className="profilePageLabels">Cancel Request</label>
                                                    <span>
                                                        <img src="/images/friendsAl.png" alt="friendsAl" className="callingImgProfile" />
                                                    </span>
                                                </div>
                                                :
                                                //NOT REQUESTED
                                                <div
                                                    type="button"
                                                    className="form-group wProfile contantSupportCont d-flex" onClick={() => sendFriendRequest(0)}>
                                                    <label className="profilePageLabels">Send Friend Request</label>
                                                    <span>
                                                        <img src="/images/addFriendIconP.png" alt="addFriendIconP" className="callingImgProfile" />
                                                    </span>
                                                </div>
                                    }
                                </>}
                                <div className="pt-0 otherProfileVerbiage my-2">
                                    * Only Public posts are shown here
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                {/* Children to pass */}

                <div className="postsHeadingProfile profile">
                    {serverSideData.name}'s Posts
                </div>

                <div
                    className="thoughtsNrequestsCont container-fluid profile"
                    id="postsWrapper"
                >
                    <div className="row w-100 mx-0">
                        <div className="col-12 container-fluid">
                            <div className="row flex-column-reverse flex-md-row">
                                <div
                                    className={`col-12 w-100 transition p-0`}
                                >
                                    {/* MYCONFESSIONS */}

                                    {confessionsLoading ? (
                                        <div className="text-center">
                                            <Loader size="sm" className="mx-auto" />
                                        </div>
                                    ) : noConfessionsToShow ? (
                                        <h5 className="endListMessage noConfessions mx-auto">
                                            {parseInt(unread.current?.value) === 1 ?
                                                "No post found" :
                                                "You haven't created any post"}
                                        </h5>
                                    ) :
                                        <InfiniteScroll
                                            dataLength={myConfession.length}
                                            hasMore={myConfession.length < confessionRed?.count}
                                            scrollableTarget={`${isWindowPresent() && window.innerWidth - 13 > 768 ? "" : "postsWrapper"
                                                }`}
                                            endMessage={
                                                <div className="endListMessage mt-4 pb-3 text-center">
                                                    End of Confessions
                                                </div>
                                            }
                                            next={fetchMoreConfessions}
                                            loader={
                                                <div className="w-100 text-center">
                                                    <div
                                                        className="spinner-border pColor mt-4"
                                                        role="status"
                                                    >
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            {myConfession.map((post, index) => {
                                                return (
                                                    <Post
                                                        key={post?.confession_id}
                                                        profileImg={serverSideData?.image}
                                                        post={{
                                                            ...post,
                                                            index,
                                                            dispatch,
                                                            deletable: false,
                                                            profileImg: serverSideData?.image
                                                        }}
                                                        userDetails={session}
                                                    />
                                                );
                                            })}
                                        </InfiniteScroll>
                                    }

                                    {/* End of myconfessions */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Right side component */}

                {/* REFRESH BUTTON */}
                {/* {commentsModal.visibility === false && changes && <RefreshButton />} */}

                <i
                    className={`fa fa-arrow-circle-o-up d-none goUpArrow ${goDownArrow === true ? "d-block" : ""
                        }`}
                    aria-hidden="true"
                    type="button"
                    onClick={goUp}
                ></i>
            </div>

            {/* Modals */}

            {/* Report Comment modal */}
            <ReportCommentModal />

            {/* ReportCommentModal */}
            {reportPostModalReducer.visible && (
                <ReportPostModal />)
            }
            {/* Modals */}
        </div >
    );
}

userProfile.additionalProps = {
    serverSidePage: true,
    removeDefaultMeta: true,
    profilePage: true
};


export async function getServerSideProps(context) {

    const user_profile_slug = context.query.user_profile_slug
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );
    let profile = {}

    const getOthersProfile = async () => {
        let data = { profile_id: user_profile_slug };
        let obj = {
            data: data,
            token: "",
            method: "post",
            url: "getotherprofile"
        }

        try {
            const res = await http(obj)
            if (res.data.status === true)
                profile = res.data.profile
        } catch (err) {
            console.log(err?.message)
        }
    }

    await getOthersProfile()

    return {
        props: {
            profile,
            session
        }
    }
}
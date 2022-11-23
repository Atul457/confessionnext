import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import Lightbox from "react-awesome-lightbox";
import InfiniteScroll from "react-infinite-scroll-component";
import _ from 'lodash';
import TextareaAutosize from 'react-textarea-autosize';
import { useDispatch, useSelector } from 'react-redux';
import { closeCModal, resetCModal, updateCModalState } from '../../../redux/actions/commentsModal';
import { togglemenu, toggleSharekitMenu } from '../../../redux/actions/share';
import { openCFRModal } from '../../../redux/actions/friendReqModal';
import { toggleReportPostModal } from '../../../redux/actions/reportPostModal';
import { searchAcFn } from '../../../redux/actions/searchAc/searchAc';
import auth from '../../../utils/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { http } from '../../../utils/http';
import { ProfileIcon } from '../helpers/ProfileIcon';
import Comments from '../comments/Comments';
import useShareKit from '../../../utils/hooks/useShareKit';
import { dateConverter } from '../../../utils/helpers';
import useShareRequestPopUp from '../../../utils/hooks/useShareRequestPopUp';

const { authCheck, getKeyProfileLoc, updateKeyProfileLoc, getToken } = auth

const checkIsViewPage = (hook) => {
    let path = hook.pathname;
    path = path.split('/');
    return path.length === 3 && path[1] === 'confession';
}

export default function CommentGotModal({ categories, ...rest }) {

    let maxChar = 2000;
    const router = useRouter()
    const dispatch = useDispatch();
    const path = checkIsViewPage(router)
    const history = router.push;
    const { state } = useSelector(state => state.commentsModalReducer);
    const [userDetails] = useState(false);
    const [confessionData, setConfessionData] = useState(false);
    const [shareReqPopUp, toggleShareReqPopUp, ShareRequestPopUp, closeShareReqPopUp] = useShareRequestPopUp();
    const [sharekit, toggleSharekit, ShareKit, hideShareKit] = useShareKit();
    const [isWaitingRes, setIsWaitingRes] = useState(true);
    const [isServerErr] = useState(false);
    const [isValidPost, setIsValidPost] = useState(true);   //MEANS STATUS IS OK BUT GOT NO RES
    const [comment, setComment] = useState('');
    const [commentsData, setCommentsData] = useState({ page: 1 });
    const [postId, setPostId] = useState('');
    const [requiredError, setRequiredError] = useState('');
    const [commentsArr, setCommentsArr] = useState([]);
    const [lightBox, setLightBox] = useState(false);
    const [changeState, setChangeState] = useState(true);
    const [commentsCount, setCommentsCount] = useState(0);
    const [goDownArrow, setGoDownArrow] = useState(false);
    const ShareReducer = useSelector(store => store.ShareReducer);
    const isCoverTypePost = state.category_id === 0
    const postBg = isCoverTypePost ? {
        backgroundImage: `url('${state?.cover_image}')`,
        name: "post"
    } : {}

    const _doComment = async (comment_id = false, editedComment = "") => {

        var arr, _comment, userData;

        userData = getToken();

        if (comment_id === false)       //NEW COMMENT
        {
            setRequiredError('');
            if (comment === '') {
                setRequiredError('This field is required');
                return false;
            }
            _comment = comment;
            setComment("");
            arr = {
                "confession_id": postId,
                "comment": _comment,
                "comment_id": ""
            }
        } else      //UPDATE COMMENT
        {
            _comment = editedComment;
            arr = {
                "confession_id": postId,
                "comment": _comment,
                "comment_id": comment_id
            }
        }

        let obj = {
            data: arr,
            token: userData,
            method: "post",
            url: "postcomment"
        }

        try {
            const response = await http(obj)
            if (response.data.status === true) {

                setComment("");
                changeState ? setChangeState(false) : setChangeState(true);

                updateKeyProfileLoc("comments", parseInt(getKeyProfileLoc("comments") ?? 0) + 1)

                //APPENDS DATA ONLY WHEN YOU ARE ON THE LAST PAGE OF THE COMMENTS
                var pageSize, totalPages;
                pageSize = 20;
                totalPages = Math.ceil(commentsCount / pageSize);
                totalPages = totalPages === 0 ? (totalPages + 1) : totalPages;
                rest.handleChanges(true);

                if (totalPages === commentsData.page && comment_id === false)   //APPENDS
                {
                    var newComment, commentsArrDummy;
                    newComment = {};
                    newComment = response.data.comment;
                    commentsArrDummy = [];
                    commentsArrDummy = commentsArr;
                    commentsArrDummy.push(newComment);
                    setCommentsArr(commentsArrDummy);
                    dispatch(updateCModalState({ no_of_comments: parseInt(state.no_of_comments) + 1 }))
                }
                else if (comment_id === false)  //JUST INCREMENTS THE COMMENT COUNT
                {
                    dispatch(updateCModalState({ no_of_comments: parseInt(state.no_of_comments) + 1 }))
                }
                else    //UPDATES
                {
                    var arr = commentsArr.map((curr) => {
                        if (curr.comment_id === comment_id) {
                            return { ...curr, "comment": _comment };
                        } else {
                            return curr;
                        }
                    });

                    setCommentsArr(arr);
                }

            } else {
                setRequiredError(response.data.message);
            }
        }
        catch {
            console.log('some error occured');
        }
    }

    const doComment = _.debounce(_doComment, 500);

    useEffect(() => {
        setConfessionData({
            confession_id: state.postId,
            category_name: state.category_name,
            created_by: state.created_by,
            created_at: state.created_at,
            description: state.description,
            no_of_comments: state.no_of_comments,
            post_as_anonymous: state.post_as_anonymous,
            profile_image: state.profile_image,
            user_id: state.user_id,
            viewcount: state.viewcount,
            image: state.image
        });

        setPostId(state.postId);
        setIsValidPost(true);
        setIsWaitingRes(false);
    }, [state.postId])


    const commentsOnCconfession = async (page = 1, append = false) => {
        let pageNo = page;

        let token;
        if (auth()) {
            token = localStorage.getItem("userDetails");
            token = JSON.parse(token);
            token = token.token;
        } else {
            token = "";
        }

        let data = {
            "confession_id": state.postId,
            "page": pageNo
        }

        let obj = {
            data: data,
            token: token,
            method: "post",
            url: "getcomments"
        }
        try {
            const res = await http(obj)
            if (res.data.status === true) {
                if (append === true) {
                    let newConf = [...commentsArr, ...res.data.body.comments];
                    setCommentsData({ page: pageNo });
                    setCommentsArr(newConf);
                } else {
                    setCommentsCount(res.data.body.count);
                    setCommentsArr(res.data.body.comments);
                }
            }
        } catch {
            console.log("something went wrong");
        }
    }


    useEffect(() => {
        commentsOnCconfession();
    }, [state.postId])


    // SUBMITS THE DATA ON ENTER AND CREATES A NEW PARA ON SHIFT+ENTER KEY
    const checkKeyPressed = (event) => {
        if (window.innerWidth > 767) {
            if (event.keyCode === 13 && !event.shiftKey) {
                event.preventDefault();
                doComment();
            }
        }
    }


    const fetchMoreComments = () => {
        commentsOnCconfession((commentsData.page + 1), true);
    }

    // HANDLES SCROLL TO TOP BUTTON
    useEffect(() => {
        if (document.querySelector("#postsMainCont")) {
            let scroll = document.querySelector("#postsMainCont") ?
                document.querySelector("#postsMainCont").scrollTop :
                0;
            if (scroll > 800) {
                setGoDownArrow(true);
            } else {
                setGoDownArrow(false);
            }
        }
    }, [isValidPost])


    const goUp = () => {
        document.querySelector("#postsMainCont").scrollTo({ top: "0px", behavior: "smooth" });
    }

    //SCROLLS TO TOP
    const handleScrollTo = () => {
        let scroll = document.querySelector("#postsMainCont") ?
            document.querySelector("#postsMainCont").scrollTop :
            0;
        if (scroll > 800) {
            setGoDownArrow(true);
        } else {
            setGoDownArrow(false);
        }
    }


    const updateComment = (commentData) => {
        doComment(commentData.comment_id, commentData.comment);
    }


    const updateComments = (commentId, count) => {
        setCommentsCount((prevState) => prevState - 1);
        let newCommentsArr = commentsArr.filter((current) => {
            if (commentId !== current.comment_id) {
                return current;
            }
        })

        setCommentsArr(newCommentsArr);
        dispatch(updateCModalState({ no_of_comments: parseInt(state.no_of_comments) - count }))
    }


    const closeModal = () => {
        let upvoteDownvoteData = {}, viewData, likeDislikeCheck, isViewedCheck, data;
        // CHECKS CHANGES IN UPVOTE AND DOWNVOTE
        likeDislikeCheck = state.is_liked_prev === 0 && state.is_liked_prev !== state.is_liked;
        // CHECKS WHETHER THE POST WAS UNVIEWED OR VIEWED
        isViewedCheck = state.is_viewed === 0;
        if (likeDislikeCheck === true) {
            upvoteDownvoteData = {
                like: state.like,
                dislike: state.dislike,
                is_liked: state.is_liked,
            }
        }

        viewData = {
            viewcount: state.viewcount + 1,
            is_viewed: 1,
        }

        data = {
            ...(isViewedCheck && viewData),
            ...(likeDislikeCheck && upvoteDownvoteData),
            no_of_comments: state.no_of_comments,
            isReported: state.isReported
        }

        // RUNS THE UPDATECONFESSIONDATA FUNCTION DEFINED IN POST.JS
        state.updateConfessionData(state.index, data);

        if (path) history("/home");

        dispatch(resetCModal())
    }


    const _toggleShareReqPopUp = (id, value) => {

        dispatch(togglemenu({
            id, value,
        }))

        dispatch(
            toggleSharekitMenu(false)
        )

        if (sharekit) {
            hideShareKit();
        } else {
            toggleShareReqPopUp();

            if (shareReqPopUp === true) {
                hideShareKit();
            }
        }

    }

    const _toggleSharekit = (id, value) => {
        dispatch(
            toggleSharekitMenu(value)
        )
        dispatch(togglemenu({
            id, value: false
        }))

        if (shareReqPopUp) {
            closeShareReqPopUp();
        }
        toggleSharekit();

    }

    const closeShareMenu = () => {
        dispatch(togglemenu({
            id: null, value: false
        }))
    }


    const openFrReqModalFn_Post = () => {
        dispatch(openCFRModal({
            index: state.index,
            cancelReq: state.isNotFriend === 2 ? true : false,
            userId: state.user_id
        }))
        dispatch(closeCModal())
    }

    const upvoteOrDownvote = async (isLiked) => {

        let is_liked, ip_address, check_ip, token = '', data;
        is_liked = isLiked ? 1 : 2;
        ip_address = localStorage.getItem("ip")
        check_ip = ip_address.split(".").length
        if (auth()) {
            token = localStorage.getItem("userDetails");
            token = JSON.parse(token).token;
        }

        if (check_ip === 4) {
            let obj = {
                data: { is_liked, ip_address },
                token: token,
                method: "post",
                url: `likedislike/${state.postId}`
            }
            try {
                data = {
                    like: isLiked ? state.like + 1 : state.like - 1,
                    is_liked: isLiked ? 1 : 2
                }
                rest.updatedConfessions(state.index, data)
                dispatch(updateCModalState(data))

                const res = await http(obj)

                if (res.data.status === true) {

                } else {
                    console.log(res);
                }
            } catch (error) {
                console.log(error);
                console.log("Some error occured");
            }
        } else {
            console.log("Invalid ip");
        }
    }

    const updateSingleCommentData = (data, index) => {
        let updatedNode, originalArray;
        originalArray = [...commentsArr];
        updatedNode = {};
        updatedNode = { ...updatedNode, ...commentsArr[index], ...data };
        originalArray.splice(index, 1, updatedNode);
        setCommentsArr(originalArray);
    }

    // Open the modal to report the post
    const openReportPostModal = () => {
        dispatch(closeCModal())
        dispatch(toggleReportPostModal({
            visible: true,
            isReported: state.isReported,
            data: {
                isFiredFromModal: true,
                confessionId: state.postId,
                postIndex: state.index
            }
        }))
    }


    return (
        <>
            <Modal show={state.visibility} size="lg" className="commentsModal" onHide={closeModal}>
                <Modal.Header className='justify-content-between'>
                    <h6>Comments</h6>
                    <span onClick={closeModal} type="button">
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </span>
                </Modal.Header>
                <Modal.Body className="privacyBody pt-0 commentsGot">
                    <div className="container-fluid postWrapperCommentsModal">
                        {confessionData
                            ?
                            <div className="row commentsNlightboxWrapper">
                                {lightBox && (
                                    confessionData.image && ((confessionData.image).length !== 0 && ((confessionData.image).length > 1
                                        ?
                                        (<Lightbox images={confessionData.image} onClose={() => { setLightBox(false) }} />)     //MULTIPLE IMAGES
                                        :
                                        (<Lightbox image={confessionData.image} onClose={() => { setLightBox(false) }} />)))    //SINGLE IMAGE
                                )}
                                <div className="container py-md-4 p-1">
                                    <div className="row forPosSticky">

                                        {/* MIDDLECONTAINER */}

                                        {isWaitingRes
                                            ?
                                            <section className="col-lg-12 col-md-12 col-12 mt-3 mt-lg-0">
                                                <div className="spinner-border pColor spinnerSizeFeed" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </section>
                                            :
                                            (isServerErr
                                                ?
                                                (<section className="col-lg-12 col-md-8 col-12 pt-1 mt-lg-0">
                                                    <div className="alert alert-danger" role="alert">
                                                        Server Error.. Please try again
                                                    </div>
                                                </section>)
                                                :
                                                (
                                                    <section className="sharekitWrapper col-lg-12 col-md-12 col-12 mt-3 mt-lg-0 px-0 px-md-3">

                                                        {(auth() && state.isReported !== 2) && <span className="reportPost" onClick={openReportPostModal}>
                                                            <i className="fa fa-exclamation-circle reportComIcon" aria-hidden="true"></i>
                                                        </span>}

                                                        <span
                                                            type="button"
                                                            className={`sharekitdots resetRightModal ${sharekit === false ? "justify-content-end" : ""}`}
                                                            onClick={() => _toggleShareReqPopUp(state.postId, ShareReducer.selectedPost?.id === state.postId ? !ShareReducer.selectedPost?.value : true)}>
                                                            {ShareReducer &&
                                                                ShareReducer.selectedPost?.id === state.postId &&
                                                                ShareReducer.sharekitShow &&
                                                                <ShareKit
                                                                    postData={{
                                                                        confession_id: state.slug,
                                                                        description: state.postedComment,
                                                                    }}
                                                                    closeShareReqPopUp={closeShareReqPopUp} />}
                                                            <Image
                                                                width={20}
                                                                height={20}
                                                                src="/images/shareKitIcon.png" className="shareKitImgIcon" />
                                                        </span>

                                                        {ShareReducer &&
                                                            ShareReducer.selectedPost?.id === state.postId &&
                                                            ShareReducer.selectedPost?.value === true &&
                                                            <ShareRequestPopUp
                                                                toggleSharekit={
                                                                    () => _toggleSharekit(state.postId, !ShareReducer.sharekitShow?.value)
                                                                }
                                                                isNotFriend={state.isNotFriend}
                                                                openFrReqModalFn={openFrReqModalFn_Post}
                                                                closeShareMenu={closeShareMenu}
                                                            />}

                                                        {isValidPost ? <div className="postCont modalPostCont">
                                                            {sharekit &&
                                                                <div className="shareKitSpace"></div>}
                                                            <div className="postContHeader justify-content-start">
                                                                <span className="userImage userImageFeed">
                                                                    <ProfileIcon
                                                                        openFrReqModalFn_Post={openFrReqModalFn_Post}
                                                                        profileImg={state.profile_image} isNotFriend={state.isNotFriend} />
                                                                    {/* {ProfileIcon(state.profile_image, state.isNotFriend)} */}
                                                                </span>

                                                                {confessionData.post_as_anonymous === 1
                                                                    ? <span className="userName postUserName">
                                                                        {confessionData.created_by}
                                                                    </span> :
                                                                    <Link className={`textDecNone postUserName`}
                                                                        to={confessionData.post_as_anonymous === 0 &&
                                                                            (auth() ? (userDetails.profile.user_id === confessionData.user_id ? `/profile` : `/userprofile?user=${confessionData.user_id}`) : `/userprofile?user=${confessionData.user_id}`)
                                                                        }>
                                                                        <span className="userName removeElipses">
                                                                            {confessionData.post_as_anonymous === 1 ? "Anonymous ." : confessionData.created_by}
                                                                        </span>
                                                                    </Link>}

                                                                {!isCoverTypePost && <span className="catCommentBtnCont">
                                                                    <div className="categoryOfUser">{(confessionData.category_name).charAt(0) + (confessionData.category_name).slice(1).toLowerCase()}</div>
                                                                </span>}

                                                                <span className="postCreatedTime">
                                                                    {dateConverter(confessionData.created_at ?? state.created_at)}
                                                                </span>
                                                            </div>
                                                            <div
                                                                className={`postBody ${isCoverTypePost ? 'coverTypePost' : ''}`}
                                                                style={postBg}>
                                                                <div className="postedPost">
                                                                    <pre className="preToNormal">
                                                                        {confessionData.description}
                                                                    </pre>
                                                                </div>
                                                            </div>


                                                            {(confessionData.image !== null && (confessionData.image).length > 0)
                                                                &&
                                                                (
                                                                    <div className="form-group imgPreviewCont">
                                                                        <div className="imgContForPreviewImg fetched" type="button" onClick={() => { setLightBox(true) }} >
                                                                            {(confessionData.image).map((src) => {
                                                                                return (<span className='uploadeImgWrapper fetched'>
                                                                                    <Image width={20} height={20} src={src} alt="" className="previewImg" />
                                                                                </span>)

                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )

                                                            }

                                                            {auth() === true &&
                                                                <div className="container-fluid inputWithForwardCont">
                                                                    <div className="inputToAddComment textAreaToComment mb-1 my-md-0">
                                                                        <TextareaAutosize type="text" maxLength={maxChar} row='1' value={comment} onKeyDown={(e) => { checkKeyPressed(e) }} onChange={(e) => { setComment(e.target.value) }} className="form-control"></TextareaAutosize>

                                                                    </div>
                                                                    <div className="arrowToAddComment" type="button" id="commentsModalDoComment" onClick={() => { doComment() }}>
                                                                        <Image width={20} height={20} src="/images/forwardIcon.svg" alt="" className="forwardIconContImg" />
                                                                    </div>
                                                                </div>
                                                            }
                                                            <span className="d-block text-left errorCont text-danger mb-2 moveUp">{requiredError}</span>


                                                            <div className="postFoot commmentsGotModal">

                                                                {auth() === false &&
                                                                    <span className="feedPageLoginBtnCont postLoginBtnCont">
                                                                        <Link to="/login">
                                                                            <div className="categoryOfUser enhancedStyle" type="button">
                                                                                Login to comment
                                                                            </div>
                                                                        </Link>
                                                                    </span>}

                                                                <div className={`iconsCont ${auth() === false ? 'mainDesignOnWrap' : ''}`}>
                                                                    <div className="upvote_downvote_icons_cont  ml-0" type="button">
                                                                        <Image width={20} height={20} src="/images/commentCountIcon.svg" alt="commentCountIcon" />
                                                                        <span className="count">
                                                                            {state.no_of_comments}
                                                                        </span>
                                                                    </div>


                                                                    {(state.hasOwnProperty("is_liked")
                                                                        ?
                                                                        <div className='iconsMainCont'>
                                                                            <div className={`upvote_downvote_icons_cont buttonType`}>
                                                                                {state.is_liked === 1 ?
                                                                                    <Image
                                                                                        width={20}
                                                                                        height={20}
                                                                                        src="/images/upvoted.svg" alt="upvoted"
                                                                                        onClick={() => upvoteOrDownvote(false)} /> :
                                                                                    <Image
                                                                                        width={20}
                                                                                        height={20}
                                                                                        src="/images/upvote.svg"
                                                                                        alt="upvote"
                                                                                        onClick={() => upvoteOrDownvote(true)} />}
                                                                                <span className='count'>{state.like}</span>
                                                                            </div>
                                                                        </div>
                                                                        :
                                                                        <div className='iconsMainCont'>
                                                                            <div className={`upvote_downvote_icons_cont`}>
                                                                                <Image
                                                                                    width={20}
                                                                                    height={20}
                                                                                    src="/images/upvote.svg" alt="upvote" />
                                                                                <span className='count'>{state.like}</span>
                                                                            </div>
                                                                        </div>)}

                                                                </div>
                                                            </div>
                                                        </div>
                                                            :
                                                            <div className="alert alert-danger" role="alert">
                                                                The post doesn't exists
                                                            </div>}

                                                        {isValidPost && <div className="postsMainCont" id="postsMainCont">
                                                            {commentsArr.length > 0
                                                                ?
                                                                <InfiniteScroll
                                                                    onScroll={handleScrollTo}
                                                                    className="commentsModalIscroll"
                                                                    scrollableTarget="postsMainCont"
                                                                    endMessage={
                                                                        <div className="endListMessage mt-2 pb-0">
                                                                            End of Comments,
                                                                            <span
                                                                                className='closeBackButton'
                                                                                onClick={closeModal}>
                                                                                Go back
                                                                            </span>
                                                                        </div>
                                                                    }
                                                                    dataLength={commentsArr.length}
                                                                    next={fetchMoreComments}
                                                                    hasMore={commentsArr.length < commentsCount}
                                                                    loader={
                                                                        <div className="w-100 text-center">
                                                                            <div className="spinner-border pColor mt-4" role="status">
                                                                                <span className="sr-only">Loading...</span>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                >
                                                                    {commentsArr.map((post, index) => {
                                                                        return <Comments
                                                                            isReported={post.isReported}
                                                                            isLastIndex={commentsArr.length === index + 1}
                                                                            updateSingleCommentData
                                                                            ={updateSingleCommentData}
                                                                            index={index}
                                                                            updateComments={updateComments}
                                                                            postId={postId}
                                                                            updateComment={updateComment}
                                                                            created_at={post.created_at}
                                                                            commentId={post.comment_id}
                                                                            countChild={post.countChild}
                                                                            is_editable={post.is_editable}
                                                                            curid={(post.user_id === '' || post.user_id === 0) ? false : post.user_id}
                                                                            key={"Arr" + index + postId + "dp"}
                                                                            imgUrl={post.profile_image}
                                                                            userName={post.comment_by}
                                                                            postedComment={post.comment} />

                                                                    })}
                                                                </InfiniteScroll>
                                                                : <div className="endListMessage m-0 pb-1">End of Comments,
                                                                    <span
                                                                        className='closeBackButton'
                                                                        onClick={closeModal}>
                                                                        Go back
                                                                    </span>
                                                                </div>}

                                                        </div>}

                                                    </section>
                                                )
                                            )}

                                        {/* MIDDLECONTAINER */}
                                    </div>
                                </div>
                                <i className={`fa fa-arrow-circle-o-up commentsModalGoUpArrow ${goDownArrow === true ? "d-block" : "d-none"}`} aria-hidden="true" type="button" onClick={goUp}></i>
                            </div>
                            :
                            <div className="w-100 text-center d-none">
                                <div className="spinner-border pColor mt-4" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        }

                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

import React from 'react'
import { Link } from 'react-router-dom'
import parse from 'html-react-parser';

// Helpers
import DateConverter from '../../../../helpers/DateConverter'
import { deleteForumCommService, doCommentService, getUsersToTagService, likeDislikeService } from '../../services/forumServices'
import { profileLinkToVisit } from '../../../../helpers/helpers';

// Image imports
import userIcon from "../../../../images/userAcc.svg"
import commentReplyIcon from "../../../../images/creplyIcon.svg"
import upvoted from "../../../../images/upvoted.svg"
import verifiedIcon from "../../../../images/verifiedIcon.svg"
import upvote from "../../../../images/upvote.svg"
import editCommentIcon from "../../../../images/editCommentIcon.svg"

// Redux
import { forumHandlers, postComment, reportForumCommAcFn, usersToTagAcFn } from '../../../../redux/actions/forumsAc/forumsAc'

// Component imports
import CommentBox from '../CommentBox'
import { apiStatus } from '../../../../helpers/status'
import { reportedFormStatus } from './ForumCommProvider'
import Badge from '../../../../common/components/badges/Badge';


const ForumSubComment = (props) => {

    // Hooks and vars
    const {
        comment: currSubComment,
        usersToTag,
        auth,
        loggedInUserId,
        dispatch,
        toSearch,
        commentBox: { commentId: activeComBoxId },
        updateBox: { commentId: activeUpdateComBoxId },
        doCommentVars,
        rootDetails,
        isAllowedToComment
    } = props

    let {
        comment_by,
        created_at,
        profile_image = "",
        user_id = false,
        comment_id: commentId,
        subCommentIndex,
        isReported,
        is_liked = 0,
        like = 0
    } = currSubComment

    const { handleCommentsAcFn } = forumHandlers,
        isMyComment = loggedInUserId === user_id,
        isCommentBoxVisible = auth() && commentId === activeComBoxId,
        isUpdateComBoxVisible = auth() && activeUpdateComBoxId === commentId

    const {
        navigate,
        forum_id,
        commentsCount,
        page,
        postCommentReducer,
    } = doCommentVars


    // Functions

    // Opens report forum comment modal
    const openReportCommentModal = () => {
        dispatch(reportForumCommAcFn({
            visible: true,
            status: apiStatus.IDLE,
            message: "",
            data: {
                forum_id,
                is_for_subcomment: false,
                parent_comment_index: rootDetails?.commentIndex,
                comment_index: subCommentIndex,
                comment_id: commentId,
                isReported: isReported === reportedFormStatus.reported,
                is_for_subcomment: true
            }
        }))
    }

    // Like dislike
    const upvoteOrDownvote = async (isLiked) => {
        likeDislikeService({
            isLiked,
            dispatch,
            like,
            forum_id,
            parent_comment_index: rootDetails?.commentIndex,
            is_for_sub_comment: true,
            commentIndex: subCommentIndex,
            commentId
        })
    }
    // Open update comment box
    const openUpdateComBox = () => {
        dispatch(handleCommentsAcFn({
            updateBox: {
                ...(!isUpdateComBoxVisible && { commentId })
            },
            commentBox: {}
        }))
        dispatch(usersToTagAcFn({
            data: [],
            status: apiStatus.IDLE,
            strToSearch: "",
            isCalledByParent: false
        }))
    }

    // Do comment
    const doComment = (commentBoxRef, updateComment = false) => {
        doCommentService({
            commentBoxRef,
            postComment,
            dispatch,
            postComment,
            ...(updateComment === true && {
                updateComment,
                commentId
            }),
            navigate,
            isSubComment: true,
            forum_id,
            usedById: commentId,
            parent_root_info: {
                parent_id: commentId,
                root_id: rootDetails?.commentId,
                parentIndex: rootDetails?.commentIndex
            },
            subCommentIndex,
            commentsCount,
            page
        })
    }

    const getUsersToTag = async string => {
        let strToSearch = null;
        const regex = /(^@|(\s@))((\w+)?)$/;
        var result = regex.exec(string);

        if (result) strToSearch = result[0]?.trim().replace("@", "");
        else strToSearch = null;

        if (strToSearch || strToSearch === "") {
            getUsersToTagService({
                strToSearch: strToSearch,
                forum_id,
                dispatch
            })
        } else {
            if (usersToTag?.data.length)
                dispatch(usersToTagAcFn({
                    data: [],
                    status: apiStatus.IDLE,
                    toSearch: ""
                }))
        }
    }


    // DELETES THE COMMENT
    const deleteCommentFunc = async () => {
        deleteForumCommService({
            postComment,
            dispatch,
            forum_id,
            isSubComment: true,
            commentId: commentId,
            parent_comment_index: rootDetails?.commentIndex,
            comment_index: subCommentIndex
        })
    }

    // Toggles reply btn and comment/edit comment field
    const toggleReplyBtn = () => {
        dispatch(handleCommentsAcFn({
            commentBox: {
                ...(!isCommentBoxVisible && { commentId })
            },
            updateBox: {}
        }))
        dispatch(usersToTagAcFn({
            data: [],
            status: apiStatus.IDLE,
            strToSearch: "",
            isCalledByParent: false
        }))
    }

    const goToReferedComment = (e, comment_id) => {
        e.target.closest(`.abc${comment_id}`).scrollIntoView({
            block: "end",
            behavior: "smooth"
        })
    }

    profile_image = profile_image === "" ? userIcon : profile_image

    return (
        <div className={`postCont overWritePostWithComment subcommentCont upperView ${currSubComment?.id_path ?? ""}`} index={subCommentIndex}>

            {(auth && currSubComment?.is_editable === 1) ?
                <div className='edit_delete_com_forum'>
                    <i className="fa fa-trash deleteCommentIcon" type="button" aria-hidden="true" onClick={deleteCommentFunc}></i>
                    {!isUpdateComBoxVisible ? <img src={editCommentIcon} className='editCommentIcon' onClick={openUpdateComBox} /> : null}
                </div>
                : null}

            {/* Report comment */}
            {(auth() && isReported !== 2) && <span className="reportPost" onClick={openReportCommentModal}>
                <i className="fa fa-exclamation-circle reportComIcon" aria-hidden="true"></i>
            </span>}
            {/* Report comment */}

            <div className="postContHeader commentsContHeader">
                <span className="commentsGotProfileImg">
                    <img src={profile_image} alt="user_profile_image" />
                    {currSubComment?.email_verified === 1 ?
                        <img src={verifiedIcon} title="Verified user" alt="verified_user_icon" className='verified_user_icon' /> : null}
                </span>

                {currSubComment?.userslug && currSubComment?.userslug !== "" ?
                    <Link className={`forum_com_p_link`}
                        to={profileLinkToVisit(currSubComment)}>
                        <span className="userName">
                            {comment_by}
                        </span>
                    </Link>
                    :
                    (<span className="userName">
                        {comment_by}
                    </span>)
                }

                <Badge points={currSubComment?.points} classlist="ml-2" />

                <span className="postCreatedTime">
                    {created_at ? DateConverter(created_at) : null}
                </span>
            </div>

            <div className="postBody">

                {Object.keys(currSubComment?.parent_comment ?? {})?.length ?
                    <div className="mb-2 pb-2 replied_to_cont cursor_pointer" onClick={(e) => goToReferedComment(e, currSubComment?.parent_comment?.comment_id)} >
                        <div className="d-flex align-items-center ">
                            <i className="fa fa-quote-left pr-1 pb-2" aria-hidden="true"></i>
                            <span className="mb-1 font-italic">{parse(currSubComment?.parent_comment?.comment)}</span>
                            <i className="fa fa-quote-right pl-1 pb-2" aria-hidden="true"></i>
                        </div>
                        <small >{currSubComment?.parent_comment?.comment_by}</small>
                    </div> : null}


                <div className="postedPost mb-0">
                    {currSubComment?.is_edited === 1 ? <i className="fa fa-pencil pr-2" aria-hidden="true"></i> : null}
                    <pre className="preToNormal">
                        {parse(currSubComment?.comment)}
                    </pre>

                    {/* Update box */}
                    {isUpdateComBoxVisible ? <CommentBox
                        dispatch={dispatch}
                        toSearch={toSearch}
                        usersToTag={usersToTag}
                        getUsersToTag={getUsersToTag}
                        usedById={commentId}
                        isForUpdateCom={true}
                        postCommentReducer={postCommentReducer}
                        doComment={doComment} /> : null}
                    {/* Update box */}


                    {isAllowedToComment &&
                        <div className="replyCont">
                            <span className="reply_btn">
                                <div onClick={toggleReplyBtn}>
                                    <img src={commentReplyIcon} alt="" className='replyIcon' />
                                    <span className='pl-2'>Reply</span>
                                </div>


                                {/* like dislike */}
                                {
                                    <div className='iconsMainCont'>
                                        <div className={`upvote_downvote_icons_cont buttonType`}>
                                            {is_liked === 1 ?
                                                <img src={upvoted} alt="" onClick={() => upvoteOrDownvote(false)} /> :
                                                <img src={upvote} alt="" onClick={() => upvoteOrDownvote(true)} />}
                                            <span className='count'>{like}</span>
                                        </div>
                                    </div>
                                }
                                {/* like dislike */}

                            </span>

                            {isCommentBoxVisible ?
                                <CommentBox
                                    getUsersToTag={getUsersToTag}
                                    usersToTag={usersToTag}
                                    dispatch={dispatch}
                                    toSearch={toSearch}
                                    auth={auth}
                                    usedById={commentId}
                                    postCommentReducer={postCommentReducer}
                                    doComment={doComment} /> :
                                null}
                        </div>}
                </div>
            </div>
        </div >
    )
}

export default ForumSubComment
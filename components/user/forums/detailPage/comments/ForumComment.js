import React, { useEffect } from 'react'
import parse from 'html-react-parser';
import Link from 'next/link';

// Helpers
import { dateConverter, profileLinkToVisit } from '../../../../../utils/helpers';
import { reportedFormStatus } from './ForumCommProvider';
import auth from '../../../../../utils/auth';
import { http } from '../../../../../utils/http';
import { apiStatus } from '../../../../../utils/api';

// Component imports
import ForumSubComments from './ForumSubComments'
import Badge from '../../../../common/Badge';

// HelperComp function
import { deleteForumCommService, doCommentService, getUsersToTagService, likeDislikeService } from '../../services/forumServices'
import CommentBox from '../CommentBox'
import { forumHandlers, postComment, reportForumCommAcFn, usersToTagAcFn } from '../../../../../redux/actions/forumsAc/forumsAc';

// Redux

const { getKeyProfileLoc } = auth

const ForumComment = (props) => {

  // Hooks and vars
  const {
    comment: currComment,
    loggedInUserId,
    toSearch,
    usersToTag,
    postComment: postCommentReducer,
    dispatch,
    navigate,
    commentsCount,
    page,
    isAllowedToComment,
    forum_id,
    commentBox: { commentId: activeComBoxId },
    updateBox: { commentId: activeUpdateComBoxId },
    updateBox,
    commentBox,
    session
  } = props
  let {
    comment_by,
    created_at,
    countChild,
    profile_image = "",
    commentIndex = undefined,
    user_id = false,
    comment_id: commentId,
    isReported,
    is_liked = 0
  } = currComment
  const rootDetails = {
    commentId,
    commentIndex
  }
  const subComments = currComment?.subComments

  const { handleCommentAcFn, handleCommentsAcFn } = forumHandlers,
    isCommentBoxVisible = session && activeComBoxId === commentId,
    isUpdateComBoxVisible = session && activeUpdateComBoxId === commentId,
    isMyComment = loggedInUserId === user_id

  const doCommentVars = {
    navigate,
    parent_root_info: {
      parent_id: commentId,
      root_id: commentId
    },
    forum_id,
    commentsCount,
    page,
    postCommentReducer
  }

  // Expands the comment if collapsed
  useEffect(() => {
    if (subComments?.isBeingExpanded === true) fetchSubComs({})
  }, [subComments?.isBeingExpanded])

  useEffect(() => {
    const { present, show } = subComments
    if (present === true && show === true) fetchSubComs({ fetchOnLoad: true })
  }, [])


  // Functions

  // Toggles reply btn and comment/edit comment field
  const toggleReplyBtn = () => {
    // if (isUpdateComBoxVisible) openUpdateComBox()
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

  // Fetch subcomments on the comment
  async function fetchSubComs({ page = 1, append = false, fetchOnLoad = false }) {

    let token = getKeyProfileLoc("token") ?? "",
      data = {},
      obj = {}

    data = {
      forum_id,
      page,
      "root_id": commentId,
    }

    obj = {
      data: data,
      token: token,
      method: "post",
      url: "getforumcomments"
    }

    try {
      const res = await http(obj)
      if (res.data.status === true) {
        return dispatch(handleCommentAcFn({
          subComments: {
            ...subComments,
            ...(fetchOnLoad && { isShown: true }),
            loading: apiStatus.FULFILLED,
            data: res.data.body.comments,
          },
          commentIndex
        }))
      } else {
        dispatch(handleCommentAcFn({
          subComments: {
            ...subComments,
            ...(fetchOnLoad && { isShown: false }),
            loading: apiStatus.REJECTED,
          },
          commentIndex
        }))
      }
    } catch (err) {
      dispatch(handleCommentAcFn({
        subComments: {
          ...subComments,
          loading: apiStatus.REJECTED,
          message: err.message ?? "something went wrong_"
        },
        commentIndex
      }))
    }
  }

  // Opens report forum comment modal
  const openReportCommentModal = () => {
    dispatch(reportForumCommAcFn({
      visible: true,
      status: apiStatus.IDLE,
      message: "",
      data: {
        forum_id,
        is_for_subcomment: false,
        comment_index: commentIndex,
        comment_id: commentId,
        isReported: isReported === reportedFormStatus.reported
      }
    }))
  }

  const doComment = (commentBoxRef, updateComment = false) => {
    doCommentService({
      commentBoxRef,
      postComment,
      ...(updateComment === true && {
        updateComment,
        commentId
      }),
      dispatch,
      navigate,
      forum_id,
      isSubComment: updateComment ? false : true,
      usedById: commentId,
      parent_root_info: {
        parent_id: commentId,
        root_id: commentId,
        parentIndex: commentIndex
      },
      commentsCount,
      page
    })
  }

  const upvoteOrDownvote = async (isLiked) => {
    likeDislikeService({
      isLiked,
      like: currComment?.like,
      dispatch,
      forum_id,
      is_for_sub_comment: false,
      commentIndex,
      commentId
    })
  }

  // Open update comment box
  const openUpdateComBox = () => {
    // if (isCommentBoxVisible) toggleReplyBtn()
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

  // DELETES THE COMMENT  
  const deleteCommentFunc = async () => {
    deleteForumCommService({
      postComment,
      dispatch,
      forum_id,
      isSubComment: false,
      usedById: commentId,
      commentId,
      comment_index: commentIndex,
      commentsCount: subComments?.data?.length ?? 0
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


  profile_image = profile_image === "" ? "/images/userAcc.svg" : profile_image

  if (subComments?.status === apiStatus.LOADING)
    return (
      <div className="w-100 text-center">
        <div className="spinner-border pColor d-inline-block mx-auto" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )

  if (subComments?.status === apiStatus.REJECTED)
    return <div className="alert alert-danger" role="alert">
      {subComments?.message}
    </div>

  return (
    <>
      <div className={`postCont forum_comment abc${commentId}`}>

        {/* Edit/Delete comment */}
        {(session && currComment?.is_editable === 1) ?
          <div className='edit_delete_com_forum'>
            <i className="fa fa-trash deleteCommentIcon" type="button" aria-hidden="true" onClick={deleteCommentFunc}></i>
            {!isUpdateComBoxVisible ? <img src={"/images/editCommentIcon.svg"} className='editCommentIcon' onClick={openUpdateComBox} /> : null}
          </div>
          : null}
        {/* Edit/Delete comment */}

        {/* Report comment */}
        {(session && isReported !== 2) ? <span className="reportPost" onClick={openReportCommentModal}>
          <i className="fa fa-exclamation-circle reportComIcon" aria-hidden="true"></i>
        </span> : null}
        {/* } */}
        {/* Report comment */}

        <div className="postContHeader commentsContHeader">
          <span className="commentsGotProfileImg">
            <img src={profile_image} alt="user_profile_image" />
            {currComment?.email_verified === 1 ?
              <img src="/images/verifiedIcon.svg" title="Verified user" alt="verified_user_icon" className='verified_user_icon' /> : null}
          </span>

          {currComment?.userslug && currComment?.userslug !== "" ?
            <Link className={`forum_com_p_link`}
              href={profileLinkToVisit(currComment)}>
              <span className="userName">
                {comment_by}
              </span>
            </Link>
            :
            (<span className="userName">
              {comment_by}
            </span>)
          }

          <Badge points={currComment?.points} classlist="ml-2" />

          <span className="postCreatedTime">
            {created_at ? dateConverter(created_at) : null}
          </span>
        </div>

        <div className="postBody">
          <div className="postedPost mb-0">

            {currComment?.is_edited === 1 ?
              <i className="fa fa-pencil pr-2" aria-hidden="true"></i>
              : null}

            <pre className="preToNormal">
              {parse(currComment?.comment)}
            </pre>

            {/* Update box */}
            {isUpdateComBoxVisible ? <CommentBox
              session={session}
              toSearch={toSearch}
              dispatch={dispatch}
              usedById={commentId}
              getUsersToTag={getUsersToTag}
              usersToTag={usersToTag}
              isForUpdateCom={true}
              postCommentReducer={postCommentReducer}
              doComment={doComment} /> : null}
            {/* Update box */}

            {isAllowedToComment &&
              <div className="replyCont">
                <span className="reply_btn">
                  <div onClick={toggleReplyBtn}>
                    <img src="/images/creplyIcon.svg" alt="replyIcon" className='replyIcon' />
                    <span className='pl-2'>Reply</span>
                  </div>


                  {/* like dislike */}
                  {
                    <div className='iconsMainCont'>
                      <div className={`upvote_downvote_icons_cont buttonType`}>
                        {is_liked === 1 ?
                          <img src="/images/upvoted.svg" alt="upvoted" onClick={() => upvoteOrDownvote(false)} /> :
                          <img src="/images/upvote.svg" alt="upvote" onClick={() => upvoteOrDownvote(true)} />}
                        <span className='count'>{currComment?.like}</span>
                      </div>
                    </div>
                  }
                  {/* like dislike */}

                </span>

                {/* Comment box */}
                {isCommentBoxVisible ?
                  <>
                    <CommentBox
                      session={session}
                      toSearch={toSearch}
                      dispatch={dispatch}
                      usersToTag={usersToTag}
                      getUsersToTag={getUsersToTag}
                      usedById={commentId}
                      postCommentReducer={postCommentReducer}
                      doComment={doComment}
                    />
                  </> :
                  null}
                {/* Comment box */}

              </div>}
          </div>
        </div>
      </div >

      <ForumSubComments
        usersToTag={usersToTag}
        isAllowedToComment={isAllowedToComment}
        commentIndex={commentIndex}
        forum_id={forum_id}
        session={session}
        toSearch={toSearch}
        updateBox={updateBox}
        doCommentVars={doCommentVars}
        commentBox={commentBox}
        subComments={subComments}
        rootDetails={rootDetails}
        loggedInUserId={loggedInUserId}
        dispatch={dispatch}
        countChild={countChild}
        parent_created_at={created_at}
      />
    </>
  )
}

export default ForumComment
import React from 'react'

// Component imports
import ForumSubComment from './ForumSubComment'

// Helpers
import InfiniteScroll from 'react-infinite-scroll-component'
import { apiStatus } from '../../../../../utils/api'
import { dateConverter } from '../../../../../utils/helpers'
import { forumHandlers } from '../../../../../redux/actions/forumsAc/forumsAc'


const ForumSubComments = props => {


    // Hooks and vars
    const {
        subComments,
        toSearch,
        forum_id,
        usersToTag,
        session,
        dispatch,
        loggedInUserId,
        commentIndex,
        commentBox,
        updateBox = { commentId: null },
        parent_created_at,
        countChild,
        rootDetails,
        doCommentVars,
        isAllowedToComment
    } = props

    const {
        status, message,
        data: subCommentsArr = [],
        present, isShown
    } = subComments
    const showUpperView = present && isShown === false
    const { handleCommentAcFn } = forumHandlers

    const openSubComments = () => {
        dispatch(handleCommentAcFn({
            subComments: {
                ...subComments,
                isBeingExpanded: true,
                isShown: true
            },
            commentIndex
        }))
    }

    // Fetchs more comments
    const fetchMoreComments = () => {
        // getComments((page + 1), true);
    }

    const getSubComments = () => {
        if (showUpperView) return (
            <div className={`postCont overWritePostWithComment subcommentCont upperView`} onClick={openSubComments}>
                <div className="postContHeader commentsContHeader">
                    <span className="commentsGotProfileImg">
                        <img src="/images/userAcc.svg" alt="userAcc" />
                    </span>
                    <span className="userName">
                        Dummy name
                    </span>
                    <span className="postCreatedTime">
                        {dateConverter(parent_created_at)}
                    </span>
                    <span className='subCommentsCount'>
                        {countChild} More Reply
                    </span>
                </div>
            </div>
        )

        return (
            <InfiniteScroll
                className='commentsModalIscroll infScroll_forumDet_page'
                dataLength={subCommentsArr.length}
                next={fetchMoreComments}
                hasMore={false}
                loader={
                    <div className="w-100 text-center">
                        <div className="spinner-border pColor mt-4" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                }
            >
                {
                    subCommentsArr.map((comment, index) => {
                        return <ForumSubComment
                            toSearch={toSearch}
                            usersToTag={usersToTag}
                            updateBox={updateBox}
                            key={`${comment.id}${index}`}
                            isAllowedToComment={isAllowedToComment}
                            session={session}
                            doCommentVars={doCommentVars}
                            commentBox={commentBox ?? {}}
                            forum_id={forum_id}
                            commentIndex={commentIndex}
                            rootDetails={rootDetails}
                            dispatch={dispatch}
                            loggedInUserId={loggedInUserId}
                            comment={{ ...comment, subCommentIndex: index, commentIndex }}
                        />
                    })
                }
            </InfiniteScroll>
        )
    }

    if (status === apiStatus.LOADING)
        return (
            <div className="w-100 text-center">
                <div className="spinner-border pColor d-inline-block mx-auto" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )

    if (status === apiStatus.REJECTED)
        return <div className="alert alert-danger" role="alert">
            {message}
        </div>

    return (
        <div className="sub_comments">
            {getSubComments()}
        </div>)
}

export default ForumSubComments
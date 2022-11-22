import React, { useEffect, useState } from 'react'

import InfiniteScroll from "react-infinite-scroll-component"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { forumHandlers } from '../../../../../redux/actions/forumsAc/forumsAc'

// Component imports
import ForumComment from './ForumComment'
import { AdSense_, WhatsNewAds } from '../../../ads/AdMob'

// Helpers
import { http } from '../../../../../utils/http'
import {
  goUp,
  subComIniVal,
  showSubCommentsFn
} from './ForumCommProvider'
import auth from '../../../../../utils/auth'
import { envConfig } from '../../../../../utils/envConfig'
import { apiStatus, resHandler } from '../../../../../utils/api'

const { getKeyProfileLoc } = auth



const ForumComments = props => {

  // Hooks and vars
  const { data: session } = useSession()
  const router = useRouter()
  const { forum_id, isAllowedToComment, usersToTag } = props,
    [goDownArrow, setGoDownArrow] = useState(false),
    dispatch = useDispatch(),
    navigate = router.push,
    { comments: commentsRed, postComment } = useSelector(state => state.forumsReducer.detailPage),
    {
      status,
      data: comments = [],
      page,
      count,
      commentsCount = 0,
      message = '',
      commentBox = { commentId: null },
      updateBox = { commentId: null }
    } = commentsRed,
    loggedInUserId = getKeyProfileLoc("user_id"),
    SLOMT = 3  // Show subcomments if count is less than
  const forumCommentProps = {
    usersToTag,
    toSearch: usersToTag?.strToSearch ?? "",
    isAllowedToComment,
    postComment,
    session,
    forum_id,
    navigate,
    dispatch,
    commentsCount,
    page,
    commentBox,
    loggedInUserId,
    updateBox
  }


  useEffect(() => {
    if (forum_id) getComments()
  }, [forum_id])

  // Functions

  // Scrolls to top
  const handleScrollTo = (setGoDownArrow) => {
    let scroll = document.querySelector("#postsMainCont") ?
      document.querySelector("#postsMainCont").scrollTop :
      0;
    if (scroll > 800) {
      setGoDownArrow(true);
    } else {
      setGoDownArrow(false);
    }
  }

  // Get comments on forum
  const getComments = async (page = 1, append = false) => {
    let obj = {
      token: getKeyProfileLoc("token") ?? "",
      data: {
        forum_id,
        root_id: "",
        page
      },
      method: "post",
      url: `getforumcomments`
    }
    try {
      let res = await http(obj)
      res = resHandler(res)

      let { comments: commentsInRes = [] } = res?.body
      const { count = 0 } = res?.body
      commentsInRes = commentsInRes.map(curr => {
        return {
          ...curr,
          subComments: {
            ...(showSubCommentsFn(curr?.countChild, SLOMT)),
            ...subComIniVal
          }
        }
      })

      const dataToSend = {
        status: apiStatus.FULFILLED,
        data: append ? [...comments, ...commentsInRes] : commentsInRes,
        page, count
      }
      dispatch(forumHandlers.handleCommentsAcFn(dataToSend))

    } catch (error) {
      console.log(error)
    }
  }

  // Fetchs more comments
  const fetchMoreComments = () => {
    getComments((page + 1), true);
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
    <>
      <InfiniteScroll
        className='commentsModalIscroll infScroll_forumDet_page'
        onScroll={() => handleScrollTo(setGoDownArrow)}
        endMessage={
          <>
            <div className="endListMessage w-100 mt-2 pb-0 text-center">
              End of Comments
            </div>

            {/* Ad, is shown after last comment */}
            {/* <div className="w-100 mt-2 mb-3">
              {envConfig?.isProdMode ? <AdSense_ /> :
                <WhatsNewAds mainContId={"dr99"} />}
            </div> */}
            {/* Ad, is shown after last comment */}

          </>
        }
        dataLength={comments.length}
        next={fetchMoreComments}
        hasMore={comments.length < count}
        loader={
          <div className="w-100 text-center">
            <div className="spinner-border pColor mt-4" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        }
      >
        {comments.map((comment, index) => {
          return <ForumComment
            {...forumCommentProps}
            key={`${comment.id}${index}`}
            comment={{ ...comment, commentIndex: index }}
          />
        })}
      </InfiniteScroll>

      <i
        className={`fa fa-arrow-circle-o-up commentsModalGoUpArrow ${goDownArrow ? "d-block" : "d-none"}`} type="button"
        onClick={goUp}></i>
    </>
  )
}

export default ForumComments

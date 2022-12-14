import React, { useState } from 'react'
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

// Helpers
import VisitPrivilege from './helpers/VisitPrivilege';
import { ProfileIcon } from './helpers/ProfileIcon';

// Component Imports
import Badge from '../common/Badge';

// Utils
import auth from '../../utils/auth';
import { maxCharAllowedOnPostComment } from '../../utils/provider';
import { dateConverter } from '../../utils/helpers';

// Custom hooks
import useShareRequestPopUp from "../../utils/hooks/useShareRequestPopUp"
import useShareKit from "../../utils/hooks/useShareKit"

// Third Party
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";

// Redux
import { togglemenu, toggleSharekitMenu } from '../../redux/actions/share';
import { useSelector } from 'react-redux';
import { likeDislikeService } from '../../services/user/services';

const { isUserLoggedIn } = auth


const Post = (props) => {

  // Hooks and vars
  const post = props.post
  const store = useSelector(store => store)
  const [lightBox, setLightBox] = useState(false)
  const router = useRouter()
  const history = router.push;
  const dispatch = post?.dispatch ?? (() => { });
  const ShareReducer = store?.ShareReducer;
  const [requiredError, setRequiredError] = useState('');
  const friendReqState = store.friendReqModalReducer
  const authenticated = isUserLoggedIn;
  const noOfWords = maxCharAllowedOnPostComment;
  const isCoverTypePost = post?.category_id === 0
  const postBg = isCoverTypePost ? {
    backgroundImage: `url('${post?.cover_image}')`,
    name: "post"
  } : {}
  const isAnyUnreadComment = post?.unread_comments && post?.unread_comments > 0

  // Custom hooks
  const [shareReqPopUp, toggleShareReqPopUp, ShareRequestPopUp, closeShareReqPopUp] = useShareRequestPopUp();
  const [sharekit, toggleSharekit, ShareKit, hideShareKit] = useShareKit();


  // Functions
  const handleLightBoxFn = (bool) => {
    setLightBox(bool)
  }

  const _toggleShareReqPopUp = (id, value) => {

    dispatch(togglemenu({
      id, value, "isPost": true
    }))

    dispatch(
      toggleSharekitMenu(false, true)
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
      toggleSharekitMenu(value, true)
    )
    dispatch(togglemenu({
      id, value: false, isPost: true
    }))

    if (shareReqPopUp) {
      closeShareReqPopUp();
    }
    toggleSharekit();
  }

  const openFrReqModalFn_Post = () => {
    dispatch(openCFRModal({
      cancelReq: props.isNotFriend === 2 ? true : false,
      userId: (friendReqState.requested === true || friendReqState.cancelled) ?
        friendReqState.data.userId :
        props.curid
    }))

    // other === requested
    // 2 === cancel the requst

    // openFrReqModalFn();
    dispatch(togglemenu({
      id: null, value: false, isPost: true
    }))

    dispatch(
      toggleSharekitMenu(false, true)
    )
    toggleShareReqPopUp();
    hideShareKit();
  }


  const closeShareMenu = () => {
    dispatch(togglemenu({
      id: null, value: false, isPost: false
    }))
  }

  const upvoteOrDownvote = (isLiked) => {
    likeDislikeService({
      isLiked,
      post,
      dispatch
    })
  }

  // console.log(post)

  return (
    <div className="postCont confession_cont" index={post.index}>

      {ShareReducer &&
        ShareReducer.selectedPost?.id === post.confession_id &&
        ShareReducer.sharekitShow &&
        <div className="shareKitSpace"></div>}

      {(isUserLoggedIn && post.isReported !== 2) && <span className="reportPost" onClick={openReportPostModal}>
        <i className="fa fa-exclamation-circle reportComIcon" aria-hidden="true"></i>
      </span>}

      <span
        type="button"
        className={`sharekitdots withBg ${sharekit === false ? "justify-content-end" : ""} ${!post.deletable ? "resetRight" : ""}`}
        onClick={() => _toggleShareReqPopUp(post.confession_id, ShareReducer.selectedPost?.id === post.confession_id ? !ShareReducer.selectedPost?.value : true)}>
        {ShareReducer &&
          ShareReducer.selectedPost?.id === post.confession_id &&
          ShareReducer.selectedPost?.isPost === true &&
          ShareReducer.sharekitShow &&
          <ShareKit
            postData={{
              confession_id: post.slug,
              description: post.description,
            }}
            closeShareReqPopUp={closeShareReqPopUp} />}
        <Image
          src="/images/actionIconImg.svg"
          width={20}
          height={20}
          alt="shareKit"
          className="shareKitImgIcon" />
      </span>

      {/* Share/Request popup */}

      {ShareReducer &&
        ShareReducer.selectedPost?.id === post.confession_id &&
        ShareReducer.selectedPost?.value === true &&
        ShareReducer.selectedPost?.isPost === true &&
        <ShareRequestPopUp
          toggleSharekit={
            () => _toggleSharekit(post.confession_id, !ShareReducer.sharekitShow?.value)
          }
          isNotFriend={post.isNotFriend}
          openFrReqModalFn={openFrReqModalFn_Post}
          closeShareMenu={closeShareMenu}
        />}

      {/*
          Cancelreq :
          0 : Show nothing
          1 : Show request
          2: Show cancel 
          3: Already friend
      */}

      {/* If post is deletable the delete icon will be shown */}

      {post.deletable === true && <i className="fa fa-trash pr-3 deletePostIcon" type="button" aria-hidden="true" onClick={deletePost}></i>}

      {/* Shows unread comments on post */}

      {
        (post.unread_comments && post.unread_comments !== 0) ?
          <span className="unreadPostCommentCount">
            {post.unread_comments} {post?.unread_comments === 1 ? "New Reply" : "New Replies"}
          </span>
          : ''}


      <div className="postContHeader">
        {lightBox && (
          post?.image && ((post?.image).length !== 0 && ((post?.image).length > 1
            ?
            (<Lightbox images={post?.image} onClose={() => { handleLightBoxFn(false) }} />)     //Multiple images
            :
            (<Lightbox image={post?.image} onClose={() => { handleLightBoxFn(false) }} />)))    //Single image
        )}

        <span className="leftContofPostCont">
          <span className="userImage userImageFeed">
            <ProfileIcon profileImg={post?.profileImg} isNotFriend={post?.isNotFriend} />
          </span>


          {/* Not anonymous :: Opens current logged in user's profile,
                if the post is posted by the logged in user, and he had not posted the post as anonymous,
                else this will open the profile of the user, who have posted the post, not as anonymous
                Anonymous :: Will not do any thing
                */}

          <VisitPrivilege post={post} />

          <Badge points={post?.points} />

          {!isCoverTypePost && <span className="catCommentBtnCont">
            <div className="categoryOfUser">{(post?.category_name)?.charAt(0) + (post?.category_name)?.slice(1)?.toLowerCase()}</div>
          </span>}

          <span className="postCreatedTime">
            {dateConverter(post?.created_at)}
          </span>

          {/* {console.log(post)} */}

        </span>
      </div>
      <div
        className={`postBody ${isCoverTypePost ? 'coverTypePost' : ''} ${isAnyUnreadComment ? 'addMargin' : ''}`}
        style={postBg}>

        <Link className="links text-dark" href={`/confession/${post?.slug}`}>
          <div className="postedPost mb-2">
            <pre
              className="preToNormal post"
            >
              {post.description}
            </pre>
            {
              ((post.description).split("")).length >= noOfWords[0]
                ||
                (post.description).split("\n").length > 5 ?
                <>
                  {((post.description).split("")).length >= noOfWords[0] && (
                    post.description).split("\n").length < 5 && <span className='ellipsesStyle'>... </span>
                  }
                  <span toberedirectedhref={post.confession_id}
                    className="viewMoreBtn pl-1">view more</span>
                </> : ''
            }
          </div>
        </Link>

        {/* If img url will be string then images will not be shown */}

        {(post.image !== null && (post.image).length > 0 && typeof (post.image) !== 'string')
          &&
          <div className="form-group imgPreviewCont mt-2 mb-0">
            <div className="imgContForPreviewImg fetched" type="button" onClick={() => { handleLightBoxFn(true) }}>
              {(post.image).map((srcg, index) => {
                return (
                  <span className="uploadeImgWrapper fetched" key={`uploadeImgWrapper${index}`}>
                    <img key={"srcg" + index} src={srcg} alt="" className='previewImg' />
                  </span>
                )
              })}
            </div>
          </div>
        }

      </div>


      {
        authenticated &&
        (
          <>
            <div className="container-fluid inputWithForwardCont">
              <div className="textAreaToComment w-100">
                <TextareaAutosize
                  type="text"
                  maxLength={maxChar}
                  row='1'
                  value={comment}
                  onKeyDown={(e) => { checkKeyPressed(e) }}
                  onChange={(e) => { setComment(e.target.value) }}
                  className="form-control">
                </TextareaAutosize>
              </div>
              <div className="arrowToAddComment" id="userPostCommentIcon" type="button" onClick={() => { doComment(post.confession_id) }}>
                <img src={forwardIcon} alt="" className="forwardIconContImg" />
              </div>
            </div>
            <span className="d-block errorCont text-danger mb-2 moveUp">{requiredError}</span>
          </>
        )
      }


      <div className="postFoot">

        {authenticated === false &&
          <span className="feedPageLoginBtnCont postLoginBtnCont">
            <Link href="/login">
              <div className="categoryOfUser enhancedStyle mb-0" type="button">
                Login to comment
              </div>
            </Link>
          </span>}

        <div className={`iconsCont ${authenticated[0] === false ? 'mainDesignOnWrap' : ''}`}>
          <Link className="links text-dark" href={`/confession/${post?.slug}`}>
            <div
              className="upvote_downvote_icons_cont underlineShareCount ml-0"
              type="button"
            >
              <Image
                src="/images/viewsCountIcon.svg"
                alt="viewCount"
                width={20}
                height={20} />
              <span className="count">{post?.viewcount ?? 0}</span>
            </div>
          </Link>
          <Link className="links text-dark" href={`/confession/${post?.slug}`}>
            <div
              className="upvote_downvote_icons_cont"
              type="button"
            >
              <Image
                src="/images/commentCountIcon.svg"
                alt="commentCount"
                width={20}
                height={20} />
              <span className="count">{post?.no_of_comments ?? 0}</span>
            </div>
          </Link>

          {/* {console.log(post.is_liked)} */}

          {(post.hasOwnProperty("is_liked")
            ?
            <div className='iconsMainCont'>
              <div className={`upvote_downvote_icons_cont buttonType`}>
                {post?.is_liked === 1 ?
                  <Image
                    width={20}
                    height={20}
                    alt={"likeIcon"}
                    src="/images/upvoted.svg"
                    onClick={() => upvoteOrDownvote(false)} /> :
                  <Image
                    width={20}
                    height={20}
                    alt={"dislikeIcon"}
                    src="/images/upvote.svg"
                    onClick={() => upvoteOrDownvote(true)} />}
                <span className='count'>{post?.like}</span>
              </div>
            </div>
            :
            <div className='iconsMainCont'>
              <div className={`upvote_downvote_icons_cont`}>
                <Image
                  width={20}
                  height={20}
                  alt={"likeIcon"} />
                <span className='count'>{post?.like}</span>
              </div>
            </div>
          )
          }
        </div>
      </div>

    </div >
  )
}

export default Post
import React from 'react'

import Link from 'next/link';

// Custom components
import ForumFooter from '../forums/forum/ForumFooter';
import ForumHeader from '../forums/forum/ForumHeader';

// Helpers
import { forum_types } from '../../../utils/provider';
import { myForum, requestedStatus } from '../forums/detailPage/comments/ForumCommProvider';
import { toggleNfswModal } from '../../../redux/actions/modals/ModalsAc';

const ForumComp = (props) => {
  // Hooks and vars
  const {
    forumTypes,
    actionBox,
    dispatch,
    forum_index } = props
  let { currForum } = props
  currForum = {
    ...currForum,
    forum_id: currForum?.post_id
  }
  const { is_pinned } = currForum
  const { data: types } = forumTypes
  const forum_type = {
    type_name: types[currForum?.type - 1]?.type_name,
    color_code: types[currForum?.type - 1]?.color_code
  }
  const nfswContentType = 1
  const isNfswContent = currForum?.is_nsw === nfswContentType
  const isMyForum = currForum?.isReported === myForum
  const showAlertOrNot = (isNfswContent) && !(isMyForum)
  const isPinned = is_pinned === 1
  const slug = currForum?.slug
  const showPin = true
  const isActionBoxVisible = actionBox?.post_id === currForum?.post_id
  const joined = currForum.is_requested === requestedStatus.approved
  const isPrivateForum = currForum?.type === forum_types?.private
  const isNfswTypeContent = currForum?.is_nsw === 1
  const forumHeaderProps = {
    is_only_to_show: true,
    category_name: currForum?.category_name,
    created_at: currForum?.created_at,
    name: currForum?.title,
    forum_id: currForum?.post_id,
    is_requested: currForum?.is_requested,
    isReported: currForum?.isReported,
    forum_index,
    isPrivateForum,
    showAlertOrNot,
    type: currForum?.type,
    currForum,
    dispatch,
    isCalledFromSearchPage: true,
    actionBox,
    isActionBoxVisible,
    is_calledfrom_detailPage: false
  }

  const forumFooterProps = {
    no_of_comments: currForum?.no_of_comments,
    viewcount: currForum?.viewcount ?? 0,
    forum_type,
    isCalledFromSearchPage: true,
    isPinned,
    isPrivateForum,
    showPin,
    forum_tags: currForum?.tags,
    forum_id: currForum?.post_id,
    forum_index,
    dispatch,
    showAlertOrNot,
    currForum,
    is_only_to_show: true
  }

  // Functions

  // Opens nfsw modal
  const openNsfwModal = () => {
    console.log(currForum?.forum_id)
    dispatch(toggleNfswModal({
      isVisible: true, forum_link: `/forums/${slug}`, forum_id: currForum?.forum_id, forum_index, is_calledfrom_searchPage: true
    }))
  }

  const getBody = () => {
    if ((isPrivateForum && !joined) || isNfswTypeContent)
      return (
        <pre className={`preToNormal post ${isNfswTypeContent ? "cursor_pointer" : ""}`} onClick={() => {
          if ((isPrivateForum && !joined)) return
          if (isNfswTypeContent) openNsfwModal()
        }}>
          {currForum?.description}
        </pre>)

    return (
      <Link className="links text-dark" href={`/forums/${slug}`} state={{ cameFromSearch: true }}>
        <pre className="preToNormal post">
          {currForum?.description}
        </pre>
      </Link>)
  }

  return (
    <div className='postCont forum_cont'>
      <ForumHeader {...forumHeaderProps} />
      <div className="postedPost">
        {getBody()}
      </div>
      <ForumFooter {...forumFooterProps} />
    </div>
  )
}

export default ForumComp
import React from 'react'

import { useSession } from "next-auth/react";

// React router imports
import { apiStatus } from '../../../../utils/api';
import { reqToJoinModalAcFn } from '../../../../redux/actions/forumsAc/forumsAc';
import { toggleNfswModal } from '../../../../redux/actions/modals/ModalsAc';

// Custom components
import ForumFooter from './ForumFooter';
import ForumHeader from './ForumHeader';
import WithLinkComp from '../../../../utils/WithLinkComp';

// Helpers
// import auth from '../../../user/behindScenes/Auth/AuthCheck';
import { forum_types, myForum, requestedStatus } from '../detailPage/comments/ForumCommProvider';


const Forum = (props) => {

    // Hooks and vars
    const { data: session } = useSession();
    const {
        currForum,
        forumTypes,
        shareBox,
        actionBox,
        dispatch,
        pageName = "",
        rememberScrollPos = false,
        isMyForumPage = false,
        forum_index
    } = props

    const { forum_id, is_pinned } = currForum
    const { data: types } = forumTypes
    const forum_type = {
        type_name: types[currForum?.type - 1]?.type_name,
        color_code: types[currForum?.type - 1]?.color_code
    }
    const isPinned = is_pinned === 1
    const nfswContentType = 1
    const joined = currForum.is_requested === requestedStatus.approved
    const isPrivateForum = currForum?.type === forum_types.private
    const isMyForum = currForum?.isReported === myForum
    const isNfswTypeContent = currForum?.is_nsw === nfswContentType
    const showAlertOrNot = (currForum?.is_nsw === nfswContentType) && !(isMyForum)
    const slug = currForum?.slug
    const showPin = true
    const isActionBoxVisible = actionBox?.forum_id === forum_id
    const forumHeaderProps = {
        category_name: currForum?.category_name,
        rememberScrollPos,
        pageName,
        created_at: currForum?.created_at,
        name: currForum?.title,
        forum_id: currForum?.forum_id,
        shareBox,
        is_requested: currForum?.is_requested,
        isReported: currForum?.isReported,
        forum_index,
        type: currForum?.type,
        currForum,
        joined,
        isMyForum,
        showAlertOrNot,
        dispatch,
        actionBox,
        isActionBoxVisible,
        is_calledfrom_detailPage: false,
        isMyForumPage
    }

    const requested = currForum?.is_requested === requestedStatus
    const forumFooterProps = {
        no_of_comments: currForum?.no_of_comments,
        viewcount: currForum?.viewcount ?? 0,
        forum_type,
        pageName,
        isPinned,
        rememberScrollPos,
        showPin,
        isPrivateForum,
        is_requested: currForum?.is_requested,
        joined,
        isMyForum,
        showAlertOrNot,
        forum_tags: currForum?.tags,
        forum_id: currForum?.forum_id,
        forum_index,
        isMyForumPage,
        dispatch,
        currForum
    }
    // Functions

    // Opens req to join modal
    const openReqToJoinModal = () => {
        dispatch(reqToJoinModalAcFn({
            visible: true,
            status: apiStatus.IDLE,
            message: "",
            data: {
                forum_id,
                slug: currForum?.slug,
                requested: requested,
                is_calledfrom_detailPage: false,
                forum_index,
            }
        }))
    }

    const openNsfwModal = () => {
        dispatch(toggleNfswModal({
            isVisible: true,
            forum_link: `/forums/${slug}`,
            forum_id,
            forum_index,
            rememberScrollPos,
            pageName,
            scrollPosition: window.scrollY
        }))
    }



    const getBody = () => {

        const private_and_joined = isPrivateForum && joined
        const returnLink = isMyForum || (!ausession && !isNfswTypeContent) || (!isPrivateForum && !isNfswTypeContent)
            || (private_and_joined && !isNfswTypeContent) || pageName === "myforums"
        const forum_slug = !returnLink ? "#" : (`/forums/${currForum?.slug}`)
        let Html = ""

        Html = (
            <pre className="preToNormal post forum_desc cursor_pointer" onClick={() => {
                if (pageName === "myforums") return
                if ((!session && isNfswTypeContent) || (isPrivateForum && joined && isNfswTypeContent)) return openNsfwModal()
                if (session && (isPrivateForum && !joined)) return openReqToJoinModal()
                if (!isPrivateForum && isNfswTypeContent) return openNsfwModal()
            }}>
                {currForum?.description}
            </pre>)

        return returnLink ? <WithLinkComp
            pageName={pageName}
            rememberScrollPos={rememberScrollPos}
            className='w-100'
            link={forum_slug}
            children={Html}
        /> : Html

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

export default Forum
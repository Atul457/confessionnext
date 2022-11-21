import React from 'react'

// Helpers
import { dateConverter } from '../../../../utils/helpers';
import WithLinkComp from '../../../../utils/WithLinkComp';

// Redux
import { createForumModalFnAc, deleteForumAcFn, forumHandlers, reportForumAcFn, reqToJoinModalAcFn } from '../../../../redux/actions/forumsAc/forumsAc';
import { useDispatch } from 'react-redux';
import { toggleNfswModal } from '../../../../redux/actions/modals/ModalsAc';

import { forum_types, reportedFormStatus, requestedStatus } from '../detailPage/comments/ForumCommProvider';
import ShareKit from '../../helpers/ShareKit';
import { apiStatus } from '../../../../utils/api';
import auth from '../../../../utils/auth';

const { checkAuth } = auth


const ForumHeader = props => {

    // Hooks and vars
    const {
        name,
        category_name,
        is_only_to_show = false,
        created_at,
        currForum,
        isMyForumPage,
        shareBox,
        pageName = "",
        rememberScrollPos,
        isCalledFromSearchPage = false,
        isMyForum = false,
        forum_index,
        actionBox,
        forum_id,
        type,
        is_requested,
        is_calledfrom_detailPage = false,
        isReported,
        is_for_post = true,
    } = props

    const isActionBoxVisible = actionBox?.forum_id === forum_id
    const isShareBoxVisible = !isCalledFromSearchPage && shareBox?.forum_id === forum_id && is_requested === requestedStatus.approved
    const dispatch = useDispatch()
    const hideJoinDiv = type === forum_types.closed || type === forum_types.public || is_requested === requestedStatus.approved
    const isNfswTypeContent = currForum?.is_nsw === 1
    const requested = is_requested === requestedStatus.is_requested
    const joined = currForum?.is_requested === requestedStatus.approved
    const isPrivateForum = currForum?.type === forum_types.private
    const postData = { is_forum: 1, forum_id, ...currForum }
    const isPublicForum = type === forum_types.public
    const showShareBlock = type !== forum_types.closed && (isPrivateForum ? joined : true)

    // Functions
    const toggleForumAcboxFn = () => {
        let dataToSend = isActionBoxVisible ? {} : { forum_id, forum_index }
        dispatch(forumHandlers.handleForums({ actionBox: dataToSend, shareBox: {} }))
    }

    // Toggle action box
    const toggleAcBox = () => {
        toggleForumAcboxFn()
    }

    // Toggle share box
    const toggleShareBox = () => {
        let dataToSend = isShareBoxVisible ? {} : { forum_id, forum_index }
        dispatch(forumHandlers.handleForums({ shareBox: dataToSend, actionBox: {} }))
    }

    // Opens nfsw alert
    const openNsfwModal = () => {
        dispatch(toggleNfswModal({
            isVisible: true,
            forum_link: `/forums/${currForum?.slug}`,
            forum_id,
            rememberScrollPos,
            pageName,
            forum_index
        }))
    }

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
                is_calledfrom_detailPage,
                forum_index
            }
        }))
    }

    // Opens report forum modal
    const openReportModal = () => {
        dispatch(reportForumAcFn({
            visible: true,
            status: apiStatus.IDLE,
            message: "",
            data: {
                forum_id,
                is_for_post,
                forum_index,
                isReported: isReported === reportedFormStatus.reported
            }
        }))
    }

    const deleteForum = () => {
        dispatch(deleteForumAcFn({
            visible: true,
            data: {
                forum_id,
                forum_index
            }
        }))
    }

    const openCreateSForumModal = () => {
        dispatch(createForumModalFnAc({
            visible: true,
            forum_details: currForum,
            isBeingEdited: true
        }))
    }


    const getBody = () => {

        const private_and_joined = isPrivateForum && joined
        const returnLink = isMyForum || (!checkAuth() && !isNfswTypeContent) || (!isPrivateForum && !isNfswTypeContent)
            || (private_and_joined && !isNfswTypeContent) || (isCalledFromSearchPage && isPublicForum && !isNfswTypeContent)
        const forum_slug = returnLink ? `/forums/${currForum?.slug}` : "#"
        let Html = ""

        Html = (
            <div className="forum_header_left_sec" onClick={() => {
                if (pageName === "myforums") return
                if ((!checkAuth() && isNfswTypeContent) || (isPrivateForum && joined && isNfswTypeContent)) return openNsfwModal()
                if (checkAuth() && (isPrivateForum && !joined) && !isCalledFromSearchPage) return openReqToJoinModal()
                if (checkAuth() && (isPrivateForum && !joined) && isCalledFromSearchPage) return
                if (!isPrivateForum && isNfswTypeContent) return openNsfwModal()
            }}>
                <div className="forum_name">
                    {name}
                </div>
                <div className="category_name">
                    {(category_name).charAt(0) + ((category_name).slice(1).toLowerCase())}
                </div>
                <div className="forum_timestamp postCreatedTime">
                    {created_at ? dateConverter(created_at) : null}
                </div>
            </div>)


        return returnLink ? <WithLinkComp
            className='w-100'
            pageName={pageName}
            rememberScrollPos={rememberScrollPos}
            link={forum_slug}
            children={Html} /> : Html

    }

    return (
        <div className='forum_header'>

            {isShareBoxVisible ?
                <div className="shareKitSpace"></div> :
                null}

            {getBody()}

            {/* Works in case of seaching */}

            {isShareBoxVisible ? (
                <span type="button" className={`sharekitdots withBg sharekit`} onClick={() => toggleAcBox()}>
                    <ShareKit postData={postData} />
                </span>
            ) : null}

            {!is_only_to_show ?
                <>
                    <span className='forum_action_icon sharekitdots preventCloseAcBox' onClick={toggleAcBox}>
                        <img src="/images/actionIcon.svg" className="shareKitImgIcon preventCloseAcBox" />
                    </span>
                    {isActionBoxVisible
                        ?
                        // ActionBox
                        (<>
                            <div className={`shareReqCont share_req_cont_forums`}>

                                {showShareBlock ?
                                    <>
                                        <div onClick={toggleShareBox} className={`preventCloseAcBox shareReqRows user ${hideJoinDiv ? "add_padding" : ""}`} type="button">
                                            <i className="fa fa-share-alt preventCloseAcBox" aria-hidden="true"></i>
                                            <span className='preventCloseAcBox'>Share</span>
                                        </div>
                                        <div className='shareReqDivider preventCloseAcBox'></div>
                                    </>
                                    : null}

                                <>
                                    {isMyForumPage ?
                                        <>
                                            <div className="shareReqRows user" type="button" onClick={openCreateSForumModal}>
                                                <i className="fa fa-pencil" aria-hidden="true"></i>
                                                <span>
                                                    Edit
                                                </span>
                                            </div>
                                            <div className='shareReqDivider'></div>


                                            <div onClick={deleteForum} className={`shareReqRows user w-100`} type="button">
                                                <i className="fa fa-trash" aria-hidden="true"></i>
                                                <span>Delete</span>
                                            </div>
                                        </> : null}

                                    {!isMyForumPage ?
                                        <>
                                            {(!hideJoinDiv && checkAuth() ?
                                                <>
                                                    <div className="shareReqRows user" type="button" onClick={openReqToJoinModal}>
                                                        <img src="/images/addFriend.svg" alt="addFriend" />
                                                        <span>Join Forum</span>
                                                    </div>
                                                    <div className='shareReqDivider'></div>
                                                </> : null)}

                                            <div onClick={openReportModal} className={`shareReqRows ${(!showShareBlock && hideJoinDiv) || (!checkAuth() && !showShareBlock) ? "pt-3" : ""} user w-100`} type="button">
                                                <img src="/images/reportForumIcon.svg" className="report_forum_icon" />
                                                <span>Report</span>
                                            </div>
                                        </> : null}
                                </>
                            </div>
                        </>
                        ) :
                        null
                    }
                </>
                : null

            }

        </div >
    )
}

export default ForumHeader
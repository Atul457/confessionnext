import React from 'react'

// Helpers
import auth from '../../../../utils/auth';
import { apiStatus } from '../../../../utils/api';
import WithLinkComp from '../../../../utils/WithLinkComp';

// Redux
import { pinForumService } from '../services/forumServices';
import { forum_types, requestedStatus } from '../detailPage/comments/ForumCommProvider';
import { toggleNfswModal } from '../../../../redux/actions/modals/ModalsAc';
import { reqToJoinModalAcFn } from '../../../../redux/actions/forumsAc/forumsAc';

import Link from 'next/link';

const { checkAuth } = auth

const ForumFooter = (props) => {

    // Hooks and vars
    const {
        viewcount,
        serverSideData,
        is_only_to_show = false,
        no_of_comments,
        session,
        forum_type,
        currForum,
        pageName = "",
        rememberScrollPos,
        is_calledfrom_detailPage = false,
        is_requested,
        isMyForum = false,
        forum_id,
        isCalledFromSearchPage = false,
        forum_index,
        dispatch,
        isMyForumPage,
        isPinned,
        showPin,
        forum_tags } = props,
        forumTypeStyle = {
            background: forum_type.color_code,
            border: `1px solid ${forum_type?.color_code}`
        },
        showTagsSection = forum_tags.length
    const requested = is_requested === requestedStatus.is_requested
    const isPublicForum = currForum?.type === forum_types.public
    const joined = currForum?.is_requested === requestedStatus.approved
    const isPrivateForum = currForum?.type === forum_types.private
    const isNfswTypeContent = currForum?.is_nsw === 1

    // // Pins/Unpins the forum
    const pinForumFn = async () => {
        pinForumService({
            isPinned,
            forum_index,
            forum_id,
            dispatch
        })
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

    const openNsfwModal = () => {
        dispatch(toggleNfswModal({
            isVisible: true,
            forum_link: `/forums/${currForum?.slug}`,
            forum_id,
            forum_index,
            pageName,
            rememberScrollPos
        }))
    }

    const getBody = () => {

        const private_and_joined = isPrivateForum && joined
        const returnLink = isMyForum || (!session && !isNfswTypeContent) || (!isPrivateForum && !isNfswTypeContent)
            || (private_and_joined && !isNfswTypeContent) || (isCalledFromSearchPage && isPublicForum && !isNfswTypeContent)
        const forum_slug = returnLink ? `/forums/${currForum?.slug}` : "#"
        let Html = ""

        Html = (
            <>
                {!session && is_calledfrom_detailPage ?
                    <span className="feedPageLoginBtnCont postLoginBtnCont">
                        <Link href="/login">
                            <div className="categoryOfUser enhancedStyle mb-0" type="button">Login to comment</div>
                        </Link>
                    </span>
                    : ""}
                <pre className="preToNormal post cursor_pointer" onClick={() => {
                    if ((!session && isNfswTypeContent) || (isPrivateForum && joined && isNfswTypeContent)) return openNsfwModal()
                    if (session && (isPrivateForum && !joined) && !isCalledFromSearchPage) return openReqToJoinModal()
                    if (session && (isPrivateForum && !joined) && isCalledFromSearchPage) return
                    if (!isPrivateForum && isNfswTypeContent) return openNsfwModal()
                }}>
                    <div className={`iconsCont ${!session ? 'mainDesignOnWrap' : ''}`}>
                        <div className="upvote_downvote_icons_cont underlineShareCount ml-0" type="button">
                            <img src="/images/viewsCountIcon.svg" alt="viewsCount" />
                            <span className="count">{viewcount ?? 0}</span>
                        </div>
                        <div className="upvote_downvote_icons_cont" type="button">
                            <img src="/images/commentCountIcon.svg" alt="commentCount" />
                            <span className="count">{no_of_comments}</span>
                        </div>
                    </div>
                </pre>
            </>
        )


        return returnLink ? <WithLinkComp
            className='links text-dark'
            pageName={pageName}
            rememberScrollPos={rememberScrollPos}
            link={!session && is_calledfrom_detailPage ? "/login" : forum_slug}
            children={Html} /> : Html

    }

    return (
        <div className="postFoot forum_footer">
            <div className="forum_details_cont">
                <div className="type_view_and_com_count">
                    {getBody()}
                    <span
                        className="category_name forum_type"
                        style={forumTypeStyle}
                    >
                        {forum_type?.type_name}
                    </span>
                </div>

                {showTagsSection
                    ?
                    <div className="forum_tags_cont">
                        <span className="tags_label">
                            | Tags:
                        </span>

                        {forum_tags.map((currTag, index) => {
                            let key = `${forum_id}-${currTag?.color}${index}${forum_id}`
                            return <ForumTag
                                key={key}
                                currTag={currTag}
                            />
                        })}
                    </div>
                    :
                    null
                }
            </div>

            {(!is_only_to_show && session && showPin && !isMyForumPage) ? <span className="pinnForum" onClick={pinForumFn}>
                <img
                    src={!isPinned ? "/images/pinIcon.svg" : "/images/pinnedIcon.svg"}
                    alt="pin_forum_icon" />
            </span> : null}

        </div>
    )
}

const ForumTag = props => {

    // Hooks and vars
    const { currTag } = props,
        forumTagStyle = {
            background: currTag?.color,
            border: `1px solid ${currTag?.color}`
        }

    return (
        <span
            style={forumTagStyle}
            className='category_name forum_tag'>
            {currTag?.tag}
        </span>
    )
}

export default ForumFooter
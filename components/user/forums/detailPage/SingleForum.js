import React, { useEffect } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';

// Custom components
import ForumFooter from '../forum/ForumFooter';
import ForumHeader from '../forum/ForumHeader';
import CommentBox from './CommentBox';

import { useSession } from 'next-auth/react';

// Redux
import { forumHandlers, postComment, usersToTagAcFn } from '../../../../redux/actions/forumsAc/forumsAc';

// Helpers
import { doCommentService, getUsersToTagService } from '../services/forumServices';
import { apiStatus } from '../../../../utils/api';
import { scrollToTop } from '../../../../utils/dom';

// Modals
import NfswAlertModal from '../../modals/NfswAlertModal';
import { isAllowedToComment } from '../../../../utils/helpers';
import { toggleNfswModal } from '../../../../redux/actions/modals/ModalsAc';


const SingleForum = props => {

    // Hooks and vars
    const { data: session } = useSession()
    const {
        currForum,
        forumTypes,
        actionBox,
        nfsw_modal,
        shareBox,
        dispatch,
        serverSideData,
        forum_index,
        usersToTag,
        postCommentReducer,
        comments: { count: commentsCount, page = 1 }
    } = props
    const router = useRouter()
    const location = router.pathname
    const navigate = router.push
    const { is_nsw } = currForum
    const isAllowedToCommentvar = isAllowedToComment(currForum)

    const { forum_id } = currForum,
        { data: types } = forumTypes,
        forum_type = {
            type_name: types[currForum?.type - 1]?.type_name,
            color_code: types[currForum?.type - 1]?.color_code
        },
        isPinned = false,
        showPin = false,
        isActionBoxVisible = actionBox?.forum_id === forum_id
    const forumHeaderProps = {
        category_name: serverSideData?.category_name,
        created_at: serverSideData?.created_at,
        name: serverSideData?.title,
        forum_id: serverSideData?.forum_id,
        is_requested: currForum?.is_requested,
        isReported: currForum?.isReported,
        forum_index,
        type: serverSideData?.type,
        dispatch,
        currForum,
        serverSideData,
        actionBox,
        shareBox,
        isActionBoxVisible,
        is_for_post: false,
        is_calledfrom_detailPage: true,
        session
    }

    const forumFooterProps = {
        currForum,
        no_of_comments: currForum?.no_of_comments,
        viewcount: serverSideData?.viewcount ?? 0,
        forum_type,
        is_calledfrom_detailPage: true,
        isPinned,
        serverSideData,
        session,
        showPin,
        forum_tags: serverSideData?.tags,
        forum_id: serverSideData?.forum_id,
        forum_index,
        dispatch
    }

    useEffect(() => {
        dispatch(forumHandlers.handleForums({ shareBox: {}, actionBox: {} }))
        if (is_nsw && session) {
            dispatch(toggleNfswModal({
                forum_index,
                forum_id: currForum?.forum_id,
                isVisible: true, forum_link: `/forums/${currForum?.slug}`
            }))
        }
        scrollToTop({})
    }, [])


    // Functions

    const doComment = commentBoxRef => {
        doCommentService({
            commentBoxRef,
            postComment,
            dispatch,
            navigate,
            forum_id,
            commentsCount,
            page,
            usedById: forum_id
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
                dispatch,
                isCalledByParent: true
            })
        } else if (usersToTag?.data?.length) {
            dispatch(usersToTagAcFn({
                data: [],
                status: apiStatus.IDLE,
                toSearch: ""
            }))
        }
    }

    const commentBoxProps = {
        session,
        isCalledByParent: true,
        postCommentReducer,
        usedById: forum_id,
        dispatch,
        id: forum_id,
        doComment,
        usersToTag,
        toSearch: usersToTag?.strToSearch ?? "",
        getUsersToTag
    }

    const resetTagList = () => {
        dispatch(usersToTagAcFn({
            data: [],
            status: apiStatus.IDLE,
            toSearch: ""
        }))
        dispatch(forumHandlers.handleForums({ shareBox: {}, actionBox: {} }))
    }

    return (
        <>
            <div className='w-100 mb-3'>
                <Link
                    href={`/${location?.state?.cameFromSearch ? "search" : "forums"}`}
                    onClick={resetTagList}
                    className='backtoHome'>
                    <span className='mr-2'>
                        <i className="fa fa-chevron-left" aria-hidden="true"></i>
                        <i className="fa fa-chevron-left" aria-hidden="true"></i>
                    </span>
                    {location?.state?.cameFromSearch === true ? "Go back to search" : "Go back to forums"}
                </Link>
            </div>
            <div className='postCont forum_cont single_forum'>

                <ForumHeader {...forumHeaderProps} />
                <div className="postedPost">
                    <pre className="preToNormal post forum_desc">
                        {currForum?.description}
                    </pre>
                </div>
                {isAllowedToCommentvar && <CommentBox {...commentBoxProps} />}
                <ForumFooter {...forumFooterProps} />

                {nfsw_modal?.isVisible && <NfswAlertModal nfsw_modal={nfsw_modal} isForumDetailPage={true} />}
            </div>
        </>
    )
}

export default SingleForum
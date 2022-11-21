import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Custom components
import ForumFooter from '../forum/ForumFooter';
import ForumHeader from '../forum/ForumHeader';
import CommentBox from './CommentBox';

// Redux
import { forumHandlers, postComment, usersToTagAcFn } from '../../../redux/actions/forumsAc/forumsAc';

// Helpers
import { doCommentService, getUsersToTagService } from '../services/forumServices';
import { apiStatus } from '../../../helpers/status';
import { scrollToTop } from '../../../helpers/helpers';
import auth from '../../../user/behindScenes/Auth/AuthCheck';

// Modals
import NfswAlertModal from '../../modals/NfswAlertModal';
import { toggleNfswModal } from '../../../redux/actions/modals/ModalsAc';
import { isAllowedToComment } from './comments/ForumCommProvider';


const SingleForum = props => {

    // Hooks and vars
    const {
        currForum,
        forumTypes,
        actionBox,
        nfsw_modal,
        shareBox,
        dispatch,
        forum_index,
        usersToTag,
        postCommentReducer,
        comments: { count: commentsCount, page = 1 }
    } = props
    const location = useLocation()

    // cameFromSearch
    const navigate = useNavigate()
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
        category_name: currForum?.category_name,
        created_at: currForum?.created_at,
        name: currForum?.title,
        forum_id: currForum?.forum_id,
        is_requested: currForum?.is_requested,
        isReported: currForum?.isReported,
        forum_index,
        type: currForum?.type,
        dispatch,
        currForum,
        actionBox,
        shareBox,
        isActionBoxVisible,
        is_for_post: false,
        is_calledfrom_detailPage: true
    }

    const forumFooterProps = {
        currForum,
        no_of_comments: currForum?.no_of_comments,
        viewcount: currForum?.viewcount ?? 0,
        forum_type,
        is_calledfrom_detailPage: true,
        isPinned,
        showPin,
        forum_tags: currForum?.tags,
        forum_id: currForum?.forum_id,
        forum_index,
        dispatch
    }

    useEffect(() => {
        dispatch(forumHandlers.handleForums({ shareBox: {}, actionBox: {} }))
        if (is_nsw && auth()) {
            dispatch(toggleNfswModal({
                forum_index,
                forum_id: currForum?.forum_id,
                isVisible: true, forum_link: `/forums/${currForum?.slug}`
            }))
        }
        scrollToTop()
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
                    to={`/${location?.state?.cameFromSearch ? "search" : "forums"}`}
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
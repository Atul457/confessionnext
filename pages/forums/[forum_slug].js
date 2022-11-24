import React, { useEffect } from 'react'
import Head from 'next/head'

// Next router imports
import { useRouter } from 'next/router'

// Next auth
import { useSession } from 'next-auth/react'

// Component imports
import SingleForum from '../../components/user/forums/detailPage/SingleForum'
import ForumComments from '../../components/user/forums/detailPage/comments/ForumComments'
import SendRequestModal from '../../components/user/modals/SendJoinRequestModal'
import ReportForumModal from '../../components/user/modals/ReportForumModal'
import ReportForumComModal from '../../components/user/modals/ReportForumComModal'

// Helpers
import { apiStatus, resHandler } from '../../utils/api'
import auth from '../../utils/auth'
import { isAllowedToComment } from '../../utils/helpers'
import { http } from '../../utils/http'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { forumHandlers } from '../../redux/actions/forumsAc/forumsAc'
import Loader from '../../components/common/Loader'
import { pageCategoryTypes } from '../../utils/provider'


const { getKeyProfileLoc } = auth

const ForumDetailPage = ({ forum }) => {

    // Hooks and vars
    const { modalsReducer: { nfsw_modal }, forumsReducer } = useSelector(state => state)
    const { data: session } = useSession()
    const router = useRouter()
    const {
        forumTypes,
        forums: forumsRed,
        detailPage,
        modals,
        usersToTag
    } = forumsReducer
    const actionBox = forumsRed.actionBox
    const shareBox = forumsRed.shareBox
    const { requestToJoinModal, reportForumModal, reportForumCommentModal } = modals
    const forumSlug = router.query?.forum_slug ?? false
    const dispatch = useDispatch()
    const { handleForum } = forumHandlers
    const {
        status: forumStatus,
        data: currForum,
        postComment: postCommentReducer,
        message,
        comments,
        page
    } = detailPage
    const isAllToComment = isAllowedToComment(currForum)
    const singleCommentProps = {
        nfsw_modal,
        usersToTag,
        dispatch,
        forum_index: 0,
        currForum,
        comments,
        serverSideData: forum,
        auth: session,
        shareBox: shareBox ?? {},
        page,
        actionBox: actionBox ?? {},
        forumTypes,
        postCommentReducer
    }

    useEffect(() => {
        const clickHandler = e => {
            // if action box is visible hide it else do nothing
            let isActionIconClicked = e.target.classList
            isActionIconClicked = isActionIconClicked.contains("preventCloseAcBox")

            if (!isActionIconClicked && ("forum_id" in actionBox || "forum_index" in actionBox))
                toggleForumAcboxFn()
        }
        document.addEventListener("click", clickHandler)
        return () => {
            document.removeEventListener("click", clickHandler)
        }
    }, [actionBox])


    useEffect(() => {
        // Get Forum
        const getForum = async () => {
            let obj = {
                token: "",
                method: "get",
                url: `getforum/${forumSlug}`,
                token: getKeyProfileLoc("token") ?? ""
            }
            try {
                let res = await http(obj)
                res = resHandler(res)
                let forum = res?.forum ?? {}
                forum = { ...forum, isAllowedToComment: isAllowedToComment(forum) }
                dispatch(handleForum({ data: forum ?? {}, status: apiStatus.FULFILLED }))
            } catch (error) {
                dispatch(handleForum({ status: apiStatus.REJECTED, message: error?.message }))
            }
        }
        if (forumSlug) getForum()
    }, [forumSlug])


    // Functions

    // Toggle action box
    const toggleForumAcboxFn = () => {
        let dataToSend = {}
        dispatch(forumHandlers.handleForums({ actionBox: dataToSend }))
    }

    if (!forumSlug)
        return (
            <div className="alert alert-danger w-100" role="alert">
                Forum slug not provided.
            </div>
        )

    if (forumStatus === apiStatus.REJECTED)
        return (
            <div className="alert alert-danger w-100" role="alert">
                {message}
            </div>
        )

    return (
        <>
            {forum ?
                <Head>
                    <title>{`${forum?.title} - The Talk Place`}</title>
                    <meta name="description" content={forum?.description} />
                    <meta property="og:description" content={forum?.description} />
                    <meta property="twitter:description" content={forum?.description} />
                    <meta property="og:title" content={`${forum?.title} - The Talk Place`} />
                    <meta name="twitter:title" content={`${forum?.title} - The Talk Place`} />
                </Head> : null}

            <div className='w-100'>
                <SingleForum {...singleCommentProps} />
            </div>

            <div className='comments_cont'>
                <ForumComments
                    usersToTag={usersToTag}
                    isAllowedToComment={isAllToComment}
                    forum_id={currForum?.forum_id ?? false} />
            </div>

            {/* Modals */}

            {/* Send join request modal */}
            {requestToJoinModal.visible && <SendRequestModal />}

            {/* Report forum modal */}
            {reportForumModal.visible && <ReportForumModal />}

            {/* Report comment modal */}
            {reportForumCommentModal.visible && <ReportForumComModal />}
        </>
    )
}

export async function getServerSideProps(context) {
    const forum_slug = context.query.forum_slug
    let forum = {}

    const getForum = async () => {
        let obj = {
            token: "",
            method: "get",
            url: `getforum/${forum_slug}`
        }
        try {
            let res = await http(obj)
            res = resHandler(res)
            forum = res?.forum ?? {}
        } catch (error) {
            forum = {}
        }
    }

    await getForum()

    return {
        props: {
            forum
        }
    }
}

ForumDetailPage.additionalProps = {
    serverSidePage: true,
    removeDefaultMeta: true,
    pageCategory: pageCategoryTypes.forum
}

export default ForumDetailPage
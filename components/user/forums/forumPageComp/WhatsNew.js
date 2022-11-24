import React, { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

// Custom components
import Forum from '../forum/Forum'
import SendRequestModal from '../../modals/SendJoinRequestModal'
import ReportForumModal from '../../modals/ReportForumModal'
import NfswAlertModal from '../../modals/NfswAlertModal'
// import AdSense_ from '../../../user/pageElements/components/AdSense'
import { AdSense_, WhatsNewAds } from '../../ads/AdMob'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { forumHandlers } from '../../../../redux/actions/forumsAc/forumsAc'

// helpers
import { envConfig } from '../../../../utils/envConfig'
import auth from '../../../../utils/auth'
import { apiStatus, resHandler } from '../../../../utils/api'
import { scrollDetails, scrollToTop } from '../../../../utils/dom'
import { http } from '../../../../utils/http'
import { useSession } from 'next-auth/react'


const { getKeyProfileLoc } = auth


const WhatsNew = () => {

    // Hooks and vars
    const {
        forums: forumsRed,
        categories,
        forumTypes,
        modals
    } = useSelector(state => state.forumsReducer)
    const { data: session } = useSession()
    const cameback = scrollDetails.getScrollDetails()?.pageName === "forums"
    const { modalsReducer: { nfsw_modal } } = useSelector(state => state)
    const { requestToJoinModal, reportForumModal } = modals
    const dispatch = useDispatch()
    const { activeCategory } = categories
    const { handleForums } = forumHandlers
    const { data: forums, status: forumsStatus, page, hasMore } = forumsRed
    const afterHowManyShowAdd = 7;    //AFTER THIS MUCH SHOW ADDS

    useEffect(() => {
        const scrollDetail = scrollDetails.getScrollDetails()
        if (scrollDetail?.pageName === "forums") {
            window.scrollTo({
                top: scrollDetail?.scrollPosition ?? 0,
                behavior: "smooth"
            })
            scrollDetails.setScrollDetails({})
        }
    }, [])

    // Gets the data from the api and dispatchs it
    useEffect(() => {
        if (cameback === false || forums.length === 0) {
            getForums(1, false)
            scrollToTop({})
        }
    }, [activeCategory])


    // Functions

    // Get Forums
    const getForums = async (page = 1, append = false) => {
        let acCategory = activeCategory ? `${activeCategory}` : 'all'
        let obj = {
            token: getKeyProfileLoc("token") ?? "",
            method: "get",
            url: `getforums/${acCategory}/${page}`
        }
        try {
            let res = await http(obj)
            res = resHandler(res)
            const forums_from_api = res?.forums ?? []
            dispatch(handleForums({
                data: append ? [...forums, ...forums_from_api] : forums_from_api,
                status: apiStatus.FULFILLED,
                count: res?.count,
                hasMore: forums_from_api.length ? true : false,
                page
            }))
        } catch (error) {
            console.log(error)
        }

    }

    // Render forums
    const renderForums = forumsArr => {
        if (forumsArr && forumsArr.length) return (
            forums.map((currForum, cfIndex) => {
                return (<div key={`forumNo${cfIndex}`}>
                    <Forum
                        session={session}
                        dispatch={dispatch}
                        forum_index={cfIndex}
                        actionBox={forumsRed.actionBox ?? {}}
                        shareBox={forumsRed.shareBox ?? {}}
                        forumTypes={forumTypes}
                        rememberScrollPos={true}
                        pageName="forums"
                        currForum={currForum} />

                    {/* {((cfIndex + 1) % afterHowManyShowAdd === 0) ? <div className="mb-4">
                        {envConfig?.isProdMode ? <AdSense_ /> :
                            <WhatsNewAds mainContId={`whatsNewPage${cfIndex}`} />}
                    </div> : null} */}

                </div>)
            })
        )

        return (
            <h5 className='endListMessage noConfessions'>No forums found in this category</h5>
        )
    }

    const fetchMoreData = () => {
        if (cameback === false && hasMore) {
            getForums(page + 1, true)
        }
    }

    if (forumsStatus === apiStatus.LOADING)
        return (
            <div className="w-100 text-center">
                <div className="spinner-border pColor d-inline-block mx-auto" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )

    return (
        <div>
            {forums.length > 0 ?
                <InfiniteScroll
                    scrollThreshold="80%"
                    endMessage={<div className=" text-center endListMessage mt-4 pb-3">End of Forums</div>}
                    dataLength={forums.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={
                        <div className="text-center mb-5">
                            <div className="spinner-border pColor text-center" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    }
                >
                    {renderForums(forums)}
                </InfiniteScroll>
                :
                <h5 className='endListMessage noConfessions'>
                    No forums found in this category
                </h5>}


            {/* Modals */}

            {/* Send join request modal */}
            {requestToJoinModal.visible && <SendRequestModal />}

            {/* Report forum modal */}
            {reportForumModal.visible && <ReportForumModal />}

            {/* Nfsw alert modal */}
            {nfsw_modal.isVisible && <NfswAlertModal nfsw_modal={nfsw_modal} />}

        </div>
    )
}

export default WhatsNew
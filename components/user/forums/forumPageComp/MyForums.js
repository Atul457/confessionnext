import React, { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

// Custom components
import Forum from '../forum/Forum'
import SendRequestModal from '../../modals/SendJoinRequestModal'
import ReportForumModal from '../../modals/ReportForumModal'
import { AdSense_ } from '../../ads/AdMob'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { forumHandlers } from '../../../../redux/actions/forumsAc/forumsAc'
import { apiStatus, resHandler } from '../../../../utils/api'

// helpers
import DeleteForumModal from '../../modals/DeleteForumModal'
import { http } from '../../../../utils/http'
import { scrollDetails, scrollToTop } from '../../../../utils/dom'
import auth from '../../../../utils/auth'
// import { WhatsNewAds } from '../../../user/pageElements/components/AdMob'

const { getKeyProfileLoc } = auth

const MyForums = () => {

  // Hooks and vars
  const {
    forums: forumsRed,
    forumTypes,
    modals
  } = useSelector(state => state.forumsReducer)
  const { requestToJoinModal, reportForumModal, deleteForumModal } = modals
  const cameback = scrollDetails.getScrollDetails()?.pageName === "myforums"
  const dispatch = useDispatch()
  const { handleForums } = forumHandlers
  const { data: forums, status: forumsStatus, page, count = 0, hasMore } = forumsRed
  const afterHowManyShowAdd = 7;    //AFTER THIS MUCH SHOW ADDS

  useEffect(() => {
    const scrollDetail = scrollDetails.getScrollDetails()
    if (scrollDetail?.pageName === "myforums") {
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
      scrollToTop()
    }
  }, [])

  // Functions

  // Get Forums
  const getForums = async (page = 1, append = false) => {
    let obj = {
      token: getKeyProfileLoc("token", true) ?? "",
      method: "get",
      url: `getmyforums/${page}`
    }
    try {
      let res = await fetchData(obj)
      res = resHandler(res)
      const forums_from_api = res?.forums ?? []

      dispatch(handleForums({
        status: apiStatus.FULFILLED,
        count: res?.count,
        hasMore: forums_from_api.length ? true : false,
        page
      }))

    } catch (error) {
      console.log(error)
    }

    if (0) console.log(append)
  }

  const fetchMoreData = () => {
    if (cameback === false && hasMore) {
      getForums(page + 1, true)
    }
  }


  // Render forums
  const renderForums = forumsArr => {
    if (forumsArr && forumsArr.length) return (
      forums.map((currForum, cfIndex) => {
        return (<div key={`forumNo${cfIndex}`}>
          <Forum
            isMyForumPage={true}
            dispatch={dispatch}
            forum_index={cfIndex}
            key={`forumNo${cfIndex}`}
            actionBox={forumsRed.actionBox ?? {}}
            shareBox={forumsRed.shareBox ?? {}}
            forumTypes={forumTypes}
            rememberScrollPos={true}
            pageName="myforums"
            currForum={currForum} />

          {/* {((cfIndex + 1) % afterHowManyShowAdd === 0) ? <div className="mb-4">
            {envConfig?.isProdMode ? <AdSense_ /> :
              <WhatsNewAds mainContId={`whatsNewPage${cfIndex}`} />}
          </div> : null} */}

        </div>)
      })
    )

    return (
      <h5 className='endListMessage noConfessions'>No forums found</h5>
    )
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
          hasMore={forums.length < count}
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
          No forums found
        </h5>
      }


      {/* Modals */}

      {/* Send join request modal */}
      {requestToJoinModal.visible && <SendRequestModal />}

      {/* Report forum modal */}
      {reportForumModal.visible && <ReportForumModal />}

      {/* Create forum modal */}
      {
        deleteForumModal.visible && <DeleteForumModal
          deleteForumModal={deleteForumModal}
          setDeleteForumModal={() => { }}
        />
      }

    </div >
  )
}

export default MyForums
import React, { useEffect } from 'react'

// Redux
import { useDispatch, useSelector } from 'react-redux';

import InfiniteScroll from 'react-infinite-scroll-component';
import ConfessionComp from '../components/user/search/ConfessionComp';
import ForumComp from '../components/user/search/ForumComp';
import { apiStatus } from '../utils/api';
import { useSession } from 'next-auth/react';
import { searchAcFn } from '../redux/actions/searchAc/searchAc';
import { getForumsNConfessions } from '../services/user/forumServices';

const messages = ["No results found", "No Posts found", "No Forums found", "No Tags found"]


const Search = () => {

    // Hooks and vars
    const { data: session } = useSession()
    const dispatch = useDispatch()
    const SearchReducer = useSelector(state => state.SearchReducer)
    const { modalsReducer: { nfsw_modal } } = useSelector(state => state)
    const {
        data: posts,
        status: postStatus,
        searchedWith = "",
        type = 0,
        page,
        hasMore
    } = SearchReducer
    const { forumTypes, categories: { activeCategory } } = useSelector(state => state.forumsReducer)
    const confessionType = 1
    const forumType = 2
    const notFoundMessage = messages[type]

    // Functions

    // Render forums
    const renderPost = postArr => {
        if (postArr && postArr.length) return (
            postArr.map((currPost, index) => {
                if (currPost?.pType === confessionType)
                    return <ConfessionComp
                        session={session}
                        index={index}
                        currPost={currPost}
                        cover_image={currPost.cover_image ?? ''}
                        is_viewed={currPost.is_viewed}
                        isRegistered={currPost.isRegistered}
                        isReported={currPost.isReported}
                        updateCanBeRequested={() => { }}
                        viewcount={currPost.viewcount}
                        handleCommentsModal={() => { }}
                        updateConfessionData={() => { }}
                        key={`fConf${index}`}
                        slug={currPost.slug}
                        createdAt={currPost.created_at}
                        post_as_anonymous={currPost.post_as_anonymous}
                        curid={currPost.user_id === '0' ? false : currPost.user_id}
                        category_id={currPost.category_id} profileImg={currPost.profile_image}
                        postId={currPost.confession_id}
                        imgUrl={currPost.image === '' ? '' : currPost.image}
                        userName={currPost.created_by}
                        category={currPost.category_name}
                        updatedConfessions={() => { }}
                        postedComment={currPost.description}
                        isNotFriend={currPost.isNotFriend}
                        like={currPost.like}
                        dislike={currPost.dislike}
                        is_liked={currPost.is_liked}
                        sharedBy={currPost.no_of_comments} />

                if (currPost?.pType === forumType)
                    return <ForumComp
                        session={session}
                        dispatch={dispatch}
                        forum_index={index}
                        key={`forumNo${index}`}
                        actionBox={{}}
                        forumTypes={forumTypes}
                        currForum={currPost} />

                return null
            })
        )
    }


    const changeType = (type) => {
        dispatch(searchAcFn({
            type
        }))
    }

    useEffect(() => {
        dispatch(searchAcFn({
            status: apiStatus.IDLE,
            message: "",
            data: [],
            page: 1,
            visible: false,
            hasMore: true,
            activeCategory: activeCategory ?? "all"
        }))
    }, [])


    const fetchMoreData = () => {
        dispatch(searchAcFn({
            page: page + 1
        }))
    }

    useEffect(() => {
        getForumsNConfessions({ SearchReducer: { ...SearchReducer, dispatch, page: 1, append: false } })
    }, [type])

    useEffect(() => {
        if (page === 1) return
        getForumsNConfessions({ SearchReducer: { ...SearchReducer, dispatch, append: true } })
    }, [page])

    if (postStatus === apiStatus.REJECTED) {
        <div className="alert alert-danger" role="alert">
            Unable to get results
        </div>
    }


    return (
        <>
            {/* <ForumLayoutWrapper propToWatch={posts}> */}
            <div className='search_page'>

                {searchedWith?.trim().length > 0 ?
                    <div className="w-100 search_results_str">
                        Search Result for “{searchedWith ?? ""}”
                    </div>
                    : null}

                <div className="search_types_cont">
                    <div className={`search_type ${type === 0 ? "active" : ""}`}
                        onClick={() => changeType(0)}>
                        Top
                    </div>
                    <div className={`search_type ${type === 1 ? "active" : ""}`}
                        onClick={() => changeType(1)}>
                        Post
                    </div>
                    <div className={`search_type ${type === 2 ? "active" : ""}`}
                        onClick={() => changeType(2)}>
                        Forum
                    </div>
                    <div className={`search_type ${type === 3 ? "active" : ""}`}
                        onClick={() => changeType(3)}>
                        Tags
                    </div>
                </div>

                {/* <ExpandableForumCats classNames='mb-3 d-block d-md-none' isSearchPage={true} /> */}

                {posts ?
                    <div className='posts_wrapper'>
                        {
                            (postStatus === apiStatus.LOADING && page === 1)
                                ?
                                <div className="text-center">
                                    <div className="spinner-border pColor" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                                :
                                (posts.length > 0 ?
                                    <InfiniteScroll
                                        scrollThreshold="80%"
                                        endMessage={<div className=" text-center endListMessage mt-4 pb-3">End of Posts</div>}
                                        dataLength={posts.length}
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
                                        {renderPost(posts)}
                                    </InfiniteScroll>
                                    :
                                    <h5 className='endListMessage noConfessions'>
                                        {notFoundMessage}
                                    </h5>
                                )
                        }
                    </div>
                    :
                    null}
            </div>
            {/* </ForumLayoutWrapper> */}
            {/* <Footer /> */}

            {/* Nfsw alert modal */}
            {nfsw_modal.isVisible && <NfswAlertModal nfsw_modal={nfsw_modal} />}
        </>
    )
}

export default Search
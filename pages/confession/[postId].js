import React, { useState, useEffect } from 'react';
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import auth from '../../utils/auth';
import { http } from '../../utils/http';
import { apiStatus, resHandler } from '../../utils/api';
import ReportCommentModal from '../../components/user/modals/ReportCommentModal';
import ConfessionDetailPage from '../../components/user/modals/ConfessionDetailPage';
import ReportPostModal from '../../components/user/modals/ReportPostModal';
import { openCModal as openCommentsModalFn } from '../../redux/actions/commentsModal';
import Head from 'next/head';
import ErrorFlash from '../../components/common/ErrorFlash';


const { getToken } = auth


export default function CommentsGot(props) {

    const router = useRouter();
    const serverSideData = props.confession;
    const params = {
        postId: router.query.postId
    }
    const location = router.query
    let history = router.push;
    const dispatch = useDispatch();
    const [comDetailPage, setComDetailPage] = useState({
        status: apiStatus.LOADING,
        message: "",
        data: {},
        props: {}
    })
    const {
        reportPostModalReducer,
        reportComModalReducer: reportModalReducer
    } = useSelector(state => state);
    const [confessionData, setConfessionData] = useState(false);
    const [lightBox, setLightBox] = useState(false);
    const [activeCat, setActiveCat] = useState(false);
    const [loaded, setLoaded] = useState(false)
    const [reqFulfilled, setReqFullfilled] = useState(false);

    const updatePost = (dataToUpdate) => {
        setComDetailPage({
            ...comDetailPage,
            props: {
                ...comDetailPage.props,
                ...dataToUpdate
            }
        })
    }

    const updateConf = (dataToUpdate) => {
        updatePost(dataToUpdate)
    }

    const openCommentsModal = () => {
        dispatch(openCommentsModalFn({
            "postId": serverSideData.confession_id,
            "viewcount": serverSideData.viewcount,
            "index": 0,
            "userName": serverSideData.userName,
            "postedComment": serverSideData.description,
            "category_id": serverSideData.category_id,
            "category_name": serverSideData.category_name,
            "confession_id": serverSideData.confession_id,
            "created_at": serverSideData.created_at,
            "created_by": serverSideData.created_by,
            "description": serverSideData.description,
            "no_of_comments": confessionData.no_of_comments,
            "post_as_anonymous": serverSideData.post_as_anonymous,
            "profile_image": serverSideData.profile_image,
            "user_id": serverSideData.user_id === '0' ? false : serverSideData.user_id,
            "image": serverSideData.image === '' ? '' : serverSideData.image,
            "isNotFriend": confessionData.isNotFriend,
            "is_viewed": confessionData.is_viewed,
            "updatedConfessions": () => { },
            "like": confessionData.like,
            "slug": serverSideData.slug,
            "is_liked": confessionData.is_liked,
            "isReported": confessionData.isReported,
            "dislike": confessionData.dislike,
            "is_liked_prev": confessionData.is_liked,
            "cover_image": serverSideData.cover_image,
            "updateConfessionData": updateConfessionData
        }))
    }

    // GET CONFESSION FUNCTION
    async function getConfession() {

        let token;
        token = getToken();

        let obj = {
            data: {},
            token: token,
            method: "get",
            url: `getconfession/${params.postId}`
        }

        setComDetailPage({
            ...comDetailPage,
            status: apiStatus.LOADING
        })

        try {
            const response = await http(obj)
            if (response.data.status === true) {

                let activeCategory = response.data.confession.category_id;
                setActiveCat(activeCategory);
                setConfessionData(response.data.confession);

                const confRes = response.data.confession

                setComDetailPage({
                    ...comDetailPage,
                    status: apiStatus.FULFILLED,
                    data: response.data.confession,
                    props: {
                        "postId": confRes?.confession_id,
                        "viewcount": confRes?.viewcount,
                        "visibility": true,
                        "index": 0,
                        "userName": confRes?.userName,
                        "postedComment": confRes?.description,
                        "category_id": confRes?.category_id,
                        "category_name": confRes?.category_name,
                        "confession_id": confRes?.confession_id,
                        "created_at": confRes?.created_at,
                        "created_by": confRes?.created_by,
                        "description": confRes?.description,
                        "no_of_comments": confRes?.no_of_comments,
                        "post_as_anonymous": confRes?.post_as_anonymous,
                        "profile_image": confRes?.profile_image,
                        "user_id": confRes?.user_id === '0' ? false : confRes?.user_id,
                        "image": confRes?.image === '' ? '' : confRes?.image,
                        "isNotFriend": confRes?.isNotFriend,
                        "is_viewed": confRes?.is_viewed,
                        "updatedConfessions": () => { },
                        "like": confRes?.like,
                        "slug": confRes?.slug,
                        "is_liked": confRes?.is_liked,
                        "isReported": confRes?.isReported,
                        "dislike": confRes?.dislike,
                        "is_liked_prev": confRes?.is_liked,
                        "cover_image": confRes?.cover_image,
                        "updateConfessionData": updateConfessionData,
                        "updatePost": updatePost
                    }
                })
                return setLoaded(true);
            } else {
                if ("newslug" in response.data) {
                    const linkToRedirect = `/confession/${response.data?.newslug}`
                    return history(linkToRedirect)
                }

                setComDetailPage({
                    ...comDetailPage,
                    status: apiStatus.REJECTED,
                    message: response?.message ?? "Something went wrong"
                })
            }

            //Handles app in case of no api response

            setConfessionData(true);
            setLoaded(false);

        } catch (err) {
            console.log({ err })
            setConfessionData(true);
            setLoaded(false);
            setComDetailPage({
                ...comDetailPage,
                status: apiStatus.REJECTED,
                message: err?.message ?? "Something went wrong"
            })
        }
    }


    // REFETCH COMMENTS ON URL POSTID CHANGE
    useEffect(() => {
        setConfessionData(false)
        setLoaded(false);
        getConfession();
    }, [params.postId])


    // OPENS THE COMMENTS MODAL FIRST TIME AFTER COMMENT DATA HAS BEEN LOADED
    useEffect(() => {
        if (loaded && Object.keys(confessionData).length > 0) openCommentsModal();
    }, [loaded])


    // REOPENS THE COMMENTS MODAL ON CONFESSION_ID CHANGE
    useEffect(() => {
        if (params.postId === confessionData.confession_id && !reqFulfilled) setReqFullfilled(true)
        if (reqFulfilled) setReqFullfilled(false)
    }, [params.postId])


    // TAKES YOU TO THE HOME PAGE, AND LOADS THE ACTIVECAT CONFESSION DATA
    const updateActiveCategory = (activeCat) => {
        history(`/home`, { state: { active: activeCat } });
    }

    // UPDATES THE CONFESSION DATA ON THE COMMENTS GOT PAGE
    function updateConfessionData(data, dataToUpdate) {

        let updatedConfessionArray;
        let updatedConfessionNode;
        updatedConfessionArray = { ...confessionData };
        updatedConfessionNode = updatedConfessionArray;
        updatedConfessionNode = {
            ...updatedConfessionNode,
            ...data
        };
        updatedConfessionArray = updatedConfessionNode;
        updatePost(updatedConfessionNode)
    }

    if (!serverSideData?.confession_id) {
        return <h5 className='w-100'><ErrorFlash message="Confession not found" /></h5>
    }

    return (
        <>
            {serverSideData?.confession_id ?
                <Head>
                    <title>{`${serverSideData?.description} - The Talk Place`}</title>
                    <meta name="description" content={serverSideData?.description} />
                    <meta property="og:description" content={serverSideData?.description} />
                    <meta property="twitter:description" content={serverSideData?.description} />
                    <meta property="og:title" content={`${serverSideData?.title} - The Talk Place`} />
                    <meta name="twitter:title" content={`${serverSideData?.title} - The Talk Place`} />
                </Head> : null}

            {serverSideData
                ?
                <>
                    {lightBox && (
                        serverSideData.image && ((serverSideData.image).length !== 0 && ((serverSideData.image).length > 1
                            ?
                            (<Lightbox images={serverSideData.image} onClose={() => { setLightBox(false) }} />)     //MULTIPLE IMAGES
                            :
                            (<Lightbox image={serverSideData.image} onClose={() => { setLightBox(false) }} />)))    //SINGLE IMAGE
                    )}

                    {comDetailPage.status === apiStatus.REJECTED
                        ?
                        <div className="alert alert-danger w-100 mx-3" role="alert">
                            {comDetailPage.message}
                        </div>
                        :
                        (
                            <section className="col-lg-12 col-12 px-md-4 px-0">
                                <div className='w-100 mb-3'>

                                    <Link href={`/${location?.state?.cameFromSearch ? "search" : ""}`} className='backtoHome'>
                                        <span className='mr-2'>
                                            <i className="fa fa-chevron-left" aria-hidden="true"></i>
                                            <i className="fa fa-chevron-left" aria-hidden="true"></i>
                                        </span>
                                        {location?.state?.cameFromSearch === true ? "Go back to search" : "Go back to home"}
                                    </Link>

                                </div>
                                <ConfessionDetailPage
                                    serverSideData={serverSideData}
                                    updatePost={updatePost}
                                    handleChanges={() => { }}
                                    updateConfessionData={() => { }}
                                    updatedConfessions={() => { }}
                                    state={comDetailPage?.data}
                                    comDetailPage={comDetailPage}
                                    categories={props.categories}
                                    handleCommentsModal={() => { }}
                                />
                            </section>
                        )}
                </>
                :
                <h1>Loading</h1>}

            {/* ReportPostsModal */}
            {
                reportPostModalReducer.visible && (
                    <ReportPostModal
                        updatedConfessions={updateConf} />)
            }
            {/* ReportPostsModal */}

            {/* ReportCommentModal */}
            {reportModalReducer.visible && <ReportCommentModal />}
        </>
    );
}

export async function getServerSideProps(context) {

    const postId = context.query.postId
    let confession = {}

    const getForum = async () => {
        let obj = {
            token: "",
            method: "get",
            url: `getconfession/${postId}`
        }
        try {
            let res = await http(obj)
            res = resHandler(res)
            confession = res?.confession ?? {}
        } catch {
            confession = {}
        }
    }

    await getForum()

    return {
        props: {
            confession
        }
    }
}


CommentsGot.additionalProps = {
    serverSidePage: true,
    removeDefaultMeta: true
}

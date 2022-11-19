import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { apiStatus } from '../../../helpers/status';
import { fetchData } from "../../../commonApi"
import { forumHandlers, mutateForumFn, reportForumAcFn } from '../../../redux/actions/forumsAc/forumsAc';
import { getKeyProfileLoc } from '../../../helpers/profileHelper';
import { reportedFormStatus } from '../../../components/forums/detailPage/comments/ForumCommProvider';
import auth from '../../behindScenes/Auth/AuthCheck';
import { useNavigate } from 'react-router-dom';


const ReportForumModal = () => {

    // Hooks and vars
    const navigate = useNavigate()
    const { modals, detailPage } = useSelector(state => state.forumsReducer)
    const { handleForum } = forumHandlers
    const { reportForumModal } = modals
    const { visible, message } = reportForumModal
    const detailPageData = detailPage.data
    const { isReported, forum_id, forum_index, is_for_post } = reportForumModal.data
    const isLoading = reportForumModal.status === apiStatus.LOADING
    const dispatch = useDispatch();
    const { reportPostModalReducer } = useSelector(state => state)

    useEffect(() => {
        if (visible && !auth()) {
            dispatch(reportForumAcFn({ reset: true }))
            navigate("/login")
        }
    }, [])

    // Functions

    // Close modal
    const closeModal = () => {
        dispatch(reportForumAcFn({ reset: true }))
    }

    // Updates the list
    const doReport = () => {
        // is_for_post : the modal is opened using a post
        // !is_for_post : the modal is opened using detail page
        if (!is_for_post) dispatch(handleForum({
            data: { ...detailPageData, isReported: reportedFormStatus.reported }
        }))
        else dispatch(mutateForumFn({
            forum_index,
            data_to_mutate: { isReported: reportedFormStatus.reported }
        }))
        closeModal()
    }

    // Report post
    const reportForum = async () => {

        let obj = {
            data: {},
            token: getKeyProfileLoc("token", true) ?? "",
            method: "get",
            url: `reportforum/${forum_id}`
        }

        try {
            dispatch(reportForumAcFn({
                status: apiStatus.LOADING,
                message: ""
            }))
            const res = await fetchData(obj)
            if (res.data.status === true) {
                dispatch(mutateForumFn({
                    forum_index,
                    data_to_mutate: { isReported: 1 }
                }))
                doReport()
            } else {
                dispatch(reportForumAcFn({
                    status: apiStatus.REJECTED,
                    message: res.data?.message
                }))
            }

        } catch (err) {
            dispatch(reportForumAcFn({
                status: apiStatus.REJECTED,
                message: err.message
            }))
        }
    }


    return (
        <Modal show={visible} centered size="md" onHide={closeModal}>
            <Modal.Header className='justify-content-between'>
                <h6>Report Forum</h6>
            </Modal.Header>
            <Modal.Body className="privacyBody text-center">
                {!isReported ? "Are you sure, you want to report this forum?" :
                    "You have already reported this forum"}

                {reportPostModalReducer.status === apiStatus.FULFILLED &&
                    <div className="mt-2 text-success font-weight-bold">
                        {message}
                    </div>}

                {reportPostModalReducer.status === apiStatus.REJECTED &&
                    <div className={`responseCont mt-2 text-danger`}>
                        {message}
                    </div>}

            </Modal.Body>
            <Modal.Footer className="pt-0 justify-content-center">
                {isReported ?
                    <button className="modalFootBtns btn" variant="primary" onClick={closeModal}>
                        Done
                    </button>
                    :
                    <>
                        <button className="modalFootBtns btn" variant="primary" onClick={closeModal}>
                            Cancel
                        </button>
                        <button className="modalFootBtns btn" variant="primary" onClick={reportForum}>
                            {isLoading ?
                                <div className="spinner-border text-white" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : "Yes"}
                        </button>
                    </>}
            </Modal.Footer>
        </Modal>
    )
}

export default ReportForumModal
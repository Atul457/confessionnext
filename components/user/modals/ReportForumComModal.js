import React from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { apiStatus } from '../../../helpers/status';
import { fetchData } from "../../../commonApi"
import { handleSingleForumCommAcFn, reportForumCommAcFn } from '../../../redux/actions/forumsAc/forumsAc';
import { getKeyProfileLoc } from '../../../helpers/profileHelper';
import { reportedFormStatus } from '../../../components/forums/detailPage/comments/ForumCommProvider';


const ReportForumComModal = () => {

    // Hooks and vars

    const { reportForumCommentModal } = useSelector(state => state.forumsReducer.modals)
    const { visible, message } = reportForumCommentModal
    const {
        isReported,
        forum_id,
        comment_id,
        comment_index,
        parent_comment_index,
        is_for_subcomment
    } = reportForumCommentModal.data
    const isLoading = reportForumCommentModal.status === apiStatus.LOADING
    const dispatch = useDispatch();

    // Functions

    // Close modal
    const closeModal = () => {
        dispatch(reportForumCommAcFn({ reset: true }))
    }

    // Updates the list
    const doReport = () => {
        // is_for_subcomment : the modal is opened using a post
        // !is_for_subcomment : the modal is opened using detail page
        if (is_for_subcomment) dispatch(handleSingleForumCommAcFn({
            comment_index,
            parent_comment_index,
            is_for_sub_comment: true,
            data: { isReported: reportedFormStatus.reported }
        }))
        else
            dispatch(handleSingleForumCommAcFn({
                comment_index,
                is_for_sub_comment: false,
                data: { isReported: reportedFormStatus.reported }
            }))
        closeModal()
    }

    // Report post
    const reportForumComment = async () => {

        let obj = {
            data: {},
            token: getKeyProfileLoc("token", true) ?? "",
            method: "get",
            url: `reportforumcomment/${forum_id}/${comment_id}`
        }

        try {
            dispatch(reportForumCommAcFn({
                status: apiStatus.LOADING,
                message: ""
            }))
            const res = await fetchData(obj)
            if (res.data.status === true) {
                doReport()
            } else {
                dispatch(reportForumCommAcFn({
                    status: apiStatus.REJECTED,
                    message: res.data?.message
                }))
            }

        } catch (err) {
            dispatch(reportForumCommAcFn({
                status: apiStatus.REJECTED,
                message: err.message
            }))
        }
    }


    return (
        <Modal show={visible} centered size="md" onHide={closeModal}>
            <Modal.Header className='justify-content-between'>
                <h6>Report Comment</h6>
            </Modal.Header>
            <Modal.Body className="privacyBody text-center">
                {!isReported ? "Are you sure, you want to report this comment?" :
                    "You already have reported this comment"}

                {reportForumCommentModal.status === apiStatus.FULFILLED &&
                    <div className="mt-2 text-success font-weight-bold">
                        {message}
                    </div>}

                {reportForumCommentModal.status === apiStatus.REJECTED &&
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
                        <button className="modalFootBtns btn" variant="primary" onClick={reportForumComment}>
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

export default ReportForumComModal
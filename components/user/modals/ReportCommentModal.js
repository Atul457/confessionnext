import React from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { apiStatus } from '../../../utils/api';
import { reOpenCModal } from '../../../redux/actions/commentsModal';
import { http } from '../../../utils/http';
import { resetReportModal, toggleReportComModal } from '../../../redux/actions/reportcommentModal';


const ReportCommentModal = () => {

    // Hooks
    const dispatch = useDispatch()
    const reportModalReducer = useSelector(state => state.reportComModalReducer)

    // Functions

    // Close modal
    const closeModal = (args) => {
        if (args?.mutateComments) {
            reportModalReducer?.data?.mutateCommentsFn({
                isReported: 1
            }, reportModalReducer?.data?.comment_index)
        }
        dispatch(resetReportModal(false))
        dispatch(reOpenCModal())
    }

    // Report comment
    const reportComment = async () => {
        const { confessionId, commentId } = reportModalReducer.data
        let userData = localStorage.getItem("userDetails") ?? { token: "" };
        let obj = {
            data: {},
            token: JSON.parse(userData).token,
            method: "get",
            url: `reportcomment/${confessionId}/${commentId}`
        }
        try {
            dispatch(toggleReportComModal({
                status: apiStatus.LOADING,
                message: ""
            }))
            const res = await http(obj)
            if (res.data.status === true) {
                closeModal({ mutateComments: true })
            } else {
                dispatch(toggleReportComModal({
                    status: apiStatus.REJECTED,
                    message: res.data?.message
                }))
            }

        } catch (err) {
            dispatch(toggleReportComModal({
                status: apiStatus.REJECTED,
                message: err.message
            }))
            console.log(err.message)
        }
    }


    return (
        <Modal show={reportModalReducer.visible} centered size="md" onHide={closeModal}>
            <Modal.Header className='justify-content-between'>
                <h6>Report Comment</h6>
            </Modal.Header>
            <Modal.Body className="privacyBody text-center report_com_modalbody">
                {reportModalReducer.isReported === 0 ? "Are you sure, you want to report this comment?" :
                    "You already have reported this comment"}

                {reportModalReducer.status === apiStatus.FULFILLED &&
                    <div className="mt-2 text-success font-weight-bold">
                        {reportModalReducer.message}
                    </div>}

                {reportModalReducer.status === apiStatus.REJECTED &&
                    <div className={`responseCont mt-2 text-danger`}>
                        {reportModalReducer.message}
                    </div>}

            </Modal.Body>
            <Modal.Footer className="pt-0 justify-content-center">
                {reportModalReducer.isReported === 1 ?
                    <button className="modalFootBtns btn" variant="primary" onClick={closeModal}>
                        Done
                    </button>
                    :
                    <>
                        <button className="modalFootBtns btn" variant="primary" onClick={closeModal}>
                            Cancel
                        </button>
                        <button className="modalFootBtns btn" variant="primary" onClick={reportComment}>
                            {reportModalReducer.status === apiStatus.LOADING ?
                                <div className="spinner-border text-white" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : "Yes"}
                        </button>
                    </>}
            </Modal.Footer>
        </Modal>
    )
}

export default ReportCommentModal
import React from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { resetReportPostModal, toggleReportPostModal } from '../../../redux/actions/reportPostModal';
import { reOpenCModal, updateCModalState } from '../../../redux/actions/commentsModal';
import { apiStatus } from '../../../utils/api';
import { http } from '../../../utils/http';
import { updateConfession } from '../../../redux/actions/confession/confessionAc';
import auth from '../../../utils/auth';


const ReportPostModal = () => {

    // Hooks
    const dispatch = useDispatch()
    const { reportPostModalReducer } = useSelector(state => state)
    const { getKeyProfileLoc } = auth

    // Functions

    // Close modal
    const closeModal = (updateOrNot = false) => {
        if (reportPostModalReducer.data?.isFiredFromModal === true) {
            dispatch(toggleReportPostModal({
                status: apiStatus.IDLE,
                visible: false,
                ...(updateOrNot === true && { isReported: 1 })
            }))
            if (updateOrNot === true) {
                dispatch(updateCModalState({ isReported: 1 }))
                updateConfessionData({ isReported: 1 })
            }
            dispatch(reOpenCModal())
        } else {
            if (updateOrNot === true) {
                updateConfessionData({ isReported: 1 })
            }
            dispatch(resetReportPostModal())
        }


    }

    // Update confession
    const updateConfessionData = dataToUpdate => {
        let { postIndex } = reportPostModalReducer.data
        dispatch(updateConfession({ index: postIndex, data: dataToUpdate }))
    }

    // Report post
    const reportPost = async () => {
        const { confessionId } = reportPostModalReducer.data
        const token = getKeyProfileLoc("token") ?? ""
        let obj = {
            data: {},
            token: !token ? "" : token,
            method: "get",
            url: `reportconfession/${confessionId}`
        }
        try {
            dispatch(toggleReportPostModal({
                status: apiStatus.LOADING,
                message: ""
            }))
            const res = await http(obj)
            if (res.data.status === true) {
                closeModal(true)
            } else {
                dispatch(toggleReportPostModal({
                    status: apiStatus.REJECTED,
                    message: res.data?.message
                }))
            }

        } catch (err) {
            dispatch(toggleReportPostModal({
                status: apiStatus.REJECTED,
                message: err.message
            }))
            console.log(err.message)
        }
    }

    // console.log({ reportPostModalReducer, apiStatus })


    return (
        <Modal show={reportPostModalReducer.visible} centered size="md" onHide={closeModal}>
            <Modal.Header className='justify-content-between'>
                <h6>Report Post</h6>
            </Modal.Header>
            <Modal.Body className="privacyBody text-center">
                {reportPostModalReducer.isReported === 0 ? "Are you sure, you want to report this post?" :
                    "You have already reported this post"}

                {reportPostModalReducer.status === apiStatus.FULFILLED &&
                    <div className="mt-2 text-success font-weight-bold">
                        {reportPostModalReducer.message}
                    </div>}

                {reportPostModalReducer.status === apiStatus.REJECTED &&
                    <div className={`responseCont mt-2 text-danger`}>
                        {reportPostModalReducer.message}
                    </div>}

            </Modal.Body>
            <Modal.Footer className="pt-0 justify-content-center">
                {reportPostModalReducer.isReported === 1 ?
                    <button className="modalFootBtns btn" variant="primary" onClick={closeModal}>
                        Done
                    </button>
                    :
                    <>
                        <button className="modalFootBtns btn" variant="primary" onClick={closeModal}>
                            Cancel
                        </button>
                        <button className="modalFootBtns btn" variant="primary" onClick={reportPost}>
                            {reportPostModalReducer.status === apiStatus.LOADING ?
                                <div className="spinner-border text-white" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : "Yes"}
                        </button>
                    </>}
            </Modal.Footer>
        </Modal>
    )
}

export default ReportPostModal
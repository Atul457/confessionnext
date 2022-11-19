import React from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../../../commonApi';
import requestModalImg from '../../../images/requestModalImg.png';
import { reOpenCModal, updateCModal } from '../../../redux/actions/commentsModal';
import { changeCancelled, changeRequested, closeFRModal } from '../../../redux/actions/friendReqModal';
import auth from '../../behindScenes/Auth/AuthCheck';


export const FriendReqModal = ({ userId, closeFrReqModalFn, toggleLoadingFn, _updateCanBeRequested, cancelReq, chaneCancelled }) => {

    const friendReqState = useSelector(state => state.friendReqModalReducer)
    const commentsModalReducer = useSelector(state => state.commentsModalReducer)
    const dispatch = useDispatch();


    const sendFriendRequest = async (is_cancelled = 0) => {

        let token;

        if (auth()) {
            token = JSON.parse(localStorage.getItem("userDetails"));
            token = token.token;
        }

        let data = {
            friend_id: friendReqState.data.userId,
            is_cancelled: is_cancelled,
        }

        toggleLoadingFn();

        let obj = {
            data: data,
            token: token,
            method: "post",
            url: "sendfriendrequest"
        }

        // console.log(obj);

        try {
            const res = await fetchData(obj)
            if (res.data.status === true) {
                is_cancelled === 0 ? dispatch(changeRequested()) : dispatch(changeCancelled());
            } else {
                console.log(res);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const sendRequest = () => {
        _updateCanBeRequested(friendReqState.data.userId, 2);
        dispatch(closeFRModal({
            requested: false
        }))
        reOpenCommentsModal(2);
    }

    const cancelRequest = () => {
        _updateCanBeRequested(friendReqState.data.userId, 1);
        dispatch(closeFRModal({
            cancelled: false
        }))
        reOpenCommentsModal(1);
    }

    const closeModal = () => {
        dispatch(closeFRModal({
            
        }))
        reOpenCommentsModal();
    }

    const reOpenCommentsModal = (isNotFriend) => {
        if (isNotFriend) {
            dispatch(updateCModal(isNotFriend))
        }

        if (commentsModalReducer.state?.postId && commentsModalReducer.state?.postId !== null) {
            dispatch(reOpenCModal())
        }
    }

    return (
        <>
            {/* 
                CANCELREQ 
                TRUE : SHOW CANCEL MODAL
                FALSE : SHOW REQUEST MODAL
            */}

            {friendReqState?.data?.cancelReq === false
                ?
                <Modal show={friendReqState.visible} onHide={closeModal} size="md">
                    <Modal.Header>
                        <h6>Send a Friend Request</h6>
                        <span onClick={closeModal} type="button">
                            <i className="fa fa-times" aria-hidden="true"></i>
                        </span>
                    </Modal.Header>
                    <Modal.Body className="privacyBody friendReqModalBody">
                        <div className="reqModalImgCont">
                            <div className="head">
                                <img src={requestModalImg} alt="" />
                            </div>
                            <div className="body">
                                {friendReqState.requested === true ?
                                    "Friend Request Sent Successfully!" :
                                    "Are you sure you want to send a friend request to this user?"
                                }
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="pt-0 reqModalFooter">
                        {friendReqState.requested === true ?
                            <button
                                className="reqModalFootBtns w-75"
                                variant="primary"
                                onClick={sendRequest}
                            >
                                Done
                            </button>
                            :
                            (<>
                                <button
                                    className="reqModalFootBtns cancel"
                                    variant="primary"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button className="reqModalFootBtns" variant="primary" onClick={() => sendFriendRequest()}>
                                    {
                                        friendReqState.loading === true
                                            ?
                                            <div className="spinner-border wColor spinnerSizeFeed" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            :
                                            "Submit"
                                    }
                                </button>
                            </>)
                        }
                    </Modal.Footer>
                </Modal>

                :

                <Modal show={friendReqState.visible} onHide={closeModal} size="md">
                    <Modal.Header>
                        <h6>Cancel Request</h6>
                        <span onClick={closeModal} type="button">
                            <i className="fa fa-times" aria-hidden="true"></i>
                        </span>
                    </Modal.Header>
                    <Modal.Body className="privacyBody friendReqModalBody">
                        <div className="reqModalImgCont">
                            <div className="head">
                                <img src={requestModalImg} alt="" />
                            </div>
                            <div className="body">
                                {friendReqState.cancelled === true ?
                                    "Request cancelled Successfully!" :
                                    "Are You sure you want to cancel friend request sent, to this User?"}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="pt-0 reqModalFooter">
                        {friendReqState.cancelled === true ?
                            <button
                                className="reqModalFootBtns w-75"
                                variant="primary"
                                onClick={cancelRequest}
                            >
                                Done
                            </button>

                            :

                            <>
                                <button
                                    className="reqModalFootBtns cancel"
                                    variant="primary"
                                    onClick={closeModal}
                                >
                                    No
                                </button>
                                <button className="reqModalFootBtns" variant="primary" onClick={() => sendFriendRequest(1)}>
                                    {
                                        friendReqState.loading === true
                                            ?
                                            <div className="spinner-border wColor spinnerSizeFeed" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            :
                                            "Yes"
                                    }
                                </button></>}
                    </Modal.Footer>
                </Modal>}
        </>
    )
}

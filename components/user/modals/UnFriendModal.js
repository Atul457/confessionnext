import React from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { unFriendActionCreators } from '../../../redux/actions/unFriendReqModal';


const UnFriendModal = ({ unFriend }) => {

    const dispatch = useDispatch();
    const unFriendReducer = useSelector(state => state.unFriendReducer);

    const closeModal = () => {
        dispatch(unFriendActionCreators.updateUnFriendModalState({ visible: false }));
    }

    const removeFriend = () => {
        unFriend(unFriendReducer.data?.friend_id, unFriendReducer.data?.index);
    }


    return (
        <Modal show={unFriendReducer?.visible} onHide={closeModal} centered size="md">
            <Modal.Header className='justify-content-between'>
                <h6>Remove Friend</h6>
                <span onClick={closeModal} type="button">
                    <i className="fa fa-times" aria-hidden="true"></i>
                </span>
            </Modal.Header>
            <Modal.Body className="privacyBody text-left px-4 pt-4 pb-2 text-center">
                Do you want to remove your friend from this list ?
            </Modal.Body>
            <Modal.Footer className="pt-0 justify-content-center flex-wrap">
                <button className="modalFootBtns btn" variant="primary" onClick={removeFriend}>
                    Yes
                </button>
                <button className="modalFootBtns btn" variant="primary" onClick={closeModal}>
                    No
                </button>
            </Modal.Footer>

        </Modal>
    )
}

export default UnFriendModal
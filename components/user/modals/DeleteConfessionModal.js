import React from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { deleteConfession } from '../../../redux/actions/confession/confessionAc';

export default function DeleteConfessionModal({ deleteConfModal, closeDeletePostModal, deletePost }) {

    // Hooks and vars
    const dispatch = useDispatch()

    // Functions

    // Closes the modal
    const closeModal = () => {
        closeDeletePostModal();
    }

    // deletes the post
    const _deletePost = () => {
        deletePost(deleteConfModal.data.postId, deleteConfModal.data.index);
        dispatch(deleteConfession({
            index: deleteConfModal.data.index
        }))
    }

    return (
        <>
            <Modal show={deleteConfModal.visible} onHide={closeModal}>
                <Modal.Header>
                    <h6>Delete Confession</h6>
                </Modal.Header>
                <Modal.Body className="privacyBody">
                    Do you really want to delete the confession ?
                </Modal.Body>
                <Modal.Footer className="pt-0 justify-content-center">
                    <button className="modalFootBtns btn" variant="primary" onClick={closeModal}>
                        No
                    </button>
                    <button className="modalFootBtns btn" variant="primary" onClick={_deletePost}>
                        Yes
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

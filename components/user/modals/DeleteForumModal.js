import React from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { deleteForumAcFn } from '../../../redux/actions/forumsAc/forumsAc';
import { apiStatus } from '../../../utils/api';
import { deleteForumService } from '../forums/services/forumServices';

export default function DeleteForumModal() {

    // Hooks and vars
    const dispatch = useDispatch()
    const { modals: { deleteForumModal } } = useSelector(state => state.forumsReducer)
    const isLoading = deleteForumModal.status === apiStatus.LOADING

    // Functions

    // Closes the modal
    const closeModal = () => {
        dispatch(deleteForumAcFn({
            visible: false,
            status: apiStatus.IDLE,
            message: "",
            data: {
                forum_id: null,
                forum_index: null
            }
        }))
    }

    // Deletes the forum
    const deleteForum = () => {
        deleteForumService({
            dispatch,
            forum_id: deleteForumModal?.data?.forum_id,
            forum_index: deleteForumModal?.data?.forum_index
        })
    }

    return (
        <>
            <Modal show={true} onHide={closeModal}>
                <Modal.Header>
                    <h6>Delete Forum</h6>
                </Modal.Header>
                <Modal.Body className="privacyBody">
                    Do you really want to delete the forum ?
                </Modal.Body>
                <Modal.Footer className="pt-0 justify-content-center">
                    <button className="modalFootBtns btn" variant="primary" onClick={closeModal}>
                        No
                    </button>
                    <button className="modalFootBtns btn" variant="primary" onClick={deleteForum}>
                        {isLoading ?
                            <div className="spinner-border text-white" role="status">
                                <span className="sr-only">Loading...</span>
                            </div> : "Yes"}
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

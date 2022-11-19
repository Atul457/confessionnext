import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import postAlertActionCreators from '../../../redux/actions/postAlert';
import { useNavigate } from 'react-router-dom';
import { setPostBoxState } from '../../../redux/actions/postBoxState';

const PostAlertModal = ({ postConfession, data }) => {

    const dispatch = useDispatch();
    const history = useNavigate();
    const postAlertReducer = useSelector(state => state.postAlertReducer);

    useEffect(() => {
        if (postAlertReducer.postAnyway) {
            postConfession();
        }
    }, [postAlertReducer.postAnyway])

    const closeModal = () => {
        dispatch(postAlertActionCreators.closeModal());
    }

    const postAnyway = () => {
        var timer;
        return () => {
            clearInterval(timer);
            timer = setTimeout(() => {
                dispatch(postAlertActionCreators.updateModal({ postAnyway: true }));
            }, 500);
        }
    }

    const betterPostAnyway = postAnyway()

    const redirectToProfile = () => {
        dispatch(postAlertActionCreators.closeModal());
        dispatch(setPostBoxState(data));
        history("/profile");
    }

    return (
        <Modal show={postAlertReducer.visible} onHide={closeModal} centered size="md" animation={false}>
            <Modal.Header className='justify-content-between'>
                <h6>Alert</h6>
                <span onClick={closeModal} type="button">
                    <i className="fa fa-times" aria-hidden="true"></i>
                </span>
            </Modal.Header>
            <Modal.Body className="privacyBody text-left px-4 pt-4">
                You are about to post with the
                <span className='randomizeNameTooltip'>
                    <span className='fw-bold'>
                        'Randomize name'
                    </span>
                    <div className='tooltipText'>
                        The option in your profile to get a system-generated name
                    </div>
                </span>
                option turned OFF. The post will be shown with your 'Display name'.<br />
                Do you want to continue?
            </Modal.Body>
            <Modal.Footer className="pt-0 justify-content-center flex-wrap">
                <button className="modalFootBtns btn" variant="primary" onClick={redirectToProfile}>
                    Choose a Display name
                </button>
                <button className="modalFootBtns btn" variant="primary" onClick={betterPostAnyway}>
                    Continue posting
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default PostAlertModal
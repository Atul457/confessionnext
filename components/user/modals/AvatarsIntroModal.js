import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import auth from '../../behindScenes/Auth/AuthCheck';
import userIcon from "../../../images/userAcc.svg";
import avatarGroup from "../../../images/avatarGroup.png";
import { useDispatch, useSelector } from 'react-redux';
import { toggleAvatarIntroModal } from '../../../redux/actions/avatarsIntroModalAc/avatarsIntroModalAc';


export default function AvatarsIntroModal() {

    const avatarIntReducer = useSelector(store => store.avatarsIntroModalReducer);
    const [showImages, setShowImages] = useState(false)
    const dispatch = useDispatch();

    const history = useNavigate();

    const closeModalFn = () => {
        dispatch(toggleAvatarIntroModal({
            visible: false
        }))
    }

    // Functions

    const navigateUser = () => {
        closeModalFn()
        if (auth())
            return history("/profile")
        history("/login")
    }

    return (
        <>
            <Modal show={avatarIntReducer.visible} size="lg" className="eVerifyModal avatarIntro" onHide={closeModalFn}>
                <Modal.Header>
                    <h6>Add your avatar image now</h6>
                    <span onClick={closeModalFn} type="button">
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </span>
                </Modal.Header>
                <Modal.Body className="privacyBody eVerifyModal">

                    <div className={`avtarNdefaultImgCont ${showImages ? '' : 'hiddenAvatar'}`}>
                        <img src={userIcon} alt="" className='avatarMImages' />
                        <i className="fa fa-long-arrow-right" aria-hidden="true"></i>

                        <img src={avatarGroup} onLoad={() => {
                            setShowImages(true)
                        }} className="avatarsGroup" />
                    </div>

                    {/* VERBIAGE */}
                    <div className='regions'>
                        Add color to your profile by selecting your Avatar. Avatar are now available in your profile so don't hold back. Click the button below to checkout the Avatars now.
                    </div>

                </Modal.Body>
                <Modal.Footer className="pt-0 justify-content-center">
                    <button className="modalFootBtns btn" variant="primary" onClick={navigateUser}>
                        {auth() ? "Go to profile" : "Login"}
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


// 3963



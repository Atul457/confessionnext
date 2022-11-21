import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAvatarIntroModal } from '../../../redux/actions/avatarsIntroModalAc/avatarsIntroModalAc';
import { useRouter } from 'next/router';
import auth from '../../../utils/auth';


export default function AvatarsIntroModal() {

    const avatarIntReducer = useSelector(store => store.avatarsIntroModalReducer);
    const { checkAuth } = auth
    const [showImages, setShowImages] = useState(false)
    const dispatch = useDispatch();
    const router = useRouter()

    const history = router.push;

    const closeModalFn = () => {
        dispatch(toggleAvatarIntroModal({
            visible: false
        }))
    }

    // Functions

    const navigateUser = () => {
        closeModalFn()
        if (checkAuth())
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
                        <img src="/images/userAcc.svg" alt="userAccountIcon" className='avatarMImages' />
                        <i className="fa fa-long-arrow-right" aria-hidden="true"></i>

                        <img src="/images/avatarGroup.png" onLoad={() => {
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
                        {checkAuth() ? "Go to profile" : "Login"}
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


// 3963



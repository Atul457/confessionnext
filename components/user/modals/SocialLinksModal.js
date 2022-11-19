import React from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import instaSocial from '../../../images/instaSocial.svg'
import TwitterSocial from '../../../images/TwitterSocial.svg'
import tiktokSocial from '../../../images/tiktokSocial.svg'
import fbSocial from '../../../images/fbSocial.svg'
import openSLinksModalActionCreators from '../../../redux/actions/socialLinksModal';


const SocialLinksModal = (props) => {

    const dispatch = useDispatch();

    const closeModal = () => {
        dispatch(openSLinksModalActionCreators.closeModal());
    }

    return (
        <>
            <Modal show={props.visible} centered size="lg" onHide={closeModal}>
                <Modal.Header className='justify-content-between'>
                    <h6>Follow us</h6>
                </Modal.Header>
                <Modal.Body className="privacyBody text-left socialLinksModal">
                    <ul>
                        <li>
                            <a target="blank" href="https://www.facebook.com/TheTalkPlaceOfficial">
                                <img src={fbSocial} alt="fbSocialIcon" />
                            </a>
                        </li>
                        <li>
                            <a target="blank" href="http://twitter.com/the_talkplace">
                                <img src={TwitterSocial} alt="TwitterSocialIcon" />
                            </a>
                        </li>
                        <li>
                            <a target="blank" href="https://www.instagram.com/the_talkplace_official/">
                                <img src={instaSocial} alt="instaSocialIcon" />
                            </a>
                        </li>
                        <li>
                            <a target="blank" href="http://TikTok.com/@the_talkplace">
                                <img src={tiktokSocial} alt="tiktokSocialIcon" />
                            </a>
                        </li>
                    </ul>

                    {/* <div className='closeModalBtnVerb' type='button' onClick={closeModal}>
                        Don't miss out on following us
                    </div> */}
                </Modal.Body>

            </Modal>
        </>
    )
}

export default SocialLinksModal;
import React from 'react';
import { Modal } from 'react-bootstrap';

const ShareReqModal = (props) => {

    const do_ = () => {
        props.openFrReqModalFn();
        props.closeShareMenu();
    }

    return (
        <Modal show={true} size="xl" className="popupModal">
            <Modal.Body className=" text-left mx-0">
                <>
                    {props.isNotFriend === 1 &&
                        <div className='sharePopupItems' type="button" onClick={do_}>
                            <i className="fa fa-user" aria-hidden="true"></i>
                            <span>
                                Friend Request
                            </span>
                        </div>
                    }

                    {props.isNotFriend === 2 &&
                        <div type="button" className='sharePopupItems' onClick={do_}>
                            <i className="fa fa-user" aria-hidden="true"></i>
                            <span>
                                Cancel Request
                            </span>
                        </div>
                    }
                    <div className='sharePopupItems' type="button" onClick={props.toggleSharekit}>
                        <i className="fa fa-share-alt dontHide" aria-hidden="true"></i>
                        <span className='dontHide'>
                            Share
                        </span>
                    </div>
                </>
            </Modal.Body>
            <Modal.Footer className="pt-0 justify-content-center">
            </Modal.Footer>
        </Modal>
    )
}

export default ShareReqModal
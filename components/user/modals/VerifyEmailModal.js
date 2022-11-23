import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { EVerifyModal } from '../../../redux/actions/everify';
import { http } from '../../../utils/http';
import { useSession } from 'next-auth/react';


export default function VerifyEmailModal(props) {

    const verifyEState = useSelector(store => store.VerifyEmail);
    const { data: session } = useSession()
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [error, setError] = useState({ visible: true, content: "" });
    const [userDetails, setUserDetails] = useState(false);

    useEffect(() => {
        setUserDetails(() => {
            if (session) {
                let userDetails = localStorage.getItem("userDetails") ?? "{}";
                userDetails = JSON.parse(userDetails);
                return userDetails;
            } else {
                return false
            }
        })
    }, [])


    const hideEModalFn = () => {
        dispatch(EVerifyModal({
            ...verifyEState, visible: false, verified: true
        }))
    }

    const showEModalFn = () => {
        dispatch(EVerifyModal({
            ...verifyEState, visible: true,
        }))
    }

    useEffect(() => {
        if (props.showEModal) {
            showEModalFn();
        }
    }, [props.showEModal])



    const verifyEmail = async () => {

        let regex = /^[\d\D]+@[a-zA-Z0-9.-]+\.[\d\D]{2,4}$/;
        let _email = "";
        if (!userDetails?.email) {
            if (email.trim() === "") {
                setError({
                    ...error,
                    content: "This field is required"
                })
                return false;
            } else if (!regex.test(email.trim())) {
                setError({
                    ...error,
                    content: "Please enter a valid email"
                })
                return false;
            }
            _email = email;
        }

        let obj = {
            data: { email: _email },
            token: userDetails?.token ?? "",
            method: "post",
            url: "sendverifyemail"
        }

        dispatch(EVerifyModal({ ...verifyEState, isLoading: true, verified: true }))

        try {
            const res = await http(obj)
            if (res.data.status === true) {
                dispatch(EVerifyModal({ ...verifyEState, isLoading: false, visible: false, verified: true }))
                return;
            }
        } catch (err) {
            console.log(err);
        }

        dispatch(EVerifyModal({ ...verifyEState, isLoading: false, verified: true }))
    }

    return (
        <>
            <Modal show={verifyEState.visible} size="lg" className="eVerifyModal" onHide={hideEModalFn}>
                <Modal.Header>
                    <h6>Verify your Email</h6>
                    <span onClick={hideEModalFn} type="button">
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </span>
                </Modal.Header>
                {userDetails && userDetails?.email ?
                    <>
                        <Modal.Body className="privacyBody eVerifyModal">

                            <img src="/images/everifyLogo.png" className='regions img' alt="everifyLogo" />

                            {/* VERBIAGE */}
                            <div className='regions'>
                                So we know it’s you, please verify your email. If you did not receive the verification mail, check your spam messages. If it’s missing, click the Re-Submit button below.
                            </div>

                        </Modal.Body>
                        <Modal.Footer className="pt-0 justify-content-center">
                            {
                                verifyEState.verified &&
                                <button className="modalFootBtns btn" variant="primary" onClick={hideEModalFn}>
                                    Close
                                </button>}
                            <button className="modalFootBtns btn" variant="primary" onClick={verifyEmail}>
                                {verifyEState.isLoading ? <div className="spinnerSizePost spinner-border text-white" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : "Re-Submit"}
                            </button>
                        </Modal.Footer>
                    </>
                    :
                    <>
                        <Modal.Body className="privacyBody eVerifyModal">

                            <img src="/images/everifyLogo.png" alt="everifyLogo" className='regions img' />

                            {/* VERBIAGE */}
                            <div className='regions'>
                                So we know it’s you, please verify your email in order to continue on the platform. For verification, enter your email, we will send mail to the provided email address.
                            </div>

                            {/* FIELDS */}
                            <input
                                className="form-control"
                                placeholder="eg: abc@gmail.com"
                                type="email" value={email}
                                onChange={(e) => { setEmail(e.target.value) }} />


                            {/* ERROR CONT */}
                            {
                                error.visible
                                &&
                                <div className='errorCont text-danger my-2'>{error.content}</div>
                            }

                        </Modal.Body>
                        <Modal.Footer className="pt-0 justify-content-center">
                            {
                                verifyEState.verified &&
                                <button className="modalFootBtns btn" variant="primary" onClick={hideEModalFn}>
                                    Close
                                </button>}
                            <button className="modalFootBtns btn" variant="primary" onClick={verifyEmail}>
                                {verifyEState.isLoading ? <div className="spinnerSizePost spinner-border text-white" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : "Submit"}
                            </button>
                        </Modal.Footer>
                    </>
                }

            </Modal>
        </>
    )
}




import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// import { http } from '../../../commonApi';
// import { forgotUPassActionCreators } from '../../../redux/actions/forgotUPassword';
// import statuses from '../../../redux/reducers/forgotUpReducer';
import { Modal } from 'react-bootstrap';
import { http } from '../../../utils/http';
import statuses from '../../../redux/reducers/forgotUpReducer';
// import { forgotUPassActionCreators } from '../../../redux/actions/forgotUPassword';

const ForgotPassModal = () => {


    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const forgotUserPassReducer = useSelector(store => store.forgotUserPassReducer);

    const closeModal = () => {
        setEmail('');
        dispatch(forgotUPassActionCreators.closeChangePassModal())
    }

    const handleOnChange = (target) => {
        setEmail(target.value)
    }

    const changePass = async () => {

        let token = '';
        let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;


        if (email.trim() === '') {
            return dispatch(forgotUPassActionCreators.updateErrorUpassModal({ isError: true, message: "Email is a required field" }));
        }

        if (!regex.test(email.trim())) {
            return dispatch(forgotUPassActionCreators.updateErrorUpassModal({ isError: true, message: "Please enter a valid email" }));
        }

        let data = { email };
        let obj = {
            data,
            token: token,
            method: "post",
            url: "forgotpassword"
        }

        try {
            dispatch(forgotUPassActionCreators.changeStatusUPassModal(statuses.LOADING))
            const res = await http(obj)
            if (res.data.status === true) {
                dispatch(forgotUPassActionCreators.updateErrorUpassModal({ isError: false, message: res.data?.message }));
                setTimeout(() => {
                    closeModal();
                }, 4000);
            } else {
                return dispatch(forgotUPassActionCreators.updateErrorUpassModal({ isError: true, message: res.data?.message }));
            }
        } catch (err) {
            console.log(err);
            return dispatch(forgotUPassActionCreators.updateErrorUpassModal({ isError: true, message: "Something went wrong" }));
        }


    }

    return (
        <>
            {/* CHANGE PASSWORD MODAL */}
            <Modal show={forgotUserPassReducer.modal.isOpen} onHide={closeModal}>
                <Modal.Header>
                    <h6>Forgot Password</h6>
                    <span onClick={closeModal} type="button">
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </span>
                </Modal.Header>

                <Modal.Body className="privacyBody">
                    <div className="text-left mb-3">Enter your email to get a password reset link</div>
                    <form>
                        <span className="eyeNinputCont">
                            <input
                                className='form-control'
                                type="text"
                                placeholder="Email"
                                name="email"
                                value={email}
                                onChange={(e) => { handleOnChange(e.target) }} />
                        </span>
                    </form>

                    <div className={`responseCont text-left ${forgotUserPassReducer.status === statuses.ERROR ? "text-danger" : "text-success"}`}>{forgotUserPassReducer.message}</div>

                </Modal.Body>

                <Modal.Footer className="pt-0">
                    <button className="modalFootBtns btn" variant="secondary" onClick={closeModal}>
                        Cancel
                    </button>

                    <button className="modalFootBtns btn" variant="primary" onClick={changePass}>
                        {forgotUserPassReducer.status === statuses.LOADING ? <div className="spinnerSizePost spinner-border text-white" role="status">
                            <span className="sr-only">Loading...</span>
                        </div> : "Send"}
                    </button>
                </Modal.Footer>
            </Modal>
            {/* CHANGE PASSWORD MODAL */}
        </ >
    )
}

export default ForgotPassModal
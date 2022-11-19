import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateUPassActionCreators } from '../../../redux/actions/updateUserPassword';
import statuses from '../../../redux/reducers/updateUserPassReducer';
import { fetchData } from '../../../commonApi';
import auth from '../../behindScenes/Auth/AuthCheck';

const passIniState = {
    pass: { value: '', type: "password" },
    cpass: { value: '', type: "password" },
    old: { value: '', type: "password" }
}

const UpdatePasswordModal = () => {

    const updateUserPassReducer = useSelector(store => store.updateUserPassReducer);
    const [password, setPassword] = useState(passIniState);
    const dispatch = useDispatch();


    const closeModal = () => {
        setPassword(passIniState);
        dispatch(UpdateUPassActionCreators.closeChangePassModal())
    }

    const handleOnChange = (target) => {
        setPassword({
            ...password,
            [target.name]: {
                value: target.value,
                type: target.type
            }
        })
    }

    const togglePassType = () => {
        setPassword({
            ...password,
            pass: {
                ...password.pass,
                type: password.pass.type === 'text' ? 'password' : 'text'
            }
        })
    }

    const toggleCPassType = () => {
        setPassword({
            ...password,
            cpass: {
                ...password.cpass,
                type: password.cpass.type === 'text' ? 'password' : 'text'
            }
        })
    }

    const toggleOPassType = () => {
        setPassword({
            ...password,
            old: {
                ...password.old,
                type: password.old.type === 'text' ? 'password' : 'text'
            }
        })
    }

    const changePass = async () => {

        let token = '';

        
        if (password.cpass.value === '' || password.pass.value === '' || password.old.value === '') {
            return dispatch(UpdateUPassActionCreators.updateErrorUpassModal("All fields are required"));
        }


        if (password.pass.value.length < 6 || password.pass.value.length > 20){
            return dispatch(UpdateUPassActionCreators.updateErrorUpassModal("Password length should be in between 6 to 20"));
        }
        
        if (password.cpass.value !== password.pass.value) {
            return dispatch(UpdateUPassActionCreators.updateErrorUpassModal("Password and confirm password should be same"));
        }

        if (auth()) {
            token = localStorage.getItem("userDetails");
            token = (JSON.parse(token)).token;
        }

        let data = {
            password: password.cpass.value,
            old_password: password.old.value
        }

        let obj = {
            data,
            token: token,
            method: "post",
            url: "updatepassword"
        }
        try {
            dispatch(UpdateUPassActionCreators.changeStatusUPassModal(statuses.LOADING))
            const res = await fetchData(obj)
            if (res.data.status === true) {
                closeModal();
            } else {
                return dispatch(UpdateUPassActionCreators.updateErrorUpassModal(res.data?.message));
            }
        } catch (err) {
            console.log(err.status);
            return dispatch(UpdateUPassActionCreators.updateErrorUpassModal("Something went wrong."));
        }


    }



    return (
        <>
            {/* CHANGE PASSWORD MODAL */}
            <Modal show={updateUserPassReducer.modal.isOpen} onHide={closeModal}>
                <Modal.Header>
                    <h6>Reset Password</h6>
                </Modal.Header>

                <Modal.Body className="privacyBody">

                    <form>

                        <span className="eyeNinputCont">
                            <input
                                type={password.old.type}
                                name="old"
                                value={password.old.value}
                                onChange={(e) => { handleOnChange(e.target) }}
                                className="form-control mb-2" placeholder="Old password" />

                            <i
                                className={`eyeIcon ${password.old.type === 'text' ? ' fa fa-eye' : ' fa fa-eye-slash'}`}
                                aria-hidden="true"
                                type="button"
                                onClick={toggleOPassType}
                            >
                            </i>
                        </span>

                        <span className="eyeNinputCont">
                            <input
                                type={password.pass.type}
                                name="pass"
                                value={password.pass.value}
                                onChange={(e) => { handleOnChange(e.target) }}
                                className="form-control mb-2" placeholder="New password" />

                            <i
                                className={`eyeIcon ${password.pass.type === 'text' ? ' fa fa-eye' : ' fa fa-eye-slash'}`}
                                aria-hidden="true"
                                type="button"
                                onClick={togglePassType}
                            >
                            </i>
                        </span>

                        <span className="eyeNinputCont">
                            <input
                                type={password.cpass.type}
                                name="cpass"
                                value={password.cpass.value}
                                onChange={(e) => { handleOnChange(e.target) }}
                                className="form-control mb-2"
                                placeholder="Confirm password" />
                            <i
                                className={`eyeIcon ${password.cpass.type === 'text' ? ' fa fa-eye' : ' fa fa-eye-slash'}`}
                                aria-hidden="true"
                                type="button"
                                onClick={toggleCPassType}
                            >
                            </i>
                        </span>

                    </form>

                    <div className="responseCont text-left text-danger">{updateUserPassReducer.message}</div>

                </Modal.Body>

                <Modal.Footer className="pt-0">
                    <button className="modalFootBtns btn" variant="secondary" onClick={closeModal}>
                        Cancel
                    </button>

                    <button className="modalFootBtns btn" variant="primary" onClick={changePass}>
                        {updateUserPassReducer.status === statuses.LOADING ? <div className="spinnerSizePost spinner-border text-white" role="status">
                            <span className="sr-only">Loading...</span>
                        </div> : "Save"}
                    </button>
                </Modal.Footer>
            </Modal>
            {/* CHANGE PASSWORD MODAL */}
        </ >
    )
}

export default UpdatePasswordModal
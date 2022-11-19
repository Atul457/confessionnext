import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateUPassActionCreators } from '../../../redux/actions/updateUserPassword';
import statuses from '../../../redux/reducers/updateUserPassReducer';
import { fetchData } from '../../../commonApi';
import { useNavigate } from 'react-router-dom';

const passIniState = {
    cpass: { value: '', type: "password" },
    pass: { value: '', type: "password" },
}

const ResetPasswordModal = (props) => {

    const history = useNavigate();
    const updateUserPassReducer = useSelector(store => store.updateUserPassReducer);
    const [password, setPassword] = useState(passIniState);
    const dispatch = useDispatch();

    useEffect(() => {
        if (updateUserPassReducer.status === statuses.PASSWORDCHANGED) {
            closeModal();
        }
    }, [updateUserPassReducer.status])


    const closeModal = () => {
        dispatch(UpdateUPassActionCreators.closeChangePassModal())
        history("/login");
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

    const changePass = async () => {

        if (password.cpass.value === '' || password.pass.value === '') {
            return dispatch(UpdateUPassActionCreators.updateErrorUpassModal("All fields are required"));
        }


        if (password.pass.value.length < 6 || password.pass.value.length > 20) {
            return dispatch(UpdateUPassActionCreators.updateErrorUpassModal("Password length should be in between 6 to 20"));
        }

        if (password.cpass.value !== password.pass.value) {
            return dispatch(UpdateUPassActionCreators.updateErrorUpassModal("Password and confirm password should be same"));
        }

        let data = {
            password: password.cpass.value
        }

        let obj = {
            data,
            token: "",
            method: "post",
            url: `resetpassword/${props.userId}/${props.token}`
        }
        try {
            dispatch(UpdateUPassActionCreators.changeStatusUPassModal(statuses.LOADING))
            const res = await fetchData(obj)
            if (res.data.status === true) {
                dispatch(UpdateUPassActionCreators.changeMessageNstatus({
                    status: statuses.SUCCESS, message: res.data?.message.replace(".", "") + ", Please wait..."
                }))

                setTimeout(() => {
                    dispatch(UpdateUPassActionCreators.changeStatusUPassModal(statuses.PASSWORDCHANGED));
                }, 3000)
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
            {/* RESET PASSWORD MODAL */}
            <Modal show={updateUserPassReducer.modal.isOpen}>
                <Modal.Header>
                    <h6>Reset Password</h6>
                </Modal.Header>


                {updateUserPassReducer.bodyStatus === statuses.LOADING ?
                    <Modal.Body className="privacyBody mt-2 mb-4">
                        <div className="spinner-border pColor" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </Modal.Body>
                    :
                    <>
                        <Modal.Body className="privacyBody">
                            {
                                !updateUserPassReducer.hideFields === true ?
                                    <>
                                        <form>
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
                                        <div className={`responseCont text-left ${updateUserPassReducer.status === statuses.SUCCESS ? "text-success" : "text-danger"}`}>{updateUserPassReducer.message}</div>
                                    </>
                                    :
                                    <div className="responseCont text-center text-danger">{updateUserPassReducer.message}</div>
                            }
                        </Modal.Body>

                        {updateUserPassReducer.hideFields === true ?
                            <Modal.Footer className="pt-0 justify-content-center">
                                <button className="modalFootBtns btn" variant="primary" onClick={closeModal}>
                                    Close
                                </button>
                            </Modal.Footer>
                            :
                            <Modal.Footer className="pt-0">
                                <button className="modalFootBtns btn" variant="primary" onClick={changePass}>
                                    {updateUserPassReducer.status === statuses.LOADING ? <div className="spinnerSizePost spinner-border text-white" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div> : "Save"}
                                </button>
                            </Modal.Footer>
                        }

                    </>}

            </Modal>
            {/* RESET PASSWORD MODAL */}
        </ >
    )
}

export default ResetPasswordModal
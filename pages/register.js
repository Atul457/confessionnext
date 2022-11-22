import React, { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import ForgotPassModal from "../components/user/modals/ForgotPassModal";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import auth from "../utils/auth";
import Link from "next/link";
// import Loader from "../components/common/Loader";
import { unstable_getServerSession } from "next-auth";
import { http } from "../utils/http";
import PrivacyModal from "../components/user/modals/PrivacyModal";
import { forgotUPassActionCreators } from "../redux/actions/forgotUPassword";
import { useSession, signIn } from "next-auth/react";
import { envConfig } from "../utils/envConfig";
import { authOptions } from "./api/auth/[...nextauth]";

const Login = () => {

    // Hooks and vars
    const router = useRouter();
    const { data: session } = useSession()
    const { checkAuth, setAuth } = auth;
    let mess = {
        get: () => { },
    };
    mess = mess?.get("message");
    const dispatch = useDispatch();

    useEffect(() => {
        if (parseInt(mess) === 1) {
            let profileResponseCont = document.getElementById("profileResponseCont");
            setErrorOrSuccess(false);
            profileResponseCont.innerHTML =
                "Your account is currently inactive, please contact admin";
        }
    }, [mess]);

    let history = router.push;
    const [rPassword, setRPassword] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorOrSuccess, setErrorOrSuccess] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [source, setSource] = useState(1);
    const [sourceId, setSourceId] = useState("");

    // PRIVACY MODAL
    const [privacyModal, setPrivacyModal] = useState({
        visible: false,
        accepted: false,
    });

    useEffect(() => {
        if (session) {
            setAuth(1)
            const user = session.user;
            localStorage.setItem(
                "userDetails",
                JSON.stringify(user)
            );
            history("/login")
        }
    }, [session])

    const acceptPrivacy = () => {
        setPrivacyModal({ ...privacyModal, accepted: true, visible: false });
    };

    const handlePrivacyModal = () => {
        privacyModal.visible
            ? setPrivacyModal({ ...privacyModal, visible: false })
            : setPrivacyModal({ ...privacyModal, visible: true });
    };

    useEffect(() => {
        if (privacyModal.accepted === true) {
            validateForm(true);
        }
    }, [privacyModal.accepted]);

    // END OF PRIVACY MODAL

    //GETS THE DATA FROM THE GOOGLE LOGIN API,
    //AND CHECKS WHETHER THE USER IS REGISTERED OR NOT
    const responseGoogle = async (data) => {

        let profileResponseCont = document.getElementById("profileResponseCont");
        let profileData = data.profileObj;
        if (!data.profileObj) return false;

        if (profileData.googleId && profileData.googleId !== "") {
            setIsLoading(true);

            let socialLoginData = {
                source_id: profileData.googleId,
                source: 2,
            };

            try {
                const res = await signIn("credentials", {
                    ...socialLoginData,
                    redirect: false,
                    login: true,
                    token: "",
                    method: "post",
                    url: "sociallogin",
                });

                if (res?.error) {
                    let error = res.error
                    error = JSON.parse(error)
                    if (error?.is_registered === 0) registerUserWithSocial(profileData)
                    profileResponseCont.innerHTML = ""
                    setErrorOrSuccess(false);
                    return setIsLoading(false);
                }

                setAuth(1);
                setErrorOrSuccess(true);
                profileResponseCont.innerHTML = "";
                localStorage.removeItem("adminDetails");
                localStorage.removeItem("adminAuthenticated");
                localStorage.setItem("privacyAccepted", 1);
                setIsLoading(false)

            }
            catch (err) {
                setIsLoading(false)
                profileResponseCont.innerHTML = "something went wrong"
                console.log(err?.message)
            }

        } else {
            console.log(data);
        }
    };

    //SETS THE DATA GOT FROM GOOGLE LOGIN API, TO STATE VARIABLES FOR REGISTER
    const registerUserWithSocial = async (profileData) => {
        setDisplayName(profileData.name);
        setEmail(profileData.email);
        setSourceId(profileData.googleId);
        setSource(2);
        setPassword("");
        validateForm(true);
    };

    const responseFacebook = async (response) => {
        let profileResponseCont = document.getElementById("profileResponseCont");

        if (response.accessToken) {
            setIsLoading(true);

            let profileData = {
                name: response.name,
                source_id: response.id,
            };

            let socialLoginData = {
                source_id: response.id,
                source: 3,
            };

            try {
                const res = await signIn("credentials", {
                    ...socialLoginData,
                    redirect: false,
                    login: true,
                    token: "",
                    method: "post",
                    url: "sociallogin",
                });

                if (res?.error) {
                    let error = res.error
                    error = JSON.parse(error)
                    if (error?.is_registered === 0) registerUserWithSocialFb(profileData)
                    profileResponseCont.innerHTML = ""
                    setErrorOrSuccess(false);
                    return setIsLoading(false);
                }

                setAuth(1);
                setErrorOrSuccess(true);
                profileResponseCont.innerHTML = "";
                localStorage.removeItem("adminDetails");
                localStorage.removeItem("adminAuthenticated");
                localStorage.setItem("privacyAccepted", 1);
                setIsLoading(false)

            }
            catch (err) {
                setIsLoading(false)
                profileResponseCont.innerHTML = "something went wrong"
                console.log(err?.message)
            }
        } else {
            console.log(response);
        }
    };

    const registerUserWithSocialFb = (profileData) => {
        setDisplayName(profileData.name);
        setEmail("");
        setSourceId(profileData.source_id);
        setSource(3);
        setPassword("");
        validateForm(true);
    };

    const register = async () => {
        let profileResponseCont = document.getElementById("profileResponseCont");
        if (privacyModal.accepted === true) {
            setIsLoading(true);
            profileResponseCont.innerText = "";

            let registerFromData = {
                display_name: displayName,
                email: email,
                source: source,
                password: password,
                source_id: sourceId,
            };

            try {
                const res = await signIn("credentials", {
                    ...registerFromData,
                    redirect: false,
                    login: false,
                    token: "",
                    method: "post",
                    url: "register",
                });

                if (res?.error) {
                    profileResponseCont.innerHTML = res?.error;
                    setErrorOrSuccess(false);
                    return setIsLoading(false);
                }

                localStorage.setItem("privacyAccepted", 1);
                localStorage.removeItem("adminDetails");
                localStorage.removeItem("adminAuthenticated")
                setIsLoading(false)

            } catch (err) {
                console.log({ err: err?.message });
                setIsLoading(false)
                profileResponseCont.innerHTML = "something went wrong"
            }

        } else {
            setPrivacyModal({ ...privacyModal, visible: true });
        }
    };

    async function validateForm(usingSocialLogin = false) {
        let profileResponseCont = document.getElementById('profileResponseCont');
        let regDisplayErrorCont = document.getElementById('regDisplayErrorCont');
        let regEmailErrorCont = document.getElementById('regEmailErrorCont');
        let regPasswordErrorCont = document.getElementById('regPasswordErrorCont');
        let regRPasswordErrorCont = document.getElementById('regRPasswordErrorCont');
        let regex = /^[\d\D]+@[a-zA-Z0-9.-]+\.[\d\D]{2,4}$/;

        //IF LOGIN IS BEING DONE USING SOCIAL LOGIN THEN NO VALIDATION IS DONE
        if (usingSocialLogin === false) {
            if (displayName.trim() === '') {
                regDisplayErrorCont.innerHTML = 'This is a required field.';
                return false;
            } else if (email.trim() === '') {
                regEmailErrorCont.innerHTML = 'This is a required field.';
                return false;
            } else if (!regex.test(email.trim())) {
                regEmailErrorCont.innerHTML = 'Please enter a valid email';
                return false;
            } else {
                regEmailErrorCont.innerHTML = '';
                regDisplayErrorCont.innerHTML = ''
            }

            if (password.trim() === '') {
                regPasswordErrorCont.innerHTML = 'This is a required field.';
                return false;
            } else {
                regPasswordErrorCont.innerHTML = '';
            }

            if (rPassword.trim() === '') {
                regRPasswordErrorCont.innerHTML = 'This is a required field';
                return false;
            } else if (rPassword.trim() !== password.trim()) {
                regRPasswordErrorCont.innerHTML = 'Password and Repeat fields should be same';
                return false;
            } else {
                regRPasswordErrorCont.innerHTML = '';
            }
        }

        if (privacyModal.accepted === true) {

            setIsLoading(true);
            profileResponseCont.innerText = '';
            regEmailErrorCont.innerHTML = '';
            regPasswordErrorCont.innerHTML = '';
            regRPasswordErrorCont.innerHTML = '';
            regDisplayErrorCont.innerHTML = '';

            let registerFromData = {
                "email": email,
                "source": source,
                "password": password,
                "source_id": sourceId,
                "display_name": displayName,
            };


            try {
                const res = await signIn("credentials", {
                    ...registerFromData,
                    redirect: false,
                    login: false,
                    token: "",
                    method: "post",
                    url: "register",
                });

                if (res?.error) {
                    profileResponseCont.innerHTML = res?.error;
                    setErrorOrSuccess(false);
                    return setIsLoading(false);
                }

                localStorage.setItem("privacyAccepted", 1);
                localStorage.removeItem("adminDetails");
                localStorage.removeItem("adminAuthenticated")
                setIsLoading(false)

            } catch (err) {
                console.log({ err: err?.message });
                setIsLoading(false)
            }
        } else setPrivacyModal({ ...privacyModal, visible: true })
    }

    return (
        <>
            {/* VERIFY EMAIL MODAL COMPONENT */}
            {/* <Outlet /> */}

            {/* Register Form */}
            <form className="formLoginNregister">

                <div className="secCheckText">Register Now</div>

                <div className="logInUsingBnts">

                    {/* BUTTONS CONTAINERS */}
                    <div className="logInUsingInsideCont d-none d-md-flex">

                        <GoogleLogin
                            clientId="564992561843-f8dv45t8cb2nar979gpflgumsckm4ua3.apps.googleusercontent.com"
                            autoLoad={false}
                            render={renderProps => (
                                <button
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
                                    type="button"
                                >
                                    <img
                                        src="/images/googleIcon.png"
                                        alt="googleIcon"
                                        className="googleSocialIcon"
                                    />
                                    <span className="socialBtnText">Continue with Google</span>
                                </button>
                            )}
                            buttonText="Login"
                            onSuccess={(data) => { responseGoogle(data) }}
                            onFailure={(data) => { responseGoogle(data) }}
                            cookiePolicy={'single_host_origin'}
                        />

                        <FacebookLogin
                            appId="350064407020433"
                            autoLoad={false}
                            fields="name,email,picture"
                            scope="public_profile,user_friends"
                            componentClicked={false}
                            render={renderProps => (
                                <button onClick={renderProps.onClick} type="button">
                                    <img
                                        src="/images/fbIcon.png"
                                        alt="fbIcon"
                                        className="fbSocialIcon"
                                    />
                                    <span className="socialBtnText">Continue with Facebook</span>
                                </button>
                            )}
                            disableMobileRedirect={true}
                            callback={responseFacebook}
                            icon="fa-facebook" />

                    </div>
                    {/* END OF BUTTONS CONTAINERS */}

                    <div className="orLoginUsingCont">
                        <span>OR</span>
                    </div>

                </div>


                <div className="form-group">
                    <div className="refreshBtnDiv">
                        <input type="text" id="displayName" className="form-control" placeholder="Display Name" minLength="3" value={displayName} onChange={(e) => { setDisplayName(e.target.value) }} />
                    </div>
                    <div className="errorCont" id="regDisplayErrorCont"></div>
                </div>


                <div className="form-group">
                    <div className="refreshBtnDiv regisEmailField">
                        <input type="email" value={email} className="form-control" id="userEmail" placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} />
                    </div>
                    <div className="errorCont" id="regEmailErrorCont"></div>
                </div>


                <div className="form-group">
                    <div className="refreshBtnDiv loginPassField">
                        <input type="password" className="form-control" id="regPassword" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                    </div>
                    <div className="errorCont" id="regPasswordErrorCont"></div>
                </div>


                <div className="form-group">
                    <div className="refreshBtnDiv regisRepPassField">
                        <input type="password" className="form-control" id="resetPassword" placeholder="Repeat Password" value={rPassword} onChange={(e) => { setRPassword(e.target.value) }} />
                    </div>
                    <div className="errorCont" id="regRPasswordErrorCont"></div>
                </div>

                <div className='form-group'>
                    <p className='recaptcha_desc'>This site is protected by reCAPTCHA and the Google
                        <a className='googleLink' href="https://policies.google.com/privacy"> Privacy Policy</a> and
                        <a className='googleLink' href="https://policies.google.com/terms"> Terms of Service</a> apply.
                    </p>
                </div>

                <button type="button" onClick={() => validateForm(false)} className="btn submitButton">{isLoading ? <div className="spinnerSizePost spinner-border text-white" role="status">
                    <span className="sr-only">Loading...</span>
                </div> : "Register"}</button>


                <div className={`responseCont ${errorOrSuccess ? 'text-success' : 'text-danger'}`} id="profileResponseCont"></div>


                {/* Gets Visible in Mobiles Only */}
                <div className="logInUsingBnts d-md-none">
                    <div className="orLoginUsingCont py-3">
                        <span>Or Register using</span>
                    </div>
                    {/* Buttons Container */}
                    <div className="logInUsingInsideCont socialMobileBtns mobileSocialBtns">

                        <GoogleLogin
                            clientId="564992561843-f8dv45t8cb2nar979gpflgumsckm4ua3.apps.googleusercontent.com"
                            autoLoad={false}
                            render={renderProps => (
                                <button
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
                                    className="googleMobIcon"
                                    type="button"
                                >
                                    <img
                                        src="/images/googleIcon.svg"
                                        alt="googleIcon"
                                        className="googleSocialIcon"
                                    />
                                </button>
                            )}
                            buttonText="Login"
                            onSuccess={(data) => { responseGoogle(data) }}
                            onFailure={(data) => { responseGoogle(data) }}
                            cookiePolicy={'single_host_origin'}
                        />

                        <FacebookLogin
                            appId="350064407020433"
                            autoLoad={false}
                            fields="name,email,picture"
                            scope="public_profile,user_friends"
                            componentClicked={false}
                            render={renderProps => (
                                <button
                                    onClick={renderProps.onClick}
                                    className="facebookMobIconOuter"
                                    type="button"
                                >
                                    <img
                                        src="/images/fbIcon.png"
                                        alt="loginLogo"
                                        className="fbSocialIcon"
                                    />
                                </button>
                            )}
                            callback={responseFacebook}
                            disableMobileRedirect={true}
                            icon="fa-facebook" />
                    </div>
                    {/* End of Buttons Container */}

                </div>
                {/* Gets Visible in Mobiles Only */}


                {/* LINK TO REGISTER COMPONENT */}
                <Link href="/login" className="loginFooterLink">
                    <div className="RegisterNowLinkCont">
                        Already have an account? <span>Login Now</span>
                    </div>
                </Link>
                {/* END OF LINK TO REGISTER COMPONENT */}

            </form>
            {/* End of Register Form */}

            {/* PRIVACY MODAL */}
            <PrivacyModal
                openFeatures={() => { }}
                privacyModal={privacyModal}
                acceptPrivacy={acceptPrivacy}
                handlePrivacyModal={handlePrivacyModal}
            />
            {/* PRIVACY MODAL */}

            {/* FORGOT PASSWORD MODAL */}
            <ForgotPassModal />
            {/* FORGOT PASSWORD MODAL */}
        </>
    );
};

Login.additionalProps = {
    authPage: true,
    sideBarProps: {
        logo: "/images/appLogo.svg",
        middleTitle: "Login & Start Chatting",
        middleTextBody:
            "Register here & Create your account to create Confessions, comment on confession, adding friends, and to do a lot more...",
        bottomLogo: "/images/registerLogo.svg",
    },
    meta: {
        title: "Register"
    }
};

export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );

    if (session)
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    return {
        props: {},
    };
}

export default Login;

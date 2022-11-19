import React, { createContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'

// Common Imports
import Footer from '../components/user/footer/Footer'
import Header from '../components/user/header/Header'
import Meta from '../components/user/Meta'
import { FooterScripts } from '../components/user/Scripts'
import Sidebar from '../components/user/sidebar/Sidebar'

// Third party
import TagManager from 'react-gtm-module'
// import ReactPixel from 'react-facebook-pixel';

// Ads
import RightSideAdComp from '../components/user/ads/RightSideAdComp'

// Services
import { getCategoriesService } from '../services/user/services'
import { getTagsService } from '../services/user/forumServices'

// Utils
import { isWindowPresent } from '../utils/checkDom'
import auth from '../utils/auth'
import { envConfig } from '../utils/envConfig'
import { http } from '../utils/http'
import { getIP } from '../utils/helpers'

// Redux
import { forumHandlers } from '../redux/actions/forumsAc/forumsAc'

// Data
import forumTypes from "../utils/data/forumTypes.json"
import LgSidebar from '../components/common/LgSidebar'


// Google tag manager
if (isWindowPresent()) {
    const tagManagerArgs = { gtmId: envConfig.isProdMode ? envConfig.tagManagerLiveKey : envConfig.tagManagerDevKey }
    TagManager.initialize(tagManagerArgs);
}

// Meta-pixel
if (envConfig.isProdMode) {
    const options = { autoConfig: true, debug: false, };
    if (isWindowPresent()) {
        // ReactPixel.init(envConfig.pixelId, null, options);
        // ReactPixel.fbq('track', 'PageView');
    }
}

// Set the ip to localstorage by fetching it from third party
getIP()

const { checkAuth, setAuth } = auth

export const AuthContext = createContext(checkAuth())

const UserLayout = ({ children, additionalProps = false }) => {

    if (isWindowPresent()) {
        window.dataLayer.push({
            event: 'pageview'
        });
    }

    // Hooks and vars
    const dispatch = useDispatch()
    const { getKeyProfileLoc, checkAuth } = auth

    // Retrieves the categories from the backend, and if authenticated fetches the userDetails also
    useEffect(() => {
        getTagsService({ dispatch });

        const getProfileData = async () => {
            if (checkAuth()) {
                let obj = {
                    data: {},
                    token: getKeyProfileLoc("token", true),
                    method: "get",
                    url: "getprofile"
                }
                try {
                    const res = await http(obj)
                    if (res.data.status === true) {
                        if (userDetails !== '') {
                            let freshUserDetails = { ...userDetails, profile: { ...res.data.user, ...{ comments: res.data?.comments } } };
                            if (isWindowPresent())
                                localStorage.setItem("userDetails", JSON.stringify(freshUserDetails))
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        }
        getProfileData();

        // Loads recaptcha v3
        const loadScriptByURL = (id, url, callback) => {
            if (isWindowPresent()) {
                const isScriptExist = document.getElementById(id);
                if (!isScriptExist) {
                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    script.src = url;
                    script.id = id;
                    script.onload = function () {
                        if (callback) callback();
                    };
                    document.body.appendChild(script);
                }
                if (isScriptExist && callback) callback();
            }
        }

        loadScriptByURL("recaptcha-key", envConfig.recaptchaKey, function () { })

        // End of load recaptcha v3
        let { handleForumsTypesAcFn } = forumHandlers
        dispatch(handleForumsTypesAcFn({ data: forumTypes }))

        getCategoriesService({ dispatch })
    }, [])


    return (
        <>
            <AuthContext.Provider value={setAuth}>
                <Meta />
                <main className="container-fluid">
                    <div className={`row outerContWrapper${additionalProps?.containsSideAd ? " bg-white" : ""}`}>

                        {additionalProps?.authPage ? null : <Header />}

                        {additionalProps?.authPage ?
                            <LgSidebar {...additionalProps.sideBarProps} />
                            : <Sidebar />}

                        <div className={`rightColumn${additionalProps?.containsSideAd ? " side_ads_page" : ""}${additionalProps?.authPage ? " auth_page" : ""}`}>
                            <div className="rightMainFormCont rightMainFormContFeed p-0">

                                {additionalProps?.authPage ? null :
                                    <div className="preventHeader">preventHead</div>}

                                {additionalProps?.authPage ? <>{children}</> :
                                    <div className="w-100 py-md-4 p-0 p-md-3 preventFooter">
                                        <div className="row forPosSticky">
                                            {children}
                                        </div>
                                    </div>}
                            </div>
                        </div>
                        {/* </div> */}

                        {additionalProps?.containsSideAd ?
                            <div className="rightsideBarAdd">
                                <RightSideAdComp />
                            </div> : null}

                    </div>
                </main>

                <Footer />
                <FooterScripts />
            </AuthContext.Provider>
        </>
    )
}

export default UserLayout
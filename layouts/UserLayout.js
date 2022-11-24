import React, { createContext, useEffect, useRef, cloneElement } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

// Common Imports
import Footer from "../components/user/footer/Footer";
import Header from "../components/user/header/Header";
import Meta from "../components/user/Meta";
import { FooterScripts } from "../components/user/Scripts";
import Sidebar from "../components/user/sidebar/Sidebar";

// Third party
import { signOut } from "next-auth/react";
import TagManager from "react-gtm-module";
import LoadingBar from "react-top-loading-bar";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
// import ReactPixel from 'react-facebook-pixel';

// Ads
import RightSideAdComp from "../components/user/ads/RightSideAdComp";

// Services
import { getCategoriesService } from "../services/user/services";
import { getTagsService } from "../services/user/forumServices";

// Utils
import { isWindowPresent } from "../utils/checkDom";
import auth, { handleUserDetails } from "../utils/auth";
import { envConfig } from "../utils/envConfig";
import { http } from "../utils/http";
import { getIP } from "../utils/helpers";

// Redux
import { forumHandlers } from "../redux/actions/forumsAc/forumsAc";

// Data
import forumTypes from "../utils/data/forumTypes.json";
import LgSidebar from "../components/common/LgSidebar";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { layoutTypes, next_auth_status } from "../utils/provider";
import { resHandler } from "../utils/api";

// Google tag manager
if (isWindowPresent()) {
  const tagManagerArgs = {
    gtmId: envConfig.isProdMode
      ? envConfig.tagManagerLiveKey
      : envConfig.tagManagerDevKey,
  };
  TagManager.initialize(tagManagerArgs);
}

// Meta-pixel
if (envConfig.isProdMode) {
  // const options = { autoConfig: true, debug: false };
  if (isWindowPresent()) {
    // ReactPixel.init(envConfig.pixelId, null, options);
    // ReactPixel.fbq('track', 'PageView');
  }
}

// Set the ip to localstorage by fetching it from third party
getIP();

const { checkAuth, setAuth } = auth;

export const AuthContext = createContext(checkAuth());

if (isWindowPresent()) {
  window.dataLayer.push({
    event: "pageview",
  });
}

const UserLayout = ({ children, additionalProps = false }) => {
  
  // Hooks and vars
  const router = useRouter();
  const loaderRef = useRef(null);
  const { data: session, status } = useSession();
  const logout = isWindowPresent() ? localStorage.getItem("logout") : "0";
  const userDetails = session?.user;
  const updatedChildren = cloneElement(children, {
    userDetails: userDetails,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (session && status === next_auth_status.authenticated) {
      const getProfileData = async () => {
        // Means that may have been inactivated or deleted form db
        const logout = localStorage.getItem("logout");
        if (session && logout === "1") {
          localStorage.clear();
          return await signOut({ redirect: false });
        }

        let obj = {
          data: {},
          clientSide: true,
          token: session?.user?.token,
          method: "get",
          url: "getprofile",
        };
        try {
          let res = await http(obj);
          res = resHandler(res);
          if (res.status === true) {
            const user = res.user;
            const userDet = {
              id: user.user_id,
              ...user,
              token: session?.user?.token,
              comments: res?.comments,
            };
            localStorage.setItem("userDetails", JSON.stringify(userDet));
          } else {
            console.log(res);
          }
        } catch (err) {
          console.log(err?.message);
        }
      };
      getProfileData();
    } else if (status === next_auth_status.unauthenticated) {
      handleUserDetails({ remove: true });
    }
  }, [session, status, logout]);

  // Retrieves the categories from the backend, and if authenticated fetches the userDetails also
  useEffect(() => {
    getTagsService({ dispatch });
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
    };

    loadScriptByURL("recaptcha-key", envConfig.recaptchaKey, function () { });

    // End of load recaptcha v3
    let { handleForumsTypesAcFn } = forumHandlers;
    dispatch(handleForumsTypesAcFn({ data: forumTypes }));

    getCategoriesService({ dispatch });
  }, []);

  useEffect(() => {
    const handleStart = () => {
      loaderRef.current.continuousStart()
    };
    const handleStop = () => {
      loaderRef.current.complete()
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  return (
    <>
      <AuthContext.Provider value={setAuth}>
        <Meta
          {...(additionalProps?.meta && {
            ...additionalProps.meta,
          })}
          removeDefaultMeta={additionalProps?.removeDefaultMeta}
        />

        <main className={`container-fluid ${additionalProps?.layout ?? ""}`}>
          <div
            className={`row outerContWrapper${!additionalProps?.authPage ? " not_auth_page" : ""
              }${additionalProps?.profilePage ? " profile_page" : ""}`}
          >

            {additionalProps?.authPage ? null : (
              <Header
                userDetails={userDetails}
                additionalProps={additionalProps}
                profilePage={additionalProps?.profilePage} />
            )}

            {!additionalProps?.profilePage && !(additionalProps?.layout === layoutTypes.blank) ?
              (<>
                {additionalProps?.authPage ? (
                  <LgSidebar {...additionalProps.sideBarProps} />
                ) : (
                  <Sidebar pageCategory={additionalProps?.pageCategory} />
                )}
              </>)
              : null}

            <div
              className={`rightColumn${additionalProps?.containsSideAd ? " side_ads_page" : ""
                }${additionalProps?.authPage ? " auth_page" : ""}${additionalProps?.containsSideAd && additionalProps?.authPage
                  ? " not_contains_sidead"
                  : ""
                }`}
            >
              <div className="rightMainFormCont rightMainFormContFeed p-0">
                {additionalProps?.authPage ? null : (
                  <div className="preventHeader">preventHead</div>
                )}

                {additionalProps?.authPage ? (
                  <>{updatedChildren}</>
                ) : (
                  <div className="w-100 py-md-4 p-0 p-md-3 preventFooter">
                    <div className="row forPosSticky">{updatedChildren}</div>
                  </div>
                )}
              </div>
            </div>

            {additionalProps?.containsSideAd ? (
              <div className="rightsideBarAdd">
                <RightSideAdComp />
              </div>
            ) : null}
          </div>
        </main>

        <Footer />
        <LoadingBar color="#FC997C" ref={loaderRef} />

        <FooterScripts />
      </AuthContext.Provider>
    </>
  );
};

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  return {
    props: {
      session
    },
  };
}

export default UserLayout;

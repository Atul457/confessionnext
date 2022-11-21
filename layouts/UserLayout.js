import React, { createContext, useEffect, cloneElement } from "react";
import { useDispatch } from "react-redux";

// Common Imports
import Footer from "../components/user/footer/Footer";
import Header from "../components/user/header/Header";
import Meta from "../components/user/Meta";
import { FooterScripts } from "../components/user/Scripts";
import Sidebar from "../components/user/sidebar/Sidebar";

// Third party
import TagManager from "react-gtm-module";
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
import { next_auth_status } from "../utils/provider";
import { resHandler } from "../utils/api";
import { signOut } from "next-auth/react";


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
  const options = { autoConfig: true, debug: false };
  if (isWindowPresent()) {
    // ReactPixel.init(envConfig.pixelId, null, options);
    // ReactPixel.fbq('track', 'PageView');
  }
}

// Set the ip to localstorage by fetching it from third party
getIP();

const { checkAuth, setAuth } = auth;

export const AuthContext = createContext(checkAuth());

const UserLayout = ({ children, additionalProps = false }) => {
  if (isWindowPresent()) {
    window.dataLayer.push({
      event: "pageview",
    });
  }

  // Hooks and vars
  const { data: session, status } = useSession();
  const logout = isWindowPresent() ? localStorage.getItem("logout") : "0"
  const userDetails = session?.user;
  const updatedChildren = cloneElement(children, {
    userDetails: userDetails,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (session && status === next_auth_status.authenticated) {
      const getProfileData = async () => {

        // Means that may have been inactivated or deleted form db
        const logout = localStorage.getItem("logout")
        if (session && logout === "1") {
          localStorage.clear()
          return await signOut({ redirect: false })
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
              comments: res?.comments
            };
            localStorage.setItem(
              "userDetails",
              JSON.stringify(userDet)
            );
          } else {
            console.log(res)
          }
        } catch (err) {
          console.log(err?.message);
        }
      }
      getProfileData();
    }
    else if (status === next_auth_status.unauthenticated) {
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



  if (status === "loading" || session === undefined) {
    return <h4 align="center">Loading</h4>;
  }

  return (
    <>
      <AuthContext.Provider value={setAuth}>
        <Meta />
        <main className="container-fluid">
          <div
            className={`row outerContWrapper${!additionalProps?.authPage ? " not_auth_page" : ""
              }`}
          >
            {additionalProps?.authPage ? null : (
              <Header userDetails={userDetails} />
            )}

            {additionalProps?.authPage ? (
              <LgSidebar {...additionalProps.sideBarProps} />
            ) : (
              <Sidebar />
            )}

            <div
              className={`rightColumn${additionalProps?.containsSideAd ? " side_ads_page" : ""
                }${additionalProps?.authPage ? " auth_page" : ""}${additionalProps?.containsSideAd && additionalProps?.authPage ? " not_contains_sidead" : ""}`}
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

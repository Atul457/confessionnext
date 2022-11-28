import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleShareWithLoveModal } from "../../../redux/actions/shareWithLoveAc/shareWithLoveAc";
import AppLogo from "../../common/AppLogo";
import { HeartComponent, ShareWithLoveModal, AppreciationModal } from "../modals/Sharepostwithlove";
import SocialLinksModal from "../modals/SocialLinksModal";
import UpdatePasswordModal from "../modals/UpdatePasswordModal";
import HeadMenu from "./HeadMenus";
import UserIcon from "./UserIcon";


const Header = (props) => {

  // Logs the user out
  // const logout = async () => {
  //   await signOut({ redirect: false });
  // };

  // Hooks and vars
  const store = useSelector(store => store)
  const { socialLinksModalReducer, chatReducer } = store
  const dispatch = useDispatch()
  const heartCompRef = useRef(null)


  // Handles scroll to top button
  useEffect(() => {
    const scroll = () => {
      let htmlPostElem = document.querySelector("html")
      if (heartCompRef?.current) {
        if (htmlPostElem?.scrollTop > 600 && !chatReducer.chatVisible) heartCompRef?.current?.classList?.remove("hideHeartComp")
        else if (htmlPostElem.crollHeight > 1000) heartCompRef?.current?.classList?.add("hideHeartComp")
      }
    }

    document.addEventListener("scroll", scroll);
    return () => {
      window.removeEventListener("scroll", scroll);
    }
  }, [props])

  useEffect(() => {
    let htmlPostElem = document.querySelector("html")
    if (heartCompRef?.current) {
      if (htmlPostElem?.scrollHeight < 1000 && !chatReducer.chatVisible) heartCompRef?.current?.classList?.remove("hideHeartComp")
      else heartCompRef?.current?.classList?.add("hideHeartComp")
    }
  }, [store])
  

  // Functions

  // Open share with love modal
  const openSharewithLoveModal = () => {
    dispatch(toggleShareWithLoveModal({
      visible: true
    }))
  }

  return (
    <>
      <header className="mainHead col-12 posFixedForHeader">
        <div className="insideHeader">
          <div className="headerLeftCol pl-0">
            <span to="/" className="homeHeaderLink">
              <AppLogo />
            </span>
          </div>


          <div className="viewProfileIcon pr-md-0 pr-lg-4">
            <div className="row align-items-center justify-content-end m-0 navigationIcons">
              <HeadMenu />
              <UserIcon />
            </div>
          </div>
        </div>

        <div className={`roundCorners ${props.hideRound ? "d-none" : ""}`}>
          __
        </div>

        {/* Modals */}

        {/* Share post with love modal */}
        <ShareWithLoveModal />

        {/* Appriciation Modal */}
        <AppreciationModal />

      </header>

      {/* Share post with love floating icon */}
      <div
        pulsate='28-10-22,pulsatingIcon mobile'
        className={`heartCompCont hideHeartComp cursor_pointer`}
        onClick={openSharewithLoveModal}
        ref={heartCompRef}>
        <HeartComponent />
      </div>


      {/* SOCIAL LINKS MODAL */}
      <SocialLinksModal
        visible={socialLinksModalReducer.visible}
      />

      {/* UPDATE PASSWORD MODAL */}
      <UpdatePasswordModal />
    </>
  );
};

export default Header;

import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import auth from "../../../utils/auth";
import NavLink from "../../../utils/NavLink";
import { useSession } from "next-auth/react"

const Footer = (props) => {

  const router = useRouter();
  const { data: session } = useSession()
  // const [currUrl, setCurrUrl] = useState("__");
  // let currentUrl = currUrl;
  // const location = router.pathname;
  // currentUrl = currentUrl?.split("/");
  // currentUrl = currentUrl[currentUrl.length - 1];
  const notificationReducer = useSelector((store) => store.notificationReducer);

  useEffect(() => {
    // setCurrUrl(window.location.href);
  }, []);

  return (
    <footer className="col-12 d-block d-md-none footer">
      <div className="linksCont container-fluid">
        <div className="linkBtns" onClick={props?.refreshFeed}>
          <NavLink href="/" className="linkBtnsAnchor">
            <span className="headIconCont">
              <img
                src={"/images/homeIconM.svg"}
                className="foot_icon"
                alt="homeIcon"
              />
              <img
                src={"/images/homeIcon.svg"}
                className="foot_icon active_icon"
                alt="homeIcon"
              />
            </span>
            <span
              className="footLinkName"
            >
              Home
            </span>
          </NavLink>
        </div>

        <div className="linkBtns">
          <NavLink href="/forums" className="linkBtnsAnchor">
            <span className="headIconCont">
              <img
                src="/images/confessIconActive.svg"
                alt="confessIconActive"
                className="foot_icon active_icon"
              />
              <img
                src="/images/confessIconM.svg"
                alt="confessIcon"
                className="foot_icon"
              />
            </span>
            <span
              className={`footLinkName`}
            >
              Forums
            </span>
          </NavLink>
        </div>

        {session ? (
          <div className="linkBtns">
            <NavLink href="/chat" className="linkBtnsAnchor chatLink">
              <span className="headIconCont">
                <img
                  src="/images/inboxIconM.png"
                  alt="inboxIcon"
                  className="foot_icon"
                />
                <img
                  src="/images/inboxIconActive.svg"
                  alt="active_inboxIcon"
                  className="foot_icon active_icon"
                />

              </span>
              <span
                className={`footLinkName ${notificationReducer.messagesCount > 0
                  ? "newInboxMessages"
                  : ""
                  }`}
              >
                Chat
              </span>
            </NavLink>
          </div>
        ) : (
          <div className="linkBtns">
            <NavLink href="/report" className="linkBtnsAnchor">
              <span className="headIconCont">
                <img
                  className="contactUsIcon foot_icon"
                  src="/images/contactUsMobIcon.svg"
                  alt="contactUsIcon"
                />
                <img
                  className="contactUsIcon active_icon foot_icon"
                  src="/images/contactUsIconActive.svg"
                  alt="contactUsActiveIcon"
                />
              </span>
              <span
                className="footLinkName"
              >
                Contact us
              </span>
            </NavLink>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;

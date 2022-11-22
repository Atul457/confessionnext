import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

// Utils
import NavLink from "../../../utils/NavLink";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";

const HeadMenus = (props) => {

  // Hooks and vars
  const { data: session } = useSession();
  const currentUrl = useRouter().pathname.replace("/", "");
  const store = useSelector((store) => store);
  const notificationReducer = store.notificationReducer;


  return (
    <div className="d-none d-md-block pr-0">
      <div className={`linksCont container-fluid`}>
        <div className="linkBtns" onClick={props?.refreshFeed}>
          <NavLink href="/" className="headerNavLinks">
            <span className="headIconCont">
              <img
                src={
                  currentUrl === ""
                    ? "/images/homeIcon.svg"
                    : "/images/homeIconActive.svg"
                }
                alt="homeIcon"
              />
            </span>
            <span
              className={`headLinkName ${currentUrl === "" ? "activeLinkOfHeader" : ""
                }`}
            >
              Home
            </span>
          </NavLink>
        </div>

        <div className="linkBtns">
          <NavLink href="/forums" className="headerNavLinks">
            <span className="headIconCont">
              <img
                src="/images/confessIconActive.svg"
                alt="confessIconActive"
                className="active"
              />
              <img
                src="/images/confessIcon.svg"
                alt="confessIcon"
                className="inactive"
              />
            </span>
            <span
              className={`headLinkName ${currentUrl === "forums" ? "activeLinkOfHeader" : ""
                }`}
            >
              Forums
            </span>
          </NavLink>
        </div>

        {session ? (
          <div className="linkBtns">
            <Link href="/chat" className="headerNavLinks">
              <span className="headIconCont">
                <img
                  src={
                    currentUrl === "chat"
                      ? "/images/inboxIconActive.svg"
                      : "/images/inboxIcon.svg"
                  }
                  alt="inboxIcon"
                />
              </span>
              <span
                className={`headLinkName ${notificationReducer.messagesCount > 0
                  ? "newInboxMessages"
                  : ""
                  } ${currentUrl === "chat" ? "activeLinkOfHeader" : ""}`}
              >
                Inbox
              </span>
            </Link>
          </div>
        ) : (
          <div className="linkBtns">
            <Link href="/report" className="headerNavLinks">
              <span className="headIconCont">
                <img
                  className="contactUsIcon"
                  src={
                    currentUrl === "report"
                      ? "/images/contactUsIconActive.svg"
                      : "/images/contactUsIcon.svg"
                  }
                  alt="reportIcon"
                />
              </span>
              <span
                className={`headLinkName ${currentUrl === "report" ? "activeLinkOfHeader" : ""
                  }`}
              >
                Contact us
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeadMenus;

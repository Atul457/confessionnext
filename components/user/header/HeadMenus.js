import React from 'react'
import Image from 'next/image';
import Link from 'next/link'
import { useRouter } from 'next/router';

// Utils
import auth from '../../../utils/auth';
import NavLink from '../../../utils/NavLink';

const HeadMenus = (props) => {

  // Hooks and vars
  const currentUrl = (useRouter().pathname).replace("/", "");
  const { isUserLoggedIn } = auth

  return (
    <div className="d-none d-md-block pr-0">
      <div className={`linksCont container-fluid`}>
        <div className="linkBtns" onClick={props?.refreshFeed}>
          <NavLink href="/" className="headerNavLinks">
            <span className="headIconCont">
              <Image
                fill={true}
                src={currentUrl === '' ?
                  "/images/homeIcon.svg" :
                  "/images/homeIconActive.svg"}
                alt="homeIcon" />
            </span>
            <span
              className={`headLinkName ${currentUrl === "" ? "activeLinkOfHeader" : ""}`}>Home</span>
          </NavLink>
        </div>

        <div className="linkBtns">
          <NavLink href="/forums" className="headerNavLinks">
            <span className="headIconCont">
              <Image
                fill={true}
                src="/images/confessIconActive.svg" alt="confessIconActive" className='active' />
              <Image
                fill={true}
                src="/images/confessIcon.svg" alt="confessIcon" className='inactive' />
            </span>
            <span className={`headLinkName ${currentUrl === "forums" ? "activeLinkOfHeader" :
              ""}`}>Forums</span>
          </NavLink>
        </div>

        {
          isUserLoggedIn ? <div className="linkBtns">
            <Link href="/chat" className="headerNavLinks">
              <span className="headIconCont">
                <Image
                  fill={true}
                  src={currentUrl === 'chat' ? inboxIconActive : inboxIcon}
                  alt="inboxIcon" />
              </span>
              <span className={`headLinkName ${notificationReducer.messagesCount > 0 ? 'newInboxMessages' : ''} ${currentUrl === "chat" ? "activeLinkOfHeader" : ""}`}>Inbox</span>
            </Link>
          </div> :
            <div className="linkBtns">
              <Link href="/report" className="headerNavLinks">
                <span className="headIconCont">
                  <Image
                    fill={true}
                    className="contactUsIcon"
                    src={currentUrl === 'report' ? "/images/contactUsIconActive.svg" : "/images/contactUsIcon.svg"} alt="reportIcon" />
                </span>
                <span className={`headLinkName ${currentUrl === "report" ? "activeLinkOfHeader" : ""}`}>Contact us</span>
              </Link>
            </div>
        }
      </div>
    </div>
  )
}

export default HeadMenus
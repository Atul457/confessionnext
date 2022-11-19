import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { useSelector } from 'react-redux'
import auth from '../../../utils/auth'
import { isWindowPresent } from '../../../utils/checkDom'
import NavLink from '../../../utils/NavLink'

const Footer = props => {

  const router = useRouter()
  const { isUserLoggedIn } = auth
  let currentUrl = isWindowPresent() ? window.location.href : "___";
  const location = router.pathname
  currentUrl = currentUrl?.split("/");
  currentUrl = currentUrl[(currentUrl.length) - 1];
  const notificationReducer = useSelector(store => store.notificationReducer);

  return (
    <footer className="col-12 d-block d-md-none footer">
      <div className="linksCont container-fluid">
        <div className="linkBtns" onClick={props?.refreshFeed}>
          <NavLink href="/" className="linkBtnsAnchor">
            <span className="headIconCont">
              <Image width={20} height={20} src={currentUrl === '' ? "/images/homeIcon.svg" : "/images/homeIconM.svg"} alt="homeIcon" />
            </span>
            <span className={`footLinkName ${currentUrl === "home" ? "activeLinkOfHeader" : ""}`}>Home</span>

          </NavLink>
        </div>

        <div className="linkBtns">
          <NavLink href="/forums" className="linkBtnsAnchor">
            <span className="headIconCont">
              <Image width={20} height={20} src="/images/confessIconActive.svg" alt="confessIconActive" className='active' />
              <Image width={20} height={20} src="/images/confessIconM.svg" alt="confessIcon" className='inactive' />
            </span>
            <span className={`footLinkName ${location.startsWith("/forum") ? "activeLinkOfHeader" :
              ""}`}>Forums</span>
          </NavLink>
        </div>

        {isUserLoggedIn
          ?
          <div className="linkBtns">
            <NavLink href="/chat" className="linkBtnsAnchor chatLink">
              <span className="headIconCont">
                <Image width={20} height={20} src={currentUrl === 'chat' ? "/images/inboxIconActive.svg" : "/images/inboxIconM.png"} alt="inboxIconM" />
              </span>
              <span className={`footLinkName ${notificationReducer.messagesCount > 0 ? 'newInboxMessages' : ''} ${currentUrl === "chat" ? "activeLinkOfHeader" : ""}`}>Chat</span>
            </NavLink>
          </div>
          :
          <div className="linkBtns">
            <NavLink href="/report" className="linkBtnsAnchor">
              <span className="headIconCont">
                <Image width={20} height={20} className="contactUsIcon" src={currentUrl === 'report' ? "/images/contactUsIconActive.svg" : "/images/contactUsMobIcon.svg"} alt="contactUsIcon" />
              </span>
              <span className={`footLinkName ${currentUrl === "report" ? "activeLinkOfHeader" : ""}`}>Contact us</span>
            </NavLink>
          </div>}
      </div>
    </footer>
  )
}

export default Footer
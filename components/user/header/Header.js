import React from 'react'
import AppLogo from '../../common/AppLogo'
import HeadMenu from './HeadMenus'
import UserIcon from './UserIcon'

const Header = props => {
    return (
        <header className='mainHead col-12 posFixedForHeader'>

            <div className="insideHeader">
                <div className="headerLeftCol pl-0">
                    <span to="/home" className="homeHeaderLink">
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

            <div className={`roundCorners ${props.hideRound ? "d-none" : ""}`}>__</div>

        </header>
    )
}

export default Header
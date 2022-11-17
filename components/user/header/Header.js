import React from 'react'
import HeadMenu from './HeadMenus'

const Header = () => {
    return (
        <header className='mainHead col-12 posFixedForHeader'>
            <div className="viewProfileIcon pr-md-0 pr-lg-4">
                <div className="row align-items-center justify-content-end m-0 navigationIcons">
                    <HeadMenu />
                </div>
            </div>
        </header>
    )
}

export default Header
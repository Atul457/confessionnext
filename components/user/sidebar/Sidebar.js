import React from 'react'

// Component imports
import AppLogo from '../../common/AppLogo'
import Categories from '../Categories'
import SocialIcons from './SocialIcons'

const Sidebar = () => {
    return (
        <div className="leftColumn leftColumnFeed">
            <div className="leftColumnWrapper">
                <AppLogo />

                <div className="middleContLoginReg feedMiddleCont">
                    {/* CATEGORYCONT */}
                    <aside className="posSticky">
                        <Categories />
                    </aside>
                    {/* CATEGORYCONT */}
                </div>

                <SocialIcons />
            </div>
        </div>
    )
}

export default Sidebar
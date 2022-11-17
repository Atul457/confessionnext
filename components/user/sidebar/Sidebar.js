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
                        {/* <Category
                            showConfessionCats={true}
                            categories={props.categories}
                            activeCatIndex={AC2S}
                            updateActiveCategory={updateActiveCategory}
                        /> */}
                    </aside>
                    {/* CATEGORYCONT */}
                </div>

                <SocialIcons />
            </div>
        </div>
    )
}

export default Sidebar
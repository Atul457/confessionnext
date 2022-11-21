import React from 'react'

// Custom components
import Header from "../../../user/pageElements/common/Header"
import AppLogo from '../../../user/pageElements/components/AppLogo';
import SocialIconsComp from '../../SocialIconsComp/SocialIconsComp';
import ForumMiddleCompWrapper from '../ForumPageWrapper';
import ForumCategories from '../forumCategories/ForumCategories';
import RightSideAdComp from '../../sidebarAds/RightSideAdComp';

import { useLocation } from 'react-router-dom';


const ForumLayoutWrapper = ({ children, propToWatch = Math.floor(Math.random() * 1000) }) => {

    const location = useLocation()?.pathname.replace("/", "")
    const isForumPage = location.startsWith("forum")
    const isSearchPage = location.startsWith("search")

    return (
        <div className="container-fluid forums_page feed_page">
            <div className="row outerContWrapper">
                <Header links={true} propToWatch={propToWatch}></Header>

                {/* LeftSideCont */}
                <aside className="leftColumn leftColumnFeed">
                    <div className="leftColumnWrapper">
                        <AppLogo />
                        <div className="middleContLoginReg feedMiddleCont w-100">
                            {/* Categorycont */}
                            <aside className="posSticky">
                                <ForumCategories
                                    onlyForForums={isForumPage}
                                    isSearchPage={isSearchPage} />
                            </aside>
                        </div>

                        {/* Social links */}
                        <div className="leftSidebarFooter">
                            <SocialIconsComp />
                        </div>
                    </div>
                </aside>

                {/* Rightsides comp */}
                <ForumMiddleCompWrapper>
                    {children}
                </ForumMiddleCompWrapper>
                {/* Rightsides comp */}

                <div className="rightsideBarAdd">
                    <RightSideAdComp />
                </div>
            </div>
        </div>
    )
}

export default ForumLayoutWrapper
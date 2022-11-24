import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiStatus } from '../../../utils/api'
import { createForumModalFnAc, forumHandlers } from '../../../redux/actions/forumsAc/forumsAc'
import { ExpandableForumCats } from '../Categories'
import CreateFormModal from '../modals/CreateFormModal'
import MyForums from './forumPageComp/MyForums'
import WhatsNew from './forumPageComp/WhatsNew'
import Link from 'next/link'
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router'
import { pageCategoryTypes } from '../../../utils/provider'


const RightSideComp = () => {

    const TabComps = [<WhatsNew />, <MyForums />]
    const { data: session } = useSession();
    const { modals, forums: { activeTab } } = useSelector(state => state.forumsReducer)
    const { createForumModal } = modals
    const { handleForums } = forumHandlers
    const ActiveTab = TabComps[activeTab]
    const myForumsIndex = 1
    const dispatch = useDispatch()

    const changeActiveTab = (activeTabIndex) => {
        if (activeTab !== activeTabIndex)
            dispatch(handleForums({
                status: apiStatus.LOADING,
                data: [],
                message: "",
                actionBox: {},
                page: 1,
                count: 0,
                activeTab: activeTabIndex
            }))
    }

    return (
        <>
            <Tabs activeTab={activeTab} setActiveTab={changeActiveTab} session={session} />

            {activeTab !== myForumsIndex ?
                <ExpandableForumCats classNames='mb-3 d-block d-md-none' pageCategory={pageCategoryTypes.forum} /> : null}

            <div className='forums_tabs_comps_holder'>
                {ActiveTab}
            </div>

            {/* Create forum modal */}
            {createForumModal.visible && <CreateFormModal />}

        </>
    )
}

const Tabs = ({ activeTab, setActiveTab, session }) => {

    // Hooks and vars
    let tabs = ["What's New", "My Forums"]
    const router = useRouter()
    const dispatch = useDispatch()
    const navigate = router.push

    // Functions
    const changeTab = tabIndex => {
        setActiveTab(tabIndex)
    }

    const openCreateSForumModal = () => {
        if (!session) navigate("/login")
        dispatch(createForumModalFnAc({
            visible: true
        }))
    }

    return (

        <div className='forum_tabs_cont'>
            <div className="links_cont">
                {tabs.map((currTab, ctIndex) => {
                    if (!session && ctIndex === 1) {
                        return (
                            <span
                                key={`forumsTab${ctIndex}`}
                                onClick={() => navigate("/login")}
                                className={`forums_tab ${activeTab === ctIndex ? "active" : ''}`}>
                                {currTab}
                            </span>
                        )
                    }
                    return (
                        <span
                            key={`forumsTab${ctIndex}`}
                            onClick={() => changeTab(ctIndex)}
                            className={`forums_tab ${activeTab === ctIndex ? "active" : ''}`}>
                            {currTab}
                        </span>
                    )
                })}
            </div>

            {
                session ?
                    (<div
                        onClick={openCreateSForumModal}
                        className="doPostBtn create_forum_btn"
                        type="button">
                        <i className="fa fa-plus text-white pr-1 d-md-inline-block" aria-hidden="true"></i>
                        New <span className='d-md-inline-block pl-1'>Forum</span>
                    </div>)
                    : (
                        <Link href="/login" className="doPostBtn create_forum_btn" >
                            <i className="fa fa-plus text-white pr-1 d-md-inline-block" aria-hidden="true"></i>
                            New <span className='d-md-inline-block pl-1'>Forum</span>
                        </Link>
                    )
            }

        </div >
    )
}

export default RightSideComp
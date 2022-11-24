import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RightSideComp from '../components/user/forums/RightSideComp'
import { forumHandlers } from '../redux/actions/forumsAc/forumsAc'
import { pageCategoryTypes } from '../utils/provider'


const Forums = () => {

    // Hooks and vars
    const dispatch = useDispatch()
    const forumsReducer = useSelector(state => state.forumsReducer?.forums)
    const { actionBox } = forumsReducer

    useEffect(() => {

        const clickHandler = e => {
            // if action box is visible hide it else do nothing
            let isActionIconClicked = e.target.classList
            isActionIconClicked = isActionIconClicked.contains("sharekitdots") || isActionIconClicked.contains("shareKitImgIcon")

            if (!isActionIconClicked && ("forum_id" in actionBox || "forum_index" in actionBox))
                toggleForumAcboxFn()
        }
        document.addEventListener("click", clickHandler)
        return () => {
            document.removeEventListener("click", clickHandler)
        }
    }, [forumsReducer?.actionBox])

    // Functions
    const toggleForumAcboxFn = () => {
        dispatch(forumHandlers.handleForums({ actionBox: {} }))
    }

    return (
        <RightSideComp />
    )
}

export default Forums

Forums.additionalProps = {
    containsSideAd: true,
    meta: {
        title: "Forums"
    },
    pageCategory: pageCategoryTypes.forum,
    mobileCategories: true
}
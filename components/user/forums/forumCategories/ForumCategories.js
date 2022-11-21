import React, { useEffect, useState } from 'react'

// Redux 
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { forumHandlers } from '../../../redux/actions/forumsAc/forumsAc'

// Helpers
import { apiStatus } from '../../../helpers/status'
import { searchAcFn } from '../../../redux/actions/searchAc/searchAc'
import { getForumsNConfessions } from '../services/forumServices'
import { searchTypes } from '../detailPage/comments/ForumCommProvider'


const ForumCategories = ({
    setShowCat = () => { },
    isExpandable = false,
    classNames = "",
    onlyForForums = false,
    isSearchPage = false
}) => {

    // Hooks and vars
    const { categories: categoriesRed } = useSelector(state => state.forumsReducer),
        SearchReducer = useSelector(state => state.SearchReducer),
        { data: categories, activeCategory } = categoriesRed,
        location = useLocation()?.pathname,
        navigate = useNavigate(),
        dispatch = useDispatch()


    useEffect(() => {
        const dataToSend = {
            postComment: {
                status: apiStatus.IDLE,
                message: "",
            },
            status: apiStatus.LOADING,
            data: [],
            message: "",
            actionBox: {},
            page: 1,
            comments: {
                status: apiStatus.LOADING,
                data: [{
                    subComments: {
                        status: apiStatus.IDLE,
                        data: [],
                        message: "",
                    }
                }],
                message: ""
            }
        }
        dispatch(forumHandlers.handleForum(dataToSend))
    }, [])

    return (
        <div className={`row ${classNames}`}>
            {!isExpandable ?
                <div className="categoryHead col-12">
                    Choose categories
                </div> : null}

            <div className="categoriesContainer w-100">
                {categories.map((category, cindex) => {
                    if (onlyForForums === true && category?.is_forum === 0) return
                    if (isSearchPage === true && SearchReducer.type === searchTypes.FORUM && category.is_confession === 1 && category.is_forum === 0) return
                    if (isSearchPage === true && SearchReducer.type === searchTypes.POST && category.is_confession === 0 && category.is_forum === 1) return
                    return <Category
                        setShowCat={setShowCat}
                        SearchReducer={SearchReducer}
                        location={location}
                        activeCategory={activeCategory}
                        navigate={navigate}
                        key={`forumsCategory${cindex}${category?.id}`}
                        categoryName={category?.category_name}
                        cindex={cindex + 1} />
                })}
            </div>

            {!isExpandable ?
                <div className={`col-12 pt-0 filterVerbiage`}>
                    * Filter out forums by clicking on the categories above. Unselect the category to remove the filter.
                </div> : null}
        </div>

    )
}

const ExpandableForumCats = ({ classNames = "", onlyForForums = false, isSearchPage = false }) => {

    const [showCat, setShowCat] = useState(false)
    return (
        <div className={`expandableCategory d-block ${classNames}`}>
            <div className="head" onClick={() => setShowCat(!showCat)}>
                Choose a Category to filter forums
                <span>
                    <i aria-hidden="true" className={`fa fa-chevron-down categoryDownIcon ${showCat ? "rotateUpsideDown" : ""}`}></i>
                </span>
            </div>
            {showCat && <div className="body">
                {/* CATEGORYCONT */}
                <aside className="col-12 col-md-4 posSticky mobileViewCategories d-none">
                    <ForumCategories
                        setShowCat={setShowCat}
                        isSearchPage={isSearchPage}
                        isExpandable={true}
                        onlyForForums={onlyForForums}
                    />
                </aside>
                {/* CATEGORYCONT */}
            </div>}

        </div>
    )
}

const Category = props => {

    const {
        categoryName,
        cindex,
        activeCategory,
        location,
        navigate,
        SearchReducer,
        setShowCat = () => { }
    } = props;
    const dispatch = useDispatch(),
        isActiveCategory = activeCategory === cindex,
        forumHomePageLink = "/forums",
        searchPageLink = "/search",
        isForumHomePage = location === forumHomePageLink,
        isSearchPage = location === searchPageLink

    const switchCategory = categoryToActivate => {
        // Closes the expanded category box
        setShowCat(false)
        let isSameCatClicked = activeCategory === categoryToActivate,
            allCategories = 0;
        categoryToActivate = isSameCatClicked ? allCategories : categoryToActivate
        dispatch(forumHandlers.handleForumCatsAcFn({ activeCategory: categoryToActivate }))

        if (isSearchPage) {
            dispatch(searchAcFn({
                activeCategory: categoryToActivate
            }))
            return getForumsNConfessions({
                selectedCategory: categoryToActivate,
                SearchReducer: {
                    ...SearchReducer,
                    dispatch,
                    page: 1,
                    append: false,
                }
            })
        }
        if (!isForumHomePage) {
            navigate(forumHomePageLink)
        }
    }

    return (
        <button
            className={`category ${isActiveCategory ? "activeCategory" : ""}`}
            type='button'
            onClick={() => switchCategory(cindex)}
            id={`forumCat${cindex}`}>
            {categoryName?.toLowerCase()}
        </button>
    )
}

export default ForumCategories
export { ExpandableForumCats }
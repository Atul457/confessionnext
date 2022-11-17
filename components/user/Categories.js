import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { forumHandlers } from '../../redux/actions/forumsAc/forumsAc'
import { apiStatus } from '../../utils/api'
import { isWindowPresent } from '../../utils/checkDom'
import ErrorFlash from '../common/ErrorFlash'
import Loader from '../common/Loader'

const Categories = ({
  setShowCat = () => { },
  isExpandable = false,
  classNames = "",
  onlyForForums = false,
  isSearchPage = false,
  forumpage = (isWindowPresent() && !window.location.pathname.includes("forum"))
}) => {

  // Hooks and vars
  const categoriesRed = useSelector(store => store.forumsReducer.categories),
    SearchReducer = useSelector(state => state.SearchReducer),
    { data: categories, activeCategory } = categoriesRed,
    router = useRouter(),
    location = router.pathname,
    navigate = router.push,
    dispatch = useDispatch(),
    categoryCompProps = {
      forumpage: forumpage,
      setShowCat: setShowCat,
      SearchReducer: SearchReducer,
      location: location,
      activeCategory: activeCategory,
      navigate: navigate,
    }


  useEffect(() => {
    if (!forumpage) {
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
    }
  }, [])

  if (categoriesRed.status === apiStatus.LOADING)
    return <Loader color='white' />

  if (categoriesRed.status === apiStatus.REJECTED)
    return <ErrorFlash message={categoriesRed.message} />

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
            {...categoryCompProps}
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
  // Hooks and vars
  const {
    categoryName,
    cindex,
    activeCategory,
    location,
    navigate,
    forumpage,
    SearchReducer,
    setShowCat = () => { }
  } = props;
  const dispatch = useDispatch(),
    isActiveCategory = activeCategory === cindex,
    forumHomePageLink = "/forums",
    searchPageLink = "/search",
    confHomePageLink = "/",
    isForumHomePage = location === forumHomePageLink,
    isConfessionHomePage = location === confHomePageLink,
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

    // Navigation logic
    if (!forumpage) {
      if (!isConfessionHomePage) navigate(confHomePageLink)
      return false
    }

    if (!isForumHomePage) navigate(forumHomePageLink)
    // Navigation logic

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


export { ExpandableForumCats }
export default Categories
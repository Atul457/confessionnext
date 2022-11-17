import { useEffect, useRef, useState } from "react";

// Third party
import InfiniteScroll from "react-infinite-scroll-component";

// Redux
import { useDispatch, useSelector } from "react-redux";

// Component imports
import Loader from "../components/common/Loader";
import Post from "../components/user/Post";

// Utils
import { getConfessionsService } from "../services/user/services";
import { apiStatus } from "../utils/api";
import auth from "../utils/auth";
import { showAdsAfter_Feed } from "../utils/provider";
import { envConfig } from "../utils/envConfig"

const { checkAuth } = auth

export default function Home(props) {

  // Hooks and vars
  let noOfChar = 2000;
  const [activeCategory, setActiveCategory] = useState("all");
  const [categoryShow, setCategoryShow] = useState(false);
  const [adSlots, setAdSlots] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [submittable, setSubmittable] = useState(true);
  const [base64Src, setBase64Src] = useState([]);
  const [imgPathArr, setImgPathArr] = useState([]);
  const [isImgLoading, setIsImgLoading] = useState(false);

  const heartCompRef = useRef(null)

  const dispatch = useDispatch();
  const store = useSelector(store => store)
  const confessionRed = store?.confessionReducer.confessions
  const confessions = confessionRed?.data
  const reportModalReducer = store.reportComModalReducer
  const reportPostModalReducer = store.reportPostModalReducer
  const avatarsIntroModalReducer = store.avatarsIntroModalReducer
  const verifyEmailReducer = store.VerifyEmail
  const { commentsModalReducer, shareWithLoveReducer } = store
  const { appreciationModal } = shareWithLoveReducer;
  const friendReqModalReducer = store.friendReqModalReducer
  const postBoxStateReducer = store.postBoxStateReducer.feed
  const [selectedCat, setSelectedCat] = useState(postBoxStateReducer.selectedCat ?? "");
  const postAlertReducer = store.postAlertReducer
  let fs = 1024; //Sets the max file size that can be sent

  const getConfessions = (append = false, page = 1) => {
    getConfessionsService({ act: "all", page: 1, dispatch, append })
  }

  useEffect(() => {
    getConfessions()
  }, [])

  // Functions
  const openSelect = () => {
    let selectedCategory = document.querySelector('#selectedCategory');
    selectedCategory.dispatchEvent(new Event('click'));
  }

  // Fetches more confessions
  const fetchMoreData = () => {
    getConfessionsService({ append: true, page: page + 1 })
  }

  // console.log({ confessions })

  if (confessionRed.status === apiStatus.LOADING)
    return <Loader size="sm" className="mx-auto" />

  if (confessionRed.status === apiStatus.REJECTED)
    return <ErrorFlash message={confessionRed.message} />

  return (
    <>
      <InfiniteScroll
        scrollThreshold="80%"
        endMessage={<div className=" text-center endListMessage mt-4 pb-3">End of Confessions</div>}
        dataLength={confessions.length}
        next={fetchMoreData}
        hasMore={confessions.length < confessionRed?.count}
        loader={
          <div className="text-center w-100">
            <div className="spinner-border pColor text-center" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        }>
        {confessions.map((post, index) => {
          return (<div key={`fConf${index}`}>
            <Post
              key={`fConf${index}`}
              post={{ ...post, index }} />

            {((index + 1) % showAdsAfter_Feed === 0) &&
              <div className="mb-4">
                {envConfig?.isProdMode ? <AdSense_ /> :
                  <AdMob mainContId={`adIndex${index}`} setAddSlots={setAdSlots} slots={adSlots} />}
              </div>
            }
          </div>)
        })}
      </InfiniteScroll>
    </>
  )
}

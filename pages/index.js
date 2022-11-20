import { useEffect, useRef, useState } from "react";

// Third party
import InfiniteScroll from "react-infinite-scroll-component";
import TextareaAutosize from "react-textarea-autosize";

// Redux
import { useDispatch, useSelector } from "react-redux";

// Component imports
import Loader from "../components/common/Loader";
import Post from "../components/user/Post";
import ErrorFlash from "../components/common/ErrorFlash";

// Utils
import { getConfessionsService } from "../services/user/services";
import { apiStatus } from "../utils/api";
import auth from "../utils/auth";
import {
  maxCharAllowedOnPostComment,
  maxImageSizeAllowed_Feed,
  showAdsAfter_Feed,
} from "../utils/provider";
import { envConfig } from "../utils/envConfig";
import AdMob, { AdSense_ } from "../components/user/ads/AdMob";
import { setConfessions } from "../redux/actions/confession/confessionAc";
import useCommentsModal from "../utils/hooks/useCommentsModal";
import useFeaturesModal from "../utils/hooks/useFeaturesModal";
import { isWindowPresent } from "../utils/checkDom";
import Image from "next/image";
import { extValidator, pulsationHelper } from "../utils/helpers";
import { http } from "../utils/http";

import PrivacyModal from "../components/user/modals/PrivacyModal";
import { scrollToTop } from "../utils/dom";

const { checkAuth } = auth;

export default function Home({ userDetails }) {
  // Hooks and vars
  // console.log(userDetails)
  let noOfChar = maxCharAllowedOnPostComment;
  const [categoryShow, setCategoryShow] = useState(false);
  const [adSlots, setAdSlots] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [submittable, setSubmittable] = useState(true);
  const [base64Src, setBase64Src] = useState([]);
  const [imgPathArr, setImgPathArr] = useState([]);
  const [isImgLoading, setIsImgLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorOrSuccess, setErrorOrSuccess] = useState(true);

  const heartCompRef = useRef(null);

  const dispatch = useDispatch();
  const store = useSelector((store) => store);
  const confessionRed = store?.confessionReducer.confessions;
  const confessions = confessionRed?.data;
  const reportModalReducer = store.reportComModalReducer;
  const postBoxStateReducer = store.postBoxStateReducer.feed;
  const reportPostModalReducer = store.reportPostModalReducer;
  const [selectedCat, setSelectedCat] = useState(
    postBoxStateReducer.selectedCat ?? ""
  );
  const avatarsIntroModalReducer = store.avatarsIntroModalReducer;
  const categoriesRed = store.forumsReducer.categories;
  const { activeCategory, data: categories } = categoriesRed;
  const verifyEmailReducer = store.VerifyEmail;
  const { commentsModalReducer, shareWithLoveReducer } = store;
  const { appreciationModal } = shareWithLoveReducer;
  const friendReqModalReducer = store.friendReqModalReducer;
  const postAlertReducer = store.postAlertReducer;
  const noConfessionsInCategory =
    confessions.length === 0 && confessionRed.status === apiStatus.FULFILLED;
  const confessionsLoading =
    confessions.length === 0 && confessionRed.status === apiStatus.LOADING;

  //CUSTOM HOOK
  const [
    commentsModalRun,
    commentsModal,
    changes,
    handleChanges,
    handleCommentsModal,
    CommentGotModal,
  ] = useCommentsModal();
  const [closeFeatures, openFeatures, Features, featuresState] =
    useFeaturesModal();

  // Privacy Modal
  const [privacyModal, setPrivacyModal] = useState({
    visible: false,
    accepted: 1,
    isConfessionBeingPost: false,
  });

  const getConfessions = (append = false, page = 1, act = "all") => {
    getConfessionsService({
      act: act === 0 ? "all" : act,
      page,
      dispatch,
      append,
    });
  };

  useEffect(() => {
    getConfessions();
    return () => {
      dispatch(setConfessions({ reset: true }));
    };
  }, []);

  useEffect(() => {
    getConfessions(false, 1, activeCategory);
    scrollToTop({ isFeedPage: true });
  }, [activeCategory]);

  useEffect(() => {
    pulsationHelper();
    if (activeCategory?.state?.openFeatures === true) openFeaturesDelay();
  }, []);

  useEffect(() => {
    if (!checkAuth()) {
      let acceptedOrNot = localStorage.getItem("privacyAccepted");
      if (parseInt(acceptedOrNot) !== 1) {
        setPrivacyModal({
          ...privacyModal,
          visible: true,
        });
      }

      if (privacyModal.accepted === true) {
        postConfession();
      }
    }
  }, [privacyModal.accepted]);

  // Functions

  // Opens the select box
  const openSelect = () => {
    let selectedCategory = document.querySelector("#selectedCategory");
    selectedCategory.dispatchEvent(new Event("click"));
  };

  const handlePrivacyModal = () => {
    privacyModal.visible
      ? setPrivacyModal({ ...privacyModal, visible: false })
      : setPrivacyModal({ ...privacyModal, visible: true });
  };

  const acceptPrivacy = () => {
    setPrivacyModal({ ...privacyModal, visible: false });
    if (isWindowPresent()) localStorage.setItem("privacyAccepted", 1);
  };

  const updatePostBtn = (bool) => {
    let ref = document.querySelector("#postConfessionBtn");
    if (bool) return ref.classList.add("disabled");
    ref.classList.remove("disabled");
  };

  //POSTS CONFESSION FROM FEED PAGE
  const postConfession = async () => {
    if (submittable) {
      updatePostBtn(true);

      let postConfessionArr,
        token = "",
        loggedInUserData,
        post_as_anonymous = 1,
        responseCont = document.querySelectorAll(".responseCont"),
        feedPostConfResponseCont = responseCont,
        description = document.querySelector("#description");

      let recapToken = "";
      if (isWindowPresent()) {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute("6LcFvPEfAAAAAL7pDU8PGSIvTJfysBDrXlBRMWgt", {
              action: "submit",
            })
            .then((token) => {
              recapToken = token;
              executePostConfession();
            });
        });
      }

      const executePostConfession = async () => {
        if (description.value.trim() !== "") {
          responseCont.forEach((singleResCont) => {
            singleResCont.innerText = "";
          });
          if (checkAuth()) {
            loggedInUserData = localStorage.getItem("userDetails");
            loggedInUserData = JSON.parse(loggedInUserData);
            post_as_anonymous = loggedInUserData.profile.post_as_anonymous;
            token = loggedInUserData.token;
            recapToken = "";
          } else if (recapToken === "") {
            updatePostBtn(false);
            responseCont.forEach((singleResCont) => {
              singleResCont.innerText = "Recaptcha is required";
            });
            return false;
          }

          if (selectedCat === "") {
            updatePostBtn(false);
            setIsLoading(false);
            setErrorOrSuccess(false);
            responseCont.forEach((singleResCont) => {
              singleResCont.innerText = "Please select a category";
            });
            return false;
          }

          if (checkAuth() && post_as_anonymous === 0) {
            if (postAlertReducer.postAnyway === false) {
              dispatch(postAlertActionCreators.openModal());
              updatePostBtn(false);
              setIsLoading(false);
              return false;
            }
          }

          postConfessionArr = {
            description: description.value,
            category_id: selectedCat,
            post_as_anonymous: post_as_anonymous,
            image: JSON.stringify(imgPathArr),
            code: token === "" ? recapToken : "",
          };

          //PRIVAY MODAL :: RUNS IF NOT AUTHENTICATED
          if (!checkAuth()) {
            if (isWindowPresent())
              if (
                localStorage.getItem("privacyAccepted")
                  ? parseInt(localStorage.getItem("privacyAccepted")) !== 1
                    ? true
                    : false
                  : true
              ) {
                setPrivacyModal({
                  ...privacyModal,
                  isConfessionBeingPost: true,
                  visible: true,
                });
                updatePostBtn(false);
                setIsLoading(false);
                return false;
              }
          }

          let obj = {
            data: postConfessionArr,
            token: token,
            method: "post",
            url: "createconfession",
          };

          setIsLoading(true);

          try {
            const response = await http(obj);
            if (response.data.status === true) {
              responseCont.forEach((singleResCont) => {
                singleResCont.innerText = "";
              });
              setErrorOrSuccess(true);
              description.value = "";
              setSelectedCat("");
              getConfessions(false, activeCategory, 1);
              feedPostConfResponseCont.innerHTML = response.data.message;
              if (base64Src.length) setBase64Src([]);
              if (imgPathArr) setImgPathArr([]);
            } else {
              setErrorOrSuccess(false);
              feedPostConfResponseCont.innerHTML = response.data.message;
            }

            updatePostBtn(false);
            setIsLoading(false);
            setSelectedCat("");
            //RESETS THE SELECT BOX
            let selectRef = document.querySelector("#selectedCategory");
            selectRef.selectedIndex = 0;

            setTimeout(() => {
              feedPostConfResponseCont.innerHTML = "";
            }, 2000);
          } catch (err) {
            console.log(err);
            setErrorOrSuccess(false);
            updatePostBtn(false);
            setIsLoading(false);
            setSelectedCat("");
            let selectRef = document.querySelector("#selectedCategory");
            selectRef.selectedIndex = 0;
            feedPostConfResponseCont.innerHTML =
              "Server Error, Please try again after some time...";
          }

          if (postAlertReducer.visible === true)
            dispatch(postAlertActionCreators.closeModal());

          if (
            postBoxStateReducer.description !== "" ||
            postBoxStateReducer.selectedCat !== ""
          )
            dispatch(
              setPostBoxState({ feed: { description: "", selectedCat: "" } })
            );
        } else {
          responseCont.forEach((singleResCont) => {
            singleResCont.innerText = "Comment field is required";
          });
          setErrorOrSuccess(false);
          updatePostBtn(false);
          setIsLoading(false);
        }
      };
    }
  };

  // Fetches more confessions
  const fetchMoreData = () => {
    if (confessionRed?.page) getConfessions(true, confessionRed?.page + 1);
  };

  //IN PROGRESS
  const toBase64 = (e, isCalledByInputElem) => {
    if (!isCalledByInputElem) {
      const uploadImages = document.querySelector("#uploadImages");
      uploadImages.value = null;
      return;
    }

    let responseCont = document.querySelectorAll(".responseCont");
    responseCont.forEach((singleResCont) => {
      singleResCont.innerText = "";
    });

    if (e.target.files[0]) {
      let fileObj;
      fileObj = e.target.files[0];

      //PREVENTS UNSPECIFIED EXTENSION FILESS
      if (!extValidator(fileObj)) {
        setErrorOrSuccess((prevState) => !prevState === false && !prevState);
        responseCont.forEach((singleResCont) => {
          singleResCont.innerText =
            "Supported file types are gif, jpg, jpeg, png";
        });
        return false;
      }

      setIsImgLoading(true);
      setSubmittable(false);
      let fileSize = parseInt(e.target.files[0].size / 2000);
      responseCont.forEach((singleResCont) => {
        singleResCont.innerText = "";
      });

      if (fileSize > maxImageSizeAllowed_Feed) {
        responseCont.forEach((singleResCont) => {
          singleResCont.innerText = "[Max FileSize: 2000KB], No file selected";
        });
        setIsImgLoading(false);
        setSelectedFile("");
        setErrorOrSuccess(false);
        setSubmittable(true);
        return false;
      }
      setSubmittable(false);
      // get a reference to the file
      const file = e.target.files[0];

      // encode the file using the FileReader API
      const reader = new FileReader();
      reader.onloadend = async () => {
        // use a regex to remove data url part
        let arr = base64Src;
        arr.push(reader.result);
        setBase64Src(arr);
        const base64String = reader.result;

        // log to console
        // logs wL2dvYWwgbW9yZ...
        setSelectedFile(base64String);
        let data = {
          image: base64String,
          folder: "post-images",
        };

        let obj = {
          data: data,
          token: "",
          method: "post",
          url: "uploadimage",
        };
        try {
          const res = await http(obj);
          if (res.data.status === true) {
            let arr = imgPathArr;
            arr.push(res.data.imagepath);
            setImgPathArr(arr);
            setIsImgLoading(false);
            setSubmittable(true);
            toBase64(null, false);
          }
        } catch (error) {
          console.log(error);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  //IN PROGRESS

  //DELAY
  const openFeaturesDelay = () => {
    setTimeout(() => {
      openFeatures();
    }, 60 * 1000);
  };

  // REFRESH FEED
  const refreshFeed = async () => {
    goUp();
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 200);
    });
    if (activeCategory === "all") return getConfessions(false, "all", 1);
    setActiveCategory("all");
  };

  // if (confessions.length === 0 && confessionRed.status === apiStatus.LOADING)
  //   return <Loader size="sm" className="mx-auto" />;

  if (confessionRed.status === apiStatus.REJECTED)
    return <ErrorFlash message={confessionRed.message} />;

  return (
    <>
      {/* POST MAIN CONT START */}
      <div className="postCont hideBoxShadow" id="postConfessionCont">
        <div className="doCommentContHeader container-fluid">
          <div className="doCommentTitle">
            Share your true feelings. Or your Confessions. Safely connect with
            like minds. Get answers to questions. You are Anonymous
          </div>
          <div className="confessImgContInCaptha">
            <Image
              src="/images/confessionBanner.png"
              alt="confessionBanner"
              fill={true}
            />
          </div>
        </div>
        <div className="postBody">
          <div className="container-fluid inputWithForwardCont">
            <div className="col-12 inputToAddComment toDoinputToAddComment">
              <TextareaAutosize
                className="form-control"
                id="description"
                minRows={5}
                maxLength={noOfChar}
                defaultValue={postBoxStateReducer.description ?? ""}
                placeholder={"What’s REALLY on your mind?"}
              ></TextareaAutosize>
              <span className="textAreaLimit">
                [ Max-Characters:{noOfChar} ]
              </span>
            </div>
          </div>
        </div>

        <div className="postFoot createConfFeedPostFoot">
          <div className="recaptchaFeed feed w-100">
            <div className="selectNpostBtnCont">
              <div className="shareIconAndUpImgCont">
                <div className="wrapperBtnsImages">
                  {/* Upload images cont */}
                  <div
                    className={`cstmUploadFileCont feedPage ${
                      base64Src.length > 0 ? "feedMb15" : ""
                    }`}
                  >
                    <div className="uploadImgFeedCont">
                      <label
                        htmlFor="uploadImages"
                        className="uploadImgWrapper"
                      >
                        <Image
                          src="/images/uploadImages.svg"
                          alt="uploadImages"
                          className="mr-0"
                          width={20}
                          height={20}
                        />
                      </label>
                      <input
                        type="file"
                        className="form-control-file"
                        id="uploadImages"
                        accept=".jpg, jpeg, .gif, .png"
                        name="images"
                        onChange={(e) => {
                          toBase64(e, true);
                        }}
                      />
                    </div>
                  </div>
                  {/* Upload images cont */}

                  {/* End of upload images preview container for web */}
                  {base64Src.length > 0 && (
                    <div className="createPostImgPrev feed">
                      <div className="form-group imgPreviewCont feed">
                        <div className="imgContForPreviewImg feed">
                          {base64Src.map((elem, index) => {
                            return (
                              <span
                                className="uploadeImgWrapper feed"
                                key={"imgPreviewCont9" + index}
                                value={index}
                                onClick={() => {
                                  removeImg(index);
                                }}
                              >
                                <Image
                                  src={elem.toString()}
                                  alt=""
                                  className="previewImg"
                                  fill={true}
                                />
                                <Image
                                  src="/images/removeImgIcon.png"
                                  alt="removeImgIcon"
                                  className="removeImgIcon"
                                  type="button"
                                  width={20}
                                  height={20}
                                />
                              </span>
                            );
                          })}

                          {isImgLoading && (
                            <div className="imgLoader feed">
                              <div
                                className="spinner-border pColor imgLoaderInner"
                                role="status"
                              >
                                <span className="sr-only">Loading...</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* End of upload images preview container for web */}
                </div>
              </div>

              {/* error view in mobile */}
              <div className="w-100 errorFieldsCPost p-0 text-center d-block d-md-none">
                <div
                  className={`responseCont mt-0 ${
                    errorOrSuccess ? "text-success" : "text-danger"
                  }`}
                  id="responseCont"
                ></div>
              </div>
              {/* error view in mobile */}

              {/* Select cat.. and post btns cont */}
              <div className="feedSPbtnsWrapper">
                <div className="form-group createPostInputs createInputSelect mb-0">
                  <select
                    className="form-control"
                    onChange={(e) => setSelectedCat(e.target.value)}
                    id="selectedCategory"
                    defaultValue={selectedCat}
                    name="category"
                  >
                    <option value={""}>Select Category </option>

                    {/* ADDS CATEGORIES TO THE SELECT BOX AS OPTIONS */}
                    {categories ? (
                      categories.map((element) => {
                        if (element?.is_confession !== 1) return;
                        return (
                          <option
                            key={`createPost ${element.id}`}
                            value={element.id}
                          >
                            {element.category_name.charAt(0) +
                              element.category_name.slice(1).toLowerCase()}
                          </option>
                        );
                      })
                    ) : (
                      <option value="">Categories not found</option>
                    )}
                    {/* END OF ADDS CATEGORIES TO THE SELECT BOX AS OPTIONS */}
                  </select>
                  <Image
                    src="/images/downArrow.png"
                    alt="downArrow"
                    type="button"
                    onClick={openSelect}
                    width={5}
                    height={23}
                  />
                  <span
                    className="d-block errorCont text-danger"
                    id="catErrorCont"
                  ></span>
                </div>

                <div
                  className="doPostBtn"
                  type="button"
                  id="postConfessionBtn"
                  onClick={() => {
                    if (isLoading === false) postConfession();
                  }}
                >
                  <div className="">
                    {isLoading === true ? (
                      <div
                        className="spinner-border whiteSpinner  spinnerSizeFeed"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      "Post"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error view in Web */}
          <div className="d-none d-md-block w-100 errorFieldsCPost p-0">
            <div
              className={`responseCont mt-0 ${
                errorOrSuccess ? "text-success" : "text-danger"
              }`}
              id="responseCont"
            ></div>
          </div>
          {/* Error view in Web */}
        </div>
      </div>
      {/* POST MAIN CONT START */}

      {confessionsLoading ? (
        <Loader size="sm" className="mx-auto" />
      ) : noConfessionsInCategory ? (
        <h5 className="endListMessage noConfessions mx-auto">
          No Confessions found in this category
        </h5>
      ) : (
        <InfiniteScroll
          scrollThreshold="80%"
          endMessage={
            <div className=" text-center endListMessage mt-4 pb-3">
              End of Confessions
            </div>
          }
          dataLength={confessions.length}
          next={fetchMoreData}
          hasMore={confessions.length < confessionRed?.count}
          loader={
            <div className="text-center w-100">
              <div className="spinner-border pColor text-center" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          }
        >
          {confessions.map((post, index) => {
            return (
              <div key={`fConf${index}`}>
                <Post
                  userDetails={userDetails}
                  key={`fConf${index}`}
                  post={{ ...post, index, dispatch }}
                />

                {/* {((index + 1) % showAdsAfter_Feed === 0) &&
              <div className="mb-4">
                {envConfig?.isProdMode ? <AdSense_ /> :
                  <AdMob mainContId={`adIndex${index}`} setAddSlots={setAdSlots} slots={adSlots} />}
              </div>
            } */}
              </div>
            );
          })}
        </InfiniteScroll>
      )}
      {/* PRIVACY MODAL */}
      <PrivacyModal
        privacyModal={privacyModal}
        acceptPrivacy={acceptPrivacy}
        handlePrivacyModal={handlePrivacyModal}
        openFeatures={openFeaturesDelay}
      />
      {/* PRIVACY MODAL */}
      {isWindowPresent()
        ? document.querySelector("#description") &&
          document.querySelector("#description").value !== "" &&
          postAlertReducer.visible === true && (
            <>
              <PostAlertModal
                data={{
                  feed: {
                    selectedCat,
                    description: document.querySelector("#description").value,
                  },
                }}
                postConfession={postConfession}
              />
            </>
          )
        : null}
    </>
  );
}

Home.additionalProps = {
  containsSideAd: true,
};

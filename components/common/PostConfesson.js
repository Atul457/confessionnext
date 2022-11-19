import Image from 'next/image'
import React from 'react'

const PostConfesson = () => {
    return (
        <>
            {/* POST MAIN CONT START */}
            <div className="postCont hideBoxShadow">
                <div className="doCommentContHeader container-fluid">
                    <div className="doCommentTitle">
                        Share your true feelings. Or your Confessions.
                        Safely connect with like minds. Get answers to questions.
                        You are Anonymous
                    </div>
                    <div className="confessImgContInCaptha">
                        <Image src="/images/confessionBanner.png" alt="confessionBanner" />
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
                            <span className="textAreaLimit">[ Max-Characters:{noOfChar} ]</span>
                        </div>
                    </div>
                </div>

                <div className="postFoot createConfFeedPostFoot">
                    <div className="recaptchaFeed feed w-100">

                        <div className="selectNpostBtnCont">
                            <div className="shareIconAndUpImgCont">

                                <div className="wrapperBtnsImages">
                                    {/* Upload images cont */}
                                    <div className={`cstmUploadFileCont feedPage ${base64Src.length > 0 ? "feedMb15" : ""}`}>
                                        <div className="uploadImgFeedCont">
                                            <label htmlFor="uploadImages" className="uploadImgWrapper">
                                                <Image src={uploadImages} alt="uploadImages" className='mr-0' />
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control-file"
                                                id="uploadImages"
                                                accept=".jpg, jpeg, .gif, .png"
                                                name="images"
                                                onChange={(e) => { toBase64(e, true) }}
                                            />
                                        </div>
                                    </div>
                                    {/* Upload images cont */}

                                    {/* End of upload images preview container for web */}
                                    {base64Src.length > 0 &&
                                        <div className="createPostImgPrev feed">
                                            <div className="form-group imgPreviewCont feed">
                                                <div className="imgContForPreviewImg feed">
                                                    {base64Src.map((elem, index) => {
                                                        return (<span className="uploadeImgWrapper feed" key={"imgPreviewCont9" + index} value={index} onClick={() => { removeImg(index) }}>
                                                            <Image src={elem.toString()} alt="previewImg" className='previewImg' />
                                                            <Image src={removeImgIcon} alt="removeImgIcon" className='removeImgIcon' type="button" />
                                                        </span>)
                                                    })}

                                                    {isImgLoading &&
                                                        <div className="imgLoader feed">
                                                            <div className="spinner-border pColor imgLoaderInner" role="status">
                                                                <span className="sr-only">Loading...</span>
                                                            </div>
                                                        </div>}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {/* End of upload images preview container for web */}
                                </div>
                            </div>

                            {/* error view in mobile */}
                            <div className="w-100 errorFieldsCPost p-0 text-center d-block d-md-none">
                                <div className={`responseCont mt-0 ${errorOrSuccess ? 'text-success' : 'text-danger'}`} id="responseCont"></div>
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
                                        name="category">
                                        <option value={""}>Select Category </option>

                                        {/* ADDS CATEGORIES TO THE SELECT BOX AS OPTIONS */}
                                        {props.categories ? props.categories.map((element) => {
                                            if (element?.is_confession !== 1) return
                                            return <option key={`createPost ${element.id}`} value={element.id}>{(element.category_name).charAt(0) + (element.category_name).slice(1).toLowerCase()}</option>
                                        }) : <option value="">Categories not found</option>}
                                        {/* END OF ADDS CATEGORIES TO THE SELECT BOX AS OPTIONS */}

                                    </select>
                                    <Image src={downArrowIcon} alt="" type="button" onClick={openSelect} />
                                    <span className="d-block errorCont text-danger" id="catErrorCont"></span>
                                </div>

                                <div className="doPostBtn" type="button" id="postConfessionBtn" onClick={() => {
                                    if (isLoading === false)
                                        postConfession()
                                }}>
                                    <div className="">
                                        {isLoading === true
                                            ?
                                            <div className="spinner-border whiteSpinner  spinnerSizeFeed" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            :
                                            "Post"}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                    {/* Error view in Web */}
                    <div className="d-none d-md-block w-100 errorFieldsCPost p-0">
                        <div className={`responseCont mt-0 ${errorOrSuccess ? 'text-success' : 'text-danger'}`} id="responseCont"></div>
                    </div>
                    {/* Error view in Web */}
                </div>
            </div>
            {/* POST MAIN CONT START */}
        </>
    )
}

export default PostConfesson
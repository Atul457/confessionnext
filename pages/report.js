import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Third party
import TextareaAutosize from 'react-textarea-autosize';
import { useSession } from 'next-auth/react';

// Static data
import reportCategories from "../utils/data/reportCategory.json"

// Yup imports
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Helpers
import { http } from '../utils/http';
import { extValidator } from '../utils/helpers';
import auth from '../utils/auth';
import { layoutTypes } from '../utils/provider';

const { getKeyProfileLoc } = auth


const reportSchema = yup.object().shape({
    email: yup.string().email().required(),
    description: yup.string().required(),
    related_issue: yup.string().required()
});


export default function Report() {

    // Hooks and vars
    const router = useRouter()
    const { data: session } = useSession()
    const history = router.push;
    const { register, formState: { errors }, handleSubmit } = useForm({
        mode: "onChange",
        resolver: yupResolver(reportSchema)
    })
    const [reportReason, setReportReason] = useState(false);
    const [selectedFile, setSelectedFile] = useState('');
    const [submittable, setSubmittable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [errorOrSuccess, setErrorOrSuccess] = useState(true);
    const [base64Src, setBase64Src] = useState([]);
    const [imgPathArr, setImgPathArr] = useState([]);
    const [isImgLoading, setIsImgLoading] = useState(false);
    let noOfChar = 2000;

    let fs = 1024; //SETS THE MAX FILE SIZE THAT CAN BE SENT

    //PREVENTS IMG DATA FROM BEING SENT EMPTY
    useEffect(() => {
        setSubmittable(true);
    }, [selectedFile])

    useEffect(() => {
        setReportReason(reportCategories);
    }, [])


    const preventDoubleClick = (runOrNot) => {
        if (document.querySelector('#postReportBtn')) {
            var elem = document.querySelector('#postReportBtn');
            runOrNot === true ? elem.classList.add("ptNull") : elem.classList.remove("ptNull");;
        }
    }


    async function validateFrom(data)     // Validates the form
    {
        preventDoubleClick(true);
        let responseContR = document.getElementById('responseContR'),
            recapToken,
            token

        responseContR.innerHTML = ''

        window.grecaptcha.ready(() => {
            window.grecaptcha.execute("6LcFvPEfAAAAAL7pDU8PGSIvTJfysBDrXlBRMWgt", { action: 'submit' }).then(token => {
                recapToken = token;
                executePostConfession();
            });
        });

        const executePostConfession = async () => {

            token = session ? (!getKeyProfileLoc("token") ? recapToken : getKeyProfileLoc("token")) : recapToken;
            setIsLoading(true);

            let createReportArr = {
                ...data,
                "message": data.description,
                "code": token,
                "image": JSON.stringify(imgPathArr),
            };


            let obj = {
                data: createReportArr,
                token: session ? token : "",
                method: "post",
                url: "postcomplains"
            }

            try {
                const res = await http(obj)
                if (res.data.status === true) {
                    setErrorOrSuccess(true);
                    responseContR.innerHTML = res.data.message;
                    setTimeout(() => {
                        history("/");
                    }, 2000);
                } else {
                    setErrorOrSuccess(false);
                    responseContR.innerHTML = res.data.message;
                }
                setIsLoading(false);
            } catch {
                setErrorOrSuccess(false);
                setIsLoading(false);
                responseContR.innerHTML = "Server Error, Please try again after some time...";
            }

            preventDoubleClick(false);

        }
    }


    //in progress
    const toBase64 = (e) => {

        let responseCont = document.getElementById('capthaErrorContR');
        responseCont.innerText = "";

        if (e.target.files[0]) {

            let fileObj;
            fileObj = e.target.files[0];

            //PREVENTS UNSPECIFIED EXTENSION FILESS
            if (!extValidator(fileObj)) {
                setErrorOrSuccess(prevState => !prevState === false && !prevState);
                responseCont.innerText = "Supported file types are gif, jpg, jpeg, png";
                return false;
            }

            setIsImgLoading(true);
            setSubmittable(false);

            let responseContR = document.getElementById('responseContR');
            let fileSize = parseInt(e.target.files[0].size / 2000);
            responseContR.innerHTML = '';

            if (fileSize > fs) {
                responseContR.innerHTML = '[Max FileSize: 2000KB], No file selected';
                setIsImgLoading(false);
                setSelectedFile('');
                setErrorOrSuccess(false);
                setSubmittable(true);
                return false;
            }
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
                    "image": base64String,
                    folder: "misc"
                };


                let obj = {
                    data: data,
                    token: "",
                    method: "post",
                    url: "uploadimage"
                }
                try {
                    const res = await http(obj)
                    if (res.data.status === true) {
                        let arr = imgPathArr;
                        arr.push(res.data.imagepath);
                        setImgPathArr(arr);
                        setIsImgLoading(false);
                        setSubmittable(true);
                    } else {
                        setIsImgLoading(false);
                        setSubmittable(true);
                    }
                } catch {
                    console.log("Some error occured");
                }
            };
            reader.readAsDataURL(file);
        }
    };
    //in progress

    // REMOVE UPLOADED IMAGE
    const removeImg = (indexToBeRemoved) => {
        setSubmittable(false);

        let base64SrcArr = base64Src.filter((elem, index) => {
            return index !== indexToBeRemoved && elem
        })

        let imgPathArrN = imgPathArr.filter((elem, index) => {
            return index !== indexToBeRemoved && elem
        })

        setBase64Src(base64SrcArr);
        setImgPathArr(imgPathArrN);

        setTimeout(() => {
            setSubmittable(true);
        }, 1200);
    }

    return (
        <div className="container-fluid report">
            <div className="row outerContWrapper">


                <form
                    className="col-12 p-0 m-0 bg-white createPostOuterCont"
                    onSubmit={handleSubmit(validateFrom)}
                >
                    <div className="container py-md-4 p-3 preventFooter">

                        <div className="row py-0 py-md-2 ">
                            <div className="col-12 createPostLogoCont">
                                <div className="createPostLeftHead">
                                    Report a problem or bug
                                </div>
                                <img src="/images/contactUsLogo.svg" alt="contactUsLogo" />
                            </div>
                        </div>

                        <div className="row py-0 py-md-2 createPostBoxShadow boxShadow">
                            <div className="uploadImgNPostCont">
                                <div className="writePostCreatePostTxt">
                                    <TextareaAutosize
                                        className="form-control createPostTextArea pt-3"
                                        {...register("description")}
                                        minRows="5"
                                        maxLength={noOfChar}>
                                    </TextareaAutosize>
                                </div>


                                <div className="cstmUploadFileCont">
                                    <label htmlFor="uploadReportImages" className="uploadImgWrapper">
                                        <img src="/images/uploadImages.png" alt="uploadImages" />
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control-file"
                                        id="uploadReportImages"
                                        name="images"
                                        accept=".jpeg, .png, .jpg, .gif"
                                        onChange={(e) => { toBase64(e) }}
                                    />
                                    <label htmlFor="uploadReportImages" className="createPostLabels cp">Upload Image</label>
                                </div>
                            </div>

                            <div className="maxCharCreatePost max_chars_desc_cont">
                                <span className="textAreaLimit">
                                    [ Max-Characters:{noOfChar} ]
                                </span>

                                <div className="errors_cont_report">
                                    {
                                        errors && errors?.description?.message !== ""
                                        &&
                                        <span className="d-block errorCont text-danger mt-0">
                                            {errors?.description?.message.replace("description", "Report/Bug")}
                                        </span>
                                    }
                                    {
                                        errors && errors?.related_issue?.message !== ""
                                        &&
                                        <span className="d-block errorCont text-danger mt-0">
                                            {errors?.related_issue?.message.replace("related_issue", "Related problem")}
                                        </span>
                                    }
                                </div>
                            </div>


                            <div className="imgNerrorWrapper">

                                {/* UPLOAD IMAGES MOBILE PREVIEW CONTAINER */}
                                {base64Src.length > 0 &&
                                    <div className="createPostImgPrev mobileView">
                                        <div className="form-group imgPreviewCont">
                                            <div className="imgContForPreviewImg">
                                                {base64Src.map((elem, index) => {
                                                    return (<span className="uploadeImgWrapper" key={"imgPreviewCont9" + index} value={index} onClick={() => { removeImg(index) }}>
                                                        <img src={elem.toString()} alt="uploaded image" className='previewImg' />
                                                        <img src="/images/removeImgIcon.png" alt="removeImgIcon" className='removeImgIcon' type="button" />
                                                    </span>)
                                                })}

                                                {isImgLoading &&
                                                    <div className="imgLoader">
                                                        <div className="spinner-border pColor imgLoaderInner" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </div>}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {/* END OF UPLOAD IMAGES MOBILE PREVIEW CONTAINER */}


                                <div className="w-100 mt-0 errorFieldsCPost">
                                    <div className={`responseCont mt-0 ${errorOrSuccess ? 'text-success' : 'text-danger'}`} id="responseContR"></div>
                                    <span className="d-block errorCont text-danger text-center" id="capthaErrorContR"></span>
                                </div>
                            </div>




                            <div className="rightCreatePostUpperCont">
                                <div className="container-fluid rightMainCreatePostFormCont px-0">

                                    <div className="head">

                                        <div className="report_email_input_cont">
                                            <input
                                                className='form-control report_email_input'
                                                placeholder='Email'
                                                readOnly={getKeyProfileLoc("email") ? true : false}
                                                defaultValue={(getKeyProfileLoc("email") === false || !getKeyProfileLoc("email")) ? "" : getKeyProfileLoc("email")}
                                                {...register("email")}
                                                type="email" />
                                            {
                                                errors && errors?.email?.message !== ""
                                                &&
                                                <span className="d-block errorCont text-danger mt-0" id="reportErrorCont">
                                                    {errors?.email?.message}
                                                </span>
                                            }
                                        </div>

                                        <div className='exceptRecap'>

                                            <div className="createPostInputs exceptRecapFields selectCategory">
                                                <select
                                                    className="form-control report"
                                                    {...register("related_issue")}>
                                                    <option value="">Select related problem</option>

                                                    {/* ADDS REPORT REASONS TO THE SELECT BOX AS OPTIONS */}
                                                    {reportReason ? reportReason.map((element) => {
                                                        return <option
                                                            className="text-capitalize"
                                                            key={`report${element.id}`}
                                                            value={element.name}>
                                                            {element.name}
                                                        </option>
                                                    }) : <option value="">Categories not found</option>}
                                                    {/* END OF REPORT REASONS TO THE SELECT BOX AS OPTIONS */}

                                                </select>
                                                <img src="/images/downArrow.png" alt="downArrow" />
                                            </div>

                                            <button
                                                id="postReportBtn"
                                                disabled={!submittable}
                                                type="submit"
                                                className="btn doPostBtn exceptRecapFields report">
                                                {isLoading ? <div className="spinnerSizePost spinner-border text-white" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div> : "Register Complaint"}</button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* UPLOADED IMAGES */}
                        {
                            base64Src.length > 0 &&
                            <div className="createPostImgPrev">
                                <div className="form-group imgPreviewCont">
                                    <div className="imgContForPreviewImg">
                                        {base64Src.map((elem, index) => {
                                            return (
                                                <span className="uploadeImgWrapper" key={"imgPreviewCont9" + index} value={index} onClick={() => { removeImg(index) }}>
                                                    <img src={elem.toString()} alt="uploaded image" className='previewImg' />
                                                    <img src="/images/removeImgIcon.png" alt="removeImgIcon" className='removeImgIcon' type="button" />
                                                </span>)
                                        })}

                                        {isImgLoading &&
                                            <div className="imgLoader">
                                                <div className="spinner-border pColor imgLoaderInner" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div>}
                                    </div>
                                </div>
                            </div>
                        }
                        {/* UPLOADED IMAGES */}

                    </div>
                </form>
            </div>
        </div>
    );
}


Report.additionalProps = {
    meta: {
        title: "Contact us"
    },
    layout: layoutTypes.blank
}
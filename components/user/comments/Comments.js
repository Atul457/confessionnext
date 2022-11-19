
import React, { useRef, useState, useEffect } from 'react';
// import auth from '../../behindScenes/Auth/AuthCheck';
import TextareaAutosize from 'react-textarea-autosize';
// import dateConverter from '../../../helpers/dateConverter'SubComments
// import SubComments from './SubComments';
import { useDispatch, useSelector } from 'react-redux';
import { setCommentField, setUpdateFieldCModal, updateCModalState } from '../../../redux/actions/commentsModal';
// import { getToken } from '../../../helpers/getToken';
import _ from 'lodash';
import { toggleReportComModal } from "../../../redux/actions/reportcommentModal"
import { closeCModal } from "../../../redux/actions/commentsModal"
// import { getKeyProfileLoc, updateKeyProfileLoc } from '../../../helpers/profileHelper';
// import Badge from '../../../common/components/badges/Badge';
// import { profileLinkToVisit } from '../../../helpers/helpers';
import Link from 'next/link';
import { http } from '../../../utils/http';
import auth from '../../../utils/auth';
import { dateConverter } from '../../../utils/helpers';
import SubComments from './SubComments';
import Badge from '../../common/Badge';
import { profileLinkToVisit } from '../../../utils/navigation';
import useFeaturesModal from '../../../utils/hooks/useFeaturesModal';


export default function Comments(props) {

    let SLOMT = 3; // SHOW LATEST ON COMMENTS MORE THAN
    const { authCheck, getToken, getKeyProfileLoc, updateKeyProfileLoc } = auth
    const [userDetails] = useState(authCheck() ? JSON.parse(localStorage.getItem("userDetails")) : '');
    const [editedComment, setEditedComment] = useState("");
    const [requiredError, setRequiredError] = useState({ updateError: '', replyError: '' });
    const editCommentField = useRef(null);
    const comment = props?.comment ?? {}
    const dispatch = useDispatch();
    const [subComments, setSubComments] = useState({ data: [], loading: false })
    const commentsModalReducer = useSelector(state => state.commentsModalReducer);
    const [showSubComments, setShowSubComments] = useState(() => {
        return getShowSubComments()
    })

    useEffect(() => {
        if (commentsModalReducer.updateField.comment_id === props.commentId) {
            editCommentField.current.focus();
        }
    }, [commentsModalReducer.updateField.comment_id])

    useEffect(() => {
        if (commentsModalReducer.commentField.comment_id === props.commentId) {
            let ref = document.querySelector(`#textarea${props.commentId}`)
            ref.focus();
        }
    }, [commentsModalReducer.commentField.comment_id])


    // ON CLICKING THE DIV TO EXPAND THE SUB COMMENTS THIS WORKS
    useEffect(() => {
        if (showSubComments.isBeingExpanded === true) {
            commentsOnCconfession({})
        }
    }, [showSubComments.isBeingExpanded])


    useEffect(() => {
        if (showSubComments.present === true && showSubComments.show === true) {
            commentsOnCconfession({ fetchOnLoad: true })
        }
    }, [])


    const setComment = () => {
        if (requiredError.updateError !== '')
            setRequiredError({ ...requiredError, updateError: "" });
        dispatch(setCommentField({ id: "" }));
        dispatch(setUpdateFieldCModal({ comment_id: props.commentId }));
        setEditedComment(props.postedComment);
    }


    const updateComment = () => {

        let commentData;
        commentData = {
            comment_id: props.commentId,
            comment: editedComment
        }

        if (editedComment.trim() === "") {
            setRequiredError({ ...requiredError, updateError: "This field is required" });
        } else {
            setRequiredError({ ...requiredError, updateError: "" });
            props.updateComment(commentData);
            dispatch(setUpdateFieldCModal({ comment_id: "" }));
        }

    }


    // APPENDS THE NEW COMMENT TO THE SUBCOMMENTS LIST
    const addNewSubComment = (newSubComment) => {
        setSubComments({ ...subComments, data: [...subComments.data, newSubComment] })
    }


    // DELETES THE ELEMENTS FROM SUBCOMMENTS ARR
    const deleteSubComment = (arrayOfNodesIndexes) => {
        let originalArray = [], delCommentCount, data;
        originalArray.push(...subComments.data);
        arrayOfNodesIndexes.forEach(curr => { originalArray.splice(curr, 1) });
        delCommentCount = arrayOfNodesIndexes.length;
        setSubComments({ ...subComments, data: [...originalArray] });

        // UPDATES THE COMMENTSGOTMODAL COMMENT COUNT
        data = { no_of_comments: parseInt(commentsModalReducer.state.no_of_comments) - delCommentCount };
        props.updatePost(data)
        // dispatch(updateCModalState(data));
    }

    const updateSingleCommentData = (data, index) => {
        let updatedNode, originalArray;
        originalArray = [...subComments?.data];
        updatedNode = { ...updatedNode, ...subComments?.data[index], ...data };
        originalArray.splice(index, 1, updatedNode);
        setSubComments({
            ...subComments,
            data: [...originalArray]
        })
    }


    // CALLS HANDLESUBCOMMENT TO POST AND ADD A NEW COMMENT
    const updatSubComments = (comment_id, editedComment, index) => {
        // props.updatePost
        sendSubComment(comment_id, editedComment, index)
    }


    // POSTS THE NEW COMMENT/ OR THE COMMENT TO BE UPDATED, AND UPDATES THE SUB COMMENTS ARR TO
    const handleSubComment = async (comment_id = false, editedComment = "", index) => {

        var commentData, ref, obj, token, _comment;
        if (comment_id === false)       //NEW COMMENT
        {
            if (requiredError.replyError !== '')
                setRequiredError({ ...requiredError, replyError: '' });

            ref = document.querySelector(`#textarea${props.commentId}`);

            if (ref.value.trim() === "") {
                return setRequiredError({ ...requiredError, replyError: "This field is required" });
            }
            _comment = ref.value;

            commentData = {
                confession_id: props.postId,
                comment: _comment,
                parent_id: props.commentId,
                root_id: props.commentId
            }

        }
        else      //UPDATE COMMENT
        {
            commentData = {
                confession_id: props.postId,
                comment_id,
                comment: editedComment,
            }
            dispatch(setUpdateFieldCModal({ comment_id: "" }));
        }

        token = getToken();
        obj = {
            data: commentData,
            token: token,
            method: "post",
            url: "postcomment"
        }

        try {
            const response = await http(obj)
            props.updateSingleCommentData({ countChild: props.countChild + 1 }, props.index);
            if (response.data.status === true) {

                updateKeyProfileLoc("comments", parseInt(getKeyProfileLoc("comments") ?? 0) + 1)

                // NEW COMMENT
                if (comment_id === false) {
                    let data;
                    ref.value = ""
                    data = { no_of_comments: commentsModalReducer.state.no_of_comments + 1 };
                    dispatch(updateCModalState(data))
                    props.updatePost(data)
                    dispatch(setCommentField({ id: "" }));

                    if (showSubComments.isBeingExpanded === true || showSubComments?.keepOpened === true || subComments.data.length < SLOMT) {
                        setShowSubComments({ ...showSubComments, keepOpened: true });
                        return setSubComments({ ...subComments, data: [...subComments.data, response.data.comment] })
                    }

                    props.updateSingleCommentData({ countChild: props.countChild + 1 }, props.index)
                }

                // UPDATING THE SUB COMMENTS ARRAY
                if (comment_id) {
                    let arr, updatedNode;
                    arr = subComments.data;
                    updatedNode = arr[index];
                    updatedNode = response.data.comment
                    arr[index] = updatedNode;
                    setSubComments({ ...subComments, data: arr });
                }

            } else {
                setRequiredError({ ...requiredError, replyError: response.data.message });
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const sendSubComment = _.debounce(handleSubComment, 500);

    function getShowSubComments() {
        let countChild = props.countChild;
        if (countChild && countChild > SLOMT)
            return {
                present: true,
                show: false,
                isShown: false,
                isBeingExpanded: false
            }
        if (countChild && countChild <= SLOMT)
            return {
                present: true,
                show: true,
                isShown: false,
                isBeingExpanded: false
            }
        if (countChild === 0)
            return {
                present: false,
                show: false,
                isShown: false,
                isBeingExpanded: false
            }

        return {
            present: false,
            show: false,
            isShown: false,
            isBeingExpanded: false
        }
    }


    async function commentsOnCconfession({ page = 1, append = false, fetchOnLoad = false }) {

        let pageNo = page;
        let commentId = props.commentId;
        let token;

        if (fetchOnLoad === true)
            setShowSubComments({ ...showSubComments, isShown: true })

        setSubComments({ ...subComments, loading: true });

        if (auth()) {
            token = localStorage.getItem("userDetails");
            token = JSON.parse(token);
            token = token.token;
        } else {
            token = "";
        }

        let data = {
            "confession_id": props.postId,
            "page": pageNo,
            "root_id": commentId
        }


        let obj = {
            data: data,
            token: token,
            method: "post",
            url: "getcomments"
        }
        try {
            const res = await http(obj)
            if (res.data.status === true) {
                return setSubComments({ loading: false, data: res.data.body.comments })
            } else {
                console.log(res);
            }
            setSubComments({ ...subComments, loading: false })
        } catch (err) {
            setSubComments({ ...subComments, loading: false })
            console.log(err);
        }
    }

    // SUBMITS THE DATA ON ENTER AND CREATES A NEW PARA ON SHIFT+ENTER KEY
    const checkKeyPressed = (event, comment) => {
        if (window.innerWidth > 767) {
            if (event.keyCode === 13 && !event.shiftKey) {
                event.preventDefault();
                if (comment === 0) {
                    return updateComment();
                } else {
                    sendSubComment();
                }
            }
        }
    }


    // DELETES THE COMMENT
    const deleteCommentFunc = async () => {


        let confessionId = props.postId;
        let commentId = props.commentId;

        // return props.updateComments(commentId, 1);
        let obj = {
            data: {},
            token: userDetails.token,
            method: "get",
            url: `deletecomment/${confessionId}/${commentId}`,
        }

        try {
            const res = await http(obj)
            if (res.data.status === true) {
                return window.location.href = window.location.href
                let delCommentCount = 1;
                // DECRESES WITH THE COUNT OF ITS CHILD AND 1, WHICH IS IT ITSELF
                if (props.countChild > 0)
                    delCommentCount = props.countChild + 1;
                props.updateComments(commentId, delCommentCount);
            }
        } catch (error) {
            console.log(error);
        }
    }


    // Handles comment box
    const handleCommentBox = () => {

        if (requiredError.replyError !== '')
            setRequiredError({ ...requiredError, replyError: "" });

        if (commentsModalReducer.updateField.comment_id === props.commentId)
            dispatch(setUpdateFieldCModal({ comment_id: "" }));

        if (props.commentId === commentsModalReducer.commentField.comment_id) {
            return dispatch(setCommentField({ id: "" }));
        }

        dispatch(setCommentField({ id: props.commentId }));
    }

    const openSubComments = () => {
        setShowSubComments({ ...showSubComments, isBeingExpanded: true, isShown: true })
    }



    // Open the modal to report the comment
    const openReportCommModal = () => {
        dispatch(toggleReportComModal({
            visible: true,
            isReported: props.isReported,
            data: {
                confessionId: props.postId,
                commentId: props.commentId,
                mutateCommentsFn: props?.mutateCommentsFn,
                comment_index: props?.index
            }
        }))
        dispatch(closeCModal())
    }

    return (
        <div className={`overWritePostWithCommentWr comments`}>
            {!props.isLastIndex
                ?
                <i className="fa fa-arrow-circle-o-right connector" aria-hidden="true"></i>
                :
                <div className='overLap'>
                    <i className="fa fa-arrow-circle-o-right connector" aria-hidden="true"></i>
                </div>
            }

            <div className="postCont overWritePostWithComment outer">
                <div className="commentsContHeader">
                    <div className="postContHeader">
                        <span className="commentsGotProfileImg">
                            <img src={props.imgUrl === "" ? userIcon : props.imgUrl} alt="" />
                            {comment?.email_verified === 1 ?
                                <img src={verifiedIcon} title="Verified user" alt="verified_user_icon" className='verified_user_icon' /> : null}
                        </span>

                        {props.curid !== false ?

                            (<Link className={`textDecNon comment cutDown`}
                                to={profileLinkToVisit(comment)}>
                                <span className="userName">
                                    {props.userName}
                                </span>
                            </Link>)
                            :
                            (<>
                                <span className="userName">
                                    {props.userName}
                                </span>
                            </>)}

                        <Badge points={comment?.points} classlist="ml-2" />

                        <span className="postCreatedTime">
                            {dateConverter(props.created_at)}
                        </span>
                    </div>


                    <div className='editDelComment'>
                        {props.is_editable === 1 ?
                            <>
                                <i className="fa fa-trash deleteCommentIcon" type="button" aria-hidden="true" onClick={deleteCommentFunc}></i>
                                {commentsModalReducer.updateField.comment_id !== props.commentId ? <img src={editCommentIcon} className='editCommentIcon' onClick={setComment} /> : ''}
                                {(auth() && props.isReported !== 2) ? <i
                                    className="fa fa-exclamation-circle reportComIcon"
                                    aria-hidden="true"
                                    onClick={openReportCommModal}></i> : null}
                            </> :
                            (auth() && props.isReported !== 2) ? <i
                                className="fa fa-exclamation-circle reportComIcon"
                                aria-hidden="true"
                                onClick={openReportCommModal}></i> : null
                        }
                    </div>

                </div>
                <div className="postBody">
                    <div className="postedPost mb-0">
                        {comment?.is_edited === 1 ? <i className="fa fa-pencil pr-2" aria-hidden="true"></i> : null}
                        <pre className="preToNormal">
                            {commentsModalReducer.updateField.comment_id !== props.commentId && props.postedComment}
                            {commentsModalReducer.updateField.comment_id === props.commentId &&
                                <>
                                    <div className="container-fluid inputWithForwardCont">
                                        <div className="inputToAddComment textAreaToComment">
                                            <TextareaAutosize
                                                type="text"
                                                ref={editCommentField}
                                                // value={editedComment}
                                                defaultValue={editedComment}
                                                onKeyDown={(e) => checkKeyPressed(e, 0)}
                                                maxLength="2000"
                                                onChange={(e) => { setEditedComment(e.target.value) }}
                                                className="form-control my-1">
                                            </TextareaAutosize>
                                        </div>
                                        <div className="arrowToAddComment" type="button">
                                            <img src={forwardIcon} className="forwardIconContImg" onClick={updateComment} />
                                        </div>
                                    </div>
                                    {requiredError.updateError !== '' ? <span className="d-block errorCont text-danger mb-2 moveUp">{requiredError.updateError}</span> : ''}
                                </>
                            }
                        </pre>

                        {auth() &&
                            <div className="replyCont">
                                <span onClick={() => handleCommentBox()}>
                                    <img src={commentReplyIcon} alt="" className='replyIcon' />
                                    <span className='pl-2'>Reply</span>
                                </span>

                                {commentsModalReducer.commentField.comment_id === props.commentId &&
                                    <>
                                        <div className='inputToAddSubComment textAreaToComment mt-md-2'>
                                            <TextareaAutosize
                                                type="text"
                                                maxLength="2000"
                                                id={"textarea" + props.commentId}
                                                placeholder='Write your reply'
                                                onKeyDown={(e) => checkKeyPressed(e, 1)}
                                                className="form-control mt-0">
                                            </TextareaAutosize>

                                            <div
                                                className="arrowToAddComment mt-0"
                                                type="button"
                                                onClick={() => handleSubComment()}
                                            >
                                                <img src={forwardIcon} alt="" className="forwardIconContImg" />
                                            </div>
                                        </div>
                                        {requiredError.replyError !== "" ? <span className="d-block errorCont text-danger mb-2 mt-2 moveUp">{requiredError.replyError}</span> : null}
                                    </>
                                }
                            </div>}
                    </div>
                </div>
            </div>

            {/* IF SUB_COMMENTS PRESENT THEN EXECUTE THE NEXT CONDITION,
            IF THEY ARE NOT SHOW THEN SHOW THE LATEST COMMENT,
            ELSE SHOW ALL THE COMMENTS */}

            {showSubComments.present &&
                showSubComments.isShown === false ?
                <div className="postCont overWritePostWithComment subcommentCont upperView" onClick={openSubComments}>
                    <div className="postContHeader commentsContHeader">
                        <span className="commentsGotProfileImg">
                            <img src={props.imgUrl === "" ? userIcon : props.imgUrl} alt="" />
                            {comment?.email_verified === 1 ?
                                <img src={verifiedIcon} title="Verified user" alt="verified_user_icon" className='verified_user_icon' /> : null}
                        </span>
                        <span className="userName">
                            Dummy name
                        </span>
                        <span className="postCreatedTime">
                            {dateConverter(props.created_at)}
                        </span>
                        <span className='subCommentsCount'>
                            {props.countChild} More Reply
                        </span>
                    </div>
                </div>
                :
                subComments.loading === true ?
                    <div className="w-100 text-center mb-3">
                        <div className="spinner-border pColor" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div> :

                    <div className='subcommentsMainContWrapper'>
                        <div className="subcommentsMainCont">
                            {subComments.data.map((subcomment, index) => {
                                return <SubComments
                                    isReported={subcomment.isReported}
                                    isLastIndex={subComments.data.length === index + 1}
                                    deleteSubComment={deleteSubComment}
                                    addNewSubComment={addNewSubComment}
                                    index={index}
                                    postId={props.postId}
                                    root_id={props.commentId}
                                    key={subcomment.comment_id}
                                    subcomment={subcomment}
                                    data={subcomment}
                                    updateSingleCommentData={updateSingleCommentData}
                                    updatePost={props.updatePost}
                                    updatSubComments={updatSubComments}
                                    subcommentId={subcomment.comment_id} />
                            })}
                        </div>
                    </div>}
        </div>
    )
}
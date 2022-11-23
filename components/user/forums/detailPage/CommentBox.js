import React, { useEffect, useRef } from 'react'

// HelperComps
import { ShowResComponent } from '../../../../utils/ShowResComponent';

// Helpers
import auth from '../../../../utils/auth';
import { apiStatus } from '../../../../utils/api';

// Redux
import { usersToTagAcFn } from '../../../../redux/actions/forumsAc/forumsAc';

const { getKeyProfileLoc } = auth


const CommentBox = props => {

    // Hooks and vars
    const {
        doComment,
        postCommentReducer: { message = "", status, usedById: messageId },
        usedById,
        session,
        isCalledByParent = false,
        toSearch,
        isForUpdateCom = false,
        dispatch,
        usersToTag = {},
        getUsersToTag = () => { }
    } = props,
        // maxChar = 2000,
        textboxref = useRef(null),
        isError = status === apiStatus.REJECTED

    const showMessage = usedById === messageId
    // If both will be undefined and isCalledByParent is same then it means its called by parent
    // else by child
    const showDropDown = (props?.commentBoxId === messageId && isCalledByParent === usersToTag?.isCalledByParent) || (isCalledByParent === usersToTag?.isCalledByParent && props?.commentBoxId === undefined)

    // Functions
    const sendComment = () => {
        doComment(textboxref?.current, isForUpdateCom)
    }


    // Submits the data on enter and creates a new para on shift+enter key
    const checkKeyPressed = (event) => {
        if (window.innerWidth > 767) {
            if (event.keyCode === 13 && !event.shiftKey) {
                event.preventDefault();
                doComment(textboxref?.current, isForUpdateCom)
            }
        }
    }

    const tagUser = (user) => {
        let actualStr, newStr, regex, isUserIdPresent, is_post_as_anonymous, isMyComment, link, htmlToEmbed;

        actualStr = textboxref?.current.innerHTML
        newStr = ""
        regex = new RegExp("@(" + toSearch + "|" + `${toSearch}</div>` + ")$", "i");
        isUserIdPresent = user?.user_id !== "";
        is_post_as_anonymous = user?.post_as_anonymous === 1 && isUserIdPresent;
        isMyComment = isUserIdPresent ? (getKeyProfileLoc("user_id") === user?.user_id) : false

        link = (!is_post_as_anonymous && isUserIdPresent) ?
            (isMyComment ? `/profile` : `${window.location.origin}/userprofile/${user?.user_id?.trim()}`) :
            "#";
        htmlToEmbed = link === "#" ? `<span contenteditable="false" class="tagged_user dr99${user?.user_id?.trim()}" >@${user?.name?.trim()}</span>` : `<a class="text-decoration-none tagged_user dr99${user?.user_id?.trim()}" contenteditable="false" target="_blank" href="${link}">@${user?.name?.trim()}</a>`;


        newStr = actualStr.replace(regex, htmlToEmbed);
        textboxref.current.innerHTML = newStr;

        dispatch(usersToTagAcFn({
            data: [],
            status: apiStatus.IDLE,
            toSearch: ""
        }))
    }

    useEffect(() => {
        const listener = (e) => {
            checkKeyPressed(e)
        }
        const changeListener = (e) => {
            getUsersToTag(e.target.innerText)
        }
        textboxref?.current?.addEventListener("keydown", listener)
        textboxref?.current?.addEventListener("keyup", changeListener)

        return () => {
            textboxref?.current?.removeEventListener("keydown", listener)
            textboxref?.current?.removeEventListener("keyup", changeListener)
        }
    }, [usersToTag])

    useEffect(() => {
        if (!isCalledByParent) textboxref?.current?.focus()
    }, [])

    return (
        <>
            {session &&
                (
                    <>
                        <div className="container-fluid inputWithForwardCont">
                            <div className="textAreaToComment w-100">
                                <div
                                    contentEditable="true"
                                    suppressContentEditableWarning={true}
                                    ref={textboxref}
                                    className="form-control usersBox"
                                    placeholder="Write the sentence you want to.."
                                ></div>
                                {showDropDown && (document.activeElement === textboxref?.current) && usersToTag?.data?.length ?
                                    <div className='users_to_tag_cont cursor_pointer'>
                                        {usersToTag?.data.map((user, index) => {
                                            return <div
                                                key={user?.user_id + `${index}`}
                                                onClick={() => tagUser(user)}
                                                className='user_to_tag'>
                                                {user?.name}
                                            </div>
                                        })}
                                    </div> : null}
                            </div>
                            <div className="arrowToAddComment" id="userPostCommentIcon" type="button" onClick={sendComment}>
                                <img src="/images/forwardIcon.svg" alt="forwardIcon" className="forwardIconContImg" />
                            </div>
                        </div>
                        {showMessage && message && message !== "" &&
                            <ShowResComponent
                                isError={isError}
                                message={message}
                            />}
                    </>
                )
            }
        </>
    )
}

export default CommentBox
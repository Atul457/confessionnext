import React from 'react'

// Third party
import TextareaAutosize from 'react-textarea-autosize';

// Image imports
import forwardIcon from '../../../../images/forwardIcon.svg'


const CommentBoxFCom = props => {

    const { } = props,
        maxChar = 2000

    return (
        <>
            <div className="container-fluid inputWithForwardCont comment_boxs_comment">
                <div className="textAreaToComment w-100">
                    <TextareaAutosize
                        type="text"
                        maxLength={maxChar}
                        row='1'
                        onKeyDown={(e) => { }}
                        onChange={(e) => { }}
                        className="form-control">
                    </TextareaAutosize>
                </div>
                <div className="arrowToAddComment" id="userPostCommentIcon" type="button" onClick={() => { }}>
                    <img src={forwardIcon} alt="" className="forwardIconContImg" />
                </div>
            </div>
            <span className="d-block errorCont text-danger mb-2 moveUp">{""}</span>
        </>
    )
}

export default CommentBoxFCom
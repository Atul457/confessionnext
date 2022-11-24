import React from 'react'
import { dateConverter } from '../../../utils/helpers'
import Badge from "../../common/Badge"


export default function Chatter(props) {

    const friend = props?.user

    const openChat = () => {
        props.openChat({
            friend_id: props.friend_id,
            name: props.chatterName,
            image: props.imgUrl,
            channel_id: props.channel_id,
            is_userreport: props.is_userreport,
            index: props.chatIndex,
            points: friend?.points,
            email_verified: friend?.email_verified,
        });
    }

    const unFriend = () => { if (props.friend_id) props.openUnFriendModal(props.channel_id, props.index) }

    return (
        <div className={`singleChatCont ${props.activeChat ? "openedChat" : ""}`} type="button">
            <div className="imgNopenUserNameWrap">
                <span className="userImageContChatCont" onClick={openChat}>
                    <img src={props.imgUrl} alt="" className="userImageContChat" />
                    {friend?.email_verified === 1 ?
                        <img src="/images/verifiedIcon.svg" title="Verified user" alt="verified_user_icon" className='verified_user_icon' /> : null}
                </span>
                <div className="singleChatterUserName">
                    <div className='wrapper_upperCont'>
                        <div className="upperCont friend_details" onClick={openChat}>
                            <span className="text-capitalize user_name">
                                {props.chatterName}
                            </span>
                            <Badge points={friend?.points} classlist="ml-2" />
                        </div>
                        <i className="fa fa-ellipsis-v showChatArrCont" aria-hidden="true" onClick={unFriend}></i>
                    </div>
                    <div className="lastMessageNtimeWrapper chatter_footer" onClick={openChat}>
                        <div className="chatterUserDesc">
                            {props.chatterDesc}
                        </div>
                        <span className="timeStamp">
                            {dateConverter(props.updated_at)}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    )
}

import React, { useState } from "react";
import { Friend as handleFriend } from "../../../redux/actions/friendDetails/index";
import Badge from "../../common/Badge";

export default function Friend(props) {
  // Hooks and vars
  let history = props?.history ?? (() => {});
  const friend = props?.friend;
  const dispatch = props?.dispatch ?? (() => {});
  const [chat] = useState(() => {
    return {
      name: props.chatterName,
      image: props.imgUrl !== "" ? props.imgUrl : "/images/userAcc.png",
      channel_id: props.channel_id,
      friend_id: props.friend_id,
      is_userreport: props.is_userreport,
    };
  });

  const setChatToOpen = () => {
    dispatch(handleFriend(chat));
    history("/chat");
  };

  return (
    <div className={`requesterDesc boxShadow`} onClick={setChatToOpen}>
      <div className="friendsListProfile d-flex align-items-center w-100">
        <span className="friendRequestsHImgCont">
          <img src={props.imgUrl} alt="" className="friendsProfileImg" />
          {friend?.email_verified === 1 ? (
            <img
              src="/images/verifiedIcon.svg"
              title="Verified user"
              alt="verified_user_icon"
              className="verified_user_icon"
            />
          ) : null}
        </span>
        <div className="infoOfRequesterCont">
          <div className="requesterName requester_name text-capitalize">
            <span>{props.chatterName}</span>
            <Badge points={friend?.points} classlist="ml-2" />
          </div>
          <div className="requesterCountOfSharedConfessions">
            Shared {props.no_of_confessions} confessions
          </div>
        </div>
        <img
          src="/images/rightArrow.png"
          alt="rightArrow"
          className="profileChatArrowImg"
          type="button"
        />
      </div>
    </div>
  );
}

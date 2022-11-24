import React, { useState } from 'react'
import Badge from '../../common/Badge'

export default function Requests(props) {

  const requester = props?.requester ?? {}

  const [showReq, setShowReq] = useState(true);

  const processReq = (decision, requesterid) => {
    if (decision) {
      setShowReq(false);
      props.updateFriendCount(1, requesterid);
    } else {
      setShowReq(false);
      props.updateFriendCount(2, requesterid);
    }
  }

  return (

    <div className={`requesterDesc boxShadow ${!showReq && "d-none"}`}>
      {showReq &&
        <div className="imgNRequesterDesc d-flex align-items-center">
          <span className="friendRequestsHImgCont">
            <img src={props.imgUrl} alt="" className="friendRequestsHImgCont" />
            {requester?.email_verified === 1 ?
              <img src="/images/verifiedIcon.svg" title="Verified user" alt="verified_user_icon" className='verified_user_icon' /> : null}
          </span>
          <div className="infoOfRequesterCont">
            <div className="requesterName requester_name text-capitalize">
              <span>{props.requesterName}</span>
              <Badge points={requester?.points} classlist="ml-2" />
            </div>
            <div className="requesterCountOfSharedConfessions">Shared {props.requestersTotalSharedConf} confessions</div>
          </div>
        </div>}
      {showReq &&
        <div className="acceptOrReject d-flex">
          <img src="/images/acceptRequest.svg" onClick={() => processReq(true, props.request_id)} type="button" alt="" className="friendRequestsHeaderImg" />
          <img src="/images/rejectRequest.svg" onClick={() => processReq(false, props.request_id)} type="button" alt="" className="friendRequestsHeaderImg right" />
        </div>}
    </div>
  )
}

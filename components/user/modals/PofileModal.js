import React from 'react';
import { Modal } from 'react-bootstrap';
import Requests from '../components/Requests';
import userIcon from '../../../images/userAcc.png';
import InfiniteScroll from "react-infinite-scroll-component";
import Friends from '../components/Friends';




const PofileModal = (props) => {

    // console.log({ requests: props.myRequests.requests})

    return (
        <Modal show={props.visible} centered size="xl" onHide={props.hideProfileModal} className="profileModal pl-0">
            <Modal.Body className=" text-left mx-0">
                <div className="postsHeadingProfile mt-0">
                    Friends List
                </div>

                <div className={` ${props.myRequests.count ? "d-md-block" : "d-md-none"}`}>
                    <div className="friendsRequestsMainCont">

                        {((props.myRequests.requests && props.myRequests.requests.length) ? (props.myRequests.requests).map((requester, index) => {
                            return index < props.maxRequestsToshow && (
                                <Requests
                                    requester={requester}
                                    updateFriendCount={props.updateFriendCount}
                                    request_id={requester.request_id}
                                    key={`${index}${requester.image}${requester.name}${requester.no_of_confessions}`}
                                    imgUrl={requester.image === '' ? userIcon : requester.image} requesterName={requester.name}
                                    requestersTotalSharedConf={requester.no_of_confessions} />)
                        }) : null)}

                        {(props.myFriends.isError ?
                            (<div className="alert alert-danger" role="alert">
                                Something went wrong
                            </div>) :
                            (props.myFriends.data.friends.length > 0 &&
                                <>
                                    <div className="profileFriendsCont profileFriendsContModal w-100" id="friendList2">


                                        <InfiniteScroll
                                            scrollableTarget={`friendList2`}
                                            endMessage={<div className="endListMessage mt-4 text-center">
                                                End of FriendList
                                            </div>}
                                            dataLength={props.myFriends.data.count}
                                            next={props.fetchMoreFriends}
                                            hasMore={props.myFriends.data.friends.length < props.myFriends.data.count}
                                            loader={
                                                <div className="text-center mt-2" style={{ zIndex: 0 }}>
                                                    <div className="spinner-border pColor" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            {/* SHOWS ALL FRIENDS */}
                                            {
                                                props.myFriends.isLoading ?
                                                    (<div className="text-center">
                                                        <div className="spinner-border pColor text-center" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </div>) :
                                                    (props.myFriends.isError ?
                                                        (<div className="alert alert-danger" role="alert">
                                                            Something went wrong
                                                        </div>) :
                                                        (props.myFriends.data.friends.length ?
                                                            (props.myFriends.data.friends).map((user, index) => {
                                                                return <Friends
                                                                    updated_at={user.updated_at}
                                                                    key={`${index}${user.imgUrl}${user.name}${user.chatterDesc}`}
                                                                    is_userreport={user.is_userreport}
                                                                    is_online={user.is_online}
                                                                    channel_id={user.channel_id}
                                                                    no_of_confessions={user.no_of_confessions}
                                                                    friend_id={user.friend_id}
                                                                    imgUrl={user.image === '' ? userIcon : user.image}
                                                                    chatterName={user.name} chatterDesc={!user.last_messsage ? "No Messages found" : user.last_messsage} />
                                                            }) : 'No Friends Available')
                                                    )
                                            }
                                        </InfiniteScroll>

                                    </div>
                                </>
                            )
                        )}
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer className="pt-0 justify-content-center">
            </Modal.Footer>
        </Modal>
    )
}

export default PofileModal
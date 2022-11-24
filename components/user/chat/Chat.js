import React, { useState, useEffect, useRef } from 'react';
import Request from "../friends/Request"
import InfiniteScroll from "react-infinite-scroll-component";
import Button from '@restart/ui/esm/Button';
import { Modal } from 'react-bootstrap';;
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import TextareaAutosize from 'react-textarea-autosize';
import Badge from "../../common/Badge"
import { useRouter } from 'next/router';
import Chatter from './Chatter';
import { http } from '../../../utils/http';
import auth from '../../../utils/auth';
import { dateConverter } from '../../../utils/helpers';
import UnFriendModal from '../modals/UnFriendModal';
import { unFriendActionCreators } from '../../../redux/actions/unFriendReqModal';

const { getToken } = auth

export default function Chat() {

    // Hooks and vars
    const router = useRouter()
    const params = router.query;
    const [showFriendsList, setShowFriendsList] = useState(false);
    const dispatch = useDispatch();
    const chatRef = useRef();
    const [toggleView, setToggleView] = useState({
        chat: false,
        requests: false,
        messages: true,
    });
    const [userDetails] = useState(JSON.parse(localStorage.getItem("userDetails")));
    const [typedMessage, setTypedMessage] = useState("");
    const [error, setError] = useState("");
    const [refreshOrNot, setRefreshOrNot] = useState(false);
    const [lastId, setLastId] = useState(false);
    const [messages, setMessages] = useState([]);
    const [goDownArrow, setGoDownArrow] = useState(false);
    const [count, setCount] = useState(0);
    const [chatClosed, setChatClosed] = useState(false);
    const [reportModal, setReportModal] = useState({
        isVisible: false,
        isReported: false,
        isLoading: false,
    })
    const [myRequests, setMyRequests] = useState({
        config: {
            page: 1
        },
        isLoading: true,
        isError: false,
        data: { count: 2, requests: false }
    });

    const [myFriends, setMyFriends] = useState({
        config: {
            token: userDetails.token,
            page: 1
        },
        isLoading: true,
        isError: false,
        data: { count: 0, friends: [] }
    });

    const [chat, setChat] = useState({
        config: {
            token: userDetails.token,
            page: 1
        },
        isLoading: false,
        isError: false,
        isVisible: false,
        noFriends: false,
        data: { messages: [], count: 0 },
    });
    const [chatterDetails, setChatterDetails] = useState({ name: "", image: "" });
    const [check, setCheck] = useState(false);  //CHAT ACTION TOGGLE
    const store = useSelector(state => state.GetFriend);


    // OPENS A CHAT ON THE BASIS OF THE FRIEND CLICKED ON PROFILE COMPONENT
    useEffect(() => {
        if (store.length) {
            let windowWidth = window.innerWidth;
            if (windowWidth < 768) {
                setToggleView({ chat: false, requests: false, messages: true });
            }
            setChatterDetails(store[0]);
            getChat(store[0].channel_id);

            setChat({
                ...chat,
                isVisible: true
            })
            showMessages();
        }

    }, [store])


    useEffect(() => {
        document.querySelector("body").classList.add("bounceOff")
        return () => {
            document.querySelector("body").classList.remove("bounceOff")
        }
    }, [])


    //SHOWS FRIEND REQUESTS
    const getRequests = async () => {
        let data = myRequests.config;

        let obj = {
            data: data,
            token: userDetails.token,
            method: "post",
            url: "getfriendrequests"
        }
        try {
            const res = await http(obj)
            if (res.data.status === true) {
                setMyRequests({
                    ...myRequests,
                    isLoading: false,
                    data: res.data
                });
                localStorage.setItem("requestsCount", res.data.count);
            } else {
                setMyRequests({
                    ...myRequests,
                    isLoading: false
                })
            }
        } catch {
            setMyRequests({
                ...myRequests,
                isLoading: false,
                isError: true
            });
        }
    }

    //SHOWS FRIEND LIST
    const getFriends = async (pageNo = 1, append = false) => {
        let data = {
            page: pageNo === "" ? 1 : pageNo,
        }
        let obj = {
            data: data,
            token: userDetails.token,
            method: "post",
            url: "getfriends"
        }
        try {
            const res = await http(obj)
            if (res.data.status === true) {
                setMyFriends({
                    ...myFriends,
                    isLoading: false,
                    data: {
                        count: res.data.count,
                        friends: append === true ? [...myFriends.data.friends, ...res.data.friends] : res.data.friends,
                    }
                });
            } else {
                setMyFriends({ ...myFriends, isLoading: false });
            }
        } catch {
            setMyFriends({ ...myFriends, isLoading: false, isError: true });
        }
    }


    //REFRESH CHAT
    const refreshChat = async () => {
        let data = {
            channel_id: chatterDetails.channel_id,
            last_id: lastId
        }

        let obj = {
            data: data,
            token: getToken(),
            method: "post",
            url: "refreshchat"
        }
        try {
            const res = await http(obj)
            if (res.data.status === true) {
                if (res.data.messages.length > 0) {
                    setMessages((prevState) => [
                        ...res.data.messages,
                        ...prevState
                    ])

                    setLastId(res.data.last_id);
                }
            }
        } catch {
            console.log("Some error occured");
        }
    }


    // REFRESH CHAT INTERVAL
    useEffect(() => {
        const interval = setInterval(() => {
            if (lastId !== false) {
                refreshChat();
            }
        }, [4000]);
        return () => {
            clearInterval(interval);
        }
    }, [lastId, chatterDetails]);

    const openUnFriendModal = (friend_id, index) => {
        dispatch(
            unFriendActionCreators.updateUnFriendModalState({
                visible: true, data: { friend_id, index }
            })
        );
    }


    // UNFRIEND THE FRIEND
    const unFriend = async (friend_id, index) => {

        dispatch(
            unFriendActionCreators.updateUnFriendModalState({
                visible: false, data: {}
            })
        );

        const friends = [...myFriends.data.friends];
        friends.splice(index, 1);

        setMyFriends({
            ...myFriends,
            data: {
                count: myFriends.data.count - 1,
                friends: friends
            }
        })

        let data = {
            request_id: friend_id,
            status: 3
        }
        setChat({ ...chat, noFriends: true, isVisible: false })
        setChatClosed(true)

        let obj = {
            data: data,
            token: getToken(),
            method: "post",
            url: "updatefriendrequeststatus"
        }

        try {
            await http(obj);
        } catch (err) {
            console.log(err)
        }
    }



    //FIRST TIME GETS REQUESTS, AND FRIEND LIST
    useEffect(() => {
        getRequests();
        getFriends();
    }, [])


    //WORKS ON CLICK REPORT USER OR CLEAR CHAT
    function performAction(clickedOn) {
        if (clickedOn === "clear") {
            clearChat();
        } else if (clickedOn === "report") {
            reportChat();
        }
    }

    //ACCEPTS OR REJECTS REQUEST
    const updateFriendCount = async (status, request_id) => {

        let data = {
            request_id: request_id,
            status: status
        }

        let obj = {
            data: data,
            token: userDetails.token,
            method: "post",
            url: "updatefriendrequeststatus"
        }
        try {
            const res = await http(obj)
            if (res.data.status === true) {
                getFriends();
                getRequests();
            }
        } catch {
            console.log("Some error occured");
        }
    }


    // FETCHES ALL MESSAGES OF THE OPENED CHAT
    const getChat = async (channel_id, pageNo = 1, append = false, scrollToBottom = false, smooth = false) => {

        let data = {
            channel_id: channel_id,
            page: pageNo === "" ? 1 : pageNo,
        }

        let pageNoToSet = pageNo === "" ? 1 : pageNo;

        let obj = {
            data: data,
            token: userDetails.token,
            method: "post",
            url: "getchat"
        }

        try {
            setChat({ ...chat, isLoading: true })
            const res = await http(obj)
            if (res.data.status === true) {
                if (append === true) {
                    setMessages((prevState) => [
                        ...prevState,
                        ...res.data.messages
                    ])
                } else {
                    setMessages(res.data.messages);
                }

                setCount(res.data.count);

                setChat({
                    ...chat,
                    isVisible: true,
                    isLoading: false,
                    config: { token: userDetails.token, page: pageNoToSet },
                });

                if (lastId === false || res.data.last_id !== lastId) {
                    setLastId(res.data.last_id);
                }

                if (scrollToBottom === true) {
                    setTimeout(() => {
                        let ref = document.querySelector('.lastMessage');
                        if (ref) {
                            if (smooth === false) {
                                ref.scrollIntoView();

                            } else {
                                ref.scrollIntoView({ behavior: "smooth" });
                            }
                        }
                    }, 200);
                }

                if (refreshOrNot === false) {
                    setRefreshOrNot(true);
                }
            }
        } catch {
            setChat({
                ...chat,
                isLoading: false,
                isError: true
            })
        }
    }



    //AUTO OPEN CHAT
    useEffect(() => {
        //OPENS CHAT VIA NOTIFICATION LINK
        if (params.chatterId && (myFriends.data.friends).length > 0 && chatterDetails.name === '') {
            var chatterId, userDetailsGot;
            chatterId = parseInt(params.chatterId);
            userDetailsGot = _.find(myFriends.data.friends, { "channel_id": chatterId });
            if (userDetailsGot) {
                openChat(userDetailsGot);
            } else {
                openFirstChat();
            }
        }
        // OPENS THE CHAT ON FIRST FRIEND OF THE FRIEND LIST
        else if ((myFriends.data.friends).length > 0) {
            openFirstChat();
        }
        else if (chat.noFriends === false) {
            // IF HAVE REDIRECTED FROM PROFILE THEN THE MESSAGES BLOCK WILL BE OPENED 
            // ELSE
            // NO FRIENDS WILL BE SHOWN
            if (store.length) { showMessages(); }
            else {
                setChat({ ...chat, isVisible: false, noFriends: true });
                showChat();
            }
        }
    }, [myFriends, chat, chatterDetails])



    // OPENS THE CHAT ON FIRST FRIEND OF THE FRIEND LIST
    const openFirstChat = () => {
        if ((myFriends.data.friends).length > 0 && chatterDetails.name === '') {
            let data = (myFriends.data.friends)[0];
            openChat(data);
        }
        else if ((myFriends.data.friends).length === 0 && myFriends.isLoading === false) {
            setChat({
                ...chat,
                noFriends: true
            })
        }
    }

    const preventDoubleClick = (runOrNot) => {
        var elem = document.querySelector('#sendMessageChat');
        runOrNot === true ? elem.classList.add("ptNull") : elem.classList.remove("ptNull");;
    }

    const scrollToMyRef = () => {
        if (chatRef.current.scrollTop == 0) {
            document.querySelector('.lastMessage').scrollIntoView({ behavior: 'smooth', block: 'end' });
            const ref = document.querySelector('.messagesCont')
            if (ref)
                ref.scrollTop = (ref.scrollTop + 30);
        }
        else {
            const scroll = chatRef.current.scrollHeight - chatRef.current.clientHeight;
            if (chatRef?.current)
                chatRef.current.scrollTo(0, scroll);
        }

    };


    //SEND MESSAGE
    const sendMessage = async () => {
        preventDoubleClick(true);
        let _typedMessage = typedMessage;
        if (typedMessage !== "") {
            let data = {
                channel_id: chatterDetails.channel_id,
                to_id: chatterDetails.friend_id,
                message: _typedMessage
            }

            setTypedMessage("");


            let obj = {
                data: data,
                token: userDetails.token,
                method: "post",
                url: "sendmessage"
            }

            try {
                const res = await http(obj)
                if (res.data.status === true) {

                    setMessages((prevState) => [
                        res.data.message,
                        ...prevState
                    ])

                    scrollToMyRef()
                    setCount((prevState) => prevState + 1);

                    changeMessagesInFriendList(res.data.message);
                } else {
                    if (res.data.refresh === true) window.location.reload(false);
                }
            } catch {
                console.log("Some error occured");
            }

            setTypedMessage("");
        } else {
            setError("Please type something...");
        }
        preventDoubleClick(false);
    }


    // ON SENDING MESSAGE THIS CHANGES THE LAST MESSAGE IN FRIEND LIST SIDEBAR
    const changeMessagesInFriendList = (data) => {
        let newFriendsArray = (myFriends.data.friends).map((current) => {
            if (current.friend_id === data.to_id) {
                let newCurrent = current;
                newCurrent = {
                    ...newCurrent,
                    last_messsage: data.message,
                    updated_at: data.created_at
                }
                return newCurrent;
            } else {
                return current;
            }
        })

        setMyFriends({
            ...myFriends,
            data: {
                count: myFriends.data.count + 1,
                friends: newFriendsArray
            }
        });

    }


    //OPENS CHAT ON CLICK, ON A FRIENDS
    const openChat = (chatterDetGot) => {
        setCheck(false);
        let windowWidth = window.innerWidth;
        if (windowWidth < 768) {
            setToggleView({ chat: false, requests: false, messages: true });
        }

        setChatterDetails({
            ...chatterDetails,
            name: chatterDetGot.name,
            image: chatterDetGot.image !== "" ? chatterDetGot.image : "/images/userAcc.svg",
            channel_id: chatterDetGot.channel_id,
            friend_id: chatterDetGot.friend_id,
            is_userreport: chatterDetGot.is_userreport,
            points: chatterDetGot?.points,
            email_verified: chatterDetGot?.email_verified
        })
        getChat(chatterDetGot.channel_id, 1, false, true);

    }


    // SUBMITS THE DATA ON ENTER AND CREATES A NEW PARA ON SHIFT+ENTER KEY
    const betterCheckKeyPressed = () => {
        var timer;
        return (event) => {
            if (event.keyCode === 13 && !event.shiftKey) {
                event.preventDefault();
                clearInterval(timer);
                timer = setTimeout(() => {
                    sendMessage();
                }, 300);
            }
        }
    }

    const checkKeyPressed = betterCheckKeyPressed();


    // FETCHES MORE CHAT ON SCROLL
    const fetchMoreChat = () => {
        getChat(chatterDetails.channel_id, chat.config.page + 1, true);
    }


    // CLEAR CHAT
    const clearChat = async () => {

        setChat({
            ...chat,
            isLoading: true
        })

        let data = {
            channel_id: chatterDetails.channel_id
        }

        let obj = {
            data: data,
            token: userDetails.token,
            method: "post",
            url: "clearchat"
        }
        try {
            const res = await http(obj);
            if (res.data.status === true) {
                setCount(0);
                setMessages([]);
                setChat({
                    ...chat,
                    isLoading: true,
                    isError: false
                })
                setCheck(false);
            } else {
                setChat({
                    ...chat,
                    isLoading: false,
                })
            }
        } catch {
            console.log("Some error occured");
            setChat({
                ...chat,
                isLoading: false,
                isError: true,
            })
        }
    }


    // FETCHES MORE FRIENDS
    const fetchMoreFriends = () => {
        setMyFriends({
            ...myFriends, "config": {
                ...myFriends.config
            }
        })
        getFriends(myFriends.config.page + 1, true);
    }


    // REPORT CHAT
    const reportChat = async () => {
        if (reportModal.isReported === false) {
            setReportModal({ ...reportModal, isVisible: true });
        }
        else {
            setReportModal({
                ...reportModal,
                isLoading: true
            })

            let data = {
                friend_id: chatterDetails.friend_id
            }

            let obj = {
                data: data,
                token: userDetails.token,
                method: "post",
                url: "reportuser"
            }
            try {
                const res = await http(obj)
                if (res.data.status === true) {
                    setReportModal({
                        ...reportModal,
                        isReported: false,
                        isVisible: false,
                        isLoading: false
                    })
                    setCheck(false);
                    setChatterDetails({
                        ...chatterDetails,
                        is_userreport: 1
                    })
                } else {
                    console.log("failed to report");
                }
            } catch {
                console.log("Some error occured");
            }
        }
    }

    //REPORT CHAT
    useEffect(() => {
        if (reportModal.isReported === true) {
            reportChat();
        }
    }, [reportModal.isReported])


    const handleReportModal = () => {
        setReportModal({ ...reportModal, isVisible: false });
    }

    const doReport = () => {
        setReportModal({ ...reportModal, isReported: true });
    }
    // REPORT CHAT


    //GO TO BOTTTOM ARROW
    const handleGoDownArr = (event) => {
        let offset = event.target.scrollTop;
        offset = Math.abs(offset);
        if (offset > 100) {
            setGoDownArrow(true);
        } else {
            setGoDownArrow(false);
        }
    }


    //SCROLLS TO BOTTOM
    const goDown = () => {
        let ref = document.querySelector('.lastMessage');
        ref.scrollIntoView({ behavior: "smooth" });
    }

    const showMessages = () => {
        setToggleView({
            chat: false,
            requests: false,
            messages: true,
        })
    }
    const showChat = () => {
        setToggleView({
            messages: false,
            requests: false,
            chat: true,
        })
        setMessages([])
        setCount(0)
    }
    const showRequests = () => {
        setToggleView({
            messages: false,
            chat: false,
            requests: true
        })
    }

    const handleBounce = boolVal => {
        let body = document.querySelector('body');
        let html = document.querySelector('html');
        if (boolVal) {
            body.classList.add('bounceOff');
            html.classList.add('bounceOff');
        } else {
            body.classList.remove('bounceOff');
            html.classList.remove('bounceOff');
        }
    }


    return (
        <div className="container-fluid">
            <div className="row chatPageOuter">
                {/* <div className="preventHeader preventHeaderChatSec">preventHead</div> */}
                {/* <div className={`container py-md-4 ${toggleView.chat || toggleView.requests ? "p-3" : "p-0"} preventFooter chatOutestCont ${toggleView.messages || toggleView.requests ? "resetHeight" : ""}`}> */}
                <div className={`container py-md-4 chatOutestCont ${toggleView.messages || toggleView.requests ? "resetHeight" : ""}`}>
                    <div className="row m-0">

                        <div className="leftSectionChat">
                            <div className={`${toggleView.chat || toggleView.requests ? "d-block" : "d-none"} chatsSection d-md-block`}>
                                <div className="chatPageHeaders">
                                    Chat
                                </div>

                                <div className={`chatPageHeaders mobile ${toggleView.messages === false ? "d-flex" : "d-none"}`}>
                                    <div className={`regions ${toggleView.chat === true ? "active" : ""}`} onClick={showChat}>
                                        Chat
                                    </div>
                                    <div className={`regions ${toggleView.requests === true ? "active" : ""}`} onClick={showRequests}>
                                        Friend Request
                                    </div>
                                </div>


                                <div className={`chatPageHeaders mobile prvnt ${toggleView.messages === false ? "d-flex" : "d-none"}`}>
                                </div>
                                <div className={`allChatsCont scrollbar ${toggleView.chat ? "d-block" : " d-none"} d-md-block`} id="style-2" height={`${window.innerWidth - 13}`}>

                                    <InfiniteScroll
                                        scrollableTarget={`style-2`}
                                        endMessage={<div className="endListMessage text-center chatEndListMessage mt-2">End of Chat List</div>}
                                        dataLength={myFriends.data.count}
                                        next={fetchMoreFriends}
                                        hasMore={myFriends.data.friends.length < myFriends.data.count}
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
                                            myFriends.isLoading ?
                                                (<div className="text-center">
                                                    <div className="spinner-border pColor text-center" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </div>) :
                                                (myFriends.isError ?
                                                    (<div className="alert alert-danger" role="alert">
                                                        Something went wrong
                                                    </div>) :

                                                    (myFriends.data.friends).map((user, index) => {
                                                        return <Chatter
                                                            index={index}
                                                            user={user}
                                                            openUnFriendModal={openUnFriendModal}
                                                            updated_at={user.updated_at}
                                                            key={`${index}${user.imgUrl}${user.name}${user.chatterDesc}`}
                                                            is_userreport={user.is_userreport}
                                                            is_online={user.is_online}
                                                            channel_id={user.channel_id}
                                                            friend_id={user.friend_id}
                                                            openChat={openChat}
                                                            chatIndex={index}
                                                            chatterDetails={chatterDetails}
                                                            imgUrl={user.image === '' ? "/images/userAcc.svg" : user.image}
                                                            chatterName={user.name} chatterDesc={!user.last_messsage ? "No Messages found" : user.last_messsage} />
                                                    })
                                                )
                                        }
                                    </InfiniteScroll>

                                </div>
                            </div>

                            <div className={`${myRequests.data && toggleView.requests ? "d-block" : "d-none"} requestsCont d-md-block`}>
                                {
                                    !myRequests.isLoading ? (myRequests.isError ? (<div className="alert alert-danger" role="alert">
                                        Something went wrong
                                    </div>) :

                                        <div
                                            className={`friendsRequestsMainCont ${myRequests.data.count ? '' : 'hiddenReqCont'}`}>
                                            <span
                                                className="chatPageHeaders toggleListHeader"
                                                role="button"
                                                onClick={() => setShowFriendsList(!showFriendsList)}>
                                                Friend Requests

                                                {showFriendsList ?
                                                    <i className="fa fa-minus" aria-hidden="true"></i> :
                                                    <i className="fa fa-plus" aria-hidden="true" ></i>}
                                            </span>
                                            <div className={`friendsRequestsMainCont togglableList ${showFriendsList ? "" : "shrinkRequestsCont"}`}>

                                                {/* SHOWS ALL THE USERS WHO HAVE REQUESTED TO YOU */}
                                                {((myRequests.data.count)
                                                    ?
                                                    (myRequests.data.requests && (myRequests.data.requests).map((requester, index) => {
                                                        return <Request
                                                            key={`${index}${requester.imgUrl}${requester.requesterName}${requester.requestersTotalSharedConf}`}
                                                            updateFriendCount={updateFriendCount}
                                                            request_id={requester.request_id}
                                                            imgUrl={requester.image === '' ? "/images/userAcc.svg" : requester.image}
                                                            requesterName={requester.name}
                                                            requestersTotalSharedConf={requester.no_of_confessions} />
                                                    }))

                                                    : <div className="endListMessage px-0 px-md-2">End of requests</div>)}
                                            </div>
                                        </div>) : (<div className="text-center">
                                            <div className="spinner-border pColor text-center" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>)}
                            </div>
                        </div>

                        {/* OPENED CHAT CONTAINER */}
                        <div className={`rightSectionChat chattingWithCont ${toggleView.messages ? "d-block " : "d-none"} d-md-block transition`}>
                            {chat.isVisible === false ? (
                                <div className="outerLookChat">
                                    {myFriends.data.friends.length === 0 &&
                                        <span className="endListMessage">
                                            No Chats to show
                                        </span>
                                    }

                                    {myFriends.data.friends.length !== 0 && chatClosed &&
                                        <span className="endListMessage">
                                            open the chat to see the messages
                                        </span>
                                    }
                                </div>
                            ) :
                                <>
                                    <div className="middleContMainDivChat">
                                        <div className="forBottomBorder opened_chat">
                                            {toggleView.messages && <i type="button" className="fa fa-arrow-left moveBackFromChat" aria-hidden="true" onClick={showChat}></i>}
                                            <div className="imgNopenUserNameWrap">

                                                <span className="userImageContChatOutest">
                                                    <img src={chatterDetails.image === '' ? "/images/chatterImg.png" : chatterDetails.image} alt="" className="userImageContChat" />
                                                    {chatterDetails?.email_verified === 1 ?
                                                        <img src="/images/verifiedIcon.svg" title="Verified user" alt="verified_user_icon" className='verified_user_icon' /> : null}
                                                </span>
                                                <div className="chatterUserName text-capitalize">
                                                    <span className="user_name">
                                                        {chatterDetails.name === '' ? 'anonymous' : chatterDetails.name}
                                                    </span>
                                                </div>
                                                <Badge points={chatterDetails?.points} classlist="ml-2" />
                                                <button onClick={(e) => {
                                                    setCheck(prevCheck => !prevCheck)
                                                }}>...</button>
                                            </div>

                                            <div className={`takeAction takeActionProfile p-1 ${check ? "d-block" : "d-none"}`} id="takeAction">

                                                <div type="button" className={`takeActionOptions chat mt-2 textDecNone px-3`} onClick={() => { performAction("report") }}>
                                                    <i className="fa fa-file pr-1 pl-2" aria-hidden="true"></i>
                                                    Report user
                                                </div>
                                                <hr className="m-0 mt-2" />
                                                <div type="button" className="takeActionOptions chat mt-2 textDecNone px-3" onClick={() => { performAction("clear") }}>
                                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                                    Clear chat
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    <div style={{ height: "59px" }}
                                        className="preventHeaderChatSec">preventHead</div>


                                    <div className="messagesCont pt-2" id="messagesCont" ref={chatRef}>

                                        <InfiniteScroll
                                            onScroll={handleGoDownArr}
                                            inverse={true}
                                            style={{ display: 'flex', flexDirection: 'column-reverse' }}
                                            scrollableTarget="messagesCont"
                                            endMessage={
                                                <div className="text-center endListMessage pb-0">End of Messages </div>
                                            }
                                            dataLength={messages.length}
                                            next={fetchMoreChat}
                                            hasMore={messages.length < count}
                                            loader={
                                                <div className="text-center mt-2" style={{ zIndex: 0 }}>
                                                    <div className="spinner-border pColor" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            {messages.length > 0 &&
                                                messages.map((message, index) => {
                                                    if (message.from_id === userDetails.user_id) {
                                                        return (<div key={`messageTo${index}`} className={`${index === 0 ? "lastMessage " : ''}messageTo`}>
                                                            <div className="actualMessage">
                                                                <pre className="preToNormal">{message.message}</pre>
                                                                <span className="messagedAt">
                                                                    {/* {message.created_at} */}
                                                                    {dateConverter(message.created_at)}
                                                                </span>
                                                            </div>
                                                        </div>)
                                                    }
                                                    else {
                                                        return (<div className={`${index === 0 ? "lastMessage " : ''}messageFrom`} key={`messageTo${index}`} >
                                                            <div className="actualMessage">
                                                                <pre className="preToNormal">{message.message}</pre>
                                                                <span className="messagedAt">
                                                                    {/* {message.created_at} */}
                                                                    {dateConverter(message.created_at)}
                                                                </span>
                                                            </div>
                                                        </div>)
                                                    }
                                                })
                                            }
                                        </InfiniteScroll>
                                    </div>

                                    {/* MESSAGEBOX */}
                                    <div className="container-fluid inputWithForwardCont goDownArrowWrapper">
                                        <i className={`fa fa-arrow-circle-o-down goDownArrow ${goDownArrow === true && "d-block"}`} aria-hidden="true" type="button" onClick={goDown}></i>
                                        <div className="inputToAddComment textAreaToComment chat">

                                            <TextareaAutosize
                                                onFocus={() => {
                                                    handleBounce(true)
                                                    setError("")
                                                }}
                                                onBlur={() => handleBounce(false)}
                                                type="text"
                                                rows='1'
                                                value={typedMessage}
                                                onKeyDown={(e) => { checkKeyPressed(e) }}
                                                onChange={(e) => {
                                                    setTypedMessage(e.target.value)
                                                    if (e.target.value !== "") {
                                                        setError("")
                                                    }
                                                }} className="form-control my-3">

                                            </TextareaAutosize>

                                            {error !== "" &&
                                                <div className="errorCont">
                                                    {error}
                                                </div>}
                                        </div>
                                        <div className="arrowToAddComment chat" type="button" id="sendMessageChat" onClick={() => { sendMessage() }}>
                                            <img src="images/chatArrow.png" alt="chatArrow" className="forwardIconContImgForChat" />
                                        </div>
                                    </div>


                                    {/* MESSAGEBOX */}
                                </>
                            }
                        </div>

                        {/* END OF OPENED CHAT CONTAINER */}


                    </div>
                </div>
            </div>


            {/* REPORT USER MODAL */}
            <Modal show={reportModal.isVisible}>
                <Modal.Header>
                    <h6>Report User</h6>
                </Modal.Header>

                <Modal.Body className="privacyBody report_com_modalbody">
                    {chatterDetails.is_userreport !== 1 ?
                        <p className='mb-0'>Are you sure, you want to report the user?</p> :
                        <p className='mb-0' >You already have reported this user.</p>
                    }
                </Modal.Body>

                <Modal.Footer className="pt-0 justify-content-center">
                    {chatterDetails.is_userreport !== 1 ?
                        <Button className="modalFootBtns btn" variant="secondary" onClick={handleReportModal}>
                            Cancel
                        </Button>
                        :
                        <Button className="modalFootBtns btn" variant="secondary" onClick={handleReportModal}>
                            Done
                        </Button>}
                    {chatterDetails.is_userreport !== 1 &&
                        <>
                            <Button className="modalFootBtns btn" variant="primary" onClick={doReport}>
                                {reportModal.isLoading ? <div className="spinnerSizePost spinner-border text-white" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : "Report"}
                            </Button>

                        </>}
                </Modal.Footer>
            </Modal>
            {/* REPORT USER MODAL */}

            <UnFriendModal unFriend={unFriend} />
        </div>
    );
}

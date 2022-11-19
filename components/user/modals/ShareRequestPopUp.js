import React from 'react';

export default function ShareRequestPopUp({ toggleSharekit, isNotFriend, openFrReqModalFn, closeShareMenu }) {

    var classToAdd = '';
    var moveABitUp = '';

    const do_ = () => {
        openFrReqModalFn();
        closeShareMenu();
    }

    if (isNotFriend !== 1 && isNotFriend !== 2) {
        classToAdd = 'available'
    }

    if (isNotFriend === 1 || isNotFriend === 2) {
        moveABitUp = 'moveABitUp'
    }

    return (
        <div className={`shareReqCont ${moveABitUp}`}>
            {isNotFriend === 1 &&
                <>
                    <div className="shareReqRows user" type="button" onClick={do_}>
                        <img src="/images/addFriend.svg" width={30} height={30} />
                        <span>
                            Friend Request
                        </span>
                    </div>
                    <div className='shareReqDivider'></div>
                </>
            }

            {isNotFriend === 2 &&
                <>
                    <div className="shareReqRows user" type="button" onClick={do_}>
                        <img src="/images/cancelFriendPop.svg" width={20} height={20} />
                        <span>
                            Cancel Request
                        </span>
                    </div>
                    <div className='shareReqDivider'></div>
                </>
            }
            <div className={`shareReqRows ${classToAdd} user w-100`} type="button" onClick={toggleSharekit}>
                <i className="fa fa-share-alt dontHide" aria-hidden="true"></i>
                <span className='dontHide'>
                    Share
                </span>
            </div>
        </div>
    )
}

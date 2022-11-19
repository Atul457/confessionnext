import { useState } from 'react';
import { FriendReqModal } from '../pageElements/Modals/FriendReqModal';

const initialState = {
    visible: false,
    loading: false,
    requested: false,
    cancelled: false
}

export default function useFriendReqModal() {


    const [friendReqState, setFriendReqState] = useState(initialState);

    const closeFrReqModalFn = () => {
        setFriendReqState({ ...friendReqState, visible: false });
    }

    const changeRequested = () => {
        setFriendReqState({ ...friendReqState, requested: true, loading: false, cancelled: false });
    }

    const changeCancelled = () => {
        setFriendReqState({ ...friendReqState, cancelled: true, loading: false, requested: false });
    }

    const openFrReqModalFn = () => {
        setFriendReqState({ ...friendReqState, visible: true });
    }

    const toggleLoadingFn = () => {
        setFriendReqState({ ...friendReqState, loading: !friendReqState.loading })
    }

    return [friendReqState, closeFrReqModalFn, openFrReqModalFn, toggleLoadingFn, FriendReqModal, changeRequested, changeCancelled];
}

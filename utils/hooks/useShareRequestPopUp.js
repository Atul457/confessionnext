import { useState } from 'react';
import ShareRequestPopUp from "../../components/user/modals/ShareRequestPopUp"

export default function useShareRequestPopUp() {

    const [shareReqPopUp, setShareReqPopup] = useState(false);
    
    const toggleShareReqPopUp = () => {
        setShareReqPopup(!shareReqPopUp);
    }
    
    const closeShareReqPopUp = () => {
        setShareReqPopup(false);
    }

    return [shareReqPopUp, toggleShareReqPopUp, ShareRequestPopUp, closeShareReqPopUp];
}

import { useState } from 'react';
import Features from '../../components/user/modals/Features';

const initialState = {
    visibile: false,
    shown : false
}

const useFeaturesModal = () => {

    const [featuresState, setFeaturesState] = useState(initialState);

    const closeFeatures = () => {
        setFeaturesState(initialState);
    }

    const enableShown = () => {
        setFeaturesState({
            visibile : false,
            shown : true
        })
    }

    const openFeatures = () => {
        setFeaturesState({ visibile: true, shown : false });
    }

    return [closeFeatures, openFeatures, Features, featuresState, enableShown];
}

export default useFeaturesModal;
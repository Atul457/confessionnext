const initialState = {
    verified: false,
    visible: false,
    error: false,
    isLoading: false,
    show : false
}


const VerifyEmail = (state = initialState, action) => {
    switch (action.type) {
        case 'EVERIFY':
            return {...state, ...action.eVerifyState};

        default:
            return state
    }
}

export default VerifyEmail;
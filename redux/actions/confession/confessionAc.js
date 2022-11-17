const confAcs = {
    "SET_CONFESSIONS": "SET_CONFESSIONS_F"
}

const setConfessions = payload => {
    return {
        type: confAcs.SET_CONFESSIONS,
        payload
    }
}

export {
    setConfessions,
    confAcs
}
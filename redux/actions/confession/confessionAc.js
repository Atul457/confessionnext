const confAcs = {
    "SET_CONFESSIONS": "SET_CONFESSIONS_F",
    "UPDATE_CONFESSION": "UPDATE_CONFESSION_F",
    "DELETE_CONFESSION": "DELETE_CONFESSION_F",
}

const setConfessions = payload => {
    return {
        type: confAcs.SET_CONFESSIONS,
        payload
    }
}

const updateConfession = payload => {
    return {
        type: confAcs.UPDATE_CONFESSION,
        payload
    }
}

const deleteConfession = payload => {
    return {
        type: confAcs.DELETE_CONFESSION,
        payload
    }
}

export {
    setConfessions,
    confAcs,
    updateConfession,
    deleteConfession
}
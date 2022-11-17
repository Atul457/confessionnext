const searchAcs = {
    "SEARCH_ALL": "SEARCH_FORUMS_AND_CONFESSIONS",
    "MUTATE_SEARCH_DATA": "MUTATE_SEARCH_DATA"
}

const searchAcFn = payload => {
    return {
        type: searchAcs.SEARCH_ALL,
        payload
    }
}

const mutateSearchData = payload => {
    return {
        type: searchAcs?.MUTATE_SEARCH_DATA,
        payload
    }
}

export {
    searchAcFn,
    searchAcs,
    mutateSearchData
}
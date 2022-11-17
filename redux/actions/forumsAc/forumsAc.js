const forumAcs = {
    "SET_FORUM_CATEGORIES": "SET_FORUM_CATEGORIES_F",
    "SET_FORUM_TAGS": "SET_FORUM_TAGS_F",
    "SET_FORUM_TYPES": "SET_FORUM_TYPES_F",
    "SET_FORUMS": "SET_FORUMS_F",
    "SET_SINGLE_FORUM": "SET_SINGLE_FORUM_F",
    "MUTATE_FORUM": "MUTATE_FORUM_F",
    "SET_ACTIONBOX": "SET_ACTIONBOX_F",
    "SET_DETAILPAGE_COMMENTS": "SET_DETAILPAGE_COMMENTS_F",
    "SET_SINGLE_COMMENT": "SET_SINGLE_COMMENT_F",
    "SET_SINGLE_SUB_COMMENT": "SET_SINGLE_SUB_COMMENT_F",
    "POST_COMMENT_F": "POST_COMMENT_F",
    "SET_COMMENTS_FORUM": "SET_COMMENTS_FORUM_F",
    "APPEND_COMMENT_FORUM": "APPEND_COMMENT_FORUM",
    "REQUEST_TO_JOIN_MODAL": "REQUEST_TO_JOIN_MODAL",
    "REPORT_FORUM_MODAL": "REPORT_FORUM_MODAL",
    "REPORT_FORUM_COMMENT_MODAL": "REPORT_FORUM_COMMENT_MODAL",
    "HANDLE_SINGLE_FORUM_COMMENT": "HANDLE_SINGLE_FORUM_COMMENT",
    "USERS_TO_TAG": "USERS_TO_TAG",
    "CREATE_FORUM_MODAL_F": "CREATE_FORUM_MODAL_F",
    "DELETE_FORUM_MODAL_F": "DELETE_FORUM_MODAL_F",
    "DELETE_FORUM_COM_OR_SUB_COM": "DELETE_FORUM_COM_OR_SUB_COM_F",
    "DELETE_FORUM": "DELETE_FORUM_F",
}

const reqToJoinModalAcFn = payload => {
    return {
        type: forumAcs.REQUEST_TO_JOIN_MODAL,
        payload
    }
}

const usersToTagAcFn = payload => {
    return {
        type: forumAcs.USERS_TO_TAG,
        payload
    }
}

const handleForumCatsAcFn = payload => {
    return {
        type: forumAcs.SET_FORUM_CATEGORIES,
        payload
    }
}

const handleForumsTypesAcFn = payload => {
    return {
        type: forumAcs.SET_FORUM_TYPES,
        payload
    }
}

const handleForumsTagsAcFn = payload => {
    return {
        type: forumAcs.SET_FORUM_TAGS,
        payload
    }
}

const handleForums = payload => {
    return {
        type: forumAcs.SET_FORUMS,
        payload
    }
}

const handleForum = payload => {
    return {
        type: forumAcs.SET_SINGLE_FORUM,
        payload
    }
}

const handleComments = payload => {
    return {
        type: forumAcs.SET_COMMENTS_FORUM,
        payload
    }
}

const mutateForumFn = payload => {
    return {
        type: forumAcs.MUTATE_FORUM,
        payload
    }
}

const handleCommentsAcFn = payload => {
    return {
        type: forumAcs.SET_DETAILPAGE_COMMENTS,
        payload
    }
}

const handleCommentAcFn = payload => {
    return {
        type: forumAcs.SET_SINGLE_COMMENT,
        payload
    }
}

const handleSingleForumCommAcFn = payload => {
    return {
        type: forumAcs.HANDLE_SINGLE_FORUM_COMMENT,
        payload
    }
}

const deleteForumCommSubcomAcFn = payload => {
    return {
        type: forumAcs.DELETE_FORUM_COM_OR_SUB_COM,
        payload
    }
}

const createForumModalFnAc = payload => {
    return {
        type: forumAcs.CREATE_FORUM_MODAL_F,
        payload
    }
}

const handleSubCommentAcFn = payload => {
    return {
        type: forumAcs.SET_SINGLE_SUB_COMMENT,
        payload
    }
}

const postComment = payload => {
    return {
        type: forumAcs.POST_COMMENT_F,
        payload
    }
}

const reportForumAcFn = payload => {
    return {
        type: forumAcs.REPORT_FORUM_MODAL,
        payload
    }
}

const deleteForum_AcFn = payload => {
    return {
        type: forumAcs.DELETE_FORUM,
        payload
    }
}

const deleteForumAcFn = payload => {
    return {
        type: forumAcs.DELETE_FORUM_MODAL_F,
        payload
    }
}

const reportForumCommAcFn = payload => {
    return {
        type: forumAcs.REPORT_FORUM_COMMENT_MODAL,
        payload
    }
}


const forumHandlers = {
    handleForumCatsAcFn,
    handleForumsTypesAcFn,
    handleForumsTagsAcFn,
    handleForums,
    handleForum,
    handleCommentsAcFn,
    handleCommentAcFn,
    handleSubCommentAcFn,
    handleComments
}

export {
    forumHandlers,
    forumAcs,
    mutateForumFn,
    postComment,
    reqToJoinModalAcFn,
    reportForumAcFn,
    reportForumCommAcFn,
    handleSingleForumCommAcFn,
    usersToTagAcFn,
    createForumModalFnAc,
    deleteForumCommSubcomAcFn,
    deleteForumAcFn,
    deleteForum_AcFn
}
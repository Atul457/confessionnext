import { forumAcs } from "../../actions/forumsAc/forumsAc";

// Third party imports
import produce, { current } from "immer";

// Utils
import { apiStatus } from "../../../utils/api";


const initialstate = {
    categories: {
        message: "",
        data: [],
        status: apiStatus.LOADING,
        activeCategory: 0
    },
    tags: {
        message: "",
        data: [],
        status: apiStatus.IDLE
    },
    forumTypes: {
        message: "",
        data: [],
        status: apiStatus.IDLE
    },
    forums: {
        status: apiStatus.LOADING,
        data: [],
        message: "",
        actionBox: {},
        page: 1,
        hasMore: true,
        activeTab: 0,
        count: 0
    },
    detailPage: {
        postComment: {
            status: apiStatus.IDLE,
            message: "",
        },
        status: apiStatus.LOADING,
        data: [],
        message: "",
        actionBox: {},
        page: 1,
        comments: {
            status: apiStatus.LOADING,
            data: [{
                subComments: {
                    status: apiStatus.IDLE,
                    data: [],
                    message: "",
                }
            }],
            message: ""
        }
    },
    usersToTag: {
        status: apiStatus.LOADING,
        data: [],
        message: ""
    },
    modals: {
        requestToJoinModal: {
            visible: false,
            status: apiStatus.IDLE,
            message: "",
            data: {
                requested: false,
                cancelled: false.valueOf,
                is_calledfrom_detailPage: false
            }
        },
        reportForumModal: {
            visible: false,
            status: apiStatus.IDLE,
            message: "",
            data: {
                forum_id: null,
                index: null,
                isReported: false
            }
        },
        reportForumCommentModal: {
            visible: false,
            status: apiStatus.IDLE,
            message: "",
            data: {
                forum_id: null,
                comment_index: null,
                comment_id: null,
                isReported: false
            }
        },
        deleteForumModal: {
            visible: false,
            status: apiStatus.IDLE,
            message: "",
            data: {
                forum_id: null,
                forum_index: null
            }
        },
        createForumModal: {
            visible: false,
            status: apiStatus.IDLE,
            message: "",
            data: {
                title: "",
                description: "",
                category_id: undefined,
                post_as_anonymous: undefined,
                image: undefined,
                type: undefined,
                tags: []
            }
        }
    }
}

const forumsReducer = (state = initialstate, action) => {
    switch (action.type) {
        case forumAcs.SET_FORUM_CATEGORIES: return produce(state, draft => {
            draft.categories = {
                ...draft.categories,
                ...action.payload
            }
        });

        case forumAcs.SET_FORUM_TAGS: return produce(state, draft => {
            draft.tags = {
                ...draft.tags,
                ...action.payload
            }
        });

        case forumAcs.SET_FORUM_TYPES: return produce(state, draft => {
            draft.forumTypes = {
                ...draft.forumTypes,
                ...action.payload
            }
        });

        case forumAcs.SET_FORUMS: return produce(state, draft => {
            draft.forums = {
                ...draft.forums,
                ...action.payload
            }
        });

        case forumAcs.MUTATE_FORUM: return produce(state, draft => {
            const { forum_index, data_to_mutate } = action.payload
            draft.forums.data[forum_index] = {
                ...draft.forums.data[forum_index],
                ...data_to_mutate
            }
        });

        case forumAcs.SET_SINGLE_FORUM: return produce(state, draft => {
            // If you want to mutate the upper single forum details only
            if (action.payload?.mutate_data_only) {
                draft.detailPage.data = {
                    ...draft.detailPage?.data,
                    ...action.payload
                }
                return
            }
            draft.detailPage = {
                ...draft.detailPage,
                ...action.payload
            }
        });

        case forumAcs.SET_DETAILPAGE_COMMENTS: return produce(state, draft => {
            draft.detailPage.comments = {
                ...draft.detailPage.comments,
                ...action.payload
            }
            draft.detailPage.postComment = {
                status: apiStatus.IDLE,
                message: ""
            }
        });

        case forumAcs.SET_SINGLE_COMMENT: return produce(state, draft => {
            const { commentIndex } = action.payload

            if (action.payload?.append) {
                const comments = current(draft.detailPage.comments)
                const comment = comments.data[commentIndex]
                const subComments = comment?.subComments
                draft.detailPage.comments.data[commentIndex] = {
                    ...comment,
                    subComments: {
                        ...subComments,
                        data: [...subComments?.data, action.payload?.data]
                    }
                }
            }
            else {
                draft.detailPage.comments.data[commentIndex] = {
                    ...draft.detailPage.comments?.data[commentIndex],
                    ...action.payload
                }
            }

            draft.detailPage.comments.commentBox = {}

        });

        case forumAcs.HANDLE_SINGLE_FORUM_COMMENT: return produce(state, draft => {
            const { comment_index } = action.payload
            // For subcomment
            if (action.payload?.is_for_sub_comment) {
                const {
                    parent_comment_index,
                    comment_index: sub_comment_index
                } = action.payload
                draft.detailPage.comments.data[parent_comment_index].subComments.data[sub_comment_index] = {
                    ...draft.detailPage.comments?.data[parent_comment_index]?.subComments?.data[sub_comment_index],
                    ...action.payload.data
                }
            } else
                draft.detailPage.comments.data[comment_index] = {
                    ...draft.detailPage.comments?.data[comment_index],
                    ...action.payload.data
                }
        });

        case forumAcs.DELETE_FORUM_COM_OR_SUB_COM: return produce(state, draft => {
            const { comment_index } = action.payload
            let commentsCount = 1
            const detailPageData = current(draft.detailPage.data)

            // For subcomment
            if (action.payload?.isSubComment) {
                const {
                    parent_comment_index,
                    arrayOfNodesIndexes
                } = action.payload

                var subComments = current(draft.detailPage.comments.data[parent_comment_index].subComments)
                let originalArray = [], delCommentCount;
                originalArray.push(...subComments.data);
                arrayOfNodesIndexes.forEach(curr => { originalArray.splice(curr, 1) });
                delCommentCount = arrayOfNodesIndexes.length;
                draft.detailPage.comments.data[parent_comment_index].subComments = {
                    subComments,
                    data: [...originalArray]
                }
                commentsCount = delCommentCount
            }
            // Works in case of parent comment
            else {
                var comments = current(draft.detailPage.comments)
                commentsCount = action.payload?.commentsCount ?? 0

                var arrCopy = [...comments.data ?? []]
                arrCopy.splice(comment_index, 1)
                draft.detailPage.comments = {
                    ...comments,
                    count: comments.count - 1,
                    data: [...arrCopy]
                }
            }

            draft.detailPage.data = {
                ...detailPageData,
                no_of_comments: detailPageData?.no_of_comments - commentsCount
            }

            // draft.detailPage.comments = {
            //     ...comments,
            //     count: comments.count - 1,
            //     data: [...arrCopy]
            // }
        });

        case forumAcs.SET_SINGLE_SUB_COMMENT: return produce(state, draft => {
            const { subCommentIndex, commentIndex } = action.payload
            draft.detailPage.comments.data[commentIndex].subComments.data[subCommentIndex] = {
                ...draft.detailPage.comments.data[commentIndex].subComments.data[subCommentIndex],
                ...action.payload
            }
        });

        case forumAcs.POST_COMMENT_F: return produce(state, draft => {
            draft.detailPage.postComment = {
                ...draft.detailPage.postComment,
                ...action.payload
            }
            if (action?.payload?.status === apiStatus.FULFILLED) {
                const singleForumData = current(draft.detailPage.data)

                draft.detailPage.data = {
                    ...singleForumData,
                    no_of_comments: singleForumData?.no_of_comments + 1
                }
            }
        });

        case forumAcs.USERS_TO_TAG: return produce(state, draft => {
            draft.usersToTag = {
                ...draft.usersToTag,
                ...action.payload
            }
        });

        case forumAcs.REQUEST_TO_JOIN_MODAL: return produce(state, draft => {
            draft.modals.requestToJoinModal = {
                ...draft.modals.requestToJoinModal,
                ...action.payload
            }
        });

        case forumAcs.SET_COMMENTS_FORUM: return produce(state, draft => {
            if (action.payload?.append)
                draft.detailPage.comments = {
                    ...draft.detailPage.comments,
                    data: [
                        ...draft.detailPage.comments?.data,
                        action.payload?.data
                    ]
                }
            else
                draft.detailPage.comments = {
                    ...draft.detailPage.comments,
                    ...action.payload
                }
        });

        case forumAcs.REPORT_FORUM_MODAL: return produce(state, draft => {
            if (action.payload?.reset)
                draft.modals.reportForumModal = {
                    visible: false,
                    status: apiStatus.IDLE,
                    message: "",
                    data: {
                        forum_id: null,
                        index: null,
                        isReported: false
                    }
                }
            else
                draft.modals.reportForumModal = {
                    ...draft.modals.reportForumModal,
                    ...action.payload
                }
        });

        case forumAcs.REPORT_FORUM_COMMENT_MODAL: return produce(state, draft => {
            if (action.payload?.reset)
                draft.modals.reportForumCommentModal = {
                    visible: false,
                    status: apiStatus.IDLE,
                    message: "",
                    data: {
                        forum_id: null,
                        comment_index: null,
                        comment_id: null,
                        isReported: false
                    }
                }
            else
                draft.modals.reportForumCommentModal = {
                    ...draft.modals.reportForumCommentModal,
                    ...action.payload
                }
        });

        case forumAcs.CREATE_FORUM_MODAL_F: return produce(state, draft => {
            draft.modals.createForumModal = {
                ...draft.modals.createForumModal,
                ...action.payload
            }
        });

        case forumAcs.DELETE_FORUM_MODAL_F: return produce(state, draft => {
            draft.modals.deleteForumModal = {
                ...draft.modals.deleteForumModal,
                ...action.payload
            }
        });

        case forumAcs.DELETE_FORUM: return produce(state, draft => {
            const { forum_index } = action.payload
            const myForums = [...current(draft.forums.data)]
            myForums.splice(forum_index, 1)
            draft.forums.data = [...myForums]
        });

        default: return state;
    }
}

export { forumsReducer }
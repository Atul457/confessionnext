import { combineReducers } from 'redux'
import GetFriend from './friendReducer'
import Terms from './termsReducer'
import VerifyEmail from './eVerifyReducer';
import ShareReducer from './shareReducer';
import { updateUserPassReducer } from './updateUserPassReducer';
import { forgotUserPassReducer } from './forgotUpReducer';
import commentsModalReducer from './commentsModalReducer';
import friendReqModalReducer from './friendReqModalReducer';
import postAlertReducer from './postAlertReducer';
import notificationReducer from './notificationReducer';
import socialLinksModalReducer from './socialLinksModalReducer';
import postBoxStateReducer from './postBoxStateReducer';
import { unFriendReducer } from './unFriendReducer';
import reportComModalReducer from './reportComModalReducer';
import avatarModalReducer from './avatarModalReducer/avatarModalReducer';
import commRBYModalReducer from './commRBYModalReducer';
import avatarsIntroModalReducer from './avatarsIntroModalReducer/avatarsIntroModalReducer';
import shareWithLoveReducer from './shareWithLoveReducer';
import reportPostModalReducer from './reportPostModalReducer';
import postRBYModalReducer from './postRBYModalReducer';
import { forumsReducer } from './forumsReducer/forumsReducer';
import SearchReducer from './searchReducer/searchReducer';
import modalsReducer from './modals';
import { confessionReducer } from './confession/confessionReducer';
import chatReducer from './chatReducer';

const rootReducer = combineReducers({
    chatReducer,
    confessionReducer,
    modalsReducer,
    SearchReducer,
    reportPostModalReducer,
    avatarsIntroModalReducer,
    Terms,
    GetFriend,
    VerifyEmail,
    ShareReducer,
    updateUserPassReducer,
    forgotUserPassReducer,
    commentsModalReducer,
    friendReqModalReducer,
    postAlertReducer,
    notificationReducer,
    socialLinksModalReducer,
    postBoxStateReducer,
    unFriendReducer,
    reportComModalReducer,
    avatarModalReducer,
    commRBYModalReducer,
    shareWithLoveReducer,
    postRBYModalReducer,
    forumsReducer,
})

export { rootReducer }

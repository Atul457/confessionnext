import React from 'react'
import Link from 'next/link';

// Utils
import auth from '../../../utils/auth';

const { getKeyProfileLoc, isUserLoggedIn } = auth

const VisitPrivilege = ({ post = {} }) => {

    // Vars
    let isMyProfile = false;
    let isUserProfile = false;
    let isMyPost = false;
    let linkToVisit = "#";
    let html = "";
    const slug = post?.userslug
    const creatorId = post?.user_id
    const isAnonymous = post?.post_as_anonymous

    if (isUserLoggedIn) {
        isMyPost = getKeyProfileLoc("user_id", false) === creatorId
    }

    isMyProfile = isMyPost && isAnonymous === 0;
    isUserProfile = creatorId && isAnonymous === 0 && !isMyPost;

    if (isMyProfile)
        linkToVisit = "/profile"
    if (isUserProfile)
        linkToVisit = `/userprofile/${slug}`

    if ((!isMyProfile && !isUserProfile) || post?.post_as_anonymous === 1) {
        html = (
            <span className='postUserName'>
                <span className="userName">
                    {post?.created_by}
                </span>
            </span>)
    } else {
        html = (<Link className={`textDecNone postUserName`}
            href={linkToVisit}>
            <span className="userName">
                {post?.created_by}
            </span>
        </Link>)
    }

    return html;
}

export default VisitPrivilege
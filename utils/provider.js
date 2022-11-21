import { envConfig } from "./envConfig"

const showAdsAfter_Feed = 7
const maxImageSizeAllowed_Feed = 2048
const maxCharAllowedOnPostComment = 2000
const forum_types = { private: 2, public: 1, closed: 3 }
const next_auth_status = { unauthenticated: "unauthenticated", loading: "loading", authenticated: "authenticated" }


const sharePWLTiles = envConfig.isProdMode ? [
    { src: 'https://thetalkplace.com/cover/Background-01.jpg', link: 'cover/Background-01.jpg' },
    { src: 'https://thetalkplace.com/cover/Background-02.jpg', link: 'cover/Background-02.jpg' },
    { src: 'https://thetalkplace.com/cover/Background-03.jpg', link: 'cover/Background-03.jpg' },
    { src: 'https://thetalkplace.com/cover/Background-04.jpg', link: 'cover/Background-04.jpg' },
    { src: 'https://thetalkplace.com/cover/Background-05.jpg', link: 'cover/Background-05.jpg' },
    { src: 'https://thetalkplace.com/cover/Background-06.jpg', link: 'cover/Background-06.jpg' },
    { src: 'https://thetalkplace.com/cover/Background-07.jpg', link: 'cover/Background-07.jpg' },
    { src: 'https://thetalkplace.com/cover/Background-08.jpg', link: 'cover/Background-08.jpg' },
    { src: 'https://thetalkplace.com/cover/Background-09.jpg', link: 'cover/Background-09.jpg' },
    { src: 'https://thetalkplace.com/cover/Background-10.jpg', link: 'cover/Background-10.jpg' }
] : [
    { src: 'https://cloudart.com.au/confessionapi/cover/Background-01.jpg', link: '/cover/Background-01.jpg' },
    { src: 'https://cloudart.com.au/confessionapi/cover/Background-02.jpg', link: '/cover/Background-02.jpg' },
    { src: 'https://cloudart.com.au/confessionapi/cover/Background-03.jpg', link: '/cover/Background-03.jpg' },
    { src: 'https://cloudart.com.au/confessionapi/cover/Background-04.jpg', link: '/cover/Background-04.jpg' },
    { src: 'https://cloudart.com.au/confessionapi/cover/Background-05.jpg', link: '/cover/Background-05.jpg' },
    { src: 'https://cloudart.com.au/confessionapi/cover/Background-06.jpg', link: '/cover/Background-06.jpg' },
    { src: 'https://cloudart.com.au/confessionapi/cover/Background-07.jpg', link: '/cover/Background-07.jpg' },
    { src: 'https://cloudart.com.au/confessionapi/cover/Background-08.jpg', link: '/cover/Background-08.jpg' },
    { src: 'https://cloudart.com.au/confessionapi/cover/Background-09.jpg', link: '/cover/Background-09.jpg' },
    { src: 'https://cloudart.com.au/confessionapi/cover/Background-10.jpg', link: '/cover/Background-10.jpg' }
]

export {
    showAdsAfter_Feed,
    maxCharAllowedOnPostComment,
    maxImageSizeAllowed_Feed,
    forum_types,
    next_auth_status,
    sharePWLTiles
}
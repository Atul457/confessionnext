import { envConfig } from "./envConfig";

const showAdsAfter_Feed = 7;
const maxImageSizeAllowed_Feed = 2048;
const maxCharAllowedOnPostComment = 2000;
const forum_types = { private: 2, public: 1, closed: 3 };
const next_auth_status = {
  unauthenticated: "unauthenticated",
  loading: "loading",
  authenticated: "authenticated",
};
const pageCategoryTypes = {
  forum: "FORUM",
  confession: "CONFESSION",
  search: "SEARCH"
}

const sharePWLTiles = envConfig.isProdMode
  ? [
    {
      src: "https://thetalkplace.com/cover/Background-01.jpg",
      link: "cover/Background-01.jpg",
    },
    {
      src: "https://thetalkplace.com/cover/Background-02.jpg",
      link: "cover/Background-02.jpg",
    },
    {
      src: "https://thetalkplace.com/cover/Background-03.jpg",
      link: "cover/Background-03.jpg",
    },
    {
      src: "https://thetalkplace.com/cover/Background-04.jpg",
      link: "cover/Background-04.jpg",
    },
    {
      src: "https://thetalkplace.com/cover/Background-05.jpg",
      link: "cover/Background-05.jpg",
    },
    {
      src: "https://thetalkplace.com/cover/Background-06.jpg",
      link: "cover/Background-06.jpg",
    },
    {
      src: "https://thetalkplace.com/cover/Background-07.jpg",
      link: "cover/Background-07.jpg",
    },
    {
      src: "https://thetalkplace.com/cover/Background-08.jpg",
      link: "cover/Background-08.jpg",
    },
    {
      src: "https://thetalkplace.com/cover/Background-09.jpg",
      link: "cover/Background-09.jpg",
    },
    {
      src: "https://thetalkplace.com/cover/Background-10.jpg",
      link: "cover/Background-10.jpg",
    },
  ]
  : [
    {
      src: "https://cloudart.com.au/confessionapi/cover/Background-01.jpg",
      link: "/cover/Background-01.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/cover/Background-02.jpg",
      link: "/cover/Background-02.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/cover/Background-03.jpg",
      link: "/cover/Background-03.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/cover/Background-04.jpg",
      link: "/cover/Background-04.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/cover/Background-05.jpg",
      link: "/cover/Background-05.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/cover/Background-06.jpg",
      link: "/cover/Background-06.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/cover/Background-07.jpg",
      link: "/cover/Background-07.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/cover/Background-08.jpg",
      link: "/cover/Background-08.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/cover/Background-09.jpg",
      link: "/cover/Background-09.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/cover/Background-10.jpg",
      link: "/cover/Background-10.jpg",
    },
  ];

const avatars = envConfig.isProdMode
  ? [
    {
      src: "https://thetalkplace.com/avatar/Avatar-1.jpg",
      link: "avatar/Avatar-1.jpg",
    },
    {
      src: "https://thetalkplace.com/avatar/Avatar-2.jpg",
      link: "avatar/Avatar-2.jpg",
    },
    {
      src: "https://thetalkplace.com/avatar/Avatar-3.jpg",
      link: "avatar/Avatar-3.jpg",
    },
    {
      src: "https://thetalkplace.com/avatar/Avatar-4.jpg",
      link: "avatar/Avatar-4.jpg",
    },
    {
      src: "https://thetalkplace.com/avatar/Avatar-5.jpg",
      link: "avatar/Avatar-5.jpg",
    },
    {
      src: "https://thetalkplace.com/avatar/Avatar-6.jpg",
      link: "avatar/Avatar-6.jpg",
    },
    {
      src: "https://thetalkplace.com/avatar/Avatar-7.jpg",
      link: "avatar/Avatar-7.jpg",
    },
    {
      src: "https://thetalkplace.com/avatar/Avatar-8.jpg",
      link: "avatar/Avatar-8.jpg",
    },
    {
      src: "https://thetalkplace.com/avatar/Avatar-9.jpg",
      link: "avatar/Avatar-9.jpg",
    },
    {
      src: "https://thetalkplace.com/avatar/Avatar-10.jpg",
      link: "avatar/Avatar-10.jpg",
    },
    {
      src: "https://thetalkplace.com/avatar/Avatar-11.jpg",
      link: "avatar/Avatar-11.jpg",
    },
    {
      src: "https://thetalkplace.com/avatar/Avatar-12.jpg",
      link: "avatar/Avatar-12.jpg",
    },
    {
      src: "https://thetalkplace.com/avatar/Avatar-13.jpg",
      link: "avatar/Avatar-13.jpg",
    },
    {
      src: "https://thetalkplace.com/avatar/Avatar-14.jpg",
      link: "avatar/Avatar-14.jpg",
    },
    {
      src: "https://thetalkplace.com/avatar/Avatar-15.jpg",
      link: "avatar/Avatar-15.jpg",
    },
    {
      src: "https://thetalkplace.com/avatar/Avatar-16.jpg",
      link: "avatar/Avatar-16.jpg",
    },
    {
      src: "https://thetalkplace.com/avatar/Avatar-17.jpg",
      link: "avatar/Avatar-17.jpg",
    },
    {
      src: "https://thetalkplace.com/avatar/Avatar-18.jpg",
      link: "avatar/Avatar-18.jpg",
    },
    {
      src: "https://thetalkplace.com/avatar/Avatar-19.jpg",
      link: "avatar/Avatar-19.jpg",
    },
    {
      src: "https://thetalkplace.com/avatar/Avatar-20.jpg",
      link: "avatar/Avatar-20.jpg",
    },
  ]
  : [
    {
      src: "https://cloudart.com.au/confessionapi/avatar/Avatar-1.jpg",
      link: "/avatar/Avatar-1.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/avatar/Avatar-2.jpg",
      link: "/avatar/Avatar-2.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/avatar/Avatar-3.jpg",
      link: "/avatar/Avatar-3.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/avatar/Avatar-4.jpg",
      link: "/avatar/Avatar-4.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/avatar/Avatar-5.jpg",
      link: "/avatar/Avatar-5.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/avatar/Avatar-6.jpg",
      link: "/avatar/Avatar-6.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/avatar/Avatar-7.jpg",
      link: "/avatar/Avatar-7.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/avatar/Avatar-8.jpg",
      link: "/avatar/Avatar-8.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/avatar/Avatar-9.jpg",
      link: "/avatar/Avatar-9.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/avatar/Avatar-10.jpg",
      link: "/avatar/Avatar-10.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/avatar/Avatar-11.jpg",
      link: "/avatar/Avatar-11.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/avatar/Avatar-12.jpg",
      link: "/avatar/Avatar-12.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/avatar/Avatar-13.jpg",
      link: "/avatar/Avatar-13.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/avatar/Avatar-14.jpg",
      link: "/avatar/Avatar-14.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/avatar/Avatar-15.jpg",
      link: "/avatar/Avatar-15.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/avatar/Avatar-16.jpg",
      link: "/avatar/Avatar-16.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/avatar/Avatar-17.jpg",
      link: "/avatar/Avatar-17.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/avatar/Avatar-18.jpg",
      link: "/avatar/Avatar-18.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/avatar/Avatar-19.jpg",
      link: "/avatar/Avatar-19.jpg",
    },
    {
      src: "https://cloudart.com.au/confessionapi/avatar/Avatar-20.jpg",
      link: "/avatar/Avatar-20.jpg",
    },
  ];

const layoutTypes = {
  blank: "blank_layout",
  userlayout: "user_layout"
}

export {
  showAdsAfter_Feed,
  maxCharAllowedOnPostComment,
  maxImageSizeAllowed_Feed,
  forum_types,
  next_auth_status,
  sharePWLTiles,
  avatars,
  pageCategoryTypes,
  layoutTypes
};

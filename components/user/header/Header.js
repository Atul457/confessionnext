import React from "react";
import AppLogo from "../../common/AppLogo";
import HeadMenu from "./HeadMenus";
import UserIcon from "./UserIcon";
import { signOut } from "next-auth/react";

const Header = (props) => {
  // Logs the user out
  const logout = async () => {
    await signOut({ redirect: false });
  };

  return (
    <header className="mainHead col-12 posFixedForHeader">
      <button onClick={logout}>logout</button>
      <div className="insideHeader">
        <div className="headerLeftCol pl-0">
          <span to="/home" className="homeHeaderLink">
            <AppLogo />
          </span>
        </div>

        <div className="viewProfileIcon pr-md-0 pr-lg-4">
          <div className="row align-items-center justify-content-end m-0 navigationIcons">
            <HeadMenu />
            <UserIcon />
          </div>
        </div>
      </div>

      <div className={`roundCorners ${props.hideRound ? "d-none" : ""}`}>
        __
      </div>
    </header>
  );
};

export default Header;

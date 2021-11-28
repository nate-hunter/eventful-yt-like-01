import React from "react";
import { NavLink } from "react-router-dom";
import Wrapper from "../styles/Navbar";
import GoogleAuth from "./GoogleAuth";
import { AppsIcon, EventfulLogoIcon, HamburgerIcon, SettingsIcon } from "./Icons";
import Search from "./Search";

function Navbar({ toggleSideBar }) {

  return (
    <Wrapper>
      <div className="logo flex-row">
        <HamburgerIcon className="toggle-navhandler" onClick={toggleSideBar} />
        <span>
          <NavLink to="/">
            <EventfulLogoIcon
              style={{
                width: 160,
                height: 24,
              }}
            />
          </NavLink>
        </span>
      </div>

      <Search />

      <ul>
        <li>
          {/* Don't need this icon... */}
          <AppsIcon />
        </li>
        <li>
          <SettingsIcon />
        </li>
        <li>
          {" "}
          <GoogleAuth />
        </li>
      </ul>
    </Wrapper>
  );
}

export default Navbar;

import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import Wrapper from "../styles/Navbar";
import GoogleAuth from "./GoogleAuth";
import { AppsIcon, EventfulLogoIcon, HamburgerIcon, SettingsIcon } from "./Icons";
import Search from "./Search";
import UploadVideo from "./UploadVideo";
import UserDropdown from "./UserDropdown";

function Navbar({ toggleSideBar }) {

  const user = useAuth();

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
          {/* Don't need the AppsIcon icon idt... */}
          {user ? <UploadVideo /> : <AppsIcon />}
        </li>
        <li>
          {user ? <AppsIcon /> : <SettingsIcon />}
        </li>
        <li>
          {user ? <UserDropdown user={user} /> : <GoogleAuth />}
        </li>
      </ul>
    </Wrapper>
  );
}

export default Navbar;

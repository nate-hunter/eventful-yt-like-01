import React from "react";
import Wrapper from "../styles/Navbar";
import GoogleAuth from "./GoogleAuth";
import { AppsIcon, EventfulLogoIcon, HamburgerIcon, LogoIcon, SettingsIcon } from "./Icons";
import Search from "./Search";

function Navbar() {
  return (
    <Wrapper>
      <div className="logo flex-row">
        <HamburgerIcon className="toggle-navhandler" />
        <span>
          <EventfulLogoIcon
            style={{
              width: 160,
              height: 24,
            }}
          />
        </span>
      </div>

      <Search />

      <ul>
        <li>
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

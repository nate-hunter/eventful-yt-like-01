import { Menu, MenuButton, MenuItem, MenuList } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import React from "react";
import { useHistory } from "react-router-dom";
import Avatar from "../styles/Avatar";
import { signoutUser } from "../utils/api-client";
import { ChannelIcon, SignoutIcon } from "./Icons";

const UserDropdown = ({ user }) => {
  const history = useHistory();

  return (
    <Menu>
      <MenuButton>
        {user ? (
          <Avatar
            className="pointer"
            src={user.avatar}
            alt={user.username}
          />
        ) : (
          <Avatar
            className="pointer"
            src="https://dummyimage.com/100x100"
            alt="username avatar"
          />
        )}
      </MenuButton>
      <MenuList>
        <MenuItem onSelect={() => history.push(`/channel/${user.id}`)}>
          <ChannelIcon />
          <span>Your channel</span>
        </MenuItem>
        <MenuItem onSelect={signoutUser}>
          <SignoutIcon />
          <span>Sign out</span>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default UserDropdown;

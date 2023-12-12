import { useState, useEffect, Fragment } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import "./Media.css";
import { PageProps } from "../shared/types";
import {
  selectMediaTypeChosen,
  updateMediaTypeChosen,
} from "../features/users/usersSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

export const AvatarNavMenu = ({
  hasPages,
  userImageUrl,
  userName,
  onClickLogout,
}: {
  hasPages: PageProps[];
  userImageUrl: string | null;
  userName: string | null;
  onClickLogout?: (
    event: React.MouseEvent<HTMLElement>
  ) => Promise<void> | undefined;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e: React.MouseEvent<HTMLElement>, pageKey: String) => {
    setAnchorEl(null);
    // maybe set run onClickLogout here??????
    if (onClickLogout && pageKey === "logout") {
      //Argument of type 'MouseEvent' is not assignable to parameter of type 'MouseEvent<HTMLElement, MouseEvent>'.

      onClickLogout(e);
    }
  };

  console.log("inside avatar ", userName);
  console.log("inside avatar ", onClickLogout);
  // pass a key and update to=... and Typography children..
  const renderMenuList = hasPages.map(
    (page) => {
      const [urlPage, text] = Object.entries(page)[0];
      console.log(`it is login url ${urlPage === "logout"}`);
      let targetUrl = urlPage === "logout" ? "/" : `/${urlPage}`;
      console.log("target url", targetUrl);
      return (
        <MenuItem
          key={text}
          component={RouterLink}
          to={targetUrl}
          onClick={(e: React.MouseEvent<HTMLElement>) =>
            handleClose(e, urlPage)
          }
        >
          <ListItemIcon>
            <FavoriteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography>{text}</Typography> {/*confused heree.....*/}
          </ListItemText>
        </MenuItem>
      );
    }
    // return the menu list here.....
  );

  return (
    <div>
      <Avatar
        id="user-avatar"
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        component="button"
        src={userImageUrl || ""}
        alt={userName || ""}
        sx={{
          backgroundColor: "#ED6C02",
          border: "none",
          textDecoration: "none",
        }}
        onClick={handleClick}
      />
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "user-avatar",
        }}
      >
        {renderMenuList}
      </Menu>
    </div>
  );
};

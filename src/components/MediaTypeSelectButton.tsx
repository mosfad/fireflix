import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import "./Media.css";
import {
  selectMediaTypeChosen,
  updateMediaTypeChosen,
} from "../features/users/usersSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import { MediaTypeProps, MediaTimeWindowProps } from "../shared/types";

const options = ["Movie", "TV", "All", "Person"];

export const MediaTypeSelectButton = () => {
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    let mediaType = options[selectedIndex].toLowerCase();
    dispatch(updateMediaTypeChosen(mediaType));
  }, [selectedIndex]);

  return (
    <div className="media-type__dropdown-btn">
      <List
        component="nav"
        aria-label="Device settings"
        sx={
          {
            /*bgcolor: 'background.paper'*/
          }
        }
      >
        <ListItem
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClickListItem}
        >
          <Button
            variant="outlined"
            // color="secondary"
            sx={{
              color: "white",
              border: "solid #ffffff4a 2px",
              borderRadius: "1rem",
              "&:hover": {
                border: "solid white 2px",
              },
            }}
            endIcon={<ArrowDropDownIcon />}
          >
            {options[selectedIndex]}
          </Button>
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock={true}
        MenuListProps={{
          "aria-labelledby": "lock-button",
          role: "listbox",
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

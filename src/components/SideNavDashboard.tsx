import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Avatar from '@mui/material/Avatar';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';

const drawerWidth = 240;

export const SideNavDashboard = () => {
  const [open, setOpen] = useState<boolean>(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // e.preventDefault();
    setOpen(!open);
  };
  return (
    <Drawer
      variant="permanent"
      sx={{
        // width: '20%' /*drawerWidth*/,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: '16.67%', boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Avatar
                  sx={{ bgcolor: '#ED6C02' }}
                  alt="Remy Sharp"
                  src="/broken-image.jpg"
                >
                  B
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary="Modupe Fadina"
                secondary="maafadina@gmail.com"
              ></ListItemText>
              <ListItemIcon>
                <ChevronRightIcon />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleClick}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List>
              <ListItem disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ManageAccountsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <LockIcon />
                  </ListItemIcon>
                  <ListItemText primary="Password" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Notifications" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <HelpCenterIcon />
                  </ListItemIcon>
                  <ListItemText primary="Help" />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>
        </List>
        <Divider />
        <Box sx={{ pl: 2, pb: 2, pt: 3 }}>
          <Typography align="left" sx={{ pb: 1 }}>
            Favorites
          </Typography>
          <FormGroup>
            <FormControlLabel control={<Checkbox />} label="Movies" />
            <FormControlLabel control={<Checkbox />} label="TV" />
          </FormGroup>
        </Box>
        <Divider />
        <Box sx={{ pl: 2, pb: 2, pt: 3 }}>
          <Typography align="left" sx={{ pb: 1 }}>
            Media
          </Typography>

          <RadioGroup
            aria-labelledby="media-radio-buttons-group-label"
            defaultValue="Movies"
            name="radio-buttons-group"
          >
            <FormControlLabel
              value="movies"
              control={<Radio />}
              label="Movies"
            />
            <FormControlLabel value="tv" control={<Radio />} label="TV" />
          </RadioGroup>
        </Box>
        <Divider />
        <Box sx={{ pl: 2, pb: 2, pt: 3 }}>
          <FormLabel
            id="demo-radio-buttons-group-label"
            sx={{ textAlign: 'left' }}
            component="p"
          >
            Genre
          </FormLabel>

          {/* <Typography align="left" sx={{ pb: 1 }}>
            Genre
          </Typography> */}

          <FormGroup>
            <FormControlLabel control={<Checkbox />} label="Horror" />
            <FormControlLabel control={<Checkbox />} label="Action" />
            <FormControlLabel control={<Checkbox />} label="Comedy" />
            <FormControlLabel control={<Checkbox />} label="Drama" />
            <FormControlLabel control={<Checkbox />} label="Romantic" />
            <FormControlLabel control={<Checkbox />} label="Documentary" />
          </FormGroup>
        </Box>
        <Divider />
      </Box>
    </Drawer>
  );
};

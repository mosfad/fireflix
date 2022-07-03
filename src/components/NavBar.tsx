import './NavBar.css';
import * as React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  logoutUser,
  selectAuthUser,
  selectLoginStatus,
} from '../features/auth/authSlice';
import { resetLoggedoutUser } from '../features/users/usersSlice';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
// import MenuIcon from '@mui/icons-material/Menu';
import FireplaceIcon from '@mui/icons-material/Fireplace';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useAuth } from '../hooks/useAuth';
import '../App.css';
import Avatar from '@mui/material/Avatar';
import { MediaTypeSelectButton } from './MediaTypeSelectButton';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

type UserMenuDisplayProps = 'none' | 'flex';

export function NavBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [userMenuDisplay, setUserMenuDisplay] =
    React.useState<UserMenuDisplayProps>('none');

  // const auth = useAuth();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => selectAuthUser(state));
  const isLoggedin = useAppSelector((state) => selectLoginStatus(state));

  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogoutClick = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    // await auth?.logoutUser();
    await dispatch(resetLoggedoutUser());
    await dispatch(logoutUser());
    navigate('/');
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="secondary"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <RouterLink className="btn__logo" to="/">
              <FireplaceIcon />
            </RouterLink>
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            color="secondary"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Fireflix
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <MediaTypeSelectButton />
          <Box sx={{ flexGrow: 1 }} />
          {!user ? (
            <Stack spacing={2} direction="row">
              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                size="large"
                color="secondary"
              >
                {/* <Link className="btn__link--white" to="/signup">
                Sign up
              </Link> */}
                Sign up
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                size="large"
                color="secondary"
                sx={
                  {
                    /*color: '#ffffff'*/
                  }
                }
              >
                {/* <Link className="btn__link--white" to="/login">
                Log in
              </Link> */}
                Log in
              </Button>
            </Stack>
          ) : (
            <Stack spacing={2} direction="row">
              <Button
                component={RouterLink}
                to="/"
                variant="outlined"
                size="large"
                color="secondary"
                sx={
                  {
                    /*color: '#ffffff'*/
                  }
                }
                onClick={handleLogoutClick}
              >
                {/* <Link className="btn__link--white" to="/login">
                Log in
              </Link> */}
                Log out
              </Button>
              <Avatar
                component={RouterLink}
                to="/dashboard"
                src="/broken-image.jpg"
                alt="Modupe Fadina"
                sx={{
                  backgroundColor: '#ED6C02',
                  textDecoration: 'none',
                }}
              />
            </Stack>
          )}
          <Box sx={{ display: `${userMenuDisplay}` }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}

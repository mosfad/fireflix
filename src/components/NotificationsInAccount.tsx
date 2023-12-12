import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ClearIcon from '@mui/icons-material/Clear';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { Divider } from '@mui/material';

export const NotificationsInAccount = () => {
  const notifications = [
    'Welcome Dupe! Thanks for signing up for our app on July 19, 2021',
    'You updated your profile on July 25, 2021. Please contact us if it was not you.',
    'Merry Christmas Dupe! Checkout the popular movies for the holiday season.',
  ];
  return (
    <Box
      sx={{
        // width: '100%',
        backgroundColor: '#535353',
        borderRadius: '.5rem',
        padding: '1rem 4rem 3rem 4rem',
        marginBottom: '3rem',
        mt: 8,
        color: 'white',
      }}
    >
      <Typography
        variant="h5"
        component="h3"
        gutterBottom
        align="left"
        sx={{ color: 'white', mb: 2 }}
      >
        Notifications
      </Typography>
      <List
        sx={{
          backgroundColor: '#2b2b2bd9',
          paddingTop: '0',
          paddingBottom: '0',
          borderRadius: '0.5rem',
        }}
      >
        <ListItem>
          <ListItemIcon>
            <NotificationsActiveIcon sx={{ fill: '#ffd484' }} />
          </ListItemIcon>
          <ListItemText
            sx={{
              '& .MuiListItemText-primary': {
                letterSpacing: '1px',
              },
            }}
            primary="Welcome Dupe! Thanks for signing up for our app on July 19, 2021"
          />
          <ListItemButton
            sx={{
              justifyContent: 'flex-end',
              width: '100%',
              maxWidth: '3rem',
              '&:hover': {
                backgroundColor: '#9692921f',
              },
            }}
          >
            <ClearIcon sx={{ fill: 'red' }} />
          </ListItemButton>
        </ListItem>
        <Divider sx={{ borderColor: '#929292' }} />
        <ListItem>
          <ListItemIcon>
            <NotificationsActiveIcon sx={{ fill: '#ffd484' }} />
          </ListItemIcon>
          <ListItemText
            sx={{
              '& .MuiListItemText-primary': {
                letterSpacing: '1px',
              },
            }}
            primary="You updated your profile on July 25, 2021. Please contact us if it was not you."
          />
          <ListItemButton
            sx={{
              justifyContent: 'flex-end',
              width: '100%',
              maxWidth: '3rem',
              '&:hover': {
                backgroundColor: '#9692921f',
              },
            }}
          >
            <ClearIcon sx={{ fill: 'red' }} />
          </ListItemButton>
        </ListItem>
        <Divider sx={{ borderColor: '#929292' }} />
        <ListItem>
          <ListItemIcon>
            <NotificationsActiveIcon sx={{ fill: '#ffd484' }} />
          </ListItemIcon>
          <ListItemText
            sx={{
              '& .MuiListItemText-primary': {
                letterSpacing: '1px',
              },
            }}
            primary="Merry Christmas Dupe! Checkout the popular movies for the holiday season."
          />
          <ListItemButton
            sx={{
              justifyContent: 'flex-end',
              width: '100%',
              maxWidth: '3rem',
              '&:hover': {
                backgroundColor: '#9692921f',
              },
            }}
          >
            <ClearIcon sx={{ fill: 'red' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

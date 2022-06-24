import React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

export const Footer = () => {
  return (
    // <Box
    //   sx={{
    //     backgroundColor: 'blue',
    //     color: 'white',
    //     height: '4rem',
    //     zIndex: '3000',
    //   }}
    // >
    <BottomNavigation
      showLabels
      component="footer"
      sx={{
        position: 'relative',
        backgroundColor: '#434343',
        height: '4rem',
      }}
    >
      <BottomNavigationAction label="Dupe Fadina" sx={{ color: 'white' }} />
    </BottomNavigation>
    //</Box>
  );
};

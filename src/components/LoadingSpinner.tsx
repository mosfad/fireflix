import * as React from 'react';
import { createPortal } from 'react-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function LoadingSpinner() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100vh',
      }}
    >
      <CircularProgress
        color="secondary"
        size="4rem"
        sx={{ marginTop: '7rem' }}
      />
    </Box>
  );
}

// const loader: HTMLElement | null = document.getElementById('loader');
// export default function LoadingSpinner() {
//   return createPortal(
//     <Box
//       sx={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'flex-start',
//         height: '100vh',
//       }}
//     >
//       <CircularProgress
//         color="secondary"
//         size="4rem"
//         sx={{ marginTop: '7rem' }}
//       />
//     </Box>,
//     loader as HTMLElement
//   );
// }

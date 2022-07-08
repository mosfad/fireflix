import * as React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';
import { MediaTypeProps } from '../shared/types';

export const MediaDialog = ({
  open,
  closeDialog,
  action,
  mediaType,
}: {
  open: boolean;
  closeDialog: () => void;
  action: string;
  mediaType: MediaTypeProps;
}) => {
  return (
    <div>
      <Dialog
        open={open}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {action === 'favorite'
            ? `Add ${mediaType} to favorites?`
            : `See more content on this ${mediaType}?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {action === 'favorite'
              ? 'Sign up to save favorite movies and tv shows.'
              : 'Sign up to enjoy content from movies and shows'}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
          }}
        >
          <Button
            component={RouterLink}
            to="/signup"
            type="submit"
            size="small"
            color="secondary"
            variant="contained"
            sx={{
              flexGrow: '1',
              // width: '70%',
              // height: '3.5rem',
              // marginTop: '2rem',
              // marginBottom: '5rem',
            }}
            onClick={closeDialog}
          >
            Sign up
          </Button>
        </DialogActions>
        <Typography
          sx={{ paddingLeft: '1.5rem', fontSize: '0.75rem', color: '#373737' }}
          gutterBottom
        >
          Already have an account?{' '}
          <Typography
            component={RouterLink}
            to="/login"
            sx={{
              textDecoration: 'none',
              fontSize: '0.75rem',
              // color: '#b655e0',
            }}
          >
            Log in
          </Typography>
        </Typography>
      </Dialog>
    </div>
  );
};

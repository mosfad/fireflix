import React, {
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
  MouseEvent,
} from 'react';

import Snackbar from '@mui/material/Snackbar';
import { ErrorProps } from '../shared/types';
import Alert from '@mui/material/Alert';
import { getUIErrorMessage } from '../shared/helpers';
import { SettingsPowerRounded } from '@mui/icons-material';

export const ErrorAlert = ({
  error,
  open,
  onHandleOpenOrClose,
}: {
  error: ErrorProps | null;
  open: boolean;
  onHandleOpenOrClose: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // const [open, setOpen] = useState<boolean>(false);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    onHandleOpenOrClose(false);
  };
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        color="error"
        severity="error"
        sx={{ width: '100%' }}
        variant="filled"
      >
        {error?.message
          ? getUIErrorMessage(error)
          : 'Invalid email or password!'}
      </Alert>
    </Snackbar>
  );
};

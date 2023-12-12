import React, {
  useState,
  useEffect,
  useRef,
  FormEvent,
  ChangeEvent,
  MouseEvent,
} from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { useFormikContext, Formik } from 'formik';
import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FilledInput from '@mui/material/FilledInput';
import FormHelperText from '@mui/material/FormHelperText';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  registerUser,
  selectAuthUser,
  updateProfileUser,
  updateEmailUser,
  reauthenticateUser,
  updateDisplayName,
  selectAuthError,
  updatePasswordUser,
} from '../features/auth/authSlice';
import { getCurrentUser } from '../services/authServices';
import { addUserDatabase, getUserDatabase } from '../features/users/usersSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import type { ErrorProps } from '../shared/types';
import { getUIErrorMessage, sleep } from '../shared/helpers';
import { useAuth } from '../hooks/useAuth';

const validationSchema = Yup.object({
  name: Yup.string().min(3).required('Name required on signup'),
  email: Yup.string().email().required('Email is required'),
  oldPassword: Yup.string().min(
    8,
    'Password should be of minimum 8 character length'
  ),
  newPassword: Yup.string().min(
    8,
    'Password should be of minimum 8 character length'
  ),
  confirmNewPassword: Yup.string().oneOf(
    [Yup.ref('newPassword'), null],
    'Passwords must match'
  ),
});

//Alternative to <EditProfileForm/> via formkik context
//it's incomplete!.

export const UpdateFormExternal = () => {
  const formikProps = useFormikContext();

  useEffect(() => {});

  return null;
};

export const UpdateProfileForm = ({
  onChangePasswordReauth,
  onChangeDisplayName,
  isClearPassword,
}: {
  onChangePasswordReauth: React.Dispatch<React.SetStateAction<string>>;
  onChangeDisplayName: React.Dispatch<React.SetStateAction<string>>;
  isClearPassword: boolean;
}) => {
  const dispatch = useAppDispatch();

  const currUserObject = useAuth();
  let fbaseUser = currUserObject ? currUserObject.currUser : null;

  const error = useAppSelector((state) => selectAuthError(state));
  const user = useAppSelector((state) => selectAuthUser(state));
  // const userId = user?.uid;
  const currEmail = user?.email;
  const currName = user?.displayName;
  const currPhotoURL = user?.photoURL;

  const handleVisibilityToggle = (e: MouseEvent<HTMLButtonElement>) => {
    //setHidePassword((prevState) => !prevState);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    //setOpen(false);
  };
};

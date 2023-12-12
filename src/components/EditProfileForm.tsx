import React, {
  useState,
  useEffect,
  useRef,
  FormEvent,
  ChangeEvent,
  MouseEvent,
} from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { useFormik } from 'formik';
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

type ProfileStateProps = {
  name: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

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

export const EditProfileForm = ({
  onChangePasswordReauth,
  onChangeDisplayName,
  isClearPassword,
}: {
  onChangePasswordReauth: React.Dispatch<React.SetStateAction<string>>;
  onChangeDisplayName: React.Dispatch<React.SetStateAction<string>>;
  isClearPassword: boolean;
}) => {
  // const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const currUserObject = useAuth();
  let fbaseUser = currUserObject ? currUserObject.currUser : null;

  //const firebaseUser = getCurrentUser(); // used to reautheticate users

  const error = useAppSelector((state) => selectAuthError(state));
  const user = useAppSelector((state) => selectAuthUser(state));
  // const userId = user?.uid;
  const currEmail = user?.email;
  const currName = user?.displayName;
  const currPhotoURL = user?.photoURL;
  const errorMessg = error?.message;

  const [hidePassword, setHidePassword] = useState<boolean>(true);

  //const [name, setName] = useState<string>(''); // ?
  //const [email, setEmail] = useState<string>(''); // ?
  //const [password, setPassword] = useState<string>('');
  //const [newPassword, setNewPassword] = useState<string>('');
  //const [hasConfirmNewPassword, setHasConfirmNewPassword] = useState<boolean>(false);
  //const [photoUrl, setPhotoUrl] = useState<string>(''); //?

  const [open, setOpen] = useState<boolean>(false);

  //const passRef = useRef<HTMLInputElement>(null);

  const handleVisibilityToggle = (e: MouseEvent<HTMLButtonElement>) => {
    setHidePassword((prevState) => !prevState);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      name: currName || '',
      email: currEmail,
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      photoUrl: currPhotoURL || '',
      // hidePassword: true,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const {
        name,
        email,
        oldPassword,
        newPassword,
        confirmNewPassword,
        photoUrl,
      } = values;

      console.log(values);

      // To do: validate user for critical action performed.
      // I am here
      if (name && email) {
        await dispatch(reauthenticateUser({ email, password: oldPassword }));

        // if name changed
        //if (name !== currName) setName(name);

        // if photoURL changed
        //if (photoUrl !== currPhotoURL) setPhotoUrl(photoUrl);

        // if email changed
        //if (email !== currEmail) setEmail(email);

        // if password changed
        //if (newPassword !== '' && newPassword !== oldPassword)
        //setNewPassword(newPassword);

        // Form should update, not reset!!!
        // ❌resetForm();
      }
    },
  });

  const { name, email, newPassword, photoUrl } = formik.values;

  const handleAuthChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    switch (e.target.id) {
      case 'oldPassword':
        // setPassword(e.target.value);
        onChangePasswordReauth(e.target.value); //lifted state from <UserAccountPage/>
        break;
      case 'name':
        // setName(e.target.value);
        onChangeDisplayName(e.target.value); //lifted state from <UserAccountPage/>
        break;
    }
    formik.setFieldValue(e.target.id, e.target.value);
  };

  // To do: update profile if user edits name (UploadPhotoForm handles photoUrl)
  useEffect(() => {
    if (name !== '') {
      const updateProfile = async () => {
        dispatch(updateProfileUser({ currentUser: fbaseUser, name, photoUrl }));
      };
      updateProfile();
    }
  }, [name]);

  //  To do: update profile if user edits email
  useEffect(() => {
    if (email !== '') {
      // this condition seems unnecessary
      const updateEmail = async () => {
        dispatch(updateEmailUser(email as string));
      };
      updateEmail();
    }
  }, [email]);

  // To do: update profile if user edits password
  useEffect(() => {
    if (newPassword !== '') {
      const updatePassword = async () => {
        dispatch(updatePasswordUser(newPassword));
      };
      updatePassword();
    }
  }, [newPassword]);

  useEffect(() => {
    //console.log('isClear effect is running');
    if (isClearPassword) {
      // reset password via react use state hook.
      //setPassword('');
      // reset password via `formik` state & helper
      // to reset password after it's been cleared.
      formik.setFieldValue('oldPassword', '');
    }
  }, [isClearPassword]);

  return (
    <Box
      component="form"
      sx={{
        // width: '40rem',
        // backgroundColor: 'inherit',
        mt: 8,
        // backgroundColor: 'rgba(0, 0, 0, .75)',
        '& .MuiTextField-root, & .MuiFormControl-root': {
          // m: 4,
          mb: 4,
          width: '100%',
          backgroundColor: '#2b2b2bd9',
          borderTopLeftRadius: '.5rem',
          borderTopRightRadius: '.5rem',
        },
        '& .MuiFormHelperText-root': {
          borderTop: '1px solid red',
          margin: 0,
          paddingLeft: '14px',
          color: 'red',
          backgroundColor: 'rgba(0, 0, 0, .1)',
        },
      }}
      noValidate
      onSubmit={formik.handleSubmit}
      autoComplete="off"
    >
      <Box
        sx={{
          // width: '100%',
          backgroundColor: '#535353',
          borderRadius: '.5rem',
          padding: '1rem 4rem',
          marginBottom: '3rem',
        }}
      >
        <FormControl
          sx={{
            // borderRadius: '.5rem',
            // color: 'white',
            // backgroundColor: '#5E5E5E',
            marginTop: '2rem',
          }}
          variant="filled"
        >
          <InputLabel htmlFor="name">name</InputLabel>
          <FilledInput
            sx={{
              // color: 'white',
              // backgroundColor: '#00000075',
              borderTopLeftRadius: '.5rem',
              borderTopRightRadius: '.5rem',
            }}
            id="name"
            type="text"
            value={formik.values.name}
            onChange={(e) => {
              handleAuthChange(e);
              console.log(formik);
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
          />
          {formik.touched.name && formik.errors.name && (
            <FormHelperText>{formik.errors.name}</FormHelperText>
          )}
        </FormControl>

        <FormControl
          sx={
            {
              // color: 'white',
              // backgroundColor: '#5E5E5E',
            }
          }
          variant="filled"
        >
          <InputLabel htmlFor="email">email</InputLabel>
          <FilledInput
            sx={{
              color: 'white',
              // backgroundColor: '#00000075',
              borderTopLeftRadius: '.5rem',
              borderTopRightRadius: '.5rem',
            }}
            id="email"
            type="text"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
          />
          {formik.touched.email && formik.errors.email && (
            <FormHelperText>{formik.errors.email}</FormHelperText>
          )}
        </FormControl>
      </Box>

      <Box
        sx={{
          // width: '100%',
          backgroundColor: '#535353',
          borderRadius: '.5rem',
          padding: '1rem 4rem',
          marginBottom: '3rem',
        }}
      >
        <FormControl
          sx={{
            // color: 'white',
            // backgroundColor: '#5E5E5E',
            marginTop: '2rem',
          }}
          variant="filled"
        >
          <InputLabel htmlFor="oldPassword">Old Password</InputLabel>
          <FilledInput
            sx={{
              color: 'white',
              // backgroundColor: '#5E5E5E',
              borderTopLeftRadius: '.5rem',
              borderTopRightRadius: '.5rem',
            }}
            //ref={passRef}
            id="oldPassword"
            type={hidePassword ? 'password' : 'text'}
            value={formik.values.oldPassword}
            onChange={(e) => {
              handleAuthChange(e);
              console.log(formik);
            }} //update here....
            onBlur={formik.handleBlur}
            error={
              formik.touched.oldPassword && Boolean(formik.errors.oldPassword)
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleVisibilityToggle}
                >
                  {' '}
                  {hidePassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          {formik.touched.oldPassword && formik.errors.oldPassword && (
            <FormHelperText>{formik.errors.oldPassword}</FormHelperText>
          )}
        </FormControl>

        <FormControl
          sx={
            {
              // color: 'white',
              // backgroundColor: '#5E5E5E',
            }
          }
          variant="filled"
        >
          <InputLabel htmlFor="newPassword">New Password</InputLabel>
          <FilledInput
            sx={{
              color: 'white',
              // backgroundColor: '#5E5E5E',
              borderTopLeftRadius: '.5rem',
              borderTopRightRadius: '.5rem',
            }}
            id="newPassword"
            type={hidePassword ? 'password' : 'text'}
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.newPassword && Boolean(formik.errors.newPassword)
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleVisibilityToggle}
                >
                  {' '}
                  {hidePassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          {formik.touched.newPassword && formik.errors.newPassword && (
            <FormHelperText>{formik.errors.newPassword}</FormHelperText>
          )}
        </FormControl>
        <FormControl
          sx={
            {
              // color: 'white',
              // backgroundColor: '#5E5E5E',
            }
          }
          variant="filled"
        >
          <InputLabel htmlFor="confirmNewPassword">Confirm Password</InputLabel>
          <FilledInput
            sx={{
              color: 'white',
              // backgroundColor: '#5E5E5E',
              borderTopLeftRadius: '.5rem',
              borderTopRightRadius: '.5rem',
            }}
            id="confirmNewPassword"
            type={hidePassword ? 'password' : 'text'}
            value={formik.values.confirmNewPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmNewPassword &&
              Boolean(formik.errors.confirmNewPassword)
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleVisibilityToggle}
                >
                  {' '}
                  {hidePassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          {formik.touched.confirmNewPassword &&
            formik.errors.confirmNewPassword && (
              <FormHelperText>
                {formik.errors.confirmNewPassword}
              </FormHelperText>
            )}
        </FormControl>
      </Box>

      <Box sx={{ textAlign: 'left' }}>
        <Button
          type="submit"
          size="large"
          color="secondary"
          variant="contained"
          sx={{
            width: '50%',
            height: '3.5rem',
            // marginTop: '2rem',
            marginBottom: '5rem',
            letterSpacing: '1px',
          }}
        >
          Update Profile
        </Button>
      </Box>
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
    </Box>
  );
};

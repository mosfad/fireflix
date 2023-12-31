import { useState, useEffect, FormEvent, ChangeEvent, MouseEvent } from 'react';
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
import { useAuth } from '../hooks/useAuth';
import { valueToPercent } from '@mui/base';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  registerUser,
  selectAuthUser,
  updateProfileUser,
  updateDisplayName,
  selectAuthError,
} from '../features/auth/authSlice';
import { addUserDatabase, getUserDatabase } from '../features/users/usersSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import type { ErrorProps } from '../shared/types';
import { getUIErrorMessage, sleep } from '../shared/helpers';

type SignupStateProps = {
  name: string;
  email: string;
  state?: string;
  country?: string;
  password: string;
  confirmPassword?: string;
  hidePassword: boolean;
};

// type TimeDelayProp = number;

const validationSchema = Yup.object({
  name: Yup.string().min(3).required('Name required on signup'),
  email: Yup.string().email().required('Email is required'),
  password: Yup.string()
    .min(8, 'Password should be of minimum 8 character length')
    .required('Password is required'),
});

export const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const error = useAppSelector((state) => selectAuthError(state));
  const user = useAppSelector((state) => selectAuthUser(state));
  const userId = user?.uid;
  const email = user?.email;
  const errorMessg = error?.message;

  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');

  const [open, setOpen] = useState<boolean>(false);

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

  // const auth = useAuth();

  useEffect(() => {
    const setupNewUser = async () => {
      if (userId && email && !errorMessg) {
        console.log('New user has been added...');
        // update profile
        await dispatch(updateProfileUser({ name, photoUrl }));
        // update display name
        await dispatch(updateDisplayName(name));
        // create user account in db
        await dispatch(addUserDatabase({ name, email, uid: userId }));
        // get user account from db
        await dispatch(getUserDatabase(userId));
        // to to user dashboard.
        navigate('/dashboard', { replace: true });
      }
    };
    setupNewUser();
  }, [userId, email, errorMessg]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      photoUrl: '',
      // hidePassword: true,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const { name, email, password, photoUrl } = values;
      // const user = await auth?.createUser(
      //   values.email,
      //   values.password,
      //   values.name,
      //   values.photoURL
      // );
      // register
      if (name && name !== '') setName(name);
      if (photoUrl && photoUrl !== '') setPhotoUrl(photoUrl);
      await dispatch(registerUser({ name, email, password }));
      await sleep(300);
      console.log(user);
      console.log(user?.uid);
      if (!user) {
        console.log('User is not logged in!');
        setOpen(true);
      }
      // console.log(auth?.user);
      // setSubmitting(false);
      resetForm();
    },
  });

  return (
    <Paper
      component="form"
      sx={{
        width: '30rem',
        backgroundColor: 'rgba(0, 0, 0, .75)',
        '& .MuiTextField-root, & .MuiFormControl-root': {
          m: 2,
          width: '70%',
          height: 'auto',
          marginTop: 2,
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
      <Box sx={{ width: '80%', marginLeft: '4rem', marginTop: '4rem' }}>
        <Typography
          gutterBottom
          align="left"
          component="h3"
          variant="h4"
          sx={{ color: 'white' }}
        >
          Sign Up
        </Typography>
      </Box>
      <div>
        <FormControl
          sx={
            {
              // color: 'white',
              // backgroundColor: '#5E5E5E',
            }
          }
          variant="filled"
        >
          <InputLabel htmlFor="name">name</InputLabel>
          <FilledInput
            sx={{
              color: 'white',
              backgroundColor: '#5E5E5E',
            }}
            id="name"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
          />
          {formik.touched.name && formik.errors.name && (
            <FormHelperText>{formik.errors.name}</FormHelperText>
          )}
        </FormControl>
      </div>

      <div>
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
              backgroundColor: '#5E5E5E',
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
      </div>
      <div>
        <FormControl
          sx={
            {
              // color: 'white',
              // backgroundColor: '#5E5E5E',
            }
          }
          variant="filled"
        >
          <InputLabel htmlFor="password">Password</InputLabel>
          <FilledInput
            sx={{
              color: 'white',
              backgroundColor: '#5E5E5E',
            }}
            id="password"
            type={hidePassword ? 'password' : 'text'}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
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
          {formik.touched.password && formik.errors.password && (
            <FormHelperText>{formik.errors.password}</FormHelperText>
          )}
        </FormControl>
      </div>
      <div>
        <Button
          type="submit"
          size="large"
          color="secondary"
          variant="contained"
          sx={{
            width: '70%',
            height: '3.5rem',
            marginTop: '2rem',
            marginBottom: '5rem',
          }}
        >
          Submit
        </Button>
      </div>
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
    </Paper>
  );
};

// export const SignupForm = () => {
//   const [values, setValues] = useState<SignupStateProps>({
//     name: '',
//     email: '',
//     state: '',
//     country: '',
//     password: '',
//     confirmPassword: '',
//     hidePassword: true,
//   });

//   const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     console.log('Clicked submit', e);
//   };

//   const onChangHandler =
//     (props: keyof SignupStateProps) => (e: ChangeEvent<HTMLInputElement>) => {
//       setValues({ ...values, [props]: e.target.value });
//       console.log(`Inputing ${e.target.type}`);
//     };

//   const onClickVisibilityHandler = (e: MouseEvent<HTMLButtonElement>) => {
//     setValues((prevState) => ({
//       ...values,
//       hidePassword: !prevState.hidePassword,
//     }));
//   };

//   return (
//     <Paper
//       component="form"
//       sx={{
//         width: '30rem',
//         backgroundColor: 'rgba(0, 0, 0, .75)',
//         // marginTop: '5rem',
//         // paddingTop: '3rem',
//         '& .MuiTextField-root, & .MuiFormControl-root': {
//           m: 2,
//           width: '70%',
//           height: 'auto',
//           marginTop: 2,
//         },
//       }}
//       noValidate
//       onSubmit={onSubmitHandler}
//       autoComplete="off"
//     >
//       <Box sx={{ width: '80%', marginLeft: '4rem', marginTop: '4rem' }}>
//         <Typography
//           gutterBottom
//           align="left"
//           component="h3"
//           variant="h4"
//           sx={{ color: 'white' }}
//         >
//           Sign Up
//         </Typography>
//       </Box>
//       <div>
//         <TextField
//           id="filled-required-name"
//           label="Name"
//           variant="filled"
//           sx={{
//             marginTop: '10rem',
//             color: 'white',
//             backgroundColor: '#5E5E5E',
//           }}
//           onChange={onChangHandler('name')}
//         />
//       </div>

//       <div>
//         <TextField
//           id="filled-required-email"
//           label="Email"
//           variant="filled"
//           sx={{
//             marginTop: '10rem',
//             color: 'white',
//             backgroundColor: '#5E5E5E',
//           }}
//           onChange={onChangHandler('email')}
//         />
//       </div>

//       <FormControl
//         sx={{
//           color: 'white',
//           backgroundColor: '#5E5E5E',
//         }}
//         variant="filled"
//       >
//         <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
//         <FilledInput
//           id="filled-adornment-password"
//           type={values.hidePassword ? 'password' : 'text'}
//           value={values.password}
//           onChange={onChangHandler('password')}
//           endAdornment={
//             <InputAdornment position="end">
//               <IconButton
//                 aria-label="toggle password visibility"
//                 onClick={onClickVisibilityHandler}
//               >
//                 {' '}
//                 {values.hidePassword ? <Visibility /> : <VisibilityOff />}
//               </IconButton>
//             </InputAdornment>
//           }
//         />
//       </FormControl>
//       <div>
//         <Button
//           type="submit"
//           size="large"
//           color="secondary"
//           variant="contained"
//           sx={{
//             width: '70%',
//             height: '3.5rem',
//             marginTop: '2rem',
//             marginBottom: '5rem',
//           }}
//         >
//           Submit
//         </Button>
//       </div>
//     </Paper>
//   );
// };

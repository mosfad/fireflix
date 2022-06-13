import React, {
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
  MouseEvent,
} from 'react';
import { User } from 'firebase/auth';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  fetchUser,
  selectAuthUser,
  selectLoginStatus,
  selectAuthStatus,
  selectAuthError,
} from '../features/auth/authSlice';
import { getUserDatabase } from '../features/users/usersSlice';
import { Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
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
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { getUIErrorMessage, sleep } from '../shared/helpers';

// type LoginStateProps = {
//   email: string;
//   password: string;
//   hidePassword: boolean;
// };

// type AuthContextHook = {
//   createUser: (email: string, password: string) => unknown;
//   logoutUser: () => unknown;
//   isAuthenticating: boolean;
//   signinUser: (email: string, password: string) => unknown;
//   user: unknown | null;
// };
// type TimeDelayProp = number;

const validationSchema = Yup.object({
  email: Yup.string().email().required('Email is required'),
  password: Yup.string()
    .min(8, 'Password should be of minimum 8 character length')
    .required('Password is required'),
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => selectAuthUser(state));
  const userId = user?.uid;

  const error = useAppSelector((state) => selectAuthError(state));
  const isLoggedin = useAppSelector((state) => selectLoginStatus(state));
  const isAuthenticating = useAppSelector((state) => selectAuthStatus(state));

  const [hidePassword, setHidePassword] = useState<boolean>(true);
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

  useEffect(() => {
    const loginAuthUser = async () => {
      if (isLoggedin && userId && !isAuthenticating) {
        // get user account from db
        await dispatch(getUserDatabase(userId));
        // go to user dashboard
        navigate('/dashboard', { replace: true });
      }
    };
    loginAuthUser();
  }, [isLoggedin, userId, isAuthenticating]);

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        const { email, password } = values;
        await dispatch(fetchUser({ email, password }));
        await sleep(600);
        if (!isAuthenticating && !isLoggedin && !userId) {
          console.log('User is not logged in!');
          setOpen(true);
        }

        // if (!user && !auth?.isAuthenticating) setOpen(true);
        // else {
        //   navigate('/dashboard', { replace: true });
        // }
        resetForm();
        // auth?.user ? navigate('/dashboard') : navigate('/');
        // navigate('/dashboard', { replace: true });}
      }}
    >
      {(formik) => (
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
              Sign In
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
              )}{' '}
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
                error={
                  formik.touched.password && Boolean(formik.errors.password)
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
              severity="error"
              sx={{ width: '100%' }}
            >
              {error?.message
                ? getUIErrorMessage(error)
                : 'Invalid email or password!'}
            </Alert>
          </Snackbar>
        </Paper>
      )}
    </Formik>
  );
};

// export const LoginForm = ({
//   user,
//   authenticate,
//   signin,
// }: {
//   user: User | null | undefined;
//   authenticate: boolean | undefined;
//   signin: any;
//   // signin: (
//   //   email: string,
//   //   password: string
//   // ) => Promise<void | ErrorProps> | undefined;
// }) => {
//   const auth = useAuth();

//   const [userInfo, setUserInfo] = useState<User | null>(null);

//   const [hidePassword, setHidePassword] = useState<boolean>(true);
//   const [open, setOpen] = useState<boolean>(false);

//   const handleVisibilityToggle = (e: MouseEvent<HTMLButtonElement>) => {
//     setHidePassword((prevState) => !prevState);
//   };

//   const handleClose = (
//     event?: React.SyntheticEvent | Event,
//     reason?: string
//   ) => {
//     if (reason === 'clickaway') {
//       return;
//     }

//     setOpen(false);
//   };

//   const navigate = useNavigate();

//   useEffect(() => {
//     console.log('Inside useEffect-> LoginForm');
//     console.log(auth);
//     // console.log(auth?.isAuthenticating);
//     if (auth?.user && !auth?.isAuthenticating) {
//       // console.log('User is now logged in!!!');
//       setUserInfo(auth?.user);
//       navigate('/dashboard', { replace: true });
//     }
//   }, [auth?.user, auth?.isAuthenticating]);

//   return (
//     <Formik
//       initialValues={{ email: '', password: '' }}
//       validationSchema={validationSchema}
//       onSubmit={async (values, { resetForm }) => {
//         await auth?.signinUser(values.email, values.password);
//         // await sleep(600);
//         // console.log(auth?.user);
//         // console.log(user);
//         // console.log(auth?.isAuthenticating);
//         // setSubmitting(false);

//         // if (!auth?.isAuthenticating && auth?.user) {
//         //   navigate('/dashboard', { replace: true });
//         // } else {
//         //   setOpen(true);
//         // }
//         await sleep(300);
//         if (!auth?.user && auth?.isAuthenticating) {
//           console.log('User is not logged in!');
//           setOpen(true);
//         }

//         // if (!user && !auth?.isAuthenticating) setOpen(true);
//         // else {
//         //   navigate('/dashboard', { replace: true });
//         // }
//         resetForm();
//         // auth?.user ? navigate('/dashboard') : navigate('/');
//         // navigate('/dashboard', { replace: true });}
//       }}
//     >
//       {(formik) => (
//         <Paper
//           component="form"
//           sx={{
//             width: '30rem',
//             backgroundColor: 'rgba(0, 0, 0, .75)',
//             '& .MuiTextField-root, & .MuiFormControl-root': {
//               m: 2,
//               width: '70%',
//               height: 'auto',
//               marginTop: 2,
//             },
//             '& .MuiFormHelperText-root': {
//               borderTop: '1px solid red',
//               margin: 0,
//               paddingLeft: '14px',
//               color: 'red',
//               backgroundColor: 'rgba(0, 0, 0, .1)',
//             },
//           }}
//           noValidate
//           onSubmit={formik.handleSubmit}
//           autoComplete="off"
//         >
//           <Box sx={{ width: '80%', marginLeft: '4rem', marginTop: '4rem' }}>
//             <Typography
//               gutterBottom
//               align="left"
//               component="h3"
//               variant="h4"
//               sx={{ color: 'white' }}
//             >
//               Sign In
//             </Typography>
//           </Box>

//           <div>
//             <FormControl
//               sx={
//                 {
//                   // color: 'white',
//                   // backgroundColor: '#5E5E5E',
//                 }
//               }
//               variant="filled"
//             >
//               <InputLabel htmlFor="email">email</InputLabel>
//               <FilledInput
//                 sx={{
//                   color: 'white',
//                   backgroundColor: '#5E5E5E',
//                 }}
//                 id="email"
//                 type="text"
//                 value={formik.values.email}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={formik.touched.email && Boolean(formik.errors.email)}
//               />
//               {formik.touched.email && formik.errors.email && (
//                 <FormHelperText>{formik.errors.email}</FormHelperText>
//               )}{' '}
//             </FormControl>
//           </div>
//           <div>
//             <FormControl
//               sx={
//                 {
//                   // color: 'white',
//                   // backgroundColor: '#5E5E5E',
//                 }
//               }
//               variant="filled"
//             >
//               <InputLabel htmlFor="password">Password</InputLabel>
//               <FilledInput
//                 sx={{
//                   color: 'white',
//                   backgroundColor: '#5E5E5E',
//                 }}
//                 id="password"
//                 type={hidePassword ? 'password' : 'text'}
//                 value={formik.values.password}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 error={
//                   formik.touched.password && Boolean(formik.errors.password)
//                 }
//                 endAdornment={
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label="toggle password visibility"
//                       onClick={handleVisibilityToggle}
//                     >
//                       {' '}
//                       {hidePassword ? <Visibility /> : <VisibilityOff />}
//                     </IconButton>
//                   </InputAdornment>
//                 }
//               />
//               {formik.touched.password && formik.errors.password && (
//                 <FormHelperText>{formik.errors.password}</FormHelperText>
//               )}
//             </FormControl>
//           </div>
//           <div>
//             <Button
//               type="submit"
//               size="large"
//               color="secondary"
//               variant="contained"
//               sx={{
//                 width: '70%',
//                 height: '3.5rem',
//                 marginTop: '2rem',
//                 marginBottom: '5rem',
//               }}
//             >
//               Submit
//             </Button>
//           </div>
//           <Snackbar
//             anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//             open={open}
//             autoHideDuration={6000}
//             onClose={handleClose}
//           >
//             <Alert
//               onClose={handleClose}
//               severity="error"
//               sx={{ width: '100%' }}
//             >
//               Invalid email or password!
//             </Alert>
//           </Snackbar>
//         </Paper>
//       )}
//     </Formik>
//   );
// };

// export const LoginForm = () => {
//   const auth = useAuth();
//   // console.log(auth);

//   const [hidePassword, setHidePassword] = useState<boolean>(true);
//   const [open, setOpen] = useState<boolean>(false);
//   const [currentUser, setCurrentuser] = useState<User | null | undefined>(
//     () => {
//       return auth?.user;
//     }
//   );
//   const handleVisibilityToggle = (e: MouseEvent<HTMLButtonElement>) => {
//     setHidePassword((prevState) => !prevState);
//   };

//   const handleClose = (
//     event?: React.SyntheticEvent | Event,
//     reason?: string
//   ) => {
//     if (reason === 'clickaway') {
//       return;
//     }

//     setOpen(false);
//   };

//   const navigate = useNavigate();

//   const formik = useFormik({
//     initialValues: {
//       email: '',
//       password: '',
//       // hidePassword: true,
//     },
//     validationSchema,
//     onSubmit: async (values, { resetForm }) => {
//       await auth?.signinUser(values.email, values.password);
//       // setCurrentuser(auth?.user);
//       // await sleep(600);
//       console.log(auth?.user);
//       console.log(auth?.isAuthenticating);
//       // setSubmitting(false);

//       if (!auth?.user && !auth?.isAuthenticating) setOpen(true);
//       else {
//         navigate('/dashboard', { replace: true });
//       }
//       resetForm();
//       // auth?.user ? navigate('/dashboard') : navigate('/');
//       // navigate('/dashboard', { replace: true });
//     },
//   });
//   // console.log(formik);

//   return (
//     <Paper
//       component="form"
//       sx={{
//         width: '30rem',
//         backgroundColor: 'rgba(0, 0, 0, .75)',
//         '& .MuiTextField-root, & .MuiFormControl-root': {
//           m: 2,
//           width: '70%',
//           height: 'auto',
//           marginTop: 2,
//         },
//         '& .MuiFormHelperText-root': {
//           borderTop: '1px solid red',
//           margin: 0,
//           paddingLeft: '14px',
//           color: 'red',
//           backgroundColor: 'rgba(0, 0, 0, .1)',
//         },
//       }}
//       noValidate
//       onSubmit={formik.handleSubmit}
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
//           Sign In
//         </Typography>
//       </Box>

//       <div>
//         <FormControl
//           sx={
//             {
//               // color: 'white',
//               // backgroundColor: '#5E5E5E',
//             }
//           }
//           variant="filled"
//         >
//           <InputLabel htmlFor="email">email</InputLabel>
//           <FilledInput
//             sx={{
//               color: 'white',
//               backgroundColor: '#5E5E5E',
//             }}
//             id="email"
//             type="text"
//             value={formik.values.email}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             error={formik.touched.email && Boolean(formik.errors.email)}
//           />
//           {formik.touched.email && formik.errors.email && (
//             <FormHelperText>{formik.errors.email}</FormHelperText>
//           )}{' '}
//         </FormControl>
//       </div>
//       <div>
//         <FormControl
//           sx={
//             {
//               // color: 'white',
//               // backgroundColor: '#5E5E5E',
//             }
//           }
//           variant="filled"
//         >
//           <InputLabel htmlFor="password">Password</InputLabel>
//           <FilledInput
//             sx={{
//               color: 'white',
//               backgroundColor: '#5E5E5E',
//             }}
//             id="password"
//             type={hidePassword ? 'password' : 'text'}
//             value={formik.values.password}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             error={formik.touched.password && Boolean(formik.errors.password)}
//             endAdornment={
//               <InputAdornment position="end">
//                 <IconButton
//                   aria-label="toggle password visibility"
//                   onClick={handleVisibilityToggle}
//                 >
//                   {' '}
//                   {hidePassword ? <Visibility /> : <VisibilityOff />}
//                 </IconButton>
//               </InputAdornment>
//             }
//           />
//           {formik.touched.password && formik.errors.password && (
//             <FormHelperText>{formik.errors.password}</FormHelperText>
//           )}
//         </FormControl>
//       </div>
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
//       <Snackbar
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//         open={open}
//         autoHideDuration={6000}
//         onClose={handleClose}
//       >
//         <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
//           Invalid email or password!
//         </Alert>
//       </Snackbar>
//     </Paper>
//   );
// };

// export const LoginForm = () => {
//   const [values, setValues] = useState<LoginStateProps>({
//     email: '',
//     password: '',
//     hidePassword: true,
//   });

//   const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     console.log('Clicked submit', e);
//   };

//   const onChangHandler =
//     (props: keyof LoginStateProps) => (e: ChangeEvent<HTMLInputElement>) => {
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
//           Sign In
//         </Typography>
//       </Box>

//       <div>
//         <TextField
//           id="filled-required"
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
//       <div>
//         <FormControl
//           sx={{
//             color: 'white',
//             backgroundColor: '#5E5E5E',
//           }}
//           variant="filled"
//         >
//           <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
//           <FilledInput
//             id="filled-adornment-password"
//             type={values.hidePassword ? 'password' : 'text'}
//             value={values.password}
//             onChange={onChangHandler('password')}
//             endAdornment={
//               <InputAdornment position="end">
//                 <IconButton
//                   aria-label="toggle password visibility"
//                   onClick={onClickVisibilityHandler}
//                 >
//                   {' '}
//                   {values.hidePassword ? <Visibility /> : <VisibilityOff />}
//                 </IconButton>
//               </InputAdornment>
//             }
//           />
//         </FormControl>
//       </div>
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

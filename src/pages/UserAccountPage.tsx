import { useState, useEffect, useMemo } from 'react';
import { Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { UploadPhotoForm } from './UploadPhotoForm';
import { NotificationsInAccount } from '../components/NotificationsInAccount';
import { EditProfileForm } from '../components/EditProfileForm';
import { ErrorAlert } from '../components/ErrorAlert';
// import { deleteUser } from '../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  registerUser,
  selectAuthUser,
  updateProfileUser,
  updateEmailUser,
  reauthenticateUser,
  selectReAuthStatus,
  updateDisplayName,
  selectAuthError,
  updatePasswordUser,
  deleteUser,
} from '../features/auth/authSlice';
import {
  deleteUserAccount,
  reauthenticateUserCred,
} from '../services/authServices';
import { useAuth } from '../hooks/useAuth';
import { LoginData } from '../shared/types';
import { UserCredential } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { AppUser, ErrorProps } from '../shared/types';

export const UserAccountPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => selectAuthUser(state));
  // const hasReauthenticated = useAppSelector((state) =>
  //   selectReAuthStatus(state)
  // );

  const userEmail = user?.email;
  const currentUserObject = useAuth();
  let fbaseUser = currentUserObject ? currentUserObject.currUser : null;

  const [open, setOpen] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  const [hasPressedDelete, setHasPressedDelete] = useState<boolean>(false);
  const [hasUserCred, setHasUserCred] = useState<boolean>(false);
  const [isClearPassword, setIsClearPassword] = useState<boolean>(true);
  const [userCred, setUserCred] = useState<UserCredential | null>(null);
  const [passwordForReauth, setPasswordForReauth] = useState<string>('');
  const [errorReauth, setErrorReauth] = useState<ErrorProps>({
    code: '',
    message: '',
  });

  // const memoizedErrorReauth = useMemo(() => {
  //   return errorReauth;
  // }, [code]);
  const [updatedName, setUpdatedName] = useState<string>('');
  const handleDeleteBtnClick: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    setHasPressedDelete(true);
  };

  // Controls alert for errors.
  const handleOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const reset = () => {
    setHasPressedDelete(false);
    setPasswordForReauth('');
    setIsClearPassword(true);
    setErrorReauth({ code: '', message: '' });
  };

  // Controls photo upload (dialog/modal)
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const memoizedUserCred = useMemo(() => userCred, [a, b])

  // reauthenticate if delete button was pressed & user is signed in.
  useEffect(() => {
    if (hasPressedDelete && fbaseUser && !hasUserCred) {
      const reauthenticate = async () => {
        const isResponseError = (
          apiResponse: any
        ): apiResponse is ErrorProps => {
          return typeof apiResponse?.message === 'string';
        };

        try {
          let userCredential = await reauthenticateUserCred(
            fbaseUser,
            userEmail as string,
            passwordForReauth
          );
          console.log(userCredential);
          if (isResponseError(userCredential)) {
            setErrorReauth(userCredential);
            setHasUserCred(false);
          } else {
            setUserCred(userCredential as UserCredential);
            setHasUserCred(true);
          }
        } catch (err) {
          console.log(err);
          /*if (err instanceof FirebaseError) {
             setErrorReauth(err);
             setHasUserCred(false);
          }*/
        }
      };

      // don't reauthenticate if password is empty; alert user.
      if (passwordForReauth === '') {
        setErrorReauth({
          code: 'auth/missing-password',
          message: 'Please enter valid password to update or delete account',
        });
        setOpenAlert(true);
        // setHasPressedDelete(false);
        // send alert to user to enter password
      } else {
        reauthenticate();
      }
    }
  }, [hasPressedDelete]);

  // alert user with error message after unsuccesssfully  deleting account
  useEffect(() => {
    if (errorReauth.code !== '' && hasPressedDelete) {
      setOpenAlert(true);
    }
  }, [errorReauth.code]);

  // update password state when user enters password
  useEffect(() => {
    if (passwordForReauth === '') {
      setIsClearPassword(true);
    } else {
      setIsClearPassword(false);
    }
  }, [passwordForReauth]);

  // reset state variables after unsuccessfully deleting account.
  useEffect(() => {
    if (!openAlert && hasPressedDelete) {
      reset();
    }
  }, [openAlert]);

  // delete user if user credential changed & delete button was pressed....
  // maybe memioze || useRef?????
  useEffect(() => {
    if (hasPressedDelete && hasUserCred && userCred) {
      const deleteAcct = async () => {
        try {
          await deleteUserAccount(userCred.user);
          // To do: remove user from firestore database
          // send user to homepage.
          // navigate('/', { replace: true });
        } catch (err) {
          console.log(err);
        }
      };
      deleteAcct();
    }
  }, [hasPressedDelete, hasUserCred]);

  //
  // useEffect(() => {
  //   if (hasPressedDelete && fbaseUser) {
  //     console.log('I am about to delete my account');
  //     const deleteAcct = async () => {
  //       try {
  //         // reauthenticate user; lift state from <EditProfileForm/>
  //         if (userEmail && passwordForReauth) {
  //           console.log(userEmail, passwordForReauth);
  //           await dispatch(
  //             reauthenticateUser({
  //               email: userEmail,
  //               password: passwordForReauth,
  //             })
  //           );
  //         }

  //         // delete user on successful reauthentication
  //         if (hasReauthenticated) {
  //           await dispatch(deleteUser(fbaseUser));
  //           setHasPressedDelete(false);
  //           // To do: remove user from firestore database
  //           // send user to homepage.
  //           navigate('/', { replace: true });
  //         } else {
  //           alert('Please enter password before deleting account');
  //         }
  //         // How do I get password from <EditProfileForm/>
  //       } catch (err) {
  //         console.log(err);
  //         setHasPressedDelete(false);
  //       }
  //     };
  //     deleteAcct();
  //   }
  // }, [hasPressedDelete]);
  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <Grid item sx={{ marginTop: '6rem', ml: 6 }}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          sx={{ color: 'white' }}
        >
          Profile Details
        </Typography>
        <Grid container justifyContent="flex-start">
          <Avatar
            src={user?.photoURL || ''}
            alt="Modupe Fadina"
            sx={{
              backgroundColor: '#ED6C02',
              border: 'none',
              textDecoration: 'none',
              width: '180px',
              height: '180px',
            }}
          />
          <IconButton
            color="warning"
            aria-label="upload picture"
            component="span"
            onClick={handleClickOpen}
            sx={{ marginLeft: '2rem' }}
          >
            <PhotoCamera sx={{ fill: '#ffd484', fontSize: '2rem' }} />
          </IconButton>
        </Grid>

        <UploadPhotoForm
          onClickOpen={handleClickOpen}
          onClickClose={handleClose}
          openProp={open}
        />
      </Grid>
      <Grid item sx={{ width: '100%' }}>
        <Grid
          container
          justifyContent="flex-start"
          sx={
            {
              /*ml: 6, mr: 6 */
            }
          }
        >
          <Grid item sx={{ flexBasis: '50%', pr: 8, pl: 8 }}>
            <EditProfileForm
              onChangePasswordReauth={setPasswordForReauth}
              onChangeDisplayName={setUpdatedName}
              isClearPassword={isClearPassword}
            />
          </Grid>
          <Grid item sx={{ flexBasis: '50%', pr: 8, pl: 8 }}>
            <NotificationsInAccount />
            {/* <Box
              sx={{
                // width: '100%',
                backgroundColor: '#535353',
                borderRadius: '.5rem',
                padding: '1rem 4rem',
                marginBottom: '3rem',
                color: 'white',
              }}
            >
              Contact Info
            </Box> */}
            <Box
              sx={{
                // width: '100%',
                backgroundColor: '#535353',
                borderRadius: '.5rem',
                padding: '1rem 4rem',
                marginBottom: '3rem',
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
                Delete Account
              </Typography>
              <Box
                sx={{
                  textAlign: 'left',
                  width: '100%',
                  backgroundColor: '#2b2b2bd9',
                  borderRadius: '.5rem',
                  pt: 3,
                  pb: 3,
                }}
              >
                <Typography sx={{ ml: 2 }}>
                  Please reconsider deleting your account. You will lose all
                  your favorite movies and tv shows.
                </Typography>
                <Button
                  color="error"
                  variant="contained"
                  sx={{
                    mt: 3,
                    ml: 2,
                    letterSpacing: '1px',
                  }}
                  onClick={handleDeleteBtnClick}
                >
                  Delete Account
                </Button>
              </Box>
              <ErrorAlert
                error={errorReauth}
                open={openAlert}
                onHandleOpenOrClose={setOpenAlert}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

// export const UserAccountPage = () => {
//   return (
//     <Grid
//       container
//       direction="column"
//       justifyContent="flex-start"
//       alignItems="flex-start"
//     >
//       <Grid item sx={{ marginTop: '6rem' }}>
//         <Paper
//           elevation={4}
//           sx={{ backgroundColor: '#4e4e4ebd', color: 'white', padding: '3rem' }}
//         >
//           {' '}
//           <Typography variant="h4" component="h2" gutterBottom>
//             Profile Details
//           </Typography>
//           <Avatar
//             src="/broken-image.jpg"
//             alt="Modupe Fadina"
//             sx={{
//               backgroundColor: '#ED6C02',
//               border: 'none',
//               textDecoration: 'none',
//             }}
//           />
//           <EditProfileForm />
//         </Paper>
//       </Grid>
//       <Grid item sx={{ width: '10rem', height: '10rem' }}>
//         <Paper elevation={4}>Change Password</Paper>
//       </Grid>
//       <Grid item sx={{ width: '10rem', height: '10rem' }}>
//         <Paper elevation={4}>Delete Account</Paper>
//       </Grid>
//     </Grid>
//   );
// };

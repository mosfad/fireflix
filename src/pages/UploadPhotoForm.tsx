import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  uploadPhotoUser,
  updateProfileUser,
  selectAuthUser,
  selectLoginStatus,
} from '../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CheckIcon from '@mui/icons-material/Check';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import { updateUserProfile } from '../services/authServices';

export const UploadPhotoForm = ({
  onClickOpen,
  onClickClose,
  openProp,
}: {
  onClickOpen: () => void;
  onClickClose: () => void;
  openProp: boolean;
}) => {
  const imageMimeType = /image\/(png|jpg|jpeg)/i;

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => selectAuthUser(state));
  const loginStatus = useAppSelector((state) => selectLoginStatus(state));

  const userName = user?.displayName as string; // type casting user name to a string

  const currUserObject = useAuth();
  let fbaseUser = currUserObject ? currUserObject.currUser : null;

  // let fbaseUser = currUserObject && currUserObject.currUser ? currUserObject.currUser : null;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hasChosenFile, setHasChosenFile] = useState<boolean>(false);
  // const [fileDataUrl, setFileDataUrl] = useState<string | undefined>();

  const fileRef = useRef<HTMLSpanElement | null>(null);
  const isDialogOpen = useRef<boolean>(true);
  // const BtnRef = useRef<HTMLButtonElement | null>(null);
  // let isDialogOpen = true;

  const fileRefStyles = {
    backgroundColor: '#504e4bd9', // alt color: #ffa50073
    borderRadius: '.5rem',
    paddingTop: '.5rem',
    paddingBottom: '.54rem',
    paddingLeft: '1.5rem',
    paddingRight: '2rem',
    padding: '.5rem, 2rem',
  };

  const resetFileRefStyles = {
    backgroundColor: 'none',
    borderRadius: 'none',
    paddingTop: '.0',
    paddingBottom: '0',
    paddingLeft: '0',
    paddingRight: '0',
  };

  // handle & update file selection
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { files } = e.target;
    const inputElem = e.target;
    if (files) {
      files[0].type.match(imageMimeType)
        ? setSelectedFile(files[0])
        : setSelectedFile(null);
    }
    if (!files) return;
    // file input not needed, already in selectedFile.
    inputElem.value = '';
    // console.log(files[0]);
  };

  // handle & update file selection via `drag & drop`
  const handleOnDrop: React.DragEventHandler<HTMLDivElement> | undefined = (
    e
  ) => {
    e.preventDefault();
    // using `DataTransferItemList API
    if (e.dataTransfer.items) {
      if (e.dataTransfer.items[0].kind === 'file') {
        const fileImg = e.dataTransfer.items[0].getAsFile();
        // setSelectedFile(fileImg);
        fileImg?.type.match(imageMimeType)
          ? setSelectedFile(fileImg)
          : setSelectedFile(null);
      }
    }
  };

  const handleOnDragOver: React.DragEventHandler<HTMLDivElement> | undefined = (
    e
  ) => {
    console.log('File in the drop zone');
    e.preventDefault();
  };

  const closeDialog = () => {
    setHasChosenFile(false);
    setSelectedFile(null);
    isDialogOpen.current = false;
    onClickClose();
  };
  const handleOnClose:
    | ((event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void)
    | undefined = () => {
    closeDialog();
  };

  const handleOnClickClose:
    | React.MouseEventHandler<HTMLButtonElement>
    | undefined = () => {
    closeDialog();
  };

  const handleFileRemove:
    | React.MouseEventHandler<HTMLButtonElement>
    | undefined = (e) => {
    setSelectedFile(null);
    //setFileDataUrl(undefined);
  };

  const handleFileUpload:
    | React.MouseEventHandler<HTMLButtonElement>
    | undefined = (e) => {
    setHasChosenFile(true);
  };

  // update user profile(photo)
  useEffect(() => {
    console.log(hasChosenFile, userName, fbaseUser, selectedFile);
    if (hasChosenFile && fbaseUser && selectedFile) {
      const updatePhoto = async () => {
        try {
          console.log(loginStatus);
          // task: Make API call to Firbase Storage Services to upload new photo file.
          // Via RTK, make API call to Firebase Auth Services to add new Photo URL.
          let urlFromStorage = await dispatch(
            uploadPhotoUser(selectedFile)
          ).unwrap();
          await dispatch(
            updateProfileUser({
              currentUser: fbaseUser,
              name: userName,
              photoUrl: urlFromStorage,
            })
          );
          closeDialog();
        } catch (err) {
          console.log('error from download', err);
        }
      };
      updatePhoto();
    }
  }, [hasChosenFile, userName]);
  // update dialog status when it's open
  useEffect(() => {
    if (openProp === true) isDialogOpen.current = true;
  }, [openProp]);

  // update UI when file is selected or deselected.
  useEffect(() => {
    if (selectedFile) {
      if (fileRef.current) {
        fileRef.current.textContent = selectedFile.name;
        Object.assign(fileRef.current.style, fileRefStyles);
      }
    } else {
      if (fileRef.current) {
        fileRef.current.textContent = '';
        Object.assign(fileRef.current.style, resetFileRefStyles);
      }
    }
  }, [selectedFile]);

  // read image as URL and show preview================ remove this  `useEffect`
  //=======================================================================================

  return (
    <div>
      <Dialog
        open={openProp}
        onClose={handleOnClose}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgb(255 255 255 / 50%)',
          },
          '& .MuiPaper-root': {
            backgroundColor: '#3c3a3a',
            width: '30rem', //width of dialog
          },
          '& .MuiDialogTitle-root, & .MuiDialogContent-root': {
            color: 'rgba(255, 255, 255, 0.9)',
          },

          //   '& .MuiDialogContent-root': {
          //     backgroundColor: '#3c3a3a',
          //   },
          //   backgroundColor: '#3c3a3a',
          //   color: 'rgba(255, 255, 255, 0.9',
        }}
      >
        <DialogTitle sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
          Add Display Photo
        </DialogTitle>
        <DialogContent>
          <Grid
            className="drop-box"
            onDrop={handleOnDrop}
            onDragOver={handleOnDragOver}
            direction="column"
            justifyContent="center"
            alignItems="center"
            container
            sx={{
              width: '100%',
              minWidth: '20rem',
              height: '12rem',
              border: '1px dashed #ffffffe6',
              mt: 3,
              mb: 2,
            }}
          >
            <Grid item>
              <FileUploadIcon fontSize="large" />
            </Grid>
            <Grid item>
              <Typography sx={{}}>Drag and Drop file here</Typography>
            </Grid>
            <Grid item sx={{ width: '100%' }}>
              <Divider
                variant="fullWidth"
                sx={{
                  '&::before, &::after': {
                    borderTop: 'thin solid #ffffff40',
                    marginLeft: '.5rem',
                    marginRight: '.5rem',
                  },
                }}
              >
                <Typography>or</Typography>
              </Divider>
            </Grid>
            <Grid item>
              <InputLabel
                htmlFor="filename"
                sx={{ textAlign: 'center', color: 'orange', cursor: 'pointer' }}
              >
                Browse files
              </InputLabel>
              <Input
                id="filename"
                type="file"
                onChange={handleFileChange}
                sx={{ display: 'none' }}
              />
            </Grid>
          </Grid>
          <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
            {selectedFile ? (
              <Avatar
                variant="circular"
                src={URL.createObjectURL(selectedFile)}
                alt="User Profile"
                sx={{ width: '200px', height: '200px' }}
              />
            ) : (
              // <img src={fileDataUrl} alt="User Profile" width="150px" />
              ''
            )}
          </Box>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography ref={fileRef} sx={{ color: '#ffffff' }}>
                {/*selectedFile ? selectedFile.name : ''*/}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton
                // ref={BtnRef}
                // sx={{ bottom: '6px' }}
                onClick={handleFileRemove}
              >
                {' '}
                {/*I don't know why 6px works??*/}
                {isDialogOpen && selectedFile ? (
                  <ClearIcon sx={{ fill: 'red' }} />
                ) : (
                  ''
                )}
              </IconButton>

              {/*add button styles directly   */}
            </Grid>
            <Grid item>
              <IconButton
                // ref={BtnRef}
                // sx={{ bottom: '6px' }}
                onClick={handleFileUpload} //***add profile pic on click */
              >
                {' '}
                {/*I don't know why 6px works??*/}
                {isDialogOpen && selectedFile ? (
                  <CheckIcon sx={{ fill: 'green' }} />
                ) : (
                  ''
                )}
              </IconButton>

              {/*add button styles directly   */}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="warning"
            onClick={handleFileRemove}
            sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// export const UploadPhotoForm = ({
//   onClickOpen,
//   onClickClose,
//   openProp,
// }: {
//   onClickOpen: () => void;
//   onClickClose: () => void;
//   openProp: boolean;
// }) => {
//   const imageMimeType = /image\/(png|jpg|jpeg)/i;

//   const dispatch = useAppDispatch();
//   const user = useAppSelector((state) => selectAuthUser(state));
//   const loginStatus = useAppSelector((state) => selectLoginStatus(state));

//   const userName = user?.displayName;

//   const currUserObject = useAuth();
//   let fbaseUser = currUserObject ? currUserObject.currUser : null;

//   // let fbaseUser = currUserObject && currUserObject.currUser ? currUserObject.currUser : null;

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [hasChosenFile, setHasChosenFile] = useState<boolean>(false);
//   const [fileDataUrl, setFileDataUrl] = useState<string | undefined>();

//   const fileRef = useRef<HTMLSpanElement | null>(null);
//   const isDialogOpen = useRef<boolean>(true);
//   // const BtnRef = useRef<HTMLButtonElement | null>(null);
//   // let isDialogOpen = true;

//   const fileRefStyles = {
//     backgroundColor: '#504e4bd9', // alt color: #ffa50073
//     borderRadius: '.5rem',
//     paddingTop: '.5rem',
//     paddingBottom: '.54rem',
//     paddingLeft: '1.5rem',
//     paddingRight: '2rem',
//     padding: '.5rem, 2rem',
//   };

//   const resetFileRefStyles = {
//     backgroundColor: 'none',
//     borderRadius: 'none',
//     paddingTop: '.0',
//     paddingBottom: '0',
//     paddingLeft: '0',
//     paddingRight: '0',
//   };

//   // handle & update file selection
//   const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
//     const { files } = e.target;
//     const inputElem = e.target;
//     if (files) {
//       files[0].type.match(imageMimeType)
//         ? setSelectedFile(files[0])
//         : setSelectedFile(null);
//     }
//     if (!files) return;
//     // file input not needed, already in selectedFile.
//     inputElem.value = '';
//     // console.log(files[0]);
//   };

//   // handle & update file selection via `drag & drop`
//   const handleOnDrop: React.DragEventHandler<HTMLDivElement> | undefined = (
//     e
//   ) => {
//     e.preventDefault();
//     // using `DataTransferItemList API
//     if (e.dataTransfer.items) {
//       if (e.dataTransfer.items[0].kind === 'file') {
//         const fileImg = e.dataTransfer.items[0].getAsFile();
//         // setSelectedFile(fileImg);
//         fileImg?.type.match(imageMimeType)
//           ? setSelectedFile(fileImg)
//           : setSelectedFile(null);
//       }
//     }
//   };

//   const handleOnDragOver: React.DragEventHandler<HTMLDivElement> | undefined = (
//     e
//   ) => {
//     console.log('File in the drop zone');
//     e.preventDefault();
//   };

//   const closeDialog = () => {
//     setSelectedFile(null);
//     isDialogOpen.current = false;
//     onClickClose();
//   };
//   const handleOnClose:
//     | ((event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void)
//     | undefined = () => {
//     closeDialog();
//   };

//   const handleOnClickClose:
//     | React.MouseEventHandler<HTMLButtonElement>
//     | undefined = () => {
//     closeDialog();
//   };

//   const handleFileRemove:
//     | React.MouseEventHandler<HTMLButtonElement>
//     | undefined = (e) => {
//     setSelectedFile(null);
//     setFileDataUrl(undefined);
//   };

//   const handleFileUpload:
//     | React.MouseEventHandler<HTMLButtonElement>
//     | undefined = (e) => {
//     setHasChosenFile(true);
//   };

//   // update user profile(photo)
//   useEffect(() => {
//     if (hasChosenFile && userName && fbaseUser && fileDataUrl) {
//       const updatePhoto = async () => {
//         try {
//           console.log(loginStatus);
//           // task: Make API call to Firbase Storage Services to upload new photo file.
//           // Via RTK, make API call to Firebase Auth Services to add new Photo URL.
//           await dispatch(
//             updateProfileUser({
//               currentUser: fbaseUser,
//               name: userName,
//               photoUrl: fileDataUrl,
//             })
//           );
//           closeDialog();
//         } catch (err) {
//           console.log(err);
//         }
//       };
//       updatePhoto();
//     }
//   });
//   // update dialog status when it's open
//   useEffect(() => {
//     if (openProp === true) isDialogOpen.current = true;
//   }, [openProp]);

//   // update UI when file is selected or deselected.
//   useEffect(() => {
//     if (selectedFile) {
//       if (fileRef.current) {
//         fileRef.current.textContent = selectedFile.name;
//         Object.assign(fileRef.current.style, fileRefStyles);
//       }
//     } else {
//       if (fileRef.current) {
//         fileRef.current.textContent = '';
//         Object.assign(fileRef.current.style, resetFileRefStyles);
//       }
//     }
//   }, [selectedFile]);

//   // read image as URL and show preview================ remove this  `useEffect`
//   useEffect(() => {
//     let fileReader: FileReader | null = null;
//     let isCancel = false;
//     if (selectedFile) {
//       fileReader = new FileReader();
//       fileReader.onload = (e) => {
//         const result = e.target?.result;
//         if (result && !isCancel) {
//           setFileDataUrl(result as string);
//         }
//       };
//       fileReader.readAsDataURL(selectedFile);
//     }

//     return () => {
//       isCancel = true;
//       if (fileReader && fileReader.readyState === 1) {
//         fileReader.abort();
//       }
//     };
//   }, [selectedFile]);
//   //=======================================================================================

//   return (
//     <div>
//       <Dialog
//         open={openProp}
//         onClose={handleOnClose}
//         sx={{
//           '& .MuiBackdrop-root': {
//             backgroundColor: 'rgb(255 255 255 / 50%)',
//           },
//           '& .MuiPaper-root': {
//             backgroundColor: '#3c3a3a',
//             width: '30rem', //width of dialog
//           },
//           '& .MuiDialogTitle-root, & .MuiDialogContent-root': {
//             color: 'rgba(255, 255, 255, 0.9)',
//           },

//           //   '& .MuiDialogContent-root': {
//           //     backgroundColor: '#3c3a3a',
//           //   },
//           //   backgroundColor: '#3c3a3a',
//           //   color: 'rgba(255, 255, 255, 0.9',
//         }}
//       >
//         <DialogTitle sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
//           Add Display Photo
//         </DialogTitle>
//         <DialogContent>
//           <Grid
//             className="drop-box"
//             onDrop={handleOnDrop}
//             onDragOver={handleOnDragOver}
//             direction="column"
//             justifyContent="center"
//             alignItems="center"
//             container
//             sx={{
//               width: '100%',
//               minWidth: '20rem',
//               height: '12rem',
//               border: '1px dashed #ffffffe6',
//               mt: 3,
//               mb: 2,
//             }}
//           >
//             <Grid item>
//               <FileUploadIcon fontSize="large" />
//             </Grid>
//             <Grid item>
//               <Typography sx={{}}>Drag and Drop file here</Typography>
//             </Grid>
//             <Grid item sx={{ width: '100%' }}>
//               <Divider
//                 variant="fullWidth"
//                 sx={{
//                   '&::before, &::after': {
//                     borderTop: 'thin solid #ffffff40',
//                     marginLeft: '.5rem',
//                     marginRight: '.5rem',
//                   },
//                 }}
//               >
//                 <Typography>or</Typography>
//               </Divider>
//             </Grid>
//             <Grid item>
//               <InputLabel
//                 htmlFor="filename"
//                 sx={{ textAlign: 'center', color: 'orange', cursor: 'pointer' }}
//               >
//                 Browse files
//               </InputLabel>
//               <Input
//                 id="filename"
//                 type="file"
//                 onChange={handleFileChange}
//                 sx={{ display: 'none' }}
//               />
//             </Grid>
//           </Grid>
//           <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
//             {selectedFile ? (
//               <Avatar
//                 variant="circular"
//                 src={fileDataUrl}
//                 alt="User Profile"
//                 sx={{ width: '200px', height: '200px' }}
//               />
//             ) : (
//               // <img src={fileDataUrl} alt="User Profile" width="150px" />
//               ''
//             )}
//           </Box>
//           <Grid container justifyContent="space-between">
//             <Grid item>
//               <Typography ref={fileRef} sx={{ color: '#ffffff' }}>
//                 {/*selectedFile ? selectedFile.name : ''*/}
//               </Typography>
//             </Grid>
//             <Grid item>
//               <IconButton
//                 // ref={BtnRef}
//                 // sx={{ bottom: '6px' }}
//                 onClick={handleFileRemove}
//               >
//                 {' '}
//                 {/*I don't know why 6px works??*/}
//                 {isDialogOpen && selectedFile ? (
//                   <ClearIcon sx={{ fill: 'red' }} />
//                 ) : (
//                   ''
//                 )}
//               </IconButton>

//               {/*add button styles directly   */}
//             </Grid>
//             <Grid item>
//               <IconButton
//                 // ref={BtnRef}
//                 // sx={{ bottom: '6px' }}
//                 onClick={handleFileUpload} //***add profile pic on click */
//               >
//                 {' '}
//                 {/*I don't know why 6px works??*/}
//                 {isDialogOpen && selectedFile ? (
//                   <CheckIcon sx={{ fill: 'green' }} />
//                 ) : (
//                   ''
//                 )}
//               </IconButton>

//               {/*add button styles directly   */}
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             variant="contained"
//             color="warning"
//             onClick={handleFileRemove}
//             sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

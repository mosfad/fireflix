import { upload } from '@testing-library/user-event/dist/upload';
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  UploadResult,
} from 'firebase/storage';
import { ErrorProps } from '../shared/types';

// Upload photo without handling errors
/* export const uploadPhoto = async (
  imgFile: File
): Promise<UploadResult | undefined> => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, 'images/' + imgFile.name);

    const snapshot = await uploadBytes(storageRef, imgFile);
    console.log(snapshot);
    return snapshot;
  } catch (err) {
    console.log(err);
  }
}; */

// Upload photo & handle errors
export const uploadPhoto = async (imgFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storage = getStorage();
    const storageRef = ref(storage, 'images/' + imgFile.name);
    // `TaskSnapshot` is passed back
    const uploadTask = uploadBytesResumable(storageRef, imgFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // observe state change, get task progress, ....
        console.log(snapshot);
      },
      (error) => {
        // handle unsuccessful upload
        console.log(error);
        reject(error);
      },
      async () => {
        // handle successful upload
        // download url from Firebase Storage after successful upload
        try {
          let downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(downloadURL);
          resolve(downloadURL);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};

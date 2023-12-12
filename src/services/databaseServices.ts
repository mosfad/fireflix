import { db } from "../firebase/firebase";
import { FirebaseError } from "firebase/app";
import { AppUser, ErrorProps } from "../shared/types";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  getDoc,
  Timestamp,
  DocumentData,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { DockSharp } from "@mui/icons-material";

type DBResponse = {
  status: string;
};

type AddUserResponse = DBResponse & {
  data: { name: string; email: string; uid: string };
};

export const getUserDB = async (
  docName: string
): Promise<DocumentData | undefined> => {
  try {
    const docSnap = await getDoc(doc(db, "users", docName));
    if (docSnap.exists()) {
      console.log(docSnap.data());
      return docSnap.data();
    }
  } catch (error) {
    console.log("Document does not exist");
  }
};

// export const getUserFav = async (
//   userId: string
// ): Promise<DocumentData | undefined> => {
//   console.log(userId);
//   try {
//     // let favsArr = [];
//     const favsRef = collection(db, `users/${userId}`);
//     const favsQuery = query(favsRef);
//     const querySnapshot = await getDocs(favsQuery);
//     // console.log(querySnapshot.docs);
//     return querySnapshot.docs.map((doc) => {
//       console.log(doc);
//       return doc.data();
//     });
//     // return querySnapshot.map(doc => {
//     //     return doc.data();
//     // })
//     // querySnapshot.forEach((doc) => {
//     //   // doc.data() is never undefined for query doc snapshots
//     //   console.log(doc.id, ' => ', doc.data());
//     // });
//   } catch (error) {
//     if (error instanceof FirebaseError) {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       console.log({ code: errorCode, message: errorMessage });
//       return { code: errorCode, message: errorMessage };
//     }
//   }
// };

export const addUserDB = async (
  name: string,
  email: string,
  uid: string
): Promise<AddUserResponse | undefined | ErrorProps> => {
  try {
    // actually returns void
    await setDoc(doc(db, "users", uid), {
      email,
      uid,
      name,
      createdAt: Timestamp.now(),
    });

    return { status: "User successful added", data: { name, email, uid } };
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
      return { code: errorCode, message: errorMessage };
    }
  }
};

export const deleteUserDB = async (
  userId: string
): Promise<DBResponse | undefined | ErrorProps> => {
  try {
    await deleteDoc(doc(db, `user`, userId));
    // TODO: Make sure to delete favorites from this user id(In component)
    return { status: "Deletion was successful" };
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
      return { code: errorCode, message: errorMessage };
    }
  }
};

export const getFavoritesDB = async (
  userId: string
): Promise<DocumentData | undefined | ErrorProps> => {
  try {
    // let favsArr = [];
    const favsRef = collection(db, `favorites/${userId}/media`);
    const favsQuery = query(favsRef);
    const querySnapshot = await getDocs(favsQuery);
    // console.log(querySnapshot.docs);
    return querySnapshot.docs.map((doc) => {
      console.log(doc);
      return doc.data();
    });
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log({ code: errorCode, message: errorMessage });
      return { code: errorCode, message: errorMessage };
    }
  }
};

export const addFavoriteDB = async (
  uid: string,
  mediaId: string,
  title: string,
  posterPath: string,
  mediaType: string
): Promise<DBResponse | undefined | ErrorProps> => {
  try {
    await setDoc(doc(db, `favorites/${uid}/media/`, mediaId), {
      //????
      id: mediaId,
      title,
      posterPath,
      mediaType,
      createdAt: Timestamp.now(),
    });
    return { status: "Favorite was successfully added" };
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
      return { code: errorCode, message: errorMessage };
    }
  }
};

export const deleteFavoriteDB = async (
  uid: string,
  mediaId: string
): Promise<DBResponse | undefined | ErrorProps> => {
  try {
    await deleteDoc(doc(db, `favorites/${uid}/media/`, mediaId));
    // TODO: Inform UI that deletion was successful...
    return { status: "Deletion was successful" };
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
      return { code: errorCode, message: errorMessage };
    }
  }
};

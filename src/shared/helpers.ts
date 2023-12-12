import type { ErrorProps, TimeDelayProp } from './types';

export const getUIErrorMessage = (error: ErrorProps): string => {
  let errorMessage = '';
  switch (error.code) {
    case 'auth/user-not-found':
      errorMessage =
        'We could not find an account with this email. Please check your email or sign up with it';
      break;
    case 'auth/email-already-in-use':
      errorMessage =
        'We already have an account with this email. Please log in or consider signing up with another email';
      break;
    // case 'auth/email-already-exists':
    //   errorMessage = 'Email already exists!';
    //   break;
    case 'auth/wrong-password':
      errorMessage =
        'Sorry, the password is wrong. We can help you recover your password';
      break;
    // case 'auth/invalid-password!':
    //   errorMessage = 'Password is invalid!';
    //  break;
    case 'auth/missing-password':
      errorMessage = 'Please enter valid password to update or delete account';
      break;
    default:
      errorMessage = 'We are updating our servers, please try again later.';
  }
  console.log(errorMessage);
  return errorMessage;
};

export const sleep = (ms: TimeDelayProp) =>
  new Promise((r) => setTimeout(r, ms));

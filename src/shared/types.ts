export type AppUser = {
  displayName: string | null;
  email: string;
  uid: string;
  photoURL: string | null;
} | null;

export type ErrorProps = {
  code: string;
  message: string;
};

export type TimeDelayProp = number;

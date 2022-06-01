import { useState } from 'react';

export const useLocalStorage = <T>(keyString: string, keyValue: T) => {
  const [value, setValue] = useState(() => {
    if (typeof window.localStorage === 'undefined') return keyValue;
    let initialValue;
    try {
      const locStore = localStorage.getItem(keyString);
      initialValue = locStore ? JSON.parse(locStore) : keyValue;
      // console.log(initialValue);
      return initialValue;
    } catch (err) {
      return keyValue;
    }
  });

  const setStoreValue = <T>(newValue: T) => {
    if (typeof window.localStorage === 'undefined') return;
    try {
      localStorage.setItem(keyString, JSON.stringify(newValue));
    } catch (err) {
      console.error('Issue with storing data to local storage', err);
    }
  };

  return [value, setStoreValue];
};

// type StorageData = {

// }

// const useLocalStorage = (key, initialValue) => {
//   const [storedValue, setStoredValue] = useState(() => {
//     //SSR & SSG considerations?
//     if (typeof window?.localStorage === 'undefined') {
//       return initialValue;
//     }
//     try {
//       const storedItem = localStorage.getItem(key);
//       return storedItem ? JSON.parse(storedItem) : initialValue;
//     } catch (err) {
//       console.error('Problems retrieving data from local storage', err);
//       return initialValue;
//     }
//   });

//   //Setter function to persist new value to localStorage
//   const setValue = (value) => {
//     try {
//       if (typeof window?.localStorage !== 'undefined') {
//         localStorage.setItem(key, JSON.stringify(value));
//       }
//     } catch (err) {
//       console.error('Problems storing data in local storage');
//     }
//   };

//   return [storedValue, setValue];
// };

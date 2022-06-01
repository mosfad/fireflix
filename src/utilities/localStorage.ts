export const getLocalStore = (itemKey: string) => {
  let result;
  if (typeof window.localStorage === 'undefined') return null;
  try {
    const unparsed = localStorage.getItem(itemKey);
    result = unparsed ? JSON.parse(unparsed) : null;
  } catch (err) {
    console.log(err);
  }
  return result;
};

export const startSaveTime = () => Date.now();

export const saveLocalStore = <T>(itemKey: string, itemValue: T) => {
  let expiry = Date.now() + 24 * 60 * 60 * 1000;
  itemValue = { ...itemValue, expiry };
  if (typeof window.localStorage === 'undefined') return null;
  try {
    localStorage.setItem(itemKey, JSON.stringify(itemValue));
  } catch (err) {
    console.log(err);
  }
};

type StoreDataProps = {
  movies: [];
  expiry: number;
} | null;

export const deleteLocalStoreTimeExpires = (itemKey: string) => {
  const storeData: StoreDataProps = getLocalStore(itemKey);
  if (!storeData) return;
  if (Date.now() > storeData?.expiry) {
    localStorage.removeItem(itemKey);
  }
};

export const deleteLocalStore = (itemKey: string) => {};

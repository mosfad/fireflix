import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import axios from 'axios';

type DataProps = { results: [] } | null; // maybe use generics
type ErrorProps = unknown; // review this!!!
const useFetch = (url: string, hasLocalStorage: boolean = false) => {
  // console.log(url);
  const [data, setData] = useState<DataProps>(null);
  const [error, setError] = useState<ErrorProps>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // allows update only when mounted
    let isComponentMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(url);
        console.log(res);
        if (res.status === 200) {
          isComponentMounted && setData(res.data);
          // console.log(data);
        } else {
          throw new Error(`${res.statusText}, ${res.status}`);
        }
      } catch (err: ErrorProps) {
        isComponentMounted && setError(err);
      } finally {
        isComponentMounted && setLoading(false);
      }
    };
    !hasLocalStorage && fetchData();

    // clean up after request to prevent memory leaks
    return () => {
      isComponentMounted = false;
    };
  }, [url, hasLocalStorage]);

  return {
    data,
    error,
    loading,
  };
};

export default useFetch;

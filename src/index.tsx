import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './app/store';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import LoadingSpinner from './components/LoadingSpinner';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const loaderRoot = document.getElementById('loader');

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      {/* {(movieStatus === 'pending' || !movieArray) && <LoadingSpinner />} */}
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// {store.getState()?.movies?.movies ? <App /> : <div>Loading..</div>}

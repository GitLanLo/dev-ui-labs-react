import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './components/app/app';
import { store } from './store';
import { ErrorMessage } from './components/error-message';
import { checkAuthAction, fetchOfferAction } from './store/api-actions';

store.dispatch(checkAuthAction());
store.dispatch(fetchOfferAction());

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorMessage />
      <App />
    </Provider>
  </React.StrictMode>
);

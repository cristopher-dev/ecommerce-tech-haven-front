import App from '@/App.tsx';
import { persistor, store } from '@/application/store/store';
import '@/i18n/config';
import '@/styles/index.scss';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const PersistGateLoader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
    <p>Cargando...</p>
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<PersistGateLoader />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css';
import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Create a client
const queryClient = new QueryClient();

// Render the app
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

// Enable Hot Module Replacement (HMR)
if (import.meta.hot) {
  import.meta.hot.accept();
}

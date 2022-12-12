import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Footer from './components/Footer';
import { HelmetProvider } from 'react-helmet-async';
import { Store, StoreProvider } from './Store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StoreProvider>
    <HelmetProvider>
      <BrowserRouter>
        <PayPalScriptProvider deferLoading={true}>
          <Header />
          <App />
          <Footer />
        </PayPalScriptProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StoreProvider>
);

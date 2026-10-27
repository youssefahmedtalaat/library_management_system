import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LibraryProvider } from './context/LibraryContext';
import AppRouter from './router/AppRouter';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LibraryProvider>
          <AppRouter />
        </LibraryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

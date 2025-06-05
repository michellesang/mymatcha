import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { MatchaProvider } from './context/MatchaContext';
import App from './App';
import '@mui/material/styles';
import './index.css'

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <MatchaProvider>
                <App />
            </MatchaProvider>
        </AuthProvider>
    </React.StrictMode>
);
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Link } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Login.css';

const Login = ({ onSwitch }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(email, password);

        if (result.success) {
            navigate('/collection');
        } else {
            setError(result.error || 'invalid email or password');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} className="login-container">
            <Typography variant="h5" component="h1" className="login-title">
                welcome back! ♡
            </Typography>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <TextField
                margin="normal"
                required
                fullWidth
                label="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                InputProps={{ className: "input-text" }}
                InputLabelProps={{ className: "input-label" }}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                label="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                InputProps={{ className: "input-text" }}
                InputLabelProps={{ className: "input-label" }}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                className="login-button"
            >
                login ♡
            </Button>
            <Link
                component="button"
                className="switch-link"
                onClick={onSwitch}
            >
                don't have an account? sign up ♡
            </Link>
        </Box>
    );
};

export default Login;
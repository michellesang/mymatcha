import React, { useState } from 'react';
import { Box, Button, Link, TextField, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext.jsx';
import '../../styles/Login.css';

const SignUp = ({ onSwitch }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const result = await signup(email, password);
            if (result.success) {
                onSwitch();
            } else {
                setError(result.error || 'signup failed. please try again.');
            }
        } catch (err) {
            if (err instanceof Error) {
                try {
                    const errorData = JSON.parse(err.message);
                    setError(errorData.detail || 'signup failed. please try again.');
                } catch {
                    setError(err.message || 'signup failed. please try again.');
                }
            } else {
                setError('an unexpected error occurred. please try again.');
            }
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} className="login-container">
            <Typography variant="h5" component="h1" className="login-title">
                create account ♡
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
                sign up ♡
            </Button>
            <Link
                component="button"
                className="switch-link"
                onClick={onSwitch}
            >
                already have an account? login ♡
            </Link>
        </Box>
    );
};

export default SignUp;
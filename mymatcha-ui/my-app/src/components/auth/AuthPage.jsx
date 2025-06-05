import React, { useState } from 'react';
import { Container, Paper } from '@mui/material';
import Login from './Login';
import SignUp from './SignUp';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                {isLogin ? (
                    <Login onSwitch={toggleForm} />
                ) : (
                    <SignUp onSwitch={toggleForm} />
                )}
            </Paper>
        </Container>
    );
};

export default AuthPage;
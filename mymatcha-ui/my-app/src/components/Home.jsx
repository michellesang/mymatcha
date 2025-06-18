import React from 'react';
import {Box, Button, Container, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import '../styles/Home.css';
import matchaSetup from '../assets/matcha_setup.JPG';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div
                className="background-image"
                style={{backgroundImage: `url(${matchaSetup})`}}
            />
            <div className="background-gradient"/>
            <Container className="home-simple-container">
                <Box className="home-hero">
                    <Typography variant="h3" className="home-title">
                        welcome to mymatcha! ♡
                    </Typography>
                    <Typography variant="h6" className="home-subtitle">
                        track, rate, and rediscover your favorite matcha brands and varieties.
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/profile')}
                        className="home-cta"
                    >
                        get started now!
                    </Button>
                </Box>
            </Container>
        </div>
    );
};

export default Home;
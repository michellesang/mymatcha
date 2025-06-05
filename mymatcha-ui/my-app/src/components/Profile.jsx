import React, {useEffect, useState} from 'react';
import {Avatar, Box, Paper, Typography} from '@mui/material';
import {useAuth} from '../context/AuthContext';
import {api} from '../services/api';
import '../styles/Profile.css';

const Profile = () => {
    const {user, loading} = useAuth();
    const [matchaStats, setMatchaStats] = useState({count: 0, averageRating: 0});

    useEffect(() => {
        if (!user) return;

        const fetchStats = async () => {
            try {
                const stats = await api.getMatchaStats();
                setMatchaStats(stats);
            } catch (err) {
                console.error("Failed to fetch matcha stats:", err.message);
            }
        };

        void fetchStats();
    }, [user]);

    if (loading) {
        return (
            <Box className="profile-container">
                <Typography className="profile-loading">
                    loading your profile...
                </Typography>
            </Box>
        );
    }

    if (!user) {
        return (
            <Box className="profile-container">
                <Typography variant="h6" className="profile-loading">
                    please log in to view your profile ♡
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="profile-container">
            <Paper elevation={3} className="profile-paper">
                <Avatar className="profile-avatar">
                    {user.email ? user.email[0].toUpperCase() : '?'}
                </Avatar>

                <Typography variant="h5" className="profile-title">
                    your profile ♡
                </Typography>

                <Box className="profile-info">
                    <Typography className="profile-email">
                        {user.email}
                    </Typography>

                    <Typography className="profile-member-since" data-label="member since">
                        {user.createdAt && !isNaN(new Date(user.createdAt))
                            ? new Date(user.createdAt).toLocaleDateString()
                            : 'Unknown'}
                    </Typography>

                    <Typography className="profile-matcha-count" data-label="matchas logged">
                        {matchaStats.count}
                    </Typography>

                    <Typography className="profile-average-rating" data-label="average rating">
                        {matchaStats.averageRating.toFixed(1)} ★
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Profile;
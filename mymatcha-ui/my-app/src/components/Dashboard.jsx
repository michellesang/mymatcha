import React from 'react';
import {Card, CardContent, CircularProgress, Container, Grid, Typography} from '@mui/material';
import {useMatcha} from '../context/MatchaContext';

const StatCard = ({title, value, subtitle}) => (
    <Card elevation={3}>
        <CardContent>
            <Typography color="textSecondary" gutterBottom>
                {title}
            </Typography>
            <Typography variant="h4" component="div">
                {value}
            </Typography>
            {subtitle && (
                <Typography color="textSecondary" sx={{mt: 1}}>
                    {subtitle}
                </Typography>
            )}
        </CardContent>
    </Card>
);

const Dashboard = () => {
    const {matchas, loading, error} = useMatcha();

    if (loading) {
        return (
            <Container sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                <CircularProgress size={60}/>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{mt: 4}}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    const stats = {
        totalMatchas: matchas.length,
        averageRating: matchas.length
            ? (matchas.reduce((acc, m) => acc + m.rating, 0) / matchas.length).toFixed(1)
            : 0,
        totalSpent: matchas.reduce((acc, m) => acc + m.price, 0).toFixed(2),
        highestRated: matchas.length
            ? matchas.reduce((prev, current) =>
                (prev.rating > current.rating) ? prev : current
            )
            : null
    };

    return (
        <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Matchas"
                        value={stats.totalMatchas}
                        subtitle="in collection"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Average Rating"
                        value={stats.averageRating}
                        subtitle="out of 5 stars"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Spent"
                        value={`$${stats.totalSpent}`}
                        subtitle="on matcha"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Highest Rated"
                        value={stats.highestRated?.brand || 'N/A'}
                        subtitle={stats.highestRated
                            ? `${stats.highestRated.rating} stars`
                            : 'No ratings yet'}
                    />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
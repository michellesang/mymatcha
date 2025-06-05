import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Rating,
    Box,
    CircularProgress,
    Alert,
    Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMatcha } from '../context/MatchaContext';

const AddMatchaForm = () => {
    const navigate = useNavigate();
    const { addMatcha } = useMatcha();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        brand: '',
        name: '',
        price: '',
        rating: 0,
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRatingChange = (event, newValue) => {
        setFormData(prev => ({
            ...prev,
            rating: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const matchaData = {
                ...formData,
                price: parseFloat(formData.price)
            };

            const success = await addMatcha(matchaData);
            if (success) {
                setSuccess(true);
                console.log("Sending matcha:", matchaData);
                setTimeout(() => {
                    navigate('/collection');
                }, 1500);
            } else {
                setError('Failed to add matcha. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const textFieldStyle = {
        '& .MuiInputLabel-root': {
            color: '#666',
            textTransform: 'lowercase'
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#ffd1d9'
            },
            '&:hover fieldset': {
                borderColor: '#ff92a5'
            },
            '&.Mui-focused fieldset': {
                borderColor: '#ff92a5'
            }
        },
        '& input[type=number]': {
            '-webkit-appearance': 'none',
            '-moz-appearance': 'textfield',
            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                '-webkit-appearance': 'none',
                margin: 0
            }
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                        mb: 3,
                        color: '#ff92a5',
                        textTransform: 'lowercase',
                        fontWeight: 'normal'
                    }}
                >
                    add a matcha to your collection!
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                            label="brand"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            required
                            sx={{ ...textFieldStyle, flex: 1 }}
                        />
                        <TextField
                            label="name/variety"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            sx={{ ...textFieldStyle, flex: 1 }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                            label="price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            inputProps={{
                                step: "0.01",
                                min: "0"
                            }}
                            sx={{ ...textFieldStyle, flex: 1 }}
                        />
                        <Box sx={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            height: '56px' // This matches the TextField height
                        }}>
                            <Box>
                                <Typography
                                    component="legend"
                                    sx={{
                                        color: '#666',
                                        textTransform: 'lowercase',
                                        mb: 0.5
                                    }}
                                >
                                    rating
                                </Typography>
                                <Rating
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleRatingChange}
                                    precision={0.5}
                                    sx={{
                                        color: '#ff92a5',
                                        '& .MuiRating-iconFilled': {
                                            color: '#ff92a5'
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>

                    <TextField
                        label="notes"
                        name="notes"
                        multiline
                        rows={4}
                        value={formData.notes}
                        onChange={handleChange}
                        sx={{ ...textFieldStyle, width: '100%', mb: 2 }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={loading}
                        sx={{
                            mt: 2,
                            backgroundColor: '#ff92a5',
                            color: 'white',
                            textTransform: 'lowercase',
                            '&:hover': {
                                backgroundColor: '#ff7f96'
                            },
                            '&:disabled': {
                                backgroundColor: '#ffb6c1'
                            }
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'add matcha ♡'
                        )}
                    </Button>
                </form>
            </Paper>

            <Snackbar
                open={success}
                autoHideDuration={1500}
                message="matcha added successfully! ♡"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Container>
    );
};

export default AddMatchaForm;
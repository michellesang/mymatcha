import React, { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    Modal,
    Rating,
    TextField,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMatcha } from '../context/MatchaContext';
import '../styles/MatchaCollection.css';

const MatchaCollection = () => {
    const { matchas, loading, error, updateMatcha, deleteMatcha } = useMatcha();
    const [selectedMatcha, setSelectedMatcha] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedMatcha, setEditedMatcha] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [operationError, setOperationError] = useState('');
    const [operationLoading, setOperationLoading] = useState(false);

    const handleOpen = (matcha) => {
        setSelectedMatcha(matcha);
        setEditedMatcha(matcha);
        setIsEditing(false);
    };

    const handleClose = () => {
        setSelectedMatcha(null);
        setEditedMatcha(null);
        setIsEditing(false);
        setOperationError('');
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleEditChange = (field, value) => {
        setEditedMatcha(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        setOperationLoading(true);
        setOperationError('');

        try {
            const result = await updateMatcha(selectedMatcha.id, editedMatcha);
            if (result.success) {
                handleClose();
            } else {
                setOperationError(result.error || 'Failed to update matcha');
            }
        } catch (err) {
            setOperationError('An unexpected error occurred');
        } finally {
            setOperationLoading(false);
        }
    };

    const handleDelete = async () => {
        setOperationLoading(true);
        setOperationError('');

        try {
            const result = await deleteMatcha(selectedMatcha.id);
            if (result.success) {
                setDeleteConfirmOpen(false);
                handleClose();
            } else {
                setOperationError(result.error || 'Failed to delete matcha');
            }
        } catch (err) {
            setOperationError('An unexpected error occurred');
        } finally {
            setOperationLoading(false);
        }
    };

    if (loading) {
        return (
            <Container className="collection-container">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress sx={{ color: '#ff92a5' }} />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="collection-container">
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="collection-container">
            <Typography variant="h4" gutterBottom className="collection-title">
                my matcha collection ♡
            </Typography>

            <Grid container spacing={3}>
                {matchas.map((matcha) => (
                    <Grid item xs={12} sm={6} md={4} key={matcha.id}>
                        <Card
                            elevation={0}
                            onClick={() => handleOpen(matcha)}
                            className="matcha-card"
                        >
                            <CardContent className="card-content">
                                <Typography variant="h6" component="h2" gutterBottom className="matcha-brand">
                                    {matcha.brand}
                                </Typography>
                                <Typography variant="subtitle1" className="matcha-name">
                                    {matcha.name}
                                </Typography>
                                <Box sx={{ mt: 'auto' }}>
                                    <Rating
                                        value={matcha.rating}
                                        precision={0.1}
                                        readOnly
                                        className="matcha-rating"
                                    />
                                    <Typography variant="body1" className="matcha-price">
                                        ${matcha.price.toFixed(2)}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Modal
                open={selectedMatcha !== null}
                onClose={handleClose}
                aria-labelledby="matcha-modal-title"
            >
                <Box className="modal-content">
                    <IconButton
                        onClick={handleClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {operationError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {operationError}
                        </Alert>
                    )}

                    {selectedMatcha && (isEditing ? (
                        <>
                            <Typography variant="h6" id="matcha-modal-title" gutterBottom>
                                edit matcha ♡
                            </Typography>
                            <TextField
                                fullWidth
                                label="brand"
                                value={editedMatcha.brand}
                                onChange={(e) => handleEditChange('brand', e.target.value)}
                                margin="normal"
                                className="edit-input"
                            />
                            <TextField
                                fullWidth
                                label="name"
                                value={editedMatcha.name}
                                onChange={(e) => handleEditChange('name', e.target.value)}
                                margin="normal"
                                className="edit-input"
                            />
                            <TextField
                                fullWidth
                                label="price"
                                type="number"
                                value={editedMatcha.price}
                                onChange={(e) => handleEditChange('price', parseFloat(e.target.value))}
                                margin="normal"
                                inputProps={{ step: "0.01" }}
                                className="edit-input"
                            />
                            <Box sx={{ my: 2 }}>
                                <Typography component="legend">rating</Typography>
                                <Rating
                                    value={editedMatcha.rating}
                                    onChange={(e, newValue) => handleEditChange('rating', newValue)}
                                    precision={0.5}
                                    className="edit-rating"
                                />
                            </Box>
                            <TextField
                                fullWidth
                                label="notes"
                                value={editedMatcha.notes}
                                onChange={(e) => handleEditChange('notes', e.target.value)}
                                margin="normal"
                                multiline
                                rows={4}
                                className="edit-input"
                            />
                            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                <Button
                                    onClick={handleSave}
                                    variant="contained"
                                    disabled={operationLoading}
                                    className="save-button"
                                >
                                    {operationLoading ? <CircularProgress size={24} /> : 'save'}
                                </Button>
                                <Button
                                    onClick={() => setIsEditing(false)}
                                    disabled={operationLoading}
                                    className="cancel-button"
                                >
                                    cancel
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography variant="h5" component="h2" className="modal-title">
                                {selectedMatcha.brand}
                            </Typography>
                            <Typography variant="subtitle1" className="modal-subtitle">
                                {selectedMatcha.name}
                            </Typography>
                            <Rating value={selectedMatcha.rating} readOnly precision={0.1} className="modal-rating" />
                            <Typography variant="h6" className="modal-price">
                                ${selectedMatcha.price.toFixed(2)}
                            </Typography>
                            {selectedMatcha.notes && (
                                <Typography variant="body1" className="modal-notes">
                                    {selectedMatcha.notes}
                                </Typography>
                            )}
                            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                <Button
                                    onClick={handleEditClick}
                                    startIcon={<EditIcon />}
                                    className="edit-button"
                                >
                                    edit
                                </Button>
                                <Button
                                    onClick={() => setDeleteConfirmOpen(true)}
                                    startIcon={<DeleteIcon />}
                                    className="delete-button"
                                >
                                    delete
                                </Button>
                            </Box>
                        </>
                    ))}
                </Box>
            </Modal>

            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                PaperProps={{ className: "dialog-paper" }}
            >
                <DialogTitle>confirm deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        are you sure you want to delete this item? this action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteConfirmOpen(false)}
                        disabled={operationLoading}
                        className="cancel-button"
                    >
                        cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={operationLoading}
                        className="confirm-delete-button"
                    >
                        {operationLoading ? <CircularProgress size={24} /> : 'delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MatchaCollection;
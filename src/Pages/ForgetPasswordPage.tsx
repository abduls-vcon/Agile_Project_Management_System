import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Link,
    Alert,
    Stack
} from '@mui/material';

const ForgetPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`Password reset requested for: ${email}`);
        setIsSubmitted(true);
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            bgcolor: '#dee4ff', 
            p: 2 
        }}>
            <Paper elevation={6} sx={{ p: 4, borderRadius: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h5" align="center" fontWeight="800" gutterBottom sx={{ color: '#0a0e33', mb: 1 }}>
                    Forgot Password
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
                    Recover your account access
                </Typography>

                {!isSubmitted ? (
                    <Stack component="form" spacing={3} onSubmit={handleSubmit}>
                        <TextField
                                label="Email Address"
                                type="email"
                                fullWidth
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: "10px",
                                    }
                                }}
                        />
                        <Button 
                            type="submit" 
                            variant="contained" 
                            fullWidth 
                            sx={{ 
                                bgcolor: '#665fc9', 
                                py: 1.2,
                                borderRadius: '10px',
                                fontWeight: 'bold',
                                '&:hover': { bgcolor: '#554eb0' }
                            }}
                        >
                            Send Reset Link
                        </Button>
                    </Stack>
                ) : (
                    <Box textAlign="center">
                        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                            If an account exists for <strong>{email}</strong>, you will receive an email shortly.
                        </Alert>
                    </Box>
                )}

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Link component={RouterLink} to="/login" underline="hover" sx={{ color: '#665fc9', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        Back to Login
                    </Link>
                </Box>
            </Paper>
        </Box>
    );
};

export default ForgetPasswordPage;
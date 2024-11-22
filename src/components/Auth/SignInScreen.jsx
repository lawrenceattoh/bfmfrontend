import { Button, Box, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { signInWithGoogle } from '../../services/authService';

function SignInScreen() {
    const dispatch = useDispatch();

    const handleSignIn = () => {
        signInWithGoogle(dispatch);
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
            <Typography variant="h4" gutterBottom>
                Welcome to RMS
            </Typography>
            <Button variant="contained" color="primary" onClick={handleSignIn}>
                Sign in with Google
            </Button>
        </Box>
    );
}

export default SignInScreen;

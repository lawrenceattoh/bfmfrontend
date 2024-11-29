import { Button, Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { signInWithGoogle } from '../../services/authService';
import { setUser, setLoading, selectLoading } from '../../store/userSlice';
import { useNavigate } from 'react-router-dom';

function SignInScreen() {
    const dispatch = useDispatch();
    const loading = useSelector(selectLoading);
    const navigate = useNavigate(); // Initialize the navigate function


    const handleSignIn = async () => {
        dispatch(setLoading(true)); // Set loading to true
        try {
            const user = await signInWithGoogle();
            console.log("User signed in:", user); // Check if this logs a user object with expected properties
            dispatch(setUser(user)); // Update user in the Redux store
            navigate("/artists"); // Navigate to the dashboard after successful login

        } catch (error) {
            console.error("Error during sign-in:", error.message);
            console.error("Google Sign-In failed:", error.code, error.message);

        } finally {
            dispatch(setLoading(false)); // Set loading to false
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
            <Typography variant="h4" gutterBottom>
                Welcome to RMS
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSignIn} 
                disabled={loading} // Disable the button while loading
            >
                {loading ? "Signing in..." : "Sign in with Google"}
            </Button>
        </Box>
    );
}

export default SignInScreen;

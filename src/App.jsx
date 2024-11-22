import React, {useEffect} from 'react';
import {CssBaseline, Box, Container, CircularProgress} from '@mui/material';
import {Provider, useDispatch, useSelector} from 'react-redux';
import NavBar from './components/NavBar';
import store from "./store/index.jsx";
import {ApiRouter} from "./components/ApiRouter.jsx";
import {initializeAuth} from './services/authService';
import SignInScreen from './components/Auth/SignInScreen';
import Navbar from "./components/NavBar";


function AppContent() {
    const dispatch = useDispatch();
    const {user, loading} = useSelector((state) => state.user);

    useEffect(() => {
        initializeAuth(dispatch); // Initialize Firebase auth
    }, [dispatch]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress/>
            </Box>
        );
    }

    return user ? (
        <Box display="flex" flexDirection="column" minHeight="10vh">
            <NavBar/>
            <Box component="main" flexGrow={1} mt={8}>
                <Container maxWidth="xl">
                    <ApiRouter/>
                </Container>
            </Box>
        </Box>
    ) : (
        <SignInScreen/>
    );
}


function App() {

    return (
        <>

            <Provider store={store}>
                <AppContent/>
            </Provider>
        </>
    )
}

export default App

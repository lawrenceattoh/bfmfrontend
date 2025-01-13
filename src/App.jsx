import React, { useEffect, useState } from "react";
import {
  CssBaseline,
  Box,
  Container,
  CircularProgress,
  Modal,
  Button,
} from "@mui/material";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store/index.jsx";
import { ApiRouter } from "./components/ApiRouter.jsx";
import { initializeAuth, signOutUser } from "./services/authService";
import SignInScreen from "./components/Auth/SignInScreen";
import Navbar from "./components/Navbar";
import UniversalSearch from "./components/UniversalSearch.jsx";

function AppContent() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // Timer countdown for modal

  useEffect(() => {
    initializeAuth(dispatch);
  }, [dispatch]);

  // Session timeout logic
  useEffect(() => {
    let inactivityTimer;
    let countdownInterval;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      clearInterval(countdownInterval);

      setShowWarning(false); // Hide modal
      setTimeLeft(30); // Reset timer

      inactivityTimer = setTimeout(() => {
        setShowWarning(true); // Show modal after 3 minutes of inactivity
        let countdown = 30;

        countdownInterval = setInterval(() => {
          countdown -= 1;
          setTimeLeft(countdown);

          if (countdown === 0) {
            clearInterval(countdownInterval);
            handleSignOut(); // Auto sign-out
          }
        }, 1000);
      }, 3 * 60 * 1000); // 3 minutes inactivity
    };

    // Attach event listeners to reset the inactivity timer
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);

    resetInactivityTimer(); // Initialize timer on load

    return () => {
      clearTimeout(inactivityTimer);
      clearInterval(countdownInterval);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
    };
  }, []);

  const handleStaySignedIn = () => {
    setShowWarning(false); // Hide modal
    setTimeLeft(30); // Reset countdown
  };

  const handleSignOut = () => {
    signOutUser(dispatch); // Sign out user
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return user ? (
    <div className="flex h-screen overflow-hidden bg-[#121212] w-screen">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="flex flex-col flex-grow over">
        {/* Black Strip with Search Bar */}
        <div
        style={{
          backgroundColor: "#121212",
          color: "white",
          padding: "1% 2%",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <UniversalSearch />
      </div>

        {/* Page Content */}
        <div className="flex-grow overflow-y-auto overflow-hidden">
          <ApiRouter />
        </div>
      </div>
  
      {/* Session Expiring Modal */}
      <Modal open={showWarning} onClose={() => {}} disableAutoFocus>
        <Box
          className="p-6 rounded bg-gray-800 text-white mx-auto mt-32"
          style={{ width: "400px" }}
        >
          <h2 className="text-lg font-bold mb-4">Session Expiring</h2>
          <p className="mb-4">
            Your session is about to expire due to inactivity. Would you like to stay signed in? <br />
            <span className="text-red-400">{timeLeft} seconds left</span>
          </p>
          <div className="flex justify-end gap-4">
            <Button
              variant="outlined"
              color="error"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleStaySignedIn}
            >
              Stay Signed In
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  ) : (
    <SignInScreen />
  );
}

function App() {
  return (
    <>
      <Provider store={store}>
        <CssBaseline />
        <AppContent />
      </Provider>
    </>
  );
}

export default App;

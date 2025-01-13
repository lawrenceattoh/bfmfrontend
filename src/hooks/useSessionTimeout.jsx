import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { signOutUser } from "../services/authService";
import { clearUser } from "../store/userSlice";

const useSessionTimeout = (timeoutDuration = 3 * 60 * 1000) => {
  const [showWarning, setShowWarning] = useState(false); // Show session warning modal
  const [timeLeft, setTimeLeft] = useState(30); // Countdown for modal
  const dispatch = useDispatch();

  useEffect(() => {
    let timeout, countdown;

    const startSessionTimer = () => {
      // Set the main timer to trigger warning
      timeout = setTimeout(() => {
        setShowWarning(true);
        let countdownTime = 30; // Grace period: 30 seconds

        countdown = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
          countdownTime -= 1;

          // Sign out automatically when countdown ends
          if (countdownTime <= 0) {
            clearInterval(countdown);
            handleSignOut();
          }
        }, 1000);
      }, timeoutDuration - 30000); // Trigger warning 30 seconds before expiry
    };

    const resetTimer = () => {
      clearTimeout(timeout);
      clearInterval(countdown);
      setShowWarning(false);
      setTimeLeft(30);
      startSessionTimer();
    };

    const handleUserActivity = () => {
      resetTimer(); // Reset session timer on user activity
    };

    const handleSignOut = () => {
      signOutUser(dispatch); // Sign out user
      dispatch(clearUser()); // Clear Redux state
    };

    // Listen to user activity
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    startSessionTimer();

    return () => {
      clearTimeout(timeout);
      clearInterval(countdown);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
    };
  }, [dispatch, timeoutDuration]);

  return { showWarning, timeLeft, setShowWarning };
};

export default useSessionTimeout;

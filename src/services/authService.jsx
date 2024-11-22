// src/services/authService.js
import {
    setPersistence,
    browserLocalPersistence,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { setUser, clearUser, setLoading } from "../store/userSlice";

let cachedToken = null;
let lastTokenFetchTime = 0;

// Centralized Firebase user parsing logic
const parseFirebaseUser = async (firebaseUser) => {
    const tokenResult = await firebaseUser.getIdTokenResult();
    return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        token: tokenResult.token, // Cache the token here
        access_level: tokenResult.claims.access_level || "USER", // Handle custom claims
    };
};

// Token caching utility
const refreshTokenIfNeeded = async () => {
    const now = Date.now();
    const FIVE_MINUTES = 5 * 60 * 1000;

    if (!cachedToken || now - lastTokenFetchTime > FIVE_MINUTES) {
        const user = auth.currentUser;
        if (user) {
            cachedToken = await user.getIdToken();
            lastTokenFetchTime = now;
        } else {
            cachedToken = null;
        }
    }
    return cachedToken;
};

// Initialize Firebase authentication
export const initializeAuth = (dispatch) => {
    dispatch(setLoading(true)); // Set loading state while initializing
    setPersistence(auth, browserLocalPersistence)
        .then(() =>
            onAuthStateChanged(auth, async (firebaseUser) => {
                if (firebaseUser) {
                    const user = await parseFirebaseUser(firebaseUser);
                    dispatch(setUser(user));
                } else {
                    dispatch(clearUser());
                }
                dispatch(setLoading(false)); // Clear loading state after auth state changes
            })
        )
        .catch((error) => {
            console.error("Failed to initialize auth:", error);
            dispatch(setLoading(false)); // Stop loading if initialization fails
        });
};

// Sign in with Google
export const signInWithGoogle = async (dispatch) => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = await parseFirebaseUser(result.user);
        dispatch(setUser(user));
    } catch (error) {
        console.error("Google Sign-In failed:", error);
        throw new Error("Google Sign-In failed. Please try again.");
    }
};

// Sign out user
export const signOutUser = async (dispatch) => {
    try {
        await signOut(auth);
        dispatch(clearUser()); // Clear user state in Redux
        cachedToken = null; // Clear cached token
    } catch (error) {
        console.error("Sign out error:", error);
        throw new Error("Sign out failed. Please try again.");
    }
};

// Utility to get the current token (cached or refreshed)
export const getCurrentToken = async () => {
    try {
        return await refreshTokenIfNeeded();
    } catch (error) {
        console.error("Failed to refresh token:", error);
        return null;
    }
};
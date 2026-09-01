import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithRedirect,
  signOut as amplifySignOut,
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession,
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import '../config/cognito'; // Ensure Amplify is configured

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore current Cognito session
  const checkUserSession = useCallback(async () => {
    try {
      setLoading(true);
      const cognitoUser = await getCurrentUser();
      let attributes = {};
      try {
        attributes = await fetchUserAttributes();
      } catch (attrErr) {
        console.warn('Could not fetch user attributes:', attrErr);
      }

      const displayName = attributes.name || attributes.email?.split('@')[0] || cognitoUser.username || 'SmartMeal User';
      const email = attributes.email || `${cognitoUser.username}@smartmeal.ai`;

      setUser({
        id: cognitoUser.userId || cognitoUser.username,
        sub: cognitoUser.userId,
        username: cognitoUser.username,
        email,
        name: displayName,
        avatarUrl: attributes.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`,
        attributes,
      });
    } catch (err) {
      // User is not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUserSession();

    // Listen for Auth events from Amplify Hub
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          checkUserSession();
          break;
        case 'signedOut':
          setUser(null);
          setLoading(false);
          break;
        case 'tokenRefresh_failure':
        case 'signInWithRedirect_failure':
          setUser(null);
          setLoading(false);
          break;
        default:
          break;
      }
    });

    return () => unsubscribe();
  }, [checkUserSession]);

  /**
   * Trigger Cognito Managed Login redirect (OAuth PKCE)
   * @param {string} [provider] - Optional provider e.g. 'Google'
   */
  const signIn = useCallback(async (provider) => {
    try {
      if (provider) {
        await signInWithRedirect({ provider });
      } else {
        await signInWithRedirect();
      }
    } catch (err) {
      console.error('Cognito sign-in redirect error:', err);
      // Fallback: direct browser redirect to domain if Amplify call encounters issue
      const rawDomain = import.meta.env.VITE_COGNITO_DOMAIN;
      if (rawDomain) {
        window.location.href = rawDomain;
      }
    }
  }, []);

  /**
   * Sign out current user and clear local session
   */
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await amplifySignOut();
      setUser(null);
    } catch (err) {
      console.error('Cognito sign-out error:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get valid Cognito JWT Access Token for backend API calls
   * @returns {Promise<string|null>}
   */
  const getAccessToken = useCallback(async () => {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString() || null;
    } catch (err) {
      console.error('Failed to get Cognito access token:', err);
      return null;
    }
  }, []);

  const value = {
    user,
    loading,
    signIn,
    signOut,
    getAccessToken,
    checkUserSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Authentication Service
 * Handles user authentication and session management for the ERP system
 * Connects to Spring Boot backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const AUTH_TOKEN_KEY = "erp_auth_token";
const USER_ROLE_KEY = "erp_user_role";
const USER_EMAIL_KEY = "erp_user_email";
const USER_NAME_KEY = "erp_user_name";

/**
 * Login function with role-based authentication
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} expectedRole - Expected role ('Admin' or 'User')
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const login = async (email, password, expectedRole) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        role: expectedRole,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Store authentication data
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      localStorage.setItem(USER_ROLE_KEY, data.role);
      localStorage.setItem(USER_EMAIL_KEY, data.email);
      localStorage.setItem(USER_NAME_KEY, data.name);

      return { success: true };
    } else {
      return {
        success: false,
        error: data.error || "Login failed. Please try again.",
      };
    }
  } catch (error) {
    console.error("Login error:", error);

    // Check if it's a network error (backend not running)
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return {
        success: false,
        error:
          "Unable to connect to server. Please ensure the backend is running.",
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Get the authentication token
 * @returns {string | null}
 */
export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Get authorization header for API requests
 * @returns {object} Headers object with Authorization
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Get current user's role
 * @returns {string | null}
 */
export const getUserRole = () => {
  return localStorage.getItem(USER_ROLE_KEY);
};

/**
 * Get current user's email
 * @returns {string | null}
 */
export const getUserEmail = () => {
  return localStorage.getItem(USER_EMAIL_KEY);
};

/**
 * Get current user's name
 * @returns {string | null}
 */
export const getUserName = () => {
  return localStorage.getItem(USER_NAME_KEY);
};

/**
 * Check if the current user is an admin
 * @returns {boolean}
 */
export const isAdmin = () => {
  return getUserRole() === "ADMIN";
};

/**
 * Get complete user information
 * @returns {object | null}
 */
export const getCurrentUser = () => {
  if (!isAuthenticated()) return null;

  return {
    email: getUserEmail(),
    role: getUserRole(),
    name: getUserName(),
    isAdmin: isAdmin(),
  };
};

/**
 * Logout user and clear session
 * @returns {void}
 */
export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
  localStorage.removeItem(USER_NAME_KEY);
};

/**
 * Validate token with backend
 * @returns {Promise<boolean>}
 */
export const validateToken = async () => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const isValid = await response.json();
      if (!isValid) {
        logout();
      }
      return isValid;
    }
    return false;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};

/**
 * Initialize authentication state
 * Validates stored token on app startup
 * @returns {Promise<void>}
 */
export const initializeAuth = async () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    try {
      // Validate token with backend
      const isValid = await validateToken();
      if (!isValid) {
        logout();
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      // If backend is not available, check token age locally as fallback
      try {
        const decoded = atob(token);
        const [, timestamp] = decoded.split(":");
        const tokenAge = Date.now() - parseInt(timestamp);

        // Token expires after 24 hours
        if (tokenAge > 24 * 60 * 60 * 1000) {
          logout();
        }
      } catch (decodeError) {
        // Token format changed (JWT), can't decode locally
        // Keep token and let backend validate on next request
      }
    }
  }
};

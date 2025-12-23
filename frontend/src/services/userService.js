import { getAuthHeaders } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Fetch all users (Admin only)
 * @returns {Promise<Array>}
 */
export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Create a new user (Admin only)
 * @param {Object} userData - User details {name, email, password, role}
 * @returns {Promise<Object>}
 */
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create user");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Update user role (Admin only)
 * @param {number} userId - ID of the user to update
 * @param {string} role - New role ('ADMIN' or 'USER')
 * @returns {Promise<Object>}
 */
export const updateUserRole = async (userId, role) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/role`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    if (!response.ok) throw new Error("Failed to update user role");
    return await response.json();
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

/**
 * Delete a user (Admin only)
 * @param {number} userId - ID of the user to delete
 * @returns {Promise<void>}
 */
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete user");
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

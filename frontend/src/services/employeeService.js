/**
 * Employee Service
 * Handles employee-related API operations
 */

import { getAuthHeaders } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Get all employees
 * @returns {Promise<Array>}
 */
export const getAllEmployees = async () => {
  const response = await fetch(`${API_BASE_URL}/api/employees`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch employees");
  }

  return await response.json();
};

/**
 * Get employee by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const getEmployeeById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Employee not found");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch employee");
  }

  return await response.json();
};

/**
 * Create new employee
 * @param {Object} employeeData
 * @returns {Promise<Object>}
 */
export const createEmployee = async (employeeData) => {
  const response = await fetch(`${API_BASE_URL}/api/employees`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(employeeData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create employee");
  }

  return await response.json();
};

/**
 * Update employee
 * @param {number} id
 * @param {Object} employeeData
 * @returns {Promise<Object>}
 */
export const updateEmployee = async (id, employeeData) => {
  const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(employeeData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update employee");
  }

  return await response.json();
};

/**
 * Delete employee
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteEmployee = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete employee");
  }
  // 204 No Content — do not try to parse JSON
};

// Export as default object for compatibility with "import employeeService from ..."
export default {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};

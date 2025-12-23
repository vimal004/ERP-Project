import { getAuthHeaders } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const deliveryChallansService = {
  async getAll(page = 0, size = 10, sortBy = "createdAt", sortDir = "desc") {
    const response = await fetch(
      `${API_URL}/api/delivery-challans?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
      { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } }
    );
    if (!response.ok) throw new Error("Failed to fetch delivery challans");
    return response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_URL}/api/delivery-challans/${id}`, {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch delivery challan");
    return response.json();
  },

  async create(challanData) {
    const response = await fetch(`${API_URL}/api/delivery-challans`, {
      method: "POST",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(challanData),
    });
    if (!response.ok) throw new Error("Failed to create delivery challan");
    return response.json();
  },

  async update(id, challanData) {
    const response = await fetch(`${API_URL}/api/delivery-challans/${id}`, {
      method: "PUT",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(challanData),
    });
    if (!response.ok) throw new Error("Failed to update delivery challan");
    return response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/api/delivery-challans/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to delete delivery challan");
    return response.json();
  },

  async search(term, page = 0, size = 10) {
    const response = await fetch(
      `${API_URL}/api/delivery-challans/search?term=${encodeURIComponent(
        term
      )}&page=${page}&size=${size}`,
      { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } }
    );
    if (!response.ok) throw new Error("Failed to search delivery challans");
    return response.json();
  },

  async updateStatus(id, status) {
    const response = await fetch(
      `${API_URL}/api/delivery-challans/${id}/status?status=${status}`,
      {
        method: "PATCH",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      }
    );
    if (!response.ok)
      throw new Error("Failed to update delivery challan status");
    return response.json();
  },

  async getStatistics() {
    const response = await fetch(
      `${API_URL}/api/delivery-challans/statistics`,
      {
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      }
    );
    if (!response.ok)
      throw new Error("Failed to fetch delivery challan statistics");
    return response.json();
  },
};

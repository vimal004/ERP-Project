import { getAuthHeaders } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const quotesService = {
  async getAll(page = 0, size = 10, sortBy = "createdAt", sortDir = "desc") {
    const response = await fetch(
      `${API_URL}/api/quotes?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
      { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } }
    );
    if (!response.ok) throw new Error("Failed to fetch quotes");
    return response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_URL}/api/quotes/${id}`, {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch quote");
    return response.json();
  },

  async create(quoteData) {
    const response = await fetch(`${API_URL}/api/quotes`, {
      method: "POST",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(quoteData),
    });
    if (!response.ok) throw new Error("Failed to create quote");
    return response.json();
  },

  async update(id, quoteData) {
    const response = await fetch(`${API_URL}/api/quotes/${id}`, {
      method: "PUT",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(quoteData),
    });
    if (!response.ok) throw new Error("Failed to update quote");
    return response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/api/quotes/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to delete quote");
    return response.json();
  },

  async search(term, page = 0, size = 10) {
    const response = await fetch(
      `${API_URL}/api/quotes/search?term=${encodeURIComponent(
        term
      )}&page=${page}&size=${size}`,
      { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } }
    );
    if (!response.ok) throw new Error("Failed to search quotes");
    return response.json();
  },

  async updateStatus(id, status) {
    const response = await fetch(
      `${API_URL}/api/quotes/${id}/status?status=${status}`,
      {
        method: "PATCH",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      }
    );
    if (!response.ok) throw new Error("Failed to update quote status");
    return response.json();
  },

  async getStatistics() {
    const response = await fetch(`${API_URL}/api/quotes/statistics`, {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch quote statistics");
    return response.json();
  },
};

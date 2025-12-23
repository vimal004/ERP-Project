import { getAuthHeaders } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const recurringInvoicesService = {
  async getAll(page = 0, size = 10, sortBy = "createdAt", sortDir = "desc") {
    const response = await fetch(
      `${API_URL}/api/recurring-invoices?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
      { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } }
    );
    if (!response.ok) throw new Error("Failed to fetch recurring invoices");
    return response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_URL}/api/recurring-invoices/${id}`, {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch recurring invoice");
    return response.json();
  },

  async create(invoiceData) {
    const response = await fetch(`${API_URL}/api/recurring-invoices`, {
      method: "POST",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(invoiceData),
    });
    if (!response.ok) throw new Error("Failed to create recurring invoice");
    return response.json();
  },

  async update(id, invoiceData) {
    const response = await fetch(`${API_URL}/api/recurring-invoices/${id}`, {
      method: "PUT",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(invoiceData),
    });
    if (!response.ok) throw new Error("Failed to update recurring invoice");
    return response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/api/recurring-invoices/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to delete recurring invoice");
    return response.json();
  },

  async search(term, page = 0, size = 10) {
    const response = await fetch(
      `${API_URL}/api/recurring-invoices/search?term=${encodeURIComponent(
        term
      )}&page=${page}&size=${size}`,
      { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } }
    );
    if (!response.ok) throw new Error("Failed to search recurring invoices");
    return response.json();
  },

  async pause(id) {
    const response = await fetch(
      `${API_URL}/api/recurring-invoices/${id}/pause`,
      {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      }
    );
    if (!response.ok) throw new Error("Failed to pause recurring invoice");
    return response.json();
  },

  async resume(id) {
    const response = await fetch(
      `${API_URL}/api/recurring-invoices/${id}/resume`,
      {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      }
    );
    if (!response.ok) throw new Error("Failed to resume recurring invoice");
    return response.json();
  },

  async getStatistics() {
    const response = await fetch(
      `${API_URL}/api/recurring-invoices/statistics`,
      {
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      }
    );
    if (!response.ok)
      throw new Error("Failed to fetch recurring invoice statistics");
    return response.json();
  },
};

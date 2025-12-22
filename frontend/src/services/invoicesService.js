import { getAuthHeader } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const invoicesService = {
  async getAll(page = 0, size = 10, sortBy = "createdAt", sortDir = "desc") {
    const response = await fetch(
      `${API_URL}/api/invoices?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
      { headers: { ...getAuthHeader(), "Content-Type": "application/json" } }
    );
    if (!response.ok) throw new Error("Failed to fetch invoices");
    return response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_URL}/api/invoices/${id}`, {
      headers: { ...getAuthHeader(), "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch invoice");
    return response.json();
  },

  async create(invoiceData) {
    const response = await fetch(`${API_URL}/api/invoices`, {
      method: "POST",
      headers: { ...getAuthHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(invoiceData),
    });
    if (!response.ok) throw new Error("Failed to create invoice");
    return response.json();
  },

  async update(id, invoiceData) {
    const response = await fetch(`${API_URL}/api/invoices/${id}`, {
      method: "PUT",
      headers: { ...getAuthHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(invoiceData),
    });
    if (!response.ok) throw new Error("Failed to update invoice");
    return response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/api/invoices/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader(), "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to delete invoice");
    return response.json();
  },

  async search(term, page = 0, size = 10) {
    const response = await fetch(
      `${API_URL}/api/invoices/search?term=${encodeURIComponent(
        term
      )}&page=${page}&size=${size}`,
      { headers: { ...getAuthHeader(), "Content-Type": "application/json" } }
    );
    if (!response.ok) throw new Error("Failed to search invoices");
    return response.json();
  },

  async recordPayment(id, amount) {
    const response = await fetch(
      `${API_URL}/api/invoices/${id}/payment?amount=${amount}`,
      {
        method: "POST",
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
      }
    );
    if (!response.ok) throw new Error("Failed to record payment");
    return response.json();
  },

  async getStatistics() {
    const response = await fetch(`${API_URL}/api/invoices/statistics`, {
      headers: { ...getAuthHeader(), "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch invoice statistics");
    return response.json();
  },
};

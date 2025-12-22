import { getAuthHeader } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const salesOrdersService = {
  async getAll(page = 0, size = 10, sortBy = "createdAt", sortDir = "desc") {
    const response = await fetch(
      `${API_URL}/api/sales-orders?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
      { headers: { ...getAuthHeader(), "Content-Type": "application/json" } }
    );
    if (!response.ok) throw new Error("Failed to fetch sales orders");
    return response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_URL}/api/sales-orders/${id}`, {
      headers: { ...getAuthHeader(), "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch sales order");
    return response.json();
  },

  async create(orderData) {
    const response = await fetch(`${API_URL}/api/sales-orders`, {
      method: "POST",
      headers: { ...getAuthHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error("Failed to create sales order");
    return response.json();
  },

  async update(id, orderData) {
    const response = await fetch(`${API_URL}/api/sales-orders/${id}`, {
      method: "PUT",
      headers: { ...getAuthHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error("Failed to update sales order");
    return response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/api/sales-orders/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader(), "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to delete sales order");
    return response.json();
  },

  async search(term, page = 0, size = 10) {
    const response = await fetch(
      `${API_URL}/api/sales-orders/search?term=${encodeURIComponent(
        term
      )}&page=${page}&size=${size}`,
      { headers: { ...getAuthHeader(), "Content-Type": "application/json" } }
    );
    if (!response.ok) throw new Error("Failed to search sales orders");
    return response.json();
  },

  async updateStatus(id, status) {
    const response = await fetch(
      `${API_URL}/api/sales-orders/${id}/status?status=${status}`,
      {
        method: "PATCH",
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
      }
    );
    if (!response.ok) throw new Error("Failed to update sales order status");
    return response.json();
  },

  async getStatistics() {
    const response = await fetch(`${API_URL}/api/sales-orders/statistics`, {
      headers: { ...getAuthHeader(), "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch sales order statistics");
    return response.json();
  },
};

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ShoppingBagIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { salesOrdersService } from "../../services/salesOrdersService";
import { isAdmin } from "../../services/authService";

/**
 * SalesOrdersPage - Material Design 3 (Google Store Aesthetic)
 */
const SalesOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = searchTerm
        ? await salesOrdersService.search(searchTerm, page, 10)
        : await salesOrdersService.getAll(page, 10, sortBy, sortDir);
      setOrders(data.content || []);
      setTotalPages(data.totalPages || 0);
      setError(null);
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, sortBy, sortDir]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      fetchOrders();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sales order?")) {
      try {
        await salesOrdersService.delete(id);
        fetchOrders();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      DRAFT: { bg: "#e8eaed", color: "#5f6368" },
      CONFIRMED: { bg: "#e8f0fe", color: "#1a73e8" },
      SHIPPED: { bg: "#e6f4ea", color: "#1e8e3e" },
      DELIVERED: { bg: "#e6f4ea", color: "#1e8e3e" },
      CANCELLED: { bg: "#fce8e6", color: "#d93025" },
    };
    return styles[status] || { bg: "#e8eaed", color: "#5f6368" };
  };

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-2xl sm:text-3xl font-normal"
          style={{ color: "#202124" }}
        >
          Sales Orders
        </h1>
        {isAdmin() && (
          <Link
            to="/sales/salesorders/new"
            className="flex items-center text-sm font-medium py-3 px-6 text-white transition-all duration-200"
            style={{
              backgroundColor: "#1a73e8",
              borderRadius: "9999px",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#1557b0")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#1a73e8")
            }
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">New Sales Order</span>
            <span className="sm:hidden">New</span>
          </Link>
        )}
      </div>

      {/* Content Card */}
      <div
        className="p-6 min-h-[70vh]"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          boxShadow:
            "0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)",
        }}
      >
        {/* Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-end mb-6 space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative w-full md:w-auto">
            <MagnifyingGlassIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: "#80868b" }}
            />
            <input
              type="text"
              placeholder="Search sales orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2.5 text-sm transition-all duration-200"
              style={{
                backgroundColor: "#f1f3f4",
                border: "none",
                borderRadius: "8px",
                color: "#202124",
              }}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="px-4 py-3 mb-4 text-sm"
            style={{
              backgroundColor: "#fce8e6",
              color: "#d93025",
              borderRadius: "12px",
            }}
          >
            {error}
          </div>
        )}

        {/* Table */}
        <div
          className="overflow-x-auto"
          style={{ borderTop: "1px solid #e8eaed" }}
        >
          {/* Table Header */}
          <div
            className="flex items-center py-4 text-xs font-medium uppercase tracking-wide min-w-[900px]"
            style={{
              color: "#5f6368",
              borderBottom: "1px solid #e8eaed",
            }}
          >
            <span
              className="w-[12%] px-4 cursor-pointer hover:text-blue-600 transition-colors duration-200"
              onClick={() => {
                setSortBy("salesOrderDate");
                setSortDir(sortDir === "asc" ? "desc" : "asc");
              }}
            >
              Date
            </span>
            <span className="w-[15%] px-4">Sales Order#</span>
            <span className="w-[12%] px-4">Reference#</span>
            <span className="w-[21%] px-4">Customer Name</span>
            <span className="w-[12%] px-4">Status</span>
            <span className="w-[13%] px-4 text-right">Amount</span>
            {isAdmin() && (
              <span className="w-[15%] px-4 text-center">Actions</span>
            )}
          </div>

          {/* Table Body */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div
                className="animate-spin rounded-full h-8 w-8 border-2"
                style={{ borderColor: "#e8eaed", borderTopColor: "#1a73e8" }}
              />
            </div>
          ) : orders.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center pt-20"
              style={{ minHeight: "40vh" }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: "#e8f0fe" }}
              >
                <ShoppingBagIcon
                  className="w-10 h-10"
                  style={{ color: "#1a73e8" }}
                />
              </div>
              <p
                className="text-xl font-medium mb-2"
                style={{ color: "#202124" }}
              >
                No Sales Orders Found
              </p>
              <p
                className="text-sm text-center max-w-sm"
                style={{ color: "#5f6368" }}
              >
                You haven't created any sales orders yet. Click 'New Sales
                Order' to create one.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center py-4 text-sm min-w-[900px] transition-all duration-200 hover:bg-gray-50"
                style={{
                  color: "#202124",
                  borderBottom: "1px solid #e8eaed",
                }}
              >
                <span className="w-[12%] px-4" style={{ color: "#5f6368" }}>
                  {order.salesOrderDate}
                </span>
                <span
                  className="w-[15%] px-4 font-medium"
                  style={{ color: "#1a73e8" }}
                >
                  {order.salesOrderNumber}
                </span>
                <span className="w-[12%] px-4" style={{ color: "#5f6368" }}>
                  {order.reference || "-"}
                </span>
                <span className="w-[21%] px-4">{order.customerName}</span>
                <span className="w-[12%] px-4">
                  <span
                    className="px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: getStatusBadge(order.status).bg,
                      color: getStatusBadge(order.status).color,
                      borderRadius: "9999px",
                    }}
                  >
                    {order.status}
                  </span>
                </span>
                <span className="w-[13%] px-4 text-right font-medium">
                  ₹{order.total?.toLocaleString() || "0.00"}
                </span>
                {isAdmin() && (
                  <span className="w-[15%] px-4 flex justify-center gap-2">
                    <Link
                      to={`/sales/salesorders/edit/${order.id}`}
                      className="p-2 rounded-full transition-all duration-200 hover:bg-blue-50"
                      style={{ color: "#1a73e8" }}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="p-2 rounded-full transition-all duration-200 hover:bg-red-50"
                      style={{ color: "#d93025" }}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-4 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-50"
              style={{
                color: "#1a73e8",
                border: "1px solid #dadce0",
                borderRadius: "9999px",
              }}
            >
              Previous
            </button>
            <span className="text-sm" style={{ color: "#5f6368" }}>
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-50"
              style={{
                color: "#1a73e8",
                border: "1px solid #dadce0",
                borderRadius: "9999px",
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesOrdersPage;

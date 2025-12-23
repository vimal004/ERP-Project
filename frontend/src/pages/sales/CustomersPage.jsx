import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  UserGroupIcon,
  ArrowPathIcon,
  TrashIcon,
  PencilIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  getCustomers,
  searchCustomers,
  deleteCustomer,
} from "../../services/customersService";
import { isAdmin } from "../../services/authService";

/**
 * CustomersPage - Material Design 3 (Google Store Aesthetic)
 */
const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState("displayName");
  const [sortDir, setSortDir] = useState("asc");
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (searchTerm.trim()) {
        data = await searchCustomers(searchTerm, currentPage, pageSize);
      } else {
        data = await getCustomers(currentPage, pageSize, sortBy, sortDir);
      }
      setCustomers(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError(err.message || "Failed to fetch customers");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortBy, sortDir, searchTerm]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(0);
      fetchCustomers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
    setCurrentPage(0);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCustomers(customers.map((c) => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelect = (id) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter((i) => i !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      await deleteCustomer(customerToDelete.id);
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
      fetchCustomers();
    } catch (err) {
      setError(err.message || "Failed to delete customer");
    }
  };

  const formatCurrency = (amount, currency = "INR") => {
    if (amount === null || amount === undefined) return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      ACTIVE: { bg: "#e6f4ea", color: "#1e8e3e" },
      INACTIVE: { bg: "#e8eaed", color: "#5f6368" },
    };
    return styles[status] || styles.ACTIVE;
  };

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-2xl sm:text-3xl font-normal"
          style={{ color: "#202124" }}
        >
          Customers
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCustomers}
            className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100"
            style={{ color: "#5f6368" }}
            title="Refresh"
          >
            <ArrowPathIcon
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
            />
          </button>
          {isAdmin() && (
            <Link
              to="/sales/customers/new"
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
              <span className="hidden sm:inline">New Customer</span>
              <span className="sm:hidden">New</span>
            </Link>
          )}
        </div>
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
        {/* Search and filter row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-3 md:space-y-0">
          <div className="text-sm" style={{ color: "#5f6368" }}>
            {totalElements > 0 &&
              `Showing ${customers.length} of ${totalElements} customers`}
          </div>
          <div className="relative w-full md:w-auto">
            <MagnifyingGlassIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: "#80868b" }}
            />
            <input
              type="text"
              placeholder="Search customer name..."
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

        {/* Error message */}
        {error && (
          <div
            className="px-4 py-3 mb-4 flex items-center text-sm"
            style={{
              backgroundColor: "#fce8e6",
              color: "#d93025",
              borderRadius: "12px",
            }}
          >
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div
              className="animate-spin rounded-full h-8 w-8 border-2"
              style={{ borderColor: "#e8eaed", borderTopColor: "#1a73e8" }}
            />
          </div>
        ) : customers.length === 0 ? (
          /* Empty State */
          <div
            className="flex flex-col items-center justify-center pt-20"
            style={{ minHeight: "40vh" }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: "#e8f0fe" }}
            >
              <UserGroupIcon
                className="w-10 h-10"
                style={{ color: "#1a73e8" }}
              />
            </div>
            <p
              className="text-xl font-medium mb-2"
              style={{ color: "#202124" }}
            >
              No Customers Found
            </p>
            <p
              className="text-sm text-center max-w-sm"
              style={{ color: "#5f6368" }}
            >
              {searchTerm
                ? "No customers match your search criteria."
                : "Your customer contact list is currently empty. Click 'New Customer' to add one."}
            </p>
          </div>
        ) : (
          /* Table */
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
              <input
                type="checkbox"
                className="mr-4"
                style={{ accentColor: "#1a73e8" }}
                checked={
                  selectedCustomers.length === customers.length &&
                  customers.length > 0
                }
                onChange={handleSelectAll}
              />
              <span
                className="w-[22%] px-4 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                onClick={() => handleSort("displayName")}
              >
                Name{" "}
                {sortBy === "displayName" && (sortDir === "asc" ? "↑" : "↓")}
              </span>
              <span className="w-[18%] px-4">Email</span>
              <span className="w-[12%] px-4">Phone</span>
              <span
                className="w-[15%] px-4 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                onClick={() => handleSort("receivablesBalance")}
              >
                Receivables{" "}
                {sortBy === "receivablesBalance" &&
                  (sortDir === "asc" ? "↑" : "↓")}
              </span>
              <span className="w-[13%] px-4">Last Contact</span>
              <span className="w-[10%] px-4">Status</span>
              {isAdmin() && (
                <span className="w-[10%] px-4 text-right">Actions</span>
              )}
            </div>

            {/* Table Rows */}
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center py-4 text-sm min-w-[900px] transition-all duration-200 hover:bg-gray-50"
                style={{
                  color: "#202124",
                  borderBottom: "1px solid #e8eaed",
                }}
              >
                <input
                  type="checkbox"
                  className="mr-4"
                  style={{ accentColor: "#1a73e8" }}
                  checked={selectedCustomers.includes(customer.id)}
                  onChange={() => handleSelect(customer.id)}
                />
                <span className="w-[22%] px-4 font-medium truncate">
                  {customer.displayName}
                  {customer.companyName && (
                    <span
                      className="text-xs block"
                      style={{ color: "#5f6368" }}
                    >
                      {customer.companyName}
                    </span>
                  )}
                </span>
                <span
                  className="w-[18%] px-4 truncate"
                  style={{ color: "#5f6368" }}
                >
                  {customer.email || "-"}
                </span>
                <span className="w-[12%] px-4" style={{ color: "#5f6368" }}>
                  {customer.mobilePhone || customer.workPhone || "-"}
                </span>
                <span className="w-[15%] px-4 font-medium">
                  {formatCurrency(
                    customer.receivablesBalance,
                    customer.currency
                  )}
                </span>
                <span className="w-[13%] px-4" style={{ color: "#5f6368" }}>
                  {formatDate(customer.lastContactAt)}
                </span>
                <span className="w-[10%] px-4">
                  <span
                    className="px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: getStatusBadge(customer.status).bg,
                      color: getStatusBadge(customer.status).color,
                      borderRadius: "9999px",
                    }}
                  >
                    {customer.status || "ACTIVE"}
                  </span>
                </span>
                {isAdmin() && (
                  <span className="w-[10%] px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/sales/customers/edit/${customer.id}`}
                        className="p-2 rounded-full transition-all duration-200 hover:bg-blue-50"
                        style={{ color: "#1a73e8" }}
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(customer)}
                        className="p-2 rounded-full transition-all duration-200 hover:bg-red-50"
                        style={{ color: "#d93025" }}
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </span>
                )}
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between py-4 px-2">
                <div className="text-sm" style={{ color: "#5f6368" }}>
                  Page {currentPage + 1} of {totalPages}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-50"
                    style={{
                      color: "#1a73e8",
                      border: "1px solid #dadce0",
                      borderRadius: "9999px",
                    }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                    }
                    disabled={currentPage >= totalPages - 1}
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
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal - MD3 Style */}
      {deleteModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.32)" }}
        >
          <div
            className="max-w-md w-full mx-4 overflow-hidden"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "28px",
              boxShadow:
                "0 8px 12px 6px rgba(60, 64, 67, 0.15), 0 4px 4px 0 rgba(60, 64, 67, 0.3)",
            }}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: "#fce8e6" }}
                >
                  <ExclamationTriangleIcon
                    className="w-5 h-5"
                    style={{ color: "#d93025" }}
                  />
                </div>
                <h3
                  className="text-lg font-medium"
                  style={{ color: "#202124" }}
                >
                  Delete Customer
                </h3>
              </div>
              <p className="mb-6" style={{ color: "#5f6368" }}>
                Are you sure you want to delete{" "}
                <span className="font-medium" style={{ color: "#202124" }}>
                  {customerToDelete?.displayName}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setCustomerToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-100"
                  style={{
                    color: "#1a73e8",
                    borderRadius: "9999px",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white transition-all duration-200"
                  style={{
                    backgroundColor: "#d93025",
                    borderRadius: "9999px",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;

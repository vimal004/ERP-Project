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
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

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

  const TransactionTab = ({ customer }) => {
    const sections = [
      { id: "invoices", label: "Invoices", count: 1 },
      { id: "payments", label: "Customer Payments", count: 1 },
      { id: "quotes", label: "Quotes", count: 0 },
      { id: "orders", label: "Sales Orders", count: 0 },
      { id: "challans", label: "Delivery Challans", count: 0 },
    ];

    return (
      <div className="p-6 space-y-6">
        {sections.map((section) => (
          <div
            key={section.id}
            className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
              <span className="font-semibold text-sm text-gray-700">
                {section.label}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">
                  Total Count: {section.count}
                </span>
                <Link
                  to={`/sales/${section.id}/new`}
                  className="text-white text-xs font-semibold px-3 py-1 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  + New
                </Link>
              </div>
            </div>
            {section.count > 0 && section.id === "invoices" && (
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-white text-gray-400 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-2 font-medium">DATE</th>
                      <th className="px-4 py-2 font-medium">INVOICE#</th>
                      <th className="px-4 py-2 font-medium text-right">
                        AMOUNT
                      </th>
                      <th className="px-4 py-2 font-medium">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50 border-b border-gray-50 last:border-0">
                      <td className="px-4 py-3">22/11/2025</td>
                      <td className="px-4 py-3 text-blue-600 font-semibold cursor-pointer">
                        INV-000001
                      </td>
                      <td className="px-4 py-3 text-right">₹10.00</td>
                      <td className="px-4 py-3">
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          Paid
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const CustomerTableView = () => (
    <div
      className="p-6 min-h-[70vh]"
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        boxShadow:
          "0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)",
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-3 md:space-y-0">
        <div className="text-sm" style={{ color: "#5f6368" }}>
          {totalElements > 0 &&
            `Showing ${customers.length} of ${totalElements} customers`}
        </div>
        <div className="relative w-full md:w-auto">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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

      <div
        className="overflow-x-auto"
        style={{ borderTop: "1px solid #e8eaed" }}
      >
        <div
          className="flex items-center py-4 text-xs font-bold uppercase tracking-wider min-w-[900px]"
          style={{ color: "#5f6368", borderBottom: "1px solid #e8eaed" }}
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
            Name {sortBy === "displayName" && (sortDir === "asc" ? "↑" : "↓")}
          </span>
          <span className="w-[18%] px-4">Company Name</span>
          <span className="w-[18%] px-4">Email</span>
          <span className="w-[12%] px-4">Work Phone</span>
          <span
            className="w-[15%] px-4 cursor-pointer hover:text-blue-600 transition-colors duration-200"
            onClick={() => handleSort("receivablesBalance")}
          >
            Receivables{" "}
            {sortBy === "receivablesBalance" && (sortDir === "asc" ? "↑" : "↓")}
          </span>
          <span className="w-[10%] px-4 text-right">Actions</span>
        </div>

        {customers.map((customer) => (
          <div
            key={customer.id}
            onClick={() => setSelectedCustomer(customer)}
            className="flex items-center py-4 text-sm min-w-[900px] transition-all duration-200 hover:bg-gray-50 cursor-pointer"
            style={{ color: "#202124", borderBottom: "1px solid #e8eaed" }}
          >
            <input
              type="checkbox"
              className="mr-4"
              style={{ accentColor: "#1a73e8" }}
              checked={selectedCustomers.includes(customer.id)}
              onChange={(e) => {
                e.stopPropagation();
                handleSelect(customer.id);
              }}
            />
            <span className="w-[22%] px-4 font-semibold text-blue-600 hover:underline">
              {customer.displayName}
            </span>
            <span className="w-[18%] px-4 text-gray-600 uppercase text-xs font-semibold">
              {customer.companyName || "-"}
            </span>
            <span className="w-[18%] px-4 truncate text-gray-500">
              {customer.email || "-"}
            </span>
            <span className="w-[12%] px-4 text-gray-500">
              {customer.workPhone || "-"}
            </span>
            <span className="w-[15%] px-4 font-bold text-gray-900">
              {formatCurrency(customer.receivablesBalance, customer.currency)}
            </span>
            <span className="w-[10%] px-4 text-right">
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(customer);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </span>
          </div>
        ))}
      </div>
    </div>
  );

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

      {/* Conditional Rendering: Table View or Split View */}
      {!selectedCustomer ? (
        <CustomerTableView />
      ) : (
        <div className="flex gap-6 h-[80vh]">
          {/* Narrow Left List */}
          <div
            className="w-1/3 transition-all duration-300 flex flex-col"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "24px",
              boxShadow:
                "0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)",
              overflow: "hidden",
            }}
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="divide-y divide-gray-100">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className={`p-4 cursor-pointer transition-all duration-150 relative border-l-4 ${
                      selectedCustomer?.id === customer.id
                        ? "bg-blue-50 border-blue-600 shadow-sm"
                        : "hover:bg-gray-50 border-transparent opacity-70"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-semibold truncate ${
                            selectedCustomer?.id === customer.id
                              ? "text-blue-700"
                              : "text-gray-900"
                          }`}
                        >
                          {customer.displayName}
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">
                          {customer.companyName || "No Company"}
                        </p>
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <p className="text-xs font-bold text-gray-700">
                          {formatCurrency(
                            customer.receivablesBalance,
                            customer.currency
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expanded Right Details */}
          <div
            className="flex-1 flex flex-col transition-all duration-300"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "24px",
              boxShadow:
                "0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {selectedCustomer.displayName?.[0]?.toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedCustomer.displayName}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to={`/sales/customers/edit/${selectedCustomer.id}`}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit
                </Link>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                  onClick={() => setSelectedCustomer(null)}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Tab Bar */}
            <div className="px-6 border-b border-gray-100 flex gap-8 bg-white overflow-x-auto">
              {[
                "overview",
                "comments",
                "transactions",
                "mails",
                "statement",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50/30">
              {activeTab === "overview" && (
                <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="xl:col-span-2 space-y-8">
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            General Information
                          </h4>
                        </div>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                              Email
                            </p>
                            <p className="text-sm font-medium text-blue-600">
                              {selectedCustomer.email || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                              Work Phone
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedCustomer.workPhone || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                              Currency
                            </p>
                            <p className="text-sm font-medium text-gray-900 font-mono tracking-tighter">
                              {selectedCustomer.currency || "INR"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Addresses */}
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">
                          Addresses
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="relative">
                            <div className="absolute -left-3 top-0 w-1 h-6 bg-blue-500 rounded-full" />
                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-3 px-2">
                              Billing Address
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed px-2">
                              {selectedCustomer.billingAddress ||
                                "Not specified"}
                            </p>
                          </div>
                          <div className="relative">
                            <div className="absolute -left-3 top-0 w-1 h-6 bg-green-500 rounded-full" />
                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-3 px-2">
                              Shipping Address
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed px-2">
                              {selectedCustomer.shippingAddress ||
                                "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Financial Side Panel */}
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                          Financial Overview
                        </h4>
                        <div className="space-y-6">
                          <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                            <p className="text-[10px] text-red-400 font-bold uppercase mb-1">
                              Receivables
                            </p>
                            <p className="text-2xl font-black text-red-600">
                              {formatCurrency(
                                selectedCustomer.receivablesBalance,
                                selectedCustomer.currency
                              )}
                            </p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                            <p className="text-[10px] text-green-400 font-bold uppercase mb-1">
                              Unused Credits
                            </p>
                            <p className="text-2xl font-black text-green-600">
                              ₹0.00
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-200">
                        <p className="text-xs text-blue-100 font-bold uppercase tracking-widest mb-2">
                          Total Income
                        </p>
                        <p className="text-3xl font-black text-white mb-4">
                          ₹10.00
                        </p>
                        <div className="h-1 bg-blue-400 rounded-full overflow-hidden">
                          <div className="w-[10%] h-full bg-white shadow-[0_0_10px_white]" />
                        </div>
                        <p className="text-[10px] text-blue-100 mt-2 font-medium">
                          10% increase from last month
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "transactions" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <TransactionTab customer={selectedCustomer} />
                </div>
              )}

              {["comments", "mails", "statement"].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center p-20 text-gray-400 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ArrowPathIcon className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="text-sm font-medium italic">
                    The {activeTab} history is currently empty for this
                    customer.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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

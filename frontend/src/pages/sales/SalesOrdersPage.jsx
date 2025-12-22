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
      DRAFT: "bg-gray-100 text-gray-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      SHIPPED: "bg-green-100 text-green-800",
      DELIVERED: "bg-emerald-100 text-emerald-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Sales Orders
        </h1>
        <div className="flex items-center space-x-4">
          <Link
            to="/sales/salesorders/new"
            className="flex items-center bg-blue-600 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-150"
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">New Sales Order</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 min-h-[70vh]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-end mb-4 space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex items-center w-full md:w-auto">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search sales orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg p-1.5 text-sm focus:ring-blue-500 focus:border-blue-500 w-full md:w-48"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="overflow-x-auto whitespace-nowrap border-t border-gray-200">
          <div className="flex items-center border-b border-gray-200 py-3 text-sm font-semibold text-gray-700 min-w-[900px]">
            <span
              className="w-[12%] px-2 cursor-pointer hover:text-blue-600"
              onClick={() => {
                setSortBy("salesOrderDate");
                setSortDir(sortDir === "asc" ? "desc" : "asc");
              }}
            >
              DATE
            </span>
            <span className="w-[15%] px-2">SALES ORDER#</span>
            <span className="w-[12%] px-2">REFERENCE#</span>
            <span className="w-[21%] px-2">CUSTOMER NAME</span>
            <span className="w-[12%] px-2">STATUS</span>
            <span className="w-[13%] px-2 text-right">AMOUNT</span>
            <span className="w-[15%] px-2 text-center">ACTIONS</span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : orders.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-full pt-20"
              style={{ minHeight: "40vh" }}
            >
              <ShoppingBagIcon className="w-16 h-16 text-blue-300 mb-4" />
              <p className="text-xl font-semibold text-gray-700 mb-2">
                No Sales Orders Found
              </p>
              <p className="text-gray-500 text-center">
                You haven't created any sales orders yet. Click 'New Sales
                Order' to create one.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center border-b border-gray-100 py-3 text-sm text-gray-600 hover:bg-gray-50 min-w-[900px]"
              >
                <span className="w-[12%] px-2">{order.salesOrderDate}</span>
                <span className="w-[15%] px-2 font-medium text-blue-600">
                  {order.salesOrderNumber}
                </span>
                <span className="w-[12%] px-2">{order.reference || "-"}</span>
                <span className="w-[21%] px-2">{order.customerName}</span>
                <span className="w-[12%] px-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </span>
                <span className="w-[13%] px-2 text-right font-medium">
                  ₹{order.total?.toLocaleString() || "0.00"}
                </span>
                <span className="w-[15%] px-2 flex justify-center space-x-2">
                  <Link
                    to={`/sales/salesorders/edit/${order.id}`}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </span>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
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

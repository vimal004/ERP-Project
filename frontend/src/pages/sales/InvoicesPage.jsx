import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  DocumentTextIcon,
  TrashIcon,
  PencilIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";
import { invoicesService } from "../../services/invoicesService";

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = searchTerm
        ? await invoicesService.search(searchTerm, page, 10)
        : await invoicesService.getAll(page, 10, sortBy, sortDir);
      setInvoices(data.content || []);
      setTotalPages(data.totalPages || 0);
      setError(null);
    } catch (err) {
      setError(err.message);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [page, sortBy, sortDir]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      fetchInvoices();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await invoicesService.delete(id);
        fetchInvoices();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      DRAFT: "bg-gray-100 text-gray-800",
      SENT: "bg-blue-100 text-blue-800",
      PAID: "bg-green-100 text-green-800",
      OVERDUE: "bg-red-100 text-red-800",
      PARTIALLY_PAID: "bg-yellow-100 text-yellow-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Invoices
        </h1>
        <div className="flex items-center space-x-4">
          <Link
            to="/sales/invoices/new"
            className="flex items-center bg-blue-600 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-150"
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">New Invoice</span>
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
              placeholder="Search invoices..."
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
          <div className="flex items-center border-b border-gray-200 py-3 text-sm font-semibold text-gray-700 min-w-[1000px]">
            <span
              className="w-[10%] px-2 cursor-pointer hover:text-blue-600"
              onClick={() => {
                setSortBy("invoiceDate");
                setSortDir(sortDir === "asc" ? "desc" : "asc");
              }}
            >
              DATE
            </span>
            <span className="w-[12%] px-2">INVOICE#</span>
            <span className="w-[18%] px-2">CUSTOMER NAME</span>
            <span className="w-[10%] px-2">DUE DATE</span>
            <span className="w-[10%] px-2">STATUS</span>
            <span className="w-[12%] px-2 text-right">AMOUNT</span>
            <span className="w-[12%] px-2 text-right">BALANCE</span>
            <span className="w-[16%] px-2 text-center">ACTIONS</span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : invoices.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-full pt-20"
              style={{ minHeight: "40vh" }}
            >
              <DocumentTextIcon className="w-16 h-16 text-blue-300 mb-4" />
              <p className="text-xl font-semibold text-gray-700 mb-2">
                No Invoices Found
              </p>
              <p className="text-gray-500 text-center">
                You haven't created any invoices yet. Click 'New Invoice' to
                create one.
              </p>
            </div>
          ) : (
            invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center border-b border-gray-100 py-3 text-sm text-gray-600 hover:bg-gray-50 min-w-[1000px]"
              >
                <span className="w-[10%] px-2">{invoice.invoiceDate}</span>
                <span className="w-[12%] px-2 font-medium text-blue-600">
                  {invoice.invoiceNumber}
                </span>
                <span className="w-[18%] px-2">{invoice.customerName}</span>
                <span className="w-[10%] px-2">{invoice.dueDate || "-"}</span>
                <span className="w-[10%] px-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      invoice.status
                    )}`}
                  >
                    {invoice.status}
                  </span>
                </span>
                <span className="w-[12%] px-2 text-right font-medium">
                  ₹{invoice.total?.toLocaleString() || "0.00"}
                </span>
                <span className="w-[12%] px-2 text-right font-medium text-orange-600">
                  ₹{invoice.balanceDue?.toLocaleString() || "0.00"}
                </span>
                <span className="w-[16%] px-2 flex justify-center space-x-2">
                  <Link
                    to={`/sales/invoices/edit/${invoice.id}`}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(invoice.id)}
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

export default InvoicesPage;

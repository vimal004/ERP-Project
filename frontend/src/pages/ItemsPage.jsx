import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import { getItems, searchItems, deleteItem } from "../services/itemsService";
import { isAdmin } from "../services/authService";

/**
 * ItemsPage - Material Design 3 (Google Store Aesthetic)
 */
const ItemsPage = () => {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || null
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchItems();
  }, [currentPage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getItems(currentPage, 10, "name", "asc");
      setItems(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError("Failed to load items. Please ensure the backend is running.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      fetchItems();
      return;
    }

    try {
      setLoading(true);
      const data = await searchItems(term, 0, 10);
      setItems(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await deleteItem(id);
      setSuccessMessage("Item deleted successfully!");
      fetchItems();
    } catch (err) {
      setError("Failed to delete item");
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "-";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getTypeBadge = (type) => {
    const styles = {
      GOODS: { bg: "#e6f4ea", color: "#1e8e3e" },
      SERVICE: { bg: "#e8f0fe", color: "#1a73e8" },
    };
    return styles[type] || { bg: "#e8eaed", color: "#5f6368" };
  };

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-2xl sm:text-3xl font-normal"
          style={{ color: "#202124" }}
        >
          All Items
        </h1>
        {isAdmin() && (
          <Link
            to="/items/new"
            className="flex items-center text-sm font-medium py-3 px-6 text-white transition-all duration-200"
            style={{
              backgroundColor: "#1a73e8",
              color: "#ffffff",
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
            <span className="hidden sm:inline">New Item</span>
            <span className="sm:hidden">New</span>
          </Link>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div
          className="mb-4 p-4 text-sm"
          style={{
            backgroundColor: "#e6f4ea",
            color: "#1e8e3e",
            borderRadius: "12px",
          }}
        >
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="mb-4 p-4 text-sm flex items-center justify-between"
          style={{
            backgroundColor: "#fce8e6",
            color: "#d93025",
            borderRadius: "12px",
          }}
        >
          <span>{error}</span>
          <button
            onClick={fetchItems}
            className="underline font-medium"
            style={{ color: "#d93025" }}
          >
            Retry
          </button>
        </div>
      )}

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
        {/* Search Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-3 md:space-y-0">
          <div className="text-sm" style={{ color: "#5f6368" }}>
            {!loading &&
              `${totalElements} item${totalElements !== 1 ? "s" : ""} found`}
          </div>
          <div className="relative w-full md:w-auto">
            <MagnifyingGlassIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: "#80868b" }}
            />
            <input
              type="text"
              placeholder="Search item name or SKU..."
              value={searchTerm}
              onChange={handleSearch}
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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div
              className="animate-spin rounded-full h-8 w-8 border-2"
              style={{ borderColor: "#e8eaed", borderTopColor: "#1a73e8" }}
            />
          </div>
        )}

        {/* Table */}
        {!loading && items.length > 0 && (
          <div
            className="overflow-x-auto"
            style={{ borderTop: "1px solid #e8eaed" }}
          >
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3 pt-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-gray-100 transition-all duration-200 active:scale-[0.98]"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <span
                        className="inline-block px-2 py-0.5 text-xs font-medium mt-1"
                        style={{
                          backgroundColor: getTypeBadge(item.type).bg,
                          color: getTypeBadge(item.type).color,
                          borderRadius: "9999px",
                        }}
                      >
                        {item.type}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900">
                        {formatCurrency(item.sellingPrice)}
                      </p>
                      <p className="text-xs text-gray-500">Selling Price</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                    <span>Cost: {formatCurrency(item.costPrice)}</span>
                    {item.unit && <span>Unit: {item.unit}</span>}
                  </div>
                  {item.salesDescription && (
                    <p className="text-xs text-gray-500 truncate mb-3">
                      {item.salesDescription}
                    </p>
                  )}
                  {isAdmin() && (
                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                      <Link
                        to={`/items/${item.id}/edit`}
                        className="p-2 rounded-full transition-all duration-200 hover:bg-blue-50"
                        style={{ color: "#1a73e8" }}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="p-2 rounded-full transition-all duration-200 hover:bg-red-50"
                        style={{ color: "#d93025" }}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              {/* Table Header */}
              <div
                className="flex items-center py-4 text-xs font-medium uppercase tracking-wide min-w-[900px]"
                style={{
                  color: "#5f6368",
                  borderBottom: "1px solid #e8eaed",
                }}
              >
                <span className="w-[20%] px-4">Name</span>
                <span className="w-[10%] px-4">Type</span>
                <span className="w-[15%] px-4">Selling Price</span>
                <span className="w-[15%] px-4">Cost Price</span>
                <span className="w-[20%] px-4">Description</span>
                <span className="w-[10%] px-4">Unit</span>
                {isAdmin() && <span className="w-[10%] px-4">Actions</span>}
              </div>

              {/* Table Rows */}
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center py-4 text-sm min-w-[900px] transition-all duration-200 hover:bg-gray-50"
                  style={{
                    color: "#202124",
                    borderBottom: "1px solid #e8eaed",
                  }}
                >
                  <span className="w-[20%] px-4 font-medium">{item.name}</span>
                  <span className="w-[10%] px-4">
                    <span
                      className="px-3 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: getTypeBadge(item.type).bg,
                        color: getTypeBadge(item.type).color,
                        borderRadius: "9999px",
                      }}
                    >
                      {item.type}
                    </span>
                  </span>
                  <span className="w-[15%] px-4">
                    {formatCurrency(item.sellingPrice)}
                  </span>
                  <span className="w-[15%] px-4" style={{ color: "#5f6368" }}>
                    {formatCurrency(item.costPrice)}
                  </span>
                  <span
                    className="w-[20%] px-4 truncate"
                    style={{ color: "#5f6368" }}
                    title={item.salesDescription}
                  >
                    {item.salesDescription || "-"}
                  </span>
                  <span className="w-[10%] px-4" style={{ color: "#5f6368" }}>
                    {item.unit || "-"}
                  </span>
                  {isAdmin() && (
                    <span className="w-[10%] px-4 flex gap-2">
                      <Link
                        to={`/items/${item.id}/edit`}
                        className="p-2 rounded-full transition-all duration-200 hover:bg-blue-50"
                        style={{ color: "#1a73e8" }}
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="p-2 rounded-full transition-all duration-200 hover:bg-red-50"
                        style={{ color: "#d93025" }}
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && !error && (
          <div
            className="flex flex-col items-center justify-center pt-20"
            style={{ minHeight: "40vh" }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: "#e8f0fe" }}
            >
              <CubeIcon className="w-10 h-10" style={{ color: "#1a73e8" }} />
            </div>
            <p
              className="text-xl font-medium mb-2"
              style={{ color: "#202124" }}
            >
              No Items Found
            </p>
            <p
              className="text-sm text-center max-w-sm"
              style={{ color: "#5f6368" }}
            >
              Goods and Services, if they have a price tag, put them here. Click
              'New Item' to get started.
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
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
            <span className="text-sm" style={{ color: "#5f6368" }}>
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
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
        )}
      </div>
    </div>
  );
};

export default ItemsPage;

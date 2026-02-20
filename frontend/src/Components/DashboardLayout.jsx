import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Side-bar";
import {
  PlusIcon,
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  UserCircleIcon,
  ArrowLeftEndOnRectangleIcon,
  UserPlusIcon,
  XMarkIcon,
  TrashIcon,
  UserIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  UsersIcon,
  HomeIcon,
  CubeIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { logout, getUserRole, getUserName } from "../services/authService";
import {
  fetchUsers,
  createUser,
  updateUserRole,
  deleteUser,
} from "../services/userService";

/**
 * User Management Modal - Material Design 3
 */
const UserManagementModal = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // 'list' or 'create'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [status, setStatus] = useState({ message: "", type: "" });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      setStatus({ message: "Failed to load users.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData);
      setStatus({ message: "User created successfully!", type: "success" });
      setFormData({ name: "", email: "", password: "", role: "USER" });
      setView("list");
      loadUsers();
    } catch (error) {
      setStatus({
        message: error.message || "Failed to create user.",
        type: "error",
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
      setStatus({ message: "User deleted successfully!", type: "success" });
      loadUsers();
    } catch (error) {
      setStatus({ message: "Failed to delete user.", type: "error" });
    }
  };

  const handleChangeRole = async (userId, currentRole) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    try {
      await updateUserRole(userId, newRole);
      setStatus({ message: "User role updated!", type: "success" });
      loadUsers();
    } catch (error) {
      setStatus({ message: "Failed to update role.", type: "error" });
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.32)" }}
    >
      <div
        className="w-full max-w-2xl overflow-hidden animate-fade-in"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "28px",
          boxShadow:
            "0 8px 12px 6px rgba(60, 64, 67, 0.15), 0 4px 4px 0 rgba(60, 64, 67, 0.3)",
        }}
      >
        {/* Header */}
        <div
          className="flex justify-between items-center p-6"
          style={{ borderBottom: "1px solid #e8eaed" }}
        >
          <h3
            className="text-xl font-medium flex items-center gap-3"
            style={{ color: "#202124" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#e8f0fe" }}
            >
              <UserPlusIcon className="w-5 h-5" style={{ color: "#1a73e8" }} />
            </div>
            {view === "list" ? "Manage Users" : "Create New User"}
          </h3>
          <div className="flex gap-2">
            {view === "list" && (
              <button
                onClick={() => setView("create")}
                className="px-4 py-2 text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: "#1a73e8",
                  color: "#ffffff",
                  borderRadius: "9999px",
                }}
              >
                + Add User
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100"
              style={{ color: "#5f6368" }}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {status.message && (
            <div
              className="mb-4 p-4 rounded-xl text-sm font-medium flex justify-between items-center"
              style={{
                backgroundColor:
                  status.type === "success" ? "#e6f4ea" : "#fce8e6",
                color: status.type === "success" ? "#1e8e3e" : "#d93025",
              }}
            >
              <span>{status.message}</span>
              <button
                onClick={() => setStatus({ message: "", type: "" })}
                className="text-lg"
              >
                &times;
              </button>
            </div>
          )}

          {view === "list" ? (
            loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-2xl transition-all hover:bg-gray-50 border border-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer hover:opacity-80 transition-all"
                        onClick={() => handleChangeRole(user.id, user.role)}
                        style={{
                          backgroundColor:
                            user.role === "ADMIN" ? "#fce8e6" : "#e8f0fe",
                          color: user.role === "ADMIN" ? "#d93025" : "#1a73e8",
                        }}
                        title="Click to toggle role"
                      >
                        {user.role}
                      </span>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full"
                >
                  Back to List
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full"
                >
                  Create User
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Help Manual Modal - Material Design 3
 */
const HelpModal = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.32)" }}
    >
      <div
        className="w-full max-w-3xl h-[80vh] overflow-hidden animate-fade-in flex flex-col"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "28px",
          boxShadow:
            "0 8px 12px 6px rgba(60, 64, 67, 0.15), 0 4px 4px 0 rgba(60, 64, 67, 0.3)",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3
            className="text-xl font-medium flex items-center gap-3"
            style={{ color: "#202124" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#e8f0fe" }}
            >
              <BookOpenIcon className="w-5 h-5" style={{ color: "#1a73e8" }} />
            </div>
            KSK ERP Help Manual
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100"
            style={{ color: "#5f6368" }}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          <section>
            <h4
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: "#1a73e8" }}
            >
              <HomeIcon className="w-5 h-5" /> Introduction
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Welcome to KSK ERP, a comprehensive business management solution
              designed to streamline your operations, from sales and inventory
              to financial reporting.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-5 rounded-2xl bg-blue-50">
              <h5 className="font-bold mb-2 flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-blue-600" /> User Management
              </h5>
              <p className="text-sm text-gray-600">
                Admins can manage user access, assign roles (Admin/User), and
                maintain system security via the <strong>+ icon</strong> in the
                top bar.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-green-50">
              <h5 className="font-bold mb-2 flex items-center gap-2">
                <CurrencyDollarIcon className="w-4 h-4 text-green-600" /> Sales
                Module
              </h5>
              <p className="text-sm text-gray-600">
                Create Quotes, Sales Orders, and Invoices. Track customer
                payments and manage recurring billing cycles effortlessly.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-purple-50">
              <h5 className="font-bold mb-2 flex items-center gap-2">
                <CubeIcon className="w-4 h-4 text-purple-600" /> Inventory
                Control
              </h5>
              <p className="text-sm text-gray-600">
                Keep track of your items, units, and stock levels. Organize
                products with detailed descriptions and categories.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-orange-50">
              <h5 className="font-bold mb-2 flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-orange-600" /> Security
              </h5>
              <p className="text-sm text-gray-600">
                Role-based access control (RBAC) ensures that only authorized
                personnel can perform sensitive operations.
              </p>
            </div>
          </section>

          <section>
            <h4
              className="text-lg font-semibold mb-4"
              style={{ color: "#202124" }}
            >
              Frequently Asked Questions
            </h4>
            <div className="space-y-4">
              <div className="border border-gray-100 p-4 rounded-xl">
                <p className="font-medium">How do I create a new invoice?</p>
                <p className="text-sm text-gray-500 mt-1">
                  Navigate to Sales &gt; Invoices and click the "New Invoice"
                  button at the top right.
                </p>
              </div>
              <div className="border border-gray-100 p-4 rounded-xl">
                <p className="font-medium">Can I change my password?</p>
                <p className="text-sm text-gray-500 mt-1">
                  Currently, passwords can be managed by the System
                  Administrator in the User Management portal.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

// Moved searchablePages inside the file for easy access
const SEARCHABLE_PAGES = [
  { name: "Dashboard Home", path: "/home", category: "General" },
  { name: "Manage Items", path: "/items", category: "Inventory" },
  { name: "Create New Item", path: "/items/new", category: "Inventory" },
  { name: "Customers List", path: "/sales/customers", category: "Sales" },
  { name: "Sales Quotes", path: "/sales/quotes", category: "Sales" },
  { name: "Sales Orders", path: "/sales/salesorders", category: "Sales" },
  { name: "Invoices & Billing", path: "/sales/invoices", category: "Sales" },
  {
    name: "Recurring Invoices",
    path: "/sales/recurringinvoices",
    category: "Sales",
  },
  {
    name: "Delivery Challans",
    path: "/sales/deliverychallans",
    category: "Sales",
  },
  {
    name: "Payments Received",
    path: "/sales/paymentsreceived",
    category: "Sales",
  },
  { name: "Credit Notes", path: "/sales/creditnotes", category: "Sales" },
  {
    name: "Vendors & Suppliers",
    path: "/purchases/vendors",
    category: "Purchases",
  },
  { name: "Purchase Bills", path: "/purchases/bills", category: "Purchases" },
  {
    name: "Project Tracking",
    path: "/time-tracking/projects",
    category: "Time",
  },
  { name: "Timesheets", path: "/time-tracking/timesheet", category: "Time" },
  { name: "Banking & Finance", path: "/banking", category: "Finance" },
  {
    name: "Manual Journals",
    path: "/accountant/journals",
    category: "Finance",
  },
  {
    name: "Chart of Accounts",
    path: "/accountant/accounts",
    category: "Finance",
  },
  { name: "Reports Gallery", path: "/reports", category: "General" },
  { name: "Document Drive", path: "/documents", category: "General" },
  { name: "User Management", path: "ACTION_USERS", category: "Admin" },
];

/**
 * Profile Popup - Material Design 3
 */
const ProfilePopup = ({ role, onLogout }) => (
  <div
    className="absolute right-0 top-14 mt-2 w-64 z-20 overflow-hidden animate-fade-in"
    style={{
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow:
        "0 4px 8px 3px rgba(60, 64, 67, 0.15), 0 1px 3px 0 rgba(60, 64, 67, 0.3)",
    }}
  >
    {/* User Info Section */}
    <div
      className="p-4 flex items-center gap-3"
      style={{ borderBottom: "1px solid #e8eaed" }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "#e8f0fe" }}
      >
        <UserCircleIcon className="w-6 h-6" style={{ color: "#1a73e8" }} />
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: "#202124" }}>
          {getUserName()}
        </p>
        <span
          className="text-xs font-medium px-2 py-0.5 mt-1 inline-block"
          style={{
            backgroundColor: role === "ADMIN" ? "#fce8e6" : "#e6f4ea",
            color: role === "ADMIN" ? "#d93025" : "#1e8e3e",
            borderRadius: "9999px",
          }}
        >
          {role || "USER"}
        </span>
      </div>
    </div>

    {/* Actions Section */}
    <div className="p-2">
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 p-3 text-sm font-medium transition duration-200 hover:bg-red-50"
        style={{
          color: "#d93025",
          borderRadius: "12px",
        }}
      >
        <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
        <span>Log Out</span>
      </button>
    </div>
  </div>
);

/**
 * Header Component - Material Design 3
 */
const Header = ({ onMenuClick, onSettingsClick, onHelpClick }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const userRole = getUserRole();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const filtered = SEARCHABLE_PAGES.filter(
        (page) =>
          page.name.toLowerCase().includes(query.toLowerCase()) ||
          page.category.toLowerCase().includes(query.toLowerCase()),
      );
      setSearchResults(filtered);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  const handleSearchResultClick = (page) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    if (page.path === "ACTION_USERS") {
      onSettingsClick();
    } else {
      navigate(page.path);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header
      className="flex items-center justify-between h-16 px-4 sm:px-6 z-10"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e8eaed",
      }}
    >
      {/* Left Side: Mobile Menu Button + Company Info */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-full transition-all duration-200 hover:bg-gray-100"
          style={{ color: "#5f6368" }}
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        <div className="flex flex-col">
          <div className="font-medium text-base" style={{ color: "#202124" }}>
            Hello, {getUserName()}
          </div>
          <div className="text-xs" style={{ color: "#5f6368" }}>
            KSK Electronics Pvt Ltd
          </div>
        </div>
      </div>

      {/* Right Side: User Actions */}
      <div className="flex items-center gap-2 sm:gap-3 relative">
        {/* Search Input */}
        <div className="relative hidden md:block" ref={searchRef}>
          <MagnifyingGlassIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            style={{ color: "#80868b" }}
          />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() =>
              searchQuery.trim().length > 0 && setIsSearchOpen(true)
            }
            className="pl-10 pr-4 py-2 text-sm w-64 transition-all duration-200 focus:w-80"
            style={{
              backgroundColor: "#f1f3f4",
              border: "none",
              borderRadius: "8px",
              color: "#202124",
            }}
          />

          {/* Search Recommendations Popup */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in max-h-96 overflow-y-auto w-80">
              <div className="p-2">
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                  >
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {result.name}
                      </p>
                      <p className="text-xs text-gray-400">{result.category}</p>
                    </div>
                    <ChevronRightIcon className="w-4 h-4 text-gray-300 group-hover:text-blue-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <button
          onClick={onHelpClick}
          className="p-2 rounded-full transition-all duration-200 hidden sm:block hover:bg-gray-100"
          style={{ color: "#5f6368" }}
          title="Help Manual"
        >
          <QuestionMarkCircleIcon className="w-5 h-5" />
        </button>

        {/* User Management (Admin Only) */}
        {userRole === "ADMIN" && (
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100"
            style={{ color: "#5f6368" }}
            title="Manage Users"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        )}

        {/* User Avatar */}
        <div className="relative">
          <button
            onClick={() => setIsPopupOpen(!isPopupOpen)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium cursor-pointer transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: "#1a73e8" }}
          >
            {getUserName().charAt(0).toUpperCase()}
          </button>

          {isPopupOpen && (
            <ProfilePopup role={userRole} onLogout={handleLogout} />
          )}
        </div>
      </div>
    </header>
  );
};

/**
 * DashboardLayout - Material Design 3
 * Main layout wrapper with sidebar and header
 */
const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const userRole = getUserRole();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSettingsClick = () => {
    if (userRole === "ADMIN") {
      setIsSettingsModalOpen(true);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.32)" }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* User Management Modal */}
      {isSettingsModalOpen && userRole === "ADMIN" && (
        <UserManagementModal onClose={() => setIsSettingsModalOpen(false)} />
      )}

      {/* Help Modal */}
      {isHelpModalOpen && (
        <HelpModal onClose={() => setIsHelpModalOpen(false)} />
      )}

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuClick={toggleSidebar}
          onSettingsClick={handleSettingsClick}
          onHelpClick={() => setIsHelpModalOpen(true)}
        />

        {/* Main Content Area */}
        <main
          className="flex-1 overflow-x-hidden overflow-y-auto"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

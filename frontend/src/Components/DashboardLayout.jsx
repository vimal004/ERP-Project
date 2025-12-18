import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Side-bar";
import {
  BellIcon,
  Cog8ToothIcon,
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  UserCircleIcon,
  ArrowLeftEndOnRectangleIcon,
  UserPlusIcon, // New Icon for the Settings Modal
} from "@heroicons/react/24/outline";
import { logout, getUserRole } from "../services/authService";

// --- New Settings Modal Component ---
const SettingsModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [status, setStatus] = useState({ message: "", type: "" });

  const handleInvite = (e) => {
    e.preventDefault();

    if (!email) {
      setStatus({ message: "Email is required.", type: "error" });
      return;
    }

    // TODO: Implement real Supabase user invitation
    // This requires Supabase admin API or creating users via Supabase dashboard
    setStatus({
      message:
        "User invitation is currently done via Supabase Dashboard. Go to Authentication > Users to add new users with the appropriate role.",
      type: "error",
    });

    // Clear status after a delay
    setTimeout(() => setStatus({ message: "", type: "" }), 5000);
  };

  return (
    // Full screen backdrop with modal card
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white rounded-xl shadow-xl-2 w-full max-w-lg overflow-hidden animate-in zoom-in-50 duration-500">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <UserPlusIcon className="w-6 h-6 text-blue-600" />
            <span>Manage Users & Access</span>
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition"
          >
            <ArrowLeftEndOnRectangleIcon className="w-5 h-5 rotate-90" />
          </button>
        </div>

        {/* Form Body */}
        <form className="p-6 space-y-6" onSubmit={handleInvite}>
          {/* Status Message */}
          {status.message && (
            <div
              className={`p-3 rounded-lg text-sm font-medium border ${
                status.type === "success"
                  ? "bg-green-50 text-green-700 border-green-300"
                  : "bg-red-50 text-red-700 border-red-300"
              }`}
            >
              {status.message}
            </div>
          )}

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              User Email (for Invitation)
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg text-base focus:ring-blue-600 focus:border-blue-600 transition duration-200"
              placeholder="user@newcompany.com"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign Role
            </label>
            <div className="flex space-x-4">
              {/* Admin Role */}
              <label
                className={`flex items-center p-3 rounded-lg border cursor-pointer w-1/2 transition ${
                  role === "Admin"
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-300 bg-white hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name="userRole"
                  value="Admin"
                  checked={role === "Admin"}
                  onChange={() => setRole("Admin")}
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <p className="text-sm font-semibold text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">
                    Full access & configuration
                  </p>
                </div>
              </label>

              {/* Staff Role */}
              <label
                className={`flex items-center p-3 rounded-lg border cursor-pointer w-1/2 transition ${
                  role === "User"
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-300 bg-white hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name="userRole"
                  value="User"
                  checked={role === "User"}
                  onChange={() => setRole("User")}
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <p className="text-sm font-semibold text-gray-900">Staff</p>
                  <p className="text-xs text-gray-500">
                    Sales, Purchase & time tracking
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Footer / Submit */}
          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Close
            </button>
            <button
              type="submit"
              className="py-2 px-4 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md-2 hover:bg-blue-700 transition"
            >
              Invite User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// --- End Settings Modal Component ---

// --- New Profile Popup Component ---
const ProfilePopup = ({ role, onLogout }) => (
  <div className="absolute right-0 top-14 mt-2 w-64 bg-white rounded-xl shadow-xl-2 border border-gray-100 z-20 overflow-hidden animate-in fade-in slide-in-from-top-1">
    {/* User Info Section */}
    <div className="p-4 border-b border-gray-100 flex items-center space-x-3">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
        <UserCircleIcon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">Arulmani.G</p>
        {/* Role Display */}
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${
            role === "Admin"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {role || "Staff"}
        </span>
      </div>
    </div>

    {/* Actions Section */}
    <div className="p-2">
      <button
        onClick={onLogout}
        className="w-full flex items-center space-x-3 p-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
      >
        <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
        <span>Log Out</span>
      </button>
    </div>
  </div>
);
// --- End Profile Popup Component ---

const Header = ({ onMenuClick, onSettingsClick }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();
  const userRole = getUserRole();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="flex items-center justify-between h-16 bg-white border-b border-gray-100 px-4 sm:px-6 shadow-soft-md z-10">
      {/* Left Side: Mobile Menu Button + Company Info */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
        >
          <Bars3Icon className="w-6 h-6 text-gray-600" />
        </button>

        <div className="flex flex-col">
          <div className="font-extrabold text-gray-900 text-lg">
            Hello, Arulmani.G
          </div>
          <div className="text-xs text-gray-500 font-medium">
            Kayaa Electronics Pvt Ltd
          </div>
        </div>
      </div>

      {/* Right Side: User Actions / Help */}
      <div className="flex items-center space-x-2 sm:space-x-3 relative">
        {/* Search Input */}
        <div className="relative hidden md:block">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 w-56 transition-all duration-200 bg-gray-50 hover:bg-white"
          />
        </div>

        <button className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hidden sm:block relative">
          <BellIcon className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hidden sm:block">
          <QuestionMarkCircleIcon className="w-5 h-5 text-gray-600" />
        </button>

        {/* Settings Icon - Now opens the User Management Modal (Admin check implied on click) */}
        <button
          onClick={onSettingsClick}
          disabled={userRole !== "Admin"}
          className={`p-2 rounded-lg transition-all duration-200
                ${
                  userRole === "Admin"
                    ? "hover:bg-gray-100 text-gray-600"
                    : "text-gray-400 cursor-not-allowed"
                }
              `}
        >
          <Cog8ToothIcon className="w-5 h-5" />
        </button>

        {/* User Avatar (Profile Dropdown Trigger) */}
        <div className="relative">
          <button
            onClick={() => setIsPopupOpen(!isPopupOpen)}
            className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer ring-2 ring-offset-2 ring-primary-300 transform hover:scale-105 transition-all duration-200 shadow-soft-md"
          >
            AG
          </button>

          {/* Conditional Popup Rendering */}
          {isPopupOpen && (
            <ProfilePopup role={userRole} onLogout={handleLogout} />
          )}
        </div>
      </div>
    </header>
  );
};

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const userRole = getUserRole();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSettingsClick = () => {
    if (userRole === "Admin") {
      setIsSettingsModalOpen(true);
    } else {
      alert("Access Denied: Only Administrators can manage users.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar and Overlay */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Mobile Overlay (Only visible when sidebar is open on small screens) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Settings Modal - Rendered on top of everything */}
      {isSettingsModalOpen && userRole === "Admin" && (
        <SettingsModal onClose={() => setIsSettingsModalOpen(false)} />
      )}

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Pass toggleSidebar and handleSettingsClick functions to Header */}
        <Header
          onMenuClick={toggleSidebar}
          onSettingsClick={handleSettingsClick}
        />

        {/* Main Content Area - Soft background */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

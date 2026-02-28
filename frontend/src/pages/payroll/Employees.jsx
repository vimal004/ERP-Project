import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEmployees } from "../../services/employeeService";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/20/solid";

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("All Employees"); // Default to All
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  // Filter Filters State
  const [filters, setFilters] = useState({
    search: "",
    id: "",
    email: "",
    status: "All Status",
    department: "Select Department",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const views = ["All Employees", "Active Employees", "Exited Employees"];

  // Client-side filtering
  const filteredEmployees = employees.filter((emp) => {
    // 1. View Filter
    if (currentView === "Active Employees" && emp.status !== "ACTIVE")
      return false;
    if (
      currentView === "Exited Employees" &&
      !["RESIGNED", "TERMINATED", "DECEASED"].includes(emp.status)
    )
      return false;

    // 2. Sidebar Filters
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    if (filters.search && !fullName.includes(filters.search.toLowerCase()))
      return false;
    if (filters.id && !emp.employeeId.includes(filters.id)) return false;
    if (
      filters.email &&
      !emp.workEmail.toLowerCase().includes(filters.email.toLowerCase())
    )
      return false;
    if (
      filters.status !== "All Status" &&
      emp.status !== filters.status.toUpperCase()
    )
      return false;
    if (
      filters.department !== "Select Department" &&
      emp.department !== filters.department
    )
      return false;

    return true;
  });

  const getAvatarColor = (name) => {
    const colors = [
      "bg-orange-100 text-orange-600",
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-purple-100 text-purple-600",
      "bg-pink-100 text-pink-600",
      "bg-teal-100 text-teal-600",
    ];
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  return (
    <div className="flex h-full bg-[#f8f9fa] relative overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-gray-100 flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
              className="flex items-center gap-2 text-xl font-normal text-gray-900 hover:opacity-80 transition-opacity"
            >
              {currentView}
              <ChevronDownIcon
                className={`w-5 h-5 transition-transform ${isViewDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* View Dropdown */}
            {isViewDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsViewDropdownOpen(false)}
                ></div>
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 py-2 animate-fade-in">
                  {views.map((view) => (
                    <button
                      key={view}
                      onClick={() => {
                        setCurrentView(view);
                        setIsViewDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${currentView === view ? "bg-blue-50 text-blue-600" : "text-gray-700"}`}
                    >
                      <div className="flex items-center gap-3">
                        {currentView === view && (
                          <CheckIcon className="w-4 h-4 text-blue-600" />
                        )}
                        <span className={currentView === view ? "" : "pl-7"}>
                          {view}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/payroll/employees/new")}
              className="bg-[#1a73e8] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4 text-white" />
              Add Employee
            </button>
            <button
              onClick={() => setIsFilterSidebarOpen(true)}
              className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <FunnelIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto bg-white p-6">
          <div
            className="bg-white rounded-[24px] border border-gray-200 overflow-hidden shadow-sm"
            style={{
              boxShadow:
                "0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)",
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a73e8]"></div>
              </div>
            ) : (
              <table className="w-full min-w-[1000px]">
                <thead className="bg-[#fcfcfc] sticky top-0 z-0">
                  <tr>
                    <th className="px-6 py-3 text-left border-b border-gray-100 w-10">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      EMPLOYEE NAME
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      WORK EMAIL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      DEPARTMENT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      EMPLOYEE STATUS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        No employees found.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <tr
                        key={emp.employeeId}
                        className="hover:bg-gray-50 group transition-colors"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${getAvatarColor(emp.firstName || "U")}`}
                            >
                              {emp.firstName ? emp.firstName.charAt(0) : "U"}
                            </div>
                            <div>
                              <div
                                className="text-sm font-medium text-blue-600 cursor-pointer hover:underline"
                                onClick={() =>
                                  navigate(`/payroll/employees/${emp.id}`)
                                }
                              >
                                {emp.firstName} {emp.lastName} -{" "}
                                {emp.employeeId}
                              </div>
                              <div className="text-xs text-gray-500">
                                {emp.designation}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {emp.workEmail}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 uppercase">
                          {emp.department}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium uppercase
                                                    ${emp.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                          >
                            {emp.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Filter Sidebar (Simplified for now) */}
      {isFilterSidebarOpen && (
        <div className="absolute inset-0 z-30 flex justify-end">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setIsFilterSidebarOpen(false)}
          ></div>
          <div className="relative w-80 sm:w-96 bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-base font-semibold text-gray-800">
                Filter By
              </h2>
              <button
                onClick={() => setIsFilterSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Search Name
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              {/* More filters can be re-enabled here */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;

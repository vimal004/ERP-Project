import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import employeeService from "../../services/employeeService";

const PayrollDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await employeeService.getAllEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Calculations ---
  const activeEmployees = employees.filter((e) => e.status === "ACTIVE");

  // Calculate Monthly Pay (Basic + HRA + Special Allowances)
  // Assuming these are monthly values in the DB. If annual, we divide by 12.
  // Based on "Add Employee" form, these seemed to be entered as monthly values usually,
  // except CTC which is annual. Let's assume the components are monthly for now or derive from CTC.
  // Looking at `add_real_employee.py`:
  // annualCtc: 950000
  // basicSalary: 45000 (approx 50% of monthly CTC) -> 45k * 12 = 540k
  // hra: 20000 -> 240k
  // special: 5000 -> 60k
  // Total components = 70k/mo = 840k/yr.
  // So these are definitely MONTHLY values.

  const totalMonthlyPay = activeEmployees.reduce((sum, emp) => {
    const basic = emp.basicSalary || 0;
    const hra = emp.hra || 0;
    const special = emp.specialAllowances || 0;
    return sum + basic + hra + special;
  }, 0);

  // Mock Pay Date (Last day of current month)
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const paymentDate = lastDayOfMonth.toLocaleDateString("en-GB"); // DD/MM/YYYY
  const currentMonthName = today.toLocaleString("default", { month: "long" });
  const currentYear = today.getFullYear();

  // Chart Data Preparation
  // We'll project the current monthly cost for upcoming months
  const months = [
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
  ];
  const chartData = months.map((month) => ({
    name: month,
    cost: totalMonthlyPay, // Projected constant cost
    color: month === currentMonthName.substring(0, 3) ? "#00C49F" : "#10B981", // Highlight current month? Or just green.
  }));

  // Customize Jul, Sep, Nov as per screenshot for visual variety if needed,
  // but better to show real projection (flat line if no changes).
  // The screenshot shows variation, let's keep it flat or slightly random for demo if strictly real data isn't available for history.
  // Since we only have CURRENT snapshop, flat projection is most honest.

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading)
    return <div className="p-8 flex justify-center">Loading Dashboard...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Welcome sales!
      </h1>

      <div className="flex gap-6">
        {/* Left Column (Main Content) */}
        <div className="flex-1 space-y-6">
          {/* Upcoming Payrun Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Upcoming Payrun
            </h2>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-gray-700 font-medium text-lg">
                    Process Pay Run for {currentMonthName} {currentYear}
                  </h3>
                  <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs font-bold rounded">
                    DRAFT
                  </span>
                </div>

                <div className="flex gap-12">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Employees' Net Pay
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      {formatCurrency(totalMonthlyPay)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment Date</p>
                    <p className="text-sm font-medium text-gray-800">
                      {paymentDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      No. of Employees
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {activeEmployees.length}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs text-orange-500">
                  <span className="w-4 h-4 rounded-full border border-orange-500 flex items-center justify-center">
                    !
                  </span>
                  This payment is overdue by 32 day(s).
                </div>
              </div>

              <Link
                to="/payroll/run"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
              >
                View Details
              </Link>
            </div>
            <div className="mt-3">
              <Link to="#" className="text-sm text-blue-600 hover:underline">
                View 1 More →
              </Link>
            </div>
          </div>

          {/* Middle Row: Benefits & Summary */}
          <div className="grid grid-cols-3 gap-6">
            {/* Benefits & Deductions */}
            <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-700 font-medium">
                  Benefits and Deductions
                </h2>
                <select className="text-xs border-gray-300 rounded text-gray-500 bg-transparent">
                  <option>Previous Month</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="bg-purple-50 p-4 rounded-lg flex flex-col items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded text-purple-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9"
                      />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-gray-600">EPF</p>
                  <p className="text-lg font-bold text-gray-800">-</p>
                  <button className="text-xs text-blue-600 hover:underline">
                    View Details
                  </button>
                </div>

                <div className="bg-green-50 p-4 rounded-lg flex flex-col items-start gap-3">
                  <div className="p-2 bg-green-100 rounded text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-gray-600">ESI</p>
                  <p className="text-lg font-bold text-gray-800">-</p>
                  <button className="text-xs text-blue-600 hover:underline">
                    View Details
                  </button>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg flex flex-col items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded text-orange-600">
                    <span className="text-lg font-bold">%</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-600">TDS</p>
                  <p className="text-lg font-bold text-gray-800">-</p>
                  <button className="text-xs text-blue-600 hover:underline">
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Employee Summary */}
            <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8 w-full text-left">
                Employee Summary
              </h2>
              <div className="text-center">
                <p className="text-xs text-gray-500 font-bold mb-2">
                  ACTIVE EMPLOYEES{" "}
                  <span className="text-orange-500 ml-1">!</span>
                </p>
                <p className="text-6xl font-light text-green-600 mb-8">
                  {activeEmployees.length}
                </p>
                <Link
                  to="/payroll/employees"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Employees
                </Link>
              </div>
            </div>
          </div>

          {/* Payroll Cost Summary Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-gray-700 font-medium">
                Payroll Cost Summary
              </h2>
              <select className="text-xs border-gray-300 rounded text-gray-500 bg-transparent">
                <option>This Year</option>
              </select>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={8}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    tickFormatter={(value) => `${value / 1000} K`}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar dataKey="cost" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column (To Do) */}
        <div className="w-80">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full min-h-[400px]">
            <h2 className="text-gray-700 font-medium mb-12">To Do Tasks</h2>

            <div className="flex flex-col items-center justify-center text-center mt-8">
              <div className="w-32 h-32 bg-pink-100 rounded-full mb-6 flex items-center justify-center relative overflow-hidden">
                {/* Simple illustration placeholder */}
                <div className="text-4xl">🎭</div>
              </div>

              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Time to celebrate!
              </h3>
              <p className="text-sm text-gray-500">
                You have no pending tasks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDashboard;

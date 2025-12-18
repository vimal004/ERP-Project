import React, { useState, useEffect } from "react";
import {
  CurrencyRupeeIcon,
  PlusIcon,
  ChevronDownIcon,
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
} from "@heroicons/react/24/outline";
import ShimmerDashboard from "../Components/ShimmerDashboard";
import { Link } from "react-router-dom"; 

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); 
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ShimmerDashboard />;
  }
  
  // Helper component for the Metric Boxes (Current/Overdue) - Refined Look
  const MetricBox = ({ title, amount, isOverdue = false }) => (
    // Ensured text size adapts better on small screens
    <div className="flex-1 p-4 bg-white border border-gray-100 rounded-lg transition duration-300 hover:shadow-lg-2 cursor-default">
      <p className={`text-xs font-semibold uppercase ${isOverdue ? "text-red-600" : "text-gray-500"}`}>{title}</p>
      {/* Reduced font size slightly for better fit on small cards */}
      <div className={`flex items-center ${isOverdue ? "text-red-700" : "text-gray-900"} text-xl sm:text-2xl font-extrabold mt-1`}> 
        <CurrencyRupeeIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
        {amount.toFixed(2)}
        {isOverdue && <ChevronDownIcon className="w-4 h-4 ml-2 text-red-500" />}
      </div>
    </div>
  );

  // Reusable Card Component - Consistent Elevation
  const DashboardCard = ({ title, icon, color, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg-2 border border-gray-100 flex flex-col"> 
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <div className="flex items-center space-x-3">
            <span className={`p-2 rounded-full bg-${color}-100`}>
                {icon}
            </span>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <Link 
            to="/items/new" 
            className="flex items-center text-blue-600 text-sm font-semibold py-1 px-3 rounded-full hover:bg-blue-50 transition"
        >
            <PlusIcon className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">New Item</span> {/* Hide text on smallest screens */}
            <span className="sm:hidden">New</span>
        </Link>
      </div>
      {children}
    </div>
  );


  return (
    // Responsive padding
    <div className="p-4 sm:p-8 space-y-8"> 
      {/* Page Title & Tabs - Ensure tabs wrap if necessary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">Dashboard</h1>
        {/* Added overflow-x-auto to prevent tabs from breaking the layout on tiny screens */}
        <div className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-1"> 
          <h2 className="py-2 px-1 text-sm sm:text-base font-bold border-b-2 border-blue-600 text-blue-600 cursor-pointer flex-shrink-0 transition duration-150">
            Overview
          </h2>
          <h2 className="py-2 px-1 text-sm sm:text-base text-gray-600 hover:text-blue-600 cursor-pointer flex-shrink-0 transition duration-150">
            Getting Started
          </h2>
          <h2 className="py-2 px-1 text-sm sm:text-base text-gray-600 hover:text-blue-600 cursor-pointer flex-shrink-0 transition duration-150">
            Recent Updates
          </h2>
        </div>
      </div>

      {/* Receivables & Payables Cards - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"> 
        
        {/* Total Receivables Card (Sales) */}
        <DashboardCard 
            title="Total Receivables" 
            icon={<ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />} 
            color="green"
        >
          <div className="text-sm text-gray-600 mb-6 bg-green-50 p-3 rounded-lg border border-green-200 font-medium">
            Total Unpaid Invoices: <span className="font-bold text-green-700">₹0.00</span>
          </div>

          <div className="flex space-x-4 flex-1">
            <MetricBox title="Current" amount={0.00} />
            <MetricBox title="Overdue" amount={0.00} isOverdue={true} />
          </div>
        </DashboardCard>

        {/* Total Payables Card (Purchases) */}
        <DashboardCard 
            title="Total Payables" 
            icon={<ArrowTrendingDownIcon className="w-5 h-5 text-red-600" />} 
            color="red"
        >
          <div className="text-sm text-gray-600 mb-6 bg-red-50 p-3 rounded-lg border border-red-200 font-medium">
            Total Unpaid Bills: <span className="font-bold text-red-700">₹0.00</span>
          </div>

          <div className="flex space-x-4 flex-1">
            <MetricBox title="Current" amount={0.00} />
            <MetricBox title="Overdue" amount={0.00} isOverdue={true} />
          </div>
        </DashboardCard>
      </div>

      {/* Cash Flow Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg-2 border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-3 sm:mb-0">Cash Flow</h3>
          {/* Made dropdown full width on mobile */}
          <select className="text-sm text-gray-600 border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 transition w-full sm:w-auto">
            <option>This Fiscal Year</option>
            <option>Last 30 Days</option>
            <option>Last 12 Months</option>
          </select>
        </div>

        {/* Placeholder for the chart/graph area */}
        <div className="flex h-80 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          
          {/* Y-Axis Labels - Reduced width on small screens */}
          <div className="w-12 sm:w-16 py-4 pr-2 sm:pr-4 flex flex-col justify-between text-xs text-gray-500 border-r border-gray-200 flex-shrink-0">
            <p className="text-right">5 K</p>
            <p className="text-right">4 K</p>
            <p className="text-right">3 K</p>
            <p className="text-right">2 K</p>
            <p className="text-right">1 K</p>
            <p className="text-right">0 K</p>
          </div>
          
          {/* Chart Area - Added overflow-x-auto and min-width to ensure horizontal scroll if needed */}
          <div className="flex-1 relative p-2 sm:p-4 overflow-x-auto">
            
            {/* Cash Balance Display (Top Right) - Positioned relative to the chart area */}
            <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md-2 text-right border border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Cash as on 01/04/2025</p>
              <div className="flex items-center justify-end font-extrabold text-xl text-blue-700 mt-1">
                <CurrencyRupeeIcon className="w-5 h-5 mr-1" />
                0.00
              </div>
            </div>
            
            {/* Chart Placeholder Text */}
            <div className="flex items-center justify-center h-full min-w-[300px] sm:min-w-0">
                <p className="text-gray-400 text-lg font-medium border-2 border-dashed border-gray-300 p-6 rounded-lg">
                    Cash Flow Chart Placeholder (Coming Soon)
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
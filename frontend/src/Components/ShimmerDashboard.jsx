import React from "react";

// --- Reusable Shimmer Card Component ---
const ShimmerCard = ({ className = "" }) => (
  <div
    // Updated shadow and rounded corners to match the new DashboardCard
    className={`bg-white p-6 rounded-xl shadow-lg-2 border border-gray-100 animate-pulse ${className}`}
  >
    {/* Header */}
    <div className="flex justify-between items-center mb-6 border-b pb-4">
      <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
      <div className="h-5 bg-blue-100 rounded-full w-16"></div>
    </div>

    {/* Unpaid Info */}
    <div className="bg-gray-100 h-10 mb-6 rounded-lg"></div>

    {/* Current/Overdue Boxes */}
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-gray-300 rounded w-3/4"></div>
      </div>
      <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
        <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-8 bg-gray-300 rounded w-2/3"></div>
      </div>
    </div>
  </div>
);

// --- Main Shimmer Dashboard Component ---
const ShimmerDashboard = () => {
  return (
    <div className="p-8 space-y-8">
      {/* Tabs Shimmer */}
      <div className="flex space-x-6 border-b border-gray-200 pb-3">
        <div className="h-7 bg-blue-200 rounded w-24"></div>
        <div className="h-7 bg-gray-200 rounded w-28"></div>
      </div>

      {/* Receivables & Payables Cards Shimmer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ShimmerCard />
        <ShimmerCard />
      </div>

      {/* Cash Flow Section Shimmer */}
      <div className="bg-white p-6 rounded-xl shadow-lg-2 border border-gray-100 animate-pulse">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div className="h-6 bg-gray-200 rounded-md w-48"></div>
          <div className="h-8 bg-gray-100 rounded-lg w-32"></div>
        </div>

        {/* Chart Area Shimmer */}
        <div className="flex h-80 border border-gray-200 rounded-lg bg-gray-50 p-4">
          <div className="w-full relative">
            {/* Vertical bars placeholder to mimic a chart */}
            <div className="flex h-full items-end justify-around space-x-4">
              <div className="bg-blue-200 w-10 rounded-t-lg h-1/4"></div>
              <div className="bg-blue-300 w-10 rounded-t-lg h-3/4"></div>
              <div className="bg-blue-200 w-10 rounded-t-lg h-1/2"></div>
              <div className="bg-blue-300 w-10 rounded-t-lg h-2/3"></div>
              <div className="bg-blue-200 w-10 rounded-t-lg h-1/5"></div>
              <div className="bg-blue-300 w-10 rounded-t-lg h-3/5"></div>
              <div className="bg-blue-200 w-10 rounded-t-lg h-1/3"></div>
              <div className="bg-blue-300 w-10 rounded-t-lg h-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShimmerDashboard;
import React from "react";
import { Link } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const CustomersPage = () => {
  return (
    // Responsive padding
    <div className="p-4 sm:p-8">
      {/* Header - Consistent Look */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Customers</h1>
        <div className="flex items-center space-x-4">
          {/* New Customer Button - Primary/Elevated Style (responsive text) */}
          <Link
            to="/sales/customers/new"
            className="flex items-center bg-blue-600 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md-2 hover:bg-blue-700 transition duration-150"
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">New Customer</span>
            <span className="sm:hidden">New</span>
          </Link>
          <button className="p-2 rounded-full hover:bg-gray-100 transition duration-150">
            <EllipsisVerticalIcon className="w-6 h-6 text-gray-500 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Content Card - Consistent Elevation */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg-2 border border-gray-100 min-h-[70vh]">
        
        {/* Search and filter row - made responsive */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-end mb-4 space-y-3 md:space-y-0 md:space-x-4">
            <input type="checkbox" className="hidden md:inline mr-4 text-blue-600 rounded" />
            <div className="flex items-center w-full md:w-auto">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-2" />
                <input 
                    type="text" 
                    placeholder="Search customer name..." 
                    className="border border-gray-300 rounded-lg p-1.5 text-sm focus:ring-blue-500 focus:border-blue-500 w-full md:w-48" 
                />
            </div>
        </div>
        
        {/* Table Container - Critical for responsiveness (overflow-x-auto) */}
        <div className="overflow-x-auto whitespace-nowrap border-t border-gray-200">
            {/* Table Header Structure - min-w ensures content doesn't squash */}
            <div className="flex items-center border-b border-gray-200 py-3 text-sm font-semibold text-gray-700 min-w-[800px]"> 
                <input type="checkbox" className="mr-4 text-blue-600 rounded" />
                {/* Fixed widths for column control */}
                <span className="w-[20%] px-2 cursor-pointer hover:text-blue-600">
                  NAME
                </span>
                <span className="w-[15%] px-2">EMAIL</span>
                <span className="w-[15%] px-2">PHONE</span>
                <span className="w-[20%] px-2">RECEIVABLES BALANCE</span>
                <span className="w-[15%] px-2">LAST CONTACT</span>
                <span className="w-[15%] px-2">STATUS</span>
            </div>

            {/* Empty State / Placeholder Content */}
            <div className="flex flex-col items-center justify-center h-full pt-20" style={{minHeight: '40vh'}}>
              <UserGroupIcon className="w-16 h-16 text-blue-300 mb-4" />
              <p className="text-xl font-semibold text-gray-700 mb-2">No Customers Found</p>
              <p className="text-gray-500 text-center">
                Your customer contact list is currently empty. Click 'New Customer' to add one.
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
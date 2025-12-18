import React from "react";
import { Link } from "react-router-dom";
import {
    MagnifyingGlassIcon,
    EllipsisVerticalIcon,
    PlusIcon,
    TruckIcon,
} from "@heroicons/react/24/outline";

const DeliveryChallansPage = () => {
    return (
        <div className="p-4 sm:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Delivery Challans</h1>
                <div className="flex items-center space-x-4">
                    <Link
                        to="/sales/deliverychallans/new"
                        className="flex items-center bg-blue-600 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md-2 hover:bg-blue-700 transition duration-150"
                    >
                        <PlusIcon className="w-5 h-5 mr-1" />
                        <span className="hidden sm:inline">New Delivery Challan</span>
                        <span className="sm:hidden">New</span>
                    </Link>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition duration-150">
                        <EllipsisVerticalIcon className="w-6 h-6 text-gray-500 cursor-pointer" />
                    </button>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg-2 border border-gray-100 min-h-[70vh]">

                {/* Search and filter row */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-end mb-4 space-y-3 md:space-y-0 md:space-x-4">
                    <input type="checkbox" className="hidden md:inline mr-4 text-blue-600 rounded" />
                    <div className="flex items-center w-full md:w-auto">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search delivery challans..."
                            className="border border-gray-300 rounded-lg p-1.5 text-sm focus:ring-blue-500 focus:border-blue-500 w-full md:w-48"
                        />
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto whitespace-nowrap border-t border-gray-200">
                    {/* Table Header */}
                    <div className="flex items-center border-b border-gray-200 py-3 text-sm font-semibold text-gray-700 min-w-[1000px]">
                        <input type="checkbox" className="mr-4 text-blue-600 rounded" />
                        <span className="w-[12%] px-2 cursor-pointer hover:text-blue-600">DATE</span>
                        <span className="w-[15%] px-2">DELIVERY CHALLAN#</span>
                        <span className="w-[15%] px-2">REFERENCE#</span>
                        <span className="w-[20%] px-2">CUSTOMER NAME</span>
                        <span className="w-[10%] px-2">STATUS</span>
                        <span className="w-[15%] px-2 text-right">AMOUNT</span>
                    </div>

                    {/* Empty State */}
                    <div className="flex flex-col items-center justify-center h-full pt-20" style={{ minHeight: '40vh' }}>
                        <TruckIcon className="w-16 h-16 text-blue-300 mb-4" />
                        <p className="text-xl font-semibold text-gray-700 mb-2">No Delivery Challans Found</p>
                        <p className="text-gray-500 text-center">
                            You haven't created any delivery challans yet. Click 'New Delivery Challan' to create one.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryChallansPage;

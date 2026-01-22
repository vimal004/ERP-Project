import React from "react";
import { Link } from "react-router-dom";
import {
    ClockIcon,
    ShieldCheckIcon,
    CurrencyRupeeIcon,
    ChevronDownIcon,
    ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";

const PayrollDashboard = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Dashboard Header */}
            <div className="flex justify-between items-end mb-2">
                <h1 className="text-2xl font-normal text-gray-800">Welcome sales!</h1>

                <div className="flex items-center gap-6 text-xs text-gray-500">
                    <button className="flex items-center text-blue-600 gap-1 hover:underline">
                        <ClockIcon className="w-4 h-4" />
                        Recent Updates <ChevronDownIcon className="w-3 h-3" />
                    </button>
                    <div className="hidden sm:flex flex-col items-end">
                        <span>Help Line : <span className="text-gray-900 font-medium">18005726671</span></span>
                        <span className="text-[10px] text-gray-400">Mon - Fri • Toll Free</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Wide) - Spans 2 cols */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Upcoming Payrun Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Upcoming Payrun</h3>

                        <div className="border border-gray-100 rounded-lg p-5 bg-white shadow-sm ring-1 ring-gray-100">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className="text-base font-medium text-gray-800 flex items-center gap-2">
                                        Process Pay Run for <span className="font-bold">December 2025</span>
                                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded uppercase tracking-wider font-semibold border border-gray-200">DRAFT</span>
                                    </h4>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-8 mb-6">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Employees' Net Pay</p>
                                    <p className="text-xl font-bold text-gray-900">₹2,87,386.00</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Payment Date</p>
                                    <p className="text-sm font-medium text-gray-900">01/01/2026</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">No. of Employees</p>
                                    <p className="text-sm font-medium text-gray-900">10</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-xs text-gray-500">
                                    <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center mr-2 text-[10px] text-gray-400 font-serif italic">i</span>
                                    This payment is overdue by 21 day(s).
                                </div>
                                <button className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded shadow-sm transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Middle Row: Benefits & Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Benefits and Deductions */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-semibold text-gray-700">Benefits and Deductions</h3>
                                <button className="text-xs text-gray-500 flex items-center hover:text-gray-700">
                                    Previous Month <ChevronDownIcon className="w-3 h-3 ml-1" />
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-2 flex-1 items-center">
                                {/* EPF */}
                                <div className="text-center">
                                    <div className="w-10 h-10 mx-auto bg-purple-50 rounded-lg flex items-center justify-center mb-2 border border-purple-100">
                                        <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                                        </svg>
                                    </div>
                                    <p className="text-[10px] text-gray-500 uppercase font-medium mb-1">EPF</p>
                                    <p className="text-lg font-bold text-gray-800">-</p>
                                    <p className="text-[10px] text-blue-500 mt-2 cursor-pointer hover:underline">View Details</p>
                                </div>
                                {/* ESI */}
                                <div className="text-center">
                                    <div className="w-10 h-10 mx-auto bg-green-50 rounded-lg flex items-center justify-center mb-2 border border-green-100">
                                        <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                                    </div>
                                    <p className="text-[10px] text-gray-500 uppercase font-medium mb-1">ESI</p>
                                    <p className="text-lg font-bold text-gray-800">-</p>
                                    <p className="text-[10px] text-blue-500 mt-2 cursor-pointer hover:underline">View Details</p>
                                </div>
                                {/* TDS */}
                                <div className="text-center">
                                    <div className="w-10 h-10 mx-auto bg-orange-50 rounded-lg flex items-center justify-center mb-2 border border-orange-100">
                                        <span className="text-orange-500 font-bold text-lg">%</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 uppercase font-medium mb-1">TDS</p>
                                    <p className="text-lg font-bold text-gray-800">-</p>
                                    <p className="text-[10px] text-blue-500 mt-2 cursor-pointer hover:underline">View Details</p>
                                </div>
                            </div>
                        </div>

                        {/* Employee Summary */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 h-full flex flex-col">
                            <h3 className="text-sm font-semibold text-gray-700 w-full text-left mb-2">Employee Summary</h3>

                            <div className="flex-1 flex flex-col items-center justify-center py-2">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2">ACTIVE EMPLOYEES</p>
                                <p className="text-5xl font-light text-teal-600">10</p>
                            </div>

                            <button className="text-xs text-blue-500 hover:text-blue-600 font-medium text-center mt-auto">View Employees</button>
                        </div>
                    </div>
                </div>

                {/* Right Column (Narrow) */}
                <div className="lg:col-span-1 space-y-6">
                    {/* To Do Tasks */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 min-h-[400px]">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-sm font-semibold text-gray-700">To Do Tasks</h3>
                        </div>

                        <div className="flex flex-col items-center justify-center text-center py-8">
                            {/* Illustration Mockup */}
                            <div className="w-32 h-32 mb-6 relative">
                                <div className="absolute inset-0 bg-purple-100 rounded-full opacity-30 transform scale-110"></div>
                                {/* Simple smiley face composition */}
                                <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 text-pink-300" fill="currentColor">
                                    <rect x="20" y="30" width="40" height="30" rx="4" fill="#F9A8D4" transform="rotate(-10 40 45)" />
                                    <rect x="40" y="40" width="40" height="30" rx="4" fill="#A5B4FC" transform="rotate(10 60 55)" />
                                    {/* Simple facial features - abstract */}
                                    <circle cx="35" cy="40" r="3" fill="white" />
                                    <circle cx="70" cy="50" r="3" fill="white" />
                                    <path d="M 30 50 Q 40 55 50 48" stroke="white" strokeWidth="2" fill="none" />
                                </svg>
                            </div>

                            <h4 className="text-base font-medium text-gray-900 mb-2">Time to celebrate!</h4>
                            <p className="text-sm text-gray-500">You have no pending tasks.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payroll Cost Summary (Bottom Full Width) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-semibold text-gray-700">Payroll Cost Summary</h3>
                    <button className="text-xs text-gray-500 flex items-center hover:text-gray-700">
                        Previous Quarter <ChevronDownIcon className="w-3 h-3 ml-1" />
                    </button>
                </div>

                {/* Chart Area */}
                <div className="h-64 w-full relative pl-2">
                    {/* Y Axis Grid (Dashed lines) */}
                    <div className="h-full flex flex-col justify-between text-xs text-gray-400">
                        {[5, 4, 3, 2, 1, 0].map((val, idx) => (
                            <div key={val} className="flex items-center w-full relative">
                                <span className="absolute -left-8 text-right w-6 text-[10px]">{val} K</span>
                                <div className="w-full h-px bg-gray-100 border-t border-dashed border-gray-200"></div>
                            </div>
                        ))}
                    </div>

                    {/* X Axis Labels */}
                    <div className="absolute bottom-[-24px] left-0 right-0 flex justify-between text-[10px] text-gray-400 pl-4 pr-4">
                        {["Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026"].map((m, i) => (
                            <div key={i} className="text-center">
                                <span className="block">{m.split(' ')[0]}</span>
                                <span className="block">{m.split(' ')[1]}</span>
                            </div>
                        ))}
                    </div>

                    {/* Empty State Text Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center -mt-4">
                        <p className="text-sm text-gray-400 font-medium bg-white px-2">There are no completed pay runs in the selected period.</p>
                    </div>
                </div>
                <div className="h-6"></div>
            </div>

            {/* Floating Chat / Help Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <div className="bg-white rounded-full shadow-lg border border-gray-100 px-4 py-2 flex items-center gap-2 cursor-pointer hover:shadow-xl transition-all">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                        <ChatBubbleLeftRightIcon className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Have questions? Ask away!</span>
                </div>
            </div>
        </div>
    );
};

export default PayrollDashboard;

import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
    Squares2X2Icon,
    UsersIcon,
    BanknotesIcon,
    CheckBadgeIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    MagnifyingGlassIcon,
    BellIcon,
    QuestionMarkCircleIcon,
    ChevronRightIcon,
    ArrowRightOnRectangleIcon // For "Access My Portal" icon if needed, or similar
} from "@heroicons/react/24/outline";

// Payroll Specific Navigation
const navItems = [
    { name: "Dashboard", path: "/payroll", icon: Squares2X2Icon },
    { name: "Employees", path: "/payroll/employees", icon: UsersIcon },
    { name: "Pay Runs", path: "/payroll/run", icon: BanknotesIcon },
    { name: "Approvals", path: "/payroll/approvals", icon: CheckBadgeIcon, hasSubmenu: true },
    { name: "Reports", path: "/payroll/reports", icon: ChartBarIcon },
    { name: "Settings", path: "/payroll/settings", icon: Cog6ToothIcon },
];

const PayrollLayout = () => {
    const location = useLocation();

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Dark Header (Fixed at top, spanning full width) - Z-index high to overlap sidebar if needed, or sidebar below */}
            {/* Actually, looking at screenshot, header seems to span full width, but usually sidebar is left. 
          Let's assume standard layout: Sidebar Left (Full Height or below header?), Header Top. 
          Screenshot shows "Payroll" logo in top left DARK AREA. 
          So Header spans FULL width. Sidebar is below header? 
          Wait, the top left says "Payroll" in the dark bar. 
          Then the white sidebar starts BELOW the dark header? Or is the dark header ONLY content area?
          ACTUALLY: Top Left corner "Payroll" is in the dark header. 
          So the Header is Full Width. The Sidebar is below the header.
      */}

            <div className="flex flex-col flex-1 h-screen overflow-hidden">
                {/* Top Header - Dark Blue/Black */}
                <header className="h-14 flex items-center justify-between px-4 z-20 flex-shrink-0" style={{ backgroundColor: "#1e2130", color: "white" }}>
                    <div className="flex items-center gap-8">
                        {/* Logo / Title Area */}
                        <div className="flex items-center gap-2 w-56">
                            <BanknotesIcon className="w-6 h-6 text-white" />
                            <span className="text-lg font-medium tracking-wide">Payroll</span>
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search in Employee"
                                className="pl-9 pr-4 py-1.5 rounded bg-[#2c3344] text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 w-64 transition-all"
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-5 text-gray-400 text-sm">
                        <div className="flex items-center hover:text-white cursor-pointer transition-colors">
                            KSK Technology <ChevronRightIcon className="w-3 h-3 ml-1" />
                        </div>
                        <div className="h-4 w-px bg-gray-600"></div>
                        <button className="hover:text-white"><UsersIcon className="w-5 h-5" /></button>
                        <button className="hover:text-white"><BellIcon className="w-5 h-5" /></button>
                        <button className="hover:text-white"><Cog6ToothIcon className="w-5 h-5" /></button>
                        <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-500 p-0.5 cursor-pointer">
                            <img
                                src="https://ui-avatars.com/api/?name=Sales&background=random"
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    {/* White Sidebar */}
                    <div className="w-60 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
                        <nav className="flex-1 py-4 space-y-1">
                            {navItems.map((item) => {
                                // Active state logic: Exact match or sub-path match
                                const isActive = location.pathname === item.path || (item.path !== "/payroll" && location.pathname.startsWith(item.path));

                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={`flex items-center justify-between px-4 py-2.5 mx-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive
                                                ? "bg-blue-600 text-white shadow-sm"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                                            {item.name}
                                        </div>
                                        {item.hasSubmenu && (
                                            <ChevronRightIcon className={`w-3 h-3 ${isActive ? "text-blue-200" : "text-gray-400"}`} />
                                        )}
                                    </Link>
                                );
                            })}

                            <div className="px-6 py-4 mt-2">
                                <Link to="#" className="text-sm text-gray-500 hover:text-gray-900">Contact Support</Link>
                            </div>
                        </nav>

                        {/* Bottom Link */}
                        <div className="p-4 border-t border-gray-100">
                            <Link to="/portal" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                                Access My Portal
                            </Link>
                            {/* Collapse Button Placeholder (from screenshot chevron at bottom) */}
                            <div className="flex justify-center mt-2">
                                <button className="p-1 hover:bg-gray-100 rounded">
                                    <ChevronRightIcon className="w-4 h-4 text-gray-400 rotate-180" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 md:p-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default PayrollLayout;

import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
    BuildingOfficeIcon,
    UsersIcon,
    CurrencyDollarIcon,
    Cog6ToothIcon,
    DocumentTextIcon
} from "@heroicons/react/24/outline";

const settingsMenu = [
    {
        category: "ORGANISATION SETTINGS",
        items: [
            { name: "Organisation", path: "/payroll/settings/organisation", icon: BuildingOfficeIcon },
            {
                name: "Users and Roles",
                icon: UsersIcon,
                subItems: [
                    { name: "Users", path: "/payroll/settings/users" },
                    { name: "Roles", path: "/payroll/settings/roles" }
                ]
            },
            {
                name: "Taxes",
                icon: CurrencyDollarIcon,
                subItems: [
                    { name: "Tax Details", path: "/payroll/settings/taxes/details" }
                ]
            },
            { name: "Setup & Configurations", path: "/payroll/settings/configurations", icon: Cog6ToothIcon },
            { name: "Customisations", path: "/payroll/settings/customisations", icon: DocumentTextIcon },
            { name: "Automations", path: "/payroll/settings/automations", icon: DocumentTextIcon },
        ]
    },
    {
        category: "MODULE SETTINGS",
        items: [
            { name: "General", path: "/payroll/settings/general", icon: DocumentTextIcon },
            { name: "Payments", path: "/payroll/settings/payments", icon: CurrencyDollarIcon },
        ]
    },
    {
        category: "EXTENSIONS & DEVELOPER DATA",
        items: [
            { name: "Integrations", path: "/payroll/settings/integrations", icon: DocumentTextIcon },
            { name: "Developer Data", path: "/payroll/settings/developer", icon: DocumentTextIcon },
        ]
    }
];

const PayrollSettingsLayout = () => {
    const location = useLocation();

    const isPathActive = (path) => location.pathname.startsWith(path);
    const isGroupActive = (item) => item.subItems?.some(sub => isPathActive(sub.path));

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Settings Sidebar */}
            <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Cog6ToothIcon className="w-5 h-5 mr-2 text-gray-500" />
                        Settings
                    </h2>
                </div>
                <div className="p-4">
                    {settingsMenu.map((section, idx) => (
                        <div key={idx} className="mb-6">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                                {section.category}
                            </h3>
                            <ul className="space-y-1">
                                {section.items.map((item, itemIdx) => {
                                    if (item.subItems) {
                                        const isOpen = isGroupActive(item); // Should probably be stateful for toggle, but simple "always open if active" or "open" works for now. 
                                        // Actually let's just render them expanded if active or just list them.
                                        // The screenshot shows it expanded. simpler to just always expand or use state. 
                                        // For now, let's keep it simple: render subitems if they exist.

                                        return (
                                            <li key={itemIdx}>
                                                <div className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${isOpen ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                                                    {/* <item.icon className="w-4 h-4 mr-3" /> */}
                                                    <span className="flex-1">{item.name}</span>
                                                </div>
                                                <ul className="pl-6 space-y-1 mt-1">
                                                    {item.subItems.map(sub => {
                                                        const isSubActive = isPathActive(sub.path);
                                                        return (
                                                            <li key={sub.path}>
                                                                <Link
                                                                    to={sub.path}
                                                                    className={`block px-2 py-1.5 text-sm font-medium rounded-md transition-colors ${isSubActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
                                                                >
                                                                    {sub.name}
                                                                </Link>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </li>
                                        );
                                    }

                                    const isActive = isPathActive(item.path);
                                    return (
                                        <li key={item.path}>
                                            <Link
                                                to={item.path}
                                                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                                    ? "bg-blue-50 text-blue-700"
                                                    : "text-gray-700 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {/* <item.icon className={`w-4 h-4 mr-3 ${isActive ? "text-blue-700" : "text-gray-400"}`} /> */}
                                                {item.name}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default PayrollSettingsLayout;

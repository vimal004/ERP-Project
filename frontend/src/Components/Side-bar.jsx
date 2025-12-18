import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  BriefcaseIcon,
  ClockIcon,
  BuildingLibraryIcon,
  CalculatorIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  PlusIcon,
  ChartPieIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const IconMap = {
  Home: HomeIcon,
  Items: CubeIcon,
  Sales: ShoppingCartIcon,
  Purchases: BriefcaseIcon,
  TimeTracking: ClockIcon,
  Banking: BuildingLibraryIcon,
  Accountant: CalculatorIcon,
  Reports: ChartPieIcon, // Using ChartPie for Reports
  Documents: DocumentTextIcon,
};

const navItems = [
  { name: "Home", path: "/home", icon: "Home", isSingle: true }, // Corrected path to /home
  {
    name: "Items",
    icon: "Items",
    path: "/items", // Added path for top-level navigation
    subItems: [
      { name: "Items", path: "/items" },
      // Add other sub-items from your HTML snippet if needed
    ],
  },
  {
    name: "Sales",
    icon: "Sales",
    subItems: [
      { name: "Customers", path: "/sales/customers" }, // Corrected to new Customers path
      { name: "Quotes", path: "/sales/quotes" },
      { name: "Sales Orders", path: "/sales/salesorders" }, // Added Sales Orders from original plan
      { name: "Invoices", path: "/sales/invoices" },
      { name: "Recurring Invoices", path: "/sales/recurringinvoices" },
      { name: "Delivery Challans", path: "/sales/deliverychallans" },
      { name: "Payments Received", path: "/sales/paymentsreceived" },
      { name: "Credit Notes", path: "/sales/creditnotes" },
    ],
  },
  {
    name: "Purchases",
    icon: "Purchases",
    subItems: [
      { name: "Vendors", path: "/purchases/vendors" },
      { name: "Bills", path: "/purchases/bills" },
      // ... more purchase items
    ],
  },
  {
    name: "Time Tracking",
    icon: "TimeTracking",
    subItems: [
      { name: "Projects", path: "/time-tracking/projects" },
      { name: "Timesheet", path: "/time-tracking/timesheet" },
    ],
  },
  {
    name: "Banking",
    path: "/banking",
    icon: "Banking",
    isSingle: true,
    separator: true,
  },
  {
    name: "Accountant",
    icon: "Accountant",
    subItems: [
      { name: "Manual Journals", path: "/accountant/journals" },
      { name: "Chart of Accounts", path: "/accountant/accounts" },
      // ... more accountant items
    ],
  },
  { name: "Reports", path: "/reports", icon: "Reports", isSingle: true },
  {
    name: "Documents",
    path: "/documents",
    icon: "Documents",
    isSingle: true,
    hasRightElement: true,
  },
];

const SidebarItem = ({ item }) => {
  const location = useLocation();
  // Check if current location starts with any sub-item path (for parent highlighting)
  const isParentActive =
    item.path === location.pathname ||
    (item.subItems &&
      item.subItems.some((sub) => location.pathname.startsWith(sub.path)));

  const [isOpen, setIsOpen] = useState(isParentActive);
  const Icon = IconMap[item.icon] || HomeIcon;
  const isCollapsible = item.subItems && item.subItems.length > 0;

  const toggleOpen = (e) => {
    e.preventDefault();
    if (isCollapsible) {
      setIsOpen(!isOpen);
    }
  };

  // Check if this item or a direct child is the current active route
  const isCurrentActiveLink = location.pathname === item.path;
  const isSubItemActive =
    item.subItems &&
    item.subItems.some((sub) => location.pathname.startsWith(sub.path));

  return (
    <>
      {item.separator && <li className="h-[1px] bg-gray-200 my-2"></li>}
      <li className="relative">
        <Link
          to={item.path || "#"}
          onClick={isCollapsible ? toggleOpen : null}
          className={`
              flex items-center p-3 text-sm font-semibold transition-all duration-200 rounded-xl
              ${
                isCurrentActiveLink || isSubItemActive
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-soft-lg"
                  : "text-gray-700 hover:bg-primary-50 hover:text-primary-700 hover:shadow-soft"
              }
              ${isCollapsible ? "justify-between" : ""}
            `}
        >
          <div className="flex items-center">
            <Icon className="w-5 h-5 mr-3" />
            <span className="truncate">{item.name}</span>
          </div>

          {isCollapsible && (
            <ChevronRightIcon
              className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                isOpen ? "rotate-90" : "rotate-0"
              } ${
                isCurrentActiveLink || isSubItemActive
                  ? "text-white"
                  : "text-gray-500"
              }`}
            />
          )}
          {item.hasRightElement && (
            <PlusIcon
              className={`w-4 h-4 absolute right-3 ${
                isCurrentActiveLink || isSubItemActive
                  ? "text-white hover:text-blue-200"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            />
          )}
        </Link>

        {isCollapsible && isOpen && (
          // Adjusted nested UL background for better contrast
          <ul className="pl-6 py-1 space-y-1 bg-gray-50 border-l-2 border-blue-100 ml-4">
            {item.subItems.map((sub, index) => (
              <li key={index}>
                <Link
                  to={sub.path}
                  className={`
                      flex justify-between items-center py-2.5 px-3 text-sm rounded-lg transition-all duration-200
                      ${
                        location.pathname.startsWith(sub.path)
                          ? "text-primary-700 font-semibold bg-primary-100 shadow-soft"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                >
                  <span className="truncate">{sub.name}</span>
                  {/* Plus Icon only for New/Add actions (like New Customer, New Quote) */}
                  {[
                    "Customers",
                    "Quotes",
                    "Sales Orders",
                    "Invoices",
                    "Recurring Invoices",
                    "Delivery Challans",
                    "Payments Received",
                    "Credit Notes",
                    "Bills",
                    "Vendors",
                    "Manual Journals",
                  ].includes(sub.name) && (
                    <PlusIcon className="w-4 h-4 text-gray-400 hover:text-blue-600 ml-auto" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    </>
  );
};

// Updated Sidebar component to handle responsive props
const Sidebar = ({ isOpen, onClose }) => {
  return (
    // Use fixed width on large screens, or full screen overlay on small screens
    <div
      className={`
            fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
            transition-transform duration-300 ease-in-out shadow-xl
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:static lg:w-64 lg:flex-shrink-0 lg:shadow-soft-lg
        `}
    >
      <div className="p-4 flex flex-col h-full w-64">
        {/* Header with Close Button for Mobile */}
        <div className="flex justify-between items-center mb-8 px-2 py-2">
          <Link
            to="/home"
            className="flex items-center text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-700 tracking-wide hover:from-primary-700 hover:to-primary-800 transition-all duration-200"
          >
            <ChartPieIcon className="w-8 h-8 mr-2 text-primary-600" />
            Kayaa ERP
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <ul className="space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item, index) => (
            <SidebarItem key={index} item={item} />
          ))}
        </ul>

        {/* Apps Section - Moved to bottom area */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 px-2 tracking-wide">
            Settings & Help
          </h4>

          {/* Configure Features Button - Enhanced Style */}
          <button className="w-full flex items-center justify-center p-3 text-sm font-semibold text-primary-700 bg-primary-100 hover:bg-primary-200 rounded-xl transition-all duration-200 shadow-soft hover:shadow-soft-md active:scale-[0.98]">
            Configure Features
            <ChevronRightIcon className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

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
  BanknotesIcon,
  UserGroupIcon,
  FunnelIcon,
  UsersIcon,
  BuildingOfficeIcon,
  MegaphoneIcon,
  ClipboardDocumentCheckIcon,
  CalendarIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { isAdmin } from "../services/authService";

const IconMap = {
  Home: HomeIcon,
  Items: CubeIcon,
  Sales: ShoppingCartIcon,
  Purchases: BriefcaseIcon,
  TimeTracking: ClockIcon,
  Banking: BuildingLibraryIcon,
  Accountant: CalculatorIcon,
  Reports: ChartPieIcon,
  Documents: DocumentTextIcon,
  Payroll: BanknotesIcon,
  CRM: UserGroupIcon,
  Leads: FunnelIcon,
  Contacts: UsersIcon,
  Accounts: BuildingOfficeIcon,
  Deals: BanknotesIcon,
  Campaigns: MegaphoneIcon,
  Tasks: ClipboardDocumentCheckIcon,
  Meetings: CalendarIcon,
  Calls: PhoneIcon,
};

const navItems = [
  { name: "Home", path: "/home", icon: "Home", isSingle: true },
  {
    name: "Items",
    icon: "Items",
    path: "/items",
    subItems: [{ name: "Items", path: "/items" }],
  },
  {
    name: "Sales",
    icon: "Sales",
    subItems: [
      { name: "Customers", path: "/sales/customers" },
      { name: "Quotes", path: "/sales/quotes" },
      { name: "Sales Orders", path: "/sales/salesorders" },
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
  {
    name: "Payroll",
    icon: "Payroll",
    subItems: [
      { name: "Dashboard", path: "/payroll/dashboard" },
      { name: "Employees", path: "/payroll/employees" },
      { name: "Pay Runs", path: "/payroll/run" },
      { name: "Approvals", path: "/payroll/approvals" },
      { name: "Reports", path: "/payroll/reports" },
      { name: "Settings", path: "/payroll/settings/organisation" },
    ],
  },
  {
    name: "CRM",
    icon: "CRM",
    subItems: [
      { name: "Leads", path: "/crm/leads", icon: "Leads" },
      { name: "Contacts", path: "/crm/contacts", icon: "Contacts" },
      { name: "Accounts", path: "/crm/accounts", icon: "Accounts" },
      { name: "Deals", path: "/crm/deals", icon: "Deals" },
      { name: "Documents", path: "/crm/documents", icon: "Documents" },
      { name: "Campaigns", path: "/crm/campaigns", icon: "Campaigns" },
      { name: "Tasks", path: "/crm/tasks", icon: "Tasks" },
      { name: "Meetings", path: "/crm/meetings", icon: "Meetings" },
      { name: "Calls", path: "/crm/calls", icon: "Calls" },
    ],
  },
];

const SidebarItem = ({ item }) => {
  const location = useLocation();
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

  const isCurrentActiveLink = location.pathname === item.path;
  const isSubItemActive =
    item.subItems &&
    item.subItems.some((sub) => location.pathname.startsWith(sub.path));

  return (
    <>
      {item.separator && (
        <li
          className="my-3 mx-2"
          style={{ height: "1px", backgroundColor: "#e8eaed" }}
        />
      )}
      <li className="relative">
        <Link
          to={item.path || "#"}
          onClick={isCollapsible ? toggleOpen : null}
          style={{
            backgroundColor:
              isCurrentActiveLink || isSubItemActive
                ? "#e8f0fe"
                : "transparent",
            color:
              isCurrentActiveLink || isSubItemActive ? "#1a73e8" : "#5f6368",
            borderRadius: "24px",
          }}
          className={`
            flex items-center p-3 text-sm font-medium transition-all duration-200
            ${isCollapsible ? "justify-between" : ""}
            ${
              !(isCurrentActiveLink || isSubItemActive)
                ? "hover:bg-gray-100"
                : ""
            }
          `}
        >
          <div className="flex items-center">
            <Icon
              className="w-5 h-5 mr-3"
              style={{
                color:
                  isCurrentActiveLink || isSubItemActive
                    ? "#1a73e8"
                    : "#5f6368",
              }}
            />
            <span>{item.name}</span>
          </div>

          {isCollapsible && (
            <ChevronRightIcon
              className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                isOpen ? "rotate-90" : "rotate-0"
              }`}
              style={{
                color:
                  isCurrentActiveLink || isSubItemActive
                    ? "#1a73e8"
                    : "#80868b",
              }}
            />
          )}
          {item.hasRightElement && (
            <PlusIcon
              className="w-4 h-4 absolute right-3"
              style={{
                color:
                  isCurrentActiveLink || isSubItemActive
                    ? "#1a73e8"
                    : "#80868b",
              }}
            />
          )}
        </Link>

        {isCollapsible && isOpen && (
          <ul
            className="mt-1 ml-4 pl-4 space-y-1"
            style={{ borderLeft: "2px solid #e8eaed" }}
          >
            {item.subItems.map((sub, index) => (
              <li key={index}>
                <Link
                  to={sub.path}
                  style={{
                    backgroundColor: location.pathname.startsWith(sub.path)
                      ? "#e8f0fe"
                      : "transparent",
                    color: location.pathname.startsWith(sub.path)
                      ? "#1a73e8"
                      : "#5f6368",
                    borderRadius: "20px",
                  }}
                  className={`
                    flex items-center py-2.5 px-3 text-sm font-medium transition-all duration-200
                    ${
                      !location.pathname.startsWith(sub.path)
                        ? "hover:bg-gray-100"
                        : ""
                    }
                  `}
                >
                  {sub.icon && IconMap[sub.icon] && (
                    <span className="mr-3">
                      {React.createElement(IconMap[sub.icon], {
                        className: "w-4 h-4",
                        style: {
                          color: location.pathname.startsWith(sub.path)
                            ? "#1a73e8"
                            : "#5f6368",
                        },
                      })}
                    </span>
                  )}
                  <span className="flex-1">{sub.name}</span>
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
                  ].includes(sub.name) &&
                    isAdmin() && (
                      <PlusIcon
                        className="w-4 h-4 ml-auto"
                        style={{ color: "#80868b" }}
                      />
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

/**
 * Sidebar Component - Material Design 3
 * Clean, lightweight navigation with soft background fills
 */
const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e8eaed",
      }}
      className={`
        fixed top-0 left-0 h-full z-50
        transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:w-64 lg:flex-shrink-0
      `}
    >
      <div className="p-4 flex flex-col h-full w-64">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 px-2 py-3">
          <Link
            to="/home"
            className="flex items-center text-xl font-medium transition-all duration-200"
            style={{ color: "#202124" }}
          >
            {/* Logo Icon */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mr-3"
              style={{ backgroundColor: "#1a73e8" }}
            >
              <ChartPieIcon className="w-5 h-5 text-white" />
            </div>
            <span>KSK ERP</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-full transition-all duration-200 hover:bg-gray-100"
            style={{ color: "#5f6368" }}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <ul className="space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item, index) => (
            <SidebarItem key={index} item={item} />
          ))}
        </ul>

        {/* Bottom Section */}
        <div
          className="mt-auto pt-4"
          style={{ borderTop: "1px solid #e8eaed" }}
        >
          <p
            className="text-xs font-medium uppercase mb-3 px-2 tracking-wide"
            style={{ color: "#80868b" }}
          >
            Settings & Help
          </p>

          <button
            className="w-full flex items-center justify-center p-3 text-sm font-medium rounded-full transition-all duration-200"
            style={{
              backgroundColor: "#e8f0fe",
              color: "#1a73e8",
            }}
          >
            Configure Features
            <ChevronRightIcon className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

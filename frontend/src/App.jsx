import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import DashboardLayout from "./Components/DashboardLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ItemsPage from "./pages/ItemsPage.jsx";
import NewItemPage from "./pages/NewItemPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { isAuthenticated, isAdmin } from "./services/authService.js";
import CustomersPage from "./pages/sales/CustomersPage.jsx";
import NewCustomerPage from "./pages/sales/NewCustomerPage.jsx";
import QuotesPage from "./pages/sales/QuotesPage.jsx";
import NewQuotePage from "./pages/sales/NewQuotePage.jsx";
import SalesOrdersPage from "./pages/sales/SalesOrdersPage.jsx";
import NewSalesOrderPage from "./pages/sales/NewSalesOrderPage.jsx";
import InvoicesPage from "./pages/sales/InvoicesPage.jsx";
import NewInvoicePage from "./pages/sales/NewInvoicePage.jsx";
import RecurringInvoicesPage from "./pages/sales/RecurringInvoicesPage.jsx";
import NewRecurringInvoicePage from "./pages/sales/NewRecurringInvoicePage.jsx";
import DeliveryChallansPage from "./pages/sales/DeliveryChallansPage.jsx";
import NewDeliveryChallanPage from "./pages/sales/NewDeliveryChallanPage.jsx";
import PayrollPage from "./pages/PayrollPage.jsx";
import PayrollLayout from "./pages/payroll/PayrollLayout.jsx";
import PayrollDashboard from "./pages/payroll/PayrollDashboard.jsx";
import Employees from "./pages/payroll/Employees.jsx";
import NewEmployee from "./pages/payroll/NewEmployee.jsx";
import RunPayroll from "./pages/payroll/RunPayroll.jsx";
import PayRunDetails from "./pages/payroll/PayRunDetails.jsx";
import PayrollSettingsLayout from "./pages/payroll/PayrollSettingsLayout.jsx";
import OrganisationProfile from "./pages/payroll/OrganisationProfile.jsx";
import Users from "./pages/payroll/Users.jsx";
import Roles from "./pages/payroll/Roles.jsx";
import TaxDetails from "./pages/payroll/TaxDetails.jsx";
import "./App.css";

const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <DashboardLayout />;
};

const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  if (!isAdmin()) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

// --- Placeholder Pages (Used for non-implemented navigation items) ---
const PlaceholderPage = ({ title }) => (
  <div className="p-6">
    <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
    <p className="mt-4 text-gray-600">
      Content for the {title} module goes here.
    </p>
  </div>
);

// --- 404 Page Component (Same as before) ---
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <h1 className="text-4xl font-bold text-red-600">404 - Not Found</h1>
    <p className="mt-4 text-gray-600">
      The page you requested could not be found.
    </p>
    <Link
      to="/"
      className="mt-6 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
    >
      Go to Login
    </Link>
  </div>
);

function App() {
  return (
    <Routes>
      {/* 1. Public Route: Login Page (Root Route) */}
      <Route path="/" element={<LoginPage />} />

      {/* 2. Protected Routes: All dashboard content nested under the ProtectedRoute */}
      <Route element={<ProtectedRoute />}>
        {/* The index route for authenticated users is /home */}
        <Route path="/home" index element={<DashboardPage />} />

        {/* --- Item Routes --- */}
        <Route path="items" element={<ItemsPage />} />
        <Route
          path="items/new"
          element={
            <AdminRoute>
              <NewItemPage />
            </AdminRoute>
          }
        />
        <Route
          path="items/:id/edit"
          element={
            <AdminRoute>
              <NewItemPage />
            </AdminRoute>
          }
        />
        {/* --------------------- */}

        {/* --- Sales Routes --- */}
        <Route path="sales/customers" element={<CustomersPage />} />
        <Route
          path="sales/customers/new"
          element={
            <AdminRoute>
              <NewCustomerPage />
            </AdminRoute>
          }
        />
        <Route
          path="sales/customers/edit/:id"
          element={
            <AdminRoute>
              <NewCustomerPage />
            </AdminRoute>
          }
        />
        <Route path="sales/quotes" element={<QuotesPage />} />
        <Route
          path="sales/quotes/new"
          element={
            <AdminRoute>
              <NewQuotePage />
            </AdminRoute>
          }
        />
        <Route path="sales/salesorders" element={<SalesOrdersPage />} />
        <Route
          path="sales/salesorders/new"
          element={
            <AdminRoute>
              <NewSalesOrderPage />
            </AdminRoute>
          }
        />
        <Route path="sales/invoices" element={<InvoicesPage />} />
        <Route
          path="sales/invoices/new"
          element={
            <AdminRoute>
              <NewInvoicePage />
            </AdminRoute>
          }
        />
        <Route
          path="sales/recurringinvoices"
          element={<RecurringInvoicesPage />}
        />
        <Route
          path="sales/recurringinvoices/new"
          element={
            <AdminRoute>
              <NewRecurringInvoicePage />
            </AdminRoute>
          }
        />
        <Route
          path="sales/deliverychallans"
          element={<DeliveryChallansPage />}
        />
        <Route
          path="sales/deliverychallans/new"
          element={
            <AdminRoute>
              <NewDeliveryChallanPage />
            </AdminRoute>
          }
        />
        <Route
          path="sales/paymentsreceived"
          element={<PlaceholderPage title="Payments Received List" />}
        />
        <Route
          path="sales/creditnotes"
          element={<PlaceholderPage title="Credit Notes List" />}
        />
        {/* --------------------- */}

        {/* --- Payroll Routes --- */}
        <Route path="payroll" element={<Navigate to="/payroll/run" replace />} />
        <Route path="payroll/run" element={<PayrollPage title="Run Payroll" />} />
        <Route
          path="payroll/employees"
          element={<PayrollPage title="Employees" />}
        />
        <Route path="payroll/settings" element={<PayrollSettingsLayout />}>
          <Route index element={<Navigate to="organisation" replace />} />
          <Route path="organisation" element={<OrganisationProfile />} />
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
          <Route path="taxes/details" element={<TaxDetails />} />
          {/* Placeholders for other settings */}
          <Route
            path="*"
            element={<PlaceholderPage title="Settings Placeholder" />}
          />
        </Route>
        {/* --------------------- */}

        {/* Nested Routes (Placeholders) matching the sidebar structure */}
        <Route
          path="purchases/vendors"
          element={<PlaceholderPage title="Vendors" />}
        />
        <Route
          path="purchases/bills"
          element={<PlaceholderPage title="Bills" />}
        />
        <Route
          path="time-tracking/projects"
          element={<PlaceholderPage title="Time Tracking Projects" />}
        />
        <Route
          path="time-tracking/timesheet"
          element={<PlaceholderPage title="Timesheet" />}
        />
        <Route path="banking" element={<PlaceholderPage title="Banking" />} />
        <Route
          path="accountant/journals"
          element={<PlaceholderPage title="Manual Journals" />}
        />
        <Route
          path="accountant/accounts"
          element={<PlaceholderPage title="Chart of Accounts" />}
        />
        <Route path="reports" element={<PlaceholderPage title="Reports" />} />
        <Route
          path="documents"
          element={<PlaceholderPage title="Documents" />}
        />
      </Route>

      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

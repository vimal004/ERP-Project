import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { getAllCustomers } from "../../services/customersService";
import {
  MD3Input,
  MD3Select,
  MD3Textarea,
  MD3Button,
  MD3Divider,
  MD3TotalBox,
} from "../../Components/ui/MD3FormComponents";

/**
 * NewSalesOrderPage - Material Design 3 (Google Store Aesthetic)
 */
const NewSalesOrderPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: "",
    salesOrderNumber: "SO-000001",
    referenceNumber: "",
    salesOrderDate: new Date().toISOString().split("T")[0],
    shipmentDate: "",
    salesperson: "",
    items: [{ details: "", quantity: 1, rate: 0, discount: 0, amount: 0 }],
    customerNotes: "",
    termsConditions: "",
  });

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getAllCustomers();
        setCustomers(data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };
    fetchCustomers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    const qty = parseFloat(updatedItems[index].quantity) || 0;
    const rate = parseFloat(updatedItems[index].rate) || 0;
    const discount = parseFloat(updatedItems[index].discount) || 0;
    updatedItems[index].amount = qty * rate * (1 - discount / 100);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { details: "", quantity: 1, rate: 0, discount: 0, amount: 0 },
      ],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  return (
    <div
      className="p-6 sm:p-8"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/sales/salesorders"
            className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100"
            style={{ color: "#5f6368" }}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#e8f0fe" }}
            >
              <ShoppingBagIcon
                className="w-5 h-5"
                style={{ color: "#1a73e8" }}
              />
            </div>
            <h1 className="text-2xl font-normal" style={{ color: "#202124" }}>
              New Sales Order
            </h1>
          </div>
        </div>
        <Link
          to="/sales/salesorders"
          className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100"
          style={{ color: "#5f6368" }}
        >
          <XMarkIcon className="w-5 h-5" />
        </Link>
      </div>

      {/* Form Container */}
      <div
        className="p-6 sm:p-8 space-y-8"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          boxShadow:
            "0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)",
        }}
      >
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <MD3Select
              label="Customer Name"
              required
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
            >
              <option value="">Select or add a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.displayName}>
                  {customer.displayName}
                </option>
              ))}
            </MD3Select>
            <FormInput
              label="Sales Order#"
              required
              name="salesOrderNumber"
              value={formData.salesOrderNumber}
              onChange={handleInputChange}
            />
            <FormInput
              label="Reference#"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Sales Order Date"
                required
                type="date"
                name="salesOrderDate"
                value={formData.salesOrderDate}
                onChange={handleInputChange}
              />
              <FormInput
                label="Shipment Date"
                type="date"
                name="shipmentDate"
                value={formData.shipmentDate}
                onChange={handleInputChange}
              />
            </div>
            <FormSelect
              label="Salesperson"
              name="salesperson"
              value={formData.salesperson}
              onChange={handleInputChange}
            >
              <option value="">Select or Add Salesperson</option>
            </FormSelect>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", backgroundColor: "#e8eaed" }} />

        {/* Item Table */}
        <div>
          <h3 className="text-lg font-medium mb-4" style={{ color: "#202124" }}>
            Item Table
          </h3>
          <div
            className="overflow-x-auto"
            style={{ border: "1px solid #e8eaed", borderRadius: "16px" }}
          >
            <table
              className="min-w-full divide-y"
              style={{ borderColor: "#e8eaed" }}
            >
              <thead style={{ backgroundColor: "#f8f9fa" }}>
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/2"
                    style={{ color: "#5f6368" }}
                  >
                    Item Details
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#5f6368" }}
                  >
                    Quantity
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#5f6368" }}
                  >
                    Rate
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#5f6368" }}
                  >
                    Discount (%)
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#5f6368" }}
                  >
                    Amount
                  </th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "#e8eaed" }}>
                {formData.items.map((item, index) => (
                  <tr key={index} style={{ backgroundColor: "#ffffff" }}>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder="Type or click to select an item."
                        value={item.details}
                        onChange={(e) =>
                          handleItemChange(index, "details", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm focus:outline-none"
                        style={{
                          backgroundColor: "#f8f9fa",
                          border: "none",
                          borderRadius: "6px",
                          color: "#202124",
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm text-right focus:outline-none"
                        style={{
                          backgroundColor: "#f8f9fa",
                          border: "none",
                          borderRadius: "6px",
                          color: "#202124",
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(index, "rate", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm text-right focus:outline-none"
                        style={{
                          backgroundColor: "#f8f9fa",
                          border: "none",
                          borderRadius: "6px",
                          color: "#202124",
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) =>
                          handleItemChange(index, "discount", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm text-right focus:outline-none"
                        style={{
                          backgroundColor: "#f8f9fa",
                          border: "none",
                          borderRadius: "6px",
                          color: "#202124",
                        }}
                      />
                    </td>
                    <td
                      className="px-4 py-3 text-right text-sm font-medium"
                      style={{ color: "#202124" }}
                    >
                      ₹{item.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {formData.items.length > 1 && (
                        <button
                          onClick={() => removeItem(index)}
                          className="p-1.5 rounded-full transition-all duration-200 hover:bg-red-50"
                          style={{ color: "#d93025" }}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: "#e8f0fe",
                color: "#1a73e8",
                borderRadius: "9999px",
              }}
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Add New Row
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: "#e8f0fe",
                color: "#1a73e8",
                borderRadius: "9999px",
              }}
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Add Items in Bulk
            </button>
          </div>

          {/* Total Section */}
          <div className="mt-8 flex justify-end">
            <div
              className="w-full md:w-1/3 p-5"
              style={{ backgroundColor: "#f8f9fa", borderRadius: "16px" }}
            >
              <div
                className="flex justify-between text-sm font-medium mb-3"
                style={{ color: "#5f6368" }}
              >
                <span>Sub Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#e8eaed",
                  margin: "12px 0",
                }}
              />
              <div
                className="flex justify-between text-base font-medium"
                style={{ color: "#202124" }}
              >
                <span>Total (INR)</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div style={{ height: "1px", backgroundColor: "#e8eaed" }} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#202124" }}
            >
              Customer Notes
            </label>
            <textarea
              name="customerNotes"
              rows="3"
              placeholder="Enter any notes to be displayed in your transaction"
              value={formData.customerNotes}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-sm transition-all duration-200 resize-none focus:outline-none"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #dadce0",
                borderRadius: "8px",
                color: "#202124",
              }}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#202124" }}
            >
              Terms & Conditions
            </label>
            <textarea
              name="termsConditions"
              rows="3"
              placeholder="Enter the terms and conditions of your business"
              value={formData.termsConditions}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-sm transition-all duration-200 resize-none focus:outline-none"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #dadce0",
                borderRadius: "8px",
                color: "#202124",
              }}
            />
          </div>
        </div>

        {/* Attachments */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "#202124" }}
          >
            Attach File(s)
          </label>
          <div
            className="p-6 flex flex-col items-start justify-center cursor-pointer transition-all duration-200 hover:bg-gray-50"
            style={{ border: "2px dashed #dadce0", borderRadius: "16px" }}
          >
            <div
              className="flex items-center gap-2"
              style={{ color: "#5f6368" }}
            >
              <ArrowUpTrayIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Upload File</span>
            </div>
            <p className="text-xs mt-1" style={{ color: "#80868b" }}>
              You can upload a maximum of 10 files, 5MB each
            </p>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-8 flex justify-between items-center pb-8">
        <div className="flex gap-3">
          <button
            className="py-3 px-6 text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: "#ffffff",
              color: "#5f6368",
              border: "1px solid #dadce0",
              borderRadius: "9999px",
            }}
          >
            Save as Draft
          </button>
          <button
            className="py-3 px-6 text-sm font-medium text-white transition-all duration-200"
            style={{ backgroundColor: "#1a73e8", borderRadius: "9999px" }}
          >
            Save and Send
          </button>
          <Link
            to="/sales/salesorders"
            className="py-3 px-6 text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: "transparent",
              color: "#1a73e8",
              borderRadius: "9999px",
            }}
          >
            Cancel
          </Link>
        </div>
        <div className="text-sm text-right" style={{ color: "#5f6368" }}>
          <p>Total Amount: ₹{calculateTotal().toFixed(2)}</p>
          <p>
            Total Quantity:{" "}
            {formData.items.reduce(
              (sum, item) => sum + (parseFloat(item.quantity) || 0),
              0
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

// Form Input Component
const FormInput = ({
  label,
  required,
  type = "text",
  name,
  value,
  onChange,
}) => (
  <div>
    <label
      className="block text-sm font-medium mb-2"
      style={{ color: required ? "#d93025" : "#202124" }}
    >
      {label}
      {required && "*"}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 text-sm transition-all duration-200 focus:outline-none"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #dadce0",
        borderRadius: "8px",
        color: "#202124",
      }}
    />
  </div>
);

// Form Select Component
const FormSelect = ({ label, required, name, value, onChange, children }) => (
  <div>
    <label
      className="block text-sm font-medium mb-2"
      style={{ color: required ? "#d93025" : "#202124" }}
    >
      {label}
      {required && "*"}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 text-sm transition-all duration-200 cursor-pointer focus:outline-none"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #dadce0",
        borderRadius: "8px",
        color: "#202124",
      }}
    >
      {children}
    </select>
  </div>
);

export default NewSalesOrderPage;

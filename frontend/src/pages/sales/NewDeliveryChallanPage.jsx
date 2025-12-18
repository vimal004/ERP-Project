import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  PlusCircleIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

const NewDeliveryChallanPage = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    deliveryChallanNumber: "DC-00001",
    referenceNumber: "",
    deliveryChallanDate: new Date().toISOString().split("T")[0],
    challanType: "",
    items: [{ details: "", quantity: 1, rate: 0, discount: 0, amount: 0 }],
    adjustmentLabel: "Adjustment",
    adjustmentAmount: 0,
    customerNotes: "",
    termsConditions: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    // Recalculate amount
    const qty = parseFloat(updatedItems[index].quantity) || 0;
    const rate = parseFloat(updatedItems[index].rate) || 0;
    const discount = parseFloat(updatedItems[index].discount) || 0;
    updatedItems[index].amount = qty * rate * (1 - discount / 100);

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
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

  const calculateSubTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const calculateTotal = () => {
    const subTotal = calculateSubTotal();
    const adjustment = parseFloat(formData.adjustmentAmount) || 0;
    return subTotal + adjustment;
  };

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft-md">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              New Delivery Challan
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Create a new delivery challan for your customer
            </p>
          </div>
        </div>
        <Link
          to="/sales/deliverychallans"
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Link>
      </div>

      {/* Form Container */}
      <div className="card p-6 sm:p-8 space-y-8 animate-slide-up">
        {/* Top Section */}
        <div className="space-y-6">
          {/* Customer Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <label className="block text-sm font-semibold text-gray-700 md:pt-2.5">
              Customer Name<span className="text-rose-500 ml-1">*</span>
            </label>
            <div className="md:col-span-2 flex gap-2">
              <div className="relative flex-grow">
                <select
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="input-field appearance-none pr-10"
                >
                  <option value="">Select or add a customer</option>
                  <option value="Customer A">Customer A</option>
                  <option value="Customer B">Customer B</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <button className="px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-soft hover:shadow-soft-md transition-all duration-200 flex items-center justify-center">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Delivery Challan# */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <label className="block text-sm font-semibold text-gray-700 md:pt-2.5">
              Delivery Challan#<span className="text-rose-500 ml-1">*</span>
            </label>
            <div className="md:col-span-2 flex items-center gap-2">
              <input
                type="text"
                name="deliveryChallanNumber"
                value={formData.deliveryChallanNumber}
                onChange={handleInputChange}
                className="input-field"
              />
              <button className="p-2.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200">
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Reference# */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <label className="block text-sm font-semibold text-gray-700 md:pt-2.5">
              Reference#
            </label>
            <div className="md:col-span-2">
              <input
                type="text"
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter reference number"
              />
            </div>
          </div>

          {/* Delivery Challan Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <label className="block text-sm font-semibold text-gray-700 md:pt-2.5">
              Delivery Challan Date<span className="text-rose-500 ml-1">*</span>
            </label>
            <div className="md:col-span-2">
              <input
                type="date"
                name="deliveryChallanDate"
                value={formData.deliveryChallanDate}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
          </div>

          {/* Challan Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <label className="block text-sm font-semibold text-gray-700 md:pt-2.5">
              Challan Type<span className="text-rose-500 ml-1">*</span>
            </label>
            <div className="md:col-span-2">
              <div className="relative">
                <select
                  name="challanType"
                  value={formData.challanType}
                  onChange={handleInputChange}
                  className="input-field appearance-none pr-10"
                >
                  <option value="">Choose a proper challan type</option>
                  <option value="Supply of Liquid Gas">
                    Supply of Liquid Gas
                  </option>
                  <option value="Job Work">Job Work</option>
                  <option value="Supply on Approval">Supply on Approval</option>
                  <option value="Others">Others</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Item Table */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Item Table</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Add items to this delivery challan
              </p>
            </div>
            <button className="text-primary-600 text-sm font-semibold flex items-center hover:text-primary-700 hover:bg-primary-50 px-3 py-2 rounded-lg transition-all duration-200">
              <PlusCircleIcon className="w-4 h-4 mr-1.5" /> Bulk Actions
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-soft">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="table-header text-left w-1/2">Item Details</th>
                  <th className="table-header text-right">Quantity</th>
                  <th className="table-header text-right">Rate</th>
                  <th className="table-header text-right">Discount (%)</th>
                  <th className="table-header text-right">Amount</th>
                  <th className="table-header w-12"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.items.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder="Type or click to select an item"
                        value={item.details}
                        onChange={(e) =>
                          handleItemChange(index, "details", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-right focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(index, "rate", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-right focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) =>
                          handleItemChange(index, "discount", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-right focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      />
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      ₹{item.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {formData.items.length > 1 && (
                        <button
                          onClick={() => removeItem(index)}
                          className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg shadow-soft hover:shadow-soft-md transition-all duration-200 active:scale-[0.98]"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Add New Row
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-soft hover:shadow-soft-md transition-all duration-200 active:scale-[0.98]"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Add Items in Bulk
            </button>
          </div>

          {/* Total Section */}
          <div className="mt-10 flex justify-end">
            <div className="w-full md:w-1/2 lg:w-2/5 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-soft-md space-y-4">
              <div className="flex justify-between text-sm font-semibold text-gray-700">
                <span>Sub Total</span>
                <span className="font-bold text-gray-900">
                  ₹{calculateSubTotal().toFixed(2)}
                </span>
              </div>

              {/* Adjustment */}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="adjustmentLabel"
                  value={formData.adjustmentLabel}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                />
                <input
                  type="number"
                  name="adjustmentAmount"
                  value={formData.adjustmentAmount}
                  onChange={handleInputChange}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-xs text-right font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                />
                <span className="text-sm text-gray-900 font-bold min-w-[80px] text-right">
                  ₹{parseFloat(formData.adjustmentAmount || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-900 border-t-2 border-gray-300 pt-4">
                <span>Total ( ₹ )</span>
                <span className="text-primary-600">
                  ₹{calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Customer Notes
            </label>
            <textarea
              name="customerNotes"
              rows="4"
              placeholder="Enter any notes to be displayed in your transaction"
              value={formData.customerNotes}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Terms & Conditions
            </label>
            <textarea
              name="termsConditions"
              rows="4"
              placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
              value={formData.termsConditions}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none"
            />
          </div>
        </div>

        {/* Attachments */}
        <div className="pt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Attach File(s) to Delivery Challan
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary-400 hover:bg-primary-50/30 transition-all duration-300 cursor-pointer group">
            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary-200 transition-colors duration-300">
              <ArrowUpTrayIcon className="w-7 h-7 text-primary-600" />
            </div>
            <span className="text-sm text-primary-600 font-semibold mb-1">
              Click to Upload or Drag and Drop
            </span>
            <span className="text-xs text-gray-500">
              Maximum 5 files, 10MB each (PDF, JPG, PNG)
            </span>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-10 flex items-center gap-4 pb-10">
        <button className="btn-primary">
          <svg
            className="w-5 h-5 mr-2 inline-block"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Save Delivery Challan
        </button>
        <Link to="/sales/deliverychallans" className="btn-secondary">
          Cancel
        </Link>
      </div>
    </div>
  );
};

export default NewDeliveryChallanPage;

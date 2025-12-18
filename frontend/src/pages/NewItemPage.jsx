import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  InformationCircleIcon,
  ChevronDownIcon,
  XMarkIcon, 
} from "@heroicons/react/24/outline";
import { UNIT_OPTIONS, ACCOUNT_OPTIONS } from "../data/constants";

// --- Reusable Input Component - Material Floating Label Style ---
const LabeledInput = ({
  id,
  label,
  required = false,
  type = "text",
  placeholder = "",
  currency = null,
}) => (
  <div className="flex flex-col space-y-1 relative">
    {/* Input Field */}
    <input
      id={id}
      type={type}
      className={`peer w-full h-12 px-4 pt-4 pb-0 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-transparent focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition duration-200 ${currency ? 'pl-16' : ''}`}
      placeholder=" "
    />
    {/* Currency Prefix */}
    {currency && (
      <span className="absolute left-0 top-1/2 transform -translate-y-1/2 ml-4 text-sm font-semibold text-gray-600 pointer-events-none">
        {currency}
      </span>
    )}
    {/* Floating Label */}
    <label
      htmlFor={id}
      className={`absolute left-4 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600 ${required ? 'peer-focus:text-red-600' : ''}`}
    >
      {label}
      {required && "*"}
    </label>
  </div>
);


// --- DropdownSelect Component (Updated Styling) ---
const DropdownSelect = ({
  label,
  options,
  groupOptions,
  required = false,
  defaultValue = "",
  placeholder = "Select or type to add",
}) => {
  const [value, setValue] = useState(defaultValue);

  const renderOptions = () => {
    if (groupOptions) {
      return groupOptions.map((group, index) => (
        <optgroup key={index} label={group.group} className="font-semibold">
          {group.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </optgroup>
      ));
    }
    return options.map((option) => (
      <option key={option.code} value={option.code}>
        {option.name}
      </option>
    ));
  };

  return (
    <div className="flex flex-col space-y-1">
      <label
        className={`text-xs font-semibold mb-1 ${
          required ? "text-red-600" : "text-gray-600"
        }`}
      >
        {label}
        {required && "*"}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm appearance-none focus:ring-blue-600 focus:border-blue-600 bg-white text-gray-800 shadow-sm"
        >
          {!value && (
            <option value="" disabled className="text-gray-400">
              {placeholder}
            </option>
          )}

          {renderOptions()}

          {groupOptions && (
            <option value="new_account" className="font-semibold border-t">
              + New Account
            </option>
          )}
        </select>
        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

const NewItemPage = () => {
  const [itemType, setItemType] = useState("goods");

  const LabelWithInfo = ({ children }) => (
    <div className="flex items-center space-x-1 text-sm text-gray-700 font-semibold">
      {children}
      <InformationCircleIcon className="w-4 h-4 text-blue-400 cursor-pointer hover:text-blue-600 transition" />
    </div>
  );

  return (
    // Responsive padding
    <div className="p-4 sm:p-8">
      {/* Header - Made action items wrap on very small screens */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 sm:mb-0">New Item</h1>
        <div className="flex space-x-3">
          <Link
            to="/items"
            className="py-2 px-4 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </Link>
          <button className="py-2 px-4 text-sm bg-blue-600 text-white rounded-lg shadow-md-2 hover:bg-blue-700 transition">
            Save
          </button>
        </div>
      </div>

      {/* Item Form Card - Consistent Elevation */}
      <div className=" bg-white p-6 sm:p-8 rounded-xl shadow-xl-2 border border-gray-100">
        
        {/* Type & Name Row */}
        <div className="space-y-8">
          
          {/* Item Type - Made responsive */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-10">
            <LabelWithInfo>Type</LabelWithInfo>
            <div className="flex space-x-6">
              <label className="flex items-center text-sm font-medium">
                <input
                  type="radio"
                  name="itemType"
                  value="goods"
                  checked={itemType === "goods"}
                  onChange={() => setItemType("goods")}
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Goods</span>
              </label>
              <label className="flex items-center text-sm font-medium">
                <input
                  type="radio"
                  name="itemType"
                  value="service"
                  checked={itemType === "service"}
                  onChange={() => setItemType("service")}
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Service</span>
              </label>
            </div>
          </div>

          {/* Name Input - Changed w-1/2 to be fully responsive */}
          <div className="w-full md:w-1/2"> 
            <LabeledInput
              id="itemName"
              label="Name"
              required={true}
              type="text"
              placeholder="Enter item name"
            />
          </div>

          {/* Unit Dropdown - Changed w-1/2 to be fully responsive */}
          <div className="w-full md:w-1/2"> 
            <DropdownSelect
              label="Unit"
              options={UNIT_OPTIONS}
              defaultValue="KGS"
              required={false}
              placeholder="Select or type to add"
            />
          </div>
        </div>

        <div className="h-px bg-gray-200 mt-10 mb-8"></div> {/* Separator */}

        {/* Sales & Purchase Columns - Layout stacks on mobile (default grid-cols-1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {/* LEFT COLUMN: Sales Information */}
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-800">Sales Information</h4>
              <label className="flex items-center text-sm text-gray-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="form-checkbox h-4 w-4 text-blue-600 rounded mr-2 border-gray-400 focus:ring-blue-500"
                />
                Sellable
              </label>
            </div>

            {/* Selling Price */}
            <LabeledInput
                id="sellingPrice"
                label="Selling Price"
                required={true}
                type="number"
                currency="INR"
            />

            {/* Sales Account */}
            <DropdownSelect
              label="Account"
              groupOptions={ACCOUNT_OPTIONS}
              defaultValue="Sales" 
              required={true}
              placeholder="Select Sales Account"
            />

            {/* Description (Sales) */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-gray-600 mb-1">
                Description (Sales)
              </label>
              <textarea
                rows="3"
                className="border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-600 focus:border-blue-600 shadow-sm"
              ></textarea>
            </div>
          </div>

          {/* RIGHT COLUMN: Purchase Information - Adjusted borders for mobile stacking */}
          {/* The border-t and pt-8 ensure separation when stacking on mobile */}
          <div className="space-y-6 border-t pt-8 border-gray-200 md:border-t-0 md:border-l md:pl-12 md:pt-0">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-800">
                Purchase Information
              </h4>
              <label className="flex items-center text-sm text-gray-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="form-checkbox h-4 w-4 text-blue-600 rounded mr-2 border-gray-400 focus:ring-blue-500"
                />
                Purchasable
              </label>
            </div>

            {/* Cost Price */}
            <LabeledInput
                id="costPrice"
                label="Cost Price"
                required={true}
                type="number"
                currency="INR"
            />

            {/* Purchase Account */}
            <DropdownSelect
              label="Account"
              groupOptions={ACCOUNT_OPTIONS}
              defaultValue="Cost of Goods Sold"
              required={true}
              placeholder="Select Purchase Account"
            />

            {/* Description (Purchase) */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-gray-600 mb-1">
                Description (Purchase)
              </label>
              <textarea
                rows="3"
                className="border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-600 focus:border-blue-600 shadow-sm"
              ></textarea>
            </div>

            {/* Preferred Vendor */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-gray-600 mb-1">
                Preferred Vendor
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-600 focus:border-blue-600 shadow-sm"
                placeholder="Select or type to add"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewItemPage;
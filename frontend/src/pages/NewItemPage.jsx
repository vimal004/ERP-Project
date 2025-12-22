import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CubeIcon,
  WrenchScrewdriverIcon,
  CurrencyRupeeIcon,
  ShoppingCartIcon,
  TagIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  SparklesIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import { UNIT_OPTIONS, ACCOUNT_OPTIONS } from "../data/constants";
import { createItem } from "../services/itemsService";

// --- Premium Floating Input Component ---
const FloatingInput = ({
  id,
  label,
  required = false,
  type = "text",
  value,
  onChange,
  icon: Icon,
  prefix,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.toString().length > 0;
  const isActive = isFocused || hasValue;

  return (
    <div className="relative group">
      <div
        className={`relative flex items-center bg-white rounded-xl border-2 transition-all duration-300 ${
          error
            ? "border-red-300 shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
            : isFocused
            ? "border-primary-500 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        {/* Icon */}
        {Icon && (
          <div
            className={`absolute left-4 transition-colors duration-300 ${
              isFocused ? "text-primary-500" : "text-gray-400"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}

        {/* Currency Prefix */}
        {prefix && (
          <span
            className={`absolute ${
              Icon ? "left-12" : "left-4"
            } text-sm font-semibold transition-colors duration-300 ${
              isFocused ? "text-primary-600" : "text-gray-500"
            }`}
          >
            {prefix}
          </span>
        )}

        {/* Input Field */}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full h-14 bg-transparent outline-none text-gray-800 font-medium text-sm transition-all duration-300 ${
            Icon ? "pl-12" : "pl-4"
          } ${prefix ? (Icon ? "pl-20" : "pl-14") : ""} pr-4 pt-5`}
          placeholder=" "
        />

        {/* Floating Label */}
        <label
          htmlFor={id}
          className={`absolute pointer-events-none transition-all duration-300 ${
            Icon ? "left-12" : "left-4"
          } ${prefix && isActive ? (Icon ? "left-12" : "left-4") : ""} ${
            isActive
              ? "top-2 text-xs font-semibold"
              : "top-1/2 -translate-y-1/2 text-sm"
          } ${
            error
              ? "text-red-500"
              : isFocused
              ? "text-primary-600"
              : "text-gray-500"
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};

// --- Premium Select Component ---
const PremiumSelect = ({
  label,
  options,
  groupOptions,
  required = false,
  value,
  onChange,
  placeholder = "Select an option",
  icon: Icon,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const renderOptions = () => {
    if (groupOptions) {
      return groupOptions.map((group, index) => (
        <optgroup
          key={index}
          label={group.group}
          className="font-semibold text-gray-800"
        >
          {group.options.map((option) => (
            <option key={option} value={option} className="py-2">
              {option}
            </option>
          ))}
        </optgroup>
      ));
    }
    return options.map((option) => (
      <option key={option.code} value={option.code} className="py-2">
        {option.name}
      </option>
    ));
  };

  return (
    <div className="relative group">
      {/* Label */}
      <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <div
        className={`relative flex items-center bg-white rounded-xl border-2 transition-all duration-300 ${
          isFocused
            ? "border-primary-500 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        {/* Icon */}
        {Icon && (
          <div
            className={`absolute left-4 transition-colors duration-300 ${
              isFocused ? "text-primary-500" : "text-gray-400"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}

        {/* Select */}
        <select
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full h-12 bg-transparent outline-none text-gray-800 font-medium text-sm appearance-none cursor-pointer ${
            Icon ? "pl-12" : "pl-4"
          } pr-10`}
        >
          {!value && (
            <option value="" disabled className="text-gray-400">
              {placeholder}
            </option>
          )}
          {renderOptions()}
        </select>

        {/* Dropdown Icon */}
        <ChevronDownIcon
          className={`absolute right-4 w-4 h-4 pointer-events-none transition-transform duration-300 ${
            isFocused ? "rotate-180 text-primary-500" : "text-gray-400"
          }`}
        />
      </div>
    </div>
  );
};

// --- Premium Textarea Component ---
const PremiumTextarea = ({ label, value, onChange, placeholder, rows = 3 }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group">
      {/* Label */}
      <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
        {label}
      </label>

      <div
        className={`relative bg-white rounded-xl border-2 transition-all duration-300 ${
          isFocused
            ? "border-primary-500 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <textarea
          rows={rows}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-gray-800 font-medium text-sm p-4 resize-none placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};

// --- Premium Type Selector (Radio) ---
const TypeSelector = ({ selected, onChange }) => {
  const types = [
    {
      value: "GOODS",
      label: "Goods",
      description: "Physical products with inventory",
      icon: CubeIcon,
      color: "emerald",
    },
    {
      value: "SERVICE",
      label: "Service",
      description: "Services and intangible offerings",
      icon: WrenchScrewdriverIcon,
      color: "violet",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {types.map((type) => {
        const Icon = type.icon;
        const isSelected = selected === type.value;
        const colorClasses = {
          emerald: {
            bg: "bg-emerald-50",
            border: "border-emerald-500",
            text: "text-emerald-600",
            ring: "ring-emerald-500/20",
            gradient: "from-emerald-500 to-teal-500",
          },
          violet: {
            bg: "bg-violet-50",
            border: "border-violet-500",
            text: "text-violet-600",
            ring: "ring-violet-500/20",
            gradient: "from-violet-500 to-purple-500",
          },
        };
        const colors = colorClasses[type.color];

        return (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            className={`relative flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left group ${
              isSelected
                ? `${colors.bg} ${colors.border} ring-4 ${colors.ring}`
                : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
            }`}
          >
            {/* Icon Container */}
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isSelected
                  ? `bg-gradient-to-br ${colors.gradient} shadow-lg`
                  : "bg-gray-100 group-hover:bg-gray-200"
              }`}
            >
              <Icon
                className={`w-6 h-6 transition-colors duration-300 ${
                  isSelected ? "text-white" : "text-gray-500"
                }`}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
                className={`font-bold text-base transition-colors duration-300 ${
                  isSelected ? colors.text : "text-gray-800"
                }`}
              >
                {type.label}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">{type.description}</p>
            </div>

            {/* Check Indicator */}
            <div
              className={`absolute top-3 right-3 transition-all duration-300 ${
                isSelected ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
            >
              <CheckCircleSolid className={`w-6 h-6 ${colors.text}`} />
            </div>
          </button>
        );
      })}
    </div>
  );
};

// --- Premium Toggle Switch ---
const ToggleSwitch = ({
  label,
  description,
  checked,
  onChange,
  color = "blue",
}) => {
  const colorClasses = {
    blue: {
      bg: "bg-primary-500",
      ring: "focus:ring-primary-500/20",
    },
    emerald: {
      bg: "bg-emerald-500",
      ring: "focus:ring-emerald-500/20",
    },
  };
  const colors = colorClasses[color];

  return (
    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer group hover:bg-gray-100 transition-colors duration-300">
      <div>
        <p className="font-semibold text-gray-800">{label}</p>
        {description && (
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-12 h-7 rounded-full transition-colors duration-300 ${
            checked ? colors.bg : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
              checked ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </div>
      </div>
    </label>
  );
};

// --- Section Header Component ---
const SectionHeader = ({ icon: Icon, title, subtitle, color = "blue" }) => {
  const colorClasses = {
    blue: {
      bg: "bg-primary-100",
      text: "text-primary-600",
    },
    emerald: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
    },
    amber: {
      bg: "bg-amber-100",
      text: "text-amber-600",
    },
  };
  const colors = colorClasses[color];

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className={`p-3 rounded-xl ${colors.bg}`}>
        <Icon className={`w-6 h-6 ${colors.text}`} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
};

// --- Main Component ---
const NewItemPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "GOODS",
    unit: "KGS",
    sellable: true,
    sellingPrice: "",
    salesAccount: "Sales",
    salesDescription: "",
    purchasable: true,
    costPrice: "",
    purchaseAccount: "Cost of Goods Sold",
    purchaseDescription: "",
    preferredVendor: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleCheckboxChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.checked,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Item name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const itemData = {
        name: formData.name.trim(),
        type: formData.type,
        unit: formData.unit,
        sellable: formData.sellable,
        sellingPrice: formData.sellingPrice
          ? parseFloat(formData.sellingPrice)
          : null,
        salesAccount: formData.salesAccount,
        salesDescription: formData.salesDescription,
        purchasable: formData.purchasable,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
        purchaseAccount: formData.purchaseAccount,
        purchaseDescription: formData.purchaseDescription,
        preferredVendor: formData.preferredVendor,
      };

      await createItem(itemData);
      setSuccess(true);

      setTimeout(() => {
        navigate("/items", {
          state: { message: "Item created successfully!" },
        });
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to create item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* Back Button */}
          <Link
            to="/items"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-300 mb-6 group"
          >
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm font-medium">Back to Items</span>
          </Link>

          {/* Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <SparklesIcon className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Create New Item
                </h1>
                <p className="text-gray-500 mt-1">
                  Add a new product or service to your inventory
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/items"
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-300"
              >
                Cancel
              </Link>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || success}
                className={`px-6 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  success
                    ? "bg-emerald-500 text-white"
                    : "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : success ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    Created!
                  </>
                ) : (
                  "Save Item"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <ExclamationCircleIcon className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-red-800">Error</h4>
              <p className="text-sm text-red-600 mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="flex-shrink-0 p-1 hover:bg-red-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-red-400" />
            </button>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top">
            <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-emerald-800">Success!</h4>
              <p className="text-sm text-emerald-600 mt-0.5">
                Item created successfully. Redirecting...
              </p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/50 border border-white/50 overflow-hidden">
          {/* Item Type Section */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <SectionHeader
              icon={TagIcon}
              title="Item Type"
              subtitle="Choose whether this is a physical product or a service"
            />
            <TypeSelector
              selected={formData.type}
              onChange={(type) => setFormData((prev) => ({ ...prev, type }))}
            />
          </div>

          {/* Basic Information Section */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <SectionHeader
              icon={CubeIcon}
              title="Basic Information"
              subtitle="Enter the essential details for this item"
              color="blue"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FloatingInput
                id="itemName"
                label="Item Name"
                required
                type="text"
                value={formData.name}
                onChange={handleInputChange("name")}
                icon={TagIcon}
                error={errors.name}
              />
              <PremiumSelect
                label="Unit of Measurement"
                options={UNIT_OPTIONS}
                value={formData.unit}
                onChange={handleInputChange("unit")}
                placeholder="Select unit"
              />
            </div>
          </div>

          {/* Sales & Purchase Information - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Sales Information */}
            <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-gray-100">
              <SectionHeader
                icon={CurrencyRupeeIcon}
                title="Sales Information"
                subtitle="Pricing and account details for sales"
                color="emerald"
              />

              <div className="space-y-5">
                {/* Sellable Toggle */}
                <ToggleSwitch
                  label="Sellable Item"
                  description="Enable if this item can be sold"
                  checked={formData.sellable}
                  onChange={handleCheckboxChange("sellable")}
                  color="emerald"
                />

                {formData.sellable && (
                  <div className="space-y-5 animate-in slide-in-from-top">
                    {/* Selling Price */}
                    <FloatingInput
                      id="sellingPrice"
                      label="Selling Price"
                      type="number"
                      value={formData.sellingPrice}
                      onChange={handleInputChange("sellingPrice")}
                      icon={CurrencyRupeeIcon}
                      prefix="₹"
                    />

                    {/* Sales Account */}
                    <PremiumSelect
                      label="Sales Account"
                      groupOptions={ACCOUNT_OPTIONS}
                      value={formData.salesAccount}
                      onChange={handleInputChange("salesAccount")}
                      required
                      placeholder="Select sales account"
                    />

                    {/* Sales Description */}
                    <PremiumTextarea
                      label="Sales Description"
                      value={formData.salesDescription}
                      onChange={handleInputChange("salesDescription")}
                      placeholder="Description that appears on invoices..."
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Purchase Information */}
            <div className="p-6 sm:p-8">
              <SectionHeader
                icon={ShoppingCartIcon}
                title="Purchase Information"
                subtitle="Pricing and account details for purchases"
                color="amber"
              />

              <div className="space-y-5">
                {/* Purchasable Toggle */}
                <ToggleSwitch
                  label="Purchasable Item"
                  description="Enable if this item can be purchased"
                  checked={formData.purchasable}
                  onChange={handleCheckboxChange("purchasable")}
                  color="emerald"
                />

                {formData.purchasable && (
                  <div className="space-y-5 animate-in slide-in-from-top">
                    {/* Cost Price */}
                    <FloatingInput
                      id="costPrice"
                      label="Cost Price"
                      type="number"
                      value={formData.costPrice}
                      onChange={handleInputChange("costPrice")}
                      icon={CurrencyRupeeIcon}
                      prefix="₹"
                    />

                    {/* Purchase Account */}
                    <PremiumSelect
                      label="Purchase Account"
                      groupOptions={ACCOUNT_OPTIONS}
                      value={formData.purchaseAccount}
                      onChange={handleInputChange("purchaseAccount")}
                      required
                      placeholder="Select purchase account"
                    />

                    {/* Purchase Description */}
                    <PremiumTextarea
                      label="Purchase Description"
                      value={formData.purchaseDescription}
                      onChange={handleInputChange("purchaseDescription")}
                      placeholder="Description that appears on purchase orders..."
                      rows={3}
                    />

                    {/* Preferred Vendor */}
                    <FloatingInput
                      id="preferredVendor"
                      label="Preferred Vendor"
                      type="text"
                      value={formData.preferredVendor}
                      onChange={handleInputChange("preferredVendor")}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 sm:p-8 bg-gray-50/50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                <span className="text-red-500">*</span> Required fields
              </p>
              <div className="flex items-center gap-3">
                <Link
                  to="/items"
                  className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-300"
                >
                  Cancel
                </Link>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || success}
                  className={`px-8 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${
                    success
                      ? "bg-emerald-500 text-white"
                      : "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      Created!
                    </>
                  ) : (
                    "Save Item"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewItemPage;

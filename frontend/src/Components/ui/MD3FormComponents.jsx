import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

/**
 * Material Design 3 Form Components
 * Reusable form elements with Google Store aesthetic
 */

// MD3 Input Field
export const MD3Input = ({
  label,
  required = false,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  className = "",
}) => (
  <div className={className}>
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
      placeholder={placeholder}
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

// MD3 Select Field
export const MD3Select = ({
  label,
  required = false,
  name,
  value,
  onChange,
  children,
  hint,
  className = "",
}) => (
  <div className={className}>
    <label
      className="block text-sm font-medium mb-2"
      style={{ color: required ? "#d93025" : "#202124" }}
    >
      {label}
      {required && "*"}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 text-sm transition-all duration-200 cursor-pointer appearance-none focus:outline-none"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #dadce0",
          borderRadius: "8px",
          color: "#202124",
        }}
      >
        {children}
      </select>
      <ChevronDownIcon
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
        style={{ color: "#5f6368" }}
      />
    </div>
    {hint && (
      <p className="text-xs mt-1.5" style={{ color: "#5f6368" }}>
        {hint}
      </p>
    )}
  </div>
);

// MD3 Textarea
export const MD3Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  className = "",
}) => (
  <div className={className}>
    <label
      className="block text-sm font-medium mb-2"
      style={{ color: "#202124" }}
    >
      {label}
    </label>
    <textarea
      name={name}
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 text-sm transition-all duration-200 resize-none focus:outline-none"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #dadce0",
        borderRadius: "8px",
        color: "#202124",
      }}
    />
  </div>
);

// MD3 Primary Button
export const MD3Button = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
}) => {
  const styles = {
    primary: {
      backgroundColor: "#1a73e8",
      color: "#ffffff",
      border: "none",
    },
    secondary: {
      backgroundColor: "#ffffff",
      color: "#5f6368",
      border: "1px solid #dadce0",
    },
    tonal: {
      backgroundColor: "#e8f0fe",
      color: "#1a73e8",
      border: "none",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "#1a73e8",
      border: "none",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`py-3 px-6 text-sm font-medium transition-all duration-200 disabled:opacity-50 ${className}`}
      style={{
        ...styles[variant],
        borderRadius: "9999px",
      }}
    >
      {children}
    </button>
  );
};

// MD3 Card Container
export const MD3Card = ({
  children,
  className = "",
  padding = "p-6 sm:p-8",
}) => (
  <div
    className={`${padding} ${className}`}
    style={{
      backgroundColor: "#ffffff",
      borderRadius: "24px",
      boxShadow:
        "0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)",
    }}
  >
    {children}
  </div>
);

// MD3 Table Input (for inline table editing)
export const MD3TableInput = ({
  type = "text",
  value,
  onChange,
  placeholder,
  textAlign = "left",
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-3 py-2 text-sm focus:outline-none text-${textAlign}`}
    style={{
      backgroundColor: "#f8f9fa",
      border: "none",
      borderRadius: "6px",
      color: "#202124",
    }}
  />
);

// MD3 Divider
export const MD3Divider = ({ className = "my-6" }) => (
  <div
    className={className}
    style={{ height: "1px", backgroundColor: "#e8eaed" }}
  />
);

// MD3 Page Header
export const MD3PageHeader = ({
  title,
  icon: Icon,
  backLink,
  closeLink,
  className = "",
}) => (
  <div className={`flex justify-between items-center mb-8 ${className}`}>
    <div className="flex items-center gap-4">
      {backLink && (
        <a
          href={backLink}
          className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100"
          style={{ color: "#5f6368" }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </a>
      )}
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#e8f0fe" }}
          >
            <Icon className="w-5 h-5" style={{ color: "#1a73e8" }} />
          </div>
        )}
        <h1 className="text-2xl font-normal" style={{ color: "#202124" }}>
          {title}
        </h1>
      </div>
    </div>
    {closeLink && (
      <a
        href={closeLink}
        className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100"
        style={{ color: "#5f6368" }}
      >
        <svg
          className="w-5 h-5"
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
      </a>
    )}
  </div>
);

// MD3 Total Box
export const MD3TotalBox = ({
  subTotal,
  taxType,
  setTaxType,
  taxRate,
  setTaxRate,
  taxOptions,
  adjustment,
  setAdjustment,
  total,
  currency = "₹",
}) => (
  <div
    className="w-full md:w-1/2 ml-auto p-6 space-y-4"
    style={{
      backgroundColor: "#f8f9fa",
      borderRadius: "20px",
    }}
  >
    <div
      className="flex justify-between text-sm font-medium"
      style={{ color: "#5f6368" }}
    >
      <span>Sub Total</span>
      <span>
        {currency}
        {Number(subTotal).toFixed(2)}
      </span>
    </div>

    {/* Tax Section */}
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="taxType"
            value="TDS"
            checked={taxType === "TDS"}
            onChange={(e) => setTaxType(e.target.value)}
            className="w-4 h-4"
            style={{ accentColor: "#1a73e8" }}
          />
          <span style={{ color: "#202124" }}>TDS</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="taxType"
            value="TCS"
            checked={taxType === "TCS"}
            onChange={(e) => setTaxType(e.target.value)}
            className="w-4 h-4"
            style={{ accentColor: "#1a73e8" }}
          />
          <span style={{ color: "#202124" }}>TCS</span>
        </label>

        <select
          value={taxRate}
          onChange={(e) => setTaxRate(parseFloat(e.target.value))}
          className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none"
          style={{ borderColor: "#dadce0" }}
        >
          <option value="0">Select a Tax</option>
          {taxOptions?.map((opt) => (
            <option key={opt.label} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="w-20 text-right" style={{ color: "#d93025" }}>
          - {currency}
          {((subTotal * taxRate) / 100).toFixed(2)}
        </span>
      </div>
    </div>

    {/* Adjustment Section */}
    <div className="flex items-center gap-4 text-sm">
      <span className="flex-1" style={{ color: "#202124" }}>
        Adjustment
      </span>
      <input
        type="number"
        value={adjustment}
        onChange={(e) => setAdjustment(parseFloat(e.target.value) || 0)}
        className="w-32 px-3 py-2 text-right bg-white border border-gray-300 rounded-lg focus:outline-none"
        style={{ borderColor: "#dadce0" }}
        placeholder="0.00"
      />
      <span className="w-20 text-right" style={{ color: "#202124" }}>
        {currency}
        {Number(adjustment || 0).toFixed(2)}
      </span>
    </div>

    <MD3Divider className="my-2" />

    <div
      className="flex justify-between text-lg font-semibold"
      style={{ color: "#202124" }}
    >
      <span>Total ({currency})</span>
      <span>
        {currency}
        {Number(total).toFixed(2)}
      </span>
    </div>
  </div>
);

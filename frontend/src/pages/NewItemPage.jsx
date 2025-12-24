import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  CubeIcon,
  WrenchScrewdriverIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { UNIT_OPTIONS, ACCOUNT_OPTIONS } from "../data/constants";
import { createItem, getItemById, updateItem } from "../services/itemsService";

/**
 * NewItemPage - Material Design 3 (Google Store Aesthetic)
 */
const NewItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
  });

  React.useEffect(() => {
    if (isEditMode) {
      fetchItemData();
    }
  }, [id]);

  const fetchItemData = async () => {
    try {
      setIsLoading(true);
      const data = await getItemById(id);
      setFormData({
        name: data.name || "",
        type: data.type || "GOODS",
        unit: data.unit || "KGS",
        sellable: data.sellable !== false,
        sellingPrice: data.sellingPrice?.toString() || "",
        salesAccount: data.salesAccount || "Sales",
        salesDescription: data.salesDescription || "",
        purchasable: data.purchasable !== false,
        costPrice: data.costPrice?.toString() || "",
        purchaseAccount: data.purchaseAccount || "Cost of Goods Sold",
        purchaseDescription: data.purchaseDescription || "",
      });
    } catch (err) {
      setError("Failed to load item data. It may have been deleted.");
    } finally {
      setIsLoading(false);
    }
  };

  const [errors, setErrors] = useState({});

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleCheckboxChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.checked }));
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
    if (!validateForm()) return;

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
      };

      if (isEditMode) {
        await updateItem(id, itemData);
      } else {
        await createItem(itemData);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate("/items", {
          state: {
            message: `Item ${isEditMode ? "updated" : "created"} successfully!`,
          },
        });
      }, 1500);
    } catch (err) {
      setError(
        err.message ||
          `Failed to ${
            isEditMode ? "update" : "create"
          } item. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="p-6 sm:p-8"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/items"
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
              <CubeIcon className="w-5 h-5" style={{ color: "#1a73e8" }} />
            </div>
            <h1
              className="text-xl sm:text-2xl font-normal"
              style={{ color: "#202124" }}
            >
              {isEditMode ? "Edit Item" : "New Item"}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/items"
            className="flex-1 sm:flex-initial text-center py-3 px-6 text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: "#ffffff",
              color: "#5f6368",
              border: "1px solid #dadce0",
              borderRadius: "9999px",
            }}
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || success || isLoading}
            className="flex-1 sm:flex-initial py-3 px-6 text-sm font-medium text-white transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              backgroundColor: success ? "#1e8e3e" : "#1a73e8",
              borderRadius: "9999px",
            }}
          >
            {isSubmitting ? (
              "Saving..."
            ) : success ? (
              <>
                <CheckCircleIcon className="w-4 h-4" />
                {isEditMode ? "Updated!" : "Created!"}
              </>
            ) : isEditMode ? (
              "Update Item"
            ) : (
              "Save Item"
            )}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div
            className="animate-spin rounded-full h-8 w-8 border-2"
            style={{ borderColor: "#e8eaed", borderTopColor: "#1a73e8" }}
          />
        </div>
      )}

      {!isLoading && (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            boxShadow:
              "0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)",
            overflow: "hidden",
          }}
        >
          {/* Item Type Section */}
          <div
            className="p-6 sm:p-8"
            style={{ borderBottom: "1px solid #e8eaed" }}
          >
            <h3
              className="text-lg font-medium mb-4"
              style={{ color: "#202124" }}
            >
              Item Type
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  value: "GOODS",
                  label: "Goods",
                  description: "Physical products with inventory",
                  icon: CubeIcon,
                },
                {
                  value: "SERVICE",
                  label: "Service",
                  description: "Services and intangible offerings",
                  icon: WrenchScrewdriverIcon,
                },
              ].map((type) => {
                const Icon = type.icon;
                const isSelected = formData.type === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, type: type.value }))
                    }
                    className="flex items-start gap-4 p-5 text-left transition-all duration-200"
                    style={{
                      backgroundColor: isSelected ? "#e8f0fe" : "#ffffff",
                      border: `2px solid ${isSelected ? "#1a73e8" : "#dadce0"}`,
                      borderRadius: "16px",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: isSelected ? "#1a73e8" : "#f1f3f4",
                      }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: isSelected ? "#ffffff" : "#5f6368" }}
                      />
                    </div>
                    <div>
                      <p
                        className="font-medium"
                        style={{ color: isSelected ? "#1a73e8" : "#202124" }}
                      >
                        {type.label}
                      </p>
                      <p
                        className="text-sm mt-0.5"
                        style={{ color: "#5f6368" }}
                      >
                        {type.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Basic Information */}
          <div
            className="p-6 sm:p-8"
            style={{ borderBottom: "1px solid #e8eaed" }}
          >
            <h3
              className="text-lg font-medium mb-4"
              style={{ color: "#202124" }}
            >
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
              <FormInput
                label="Item Name"
                required
                value={formData.name}
                onChange={handleInputChange("name")}
                error={errors.name}
                placeholder="Enter item name"
              />
              <FormSelect
                label="Unit of Measurement"
                value={formData.unit}
                onChange={handleInputChange("unit")}
                options={UNIT_OPTIONS}
              />
            </div>
          </div>

          {/* Sales & Purchase Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Sales Information */}
            <div
              className="p-6 sm:p-8"
              style={{
                borderRight: "1px solid #e8eaed",
                borderBottom: "1px solid #e8eaed",
              }}
            >
              <h3
                className="text-lg font-medium mb-4"
                style={{ color: "#202124" }}
              >
                Sales Information
              </h3>
              <div className="space-y-5">
                <Toggle
                  label="Sellable Item"
                  description="Enable if this item can be sold"
                  checked={formData.sellable}
                  onChange={handleCheckboxChange("sellable")}
                />
                {formData.sellable && (
                  <div className="space-y-5">
                    <FormInput
                      label="Selling Price"
                      type="number"
                      value={formData.sellingPrice}
                      onChange={handleInputChange("sellingPrice")}
                      placeholder="0.00"
                      prefix="₹"
                    />
                    <FormSelect
                      label="Sales Account"
                      value={formData.salesAccount}
                      onChange={handleInputChange("salesAccount")}
                      groupOptions={ACCOUNT_OPTIONS}
                    />
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#202124" }}
                      >
                        Sales Description
                      </label>
                      <textarea
                        rows="3"
                        value={formData.salesDescription}
                        onChange={handleInputChange("salesDescription")}
                        placeholder="Description for invoices..."
                        className="w-full px-4 py-3 text-sm resize-none focus:outline-none"
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #dadce0",
                          borderRadius: "8px",
                          color: "#202124",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Purchase Information */}
            <div
              className="p-6 sm:p-8"
              style={{ borderBottom: "1px solid #e8eaed" }}
            >
              <h3
                className="text-lg font-medium mb-4"
                style={{ color: "#202124" }}
              >
                Purchase Information
              </h3>
              <div className="space-y-5">
                <Toggle
                  label="Purchasable Item"
                  description="Enable if this item can be purchased"
                  checked={formData.purchasable}
                  onChange={handleCheckboxChange("purchasable")}
                />
                {formData.purchasable && (
                  <div className="space-y-5">
                    <FormInput
                      label="Cost Price"
                      type="number"
                      value={formData.costPrice}
                      onChange={handleInputChange("costPrice")}
                      placeholder="0.00"
                      prefix="₹"
                    />
                    <FormSelect
                      label="Purchase Account"
                      value={formData.purchaseAccount}
                      onChange={handleInputChange("purchaseAccount")}
                      groupOptions={ACCOUNT_OPTIONS}
                    />
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#202124" }}
                      >
                        Purchase Description
                      </label>
                      <textarea
                        rows="3"
                        value={formData.purchaseDescription}
                        onChange={handleInputChange("purchaseDescription")}
                        placeholder="Description for purchase orders..."
                        className="w-full px-4 py-3 text-sm resize-none focus:outline-none"
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #dadce0",
                          borderRadius: "8px",
                          color: "#202124",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="p-6 sm:p-8 flex justify-between items-center"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <p className="text-sm" style={{ color: "#5f6368" }}>
              <span style={{ color: "#d93025" }}>*</span> Required fields
            </p>
            <div className="flex gap-3">
              <Link
                to="/items"
                className="py-3 px-6 text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#5f6368",
                  border: "1px solid #dadce0",
                  borderRadius: "9999px",
                }}
              >
                Cancel
              </Link>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || success}
                className="py-3 px-6 text-sm font-medium text-white transition-all duration-200 disabled:opacity-50"
                style={{ backgroundColor: "#1a73e8", borderRadius: "9999px" }}
              >
                {isSubmitting ? "Saving..." : "Save Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Form Input Component
const FormInput = ({
  label,
  required,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  prefix,
}) => (
  <div>
    <label
      className="block text-sm font-medium mb-2"
      style={{ color: required ? "#d93025" : "#202124" }}
    >
      {label}
      {required && "*"}
    </label>
    <div className="relative">
      {prefix && (
        <span
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sm"
          style={{ color: "#5f6368" }}
        >
          {prefix}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 text-sm transition-all duration-200 focus:outline-none ${
          prefix ? "pl-8" : ""
        }`}
        style={{
          backgroundColor: "#ffffff",
          border: `1px solid ${error ? "#d93025" : "#dadce0"}`,
          borderRadius: "8px",
          color: "#202124",
        }}
      />
    </div>
    {error && (
      <p className="text-xs mt-1.5" style={{ color: "#d93025" }}>
        {error}
      </p>
    )}
  </div>
);

// Form Select Component
const FormSelect = ({ label, value, onChange, options, groupOptions }) => (
  <div>
    <label
      className="block text-sm font-medium mb-2"
      style={{ color: "#202124" }}
    >
      {label}
    </label>
    <select
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
      {groupOptions
        ? groupOptions.map((group, idx) => (
            <optgroup key={idx} label={group.group}>
              {group.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </optgroup>
          ))
        : options?.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name}
            </option>
          ))}
    </select>
  </div>
);

// Toggle Component
const Toggle = ({ label, description, checked, onChange }) => (
  <div
    className="flex items-center justify-between p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50"
    style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" }}
    onClick={() => onChange({ target: { checked: !checked } })}
  >
    <div>
      <p className="text-sm font-medium" style={{ color: "#202124" }}>
        {label}
      </p>
      {description && (
        <p className="text-xs mt-0.5" style={{ color: "#5f6368" }}>
          {description}
        </p>
      )}
    </div>
    <div
      className="w-12 h-7 rounded-full transition-colors duration-200 relative"
      style={{ backgroundColor: checked ? "#1a73e8" : "#dadce0" }}
    >
      <div
        className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200"
        style={{
          transform: checked ? "translateX(22px)" : "translateX(2px)",
        }}
      />
    </div>
  </div>
);

export default NewItemPage;

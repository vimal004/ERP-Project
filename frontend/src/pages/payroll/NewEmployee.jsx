import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

const SearchableDropdown = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  title,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Label with red asterisk
  const labelContent = (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label.endsWith("*") ? (
        <>
          {label.slice(0, -1)}
          <span className="text-red-500">*</span>
        </>
      ) : (
        label
      )}
    </label>
  );

  if (isCustomMode) {
    return (
      <div className="relative">
        {labelContent}
        <div className="relative flex items-center">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter new ${title}`}
            className="w-full px-3 py-2 border border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 pr-8"
            autoFocus
          />
          <button
            onClick={() => {
              setIsCustomMode(false);
              onChange("");
            }}
            className="absolute right-2 p-1 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {labelContent}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer bg-white flex justify-between items-center hover:border-gray-400 text-sm"
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value || placeholder || "Select"}
        </span>
        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-600 ${value === option ? "bg-blue-50 text-blue-600" : "text-gray-700"}`}
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500 text-center">
                No options found
              </div>
            )}
          </div>

          <div
            onClick={() => {
              setIsCustomMode(true);
              setIsOpen(false);
              setSearchTerm("");
              onChange("");
            }}
            className="p-2 border-t border-gray-100 cursor-pointer hover:bg-gray-50 flex items-center gap-2 text-blue-600 text-sm font-medium"
          >
            <PlusIcon className="w-4 h-4" />
            New {title}
          </div>
        </div>
      )}
    </div>
  );
};

const NewEmployee = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const steps = [
    { id: 1, name: "Basic Details" },
    { id: 2, name: "Salary Details" },
    { id: 3, name: "Personal Details" },
    { id: 4, name: "Payment Information" },
  ];

  // Predefined Lists
  const initialDesignations = [
    "Managing Director",
    "Customer Support Manager",
    "Marketing / Technical Manager",
    "Operation Manager",
    "Sr.Engineer - Production",
    "Software Engineer",
    "Accountant",
  ];

  const initialDepartments = [
    "Finance",
    "Admin",
    "ADMIN ASSOCIATE",
    "OPERATION MANAGER",
    "Software Development",
    "Production",
    "Sales",
    "Marketing",
    "HR",
    "Engineering",
  ];

  const [formData, setFormData] = useState({
    // Step 1: Basic
    firstName: "",
    middleName: "",
    lastName: "",
    employeeId: "",
    dateOfJoining: "",
    workEmail: "",
    mobileNumber: "",
    gender: "", // Enum: MALE, FEMALE, OTHER
    workLocation: "",
    designation: "",
    department: "",
    isDirector: false,
    portalAccessEnabled: false,

    // Step 2: Salary
    annualCtc: "",
    basicSalary: "",
    hra: "",
    specialAllowances: "",

    // Step 3: Personal
    dateOfBirth: "",
    fatherName: "",
    personalEmail: "",
    presentAddress: "",
    permanentAddress: "",

    // Step 4: Payment
    paymentMode: "BANK_TRANSFER", // Enum
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    panNumber: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCustomChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep = (step) => {
    let isValid = true;
    let errorMessage = "";

    if (step === 1) {
      if (!formData.firstName) {
        isValid = false;
        errorMessage = "First Name is required.";
      } else if (!formData.lastName) {
        isValid = false;
        errorMessage = "Last Name is required.";
      } else if (!formData.employeeId) {
        isValid = false;
        errorMessage = "Employee ID is required.";
      } else if (!formData.dateOfJoining) {
        isValid = false;
        errorMessage = "Date of Joining is required.";
      } else if (!formData.workEmail) {
        isValid = false;
        errorMessage = "Work Email is required.";
      } else if (!formData.designation) {
        isValid = false;
        errorMessage = "Designation is required.";
      } else if (!formData.department) {
        isValid = false;
        errorMessage = "Department is required.";
      }
    }

    if (!isValid) {
      setError(errorMessage);
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < 4) {
      setCurrentStep((curr) => curr + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((curr) => curr - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    // Sanitize data: Convert empty strings to null for numeric/date/enum fields
    const payload = {
      ...formData,
      annualCtc: formData.annualCtc === "" ? null : formData.annualCtc,
      basicSalary: formData.basicSalary === "" ? null : formData.basicSalary,
      hra: formData.hra === "" ? null : formData.hra,
      specialAllowances:
        formData.specialAllowances === "" ? null : formData.specialAllowances,
      dateOfBirth: formData.dateOfBirth === "" ? null : formData.dateOfBirth,
      gender: formData.gender === "" ? null : formData.gender,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/employees",
        payload,
      );
      if (response.status === 200) {
        navigate("/payroll/employees");
      }
    } catch (err) {
      console.error("Error creating employee:", err);
      setError(
        "Failed to create employee. Please check the data and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Middle Name
                </label>
                <input
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Joining <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Email <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="workEmail"
                  value={formData.workEmail}
                  onChange={handleChange}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  autoComplete="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="director"
                  name="isDirector"
                  checked={formData.isDirector}
                  onChange={handleChange}
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="director" className="font-medium text-gray-700">
                  Director / Person with substantial interest
                </label>
                <p className="text-gray-500">
                  Check this box if the employee is a director or holds
                  substantial interest in the company.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Location <span className="text-red-500">*</span>
                </label>
                <input
                  name="workLocation"
                  value={formData.workLocation}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Head Office"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                />
              </div>

              {/* Searchable Designation */}
              <div>
                <SearchableDropdown
                  label="Designation *"
                  title="Designation"
                  options={initialDesignations}
                  value={formData.designation}
                  onChange={(val) => handleCustomChange("designation", val)}
                  placeholder="Select Designation"
                />
              </div>

              {/* Searchable Department */}
              <div>
                <SearchableDropdown
                  label="Department *"
                  title="Department"
                  options={initialDepartments}
                  value={formData.department}
                  onChange={(val) => handleCustomChange("department", val)}
                  placeholder="Select Department"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="portal"
                    name="portalAccessEnabled"
                    checked={formData.portalAccessEnabled}
                    onChange={handleChange}
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="portal" className="font-medium text-gray-700">
                    Enable Portal Access
                  </label>
                  <p className="text-gray-500">
                    The employee will be able to view payslips and submit claims
                    through the portal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Salary Information
            </h3>

            <div className="bg-blue-50 p-4 rounded-md mb-6 border border-blue-100">
              <div className="flex justify-between items-center text-sm text-blue-800">
                <span>
                  Salary Template: <strong>KSK TECHNOLOGY</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual CTC <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-gray-300 rounded-md bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="text-gray-500 mr-2">₹</span>
                  <input
                    name="annualCtc"
                    value={formData.annualCtc}
                    onChange={(e) => {
                      const ctc = parseFloat(e.target.value) || 0;
                      const basic = ctc * 0.5;
                      const fixed = ctc - basic;
                      setFormData((prev) => ({
                        ...prev,
                        annualCtc: e.target.value,
                        basicSalary: basic,
                        specialAllowances: fixed,
                        hra: 0, // Defaulting HRA to 0 as per template
                      }));
                    }}
                    type="number"
                    placeholder="Enter full Annual CTC"
                    className="flex-1 outline-none w-full"
                  />
                  <span className="text-xs text-gray-400 ml-2">per year</span>
                </div>
              </div>

              {formData.annualCtc > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 grid grid-cols-12 text-xs font-semibold text-gray-500 uppercase">
                    <div className="col-span-6">Component</div>
                    <div className="col-span-3 text-right">Monthly</div>
                    <div className="col-span-3 text-right">Annual</div>
                  </div>
                  <div className="p-4 space-y-3">
                    {/* Basic */}
                    <div className="grid grid-cols-12 text-sm">
                      <div className="col-span-6">
                        <div className="font-medium text-gray-700">Basic</div>
                        <div className="text-xs text-gray-500">50% of CTC</div>
                      </div>
                      <div className="col-span-3 text-right text-gray-900">
                        ₹{(formData.basicSalary / 12).toFixed(2)}
                      </div>
                      <div className="col-span-3 text-right text-gray-900">
                        ₹{formData.basicSalary}
                      </div>
                    </div>

                    {/* Fixed Allowance */}
                    <div className="grid grid-cols-12 text-sm">
                      <div className="col-span-6">
                        <div className="font-medium text-gray-700">
                          Fixed Allowance
                        </div>
                        <div className="text-xs text-gray-500">
                          Balancing Figure
                        </div>
                      </div>
                      <div className="col-span-3 text-right text-gray-900">
                        ₹{(formData.specialAllowances / 12).toFixed(2)}
                      </div>
                      <div className="col-span-3 text-right text-gray-900">
                        ₹{formData.specialAllowances}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 mt-3 pt-3 grid grid-cols-12 text-sm font-bold">
                      <div className="col-span-6 text-gray-900">Total CTC</div>
                      <div className="col-span-3 text-right text-green-600">
                        ₹{(formData.annualCtc / 12).toFixed(2)}
                      </div>
                      <div className="col-span-3 text-right text-green-600">
                        ₹{formData.annualCtc}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Father's Name
                </label>
                <input
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Email
                </label>
                <input
                  name="personalEmail"
                  value={formData.personalEmail}
                  onChange={handleChange}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Present Address
              </label>
              <textarea
                name="presentAddress"
                value={formData.presentAddress}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Permanent Address
              </label>
              <textarea
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Mode
                </label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                >
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PAN Number
                </label>
                <input
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                />
              </div>
            </div>

            {formData.paymentMode === "BANK_TRANSFER" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IFSC Code
                  </label>
                  <input
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full bg-[#f8f9fa]">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/payroll/employees")}
          className="flex items-center text-sm font-medium text-[#1a73e8] hover:opacity-80 mb-4 transition-all"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back to Employees
        </button>
        <h1 className="text-3xl font-normal text-gray-900">Add Employee</h1>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex-1">
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium z-10 transition-all duration-300
                                    ${
                                      currentStep > step.id
                                        ? "bg-[#1e8e3e] text-white shadow-md"
                                        : currentStep === step.id
                                          ? "bg-[#1a73e8] text-white shadow-lg"
                                          : "bg-gray-200 text-gray-600"
                                    }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    step.id
                  )}
                </div>
                <div
                  className={`text-xs mt-3 font-medium tracking-wide uppercase transition-colors duration-300 ${currentStep === step.id ? "text-[#1a73e8]" : "text-gray-500"}`}
                >
                  {step.name}
                </div>

                {/* Connector Line */}
                {index !== steps.length - 1 && (
                  <div className="absolute top-5 left-1/2 w-full h-[2px] -z-0 px-10">
                    <div
                      className={`h-full transition-all duration-500 ${currentStep > step.id ? "bg-[#1e8e3e]" : "bg-gray-200"}`}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div
        className="bg-white rounded-[24px] shadow-sm border border-gray-200 overflow-hidden"
        style={{
          boxShadow:
            "0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)",
        }}
      >
        <div className="p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-[#d93025] rounded-xl text-sm border border-red-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold font-sans">
                !
              </span>
              {error}
            </div>
          )}

          {renderStepContent()}
        </div>

        {/* Footer Controls */}
        <div className="px-8 py-5 bg-white border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={() =>
              currentStep === 1 ? navigate("/payroll/employees") : handleBack()
            }
            className="px-6 py-2 bg-transparent text-gray-600 rounded-full hover:bg-gray-100 font-medium transition-all"
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </button>
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="px-8 py-2 bg-[#1a73e8] text-white rounded-full hover:bg-blue-700 font-medium shadow-md hover:shadow-lg transition-all flex items-center disabled:opacity-50"
          >
            {isLoading
              ? "Saving..."
              : currentStep === 4
                ? "Save & Submit"
                : "Save & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewEmployee;

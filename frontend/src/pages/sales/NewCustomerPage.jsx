import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlusIcon, ArrowUpTrayIcon, TrashIcon, EllipsisVerticalIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const NewCustomerPage = () => {
    const [activeTab, setActiveTab] = useState('other');
    const [formData, setFormData] = useState({
        customerType: 'business',
        salutation: 'Mr.',
        firstName: '',
        lastName: '',
        companyName: '',
        displayName: '',
        email: '',
        workPhone: '',
        mobilePhone: '',
        language: 'English',
        pan: '',
        currency: 'INR',
        openingBalance: '',
        paymentTerms: 'Due on Receipt',
        enablePortal: false,
        billingAttention: '',
        billingCountry: '',
        billingAddress1: '',
        billingAddress2: '',
        billingCity: '',
        billingState: '',
        billingPinCode: '',
        billingPhone: '',
        billingFax: '',
        shippingAttention: '',
        shippingCountry: '',
        shippingAddress1: '',
        shippingAddress2: '',
        shippingCity: '',
        shippingState: '',
        shippingPinCode: '',
        shippingPhone: '',
        shippingFax: '',
        contactPersons: [
            { salutation: 'Mr.', firstName: '', lastName: '', email: '', workPhone: '', mobile: '' }
        ]
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleContactPersonChange = (index, field, value) => {
        const updatedContactPersons = [...formData.contactPersons];
        updatedContactPersons[index][field] = value;
        setFormData(prev => ({
            ...prev,
            contactPersons: updatedContactPersons
        }));
    };

    const addContactPerson = () => {
        setFormData(prev => ({
            ...prev,
            contactPersons: [
                ...prev.contactPersons,
                { salutation: 'Mr.', firstName: '', lastName: '', email: '', workPhone: '', mobile: '' }
            ]
        }));
    };

    const removeContactPerson = (index) => {
        if (formData.contactPersons.length > 1) {
            setFormData(prev => ({
                ...prev,
                contactPersons: prev.contactPersons.filter((_, i) => i !== index)
            }));
        }
    };

    const copyBillingAddress = () => {
        setFormData(prev => ({
            ...prev,
            shippingAttention: prev.billingAttention,
            shippingCountry: prev.billingCountry,
            shippingAddress1: prev.billingAddress1,
            shippingAddress2: prev.billingAddress2,
            shippingCity: prev.billingCity,
            shippingState: prev.billingState,
            shippingPinCode: prev.billingPinCode,
            shippingPhone: prev.billingPhone,
            shippingFax: prev.billingFax
        }));
    };

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <UserPlusIcon className="w-8 h-8 text-blue-600" />
                    <span>New Customer</span>
                </h1>
                <div className="flex space-x-3">
                    <Link
                        to="/sales/customers"
                        className="py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm"
                    >
                        Cancel
                    </Link>
                    <button className="py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Save Customer
                    </button>
                </div>
            </div>

            {/* Main Form Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 sm:p-8 space-y-6">

                    {/* Customer Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <label className="sm:col-span-3 text-sm font-medium text-gray-700">Customer Type</label>
                        <div className="sm:col-span-9 flex items-center space-x-6">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="customerType"
                                    value="business"
                                    checked={formData.customerType === 'business'}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-900">Business</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="customerType"
                                    value="individual"
                                    checked={formData.customerType === 'individual'}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-900">Individual</span>
                            </label>
                        </div>
                    </div>

                    {/* Primary Contact */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                        <label className="sm:col-span-3 text-sm font-medium text-gray-700 pt-2">
                            Primary Contact <span className="text-red-500">*</span>
                        </label>
                        <div className="sm:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <select
                                name="salutation"
                                value={formData.salutation}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            >
                                <option>Mr.</option>
                                <option>Mrs.</option>
                                <option>Ms.</option>
                                <option>Dr.</option>
                            </select>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            />
                        </div>
                    </div>

                    {/* Company Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <label className="sm:col-span-3 text-sm font-medium text-gray-700">Company Name</label>
                        <div className="sm:col-span-9">
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            />
                        </div>
                    </div>

                    {/* Display Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <label className="sm:col-span-3 text-sm font-medium text-red-500">Display Name *</label>
                        <div className="sm:col-span-9">
                            <input
                                type="text"
                                name="displayName"
                                placeholder="Select or type to add"
                                value={formData.displayName}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            />
                        </div>
                    </div>

                    {/* Email Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <label className="sm:col-span-3 text-sm font-medium text-gray-700">Email Address</label>
                        <div className="sm:col-span-9">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <label className="sm:col-span-3 text-sm font-medium text-gray-700">Phone</label>
                        <div className="sm:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                                type="text"
                                name="workPhone"
                                placeholder="Work Phone"
                                value={formData.workPhone}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            />
                            <input
                                type="text"
                                name="mobilePhone"
                                placeholder="Mobile"
                                value={formData.mobilePhone}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            />
                        </div>
                    </div>

                    {/* Customer Language */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <label className="sm:col-span-3 text-sm font-medium text-gray-700">Customer Language</label>
                        <div className="sm:col-span-9">
                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                className="block w-full sm:w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            >
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                                <option>German</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="border-b border-gray-200 mt-4 px-6 sm:px-8">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                        {['Other Details', 'Address', 'Contact Persons', 'Custom Fields', 'Reporting Tags', 'Remarks'].map((tab) => {
                            const tabKey = tab.toLowerCase().replace(' ', '');
                            const isActive = activeTab === (tabKey === 'otherdetails' ? 'other' : tabKey);
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tabKey === 'otherdetails' ? 'other' : tabKey)}
                                    className={`
                                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150
                                        ${isActive
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                    `}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6 sm:p-8 min-h-[400px]">
                    {activeTab === 'other' && (
                        <div className="space-y-6 max-w-3xl">
                            {/* PAN */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                                <label className="sm:col-span-4 text-sm font-medium text-gray-700">PAN</label>
                                <div className="sm:col-span-8">
                                    <input
                                        type="text"
                                        name="pan"
                                        value={formData.pan}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                    />
                                </div>
                            </div>

                            {/* Currency */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                                <label className="sm:col-span-4 text-sm font-medium text-gray-700">Currency</label>
                                <div className="sm:col-span-8">
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                    >
                                        <option value="INR">INR - Indian Rupee</option>
                                        <option value="USD">USD - US Dollar</option>
                                        <option value="EUR">EUR - Euro</option>
                                    </select>
                                </div>
                            </div>

                            {/* Accounts Receivable */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                                <label className="sm:col-span-4 text-sm font-medium text-gray-700">Accounts Receivable</label>
                                <div className="sm:col-span-8">
                                    <select
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 text-gray-500"
                                    >
                                        <option>Select an account</option>
                                    </select>
                                </div>
                            </div>

                            {/* Opening Balance */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                                <label className="sm:col-span-4 text-sm font-medium text-gray-700">Opening Balance</label>
                                <div className="sm:col-span-8 flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                        {formData.currency}
                                    </span>
                                    <input
                                        type="number"
                                        name="openingBalance"
                                        value={formData.openingBalance}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-none rounded-r-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                    />
                                </div>
                            </div>

                            {/* Payment Terms */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                                <label className="sm:col-span-4 text-sm font-medium text-gray-700">Payment Terms</label>
                                <div className="sm:col-span-8">
                                    <select
                                        name="paymentTerms"
                                        value={formData.paymentTerms}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                    >
                                        <option>Due on Receipt</option>
                                        <option>Net 15</option>
                                        <option>Net 30</option>
                                        <option>Net 60</option>
                                    </select>
                                </div>
                            </div>

                            {/* Enable Portal */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                                <label className="sm:col-span-4 text-sm font-medium text-gray-700">Enable Portal?</label>
                                <div className="sm:col-span-8">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="enablePortal"
                                            checked={formData.enablePortal}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-sm text-gray-900">Allow portal access for this customer</span>
                                    </label>
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start pt-4">
                                <label className="sm:col-span-4 text-sm font-medium text-gray-700">Documents</label>
                                <div className="sm:col-span-8">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition cursor-pointer">
                                        <ArrowUpTrayIcon className="w-8 h-8 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600 font-medium">Upload File</p>
                                        <p className="text-xs text-gray-400 mt-1">Maximum 10 files, 10MB each</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'address' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                            {/* Billing Address */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Billing Address</h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">Attention</label>
                                        <input
                                            type="text"
                                            name="billingAttention"
                                            value={formData.billingAttention}
                                            onChange={handleInputChange}
                                            className="sm:col-span-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">Country/Region</label>
                                        <select
                                            name="billingCountry"
                                            value={formData.billingCountry}
                                            onChange={handleInputChange}
                                            className="sm:col-span-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                        >
                                            <option value="">Select</option>
                                            <option value="India">India</option>
                                            <option value="USA">USA</option>
                                            <option value="UK">UK</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                                        <label className="text-sm font-medium text-gray-700 pt-2">Address</label>
                                        <div className="sm:col-span-2 space-y-2">
                                            <textarea
                                                name="billingAddress1"
                                                placeholder="Street 1"
                                                rows="2"
                                                value={formData.billingAddress1}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                            <textarea
                                                name="billingAddress2"
                                                placeholder="Street 2"
                                                rows="2"
                                                value={formData.billingAddress2}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">City</label>
                                        <input
                                            type="text"
                                            name="billingCity"
                                            value={formData.billingCity}
                                            onChange={handleInputChange}
                                            className="sm:col-span-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">State</label>
                                        <input
                                            type="text"
                                            name="billingState"
                                            placeholder="Select or type to add"
                                            value={formData.billingState}
                                            onChange={handleInputChange}
                                            className="sm:col-span-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">Pin Code</label>
                                        <input
                                            type="text"
                                            name="billingPinCode"
                                            value={formData.billingPinCode}
                                            onChange={handleInputChange}
                                            className="sm:col-span-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            type="text"
                                            name="billingPhone"
                                            value={formData.billingPhone}
                                            onChange={handleInputChange}
                                            className="sm:col-span-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">Fax Number</label>
                                        <input
                                            type="text"
                                            name="billingFax"
                                            value={formData.billingFax}
                                            onChange={handleInputChange}
                                            className="sm:col-span-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <h3 className="text-lg font-medium text-gray-900">Shipping Address</h3>
                                    <button
                                        type="button"
                                        onClick={copyBillingAddress}
                                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center font-medium"
                                    >
                                        <span className="mr-1">⬇</span> Copy billing address
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">Attention</label>
                                        <input
                                            type="text"
                                            name="shippingAttention"
                                            value={formData.shippingAttention}
                                            onChange={handleInputChange}
                                            className="sm:col-span-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">Country/Region</label>
                                        <select
                                            name="shippingCountry"
                                            value={formData.shippingCountry}
                                            onChange={handleInputChange}
                                            className="sm:col-span-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                        >
                                            <option value="">Select</option>
                                            <option value="India">India</option>
                                            <option value="USA">USA</option>
                                            <option value="UK">UK</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                                        <label className="text-sm font-medium text-gray-700 pt-2">Address</label>
                                        <div className="sm:col-span-2 space-y-2">
                                            <textarea
                                                name="shippingAddress1"
                                                placeholder="Street 1"
                                                rows="2"
                                                value={formData.shippingAddress1}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                            <textarea
                                                name="shippingAddress2"
                                                placeholder="Street 2"
                                                rows="2"
                                                value={formData.shippingAddress2}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">City</label>
                                        <input
                                            type="text"
                                            name="shippingCity"
                                            value={formData.shippingCity}
                                            onChange={handleInputChange}
                                            className="sm:col-span-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">State</label>
                                        <input
                                            type="text"
                                            name="shippingState"
                                            placeholder="Select or type to add"
                                            value={formData.shippingState}
                                            onChange={handleInputChange}
                                            className="sm:col-span-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">Pin Code</label>
                                        <input
                                            type="text"
                                            name="shippingPinCode"
                                            value={formData.shippingPinCode}
                                            onChange={handleInputChange}
                                            className="sm:col-span-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            type="text"
                                            name="shippingPhone"
                                            value={formData.shippingPhone}
                                            onChange={handleInputChange}
                                            className="sm:col-span-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">Fax Number</label>
                                        <input
                                            type="text"
                                            name="shippingFax"
                                            value={formData.shippingFax}
                                            onChange={handleInputChange}
                                            className="sm:col-span-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'contactpersons' && (
                        <div className="space-y-4">
                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Salutation</th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Phone</th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                                            <th scope="col" className="relative px-4 py-3 w-16">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {formData.contactPersons.map((person, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <select
                                                        value={person.salutation}
                                                        onChange={(e) => handleContactPersonChange(index, 'salutation', e.target.value)}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-1"
                                                    >
                                                        <option>Mr.</option>
                                                        <option>Mrs.</option>
                                                        <option>Ms.</option>
                                                        <option>Dr.</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <input
                                                        type="text"
                                                        value={person.firstName}
                                                        onChange={(e) => handleContactPersonChange(index, 'firstName', e.target.value)}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-1"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <input
                                                        type="text"
                                                        value={person.lastName}
                                                        onChange={(e) => handleContactPersonChange(index, 'lastName', e.target.value)}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-1"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <input
                                                        type="email"
                                                        value={person.email}
                                                        onChange={(e) => handleContactPersonChange(index, 'email', e.target.value)}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-1"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <input
                                                        type="text"
                                                        value={person.workPhone}
                                                        onChange={(e) => handleContactPersonChange(index, 'workPhone', e.target.value)}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-1"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <input
                                                        type="text"
                                                        value={person.mobile}
                                                        onChange={(e) => handleContactPersonChange(index, 'mobile', e.target.value)}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-1"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button className="text-gray-400 hover:text-gray-600">
                                                            <EllipsisVerticalIcon className="w-5 h-5" />
                                                        </button>
                                                        {formData.contactPersons.length > 1 && (
                                                            <button
                                                                onClick={() => removeContactPerson(index)}
                                                                className="text-red-400 hover:text-red-600"
                                                            >
                                                                <TrashIcon className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button
                                type="button"
                                onClick={addContactPerson}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <PlusCircleIcon className="w-5 h-5 mr-2" />
                                Add Contact Person
                            </button>
                        </div>
                    )}
                    {
                        activeTab !== 'other' && activeTab !== 'address' && activeTab !== 'contactpersons' && (
                            <div className="flex items-center justify-center h-40 text-gray-400">
                                <p>Content for {activeTab} tab coming soon...</p>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default NewCustomerPage;
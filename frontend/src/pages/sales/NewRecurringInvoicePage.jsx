import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    PlusCircleIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    PencilIcon
} from '@heroicons/react/24/outline';

const NewRecurringInvoicePage = () => {
    const [formData, setFormData] = useState({
        customerName: '',
        profileName: '',
        orderNumber: '',
        repeatEvery: 'Week',
        startOn: new Date().toISOString().split('T')[0],
        endsOn: '',
        neverExpires: true,
        paymentTerms: 'Due on Receipt',
        accountsReceivable: 'Accounts Receivable',
        salesperson: '',
        subject: '',
        items: [
            { details: '', quantity: 1, rate: 0, discount: 0, amount: 0 }
        ],
        tds: '',
        adjustmentLabel: 'Adjustment',
        adjustmentAmount: 0,
        roundOff: 0,
        customerNotes: 'Thanks for your business.',
        termsConditions: ''
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...formData.items];
        updatedItems[index][field] = value;

        // Recalculate amount
        const qty = parseFloat(updatedItems[index].quantity) || 0;
        const rate = parseFloat(updatedItems[index].rate) || 0;
        const discount = parseFloat(updatedItems[index].discount) || 0;
        updatedItems[index].amount = (qty * rate) * (1 - discount / 100);

        setFormData(prev => ({
            ...prev,
            items: updatedItems
        }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { details: '', quantity: 1, rate: 0, discount: 0, amount: 0 }]
        }));
    };

    const removeItem = (index) => {
        if (formData.items.length > 1) {
            setFormData(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index)
            }));
        }
    };

    const calculateSubTotal = () => {
        return formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    };

    const calculateTotal = () => {
        const subTotal = calculateSubTotal();
        const adjustment = parseFloat(formData.adjustmentAmount) || 0;
        const roundOff = parseFloat(formData.roundOff) || 0;
        return subTotal + adjustment + roundOff;
    };

    return (
        <div className="">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-gray-900 mr-2">New Recurring Invoice</h1>
                </div>
                <Link to="/sales/recurringinvoices" className="text-gray-500 hover:text-gray-700">
                    <span className="text-2xl">&times;</span>
                </Link>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-8">

                {/* Top Section */}
                <div className="space-y-6">
                    {/* Customer Name */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="block text-sm font-medium text-red-500">Customer Name*</label>
                        <div className="md:col-span-2 flex">
                            <div className="relative flex-grow">
                                <select
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                >
                                    <option value="">Select Customer</option>
                                    <option value="Customer A">Customer A</option>
                                    <option value="Customer B">Customer B</option>
                                </select>
                            </div>
                            <button className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600">
                                <MagnifyingGlassIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Profile Name */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="block text-sm font-medium text-red-500">Profile Name*</label>
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                name="profileName"
                                value={formData.profileName}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            />
                        </div>
                    </div>

                    {/* Order Number */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="block text-sm font-medium text-gray-700">Order Number</label>
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                name="orderNumber"
                                value={formData.orderNumber}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            />
                        </div>
                    </div>

                    {/* Repeat Every */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="block text-sm font-medium text-red-500">Repeat Every*</label>
                        <div className="md:col-span-2">
                            <select
                                name="repeatEvery"
                                value={formData.repeatEvery}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            >
                                <option value="Week">Week</option>
                                <option value="Month">Month</option>
                                <option value="Year">Year</option>
                            </select>
                        </div>
                    </div>

                    {/* Start On / Ends On */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="block text-sm font-medium text-gray-700">Start On</label>
                        <div className="md:col-span-2 flex items-center space-x-4">
                            <input
                                type="date"
                                name="startOn"
                                value={formData.startOn}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            />
                            <div className="flex items-center space-x-2 whitespace-nowrap">
                                <span className="text-sm text-gray-700">Ends On</span>
                                <input
                                    type="date"
                                    name="endsOn"
                                    value={formData.endsOn}
                                    onChange={handleInputChange}
                                    disabled={formData.neverExpires}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 disabled:bg-gray-100"
                                    placeholder="dd/MM/yyyy"
                                />
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="neverExpires"
                                        checked={formData.neverExpires}
                                        onChange={handleInputChange}
                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Never Expires</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Payment Terms */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="block text-sm font-medium text-gray-700">Payment Terms</label>
                        <div className="md:col-span-2">
                            <select
                                name="paymentTerms"
                                value={formData.paymentTerms}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            >
                                <option value="Due on Receipt">Due on Receipt</option>
                                <option value="Net 15">Net 15</option>
                                <option value="Net 30">Net 30</option>
                            </select>
                        </div>
                    </div>

                    {/* Accounts Receivable */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="block text-sm font-medium text-gray-700">Accounts Receivable</label>
                        <div className="md:col-span-2">
                            <select
                                name="accountsReceivable"
                                value={formData.accountsReceivable}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            >
                                <option value="Accounts Receivable">Accounts Receivable</option>
                            </select>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4"></div>

                    {/* Salesperson */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="block text-sm font-medium text-gray-700">Salesperson</label>
                        <div className="md:col-span-2">
                            <select
                                name="salesperson"
                                value={formData.salesperson}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            >
                                <option value="">Select or Add Salesperson</option>
                            </select>
                        </div>
                    </div>

                    {/* Associate Projects */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <label className="block text-sm font-medium text-gray-700">Associate Project(s) Hours</label>
                        <div className="md:col-span-2">
                            <p className="text-sm text-gray-400 italic py-2">There are no active projects for this customer.</p>
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="block text-sm font-medium text-gray-700">Subject</label>
                        <div className="md:col-span-2">
                            <textarea
                                name="subject"
                                rows="2"
                                placeholder="Let your customer know what this Recurring Invoice is for"
                                value={formData.subject}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Item Table */}
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Item Table</h3>
                        <div className="flex space-x-2">
                            <button className="text-blue-600 text-sm font-medium flex items-center hover:text-blue-800">
                                <PlusCircleIcon className="w-4 h-4 mr-1" /> Bulk Actions
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">Item Details</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Discount (%)</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {formData.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                placeholder="Type or click to select an item."
                                                value={item.details}
                                                onChange={(e) => handleItemChange(index, 'details', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-1"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-1 text-right"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                value={item.rate}
                                                onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-1 text-right"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                value={item.discount}
                                                onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-1 text-right"
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-right text-sm font-medium text-gray-900">
                                            {item.amount.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {formData.items.length > 1 && (
                                                <button
                                                    onClick={() => removeItem(index)}
                                                    className="text-red-400 hover:text-red-600"
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
                    <div className="flex space-x-4 mt-2">
                        <button
                            type="button"
                            onClick={addItem}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <PlusCircleIcon className="w-5 h-5 mr-2" />
                            Add New Row
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <PlusCircleIcon className="w-5 h-5 mr-2" />
                            Add Items in Bulk
                        </button>
                    </div>

                    {/* Total Section */}
                    <div className="mt-8 flex justify-end">
                        <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-50 p-6 rounded-lg space-y-4">
                            <div className="flex justify-between text-sm font-medium text-gray-700">
                                <span>Sub Total</span>
                                <span>{calculateSubTotal().toFixed(2)}</span>
                            </div>

                            {/* TDS */}
                            <div className="flex items-center justify-between space-x-2">
                                <span className="text-sm text-gray-700">TDS</span>
                                <select
                                    name="tds"
                                    value={formData.tds}
                                    onChange={handleInputChange}
                                    className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs py-1"
                                >
                                    <option value="">Select a Tax</option>
                                </select>
                                <span className="text-sm text-gray-500">- 0.00</span>
                            </div>

                            {/* Adjustment */}
                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex items-center space-x-2 w-full">
                                    <input
                                        type="text"
                                        name="adjustmentLabel"
                                        value={formData.adjustmentLabel}
                                        onChange={handleInputChange}
                                        className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs py-1"
                                    />
                                    <input
                                        type="number"
                                        name="adjustmentAmount"
                                        value={formData.adjustmentAmount}
                                        onChange={handleInputChange}
                                        className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs py-1 text-right"
                                    />
                                </div>
                                <span className="text-sm text-gray-900 font-medium">
                                    {parseFloat(formData.adjustmentAmount || 0).toFixed(2)}
                                </span>
                            </div>

                            {/* Round Off */}
                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-700">Round Off</span>
                                    <span className="text-xs text-blue-600 cursor-pointer">(No Rounding)</span>
                                    <PencilIcon className="w-3 h-3 text-blue-600 cursor-pointer" />
                                </div>
                                <span className="text-sm text-gray-900 font-medium">
                                    {parseFloat(formData.roundOff || 0).toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between text-base font-bold text-gray-900 border-t pt-4">
                                <span>Total ( ₹ )</span>
                                <span>{calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Notes</label>
                        <textarea
                            name="customerNotes"
                            rows="3"
                            value={formData.customerNotes}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
                        <textarea
                            name="termsConditions"
                            rows="3"
                            placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
                            value={formData.termsConditions}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-8 flex items-center space-x-4 pb-8">
                <button className="py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Save
                </button>
                <Link
                    to="/sales/recurringinvoices"
                    className="py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm"
                >
                    Cancel
                </Link>
            </div>
        </div>
    );
};

export default NewRecurringInvoicePage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    PlusCircleIcon,
    TrashIcon,
    Cog6ToothIcon,
    MagnifyingGlassIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

const NewInvoicePage = () => {
    const [formData, setFormData] = useState({
        customerName: '',
        invoiceNumber: 'INV-000001',
        orderNumber: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        terms: 'Due on Receipt',
        dueDate: new Date().toISOString().split('T')[0],
        accountsReceivable: 'Accounts Receivable',
        salesperson: '',
        subject: '',
        items: [
            { details: '', quantity: 1, rate: 0, discount: 0, amount: 0 }
        ],
        customerNotes: '',
        termsConditions: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
        return calculateSubTotal();
    };

    return (
        <div className="">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-gray-900 mr-2">New Invoice</h1>
                </div>
                <Link to="/sales/invoices" className="text-gray-500 hover:text-gray-700">
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
                                    <option value="">Select or add a customer</option>
                                    <option value="Customer A">Customer A</option>
                                    <option value="Customer B">Customer B</option>
                                </select>
                            </div>
                            <button className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600">
                                <MagnifyingGlassIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <label className="block text-sm font-medium text-red-500">Invoice#*</label>
                                <div className="md:col-span-2 flex items-center">
                                    <input
                                        type="text"
                                        name="invoiceNumber"
                                        value={formData.invoiceNumber}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                    />
                                    <Cog6ToothIcon className="w-5 h-5 text-blue-500 ml-2 cursor-pointer" />
                                </div>
                            </div>
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <label className="block text-sm font-medium text-red-500">Invoice Date*</label>
                                <div className="md:col-span-2 flex space-x-4">
                                    <input
                                        type="date"
                                        name="invoiceDate"
                                        value={formData.invoiceDate}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                    />
                                    <div className="flex items-center space-x-2 w-full">
                                        <span className="text-sm text-gray-500">Terms</span>
                                        <select
                                            name="terms"
                                            value={formData.terms}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs py-2"
                                        >
                                            <option value="Due on Receipt">Due on Receipt</option>
                                            <option value="Net 15">Net 15</option>
                                            <option value="Net 30">Net 30</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center space-x-2 w-full">
                                        <span className="text-sm text-gray-500">Due Date</span>
                                        <input
                                            type="date"
                                            name="dueDate"
                                            value={formData.dueDate}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </div>
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
                        </div>
                        <div className="space-y-4">
                            {/* Placeholder for right column if needed */}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pt-4 border-t border-gray-100">
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <label className="block text-sm font-medium text-gray-700">Subject</label>
                        <div className="md:col-span-2">
                            <textarea
                                name="subject"
                                rows="2"
                                placeholder="Let your customer know what this Invoice is for"
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
                                <MagnifyingGlassIcon className="w-4 h-4 mr-1" /> Scan Item
                            </button>
                            <button className="text-blue-600 text-sm font-medium flex items-center hover:text-blue-800">
                                <ArrowPathIcon className="w-4 h-4 mr-1" /> Bulk Actions
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
                    </div>

                    {/* Total Section */}
                    <div className="mt-8 flex justify-end">
                        <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-50 p-6 rounded-lg space-y-4">
                            <div className="flex justify-between text-sm font-medium text-gray-700">
                                <span>Sub Total</span>
                                <span>{calculateSubTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-gray-900 border-t pt-4">
                                <span>Total ( ₹ )</span>
                                <span>{calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-8 flex justify-between items-center pb-8">
                <div className="flex space-x-4">
                    <button className="py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm">
                        Save as Draft
                    </button>
                    <button className="py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Save and Send
                    </button>
                    <Link
                        to="/sales/invoices"
                        className="py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm"
                    >
                        Cancel
                    </Link>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="text-blue-600 text-sm font-medium flex items-center hover:text-blue-800">
                        <ArrowPathIcon className="w-4 h-4 mr-1" /> Make Recurring
                    </button>
                    <div className="text-sm text-gray-500 text-right border-l pl-4">
                        <p>Total Amount: ₹ {calculateTotal().toFixed(2)}</p>
                        <p>Total Quantity: {formData.items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewInvoicePage;

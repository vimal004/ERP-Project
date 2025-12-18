import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

const NewQuotePage = () => {
    const [formData, setFormData] = useState({
        customerName: '',
        quoteNumber: 'QT-000001',
        referenceNumber: '',
        quoteDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        salesperson: '',
        projectName: '',
        subject: '',
        items: [
            { details: '', quantity: 1, rate: 0, discount: 0, amount: 0 }
        ]
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

    const calculateTotal = () => {
        return formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    };

    return (
        <div className="">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900">New Quote</h1>
                <Link to="/sales/quotes" className="text-gray-500 hover:text-gray-700">
                    <span className="text-2xl">&times;</span>
                </Link>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-8">

                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-red-500 mb-1">Customer Name*</label>
                            <select
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            >
                                <option value="">Select or add a customer</option>
                                <option value="Customer A">Customer A</option>
                                <option value="Customer B">Customer B</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-red-500 mb-1">Quote#*</label>
                            <input
                                type="text"
                                name="quoteNumber"
                                value={formData.quoteNumber}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reference#</label>
                            <input
                                type="text"
                                name="referenceNumber"
                                value={formData.referenceNumber}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-red-500 mb-1">Quote Date*</label>
                                <input
                                    type="date"
                                    name="quoteDate"
                                    value={formData.quoteDate}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Salesperson</label>
                            <select
                                name="salesperson"
                                value={formData.salesperson}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            >
                                <option value="">Select or Add Salesperson</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                            <select
                                name="projectName"
                                value={formData.projectName}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            >
                                <option value="">Select a project</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Select a customer to associate a project.</p>
                        </div>
                    </div>
                </div>

                {/* Subject */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <label className="md:col-span-2 text-sm font-medium text-gray-700">Subject</label>
                    <div className="md:col-span-10">
                        <textarea
                            name="subject"
                            rows="2"
                            placeholder="Let your customer know what this Quote is for"
                            value={formData.subject}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                </div>

                {/* Item Table */}
                <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Item Table</h3>
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
                    <button
                        type="button"
                        onClick={addItem}
                        className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                        Add another line
                    </button>

                    {/* Total Section */}
                    <div className="mt-8 flex justify-end">
                        <div className="w-full md:w-1/3 space-y-4">
                            <div className="flex justify-between text-sm font-medium text-gray-700">
                                <span>Sub Total</span>
                                <span>{calculateTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-gray-900 border-t pt-4">
                                <span>Total (INR)</span>
                                <span>{calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-8 flex justify-start space-x-4 pb-8">
                <button className="py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm">
                    Save as Draft
                </button>
                <button className="py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Save and Send
                </button>
                <Link
                    to="/sales/quotes"
                    className="py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm"
                >
                    Cancel
                </Link>
            </div>
        </div>
    );
};

export default NewQuotePage;

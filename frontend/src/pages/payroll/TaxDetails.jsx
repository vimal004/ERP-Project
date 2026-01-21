import React, { useState } from 'react';

const TaxDetails = () => {
    const [formData, setFormData] = useState({
        pan: '',
        tan: '',
        tdsCircle: { part1: '', part2: '', part3: '', part4: '' },
        paymentFrequency: 'Monthly',
        deductorType: 'Employee',
        deductorName: '',
        deductorFatherName: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTdsChange = (part, value) => {
        setFormData(prev => ({
            ...prev,
            tdsCircle: { ...prev.tdsCircle, [part]: value }
        }));
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-medium text-gray-800 mb-6">Tax Details</h2>

            {/* Organisation Tax Details */}
            <div className="mb-8">
                <h3 className="text-base font-medium text-gray-700 mb-4">Organisation Tax Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl">
                    {/* PAN */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            PAN<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="pan"
                            value={formData.pan}
                            onChange={handleChange}
                            placeholder="AAAAA0000A"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>

                    {/* TAN */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            TAN
                        </label>
                        <input
                            type="text"
                            name="tan"
                            value={formData.tan}
                            onChange={handleChange}
                            placeholder="AAAA00000A"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>

                    {/* TDS circle / AO code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            TDS circle / AO code
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                            </svg>
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={formData.tdsCircle.part1}
                                onChange={(e) => handleTdsChange('part1', e.target.value)}
                                placeholder="AAA"
                                className="w-16 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-center"
                            />
                            <span className="text-gray-400">/</span>
                            <input
                                type="text"
                                value={formData.tdsCircle.part2}
                                onChange={(e) => handleTdsChange('part2', e.target.value)}
                                placeholder="AA"
                                className="w-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-center"
                            />
                            <span className="text-gray-400">/</span>
                            <input
                                type="text"
                                value={formData.tdsCircle.part3}
                                onChange={(e) => handleTdsChange('part3', e.target.value)}
                                placeholder="000"
                                className="w-14 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-center"
                            />
                            <span className="text-gray-400">/</span>
                            <input
                                type="text"
                                value={formData.tdsCircle.part4}
                                onChange={(e) => handleTdsChange('part4', e.target.value)}
                                placeholder="00"
                                className="w-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-center"
                            />
                        </div>
                    </div>

                    {/* Tax Payment Frequency */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            Tax Payment Frequency
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                            </svg>
                        </label>
                        <select
                            name="paymentFrequency"
                            value={formData.paymentFrequency}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 text-gray-500"
                            disabled
                        >
                            <option>Monthly</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tax Deductor Details */}
            <div className="mb-8">
                <h3 className="text-base font-medium text-gray-700 mb-4">Tax Deductor Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl">
                    {/* Deductor's Type */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Deductor's Type
                        </label>
                        <div className="flex items-center space-x-6">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="deductorType"
                                    value="Employee"
                                    checked={formData.deductorType === 'Employee'}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">Employee</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="deductorType"
                                    value="Non-Employee"
                                    checked={formData.deductorType === 'Non-Employee'}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">Non-Employee</span>
                            </label>
                        </div>
                    </div>

                    {/* Deductor's Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deductor's Name
                        </label>
                        <select
                            name="deductorName"
                            value={formData.deductorName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-500"
                        >
                            <option value="">Select a Tax Deductor</option>
                            {/* Mock options */}
                            <option value="John Doe">John Doe</option>
                            <option value="Jane Smith">Jane Smith</option>
                        </select>
                    </div>

                    {/* Deductor's Father's Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deductor's Father's Name
                        </label>
                        <input
                            type="text"
                            name="deductorFatherName"
                            value={formData.deductorFatherName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"
                            disabled={true} // Screenshot shows it empty and maybe disabled until deductor is selected or it's just greyish default
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                    Save
                </button>
                <div className="text-xs text-red-500">
                    * indicates mandatory fields
                </div>
            </div>
        </div>
    );
};

export default TaxDetails;

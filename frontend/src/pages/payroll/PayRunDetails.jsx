
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon, DocumentArrowDownIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';

const PayRunDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [status] = useState(id === 'dec-2025' ? 'Draft' : 'Paid'); // Simple mock logic based on ID

    // Mock employees in this pay run
    const employees = [
        { id: 'EMP001', name: 'John Doe', earnings: 80000, deductions: 5000, netPay: 75000, status: 'Ready' },
        { id: 'EMP002', name: 'Jane Smith', earnings: 95000, deductions: 6000, netPay: 89000, status: 'Ready' },
        { id: 'EMP003', name: 'Alice Johnson', earnings: 60000, deductions: 2500, netPay: 57500, status: 'Review' },
        { id: 'EMP004', name: 'Bob Brown', earnings: 75000, deductions: 4000, netPay: 71000, status: 'Ready' },
    ];

    const totalCost = employees.reduce((acc, emp) => acc + emp.earnings, 0);
    const totalNetPay = employees.reduce((acc, emp) => acc + emp.netPay, 0);

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate('/payroll/run')}
                        className="mr-4 p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-800">
                                {id === 'dec-2025' ? 'December 2025 Payroll' : 'November 2025 Payroll'}
                            </h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${status === 'Draft' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-green-50 text-green-700 border-green-200'
                                }`}>
                                {status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Pay Period: 01 Dec 2025 - 31 Dec 2025</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    {status === 'Draft' ? (
                        <>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium">
                                Save as Draft
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                Submit for Approval
                            </button>
                        </>
                    ) : (
                        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium">
                            <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                            Download Salary Register
                        </button>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Total Payroll Cost</p>
                    <p className="text-2xl font-bold text-gray-900">₹ {totalCost.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Total Net Pay</p>
                    <p className="text-2xl font-bold text-gray-900">₹ {totalNetPay.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Employees </p>
                    <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
                </div>
            </div>

            {/* Employee List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Employee Summary</h3>
                    {status === 'Draft' && (
                        <button className="text-blue-600 text-sm hover:underline">Edit Bulk Data</button>
                    )}
                </div>

                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 mr-3">
                                            {emp.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                                            <div className="text-xs text-gray-500">{emp.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                    ₹{emp.earnings.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600">
                                    - ₹{emp.deductions.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                    ₹{emp.netPay.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {emp.status === 'Ready' || status === 'Paid' ? (
                                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                                    ) : (
                                        <span className="text-xs text-orange-600 font-medium">Unverified</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default PayRunDetails;

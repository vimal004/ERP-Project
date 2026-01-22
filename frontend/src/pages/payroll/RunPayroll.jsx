
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, CalendarIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';

const RunPayroll = () => {
    const navigate = useNavigate();

    // Mock data for upcoming pay run
    const upcomingPayRun = {
        month: 'December 2025',
        employees: 12,
        netPay: '₹ 8,45,000',
        payDate: '01/01/2026',
        status: 'Overdue'
    };

    // Mock data for pay run history
    const payRunHistory = [
        { id: 'PR-NOV-2025', month: 'November 2025', employees: 12, netPay: '₹ 8,40,000', payDate: '01/12/2025', status: 'Paid' },
        { id: 'PR-OCT-2025', month: 'October 2025', employees: 11, netPay: '₹ 7,80,000', payDate: '01/11/2025', status: 'Paid' },
        { id: 'PR-SEP-2025', month: 'September 2025', employees: 11, netPay: '₹ 7,80,000', payDate: '01/10/2025', status: 'Paid' },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Pay Runs</h1>
                    <p className="text-sm text-gray-500">Manage your monthly pay runs</p>
                </div>
                <button
                    onClick={() => navigate('/payroll/run/new')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create Pay Run
                </button>
            </div>

            {/* Upcoming / Active Pay Run Card */}
            <div className="bg-white rounded-lg shadow-sm border border-orange-200 mb-8 overflow-hidden">
                <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-5 h-5 text-orange-600" />
                        <h2 className="text-lg font-semibold text-orange-900">Upcoming Pay Run</h2>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">{upcomingPayRun.status}</span>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Pay Period</p>
                        <p className="text-lg font-medium text-gray-900">{upcomingPayRun.month}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Employees</p>
                        <p className="text-lg font-medium text-gray-900">{upcomingPayRun.employees}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Estimated Net Pay</p>
                        <p className="text-lg font-medium text-gray-900">{upcomingPayRun.netPay}</p>
                    </div>
                    <div className="flex items-center justify-end">
                        <button
                            onClick={() => navigate('/payroll/run/dec-2025')}
                            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                        >
                            Process Payroll
                        </button>
                    </div>
                </div>
            </div>

            {/* Pay Run History */}
            <h3 className="text-lg font-medium text-gray-800 mb-4">Pay Run History</h3>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pay Period
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Employees
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pay Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Net Pay
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {payRunHistory.map((run) => (
                            <tr key={run.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/payroll/run/${run.id}`)}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-blue-600">{run.month}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{run.employees}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {run.payDate}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                    {run.netPay}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {run.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <span className="sr-only">View</span>
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RunPayroll;

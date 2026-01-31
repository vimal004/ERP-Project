import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    ArrowLeftIcon,
    EllipsisHorizontalIcon,
    PencilSquareIcon,
    XMarkIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
    PlusIcon
} from "@heroicons/react/24/outline";

const EmployeeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [editingSection, setEditingSection] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchEmployee();
    }, [id]);

    const fetchEmployee = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/employees/${id}`);
            setEmployee(response.data);
        } catch (error) {
            console.error("Error fetching employee details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/api/employees/${id}`, formData);
            setEmployee(response.data);
            setEditingSection(null);
            // Optional: Show success toast
            console.log("Updated successfully");
        } catch (error) {
            console.error("Error updating employee:", error);
            alert("Failed to update employee.");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!employee) return <div className="p-8 text-center text-gray-500">Employee not found</div>;

    const getAvatarColor = (name) => {
        const colors = ['bg-orange-100 text-orange-600', 'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600', 'bg-pink-100 text-pink-600', 'bg-teal-100 text-teal-600'];
        const charCode = name ? name.charCodeAt(0) : 0;
        return colors[charCode % colors.length];
    };

    return (
        <div className="flex flex-col h-full bg-white w-full">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-start bg-white">
                <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${getAvatarColor(employee.firstName)}`}>
                        {employee.firstName?.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-gray-900">
                                {employee.employeeId} - {employee.firstName} {employee.lastName}
                            </h1>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${employee.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {employee.status || 'Active'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{employee.designation}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white shadow-sm flex items-center gap-1">Add <span className="text-gray-400">▼</span></button>
                    <button className="p-2 border border-gray-300 rounded text-gray-500 hover:bg-gray-50 bg-white shadow-sm"><EllipsisHorizontalIcon className="w-5 h-5" /></button>
                    <button onClick={() => navigate('/payroll/employees')} className="p-2 rounded text-gray-400 hover:bg-gray-100"><XMarkIcon className="w-6 h-6" /></button>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-8 border-b border-gray-200 bg-white">
                <nav className="flex gap-8">
                    {['Overview', 'Salary Details', 'Investments', 'Payslips & Forms', 'Loans'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.toLowerCase()
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="p-8 bg-gray-50 flex-1 overflow-y-auto">
                {activeTab === 'overview' && (
                    <div className="space-y-6 max-w-5xl">

                        {/* Basic Info Section - View or Edit */}
                        {editingSection === 'basic' ? (
                            <div className="bg-white rounded-lg border border-blue-200 shadow-sm p-6 animate-in fade-in">
                                <h3 className="text-lg font-medium text-gray-900 mb-6">{employee.firstName}'s basic information</h3>

                                <form className="space-y-6">
                                    {/* Name Row */}
                                    <div className="grid grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Employee Name <span className="text-red-500">*</span></label>
                                            <input type="text" value={formData.firstName || ''} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="First Name" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Middle Name</label>
                                            <input type="text" value={formData.middleName || ''} onChange={(e) => setFormData({ ...formData, middleName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="Middle Name" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                                            <input type="text" value={formData.lastName || ''} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="Last Name" />
                                        </div>
                                    </div>

                                    {/* ID and Date Row */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Employee ID <span className="text-red-500">*</span></label>
                                            <input type="text" value={formData.employeeId || ''} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Date of Joining <span className="text-red-500">*</span></label>
                                            <input type="date" value={formData.dateOfJoining || ''} onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                        </div>
                                    </div>

                                    {/* Email and Mobile */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Work Email <span className="text-red-500">*</span></label>
                                            <input type="email" value={formData.workEmail || ''} onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Number</label>
                                            <input type="text" value={formData.mobileNumber || ''} onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                        </div>
                                    </div>

                                    {/* Director Checkbox */}
                                    <div className="flex items-start gap-2">
                                        <input
                                            type="checkbox"
                                            id="director"
                                            checked={formData.director || false}
                                            onChange={(e) => setFormData({ ...formData, director: e.target.checked })}
                                            className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="director" className="text-xs text-gray-700">
                                            Employee is a Director/person with substantial interest in the company.
                                            <span className="text-gray-400 ml-1">ⓘ</span>
                                        </label>
                                    </div>

                                    {/* Gender and Location */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
                                            <select value={formData.gender || ''} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm">
                                                <option value="">Select</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Work Location <span className="text-red-500">*</span></label>
                                            <select value={formData.workLocation || 'Head Office'} onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm">
                                                <option value="Head Office">Head Office (No.246/1, Plot...)</option>
                                                <option value="Branch Office">Branch Office</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Designation and Department */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <SearchableDropdown
                                            label={<span>Designation <span className="text-red-500">*</span></span>}
                                            options={['Manager', 'Developer', 'Designer', 'HR', 'Sales', 'Managing Director']} // Simplified options for details view
                                            value={formData.designation}
                                            onChange={(val) => setFormData({ ...formData, designation: val })}
                                            placeholder="Select Designation"
                                        />
                                        <SearchableDropdown
                                            label={<span>Department <span className="text-red-500">*</span></span>}
                                            options={['IT', 'HR', 'Sales', 'Marketing', 'Usage', 'Production']}
                                            value={formData.department}
                                            onChange={(val) => setFormData({ ...formData, department: val })}
                                            placeholder="Select Department"
                                        />
                                    </div>

                                    {/* Portal Access */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <input
                                                type="checkbox"
                                                id="portal"
                                                checked={formData.portalAccessEnabled || false}
                                                onChange={(e) => setFormData({ ...formData, portalAccessEnabled: e.target.checked })}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor="portal" className="text-sm font-medium text-gray-700">Enable Portal Access <span className="text-blue-500 text-xs font-normal cursor-pointer">Preview mail</span></label>
                                        </div>
                                        <p className="text-xs text-gray-500 ml-6">The employee will be able to view payslips, submit their IT declaration and create reimbursement claims through the employee portal.</p>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <button type="button" onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">Save</button>
                                        <button type="button" onClick={() => setEditingSection(null)} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50">Cancel</button>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-red-500">* indicates mandatory fields</span>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <Section title="Basic Information" onEdit={() => { setFormData(employee); setEditingSection('basic'); }}>
                                <GridItem label="Name" value={`${employee.firstName} ${employee.lastName}`} />
                                <GridItem label="Work Location" value={employee.workLocation} />

                                <GridItem label="Email Address" value={employee.workEmail} />
                                <GridItem label="Designation" value={employee.designation} />

                                <GridItem label="Mobile Number" value={employee.mobileNumber || '-'} />
                                <GridItem label="Departments" value={employee.department} />

                                <GridItem label="Date of Joining" value={employee.dateOfJoining} />
                                <GridItem label="Portal Access" value={employee.portalAccessEnabled ? 'Enabled' : 'Disabled'} highlight={employee.portalAccessEnabled} />

                                <GridItem label="Gender" value={employee.gender} />
                            </Section>
                        )}

                        {/* Statutory (Mocked) */}
                        <Section title="Statutory Information">
                            <GridItem label="Professional Tax" value="Enabled" isLink />
                        </Section>

                        {/* Personal Info */}
                        {editingSection === 'personal' ? (
                            <div className="bg-white rounded-lg border border-blue-200 shadow-sm p-6 animate-in fade-in">
                                <h3 className="text-lg font-medium text-gray-900 mb-6">Edit Personal Information</h3>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Personal Email</label>
                                            <input type="email" value={formData.personalEmail || ''} onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
                                            <input type="date" value={formData.dateOfBirth || ''} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Father's Name</label>
                                            <input type="text" value={formData.fatherName || ''} onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">PAN Number</label>
                                            <input autoComplete="off" type="text" value={formData.panNumber || ''} onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Residential Address</label>
                                            <textarea rows={3} value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button type="button" onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">Save</button>
                                        <button type="button" onClick={() => setEditingSection(null)} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <Section title="Personal Information" onEdit={() => { setFormData(employee); setEditingSection('personal'); }}>
                                <GridItem label="Date of Birth" value={employee.dateOfBirth || '-'} />
                                <GridItem label="Email Address" value={employee.personalEmail || '-'} />
                                <GridItem label="Father's Name" value={employee.fatherName || '-'} />
                                <GridItem label="Residential Address" value={employee.address || '-'} />
                                <GridItem label="PAN" value={employee.panNumber || '-'} />
                                <GridItem label="Differently Abled Type" value="None" />
                            </Section>
                        )}

                        {/* Payment Info */}
                        {editingSection === 'payment' ? (
                            <div className="bg-white rounded-lg border border-blue-200 shadow-sm p-6 animate-in fade-in">
                                <h3 className="text-lg font-medium text-gray-900 mb-6">Edit Payment Information</h3>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Payment Mode</label>
                                            <select value={formData.paymentMode || 'BANK_TRANSFER'} onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm">
                                                <option value="BANK_TRANSFER">Bank Transfer</option>
                                                <option value="CHEQUE">Cheque</option>
                                                <option value="CASH">Cash</option>
                                            </select>
                                        </div>
                                        {/* Add Bank fields if needed, kept simple for now based on request scope */}
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button type="button" onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">Save</button>
                                        <button type="button" onClick={() => setEditingSection(null)} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <Section title="Payment Information" onEdit={() => { setFormData(employee); setEditingSection('payment'); }}>
                                <GridItem label="Payment Mode" value={employee.paymentMode} />
                            </Section>
                        )}
                    </div>
                )}

                {activeTab === 'salary details' && (
                    <div className="max-w-6xl space-y-8 animate-in fade-in duration-300">
                        {editingSection === 'salary' ? (
                            <div className="bg-white rounded-lg border border-blue-200 shadow-sm p-6">
                                {/* Salary Template Header */}
                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div className="flex items-center gap-4">
                                        <label className="text-sm font-medium text-gray-700 min-w-[120px]">Salary Templates</label>
                                        <div className="flex-1 relative">
                                            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white flex justify-between items-center text-sm">
                                                <span>KSK TECHNOLOGY</span>
                                                <XMarkIcon className="w-4 h-4 text-gray-400 cursor-pointer" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Annual CTC Input */}
                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div className="flex items-center gap-4">
                                        <label className="text-sm font-medium text-gray-700 min-w-[120px]">
                                            <span className="text-red-500">*</span> Annual CTC
                                        </label>
                                        <div className="flex-1 flex items-center border border-gray-300 rounded-md bg-white px-3 py-2">
                                            <span className="text-gray-500 mr-2">₹</span>
                                            <input
                                                autoComplete="off"
                                                type="number"
                                                value={formData.annualCtc}
                                                onChange={(e) => {
                                                    const ctc = parseFloat(e.target.value) || 0;
                                                    setFormData({
                                                        ...formData,
                                                        annualCtc: ctc,
                                                        basicSalary: ctc * 0.5,
                                                        specialAllowances: ctc * 0.5
                                                    });
                                                }}
                                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            />
                                            <span className="text-gray-400 text-xs ml-2">per year</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Components Table */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                                    <div className="grid grid-cols-12 bg-blue-50/50 border-b border-gray-200 py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        <div className="col-span-4">Salary Components</div>
                                        <div className="col-span-4">Calculation Type</div>
                                        <div className="col-span-2 text-right">Monthly Amount</div>
                                        <div className="col-span-2 text-right">Annual Amount</div>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        <h4 className="text-sm font-semibold text-gray-900">Earnings</h4>

                                        {/* Basic Row */}
                                        <div className="grid grid-cols-12 items-center gap-4">
                                            <div className="col-span-4 text-sm font-medium text-gray-700">Basic</div>
                                            <div className="col-span-4 flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    disabled
                                                    value="50.00"
                                                    className="w-20 px-3 py-1.5 border border-gray-300 rounded text-sm bg-gray-50 text-gray-500"
                                                />
                                                <span className="px-3 py-1.5 border border-gray-300 rounded bg-gray-50 text-sm text-gray-600">% of CTC</span>
                                            </div>
                                            <div className="col-span-2 text-right">
                                                <input
                                                    type="number"
                                                    value={Math.round((formData.annualCtc || 0) * 0.5 / 12)}
                                                    disabled
                                                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm text-right bg-gray-50"
                                                />
                                            </div>
                                            <div className="col-span-2 text-right text-sm text-gray-900 font-medium">
                                                {Math.round((formData.annualCtc || 0) * 0.5)}
                                            </div>
                                        </div>

                                        {/* Fixed Allowance Row */}
                                        <div className="grid grid-cols-12 items-center gap-4">
                                            <div className="col-span-4">
                                                <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                                    Fixed Allowance <span className="text-gray-400 text-xs">ⓘ</span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">Monthly CTC - Sum of all other components</div>
                                            </div>
                                            <div className="col-span-4 text-sm text-gray-900">Fixed amount</div>
                                            <div className="col-span-2 text-right text-sm text-gray-900 font-medium">
                                                {Math.round(((formData.annualCtc || 0) - ((formData.annualCtc || 0) * 0.5)) / 12)}
                                            </div>
                                            <div className="col-span-2 text-right text-sm text-gray-900 font-medium">
                                                {Math.round((formData.annualCtc || 0) - ((formData.annualCtc || 0) * 0.5))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cost to Company Footer */}
                                    <div className="bg-blue-50/50 border-t border-gray-200 p-6 grid grid-cols-12 items-center">
                                        <div className="col-span-8 text-base font-medium text-gray-900">Cost to Company</div>
                                        <div className="col-span-2 text-right text-base font-bold text-gray-900">
                                            {formatCurrency((formData.annualCtc || 0) / 12)}
                                        </div>
                                        <div className="col-span-2 text-right text-base font-bold text-gray-900">
                                            {formatCurrency(formData.annualCtc || 0)}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-8 text-xs text-gray-500">
                                    Note: Any changes made to the salary components will take effect in the current pay run, provided it is not Approved.
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Calculate Basic and Other Allowances before saving
                                            const annualCtc = formData.annualCtc || 0;
                                            const basic = annualCtc * 0.5;
                                            const fixed = annualCtc - basic;

                                            setFormData({
                                                ...formData,
                                                basicSalary: basic,
                                                // Assuming fixed allowance maps to specialAllowances or similar in backend, 
                                                // or strictly Basic + Fixed = CTC. 
                                                // For now, let's map it:
                                                specialAllowances: fixed
                                            });
                                            handleSave();
                                        }}
                                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingSection(null)}
                                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Header with Edit Icon */}
                                <div className="flex items-center gap-2 mb-2">
                                    <h2 className="text-base font-semibold text-gray-800">Salary Details</h2>
                                    <PencilSquareIcon
                                        onClick={() => { setFormData(employee); setEditingSection('salary'); }}
                                        className="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-600"
                                    />
                                </div>

                                {/* CTC Card */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6 flex justify-between items-center shadow-sm">
                                    <div className="flex gap-16">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Annual CTC</p>
                                            <p className="text-lg font-bold text-gray-900">
                                                {formatCurrency(employee.annualCtc)} <span className="text-sm font-normal text-gray-500">per year</span>
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Monthly CTC</p>
                                            <p className="text-lg font-bold text-gray-900">
                                                {formatCurrency(employee.annualCtc / 12)} <span className="text-sm font-normal text-gray-500">per month</span>
                                            </p>
                                        </div>
                                    </div>
                                    <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Salary Structure */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-medium text-gray-700">Salary Structure</h3>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
                                            </svg>
                                            <span>Salary Template : <strong>KSK TECHNOLOGY</strong></span>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                        {/* Table Header */}
                                        <div className="grid grid-cols-12 bg-blue-50/50 border-b border-gray-200 py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <div className="col-span-6">Salary Components</div>
                                            <div className="col-span-3 text-right">Monthly Amount</div>
                                            <div className="col-span-3 text-right">Annual Amount</div>
                                        </div>

                                        <div className="p-6">
                                            <h4 className="text-sm font-semibold text-blue-600 mb-4">Earnings</h4>
                                            <div className="space-y-4">
                                                {/* Basic */}
                                                <SalaryRow
                                                    label="Basic"
                                                    subLabel={`(${(employee.basicSalary / employee.annualCtc * 100).toFixed(2)} % of CTC)`}
                                                    monthly={employee.basicSalary / 12}
                                                    annual={employee.basicSalary}
                                                />

                                                {/* HRA */}
                                                {employee.hra > 0 && (
                                                    <SalaryRow
                                                        label="House Rent Allowance"
                                                        subLabel={`(${(employee.hra / employee.annualCtc * 100).toFixed(2)} % of CTC)`}
                                                        monthly={employee.hra / 12}
                                                        annual={employee.hra}
                                                    />
                                                )}

                                                {/* Fixed Allowance (Balancing figure) */}
                                                <SalaryRow
                                                    label="Fixed Allowance"
                                                    monthly={(employee.annualCtc - employee.basicSalary - (employee.hra || 0)) / 12}
                                                    annual={employee.annualCtc - employee.basicSalary - (employee.hra || 0)}
                                                />
                                            </div>

                                            {/* Total */}
                                            <div className="flex justify-between items-center border-t border-gray-200 mt-6 pt-4">
                                                <div className="text-sm font-semibold text-gray-900">Cost to Company</div>
                                                <div className="w-1/2 grid grid-cols-2 gap-4 text-right">
                                                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(employee.annualCtc / 12)}</div>
                                                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(employee.annualCtc)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Perquisites Section */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-4">Perquisites</h3>
                                </div>

                                {/* Additional Benefits */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-4">Additional Benefits</h3>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-sm">
                                        <p className="font-medium text-gray-900 flex items-center gap-2">
                                            {formatCurrency(0)} <span className="text-xs text-blue-600 font-normal cursor-pointer hover:underline">View Details &gt;</span>
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount || 0);
};

const Section = ({ title, children, onEdit }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm relative group hover:border-blue-200 transition-colors">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
            {onEdit && (
                <PencilSquareIcon
                    onClick={onEdit}
                    className="w-4 h-4 text-gray-400 cursor-pointer hidden group-hover:block hover:text-blue-600"
                />
            )}
        </div>
        <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-12">
            {children}
        </div>
    </div>
);

// Searchable Dropdown Component (Copied from NewEmployee for self-containment)
const SearchableDropdown = ({ label, options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCustomMode, setIsCustomMode] = useState(false);
    const dropdownRef = useRef(null);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // If initial value is not in options, it's custom. We don't necessarily need to switch mode unless user tries to edit.
    // simpler to just show value.

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>

            {isCustomMode ? (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 text-sm"
                        placeholder="Type custom value"
                        autoFocus
                    />
                    <button
                        type="button"
                        onClick={() => setIsCustomMode(false)}
                        className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                    >
                        Select List
                    </button>
                </div>
            ) : (
                <div
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white flex justify-between items-center cursor-pointer text-sm"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className={value ? 'text-gray-900' : 'text-gray-400'}>
                        {value || placeholder}
                    </span>
                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                </div>
            )}

            {isOpen && !isCustomMode && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    <div className="p-2 sticky top-0 bg-white border-b border-gray-100">
                        <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded border border-gray-200">
                            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                className="w-full bg-transparent border-none focus:outline-none text-xs"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div
                                key={option}
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                    setSearchTerm('');
                                }}
                            >
                                {option}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-xs text-gray-500">No options found.</div>
                    )}

                    <div
                        className="px-4 py-2 border-t border-gray-100 text-blue-600 text-xs font-medium cursor-pointer hover:bg-gray-50 flex items-center gap-1"
                        onClick={() => {
                            setIsCustomMode(true);
                            setIsOpen(false);
                            onChange(''); // Reset for custom input
                        }}
                    >
                        <PlusIcon className="w-3 h-3" /> Add New
                    </div>
                </div>
            )}
        </div>
    );
};

const SalaryRow = ({ label, subLabel, monthly, annual }) => (
    <div className="grid grid-cols-12 items-center">
        <div className="col-span-6">
            <div className="text-sm font-medium text-gray-700">{label}</div>
            {subLabel && <div className="text-xs text-gray-400 mt-0.5">{subLabel}</div>}
        </div>
        <div className="col-span-3 text-right text-sm text-gray-900 font-medium">
            {formatCurrency(monthly)}
        </div>
        <div className="col-span-3 text-right text-sm text-gray-900 font-medium">
            {formatCurrency(annual)}
        </div>
    </div>
);

const GridItem = ({ label, value, highlight, isLink }) => (
    <div>
        <dt className="text-xs text-gray-500 mb-1">{label}</dt>
        <dd className={`text-sm font-medium truncate ${isLink ? 'text-green-600 cursor-pointer flex items-center gap-2' : (highlight ? 'text-blue-600' : 'text-gray-900')}`}>
            {isLink && <span className="flex items-center gap-1">✓ {value}</span>}
            {isLink && <span className="text-blue-600 text-xs font-normal hover:underline ml-1">[Disable]</span>}

            {!isLink && value}
            {/* Portal access special styling */}
            {label === 'Portal Access' && value === 'Disabled' && <span className="text-blue-600 text-xs font-normal hover:underline ml-2 cursor-pointer">[Enable]</span>}
        </dd>
    </div>
);

export default EmployeeDetails;

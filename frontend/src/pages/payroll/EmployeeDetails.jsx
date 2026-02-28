import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeById, updateEmployee, deleteEmployee } from "../../services/employeeService";
import { isAdmin } from "../../services/authService";
import {
    ArrowLeftIcon,
    EllipsisHorizontalIcon,
    PencilSquareIcon,
    XMarkIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

const EmployeeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [editingSection, setEditingSection] = useState(null);
    const [formData, setFormData] = useState({});
    const [toast, setToast] = useState(null); // { type: 'success'|'error', message: '' }
    const [exitForm, setExitForm] = useState({
        lastWorkingDay: "",
        reason: "",
        notes: ""
    });

    // UI Action States
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [showVehicleModal, setShowVehicleModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);

    // Add Menu States
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [showDeductionModal, setShowDeductionModal] = useState(false);
    const [showBenefitModal, setShowBenefitModal] = useState(false);

    const actionMenuRef = useRef(null);
    const addMenuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
                setShowActionMenu(false);
            }
            if (addMenuRef.current && !addMenuRef.current.contains(event.target)) {
                setShowAddMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        fetchEmployee();
    }, [id]);

    // Auto-dismiss toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const showToast = (type, message) => setToast({ type, message });

    const fetchEmployee = async () => {
        try {
            const data = await getEmployeeById(id);
            setEmployee(data);
        } catch (error) {
            console.error("Error fetching employee details:", error);
            showToast('error', error.message || 'Failed to load employee details.');
        } finally {
            setLoading(false);
        }
    };

    // Normalize formData before sending — fix field name mapping
    const preparePayload = (data) => {
        const payload = { ...data };
        // The Java entity uses `isDirector` internally but Jackson serializes as `director`
        // Ensure we always send the right key
        if ('isDirector' in payload && !('director' in payload)) {
            payload.director = payload.isDirector;
        }
        return payload;
    };

    const handleSave = async (dataToSave = formData) => {
        setSaving(true);
        try {
            const payload = preparePayload(dataToSave);
            const data = await updateEmployee(id, payload);
            setEmployee(data);
            setEditingSection(null);
            showToast('success', 'Employee updated successfully.');
        } catch (error) {
            console.error("Error updating employee:", error);
            showToast('error', error.message || 'Failed to update employee.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setSaving(true);
        try {
            await deleteEmployee(id);
            setShowDeleteModal(false);
            navigate('/payroll/employees');
        } catch (error) {
            console.error("Error deleting employee:", error);
            setSaving(false);
            setShowDeleteModal(false);
            showToast('error', error.message || 'Failed to delete employee.');
        }
    };

    const handleExitProcess = async (exitData) => {
        if (!exitData.reason) {
            showToast('error', 'Please select a reason for exit.');
            return;
        }
        if (!exitData.lastWorkingDay) {
            showToast('error', 'Please select the last working day.');
            return;
        }
        setSaving(true);
        try {
            let newStatus = "ACTIVE";
            if (exitData.reason === "resignation") newStatus = "RESIGNED";
            else if (exitData.reason === "termination") newStatus = "TERMINATED";
            else if (exitData.reason === "absconding") newStatus = "TERMINATED";

            const updatedEmployee = {
                ...employee,
                status: newStatus,
            };

            const data = await updateEmployee(id, preparePayload(updatedEmployee));
            setEmployee(data);
            setShowExitModal(false);
            showToast('success', 'Exit process completed successfully.');
        } catch (error) {
            console.error("Error initiating exit process:", error);
            showToast('error', error.message || 'Failed to initiate exit process.');
        } finally {
            setSaving(false);
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

    const getStatusStyle = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-700';
            case 'RESIGNED': return 'bg-yellow-100 text-yellow-700';
            case 'TERMINATED': return 'bg-red-100 text-red-700';
            case 'DECEASED': return 'bg-gray-200 text-gray-700';
            case 'ON_LEAVE': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const tabKey = (label) => label.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

    return (
        <div className="flex flex-col h-full bg-white w-full relative">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-[100] max-w-sm px-4 py-3 rounded-lg shadow-lg border text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top duration-200 ${
                    toast.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                    <span>{toast.type === 'success' ? '✓' : '✕'}</span>
                    <span className="flex-1">{toast.message}</span>
                    <button onClick={() => setToast(null)} className="ml-2 text-gray-400 hover:text-gray-600"><XMarkIcon className="w-4 h-4" /></button>
                </div>
            )}
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
                            <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${getStatusStyle(employee.status)}`}>
                                {employee.status || 'ACTIVE'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{employee.designation}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* Add Menu */}
                    {isAdmin() && (
                        <div className="relative" ref={addMenuRef}>
                            <button
                                onClick={() => setShowAddMenu(!showAddMenu)}
                                className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white shadow-sm flex items-center gap-1"
                            >
                                Add <ChevronDownIcon className="w-3 h-3 text-gray-400" />
                            </button>

                            {showAddMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                                    <button
                                        onClick={() => { setShowDeductionModal(true); setShowAddMenu(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-white hover:bg-blue-500"
                                    >
                                        Deduction
                                    </button>
                                    <button
                                        onClick={() => { setShowBenefitModal(true); setShowAddMenu(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-white hover:bg-blue-500"
                                    >
                                        Benefit
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Menu */}
                    {isAdmin() && (
                        <div className="relative" ref={actionMenuRef}>
                            <button
                                onClick={() => setShowActionMenu(!showActionMenu)}
                                className={`p-2 border rounded shadow-sm ${showActionMenu ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                            >
                                <EllipsisHorizontalIcon className="w-5 h-5" />
                            </button>

                            {showActionMenu && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-2 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                    <button
                                        onClick={() => { setShowVehicleModal(true); setShowActionMenu(false); }}
                                        className="text-left px-4 py-2.5 text-sm text-white bg-blue-500 hover:bg-blue-600 font-medium mb-1 mx-2 rounded" style={{ width: 'calc(100% - 16px)' }}
                                    >
                                        Add / Update Vehicle Details
                                    </button>
                                    <button
                                        onClick={() => { setShowDeleteModal(true); setShowActionMenu(false); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                    >
                                        Delete Employee
                                    </button>
                                    <button
                                        onClick={() => { setShowExitModal(true); setShowActionMenu(false); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                    >
                                        Initiate Exit Process
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    <button onClick={() => navigate('/payroll/employees')} className="p-2 rounded text-gray-400 hover:bg-gray-100"><XMarkIcon className="w-6 h-6" /></button>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-8 border-b border-gray-200 bg-white">
                <nav className="flex gap-8">
                    {['Overview', 'Salary Details', 'Investments', 'Payslips & Forms', 'Loans'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tabKey(tab))}
                            className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tabKey(tab)
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
                                                <option value="MALE">Male</option>
                                                <option value="FEMALE">Female</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Work Location <span className="text-red-500">*</span></label>
                                            <input type="text" value={formData.workLocation || ''} onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="e.g. Head Office" />
                                        </div>
                                    </div>

                                    {/* Designation and Department */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <SearchableDropdown
                                            label={<span>Designation <span className="text-red-500">*</span></span>}
                                            options={['Managing Director', 'Customer Support Manager', 'Marketing / Technical Manager', 'Operation Manager', 'Sr.Engineer - Production', 'Software Engineer', 'Accountant', 'Manager', 'Developer', 'Designer', 'HR', 'Sales']}
                                            value={formData.designation}
                                            onChange={(val) => setFormData({ ...formData, designation: val })}
                                            placeholder="Select Designation"
                                        />
                                        <SearchableDropdown
                                            label={<span>Department <span className="text-red-500">*</span></span>}
                                            options={['Finance', 'Admin', 'ADMIN ASSOCIATE', 'OPERATION MANAGER', 'Software Development', 'Production', 'Sales', 'Marketing', 'HR', 'Engineering', 'IT']}
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

                                    <div className="flex gap-3 pt-4">
                                        <button type="button" onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                            {saving && <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>}
                                            {saving ? 'Saving...' : 'Save'}
                                        </button>
                                        <button type="button" onClick={() => setEditingSection(null)} disabled={saving} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 disabled:opacity-50">Cancel</button>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-red-500">* indicates mandatory fields</span>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <Section title="Basic Information" onEdit={isAdmin() ? () => { setFormData(employee); setEditingSection('basic'); } : null}>
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
                                            <textarea rows={3} value={formData.presentAddress || ''} onChange={(e) => setFormData({ ...formData, presentAddress: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button type="button" onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                            {saving && <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>}
                                            {saving ? 'Saving...' : 'Save'}
                                        </button>
                                        <button type="button" onClick={() => setEditingSection(null)} disabled={saving} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 disabled:opacity-50">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <Section title="Personal Information" onEdit={isAdmin() ? () => { setFormData(employee); setEditingSection('personal'); } : null}>
                                <GridItem label="Date of Birth" value={employee.dateOfBirth || '-'} />
                                <GridItem label="Email Address" value={employee.personalEmail || '-'} />
                                <GridItem label="Father's Name" value={employee.fatherName || '-'} />
                                <GridItem label="Residential Address" value={employee.presentAddress || '-'} />
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
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">PAN Number</label>
                                            <input type="text" value={formData.panNumber || ''} onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                        </div>
                                    </div>
                                    {(formData.paymentMode === 'BANK_TRANSFER' || !formData.paymentMode) && (
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Bank Name</label>
                                                <input type="text" value={formData.bankName || ''} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Account Number</label>
                                                <input type="text" value={formData.accountNumber || ''} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">IFSC Code</label>
                                                <input type="text" value={formData.ifscCode || ''} onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Account Holder Name</label>
                                                <input type="text" value={formData.accountHolderName || ''} onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex gap-3 pt-4">
                                        <button type="button" onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                            {saving && <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>}
                                            {saving ? 'Saving...' : 'Save'}
                                        </button>
                                        <button type="button" onClick={() => setEditingSection(null)} disabled={saving} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 disabled:opacity-50">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <Section title="Payment Information" onEdit={isAdmin() ? () => { setFormData(employee); setEditingSection('payment'); } : null}>
                                <GridItem label="Payment Mode" value={employee.paymentMode || '-'} />
                                <GridItem label="Bank Name" value={employee.bankName || '-'} />
                                <GridItem label="Account Number" value={employee.accountNumber || '-'} />
                                <GridItem label="IFSC Code" value={employee.ifscCode || '-'} />
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
                                        disabled={saving}
                                        onClick={() => {
                                            const annualCtc = parseFloat(formData.annualCtc) || 0;
                                            const basic = annualCtc * 0.5;
                                            const fixed = annualCtc - basic;
                                            const updatedData = {
                                                ...formData,
                                                annualCtc,
                                                basicSalary: basic,
                                                specialAllowances: fixed
                                            };
                                            handleSave(updatedData);
                                        }}
                                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {saving && <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>}
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={saving}
                                        onClick={() => setEditingSection(null)}
                                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
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
                                    {isAdmin() && (
                                        <PencilSquareIcon
                                            onClick={() => { setFormData(employee); setEditingSection('salary'); }}
                                            className="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-600"
                                        />
                                    )}
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
                                                {formatCurrency((Number(employee.annualCtc) || 0) / 12)} <span className="text-sm font-normal text-gray-500">per month</span>
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
                                                    subLabel={`(${(Number(employee.annualCtc) > 0 ? (Number(employee.basicSalary) / Number(employee.annualCtc) * 100).toFixed(2) : '0.00')} % of CTC)`}
                                                    monthly={(Number(employee.basicSalary) || 0) / 12}
                                                    annual={Number(employee.basicSalary) || 0}
                                                />

                                                {/* HRA */}
                                                {(Number(employee.hra) || 0) > 0 && (
                                                    <SalaryRow
                                                        label="House Rent Allowance"
                                                        subLabel={`(${(Number(employee.annualCtc) > 0 ? (Number(employee.hra) / Number(employee.annualCtc) * 100).toFixed(2) : '0.00')} % of CTC)`}
                                                        monthly={(Number(employee.hra) || 0) / 12}
                                                        annual={Number(employee.hra) || 0}
                                                    />
                                                )}

                                                {/* Fixed Allowance (Balancing figure) */}
                                                <SalaryRow
                                                    label="Fixed Allowance"
                                                    monthly={((Number(employee.annualCtc) || 0) - (Number(employee.basicSalary) || 0) - (Number(employee.hra) || 0)) / 12}
                                                    annual={(Number(employee.annualCtc) || 0) - (Number(employee.basicSalary) || 0) - (Number(employee.hra) || 0)}
                                                />
                                            </div>

                                            {/* Total */}
                                            <div className="flex justify-between items-center border-t border-gray-200 mt-6 pt-4">
                                                <div className="text-sm font-semibold text-gray-900">Cost to Company</div>
                                                <div className="w-1/2 grid grid-cols-2 gap-4 text-right">
                                                    <div className="text-sm font-semibold text-gray-900">{formatCurrency((Number(employee.annualCtc) || 0) / 12)}</div>
                                                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(Number(employee.annualCtc) || 0)}</div>
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
                {/* --- MODALS --- */}

                {/* Deduction Modal */}
                {showDeductionModal && (
                    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                                <h3 className="text-lg font-medium text-gray-800">Add Deductions</h3>
                                <button onClick={() => setShowDeductionModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="mb-6">
                                    <SearchableDropdown
                                        label={<>Select a Deduction<span className="text-red-500">*</span></>}
                                        options={["House rent"]}
                                        placeholder="Select"
                                        value=""
                                        onChange={(val) => console.log(val)}
                                    // Hack to show "+ New Deduction" at bottom - handled by Custom Dropdown component if we modifying it,
                                    // but we can also rely on the existing "Add New" feature in SearchableDropdown
                                    />
                                    <div className="mt-2 text-blue-500 text-sm font-medium cursor-pointer hover:underline flex items-center gap-1">
                                        <PlusIcon className="w-4 h-4" /> New Deduction
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-4 py-2 bg-blue-400 text-white rounded font-medium shadow-sm text-sm cursor-not-allowed" disabled>Save</button>
                                    <button onClick={() => setShowDeductionModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 text-sm">Cancel</button>
                                </div>
                                <p className="mt-4 text-xs text-red-500 text-right">* indicates mandatory fields</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Benefit Modal */}
                {showBenefitModal && (
                    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                                <h3 className="text-lg font-medium text-gray-800">Add Benefits</h3>
                                <button onClick={() => setShowBenefitModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="mb-6">
                                    <SearchableDropdown
                                        label={<>Select a benefit plan<span className="text-red-500">*</span></>}
                                        options={["Voluntary Provident Fund"]}
                                        placeholder="Select"
                                        value=""
                                        onChange={(val) => console.log(val)}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-4 py-2 bg-blue-400 text-white rounded font-medium shadow-sm text-sm cursor-not-allowed" disabled>Save</button>
                                    <button onClick={() => setShowBenefitModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 text-sm">Cancel</button>
                                </div>
                                <p className="mt-4 text-xs text-red-500 text-right">* indicates mandatory fields</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                    <ExclamationTriangleIcon className="w-7 h-7 text-orange-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Are you sure you want to delete all the details of {employee.firstName} {employee.lastName}?
                                    </h3>
                                    <div className="flex gap-3 mt-6">
                                        <button
                                            onClick={handleDelete}
                                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium shadow-sm transition-colors"
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteModal(false)}
                                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            No
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Vehicle Details Modal */}
                {showVehicleModal && (
                    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                            {/* Header */}
                            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                                <h3 className="text-lg font-medium text-gray-800">Employer Car Details for Perquisite Calculation</h3>
                                <button onClick={() => setShowVehicleModal(false)} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 overflow-y-auto">
                                <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-800 mb-6">
                                    Company-owned or hired cars used by employees for official or personal use are eligible to claim perquisite
                                </div>

                                <form className="space-y-6">
                                    {/* Owner */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-2">Owner of the Car<span className="text-red-500">*</span></label>
                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="carOwner" defaultChecked className="text-blue-600 focus:ring-blue-500" />
                                                <span className="text-sm text-gray-700">Employer-owned (or) Hired for Employee</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="carOwner" className="text-blue-600 focus:ring-blue-500" />
                                                <span className="text-sm text-gray-700 flex items-center gap-1">Employee-owned <span className="text-gray-400 text-xs">ⓘ</span></span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Maintenance */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-2">Maintenance Cost Met By<span className="text-red-500">*</span></label>
                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="maintenance" className="text-blue-600 focus:ring-blue-500" />
                                                <span className="text-sm text-gray-700">Employer</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="maintenance" className="text-blue-600 focus:ring-blue-500" />
                                                <span className="text-sm text-gray-700">Employee</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Cubic Capacity */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-2">Cubic Capacity of Company Owned Car<span className="text-red-500">*</span></label>
                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="capacity" className="text-blue-600 focus:ring-blue-500" />
                                                <span className="text-sm text-gray-700">Upto 1600CC</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="capacity" className="text-blue-600 focus:ring-blue-500" />
                                                <span className="text-sm text-gray-700">Greater than 1600CC</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Driver Provided */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-2">Is driver provided by company?<span className="text-red-500">*</span></label>
                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="driver" className="text-blue-600 focus:ring-blue-500" />
                                                <span className="text-sm text-gray-700">Yes</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="driver" defaultChecked className="text-blue-600 focus:ring-blue-500" />
                                                <span className="text-sm text-gray-700">No</span>
                                            </label>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Footer */}
                            <div className="p-6 pt-0 flex gap-3">
                                <button
                                    onClick={() => { console.log("Saving vehicle details"); setShowVehicleModal(false); }}
                                    className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium shadow-sm transition-colors text-sm"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setShowVehicleModal(false)}
                                    className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Exit Process Modal */}
                {showExitModal && (
                    <div className="fixed inset-0 bg-white z-[60] overflow-y-auto animate-in fade-in duration-200">
                        <div className="max-w-7xl mx-auto px-8 py-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-8">{employee.firstName} {employee.lastName}'s Exit details</h2>

                            <div className="flex gap-12">
                                {/* Left Form */}
                                <div className="flex-1 space-y-6 max-w-2xl">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Working Day<span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            value={exitForm.lastWorkingDay}
                                            onChange={(e) => setExitForm({...exitForm, lastWorkingDay: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-500 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="dd/MM/yyyy"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Exit<span className="text-red-500">*</span></label>
                                        <select
                                            value={exitForm.reason}
                                            onChange={(e) => setExitForm({...exitForm, reason: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-500 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select</option>
                                            <option value="resignation">Resignation</option>
                                            <option value="termination">Termination</option>
                                            <option value="absconding">Absconding</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">When do you want to settle the final pay ?</label>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="settlement" defaultChecked className="text-blue-600 focus:ring-blue-500" />
                                                <span className="text-sm text-gray-700">Pay as per the regular pay schedule</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="settlement" className="text-blue-600 focus:ring-blue-500" />
                                                <span className="text-sm text-gray-700">Pay on a given date</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Personal Email Address <span className="text-gray-400">ⓘ</span></label>
                                        <input type="email" value={employee.personalEmail || ''} readOnly className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                        <textarea
                                            rows={4}
                                            value={exitForm.notes}
                                            onChange={(e) => setExitForm({...exitForm, notes: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
                                        ></textarea>
                                    </div>

                                    <div className="bg-orange-50 border border-orange-100 rounded-md p-4">
                                        <p className="text-sm font-bold text-gray-800 mb-2">Note:</p>
                                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                            <li>Portal is not enabled for this employee. Kindly collect the proof of investments before processing the payroll.</li>
                                        </ul>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={() => handleExitProcess(exitForm)}
                                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium shadow-sm transition-colors text-sm"
                                        >
                                            Proceed
                                        </button>
                                        <button
                                            onClick={() => setShowExitModal(false)}
                                            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 transition-colors text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>

                                {/* Right Info Card */}
                                <div className="w-80 pt-8">
                                    <div className="flex flex-col items-center text-center">
                                        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-normal mb-4 ${getAvatarColor(employee.firstName)}`}>
                                            {employee.firstName?.charAt(0)}
                                        </div>
                                        <h3 className="text-xl font-medium text-gray-900">{employee.firstName} {employee.lastName}</h3>
                                        <p className="text-sm text-gray-500 mb-8">ID: {employee.employeeId}</p>

                                        <div className="w-full space-y-4 text-left">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Designation</span>
                                                <span className="text-sm text-gray-900">{employee.designation}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Department</span>
                                                <span className="text-sm text-gray-900">{employee.department}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Date of Joining</span>
                                                <span className="text-sm text-gray-900">{employee.dateOfJoining}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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

import React from 'react';

const Users = () => {
    // Mock data based on the screenshot
    const users = [
        {
            id: 1,
            name: 'arulmani.g',
            email: 'arulmani.g@gmail.com',
            role: 'Admin',
            status: 'ACTIVE',
            avatarColor: 'bg-orange-200 text-orange-700' // Approximation of the avatar color
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow min-h-[500px]">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-medium text-gray-800">Users</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                    Invite User
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
                        <tr>
                            <th className="px-6 py-3 tracking-wider">User Details</th>
                            <th className="px-6 py-3 tracking-wider">Role</th>
                            <th className="px-6 py-3 tracking-wider">Status</th>
                            <th className="px-6 py-3 tracking-wider"></th> {/* Action column placeholder */}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm mr-4 ${user.avatarColor}`}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-blue-600">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {user.role}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${user.status === 'ACTIVE' ? 'text-green-600 bg-green-50' : 'text-gray-500 bg-gray-100'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-400">
                                    {/* Placeholder for action menu icon if needed */}
                                    <div className="cursor-pointer hover:text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM17.25 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                        </svg>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No users found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;

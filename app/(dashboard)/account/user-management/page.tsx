'use client';

import { useState } from 'react';

// Mock users data
const mockUsers = [
  { id: 1, name: 'Sarah Wilson', email: 'sarah@example.com', initials: 'SW' },
  { id: 2, name: 'Mike Chen', email: 'mike@example.com', initials: 'MC' },
  { id: 3, name: 'Emma Davis', email: 'emma@example.com', initials: 'ED' },
];

export default function Page() {
  const [userEmail, setUserEmail] = useState('');
  const [users, setUsers] = useState(mockUsers);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail.trim()) {
      // TODO: Implement actual user addition logic
      console.log('Adding user:', userEmail);
      setUserEmail('');
    }
  };

  const handleRemoveUser = (userId: number) => {
    // TODO: Implement actual user removal logic
    console.log('Removing user:', userId);
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">User Management</h1>

      {/* Add User Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Add User</h2>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">
              User Email
            </label>
            <input
              id="userEmail"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter user email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add User
          </button>
        </form>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Users</h2>
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user.initials}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveUser(user.id)}
                className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label={`Remove ${user.name}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

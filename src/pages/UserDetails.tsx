import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUser, updateUser, createUser, deleteUser } from '../api/users';
import { Save, Trash } from 'lucide-react';

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNewUser = id === 'new';

  const [user, setUser] = useState({ id: '', name: '', email: '', role: '', location: '' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id!),
    enabled: !isNewUser,
  });

  useEffect(() => {
    if (data && !isNewUser) {
      setUser(data);
    }
  }, [data, isNewUser]);

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/users');
    },
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/users');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/users');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNewUser) {
      createMutation.mutate(user);
    } else {
      updateMutation.mutate(user);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id!);
    }
  };

  if (isLoading) return <div>Loading user details...</div>;
  if (error && !isNewUser) return <div>Error loading user details</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{isNewUser ? 'Create New User' : 'Edit User'}</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              id="location"
              value={user.location}
              onChange={(e) => setUser({ ...user, location: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="h-5 w-5 mr-2" />
            {isNewUser ? 'Create User' : 'Save Changes'}
          </button>
          {!isNewUser && (
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash className="h-5 w-5 mr-2" />
              Delete User
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserDetails;
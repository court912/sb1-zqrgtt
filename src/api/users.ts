// Mock user data
let mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', location: 'New York' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'manager', location: 'Los Angeles' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'staff', location: 'Chicago' },
];

export const fetchUsers = async () => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockUsers;
};

export const fetchUser = async (id: string) => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const user = mockUsers.find(user => user.id === id);
  if (!user) throw new Error('User not found');
  return user;
};

export const updateUser = async (updatedUser: { id: string; name: string; email: string; role: string; location: string }) => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockUsers.findIndex(user => user.id === updatedUser.id);
  if (index !== -1) {
    mockUsers[index] = updatedUser;
    return updatedUser;
  }
  throw new Error('User not found');
};

export const createUser = async (newUser: { name: string; email: string; role: string; location: string }) => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const user = {
    id: (mockUsers.length + 1).toString(),
    ...newUser,
  };
  mockUsers.push(user);
  return user;
};

export const deleteUser = async (id: string) => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockUsers.findIndex(user => user.id === id);
  if (index !== -1) {
    mockUsers.splice(index, 1);
    return true;
  }
  throw new Error('User not found');
};
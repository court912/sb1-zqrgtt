import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '../api/dashboard';

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading dashboard data</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Total Patients" value={data.totalPatients} />
        <DashboardCard title="Appointments Today" value={data.appointmentsToday} />
        <DashboardCard title="Revenue This Month" value={`$${data.revenueThisMonth.toLocaleString()}`} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const DashboardCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
    <p className="text-3xl font-bold text-blue-600">{value}</p>
  </div>
);

export default Dashboard;
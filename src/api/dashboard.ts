export const fetchDashboardData = async () => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    totalPatients: 1500,
    appointmentsToday: 25,
    revenueThisMonth: 75000,
    monthlyRevenue: [
      { month: 'Jan', revenue: 50000 },
      { month: 'Feb', revenue: 55000 },
      { month: 'Mar', revenue: 60000 },
      { month: 'Apr', revenue: 65000 },
      { month: 'May', revenue: 70000 },
      { month: 'Jun', revenue: 75000 },
    ],
  };
};
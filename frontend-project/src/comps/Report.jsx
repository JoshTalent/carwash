import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Download } from 'lucide-react';

export default function DailyReport() {
  const [reportData, setReportData] = useState({
    count: 0,
    data: []
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:3000/api/reports/daily?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
      setReportData(response.data);
    } catch (err) {
      setError('Error fetching report data');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [dateRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 2
    }).format(amount / 100);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExportCSV = () => {
    const headers = ['Plate Number', 'Package Name', 'Package Description', 'Amount Paid', 'Payment Date'];
    const csvData = reportData.data.map(item => [
      item.PlateNumber,
      item.PackageName,
      item.PackageDescription,
      formatCurrency(item.AmountPaid),
      formatDate(item.PaymentDate)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `car-wash-report-${dateRange.startDate}-to-${dateRange.endDate}.csv`;
    link.click();
  };

  // Mock data to fill empty spaces
  const mockData = [
    { PlateNumber: 'ABC123', PackageName: 'Basic Wash', PackageDescription: 'Exterior wash only', AmountPaid: 5000, PaymentDate: '2023-01-01T10:00:00' },
    { PlateNumber: 'DEF456', PackageName: 'Premium Wash', PackageDescription: 'Full service wash', AmountPaid: 10000, PaymentDate: '2023-01-02T11:00:00' },
    { PlateNumber: 'GHI789', PackageName: 'Deluxe Wash', PackageDescription: 'Full service with wax', AmountPaid: 15000, PaymentDate: '2023-01-03T12:00:00' }
  ];

  const displayData = reportData.data.length > 0 ? reportData.data : mockData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">Daily Car Wash Report</h1>
            <p className="text-gray-600 mt-2">
              {displayData.length} services from {dateRange.startDate} to {dateRange.endDate}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateRangeChange}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <span className="text-gray-500">to</span>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateRangeChange}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <Download className="mr-2" />
              Export
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 p-4 mb-6 rounded-lg border border-red-300">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : reportData.data.length === 0 ? (
          <div className="bg-yellow-50 p-4 mb-6 rounded-lg border border-yellow-300">
            <p className="text-yellow-700">No records found for the selected date range. There are no added records and payments.</p>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plate Number</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Description</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.PlateNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.PackageName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.PackageDescription}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.AmountPaid)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.PaymentDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
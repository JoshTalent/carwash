import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    RecordNumber: '',
    PackageNumber: ''
  });
  const [serviceRecords, setServiceRecords] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServiceRecords = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/service-records');
      setServiceRecords(response.data);
    } catch (err) {
      console.error('Error fetching service records:', err);
      setError('Failed to load service records');
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/packages');
      setPackages(response.data);
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Failed to load packages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceRecords();
    fetchPackages();
  }, []);

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return new Intl.NumberFormat('RW', {
        style: 'currency',
        currency: 'RWF',
        minimumFractionDigits: 2
      }).format(price / 100);
    }
    return price;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'RecordNumber') {
      const record = serviceRecords.find(r => r.RecordNumber === parseInt(value));
      setSelectedRecord(record);
      setSelectedPackage(null);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        PackageNumber: record ? record.PackageNumber : ''
      }));
    } else if (name === 'PackageNumber') {
      const pkg = packages.find(p => p.PackageNumber === parseInt(value));
      setSelectedPackage(pkg);
      setSelectedRecord(null);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        RecordNumber: ''
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.RecordNumber && !formData.PackageNumber) {
      setError('Please select either a service record or a package');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const amountPaid = selectedRecord 
        ? selectedRecord.PackagePrice 
        : selectedPackage.PackagePrice;

      const response = await axios.post('http://localhost:3000/api/payments', {
        ...formData,
        AmountPaid: amountPaid // Send the price in cents directly
      });
      
      setSuccessMessage(`Payment created successfully! Payment Number: ${response.data.paymentNumber}`);
      setFormData({
        RecordNumber: '',
        PackageNumber: ''
      });
      setSelectedRecord(null);
      setSelectedPackage(null);
      fetchServiceRecords();
    } catch (err) {
      setError('Error submitting payment. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Payment</h1>
          <p className="mt-2 text-gray-600">Submit new payment details</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 p-4 rounded-md border border-red-300">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-blue-50 p-4 rounded-md border border-blue-300">
            <p className="text-blue-700">{successMessage}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-4">
            <label htmlFor="RecordNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Service Record
            </label>
            <select
              id="RecordNumber"
              name="RecordNumber"
              value={formData.RecordNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a service record</option>
              {serviceRecords.map((record) => (
                <option key={record.RecordNumber} value={record.RecordNumber}>
                  Record #{record.RecordNumber} - {record.PlateNumber} ({record.PackageName})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="PackageNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Package
            </label>
            <select
              id="PackageNumber"
              name="PackageNumber"
              value={formData.PackageNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a package</option>
              {packages.map((pkg) => (
                <option key={pkg.PackageNumber} value={pkg.PackageNumber}>
                  {pkg.PackageName} - {formatPrice(pkg.PackagePrice)}
                </option>
              ))}
            </select>
          </div>

          {selectedRecord && (
            <div className="mb-4 p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Service Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">Car Plate:</p>
                  <p className="font-medium">{selectedRecord.PlateNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Driver:</p>
                  <p className="font-medium">{selectedRecord.DriverName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Package:</p>
                  <p className="font-medium">{selectedRecord.PackageName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Service Date:</p>
                  <p className="font-medium">{selectedRecord.ServiceDate?.split('T')[0]}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600">Package Price:</p>
                  <p className="font-medium text-blue-600">{formatPrice(selectedRecord.PackagePrice)}</p>
                </div>
              </div>
            </div>
          )}

          {selectedPackage && (
            <div className="mb-4 p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Package Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">Package Name:</p>
                  <p className="font-medium">{selectedPackage.PackageName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Description:</p>
                  <p className="font-medium">{selectedPackage.PackageDescription}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600">Price:</p>
                  <p className="font-medium text-blue-600">{formatPrice(selectedPackage.PackagePrice)}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || (!formData.RecordNumber && !formData.PackageNumber)}
          >
            {isSubmitting ? 'Processing...' : 'Submit Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}
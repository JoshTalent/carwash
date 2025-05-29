import { useState, useEffect } from 'react';

export default function ServiceRecords() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [newPackage, setNewPackage] = useState({
    PackageName: '',
    PackageDescription: '',
    PackagePrice: ''
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://127.0.0.1:3000/api/packages');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPackages(data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load packages. Please try again later.');
      setIsLoading(false);
      console.error('Error fetching packages:', err);
    }
  };

  const handleAddPackage = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:3000/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          PackageName: newPackage.PackageName,
          PackageDescription: newPackage.PackageDescription,
          PackagePrice: parseFloat(newPackage.PackagePrice) * 100 // Convert to cents
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add package');
      }

      // Reset form and refresh packages
      setNewPackage({
        PackageName: '',
        PackageDescription: '',
        PackagePrice: ''
      });
      setIsAddingPackage(false);
      await fetchPackages(); // Refresh the package list
    } catch (err) {
      setError(err.message || 'Failed to add package. Please try again.');
      console.error('Error adding package:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPackage(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-red-500 font-medium">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Car Wash Packages</h1>
          <p className="mt-2 text-gray-600">Choose the perfect package for your vehicle</p>
        </div>

        {/* Add Package Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsAddingPackage(!isAddingPackage)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {isAddingPackage ? 'Cancel' : 'Add New Package'}
          </button>
        </div>

        {/* Add Package Form */}
        {isAddingPackage && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add New Package</h2>
            <form onSubmit={handleAddPackage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Package Name</label>
                <input
                  type="text"
                  name="PackageName"
                  value={newPackage.PackageName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="PackageDescription"
                  value={newPackage.PackageDescription}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (RWF)</label>
                <input
                  type="number"
                  name="PackagePrice"
                  value={newPackage.PackagePrice}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Package
              </button>
            </form>
          </div>
        )}
        
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.map((pkg) => (
                <tr 
                  key={pkg.PackageNumber} 
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedPackage?.PackageNumber === pkg.PackageNumber ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pkg.PackageNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pkg.PackageName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{pkg.PackageDescription}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof pkg.PackagePrice === 'number' 
                      ? new Intl.NumberFormat('RW', { 
                          style: 'currency', 
                          currency: 'RWF', 
                          minimumFractionDigits: 2 
                        }).format(pkg.PackagePrice/100)
                      : pkg.PackagePrice
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Package Details */}
        {selectedPackage && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Selected Package Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Package Number:</span> {selectedPackage.PackageNumber}</p>
              <p><span className="font-medium">Name:</span> {selectedPackage.PackageName}</p>
              <p><span className="font-medium">Description:</span> {selectedPackage.PackageDescription}</p>
              <p><span className="font-medium">Price:</span> {
                typeof selectedPackage.PackagePrice === 'number' 
                  ? new Intl.NumberFormat('RW', { 
                      style: 'currency', 
                      currency: 'RWF', 
                      minimumFractionDigits: 2 
                    }).format(selectedPackage.PackagePrice/100)
                  : selectedPackage.PackagePrice
              }</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
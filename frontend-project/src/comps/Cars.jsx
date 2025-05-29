import React, { useState } from 'react';
import axios from 'axios';
import { Car, Phone, User, Hash, CarFront, Save, CheckCircle, Clock, Calendar } from 'lucide-react';

const AddCar = () => {
  const [form, setForm] = useState({
    PlateNumber: '',
    CarType: '',
    CarSize: '',
    DriverName: '',
    PhoneNumber: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);
    
    try {
      const res = await axios.post('http://localhost:3000/api/cars', form);
      setMessage(res.data.message);
      setForm({
        PlateNumber: '',
        CarType: '',
        CarSize: '',
        DriverName: '',
        PhoneNumber: '',
      });
    } catch (err) {
      console.error(err);
      setError('Failed to create car. Please check the data and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left side - Form */}
            <div className="p-8">
              <div className="max-w-md mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Add New Car</h2>
                <p className="text-gray-600 mb-8">Register a new vehicle in the car wash management system</p>

                {message && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 flex items-center gap-2">
                    <Save size={20} className="flex-shrink-0" />
                    <p className="text-sm">{message}</p>
                  </div>
                )}
                
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-center gap-2">
                    <Save size={20} className="flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Hash size={18} className="text-gray-400" />
                      </div>
                      <input
                        name="PlateNumber"
                        value={form.PlateNumber}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
                        placeholder="Enter plate number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Car Type</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Car size={18} className="text-gray-400" />
                      </div>
                      <input
                        name="CarType"
                        value={form.CarType}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
                        placeholder="Enter car type"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Car Size</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CarFront size={18} className="text-gray-400" />
                      </div>
                      <input
                        name="CarSize"
                        value={form.CarSize}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
                        placeholder="Enter car size"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <input
                        name="DriverName"
                        value={form.DriverName}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
                        placeholder="Enter driver name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={18} className="text-gray-400" />
                      </div>
                      <input
                        name="PhoneNumber"
                        type="tel"
                        value={form.PhoneNumber}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Save size={18} />
                        <span>Save Car</span>
                      </div>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right side - Icon and Description */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 flex flex-col justify-center items-center text-white">
              <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center mb-8">
                <Car size={120} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Car Registration</h3>
              <div className="space-y-4 text-center">
                <p className="text-blue-100">
                  Register vehicles in our car wash management system to track and manage their service history.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} className="text-blue-300" />
                    <span>Track vehicle service history</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={20} className="text-blue-300" />
                    <span>Manage customer information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-blue-300" />
                    <span>Schedule maintenance services</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCar;

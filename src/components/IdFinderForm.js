'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function IdFinderForm() {
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
  });

  const [believerID, setBelieverID] = useState('');
  const [showBelieverID, setShowBelieverID] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [foundUser, setFoundUser] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleFetchBelieverID = async () => {
    setLoading(true);
    setError('');
    setShowBelieverID(false);

    // Basic validation
    if (!formData.dateOfBirth || !formData.phoneNumber || !formData.email) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/find-believer-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch Believer ID');
      }

      setBelieverID(data.believerID);
      setFoundUser(data.user);
      setShowBelieverID(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 p-6 sm:p-10 flex justify-center items-center mt-[80px]">
      <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 max-w-2xl w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 text-center">ID Finder</h1>
        <p className="text-center text-gray-600 mb-8">Enter your details to find your Believer ID</p>

        {error && <div className="p-4 bg-red-100 border-l-4 border-red-600 text-red-800 rounded-lg text-sm mb-6">{error}</div>}

        <div className="space-y-6">
          {/* Date of Birth */}
          <div className="flex flex-col gap-2">
            <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
              Date of Birth <span className="text-red-600 font-bold">*</span>
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-2">
            <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-600 font-bold">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+234 803 434 5321"
              className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email <span className="text-red-600 font-bold">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
              required
            />
          </div>

          {/* Fetch Button */}
          <button
            onClick={handleFetchBelieverID}
            disabled={loading || !formData.dateOfBirth || !formData.phoneNumber || !formData.email}
            className="w-full px-6 py-3 mb-6 text-center text-purple-600 font-semibold bg-white border-2 border-purple-500 rounded-lg cursor-pointer transition-all hover:bg-purple-50 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Fetching...' : 'Fetch My Believer\'s ID'}
          </button>

          {/* Display Believer ID */}
          {showBelieverID && (
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 rounded-lg">
                <p className="text-center text-gray-700 text-sm mb-3">Your believer ID is</p>
                <p className="text-center text-3xl sm:text-4xl font-bold text-purple-600 font-mono tracking-widest mb-4">{believerID}</p>
                
                {foundUser && (
                  <div className="mt-4 pt-4 border-t border-purple-200 space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Name:</span> {foundUser.firstName} {foundUser.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Category:</span> {foundUser.believerCategory}
                    </p>
                  </div>
                )}
              </div>

              {/* Proceed Button */}
              <Link href={`/programme-registration?believerID=${believerID}`} className="block">
                <button className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg transition-all hover:bg-gray-800 hover:shadow-lg hover:-translate-y-1">
                  Proceed to Programme Registration
                </button>
              </Link>

              {/* Back Button */}
              <button
                onClick={() => {
                  setShowBelieverID(false);
                  setFormData({
                    dateOfBirth: '',
                    phoneNumber: '',
                    email: '',
                  });
                  setBelieverID('');
                  setFoundUser(null);
                }}
                className="w-full px-6 py-3 text-gray-700 font-semibold border-2 border-gray-300 rounded-lg transition-all hover:bg-gray-100"
              >
                Search Another ID
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

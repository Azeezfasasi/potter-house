'use client';

import React, { useState } from 'react';
import { generateBelieverID } from '@/utils/believerIdGenerator';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    profession: '',
    believerCategory: '',
  });

  const [believerID, setBelieverID] = useState('');
  const [showBelieverID, setShowBelieverID] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customProfession, setCustomProfession] = useState('');

  const titles = ['Pastor', 'Evangelist', 'Prophet', 'Teacher', 'Deacon', 'Other'];
  const genders = ['Male', 'Female', 'Other'];
  const countries = ['Nigeria', 'USA', 'Canada', 'UK', 'Germany', 'Ghana', 'Kenya', 'South Africa'];
  const professions = ['Clergy', 'Medical', 'Education', 'Business', 'Government', 'Technology', 'Other'];
  const believerCategories = ['Disciple Maker', 'New Believer', 'Mature Believer', 'Leader', 'Member'];

  // States mapping for Nigerian states
  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
    'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
    'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
    'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
  ];

  const getStateOptions = () => {
    if (formData.country === 'Nigeria') {
      return nigerianStates;
    }
    // For other countries, return empty array for now
    return [];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleGenerateBelieverID = () => {
    if (!formData.state || !formData.country) {
      setError('Please select State/Territory and Country before generating Believer ID');
      return;
    }

    try {
      // In a real application, you might want to fetch the sequence number from the server
      // For now, we'll generate with a timestamp-based sequence
      const sequenceNumber = Math.floor(Math.random() * 1000000) + 1;
      const newBelieverID = generateBelieverID(formData.state, formData.country, sequenceNumber);
      setBelieverID(newBelieverID);
      setShowBelieverID(true);
      setError('');
    } catch (err) {
      setError(`Error generating Believer ID: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate required fields
    const requiredFields = ['title', 'firstName', 'lastName', 'gender', 'dateOfBirth', 'phoneNumber', 'email', 'state', 'country', 'believerCategory'];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    if (!believerID) {
      setError('Please generate a Believer ID before submitting');
      setLoading(false);
      return;
    }

    // Validate custom title if "Other" is selected
    if (formData.title === 'Other' && !customTitle.trim()) {
      setError('Please enter your custom title');
      setLoading(false);
      return;
    }

    // Validate custom profession if "Other" is selected
    if (formData.profession === 'Other' && !customProfession.trim()) {
      setError('Please enter your custom profession');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        believerID,
        // Use custom values if "Other" is selected
        title: formData.title === 'Other' ? customTitle : formData.title,
        profession: formData.profession === 'Other' ? customProfession : formData.profession,
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      setSuccess(`Registration successful! Your Believer ID: ${believerID}`);
      
      // Reset form
      setFormData({
        title: '',
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        phoneNumber: '',
        email: '',
        address: '',
        city: '',
        state: '',
        country: '',
        profession: '',
        believerCategory: '',
      });
      setBelieverID('');
      setShowBelieverID(false);
      setCustomTitle('');
      setCustomProfession('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 p-8 sm:p-10 flex justify-center items-start mt-[80px]">
      <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 max-w-3xl w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">Registration Portal</h1>

        {error && <div className="p-4 bg-red-100 border-l-4 border-red-600 text-red-800 rounded-lg text-sm mb-6">{error}</div>}
        {success && <div className="p-4 bg-green-100 border-l-4 border-green-600 text-green-800 rounded-lg text-sm mb-6">{success}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Personal Information Section */}
          <div className="flex flex-col gap-5">
            <h2 className="text-base font-semibold text-gray-800 uppercase tracking-wide border-b-2 border-gray-200 pb-3">Personal Information</h2>

            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">
                Title <span className="text-red-600 font-bold">*</span>
              </label>
              <select
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                required
              >
                <option value="">Select Title</option>
                {titles.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {formData.title === 'Other' && (
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Please enter your title"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  required
                  placeholder="Enter first name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="middleName" className="text-sm font-medium text-gray-700">
                  Middle Name
                </label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  placeholder="Enter middle name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  required
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="gender" className="text-sm font-medium text-gray-700">
                  Gender <span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  required
                >
                  <option value="">Select Gender</option>
                  {genders.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

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
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="flex flex-col gap-5">
            <h2 className="text-base font-semibold text-gray-800 uppercase tracking-wide border-b-2 border-gray-200 pb-3">Contact Information</h2>

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
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                required
                placeholder="Enter phone number"
              />
            </div>

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
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                required
                placeholder="Enter email address"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="city" className="text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  placeholder="Enter city"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="state" className="text-sm font-medium text-gray-700">
                  State/Territory <span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  required
                >
                  <option value="">Select State/Territory</option>
                  {getStateOptions().map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="flex flex-col gap-5">
            <h2 className="text-base font-semibold text-gray-800 uppercase tracking-wide border-b-2 border-gray-200 pb-3">Additional Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="country" className="text-sm font-medium text-gray-700">
                  Country <span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="profession" className="text-sm font-medium text-gray-700">
                  Profession
                </label>
                <select
                  id="profession"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                >
                  <option value="">Select Profession</option>
                  {professions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                {formData.profession === 'Other' && (
                  <input
                    type="text"
                    value={customProfession}
                    onChange={(e) => setCustomProfession(e.target.value)}
                    placeholder="Please enter your profession"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="believerCategory" className="text-sm font-medium text-gray-700">
                  Believer Category <span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  id="believerCategory"
                  name="believerCategory"
                  value={formData.believerCategory}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  required
                >
                  <option value="">Select Category</option>
                  {believerCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Believer ID Section */}
          <div className="flex flex-col gap-5">
            <h2 className="text-base font-semibold text-gray-800 uppercase tracking-wide border-b-2 border-gray-200 pb-3">Generate Believer ID</h2>
            <button
              type="button"
              onClick={handleGenerateBelieverID}
              className="px-6 py-3 bg-purple-500 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all uppercase tracking-wider hover:bg-purple-600 hover:shadow-lg hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!formData.state || !formData.country}
            >
              Generate Believer's ID
            </button>

            {showBelieverID && (
              <div className="bg-blue-50 border-2 border-purple-500 rounded-lg p-5 text-center">
                <p className="text-sm text-gray-600 m-0 mb-2">Your believer ID is</p>
                <p className="text-2xl font-bold text-purple-500 m-0 tracking-wider font-mono">{believerID}</p>
              </div>
            )}
          </div>
          
          {error && <div className="p-4 bg-red-100 border-l-4 border-red-600 text-red-800 rounded-lg text-sm mb-6">{error}</div>}
          {success && <div className="p-4 bg-green-100 border-l-4 border-green-600 text-green-800 rounded-lg text-sm mb-6">{success}</div>}

          {/* Submit Button */}
          <button type="submit" className="px-6 py-3 bg-gray-900 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all uppercase tracking-wider mt-2 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}

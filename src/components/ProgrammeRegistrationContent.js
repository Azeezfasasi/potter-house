'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProgrammeRegistrationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const believerID = searchParams.get('believerID');

  const [formData, setFormData] = useState({
    // User Info (auto-filled)
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
    believerID: '',
    
    // Programme-specific fields
    programmeName: '',
    programmeStartDate: '',
    programmeEndDate: '',
    programmeDuration: '',
    attendanceMode: '', // Online, Physical, Hybrid
    emergencyContactName: '',
    emergencyContactPhone: '',
    specialRequirements: '',
    agreeToTerms: false,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [programmes, setProgrammes] = useState([]);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!believerID) {
        setError('Believer ID not found. Please go back and find your ID first.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/get-user-by-id?believerID=${believerID}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch your information');
        }

        // Auto-fill form with user data
        setFormData((prev) => ({
          ...prev,
          title: data.user.title || '',
          firstName: data.user.firstName || '',
          middleName: data.user.middleName || '',
          lastName: data.user.lastName || '',
          gender: data.user.gender || '',
          dateOfBirth: data.user.dateOfBirth ? data.user.dateOfBirth.split('T')[0] : '',
          phoneNumber: data.user.phoneNumber || '',
          email: data.user.email || '',
          address: data.user.address || '',
          city: data.user.city || '',
          state: data.user.state || '',
          country: data.user.country || '',
          profession: data.user.profession || '',
          believerCategory: data.user.believerCategory || '',
          believerID: data.user.believerID || '',
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [believerID]);

  // Fetch published programmes
  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const response = await fetch('/api/programmes?status=Published');
        const data = await response.json();

        if (response.ok && data.programmes) {
          setProgrammes(data.programmes);
        }
      } catch (err) {
        console.error('Failed to fetch programmes:', err);
      }
    };

    fetchProgrammes();
  }, []);

  // Auto-fill programme details when programme is selected
  useEffect(() => {
    if (formData.programmeName && programmes.length > 0) {
      const selectedProgramme = programmes.find(
        (prog) => prog.programmeName === formData.programmeName
      );

      if (selectedProgramme) {
        setFormData((prev) => ({
          ...prev,
          programmeStartDate: selectedProgramme.startDate
            ? selectedProgramme.startDate.split('T')[0]
            : '',
          programmeEndDate: selectedProgramme.endDate
            ? selectedProgramme.endDate.split('T')[0]
            : '',
          programmeDuration: selectedProgramme.duration || '',
          attendanceMode: selectedProgramme.attendanceMode || '',
        }));
      }
    }
  }, [formData.programmeName, programmes]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.programmeName || !formData.programmeStartDate || !formData.attendanceMode) {
      setError('Please fill in all required programme fields');
      setSubmitting(false);
      return;
    }

    if (!formData.emergencyContactName || !formData.emergencyContactPhone) {
      setError('Please provide emergency contact information');
      setSubmitting(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/programmes/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit programme registration');
      }

      setSuccess('Programme registration submitted successfully!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 p-6 sm:p-10 flex justify-center items-center mt-[80px]">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your information...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.firstName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 p-6 sm:p-10 flex justify-center items-center mt-[80px]">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <div className="p-4 bg-red-100 border-l-4 border-red-600 text-red-800 rounded-lg text-sm mb-6">{error}</div>
          <Link href="/id-finder">
            <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg transition-all hover:bg-purple-700">
              Go Back to ID Finder
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 p-6 sm:p-10 flex justify-center items-center mt-[80px] pb-10">
      <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 max-w-4xl w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 text-center">Programme Registration</h1>
        <p className="text-center text-gray-600 mb-8">Complete your programme registration details</p>

        {error && <div className="p-4 bg-red-100 border-l-4 border-red-600 text-red-800 rounded-lg text-sm mb-6">{error}</div>}
        {success && <div className="p-4 bg-green-100 border-l-4 border-green-600 text-green-800 rounded-lg text-sm mb-6">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section - Read Only */}
          <div className="border-b-2 border-gray-200 pb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
              Personal Information (Auto-filled)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Believer ID - Read Only */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Believer ID</label>
                <input
                  type="text"
                  value={formData.believerID}
                  disabled
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Title */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  disabled
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* First Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  disabled
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Middle Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Middle Name</label>
                <input
                  type="text"
                  value={formData.middleName}
                  disabled
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  disabled
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  disabled
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <input
                  type="text"
                  value={formData.gender}
                  disabled
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Date of Birth */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  disabled
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Believer Category */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Believer Category</label>
                <input
                  type="text"
                  value={formData.believerCategory}
                  disabled
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Profession */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Profession</label>
                <input
                  type="text"
                  value={formData.profession}
                  disabled
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  disabled
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* City */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  value={formData.city}
                  disabled
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* State */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  value={formData.state}
                  disabled
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Country */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  disabled
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Programme Details Section */}
          <div className="border-b-2 border-gray-200 pb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
              Programme Details <span className="text-red-600 font-bold">*</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Programme Name */}
              <div className="md:col-span-2 flex flex-col gap-2">
                <label htmlFor="programmeName" className="text-sm font-medium text-gray-700">
                  Programme Name <span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  id="programmeName"
                  name="programmeName"
                  value={formData.programmeName}
                  onChange={handleChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  required
                >
                  <option value="">-- Select a Programme --</option>
                  {programmes.map((programme) => (
                    <option key={programme._id} value={programme.programmeName}>
                      {programme.programmeName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Programme Start Date */}
              <div className="flex flex-col gap-2">
                <label htmlFor="programmeStartDate" className="text-sm font-medium text-gray-700">
                  Start Date <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="date"
                  id="programmeStartDate"
                  name="programmeStartDate"
                  value={formData.programmeStartDate}
                  disabled
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Programme End Date */}
              <div className="flex flex-col gap-2">
                <label htmlFor="programmeEndDate" className="text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  id="programmeEndDate"
                  name="programmeEndDate"
                  value={formData.programmeEndDate}
                  disabled
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Programme Duration */}
              <div className="flex flex-col gap-2">
                <label htmlFor="programmeDuration" className="text-sm font-medium text-gray-700">
                  Duration
                </label>
                <input
                  type="text"
                  id="programmeDuration"
                  name="programmeDuration"
                  value={formData.programmeDuration}
                  disabled
                  placeholder="e.g., 12 weeks"
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Attendance Mode */}
              <div className="md:col-span-2 flex flex-col gap-2">
                <label htmlFor="attendanceMode" className="text-sm font-medium text-gray-700">
                  Attendance Mode <span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  id="attendanceMode"
                  name="attendanceMode"
                  value={formData.attendanceMode}
                  disabled
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                >
                  <option value="">Select attendance mode</option>
                  <option value="Online">Online</option>
                  <option value="Physical">Physical</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="border-b-2 border-gray-200 pb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
              Emergency Contact <span className="text-red-600 font-bold">*</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Emergency Contact Name */}
              <div className="flex flex-col gap-2">
                <label htmlFor="emergencyContactName" className="text-sm font-medium text-gray-700">
                  Name <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  id="emergencyContactName"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  required
                />
              </div>

              {/* Emergency Contact Phone */}
              <div className="flex flex-col gap-2">
                <label htmlFor="emergencyContactPhone" className="text-sm font-medium text-gray-700">
                  Phone Number <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="tel"
                  id="emergencyContactPhone"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  placeholder="+234 803 434 5321"
                  className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  required
                />
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="border-b-2 border-gray-200 pb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">4</span>
              Additional Information
            </h2>

            <div className="flex flex-col gap-2">
              <label htmlFor="specialRequirements" className="text-sm font-medium text-gray-700">
                Special Requirements or Accommodations
              </label>
              <textarea
                id="specialRequirements"
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleChange}
                placeholder="Let us know if you have any special requirements or accommodations needed"
                rows="4"
                className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 transition-all hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
              required
            />
            <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
              I agree to the programme terms and conditions and confirm that all information provided is accurate <span className="text-red-600 font-bold">*</span>
            </label>
          </div>
          
           {error && <div className="p-4 bg-red-100 border-l-4 border-red-600 text-red-800 rounded-lg text-sm mb-6">{error}</div>}
           {success && <div className="p-4 bg-green-100 border-l-4 border-green-600 text-green-800 rounded-lg text-sm mb-6">{success}</div>}

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <Link href="/id-finder" className="flex-1">
              <button type="button" className="w-full px-6 py-3 text-gray-700 font-semibold bg-gray-200 border-2 border-gray-300 rounded-lg transition-all hover:bg-gray-300">
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:-translate-y-1 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

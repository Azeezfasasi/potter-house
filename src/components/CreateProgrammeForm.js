'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function CreateProgrammeForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    programmeName: '',
    description: '',
    startDate: '',
    endDate: '',
    attendanceMode: 'Online',
    location: '',
    capacity: '',
    syllabus: '',
    requirements: '',
  });

  const [duration, setDuration] = useState('');

  // Calculate duration when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (end > start) {
        const diffTime = Math.abs(end - start);
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (days === 1) {
          setDuration('1 day');
        } else if (days < 7) {
          setDuration(`${days} days`);
        } else {
          const weeks = Math.ceil(days / 7);
          setDuration(`${weeks} weeks`);
        }
      } else {
        setDuration('');
      }
    } else {
      setDuration('');
    }
  }, [formData.startDate, formData.endDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.programmeName.trim()) {
      setError('Programme name is required');
      return false;
    }
    if (!formData.startDate) {
      setError('Start date is required');
      return false;
    }
    if (!formData.endDate) {
      setError('End date is required');
      return false;
    }
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('End date must be after start date');
      return false;
    }
    if (!formData.attendanceMode) {
      setError('Attendance mode is required');
      return false;
    }
    if ((formData.attendanceMode === 'Physical' || formData.attendanceMode === 'Hybrid') && !formData.location.trim()) {
      setError('Location is required for Physical or Hybrid programmes');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    if (!user || !user._id) {
      setError('User information not found. Please login again.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/programmes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
          requirements: formData.requirements
            ? formData.requirements.split(',').map((r) => r.trim())
            : [],
          createdBy: user._id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to create programme');
        setLoading(false);
        return;
      }

      setSuccess('Programme created successfully! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard/all-programmes');
      }, 1500);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-slate-200 p-4 md:p-8 rounded-lg shadow-md">
      <div className="max-w-4xl mx-auto">
        {authLoading ? (
          <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4">Loading user information...</p>
            </div>
          </div>
        ) : !user ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <p className="text-red-600 font-semibold mb-4">Please login to create a programme</p>
              <a href="/login" className="text-purple-600 hover:text-purple-800 font-semibold">
                Go to Login
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h1 className="text-[18px] md:text-[24px] font-bold text-gray-800 mb-2">Create New Programme</h1>
            <p className="text-gray-600 mb-8">Fill in the details below to create a new programme</p>

            <form onSubmit={handleSubmit} method="POST" className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Programme Name */}
            <div>
              <label htmlFor="programmeName" className="block text-sm font-semibold text-gray-700 mb-2">
                Programme Name *
              </label>
              <input
                type="text"
                id="programmeName"
                name="programmeName"
                value={formData.programmeName}
                onChange={handleChange}
                placeholder="e.g., Advanced Python Programming"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the programme..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
                disabled={loading}
              />
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Duration (Auto-calculated, Read-only) */}
            {duration && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700">
                  Duration: <span className="text-purple-600 font-bold">{duration}</span>
                </p>
              </div>
            )}

            {/* Attendance Mode */}
            <div>
              <label htmlFor="attendanceMode" className="block text-sm font-semibold text-gray-700 mb-2">
                Attendance Mode *
              </label>
              <select
                id="attendanceMode"
                name="attendanceMode"
                value={formData.attendanceMode}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                disabled={loading}
              >
                <option value="Online">Online</option>
                <option value="Physical">Physical</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Location (conditional) */}
            {(formData.attendanceMode === 'Physical' || formData.attendanceMode === 'Hybrid') && (
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                  Location {formData.attendanceMode !== 'Online' && '*'}
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Lagos Office, Room 101"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
              </div>
            )}

            {/* Capacity */}
            <div>
              <label htmlFor="capacity" className="block text-sm font-semibold text-gray-700 mb-2">
                Capacity (Max Participants)
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g., 50"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Syllabus */}
            <div>
              <label htmlFor="syllabus" className="block text-sm font-semibold text-gray-700 mb-2">
                Syllabus / Curriculum
              </label>
              <textarea
                id="syllabus"
                name="syllabus"
                value={formData.syllabus}
                onChange={handleChange}
                placeholder="Outline the course content..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
                disabled={loading}
              />
            </div>

            {/* Requirements */}
            <div>
              <label htmlFor="requirements" className="block text-sm font-semibold text-gray-700 mb-2">
                Requirements (comma-separated)
              </label>
              <input
                type="text"
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="e.g., Basic Python, 2 years experience, Laptop"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple requirements with commas</p>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Programme'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
          </div>
        )}
      </div>
    </div>
  );
}

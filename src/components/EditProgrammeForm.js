'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function EditProgrammeForm() {
  const router = useRouter();
  const params = useParams();
  const programmeId = params?.id;
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    status: 'Draft',
    syllabus: '',
    requirements: '',
  });

  const [duration, setDuration] = useState('');

  // Fetch programme data
  useEffect(() => {
    const fetchProgramme = async () => {
      if (!programmeId) {
        setError('Programme ID not found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/programmes/${programmeId}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Failed to load programme');
          setLoading(false);
          return;
        }

        const programme = data.programme;
        setFormData({
          programmeName: programme.programmeName || '',
          description: programme.description || '',
          startDate: programme.startDate ? programme.startDate.split('T')[0] : '',
          endDate: programme.endDate ? programme.endDate.split('T')[0] : '',
          attendanceMode: programme.attendanceMode || 'Online',
          location: programme.location || '',
          capacity: programme.capacity || '',
          status: programme.status || 'Draft',
          syllabus: programme.syllabus || '',
          requirements: programme.requirements ? programme.requirements.join(', ') : '',
        });
      } catch (err) {
        setError(`Error loading programme: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramme();
  }, [programmeId]);

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

    setSubmitting(true);

    try {
      const response = await fetch(`/api/programmes/${programmeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
          requirements: formData.requirements
            ? formData.requirements.split(',').map((r) => r.trim())
            : [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to update programme');
        setSubmitting(false);
        return;
      }

      setSuccess('Programme updated successfully! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard/all-programmes');
      }, 1500);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <p className="text-red-600 font-semibold mb-4">Please login to edit programmes</p>
              <a href="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                Go to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Edit Programme</h1>
          <p className="text-gray-600 mb-8">Update the programme details below</p>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-gray-600 mt-4">Loading programme details...</p>
              </div>
            </div>
          ) : (
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={submitting}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  disabled={submitting}
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    disabled={submitting}
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Duration (Auto-calculated, Read-only) */}
              {duration && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700">
                    Duration: <span className="text-blue-600 font-bold">{duration}</span>
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    disabled={submitting}
                  >
                    <option value="Online">Online</option>
                    <option value="Physical">Physical</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    disabled={submitting}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    disabled={submitting}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={submitting}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  disabled={submitting}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={submitting}
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple requirements with commas</p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Programme'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={submitting}
                  className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

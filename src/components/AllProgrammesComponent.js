'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AllProgrammesComponent() {
  const router = useRouter();
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    attendanceMode: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch programmes
  const fetchProgrammes = async (page = 1) => {
    setLoading(true);
    setError('');

    try {
      const queryParams = new URLSearchParams();
      queryParams.set('page', page);

      if (filters.status) {
        queryParams.set('status', filters.status);
      }
      if (filters.attendanceMode) {
        queryParams.set('attendanceMode', filters.attendanceMode);
      }

      const response = await fetch(`/api/programmes?${queryParams.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to fetch programmes');
        setLoading(false);
        return;
      }

      setProgrammes(data.programmes || []);
      setPagination(data.pagination);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProgrammes(1);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm(id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/programmes/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to delete programme');
        setDeleteConfirm(null);
        return;
      }

      setProgrammes((prev) => prev.filter((p) => p._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Published':
        return 'bg-blue-100 text-blue-800';
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-slate-100 text-slate-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'Online':
        return 'bg-purple-100 text-purple-800';
      case 'Physical':
        return 'bg-orange-100 text-orange-800';
      case 'Hybrid':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 p-4 md:p-8 rounded-lg shadow-md">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-[18px] md:text-[24px] font-bold text-gray-800">All Programmes</h1>
            <p className="text-gray-600 mt-2">
              Total: <span className="font-semibold">{pagination.totalCount}</span> programmes
            </p>
          </div>
          <Link
            href="/dashboard/create-programme"
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-center text-[15px]"
          >
            + Create New Programme
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Attendance Mode Filter */}
            <div>
              <label htmlFor="attendanceMode" className="block text-sm font-medium text-gray-700 mb-2">
                Attendance Mode
              </label>
              <select
                id="attendanceMode"
                name="attendanceMode"
                value={filters.attendanceMode}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="">All Modes</option>
                <option value="Online">Online</option>
                <option value="Physical">Physical</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-4">Loading programmes...</p>
          </div>
        ) : programmes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">📋</div>
            <p className="text-gray-600 text-lg">No programmes found</p>
            <p className="text-gray-500 text-sm mt-2">Create a new programme to get started</p>
          </div>
        ) : (
          <>
            {/* Programmes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {programmes.map((programme) => (
                <div key={programme._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 overflow-hidden flex flex-col">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white">
                    <h3 className="text-lg font-bold truncate">{programme.programmeName}</h3>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(programme.status)}`}>
                        {programme.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getModeColor(programme.attendanceMode)}`}>
                        {programme.attendanceMode}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1">
                    {programme.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{programme.description}</p>
                    )}

                    <div className="space-y-2 text-sm">
                      {/* Dates */}
                      <div className="flex items-start gap-2">
                        <span className="text-gray-500 font-medium min-w-fit">📅 Dates:</span>
                        <div>
                          <p className="text-gray-700">{formatDate(programme.startDate)} - {formatDate(programme.endDate)}</p>
                          <p className="text-purple-600 font-semibold">{programme.duration}</p>
                        </div>
                      </div>

                      {/* Location */}
                      {programme.location && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-500 font-medium">📍</span>
                          <p className="text-gray-700">{programme.location}</p>
                        </div>
                      )}

                      {/* Capacity */}
                      {programme.capacity && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-500 font-medium">👥</span>
                          <p className="text-gray-700">
                            {programme.registeredCount || 0} / {programme.capacity} registered
                          </p>
                        </div>
                      )}

                      {/* Created By */}
                      {programme.createdBy && (
                        <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
                          <span className="text-gray-500 font-medium text-xs">By:</span>
                          <p className="text-gray-700 text-xs">
                            {programme.createdBy.firstName} {programme.createdBy.lastName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer / Actions */}
                  <div className="bg-gray-50 p-4 flex gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/all-programmes/${programme._id}`)}
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/edit-programme/${programme._id}`)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(programme._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm"
                    >
                      Delete
                    </button>

                    {/* Delete Confirmation Modal */}
                    {deleteConfirm === programme._id && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Programme?</h3>
                          <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{programme.programmeName}"? This action cannot be undone.
                          </p>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleDelete(programme._id)}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center gap-2">
                <button
                  onClick={() => fetchProgrammes(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => fetchProgrammes(page)}
                    className={`px-3 py-2 rounded-lg font-semibold ${
                      pagination.currentPage === page
                        ? 'bg-purple-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => fetchProgrammes(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

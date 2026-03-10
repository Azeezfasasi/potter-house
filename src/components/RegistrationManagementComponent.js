'use client';

import React, { useState, useEffect } from 'react';

export default function RegistrationManagementComponent() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [programmeFilter, setProgrammeFilter] = useState('');
  const [programmes, setProgrammes] = useState([]);

  // Modal states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  // Form states
  const [newStatus, setNewStatus] = useState('');
  const [replyText, setReplyText] = useState('');

  // Fetch registrations
  useEffect(() => {
    fetchRegistrations();
  }, [currentPage, statusFilter, programmeFilter]);

  // Fetch available programmes
  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const response = await fetch('/api/programmes?status=Published&limit=100');
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

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      let url = `/api/programmes/registrations?page=${currentPage}&limit=10`;

      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }

      if (programmeFilter) {
        url += `&programmeName=${encodeURIComponent(programmeFilter)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setRegistrations(data.registrations);
      } else {
        setError(data.message || 'Failed to fetch registrations');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (registrationId, status) => {
    setSelectedRegistration(registrationId);
    setNewStatus(status);
    setShowStatusModal(true);
  };

  const handleReply = async (registrationId) => {
    const registration = registrations.find((r) => r._id === registrationId);
    setSelectedRegistration(registration);
    setReplyText(registration?.notes || '');
    setShowReplyModal(true);
  };

  const handleDeleteClick = (registrationId) => {
    setSelectedRegistration(registrationId);
    setShowDeleteModal(true);
  };

  const submitStatusChange = async () => {
    try {
      const response = await fetch(`/api/programmes/registrations/${selectedRegistration}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationStatus: newStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchRegistrations();
        setShowStatusModal(false);
        setSelectedRegistration(null);
      } else {
        setError(data.message || 'Failed to update status');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const submitReply = async () => {
    try {
      const response = await fetch(`/api/programmes/registrations/${selectedRegistration._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationStatus: selectedRegistration.registrationStatus,
          notes: replyText,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchRegistrations();
        setShowReplyModal(false);
        setSelectedRegistration(null);
        setReplyText('');
      } else {
        setError(data.message || 'Failed to save reply');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const submitDelete = async () => {
    try {
      const response = await fetch(`/api/programmes/registrations/${selectedRegistration}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        fetchRegistrations();
        setShowDeleteModal(false);
        setSelectedRegistration(null);
      } else {
        setError(data.message || 'Failed to delete registration');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50';
      case 'confirmed':
        return 'bg-green-50';
      case 'completed':
        return 'bg-blue-50';
      case 'cancelled':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 p-6 sm:p-10 flex justify-center items-center mt-[80px]">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-50 p-6 sm:p-10 mt-[80px] pb-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Programme Registrations</h1>
          <p className="text-gray-600">Manage and track all programme registration applications</p>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border-l-4 border-red-600 text-red-800 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Filter by Programme</label>
            <select
              value={programmeFilter}
              onChange={(e) => {
                setProgrammeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            >
              <option value="">All Programmes</option>
              {programmes.map((prog) => (
                <option key={prog._id} value={prog.programmeName}>
                  {prog.programmeName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={() => {
                setStatusFilter('');
                setProgrammeFilter('');
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Registrations Table - Responsive */}
        {registrations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">No registrations found</p>
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden sm:block bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Programme</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration, index) => (
                    <tr key={registration._id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-purple-50 transition-colors`}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {registration.firstName} {registration.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{registration.programmeName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{registration.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(registration.registrationStatus)}`}>
                          {registration.registrationStatus.charAt(0).toUpperCase() + registration.registrationStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <div className="flex gap-2 justify-center flex-wrap">
                          <select
                            value={registration.registrationStatus}
                            onChange={(e) => handleStatusChange(registration._id, e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-purple-500"
                          >
                            <option value="">Change Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => handleReply(registration._id)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-all"
                          >
                            Reply
                          </button>
                          <button
                            onClick={() => handleDeleteClick(registration._id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden space-y-4">
              {registrations.map((registration) => (
                <div key={registration._id} className={`rounded-lg shadow-md p-4 ${getStatusBgColor(registration.registrationStatus)}`}>
                  <div className="mb-3">
                    <h3 className="font-bold text-gray-900">
                      {registration.firstName} {registration.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{registration.programmeName}</p>
                    <p className="text-sm text-gray-600">{registration.email}</p>
                  </div>
                  <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(registration.registrationStatus)}`}>
                      {registration.registrationStatus.charAt(0).toUpperCase() + registration.registrationStatus.slice(1)}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-col">
                    <select
                      value={registration.registrationStatus}
                      onChange={(e) => handleStatusChange(registration._id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-purple-500 w-full"
                    >
                      <option value="">Change Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => handleReply(registration._id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-all"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => handleDeleteClick(registration._id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700 font-semibold">Page {currentPage}</span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={registrations.length < 10}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Change Status</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to change the status to <strong>{newStatus}</strong>?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={submitStatusChange}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Reply to {selectedRegistration?.firstName} {selectedRegistration?.lastName}
            </h2>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply or notes here..."
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 mb-4"
            />
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setSelectedRegistration(null);
                  setReplyText('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={submitReply}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
              >
                Save Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Registration</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this registration? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedRegistration(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={submitDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

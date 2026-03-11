'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AvailableProgrammesPublic() {
  const router = useRouter();
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    attendanceMode: '',
  });
  const [enrollModal, setEnrollModal] = useState(null);

  // Fetch programmes
  const fetchProgrammes = async () => {
    setLoading(true);
    setError('');

    try {
      const queryParams = new URLSearchParams();

      if (filters.attendanceMode) {
        queryParams.set('attendanceMode', filters.attendanceMode);
      }

      const response = await fetch(`/api/programmes?${queryParams.toString()}`);
      const data = await response.json();

      console.log('Programmes API Response:', data);

      if (!response.ok) {
        setError(data.message || 'Failed to fetch programmes');
        setLoading(false);
        return;
      }

      const programmesData = data.programmes || [];
      console.log('Programmes fetched:', programmesData.length);
      setProgrammes(programmesData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProgrammes();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEnroll = (programme) => {
    setEnrollModal(programme);
  };

  const filteredProgrammes = programmes.filter((programme) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      programme.programmeName.toLowerCase().includes(searchLower) ||
      programme.description?.toLowerCase().includes(searchLower)
    );
  });

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
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Published':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Active':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Completed':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'Online':
        return '🌐';
      case 'Physical':
        return '🏢';
      case 'Hybrid':
        return '🔗';
      default:
        return '📱';
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'Online':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Physical':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Hybrid':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCapacityStatus = (registered, capacity) => {
    if (!capacity) return null;
    const percentage = (registered / capacity) * 100;
    if (percentage >= 100) return 'Full';
    if (percentage >= 75) return 'Nearly Full';
    if (percentage >= 50) return 'Half Full';
    return 'Available';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 mt-[60px]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 text-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Our Programmes</h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
            Join our community and transform your spiritual journey through our carefully designed programmes
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-12">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search programmes by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition duration-200 text-gray-700"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="attendanceMode" className="block text-sm font-semibold text-gray-700 mb-2">
                Attendance Mode
              </label>
              <select
                id="attendanceMode"
                name="attendanceMode"
                value={filters.attendanceMode}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition duration-200"
              >
                <option value="">All Modes</option>
                <option value="Online">🌐 Online</option>
                <option value="Physical">🏢 Physical</option>
                <option value="Hybrid">🔗 Hybrid</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <p className="text-gray-600 font-medium">
                Showing <span className="text-purple-600 font-bold">{filteredProgrammes.length}</span> programme{filteredProgrammes.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-start gap-4">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold">Error Loading Programmes</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProgrammes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Programmes Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({ attendanceMode: '' });
                fetchProgrammes();
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Programmes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredProgrammes.map((programme) => {
                const capacityStatus = getCapacityStatus(programme.registeredCount || 0, programme.capacity);
                const isFull = capacityStatus === 'Full';

                return (
                  <div
                    key={programme._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col group"
                  >
                    {/* Image Placeholder */}
                    <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 relative overflow-hidden group-hover:shadow-lg transition">
                      <div className="absolute inset-0 flex items-center justify-center text-white text-5xl opacity-30">
                        📚
                      </div>
                      {/* Badge */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${getModeColor(programme.attendanceMode)}`}>
                          {getModeIcon(programme.attendanceMode)} {programme.attendanceMode}
                        </span>
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border border-opacity-50 ${getStatusColor(programme.status)}`}>
                          {programme.status}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition">
                        {programme.programmeName}
                      </h3>

                      {/* Description */}
                      {programme.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {programme.description}
                        </p>
                      )}

                      {/* Programme Details */}
                      <div className="space-y-3 mb-6 text-sm">
                        {/* Dates */}
                        <div className="flex items-center gap-3 text-gray-700">
                          <span className="text-lg">📅</span>
                          <div>
                            <p className="font-semibold">{formatDate(programme.startDate)}</p>
                            <p className="text-xs text-gray-600">to {formatDate(programme.endDate)}</p>
                          </div>
                        </div>

                        {/* Duration */}
                        {programme.duration && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <span className="text-lg">⏱️</span>
                            <p className="font-semibold">{programme.duration}</p>
                          </div>
                        )}

                        {/* Location */}
                        {programme.location && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <span className="text-lg">📍</span>
                            <p className="font-semibold">{programme.location}</p>
                          </div>
                        )}

                        {/* Capacity */}
                        {programme.capacity && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <span className="text-lg">👥</span>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <p className="font-semibold text-xs">
                                  {programme.registeredCount || 0} / {programme.capacity} enrolled
                                </p>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${
                                  isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                }`}>
                                  {capacityStatus}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    isFull ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                                  }`}
                                  style={{ width: `${Math.min((programme.registeredCount || 0) / programme.capacity * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Enrol Button */}
                      <button
                        onClick={() => handleEnroll(programme)}
                        disabled={isFull || programme.status === 'Cancelled'}
                        className={`w-full font-semibold py-3 rounded-lg transition duration-200 text-white ${
                          isFull || programme.status === 'Cancelled'
                            ? 'bg-gray-400 cursor-not-allowed opacity-60'
                            : 'bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 shadow-lg hover:shadow-xl'
                        }`}
                      >
                        {programme.status === 'Cancelled' ? '❌ Cancelled' : isFull ? '❌ Programme Full' : '✨ Enrol Now'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Enrol Modal */}
      {enrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{enrollModal.programmeName}</h3>
              <p className="text-gray-600">Ready to join this programme?</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">
                  <span className="font-semibold">Start Date:</span> {formatDate(enrollModal.startDate)}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Mode:</span> {enrollModal.attendanceMode}
                </p>
                {enrollModal.location && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Location:</span> {enrollModal.location}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/id-finder?programmeId=${enrollModal._id}`)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                Proceed to Enrol
              </button>
              <button
                onClick={() => setEnrollModal(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

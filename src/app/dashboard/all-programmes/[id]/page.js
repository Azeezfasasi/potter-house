'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ProgrammeDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const programmeId = params?.id;

  const [programme, setProgramme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

        setProgramme(data.programme);
      } catch (err) {
        setError(`Error loading programme: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramme();
  }, [programmeId]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4">Loading programme details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !programme) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <p className="text-red-600 font-semibold mb-4">{error || 'Programme not found'}</p>
              <Link href="/dashboard/all-programmes" className="text-blue-600 hover:text-blue-800 font-semibold">
                Back to Programmes
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
        >
          ← Back
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 md:p-8 text-white">
            <h1 className="text-4xl font-bold mb-4">{programme.programmeName}</h1>
            <div className="flex flex-wrap gap-3">
              <span className={`text-sm px-3 py-1 rounded-full font-semibold ${getStatusColor(programme.status)}`}>
                {programme.status}
              </span>
              <span className={`text-sm px-3 py-1 rounded-full font-semibold ${getModeColor(programme.attendanceMode)}`}>
                {programme.attendanceMode}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Description */}
            {programme.description && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">{programme.description}</p>
              </div>
            )}

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dates */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-3">📅 Date & Duration</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-semibold">Start:</span> {formatDate(programme.startDate)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">End:</span> {formatDate(programme.endDate)}
                  </p>
                  <p className="text-blue-600 font-semibold text-base">{programme.duration}</p>
                </div>
              </div>

              {/* Location & Capacity */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-3">📍 Location & Capacity</h3>
                <div className="space-y-2 text-sm">
                  {programme.location ? (
                    <p className="text-gray-600">
                      <span className="font-semibold">Location:</span> {programme.location}
                    </p>
                  ) : (
                    <p className="text-gray-600">
                      <span className="font-semibold">Location:</span> Not specified
                    </p>
                  )}
                  {programme.capacity ? (
                    <p className="text-gray-600">
                      <span className="font-semibold">Capacity:</span> {programme.registeredCount || 0} / {programme.capacity}{' '}
                      registered
                    </p>
                  ) : (
                    <p className="text-gray-600">
                      <span className="font-semibold">Capacity:</span> Unlimited
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Syllabus */}
            {programme.syllabus && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Syllabus / Curriculum</h2>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">{programme.syllabus}</div>
              </div>
            )}

            {/* Requirements */}
            {programme.requirements && programme.requirements.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Requirements</h2>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {programme.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-yellow-600 font-bold mt-1">✓</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Created By */}
            {programme.createdBy && (
              <div className="border-t pt-6">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Created by:</span> {programme.createdBy.firstName} {programme.createdBy.lastName} (
                  {programme.createdBy.email})
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-semibold">Created on:</span> {formatDate(programme.createdAt)}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <Link
                href={`/dashboard/edit-programme/${programme._id}`}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-center"
              >
                Edit Programme
              </Link>
              <button
                onClick={() => router.push('/dashboard/all-programmes')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

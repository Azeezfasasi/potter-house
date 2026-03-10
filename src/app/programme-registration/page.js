'use client';

import React, { Suspense } from 'react';
import ProgrammeRegistrationContent from '@/components/ProgrammeRegistrationContent';

export default function ProgrammeRegistrationPage() {
  return (
    <Suspense fallback={<ProgrammeRegistrationLoading />}>
      <ProgrammeRegistrationContent />
    </Suspense>
  );
}

function ProgrammeRegistrationLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 p-6 sm:p-10 flex justify-center items-center mt-[80px]">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your information...</p>
      </div>
    </div>
  );
}

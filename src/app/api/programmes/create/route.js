import { NextResponse } from 'next/server';
import Programme from '@/app/server/models/Programme';
import { connectDB } from '@/app/server/db/connect';

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      programmeName,
      description,
      startDate,
      endDate,
      attendanceMode,
      location,
      capacity,
      facilitators,
      syllabus,
      requirements,
      resources,
      createdBy,
    } = body;

    // Validation
    if (!programmeName || !startDate || !endDate || !attendanceMode) {
      return NextResponse.json(
        {
          success: false,
          message: 'Programme name, start date, end date, and attendance mode are required',
        },
        { status: 400 }
      );
    }

    if (!createdBy) {
      return NextResponse.json(
        {
          success: false,
          message: 'Creator ID is required',
        },
        { status: 400 }
      );
    }

    // Validate attendance mode
    if (!['Online', 'Physical', 'Hybrid'].includes(attendanceMode)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Attendance mode must be Online, Physical, or Hybrid',
        },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid date format',
        },
        { status: 400 }
      );
    }

    if (end <= start) {
      return NextResponse.json(
        {
          success: false,
          message: 'End date must be after start date',
        },
        { status: 400 }
      );
    }

    // Create new programme
    const newProgramme = new Programme({
      programmeName,
      description,
      startDate: start,
      endDate: end,
      attendanceMode,
      location: attendanceMode !== 'Online' ? location : null,
      capacity,
      facilitators: facilitators || [],
      syllabus,
      requirements: requirements || [],
      resources: resources || [],
      createdBy,
      status: 'Draft',
    });

    await newProgramme.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Programme created successfully',
        programme: newProgramme,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create programme error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create programme',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

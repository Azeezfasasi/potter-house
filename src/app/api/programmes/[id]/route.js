import { NextResponse } from 'next/server';
import Programme from '@/app/server/models/Programme';
import { connectDB } from '@/app/server/db/connect';

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Programme ID is required',
        },
        { status: 400 }
      );
    }

    const programme = await Programme.findById(id).populate(
      'createdBy',
      'firstName lastName email'
    );

    if (!programme) {
      return NextResponse.json(
        {
          success: false,
          message: 'Programme not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        programme,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get programme error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch programme',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Programme ID is required',
        },
        { status: 400 }
      );
    }

    const programme = await Programme.findById(id);

    if (!programme) {
      return NextResponse.json(
        {
          success: false,
          message: 'Programme not found',
        },
        { status: 404 }
      );
    }

    // Update allowed fields
    const allowedFields = [
      'programmeName',
      'description',
      'startDate',
      'endDate',
      'attendanceMode',
      'location',
      'capacity',
      'facilitators',
      'syllabus',
      'requirements',
      'resources',
      'status',
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        programme[field] = body[field];
      }
    });

    await programme.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Programme updated successfully',
        programme,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update programme error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update programme',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Programme ID is required',
        },
        { status: 400 }
      );
    }

    const programme = await Programme.findByIdAndDelete(id);

    if (!programme) {
      return NextResponse.json(
        {
          success: false,
          message: 'Programme not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Programme deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete programme error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete programme',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import Programme from '@/app/server/models/Programme';
import { connectDB } from '@/app/server/db/connect';

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const attendanceMode = searchParams.get('attendanceMode');
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (attendanceMode) {
      query.attendanceMode = attendanceMode;
    }

    const skip = (page - 1) * limit;

    const programmes = await Programme.find(query)
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Programme.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      {
        success: true,
        programmes,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get programmes error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch programmes',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

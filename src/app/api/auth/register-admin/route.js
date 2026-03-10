import { NextResponse } from 'next/server';
import User from '@/app/server/models/User';
import { connectDB } from '@/app/server/db/connect';

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { firstName, lastName, email, password, confirmPassword } = body;

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'First name, last name, email, password and confirmation are required',
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email address',
        },
        { status: 400 }
      );
    }

    // Validate password
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password must be at least 6 characters',
        },
        { status: 400 }
      );
    }

    // Match passwords
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'Passwords do not match',
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email already registered',
        },
        { status: 409 }
      );
    }

    // Create new admin user
    const newAdmin = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'admin',
      isEmailVerified: true, // Admin accounts are pre-verified
      isActive: true,
      accountStatus: 'active',
      permissions: [
        'create_blog',
        'edit_blog',
        'delete_blog',
        'view_users',
        'manage_users',
        'manage_quotes',
        'manage_contacts',
        'view_reports',
        'admin_panel',
      ],
    });

    await newAdmin.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Admin registered successfully',
        user: newAdmin.getPublicProfile(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin registration error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Admin registration failed',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

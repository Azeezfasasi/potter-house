import mongoose from 'mongoose';

const programmeSchema = new mongoose.Schema(
  {
    programmeName: {
      type: String,
      required: [true, 'Programme name is required'],
      trim: true,
      minlength: [3, 'Programme name must be at least 3 characters'],
    },
    description: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    duration: {
      type: String,
      // This will be calculated before saving or displayed in format: "X days/weeks"
    },
    attendanceMode: {
      type: String,
      enum: {
        values: ['Online', 'Physical', 'Hybrid'],
        message: 'Attendance mode must be Online, Physical, or Hybrid',
      },
      required: [true, 'Attendance mode is required'],
    },
    location: {
      type: String,
      // Required if attendance mode is Physical or Hybrid
    },
    capacity: {
      type: Number,
      default: null,
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    facilitators: [
      {
        name: String,
        email: String,
        phone: String,
      },
    ],
    syllabus: {
      type: String,
      // Could be URL to document or text content
    },
    requirements: [String],
    // Course materials/resources
    resources: [
      {
        title: String,
        url: String,
        type: String, // PDF, Video, Document, etc.
      },
    ],
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Active', 'Completed', 'Cancelled'],
      default: 'Draft',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Virtual field for duration calculation
programmeSchema.virtual('durationDays').get(function () {
  const diffTime = Math.abs(this.endDate - this.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Ensure virtual fields are included in JSON
programmeSchema.set('toJSON', { virtuals: true });

// Validate that end date is after start date
programmeSchema.pre('save', function (next) {
  if (this.endDate <= this.startDate) {
    return next(new Error('End date must be after start date'));
  }

  // Calculate duration
  const days = this.durationDays;
  if (days === 1) {
    this.duration = '1 day';
  } else if (days < 7) {
    this.duration = `${days} days`;
  } else {
    const weeks = Math.ceil(days / 7);
    this.duration = `${weeks} weeks`;
  }

  next();
});

// Indexes for frequently queried fields
programmeSchema.index({ status: 1 });
programmeSchema.index({ startDate: 1 });
programmeSchema.index({ attendanceMode: 1 });
programmeSchema.index({ createdBy: 1 });
programmeSchema.index({ programmeName: 'text' }); // For text search

export default mongoose.models.Programme || mongoose.model('Programme', programmeSchema);

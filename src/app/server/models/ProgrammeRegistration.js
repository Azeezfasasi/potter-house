import mongoose from "mongoose";

const programmeRegistrationSchema = new mongoose.Schema(
  {
    // User Reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    believerID: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },

    // User Information (captured at registration)
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },

    // Programme Details
    programmeName: {
      type: String,
      required: [true, "Programme name is required"],
      trim: true,
    },
    programmeStartDate: {
      type: Date,
      required: [true, "Programme start date is required"],
    },
    programmeEndDate: {
      type: Date,
    },
    programmeDuration: {
      type: String,
      trim: true,
    },
    attendanceMode: {
      type: String,
      enum: ["Online", "Physical", "Hybrid"],
      required: [true, "Attendance mode is required"],
    },

    // Emergency Contact
    emergencyContactName: {
      type: String,
      required: [true, "Emergency contact name is required"],
      trim: true,
    },
    emergencyContactPhone: {
      type: String,
      required: [true, "Emergency contact phone is required"],
    },

    // Additional Information
    specialRequirements: {
      type: String,
      trim: true,
    },

    // Status
    registrationStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    agreeToTerms: {
      type: Boolean,
      required: true,
    },

    // Metadata
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    confirmedAt: Date,
    notes: String,
  },
  { timestamps: true }
);

// Index for frequently queried fields
programmeRegistrationSchema.index({ believerID: 1 });
programmeRegistrationSchema.index({ userId: 1 });
programmeRegistrationSchema.index({ programmeName: 1 });
programmeRegistrationSchema.index({ programmeStartDate: 1 });
programmeRegistrationSchema.index({ registrationStatus: 1 });

export default mongoose.models.ProgrammeRegistration ||
  mongoose.model("ProgrammeRegistration", programmeRegistrationSchema);

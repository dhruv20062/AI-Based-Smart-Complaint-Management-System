const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Water Supply', 'Electricity', 'Roads', 'Garbage', 'Sanitation', 'Public Safety', 'Other'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    // AI-generated fields
    aiPriority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: null,
    },
    aiDepartment: {
      type: String,
      default: null,
    },
    aiSummary: {
      type: String,
      default: null,
    },
    aiResponse: {
      type: String,
      default: null,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for location-based search
ComplaintSchema.index({ location: 'text', title: 'text', description: 'text' });

module.exports = mongoose.model('Complaint', ComplaintSchema);

const mongoose = require('mongoose');

const FeedbackSchema = mongoose.Schema(
  {
    feedBackType: { type: String, enum: ['enquiry', 'assistance', 'comment'], required: true },
    country: { type: String, enum: ['libya', 'algeria', 'iraq'], required: true },
    givenNames: { type: String, required: true },
    sureName: { type: String, required: true },
    locale: { type: String, enum: ['ar', 'en', 'tr'], default: 'ar' },
    email: {
      type: String,
      required: true,
      index: true
    },
    travelDocNo: { type: String },
    feedBack: { type: String },
    status: {
      type: String,
      enum: ['open', 'resolved'],
      default: 'open',
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = { Feedback, FeedbackSchema };

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Person = require('./person').PersonSchema;

const OrderSchema = mongoose.Schema(
  {
    applicationType: { type: String, enum: ['family', 'person'], required: true },
    country: { type: String, enum: ['libya', 'algeria', 'iraq'], required: true },
    travelDocument: {
      type: String,
      enum: [
        'ordinary',
        'identity',
        'diplomatic',
        'service',
        'special',
        'alien',
        'travel',
        'nansen'
      ],
      required: true
    },
    arrivalDate: { type: Date },
    locale: { type: String, enum: ['ar', 'en', 'tr'], default: 'ar' },
    people: { type: [Person], default: [] },
    familyStatement: { type: String },
    bankStatement: { type: String },
    workCertificate: { type: String },
    hotelReservations: { type: String },
    ownershipCertificate: { type: String },
    refNum: { type: String, required: true },
    paid: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['open', 'active', 'processing', 'completed', 'expired', 'rejected'],
      default: 'open',
      index: true
    }
  },
  {
    timestamps: true
  }
);

OrderSchema.plugin(uniqueValidator);

const Order = mongoose.model('Order', OrderSchema);

module.exports = { Order, OrderSchema };

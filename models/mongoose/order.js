const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Person = require('./person').PersonSchema;

const OrderSchema = mongoose.Schema(
  {
    applicationType: { type: String, enum: ['family', 'person'], required: true },
    country: { type: String, enum: ['libya', 'algeria', 'iraq'], required: true },
    travelDoc: {
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
    locale: { type: String, enum: ['ar', 'en', 'tr'] },
    people: { type: [Person], default: [] },
    familyStatement: { type: String },
    refNum: { type: String, required: true },
    status: {
      type: String,
      enum: ['open', 'active', 'canceled', 'completed', 'expired', 'paid', 'rejected'],
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

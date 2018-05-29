const mongoose = require('mongoose');

const PersonSchema = mongoose.Schema(
  {
    givenNames: { type: String, required: true },
    sureName: { type: String, required: true },
    dob: { type: Date, required: true },
    pob: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    motherName: { type: String, required: true },
    motherVisa: { type: String },
    fatherName: { type: String, required: true },
    fatherVisa: { type: String },
    passportNumber: {
      type: String,
      required: true,
      index: true
    },
    passportIssueDate: { type: Date, required: true },
    passportExpiryDate: { type: Date, required: true },
    passportPhoto: { type: String, required: true },
    email: {
      type: String,
      required: true,
      index: true
    },
    phoneNumber: { type: String, required: true },
    address: { type: String },
    familyMember: { type: String, enum: ['father', 'mother', 'son', 'daughter', 'other'] },
    familyOther: { type: String },
    familyStatement: { type: String },
    photo: { type: String, required: true },
    refNum: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

const Person = mongoose.model('Person', PersonSchema);

module.exports = {
  Person,
  PersonSchema
};

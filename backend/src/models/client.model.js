const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  Category: {
    type: String,
    enum: ["Student Visa", "Work Visa", "Tourist Visa"],
    default: "Tourist Visa",
  },
  FullName: {
    type: String,
    required: true,
  },
  FamilyName: {
    type: String,
    default: "",
  },
  GivenNames: {
    type: String,
    default: "",
  },
  Email: {
    type: String,
    required: true,
  },
  Gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: "Male",
  },
  Address: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  POB: {
    type: String,
    required: true,
  },
  CountryofCitizenship: {
    type: String,
    required: true,
  },
  PassportNumber: {
    type: String,
    required: true,
  },
  ReferenceNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  Status: {
    type: String,
    enum: ["Pending" , "Revoked" , "Refused" , "Issued"],
    default: "Pending",
  },
  Paragraph: {
    type: String,
    default: "Currently the status is pending, the application is under review.",
  },
  Password: {
    type: String,
    required: false,
    default: "",
  },
  Documents: {
    type: [String],
    default: [],
  },
  SubmissionDate: {
    type: Date,
    default: Date.now,
  },
  VisaGrantDate: {
    type: Date,
  },
  VisaExpiryDate: {
    type: Date,
  },
}, { timestamps: true });


const clientModel = mongoose.model('Client', clientSchema);

module.exports = clientModel;
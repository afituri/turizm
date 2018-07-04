const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const bcrypt = require('bcrypt');
const md5 = require('md5');
const uuid = require('uuid/v4');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    locale: {
      type: String,
      enum: ['en', 'ar', 'tr'],
      default: 'ar'
    },
    admin: { type: Boolean, default: false },
    passwordHash: { type: String, required: false },
    phone: { type: String, required: false },
    token: { type: String }
  },
  {
    timestamps: true
  }
);

UserSchema.plugin(uniqueValidator);
UserSchema.plugin(mongoosePaginate);

UserSchema.virtual('password').get(function () {
  return this.passwordHash;
});

UserSchema.virtual('password').set(function (value) {
  this._password = value;
  this.passwordHash = bcrypt.hashSync(value, 8);
});

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

// Create the token before save
UserSchema.pre('save', function (next) {
  this.token = md5(`${this.email}${uuid()}`);
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = { User, UserSchema };

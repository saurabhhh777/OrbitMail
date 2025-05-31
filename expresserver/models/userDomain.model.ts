import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema({
  prefix: { type: String, required: true },     // e.g., founder
  fullEmail: { type: String, required: true },  // e.g., founder@orbitmail.com
  passwordHash: { type: String, required: true } // hashed password for SMTP auth
});

const UserDomainSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // link to registered user
  domain: { type: String, required: true }, // e.g., saurabh.com
  isVerified: { type: Boolean, default: false },
  mxVerifiedAt: { type: Date },

  emails: {
    type: [EmailSchema],
    validate: [arrayLimit, '{PATH} exceeds the limit of 5']
  },

  createdAt: { type: Date, default: Date.now }
});

function arrayLimit(val:unknown[]) {
  return val.length <= 5;
}

const userDomainModel = mongoose.model('UserDomain', UserDomainSchema);
export default userDomainModel;



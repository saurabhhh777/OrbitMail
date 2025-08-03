import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema({
  prefix: { type: String, required: true },     // e.g., founder
  fullEmail: { type: String, required: true },  // e.g., founder@orbitmail.com
  passwordHash: { type: String, required: true } // hashed password for SMTP auth
});

const UserDomainSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // link to registered user
  domain: { type: String, required: true }, // e.g., saurabh.com
  isVerified: { type: Boolean, default: false },
  mxVerifiedAt: { type: Date },
  
  // MX Record configuration
  mxRecords: {
    mx1: { type: String, default: 'mx1.orbitmail.fun' },
    mx2: { type: String, default: 'mx2.orbitmail.fun' },
    priority1: { type: Number, default: 10 },
    priority2: { type: Number, default: 20 }
  },

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



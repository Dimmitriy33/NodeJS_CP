import mongoose from 'mongoose';
import { UserDocument } from './user.model';

export interface SessionDocument extends mongoose.Document {
  user: UserDocument['_id'];
  isValid: boolean;
  userAgent: string;
  createdAt: Date; // related to timestamps
  updatedAt: Date; // related to timestamps
}

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isValid: {
    type: Boolean,
    default: true
  },
  // to store user browser
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// tslint:disable-next-line: variable-name
const SessionModel = mongoose.model('Session', sessionSchema);
export default SessionModel;

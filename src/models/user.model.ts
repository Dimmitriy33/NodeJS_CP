import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date; // related to timestamps
  updatedAt: Date; // related to timestamps
  comparePassword(inPass: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

userSchema.pre("save", async function(next) {
  const user = this as UserDocument;

  if(!user.isModified("password")) {
    return next();
  }

  const saltWorkFactor = config.get<number>("saltWorkFactor");
  const salt = await bcrypt.genSalt(saltWorkFactor);
  const hash = bcrypt.hashSync(user.password, salt);

  user.password = hash;
  
  return next();
});

userSchema.methods.comparePassword = async function(inPass: string): Promise<boolean> {
  const user = this as UserDocument;
  return bcrypt
        .compare(inPass, user.password)
        .catch(() => false);
}

// tslint:disable-next-line: variable-name
const UserModel = mongoose.model<UserDocument>('User', userSchema);
export default UserModel;

import bcrypt from 'bcrypt';
import config from 'config';
import mongoose from 'mongoose';
import { enumToValuesArray } from '../helpers/enumToArray';
import { UserRoles } from '../types/userTypes';
import { OrderDocument } from './order.model';
import { ProductRatingDocument } from './productRating.model';

export interface UserDocument extends mongoose.Document {
  userName: string;
  email: string;
  // TODO: add email confirmation
  // emailConfirmed: boolean;
  password: string;
  role: number;
  addressDelivery: string;
  phoneNumber: string;
  createdAt: Date; // related to timestamps
  updatedAt: Date; // related to timestamps
  ratings: ProductRatingDocument['_id'];
  ordersList: OrderDocument['_id'];
  comparePassword(inPass: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      maxlength: 32,
      minlength: 6
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: Number,
      enum: enumToValuesArray(UserRoles),
      required: true
    },
    addressDelivery: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      // validate: {
      //   validator: function (v: string) {
      //     return /\d{3}-\d{3}-\d{4}/.test(v);
      //   },
      //   message: '{VALUE} is not a valid phone number!'
      // },
      required: true
    },
    ratings: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductRating'
    },
    ordersList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function (next) {
  const user = this as UserDocument;

  if (!user.isModified('password')) {
    return next();
  }

  const saltWorkFactor = config.get<number>('saltWorkFactor');
  const salt = await bcrypt.genSalt(saltWorkFactor);
  const hash = bcrypt.hashSync(user.password, salt);

  user.password = hash;
  return next();
});

userSchema.methods.comparePassword = async function (inPass: string): Promise<boolean> {
  const user = this as UserDocument;
  return bcrypt.compare(inPass, user.password).catch(() => false);
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);
export default UserModel;

import mongoose from 'mongoose';
import { ProductDocument } from './product.model';
import { UserDocument } from './user.model';
// import { v4 as uuidv4 } from 'uuid';
// uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

export interface ProductRatingDocument extends mongoose.Document {
  productId: string;
  userId: string;
  rating: number;
  // product: number; // Related to ProductRatings table
  // user: number; // Related to Order table
  product: ProductDocument['_id'];
  user: UserDocument['_id'];
}

const productRatingSchema = new mongoose.Schema(
  {
    productId: {
      type: Boolean,
      default: true
    },
    userId: {
      type: Boolean,
      default: true
    },
    rating: {
      type: String
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  },
  {
    timestamps: true
  }
);

const ProductRatingModel = mongoose.model<ProductRatingDocument>('ProductRating', productRatingSchema);
export default ProductRatingModel;

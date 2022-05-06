import mongoose from 'mongoose';
import { ProductDocument } from './product.model';
import { UserDocument } from './user.model';
// import { v4 as uuidv4 } from 'uuid';
// uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

export interface ProductRatingDocument extends mongoose.Document {
  rating: number;
  userId: UserDocument['_id'];
  productId: ProductDocument['_id'];
}

const productRatingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  rating: {
    type: Number,
    required: true
  }
});

const ProductRatingModel = mongoose.model<ProductRatingDocument>('ProductRating', productRatingSchema);
export default ProductRatingModel;

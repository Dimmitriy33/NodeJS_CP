import mongoose from 'mongoose';

export interface UserDocument extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date; // related to timestamps
    updatedAt: Date; // related to timestamps
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

userSchema.pre("save", async function(next: mongoose.HookNextFunction) {
    let user = this as UserDocument;

    if(!user.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
});

// tslint:disable-next-line: variable-name
const UserModel = mongoose.model('User', userSchema);
export default UserModel;

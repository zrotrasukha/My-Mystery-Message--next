import mongoose, {Schema, Document} from "mongoose";
import { boolean } from "zod";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

export const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: Date.now()
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    verifyCode: string;
    verifyCodeExpiry: string;
    isAcceptingMessage: Boolean;
    messages: Message[];
}

export const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address']
    },
    isVerified: {
      type: Boolean, 
      default: false,
    },
    password: {
        type: String, required: [true, 'Password is required'],
    },
    verifyCode: {
        type: String, required: [true, 'verify code is required'],
    },
    verifyCodeExpiry: {
        type: String, required: [true, 'verify code expiry is required'],
    },
    isAcceptingMessage: {
      type: Boolean, default: true, 
    },
    messages: [MessageSchema]
});

const UserModel = 
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>('User', UserSchema);

export default UserModel;

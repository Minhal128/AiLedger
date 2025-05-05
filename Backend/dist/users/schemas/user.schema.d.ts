import { Document, Schema as MongooseSchema } from 'mongoose';
export type UserDocument = User & Document;
export declare class User {
    walletAddress: string;
    username: string;
    password: string;
    email: string;
    profileImage: string;
    isEmailVerified: boolean;
    role: string;
}
export declare const UserSchema: MongooseSchema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
}>;

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  walletAddress: string;

  @Prop()
  username: string;

  @Prop({ select: false })
  password: string;

  @Prop()
  email: string;

  @Prop({ default: '' })
  profileImage: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Campaign } from './campaign.schema';

export type DonationDocument = Donation & Document;

@Schema({ timestamps: true })
export class Donation {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  txHash: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Campaign', required: true })
  campaign: Campaign;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  donor: User;
  
  @Prop()
  donorWallet: string;
}

export const DonationSchema = SchemaFactory.createForClass(Donation);
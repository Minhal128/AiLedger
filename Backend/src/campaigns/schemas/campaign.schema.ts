import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type CampaignDocument = Campaign & Document;

@Schema({ timestamps: true })
export class Campaign {
  @Prop({ required: true })
  onChainId: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  target: number;

  @Prop({ required: true })
  deadline: Date;

  @Prop({ default: 0 })
  amountCollected: number;

  @Prop({ required: true })
  image: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  owner: User;
  
  @Prop()
  ownerWallet: string;

  @Prop({ default: 'active', enum: ['active', 'completed', 'expired'] })
  status: string;

  @Prop({ default: [] })
  tags: string[];

  @Prop({ default: '' })
  category: string;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
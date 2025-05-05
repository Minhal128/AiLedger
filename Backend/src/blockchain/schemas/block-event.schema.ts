import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlockEventDocument = BlockEvent & Document;

@Schema({ timestamps: true })
export class BlockEvent {
  @Prop({ required: true })
  eventName: string;

  @Prop({ required: true })
  blockNumber: number;

  @Prop({ required: true })
  txHash: string;

  @Prop({ type: Object })
  data: Record<string, any>;

  @Prop({ default: false })
  processed: boolean;
}

export const BlockEventSchema = SchemaFactory.createForClass(BlockEvent);
import { Document } from 'mongoose';
export type BlockEventDocument = BlockEvent & Document;
export declare class BlockEvent {
    eventName: string;
    blockNumber: number;
    txHash: string;
    data: Record<string, any>;
    processed: boolean;
}
export declare const BlockEventSchema: import("mongoose").Schema<BlockEvent, import("mongoose").Model<BlockEvent, any, any, any, Document<unknown, any, BlockEvent> & BlockEvent & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BlockEvent, Document<unknown, {}, import("mongoose").FlatRecord<BlockEvent>> & import("mongoose").FlatRecord<BlockEvent> & {
    _id: import("mongoose").Types.ObjectId;
}>;

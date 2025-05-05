import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
export type CampaignDocument = Campaign & Document;
export declare class Campaign {
    onChainId: number;
    title: string;
    description: string;
    target: number;
    deadline: Date;
    amountCollected: number;
    image: string;
    owner: User;
    ownerWallet: string;
    status: string;
    tags: string[];
    category: string;
}
export declare const CampaignSchema: MongooseSchema<Campaign, import("mongoose").Model<Campaign, any, any, any, Document<unknown, any, Campaign> & Campaign & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Campaign, Document<unknown, {}, import("mongoose").FlatRecord<Campaign>> & import("mongoose").FlatRecord<Campaign> & {
    _id: import("mongoose").Types.ObjectId;
}>;

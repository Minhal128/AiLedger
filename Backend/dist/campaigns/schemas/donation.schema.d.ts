import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Campaign } from './campaign.schema';
export type DonationDocument = Donation & Document;
export declare class Donation {
    amount: number;
    txHash: string;
    campaign: Campaign;
    donor: User;
    donorWallet: string;
}
export declare const DonationSchema: MongooseSchema<Donation, import("mongoose").Model<Donation, any, any, any, Document<unknown, any, Donation> & Donation & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Donation, Document<unknown, {}, import("mongoose").FlatRecord<Donation>> & import("mongoose").FlatRecord<Donation> & {
    _id: import("mongoose").Types.ObjectId;
}>;

import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { BlockEventDocument } from './schemas/block-event.schema';
import { CampaignsService } from '../campaigns/campaigns.service';
export declare class BlockchainService implements OnModuleInit {
    private configService;
    private blockEventModel;
    private readonly campaignsService;
    private provider;
    private contract;
    private readonly logger;
    constructor(configService: ConfigService, blockEventModel: Model<BlockEventDocument>, campaignsService: CampaignsService);
    onModuleInit(): Promise<void>;
    startListening(): void;
    saveEvent(eventName: string, blockNumber: number, txHash: string, data: any): Promise<BlockEventDocument>;
    processCampaignCreation(ownerWallet: string, onChainId: number, title: string, description: string, target: string, deadline: Date, image: string): Promise<void>;
    processDonation(donorWallet: string, campaignOnChainId: number, amount: string, txHash: string): Promise<void>;
    processUnprocessedEvents(): Promise<void>;
    getLatestEvents(limit?: number): Promise<BlockEventDocument[]>;
}

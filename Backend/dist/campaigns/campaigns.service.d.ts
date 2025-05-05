import { Model } from 'mongoose';
import { CampaignDocument } from './schemas/campaign.schema';
import { DonationDocument } from './schemas/donation.schema';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { CreateDonationDto } from './dto/donation.dto';
import { UsersService } from '../users/users.service';
export declare class CampaignsService {
    private campaignModel;
    private donationModel;
    private readonly usersService;
    constructor(campaignModel: Model<CampaignDocument>, donationModel: Model<DonationDocument>, usersService: UsersService);
    createCampaign(createCampaignDto: CreateCampaignDto): Promise<CampaignDocument>;
    findAllCampaigns(): Promise<CampaignDocument[]>;
    findCampaignById(id: string): Promise<CampaignDocument>;
    findCampaignByOnChainId(onChainId: number): Promise<CampaignDocument>;
    findCampaignsByOwner(ownerWallet: string): Promise<CampaignDocument[]>;
    updateCampaign(id: string, updateCampaignDto: UpdateCampaignDto): Promise<CampaignDocument>;
    createDonation(createDonationDto: CreateDonationDto): Promise<DonationDocument>;
    getDonationsByCampaign(campaignId: string): Promise<DonationDocument[]>;
    getDonationsByDonor(donorWallet: string): Promise<DonationDocument[]>;
}

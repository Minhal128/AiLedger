import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { CreateDonationDto } from './dto/donation.dto';
export declare class CampaignsController {
    private readonly campaignsService;
    constructor(campaignsService: CampaignsService);
    createCampaign(createCampaignDto: CreateCampaignDto): Promise<import("./schemas/campaign.schema").CampaignDocument>;
    findAllCampaigns(): Promise<import("./schemas/campaign.schema").CampaignDocument[]>;
    findCampaignById(id: string): Promise<import("./schemas/campaign.schema").CampaignDocument>;
    findCampaignByOnChainId(id: number): Promise<import("./schemas/campaign.schema").CampaignDocument>;
    findCampaignsByOwner(walletAddress: string): Promise<import("./schemas/campaign.schema").CampaignDocument[]>;
    updateCampaign(id: string, updateCampaignDto: UpdateCampaignDto): Promise<import("./schemas/campaign.schema").CampaignDocument>;
    createDonation(createDonationDto: CreateDonationDto): Promise<import("./schemas/donation.schema").DonationDocument>;
    getDonationsByCampaign(campaignId: string): Promise<import("./schemas/donation.schema").DonationDocument[]>;
    getDonationsByDonor(walletAddress: string): Promise<import("./schemas/donation.schema").DonationDocument[]>;
}

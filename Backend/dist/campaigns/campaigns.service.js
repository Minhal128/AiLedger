"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const campaign_schema_1 = require("./schemas/campaign.schema");
const donation_schema_1 = require("./schemas/donation.schema");
const users_service_1 = require("../users/users.service");
let CampaignsService = class CampaignsService {
    constructor(campaignModel, donationModel, usersService) {
        this.campaignModel = campaignModel;
        this.donationModel = donationModel;
        this.usersService = usersService;
    }
    async createCampaign(createCampaignDto) {
        const user = await this.usersService.findByWalletAddress(createCampaignDto.ownerWallet);
        const newCampaign = new this.campaignModel({
            ...createCampaignDto,
            owner: user ? user._id : null
        });
        return newCampaign.save();
    }
    async findAllCampaigns() {
        return this.campaignModel.find().populate('owner', 'walletAddress username profileImage').exec();
    }
    async findCampaignById(id) {
        const campaign = await this.campaignModel
            .findById(id)
            .populate('owner', 'walletAddress username profileImage')
            .exec();
        if (!campaign) {
            throw new common_1.NotFoundException(`Campaign with ID ${id} not found`);
        }
        return campaign;
    }
    async findCampaignByOnChainId(onChainId) {
        const campaign = await this.campaignModel
            .findOne({ onChainId })
            .populate('owner', 'walletAddress username profileImage')
            .exec();
        if (!campaign) {
            throw new common_1.NotFoundException(`Campaign with on-chain ID ${onChainId} not found`);
        }
        return campaign;
    }
    async findCampaignsByOwner(ownerWallet) {
        return this.campaignModel
            .find({ ownerWallet })
            .populate('owner', 'walletAddress username profileImage')
            .exec();
    }
    async updateCampaign(id, updateCampaignDto) {
        const updatedCampaign = await this.campaignModel
            .findByIdAndUpdate(id, updateCampaignDto, { new: true })
            .populate('owner', 'walletAddress username profileImage')
            .exec();
        if (!updatedCampaign) {
            throw new common_1.NotFoundException(`Campaign with ID ${id} not found`);
        }
        return updatedCampaign;
    }
    async createDonation(createDonationDto) {
        const campaign = await this.findCampaignByOnChainId(createDonationDto.campaignOnChainId);
        const donor = await this.usersService.findByWalletAddress(createDonationDto.donorWallet);
        const newDonation = new this.donationModel({
            amount: createDonationDto.amount,
            txHash: createDonationDto.txHash,
            campaign: campaign._id,
            donor: donor ? donor._id : null,
            donorWallet: createDonationDto.donorWallet
        });
        await this.campaignModel.findByIdAndUpdate(campaign._id, { $inc: { amountCollected: createDonationDto.amount } });
        return newDonation.save();
    }
    async getDonationsByCampaign(campaignId) {
        return this.donationModel
            .find({ campaign: campaignId })
            .populate('donor', 'walletAddress username profileImage')
            .exec();
    }
    async getDonationsByDonor(donorWallet) {
        return this.donationModel
            .find({ donorWallet })
            .populate('campaign')
            .populate('donor', 'walletAddress username profileImage')
            .exec();
    }
};
exports.CampaignsService = CampaignsService;
exports.CampaignsService = CampaignsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(campaign_schema_1.Campaign.name)),
    __param(1, (0, mongoose_1.InjectModel)(donation_schema_1.Donation.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        users_service_1.UsersService])
], CampaignsService);
//# sourceMappingURL=campaigns.service.js.map
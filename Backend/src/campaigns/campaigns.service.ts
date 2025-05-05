import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CampaignDocument } from './schemas/campaign.schema';
import { Donation, DonationDocument } from './schemas/donation.schema';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { CreateDonationDto } from './dto/donation.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
    @InjectModel(Donation.name) private donationModel: Model<DonationDocument>,
    private readonly usersService: UsersService,
  ) {}

  async createCampaign(createCampaignDto: CreateCampaignDto): Promise<CampaignDocument> {
    const user = await this.usersService.findByWalletAddress(createCampaignDto.ownerWallet);
    
    const newCampaign = new this.campaignModel({
      ...createCampaignDto,
      owner: user ? user._id : null
    });
    
    return newCampaign.save();
  }

  async findAllCampaigns(): Promise<CampaignDocument[]> {
    return this.campaignModel.find().populate('owner', 'walletAddress username profileImage').exec();
  }

  async findCampaignById(id: string): Promise<CampaignDocument> {
    const campaign = await this.campaignModel
      .findById(id)
      .populate('owner', 'walletAddress username profileImage')
      .exec();
      
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
    return campaign;
  }
  
  async findCampaignByOnChainId(onChainId: number): Promise<CampaignDocument> {
    const campaign = await this.campaignModel
      .findOne({ onChainId })
      .populate('owner', 'walletAddress username profileImage')
      .exec();
      
    if (!campaign) {
      throw new NotFoundException(`Campaign with on-chain ID ${onChainId} not found`);
    }
    return campaign;
  }

  async findCampaignsByOwner(ownerWallet: string): Promise<CampaignDocument[]> {
    return this.campaignModel
      .find({ ownerWallet })
      .populate('owner', 'walletAddress username profileImage')
      .exec();
  }

  async updateCampaign(id: string, updateCampaignDto: UpdateCampaignDto): Promise<CampaignDocument> {
    const updatedCampaign = await this.campaignModel
      .findByIdAndUpdate(id, updateCampaignDto, { new: true })
      .populate('owner', 'walletAddress username profileImage')
      .exec();
      
    if (!updatedCampaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
    return updatedCampaign;
  }

  async createDonation(createDonationDto: CreateDonationDto): Promise<DonationDocument> {
    const campaign = await this.findCampaignByOnChainId(createDonationDto.campaignOnChainId);
    const donor = await this.usersService.findByWalletAddress(createDonationDto.donorWallet);
    
    const newDonation = new this.donationModel({
      amount: createDonationDto.amount,
      txHash: createDonationDto.txHash,
      campaign: campaign._id,
      donor: donor ? donor._id : null,
      donorWallet: createDonationDto.donorWallet
    });
    
    // Update campaign amount collected
    await this.campaignModel.findByIdAndUpdate(
      campaign._id,
      { $inc: { amountCollected: createDonationDto.amount } }
    );
    
    return newDonation.save();
  }

  async getDonationsByCampaign(campaignId: string): Promise<DonationDocument[]> {
    return this.donationModel
      .find({ campaign: campaignId })
      .populate('donor', 'walletAddress username profileImage')
      .exec();
  }

  async getDonationsByDonor(donorWallet: string): Promise<DonationDocument[]> {
    return this.donationModel
      .find({ donorWallet })
      .populate('campaign')
      .populate('donor', 'walletAddress username profileImage')
      .exec();
  }
}
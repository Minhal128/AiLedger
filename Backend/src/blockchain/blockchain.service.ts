import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import { BlockEvent, BlockEventDocument } from './schemas/block-event.schema';
import { CampaignsService } from '../campaigns/campaigns.service';
import { ethers } from 'ethers';

// Import ABI - you'll need to create this file with your contract ABI
import * as contractAbi from './contract-abi.json';

@Injectable()
export class BlockchainService implements OnModuleInit {
  private provider: ethers.providers.JsonRpcProvider;
  private contract: ethers.Contract;
  private readonly logger = new Logger(BlockchainService.name);

  constructor(
    private configService: ConfigService,
    @InjectModel(BlockEvent.name) private blockEventModel: Model<BlockEventDocument>,
    private readonly campaignsService: CampaignsService,
  ) {
    // Initialize ethers provider
    this.provider = new ethers.providers.JsonRpcProvider(
      this.configService.get<string>('RPC_URL'),
    );
    
    // Initialize contract
    const contractAddress = this.configService.get<string>('CONTRACT_ADDRESS');
    this.contract = new ethers.Contract(contractAddress, contractAbi, this.provider);
  }
  
  async onModuleInit() {
    this.startListening();
  }

  startListening() {
    this.logger.log('Starting to listen for blockchain events...');
    
    // Listen for CampaignCreated events
    this.contract.on('CampaignCreated', async (owner, campaignId, title, description, target, deadline, image, event) => {
      this.logger.log(`New campaign created: ID ${campaignId}`);
      
      try {
        // Save event to database
        await this.saveEvent('CampaignCreated', event.blockNumber, event.transactionHash, {
          owner,
          campaignId: campaignId.toNumber(),
          title,
          description,
          target: ethers.utils.formatEther(target),
          deadline: new Date(deadline.toNumber() * 1000),
          image,
        });
        
        // Process the campaign creation
        await this.processCampaignCreation(
          owner, 
          campaignId.toNumber(),
          title,
          description,
          ethers.utils.formatEther(target),
          new Date(deadline.toNumber() * 1000),
          image
        );
      } catch (error) {
        this.logger.error(`Error processing campaign creation: ${error.message}`);
      }
    });
    
    // Listen for DonationMade events
    this.contract.on('DonationMade', async (donor, campaignId, amount, event) => {
      this.logger.log(`New donation made to campaign ${campaignId}`);
      
      try {
        // Save event to database
        await this.saveEvent('DonationMade', event.blockNumber, event.transactionHash, {
          donor,
          campaignId: campaignId.toNumber(),
          amount: ethers.utils.formatEther(amount),
        });
        
        // Process the donation
        await this.processDonation(
          donor, 
          campaignId.toNumber(),
          ethers.utils.formatEther(amount),
          event.transactionHash
        );
      } catch (error) {
        this.logger.error(`Error processing donation: ${error.message}`);
      }
    });
  }

  async saveEvent(eventName: string, blockNumber: number, txHash: string, data: any): Promise<BlockEventDocument> {
    const event = new this.blockEventModel({
      eventName,
      blockNumber,
      txHash,
      data,
      processed: false,
    });
    
    return event.save();
  }

  async processCampaignCreation(
    ownerWallet: string,
    onChainId: number,
    title: string,
    description: string,
    target: string,
    deadline: Date,
    image: string
  ) {
    try {
      // Check if campaign already exists in our database
      try {
        await this.campaignsService.findCampaignByOnChainId(onChainId);
        // If we get here, campaign exists
        return;
      } catch (err) {
        // Campaign doesn't exist, continue with creation
      }

      // Create campaign in our database
      await this.campaignsService.createCampaign({
        onChainId,
        title,
        description,
        target: parseFloat(target),
        deadline,
        image,
        ownerWallet,
      });
      
      // Mark event as processed
      await this.blockEventModel.findOneAndUpdate(
        { eventName: 'CampaignCreated', 'data.campaignId': onChainId },
        { processed: true }
      );
      
      this.logger.log(`Campaign ${onChainId} processed successfully`);
    } catch (error) {
      this.logger.error(`Failed to process campaign ${onChainId}: ${error.message}`);
    }
  }

  async processDonation(donorWallet: string, campaignOnChainId: number, amount: string, txHash: string) {
    try {
      // Create donation in our database
      await this.campaignsService.createDonation({
        campaignOnChainId,
        donorWallet,
        amount: parseFloat(amount),
        txHash,
      });
      
      // Mark event as processed
      await this.blockEventModel.findOneAndUpdate(
        { txHash },
        { processed: true }
      );
      
      this.logger.log(`Donation processed: ${amount} ETH to campaign ${campaignOnChainId}`);
    } catch (error) {
      this.logger.error(`Failed to process donation: ${error.message}`);
    }
  }
  
  @Cron('0 */10 * * * *') // Run every 10 minutes
  async processUnprocessedEvents() {
    const unprocessedEvents = await this.blockEventModel
      .find({ processed: false })
      .sort({ blockNumber: 1 })
      .limit(50)
      .exec();
      
    this.logger.log(`Found ${unprocessedEvents.length} unprocessed events to process`);
    
    for (const event of unprocessedEvents) {
      try {
        if (event.eventName === 'CampaignCreated') {
          await this.processCampaignCreation(
            event.data.owner,
            event.data.campaignId,
            event.data.title,
            event.data.description,
            event.data.target,
            event.data.deadline,
            event.data.image
          );
        } else if (event.eventName === 'DonationMade') {
          await this.processDonation(
            event.data.donor,
            event.data.campaignId,
            event.data.amount,
            event.txHash
          );
        }
      } catch (error) {
        this.logger.error(`Error processing event ${event._id}: ${error.message}`);
      }
    }
  }

  async getLatestEvents(limit: number = 10): Promise<BlockEventDocument[]> {
    return this.blockEventModel
      .find()
      .sort({ blockNumber: -1 })
      .limit(limit)
      .exec();
  }
}
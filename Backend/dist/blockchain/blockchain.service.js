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
var BlockchainService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schedule_1 = require("@nestjs/schedule");
const block_event_schema_1 = require("./schemas/block-event.schema");
const campaigns_service_1 = require("../campaigns/campaigns.service");
const ethers_1 = require("ethers");
const contractAbi = require("./contract-abi.json");
let BlockchainService = BlockchainService_1 = class BlockchainService {
    constructor(configService, blockEventModel, campaignsService) {
        this.configService = configService;
        this.blockEventModel = blockEventModel;
        this.campaignsService = campaignsService;
        this.logger = new common_1.Logger(BlockchainService_1.name);
        this.provider = new ethers_1.ethers.providers.JsonRpcProvider(this.configService.get('RPC_URL'));
        const contractAddress = this.configService.get('CONTRACT_ADDRESS');
        this.contract = new ethers_1.ethers.Contract(contractAddress, contractAbi, this.provider);
    }
    async onModuleInit() {
        this.startListening();
    }
    startListening() {
        this.logger.log('Starting to listen for blockchain events...');
        this.contract.on('CampaignCreated', async (owner, campaignId, title, description, target, deadline, image, event) => {
            this.logger.log(`New campaign created: ID ${campaignId}`);
            try {
                await this.saveEvent('CampaignCreated', event.blockNumber, event.transactionHash, {
                    owner,
                    campaignId: campaignId.toNumber(),
                    title,
                    description,
                    target: ethers_1.ethers.utils.formatEther(target),
                    deadline: new Date(deadline.toNumber() * 1000),
                    image,
                });
                await this.processCampaignCreation(owner, campaignId.toNumber(), title, description, ethers_1.ethers.utils.formatEther(target), new Date(deadline.toNumber() * 1000), image);
            }
            catch (error) {
                this.logger.error(`Error processing campaign creation: ${error.message}`);
            }
        });
        this.contract.on('DonationMade', async (donor, campaignId, amount, event) => {
            this.logger.log(`New donation made to campaign ${campaignId}`);
            try {
                await this.saveEvent('DonationMade', event.blockNumber, event.transactionHash, {
                    donor,
                    campaignId: campaignId.toNumber(),
                    amount: ethers_1.ethers.utils.formatEther(amount),
                });
                await this.processDonation(donor, campaignId.toNumber(), ethers_1.ethers.utils.formatEther(amount), event.transactionHash);
            }
            catch (error) {
                this.logger.error(`Error processing donation: ${error.message}`);
            }
        });
    }
    async saveEvent(eventName, blockNumber, txHash, data) {
        const event = new this.blockEventModel({
            eventName,
            blockNumber,
            txHash,
            data,
            processed: false,
        });
        return event.save();
    }
    async processCampaignCreation(ownerWallet, onChainId, title, description, target, deadline, image) {
        try {
            try {
                await this.campaignsService.findCampaignByOnChainId(onChainId);
                return;
            }
            catch (err) {
            }
            await this.campaignsService.createCampaign({
                onChainId,
                title,
                description,
                target: parseFloat(target),
                deadline,
                image,
                ownerWallet,
            });
            await this.blockEventModel.findOneAndUpdate({ eventName: 'CampaignCreated', 'data.campaignId': onChainId }, { processed: true });
            this.logger.log(`Campaign ${onChainId} processed successfully`);
        }
        catch (error) {
            this.logger.error(`Failed to process campaign ${onChainId}: ${error.message}`);
        }
    }
    async processDonation(donorWallet, campaignOnChainId, amount, txHash) {
        try {
            await this.campaignsService.createDonation({
                campaignOnChainId,
                donorWallet,
                amount: parseFloat(amount),
                txHash,
            });
            await this.blockEventModel.findOneAndUpdate({ txHash }, { processed: true });
            this.logger.log(`Donation processed: ${amount} ETH to campaign ${campaignOnChainId}`);
        }
        catch (error) {
            this.logger.error(`Failed to process donation: ${error.message}`);
        }
    }
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
                    await this.processCampaignCreation(event.data.owner, event.data.campaignId, event.data.title, event.data.description, event.data.target, event.data.deadline, event.data.image);
                }
                else if (event.eventName === 'DonationMade') {
                    await this.processDonation(event.data.donor, event.data.campaignId, event.data.amount, event.txHash);
                }
            }
            catch (error) {
                this.logger.error(`Error processing event ${event._id}: ${error.message}`);
            }
        }
    }
    async getLatestEvents(limit = 10) {
        return this.blockEventModel
            .find()
            .sort({ blockNumber: -1 })
            .limit(limit)
            .exec();
    }
};
exports.BlockchainService = BlockchainService;
__decorate([
    (0, schedule_1.Cron)('0 */10 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlockchainService.prototype, "processUnprocessedEvents", null);
exports.BlockchainService = BlockchainService = BlockchainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(block_event_schema_1.BlockEvent.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model,
        campaigns_service_1.CampaignsService])
], BlockchainService);
//# sourceMappingURL=blockchain.service.js.map
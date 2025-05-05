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
exports.CampaignsController = void 0;
const common_1 = require("@nestjs/common");
const campaigns_service_1 = require("./campaigns.service");
const campaign_dto_1 = require("./dto/campaign.dto");
const donation_dto_1 = require("./dto/donation.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let CampaignsController = class CampaignsController {
    constructor(campaignsService) {
        this.campaignsService = campaignsService;
    }
    createCampaign(createCampaignDto) {
        return this.campaignsService.createCampaign(createCampaignDto);
    }
    findAllCampaigns() {
        return this.campaignsService.findAllCampaigns();
    }
    findCampaignById(id) {
        return this.campaignsService.findCampaignById(id);
    }
    findCampaignByOnChainId(id) {
        return this.campaignsService.findCampaignByOnChainId(id);
    }
    findCampaignsByOwner(walletAddress) {
        return this.campaignsService.findCampaignsByOwner(walletAddress);
    }
    updateCampaign(id, updateCampaignDto) {
        return this.campaignsService.updateCampaign(id, updateCampaignDto);
    }
    createDonation(createDonationDto) {
        return this.campaignsService.createDonation(createDonationDto);
    }
    getDonationsByCampaign(campaignId) {
        return this.campaignsService.getDonationsByCampaign(campaignId);
    }
    getDonationsByDonor(walletAddress) {
        return this.campaignsService.getDonationsByDonor(walletAddress);
    }
};
exports.CampaignsController = CampaignsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [campaign_dto_1.CreateCampaignDto]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "createCampaign", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "findAllCampaigns", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "findCampaignById", null);
__decorate([
    (0, common_1.Get)('onchain/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "findCampaignByOnChainId", null);
__decorate([
    (0, common_1.Get)('owner/:walletAddress'),
    __param(0, (0, common_1.Param)('walletAddress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "findCampaignsByOwner", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, campaign_dto_1.UpdateCampaignDto]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "updateCampaign", null);
__decorate([
    (0, common_1.Post)('donations'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [donation_dto_1.CreateDonationDto]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "createDonation", null);
__decorate([
    (0, common_1.Get)(':id/donations'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "getDonationsByCampaign", null);
__decorate([
    (0, common_1.Get)('donations/donor/:walletAddress'),
    __param(0, (0, common_1.Param)('walletAddress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "getDonationsByDonor", null);
exports.CampaignsController = CampaignsController = __decorate([
    (0, common_1.Controller)('campaigns'),
    __metadata("design:paramtypes", [campaigns_service_1.CampaignsService])
], CampaignsController);
//# sourceMappingURL=campaigns.controller.js.map
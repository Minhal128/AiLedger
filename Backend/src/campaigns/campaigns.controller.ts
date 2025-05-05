import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { CreateDonationDto } from './dto/donation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  createCampaign(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignsService.createCampaign(createCampaignDto);
  }

  @Get()
  findAllCampaigns() {
    return this.campaignsService.findAllCampaigns();
  }

  @Get(':id')
  findCampaignById(@Param('id') id: string) {
    return this.campaignsService.findCampaignById(id);
  }
  
  @Get('onchain/:id')
  findCampaignByOnChainId(@Param('id') id: number) {
    return this.campaignsService.findCampaignByOnChainId(id);
  }

  @Get('owner/:walletAddress')
  findCampaignsByOwner(@Param('walletAddress') walletAddress: string) {
    return this.campaignsService.findCampaignsByOwner(walletAddress);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateCampaign(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignsService.updateCampaign(id, updateCampaignDto);
  }

  @Post('donations')
  createDonation(@Body() createDonationDto: CreateDonationDto) {
    return this.campaignsService.createDonation(createDonationDto);
  }

  @Get(':id/donations')
  getDonationsByCampaign(@Param('id') campaignId: string) {
    return this.campaignsService.getDonationsByCampaign(campaignId);
  }

  @Get('donations/donor/:walletAddress')
  getDonationsByDonor(@Param('walletAddress') walletAddress: string) {
    return this.campaignsService.getDonationsByDonor(walletAddress);
  }
}
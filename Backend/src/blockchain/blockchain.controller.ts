import { Controller, Get, Param, Post } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('events')
  getLatestEvents() {
    return this.blockchainService.getLatestEvents();
  }

  @Post('events/process')
  processUnprocessedEvents() {
    return this.blockchainService.processUnprocessedEvents();
  }
}
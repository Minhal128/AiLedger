import { BlockchainService } from './blockchain.service';
export declare class BlockchainController {
    private readonly blockchainService;
    constructor(blockchainService: BlockchainService);
    getLatestEvents(): Promise<import("./schemas/block-event.schema").BlockEventDocument[]>;
    processUnprocessedEvents(): Promise<void>;
}

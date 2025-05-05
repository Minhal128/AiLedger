export declare class CreateCampaignDto {
    onChainId: number;
    title: string;
    description: string;
    target: number;
    deadline: Date;
    image: string;
    ownerWallet: string;
    category?: string;
    tags?: string[];
}
export declare class UpdateCampaignDto {
    title?: string;
    description?: string;
    image?: string;
    amountCollected?: number;
    status?: string;
    category?: string;
    tags?: string[];
}

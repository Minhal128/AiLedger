import { IsEthereumAddress, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateDonationDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  txHash: string;

  @IsNumber()
  @IsNotEmpty()
  campaignOnChainId: number;

  @IsEthereumAddress()
  @IsNotEmpty()
  donorWallet: string;
}
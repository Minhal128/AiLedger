import { IsDate, IsEthereumAddress, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCampaignDto {
  @IsNumber()
  @IsNotEmpty()
  onChainId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  target: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  deadline: Date;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsEthereumAddress()
  @IsNotEmpty()
  ownerWallet: string;
  
  @IsString()
  @IsOptional()
  category?: string;
  
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class UpdateCampaignDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;
  
  @IsNumber()
  @IsOptional()
  amountCollected?: number;
  
  @IsString()
  @IsOptional()
  status?: string;
  
  @IsString()
  @IsOptional()
  category?: string;
  
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
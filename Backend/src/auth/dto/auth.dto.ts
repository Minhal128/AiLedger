import { IsEthereumAddress, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  walletAddress: string;

  @IsString()
  @IsNotEmpty()
  signature: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}

export class SignMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
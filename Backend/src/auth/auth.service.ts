import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/auth.dto';

import * as ethers from 'ethers';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateAddress(address: string): Promise<any> {
    const user = await this.usersService.findByWalletAddress(address);
    if (!user) {
      return null;
    }
    return user;
  }

  async login(loginDto: LoginDto) {
    const { walletAddress, signature, message } = loginDto;
    
    // Verify the signature
    const recoveredAddress = this.verifySignature(message, signature);
    
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new UnauthorizedException('Invalid signature');
    }

    // Find or create user
    let user = await this.usersService.findByWalletAddress(walletAddress);
    if (!user) {
      user = await this.usersService.create({ walletAddress });
    }

    // Generate JWT token
    const payload = { sub: user._id, walletAddress: user.walletAddress };
    
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  verifySignature(message: string, signature: string): string {
    try {
      const messageHash = ethers.utils.hashMessage(message);
      const recoveredAddress = ethers.utils.recoverAddress(messageHash, signature);
      return recoveredAddress;
    } catch (error) {
      throw new UnauthorizedException('Invalid signature');
    }
  }

  generateNonce(): string {
    return Math.floor(Math.random() * 1000000).toString();
  }
}
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateAddress(address: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        user: import("../users/schemas/user.schema").UserDocument;
        accessToken: string;
    }>;
    verifySignature(message: string, signature: string): string;
    generateNonce(): string;
}

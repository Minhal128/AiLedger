import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        user: import("../users/schemas/user.schema").UserDocument;
        accessToken: string;
    }>;
    generateNonce(): {
        nonce: string;
        message: string;
    };
}

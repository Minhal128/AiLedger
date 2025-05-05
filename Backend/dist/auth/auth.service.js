"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const ethers = require("ethers");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateAddress(address) {
        const user = await this.usersService.findByWalletAddress(address);
        if (!user) {
            return null;
        }
        return user;
    }
    async login(loginDto) {
        const { walletAddress, signature, message } = loginDto;
        const recoveredAddress = this.verifySignature(message, signature);
        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            throw new common_1.UnauthorizedException('Invalid signature');
        }
        let user = await this.usersService.findByWalletAddress(walletAddress);
        if (!user) {
            user = await this.usersService.create({ walletAddress });
        }
        const payload = { sub: user._id, walletAddress: user.walletAddress };
        return {
            user,
            accessToken: this.jwtService.sign(payload),
        };
    }
    verifySignature(message, signature) {
        try {
            const messageHash = ethers.utils.hashMessage(message);
            const recoveredAddress = ethers.utils.recoverAddress(messageHash, signature);
            return recoveredAddress;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid signature');
        }
    }
    generateNonce() {
        return Math.floor(Math.random() * 1000000).toString();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
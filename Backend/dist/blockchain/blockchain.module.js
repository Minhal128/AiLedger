"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const blockchain_service_1 = require("./blockchain.service");
const blockchain_controller_1 = require("./blockchain.controller");
const block_event_schema_1 = require("./schemas/block-event.schema");
const campaigns_module_1 = require("../campaigns/campaigns.module");
const users_module_1 = require("../users/users.module");
let BlockchainModule = class BlockchainModule {
};
exports.BlockchainModule = BlockchainModule;
exports.BlockchainModule = BlockchainModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: block_event_schema_1.BlockEvent.name, schema: block_event_schema_1.BlockEventSchema }
            ]),
            campaigns_module_1.CampaignsModule,
            users_module_1.UsersModule
        ],
        providers: [blockchain_service_1.BlockchainService],
        controllers: [blockchain_controller_1.BlockchainController],
        exports: [blockchain_service_1.BlockchainService],
    })
], BlockchainModule);
//# sourceMappingURL=blockchain.module.js.map